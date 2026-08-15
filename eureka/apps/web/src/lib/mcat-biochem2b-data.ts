/**
 * MCAT Biochemistry II chapters — oxidative phosphorylation, lipid metabolism,
 * nitrogen metabolism, and metabolic integration (chapters II.5–II.8).
 * Chapter plan in docs/mcat/BIOCHEM_CHAPTERS.md.
 * AI-generated. Requires SME review.
 * Depth pass benchmarked against a standard biochemistry textbook (checklist-mediated;
 * all prose original). Tabulated constants are standard reference values.
 */

import type { TopicLesson } from './mcat-course-data';

export const MCAT_BIOCHEM2B_LESSONS: Record<string, TopicLesson> = {
  // ── Biochemistry II.5: Oxidative phosphorylation ────────────────────────
  bb2_oxphos: {
    topicId: 'bb2_oxphos',
    title: 'Oxidative Phosphorylation',
    domainWeight: '25%',
    overview:
      'Every NADH and FADH₂ banked by glycolysis, β-oxidation, and the citric acid cycle is cashed out here: electrons fall from carrier to carrier down to O₂, the released energy pumps protons out of the mitochondrial matrix, and the resulting proton-motive force spins ATP synthase. The MCAT tests the currency conversion (P/O ratios of 2.5 and 1.5), the geography (which complexes pump, which do not, what each inhibitor kills), the two shuttles that decide whether a glucose is worth 30 or 32 ATP, and the logic of uncoupling — so this chapter does the proton bookkeeping explicitly and computes the proton-motive force from its two components.',
    sections: [
      {
        id: 'bb2_ox_chemiosmosis',
        title: 'The Chemiosmotic Bargain',
        content: `## Two Machines, One Membrane

Oxidative phosphorylation is really two separable machines sharing the inner mitochondrial membrane. The first — the **respiratory chain** — lets electrons fall from NADH and FADH₂ to O₂ and uses the descent to eject protons from the matrix. The second — **ATP synthase** — lets those protons flow back in and captures the flow as ATP. The intermediate between them is not a molecule at all but a transmembrane **electrochemical gradient**, the **proton-motive force**. That is Peter Mitchell's chemiosmotic theory (1961), and every experimental oddity of the system falls out of it: no phosphorylated intermediate was ever found because none exists; an intact, proton-tight membrane is mandatory because a leak dissipates the currency; and anything that carries protons across on its own (an uncoupler) lets respiration race while ATP synthesis dies.

## Sizing the Drop

How much energy is on the table? Use standard reduction potentials: E′° for NAD⁺/NADH is −0.320 V, for ½O₂/H₂O it is +0.816 V, so electrons falling from NADH to oxygen descend ΔE′° = 1.14 V. Convert with ΔG′° = −nFΔE′°: for n = 2 and F = 96.5 kJ/(V·mol), ΔG′° = −2 × 96.5 × 1.14 ≈ **−220 kJ per mole of NADH** (standard values). Electrons entering from succinate/FADH₂ start higher (E′° ≈ +0.031 V for fumarate/succinate) and release about −150 kJ/mol. Compare the retail price of ATP (~30.5 kJ/mol standard, more like 50 kJ/mol at cellular concentrations) and the accounting question of the whole chapter appears: the chain must break one 220 kJ drop into small, capturable installments. The installments are protons.

## The Cast of Carriers

The chain's electron carriers come in a small set of types you should recognize on sight: **NAD⁺/NADH** (a 2-electron hydride carrier, freely diffusible), **flavins** FMN and FAD (1 or 2 electrons, always protein-bound), **ubiquinone (Q)** (a lipid-soluble 2-electron, 2-proton carrier that diffuses within the membrane; its half-reduced radical, semiquinone, lets it broker between 2-electron and 1-electron partners), **iron-sulfur centers** (strictly 1 electron, Fe²⁺⇌Fe³⁺), **cytochromes** a, b, and c (heme proteins, 1 electron each), and **copper centers** (1 electron, Cu⁺⇌Cu²⁺). The order of the chain is the order of increasing reduction potential — each carrier passes electrons to a stronger acceptor — and that ordering was mapped experimentally with inhibitors, long before structures existed.`,
        examTip:
          'Keep the two halves separable in your head: electron transport can run without ATP synthesis (add an uncoupler), and the ATP synthase can run backward as an ATPase (collapse the gradient). Questions that fuse them into one inseparable machine are testing exactly this distinction.',
      },
      {
        id: 'bb2_ox_complexes',
        title: 'Four Complexes, Two Couriers, Ten Protons',
        content: `## The Map

Electrons enter the membrane's four numbered complexes by two doors and leave by one. From NADH: Complex I → Q → Complex III → cytochrome c → Complex IV → O₂. From succinate and other FAD-linked donors: Complex II (or its cousins) → Q, then the same downstream path. The two mobile couriers — Q inside the bilayer, cytochrome c on the intermembrane-space face — stitch the complexes together.

| Complex | Name | Electrons from → to | H⁺ pumped per 2 e⁻ | Blocked by |
|---------|------|---------------------|---------------------|------------|
| I | NADH:ubiquinone oxidoreductase | NADH → Q (via FMN, Fe-S) | 4 | Rotenone, amytal |
| II | Succinate dehydrogenase | Succinate → Q (via FAD, Fe-S) | 0 | Malonate (competitive) |
| III | Cytochrome bc₁ | QH₂ → cytochrome c | 4 | Antimycin A |
| IV | Cytochrome oxidase | Cytochrome c → O₂ (via Cu, hemes a, a₃) | 2 | CN⁻, CO, azide |

**Complex I** couples the NADH → Q transfer to moving four protons from matrix (N side) to intermembrane space (P side); its reaction is vectorial — written with location subscripts, NADH + 5H⁺_N + Q → NAD⁺ + QH₂ + 4H⁺_P. **Complex II is the citric acid cycle's succinate dehydrogenase moonlighting in the membrane, and it pumps nothing** — it merely injects electrons into the Q pool, which is why FADH₂ electrons earn less ATP. Two other flavoprotein doors feed Q at the same no-pump level: the ETF pathway from fatty acid oxidation and the glycerol 3-phosphate dehydrogenase of the shuttle discussed below.

**Complex III** runs the **Q cycle**, an elegant fix for a mismatched handoff: QH₂ carries two electrons but cytochrome c accepts one. Each QH₂ oxidized sends one electron toward cytochrome c and recycles the other back into the Q pool via hemes b; the net effect per pair of electrons is four protons appearing on the P side. **Complex IV** collects four one-electron deliveries from cytochrome c, holds the partially reduced oxygen tightly on a heme a₃–Cu center until all four have arrived (releasing a half-done O₂ would spawn reactive oxygen species), splits O₂ into 2 H₂O, and pumps two protons per electron pair.

Total per NADH: 4 + 4 + 2 = **10 protons**; per FADH₂/succinate: **6**. In the membrane, the complexes further assemble into **supercomplexes** ("respirasomes") that channel carriers between partners efficiently.`,
        quiz: [
          {
            question:
              'Which respiratory chain component transfers electrons to ubiquinone but does NOT pump protons?',
            options: [
              'Complex I',
              'Complex II (succinate dehydrogenase)',
              'Complex III',
              'Complex IV',
            ],
            correctIndex: 1,
            explanation:
              'Complex II is the citric acid cycle enzyme succinate dehydrogenase embedded in the inner membrane. It passes electrons from succinate through FAD and Fe-S centers into the ubiquinone pool but translocates no protons — the reason electrons entering at the Q level (from FADH₂, ETF, or the glycerol 3-phosphate shuttle) yield a P/O ratio of only 1.5 instead of 2.5. Complexes I, III, and IV all pump (4, 4, and 2 H⁺ per electron pair, respectively).',
          },
        ],
      },
      {
        id: 'bb2_ox_pmf',
        title: 'The Proton-Motive Force, Computed',
        content: `## Two Components, One Force

Pumping protons out of the matrix stores energy in two distinguishable forms at once: a **chemical gradient** (the matrix becomes about 0.75 pH units more alkaline than the intermembrane space) and an **electrical gradient** (the matrix becomes negative; measured Δψ ≈ 0.15 to 0.20 V). For an ion crossing a membrane, ΔG = RT·ln(C₂/C₁) + ZFΔψ; for protons, the log-concentration term converts to pH and the expression becomes:

**ΔG = 2.3RT·ΔpH + FΔψ**

Now compute it with the measured values (ΔpH = 0.75, Δψ = 0.15 V, T = 310 K). The chemical term, taking T = 310 K and R = 8.315 J/(mol·K): 2.3 × R × T × 0.75 ≈ 4.4 kJ/mol. The electrical term: 96.5 kJ/(V·mol) × 0.15 V ≈ 14.5 kJ/mol. Sum: **≈19 kJ per mole of protons** — and notice that roughly three-quarters of the force is electrical. In mitochondria, Δψ is the dominant partner; the pH difference is modest.

![Bar chart of the proton-motive force computed from ΔG = 2.3RT·ΔpH + FΔψ with ΔpH = 0.75, Δψ = 0.15 V, T = 310 K: the chemical term contributes ≈4.4 kJ/mol, the electrical term ≈14.5 kJ/mol, total ≈19 kJ/mol per proton. Computed values — proportions to scale.](/courses/mcat/biochem/bc2-proton-motive.svg)

## Closing the Books

Ten protons pumped per NADH at ~19 kJ/mol each banks roughly 190 of the ~220 kJ available — the chain is a remarkably tight transducer, and under real cellular concentrations (where [NADH]/[NAD⁺] runs high) the recovered fraction is higher still. The gradient is not reserved for ATP synthesis alone: it also powers the import of Pi and ADP (next section), the import of Ca²⁺, and — in tissues built for it — deliberate heat production.

One caution for test day: the proton-motive force is a property of an **intact, closed membrane**. Any structural break, detergent, or protonophore erases both terms simultaneously, no matter how furiously the complexes pump — the biochemical equivalent of bailing a boat with a hole in it.`,
        quiz: [
          {
            question:
              'In actively respiring mitochondria (ΔpH ≈ 0.75, Δψ ≈ 0.15 V), which component contributes more free energy to the proton-motive force?',
            options: [
              'The pH difference, because protons are a chemical species',
              'The membrane potential Δψ, which contributes roughly three times as much as the pH term',
              'Both contribute exactly equally by definition',
              'Neither — the energy resides in a phosphorylated membrane intermediate',
            ],
            correctIndex: 1,
            explanation:
              'Evaluating ΔG = 2.3RT·ΔpH + FΔψ at 310 K gives ≈4.4 kJ/mol from the 0.75-unit pH difference and ≈14.5 kJ/mol from a 0.15 V membrane potential — the electrical term dominates, ~19 kJ/mol in total. There is no phosphorylated intermediate anywhere in chemiosmotic coupling; that discarded hypothesis is a classic wrong answer.',
          },
        ],
      },
      {
        id: 'bb2_ox_synthase',
        title: 'ATP Synthase: A Rotary Machine',
        content: `## The Architecture

ATP synthase (Complex V) is two motors on one shaft. **F₁**, protruding into the matrix, is the chemistry end: three αβ pairs arranged like orange segments, with catalysis on the three β subunits. **Fo** ("o" for oligomycin-sensitive), embedded in the membrane, is the proton end: a ring of **c subunits** (8 to 17 depending on species) beside a stationary a subunit, plus a b₂δ stator arm that clamps the α₃β₃ head still. A central γε stalk connects the c ring to the middle of F₁.

## The Binding-Change Mechanism

The counterintuitive discovery (Boyer) is that **the condensation of ADP + Pi on the enzyme is roughly isoenergetic** — tightly bound ATP forms readily without any energy input. What costs energy is **letting go**. Each β subunit cycles through three conformations: **loose** (binds ADP + Pi), **tight** (makes and grips ATP), and **open** (releases it). The proton current does not make ATP; it turns the γ shaft, and each 120° step of the asymmetric γ forces all three β subunits one conformation forward, prying the tight site open. Protons flow through a channel at the a–c interface: each proton parks on a c-subunit aspartate, rides the carousel nearly a full revolution through the lipid, and steps off into the matrix. The rotation is not a cartoon — single-molecule experiments with a fluorescent filament attached to γ showed the shaft turning in discrete 120° steps.

## The Bookkeeping That Yields 2.5 and 1.5

One full turn = 3 ATP = one proton per c subunit. With ~8–10 c subunits, that is roughly 2.7–3.3 protons per ATP at the synthase — plus one more proton spent on logistics: the **adenine nucleotide translocase** swaps ATP⁴⁻ (out) for ADP³⁻ (in), a net export of one negative charge paid by Δψ, and the **phosphate translocase** symports H₂PO₄⁻ with a proton, paid by ΔpH. Call it **~4 H⁺ per delivered ATP**. Now divide: 10 protons per NADH ÷ 4 ≈ **2.5 ATP per NADH**; 6 protons per FADH₂ ÷ 4 = **1.5 ATP per FADH₂**. These consensus **P/O ratios** — nonintegral precisely because protons, not phosphoryl groups, are the coupling currency — are the numbers all downstream ATP arithmetic uses, and they vary slightly across species with c-ring size.`,
        examTip:
          'When a question asks what the proton gradient "pays for" in ATP synthase catalysis, the answer is release of preformed ATP (via rotation-driven conformational change), not formation of the phosphoanhydride bond. That inversion is a favorite discrete question.',
        quiz: [
          {
            question:
              'Electrons from matrix NADH enter the chain at Complex I. Using consensus stoichiometry, about how many ATP does one such NADH yield?',
            options: ['1.5', '2', '2.5', '3'],
            correctIndex: 2,
            explanation:
              'Complex I entry drives pumping at Complexes I, III, and IV: 4 + 4 + 2 = 10 protons per electron pair. At roughly 4 protons per ATP delivered to the cytosol (c-ring rotation plus the transport cost of ADP/Pi import and ATP export), 10 ÷ 4 ≈ 2.5 — the modern P/O ratio for NADH. FADH₂ electrons skip Complex I (6 protons), giving 1.5.',
          },
        ],
      },
      {
        id: 'bb2_ox_shuttles',
        title: 'Smuggling Cytosolic NADH: The Two Shuttles',
        content: `## The Problem

Glycolysis makes its 2 NADH in the cytosol, and the inner membrane admits neither NADH nor NAD⁺. Cells therefore move the **electrons** rather than the molecule, and the two available shuttles pay different fares — which is why "how many ATP per glucose" has two right answers.

## Malate-Aspartate Shuttle (liver, kidney, heart)

Cytosolic NADH reduces oxaloacetate to **malate** (cytosolic malate dehydrogenase). Malate rides the malate–α-ketoglutarate transporter into the matrix and is reoxidized there, regenerating **NADH inside the matrix**, which enters at Complex I for the full **2.5 ATP**. The return leg runs on transamination: matrix oxaloacetate cannot cross, so it is converted to aspartate, exported, and reconverted — the same aspartate/glutamate chemistry that nitrogen metabolism uses (Chapter II.7). Net: electrons in, no fare paid, fully reversible bookkeeping.

## Glycerol 3-Phosphate Shuttle (skeletal muscle, brain)

Cytosolic NADH reduces dihydroxyacetone phosphate to **glycerol 3-phosphate**, which is reoxidized by a flavoprotein dehydrogenase mounted on the inner membrane's outer face. Electrons pass to FAD, then directly into the **Q pool** — bypassing Complex I — for only **1.5 ATP**. The discount buys speed and irreversibility: this shuttle can keep running against a high matrix NADH/NAD⁺ ratio, suiting tissues that burn hard and fast.

## The Glucose Grand Total

| Stage | ATP (malate-aspartate) | ATP (glycerol 3-phosphate) |
|-------|------------------------|-----------------------------|
| Glycolysis: substrate-level | 2 | 2 |
| Glycolysis: 2 NADH via shuttle | 2 × 2.5 = 5 | 2 × 1.5 = 3 |
| Pyruvate dehydrogenase: 2 NADH | 5 | 5 |
| Citric acid cycle: 2 turns | 2 × 10 = 20 | 20 |
| **Total per glucose** | **32** | **30** |

(Each cycle turn: 3 NADH = 7.5, 1 FADH₂ = 1.5, 1 GTP = 1, totaling 10.) The old textbook "36–38 ATP" assumed integral P/O ratios of 3 and 2; the MCAT accepts the modern 30–32 range, and passage questions probe whether you know the **shuttle choice** is what separates the two.`,
        quiz: [
          {
            question:
              'In skeletal muscle, the NADH generated by glycolysis contributes fewer ATP than the same NADH would in liver. Why?',
            options: [
              'Muscle glycolysis produces NADPH rather than NADH',
              'Muscle uses the glycerol 3-phosphate shuttle, delivering the electrons to ubiquinone (bypassing Complex I) for 1.5 ATP instead of 2.5',
              'Muscle mitochondria lack Complex IV',
              'Muscle NADH is consumed entirely by lactate dehydrogenase under all conditions',
            ],
            correctIndex: 1,
            explanation:
              'Cytosolic NADH cannot cross the inner membrane; only its electrons can. The glycerol 3-phosphate shuttle used by skeletal muscle and brain hands those electrons to a membrane flavoprotein that reduces Q directly, skipping Complex I\'s four pumped protons — 1.5 ATP per NADH. The malate-aspartate shuttle of liver, kidney, and heart regenerates NADH inside the matrix for the full 2.5. Hence glucose totals of 30 vs 32 ATP.',
          },
        ],
      },
      {
        id: 'bb2_ox_poisons',
        title: 'Inhibitors, Uncouplers, and Control',
        content: `## Three Ways to Break the Machine

The classic pharmacology sorts into three mechanistically distinct bins, and the exam expects you to predict the phenotype of each:

| Bin | Agents | What happens |
|-----|--------|--------------|
| Electron-transport inhibitors | Rotenone/amytal (I), antimycin A (III), CN⁻/CO/azide (IV) | O₂ consumption stops at the block; no pumping, no ATP; carriers upstream pile up reduced, downstream go oxidized |
| Synthase inhibitor | Oligomycin (Fo channel) | ATP synthesis stops — and respiration stops too, because the un-drained gradient backs up until the pumps stall |
| Uncouplers | 2,4-dinitrophenol (DNP), FCCP | ATP synthesis stops, but O₂ consumption accelerates; energy exits as heat |

The oligomycin case is the crucial concept: an intact system shows **respiratory control** (acceptor control) — electron transport runs only as fast as proton re-entry permits, so O₂ consumption tracks [ADP]. Feed mitochondria substrate and they idle; add ADP and respiration surges. Oligomycin plus an uncoupler restores O₂ consumption without any ATP — the diagnostic two-step used in countless passage experiments. Uncouplers themselves are lipid-soluble weak acids that ferry protons across the membrane, short-circuiting the gradient; DNP was briefly sold as a diet drug in the 1930s and killed users by uncontrolled hyperthermia.

## Uncoupling on Purpose

Brown adipose tissue installs a **regulated** uncoupler: **UCP1 (thermogenin)** in the inner membrane gives protons a synthase-free path home, converting fat oxidation directly into heat. Newborns (which cannot shiver effectively) and hibernating mammals rely on it; a parallel futile cycle of creatine phosphorylation adds further heat. This is the physiological rebuttal to "uncoupling is always pathology."

## Reactive Oxygen and the Genome Next Door

Single electrons occasionally escape — chiefly at Complexes I and III via semiquinone — and reduce O₂ to **superoxide (·O₂⁻)**. The cleanup crew: superoxide dismutase → H₂O₂, then glutathione peroxidase → H₂O. Mitochondria also carry their own small genome (13 respiratory-chain and synthase subunits in humans, maternally inherited); mutations there produce diseases that hit the greediest tissues — muscle, heart, brain, pancreatic β cells — and β-cell energy failure links mitochondrial defects to some diabetes.`,
        importantNote:
          'Distinguish "electron transport stopped" from "uncoupled" by the O₂ trace: inhibitors and oligomycin suppress O₂ consumption; uncouplers increase it while ATP output collapses. One measurement separates all three bins.',
        quiz: [
          {
            question:
              'Isolated mitochondria respiring on succinate are treated with oligomycin, halting both ATP synthesis and O₂ consumption. DNP is then added. What is observed?',
            options: [
              'O₂ consumption resumes and ATP synthesis resumes',
              'O₂ consumption resumes but ATP synthesis does not',
              'Neither O₂ consumption nor ATP synthesis resumes',
              'ATP synthesis resumes but O₂ consumption does not',
            ],
            correctIndex: 1,
            explanation:
              'Oligomycin blocks the Fo proton channel; with no proton re-entry, the gradient builds until pumping (and thus electron flow and O₂ reduction) stalls — respiratory control in action. DNP reopens a path for protons through the lipid bilayer, so electron transport and O₂ consumption restart at full speed, but the flow bypasses the still-blocked synthase: energy is lost as heat and no ATP is made.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Chemiosmosis: electron transport and ATP synthesis are separate machines coupled only by the proton-motive force across an intact inner membrane. NADH → O₂ spans ΔE′° = 1.14 V, worth ΔG′° ≈ −220 kJ/mol (succinate ≈ −150 kJ/mol).',
      'Carrier types: NADH (2 e⁻), flavins (1–2 e⁻), ubiquinone (2 e⁻ + 2 H⁺, membrane courier, semiquinone intermediate), Fe-S centers and cytochromes and Cu centers (1 e⁻ each).',
      'Proton pumping per 2 e⁻: Complex I = 4, Complex III = 4 (Q cycle), Complex IV = 2; Complex II pumps none. Totals: 10 H⁺ per NADH, 6 per FADH₂. ETF (β-oxidation) and glycerol 3-phosphate dehydrogenase also feed Q without pumping.',
      'Proton-motive force: ΔG = 2.3RT·ΔpH + FΔψ ≈ 4.4 + 14.5 ≈ 19 kJ/mol of protons (ΔpH 0.75, Δψ 0.15 V, 310 K) — the electrical term dominates.',
      'ATP synthase: Fo c-ring rotation (one proton per c subunit; 8–17 c subunits by species) turns γ, forcing the three β sites through loose → tight → open; the gradient pays for ATP release, not bond formation. ~4 H⁺ per delivered ATP including the ANT/phosphate-translocase transport cost → P/O = 2.5 (NADH) and 1.5 (FADH₂).',
      'Shuttles for cytosolic NADH: malate-aspartate (liver, kidney, heart) → matrix NADH → 2.5 ATP; glycerol 3-phosphate (muscle, brain) → Q → 1.5 ATP. Glucose totals: 32 vs 30 ATP.',
      'Inhibitor logic: rotenone/amytal (I), antimycin A (III), CN⁻/CO/azide (IV), oligomycin (Fo — stops respiration too via backed-up gradient), atractyloside (ANT). Uncouplers (DNP, FCCP) accelerate O₂ consumption while ATP output collapses; UCP1 in brown fat is regulated, purposeful uncoupling for heat.',
      'Respiratory control: [ADP] sets respiration rate. ROS leak at I and III → superoxide → SOD → H₂O₂ → glutathione peroxidase. The 13 mtDNA-encoded subunits make maternally inherited mitochondrial disease hit muscle, heart, brain, and β cells hardest.',
    ],
  },

  // ── Biochemistry II.6: Lipid metabolism ─────────────────────────────────
  bb2_lipid_metabolism: {
    topicId: 'bb2_lipid_metabolism',
    title: 'Lipid Metabolism',
    domainWeight: '25%',
    overview:
      'Fat is the body\'s deep storage: anhydrous, highly reduced, and worth about 38 kJ/g against glycogen\'s hydrated 17. This chapter follows the full circuit — mobilizing triacylglycerols and moving fatty acids to the mitochondrion, the four-step β-oxidation spiral, the palmitate ATP ledger computed two independent ways, ketone bodies as the liver\'s exportable acetyl-CoA, and then the reverse direction: fatty acid synthesis and why the cell architecturally separates it from breakdown, with cholesterol synthesis and lipoprotein traffic in outline. The MCAT loves this chapter\'s arithmetic and its regulation logic in equal measure.',
    sections: [
      {
        id: 'bb2_lip_mobilize',
        title: 'Getting Fat to the Furnace',
        content: `## Three Sources, One Destination

Cells burn fatty acids from three pools: the diet, stored triacylglycerols (TAGs) in adipocytes, and (minor) membrane turnover. Dietary fat is insoluble in the gut lumen, so **bile salts** — amphipathic cholesterol derivatives released from the gallbladder — emulsify it into micelles; pancreatic **lipases** then strip fatty acids from glycerol. Intestinal cells re-esterify the pieces into TAGs and pack them with apolipoproteins into **chylomicrons**, which travel lymph → blood. At capillary walls, **lipoprotein lipase** — activated by apoC-II on the particle surface — releases fatty acids for tissue uptake; muscle burns them, adipose re-stores them.

## Opening the Depot

Stored TAG is mobilized on hormonal command. Glucagon or epinephrine → cAMP → PKA, which phosphorylates both **perilipin** (the coat protein fencing the lipid droplet) and **hormone-sensitive lipase**; the phosphorylated coat admits the lipases, and free fatty acids exit the adipocyte. Being insoluble, they ride the blood bound to **serum albumin** (which can carry up to about 10 per protein). The glycerol backbone goes to the liver, where glycerol kinase phosphorylates it into the glycolytic/gluconeogenic mainstream via dihydroxyacetone phosphate — the only part of a TAG that can become glucose.

## Why Fat at All

The exam expects the storage logic, and it is pure chemistry. Fatty acyl carbons are more reduced than sugar carbons (more C–H bonds to oxidize), and TAGs pack water-free, while glycogen binds roughly twice its weight in water. Net: complete oxidation of fat yields about **38 kJ/g versus ~17 kJ/g** for carbohydrate — and the hydration difference roughly doubles the advantage again by weight carried. A typical adult stores months of energy as fat but well under a day's worth as glycogen; a migrating bird or hibernator is essentially a fat-burning machine with wings or fur. The price of this density is kinetic: fat cannot support anaerobic bursts (β-oxidation is strictly aerobic) and cannot be turned into net glucose (acetyl-CoA cannot re-enter gluconeogenesis, a wall that shapes starvation metabolism in Chapters II.7–II.8).`,
      },
      {
        id: 'bb2_lip_carnitine',
        title: 'Activation and the Carnitine Gate',
        content: `## Paying the Entry Fee

A fatty acid is chemically inert until its carboxylate is attached to coenzyme A. **Fatty acyl-CoA synthetase** (outer mitochondrial membrane) does it in two steps through a fatty acyl-adenylate intermediate: the carboxylate attacks ATP to form acyl-AMP plus PPi, then CoA-SH displaces AMP to give the thioester **fatty acyl-CoA**. Because ATP is cleaved to **AMP + PPi**, and the cell's inorganic pyrophosphatase immediately hydrolyzes the PPi, the activation is pulled irreversibly forward and the true cost is **two ATP equivalents** — a number the palmitate ledger below must remember.

## The Shuttle That Is Also the Throttle

Acyl-CoA cannot cross the inner mitochondrial membrane. The **carnitine shuttle** carries the acyl group instead: **carnitine acyltransferase 1 (CPT1)** on the outer membrane swaps CoA for carnitine to make acyl-carnitine; a dedicated antiporter moves it across the inner membrane (exchanging free carnitine outward); and **carnitine acyltransferase 2 (CPT2)** on the matrix face reassembles acyl-CoA from the matrix CoA pool. Note the elegance: the cytosolic and mitochondrial **CoA pools stay separate**, each dedicated to its own chemistry.

This transfer is the **committed and rate-limiting step of fatty acid oxidation**, and it carries the pathway's master switch: **malonyl-CoA — the first dedicated intermediate of fatty acid synthesis — inhibits CPT1.** When the cell is building fat (fed state, insulin high, cytosolic malonyl-CoA plentiful), newly made fatty acids are locked out of the mitochondrion and cannot be futilely re-burned. When glucagon rises, malonyl-CoA production stops, CPT1 disinhibits, and oxidation proceeds. One metabolite, one binding site, and the two opposing pathways can never run at full speed simultaneously — remember this interlock; the exam asks for it often.`,
        examTip:
          'If a passage describes a patient or knockout with normal β-oxidation enzymes but an inability to oxidize long-chain fats — especially with muscle symptoms during fasting or exercise — think carnitine deficiency or CPT deficiency: the fuel is fine, the doorway is broken.',
        quiz: [
          {
            question:
              'Malonyl-CoA inhibits carnitine acyltransferase 1. What is the physiological purpose of this regulation?',
            options: [
              'It accelerates fatty acid oxidation when glucose is abundant',
              'It prevents newly synthesized fatty acids from being immediately transported into mitochondria and re-oxidized — a futile cycle',
              'It stimulates ketone body export from the liver',
              'It couples β-oxidation directly to the citric acid cycle',
            ],
            correctIndex: 1,
            explanation:
              'Malonyl-CoA exists in quantity only when fatty acid synthesis is running (fed state). By blocking CPT1 — the committed step of mitochondrial fatty acid import — it ensures synthesis and breakdown cannot run simultaneously. High malonyl-CoA = build mode, oxidation gated shut; when glucagon signaling shuts off synthesis, malonyl-CoA falls and the gate reopens.',
          },
        ],
      },
      {
        id: 'bb2_lip_betaox',
        title: 'β-Oxidation: Four Steps on Repeat',
        content: `## The Spiral

β-Oxidation clips two-carbon units off the carboxyl end of an acyl-CoA, one pass at a time, by a four-reaction sequence that should feel familiar — it is the same oxidize / hydrate / oxidize / cleave logic the citric acid cycle applies between succinate and oxaloacetate, run on a thioester:

1. **Acyl-CoA dehydrogenase** (FAD): removes hydrogens from the α and β carbons, making a **trans-Δ² enoyl-CoA**. The FADH₂ hands its electrons to the **electron-transfer flavoprotein (ETF)**, which delivers them to ubiquinone — the Q-level entry worth 1.5 ATP. This enzyme comes in chain-length versions (very-long-, medium-, short-chain).
2. **Enoyl-CoA hydratase**: adds water across the double bond, giving the **L**-β-hydroxyacyl-CoA (stereospecific — compare the D-isomer used in synthesis).
3. **β-Hydroxyacyl-CoA dehydrogenase** (NAD⁺): oxidizes the hydroxyl to a ketone — β-ketoacyl-CoA — generating NADH (Complex I entry, 2.5 ATP).
4. **Thiolase**: CoA attacks the β-keto carbon, releasing **acetyl-CoA** and an acyl-CoA shortened by two carbons, which re-enters at step 1.

Each pass through the spiral therefore banks 1 FADH₂ + 1 NADH + 1 acetyl-CoA. The chemistry's point is the middle two steps: a plain C–C bond is hard to break, but converting the β carbon into a ketone makes the α–β bond cleavable by simple thiolysis.

## The Complications Worth Knowing

**Unsaturated fatty acids** arrive with cis double bonds in awkward places; two auxiliary enzymes fix the geometry — **enoyl-CoA isomerase** (moves cis-Δ³ to trans-Δ²) and **2,4-dienoyl-CoA reductase** (NADPH; needed for even-numbered double bonds). **Odd-chain fatty acids** end not in acetyl-CoA but in the three-carbon **propionyl-CoA**, which is carboxylated (propionyl-CoA carboxylase, biotin, ATP) to methylmalonyl-CoA and rearranged by **methylmalonyl-CoA mutase — one of the body's two coenzyme B₁₂ enzymes** — into succinyl-CoA, a citric acid cycle intermediate and thus (unlike acetyl-CoA!) a gluconeogenic entry point. **Peroxisomes** run a parallel four-step β-oxidation specialized for very-long-chain and branched fats, whose first oxidation passes electrons directly to O₂ as H₂O₂ (catalase territory) — energy lost as heat, no ETF. And the clinically famous lesion: **MCAD deficiency** (medium-chain acyl-CoA dehydrogenase) leaves patients unable to finish oxidizing fats during fasting — hypoglycemia with inappropriately low ketones, octanoate accumulation, potentially fatal in infants.`,
      },
      {
        id: 'bb2_lip_ledger',
        title: 'The Palmitate Ledger, Computed Twice',
        content: `## Count the Passes First

Palmitate is C16. Each pass removes C2 and the **final pass yields two acetyl-CoA at once**, so a C16 chain needs **7 passes** (n/2 − 1), producing **8 acetyl-CoA, 7 FADH₂, and 7 NADH**. Get those three counts right and everything else is multiplication.

**Method 1 — stage by stage.** Each β-oxidation pass is worth 1.5 (FADH₂) + 2.5 (NADH) = 4 ATP; seven passes = **28 ATP**. Each acetyl-CoA oxidized in the citric acid cycle yields 3 NADH (7.5) + 1 FADH₂ (1.5) + 1 GTP = **10 ATP**; eight of them = **80 ATP**. Total for palmitoyl-CoA: 28 + 80 = **108 ATP**. Subtract the activation fee — ATP → AMP + PPi, **2 ATP equivalents** — and net yield per free palmitate is **106 ATP**.

**Method 2 — by cofactor totals.** Tally every reduced carrier from both stages: FADH₂ = 7 (β-ox) + 8 (cycle) = 15 → 15 × 1.5 = 22.5. NADH = 7 (β-ox) + 24 (cycle) = 31 → 31 × 2.5 = 77.5. GTP = 8. Sum: 22.5 + 77.5 + 8 = **108**, minus 2 for activation = **106**. Two independent routes, one answer — if your own two tallies ever disagree on test day, recount the passes.

![Bar ledger of ATP from one palmitate, computed: 7 β-oxidation passes contribute 28 ATP (7 FADH₂ × 1.5 + 7 NADH × 2.5), 8 acetyl-CoA through the citric acid cycle contribute 80 ATP (10 each), activation costs −2; net 106 ATP. Computed values — bar heights to scale.](/courses/mcat/biochem/bc2-palmitate-ledger.svg)

## Reading the Number

Complete combustion of palmitate releases about 9,800 kJ/mol; 106 ATP at ~30.5 kJ/mol captures ~3,230 kJ — about **33% efficiency under standard conditions**, above 60% at real cellular concentrations. Per carbon, compare glucose: 32 ATP/6 C ≈ 5.3 versus palmitate's 106/16 ≈ 6.6 — the more reduced fuel pays better, exactly as the C–H bond count predicts. Note also the water: every electron pair delivered to O₂ makes an H₂O, and this "metabolic water" is how desert animals and hibernators drink from their own fat.`,
        quiz: [
          {
            question:
              'What is the net ATP yield from complete oxidation of one molecule of free palmitate (C16), using P/O ratios of 2.5 and 1.5?',
            options: ['96', '106', '108', '129'],
            correctIndex: 1,
            explanation:
              'Seven β-oxidation passes give 7 FADH₂ (× 1.5 = 10.5) and 7 NADH (× 2.5 = 17.5), and 8 acetyl-CoA give 8 × 10 = 80 through the citric acid cycle: 108 ATP for palmitoyl-CoA. Activation to palmitoyl-CoA cleaved ATP to AMP + PPi — two phosphoanhydride bonds — so the net for free palmitate is 108 − 2 = 106. The distractor 108 forgets activation; 129 comes from obsolete integral P/O ratios.',
          },
          {
            question:
              'Oxidation of an odd-chain fatty acid leaves propionyl-CoA. Which cofactor is required to convert it, via methylmalonyl-CoA, into a citric acid cycle intermediate?',
            options: [
              'Tetrahydrofolate',
              'Coenzyme B₁₂ (for methylmalonyl-CoA mutase)',
              'Lipoamide',
              'FAD',
            ],
            correctIndex: 1,
            explanation:
              'Propionyl-CoA is carboxylated (biotin-dependent propionyl-CoA carboxylase, ATP) to methylmalonyl-CoA, which methylmalonyl-CoA mutase — one of only two human B₁₂-dependent enzymes — isomerizes to succinyl-CoA. B₁₂ deficiency therefore backs up methylmalonate (a diagnostic marker) and, because succinyl-CoA is gluconeogenic, this is the one fatty-acid tailpiece that can contribute net carbon to glucose.',
          },
        ],
      },
      {
        id: 'bb2_lip_ketones',
        title: 'Ketone Bodies: Exportable Acetyl-CoA',
        content: `## Why the Liver Makes Them

During fasting, the liver runs gluconeogenesis hard, which drains oxaloacetate — the very molecule acetyl-CoA needs to enter the citric acid cycle. β-Oxidation keeps delivering acetyl-CoA anyway. The liver's answer is to condense the surplus into small, water-soluble, exportable fuels: the **ketone bodies**. Three molecules qualify: **acetoacetate**, its reduction product **D-β-hydroxybutyrate**, and the decarboxylation byproduct **acetone** (volatile, exhaled — the fruity breath of ketosis). Making them also liberates CoA, without which β-oxidation itself would stall.

![The three ketone bodies: acetoacetate, D-β-hydroxybutyrate, and acetone, drawn as free acids (the first two circulate as anions). Structures rendered from the molecular graph (RDKit); formulas machine-verified.](/courses/mcat/biochem/bcs-ketone-bodies.svg)

## The Chemistry, Both Directions

**Synthesis (liver mitochondria):** two acetyl-CoA condense (thiolase) to acetoacetyl-CoA; a third joins to form **HMG-CoA** (HMG-CoA synthase — mitochondrial, distinct from the cytosolic cholesterol enzyme); **HMG-CoA lyase** then releases acetoacetate plus acetyl-CoA. β-Hydroxybutyrate dehydrogenase reduces acetoacetate using NADH, so the circulating β-hydroxybutyrate/acetoacetate ratio actually reports the liver's mitochondrial redox state.

**Use (extrahepatic mitochondria — brain, heart, muscle, kidney cortex):** β-hydroxybutyrate is reoxidized to acetoacetate; then **succinyl-CoA:acetoacetate-CoA transferase (thiophorase)** flips a CoA from succinyl-CoA onto acetoacetate, and thiolase splits the acetoacetyl-CoA into **two acetyl-CoA**, ready for cycle oxidation. The activation borrows succinyl-CoA's thioester energy (skipping the cycle's GTP step — a one-ATP-equivalent toll).

**The liver lacks thiophorase.** That single missing enzyme makes it a pure producer: it manufactures ketone bodies it can never spend, the metabolic equivalent of a mint that cannot use its own coins.

## When the System Saves You, and When It Kills

In prolonged starvation, ketone bodies become the brain's major fuel (Chapter II.8), sparing glucose and therefore muscle protein. In **untreated type 1 diabetes**, the same machinery runs catastrophically: no insulin means lipolysis and ketogenesis proceed unchecked while glucose sits unused; acetoacetate and β-hydroxybutyrate are acids, and their accumulation overwhelms the bicarbonate buffer — **ketoacidosis**, with blood pH falling, dehydration from osmotic diuresis, and acetone on the breath. Same pathway, opposite meanings; the difference is whether insulin is present to set a ceiling.`,
        quiz: [
          {
            question:
              'The liver synthesizes and exports ketone bodies but cannot use them as fuel. Why?',
            options: [
              'Hepatocyte membranes are impermeable to β-hydroxybutyrate',
              'The liver lacks succinyl-CoA:acetoacetate-CoA transferase (thiophorase), the enzyme that reactivates acetoacetate to acetoacetyl-CoA',
              'The liver lacks the citric acid cycle',
              'Hepatic HMG-CoA lyase destroys any ketone bodies formed',
            ],
            correctIndex: 1,
            explanation:
              'Extrahepatic tissues activate acetoacetate by borrowing CoA from succinyl-CoA via thiophorase, then split the product into two acetyl-CoA. Hepatocytes do not express thiophorase, so the liver is exclusively a producer — a tidy design, since the whole point of ketogenesis is to export acetyl-CoA equivalents to tissues that need them, not to burn them at the source.',
          },
        ],
      },
      {
        id: 'bb2_lip_synthesis',
        title: 'Building Fatty Acids: The Separation Logic',
        content: `## Not Reversal — Reinvention

Fatty acid synthesis is emphatically not β-oxidation run backward: different compartment, different carriers, different redox coin, even different stereochemistry. The exam tests the contrasts as a set:

| Feature | β-Oxidation | Synthesis |
|---------|-------------|-----------|
| Location | Mitochondrial matrix | Cytosol |
| Acyl carrier | Coenzyme A | Acyl carrier protein (ACP) |
| Redox partner | FAD, NAD⁺ (oxidizing) | NADPH (reducing, both steps) |
| β-Hydroxy intermediate | L isomer | D isomer |
| Two-carbon unit | Acetyl-CoA released | Malonyl-CoA added (CO₂ lost) |
| Hormonal tilt | Glucagon on | Insulin on |

**Getting the substrate out:** acetyl-CoA is made in the matrix, so the cell exports it as **citrate** (the citrate shuttle); cytosolic ATP-citrate lyase re-cleaves it, and the oxaloacetate limb returns via malate — a route that costs roughly two ATP per acetyl group moved and, through **malic enzyme**, generates part of the required NADPH (the pentose phosphate pathway supplies the rest). Citrate leaving the mitochondrion is itself a signal: energy is plentiful, build.

**The committed step:** **acetyl-CoA carboxylase (ACC)** — biotin-dependent, like nearly every carboxylase — makes **malonyl-CoA**. It is the pathway's control point: citrate activates allosterically; palmitoyl-CoA (product excess) inhibits; **AMPK phosphorylates it off** when energy is low; insulin activates, glucagon/epinephrine deactivate. And malonyl-CoA, remember, is simultaneously the CPT1 brake on oxidation — one metabolite wiring the two pathways in strict opposition.

**The assembly line:** mammalian **fatty acid synthase (FAS I)** is one huge multi-domain polypeptide with a phosphopantetheine arm on ACP swinging intermediates between active sites. Each cycle: condensation (malonyl's decarboxylation drives C–C bond formation — the reason ATP was invested upstream), NADPH reduction, dehydration, NADPH reduction again; each turn adds C2 until **palmitate (C16)** is released. Overall: **8 acetyl-CoA + 7 ATP + 14 NADPH → palmitate.** Elongation beyond C16 and desaturation happen at the ER; mammals cannot desaturate beyond Δ9, which is why **linoleate and α-linolenate are essential** in the diet (and why arachidonate — the eicosanoid precursor — is conditionally so).`,
        quiz: [
          {
            question:
              'Which statement correctly contrasts fatty acid synthesis with β-oxidation?',
            options: [
              'Both pathways occur in the mitochondrial matrix, separated only in time',
              'Synthesis uses NADPH and an acyl carrier protein in the cytosol, while oxidation uses FAD/NAD⁺ and coenzyme A in the matrix',
              'Synthesis removes two-carbon units as malonyl-CoA; oxidation adds them as acetyl-CoA',
              'Both pathways use the D-β-hydroxyacyl intermediate',
            ],
            correctIndex: 1,
            explanation:
              'The separations are systematic: cytosol vs matrix, ACP vs CoA, NADPH as reductant vs FAD/NAD⁺ as oxidants, D- vs L-β-hydroxyacyl stereochemistry, and addition of C2 from malonyl-CoA (with CO₂ release) vs removal of C2 as acetyl-CoA. This architecture, plus the malonyl-CoA/CPT1 interlock and reciprocal insulin/glucagon control, is what prevents a futile synthesize-and-burn cycle.',
          },
        ],
      },
      {
        id: 'bb2_lip_cholesterol',
        title: 'Cholesterol in Outline and Lipoprotein Traffic',
        content: `## Thirty Steps, Four Stages, One Gate

Cholesterol is assembled entirely from acetyl-CoA, and the MCAT wants the staging, not the step-by-step: (1) three acetyl-CoA → **HMG-CoA** (cytosolic pool, distinct from the mitochondrial ketogenic pool) → **mevalonate**; (2) mevalonate → the **activated five-carbon isoprenes** (isopentenyl- and dimethylallyl-pyrophosphate, spending three ATP); (3) six isoprenes condense to the linear C30 **squalene**; (4) cyclization to lanosterol and trimming to **cholesterol** (C27). The gatekeeper is step one's reductase: **HMG-CoA reductase** (ER membrane, uses 2 NADPH) is the committed, rate-limiting step and the most heavily regulated enzyme in the pathway — feedback-repressed at the gene level by the **SREBP/SCAP/Insig** sterol-sensing system, degraded faster when sterols are high, phosphorylated off by AMPK, and pharmacologically inhibited by **statins**, transition-state-like mevalonate mimics. Cholesterol's fates: membranes, bile salts (the quantitatively largest exit), steroid hormones, and vitamin D; isoprene intermediates also feed protein prenylation, dolichol, and ubiquinone — yes, the respiratory Q of Chapter II.5.

## The Delivery Fleet

Lipids travel blood as **lipoproteins** — droplets with TAG/cholesteryl-ester cores and phospholipid/apolipoprotein shells — classified by density (more lipid = less dense):

| Particle | Cargo | Key apoproteins | Job |
|----------|-------|-----------------|-----|
| Chylomicron | Dietary TAG | B-48, C-II | Gut → tissues |
| VLDL | Liver-made TAG | B-100, C-II | Liver → tissues |
| LDL | Cholesteryl esters | B-100 | Cholesterol delivery to periphery |
| HDL | Protein-rich | A-I | Reverse cholesterol transport, periphery → liver |

Lipoprotein lipase (apoC-II-activated) unloads TAG from chylomicrons and VLDL; as VLDL sheds triglyceride it densifies into **LDL**, which target cells import whole by **receptor-mediated endocytosis** — the LDL receptor recognizing apoB-100. This is the pathway of **familial hypercholesterolemia**: defective LDL receptors leave LDL circulating, cholesterol deposits in arterial walls and macrophage "foam cells," and homozygotes suffer atherosclerosis in childhood — the receptor work (Brown and Goldstein) that made LDL "bad cholesterol" a mechanism instead of a slogan. **HDL** runs the counter-current, harvesting excess cholesterol from peripheral cells (esterifying it via LCAT) and ferrying it back to the liver for excretion as bile salts.`,
        quiz: [
          {
            question:
              'Statins lower serum cholesterol by inhibiting which enzyme?',
            options: [
              'HMG-CoA lyase',
              'HMG-CoA reductase, the committed step producing mevalonate',
              'Lipoprotein lipase',
              'ATP-citrate lyase',
            ],
            correctIndex: 1,
            explanation:
              'HMG-CoA reductase catalyzes the committed, rate-limiting reduction of HMG-CoA to mevalonate and is the pathway\'s master control point. Statins are competitive inhibitors resembling the reaction intermediate. A second-order effect does much of the clinical work: cholesterol-starved liver cells upregulate LDL receptors via SREBP, pulling more LDL out of circulation. HMG-CoA lyase is the mitochondrial ketogenesis enzyme — a deliberate near-name trap.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Fat is the dense store: ~38 kJ/g, anhydrous, vs glycogen\'s hydrated ~17 kJ/g. Mobilization: glucagon/epinephrine → PKA → perilipin + hormone-sensitive lipase; free fatty acids ride albumin; glycerol alone reaches gluconeogenesis. Dietary route: bile salts → lipases → chylomicrons → lipoprotein lipase (apoC-II).',
      'Activation costs 2 ATP equivalents (ATP → AMP + PPi, pulled by pyrophosphatase). The carnitine shuttle (CPT1 → translocase → CPT2) is the committed step; malonyl-CoA inhibits CPT1, forbidding simultaneous synthesis and oxidation.',
      'β-Oxidation per pass: FAD-dehydrogenation (trans-Δ², electrons via ETF to Q), hydration (L-isomer), NAD⁺-dehydrogenation, thiolysis → acetyl-CoA + chain −2C. Same oxidize/hydrate/oxidize logic as succinate → oxaloacetate.',
      'Palmitate ledger: 7 passes → 7 FADH₂ (10.5) + 7 NADH (17.5) + 8 acetyl-CoA (80) = 108; minus 2 for activation = 106 net ATP. ~33% standard efficiency; both counting methods must agree.',
      'Odd chains end in propionyl-CoA → (biotin) methylmalonyl-CoA → (B₁₂ mutase) succinyl-CoA — gluconeogenic. Unsaturated chains need isomerase + 2,4-dienoyl reductase. Peroxisomes handle very-long/branched chains (first oxidation → H₂O₂). MCAD deficiency: fasting hypoglycemia with low ketones.',
      'Ketone bodies (acetoacetate, D-β-hydroxybutyrate, acetone): liver mitochondria condense surplus acetyl-CoA via HMG-CoA when oxaloacetate is drained by gluconeogenesis. Extrahepatic use requires thiophorase — which the liver lacks. Starvation fuel for brain; ketoacidosis in untreated type 1 diabetes.',
      'Synthesis is architecturally separated: cytosol, ACP, NADPH, D-isomer, malonyl-CoA addition. Citrate shuttle exports acetyl-CoA (~2 ATP each); ACC (biotin) is the committed step — citrate activates, palmitoyl-CoA and AMPK-phosphorylation inhibit. Net: 8 acetyl-CoA + 7 ATP + 14 NADPH → palmitate. Mammals stop at Δ9: linoleate and α-linolenate essential.',
      'Cholesterol: acetyl-CoA → HMG-CoA → mevalonate (HMG-CoA reductase = rate-limiting; statins; SREBP/SCAP/Insig feedback) → isoprenes → squalene → cholesterol. Lipoproteins: chylomicron (B-48) and VLDL (B-100) carry TAG; VLDL → LDL delivers cholesterol via receptor-mediated endocytosis (familial hypercholesterolemia when broken); HDL runs reverse transport.',
    ],
  },

  // ── Biochemistry II.7: Nitrogen — amino acid metabolism and the urea cycle ──
  bb2_nitrogen: {
    topicId: 'bb2_nitrogen',
    title: 'Nitrogen: Amino Acid Metabolism and the Urea Cycle',
    domainWeight: '25%',
    overview:
      'Unlike glucose and fat, nitrogen has no storage depot: every amino acid beyond immediate need is degraded the same day, and the amino group must be handled like the hazardous cargo it is. This chapter follows the nitrogen: transamination onto α-ketoglutarate with PLP doing the chemistry, oxidative deamination in liver mitochondria, the two blood couriers (glutamine and alanine), the urea cycle with its cost accounting, and then the carbon skeletons — which become glucose, which become ketones, and which diseases mark the broken steps. Heme closes the chapter in outline, since its synthesis begins with an amino acid and its breakdown colors bruises and jaundice.',
    sections: [
      {
        id: 'bb2_nit_problem',
        title: 'Nitrogen Has No Depot',
        content: `## An Asymmetry Worth Noticing

Carbohydrate has glycogen; fat has the adipocyte; protein has — nothing. There is no storage protein whose job is to hold amino acids for later. Dietary protein beyond synthetic needs is degraded promptly, and during fasting the body draws on working proteins (mostly muscle), paying a functional price for every gram. Amino acid oxidation supplies a modest slice of human energy on a normal diet, but it surges in three situations the exam likes: a high-protein meal, prolonged starvation, and uncontrolled diabetes — the last two because when carbohydrate is unavailable or unusable, protein becomes a major gluconeogenic feedstock.

## Getting Amino Acids Out of Dinner

Digestion is a cascade of proteases activated as **zymogens** — secreting an active protease would digest the gland that made it (recall zymogen logic from enzyme control, Chapter I.7). The stomach's low pH (≈1.5–2.5) denatures dietary protein while **pepsin** (from pepsinogen, autoactivated by acid) makes the first cuts. The pancreas then ships trypsinogen, chymotrypsinogen, and procarboxypeptidases to the small intestine, where intestinal **enteropeptidase** activates trypsin, and trypsin activates everything else — one master switch, one amplification cascade. Aminopeptidases finish the job; free amino acids and small peptides are absorbed and delivered first to the liver via the portal blood.

## Three Ways to Throw Nitrogen Away

Catabolism of an amino acid always faces the same fork: the carbon skeleton is valuable fuel, but the amino group, once released as ammonia, is toxic. Animals excrete nitrogen in one of three currencies, chosen largely by water budget: **ammonotelic** animals (most fishes) release NH₄⁺ directly into abundant surrounding water; **uricotelic** animals (birds, reptiles) spend energy packaging nitrogen as nearly insoluble uric acid paste, saving water for flight and shelled eggs; **ureotelic** animals — mammals, including every patient on the MCAT — convert nitrogen to **urea**, water-soluble, uncharged, and nontoxic, made in the liver and excreted by the kidney. The machinery of that conversion, and its price in ATP, is the heart of this chapter.`,
      },
      {
        id: 'bb2_nit_transamination',
        title: 'Transamination and the PLP Electron Sink',
        content: `## One Reaction, Twenty Substrates

The first catabolic step for most amino acids is not oxidation but a swap: an **aminotransferase (transaminase)** transfers the α-amino group to **α-ketoglutarate**, leaving behind the amino acid's α-keto skeleton and producing **glutamate**. The design is a funnel — twenty different amino groups all converge on one carrier molecule, so the cell needs only one downstream disposal system. Transamination reactions sit near equilibrium (ΔG′° ≈ 0), so they run in either direction as supply demands; the same enzymes that dismantle amino acids build them.

Two members are clinical celebrities. **Alanine aminotransferase (ALT)** interconverts alanine and pyruvate; **aspartate aminotransferase (AST)** interconverts aspartate and oxaloacetate. Both are intracellular liver enzymes, and their appearance in serum means hepatocytes are leaking — the ALT/AST panel ordered in every liver workup, and a standard MCAT passage hook.

## The Coenzyme That Makes It Possible

Every aminotransferase carries **pyridoxal phosphate (PLP)**, the vitamin B₆ derivative, and its mechanism is a masterpiece worth knowing at MCAT depth. At rest, PLP's aldehyde is tethered to an active-site lysine as a Schiff base (the **internal aldimine**). An incoming amino acid displaces the lysine, forming an **external aldimine**; the coenzyme's protonated pyridinium ring then acts as an **electron sink**, stabilizing the carbanion left when the α-hydrogen is pulled off. Hydrolysis releases the α-keto acid and leaves the amino group parked on the coenzyme (now pyridoxamine phosphate, PMP); a second α-keto acid — usually α-ketoglutarate — arrives and the half-reactions run in reverse, handing it the amino group. Group on, first product leaves, group off onto the second substrate: this is the textbook **ping-pong mechanism**, and its parallel double-reciprocal lines (Chapter I.6) are how kinetics identifies it. The same electron-sink trick lets other PLP enzymes run decarboxylations and racemizations — PLP is the general-purpose coenzyme of amino acid chemistry, which is why B₆ deficiency ripples so widely.`,
        quiz: [
          {
            question:
              'Kinetic analysis of an aminotransferase shows parallel lines on double-reciprocal plots at different fixed co-substrate concentrations. This pattern reflects which mechanistic feature?',
            options: [
              'Formation of a ternary complex containing both substrates',
              'A ping-pong mechanism in which the amino group is left parked on PLP (as PMP) after the first substrate\'s product departs',
              'Irreversible inhibition by the amino acid substrate',
              'Positive cooperativity between subunits',
            ],
            correctIndex: 1,
            explanation:
              'Aminotransferases run two half-reactions: amino acid 1 converts PLP to PMP and leaves as its α-keto acid; only then does α-keto acid 2 bind and collect the amino group, regenerating PLP. The substrates never occupy the enzyme together — no ternary complex — which produces the parallel-line double-reciprocal fingerprint of a ping-pong (double-displacement) mechanism.',
          },
        ],
      },
      {
        id: 'bb2_nit_deamination',
        title: 'Deamination and Ammonia Logistics',
        content: `## Cutting the Nitrogen Loose

Transamination only relocates nitrogen; something must eventually release it. That job belongs to **glutamate dehydrogenase (GDH)** in liver mitochondria: glutamate + H₂O + NAD(P)⁺ → α-ketoglutarate + **NH₄⁺** + NAD(P)H. GDH is unusual twice over — it accepts either NAD⁺ or NADP⁺, and it is allosterically tuned to energy state: **ADP activates it, GTP inhibits it**, so a cell short of ATP deaminates faster and feeds more carbon skeletons to oxidation. The transaminase-funnel-then-GDH sequence — amino group to glutamate, glutamate to free ammonium — is called **transdeamination**, and it delivers NH₄⁺ exactly where the urea cycle begins: the hepatic mitochondrial matrix.

Free ammonia is seriously neurotoxic — elevated NH₄⁺ produces cerebral edema, coma, and death, likely through several converging insults (draining α-ketoglutarate and glutamate, and osmotically swelling astrocytes as glutamine accumulates). So the body never ships nitrogen as free ammonia if it can help it.

## The Two Couriers

**Glutamine** is the general-purpose carrier. Peripheral tissues run **glutamine synthetase** (glutamate + NH₄⁺ + ATP → glutamine), packaging ammonia as a harmless amide; blood glutamine — the most abundant circulating amino acid — is unloaded by mitochondrial **glutaminase** in the liver (feeding the urea cycle) and the kidney (where secreted NH₄⁺ buffers urine acid, a link to acid-base physiology the MCAT enjoys).

**Alanine** is muscle's specialist, running the **glucose-alanine cycle**. Hard-working muscle accumulates both pyruvate (from glycolysis) and amino groups (from degrading branched-chain amino acids). ALT combines the two: pyruvate + glutamate → alanine + α-ketoglutarate. Alanine travels to the liver, where ALT reverses the swap; the recovered pyruvate enters gluconeogenesis and the glucose returns to muscle. Follow the accounting: muscle exports its nitrogen problem *and* its gluconeogenic burden in one molecule, and the ATP bill for remaking glucose is paid by the liver — a division of labor the integration chapter (II.8) will generalize.`,
        quiz: [
          {
            question:
              'During intense exercise, muscle exports nitrogen primarily as alanine rather than free ammonia. What does the liver do with arriving alanine?',
            options: [
              'Oxidizes it directly to CO₂ in the citric acid cycle',
              'Transaminates it back to pyruvate (nitrogen entering the urea pathway) and uses the pyruvate for gluconeogenesis, returning glucose to the blood',
              'Converts it to glutamine for storage in hepatocytes',
              'Excretes it unchanged in bile',
            ],
            correctIndex: 1,
            explanation:
              'This is the glucose-alanine cycle: muscle loads its amino groups onto pyruvate via ALT, the liver\'s ALT unloads them (the nitrogen proceeding via glutamate to urea), and the pyruvate is rebuilt into glucose for re-export. Muscle thereby sheds toxic nitrogen in a safe form and shifts the energetic cost of gluconeogenesis onto the liver.',
          },
        ],
      },
      {
        id: 'bb2_nit_urea',
        title: 'The Urea Cycle, With the Bill',
        content: `## The Molecule and Its Sources

Urea, CO(NH₂)₂, carries two nitrogens and one carbon. Trace each: the carbon arrives as **HCO₃⁻**; **one nitrogen enters as free NH₄⁺** (via carbamoyl phosphate); **the other enters as aspartate** — the same aspartate that transamination from oxaloacetate produces. The cycle straddles two compartments, opening in the mitochondrial matrix and closing in the cytosol.

**In the matrix:** **carbamoyl phosphate synthetase I (CPS-I)** condenses NH₄⁺ + HCO₃⁻ using **two ATP**, making carbamoyl phosphate. This is the committed, regulated step: CPS-I is essentially inactive without its obligatory allosteric activator **N-acetylglutamate (NAG)**, synthesized when glutamate and acetyl-CoA are plentiful and further boosted by arginine — so the cycle throttles up exactly when amino acid catabolism runs hot. **Ornithine transcarbamoylase** then joins carbamoyl phosphate to ornithine, forming citrulline, which is exported to the cytosol.

**In the cytosol:** **argininosuccinate synthetase** couples citrulline to aspartate, spending ATP **cleaved to AMP + PPi** (two more equivalents); **argininosuccinase** eliminates **fumarate**, leaving arginine; and **arginase** hydrolyzes arginine to **urea + ornithine**, the ornithine returning to the matrix to begin again — a true cycle, catalytic in its intermediates, like the citric acid cycle it secretly shakes hands with.

![Schematic of nitrogen flow: amino acids → transamination to glutamate → glutamate dehydrogenase releases NH₄⁺ in liver mitochondria → carbamoyl phosphate joins ornithine → citrulline exits to cytosol → aspartate donates the second nitrogen → argininosuccinate → fumarate leaves for the citric acid cycle → arginine → urea + regenerated ornithine. Schematic — not to scale.](/courses/mcat/biochem/bc2-nitrogen-flow.svg)

![Urea cycle intermediates in cycle order: ornithine, citrulline, argininosuccinate, arginine, and urea, drawn as neutral (free acid, free amine) forms — at physiological pH the amino and carboxyl groups are ionized. Structures rendered from the molecular graph (RDKit); formulas machine-verified.](/courses/mcat/biochem/bcs-urea-cycle.svg)

## The Bill, Then the Rebate

Add the invoice: 2 ATP at CPS-I plus one ATP cleaved to AMP + PPi (with PPi hydrolyzed) = **four phosphoanhydride bonds per urea**. Now the rebate: the fumarate released in the cytosol is hydrated to malate, which enters the mitochondrion and is oxidized to oxaloacetate — generating **one NADH, worth ≈2.5 ATP** — and the oxaloacetate is transaminated right back to aspartate, ready to donate the next nitrogen. This fumarate-malate-oxaloacetate-aspartate loop (the **aspartate-argininosuccinate shunt**, linking urea and citric acid cycles into the so-called Krebs bicycle) cuts the effective cost to roughly **1.5 ATP equivalents per urea**. Cheap, for permanent detoxification.

**When the cycle breaks:** deficiency of any urea cycle enzyme produces **hyperammonemia** — most commonly X-linked ornithine transcarbamoylase deficiency — presenting in infants as lethargy, vomiting, and coma. Management logic is testable: restrict protein, and administer benzoate or phenylbutyrate, which conjugate glycine and glutamine respectively into excretable products, smuggling nitrogen out through side doors.`,
        examTip:
          'Two questions recur: (1) the sources of urea\'s two nitrogens — free NH₄⁺ and aspartate, never two ammonias; (2) the cost — four high-energy phosphate bonds gross (3 ATP molecules, one cut to AMP), partially refunded by the NADH from fumarate\'s return trip.',
        quiz: [
          {
            question: 'The two nitrogen atoms of urea derive from which donors?',
            options: [
              'Two molecules of free ammonium',
              'One free ammonium (via carbamoyl phosphate) and one from aspartate',
              'One from glutamine and one from alanine directly',
              'Two molecules of aspartate',
            ],
            correctIndex: 1,
            explanation:
              'CPS-I fixes free NH₄⁺ (largely delivered by glutamate dehydrogenase and glutaminase) into carbamoyl phosphate — nitrogen one. Aspartate then condenses with citrulline at the argininosuccinate synthetase step — nitrogen two. Glutamine and alanine are upstream couriers; their nitrogen reaches the cycle only after conversion to NH₄⁺ or aspartate.',
          },
          {
            question:
              'A patient with a complete deficiency of N-acetylglutamate synthase develops severe hyperammonemia. Why?',
            options: [
              'N-acetylglutamate is a substrate of the urea cycle, so urea cannot be formed from it',
              'Carbamoyl phosphate synthetase I requires N-acetylglutamate as an obligatory allosteric activator; without it the cycle\'s committed step barely runs',
              'N-acetylglutamate transports ammonia across the mitochondrial membrane',
              'N-acetylglutamate is required for arginase activity',
            ],
            correctIndex: 1,
            explanation:
              'NAG contributes no atoms to urea — it is a pure allosteric signal, produced from acetyl-CoA and glutamate when amino acid catabolism is active (and boosted by arginine). CPS-I is nearly inactive without bound NAG, so losing NAG synthase functionally silences the cycle\'s first committed step, and ammonium accumulates just as in a CPS-I deficiency.',
          },
        ],
      },
      {
        id: 'bb2_nit_skeletons',
        title: 'Carbon Skeletons: Glucogenic and Ketogenic',
        content: `## Seven Doors into Central Metabolism

Strip the nitrogen and twenty different carbon skeletons must find their way into pathways you already know. They enter at seven points, and the classification that matters is binary: skeletons yielding **pyruvate or citric acid cycle intermediates** are **glucogenic** (they can become oxaloacetate → phosphoenolpyruvate → glucose); skeletons yielding only **acetyl-CoA or acetoacetyl-CoA** are **ketogenic** (acetyl carbons cannot make net glucose — the wall from Chapter II.6 again).

| Entry point | Amino acids (partial or whole skeletons) |
|-------------|------------------------------------------|
| Pyruvate | Ala, Cys, Gly, Ser, Thr, Trp |
| α-Ketoglutarate | Glu, Gln, Pro, Arg, His |
| Succinyl-CoA | Met, Ile, Val, Thr |
| Fumarate | Phe, Tyr |
| Oxaloacetate | Asp, Asn |
| Acetyl-CoA / acetoacetyl-CoA | Leu, Lys, Phe, Tyr, Trp, Ile, Thr |

The memorizable core: **only leucine and lysine are purely ketogenic**; **phenylalanine, tyrosine, tryptophan, isoleucine, and threonine are both**; everything else is glucogenic. In starvation, the glucogenic majority is what lets muscle protein prop up blood glucose.

## Special Handling and Broken Steps

The **branched-chain amino acids** (Val, Leu, Ile) are unusual: the liver largely ignores them, and **muscle** degrades them — first a transaminase, then the **branched-chain α-keto acid dehydrogenase**, a multienzyme complex built exactly like pyruvate dehydrogenase (TPP, lipoate, CoA, FAD, NAD⁺). Its deficiency is **maple syrup urine disease**, named for the odor of the accumulating keto acids. One-carbon chemistry runs on three cofactors worth distinguishing: **tetrahydrofolate** (carries one-carbon units at several oxidation levels), **S-adenosylmethionine** (the premium methyl donor), and **tetrahydrobiopterin** (electron donor for aromatic hydroxylases).

That last cofactor stars in the chapter's flagship disease pair. **Phenylketonuria (PKU)**: defective phenylalanine hydroxylase (or, rarely, its biopterin cofactor supply) blocks Phe → Tyr; phenylalanine floods into transamination products like phenylpyruvate, intellectual disability follows untreated, newborn screening catches it, and management is dietary — restrict Phe (including the sweetener aspartame, a Phe dipeptide ester) and supplement Tyr, now effectively essential. **Alkaptonuria**: a block lower in the same degradative path (homogentisate dioxygenase) turns urine dark on standing and stains cartilage — historically the disease from which Garrod coined "inborn errors of metabolism," the founding idea of biochemical genetics.`,
        quiz: [
          {
            question: 'Which pair of amino acids is purely ketogenic in humans?',
            options: [
              'Alanine and glutamate',
              'Leucine and lysine',
              'Phenylalanine and tyrosine',
              'Methionine and valine',
            ],
            correctIndex: 1,
            explanation:
              'Leucine and lysine degrade exclusively to acetyl-CoA/acetoacetyl-CoA, which cannot support net gluconeogenesis. Phenylalanine and tyrosine are both glucogenic AND ketogenic (their skeletons split into fumarate plus acetoacetate); alanine (→ pyruvate), glutamate (→ α-ketoglutarate), methionine and valine (→ succinyl-CoA) are glucogenic.',
          },
        ],
      },
      {
        id: 'bb2_nit_heme',
        title: 'Heme in Outline',
        content: `## Built from an Amino Acid

Heme — the iron-holding porphyrin of hemoglobin, myoglobin, cytochromes, and catalase — is assembled from the simplest amino acid. **δ-Aminolevulinate (ALA) synthase**, a PLP enzyme (PLP again — condensations are its trade too), joins **glycine and succinyl-CoA** in mitochondria; two ALA molecules condense to the pyrrole **porphobilinogen** (by ALA dehydratase); four porphobilinogens assemble into the tetrapyrrole ring, which is decorated and oxidized through several intermediates to protoporphyrin IX; finally **ferrochelatase** inserts Fe²⁺. Control is by heme itself, feedback-inhibiting ALA synthase — supply tracks demand. Two enzymes in this path, ALA dehydratase and ferrochelatase, are inhibited by **lead**, which is why lead poisoning presents with anemia and elevated ALA: a metabolic map question in toxicology clothing.

**Porphyrias** are the partial blocks: deficiencies of pathway enzymes let porphyrin intermediates accumulate, producing episodic abdominal pain and neuropsychiatric symptoms (acute intermittent porphyria, the most common) or photosensitivity in forms where light-reactive intermediates reach the skin.

## Torn Down in Color

Senescent red cells surrender their heme to macrophages, where **heme oxygenase** opens the ring to the green pigment **biliverdin**; reduction gives yellow-orange **bilirubin** — the sequence you have watched in every bruise's green-to-yellow fade. Bilirubin is hydrophobic and travels on serum albumin to the liver, which conjugates it with glucuronate for secretion into bile; gut bacteria finish the conversion to the pigments that color stool and (after reabsorption and renal excretion) urine. When production outruns conjugation or excretion — newborn livers lagging, hemolysis surging, bile ducts blocked, hepatocytes failing — bilirubin accumulates and tissues yellow: **jaundice**, clinically read by which bilirubin form (unconjugated vs conjugated) predominates. Newborn jaundice responds to blue-light phototherapy, which photoisomerizes bilirubin into excretable forms; the iron, meanwhile, is never discarded — it is salvaged and recycled with the parsimony the body applies to all its metals.`,
      },
    ],
    keyTakeaways: [
      'Nitrogen has no storage form: excess amino acids are degraded promptly; catabolism surges after protein meals, in starvation, and in uncontrolled diabetes. Digestion runs on zymogen cascades (pepsin; trypsin as master activator). Excretion strategies: ammonotelic (fish), uricotelic (birds/reptiles), ureotelic (mammals).',
      'Transamination funnels amino groups onto α-ketoglutarate → glutamate; reactions are freely reversible (ΔG′° ≈ 0). ALT and AST are the clinical serum markers of hepatocyte damage.',
      'PLP mechanism: internal aldimine (Lys) → external aldimine (substrate) → electron-sink stabilization of the α-carbanion → amino group parked as PMP; ping-pong kinetics with parallel double-reciprocal lines. PLP also runs decarboxylations, racemizations, and ALA synthase.',
      'Glutamate dehydrogenase (liver mitochondria, NAD⁺ or NADP⁺; ADP activates, GTP inhibits) releases NH₄⁺ — transdeamination. Ammonia is neurotoxic; blood couriers are glutamine (glutamine synthetase/glutaminase; kidney NH₄⁺ buffers acid) and alanine (glucose-alanine cycle shifting nitrogen and gluconeogenic cost to the liver).',
      'Urea cycle: CPS-I (2 ATP; obligatory activator N-acetylglutamate) → citrulline (OTC, matrix) → argininosuccinate (aspartate + ATP → AMP + PPi) → fumarate + arginine → urea + ornithine (arginase, cytosol). Urea\'s nitrogens: one NH₄⁺, one aspartate; carbon from HCO₃⁻.',
      'Cost: 4 phosphoanhydride bonds per urea, offset ~2.5 by NADH from the fumarate → malate → oxaloacetate return (aspartate-argininosuccinate shunt; "Krebs bicycle") → net ≈1.5. Enzyme deficiencies (OTC most common, X-linked) → hyperammonemia; treat with protein restriction, benzoate/phenylbutyrate nitrogen side-exits.',
      'Skeleton entry points: pyruvate, α-KG, succinyl-CoA, fumarate, OAA (glucogenic) vs acetyl-CoA/acetoacetyl-CoA (ketogenic). Only Leu and Lys are purely ketogenic; Phe, Tyr, Trp, Ile, Thr are both. BCAAs are degraded in muscle by a PDH-like complex (MSUD when deficient). PKU (Phe hydroxylase/BH₄; newborn screening; aspartame) and alkaptonuria (Garrod\'s inborn error) mark the Phe pathway.',
      'Heme: glycine + succinyl-CoA → ALA (ALA synthase, PLP; heme feedback) → porphobilinogen → porphyrin → Fe²⁺ inserted by ferrochelatase; lead inhibits ALA dehydratase and ferrochelatase. Porphyrias = partial blocks. Degradation: heme → biliverdin (green) → bilirubin (yellow) → hepatic glucuronide conjugation → bile; overflow = jaundice; phototherapy for newborns.',
    ],
  },

  // ── Biochemistry II.8: Metabolic integration ────────────────────────────
  bb2_integration: {
    topicId: 'bb2_integration',
    title: 'Metabolic Integration',
    domainWeight: '25%',
    overview:
      'Every pathway of the last four chapters runs inside an organism whose first metabolic law is: keep blood glucose near 4–5 mM, whatever it takes. This capstone chapter assembles the system view — the fuel depots and their sizes, what each organ contributes and demands, the four-hormone switchboard (insulin, glucagon, epinephrine, cortisol) that reallocates fuel by the minute and by the week, the fed-to-fasting-to-starvation timeline with its ketone rescue of the brain, the cellular fuel gauges beneath the hormones, and diabetes mellitus as the disease you get when the integration fails. This is the chapter the MCAT draws on for nearly every "a patient has not eaten for X hours/days" passage.',
    sections: [
      {
        id: 'bb2_int_stores',
        title: 'The Setpoint and the Stores',
        content: `## One Number to Defend

Blood glucose is held near **70–100 mg/dL — about 4–5 mM** — because the brain consumes roughly **120 g of glucose per day** (standard values), cannot store meaningful fuel, cannot burn fatty acids (the blood-brain barrier largely excludes them), and claims around a fifth of resting oxygen consumption while representing 2% of body mass. Too little glucose brings confusion, seizure, coma; chronically too much glycates proteins and destroys vessels. The whole endocrine apparatus of this chapter exists to defend that narrow band from both sides.

## Inventory of a 70-kg Adult

| Depot | Mass | Energy (kcal, approx.) | Time at basal (~1,800 kcal/day) |
|-------|------|------------------------|---------------------------------|
| Triacylglycerol (adipose) | ~15 kg | ~140,000 | ~3 months |
| Protein (mostly muscle) | ~6 kg | ~24,000 | usable only partially |
| Glycogen (liver + muscle) | ~0.2 kg | ~900 | well under a day |
| Circulating fuels | ~0.02 kg | ~100 | minutes to an hour |

(Standard tabulated values.) Read the table the way the body does. Glycogen is the checking account: instantly liquid, capable of raising blood glucose (liver share) or fueling sprints (muscle share), and nearly empty within a day of fasting. Fat is the fortune: two orders of magnitude larger, but incapable of becoming net glucose (acetyl-CoA has no road back — the wall of Chapters II.6 and II.7) and useless anaerobically. Protein is a store only in emergencies, because every gram withdrawn was doing a job — enzyme, contractile filament, antibody. Starvation survival therefore has a hard architecture: glucose needs must be shrunk (the ketone adaptation below) so that protein loss slows to the minimum, and death arrives when the fat runs out and protein degradation accelerates terminally. An obese person's larger fat depot extends survival to many months; nobody's glycogen lasts past tomorrow.`,
      },
      {
        id: 'bb2_int_organs',
        title: 'Division of Labor',
        content: `## The Liver: Hub and Buffer

The liver sits on the portal vein, tasting everything absorbed, and is the only organ whose métier is *other organs' needs*. Its glucose sensor is built from parts you know: **GLUT2** (high-capacity, always open) plus **glucokinase** — the high-Km hexokinase isozyme, not product-inhibited — so hepatic glucose phosphorylation rises in proportion to blood glucose instead of saturating (isozyme logic from Chapter I.7 doing physiology). Glucose 6-phosphate then stands at a five-way crossroads: glycogen, glycolysis → acetyl-CoA → fatty acids (exported as VLDL), the pentose phosphate shunt for NADPH, or — via **glucose 6-phosphatase**, the enzyme almost nothing else has — release back to the blood. The liver also runs gluconeogenesis, ketogenesis, the urea cycle, and plasma protein synthesis: every "export" pathway of the preceding chapters is hepatic.

## The Specialists

**Adipose tissue** is the TAG warehouse with a hormonal loading dock (lipoprotein lipase in; hormone-sensitive lipase/perilipin out). It lacks glycerol kinase, so re-esterification needs glucose-derived (or glyceroneogenesis-derived) glycerol 3-phosphate — one reason insulin availability governs fat storage. It is also an endocrine organ (leptin, adiponectin — below). **Muscle** holds the largest glycogen mass but **no glucose 6-phosphatase and no glucagon receptors**: its glycogen is private, for its own contraction, never for blood glucose. Its fuel ladder: phosphocreatine (seconds), glycogen → anaerobic glycolysis → lactate for sprints (the lactate returning via the **Cori cycle** for hepatic reconstruction at liver expense), fatty acids and ketones at rest and in sustained work; hard-working muscle also exports alanine (Chapter II.7). **Heart** is the aerobic purist — packed with mitochondria, preferring fatty acids, intolerant of ischemia. **Brain** takes glucose and, after adaptation, ketone bodies; nothing else in quantity. **Erythrocytes**, having no mitochondria, are obligate glycolytic fermenters — even in oxygen-rich arterial blood they hand the liver a steady lactate stream. **Kidney cortex** runs gluconeogenesis in prolonged fasting (a substantial share of late-starvation glucose) and uses glutamine's ammonia to buffer urine.`,
        quiz: [
          {
            question:
              'During fasting, liver glycogen raises blood glucose but muscle glycogen cannot. Why?',
            options: [
              'Muscle glycogen phosphorylase is inactive during fasting',
              'Muscle lacks glucose 6-phosphatase, so its glucose 6-phosphate cannot be dephosphorylated for export',
              'Muscle glycogen is a structurally different polymer that cannot be phosphorolyzed',
              'Muscle cells lack glucose transporters entirely',
            ],
            correctIndex: 1,
            explanation:
              'Phosphorolysis of glycogen yields glucose 1-phosphate, isomerized to glucose 6-phosphate — and phosphorylated sugars cannot cross membranes. Only tissues with glucose 6-phosphatase — liver (and kidney) — can strip the phosphate and export free glucose. Muscle, lacking the enzyme (and also glucagon receptors), keeps its glycogen for its own glycolysis. This is a top-five MCAT metabolism discrete.',
          },
        ],
      },
      {
        id: 'bb2_int_hormones',
        title: 'The Four-Hormone Switchboard',
        content: `## Insulin: The Fed Signal

The pancreatic **β cell** measures glucose with the same sensor logic as the liver: GLUT2 admits glucose, glucokinase phosphorylates in proportion, glycolysis raises **[ATP]**, ATP closes the **ATP-gated K⁺ channel**, the membrane depolarizes, voltage-gated Ca²⁺ channels open, and Ca²⁺ triggers insulin granule exocytosis — a metabolic state converted directly into an electrical secretion signal (and the mechanism sulfonylurea drugs exploit by closing the K⁺ channel pharmacologically). Insulin's message is **store everything**: GLUT4 transporters move to the surface of muscle and adipose cells; glycogen synthase switches on and phosphorylase off; PFK-2 raises fructose 2,6-bisphosphate, feeding glycolysis; pyruvate dehydrogenase and acetyl-CoA carboxylase turn on lipogenesis; lipoprotein lipase stocks the adipocyte; hormone-sensitive lipase is restrained.

## Glucagon: The Fasting Signal

Falling glucose releases **glucagon** from α cells. Its target is essentially the **liver** (muscle has no receptors): via cAMP → PKA, phosphorylase turns on and glycogen synthase off; fructose 2,6-bisphosphate falls, throttling glycolysis and disinhibiting gluconeogenesis; pyruvate kinase is phosphorylated off; PEP carboxykinase transcription rises; and in adipose tissue lipolysis proceeds. Every arrow is insulin's reversed — the two hormones are a push-pull pair, and the **insulin/glucagon ratio**, more than either level alone, sets the liver's direction.

## Epinephrine and Cortisol: Stress, Fast and Slow

**Epinephrine** is the sprint signal — seconds to minutes: β-adrenergic receptors → cAMP in liver *and* muscle drive glycogenolysis (muscle burning its glycogen in place), adipose lipolysis rises, glucagon secretion is boosted and insulin suppressed. Heart rate, airway dilation, and blood pressure changes travel in the same package: fuel mobilization as one limb of fight-or-flight. **Cortisol** is the siege signal — hours to days, transcriptional: it drives muscle proteolysis and adipose lipolysis to supply the liver with amino acids and glycerol, and induces gluconeogenic enzymes (PEP carboxykinase foremost), raising blood glucose in opposition to insulin. Chronically elevated cortisol therefore phenocopies diabetes — the hyperglycemia of Cushing's syndrome or long glucocorticoid therapy is this table of inductions, made clinical.`,
        quiz: [
          {
            question:
              'Place the β-cell events of glucose-stimulated insulin secretion in correct order.',
            options: [
              'Depolarization → glucose entry → ATP rise → Ca²⁺ influx → exocytosis',
              'Glucose entry via GLUT2 → glycolytic ATP rise → ATP-gated K⁺ channels close → depolarization → Ca²⁺ influx → insulin exocytosis',
              'Ca²⁺ influx → K⁺ channels close → glucose entry → exocytosis → ATP rise',
              'Glucose binds a surface receptor → G protein → cAMP → insulin transcription',
            ],
            correctIndex: 1,
            explanation:
              'The β cell secretes insulin in proportion to its own glucose catabolism: GLUT2 and glucokinase let internal flux track blood glucose, the rising ATP/ADP ratio closes K_ATP channels, depolarization opens voltage-gated Ca²⁺ channels, and Ca²⁺ drives granule fusion. No surface glucose receptor is involved — glucose is sensed by being metabolized. Sulfonylureas act at the K_ATP step; β-cell mitochondrial defects blunt the ATP signal.',
          },
          {
            question:
              'Which hormone raises blood glucose primarily by inducing transcription of gluconeogenic enzymes and promoting muscle protein breakdown over hours to days?',
            options: ['Epinephrine', 'Glucagon', 'Cortisol', 'Insulin'],
            correctIndex: 2,
            explanation:
              'Cortisol is the slow, transcriptional stress hormone: it mobilizes amino acids from muscle and glycerol from fat, and induces gluconeogenic enzymes such as PEP carboxykinase in the liver. Epinephrine acts in seconds via cAMP; glucagon acts in minutes on liver glycogen and fructose 2,6-bisphosphate; both work through phosphorylation of existing enzymes rather than new synthesis.',
          },
        ],
      },
      {
        id: 'bb2_int_timeline',
        title: 'Fed, Fasting, Starving',
        content: `## Hour by Hour, Then Week by Week

**Fed (0–4 h):** insulin dominates. Glucose is oxidized, glycogen written in liver and muscle, surplus carbon exported as VLDL fat; the brain burns glucose; nothing needs mobilizing.

**Post-absorptive to overnight (4–24 h):** blood glucose drifts down; glucagon rises. Liver glycogenolysis carries the load first, but the liver's glycogen is largely spent within about a day. Gluconeogenesis ramps in parallel — from lactate (Cori cycle), alanine (muscle), and glycerol (adipose lipolysis) — while tissues that can burn fat switch over, sparing glucose.

**Early starvation (days 1–4):** fat becomes the principal fuel economy-wide. In the liver, β-oxidation-derived acetyl-CoA piles up as gluconeogenesis drains oxaloacetate, and **ketone body production surges** — blood acetoacetate and β-hydroxybutyrate, nearly absent in the fed state, climb dramatically over days 2–4. Muscle protein is being spent for gluconeogenesis at its fastest rate in this window: the dangerous phase.

**Adapted starvation (weeks):** the brain re-tools its enzymes and draws a large share of its energy from **β-hydroxybutyrate**, slashing the glucose requirement; gluconeogenesis (increasingly renal) slows; urea excretion falls — the visible signature of protein sparing. The organism has converted itself into a fat-burning machine with a minimal glucose sideline. Survival now equals fat reserve: roughly three months for a normal-weight adult, far longer with obesity. When adipose stores are finally exhausted, protein breakdown accelerates terminally — heart and liver muscle included.

![Schematic timeline of fuel use from fed state through six weeks of starvation: liver glycogen covers the first day; gluconeogenesis from amino acids, glycerol, and lactate dominates days 1–4 while ketone bodies rise steeply; from week 1 onward fat plus ketones carry the economy, the brain shifts substantially to β-hydroxybutyrate, and protein loss slows. Schematic — axes not to scale.](/courses/mcat/biochem/bc2-fed-fasting.svg)

One elegant footnote the exam has used: even in starvation the **triacylglycerol cycle** keeps running — a large fraction of released fatty acids is re-esterified, using glycerol 3-phosphate made by **glyceroneogenesis** (an abbreviated gluconeogenesis ending at DHAP) — a seemingly futile loop that in fact lets flux respond instantly in either direction.`,
        quiz: [
          {
            question:
              'After three weeks of total starvation, which fuel supplies the largest share of the brain\'s energy?',
            options: [
              'Glucose from liver glycogen',
              'Free fatty acids crossing the blood-brain barrier',
              'β-Hydroxybutyrate produced by hepatic ketogenesis',
              'Amino acids oxidized directly by neurons',
            ],
            correctIndex: 2,
            explanation:
              'Liver glycogen is exhausted within roughly a day, and the blood-brain barrier keeps fatty acids out in any meaningful quantity. In prolonged starvation the brain adapts to oxidize ketone bodies — chiefly β-hydroxybutyrate — for the majority of its energy, with the remaining glucose need met by gluconeogenesis. This adaptation is what slows muscle protein loss and extends survival to the limit of the fat reserve.',
          },
        ],
      },
      {
        id: 'bb2_int_gauges',
        title: 'The Fuel Gauges Beneath the Hormones',
        content: `## Cell-Level Sensors

Hormones coordinate organs, but each cell also reads its own dials. **AMPK** (AMP-activated protein kinase) is the low-fuel alarm: because the adenylate kinase reaction (2 ADP ⇌ ATP + AMP) makes AMP rise steeply as ATP falls, AMP is the sensitive early indicator, and AMPK responds by phosphorylating targets that shut anabolism off and turn catabolism on — acetyl-CoA carboxylase off (so fatty acid oxidation disinhibits via the malonyl-CoA/CPT1 link), HMG-CoA reductase off, glucose uptake and glycolysis up. Exercise activates it; so do adiponectin and the first-line diabetes drug **metformin**. Its counterpart **mTORC1** integrates the opposite signal — amino acid and energy abundance — and licenses growth and protein synthesis. Think of the pair as the cell's own glucagon and insulin, one tier down.

## Long-Horizon Signals: The Adipostat

Body mass is regulated on a horizon of months by hormones that report on the depots themselves. **Leptin**, secreted by adipocytes in proportion to fat mass, acts on the hypothalamus to promote satiety (via anorexigenic peptides such as α-MSH) and energy expenditure; mice lacking it (*ob/ob*) behave as if perpetually starving — insatiable, obese, insulin-resistant — and injected leptin reverses the phenotype. Its receptor's loss (*db/db*) produces the same picture that leptin cannot fix. In common human obesity, however, leptin is already high — the lesion is **leptin resistance**, which is why leptin therapy disappointed. **Adiponectin** — unusual in falling with obesity — sensitizes muscle and liver to insulin through AMPK. From the gut, **ghrelin** (stomach) spikes before meals as the hunger bell, and **PYY₃₋₃₆** (intestine) rises after meals as the satiety bell; the hypothalamic arcuate nucleus, with its opposed orexigenic (NPY) and anorexigenic (α-MSH) neurons, is where all these signals converge and vote. The MCAT treats this circuitry as a signaling-pathway playground — expect a passage figure, not a memorization contest, but know the direction of each hormone cold.`,
      },
      {
        id: 'bb2_int_diabetes',
        title: 'Diabetes: Integration Failure',
        content: `## Two Diseases, One Name

**Type 1 diabetes** is insulin absence: autoimmune destruction of β cells, typically presenting young. **Type 2** is insulin resistance with eventual relative insufficiency: insulin is present — often initially elevated — but muscle, liver, and adipose respond poorly; it develops slowly, tracks obesity, and accounts for the large majority of cases. A leading mechanistic account of the resistance: when adipose capacity is exceeded, lipid overflows into muscle and liver (**ectopic lipid**), and its intermediates interfere with insulin signaling — the link that makes **metabolic syndrome** (central obesity, hypertension, dyslipidemia, insulin resistance) the antechamber of type 2.

## The Biochemistry of the Crisis

Untreated type 1 is the integration chapters run in reverse. Without insulin, every tissue behaves as if starving while blood glucose stands high: GLUT4 stays internal, so muscle and adipose cannot take glucose up; hepatic gluconeogenesis and glycogenolysis run unopposed, adding more. Above the renal threshold (~10 mM), glucose spills into urine, dragging water — **glucosuria, polyuria, polydipsia**, the classic triad plus weight loss. Meanwhile unrestrained lipolysis floods the liver with fatty acids; ketogenesis runs without a ceiling; and because acetoacetate and β-hydroxybutyrate are moderately strong acids, blood pH falls: **diabetic ketoacidosis**, with its acetone breath and compensatory deep rapid (Kussmaul) breathing driving off CO₂ — an acid-base passage and a metabolism passage in one patient. Note the contrast with starvation ketosis: same pathway, but insulin (even scarce) normally caps it; only its absence uncaps catastrophe.

## Measurement and Management

Diagnosis rests on blood glucose: fasting ≥126 mg/dL (7.0 mM) or a failed oral glucose tolerance test. **Glycated hemoglobin (HbA1c)** — hemoglobin nonenzymatically conjugated to glucose in proportion to ambient concentration over the erythrocyte's ~4-month life — integrates control over weeks, the biochemical flight recorder of the disease. Management maps onto this chapter's machinery: insulin replacement (type 1); for type 2, exercise and diet first (both activate AMPK and GLUT4 trafficking independently of insulin), **metformin** (AMPK activation, hepatic glucose output down), sulfonylureas (close the β-cell K_ATP channel to force secretion), thiazolidinediones (PPARγ agonists expanding adipose storage and glyceroneogenesis, relieving ectopic lipid), and incretin (GLP-1) mimetics; bariatric surgery frequently sends type 2 into remission. Every drug in the list is a handle on a mechanism from Chapters II.1–II.8 — which is precisely why the MCAT loves diabetes.`,
        examTip:
          'For any "patient stopped taking insulin" stem, run the checklist: hyperglycemia (no GLUT4 uptake + unopposed hepatic output), osmotic diuresis and thirst, unrestrained lipolysis → ketogenesis → anion-gap metabolic acidosis with respiratory compensation. Each item is a separately testable question hiding in one vignette.',
        quiz: [
          {
            question:
              'A patient with untreated type 1 diabetes presents with fruity breath, deep rapid breathing, and low blood pH. Which sequence best explains the acidosis?',
            options: [
              'Excess glucose is directly acidic in plasma',
              'Absent insulin permits unrestrained lipolysis and hepatic ketogenesis; accumulating acetoacetate and β-hydroxybutyrate exceed buffering capacity',
              'Lactate from anaerobic glycolysis in oxygen-starved muscle is the sole acid',
              'Urea synthesis consumes bicarbonate faster than the kidney regenerates it',
            ],
            correctIndex: 1,
            explanation:
              'Insulin normally restrains hormone-sensitive lipase and ketogenesis. In its absence, fatty acids flood the liver, β-oxidation outruns the citric acid cycle (oxaloacetate is committed to gluconeogenesis), and ketone bodies are produced without a ceiling. Acetoacetate and β-hydroxybutyrate are acids; their accumulation produces an anion-gap metabolic acidosis, with Kussmaul hyperventilation as respiratory compensation and exhaled acetone as the fruity odor.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'The defended variable: blood glucose 70–100 mg/dL (~4–5 mM). The brain (~120 g glucose/day, ~20% of resting O₂, no fatty acid access) is why. Stores in a 70-kg adult: fat ~15 kg/~140,000 kcal (~3 months), protein ~6 kg (emergency only), glycogen ~0.2 kg (<1 day), circulating fuels (minutes).',
      'Liver = hub: GLUT2 + glucokinase sensor, glucose 6-phosphate crossroads, and the near-exclusive glucose 6-phosphatase; runs gluconeogenesis, ketogenesis, urea cycle, VLDL export. Muscle glycogen is private (no G6Pase, no glucagon receptors); adipose lacks glycerol kinase; heart prefers fatty acids; RBCs are obligate fermenters; kidney gluconeogenesis matters late in starvation.',
      'β-cell secretion mechanism: GLUT2 → glucokinase → ATP↑ → K_ATP closes → depolarization → Ca²⁺ → exocytosis (sulfonylureas close K_ATP directly).',
      'Insulin = store (GLUT4 out, glycogen synthase on, F2,6BP up, ACC on, LPL on, HSL restrained). Glucagon = mobilize, liver-only (phosphorylase on, F2,6BP down, PEPCK induced, pyruvate kinase off). Epinephrine = fast stress (liver + muscle glycogenolysis, lipolysis). Cortisol = slow transcriptional stress (proteolysis, gluconeogenic enzyme induction) — chronic excess phenocopies diabetes.',
      'Timeline: glycogen carries ~day 1; gluconeogenesis from lactate/alanine/glycerol dominates days 1–4 while ketones rise steeply; by weeks, brain runs largely on β-hydroxybutyrate, urea output falls (protein sparing), and survival equals the fat reserve. The TAG/glyceroneogenesis cycle idles even in starvation.',
      'Cell-level gauges: AMPK (AMP-triggered; shuts ACC and HMG-CoA reductase off, catabolism on; activated by exercise, adiponectin, metformin) vs mTORC1 (nutrient abundance → growth). Adipostat: leptin (satiety; ob/ob mice; human obesity = leptin resistance), adiponectin (insulin-sensitizing, falls with obesity), ghrelin (pre-meal hunger), PYY₃₋₃₆ (post-meal satiety), converging on the arcuate nucleus.',
      'Type 1 diabetes = insulin absence (autoimmune); type 2 = insulin resistance (ectopic lipid; metabolic syndrome prelude). DKA logic: no GLUT4 uptake + unopposed hepatic output → hyperglycemia → glucosuria/polyuria; unrestrained lipolysis → uncapped ketogenesis → anion-gap acidosis, Kussmaul breathing, acetone breath.',
      'Measurement and therapy as mechanism review: HbA1c integrates weeks of glycemia; metformin → AMPK; sulfonylureas → K_ATP; TZDs → PPARγ/glyceroneogenesis; GLP-1 mimetics → incretin axis; diet and exercise → AMPK and insulin-independent GLUT4 trafficking.',
    ],
  },
};

/**
 * MCAT Biochemistry II chapters II.1–II.4 — bioenergetics, glycolysis and
 * gluconeogenesis, glycogen and the pentose phosphate pathway, and the
 * citric acid cycle. Chapter plan in docs/mcat/BIOCHEM_CHAPTERS.md.
 * AI-generated. Requires SME review.
 * Depth pass benchmarked against a standard biochemistry textbook
 * (checklist-mediated; all prose original). Tabulated constants are
 * standard reference values.
 */

import type { TopicLesson } from './mcat-course-data';

export const MCAT_BIOCHEM2A_LESSONS: Record<string, TopicLesson> = {
  // ── Biochemistry II.1: Bioenergetics and metabolic logic ────────────────
  bb2_bioenergetics: {
    topicId: 'bb2_bioenergetics',
    title: 'Bioenergetics and Metabolic Logic',
    domainWeight: '25%',
    overview:
      'Every pathway in the metabolism chapters runs on the same accounting system: free energy decides direction, ATP carries purchasing power between reactions, and a small set of electron carriers moves reducing power from fuel to oxygen. The MCAT rewards students who can actually run the numbers — convert a K′eq to a ΔG′°, correct a standard value for real concentrations, chain two reactions through a shared intermediate, and turn a pair of reduction potentials into a verdict. This chapter builds that machinery once, so every later pathway can simply use it.',
    sections: [
      {
        id: 'bb2_be_freeenergy',
        title: 'Free Energy: The Cell’s Bookkeeping',
        content: `## Two Numbers, Two Questions

The direction of any reaction is settled by **ΔG = ΔH − TΔS**: a negative ΔG (exergonic) means the forward direction can proceed and can be harnessed for work; a positive ΔG (endergonic) means the reaction needs outside help; ΔG = 0 means equilibrium — which for a living cell means death, since a system at equilibrium can do no work. Biochemists fix conditions at pH 7, 25 °C, and 1 M for everything else, and call the resulting constant the **standard transformed free-energy change, ΔG′°**. It is locked to the equilibrium constant:

**ΔG′° = −RT·ln K′eq**

so at 25 °C every factor of 10 in K′eq is worth **5.7 kJ/mol** (standard values). Worked once: an isomerase interconverts two phosphosugars, and starting from pure reactant the mixture settles at a 19:1 product-to-reactant ratio. Then K′eq = 19; with RT = 2.48 kJ/mol at 25 °C, ΔG′° = −(2.48)(ln 19) = −(2.48)(2.94) ≈ **−7.3 kJ/mol** — mildly downhill.

## The Correction the Exam Loves

ΔG′° is a catalog constant; the cell runs on the *actual* value:

**ΔG = ΔG′° + RT·ln Q**

where Q is the mass-action ratio, [products]/[reactants], as they truly stand in the cytosol. When Q < K′eq the logarithm term is a discount and the reaction runs forward; when Q > K′eq it is a surcharge and the reaction runs in reverse; when Q = K′eq, ΔG = 0. Two consequences matter everywhere. First, a reaction with a *positive* ΔG′° proceeds happily in vivo whenever downstream enzymes keep siphoning off its product, holding Q tiny — several glycolytic steps work exactly this way. Second, most steps of a pathway idle near ΔG ≈ 0 in the cell whatever their ΔG′°; only a few steps run far from equilibrium, and those are where flux is controlled.

![Computed plot of ΔG = ΔG′° + RT·ln Q at 37 °C for three stated standard values (ΔG′° = +5, 0, and −15 kJ/mol), drawn across Q from 10⁻⁴ to 10⁴ on a log axis: each line crosses ΔG = 0 where Q equals that reaction’s K′eq, showing how concentration ratios can override the standard value’s sign.](/courses/mcat/biochem/bc2-deltag-vs-q.svg)

## Additivity: The License to Couple

Free energy is a state function — it cares only about start and finish, not the route — so ΔG values of sequential reactions **add**. If reaction 1 hands its product to reaction 2, the overall ΔG′° is the sum of the two, and a strongly negative partner can drag a positive one along. This additivity is the entire legal basis for metabolic coupling, and it is why the cell keeps one deeply exergonic reaction — ATP breakdown — on tap as the universal partner.`,
        quiz: [
          {
            question:
              'A glycolytic reaction has ΔG′° = +23.8 kJ/mol, yet it runs briskly in the forward direction in red blood cells. What best explains this?',
            options: [
              'The enzyme lowers ΔG′° for the reaction',
              'Downstream reactions keep product concentrations very low, so Q ≪ K′eq and the actual ΔG is near or below zero',
              'The reaction is coupled directly to ATP hydrolysis',
              'ΔG′° values do not apply to reactions in cells',
            ],
            correctIndex: 1,
            explanation:
              'ΔG = ΔG′° + RT·ln Q. When products are continuously consumed, the mass-action ratio Q stays far below K′eq, the RT·ln Q term is strongly negative, and the in-cell ΔG can be near zero or negative despite a positive standard value. No catalyst changes ΔG′°, and not every unfavorable step needs ATP coupling — concentration management is often enough.',
          },
          {
            question:
              'A reaction reaches equilibrium with K′eq = 100 at 25 °C. Using the rule that each factor of 10 in K′eq corresponds to about 5.7 kJ/mol, what is ΔG′°?',
            options: [
              '+11.4 kJ/mol',
              '−5.7 kJ/mol',
              '−11.4 kJ/mol',
              '0 kJ/mol, because the system reached equilibrium',
            ],
            correctIndex: 2,
            explanation:
              'K′eq = 100 = 10², and ΔG′° = −RT·ln K′eq, so two factors of 10 give 2 × (−5.7) = −11.4 kJ/mol. A K′eq above 1 always means a negative ΔG′°. (Reaching equilibrium makes the actual ΔG zero, not the standard value.)',
          },
        ],
      },
      {
        id: 'bb2_be_atp',
        title: 'Why ATP Is the Currency',
        content: `## The Chemistry Behind the Big Number

ATP is a nucleotide with three phosphates in a row: the innermost joined to ribose by a phosphoester bond, the outer two by **phosphoanhydride** bonds. Splitting the terminal anhydride (ATP → ADP + Pᵢ) has **ΔG′° = −30.5 kJ/mol** (standard value), and the size of that number has four stackable causes:

1. **Electrostatic relief** — at pH 7 ATP carries about four negative charges crowded onto one tail; hydrolysis lets the fragments separate.
2. **Resonance** — free inorganic phosphate spreads its electrons over more equivalent forms than a phosphate locked in an anhydride, so the products are stabilized.
3. **Ionization** — one product immediately releases a proton at pH 7, pulling the reaction further forward.
4. **Solvation** — water hydrates ADP and Pᵢ more effectively than it can hydrate intact ATP.

Just as important is what ATP does *not* do: despite the thermodynamic push, it does not fall apart in water on its own. The uncatalyzed reaction has a high activation barrier, so ATP is **kinetically stable** — its energy is released only when an enzyme opens the gate. A currency that spent itself spontaneously would be useless.

## The Real Exchange Rate: ΔGp

Standard conditions never occur in a cell, so correct the number. In the erythrocyte, [ATP] ≈ 2.25 mM, [ADP] ≈ 0.25 mM, [Pᵢ] ≈ 1.65 mM (standard reference values). At 37 °C:

the mass-action ratio [ADP][Pᵢ]/[ATP] comes to 1.8 × 10⁻⁴, whose natural log is −8.6; with RT = 2.58 kJ/mol at body temperature,

ΔG = −30.5 + (2.58)(−8.6) ≈ −30.5 − 22 ≈ **−52 kJ/mol**

This actual, concentration-corrected value is the **phosphorylation potential, ΔGp**; across tissues it runs about −50 to −65 kJ/mol. The lesson is structural, not numerical: because catabolism holds [ATP] far above its equilibrium level, each ATP spent in vivo delivers substantially more free energy than the standard −30.5 — and building each ATP costs the same premium.

## How the Currency Is Actually Spent

On the exam, "ATP hydrolysis" is usually shorthand. In most coupled reactions the phosphoryl group is not thrown to water but **transferred** — onto a substrate hydroxyl or an enzyme side chain — creating a covalent intermediate that carries the energy into the chemistry. Direct hydrolysis with nothing but heat to show for it is reserved for conformational machines (pumps, motor proteins) and futile-cycle thermogenesis. When a question shows a phosphorylated intermediate, that is coupling done properly: one reaction, one active site, one shared intermediate.`,
        examTip:
          'If an answer choice treats −30.5 kJ/mol as the energy ATP delivers inside a cell, it is bait: the in-cell value (ΔGp) is roughly −50 to −65 kJ/mol precisely because the cell holds the ATP/ADP ratio far from equilibrium.',
        quiz: [
          {
            question:
              'Why is the actual free energy released by ATP breakdown in a living cell larger in magnitude than the standard value of −30.5 kJ/mol?',
            options: [
              'Cellular enzymes lower the activation energy of hydrolysis',
              'Intracellular temperature is higher than 25 °C, which changes ΔG′° itself',
              'The cell maintains [ATP] far above and [ADP] below their equilibrium values, making the RT·ln Q term strongly negative',
              'Mg²⁺ binding to ATP doubles the number of anhydride bonds broken',
            ],
            correctIndex: 2,
            explanation:
              'ΔGp = ΔG′° + RT·ln([ADP][Pᵢ]/[ATP]). Because catabolism keeps the ATP/ADP ratio far from equilibrium, the mass-action ratio is on the order of 10⁻⁴, its logarithm is large and negative, and the actual value lands near −50 to −65 kJ/mol. Enzymes change rates, never ΔG; temperature enters the equation but is not the driver.',
          },
        ],
      },
      {
        id: 'bb2_be_ladder',
        title: 'The Phosphoryl-Transfer Ladder',
        content: `## The Ranking

Every phosphorylated compound can be ranked by the standard free energy released when its phosphoryl group is hydrolyzed off — its **group transfer potential**. The MCAT expects the ladder cold (standard tabulated values):

| Compound | ΔG′° of hydrolysis (kJ/mol) |
|----------|------------------------------|
| Phosphoenolpyruvate (PEP) | −61.9 |
| 1,3-Bisphosphoglycerate | −49.3 |
| ATP → AMP + PPᵢ | −45.6 |
| Phosphocreatine | −43.0 |
| Acetyl-CoA (thioester) | −31.4 |
| ATP → ADP + Pᵢ | −30.5 |
| Glucose 1-phosphate | −20.9 |
| Glucose 6-phosphate | −13.8 |
| Glycerol 3-phosphate | −9.2 |

The structural logic: PEP is high because its hydrolysis product snaps from an unstable enol into a far more stable ketone; 1,3-bisphosphoglycerate carries an acyl phosphate (a carboxylic acid–phosphate anhydride); phosphocreatine gains resonance stabilization on breaking its P–N bond. Low-rung phosphoesters like glucose 6-phosphate have no such escape clause.

## Why the Middle Rung Rules

ATP’s power comes from its **position**, not its size. Sitting midway, it can *accept* a phosphoryl group from anything above it — PEP and 1,3-bisphosphoglycerate phosphorylate ADP during glycolysis (substrate-level phosphorylation), phosphocreatine recharges ADP in sprinting muscle — and *donate* to anything below it, phosphorylating glucose, glycerol, and countless others. A carrier at the top could only give; one at the bottom could only take. The middle rung converts one currency into every denomination.

## Coupling, Worked Honestly

Making glucose 6-phosphate from glucose and free phosphate is uphill: ΔG′° = +13.8 kJ/mol. Hexokinase instead transfers the γ-phosphoryl of ATP directly to glucose in a single active site, and additivity does the rest:

(+13.8) + (−30.5) = **−16.7 kJ/mol**

The overall K′eq rises by a factor of 10^(30.5/5.7) ≈ 2 × 10⁵ relative to the uncoupled reaction — a five-order-of-magnitude equilibrium shift purchased with one ATP. Note what coupling requires: a **common intermediate** (here, the phosphoryl group in flight) shared within one enzyme. Two unrelated reactions running in the same beaker do not couple; energy released as heat in one cannot be collected by the other.`,
        quiz: [
          {
            question:
              'Using ΔG′° of hydrolysis values of −49.3 kJ/mol for 1,3-bisphosphoglycerate and −30.5 kJ/mol for ATP, what is ΔG′° for the transfer: 1,3-bisphosphoglycerate + ADP → 3-phosphoglycerate + ATP?',
            options: [
              '−79.8 kJ/mol',
              '−18.8 kJ/mol',
              '+18.8 kJ/mol',
              '−49.3 kJ/mol',
            ],
            correctIndex: 1,
            explanation:
              'Add the donor’s hydrolysis (−49.3) to the reverse of ATP hydrolysis, i.e., ATP synthesis (+30.5): −49.3 + 30.5 = −18.8 kJ/mol. Transfer from a higher rung to a lower rung is downhill by exactly the gap between them — which is why this glycolytic step phosphorylates ADP spontaneously.',
          },
          {
            question:
              'Which property makes ATP an effective universal phosphoryl-group currency?',
            options: [
              'It has the most negative ΔG′° of hydrolysis of any cellular phosphate compound',
              'Its group transfer potential is intermediate, letting it accept phosphoryl groups from high-potential donors and pass them to low-potential acceptors',
              'It hydrolyzes rapidly in water without enzymes, keeping energy instantly available',
              'Its phosphoester bond to ribose stores most of the usable energy',
            ],
            correctIndex: 1,
            explanation:
              'PEP and 1,3-bisphosphoglycerate rank well above ATP, so ATP is not the top of the ladder — and that is the point: its middle position lets energy flow from catabolic donors through ATP to biosynthetic acceptors. Uncatalyzed hydrolysis is very slow (kinetic stability is a feature), and the energy-relevant bonds are the phosphoanhydrides, not the ester to ribose.',
          },
        ],
      },
      {
        id: 'bb2_be_tenders',
        title: 'Other Tenders: PPᵢ, Thioesters, and the Kinase Trio',
        content: `## The Double-Pull Strategy

For reactions that must be pulled decisively forward, the cell splits ATP the other way: **ATP → AMP + PPᵢ** (ΔG′° = −45.6 kJ/mol), followed by inorganic pyrophosphatase destroying the pyrophosphate, **PPᵢ → 2 Pᵢ** (−19.2 kJ/mol). Chaining both makes the overall process effectively irreversible — the strategy behind fatty acid activation to fatty acyl-CoA and amino acid attachment to tRNA. When a question shows AMP + PPᵢ among the products, read it as "this step was bought at double price to make it one-way," and count it as **two** ATP equivalents in any energy ledger.

## Thioesters: Energy Without Phosphorus

**Acetyl-CoA** stores comparable energy (ΔG′° of hydrolysis = −31.4 kJ/mol) in a carbon–sulfur bond. A thioester enjoys far less resonance stabilization than an ordinary oxygen ester, so it sits high in energy and its acyl group transfers readily — the property that makes coenzyme A the universal acyl carrier of metabolism and lets citrate synthase run forward on the energy of a thioester’s cleavage.

## Three Housekeeping Kinases

- **Adenylate kinase**: 2 ADP ⇌ ATP + AMP. It scavenges a usable ATP from two spent ADPs — and, more importantly, it makes **AMP the cell’s amplified fuel gauge**. Because of this equilibrium, [AMP] varies roughly as the *square* of the [ADP]/[ATP] ratio, so a modest dip in ATP produces a proportionally much larger surge in AMP. That is why so many regulatory enzymes (PFK-1, glycogen phosphorylase, AMP-activated protein kinase) listen to AMP rather than to ADP.
- **Creatine kinase**: phosphocreatine + ADP ⇌ creatine + ATP. Muscle keeps a phosphocreatine reservoir severalfold larger than its ATP pool; during the first seconds of intense contraction this buffer rephosphorylates ADP as fast as it forms, holding [ATP] nearly constant, and the reservoir is refilled from ATP during recovery.
- **Nucleoside diphosphate kinase**: ATP + NDP ⇌ ADP + NTP. Working through a phosphorylated-histidine enzyme intermediate (a ping-pong mechanism), it equalizes the other triphosphates — GTP, UTP, CTP, and the deoxynucleotides — against the ATP pool, which is why energy accounting can treat one GTP as one ATP.`,
        quiz: [
          {
            question:
              'A biosynthetic enzyme releases AMP and PPᵢ rather than ADP and Pᵢ, and a pyrophosphatase rapidly cleaves the PPᵢ. What is the principal advantage of this design?',
            options: [
              'It spends less energy overall than releasing ADP and Pᵢ',
              'It couples the reaction to two successive large free-energy drops, making the overall process essentially irreversible',
              'It regenerates ATP directly without any further enzymes',
              'It avoids consuming the cell’s phosphate reserves',
            ],
            correctIndex: 1,
            explanation:
              'Cleavage to AMP + PPᵢ (−45.6 kJ/mol) followed by hydrolysis of PPᵢ to two phosphates (−19.2 kJ/mol) stacks two exergonic steps behind the synthesis, pulling it decisively forward. The cost is higher, not lower — two ATP equivalents — which is exactly the price of irreversibility in reactions like fatty acyl-CoA and aminoacyl-tRNA formation.',
          },
        ],
      },
      {
        id: 'bb2_be_redox',
        title: 'Redox Carriers: NAD⁺, FAD, and the Electron Ladder',
        content: `## Potentials Are Free Energy in Volts

Catabolism is, at bottom, a controlled transfer of electrons from reduced fuels toward oxygen. Each half-reaction has a **standard reduction potential, E′°**: the more positive, the hungrier that couple is for electrons. Electrons flow spontaneously from lower to higher potential, and the two scales interconvert by

**ΔG′° = −nF·ΔE′°**, with ΔE′° = E′°(acceptor) − E′°(donor) and F = 96.5 kJ/(V·mol)

Key rungs (standard tabulated values): ½O₂/H₂O **+0.816 V**; fumarate/succinate **+0.031 V**; pyruvate/lactate **−0.185 V**; acetaldehyde/ethanol **−0.197 V**; free FAD/FADH₂ about **−0.219 V** (but protein-bound flavins vary widely with their enzyme); NAD⁺/NADH **−0.320 V**; NADP⁺/NADPH **−0.324 V**.

Run the flagship number twice. NADH donating two electrons to oxygen: ΔE′° = 0.816 − (−0.320) = 1.136 V, so ΔG′° = −(2)(96.5)(1.136) ≈ **−220 kJ/mol** — enough, even after losses, to pay for several ATP; this is the sum that oxidative phosphorylation will collect in Chapter II.5. A smaller example: NADH reducing acetaldehyde to ethanol gives ΔE′° = −0.197 − (−0.320) = 0.123 V and ΔG′° = −(2)(96.5)(0.123) ≈ −23.7 kJ/mol.

## The Two Nicotinamides and the Flavins

**NAD⁺** (from niacin, vitamin B3; deficiency causes pellagra) accepts a **hydride** — two electrons and one proton delivered as a unit — leaving the second proton in solution: substrate + NAD⁺ → oxidized product + NADH + H⁺. It works as a diffusible **cosubstrate**, shuttling between hundreds of dehydrogenases. **FAD and FMN** (from riboflavin, B2) are usually **prosthetic groups**, tightly and sometimes covalently bound, and can accept electrons **one or two at a time** — the adaptor property that lets flavoproteins mediate between two-electron dehydrogenations and one-electron carriers, with an effective potential tuned by the host protein.

![The nicotinamide business end of the coenzyme: NAD⁺ (aromatic pyridinium, oxidized) and NADH (1,4-dihydronicotinamide, reduced) side by side, with the C4 hydride position marked; R stands for the ADP-ribose of the full dinucleotide — this shows the reactive fragment, not the whole molecule. Structures rendered from the molecular graph (RDKit); formulas machine-verified.](/courses/mcat/biochem/bcs-nad-redox.svg)

**NADP⁺** differs from NAD⁺ by one extra phosphate — chemically trivial, organizationally decisive. Dehydrogenases read the tag: catabolic enzymes hand electrons to NAD⁺, and the cell keeps NAD⁺ mostly oxidized, ready to collect. Biosynthetic reductases draw from NADPH, which the cell keeps mostly reduced, ready to spend. One electron economy, two ledgers — collections and disbursements — so that oxidation of fuels and reduction of building blocks can both run at full speed in the same cytosol.`,
        examTip:
          'Potential problems are two-step, every time: ΔE′° = E′°(acceptor) − E′°(donor), then ΔG′° = −nF·ΔE′°. A positive ΔE′° means a negative ΔG′° — spontaneous. Do not flip half-reaction signs; the subtraction handles direction.',
        quiz: [
          {
            question:
              'Succinate is oxidized to fumarate (E′° for fumarate/succinate = +0.031 V). Why does the responsible enzyme use FAD rather than NAD⁺ (E′° for NAD⁺/NADH = −0.320 V) as the electron acceptor?',
            options: [
              'NAD⁺ can only accept single electrons, and this reaction transfers two',
              'Transfer to NAD⁺ would have ΔE′° = −0.351 V, giving a large positive ΔG′° (about +68 kJ/mol); enzyme-bound FAD’s tuned potential makes the transfer feasible',
              'FAD is more abundant in mitochondria than NAD⁺',
              'The reaction is a hydration, which only flavins can catalyze',
            ],
            correctIndex: 1,
            explanation:
              'For NAD⁺ as acceptor, ΔE′° = −0.320 − (+0.031) = −0.351 V, so ΔG′° = −2(96.5)(−0.351) ≈ +68 kJ/mol — prohibitively uphill. The succinate couple sits too high for NAD⁺ to drain. A bound flavin, its potential adjusted by the protein, can take the electrons. NAD⁺ in fact accepts electron pairs (as hydride); the issue is thermodynamic, not electron count.',
          },
          {
            question:
              'Which statement correctly contrasts NADH and NADPH?',
            options: [
              'NADH powers biosynthetic reductions; NADPH delivers electrons to the respiratory chain',
              'NADH is kept mostly oxidized as NAD⁺ to collect electrons from catabolism, while the NADPH pool is kept mostly reduced to supply biosynthesis',
              'They differ in the number of electrons carried per molecule',
              'NADPH is a tightly bound prosthetic group, whereas NADH diffuses freely',
            ],
            correctIndex: 1,
            explanation:
              'The extra phosphate on NADP⁺ is a routing tag, not a chemical difference: both carry a hydride (two electrons). The cell maintains a high [NAD⁺]/[NADH] ratio so catabolic dehydrogenases always find an acceptor, and a high [NADPH]/[NADP⁺] ratio so reductive biosynthesis always finds a donor. Both nicotinamides act as diffusible cosubstrates.',
          },
        ],
      },
      {
        id: 'bb2_be_logic',
        title: 'Catabolism and Anabolism: Opposing One-Way Streets',
        content: `## The Map

Catabolic routes **converge**: hundreds of fuels funnel into a handful of intermediates — pyruvate, acetyl-CoA, citric acid cycle acids — while ATP and NADH are collected. Anabolic routes **diverge** from those same few hubs outward into thousands of products, spending ATP and NADPH. The hub metabolites are shared; the streets connecting them are not.

## Why Paired Pathways Are Never Mirror Images

If synthesis and breakdown of a metabolite used one reversible route, both directions would idle at equilibrium and flux could not be controlled — running both at once would only burn ATP. So evolution repeats one design everywhere, and the exam tests it relentlessly:

- **Shared near-equilibrium steps** are catalyzed by the same enzymes in both directions; they are thermodynamically cheap to reverse.
- **The irreversible steps differ.** Each direction has its own far-from-equilibrium reactions catalyzed by dedicated enzymes — the paired pathways are reciprocally, never identically, equipped (glycolysis vs gluconeogenesis in Chapter II.2 is the canonical case).
- **Regulation is reciprocal.** The signal that opens one direction closes the other, usually via the same allosteric effector or the same hormone-driven phosphorylation acting oppositely on the two dedicated enzymes.
- **Compartments separate conflicts.** When reciprocal regulation is not enough, the cell puts the two directions in different rooms — fatty acid breakdown in the mitochondrion, fatty acid synthesis in the cytosol.

Layered over all of it are the two currency conventions from this chapter: energy state is read through adenine nucleotides (with AMP the amplified alarm), and electron traffic is split between the NAD⁺ ledger (catabolic) and the NADPH ledger (anabolic). Keep the framework; the next chapters are its case studies.`,
        importantNote:
          'Control points and thermodynamics travel together: allosteric regulation and hormonal control land on the far-from-equilibrium steps, because pushing on a near-equilibrium reaction changes nothing. If a question asks where a pathway is regulated, find the irreversible steps.',
        quiz: [
          {
            question:
              'Which feature is characteristic of a catabolic pathway and its opposing anabolic pathway in the same cell?',
            options: [
              'They share every enzyme, running forward or backward as needed',
              'They share the near-equilibrium steps but use distinct enzymes at the irreversible steps, which are regulated reciprocally',
              'They never share any enzymes or intermediates',
              'Both use NADPH as the electron carrier to keep redox balanced',
            ],
            correctIndex: 1,
            explanation:
              'Paired pathways reuse the cheap, reversible steps and diverge exactly where the thermodynamics is steep: each direction gets its own irreversible, dedicated enzymes, and regulation concentrates there with opposite signs. Catabolism reduces NAD⁺; anabolism spends NADPH — the carriers are deliberately not shared.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'ΔG = ΔH − TΔS decides direction; ΔG′° = −RT·ln K′eq (5.7 kJ/mol per factor of 10 at 25 °C); the in-cell value is ΔG = ΔG′° + RT·ln Q — low Q lets positive-ΔG′° reactions run forward, and most pathway steps idle near ΔG ≈ 0.',
      'Free energies of sequential reactions add (state function), which licenses coupling through a common intermediate on one enzyme — hexokinase: +13.8 − 30.5 = −16.7 kJ/mol, an equilibrium shift of ~2 × 10⁵.',
      'ATP → ADP + Pᵢ has ΔG′° = −30.5 kJ/mol (charge relief, product resonance, ionization, solvation) but is kinetically stable; the actual phosphorylation potential ΔGp ≈ −50 to −65 kJ/mol (erythrocyte worked value ≈ −52) because ATP is held far from equilibrium.',
      'Transfer-potential ladder (ΔG′° hydrolysis, kJ/mol): PEP −61.9 > 1,3-BPG −49.3 > ATP→AMP+PPᵢ −45.6 > phosphocreatine −43.0 > acetyl-CoA −31.4 ≈ ATP→ADP −30.5 > glucose 1-P −20.9 > G6P −13.8 > glycerol 3-P −9.2. ATP’s middle rung lets it accept from above (substrate-level phosphorylation) and donate below.',
      'Irreversibility is bought with the AMP + PPᵢ split (−45.6) plus pyrophosphatase (−19.2) — two ATP equivalents — as in fatty acyl-CoA and aminoacyl-tRNA synthesis; thioesters (acetyl-CoA, −31.4) store energy without phosphate via poor resonance stabilization.',
      'Kinase trio: adenylate kinase (2 ADP ⇌ ATP + AMP) makes AMP the squared, amplified fuel gauge; creatine kinase buffers muscle ATP from the phosphocreatine reservoir; nucleoside diphosphate kinase (phospho-His ping-pong) equalizes GTP/UTP/CTP with ATP.',
      'Redox: ΔG′° = −nF·ΔE′° with ΔE′° = acceptor minus donor; NADH → O₂ spans 1.136 V ≈ −220 kJ/mol. Ladder rungs: O₂ +0.816, fumarate +0.031, pyruvate −0.185, FAD (free) −0.219, NAD⁺ −0.320, NADP⁺ −0.324 V.',
      'NAD⁺ (niacin; pellagra) takes a hydride as a diffusible cosubstrate; FAD/FMN (riboflavin) are prosthetic groups handling 1 or 2 e⁻ with protein-tuned potentials; the NAD⁺ pool is kept oxidized for catabolism while NADPH is kept reduced for biosynthesis.',
      'Opposing pathways share reversible steps, differ at irreversible ones, are reciprocally regulated there, and are sometimes compartmentally separated — regulation always lives at the far-from-equilibrium steps.',
    ],
  },

  // ── Biochemistry II.2: Glycolysis and its mirror ────────────────────────
  bb2_glycolysis: {
    topicId: 'bb2_glycolysis',
    title: 'Glycolysis and Its Mirror',
    domainWeight: '25%',
    overview:
      'Glycolysis is the one pathway the MCAT expects you to know step by step — not as ten memorized names but as a design: an investment phase that spends ATP to trap and destabilize glucose, and a payoff phase that collects the return twice over. This chapter walks the chemistry in functional-group terms, installs the regulation at all three control points with every named effector, then builds the mirror image: gluconeogenesis and why it cannot be simple reversal, the Cori cycle that links muscle to liver, and fermentation — the ancient trick that keeps glycolysis running without oxygen.',
    sections: [
      {
        id: 'bb2_gly_shape',
        title: 'The Shape of the Pathway',
        content: `## One Sentence, Then the Ledger

Ten cytosolic enzymes convert one glucose (6C) into two pyruvates (3C each), conserving part of the released energy. The books must balance exactly:

**Glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 pyruvate + 2 NADH + 2 H⁺ + 2 ATP + 2 H₂O**

The pathway divides cleanly in half. The **preparatory (investment) phase** (steps 1–5) spends **2 ATP** to phosphorylate the hexose twice, then splits it into two interconvertible triose phosphates. The **payoff phase** (steps 6–10) runs twice per glucose, and each pass earns 1 NADH and 2 ATP. Gross: 4 ATP made. Net: 4 − 2 = **2 ATP**, plus 2 NADH whose value depends on where their electrons end up (Chapter II.5). Recompute from the other direction as a check: 2 substrate-level phosphorylations per triose × 2 trioses = 4 ATP earned; 2 ATP sunk at steps 1 and 3; net +2. ✓

![Schematic two-phase ledger of glycolysis: the investment phase spends 2 ATP to reach fructose 1,6-bisphosphate, aldol cleavage yields two triose phosphates, and the payoff phase — run twice — returns 4 ATP and 2 NADH, for a net of 2 ATP and 2 NADH per glucose. Diagram is schematic; quantities per glucose are exact.](/courses/mcat/biochem/bc2-glycolysis-ledger.svg)

## Why Phosphorylate First

Three reasons the cell pays before it earns. **Containment:** phosphorylated intermediates carry charge, and no plasma-membrane transporter recognizes them — glucose 6-phosphate is committed to staying. **Energy capture:** the phosphoryl groups installed early become the very groups handed to ADP later; the investment is collateral, not a fee. **Recognition:** the phosphate is a binding handle that active sites grip (recall triose phosphate isomerase earning most of its catalysis from that handle).

Glycolysis is also the universal fallback: it is the only ATP source in cells without mitochondria (erythrocytes), the dominant one in hypoxic tissue and sprinting muscle, and it runs identically whether or not oxygen is present — oxygen only decides what happens to the pyruvate and NADH afterward.`,
        quiz: [
          {
            question:
              'Per molecule of glucose, glycolysis produces which net yield?',
            options: [
              '4 ATP and 2 NADH',
              '2 ATP and 2 NADH',
              '2 ATP and 4 NADH',
              '36 ATP',
            ],
            correctIndex: 1,
            explanation:
              'Four ATP are generated in the payoff phase (two per triose phosphate, and each glucose yields two trioses), but the investment phase consumed two, leaving a net of 2 ATP. One NADH is produced per triose at the glyceraldehyde 3-phosphate dehydrogenase step, giving 2 NADH per glucose. Larger totals require mitochondrial oxidation of pyruvate and NADH.',
          },
        ],
      },
      {
        id: 'bb2_gly_steps',
        title: 'The Ten Steps in Functional Groups',
        content: `## The Table to Own

| # | Enzyme | Transformation | ΔG′° (kJ/mol) |
|---|--------|----------------|----------------|
| 1 | Hexokinase | Glucose → glucose 6-P (ATP spent) | −16.7 |
| 2 | Phosphoglucose isomerase | Aldose → ketose (G6P ⇌ F6P) | +1.7 |
| 3 | Phosphofructokinase-1 | F6P → fructose 1,6-bisP (ATP spent) | −14.2 |
| 4 | Aldolase | C6 → DHAP + glyceraldehyde 3-P | +23.8 |
| 5 | Triose phosphate isomerase | DHAP ⇌ GAP | +7.5 |
| 6 | GAPDH | GAP + Pᵢ + NAD⁺ ⇌ 1,3-BPG + NADH | +6.3 |
| 7 | Phosphoglycerate kinase | 1,3-BPG + ADP ⇌ 3-PG + ATP | −18.8 |
| 8 | Phosphoglycerate mutase | 3-PG ⇌ 2-PG | +4.4 |
| 9 | Enolase | 2-PG ⇌ PEP + H₂O | +7.5 |
| 10 | Pyruvate kinase | PEP + ADP → pyruvate + ATP | −31.4 |

(Standard values; erythrocyte in-cell ΔG differs — see below.)

## The Logic, Not the List

**Steps 1–3** are trap-and-arm: phosphorylate, isomerize, phosphorylate again. The isomerization is not busywork — moving the carbonyl from C-1 to C-2 creates a hydroxyl at C-1 for the second phosphorylation and positions the carbonyl so **step 4** can break the C-3–C-4 bond by a retro-aldol, yielding two 3-carbon pieces that **step 5** makes interchangeable, so the whole molecule proceeds down one payoff line.

![Investment-phase structures in pathway order: glucose, glucose 6-phosphate, fructose 6-phosphate, fructose 1,6-bisphosphate, and the two triose phosphates DHAP and glyceraldehyde 3-phosphate. Sugars drawn open-chain and all species as free acids (in the cell every phosphate is ionized). Structures rendered from the molecular graph (RDKit); formulas machine-verified.](/courses/mcat/biochem/bcs-glycolysis-invest.svg)

**Step 6** is the energetic heart: an aldehyde is oxidized to a carboxylic acid level, but instead of releasing that energy as heat, the enzyme (via a covalent thioester intermediate on an active-site cysteine) attaches inorganic phosphate to form an **acyl phosphate** — a top-rung donor from Chapter II.1 — while NAD⁺ collects the electrons. **Step 7** immediately cashes it: substrate-level phosphorylation of ADP. **Steps 8–9** are a repositioning and a dehydration that concentrate the remaining potential into PEP’s enol phosphate, and **step 10** cashes that too.

![Payoff-phase structures in pathway order: glyceraldehyde 3-phosphate, 1,3-bisphosphoglycerate with its C-1 acyl phosphate, 3-phosphoglycerate, 2-phosphoglycerate, phosphoenolpyruvate, and pyruvate. All species drawn as free acids (physiological forms are the anions). Structures rendered from the molecular graph (RDKit); formulas machine-verified.](/courses/mcat/biochem/bcs-glycolysis-payoff.svg)

## Reading the Thermodynamics

In red blood cells, seven of the ten steps run with ΔG near zero — freely reversible, poised at equilibrium, unregulatable. Aldolase is the showcase: ΔG′° = +23.8 kJ/mol looks forbidding, yet the in-cell value is roughly zero because downstream consumption keeps triose phosphate concentrations tiny (the RT·ln Q rescue from Chapter II.1). Only steps **1, 3, and 10** are far from equilibrium in vivo — the three one-way doors, and therefore the only three places worth regulating.`,
        examTip:
          'Substrate-level phosphorylation means ADP is phosphorylated by a high-potential organic donor on an enzyme — steps 7 and 10 here, succinyl-CoA synthetase in the citric acid cycle. No membrane, no proton gradient, no oxygen required.',
        quiz: [
          {
            question:
              'Which glycolytic step is an oxidation, and what couples its energy to ATP production?',
            options: [
              'Step 10 (pyruvate kinase): PEP is oxidized as its phosphate transfers to ADP',
              'Step 6 (glyceraldehyde 3-phosphate dehydrogenase): the aldehyde is oxidized with NAD⁺ while inorganic phosphate is captured as an acyl phosphate, which step 7 then transfers to ADP',
              'Step 3 (PFK-1): fructose 6-phosphate is oxidized during phosphorylation',
              'Step 9 (enolase): dehydration oxidizes 2-phosphoglycerate',
            ],
            correctIndex: 1,
            explanation:
              'GAPDH is the pathway’s only oxidation: NAD⁺ removes electrons as the aldehyde rises to the carboxyl level, and the energy is trapped by attaching Pᵢ (not ATP’s phosphate) as 1,3-bisphosphoglycerate’s acyl phosphate. Phosphoglycerate kinase then performs substrate-level phosphorylation. Kinase steps and the enolase dehydration involve no change in oxidation state.',
          },
          {
            question:
              'Aldolase has ΔG′° = +23.8 kJ/mol, yet the reaction proceeds forward continuously in cells. The best explanation is that:',
            options: [
              'the enzyme couples the cleavage to ATP hydrolysis',
              'cells maintain very low concentrations of the triose phosphate products, so the actual ΔG is near zero',
              'the reaction does not occur in vivo; cells use a different route',
              'ΔG′° is irrelevant for enzyme-catalyzed reactions',
            ],
            correctIndex: 1,
            explanation:
              'Triose phosphate isomerase and GAPDH continuously drain the products, holding Q far below K′eq; the RT·ln Q term then cancels the positive standard value, and in erythrocytes the measured in-cell ΔG for aldolase is close to zero. No ATP is involved, and ΔG′° remains meaningful — it simply is not the in-cell value.',
          },
        ],
      },
      {
        id: 'bb2_gly_regulation',
        title: 'The Three Control Points, with Every Named Effector',
        content: `## Hexokinase: The Gate

Hexokinase I–III (most tissues) is **feedback-inhibited by its own product, glucose 6-phosphate**: if downstream flux stalls, G6P backs up and the gate closes, sparing both ATP and glucose. The liver runs a different isozyme, **glucokinase (hexokinase IV)** — half-saturating near 10 mM glucose (versus ~0.05 mM for hexokinase I), *not* inhibited by G6P, and sequestered in the nucleus by a regulatory protein when glucose is scarce. The result is a proportional glucose sensor: the liver phosphorylates glucose in earnest only when blood glucose is high, exactly the isozyme logic from Chapter I.7.

## PFK-1: The Main Valve

Phosphofructokinase-1 catalyzes the **committed step** — fructose 1,6-bisphosphate has no fate but glycolysis — and reads four signals:

- **ATP** (inhibitor, at an allosteric site distinct from the substrate site): energy abundance closes the valve.
- **AMP and ADP** (activators): the adenylate kinase–amplified alarm reopens it.
- **Citrate** (inhibitor): a full citric acid cycle reports "biosynthetic precursors covered," reinforcing ATP’s inhibition.
- **Fructose 2,6-bisphosphate** (activator, and the strongest): at ~0.13 µM it drops PFK-1’s half-saturation for F6P roughly 25-fold (about 2 mM → 0.08 mM) and blunts ATP’s inhibition; without it, liver PFK-1 is nearly silent.

F2,6BP is a pure regulatory molecule — not a glycolytic intermediate — made and destroyed by one **bifunctional enzyme** (PFK-2/FBPase-2). **Glucagon**, via cAMP → PKA phosphorylation, switches the protein to its phosphatase mode: F2,6BP falls, glycolysis slows, gluconeogenesis accelerates. **Insulin** drives dephosphorylation, restoring kinase mode and glycolysis. One phosphorylation, one shared allosteric messenger, both pathways flipped in opposite directions.

## Pyruvate Kinase: The Exit

The last step is governed three ways: **fructose 1,6-bisphosphate feeds forward** (product of the valve activates the exit, so intermediates never pool), **ATP and alanine inhibit** (energy sufficiency, and alanine as a "pyruvate is being used for gluconeogenesis" signal in liver), and the **liver isozyme is switched off by PKA phosphorylation** under glucagon — so during fasting the liver shuts its own glycolytic exit while muscle, whose isozyme lacks the phosphorylation control, keeps burning glucose.`,
        quiz: [
          {
            question:
              'During fasting, glucagon signaling lowers fructose 2,6-bisphosphate levels in hepatocytes. The direct consequence is:',
            options: [
              'PFK-1 activation and FBPase-1 inhibition, accelerating glycolysis',
              'loss of PFK-1’s strongest activator and relief of FBPase-1 inhibition, slowing glycolysis and favoring gluconeogenesis',
              'increased glucokinase activity and glycogen synthesis',
              'allosteric activation of pyruvate kinase by ATP',
            ],
            correctIndex: 1,
            explanation:
              'F2,6BP activates PFK-1 and inhibits FBPase-1. PKA phosphorylation of the bifunctional PFK-2/FBPase-2 (downstream of glucagon and cAMP) tips it toward phosphatase activity, so F2,6BP falls: PFK-1 loses its key activator while FBPase-1 is disinhibited — glycolysis off, gluconeogenesis on, glucose exported. ATP inhibits (never activates) pyruvate kinase.',
          },
          {
            question:
              'Hexokinase I and glucokinase (hexokinase IV) differ in that glucokinase:',
            options: [
              'has a lower Km for glucose and is strongly inhibited by glucose 6-phosphate',
              'is found mainly in muscle and is activated by AMP',
              'is half-saturated only near 10 mM glucose and escapes product inhibition, letting the liver scale glucose uptake with blood glucose',
              'phosphorylates fructose rather than glucose',
            ],
            correctIndex: 2,
            explanation:
              'Glucokinase’s high half-saturation point (~10 mM, near and above fasting blood glucose) and freedom from G6P feedback let hepatic glucose phosphorylation rise in proportion to supply — a sensor-and-buffer role. Hexokinase I (Km ≈ 0.05 mM) is saturated at any physiological glucose level and is product-inhibited, suiting tissues that consume glucose steadily.',
          },
        ],
      },
      {
        id: 'bb2_gly_mirror',
        title: 'Gluconeogenesis: The Mirror That Is Not a Reversal',
        content: `## Seven Shared Steps, Three New Doors

The brain and red blood cells demand glucose continuously; between meals the liver (with help from kidney cortex and small intestine) manufactures it from lactate, pyruvate, glycerol, and glucogenic amino acids. Seven glycolytic reactions — the near-equilibrium ones — simply run backward. The three one-way doors (steps 1, 3, 10) cannot; each is **bypassed** by dedicated, oppositely-irreversible chemistry:

**Bypass 1 (around pyruvate kinase):** two steps. In the mitochondrion, **pyruvate carboxylase** (biotin prosthetic group, CO₂ carrier) spends 1 ATP to carboxylate pyruvate to oxaloacetate — and it is essentially inactive without its obligatory allosteric activator, **acetyl-CoA**. Oxaloacetate cannot cross the inner membrane; it leaves as malate (conveniently carrying reducing equivalents out, since gluconeogenesis will need cytosolic NADH at the reversed GAPDH step). In the cytosol, **PEP carboxykinase** spends 1 GTP and releases the just-added CO₂, and the decarboxylation’s free-energy drop powers PEP formation — carboxylate to activate, decarboxylate to drive, a motif that recurs in fatty acid synthesis.

**Bypass 2:** **fructose 1,6-bisphosphatase (FBPase-1)** hydrolyzes the C-1 phosphate — no ATP is recovered; the phosphate leaves as Pᵢ.

**Bypass 3:** **glucose 6-phosphatase** — resident within the ER lumen and expressed only by liver, kidney, and small intestine — hydrolyzes G6P to free, exportable glucose. Muscle and brain lack it — muscle glycogen can never directly feed blood glucose.

## The Bill, Computed Twice

Per glucose from two pyruvates: pyruvate carboxylase 2 ATP + PEPCK 2 GTP + reversed phosphoglycerate kinase 2 ATP = **4 ATP + 2 GTP (6 NTP), plus 2 NADH** re-oxidized at reversed GAPDH. Check against glycolysis: breaking that glucose back down would recover only 2 ATP, so a full round trip costs 6 − 2 = 4 NTP. That 4-NTP overhead is not waste — it is what makes *both* directions thermodynamically decisive, and it is why running both at once (a futile cycle) is guarded against by the reciprocal controls above: F2,6BP and AMP each activate PFK-1 while inhibiting FBPase-1, and acetyl-CoA activates pyruvate carboxylase while (Chapter II.4) inhibiting pyruvate oxidation.

## What Can and Cannot Become Glucose

Lactate, alanine, glycerol (entering as dihydroxyacetone phosphate), and most amino acid skeletons are glucogenic. **Acetyl-CoA is not**: pyruvate dehydrogenase is irreversible, and no animal pathway rebuilds pyruvate from 2-carbon units — both acetyl carbons leave the citric acid cycle as CO₂ before oxaloacetate is regenerated. Hence the exam’s favorite verdict: even-chain fatty acids cannot yield net glucose in animals (plants and bacteria, with the glyoxylate shortcut, can).`,
        quiz: [
          {
            question:
              'Why can acetyl-CoA derived from fatty acid breakdown not support net glucose synthesis in humans?',
            options: [
              'Acetyl-CoA cannot enter the mitochondrion where gluconeogenesis begins',
              'The PDH reaction is irreversible and the citric acid cycle releases two CO₂ per acetyl group before regenerating oxaloacetate, so no net carbon is gained toward pyruvate or oxaloacetate',
              'Fatty acid oxidation consumes all cellular ATP, leaving none for gluconeogenesis',
              'Acetyl-CoA allosterically inhibits pyruvate carboxylase',
            ],
            correctIndex: 1,
            explanation:
              'There is no animal route from 2-carbon units back to pyruvate: PDH cannot run backward, and although acetyl-CoA’s carbons enter the cycle, two carbons are lost as CO₂ per turn, so oxaloacetate is only regenerated, never net-synthesized, from acetyl-CoA. Acetyl-CoA in fact activates pyruvate carboxylase — it directs pyruvate toward gluconeogenesis rather than blocking it.',
          },
          {
            question:
              'Which enzyme pair constitutes the first gluconeogenic bypass, and what does each consume?',
            options: [
              'Pyruvate carboxylase (1 ATP, biotin) then PEP carboxykinase (1 GTP), via oxaloacetate',
              'Pyruvate kinase run in reverse (1 ATP) then enolase (1 GTP)',
              'PEP carboxykinase (1 ATP) then pyruvate carboxylase (1 GTP), via malate',
              'Glucose 6-phosphatase (no nucleotide) then FBPase-1 (1 ATP)',
            ],
            correctIndex: 0,
            explanation:
              'Pyruvate → oxaloacetate (pyruvate carboxylase; biotin-dependent carboxylation; 1 ATP; requires acetyl-CoA as activator; mitochondrial) followed by oxaloacetate → PEP (PEP carboxykinase; 1 GTP; decarboxylation drives phosphorylation). Doubled per glucose, this bypass accounts for 2 ATP + 2 GTP of the 6-NTP total; the other two phosphatase bypasses spend no nucleotides at all.',
          },
        ],
      },
      {
        id: 'bb2_gly_cori',
        title: 'The Cori Cycle',
        content: `## Muscle Borrows, Liver Repays

A sprinting muscle outruns its oxygen supply and ferments glucose to lactate, netting 2 ATP per glucose. That lactate is not a dead end: it diffuses into the blood, and the liver — well-oxygenated and enzymatically equipped — oxidizes it back to pyruvate (lactate dehydrogenase running in reverse, feasible because hepatic NADH/NAD⁺ and lactate levels differ from muscle’s), then spends 6 NTP rebuilding glucose, which returns by blood to the muscle. This loop of carbon — muscle glycolysis, liver gluconeogenesis — is the **Cori cycle**.

Audit the whole loop: muscle gains 2 ATP; liver spends 6 NTP; the body as a whole is out 4 NTP per glucose cycled. The arrangement is an energy transfer disguised as carbon recycling — the liver, burning fatty acids to fund its NTP outlay, effectively lends the anaerobic muscle its oxidative capacity. The elevated post-exercise oxygen consumption ("oxygen debt") is partly the liver settling this account. Erythrocytes, lacking mitochondria entirely, ride the same loop constantly, and the alanine cycle runs a parallel route with the amino group along for the ride (Chapter II.7).

Clinically, the loop explains **lactic acidosis** in shock and hypoperfusion: when whole-body oxygen delivery fails, every tissue becomes a lactate producer and the liver — itself hypoxic — cannot clear it, so lactate and protons accumulate faster than they can be recycled.`,
        quiz: [
          {
            question:
              'Per glucose carried once around the Cori cycle, the net energy result for the body is:',
            options: [
              'a gain of 2 ATP, since muscle glycolysis produces ATP',
              'energy-neutral, since the liver recovers what muscle spends',
              'a net cost of about 4 NTP: muscle gains 2 ATP but the liver spends 6 NTP remaking the glucose',
              'a net cost of 6 NTP borne equally by muscle and liver',
            ],
            correctIndex: 2,
            explanation:
              'Muscle ferments glucose to 2 lactate (+2 ATP); hepatic gluconeogenesis from 2 lactate costs 4 ATP + 2 GTP (6 NTP). The loop therefore runs at a 4-NTP whole-body deficit per turn — a price worth paying because it shifts the energetic burden from the anaerobic, working muscle onto the aerobic liver.',
          },
        ],
      },
      {
        id: 'bb2_gly_fermentation',
        title: 'Fermentation: Paying the NAD⁺ Bill',
        content: `## The Imperative

Glycolysis has one nonnegotiable dependency: step 6 consumes NAD⁺, and the cytosolic NAD⁺ pool is tiny. Without a way to reoxidize NADH, glycolysis halts within seconds — not for lack of glucose or ADP, but for lack of an electron acceptor. With oxygen, mitochondria regenerate NAD⁺ (via shuttles; Chapter II.5). Without oxygen, the cell must dump the electrons onto an organic molecule it already has — pyruvate. That is all fermentation is: **glycolysis plus an NADH-disposal step**, with no additional ATP and no net change in oxidation state between glucose and the final products.

## Two Classic Routes

**Lactic acid fermentation:** lactate dehydrogenase transfers NADH’s hydride to pyruvate’s carbonyl, yielding L-lactate (ΔG′° = −25.1 kJ/mol; standard value). Balance sheet per glucose: 2 ATP, 2 lactate, NAD⁺ fully regenerated — sustainable exactly as long as glucose lasts. This is the route of working muscle, erythrocytes, the lens, and renal medulla.

**Ethanol fermentation** (yeast, not humans): **pyruvate decarboxylase** — thiamine pyrophosphate (TPP) and Mg²⁺ dependent — removes CO₂ from pyruvate to give acetaldehyde, the first appearance of TPP’s signature chemistry: stabilizing a carbanion-like intermediate during a bond break adjacent to a carbonyl. **Alcohol dehydrogenase** then reduces acetaldehyde to ethanol, regenerating NAD⁺. Humans lack pyruvate decarboxylase (we run the reaction’s cousin inside pyruvate dehydrogenase); we do have alcohol dehydrogenase, running it in reverse during ethanol metabolism. Bread, beer, and wine are this pathway’s CO₂ and ethanol, respectively.

## The Warburg Postscript

Tumor cells ferment glucose to lactate at high rates **even with ample oxygen** — the Warburg effect — importing glucose so avidly that PET imaging localizes many tumors with a radiolabeled glucose analog. HIF-1, the transcription factor stabilized under hypoxia, upregulates glucose transporters and glycolytic enzymes in poorly vascularized tumor cores, and the resulting biosynthetic intermediates suit rapid growth. For test purposes: aerobic glycolysis in tumors is a regulatory choice, not a mitochondrial impossibility.`,
        importantNote:
          'Fermentation’s purpose is NAD⁺ regeneration, never extra energy: the reduction of pyruvate recovers no ATP. Any answer choice claiming lactate formation "produces energy" is wrong — the 2 ATP came from glycolysis itself.',
        quiz: [
          {
            question:
              'In vigorously exercising muscle, the immediate reason pyruvate is reduced to lactate is to:',
            options: [
              'generate additional ATP from the reduction step',
              'regenerate cytosolic NAD⁺ so glyceraldehyde 3-phosphate dehydrogenase — and thus glycolysis — can continue',
              'lower the pH and increase oxygen delivery to the tissue',
              'convert pyruvate into a form that enters the citric acid cycle faster',
            ],
            correctIndex: 1,
            explanation:
              'The GAPDH step strictly requires NAD⁺. When mitochondrial reoxidation of NADH cannot keep pace, lactate dehydrogenase transfers the electrons back onto pyruvate, restoring NAD⁺ and keeping the 2-ATP-per-glucose glycolytic engine running. The reduction itself yields no ATP, and lactate is a temporary electron parking spot, not a cycle fuel.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Net equation: glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 pyruvate + 2 NADH + 2 H⁺ + 2 ATP + 2 H₂O. Investment phase spends 2 ATP; payoff phase (×2 per glucose) earns 4 ATP + 2 NADH; phosphorylation traps intermediates, stores the transferable groups, and provides binding handles.',
      'Step logic: phosphorylate–isomerize–phosphorylate arms a retro-aldol cleavage (aldolase, ΔG′° +23.8 but ΔG ≈ 0 in vivo); TPI merges the trioses; GAPDH is the sole oxidation, capturing energy as 1,3-BPG’s acyl phosphate via a covalent cysteine intermediate; PGK and pyruvate kinase perform the two substrate-level phosphorylations; enolase concentrates potential into PEP (−61.9 rung).',
      'Only steps 1, 3, 10 run far from equilibrium in cells — the regulated one-way doors. Standard values: hexokinase −16.7, PFK-1 −14.2, pyruvate kinase −31.4 kJ/mol.',
      'Control points with effectors: hexokinase I–III feedback-inhibited by G6P; glucokinase (liver) half-saturates near 10 mM, escapes G6P inhibition — a glucose sensor. PFK-1: ATP and citrate inhibit; AMP/ADP activate; F2,6BP is the master activator (0.13 µM shifts F6P half-saturation ~2 mM → 0.08 mM). Pyruvate kinase: F1,6BP feeds forward; ATP and alanine inhibit; liver isozyme silenced by PKA phosphorylation.',
      'F2,6BP is set by the bifunctional PFK-2/FBPase-2: glucagon → cAMP → PKA phosphorylation → phosphatase mode → F2,6BP falls (glycolysis off, gluconeogenesis on); insulin reverses it.',
      'Gluconeogenesis bypasses: (1) pyruvate carboxylase (biotin, 1 ATP, obligatory acetyl-CoA activation, mitochondrial; OAA exits as malate carrying NADH) + PEP carboxykinase (1 GTP, decarboxylation-driven); (2) FBPase-1; (3) glucose 6-phosphatase (ER; liver/kidney/small intestine only — never muscle). Cost per glucose: 4 ATP + 2 GTP + 2 NADH; round trip vs glycolysis wastes 4 NTP, the price of two-way irreversibility.',
      'Glucogenic: lactate, alanine, glycerol, most amino acids. Never net glucose from acetyl-CoA or even-chain fatty acids in animals — PDH is irreversible and the cycle loses 2 CO₂ per acetyl before OAA reappears.',
      'Cori cycle: muscle/RBC lactate → liver → glucose; muscle +2 ATP, liver −6 NTP, body −4 NTP per turn; explains oxygen debt and, when whole-body perfusion fails, lactic acidosis.',
      'Fermentation exists to regenerate NAD⁺ for GAPDH: lactate DH (−25.1 kJ/mol) in animals; pyruvate decarboxylase (TPP, Mg²⁺ — absent in humans) + alcohol DH in yeast. Warburg effect: tumors ferment aerobically (HIF-1, glucose transporter upregulation) — the basis of FDG-PET imaging.',
    ],
  },

  // ── Biochemistry II.3: Glycogen and the pentose phosphate shunt ─────────
  bb2_glycogen_ppp: {
    topicId: 'bb2_glycogen_ppp',
    title: 'Glycogen and the Pentose Phosphate Shunt',
    domainWeight: '25%',
    overview:
      'Two side doors off the glucose 6-phosphate hub carry a disproportionate share of MCAT questions. Glycogen is the buffer: a branched polymer that lets liver defend blood glucose and lets muscle fuel contraction faster than any transporter could deliver, run by separate synthetic and degradative machinery under beautifully reciprocal hormonal control. The pentose phosphate pathway is the refinery: it burns no fuel for ATP at all, instead converting glucose 6-phosphate into NADPH for reductive biosynthesis and antioxidant defense, plus ribose 5-phosphate for nucleotides. Between them sit some of medicine’s most testable enzyme deficiencies.',
    sections: [
      {
        id: 'bb2_gpp_architecture',
        title: 'Why Glycogen, and How It Is Built to Purpose',
        content: `## The Osmotic Argument

A fed hepatocyte stores glucose equivalent to roughly a 0.4 M solution. Held as free monomer, that concentration would osmotically flood and burst the cell; polymerized into a relative handful of giant glycogen particles, the same carbon exerts negligible osmotic pressure. Storage as polymer is not chemistry’s preference — it is osmosis’s demand.

Why keep glycogen at all when fat stores far more energy per gram? Because fat fails three emergencies: it cannot be mobilized quickly, it cannot be oxidized anaerobically, and (Chapter II.2) it cannot become glucose — and the brain and erythrocytes run on glucose. Glycogen is the fast, anaerobic-capable, glucose-yielding reserve; fat is the deep storage.

## Architecture as Function

Glycogen is glucose chained by **(α1→4)** glycosidic bonds with **(α1→6)** branch points. Chains run about 13 residues; inner chains typically carry two branches each, stacking the particle into 6–7 tiers with an unbranched outer tier. A single cytosolic β-particle can hold up to ~55,000 residues yet presents on the order of **2,000 nonreducing ends** — and since both the degrading and synthesizing enzymes work exclusively at nonreducing ends, branching converts a storage problem into a parallel-processing solution: mobilization speed scales with end count. In liver, β-particles further cluster into larger α-rosettes. One reducing end per particle stays covalently attached to the priming protein (glycogenin, below); everything else is ends-out.

![Schematic of a glycogen particle segment: (α1→4)-linked chains with an (α1→6) branch point, tiers radiating from a central glycogenin dimer, and multiple nonreducing ends exposed at the surface where phosphorylase and synthase operate. Schematic — chain lengths and tier counts are illustrative, not to scale.](/courses/mcat/biochem/bc2-glycogen-branching.svg)

## Two Depots, Two Job Descriptions

**Liver** glycogen (5–10% of organ wet weight; ~100 g in a 70-kg adult) exists for everyone else: it is drawn down between meals to hold blood glucose steady, and only liver (with kidney and small intestine) carries the glucose 6-phosphatase needed to export the product. **Muscle** glycogen (1–2% by weight but ~400 g total) is selfish: it feeds that fiber’s own glycolysis during contraction, and, lacking glucose 6-phosphatase, muscle cannot share it as free glucose. The same polymer, two physiologies — a contrast the exam returns to constantly.`,
        quiz: [
          {
            question:
              'Storing glucose as glycogen rather than as free intracellular glucose primarily serves to:',
            options: [
              'increase the total energy yield per glucose residue',
              'avoid the catastrophic osmotic pressure that ~0.4 M free glucose would generate, while keeping the carbon rapidly accessible',
              'protect glucose from oxidation by cytosolic enzymes',
              'allow glucose storage inside the nucleus',
            ],
            correctIndex: 1,
            explanation:
              'Osmotic pressure depends on particle number: hundreds of millions of free glucose molecules become a few thousand glycogen particles, dropping the osmotic contribution to almost nothing while branching keeps thousands of nonreducing ends available for fast mobilization. Polymerization slightly costs, never increases, net energy yield.',
          },
          {
            question:
              'The heavy branching of glycogen directly increases the speed of its breakdown because:',
            options: [
              '(α1→6) bonds are weaker and hydrolyze spontaneously',
              'branches make the particle water-soluble, which is required for phosphorylase binding',
              'phosphorylase and synthase act only at nonreducing ends, and branching multiplies the number of ends available for simultaneous attack',
              'branch points recruit debranching enzyme, which is faster than phosphorylase',
            ],
            correctIndex: 2,
            explanation:
              'Every branch adds a nonreducing end, and a large particle exposes on the order of two thousand of them — thousands of enzyme teams can work in parallel, releasing glucose 1-phosphate at rates a linear polymer could never match. Solubility is a genuine side benefit, but the speed argument is the end count.',
          },
        ],
      },
      {
        id: 'bb2_gpp_breakdown',
        title: 'Breakdown: Phosphorolysis and the Debranching Detour',
        content: `## Phosphorylase’s Clever Cut

**Glycogen phosphorylase** attacks nonreducing ends not with water but with inorganic phosphate — **phosphorolysis** — releasing **glucose 1-phosphate**. The choice is doubly shrewd: the product emerges already phosphorylated (charged, trapped, glycolysis-ready) *without spending ATP*, and using the cell’s abundant Pᵢ costs nothing. The enzyme carries **pyridoxal phosphate (PLP)** as an essential cofactor — here playing an unusual acid-base role, its phosphate group assisting the attack, rather than its familiar amino-acid chemistry (Chapter II.7).

**Phosphoglucomutase** then shuttles the phosphate: G1P ⇌ G6P, via a phosphoenzyme intermediate and a transient bisphosphate. From G6P the roads split — glycolysis in muscle; in liver, hydrolysis by **glucose 6-phosphatase** inside the ER (a transporter imports G6P into the lumen; the phosphatase’s active site faces lumenally) and export of free glucose to the blood.

## The Branch Problem

Phosphorylase is bulky and halts **four residues short** of any (α1→6) branch point. The bifunctional **debranching enzyme** finishes the job in two acts: its **transferase** activity moves a block of three residues from the stub onto a nearby nonreducing end (preserving (α1→4) linkage), then its **(α1→6)-glucosidase** activity hydrolyzes the single remaining branch residue — releasing it as **free glucose**, the only unphosphorylated glucose glycogenolysis produces (roughly one per branch, ~10% of output). Two products, two origins: G1P from chains, a trickle of free glucose from branch points — a distinction passage questions love.

## The Arithmetic Payoff

Count the ATP for muscle burning its own glycogen anaerobically. A residue enters as G1P → G6P, skipping the hexokinase step entirely: only PFK-1’s 1 ATP is invested, the payoff phase still returns 4, so the net is **3 ATP per glycogen residue** versus 2 per blood glucose. Recheck by difference: the stored residue arrives pre-phosphorylated, saving exactly the 1 ATP hexokinase would have charged; 2 + 1 = 3. ✓ Under anaerobic sprint conditions that 50% bonus is significant — one reason muscle keeps its own depot.`,
        quiz: [
          {
            question:
              'A muscle fiber degrades glycogen anaerobically during a sprint. The net ATP yield per glucose residue mobilized from a chain (as glucose 1-phosphate) and fermented to lactate is:',
            options: ['1 ATP', '2 ATP', '3 ATP', '4 ATP'],
            correctIndex: 2,
            explanation:
              'Phosphorolysis delivers glucose 1-phosphate, which phosphoglucomutase isomerizes to glucose 6-phosphate at no ATP cost. Entering glycolysis past the hexokinase step, the residue invests only 1 ATP (at PFK-1) and earns the full 4 in the payoff phase: net 3 ATP, one better than free glucose. Subsequent reduction of pyruvate to lactate neither makes nor costs ATP.',
          },
          {
            question:
              'Which pairing of glycogenolysis product and its origin is correct?',
            options: [
              'Free glucose from chain ends; glucose 1-phosphate from branch points',
              'Glucose 1-phosphate from phosphorylase acting on chains; free glucose from the debranching enzyme’s (α1→6)-glucosidase activity at branch residues',
              'Glucose 6-phosphate released directly by phosphorylase; no free glucose is ever produced',
              'Free glucose from phosphorylase; glucose 1-phosphate from debranching enzyme',
            ],
            correctIndex: 1,
            explanation:
              'Phosphorylase phosphorolytically clips (α1→4)-linked residues to glucose 1-phosphate, stopping four residues from each branch. Debranching enzyme then transfers three residues away and hydrolyzes the last (α1→6)-linked residue — hydrolysis, not phosphorolysis — releasing the pathway’s only free glucose, about one residue in ten.',
          },
        ],
      },
      {
        id: 'bb2_gpp_synthesis',
        title: 'Synthesis: UDP-Glucose, Branching, and Glycogenin',
        content: `## Separate Machinery, Activated Donor

Synthesis is not phosphorylase running backward — it is a different pathway with a different energy source, the sugar nucleotide **UDP-glucose**. **UDP-glucose pyrophosphorylase** condenses glucose 1-phosphate with UTP, releasing PPᵢ — and inorganic pyrophosphatase instantly destroys the PPᵢ, the same double-pull irreversibility strategy from Chapter II.1. (The enzyme is named for the reverse direction; in cells it runs only forward.) **Glycogen synthase** then transfers the glucosyl unit from UDP-glucose onto a nonreducing end in (α1→4) linkage.

The bill per residue stored from G6P: G6P → G1P is free; the UTP consumed regenerates via nucleoside diphosphate kinase at the cost of **1 ATP equivalent**. Check from bond bookkeeping: one phosphoanhydride of UTP is spent forming UDP-glucose (with the PPᵢ’s energy discarded to buy irreversibility), and one ATP restores UTP from UDP — the same single-NTP answer. ✓ Storage is cheap; a residue banked for 1 ATP returns 3 in muscle glycolysis.

## Branches and Beginnings

Glycogen synthase only extends; two specialists handle topology. The **branching enzyme** excises a block of 6–7 residues from the end of a chain at least 11 long and reattaches it via an **(α1→6)** bond at an interior site (spaced at least 4 residues from existing branches) — each cut instantly creating an extra nonreducing end and deepening solubility. And synthase cannot start from nothing: it needs a primer of at least a few residues. **Glycogenin** provides it, acting as both scaffold and enzyme — each subunit of the dimer glucosylates a specific tyrosine (Tyr194) on its partner using UDP-glucose, extends the chain to about eight residues, and then hands off to glycogen synthase. Every glycogen particle keeps its glycogenin core; the polymer’s single reducing end is buried in that protein linkage.`,
        importantNote:
          'Synthesis and breakdown use entirely separate enzymes (synthase + branching enzyme vs phosphorylase + debranching enzyme) and different chemistry (UDP-glucose donor vs Pᵢ attack). Separate machinery is what makes reciprocal regulation possible — the theme of the next section.',
        quiz: [
          {
            question:
              'What is the role of UDP-glucose in glycogen synthesis?',
            options: [
              'It is the allosteric activator of glycogen synthase',
              'It is the activated glucosyl donor, formed from glucose 1-phosphate and UTP with release of PPᵢ whose hydrolysis renders the step irreversible',
              'It carries glucose across the plasma membrane into the cell',
              'It phosphorylates glycogenin to initiate a new particle',
            ],
            correctIndex: 1,
            explanation:
              'UDP-glucose pyrophosphorylase makes the activated donor; rapid PPᵢ hydrolysis by pyrophosphatase pulls the reaction one way, and glycogen synthase then transfers the glucosyl group to a nonreducing end. Overall cost: one ATP equivalent per residue stored from glucose 6-phosphate. Glycogenin is glucosylated (on Tyr194), not phosphorylated — and by itself, using the same UDP-glucose donor.',
          },
        ],
      },
      {
        id: 'bb2_gpp_control',
        title: 'Reciprocal Hormonal Control: One Signal, Two Opposite Verdicts',
        content: `## The Amplifying Cascade Down

Fight-or-flight (epinephrine, muscle) or fasting (glucagon, liver) → receptor → G protein → adenylyl cyclase → **cAMP** → **PKA** → **phosphorylase kinase** (phosphorylated, activated) → **glycogen phosphorylase b → a** (phosphorylated on Ser14, activated). Each catalytic tier multiplies the signal thousands-fold, so nanomolar hormone mobilizes glucose in seconds. In muscle, phosphorylase kinase carries calmodulin as its δ subunit, so the **Ca²⁺** that triggers contraction simultaneously part-activates glycogen breakdown, and **AMP** allosterically boosts phosphorylase b — fuel demand read three ways at once.

## The Same Cascade Turns Synthesis Off

PKA (directly, and through other kinases) also phosphorylates **glycogen synthase**, but with the *opposite* result: synthase a (active, dephospho) becomes synthase b (inactive, phospho). The dominant off-switch is **glycogen synthase kinase 3 (GSK3)**, which can act only after **casein kinase II** has phosphorylated a priming residue nearby — hierarchical phosphorylation, as in Chapter I.7. So one hormone pulse flips both pathways in opposite directions with no chance of a futile cycle: breakdown on, synthesis off.

## Why a Cascade at All

The tiered design is not bureaucracy — it is arithmetic. Suppose each activated catalyst switches on a thousand molecules of the next tier per second: one occupied receptor becomes thousands of cAMP, then thousands of active PKA per cAMP-activated event, then phosphorylase kinase, then phosphorylase — four multiplicative stages deep. Amplification factors compound, so a hormone present at nanomolar concentrations commands micromolar-to-millimolar flows of glucose 1-phosphate within seconds, far faster than any transcriptional response and far larger than any stoichiometric one. The same depth also creates regulatory real estate: every tier is a separate dial where allosteric effectors (Ca²⁺, AMP, glucose) and the opposing phosphatase can each cast a vote before the last enzyme commits.

## Insulin Reverses Every Arrow

Insulin signaling inactivates GSK3 and activates **phosphoprotein phosphatase 1 (PP1)**, which strips the phosphates from phosphorylase, phosphorylase kinase, and synthase alike — breakdown off, synthesis on. Allosteric effectors fine-tune the switchboard: **glucose 6-phosphate** binds synthase b, both stimulating it directly and making it a better PP1 substrate (abundant substrate promotes storage), while in liver, **glucose itself** binds phosphorylase a and exposes its phospho-serines to PP1 — the degradative enzyme doubles as the hepatocyte’s glucose sensor, shutting breakdown down when blood glucose has recovered. Note the symmetry with Chapter II.2: the same glucagon-PKA axis that lowers F2,6BP and silences liver pyruvate kinase is here flipping the glycogen switchboard — one second messenger coordinating the entire hepatic fasting program.`,
        quiz: [
          {
            question:
              'A single epinephrine stimulus causes muscle to both accelerate glycogen breakdown and halt glycogen synthesis. How?',
            options: [
              'Epinephrine enters the cell and binds both enzymes directly',
              'The cAMP → PKA cascade phosphorylates both key enzymes — activating phosphorylase (via phosphorylase kinase) while inactivating glycogen synthase',
              'Epinephrine raises Ca²⁺, which activates synthase and inhibits phosphorylase',
              'PKA dephosphorylates both enzymes simultaneously',
            ],
            correctIndex: 1,
            explanation:
              'Phosphorylation carries opposite meanings for the two enzymes: it switches phosphorylase ON (b → a, via phosphorylase kinase) and switches glycogen synthase OFF (a → b, via PKA and GSK3). One kinase cascade therefore produces two complementary outcomes, guaranteeing the pathways never run head-to-head. Epinephrine never enters the cell, and Ca²⁺ reinforces breakdown, not synthesis.',
          },
          {
            question:
              'In hepatocytes, glucose binding to glycogen phosphorylase a promotes which outcome?',
            options: [
              'Allosteric activation of phosphorylase a, accelerating glycogenolysis',
              'A conformational change exposing its phospho-Ser residues to PP1, leading to dephosphorylation and inactivation — breakdown stops when blood glucose is restored',
              'Direct phosphorylation of glycogen synthase',
              'Export of phosphorylase to the ER',
            ],
            correctIndex: 1,
            explanation:
              'Liver phosphorylase a is itself a glucose sensor: bound glucose repositions the enzyme so PP1 can remove the activating phosphates, and the same PP1 activity then turns glycogen synthase on. Glycogenolysis thus self-terminates precisely when its goal — normal blood glucose — is achieved.',
          },
        ],
      },
      {
        id: 'bb2_gpp_diseases',
        title: 'When Storage Fails: The Glycogen Storage Diseases',
        content: `## The Named Defects

Inherited losses of single enzymes produce distinct, mappable diseases — a natural experiment in pathway logic and a reliable exam setup (standard clinical pairings):

| Type | Eponym | Deficient enzyme | Signature |
|------|--------|------------------|-----------|
| Ia | von Gierke | Glucose 6-phosphatase | Severe fasting hypoglycemia; massive hepatomegaly; lactic acidosis |
| II | Pompe | Lysosomal acid α-glucosidase | Cardiomegaly; infantile form fatal early; muscle weakness |
| III | Cori (Forbes) | Debranching enzyme | Hepatomegaly; abnormal short-branched glycogen |
| IV | Andersen | Branching enzyme | Long unbranched chains; cirrhosis |
| V | McArdle | Muscle phosphorylase | Exercise intolerance, cramps, myoglobinuria; blunted exercise lactate rise |
| VI | Hers | Liver phosphorylase | Mild hepatomegaly and hypoglycemia |
| VII | Tarui | Muscle PFK-1 | McArdle-like plus hemolysis |

## Reasoning From the Lesion

Each phenotype is derivable, which is how to hold the table. **Von Gierke:** liver mobilizes and gluconeogenically produces G6P but cannot dephosphorylate it — so glycogen and G6P pile up (hepatomegaly), fasting glucose collapses, and trapped G6P overflows into glycolysis and the pentose pathway (lactic acidosis, hyperlipidemia, hyperuricemia). **McArdle:** muscle cannot tap its depot, so intense exercise fails early and injures fibers (myoglobinuria); with no glycogenolysis feeding glycolysis, venous lactate barely rises during ischemic exercise — the classic functional test. **Pompe** is the odd one out: a *lysosomal* enzyme, so glycogen engulfed by autophagy accumulates inside lysosomes even though cytosolic metabolism is intact — heart and muscle bear the damage. **Cori vs Andersen** are structural mirror images: no debrancher leaves stubby over-branched limit dextrins; no brancher leaves sparse, long, poorly soluble chains that provoke cirrhosis.`,
        quiz: [
          {
            question:
              'A patient develops muscle cramps and dark urine with strenuous exercise. During an ischemic forearm exercise test, venous lactate fails to rise. The most likely deficient enzyme is:',
            options: [
              'Liver glucose 6-phosphatase',
              'Muscle glycogen phosphorylase',
              'Lysosomal acid α-glucosidase',
              'Glycogen branching enzyme',
            ],
            correctIndex: 1,
            explanation:
              'This is McArdle disease (type V): without muscle phosphorylase, working muscle cannot mobilize glycogen, so glycolytic flux — and therefore lactate output — barely increases with exercise, while energy-starved fibers break down (myoglobinuria). G6Pase deficiency (von Gierke) is a liver/fasting disease; Pompe is lysosomal with cardiac involvement; branching deficiency (Andersen) presents with liver failure.',
          },
        ],
      },
      {
        id: 'bb2_gpp_ppp',
        title: 'The Pentose Phosphate Pathway: NADPH and Ribose',
        content: `## A Pathway With No ATP in Its Books

The pentose phosphate pathway (hexose monophosphate shunt) neither consumes nor produces ATP. Its deliverables are two: **NADPH** — for fatty acid, cholesterol, and steroid synthesis (liver, adipose, adrenal, gonads, lactating mammary gland), for cytochrome P450 detoxification, for the phagocyte respiratory burst, and above all for keeping **glutathione** reduced against peroxide damage — and **ribose 5-phosphate** for nucleotides and nucleic acids.

**Oxidative phase (irreversible):** **glucose 6-phosphate dehydrogenase (G6PD)** — the committed, rate-limiting step, governed simply by NADP⁺ availability, so the pathway runs exactly as fast as NADPH is spent — oxidizes G6P to a lactone (first NADPH); a lactonase opens it to 6-phosphogluconate; 6-phosphogluconate dehydrogenase oxidatively decarboxylates to ribulose 5-phosphate (second NADPH, one CO₂); an isomerase gives ribose 5-phosphate. Net:

**G6P + 2 NADP⁺ + H₂O → ribose 5-phosphate + CO₂ + 2 NADPH + 2 H⁺**

**Nonoxidative phase (fully reversible):** **transketolase** (TPP-dependent — thiamine again) twice transfers 2-carbon units, and **transaldolase** a 3-carbon unit, shuffling C₅ sugars into C₃/C₄/C₆/C₇ intermediates that connect to glycolysis. Because it is reversible, the pathway has modes for every need: NADPH + ribose (oxidative phase alone); mostly NADPH (recycle pentoses back to G6P — six turns fully oxidize one glucose-equivalent to 6 CO₂); mostly ribose (build pentoses *from* F6P and GAP, no NADPH, no oxidative phase); or NADPH + ATP (drain pentoses into glycolysis). Direction is set by supply and demand, not by a dedicated regulator.

## The Clinical Doors

**G6PD deficiency** — X-linked and among the most common human enzyme defects — leaves erythrocytes, which have no other NADPH source, unable to regenerate reduced glutathione under oxidant stress. Primaquine-class antimalarials, sulfa drugs, infection, or fava beans (divicine) trigger oxidative damage: hemoglobin denatures into Heinz bodies and hemolysis follows. The mutation’s persistence maps onto malaria regions — a partially protected red cell is a poor host — the same heterozygote-advantage logic as sickle trait. And thiamine deficiency reads through transketolase: in **Wernicke-Korsakoff syndrome**, a transketolase variant with weakened TPP affinity turns marginal thiamine status (classically in alcoholism) into neurological disease.`,
        examTip:
          'Route the NADPH questions by tissue: erythrocytes need it for glutathione (G6PD deficiency → hemolysis), phagocytes for the respiratory burst, liver and adipose for fatty acid synthesis. And remember the shunt makes zero ATP — any choice crediting it with ATP is wrong.',
        quiz: [
          {
            question:
              'A dividing cell needs large amounts of ribose 5-phosphate but little NADPH. How does the pentose phosphate pathway accommodate this?',
            options: [
              'It cannot; ribose synthesis obligatorily produces 2 NADPH per ribose',
              'The reversible nonoxidative phase runs backward, building ribose 5-phosphate from fructose 6-phosphate plus glyceraldehyde 3-phosphate, without the oxidative reactions',
              'G6PD is upregulated and excess NADPH is destroyed',
              'Ribose is imported from the bloodstream instead',
            ],
            correctIndex: 1,
            explanation:
              'Transketolase and transaldolase reactions are near-equilibrium and reversible: glycolytic intermediates can be reshuffled directly into pentose phosphates, bypassing G6PD entirely. The two phases are independently deployable — that modularity, set by demand for each product, is the pathway’s defining design feature.',
          },
          {
            question:
              'Why does G6PD deficiency present as hemolysis specifically after oxidant exposure (e.g., primaquine or fava beans)?',
            options: [
              'Erythrocytes depend solely on the oxidative pentose phosphate pathway for NADPH, which maintains reduced glutathione; without it, oxidative stress denatures hemoglobin and destroys the cell',
              'The deficient cells cannot produce ATP and lyse at rest',
              'Oxidants inhibit glycolysis only in G6PD-deficient cells',
              'NADPH is required for oxygen binding by hemoglobin',
            ],
            correctIndex: 0,
            explanation:
              'A red cell has no mitochondria and no alternative NADPH supply, and NADPH is the sole currency for glutathione reductase. Under baseline conditions residual G6PD activity suffices — carriers are typically asymptomatic — but an oxidant surge outruns it: peroxides accumulate, hemoglobin precipitates as Heinz bodies, and the spleen removes the damaged cells. ATP production via glycolysis is unaffected.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Glycogen exists because ~0.4 M free glucose would be osmotically lethal and because fat is slow, aerobic-only, and never glucose-yielding. Architecture: (α1→4) chains (~13 residues) with (α1→6) branches, 6–7 tiers, up to ~55,000 residues but ~2,000 nonreducing ends — parallel access for end-specific enzymes.',
      'Liver depot (5–10% wet weight, ~100 g) defends blood glucose and uniquely carries glucose 6-phosphatase (ER-lumenal, shared only with kidney/small intestine); muscle depot (1–2%, ~400 g) is private fuel — no G6Pase, no export.',
      'Breakdown: phosphorylase (PLP cofactor) phosphorolytically yields G1P — pre-phosphorylated at zero ATP cost — halting 4 residues from branches; debranching enzyme transfers 3 residues then hydrolyzes the (α1→6) residue to free glucose (~10%). Phosphoglucomutase links G1P ⇌ G6P. Net anaerobic yield: 3 ATP per glycogen residue vs 2 per blood glucose.',
      'Synthesis: UDP-glucose pyrophosphorylase (PPᵢ released and destroyed — irreversibility by double pull) → glycogen synthase extends (α1→4); branching enzyme relocates 6–7-residue blocks to (α1→6) positions; glycogenin self-glucosylates Tyr194 to prime new particles. Cost: 1 ATP equivalent per residue stored from G6P.',
      'Cascade control: epinephrine/glucagon → cAMP → PKA → phosphorylase kinase → phosphorylase a (breakdown ON) while PKA/GSK3 (with CK2 priming) phosphorylate synthase to its b form (synthesis OFF) — one signal, opposite verdicts, no futile cycle. Muscle adds Ca²⁺ (calmodulin δ subunit) and AMP as local activators.',
      'Insulin reverses the switchboard: GSK3 inactivated, PP1 activated, all three phosphoproteins stripped. G6P allosterically favors synthase reactivation; in liver, glucose binding to phosphorylase a exposes it to PP1 — the sensor that self-terminates glycogenolysis.',
      'Storage diseases: von Gierke Ia (G6Pase — fasting hypoglycemia, hepatomegaly, lactic acidosis), Pompe II (lysosomal α-glucosidase — cardiomegaly), Cori III (debrancher — limit dextrins), Andersen IV (brancher — long chains, cirrhosis), McArdle V (muscle phosphorylase — cramps, myoglobinuria, flat exercise lactate), Hers VI (liver phosphorylase), Tarui VII (muscle PFK-1).',
      'PPP: zero ATP; oxidative phase (G6PD committed step, gated by NADP⁺ availability) yields 2 NADPH + CO₂ + ribose 5-P per G6P; nonoxidative phase (transketolase ×2 — TPP; transaldolase) is reversible, giving four operating modes matched to NADPH vs ribose demand.',
      'NADPH clients: reductive biosynthesis (fatty acids, cholesterol, steroids), glutathione reduction, P450s, respiratory burst. G6PD deficiency (X-linked, extremely common): oxidant-triggered hemolysis with Heinz bodies (primaquine, sulfa drugs, fava beans/divicine, infection); malaria-region prevalence via heterozygote advantage. Thiamine link: transketolase and Wernicke-Korsakoff.',
    ],
  },

  // ── Biochemistry II.4: Pyruvate to acetyl-CoA and the citric acid cycle ─
  bb2_tca: {
    topicId: 'bb2_tca',
    title: 'Pyruvate to Acetyl-CoA and the Citric Acid Cycle',
    domainWeight: '25%',
    overview:
      'Everything combustible in the diet — sugar, fat, most amino acid skeletons — funnels into one two-carbon currency, acetyl-CoA, and one wheel that grinds it to CO₂ while loading electrons onto NAD⁺ and FAD. This chapter crosses the mitochondrial threshold with the pyruvate dehydrogenase complex (five coenzymes, four vitamins, one irreversible verdict), turns the citric acid cycle once with the energy books open, then treats the cycle as what it really is: not just a furnace but the cell’s central roundabout, drained for biosynthesis, refilled by anaplerosis, and throttled at three exergonic gates by the cell’s energy charge.',
    sections: [
      {
        id: 'bb2_tca_pdh',
        title: 'The Junction: Pyruvate Dehydrogenase',
        content: `## Crossing the Threshold

Pyruvate made in the cytosol enters the matrix through the mitochondrial pyruvate carrier, where the **pyruvate dehydrogenase (PDH) complex** — an enormous assembly of many copies of three enzymes — performs an **oxidative decarboxylation**:

**Pyruvate + CoA + NAD⁺ → acetyl-CoA + CO₂ + NADH**  (ΔG′° = −33.4 kJ/mol; standard value)

That strongly negative, physiologically irreversible step is a one-way door with consequences: once carbon passes PDH it can never return to pyruvate, which (Chapter II.2) is exactly why fatty acids cannot become glucose.

## Three Enzymes, Five Coenzymes, Four Vitamins

- **E1 (pyruvate dehydrogenase)**, with **thiamine pyrophosphate (TPP)** (vitamin B1): decarboxylates pyruvate, holding the remaining two carbons as hydroxyethyl-TPP — the carbanion-stabilizing chemistry met in yeast pyruvate decarboxylase, now retained rather than released.
- **E2 (dihydrolipoyl transacetylase)**, with **lipoate** swinging on a long lysine tether: the hydroxyethyl group is oxidized to an acetyl group as lipoate’s disulfide is reduced, and the acetyl is handed — as a thioester — first to lipoate, then to **coenzyme A** (from pantothenate, B5). The oxidation energy is conserved in acetyl-CoA’s thioester bond (−31.4 kJ/mol rung from Chapter II.1).
- **E3 (dihydrolipoyl dehydrogenase)**, with **FAD** (riboflavin, B2): reoxidizes the spent lipoamide, passing the electrons to **NAD⁺** (niacin, B3) for delivery to the respiratory chain.

The **lipoyllysyl swinging arm** ferries intermediates from active site to active site without release — substrate channeling: no diffusion losses, no side reactions. Keep the roster automatic: TPP, lipoate, CoA, FAD, NAD⁺ — the exact same five run the α-ketoglutarate dehydrogenase complex inside the cycle and the dehydrogenase for branched-chain α-keto acids in amino acid catabolism, so one memorized set answers three enzymes’ worth of questions.`,
        quiz: [
          {
            question:
              'Which set lists the five coenzymes of the pyruvate dehydrogenase complex?',
            options: [
              'TPP, biotin, CoA, FAD, NAD⁺',
              'TPP, lipoate, CoA, FAD, NAD⁺',
              'PLP, lipoate, CoA, FMN, NADP⁺',
              'TPP, lipoate, biotin, FAD, NADP⁺',
            ],
            correctIndex: 1,
            explanation:
              'TPP (B1) handles the decarboxylation on E1; lipoate’s swinging arm on E2 carries electrons and the acetyl group; coenzyme A (B5) accepts the acetyl as a thioester; FAD (B2) on E3 reoxidizes lipoamide; NAD⁺ (B3) carries the electrons away. Biotin is the CO₂-fixing cofactor of carboxylases (e.g., pyruvate carboxylase) — the opposite chemistry; PLP belongs to amino acid metabolism.',
          },
        ],
      },
      {
        id: 'bb2_tca_pdhreg',
        title: 'Governing the Gate: PDH Regulation and Its Failures',
        content: `## Two Layers of Control

**Allosteric:** the complex’s own products, **NADH and acetyl-CoA**, inhibit it directly by competing at E3 and E2 — when electron carriers are full and acetyl units abundant (as during fatty acid oxidation), pyruvate is spared for gluconeogenesis.

**Covalent:** **PDH kinase**, built into the complex, phosphorylates E1 serines and switches the complex **off**; **PDH phosphatase** removes the marks. The kinase is itself allosterically governed — activated by ATP, NADH, and acetyl-CoA (energy sufficiency), inhibited by ADP, NAD⁺, and pyruvate (demand and supply). The phosphatase answers to **Ca²⁺** — so in contracting muscle the same ion that triggers crossbridge cycling and glycogenolysis also reopens the acetyl-CoA gate — and to insulin in adipose tissue. Net behavior: fed, resting, energy-replete tissue keeps PDH parked in the phosphorylated off state; work or carbohydrate influx flips it on within seconds. (The experimental drug dichloroacetate inhibits PDH kinase, forcing pyruvate oxidation — one strategy under study against Warburg-type tumor metabolism.)

## When the Junction Fails

The chemistry makes the pathologies predictable. **Thiamine deficiency** starves E1 of TPP: pyruvate backs up into lactate, and the tissues most dependent on glucose oxidation — brain, peripheral nerves, heart — fail first: **beriberi**, and in alcoholism (poor intake plus impaired absorption) Wernicke-Korsakoff disease; polished rice diets are the classic dietary setting. **Arsenite and organic arsenicals** attack the paired thiols of dihydrolipoamide, freezing E2’s arm — PDH and α-ketoglutarate dehydrogenase both stall. Inherited **PDH deficiency** presents as congenital lactic acidosis with neurological injury, treated in part by ketogenic diets that supply the brain acetyl-CoA downstream of the block. Each lesion is the same lesson: block the junction and pyruvate’s only exit is lactate.`,
        quiz: [
          {
            question:
              'In well-fed, resting muscle with high ATP, NADH, and acetyl-CoA, the PDH complex is predominantly:',
            options: [
              'dephosphorylated and active, maximizing acetyl-CoA production',
              'phosphorylated on E1 and inactive, because PDH kinase is allosterically activated by exactly those three signals',
              'degraded by the proteasome until the next meal',
              'active but starved of substrate, since pyruvate cannot enter mitochondria at rest',
            ],
            correctIndex: 1,
            explanation:
              'ATP, NADH, and acetyl-CoA all activate the complex-resident PDH kinase, which phosphorylates E1 and shuts the gate; the same molecules also inhibit the complex directly. When work begins, rising ADP, NAD⁺, and pyruvate inhibit the kinase while Ca²⁺ stimulates PDH phosphatase — the complex reactivates in seconds without any new protein synthesis.',
          },
          {
            question:
              'Arsenite poisoning impairs both pyruvate dehydrogenase and α-ketoglutarate dehydrogenase because both complexes:',
            options: [
              'use biotin, which arsenite hydrolyzes',
              'depend on a dihydrolipoamide swinging arm whose paired thiols arsenite cross-links',
              'are located in the intermembrane space where arsenite concentrates',
              'require cytochrome-bound copper that arsenite chelates',
            ],
            correctIndex: 1,
            explanation:
              'The two complexes are structural and mechanistic siblings sharing the same five coenzymes; arsenite’s high affinity for vicinal dithiols traps the reduced lipoamide arm of E2 in both, halting acetyl-CoA production and the cycle step that consumes α-ketoglutarate. Neither complex uses biotin or copper.',
          },
        ],
      },
      {
        id: 'bb2_tca_turn1',
        title: 'One Turn of the Wheel: The Eight Steps',
        content: `## The Table to Carry In

| # | Enzyme | Transformation | ΔG′° (kJ/mol) |
|---|--------|----------------|----------------|
| 1 | Citrate synthase | Acetyl-CoA + oxaloacetate → citrate + CoA | −32.2 |
| 2 | Aconitase | Citrate ⇌ isocitrate (via cis-aconitate) | +13.3 |
| 3 | Isocitrate dehydrogenase | Isocitrate + NAD⁺ → α-ketoglutarate + CO₂ + NADH | −20.9 |
| 4 | α-Ketoglutarate dehydrogenase | α-KG + CoA + NAD⁺ → succinyl-CoA + CO₂ + NADH | −33.5 |
| 5 | Succinyl-CoA synthetase | Succinyl-CoA + GDP + Pᵢ ⇌ succinate + GTP + CoA | −2.9 |
| 6 | Succinate dehydrogenase | Succinate + FAD ⇌ fumarate + FADH₂ | ≈ 0 |
| 7 | Fumarase | Fumarate + H₂O ⇌ L-malate | −3.8 |
| 8 | Malate dehydrogenase | L-Malate + NAD⁺ ⇌ oxaloacetate + NADH | +30.0 |

(Standard tabulated values.) Three steps are strongly exergonic and irreversible in vivo — 1, 3, 4 — and they are, predictably, the three regulated gates.

![The eight citric acid cycle intermediates in reading order: citrate, isocitrate, α-ketoglutarate, succinyl-CoA (drawn as the succinyl thioester with CoA abbreviated at the sulfur), succinate, fumarate, malate, and oxaloacetate. All drawn as free acids (physiological forms are the anions). Structures rendered from the molecular graph (RDKit); formulas machine-verified.](/courses/mcat/biochem/bcs-tca-intermediates.svg)

## The Chemistry Worth Narrating

**Citrate synthase** condenses the acetyl carbanion (an aldol-type attack) onto oxaloacetate’s carbonyl; the resulting citroyl-CoA thioester is hydrolyzed on the enzyme, and *that* hydrolysis supplies the −32.2 kJ/mol pulling the step forward even though matrix oxaloacetate sits at mere micromolar levels. Substrate binding is ordered with induced fit: oxaloacetate must dock first, creating the acetyl-CoA site — protecting the precious thioester from wasteful hydrolysis. **Aconitase** repositions a hydroxyl through a dehydration-rehydration via cis-aconitate, using a [4Fe-4S] iron-sulfur cluster for substrate binding rather than redox — uphill (+13.3) but drained forward by step 3. (Fluoroacetate, a rodenticide, becomes fluorocitrate in vivo — "lethal synthesis" — and jams this step.)

**Isocitrate dehydrogenase** and the **α-ketoglutarate dehydrogenase complex** are the two oxidative decarboxylations: both CO₂ molecules a turn releases exit here, each paired with an NADH. The second complex is PDH’s structural twin — same three-enzyme plan, same five coenzymes, same arsenite vulnerability. **Succinyl-CoA synthetase** converts the succinyl thioester’s energy into GTP (or ATP, by isozyme) through a phosphohistidine enzyme intermediate — the cycle’s only **substrate-level phosphorylation**; nucleoside diphosphate kinase makes GTP and ATP interchangeable. **Succinate dehydrogenase** is unique twice over: its FAD is covalently bonded, and the enzyme is embedded in the inner membrane as respiratory **Complex II**, feeding electrons straight toward ubiquinone (malonate, succinate’s three-carbon lookalike, inhibits it competitively — the classic experiment that helped map the cycle). **Fumarase** adds water stereospecifically across the trans double bond (L-malate only), and **malate dehydrogenase** finishes with a steeply uphill oxidation (+30.0) made viable in vivo the usual way: citrate synthase devours oxaloacetate the instant it forms, holding Q microscopic.`,
        examTip:
          'CO₂ exits only at isocitrate dehydrogenase and α-ketoglutarate dehydrogenase (steps 3 and 4). And isotope-labeling trap: because of citrate’s prochiral handling and the symmetry of succinate, the two carbons released in a given turn are NOT the two that just entered as acetyl-CoA — those leave in later turns.',
        quiz: [
          {
            question:
              'Malonate added to actively respiring mitochondria causes succinate to accumulate. Malonate acts as:',
            options: [
              'an irreversible covalent inhibitor of fumarase',
              'a competitive inhibitor of succinate dehydrogenase, being a close structural analog of succinate',
              'an uncoupler that collapses the proton gradient',
              'an allosteric activator of malate dehydrogenase',
            ],
            correctIndex: 1,
            explanation:
              'Malonate (−OOC–CH₂–COO⁻) differs from succinate by one methylene and occupies the same active site without being dehydrogenatable; excess succinate outcompetes it, the signature of competitive inhibition. Blocking step 6 dams the cycle at succinate — historically, this accumulation pattern was key evidence that the pathway is a cycle.',
          },
          {
            question:
              'Which citric acid cycle step conserves energy as a nucleoside triphosphate by substrate-level phosphorylation?',
            options: [
              'Citrate synthase, via citroyl-CoA hydrolysis',
              'Isocitrate dehydrogenase, via oxidative decarboxylation',
              'Succinyl-CoA synthetase, via a phosphohistidine intermediate yielding GTP (or ATP)',
              'Succinate dehydrogenase, via its covalent FAD',
            ],
            correctIndex: 2,
            explanation:
              'The succinyl-CoA thioester (hydrolysis ΔG′° ≈ −36 kJ/mol) is traded for a phosphoanhydride: Pᵢ displaces CoA to form succinyl phosphate, the phosphoryl group parks on an active-site histidine, then transfers to GDP (or ADP, depending on isozyme) — net ΔG′° only −2.9 kJ/mol, energy conserved rather than lost. Citrate synthase spends its thioester energy on driving condensation, conserving none as NTP.',
          },
        ],
      },
      {
        id: 'bb2_tca_ledger',
        title: 'The Ledger: One Turn, One Acetyl, One Glucose',
        content: `## Per Turn

Acetyl-CoA (2C) in; two CO₂ out; oxaloacetate regenerated. Energy captured: **3 NADH** (steps 3, 4, 8), **1 FADH₂** (step 6), **1 GTP/ATP** (step 5). Using the standard oxidative-phosphorylation conversions (Chapter II.5) of ≈2.5 ATP for each NADH and ≈1.5 for each FADH₂:

3(2.5) + 1(1.5) + 1 = 7.5 + 1.5 + 1 = **10 ATP per acetyl-CoA**

![Schematic one-turn ledger of the citric acid cycle: acetyl-CoA enters at citrate synthase; the turn releases 2 CO₂ (at isocitrate dehydrogenase and α-ketoglutarate dehydrogenase) and captures 3 NADH, 1 FADH₂, and 1 GTP, with oxaloacetate regenerated to begin the next turn. Schematic layout; the per-turn quantities are exact.](/courses/mcat/biochem/bc2-tca-ledger.svg)

## Per Glucose, Computed Twice

Route one — by stage: glycolysis nets 2 ATP + 2 NADH; PDH ×2 gives 2 NADH; two cycle turns give 20 ATP-equivalents. Stage sums: 2 + (2 × 2.5) + (2 × 2.5) + 20 = 2 + 5 + 5 + 20 = **32 ATP** — when cytosolic NADH enters via the malate-aspartate shuttle at full 2.5 value. If the glycerol 3-phosphate shuttle delivers those electrons at FADH₂ value instead, the glycolytic pair earns 3 rather than 5: **30 ATP**. Route two — by carrier census: 10 NADH (2 glycolytic + 2 PDH + 6 cycle) × 2.5 = 25, 2 FADH₂ × 1.5 = 3, 4 substrate-level (2 glycolytic + 2 GTP) = 4; 25 + 3 + 4 = 32. ✓ The honest range **30–32** (these conversion factors are measured, non-integer stoichiometries) replaces the older textbook 36–38.

## Efficiency, and the Oxygen Paradox

Standard-state audit: 32 × 30.5 = 976 kJ/mol captured of the 2,840 kJ/mol released by complete glucose combustion — about **34%**. Under real cellular conditions, where each ATP is worth ~−52 kJ/mol or more (ΔGp, Chapter II.1), the recovery approaches **65%** — remarkable engineering. One conceptual trap remains: no step of the cycle uses O₂, yet the cycle is strictly aerobic in practice, because its NAD⁺ and FAD return only when the respiratory chain — whose final acceptor is O₂ — reoxidizes them. Cut the oxygen and the cycle stops for the same reason anaerobic glycolysis needed fermentation: no acceptor, no oxidation.`,
        quiz: [
          {
            question:
              'Per single turn, the citric acid cycle produces which haul?',
            options: [
              '2 NADH, 2 FADH₂, 2 GTP, and 1 CO₂',
              '3 NADH, 1 FADH₂, 1 GTP (or ATP), and 2 CO₂',
              '4 NADH, 1 FADH₂, and 4 CO₂',
              '3 NADH, 2 FADH₂, and 2 CO₂',
            ],
            correctIndex: 1,
            explanation:
              'NADH arises at isocitrate dehydrogenase, α-ketoglutarate dehydrogenase, and malate dehydrogenase; FADH₂ at succinate dehydrogenase; the single substrate-level NTP at succinyl-CoA synthetase; and the two CO₂ at the two oxidative decarboxylations. At ~2.5/1.5 conversion that is 10 ATP-equivalents per acetyl-CoA.',
          },
          {
            question:
              'The citric acid cycle consumes no molecular oxygen, yet it halts under anaerobic conditions because:',
            options: [
              'pyruvate cannot enter mitochondria without O₂',
              'NAD⁺ and FAD can be regenerated only by the electron-transport chain, whose terminal acceptor is O₂ — without them the three dehydrogenase steps stall',
              'CO₂ accumulates and reverses the decarboxylation steps',
              'GTP synthesis requires oxygen directly',
            ],
            correctIndex: 1,
            explanation:
              'The cycle’s oxidations are only as sustainable as their electron acceptors. Anoxia leaves the carriers stuck as NADH and FADH₂, and unlike glycolysis, the mitochondrion has no fermentation-style bailout for its carrier pool — so the cycle is obligately aerobic at one remove.',
          },
        ],
      },
      {
        id: 'bb2_tca_hub',
        title: 'The Amphibolic Hub: Withdrawals and Anaplerosis',
        content: `## Withdrawals

Calling the cycle purely catabolic misses half its job — it is **amphibolic**, and its intermediates are the feedstocks of biosynthesis:

- **Citrate** → exported to the cytosol → cleaved to acetyl-CoA for **fatty acid and cholesterol synthesis** (and, en route, it reports to PFK-1).
- **α-Ketoglutarate** → transamination → **glutamate**, thence glutamine, proline, arginine, and nitrogen for purines.
- **Succinyl-CoA** → committed first substrate of **heme (porphyrin) synthesis**.
- **Oxaloacetate** → transamination → **aspartate** (thence pyrimidines) — or out through PEP carboxykinase into **gluconeogenesis**.

## Deposits

Every withdrawal shrinks the pool of catalytic intermediates — remember, the cycle consumes none of them per turn, but it cannot run without them. **Anaplerotic** ("filling-up") reactions restore the pool. The chief one in liver and kidney is an old friend: **pyruvate carboxylase** (biotin, ATP), converting pyruvate to oxaloacetate precisely when its activator **acetyl-CoA** accumulates — the signal that the cycle has fuel but lacks the oxaloacetate to burn it. Elsewhere: PEP carboxykinase run toward oxaloacetate, PEP carboxylase (plants and bacteria), malic enzyme (pyruvate + CO₂ + NADPH → malate), and glutamate dehydrogenase feeding α-ketoglutarate from amino nitrogen. Plants and some microbes add the **glyoxylate cycle** — a bypass skipping both decarboxylations — which lets them build carbohydrate from acetyl-CoA; animals lack it, closing the fat-to-glucose door for good.

## When the Hub Turns Oncogenic

Cycle enzymes are so central that their mutation can drive cancer. Loss-of-function mutations in **succinate dehydrogenase** (pheochromocytoma, paraganglioma) and **fumarase** (leiomyomas, renal cancer) mark both as tumor suppressors: the dammed-up succinate and fumarate behave as **oncometabolites**, inhibiting the α-ketoglutarate-dependent dioxygenases that regulate the hypoxic response and DNA demethylation. Gain-of-function mutations in **isocitrate dehydrogenase** (gliomas, AML) create an enzyme that reduces α-ketoglutarate to **2-hydroxyglutarate**, another dioxygenase-jamming oncometabolite — and the target of approved mutant-IDH inhibitor drugs. The exam angle: metabolites, not just signaling proteins, can be the lesion in cancer.`,
        quiz: [
          {
            question:
              'A hepatocyte diverts large amounts of oxaloacetate into gluconeogenesis and α-ketoglutarate into glutamate synthesis. Which response keeps the citric acid cycle turning?',
            options: [
              'PDH speeds up to convert more acetyl-CoA into oxaloacetate',
              'Anaplerotic reactions — chiefly pyruvate carboxylase, activated by accumulating acetyl-CoA — regenerate four-carbon intermediates',
              'The cycle reverses direction to resynthesize the missing intermediates',
              'Fatty acid oxidation supplies new oxaloacetate directly',
            ],
            correctIndex: 1,
            explanation:
              'Cycle intermediates are catalytic: biosynthetic withdrawals must be matched by deposits, and carboxylation of pyruvate to oxaloacetate is the principal mammalian refill. Acetyl-CoA cannot become oxaloacetate (two carbons enter, two leave as CO₂) — which eliminates the first and last options — and no cellular condition runs the full cycle backward.',
          },
        ],
      },
      {
        id: 'bb2_tca_regulation',
        title: 'Throttling the Wheel: Regulation by Energy Charge',
        content: `## Three Gates, One Question

Flux control sits at the three irreversible steps — **citrate synthase, isocitrate dehydrogenase, α-ketoglutarate dehydrogenase** — plus the PDH gate feeding them, and every effector answers one question: does the cell need ATP right now?

- **Citrate synthase**: governed first by sheer substrate availability (oxaloacetate is scarce and swings with metabolic state); inhibited by NADH, ATP, succinyl-CoA, and its own product citrate.
- **Isocitrate dehydrogenase**: stimulated by **ADP** (the demand signal, raising substrate affinity) and **Ca²⁺**; inhibited by ATP and NADH.
- **α-Ketoglutarate dehydrogenase**: inhibited by its products **succinyl-CoA and NADH**; stimulated by **Ca²⁺**.

The recurring signals compress to a slogan: **NADH and ATP say stop; ADP, NAD⁺, and Ca²⁺ say go.** Calcium deserves its own line — it activates PDH phosphatase, isocitrate dehydrogenase, and α-ketoglutarate dehydrogenase all at once, so the ion commanding muscle contraction simultaneously orders up the ATP to pay for it, with no lag and no hormone required.

## The Crosstalk That Ties the Chapters Together

When flux through the gates slows, **citrate** backs up, escapes to the cytosol, and inhibits **PFK-1** — the cycle personally telling glycolysis to stop shipping carbon (and, via acetyl-CoA and citrate’s role in fat synthesis, to reroute it toward storage). Meanwhile acetyl-CoA’s pairing of PDH inhibition with pyruvate carboxylase activation converts "cycle well fed" into "make glucose instead." Rehearse the fed-fast contrast once: after a carbohydrate meal — insulin high, PDH dephosphorylated and active, cycle brisk, citrate exported for fat synthesis; in fasting muscle burning fat — NADH and acetyl-CoA high, PDH phosphorylated and silent, glucose spared for the brain. If you can narrate those two states, every effector on this page is already in place.`,
        importantNote:
          'The cycle has no hormonal master switch of its own — its throttles are metabolite and Ca²⁺ signals reporting energy state, with hormones acting upstream (on PDH phosphatase via insulin, and on the pathways that feed the wheel). Contrast this with glycogen’s cascade-driven control in Chapter II.3.',
        quiz: [
          {
            question:
              'During intense exercise, cytosolic and mitochondrial Ca²⁺ rise. The direct metabolic consequence within the citric acid cycle machinery is:',
            options: [
              'inhibition of citrate synthase, conserving oxaloacetate',
              'coordinated activation of PDH phosphatase, isocitrate dehydrogenase, and α-ketoglutarate dehydrogenase, accelerating acetyl-CoA production and cycle flux',
              'phosphorylation of the entire cycle by PKA',
              'export of citrate to activate PFK-1',
            ],
            correctIndex: 1,
            explanation:
              'Ca²⁺ is the exercise-coupling signal: it dephosphorylates and awakens PDH (via the phosphatase) and directly stimulates the two dehydrogenase gates inside the cycle, matching ATP synthesis to contractile demand in real time. Citrate export happens in the opposite, energy-replete state — and citrate inhibits PFK-1, never activates it.',
          },
          {
            question:
              'Which effector profile would maximally slow the citric acid cycle?',
            options: [
              'High ADP, high NAD⁺, high Ca²⁺',
              'High NADH, high ATP, high succinyl-CoA',
              'High pyruvate, low acetyl-CoA, high Pᵢ',
              'Low citrate, low NADH, high ADP',
            ],
            correctIndex: 1,
            explanation:
              'NADH and ATP are the universal "energy sufficient" brakes at all three gates, and succinyl-CoA adds product inhibition at α-ketoglutarate dehydrogenase and citrate synthase. The profiles built on ADP, NAD⁺, Ca²⁺, or abundant substrate are all accelerators — they signal demand or supply, not surplus.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'PDH complex: E1-TPP decarboxylates pyruvate; E2-lipoate’s swinging arm oxidizes and transfers the acetyl to CoA (substrate channeling); E3-FAD reoxidizes lipoamide to NAD⁺. Five coenzymes (TPP, lipoate, CoA, FAD, NAD⁺) from four vitamins (B1, B5, B2, B3) — shared verbatim by α-KG dehydrogenase and branched-chain ketoacid dehydrogenase. Reaction: pyruvate + CoA + NAD⁺ → acetyl-CoA + CO₂ + NADH, ΔG′° = −33.4 kJ/mol, irreversible — the no-return door that bars fat-to-glucose.',
      'PDH control: products NADH/acetyl-CoA inhibit directly; resident PDH kinase (activated by ATP/NADH/acetyl-CoA, inhibited by ADP/NAD⁺/pyruvate) parks the complex off; PDH phosphatase (Ca²⁺, insulin) restarts it. Failures: thiamine deficiency (beriberi, Wernicke-Korsakoff), arsenite trapping dihydrolipoamide dithiols, congenital PDH deficiency → lactic acidosis.',
      'Eight steps with ΔG′° (kJ/mol): citrate synthase −32.2 (ordered binding, citroyl-CoA hydrolysis pays; micromolar OAA), aconitase +13.3 ([4Fe-4S]; fluorocitrate blocks), isocitrate DH −20.9 (CO₂ + NADH), α-KG DH −33.5 (CO₂ + NADH; PDH’s twin), succinyl-CoA synthetase −2.9 (phospho-His; GTP/ATP — the substrate-level phosphorylation), succinate DH ≈ 0 (covalent FAD; = Complex II; malonate competitive), fumarase −3.8 (stereospecific → L-malate), malate DH +30.0 (pulled by OAA withdrawal).',
      'Both CO₂ leave at steps 3 and 4 — and, by prochiral bookkeeping, they are not the two carbons that entered that turn as acetyl-CoA.',
      'Ledger: per turn 3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂ → 10 ATP per acetyl-CoA (2.5/1.5 conversions). Per glucose: 30–32 ATP depending on the cytosolic-NADH shuttle (glycerol 3-phosphate vs malate-aspartate). Efficiency ≈ 34% at standard state (976/2,840 kJ), ≈ 65% at cellular ΔGp.',
      'No O₂ appears in any cycle reaction, yet the cycle is obligately aerobic: its carriers are regenerated only by the O₂-terminated respiratory chain.',
      'Amphibolic exits: citrate → cytosolic acetyl-CoA (fatty acids, cholesterol); α-KG → glutamate family; succinyl-CoA → heme; OAA → aspartate/pyrimidines and gluconeogenesis. Anaplerotic refills: pyruvate carboxylase (biotin, ATP, acetyl-CoA-activated) foremost, plus PEPCK reversal, PEP carboxylase (plants/bacteria), malic enzyme, glutamate dehydrogenase; the glyoxylate cycle (absent in animals) lets plants/microbes make sugar from acetyl-CoA.',
      'Cancer hooks: SDH and fumarase are tumor suppressors (pheochromocytoma; leiomyoma/renal cancer) — succinate and fumarate act as oncometabolites inhibiting α-KG-dependent dioxygenases; mutant IDH (glioma, AML) makes 2-hydroxyglutarate, target of approved inhibitors.',
      'Regulation: gates at citrate synthase, IDH, α-KG DH (+ the PDH feeder). NADH and ATP brake; ADP, NAD⁺, Ca²⁺ (which also flips PDH on) accelerate; succinyl-CoA and citrate add product inhibition — and exported citrate reaches back to inhibit PFK-1, coordinating the wheel with glycolysis.',
    ],
  },
};

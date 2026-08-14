/**
 * MCAT Biochemistry I chapters — carbohydrates, lipids, membranes, nucleotides.
 * Split verbatim out of mcat-course-data.ts; chapter plan in docs/mcat/BIOCHEM_CHAPTERS.md.
 * Depth pass benchmarked against a standard biochemistry textbook treatment
 * (concept coverage only; all prose original). AI-generated. Requires SME review.
 */

import type { TopicLesson } from './mcat-course-data';

export const MCAT_BIOCHEM1C_LESSONS: Record<string, TopicLesson> = {
  // ── Biochemistry I.8: Carbohydrates ─────────────────────────────────────
  cpb1_carbohydrates: {
    topicId: 'cpb1_carbohydrates',
    title: 'Carbohydrates',
    domainWeight: '25%',
    overview:
      'Carbohydrates are the MCAT\'s stereochemistry playground: one aldehyde chain generates sixteen stereoisomers, closes into rings through a brand-new chiral center, and links into polymers where a single bond geometry decides whether you can digest the result. This chapter builds monosaccharides up from the Fischer projection, follows the glycosidic bond through the named disaccharides into the storage and structural polysaccharides, then adds the extracellular carbohydrates — glycosaminoglycans, proteoglycans, glycoproteins — and ends with sugars as information: blood groups and the lectins that read them.',
    sections: [
      {
        id: 'cpb1_carb_mono',
        title: 'Monosaccharides: Families and Stereochemistry',
        content: `## One Formula, Many Sugars

Monosaccharides are polyhydroxy aldehydes (**aldoses**) or polyhydroxy ketones (**ketoses**), most with the general formula (CH₂O)ₙ. Classify by both features at once — carbonyl type plus carbon count. The three-carbon floor of the family is glyceraldehyde (the aldotriose) and dihydroxyacetone (the ketotriose, the only common sugar with no chiral center); the MCAT's working set is pentoses and hexoses:

| Sugar | Class | Where it appears |
|-------|-------|------------------|
| Glucose | Aldohexose | Blood sugar; the unit of starch, glycogen, and cellulose |
| Fructose | Ketohexose | Fruit sugar; half of sucrose |
| Galactose | Aldohexose | Half of lactose |
| Mannose | Aldohexose | Glycoprotein oligosaccharides |
| Ribose | Aldopentose | RNA, ATP, NAD⁺ |
| 2-Deoxyribose | Aldopentose (deoxy) | DNA — one missing hydroxyl, chapter I.11's whole story |

## D and L, Epimers and Enantiomers

In a **Fischer projection** the carbonyl sits at the top and the chain hangs below. The chiral carbon **farthest from the carbonyl** assigns the family: hydroxyl on the right means **D**, on the left means **L** — and human biochemistry runs almost entirely on D sugars, the mirror of the L amino acids from chapter I.2.

With n chiral centers a sugar has 2ⁿ stereoisomers. An aldohexose has four centers, so sixteen isomers — eight D and eight L; a ketohexose like fructose has only three centers, so eight. The vocabulary the MCAT tests:

- **Enantiomers** — differ at every center; nonsuperimposable mirror images (D-glucose vs L-glucose).
- **Diastereomers** — differ at some but not all centers.
- **Epimers** — diastereomers differing at exactly **one** center: glucose vs galactose (C4), glucose vs mannose (C2).

## The Derivative Toolkit

Cells modify the parent sugars in a few standard ways, and each modified sugar reappears later in the chapter:

- **Amino sugars** — an amino group replaces the C2 hydroxyl: glucosamine, usually acetylated to **N-acetylglucosamine (GlcNAc)**. Chitin and half of every glycosaminoglycan are built from them. **Sialic acid** (N-acetylneuraminic acid) is the negatively charged nine-carbon derivative capping many cell-surface chains.
- **Sugar acids** — oxidize the aldehyde carbon to get aldonic acids (gluconate); oxidize C6 instead to get **uronic acids** (glucuronate), the acidic half of most glycosaminoglycans.
- **Sugar phosphates** — glucose 6-phosphate and friends: the ester's charge traps the sugar inside the cell and primes it for metabolism.
- **Deoxy sugars** — remove a hydroxyl: 2-deoxyribose in DNA, and **fucose**, the terminal sugar of the blood-group H antigen at this chapter's end.`,
        examTip:
          'When a question shows two Fischer projections, count the differing centers first: one difference makes epimers, all of them make enantiomers, and anything in between is a plain diastereomer.',
      },
      {
        id: 'cpb1_carb_rings',
        title: 'Rings, Anomers, and Mutarotation',
        content: `## The Ring Is a Hemiacetal

In water, open-chain glucose is a trace species: the C5 hydroxyl attacks the C1 aldehyde to close a six-membered **pyranose** ring — an intramolecular **hemiacetal**. Fructose closes C5 onto its C2 ketone, giving a five-membered **furanose** hemiketal. (The ring names honor the parent heterocycles pyran and furan.) Ring closure converts the flat carbonyl carbon into a new stereocenter — the **anomeric carbon** — so one open chain yields two ring stereoisomers, the **anomers**.

![The two ring forms of D-glucose. Closure of the C5 hydroxyl onto the C1 aldehyde creates a new stereocenter, the anomeric carbon: its hydroxyl points down in the α anomer and up in the β anomer in the Haworth convention, with the open chain as the bridge between them. Schematic — bond angles are drawn by convention, not computed geometry.](/courses/mcat/biochem/bc1-glucose-anomers.svg)

In the Haworth drawing, **α** puts the anomeric hydroxyl down (opposite the CH₂OH) and **β** puts it up (same side). Because the anomers interconvert only through the open chain, a solution starting from pure α or pure β drifts to the same equilibrium — **mutarotation**, watched in the lab as a slow change in optical rotation. For glucose the equilibrium sits at roughly **one-third α, two-thirds β**, with only traces of the open chain and furanose forms (standard values). The β anomer wins because its anomeric hydroxyl sits equatorial on the chair, where every bulky group can be equatorial at once.

## Reducing Sugars

A free anomeric carbon can reopen to the aldehyde and reduce mild oxidants — Cu²⁺ in Benedict's and Fehling's reagents — which defines a **reducing sugar**. Ketoses pass the test too: under the assay's alkaline conditions fructose isomerizes to an aldose, so "ketose" is never the reason a sugar fails Benedict's. Lock the anomeric carbon into a glycosidic bond and both mutarotation and the reducing chemistry stop.

The same open-chain reactivity happens inside you, uncatalyzed: glucose condenses slowly with protein amino groups — **glycation**, no enzyme involved. Glycated hemoglobin (**HbA1c**) accumulates over an erythrocyte's roughly 120-day lifespan in proportion to average blood glucose, which is exactly why HbA1c is the standard integrated measure of glycemic control in diabetes (a few percent of hemoglobin normally; higher with sustained hyperglycemia).`,
        importantNote:
          'The anomeric carbon is the ring carbon bonded to two oxygens — find it first in any structure, because every question about α vs β, mutarotation, reducing ends, and glycosidic bonds runs through it.',
      },
      {
        id: 'cpb1_carb_glycosidic',
        title: 'Glycosidic Bonds and the Disaccharides',
        content: `## Condensation to an Acetal

A **glycosidic bond** forms when the anomeric hydroxyl of one sugar condenses with a hydroxyl of another, releasing water and converting the hemiacetal into a full **acetal** — stable to base, hydrolyzed by aqueous acid or by dedicated, linkage-specific enzymes. The naming convention packs the whole geometry into one token: anomeric configuration, then the two carbons joined, written from the nonreducing end — maltose is Glc(α1→4)Glc. A chain's **reducing end** is the one residue whose anomeric carbon is still free.

The disaccharides to know:

- **Maltose** — Glc(α1→4)Glc; the repeating step of starch digestion. One anomeric carbon remains free → reducing.
- **Lactose** — Gal(**β**1→4)Glc; milk sugar, cleaved by lactase in the small intestine. Reducing.
- **Sucrose** — Glc(α1↔2β)Fru: the bond runs **anomeric carbon to anomeric carbon**, so neither ring can ever reopen. Nonreducing, incapable of mutarotation — chemical stability that suits its job as the transport sugar of plants.
- **Trehalose** — Glc(α1↔1α)Glc, the same double-anomeric trick; the circulating sugar of insect hemolymph.

## Lactose Intolerance, Mechanistically

In most of the world's adults, lactase expression declines after childhood (lactase persistence is the evolutionarily recent exception, common where dairying is old). The consequences are pure chapter logic. Intact lactose cannot be absorbed, so it stays in the gut lumen as an **osmotically active solute**, holding water in the intestine — watery diarrhea. Colonic bacteria then ferment the free sugar, generating CO₂ and other gases — bloating and cramps. Nothing about the sugar is toxic; the entire syndrome is one missing β-galactosidase plus osmosis plus microbiology.`,
        quiz: [
          {
            question:
              'Sucrose gives a negative Benedict\'s (reducing sugar) test, while maltose and lactose are positive. Why?',
            options: [
              'Sucrose contains fructose, and ketoses cannot be oxidized',
              'Sucrose\'s glycosidic bond joins the anomeric carbons of both monosaccharides, so neither ring can open to a free carbonyl',
              'Sucrose is too large to react with the reagent',
              'α-glycosidic bonds resist the assay while β bonds react',
            ],
            correctIndex: 1,
            explanation:
              'The sucrose linkage runs from glucose\'s C1 to fructose\'s C2 — both anomeric carbons — so no ring can reopen to a reducing carbonyl. Maltose and lactose each keep one free anomeric carbon and stay reducing. The fructose distractor fails because free fructose is itself a reducing sugar (ketoses isomerize under assay conditions), and linkage geometry (α vs β) is irrelevant to the test.',
          },
        ],
      },
      {
        id: 'cpb1_carb_poly',
        title: 'Polysaccharide Architecture',
        content: `## Storage vs Structure Is One Bond

| Polysaccharide | Unit and linkage | Branching | Role |
|----------------|------------------|-----------|------|
| Amylose (starch) | Glc α1→4 | None | Plant energy storage |
| Amylopectin (starch) | Glc α1→4 | α1→6, roughly every 24–30 residues | Plant energy storage |
| Glycogen | Glc α1→4 | α1→6, roughly every 8–12 residues | Animal storage — liver and muscle |
| Cellulose | Glc β1→4 | None | Plant cell walls; dietary fiber |
| Chitin | GlcNAc β1→4 | None | Arthropod exoskeletons, fungal walls |

Chemically the drama is one stereocenter. In an **α1→4** chain, successive chairs sit at an angle, so the polymer curls into an open helix — the shape amylase digests and iodine stains. In a **β1→4** chain each residue flips roughly 180° relative to its neighbor, so the polymer runs straight; parallel cellulose chains hydrogen-bond into rigid, nearly anhydrous fibers, and no human enzyme cleaves the linkage. Grazing animals digest cellulose only by subcontracting to gut microbes. Chitin is the same engineering with N-acetylglucosamine — cellulose's logic in an exoskeleton. Bacteria contribute two more entries: **peptidoglycan**, a β1→4 sugar polymer cross-linked by short peptides that armors the cell wall — the target of lysozyme and penicillin — and **dextran**, an α1→6 glucose polymer whose sticky secreted form is the matrix of dental plaque.

## Why Polymerize Glucose at All?

An osmotic argument the MCAT rewards: a liver cell's glycogen represents an amount of glucose that, dissolved as free monomer, would approach a **0.4 M** solution — osmotically catastrophic — while the polymer itself contributes almost nothing to osmolarity (standard textbook comparison). Storage polymers are how a cell holds molar quantities of fuel at micromolar particle counts. Liver glycogen can reach several percent of the organ's wet weight; muscle keeps its own supply.

## Branching Is a Speed Feature

Degradative enzymes work only at **nonreducing ends**, and branching multiplies exactly those: n branches means n + 1 nonreducing ends on one molecule. Glycogen phosphorylase — chapter I.7's covalently regulated enzyme — therefore attacks a densely branched glycogen granule at many points in parallel: α1→6 branching every 8–12 residues (versus amylopectin's sparser 24–30) is what makes epinephrine-triggered glucose mobilization fast. The branches also keep the polymer compact and soluble, where unbranched cellulose is a brick.`,
        examTip:
          'If a passage calls a polysaccharide indigestible, check the linkage before anything else: humans hydrolyze the α-glycosidic bonds of starch and glycogen but have no enzyme for the β-1,4 bonds of cellulose — the answer is bond geometry, not the monosaccharide.',
      },
      {
        id: 'cpb1_carb_glycoconj',
        title: 'Glycosaminoglycans, Proteoglycans, and Glycoproteins',
        content: `## The Extracellular Gel

**Glycosaminoglycans (GAGs)** are the linear polysaccharides of the extracellular matrix: a repeating disaccharide of an **amino sugar** (GlcNAc or GalNAc) alternating with a **uronic acid** (keratan sulfate is the standard exception, carrying galactose instead). Most are further **sulfated**. The result is a polymer studded with carboxylates and sulfates — so densely negative that charge repulsion forces an extended conformation, and so hydrophilic that each chain drags an enormous shell of water. That physics is the function: GAG-rich matrices are hydrated gels that lubricate and absorb compression.

The named examples earn their lines:

- **Hyaluronan** — the giant of the family (tens of thousands of disaccharide repeats), unsulfated and protein-free; the viscous cushion of synovial fluid and the vitreous humor.
- **Chondroitin sulfate** — the workhorse of cartilage; its bound water is what a joint compresses.
- **Keratan sulfate** — cornea, cartilage, bone; the no-uronic-acid exception.
- **Heparan sulfate** — on nearly every cell surface, binding growth factors and matrix proteins.
- **Heparin** — the intensely sulfated mast-cell relative, used clinically as an anticoagulant: it binds antithrombin and dramatically accelerates its inactivation of clotting proteases.

## Proteoglycan vs Glycoprotein — a Distinction the MCAT Loves

Both are protein–sugar conjugates; the proportions and architecture differ completely.

- **Proteoglycans** are GAG machines: a core protein carrying one or more **long, unbranched, sulfated GAG chains**, with carbohydrate dominating the mass. Cartilage's aggrecan molecules bind by the hundreds along a single hyaluronan thread, building aggregates of enormous size; syndecans do the same job in miniature on cell membranes.
- **Glycoproteins** carry **short, branched oligosaccharides** — protein dominates. The chains attach two ways: **N-linked** to an asparagine side chain, or **O-linked** to a serine or threonine hydroxyl. They are installed in the ER and remodeled in the Golgi, where they serve as folding quality-control tags and address labels; most secreted and cell-surface proteins are glycosylated. Mucins — O-glycosylated to the point of being molecular bottle brushes — make mucus viscous. Glycosylation is not decorative: dozens of distinct congenital disorders of glycosylation, each a defect in building these chains, produce severe multisystem disease (standard clinical note).

Membrane **glycolipids** (chapter I.9's gangliosides) complete the set: every class of surface molecule can carry the sugar coat, and all of it faces outward.`,
        quiz: [
          {
            question:
              'A linear polysaccharide is built from a repeating disaccharide of an N-acetylated amino sugar and a uronic acid, is heavily sulfated, and adopts an extended, heavily hydrated conformation in the extracellular matrix. It is best classified as a:',
            options: [
              'Glycosaminoglycan',
              'Glycoprotein oligosaccharide',
              'Storage polysaccharide, like glycogen',
              'Peptidoglycan',
            ],
            correctIndex: 0,
            explanation:
              'Amino sugar alternating with uronic acid, sulfation, and an extended water-swollen conformation are the definition of a glycosaminoglycan — the chondroitin sulfate and heparin family. Glycoprotein oligosaccharides are short and branched, not linear polymers; glycogen is a branched α-1,4/α-1,6 glucose homopolymer built for fuel, not matrix; and peptidoglycan is the peptide-cross-linked wall polymer of bacteria, not an animal ECM component.',
          },
        ],
      },
      {
        id: 'cpb1_carb_code',
        title: 'Sugars as Information: Blood Groups and Lectins',
        content: `## The Sugar Code

Every eukaryotic cell faces the world through a **glycocalyx** — the oligosaccharides of its surface glycoproteins and glycolipids. Sugars make superb identity tags because a short chain can encode staggering variety: each link chooses among several hydroxyls, either anomeric configuration, and optional branching, so a handful of monosaccharides generates orders of magnitude more distinct structures than the same number of amino acids in a peptide.

## ABO in One Enzyme

The **ABO blood groups** are the classic worked example. Everyone assembles the same core chain ending in fucose — the **H antigen** — displayed on both membrane glycolipids and glycoproteins. One glycosyltransferase locus finishes the job: the **A allele's** enzyme adds a terminal **N-acetylgalactosamine**, the **B allele's** adds a terminal **galactose**, and the **O allele** encodes an inactive enzyme, leaving bare H. One terminal sugar is the entire antigenic difference. The immune system does the rest — a person makes antibodies against whichever terminal sugar they lack, which is why mismatched transfusion causes agglutination and why type O red cells, carrying neither decoration, are the universal donor cells.

## Lectins, Honestly

**Lectins** are proteins that bind specific oligosaccharides — the readers of the sugar code. Three examples carry the concept. **Selectins** on endothelium grip carbohydrates on passing leukocytes, the low-affinity tethering that lets white cells roll to a stop at sites of inflammation. Liver lectins recognize blood glycoproteins whose terminal sialic acids have worn away, pulling aged proteins from circulation — a carbohydrate clock. And pathogens read the code in reverse: influenza virus docks on the sialic acids of respiratory cells before entry. For the MCAT, that is the honest boundary: know that lectin means sugar-reading protein, know one example in each direction, and leave the rest of glycobiology to the glycobiologists.`,
        examTip:
          'Blood-group questions reduce to one enzyme: A and B alleles are glycosyltransferases differing in the single sugar they add to the shared H antigen, and O adds nothing. Antibodies form against the terminal sugar a person lacks — the genetics, biochemistry, and transfusion logic all follow from that.',
      },
    ],
    keyTakeaways: [
      'D vs L is read at the chiral carbon farthest from the carbonyl; epimers differ at exactly one center — glucose/galactose at C4, glucose/mannose at C2.',
      'Ring closure creates the anomeric carbon; α and β anomers interconvert by mutarotation (about one-third α, two-thirds β for glucose) only while that carbon stays free.',
      'Reducing sugar = free anomeric carbon; glycation of hemoglobin (HbA1c) is the same open-chain chemistry running uncatalyzed in the blood.',
      'Know the linkages cold: maltose Glc(α1→4)Glc, lactose Gal(β1→4)Glc, sucrose Glc(α1↔2β)Fru — sucrose ties up both anomeric carbons and is the nonreducing exception.',
      'α-1,4 polymers coil and are digestible; β-1,4 cellulose and chitin run straight, hydrogen-bond into fibers, and resist every human enzyme.',
      'Glycogen branches (α-1,6, every 8–12 residues vs amylopectin\'s 24–30) multiply the nonreducing ends phosphorylase attacks in parallel — and polymerizing glucose sidesteps an osmotic catastrophe.',
      'Glycosaminoglycans are extended, sulfated amino sugar–uronic acid polymers that gel water (hyaluronan, chondroitin sulfate, heparin); proteoglycans carry long unbranched GAGs, glycoproteins carry short branched N-linked (Asn) or O-linked (Ser/Thr) chains.',
      'ABO antigens differ by one glycosyltransferase-added terminal sugar on the shared H antigen; lectins (selectins, liver clearance receptors, viral attachment proteins) are the proteins that read such sugar labels.',
    ],
  },

  // ── Biochemistry I.9: Lipids ────────────────────────────────────────────
  cpb1_lipids: {
    topicId: 'cpb1_lipids',
    title: 'Lipids',
    domainWeight: '25%',
    overview:
      'Lipids are grouped by a shared property — insolubility in water — rather than a shared structure, and the MCAT exploits that breadth: one passage can move from fuel storage to membranes to hormone signaling without leaving the chapter. The organizing physics is the hydrophobic effect from chapter I.1. Here we do fatty acid nomenclature properly (Δ and ω systems, the named acids, essentiality), triacylglycerols as the dense fuel, each membrane lipid family by its backbone chemistry — glycerophospholipids, ether lipids, sphingolipids, cholesterol — and the lipids that act as signals: eicosanoids, steroid hormones, and the fat-soluble vitamins.',
    sections: [
      {
        id: 'cpb1_lip_fatty',
        title: 'Fatty Acids: Structure and Nomenclature',
        content: `## Anatomy and Naming

A fatty acid is a carboxylic acid head on a hydrocarbon tail of (almost always) an **even** number of carbons — 12 to 24, most commonly 16 and 18 — because the cell builds them two at a time from acetyl-CoA. The shorthand **carbons:double bonds** does most of the work, and two numbering systems locate the double bonds:

- **Δ (delta)** counts from the **carboxyl carbon as C1**: oleate is 18:1(Δ9), a double bond between C9 and C10.
- **ω (omega)** counts from the **methyl end**: an ω-3 fatty acid has its first double bond three carbons in from the tail. Physiology cares about the ω position, which is why nutrition speaks ω while chemistry speaks Δ.

The named acids worth memorizing:

| Acid | Shorthand | Note |
|------|-----------|------|
| Palmitate | 16:0 | The primary product of fatty acid synthesis |
| Stearate | 18:0 | Fully saturated 18-carbon reference |
| Oleate | 18:1(Δ9), ω-9 | The most common monounsaturated acid |
| Linoleate | 18:2(Δ9,12), ω-6 | **Essential** |
| α-Linolenate | 18:3(Δ9,12,15), ω-3 | **Essential**; parent of EPA and DHA |
| Arachidonate | 20:4(Δ5,8,11,14), ω-6 | Made from linoleate; the eicosanoid precursor |

**Essential** means exactly this: human desaturases cannot install double bonds beyond Δ9, so the ω-6 and ω-3 families must start from dietary linoleate and α-linolenate. Elongation and further desaturation then build arachidonate (from ω-6) and EPA/DHA (from ω-3). In natural fatty acids the double bonds are almost always **cis** and, when multiple, are methylene-interrupted rather than conjugated. Nutrition adds two testable wrinkles. The ω-6 and ω-3 families compete for the same downstream enzymes, so dietary guidance is framed as a ratio — a few-to-one, against the far more ω-6-heavy typical Western diet (standard comparison, and the rationale behind fish-oil enthusiasm). And trans fats reach the diet two ways: industrial partial hydrogenation, and, in traces, microbial fermentation in ruminants — which is why dairy fat carries a little even without processing.

## Cis Kinks and Melting

Chain physics sets solubility first: the hydrocarbon tail is the insoluble part, so the longer and more saturated the acid, the less of it water tolerates — short-chain acids dissolve slightly through their ionized carboxylate, long ones barely at all. Melting follows the same packing logic. Saturated tails are flexible but straighten to pack tightly in van der Waals contact — solid fats. Each **cis** double bond locks a rigid kink into the chain that frustrates packing and drops the melting point. The 18-carbon series makes the trend quantitative (standard tabulated values): stearate 18:0 melts near 70 °C, oleate 18:1 near 13 °C, linoleate 18:2 near −5 °C, α-linolenate 18:3 near −11 °C — same length, three kinks, an 80-degree slide. Industrial partial hydrogenation generates **trans** double bonds, which leave the chain nearly straight: trans fats pack and melt like saturated ones, and dietary trans fat is associated with cardiovascular risk.

![Saturated, cis-unsaturated, and trans-unsaturated fatty acid tails. The cis double bond forces a rigid kink that disrupts chain packing and lowers melting point; the trans isomer stays nearly straight and packs like a saturated chain. Schematic — chain geometry is illustrative, not a computed conformation.](/courses/mcat/biochem/bc1-fatty-acid-kinks.svg)`,
        examTip:
          'Melting-point and fluidity rankings reduce to packing: longer tails melt higher, and each cis double bond subtracts. Rank by length first, then by kinks — and translate ω to Δ before comparing positions (for an 18-carbon acid, ω-3 is Δ15).',
        quiz: [
          {
            question:
              'Which fatty acid has the lowest melting point?',
            options: [
              'Palmitate (16:0)',
              'Stearate (18:0)',
              'Oleate (18:1, cis)',
              'Linoleate (18:2, cis)',
            ],
            correctIndex: 3,
            explanation:
              'Each cis double bond adds a kink that prevents tight chain packing, weakening intermolecular van der Waals contacts and lowering the melting point. Among tails of similar length, the most cis-unsaturated (18:2) melts lowest; the two saturated chains melt highest, ordered by length, with stearate (18:0) at the top.',
          },
        ],
      },
      {
        id: 'cpb1_lip_tag',
        title: 'Storage Lipids: Triacylglycerols and Waxes',
        content: `## Three Esters on Glycerol

A **triacylglycerol** is glycerol with all three hydroxyls esterified to fatty acids — three condensations, three waters out. With the polar groups consumed, the molecule is anhydrous and neutral, so it coalesces into droplets rather than dissolving or forming bilayers. Adipocytes are cells organized around one such droplet; plant seeds pack oil bodies for germination.

## Why Fat Beats Glycogen as Storage

Two compounding reasons, both MCAT favorites:

- **More reduced carbons.** Fatty acid carbons are mostly CH₂ — far from CO₂ on the oxidation ladder — while a sugar's CHOH carbons start half-oxidized. Full oxidation of fat therefore yields more than twice the energy per gram: about 9 kcal/g versus about 4 kcal/g for carbohydrate (standard tabulated values).
- **No water of hydration.** Stored glycogen binds roughly 2 g of water per gram of polymer; triacylglycerol droplets carry essentially none. Per gram of actual body weight, the stored-energy gap widens further — an adipose reserve of a few weeks would be an impossible load as hydrated glycogen, and the body's total glycogen covers only about a day.

Mobilization is hormonal: glucagon and epinephrine — the same signals that flipped the glycogen enzymes in chapter I.7 — activate **lipases** that hydrolyze the esters and release fatty acids to the blood. Fat doubles as thermal insulation in marine and hibernating mammals. Two side notes the MCAT keeps: hydrolyzing the esters with strong base instead of an enzyme is **saponification**, and the fatty acid salts it yields are soaps — amphipathic by construction; and **waxes**, esters of long-chain fatty acids with long-chain alcohols, are the firmer, fully waterproof cousins coating leaves, feathers, and honeycomb.`,
        importantNote:
          'The energy-density argument is about oxidation state: the more reduced the carbon, the more energy its full oxidation to CO₂ yields. This one principle prices every fuel the metabolism chapters will burn.',
      },
      {
        id: 'cpb1_lip_glycero',
        title: 'Glycerophospholipids and Ether Lipids',
        content: `## The Bulk Lipid of Membranes

**Glycerophospholipids** are the majority lipid of nearly every membrane. The build: glycerol carries fatty acids on C1 and C2 — typically a saturated 16- or 18-carbon chain at C1 and an unsaturated 18- or 20-carbon chain at C2 — and a phosphate on C3, making **phosphatidic acid**, the parent compound. A head-group alcohol esterified to that phosphate names the lipid:

| Lipid | Head group | Note |
|-------|-----------|------|
| Phosphatidylcholine (PC) | Choline | Abundant, zwitterionic; mostly outer leaflet |
| Phosphatidylethanolamine (PE) | Ethanolamine | Zwitterionic; mostly inner leaflet |
| Phosphatidylserine (PS) | Serine | Net negative; inner leaflet — its surfacing is an apoptosis flag (chapter I.10) |
| Phosphatidylinositol (PI) | Inositol | Phosphorylated to PIP₂, the signaling precursor |
| Cardiolipin | Two phosphatidic acids sharing a glycerol | Signature lipid of the inner mitochondrial membrane |

Every glycerophospholipid is **amphipathic** — charged phosphate-plus-head above, twin hydrocarbon tails below — which is the whole qualification for bilayer duty. Charge is worth reading off the table: the phosphodiester itself is anionic, so PC and PE (whose head amines carry a compensating positive charge) come out roughly neutral zwitterions, while PS and the phosphorylated inositols are net negative — one reason the membrane's cytosolic face carries the negative charge. The same architecture generalizes beyond animals: plant chloroplast membranes run on **galactolipids** (sugar heads, no phosphate), and archaea build theirs with ether-linked, branched tails sturdy enough for boiling springs — same amphipathic logic, different chemistry (standard comparative facts).

Dedicated **phospholipases** hydrolyze each position selectively; phospholipase A2, abundant in snake venoms, clips the C2 fatty acid to leave membrane-dissolving lysophospholipids, and the same enzyme's controlled activity releases arachidonate for eicosanoid synthesis two sections from now. Phospholipase C instead removes the head group — its hormone-triggered action on the phosphorylated inositol PIP₂ releases the paired second messengers IP₃ and diacylglycerol, a signaling reaction this course meets again with the receptors that command it.

## Ether Lipids

A variant family swaps the C1 **ester** for an **ether** linkage. **Plasmalogens** — ether lipids with a vinyl ether double bond — are major phospholipids of heart muscle and myelin. **Platelet-activating factor**, an ether lipid with an acetyl group in place of the C2 fatty acid, is a potent signaling lipid of inflammation and allergic responses: a membrane-lipid skeleton repurposed as a hormone, a preview of this chapter's closing theme.`,
        examTip:
          'Phospholipid names are assembly instructions: "phosphatidyl-X" means glycerol + two fatty acids + phosphate + X. Recognize the backbone and the head group and you can predict charge, leaflet, and function without memorizing each lipid separately.',
      },
      {
        id: 'cpb1_lip_sphingo',
        title: 'Sphingolipids and Cholesterol',
        content: `## The Sphingosine Family

**Sphingolipids** trade glycerol for **sphingosine**, a long-chain amino alcohol whose own hydrocarbon tail serves as one of the two membrane anchors. A single fatty acid attaches through an **amide** bond to give **ceramide** — the structural analog of a diacylglycerol — and the head group added to ceramide's terminal hydroxyl sorts the family:

- **Sphingomyelin** — phosphocholine head; the one phosphosphingolipid, abundant in the **myelin** sheath.
- **Cerebrosides** — a single sugar; **globosides** — several neutral sugars.
- **Gangliosides** — branched oligosaccharide heads crowned with **sialic acid**; densest in neuronal membranes, and carriers of blood-group antigens.

The sugar-headed sphingolipids sit exclusively on the **outer leaflet**, contributing to chapter I.8's glycocalyx. Their turnover happens in lysosomes, where dedicated hydrolases strip the head groups stepwise — and each missing hydrolase is a named disease, the **sphingolipidoses**, in which the undegraded lipid accumulates: **Tay-Sachs** (hexosaminidase A deficiency; ganglioside GM2 accumulates, progressive fatal neurodegeneration in infancy), **Niemann-Pick** (sphingomyelinase deficiency; sphingomyelin accumulates), **Gaucher** (glucocerebrosidase deficiency; glucocerebroside accumulates — the most common of the family), **Fabry** (α-galactosidase A deficiency; globotriaosylceramide accumulates). The MCAT pattern: lysosomal enzyme missing → its substrate piles up → neurons suffer first.

## Cholesterol

**Cholesterol** is the structural outlier: four fused rings — the nearly planar, rigid **steroid nucleus** — with a hydrocarbon tail at one end and a single hydroxyl at C3 as its entire polar head. It is still amphipathic, just barely, and it wedges between phospholipid tails with its rigid face ordering them — the fluidity-buffering role quantified in chapter I.10. Beyond structure, cholesterol is a synthetic hub: the precursor of the **steroid hormones**, of the **bile acids** that emulsify dietary fat, and of **vitamin D**. For transport, its one hydroxyl is esterified to a fatty acid, producing wholly hydrophobic **cholesteryl esters** — the storage-and-cargo form packed into the core of lipoproteins, a preview of the metabolism chapters.`,
        quiz: [
          {
            question:
              'Complete hydrolysis of a membrane lipid yields sphingosine, one fatty acid, and phosphocholine — and no glycerol. The lipid is:',
            options: [
              'Phosphatidylcholine',
              'Sphingomyelin',
              'A ganglioside',
              'A plasmalogen',
            ],
            correctIndex: 1,
            explanation:
              'Sort by backbone: sphingosine plus an amide-linked fatty acid is ceramide, and a phosphocholine head on ceramide defines sphingomyelin. Phosphatidylcholine and plasmalogens are glycerol-based and would release glycerol on hydrolysis; a ganglioside is sphingosine-based but carries an oligosaccharide with sialic acid, not phosphocholine, and contains no phosphate at all.',
          },
        ],
      },
      {
        id: 'cpb1_lip_signals',
        title: 'Lipids as Signals: Eicosanoids, Steroids, and the Fat-Soluble Vitamins',
        content: `## Eicosanoids: Local and Fast

**Eicosanoids** are 20-carbon signals made from **arachidonate** (20:4), which phospholipase A2 releases from membrane phospholipids on demand. They act locally — paracrine, not endocrine — and briefly. Three named classes:

- **Prostaglandins** — carry a five-membered ring; drive inflammation, fever, smooth muscle tone, and gastric mucosal protection.
- **Thromboxanes** — a six-membered ring bearing oxygen; made by platelets, promoting aggregation and vasoconstriction.
- **Leukotrienes** — no ring, made by a separate lipoxygenase pathway; potent bronchoconstrictors central to asthma.

The pharmacology is the exam hook: **cyclooxygenase (COX)** catalyzes the committed step toward prostaglandins and thromboxanes, and **NSAIDs** — aspirin, ibuprofen — inhibit COX. That single inhibition explains anti-inflammatory, antipyretic, and antiplatelet effects at once. Aspirin's version is the mechanistic standout (standard pharmacology): it acetylates COX covalently and irreversibly, and because platelets lack the machinery to make fresh enzyme, one low dose silences their thromboxane output for the platelet's lifetime — the rationale for cardioprotective aspirin. Leukotrienes, made by lipoxygenase, are untouched by NSAIDs — which is why asthma drugs target the leukotriene pathway separately.

## Steroid Hormones: Systemic and Slow

The steroid hormones — cortisol, aldosterone, testosterone, estradiol — are cholesterol derivatives, and their lipid solubility is their mechanism: they cross membranes unassisted, bind **intracellular receptors**, and the hormone-receptor complex acts on transcription. Compared with a peptide hormone stopped at a surface receptor, the steroid route is slower to start and longer-lasting — gene expression, not an enzyme cascade, is the output. (Membrane lipids signal too: phosphorylated phosphatidylinositols like PIP₂ are cleaved into second messengers — chapter I.10's neighbor territory.)

## The Fat-Soluble Four

- **Vitamin A** — retinal is the light-absorbing group of rhodopsin: photon isomerizes 11-cis-retinal to all-trans, and vision begins there. Retinoic acid, the oxidized cousin, regulates gene expression in development and epithelial maintenance.
- **Vitamin D** — cholecalciferol, made from a cholesterol precursor in sunlight-exposed skin, then hydroxylated in liver and kidney to **calcitriol** (1,25-dihydroxyvitamin D), a transcription-regulating hormone governing calcium and phosphate absorption; deficiency gives rickets.
- **Vitamin E** — tocopherol, the lipid-phase antioxidant, intercepting radical chain reactions before they chew through membrane fatty acids.
- **Vitamin K** — required cofactor for the carboxylation that matures several clotting factors; without it coagulation fails, and the anticoagulant warfarin works precisely by antagonizing it.

Because A, D, E, and K dissolve in fat, they are stored in adipose tissue and liver: deficiencies develop slowly — and, unlike the water-soluble B vitamins of chapter I.5, overdose toxicity is possible because excess is stored rather than excreted.

Three smaller lipid job descriptions close the chapter, one line each (all standard): **dolichols**, long isoprenoid alcohols, anchor activated sugars in the ER membrane for the glycoprotein assembly chapter I.8 described; the lipid **quinones** — ubiquinone above all — ferry electrons within membranes, and Biochemistry II's respiratory chain runs on one; and the conjugated-diene **carotenoid** pigments absorb visible light, with β-carotene doubling as the dietary provitamin cleaved into vitamin A.`,
        examTip:
          'Signal mechanism follows solubility and geography: eicosanoids are local, short-lived, surface-acting; steroids and vitamins A/D cross membranes and act on transcription. And any NSAID question is a COX question — prostaglandins and thromboxanes fall, leukotrienes persist.',
      },
    ],
    keyTakeaways: [
      'Fatty acid shorthand is carbons:double bonds; Δ counts from the carboxyl, ω from the methyl end. Know palmitate 16:0, stearate 18:0, oleate 18:1(Δ9), linoleate 18:2 (ω-6), α-linolenate 18:3 (ω-3), arachidonate 20:4.',
      'Linoleate and α-linolenate are essential — human desaturases stop at Δ9 — and arachidonate (eicosanoid precursor) and EPA/DHA are built from them.',
      'Cis double bonds kink chains and slash melting points (stearate ~70 °C to linolenate ~−11 °C, standard values); trans fats stay straight and pack like saturated chains.',
      'Triacylglycerols beat glycogen as storage: more-reduced carbons (~9 vs ~4 kcal/g) and no water of hydration (~2 g per gram of glycogen, standard values).',
      'Sort membrane lipids by backbone: glycerophospholipids (phosphatidyl-X from phosphatidic acid; PS/PI/cardiolipin have jobs), ether lipids (plasmalogens, platelet-activating factor), sphingolipids (ceramide core → sphingomyelin, cerebrosides, gangliosides), cholesterol (rigid four-ring amphipath).',
      'Sphingolipidoses are missing lysosomal hydrolases: Tay-Sachs/hexosaminidase A/GM2, Niemann-Pick/sphingomyelinase, Gaucher/glucocerebrosidase, Fabry/α-galactosidase A.',
      'Eicosanoids from arachidonate act locally: prostaglandins and thromboxanes via COX (the NSAID target), leukotrienes via lipoxygenase (asthma).',
      'Steroid hormones cross membranes to intracellular receptors and transcription; fat-soluble A (vision/development), D (calcitriol, calcium), E (antioxidant), K (clotting carboxylation) are stored in fat — slow deficiency, possible toxicity.',
    ],
  },

  // ── Biochemistry I.10: Membranes and transport ──────────────────────────
  cpb1_membranes: {
    topicId: 'cpb1_membranes',
    title: 'Membranes and Transport',
    domainWeight: '25%',
    overview:
      'The membrane is where Biochemistry I\'s parts become a working boundary: chapter I.9\'s amphipathic lipids assemble into a fluid, asymmetric bilayer, proteins turn it into a mosaic of machines, and everything the cell eats, signals with, or excretes must get across. The testable core is a set of contrasts — integral vs peripheral, channel vs carrier, simple vs facilitated, primary vs secondary active — grounded in real thermodynamics (what a gradient costs) and one pump, the Na⁺/K⁺-ATPase, whose gradient nearly every other transporter spends.',
    sections: [
      {
        id: 'cpb1_mem_bilayer',
        title: 'The Fluid Mosaic Model and Its Evidence',
        content: `## Self-Assembly

Drop amphipathic lipids in water and bilayers form on their own — the hydrophobic effect again: burying tails releases ordered water, and entropy pays for the assembly. The product is about as thick as two lipid lengths, with a hydrophobic core a few nanometers across that is essentially impassable to ions and polar solutes — the selective permeability everything else in this chapter negotiates. Because no covalent bonds hold neighboring lipids together, the bilayer is self-sealing and endlessly remodelable: vesicles pinch off and fuse without ever exposing tails to water.

## Fluid, and Provably So

The **fluid mosaic model** pictures the membrane as a two-dimensional liquid of lipids in which proteins float as a mosaic of embedded and attached machines. Composition tracks function (standard observation): membranes doing heavy chemistry run protein-rich, while insulating myelin is nearly all lipid — every membrane is a differently loaded mosaic. The fluidity is measurable: in **FRAP** (fluorescence recovery after photobleaching), a laser bleaches the fluorescent labels in one patch of membrane, and unbleached molecules diffuse in from the surroundings within seconds — direct proof of rapid lateral diffusion. The same experiments expose the model's modern refinement: many proteins and lipids are not free-ranging but corralled — tethered to the cytoskeleton (erythrocyte membrane proteins anchored to the spectrin mesh are the standard example), clustered in domains, or packed into nearly crystalline patches, as neurotransmitter receptors are at a synapse. Fluid, yes — but a managed fluid.

Four levers set that fluidity. **Temperature** — warmer is more fluid. **Unsaturation** — every cis kink (chapter I.9) spreads the tails. **Tail length** — shorter tails have less van der Waals contact to break. **Cholesterol** — the buffer, not a one-way knob: at body temperature its rigid rings restrain phospholipid motion, while in a cooling membrane it wedges between tails and prevents tight crystalline packing. Net effect: the fluid-to-gel transition is broadened and blunted.`,
        examTip:
          'Cholesterol questions are directional traps: it does not simply raise or lower fluidity — it moderates it, stiffening a warm membrane and fluidizing a cold one. Answer with the buffer language, not a single arrow.',
      },
      {
        id: 'cpb1_mem_asym',
        title: 'Asymmetry, Rafts, and Fusion',
        content: `## The Two Leaflets Are Different On Purpose

Membranes are **asymmetric**: sphingolipids and phosphatidylcholine populate the outer leaflet, phosphatidylethanolamine and phosphatidylserine the inner, and every carbohydrate — glycolipid or glycoprotein — faces outside. The asymmetry is actively maintained, because spontaneous **flip-flop** of a lipid between leaflets means dragging a polar head through the hydrophobic core: fast lateral diffusion within a leaflet, almost no uncatalyzed crossing between leaflets. Three enzyme classes manage the traffic:

- **Flippases** move aminophospholipids (PS, PE) **inward** to the cytosolic leaflet, burning ATP (they are P-type ATPase relatives).
- **Floppases** move lipids **outward**, also ATP-driven (ABC-family proteins).
- **Scramblases** equilibrate lipids **both ways** down their gradients, ATP-independent, several activated by Ca²⁺.

The asymmetry is informational: when scramblase activity surfaces phosphatidylserine on a dying cell, that exposed PS is the "eat me" signal read by macrophages — apoptosis advertised in lipid.

## Rafts, Honestly

Sphingolipids' long saturated tails pack well with cholesterol, and together they form **lipid rafts** — small, ordered, slightly thicker microdomains drifting in the more disordered phospholipid sea. Rafts concentrate particular proteins (GPI-anchored proteins outside, acyl-anchored proteins inside), making them meeting points for signaling complexes; **caveolae**, small raft-derived pits shaped by the protein caveolin, take part in uptake and signaling. For the MCAT the honest summary is: rafts are real, ordered, cholesterol–sphingolipid neighborhoods that sort proteins — no more detail is testable.

## Fusion Needs Machinery

Bilayers do not fuse spontaneously on any useful timescale — charged, hydrated surfaces repel. **SNARE proteins** supply the force: a **v-SNARE** on a vesicle zippers into a coiled bundle with **t-SNAREs** on the target membrane, and the zippering reels the two bilayers into contact until they merge. Neurotransmitter release is this machine working on demand — chapter I.10's lipids and chapter I.3's coiled-coil logic in one device.`,
        importantNote:
          'Phosphatidylserine belongs on the inner leaflet; on the surface it is a signal. The flippase/floppase/scramblase division — in with ATP, out with ATP, both ways without — is a three-line table the MCAT can test directly.',
      },
      {
        id: 'cpb1_mem_proteins',
        title: 'Proteins In and On the Bilayer',
        content: `## Integral vs Peripheral

**Integral** proteins are embedded in — usually across — the bilayer. A membrane-spanning segment is typically an **α-helix of about twenty hydrophobic residues**: the helix satisfies the backbone's hydrogen bonds internally (chapter I.3's rule applied), leaving greasy side chains to face the lipid. Extracting an integral protein requires a **detergent** that dissolves the bilayer around it. The sequence-level signature is read from a **hydropathy plot**: slide a window along the sequence, average the side-chain hydrophobicity, and each transmembrane helix appears as a ~20-residue hydrophobic peak. Multipass transporters simply repeat the trick — GLUT1 crosses twelve times, its helices amphipathic so that polar faces line the sugar's path while nonpolar faces greet the lipid. The alternative architecture is the **β-barrel** — a closed sheet of strands, hydrophobic outside, porelike inside — found in bacterial and mitochondrial outer membranes.

**Peripheral** proteins sit on either surface, held by ionic and hydrogen bonds to lipid heads or to integral proteins — a salt wash or pH change releases them with the membrane intact. **Lipid-anchored** proteins are the third case: covalently tethered to a fatty acyl chain or a GPI anchor, dangling from one leaflet (GPI outside, acyl anchors usually inside — the raft clientele of the previous section). A fourth, conditional class — **amphitropic** proteins — commutes between cytosol and membrane, binding reversibly when a signal such as phosphorylation or an added lipid anchor flips them into their membrane-seeking state.

Between them these proteins do the membrane's active work — transporters and channels, receptors, adhesion anchors, and enzymes with defined sidedness. The sidedness is absolute: a protein's orientation is set when it is inserted and never flips, which is why the extracellular face of the ER lumen becomes the extracellular face of the cell.`,
        importantNote:
          'The extraction experiment is the identification test in passages: needs detergent → integral; salt suffices → peripheral. And a hydropathy plot with ~20-residue hydrophobic stretches is the sequence-level signature of transmembrane helices — count the peaks, count the crossings.',
      },
      {
        id: 'cpb1_mem_passive',
        title: 'Down the Gradient: Diffusion, Carriers, and Channels',
        content: `## What a Gradient Is Worth

Transport has real thermodynamics, and the MCAT increasingly asks for it. Moving a mole of uncharged solute from concentration C₁ to C₂ costs

ΔG = RT ln(C₂/C₁)

which at 25 °C works out to about **5.7 kJ/mol per tenfold gradient** — 11.4 kJ/mol for a hundredfold, since ratios multiply while their logarithms add. (The traffic this pricing governs is heavy: on the order of two thousand human genes encode membrane transporters, a standard figure.) For an **ion**, add the electrical work: ΔG = RT ln(C₂/C₁) + ZFΔψ, where Z is the charge, F ≈ 96.5 kJ/(V·mol), and Δψ is the membrane potential. With a typical Δψ of −50 to −70 mV (interior negative), the electrical term is worth roughly 5–7 kJ/mol per unit charge — comparable to a tenfold concentration gradient. A cation entering a negative cell gets that much for free; pushing one out costs it. Downhill overall means passive transport suffices; uphill means the deficit must be paid, and the payment defines active transport.

## Simple vs Facilitated

Small nonpolar molecules — O₂, CO₂, steroid hormones — dissolve directly through the bilayer: **simple diffusion**, flux proportional to the concentration difference, J = P·ΔC, with no saturation. Polar solutes and ions cannot follow: shedding a hydration shell to enter the greasy core is a prohibitive activation barrier. Transport proteins work like enzymes on that barrier — they replace the lost water contacts with protein contacts, lowering ΔG‡ without moving the equilibrium an inch.

**Carriers** bind their solute and flip conformation to release it on the far side. Finite carriers cycling at finite speed means the flux **saturates** — the same hyperbola as enzyme kinetics, J = Jmax·ΔC/(Km + ΔC). The textbook case is **GLUT1**, the erythrocyte glucose carrier: hyperbolic uptake with a half-saturating glucose concentration a few mM — deliberately near blood glucose (~5 mM), so the transporter runs near half capacity and responds in both directions — plus strict stereospecificity (D-glucose is transported; L-glucose is effectively ignored) and a rate tens of thousands of times faster than unassisted crossing. Equilibration, not accumulation: a passive carrier can never concentrate its solute. GLUT1 heads a family of tissue-tuned relatives, and the famous sibling is **GLUT4** of muscle and adipose tissue, held in intracellular vesicles until insulin sends it to the surface — glucose uptake regulated by transporter deployment rather than transporter chemistry (standard physiology).

![Flux versus concentration gradient for simple diffusion (J = P·ΔC) and a saturable carrier (J = Jmax·ΔC/(Km + ΔC)), computed with Jmax = 100 and Km = 20 in illustrative units. The carrier outruns simple diffusion at small gradients but plateaus at Jmax; the simple-diffusion line stays linear and never saturates.](/courses/mcat/biochem/bc1-membrane-transport.svg)

**Channels** open an aqueous pore instead — no conformational cycle per ion, so throughput approaches free diffusion (on the order of 10⁸ ions per second, standard value), usually gated by voltage or ligands. Selectivity without sacrifice of speed is the engineering marvel: the **K⁺ channel's selectivity filter** is lined with backbone carbonyl oxygens spaced to replace a K⁺ ion's hydration shell exactly. K⁺ trades water for carbonyls at no energetic cost and slips through; Na⁺ is too small to touch all the carbonyls at once, so its dehydration goes uncompensated — and the channel selects K⁺ over the smaller ion by orders of magnitude. **Aquaporins** apply the same logic to water: single-file water pores whose electrostatics exclude ions — even protons — while conducting on the order of a billion water molecules per second per channel (standard value). The erythrocyte **chloride-bicarbonate exchanger** rounds out the passive roster: an electroneutral one-for-one antiport that lets blood carry CO₂ as bicarbonate.

Two footnotes complete the passive roster. Channels are usually **gated** — voltage-gated (the action-potential family) or ligand-gated (neurotransmitter receptors) — so their flux is switched, not constant. And **ionophores**, small hydrophobic molecules mostly of microbial origin that wrap an ion and dissolve it across the bilayer, are the protein-free counterexample a passage occasionally floats: same downhill thermodynamics, no protein, no gate.

Water itself crosses toward higher total solute — **osmosis**: a cell in hypotonic solution swells, in hypertonic solution shrinks, and the vocabulary always compares outside to inside.`,
        quiz: [
          {
            question:
              'Uptake of molecule X into a cell speeds up as its external concentration rises, but levels off at high concentration. Uptake requires no ATP and moves X down its concentration gradient. The mechanism is:',
            options: [
              'Simple diffusion',
              'Facilitated diffusion through a carrier',
              'Primary active transport',
              'Secondary active transport',
            ],
            correctIndex: 1,
            explanation:
              'Saturation is the giveaway: a finite population of carriers, each cycling at a finite rate, produces a Jmax plateau exactly as enzymes reach Vmax. Simple diffusion stays linear in the gradient and never levels off, and both active-transport options are excluded because the process consumes no energy and runs downhill.',
          },
        ],
      },
      {
        id: 'cpb1_mem_active',
        title: 'Uphill: Primary and Secondary Active Transport',
        content: `## Primary: ATP Pays Directly

**Primary active transport** couples ATP hydrolysis to uphill movement. The **P-type ATPases** share one mechanism: ATP phosphorylates a conserved aspartate on the pump, and the phosphorylation-dephosphorylation cycle toggles the protein between two conformations — binding sites facing in with high affinity, then facing out with low affinity. The **SERCA pump** runs this cycle to vault Ca²⁺ into the sarcoplasmic reticulum (two Ca²⁺ per ATP), ending each muscle contraction; the stomach's H⁺/K⁺-ATPase — the target of proton-pump-inhibitor drugs — is the same P-type design acidifying gastric juice.

The defining example is the **Na⁺/K⁺-ATPase**: each cycle exports **3 Na⁺** and imports **2 K⁺** against both gradients for one ATP. The stoichiometry is **electrogenic** — one net positive charge leaves per cycle — and the pump's standing achievement is the low-Na⁺, high-K⁺ interior and the negative resting potential (−50 to −70 mV) that neurons, muscle, and every secondary transporter depend on. The bill is real: roughly a quarter of a resting human's ATP goes to this one pump (standard estimate). Cardiotonic steroids — ouabain, digoxin — inhibit it, which is both a laboratory tool and a heart drug.

Two more primary families complete the set. **V-type and F-type ATPases** pump protons — V-type acidifies lysosomes and vesicles; the F-type enzyme is the mitochondrial ATP synthase running its proton turbine in reverse, a headline reserved for Biochemistry II. **ABC transporters** use paired ATP-binding cassettes to export a huge range of substrates, including drugs — the multidrug-resistance pumps of tumor cells. The family's famous black sheep is **CFTR**: architecturally an ABC transporter, functionally an ATP-gated **Cl⁻ channel**. Its loss mutates chloride and water transport across airway epithelia into the thick mucus of **cystic fibrosis** — the chapter's named transport disease.

## Secondary: Spend the Gradient

**Secondary active transport** moves one solute uphill by letting another flow downhill through the same protein — usually Na⁺, cashing in the gradient the pump built. Same direction is **symport**: the intestinal **SGLT** transporter carries glucose in with **two Na⁺**, and the doubled ion gradient lets it accumulate glucose against a steep ratio — absorption even when the gut lumen is nearly empty of it. (The glucose then exits the cell's far side by passive GLUT carrier: uphill in, downhill out — the epithelial relay. Oral rehydration therapy works because water follows the Na⁺-plus-glucose the symporter moves.) Opposite directions is **antiport**: the Na⁺/Ca²⁺ exchanger keeps cytosolic calcium scarce.

No ATP touches the secondary transporter itself — the ATP was spent upstream at the pump. Poison the Na⁺/K⁺-ATPase and secondary transport dies as the Na⁺ gradient dissipates.`,
        examTip:
          'Trace the energy: a transporter moving a solute uphill with no ATPase activity of its own must be riding a coupled ion downhill — secondary active transport. Expect the question to confirm it by showing that ouabain (a Na⁺/K⁺ pump inhibitor) abolishes the flux.',
        quiz: [
          {
            question:
              'At 25 °C, what is the approximate free-energy cost of moving one mole of an uncharged solute into a cell against a 100-fold concentration gradient?',
            options: [
              'About 5.7 kJ',
              'About 11.4 kJ',
              'About 100 kJ',
              'Zero — uncharged solutes always equilibrate freely',
            ],
            correctIndex: 1,
            explanation:
              'ΔG = RT ln(C₂/C₁), and at 25 °C each tenfold factor costs RT ln 10 ≈ 5.7 kJ/mol. Gradients multiply while their logarithms add, so a 100-fold gradient costs 2 × 5.7 ≈ 11.4 kJ/mol. A charged solute would add the electrical term ZFΔψ on top; being uncharged removes that term but never the concentration term — "free" movement only happens downhill.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Bilayers self-assemble by the hydrophobic effect and stay fluid but managed — FRAP proves lateral diffusion, cytoskeletal fences and rafts organize it; cholesterol buffers fluidity in both directions.',
      'Leaflets are asymmetric on purpose: flippases (in, ATP), floppases (out, ATP), scramblases (both ways, no ATP) manage lipid traffic, and surfaced phosphatidylserine is an apoptosis signal.',
      'Integral proteins cross as ~20-residue hydrophobic α-helices (or β-barrels) read from hydropathy plots and need detergent to extract; peripheral proteins wash off with salt; SNARE zippering drives membrane fusion.',
      'A gradient has a price: ΔG = RT ln(C₂/C₁) ≈ 5.7 kJ/mol per tenfold at 25 °C, plus ZFΔψ for ions — the membrane potential is worth about as much as one tenfold gradient per charge.',
      'Carriers saturate (GLUT1: hyperbolic, half-saturated near blood glucose, stereospecific); channels approach diffusion-limited rates — the K⁺ selectivity filter\'s carbonyl cage replaces K⁺\'s hydration shell but not Na⁺\'s; aquaporins pass water and exclude even protons.',
      'Na⁺/K⁺-ATPase: 3 Na⁺ out, 2 K⁺ in per ATP — electrogenic, ouabain-inhibited, ~25% of resting ATP, and the source of the gradients everything else spends.',
      'P-type pumps phosphorylate an Asp to toggle conformations (SERCA, Na⁺/K⁺); V/F-types pump protons; ABC transporters export drugs — and CFTR, an ABC-family Cl⁻ channel, is the cystic fibrosis lesion.',
      'Secondary active transport spends the Na⁺ gradient: SGLT symports glucose with 2 Na⁺ into gut epithelia (oral rehydration logic), Na⁺/Ca²⁺ antiport clears calcium — kill the pump and it all stops.',
    ],
  },

  // ── Biochemistry I.11: Nucleotides and nucleic acid structure ───────────
  cpb1_nucleotides: {
    topicId: 'cpb1_nucleotides',
    title: 'Nucleotides and Nucleic Acid Structure',
    domainWeight: '25%',
    overview:
      'Nucleotides close Biochemistry I because they connect it to everything that follows: the same molecular family that stores the genome also carries the cell\'s energy (ATP), its redox credit (NAD⁺, FAD), and its second messages (cAMP). This chapter does the chemistry fully — base families, the naming ladder, tautomers and why they matter for mutation — then the double helix with its standard numbers, the alternative and unusual DNA structures, melting and hybridization as the basis of every nucleic acid technology, the slow chemical damage that shaped DNA\'s design, and the nucleotide jobs that have nothing to do with heredity.',
    sections: [
      {
        id: 'cpb1_nuc_parts',
        title: 'Bases, Nucleosides, Nucleotides',
        content: `## Two Ring Families

The bases split by ring count. **Purines** — adenine and guanine — are fused double rings; **pyrimidines** — cytosine, thymine, and uracil — are single rings. (Mnemonic: **PUR**ines **A**re **G**old; pyrimidines are the ones you **C**an **T**r**U**ncate to one ring.) DNA uses A, G, C, T; RNA swaps thymine for uracil — and thymine is simply uracil with a methyl group, a swap whose deep logic waits two sections ahead. The bases are flat, aromatic, and hydrophobic at cellular pH; they absorb ultraviolet light near **260 nm**, the wavelength every nucleic acid assay watches.

## The Naming Ladder

The vocabulary is strictly compositional, and the MCAT tests each rung:

| Base | Nucleoside (base + sugar) | Nucleotide (add phosphate) |
|------|---------------------------|----------------------------|
| Adenine | Adenosine | AMP / ADP / ATP |
| Guanine | Guanosine | GMP / GDP / GTP |
| Cytosine | Cytidine | CMP / CDP / CTP |
| Uracil (RNA) | Uridine | UMP / UDP / UTP |
| Thymine (DNA) | Thymidine | dTMP … |

The sugar is ribose in RNA, 2′-deoxyribose in DNA (deoxy- prefixes the whole DNA series). Sugar carbons take **primes** to distinguish them from base atoms, and the primes carry meaning everywhere downstream: phosphates attach at the **5′** carbon (labeled α, β, γ outward from the sugar in ATP), chains grow at the **3′** hydroxyl, and sequences are written 5′ → 3′.

## The Backbone

Nucleotides polymerize through **phosphodiester bonds** — each phosphate bridging one sugar's 3′ hydroxyl to the next sugar's 5′ position — giving every nucleic acid a uniform, negatively charged sugar-phosphate backbone with individuality carried entirely by the base sequence. Short chains are **oligonucleotides**, long ones polynucleotides — and because designed oligonucleotides are now synthesized chemically as a routine service, the primers and probes of the coming sections are ordered from catalogs, a fact molecular biology quietly depends on. The backbone's charge is why DNA migrates in electrophoresis and why cations and positively charged proteins (histones, eventually) blanket it in vivo. The sole chemical difference between RNA and DNA — the **2′-hydroxyl** — makes RNA the reactive, short-lived molecule and deoxygenated DNA the durable archive: that hydroxyl is an internal nucleophile poised for self-cleavage, which alkaline conditions exploit to hydrolyze RNA while DNA shrugs.`,
        examTip:
          'Nucleoside vs nucleotide is a free point the MCAT keeps offering: -oside has no phosphate, -otide has at least one. Adenosine is a nucleoside; AMP is a nucleotide. And primes always mean sugar carbons — an unprimed number is on the base.',
      },
      {
        id: 'cpb1_nuc_helix',
        title: 'The Double Helix',
        content: `## Complementary and Antiparallel

B-form DNA is two strands wound right-handedly around a common axis: negatively charged sugar-phosphate backbones outside facing water, flat base pairs stacked inside, and the strands **antiparallel** — one runs 5′ → 3′ while its partner runs 3′ → 5′. Pairing is fixed: **A with T through two hydrogen bonds, G with C through three**, always one purine with one pyrimidine so every rung is the same width.

![Watson-Crick base pairs: adenine-thymine joined by two hydrogen bonds and guanine-cytosine by three, mounted on antiparallel sugar-phosphate backbones. Schematic — bond lengths and angles are drawn by convention, not computed geometry.](/courses/mcat/biochem/bc1-base-pairing.svg)

The standard geometry (tabulated values): stacked pairs sit **3.4 Å** apart along the axis, with about **10.5 base pairs per helical turn** in solution — roughly 36 Å per turn — and a helix diameter near **20 Å**. Because the two glycosidic bonds enter each base pair from the same side rather than opposite poles, the helix surface carries two unequal furrows — the **major groove** and **minor groove**. The asymmetry matters biologically: the major groove displays an edge of each base pair distinctive enough for proteins to read the sequence without opening the helix.

The pairing rules are **Chargaff's rules** read mechanistically: in any double-stranded DNA, %A = %T and %G = %C.

## What Holds It Together — and What Could Go Wrong

Here is the distinction passages test: hydrogen bonds provide the **specificity** of pairing, but most of the duplex's **stability** comes from **base stacking** — van der Waals and hydrophobic contributions between adjacent flat rings sandwiched out of water — with cations shielding the backbone's self-repulsion. "Hydrogen bonds alone hold DNA together" is a standing wrong answer; GC-rich DNA is more stable chiefly because GC steps stack better, not merely because of the third bond.

One more chemical subtlety earns its keep: each base exists as an equilibrium of **tautomers**, and Watson-Crick pairing depends on the predominant one (the keto/amino forms). The rare enol or imino tautomers present shifted hydrogen-bonding faces and pair wrongly — a transiently mispaired tautomer at replication is one classic route to a point mutation. The pairing rules are chemistry, and chemistry has minority species.`,
        importantNote:
          'Chargaff arithmetic is free points: 20% G forces 20% C, leaving 60% to split equally — 30% A and 30% T. The rules fail for single-stranded genomes (some viruses), where no pairing constrains composition.',
      },
      {
        id: 'cpb1_nuc_forms',
        title: 'A, B, Z — and the Unusual Structures',
        content: `## Three Named Forms

The Watson-Crick helix is **B-DNA**, the default under physiological conditions. Two well-characterized variants frame it (standard comparative values):

- **A-DNA** — still right-handed but squatter: ~11 bp per turn, base pairs tilted off perpendicular. It is the form favored under dehydrating conditions — and, importantly, the geometry adopted by **RNA duplexes and RNA-DNA hybrids**, which the 2′-hydroxyl bars from the B form.
- **Z-DNA** — the radical: **left-handed**, ~12 bp per turn, a slender zigzag backbone. Alternating purine-pyrimidine tracts (especially CG repeats) form it most readily, with the purines flipped to the **syn** glycosidic conformation (pyrimidines essentially always stay **anti**; purines can do either — this is where that conformational vocabulary cashes out). Short Z tracts exist in cells; their regulatory meaning is still being worked out, and the MCAT asks only for recognition: left-handed, zigzag, alternating CG.

## Sequence-Driven Oddities

Certain sequences fold DNA into structures beyond any double helix, each worth one line:

- **Palindromes** (inverted repeats) are self-complementary within a strand, so a single strand can fold back into a **hairpin**, and a duplex can extrude a two-armed **cruciform**. The same inverted-repeat logic creates restriction enzyme sites and protein-binding symmetry.
- **Hoogsteen pairing** — an alternative hydrogen-bonding face — lets a third strand lie in the major groove of a duplex: **triplex DNA**, favored in long purine-pyrimidine tracts.
- **G-quadruplexes** — four guanine-rich strands (or one strand folded four ways) stack planar G-quartets; guanine-rich telomeric ends are the standard biological venue.
- Runs of adenines bend the axis — a few degrees per A-tract, enough to matter for protein recognition.

The three working RNAs get their introductions here. **Messenger RNA** carries a gene's sequence to the ribosome; **transfer RNA** and **ribosomal RNA** build and run the machine that reads it. And because a single RNA strand pairs with itself, RNA folds like a protein: hairpins, internal loops, and long-range tertiary contacts give tRNA and rRNA genuinely three-dimensional, catalytic-grade architecture — chapter II territory, seeded here.`,
        examTip:
          'File the forms as three adjectives each: A — right-handed, compact, dehydrated/RNA duplexes; B — right-handed, physiological default, 10.5 bp/turn; Z — left-handed, zigzag, alternating CG with purines syn. Anything more detailed than that is beyond the exam.',
      },
      {
        id: 'cpb1_nuc_melting',
        title: 'Denaturation and Hybridization',
        content: `## Melting Is Reversible

Heat or alkaline pH separates the two strands without touching a covalent bond — **denaturation**, quantified by the **melting temperature Tm** at which half the molecules have come apart. **GC-rich DNA melts higher** — the stacking argument from two sections back made quantitative: Tm rises steadily with %GC under fixed solvent conditions, steeply enough that base composition can be estimated from a melting curve. Within one molecule, AT-rich stretches melt first, forming single-stranded "bubbles" — and the cell exploits exactly this, placing AT-rich sequences where replication and transcription must open the duplex.

The process is watched by UV: stacked, paired bases absorb less 260 nm light than free ones, so denaturation produces a rise in absorbance — the **hyperchromic effect** — and the melting curve is literally absorbance versus temperature. (RNA duplexes, locked in the A form, actually melt higher than comparable DNA — a standard comparison worth one line.)

## Annealing Is a Technology

Cool slowly and complementary strands re-form the duplex: **annealing**, a two-step process — a slow nucleation as strands collide and find a short complementary register, then fast zippering. That base pairing is plain chemistry, working as well in a tube as in a nucleus, is the founding fact of molecular biology technique: **hybridization** of a primer or probe to its complement is the recognition step of PCR, Southern and northern blotting, microarrays, and in situ hybridization alike. Primer binding in PCR is nothing but controlled annealing at a chosen temperature — and the choice is Tm arithmetic: anneal a few degrees below the primer's Tm, and GC-rich primers tolerate hotter, more stringent conditions than AT-rich ones.`,
        quiz: [
          {
            question:
              'A double-stranded DNA sample is 30% adenine. What percentage is guanine?',
            options: ['20%', '30%', '40%', '70%'],
            correctIndex: 0,
            explanation:
              'Base pairing forces A = T and G = C in any duplex. With A = 30%, T is also 30%, which leaves 40% to divide equally between G and C — 20% each. The same arithmetic fails for single-stranded nucleic acids, where no pairing constrains the composition.',
          },
        ],
      },
      {
        id: 'cpb1_nuc_damage',
        title: 'The Chemistry That Mutates DNA',
        content: `## Slow Reactions, Serious Stakes

DNA is chemically stable — that is its qualification for the job — but not inert, and because the genome tolerates almost no alteration, even slow reactions matter. The standard damage budget (tabulated rates for a mammalian cell, per day):

- **Cytosine deamination** — the exocyclic amine hydrolyzes off, converting **C to U**: roughly one event per 10⁷ cytidines per day, about a hundred per genome. Adenine and guanine deaminate about a hundredfold slower.
- **Depurination** — hydrolysis of the N-glycosyl bond drops a purine off the backbone, leaving an **abasic (AP) site**: on the order of one purine in 10⁵ per day — thousands of events per genome.
- **UV light** — fuses adjacent pyrimidines (thymines especially) into **cyclobutane pyrimidine dimers**, kinking the helix; the lesion behind sunlight mutagenesis.
- **Ionizing radiation and oxidants** — fragment bases and break backbones.

Repair systems (Biochemistry II's problem) fix nearly all of it; what escapes becomes **mutation**.

## Why DNA Uses Thymine

Now the payoff of thymine-vs-uracil: deamination converts cytosine into **uracil**. If uracil were a legitimate DNA base, every such event would be invisible — a U that belongs, indistinguishable from a U that is damage, quietly turning C·G pairs into T·A over generations. Because DNA uses **thymine** (methylated uracil), any uracil found in DNA is by definition damage, and a dedicated repair enzyme excises it with total confidence. The methyl group is a flag reading "authentic." The exception that proves the rule: enzymatically produced **5-methylcytosine** — a normal regulatory modification in eukaryotic DNA — deaminates to plain **thymine**, a legitimate base that repair cannot confidently reverse, making methylated cytosines the genome's classic mutation hotspots. (Enzymatic methylation has a second life in bacteria, which methylate adenines as well: restriction-modification systems tell self from invading DNA by its methylation state — the natural context of the restriction enzymes molecular biology borrowed.)`,
        quiz: [
          {
            question:
              'DNA uses thymine where RNA uses uracil. The accepted explanation is that:',
            options: [
              'Thymine forms three hydrogen bonds with adenine, stabilizing the duplex',
              'Cytosine spontaneously deaminates to uracil, so a uracil-free DNA can treat any uracil it finds as damage and repair it',
              'Uracil cannot base-pair with adenine inside a double helix',
              'Thymine is metabolically cheaper to synthesize than uracil',
            ],
            correctIndex: 1,
            explanation:
              'Cytosine deaminates to uracil roughly a hundred times per day in a mammalian genome (standard rate). Because legitimate DNA contains no uracil, repair enzymes can excise every uracil they find with complete confidence; if uracil were a normal DNA base, deamination damage would be indistinguishable from correct sequence and C·G pairs would erode into T·A. The A·T pair keeps two hydrogen bonds regardless — thymine\'s methyl adds no bond — and uracil pairs with adenine perfectly well, as it does throughout RNA.',
          },
        ],
      },
      {
        id: 'cpb1_nuc_beyond',
        title: 'Nucleotides Beyond Heredity',
        content: `## The Busiest Molecular Family in the Cell

The MCAT's favorite twist on this chapter is that most nucleotide questions are not genetics questions:

- **ATP** — the energy currency. The chemistry is in the bonds: the ribose-to-phosphate link is a plain **ester** (hydrolysis worth roughly 14 kJ/mol, standard value), but the α–β and β–γ links are **phosphoanhydrides**, each worth roughly 30 kJ/mol — charge repulsion relieved, products resonance-stabilized and better hydrated. Those anhydride bonds are the ones "spent" when hydrolysis is coupled to unfavorable reactions. Recall chapter I.5's boundary: coupling moves equilibria; catalysis never does. GTP, UTP, and CTP carry the same bonds into their own economies — translation and G-protein signaling for GTP, and **UDP-glucose** as the activated glucose donor of glycogen synthesis, tying back to chapter I.8.
- **cAMP and cGMP** — adenylyl cyclase cyclizes ATP into cAMP when epinephrine or glucagon hits a surface receptor; cAMP then activates protein kinase A, heading the phosphorylation cascade of chapter I.7. The prototype **second messenger**, with cGMP running parallel signaling of its own (vision, vascular tone). Bacteria even run a nucleotide alarm — ppGpp throttles RNA synthesis during starvation — one line worth knowing as "nucleotides regulate."
- **NAD⁺, FAD, coenzyme A** — chapter I.5's vitamin-derived coenzymes are themselves adenine nucleotides: nicotinamide (from **niacin**) carrying hydride on NAD⁺, flavin (from **riboflavin, B2**) carrying electrons on FAD, pantothenate's thiol carrying acyl groups on CoA — each business end bolted to an adenosine handle. The handle is the point: it contributes no chemistry but supplies binding energy, letting one conserved **nucleotide-binding fold** grip ATP, NAD⁺, and FAD across hundreds of enzymes. Evolution standardized the plug.
- **ATP as a signal** — beyond energy, ATP and ADP act as extracellular messengers at dedicated receptors, including in neurotransmission: the same molecule as currency inside and courier outside.

That is the arc of Biochemistry I closed: water set the stage, proteins and enzymes did the chemistry, sugars and lipids built fuel and boundary, and one nucleotide family turns out to run the money, the messages, and the memory. Biochemistry II spends all of it.`,
        examTip:
          'When a passage molecule contains adenine but the question is not about genetics, think "handle": the adenine nucleotide is the recognizable grip enzymes hold in ATP, NAD⁺, FAD, and coenzyme A alike — binding energy, not base-pairing, is its job there.',
      },
    ],
    keyTakeaways: [
      'Purines (A, G) are fused double rings; pyrimidines (C, T, U) single rings; all absorb at 260 nm. Base → nucleoside → nucleotide is the naming ladder (adenine → adenosine → AMP), with primes marking sugar carbons and phosphates at 5′.',
      'The phosphodiester backbone runs 5′ → 3′, uniformly negative; the 2′-hydroxyl is the entire RNA/DNA difference — an internal nucleophile that makes RNA cleavable and DNA archival.',
      'B-DNA standard numbers: antiparallel right-handed helix, 3.4 Å rise, ~10.5 bp/turn, ~20 Å across, with unequal major/minor grooves that let proteins read sequence; A·T pairs by two hydrogen bonds, G·C by three.',
      'Stacking plus cation shielding, not hydrogen bonds alone, stabilizes the duplex; rare tautomers mispair and seed point mutations; Chargaff (%A = %T, %G = %C) is arithmetic on any duplex and void for single strands.',
      'Forms in three adjectives: A — right-handed, compact, RNA duplexes; B — physiological default; Z — left-handed zigzag, alternating CG, purines syn. Palindromes give hairpins/cruciforms; Hoogsteen gives triplexes; G-rich DNA gives quadruplexes.',
      'GC content raises Tm (stacking); melting shows the hyperchromic rise at 260 nm; annealing/hybridization is the recognition chemistry behind PCR, blots, and probes — primer design is Tm arithmetic.',
      'The damage budget explains the design: cytosine deaminates to uracil (~10²/genome/day) and purines fall off (~10⁴/day, standard rates) — DNA uses thymine precisely so uracil is always recognizable damage; 5-methylcytosine sites, deaminating to real thymine, are mutation hotspots.',
      'ATP\'s phosphoanhydrides (~30 kJ/mol each vs ~14 for the ester, standard values) fund coupling; cAMP/cGMP are second messengers; NAD⁺ (niacin), FAD (riboflavin), and CoA are adenine-handled coenzymes; GTP and UDP-glucose run their own economies.',
    ],
  },
};

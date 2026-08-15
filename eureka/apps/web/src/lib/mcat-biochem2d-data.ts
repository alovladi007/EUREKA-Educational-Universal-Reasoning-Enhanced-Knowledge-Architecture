/**
 * MCAT Biochemistry II chapters — transcription and RNA maturation, translation
 * and the protein's afterlife, and gene regulation (chapters II.12–II.14).
 * Chapter plan in docs/mcat/BIOCHEM_CHAPTERS.md.
 * AI-generated. Requires SME review.
 * Depth pass benchmarked against a standard biochemistry textbook (checklist-mediated;
 * all prose original). Tabulated constants are standard reference values.
 */

import type { TopicLesson } from './mcat-course-data';

export const MCAT_BIOCHEM2D_LESSONS: Record<string, TopicLesson> = {
  // ── Biochemistry II.12: Transcription and RNA maturation ────────────────
  bb2_transcription: {
    topicId: 'bb2_transcription',
    title: 'Transcription and RNA Maturation',
    domainWeight: '25%',
    overview:
      'DNA stores the archive; RNA is the working copy. This chapter follows a gene from the moment RNA polymerase finds a promoter to the moment a finished mRNA leaves the nucleus — and then follows the information the wrong way, from RNA back to DNA, because retroviruses and telomerase both run that route and the MCAT loves both. The recurring test targets: what RNA polymerase can do that DNA polymerase cannot (start without a primer) and what it gives up in exchange (proofreading), which of the three eukaryotic polymerases α-amanitin kills, the chemistry of capping, splicing, and polyadenylation, and why one human gene can encode many proteins.',
    sections: [
      {
        id: 'bb2_tr_polymerase',
        title: 'Copying Without a Primer',
        content: `## The Enzyme and Its Rules

One enzyme runs transcription — **DNA-dependent RNA polymerase** — and its chemistry deliberately echoes replication: the enzyme reads a DNA template strand 3′→5′, builds the new strand **5′→3′**, uses nucleoside triphosphates (here ATP, GTP, CTP, UTP), releases PPᵢ with each addition, and requires Mg²⁺. Two differences carry almost all of the exam weight. First, **RNA polymerase needs no primer** — it can start a chain from scratch on a bare template, which is exactly why replication borrows an RNA-making enzyme (primase) to begin its own DNA strands. Second, RNA polymerase has **no dedicated proofreading exonuclease**, so transcription is sloppier than replication: roughly one error per 10⁴–10⁵ nucleotides, versus one per 10⁹–10¹⁰ for finished DNA. The cell tolerates this because a flawed transcript is disposable — it produces a few bad protein copies and is degraded — whereas a flawed chromosome is forever.

Only one DNA strand of a given gene is copied. The strand the enzyme reads is the **template (noncoding) strand**; the other, the **coding (sense) strand**, matches the RNA product in sequence with T→U substituted. By convention, gene sequences and numbering follow the coding strand, with position +1 at the transcription start site and negative numbers upstream.

## The Moving Bubble

To read bases the enzyme must unpair them: it melts open a **transcription bubble** of about 17 bp that travels with the enzyme at roughly 50–90 nucleotides per second in bacteria. Inside the bubble, only ~8 bp of RNA–DNA hybrid exists at any instant; behind the enzyme, the DNA duplex re-forms and the RNA peels away — the template is read, never kept. A moving bubble twists the surrounding DNA: **positive supercoils pile up ahead** of the polymerase and **negative supercoils accumulate behind** it, and topoisomerases must relax both or transcription stalls. In *E. coli* the catalytic **core enzyme** has subunit composition **α₂ββ′ω**; adding a **σ (sigma) subunit** converts it to the **holoenzyme**, the form that can locate promoters — the subject of the next section.`,
        examTip:
          'Two flagship contrasts with DNA polymerase: no primer needed, and no proofreading. If a question shows an enzyme initiating a nucleic acid strand de novo on a template, it is an RNA polymerase — even when the product is destined to prime DNA synthesis.',
        quiz: [
          {
            question:
              'Which requirement applies to DNA polymerase III but NOT to bacterial RNA polymerase?',
            options: [
              'A DNA template strand read 3′→5′',
              'A pre-existing primer with a free 3′-OH',
              'Mg²⁺ in the active site',
              'Nucleoside triphosphate substrates',
            ],
            correctIndex: 1,
            explanation:
              'Both enzymes read a template 3′→5′, synthesize 5′→3′, use NTP (or dNTP) substrates, and require Mg²⁺. The dividing line is initiation: DNA polymerases can only extend an existing 3′-OH, so replication must begin with an RNA primer, while RNA polymerase initiates chains de novo. The trade-off is fidelity — RNA polymerase lacks a proofreading exonuclease and makes about one error per 10⁴–10⁵ nucleotides.',
          },
        ],
      },
      {
        id: 'bb2_tr_promoters',
        title: 'Promoters, Sigma, and Letting Go',
        content: `## Finding the Start

A promoter is a DNA address, not a gene product: it is the sequence where RNA polymerase binds and decides to begin. In bacteria, promoter recognition is the job of the σ subunit, and the classic σ⁷⁰ promoters carry two consensus landmarks upstream of the start site: the **−10 region (TATAAT)** and the **−35 region (TTGACA)**. A-T-rich sequences melt easily — a −10 element made of A:T pairs (two hydrogen bonds each) costs far less to open than a G:C-rich one. Real promoters only approximate the consensus, and the approximation is a volume dial: **the closer a promoter sits to consensus, the stronger it is**, and strengths span orders of magnitude. Some very active genes add a third element, the A-T-rich **UP element** near −50, contacted by the α subunits. Bacteria also keep a stable of **alternative σ factors**; swapping σ⁷⁰ for σ³² during heat shock, for example, redirects the same core polymerase to an entirely different set of promoters — regulation by changing the enzyme's reading glasses.

Initiation itself has stages: the holoenzyme binds the promoter (**closed complex**), melts the DNA around −10 (**open complex**), and often stutters through short abortive transcripts before it clears the promoter, releases σ, and commits to elongation.

## Two Ways to Stop

Bacterial termination comes in two flavors, and the MCAT expects you to recognize each from its parts. **ρ-independent (intrinsic) terminators** are built into the RNA: a **G-C-rich self-complementary stretch folds into a hairpin**, immediately followed by a **run of U residues**. The hairpin stalls the polymerase, and the rU:dA hybrid holding the transcript to the template is the weakest base-pairing combination known — the RNA simply lets go. **ρ-dependent terminators** lack the U-run and outsource the work to the **ρ (rho) protein**, an ATP-driven helicase-translocase that loads onto a *rut* (rho utilization) site on the nascent RNA, chases the polymerase along the transcript, and unwinds the RNA–DNA hybrid when the enzyme pauses. Hairpin-plus-U-run in the RNA product: intrinsic. A protein burning ATP: rho.`,
        quiz: [
          {
            question:
              'A bacterial transcript ends with a G-C-rich hairpin followed immediately by eight uridine residues. Termination at this site is best described as:',
            options: [
              'ρ-dependent, requiring ATP hydrolysis by a translocase',
              'ρ-independent, driven by the hairpin and the weak rU:dA hybrid',
              'Attenuation, requiring a stalled ribosome in the leader region',
              'Catalyzed by topoisomerase relaxing positive supercoils',
            ],
            correctIndex: 1,
            explanation:
              'A hairpin followed by a U-run is the signature of an intrinsic (ρ-independent) terminator: the hairpin pauses the polymerase and the rU:dA hybrid — the least stable of all base-pairing combinations — releases the transcript without any accessory protein. ρ-dependent termination instead uses the ATP-driven ρ translocase loading at a rut site, and shows no U-run.',
          },
        ],
      },
      {
        id: 'bb2_tr_eukpols',
        title: 'Three Polymerases and a Poisonous Mushroom',
        content: `## Division of Labor

Eukaryotes split transcription among three nuclear RNA polymerases, and the death cap mushroom (*Amanita phalloides*) provided the tool that sorted them out. Its toxin **α-amanitin** blocks RNA polymerase II at low concentrations, blocks Pol III only at much higher concentrations, and does not touch Pol I — or bacterial and mitochondrial RNA polymerases, which resemble each other. In a poisoning victim, the liver's mRNA synthesis fails first, and hepatic failure is the usual cause of death.

| Polymerase | Main products | α-Amanitin sensitivity | Promoter notes |
|------------|--------------|------------------------|----------------|
| Pol I | Pre-rRNA (processed to 18S, 5.8S, 28S rRNA) | Insensitive | Dedicated rRNA promoters in the nucleolus |
| Pol II | All mRNA precursors; most snRNAs and miRNAs | Inhibited at low concentration | TATA box ≈ −30, Inr element; needs general transcription factors |
| Pol III | tRNAs, 5S rRNA, other small RNAs | Inhibited only at high concentration | Unusual: key promoter elements lie inside the transcribed gene |

## Pol II Needs an Entourage

Unlike the bacterial holoenzyme, purified Pol II cannot find a promoter by itself. A typical Pol II promoter carries a **TATA box near −30**, bound by **TBP (TATA-binding protein)**, a subunit of **TFIID**. Around that nucleus the **general transcription factors** — TFIIA, TFIIB, TFIID, TFIIE, TFIIF, TFIIH — and Pol II assemble into a preinitiation complex. **TFIIH** earns special attention because it brings two enzyme activities: a **DNA helicase** that opens the promoter using ATP, and a **kinase that phosphorylates the CTD** — the carboxyl-terminal domain of Pol II's largest subunit, a tail of tandem **YSPTSPS heptad repeats** (52 in humans). CTD phosphorylation is the switch from initiation to elongation, and the phosphorylated tail then serves as a docking platform that carries the mRNA-processing machinery along with the polymerase — the structural reason capping, splicing, and polyadenylation happen co-transcriptionally, as the next section describes.`,
        examTip:
          'The amanitin ranking is a discrete-question staple: Pol II ≫ Pol III, with Pol I (and bacterial/mitochondrial polymerases) untouched. Pair each polymerase with its product list — "5S rRNA" belongs to Pol III even though every other rRNA belongs to Pol I.',
        quiz: [
          {
            question:
              'A patient who ate foraged mushrooms develops liver failure from α-amanitin toxicity. Synthesis of which RNA class is most directly and severely impaired?',
            options: [
              'Pre-rRNA made by RNA polymerase I',
              'mRNA precursors made by RNA polymerase II',
              'tRNA made by RNA polymerase III',
              'Mitochondrial transcripts made by the mitochondrial RNA polymerase',
            ],
            correctIndex: 1,
            explanation:
              'α-Amanitin inhibits RNA polymerase II at low concentrations, shutting down mRNA synthesis; Pol III is affected only at much higher doses, and Pol I, bacterial, and mitochondrial polymerases are resistant. Loss of new mRNA cripples protein renewal in hepatocytes, which is why death-cap poisoning presents as liver failure.',
          },
          {
            question:
              'Which activity belongs to TFIIH during Pol II transcription initiation?',
            options: [
              'Adding the 7-methylguanosine cap to the nascent transcript',
              'Recognizing the TATA box through its TBP subunit',
              'Phosphorylating the YSPTSPS repeats of the Pol II CTD',
              'Terminating transcription by translocating along the RNA',
            ],
            correctIndex: 2,
            explanation:
              'TFIIH supplies an ATP-dependent helicase that opens the promoter and a kinase that phosphorylates the CTD heptad repeats, licensing the transition from initiation to elongation. TBP — the TATA-recognition protein — is a subunit of TFIID, capping is done by separate enzymes docked on the phosphorylated CTD, and RNA-translocating termination describes bacterial ρ.',
          },
        ],
      },
      {
        id: 'bb2_tr_processing',
        title: 'Making a Message: Cap, Splice, Tail',
        content: `## The 5′ Cap

A eukaryotic pre-mRNA is edited at both ends and in the middle before it may leave the nucleus. Processing begins almost immediately: when the transcript is only 20–30 nucleotides long, capping enzymes riding the phosphorylated CTD install the **5′ cap** — a **7-methylguanosine** joined backwards to the first nucleotide by a **5′,5′-triphosphate bridge**. That inverted linkage means the message has no exposed 5′ end at all, which protects it from 5′-exonucleases; the cap is also the handle grabbed by nuclear export machinery and, later, by the translation initiation factor eIF4E.

## Splicing: Two Transesterifications and a Lariat

Introns are removed by the **spliceosome**, a machine built from five **snRNPs (U1, U2, U4, U5, U6)** and many proteins. The intron's boundaries are nearly invariant — it **begins with GU and ends with AG** — with a **branch-point adenosine** upstream of the 3′ site. Chemistry proceeds in two transesterifications: the branch A's **2′-OH attacks the 5′ splice site**, forming a looped **lariat** with an unusual 2′,5′-phosphodiester bond; then the freed exon's 3′-OH attacks the 3′ splice site, joining the exons and releasing the lariat intron for degradation. Because each step swaps one phosphodiester bond for another, no ATP is spent on the chemistry itself (assembly of the machine costs plenty). Roles worth memorizing: **U1 base-pairs with the 5′ splice site**, **U2 marks the branch point**, and U6 (with U2) forms the catalytic center — the spliceosome is at heart an RNA machine.

Splicing predates the spliceosome. **Group I introns** (in *Tetrahymena* rRNA, among others) excise themselves using an external **guanosine cofactor** whose 3′-OH makes the first attack; **group II introns** self-splice through a branch-A lariat, exactly the spliceosomal chemistry without the machine — strong evidence that snRNAs are domesticated descendants of group II introns. These **self-splicing introns were among the first ribozymes discovered**, proof that RNA can be a catalyst.

## The 3′ Tail

The 3′ end of an mRNA is made, not found: a protein complex recognizes the signal **AAUAAA**, cleaves the transcript 10–30 nucleotides downstream, and **poly(A) polymerase adds 80–250 adenylates without any template**. The tail, bound by poly(A)-binding proteins, buys the message stability, licenses export, and stimulates translation.

![Schematic map of pre-mRNA maturation: a Pol II transcript acquires a 7-methylguanosine cap in a 5′,5′-triphosphate linkage while 20–30 nucleotides long; the spliceosome (U1 at the GU 5′ splice site, U2 at the branch-point A) removes each intron through two transesterifications that release a lariat; the 3′ end is cleaved 10–30 nucleotides after the AAUAAA signal and poly(A) polymerase adds 80–250 A residues; the finished mRNA is exported. Schematic — not to scale.](/courses/mcat/biochem/bc2-transcript-processing.svg)

Splice-site mutations are a clinical genre of their own: several **β-thalassemias** arise from β-globin mutations that create or destroy splice sites, and **spinal muscular atrophy** is now treated with an antisense oligonucleotide (nusinersen) that redirects splicing of the SMN2 pre-mRNA so a needed exon is retained — splicing chemistry turned into pharmacology.`,
        importantNote:
          'Keep the three marks straight by position and chemistry: cap = 7-methylguanosine in a 5′,5′ linkage, added early and co-transcriptionally; splicing = GU…branch A…AG, two transesterifications, lariat out; tail = cleavage after AAUAAA, then 80–250 template-free adenylates. All three ride on the phosphorylated Pol II CTD.',
        quiz: [
          {
            question:
              'During spliceosomal intron removal, the FIRST nucleophilic attack is made by:',
            options: [
              'The 3′-OH of an external guanosine cofactor',
              'The 2′-OH of the branch-point adenosine on the 5′ splice site',
              'The 5′ phosphate of the downstream exon on the branch point',
              'The 3′-OH of the upstream exon on the 3′ splice site',
            ],
            correctIndex: 1,
            explanation:
              'Spliceosomal (and group II) splicing begins when the branch adenosine’s 2′-OH attacks the phosphodiester at the 5′ splice site, creating the lariat’s 2′,5′ linkage. The upstream exon’s 3′-OH then attacks the 3′ splice site to join the exons — that is the second step, not the first. An external guanosine making the first attack is the signature of group I self-splicing introns.',
          },
          {
            question:
              'Which feature of the mature mRNA is synthesized without reference to any DNA template?',
            options: [
              'The poly(A) tail added after AAUAAA-directed cleavage',
              'The coding sequence of the message',
              'The 5′ untranslated region',
              'The exon–exon junctions produced by splicing',
            ],
            correctIndex: 0,
            explanation:
              'Poly(A) polymerase adds 80–250 adenylate residues to the cleaved 3′ end with no template strand — the tail is pure enzyme output. Coding sequence and UTRs are transcribed from DNA, and exon junctions simply rejoin transcribed segments. (The cap’s 7-methylguanosine is likewise untemplated, but it is a single modified nucleotide, not a synthesized stretch.)',
          },
        ],
      },
      {
        id: 'bb2_tr_altsplicing',
        title: 'One Gene, Many Proteins — and Message Lifetimes',
        content: `## Alternative Splicing as a Proteome Multiplier

The human genome holds only ~20,000 protein-coding genes, yet makes far more distinct proteins. The main multiplier is **alternative splicing**: more than 95% of human multi-exon genes splice their transcripts in more than one pattern, including or skipping exons, choosing among 3′-end cleavage sites, or both. The classic worked example pairs splicing with alternative polyadenylation: one gene, processed one way in the thyroid, yields **calcitonin** (a calcium-regulating hormone); processed another way in neurons, the same transcript yields **CGRP**, a neuropeptide. Tissue-specific splicing regulators decide which sites the spliceosome sees, so cell identity is written partly in splice patterns. Mis-splicing is correspondingly a disease mechanism — the thalassemia and SMA examples of the previous section — and tumors frequently shift splice-isoform ratios.

## Every Message Has a Clock

Because mRNA is the disposable copy, its **half-life is a regulatory dial**. Bacterial messages survive minutes; eukaryotic messages range from minutes to many hours, and the difference sets how much protein each transcript yields. Eukaryotic decay usually begins with slow **shortening of the poly(A) tail**; once the tail is gone, the message is **decapped and eaten 5′→3′**, or degraded 3′→5′ by the **exosome** complex. The two end-marks that define a mature mRNA are thus also its armor — losing them is the commitment step of decay. Stability signals live largely in the 3′ untranslated region, where regulatory proteins and miRNAs (chapter II.14) dock.

## The Stable RNAs Are Processed Too

rRNA and tRNA are cut from longer precursors rather than used raw. A single eukaryotic **pre-rRNA transcript is trimmed to yield mature 18S, 5.8S, and 28S rRNAs**, with extensive nucleotide methylation guided by small nucleolar RNAs; bacteria likewise cut 16S, 23S, and 5S rRNA from one precursor. tRNA maturation includes 5′-end trimming by **RNase P** — an enzyme whose catalytic subunit is RNA, a ribozyme met again in the final section — plus 3′ processing, addition of the **CCA** end where the amino acid will be attached, and dozens of base modifications (pseudouridine, inosine) that tune folding and codon reading.`,
        quiz: [
          {
            question:
              'The calcitonin/CGRP pair demonstrates that two different proteins can arise from one gene. The mechanism responsible is:',
            options: [
              'Somatic recombination between two gene copies',
              'RNA editing that changes individual codons',
              'Tissue-specific alternative splicing and 3′-end processing of one pre-mRNA',
              'Use of two different promoters by RNA polymerases I and II',
            ],
            correctIndex: 2,
            explanation:
              'One primary transcript is processed differently in different tissues: thyroid cells splice and cleave it to encode calcitonin, neurons to encode CGRP. That is alternative splicing coupled to alternative polyadenylation — the mechanism by which >95% of human multi-exon genes expand their protein output. No recombination, editing, or polymerase switching is involved.',
          },
        ],
      },
      {
        id: 'bb2_tr_reverse',
        title: 'Information Flowing Backward',
        content: `## Reverse Transcriptase

Retroviruses such as HIV carry an RNA genome and an enzyme that inverts the usual flow: **reverse transcriptase (RT)**, an RNA-dependent DNA polymerase. One enzyme performs three jobs in sequence — it copies the RNA genome into a DNA strand, its **RNase H** activity degrades the RNA of the resulting RNA–DNA hybrid, and it then synthesizes the second DNA strand. The double-stranded DNA copy is inserted into a host chromosome by the viral integrase, becoming a permanent **provirus**. A minimal retroviral genome carries three genes — **gag** (core proteins), **pol** (RT, integrase, protease), and **env** (envelope glycoproteins) — expressed as polyproteins that the viral **protease** must cut apart.

RT is spectacularly inaccurate: with no proofreading exonuclease it commits roughly **one error per 20,000 nucleotides**, and HIV's enzyme is worse still — about one mutation per genome per replication cycle. That error rate is the molecular reason HIV outruns single drugs and vaccines: every patient hosts a swarm of variants. It also dictates therapy. **AZT (zidovudine)**, a thymidine analog, is phosphorylated by cellular kinases and preferentially grabbed by RT; once incorporated it terminates the DNA chain, because its 3′ position carries an azido group instead of the 3′-OH the next nucleotide would need. Other drug classes strike elsewhere — non-nucleoside RT inhibitors jam an allosteric pocket on RT, and **protease inhibitors** block polyprotein maturation — and modern treatment combines several classes at once so that no single mutation escapes them all.

## Telomerase: The Cell's Own Reverse Transcriptase

Reverse transcription is not only viral. **Telomerase** solves the end-replication problem (chapter II.10) by extending chromosome 3′ ends with tandem TG-rich repeats (TTAGGG in humans) — and it does so by reverse-transcribing **an RNA template it carries inside itself**, over and over. The protein subunit TERT is the reverse transcriptase; the built-in RNA is the template. Most somatic cells keep telomerase off and their telomeres shorten with each division — a mitotic clock tied to cellular senescence — while germ cells, stem cells, and roughly 85–90% of cancers keep the enzyme running.

## Ribozymes and the RNA World

This chapter has quietly accumulated RNA catalysts: self-splicing group I and II introns, RNase P, the snRNA core of the spliceosome — and chapter II.13 adds the biggest one, the ribosome's peptidyl transferase center, which is rRNA. Because RNA is the one macromolecule that both **stores information and catalyzes reactions**, these relics anchor the **RNA world hypothesis**: an early biology run on RNA alone, with DNA (better archive) and protein (better catalyst) as later specializations.`,
        examTip:
          'When a passage shows a polymerase copying RNA into DNA, ask what the template is. External viral RNA → reverse transcriptase (think RNase H activity, error-prone, AZT). An internal, built-in RNA template extending chromosome ends → telomerase. Both are reverse transcriptases; only one is a drug target in HIV.',
        quiz: [
          {
            question:
              'AZT triphosphate halts HIV replication because, once reverse transcriptase incorporates it into the growing DNA strand, the strand:',
            options: [
              'Is cleaved by the RNase H activity of reverse transcriptase',
              'Cannot be elongated, since the analog lacks a 3′-OH group',
              'Forms a hairpin that ejects the polymerase from the template',
              'Is immediately excised by the enzyme’s proofreading exonuclease',
            ],
            correctIndex: 1,
            explanation:
              'AZT is a deoxythymidine analog bearing an azido group where the 3′-OH belongs. RT binds AZT triphosphate in preference to dTTP, but after incorporation there is no 3′-OH to attack the next incoming nucleotide, so synthesis chain-terminates. RT has no proofreading exonuclease to remove it — indeed that missing proofreader is why the virus mutates fast enough to demand combination therapy.',
          },
          {
            question: 'Telomerase most closely resembles which enzyme class?',
            options: [
              'A DNA-dependent RNA polymerase carrying its own primer',
              'A reverse transcriptase carrying its own RNA template',
              'A topoisomerase that relaxes chromosome-end supercoils',
              'A 5′→3′ exonuclease that trims chromosome overhangs',
            ],
            correctIndex: 1,
            explanation:
              'Telomerase extends chromosome 3′ ends by copying a short RNA template housed within the enzyme itself — DNA synthesis from an RNA template, which is reverse transcription. The TERT subunit supplies the polymerase activity. It neither transcribes DNA into RNA nor degrades or unwinds DNA.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'RNA polymerase: reads template 3′→5′, builds 5′→3′, needs NTPs and Mg²⁺ but no primer, has no proofreading exonuclease (~1 error per 10⁴–10⁵ nt). Bacterial core α₂ββ′ω + σ = holoenzyme; ~17 bp bubble; positive supercoils ahead, negative behind.',
      'Bacterial promoters: −10 TATAAT and −35 TTGACA (plus UP element); closeness to consensus sets strength; alternative σ factors retarget the core enzyme (σ³² = heat shock). Termination: intrinsic = G-C hairpin + U-run (weak rU:dA hybrid); ρ-dependent = ATP-driven translocase from a rut site.',
      'Eukaryotic polymerases: Pol I → pre-rRNA (18S/5.8S/28S), amanitin-insensitive; Pol II → mRNA + most snRNA/miRNA, killed by low-dose α-amanitin, carries the YSPTSPS CTD; Pol III → tRNA + 5S rRNA, internal promoter elements, high-dose amanitin only. Pol II needs TBP/TFIID and the general factors; TFIIH = promoter-opening helicase + CTD kinase.',
      'mRNA maturation rides the phosphorylated CTD: 7-methylguanosine cap in a 5′,5′-triphosphate linkage at 20–30 nt; spliceosome (U1 at GU, U2 at branch A, U6 catalytic) removes GU…AG introns by two transesterifications via a lariat; cleavage 10–30 nt after AAUAAA, then 80–250 untemplated A residues.',
      'Self-splicing: group I introns use an external guanosine 3′-OH; group II use a branch-A lariat (the spliceosome’s ancestor). Both are ribozymes, as are RNase P and the ribosome’s peptidyl transferase — the RNA-world evidence set.',
      'Alternative splicing (>95% of human multi-exon genes) multiplies the proteome — calcitonin vs CGRP from one gene. mRNA decay: deadenylation → decapping → exonucleolysis (5′→3′ or exosome 3′→5′); half-life is a regulatory dial. Splice-site mutations cause β-thalassemias; nusinersen redirects SMN2 splicing in SMA.',
      'Reverse transcriptase: RNA→DNA polymerase + RNase H + second-strand synthesis; gag-pol-env genome, integrase → provirus; no proofreading (~1 error/20,000 nt) → HIV drug resistance; AZT chain-terminates (no 3′-OH); protease inhibitors block polyprotein cleavage; combination therapy outpaces the mutation rate.',
      'Telomerase = TERT reverse transcriptase + internal RNA template adding TTAGGG repeats; off in most somatic cells (telomere shortening, senescence), on in germ/stem cells and most cancers.',
    ],
  },

  // ── Biochemistry II.13: Translation and the protein's afterlife ─────────
  bb2_translation: {
    topicId: 'bb2_translation',
    title: "Translation and the Protein's Afterlife",
    domainWeight: '25%',
    overview:
      'Translation converts a four-letter nucleic acid text into a twenty-letter protein one, and everything difficult about it follows from that conversion: a code must map triplets to amino acids, an adaptor must physically embody the mapping, and a two-million-dalton machine must read the message without slipping a single frame. This chapter covers the code and its wobble, tRNA charging as the step where meaning is actually assigned, ribosome architecture, the initiation–elongation–termination cycle with its factor names and GTP bills, the antibiotics that exploit the bacterial version, and then the afterlife: how finished proteins are addressed to the ER, the nucleus, and the lysosome — and how the ubiquitin–proteasome system retires them.',
    sections: [
      {
        id: 'bb2_tl_code',
        title: 'The Code and Its Wobble',
        content: `## Properties Worth Testing

The genetic code assigns each mRNA **codon** — a nucleotide triplet, read 5′→3′ — to one amino acid. Of the 64 triplets, **61 are sense codons** and three (**UAA, UAG, UGA**) say stop; **AUG** doubles as the start signal and as methionine's codon. The code's character traits are exam currency. It is **degenerate**: most amino acids answer to several codons (Leu, Ser, and Arg to six each; Met and Trp to one), but it is never ambiguous — each codon means exactly one thing. It is **unpunctuated and non-overlapping**: no commas, no shared bases; the ribosome simply reads consecutive triplets from wherever it starts, which makes the **reading frame** everything. An insertion or deletion of one or two bases scrambles all downstream sense (frameshift), while a three-base indel adds or removes one residue and leaves the frame intact. Finally, the code is **nearly universal** — the same dictionary from bacteria to humans, which is why human insulin can be brewed in *E. coli* — with the famous exceptions living in mitochondria, whose small genomes bend a few assignments.

## Degeneracy Has a Geometry

Synonymous codons usually differ at the **third position**. The structural reason is **wobble**: the first two codon bases pair strictly with the anticodon, but the pairing at the codon's third base (the anticodon's 5′, or wobble, position) is loose. Crick's wobble rules allow, for example, a G in the wobble position to read U as well as C, and the modified base **inosine** to read three different codons (U, C, or A). Two consequences: a cell can decode all 61 sense codons with a minimum of **32 tRNAs** rather than 61, and third-position (silent) mutations frequently change nothing about the protein. Degeneracy is therefore a buffer — a substantial fraction of random point mutations land harmlessly on wobble positions.`,
        examTip:
          'Antiparallel pairing trips more students than wobble does. A codon written 5′→3′ pairs with an anticodon written 3′→5′; if the answer choices give anticodons 5′→3′, reverse before comparing. The wobble base is the anticodon’s 5′ nucleotide, which faces the codon’s 3′ nucleotide.',
        quiz: [
          {
            question:
              'The mRNA codon 5′-GCU-3′ is read by a tRNA whose anticodon, written 5′→3′, is:',
            options: ['5′-CGA-3′', '5′-AGC-3′', '5′-GCU-3′', '5′-UCG-3′'],
            correctIndex: 1,
            explanation:
              'Codon and anticodon pair antiparallel: 5′-GCU-3′ pairs with 3′-CGA-5′, which written in the conventional 5′→3′ direction is 5′-AGC-3′. Choice A is the antiparallel sequence left unreversed — the classic trap — and choice C simply repeats the codon.',
          },
          {
            question:
              'A point mutation changes a codon’s third base yet the protein is unaltered. The best explanation is that:',
            options: [
              'The mutation created a stop codon that is read through',
              'The code is degenerate, and synonymous codons usually differ at the third (wobble) position',
              'The ribosome corrected the mutation during proofreading',
              'The tRNA synthetase edited the mis-specified amino acid',
            ],
            correctIndex: 1,
            explanation:
              'Most degeneracy is concentrated at the third codon position, where wobble pairing lets one tRNA read several codons; a third-base change therefore often specifies the same amino acid (a silent mutation). Neither ribosomes nor synthetases repair DNA mutations — they act on RNA and amino acids, respectively.',
          },
        ],
      },
      {
        id: 'bb2_tl_charging',
        title: 'Charging tRNA: The Second Genetic Code',
        content: `## The Adaptor

tRNAs are the physical adaptors Crick predicted: 73–93 nucleotides folding into a cloverleaf of stems and loops — the **anticodon arm**, the D arm, the TψC arm, and the **amino acid (acceptor) arm ending in CCA**, whose terminal adenosine 3′-OH carries the amino acid. In three dimensions the cloverleaf folds into an L, with the anticodon at one tip and the amino acid ~7 nm away at the other: one end reads, the other end delivers.

## Where Meaning Is Assigned

The codon never touches the amino acid. The mapping is enforced earlier, by the twenty **aminoacyl-tRNA synthetases** — one per amino acid — each of which must pick its amino acid and its tRNA set out of cellular crowds. Charging takes two steps: the amino acid is first activated with ATP to an **aminoacyl-adenylate (aminoacyl-AMP)**, releasing PPᵢ; the aminoacyl group is then transferred to the tRNA's 3′-terminal adenosine. Because pyrophosphatase destroys the PPᵢ, **two ATP-equivalents are spent per charging**, making the ester bond effectively irreversible — and that ester later pays for peptide-bond formation itself. Synthetases read **identity elements** scattered over the tRNA, often the anticodon but not always: alanine's synthetase recognizes chiefly a G:U pair in the acceptor stem. Several synthetases also **proofread**, hydrolyzing near-miss amino acids (Val in the Ile enzyme) at a separate editing site, at the cost of extra ATP.

This step deserves its nickname — the **second genetic code** — because it is where fidelity actually lives. In the decisive experiment, cysteine already attached to tRNA^Cys was chemically converted to alanine; the ribosome then inserted that alanine wherever the mRNA said **cysteine**. The ribosome checks codon–anticodon pairing and never inspects the amino acid: **once a tRNA is charged, its cargo is trusted absolutely**. Get the charging step wrong and the code itself is rewritten.`,
        quiz: [
          {
            question:
              'Cysteine attached to tRNA^Cys is chemically reduced to alanine, and the mischarged tRNA is added to a translation system. The alanine is incorporated at positions specified by codons for:',
            options: ['Alanine', 'Cysteine', 'Both alanine and cysteine', 'Neither — the tRNA is rejected'],
            correctIndex: 1,
            explanation:
              'The ribosome matches codon to anticodon and never verifies the attached amino acid, so the tRNA^Cys delivers its (wrong) alanine cargo at cysteine codons. This is the classic demonstration that decoding fidelity is set at the aminoacylation step — the “second genetic code” enforced by the synthetases — not on the ribosome.',
          },
          {
            question:
              'How many high-energy phosphoanhydride bonds are consumed to charge one tRNA with its amino acid (assuming no editing)?',
            options: ['One', 'Two', 'Three', 'Four'],
            correctIndex: 1,
            explanation:
              'Activation cleaves ATP to AMP + PPᵢ (one bond), and pyrophosphatase then splits PPᵢ (the second bond), pulling the reaction to completion. The two-bond price makes charging effectively irreversible and stores energy in the aminoacyl ester that will later drive peptide-bond formation on the ribosome.',
          },
        ],
      },
      {
        id: 'bb2_tl_ribosome',
        title: 'The Ribosome: A Ribozyme with a Protein Shell',
        content: `## Architecture

The bacterial ribosome is a **70S** particle built from a **30S small subunit** (one **16S rRNA** + ~21 proteins) and a **50S large subunit** (**23S and 5S rRNAs** + ~33 proteins). Sedimentation coefficients measure shape as well as mass, so the numbers refuse to add — 30S + 50S = 70S is correct as written. The eukaryotic cytosolic ribosome is the larger **80S**: a **40S subunit (18S rRNA)** plus a **60S subunit (28S, 5.8S, and 5S rRNAs)**, with more proteins throughout. Mitochondrial ribosomes, true to their ancestry, resemble the bacterial kind — a fact with pharmacological consequences in the antibiotics section.

| Ribosome | Small subunit | Large subunit |
|----------|--------------|---------------|
| Bacterial 70S | 30S: 16S rRNA + ~21 proteins | 50S: 23S + 5S rRNA + ~33 proteins |
| Eukaryotic cytosolic 80S | 40S: 18S rRNA | 60S: 28S + 5.8S + 5S rRNA |

Functionally, the ribosome offers **three tRNA berths** spanning both subunits: the **A (aminoacyl) site** where each incoming charged tRNA lands, the **P (peptidyl) site** holding the tRNA attached to the growing chain, and the **E (exit) site** through which spent tRNAs leave. The small subunit clamps the mRNA and supervises codon–anticodon checking; the large subunit performs the chemistry.

## The Punchline

That chemistry — **peptidyl transferase**, the formation of each peptide bond — is catalyzed not by any ribosomal protein but by the **23S rRNA** (28S in eukaryotes). The active site is RNA; the proteins are scaffolding and fine-tuning. The ribosome is the largest known ribozyme, the strongest single piece of evidence for an RNA world, and a favorite MCAT discrete: when asked what catalyzes peptide-bond formation, the answer is rRNA. One mRNA is usually translated by many ribosomes at once, spaced along the message in a **polysome**; in bacteria, which have no nucleus, ribosomes load onto an mRNA while RNA polymerase is still writing its far end — transcription and translation coupled in space and time, something eukaryotic compartmentalization forbids.`,
        quiz: [
          {
            question: 'Peptide-bond formation on the ribosome is catalyzed by:',
            options: [
              'A protein of the large ribosomal subunit',
              'The rRNA of the large ribosomal subunit',
              'Elongation factor EF-Tu using GTP hydrolysis',
              'The aminoacyl-tRNA synthetase bound at the A site',
            ],
            correctIndex: 1,
            explanation:
              'The peptidyl transferase center is built of 23S rRNA (28S in eukaryotes) — the ribosome is a ribozyme, and its proteins serve structural roles. EF-Tu delivers aminoacyl-tRNAs but leaves before bond formation, and synthetases act in the cytosol during charging, never at the A site.',
          },
        ],
      },
      {
        id: 'bb2_tl_cycle',
        title: 'Initiation to Termination, with the Bill',
        content: `## Getting Started

Bacterial initiation places a special initiator tRNA — carrying **N-formylmethionine (fMet)** — directly into the **P site**, the only tRNA that ever enters there first. Three initiation factors run the show: **IF3** keeps idle 30S and 50S subunits apart, **IF1** blocks the A site, and **IF2, a GTPase, escorts fMet-tRNA^fMet** to the start codon. The right AUG is found by base-pairing between the 16S rRNA and the purine-rich **Shine-Dalgarno sequence** just upstream — which is how one bacterial mRNA can carry several independently initiated genes. When the 50S subunit joins, IF2 hydrolyzes its GTP and the factors depart. Eukaryotes differ in ways the exam probes: the initiator methionine is **not formylated**, the small subunit is recruited to the **5′ cap by eIF4E** and then **scans** to the first AUG in decent (Kozak) context, and **eIF2-GTP** brings the initiator Met-tRNA. One message, one start site — eukaryotic mRNAs are monocistronic.

## The Elongation Cycle

Each residue is added by a three-step cycle. (1) **Delivery**: **EF-Tu·GTP** brings the next aminoacyl-tRNA to the A site; correct codon–anticodon geometry triggers GTP hydrolysis and EF-Tu leaves (EF-Ts later recycles it to the GTP form). The pause before hydrolysis is a fidelity checkpoint — mismatched tRNAs usually fall off first. (2) **Peptide-bond formation**: the A-site amino group attacks the P-site ester; the energy comes from that ester itself, prepaid at charging. The chain now hangs from the A-site tRNA. (3) **Translocation**: **EF-G·GTP** ratchets the ribosome one codon 3′-ward, shifting tRNAs A→P and P→E; the E-site tRNA exits. Eukaryotic counterparts: eEF1α for delivery, eEF2 for translocation.

![Schematic of the ribosomal elongation cycle across the A, P, and E sites: EF-Tu·GTP delivers an aminoacyl-tRNA to the A site and leaves after GTP hydrolysis; the peptidyl transferase center (23S rRNA) forms the peptide bond, transferring the chain to the A-site tRNA; EF-G·GTP translocates the ribosome one codon toward the mRNA 3′ end, shifting the tRNAs into the P and E positions; the deacylated tRNA departs and the cycle repeats. Schematic — not to scale.](/courses/mcat/biochem/bc2-translation-cycle.svg)

## Stopping, and the Energy Audit

Stop codons are read by proteins, not tRNAs: in bacteria **RF1 recognizes UAG/UAA and RF2 recognizes UGA/UAA** (RF3-GTP assists); eukaryotes use a single **eRF1** for all three. The release factor tricks peptidyl transferase into hydrolyzing the chain off its tRNA, and a recycling factor with EF-G splits the ribosome for the next round. Now the bill. Per residue during elongation: **2 ATP-equivalents at charging + 1 GTP for EF-Tu + 1 GTP for EF-G = at least 4 high-energy bonds per peptide bond** — before counting initiation, termination, and any proofreading surcharges. A peptide bond needs only ~21 kJ/mol; the cell spends roughly 120. The overpayment purchases fidelity and irreversibility, and it makes translation the single largest energy expense of a rapidly growing cell.`,
        examTip:
          'Factor names sort by job, and GTP appears at every checkpoint: IF2/eIF2 (initiator tRNA delivery), EF-Tu/eEF1α (aminoacyl-tRNA delivery), EF-G/eEF2 (translocation), RF3 (termination). If a question shows the growing chain attached to the A-site tRNA, peptide transfer has just happened and translocation is next.',
        quiz: [
          {
            question:
              'Immediately after peptide-bond formation, the growing polypeptide chain is attached to:',
            options: [
              'The tRNA in the P site',
              'The tRNA in the A site',
              'The tRNA in the E site',
              'EF-Tu, pending GTP hydrolysis',
            ],
            correctIndex: 1,
            explanation:
              'Peptidyl transfer moves the chain from the P-site tRNA onto the amino group of the A-site aminoacyl-tRNA, so the lengthened chain briefly hangs in the A site. EF-G–driven translocation then shifts that tRNA into the P site and the deacylated one into the E site, resetting the cycle.',
          },
          {
            question:
              'Counting from amino acid activation through translocation, the minimum number of high-energy phosphate bonds spent per residue added during elongation is:',
            options: ['Two', 'Three', 'Four', 'Six'],
            correctIndex: 2,
            explanation:
              'Charging costs two (ATP → AMP + PPᵢ, with PPᵢ hydrolyzed); EF-Tu spends one GTP delivering the tRNA; EF-G spends one GTP translocating — four bonds minimum per peptide bond. The peptide bond itself is formed for free from the prepaid aminoacyl ester; the surplus buys accuracy.',
          },
          {
            question: 'Which statement about termination is correct?',
            options: [
              'Special stop-codon tRNAs deliver water to the P site',
              'Bacterial RF1 and RF2 are proteins that recognize stop codons and trigger hydrolysis of the finished chain',
              'EF-Tu recognizes stop codons when no tRNA is available',
              'The poly(A) tail signals the ribosome to stop translating',
            ],
            correctIndex: 1,
            explanation:
              'No tRNA reads a stop codon. Protein release factors do: RF1 (UAG/UAA) and RF2 (UGA/UAA) in bacteria, a single eRF1 in eukaryotes. They convert peptidyl transferase to a hydrolase, releasing the chain from the P-site tRNA; ribosome recycling then dissociates the subunits.',
          },
        ],
      },
      {
        id: 'bb2_tl_antibiotics',
        title: 'Poisons of the Ribosome',
        content: `## Selective Toxicity

Because bacterial and eukaryotic ribosomes differ, translation is medicine's favorite target: a molecule that jams a 70S ribosome but not an 80S one kills the infection and spares the patient. Every entry in the table below is fair game as a discrete question, and the sorting logic is worth more than the list — ask which subunit, which step, and which kingdom.

| Agent | Target | Mechanism | Selectivity |
|-------|--------|-----------|-------------|
| Streptomycin | 30S | Induces codon misreading; blocks initiation at higher doses | Bacteria |
| Tetracycline | 30S | Blocks the A site — aminoacyl-tRNA cannot bind | Bacteria |
| Chloramphenicol | 50S | Inhibits peptidyl transferase | Bacteria (and mitochondria) |
| Erythromycin (macrolide) | 50S | Plugs the exit tunnel; blocks translocation | Bacteria |
| Puromycin | A site | Aminoacyl-tRNA mimic; accepts the chain, then falls off — premature release | Both kingdoms |
| Cycloheximide | 60S | Inhibits eukaryotic peptidyl transferase | Eukaryotic cytosol only (lab tool) |
| Diphtheria toxin | eEF2 | ADP-ribosylates eEF2, freezing translocation | Eukaryotes |
| Ricin | 28S rRNA | Depurinates one adenosine; large subunit dead | Eukaryotes |

**Puromycin** deserves its own sentence: it looks like the aminoacylated 3′ end of a tRNA, enters the A site, and receives the growing chain — but since it is not a tRNA, nothing anchors it, and the truncated peptidyl-puromycin dissociates. Its acceptance by peptidyl transferase was classic evidence for the A-site/P-site model, and it kills bacterial and eukaryotic ribosomes alike, which is why it is a lab reagent rather than a drug.

Two toxins extend the theme beyond antibiotics. **Diphtheria toxin** is an enzyme: a single molecule ADP-ribosylates a modified histidine on eEF2 molecule after molecule, halting translocation cell-wide — catalytic lethality. **Ricin** (from castor beans) is also catalytic, removing a single adenine base from 28S rRNA and thereby inactivating the 60S subunit. And the mitochondrial footnote matters clinically: because mitochondrial ribosomes are bacteria-like, drugs such as chloramphenicol and aminoglycosides can produce mitochondrial side effects — bone-marrow suppression, ototoxicity — an ancestry lesson written in adverse-event tables.`,
        quiz: [
          {
            question:
              'An antibiotic permits aminoacyl-tRNA binding and peptide-bond formation but causes release of short, incomplete peptides from both bacterial and eukaryotic ribosomes. The agent is most likely:',
            options: ['Tetracycline', 'Erythromycin', 'Puromycin', 'Cycloheximide'],
            correctIndex: 2,
            explanation:
              'Puromycin mimics the aminoacylated 3′ tip of a tRNA: peptidyl transferase transfers the growing chain onto it, but with no tRNA body to hold it in place the peptidyl-puromycin falls off — premature termination in both kingdoms. Tetracycline blocks A-site binding, erythromycin plugs the bacterial exit tunnel, and cycloheximide is eukaryote-specific.',
          },
          {
            question: 'Diphtheria toxin arrests eukaryotic translation by:',
            options: [
              'Depurinating 28S rRNA in the large subunit',
              'ADP-ribosylating elongation factor eEF2',
              'Blocking the 40S subunit’s mRNA channel',
              'Cleaving the 5′ cap from mRNAs',
            ],
            correctIndex: 1,
            explanation:
              'Diphtheria toxin catalytically transfers ADP-ribose from NAD⁺ onto eEF2, disabling translocation; one toxin molecule can modify essentially all the eEF2 in a cell. Depurination of 28S rRNA is ricin’s mechanism — pair the two toxins and keep their targets straight.',
          },
        ],
      },
      {
        id: 'bb2_tl_afterlife',
        title: "Zip Codes and the Protein's Afterlife",
        content: `## Into the ER

A protein's destination is written in its own sequence. Secreted, membrane, and lysosomal proteins begin with an amino-terminal **signal sequence** — roughly 13–36 residues with a hydrophobic core. As it emerges from the ribosome, the **signal recognition particle (SRP)**, an RNA-protein complex and GTPase, binds it and **pauses elongation**, then delivers the whole ribosome to the **SRP receptor** on the ER membrane. GTP hydrolysis hands the ribosome to the **translocon**, a channel through which the chain is threaded as synthesis resumes — cotranslational import — and **signal peptidase** in the lumen snips the signal off. Chains that fail ER quality control are exported back to the cytosol and degraded; the most consequential example is the **ΔF508 mutant of CFTR**, a nearly functional chloride channel destroyed by quality control, which is the molecular lesion in most cystic fibrosis.

## Sugar Tags and Other Addresses

In the ER lumen, most of these proteins are **N-glycosylated**: a preassembled 14-sugar core oligosaccharide, built on the lipid carrier **dolichol phosphate**, is transferred en bloc onto an **asparagine** in the sequon Asn-X-Ser/Thr (tunicamycin blocks this step; O-linked sugars are added later, on Ser/Thr, in the Golgi). One sugar modification is a literal shipping label: enzymes destined for the lysosome receive **mannose 6-phosphate**, recognized by a Golgi receptor that diverts them into lysosome-bound vesicles. When the phosphotransferase fails — **I-cell disease** — lysosomal enzymes are secreted from the cell while lysosomes fill with undigested substrate. Nuclear proteins use a different system entirely: a basic **nuclear localization signal**, internal and never removed, is bound by **importin α/β**, which ferries the cargo through nuclear pores; the **Ran GTPase** gradient sets the direction and releases the cargo inside.

## The Ubiquitin–Proteasome End

Protein levels are set by degradation as much as by synthesis. Cytosolic proteins marked for destruction are tagged with **ubiquitin**, a 76-residue protein attached through a three-enzyme relay: **E1** activates ubiquitin with ATP (thioester), **E2** carries it, and an **E3 ligase — the specificity factor, chosen from hundreds** — links it to a lysine on the target. Repeated rounds build a **polyubiquitin chain** (Lys48-linked), the ticket recognized by the **26S proteasome**: a barrel-shaped 20S proteolytic core capped by 19S regulatory particles that unfold the substrate with ATP and thread it in; ubiquitin is recycled. Half-lives are partly encoded by a protein's own residues (the N-end rule). The clinical hooks are rich: **cyclins** must be destroyed on schedule for the cell cycle to advance; human papillomavirus's E6 protein redirects an E3 to destroy **p53**; and the proteasome inhibitor **bortezomib** is frontline therapy in multiple myeloma — a cancer treated by clogging the cell's garbage disposal.`,
        importantNote:
          'Three address systems, three signals: cleaved N-terminal hydrophobic signal sequence → ER (via SRP, cotranslational); internal basic NLS, never cleaved → nucleus (importin/Ran, post-translational); mannose 6-phosphate sugar tag → lysosome (Golgi sorting). Destruction has its own tag: Lys48-polyubiquitin → 26S proteasome.',
        quiz: [
          {
            question:
              'In I-cell disease, lysosomal hydrolases appear in the blood while lysosomes accumulate undegraded material. The defective step is:',
            options: [
              'Cleavage of the signal sequence by signal peptidase',
              'Attachment of mannose 6-phosphate tags in the Golgi',
              'Ubiquitination of misfolded lysosomal enzymes',
              'Import of hydrolases through nuclear pores',
            ],
            correctIndex: 1,
            explanation:
              'Lysosomal enzymes are routed by a mannose 6-phosphate tag added in the Golgi and read by an M6P receptor. Without the phosphotransferase that creates the tag, the enzymes default into the secretory pathway and leave the cell, and lysosomes fill with substrate. Signal-sequence cleavage and translocation are intact — the proteins are made and exported normally, just misdelivered.',
          },
          {
            question:
              'Within the ubiquitin–proteasome pathway, substrate specificity — which protein gets tagged — is chiefly determined by:',
            options: [
              'The E1 ubiquitin-activating enzyme',
              'The E2 ubiquitin-conjugating enzyme',
              'The E3 ubiquitin ligase',
              'The 20S core of the proteasome',
            ],
            correctIndex: 2,
            explanation:
              'Cells possess one or a few E1s, tens of E2s, and hundreds of E3 ligases; it is the E3 that recognizes the target and directs ubiquitin transfer to it, so specificity resides there. The proteasome core is deliberately unselective — it degrades whatever arrives wearing a Lys48-linked polyubiquitin chain.',
          },
          {
            question:
              'The signal recognition particle (SRP) performs which pair of functions?',
            options: [
              'Cleaves the signal sequence and glycosylates the protein',
              'Binds the emerging signal sequence and pauses translation until the ribosome docks at the ER',
              'Unfolds substrates and threads them into the proteasome',
              'Carries nuclear proteins through the nuclear pore complex',
            ],
            correctIndex: 1,
            explanation:
              'SRP grabs the hydrophobic signal sequence as it exits the ribosome, halts elongation, and delivers the ribosome–mRNA–peptide complex to the SRP receptor at the ER membrane, with GTP hydrolysis releasing SRP to recycle. Cleavage is signal peptidase’s job, glycosylation follows in the lumen, and nuclear import belongs to importins.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Code: 61 sense codons + UAA/UAG/UGA stops; AUG starts. Degenerate but unambiguous, unpunctuated, non-overlapping, nearly universal (mitochondrial exceptions). Frameshift from 1–2-base indels; 3-base indels preserve frame. Wobble at the third codon position (anticodon 5′ base; inosine reads U/C/A) → ~32 tRNAs suffice and many third-base mutations are silent.',
      'tRNA: 73–93 nt cloverleaf → L-shape; anticodon at one end, amino acid on the CCA 3′ terminus at the other. Charging by 20 aminoacyl-tRNA synthetases via aminoacyl-AMP; 2 ATP-equivalents per charge; identity elements beyond the anticodon (Ala: acceptor-stem G:U); editing sites hydrolyze near-misses.',
      'The synthetase step is the second genetic code: the ribosome checks codon–anticodon pairing only — a mischarged tRNA (Cys→Ala experiment) delivers the wrong residue at the codon’s address.',
      'Ribosomes: bacterial 70S = 30S (16S rRNA) + 50S (23S + 5S); eukaryotic 80S = 40S (18S) + 60S (28S + 5.8S + 5S); mitochondrial ribosomes are bacteria-like. A/P/E sites; peptidyl transferase is 23S/28S rRNA — the ribosome is a ribozyme. Polysomes; transcription–translation coupling in bacteria only.',
      'Initiation: bacteria — fMet-tRNA into the P site via IF2-GTP, Shine-Dalgarno pairs 16S rRNA, IF3 splits subunits, IF1 guards the A site; polycistronic mRNAs. Eukaryotes — unformylated Met, eIF4E binds the cap, scanning to a Kozak AUG, eIF2-GTP carries the initiator; monocistronic.',
      'Elongation cycle: EF-Tu·GTP delivery (EF-Ts recycles), peptidyl transfer paid by the aminoacyl ester, EF-G·GTP translocation (eEF1α/eEF2 in eukaryotes). Termination by RF1 (UAG/UAA) and RF2 (UGA/UAA) or eRF1. Bill: ≥4 high-energy bonds per residue — accuracy bought with energy.',
      'Antibiotics/toxins: streptomycin (30S, misreading), tetracycline (30S, A-site block), chloramphenicol (50S peptidyl transferase; mitochondrial side effects), erythromycin (50S exit tunnel), puromycin (A-site mimic, both kingdoms), cycloheximide (60S, lab tool), diphtheria toxin (ADP-ribosylates eEF2), ricin (depurinates 28S rRNA).',
      'Targeting: cleaved hydrophobic signal sequence → SRP pause → SRP receptor → translocon → signal peptidase (cotranslational, ER); N-glycosylation from dolichol-PP onto Asn-X-Ser/Thr (tunicamycin blocks); mannose 6-phosphate → lysosome (I-cell disease when absent); internal basic NLS + importin α/β + Ran → nucleus.',
      'Disposal: E1 → E2 → E3 (specificity; hundreds of E3s) builds Lys48 polyubiquitin → 26S proteasome (20S core + 19S caps, ATP). Hooks: cyclin destruction times the cell cycle, HPV E6 routes p53 to the proteasome, bortezomib inhibits the proteasome in myeloma, ΔF508 CFTR is degraded by ER quality control.',
    ],
  },

  // ── Biochemistry II.14: Gene regulation ─────────────────────────────────
  bb2_gene_regulation: {
    topicId: 'bb2_gene_regulation',
    title: 'Gene Regulation',
    domainWeight: '25%',
    overview:
      'Every cell in your body carries the same genome; a neuron and a hepatocyte differ only in which parts of it they read. This chapter builds regulation from the ground up: the lac operon, where four glucose/lactose states and two regulatory proteins make a clean logic circuit; the protein motifs that grip DNA; and then the eukaryotic tower — chromatin that must be opened, enhancers that act from a distance through coactivators, transcription factors built from swappable modules, hormone receptors that carry signals straight to DNA, and the post-transcriptional layer of translational repressors and microRNAs. It ends where regulation becomes anatomy: the transcription-factor cascades that pattern an embryo, and the potency ladder of stem cells.',
    sections: [
      {
        id: 'bb2_gr_logic',
        title: 'The Logic of Regulation',
        content: `## Why Regulate at Initiation

Some genes — for ribosomal proteins, glycolytic enzymes, the housekeeping core — are transcribed at steady rates in nearly every cell and are called **constitutive**. Everything else is dialed up (induced) or down (repressed) as conditions change, and the cheapest place to decide is the earliest: **transcription initiation**. A protein aborted at the promoter costs nothing; one destroyed after translation cost the full ribosomal bill of chapter II.13. So while control exists at every later step — processing, mRNA stability, translation, protein degradation — initiation carries most of the regulatory weight in both kingdoms.

The decision machinery is a small vocabulary used over and over. A **regulatory sequence** near (or, in eukaryotes, far from) a promoter is bound by a **regulatory protein**: a **repressor** that blocks RNA polymerase (negative control) or an **activator** that recruits or stimulates it (positive control). Each regulatory protein, in turn, is switched by a small-molecule **effector** that binds it allosterically and changes its DNA affinity — an inducer that inactivates a repressor, a corepressor that arms one, cAMP that arms an activator. Two proteins and two effectors are enough to wire the lac operon's entire truth table in the next section.

In bacteria the unit of regulation is the **operon**, Jacob and Monod's 1961 insight: several genes of one pathway sharing a single promoter and transcribed as one **polycistronic mRNA**, so the whole pathway toggles as a block. How does a regulatory protein find its few correct addresses among millions of base pairs? By reading the edges of base pairs exposed in the **major groove** — each pair presents a distinct pattern of hydrogen-bond donors and acceptors there — so recognition needs no melting of the helix. The protein architecture doing the reading is the subject of Section 3.`,
        quiz: [
          {
            question:
              'Regulating gene expression at transcription initiation, rather than at translation, is advantageous chiefly because it:',
            options: [
              'Is the only step at which regulation is chemically possible',
              'Avoids spending energy on transcripts and proteins that will not be used',
              'Allows the protein product to be modified after synthesis',
              'Prevents mutations from arising in unused genes',
            ],
            correctIndex: 1,
            explanation:
              'Initiation is the first committed step; blocking it costs essentially nothing, whereas a protein stopped only at translation has already consumed nucleotides for the mRNA and would demand roughly four high-energy bonds per residue if made. Regulation does occur at many later steps — splicing, stability, translation, degradation — but the economy argument concentrates control at initiation.',
          },
        ],
      },
      {
        id: 'bb2_gr_lac',
        title: 'The lac Operon, All Four States',
        content: `## The Cast

*E. coli* prefers glucose but can live on lactose, and the switch is the **lac operon**: three structural genes sharing one promoter — **lacZ** (β-galactosidase, which cleaves lactose), **lacY** (galactoside permease, which imports it), and **lacA** (a transacetylase) — plus the separately transcribed **lacI**, encoding the **Lac repressor**. The repressor is a **tetramer** that clamps the main operator **O₁**, overlapping the transcription start, while also gripping a secondary operator (O₂, inside lacZ, or O₃, upstream) so the intervening DNA bows into a **loop** — a double handhold that makes repression tight. Yet repression leaks slightly, and the leak is functional: a few permease and β-galactosidase molecules must pre-exist, because the true **inducer is allolactose**, a rearranged galactoside that β-galactosidase itself produces from lactose as a side reaction. (The lab shortcut **IPTG** induces without being metabolized.) Allolactose binds the repressor, allosterically loosening its grip on the operator — negative control lifted.

## The Second Input

Releasing the brake is not the same as stepping on the gas. The lac promoter is intrinsically weak, and real transcription requires the activator **CRP (cAMP receptor protein, also called CAP)** bound just upstream as a **CRP–cAMP** complex that recruits RNA polymerase. Here glucose enters the circuit: glucose transport **suppresses cAMP synthesis**, so plentiful glucose means no CRP–cAMP and a quiet operon regardless of lactose — **catabolite repression**, the cell's insistence on eating the better sugar first. Two inputs, four states:

| Glucose | Lactose | Repressor on O₁? | CRP–cAMP bound? | lac transcription |
|---------|---------|------------------|-----------------|-------------------|
| Present | Absent | Yes | No | Off |
| Present | Present | No (allolactose) | No | Weak (basal) |
| Absent | Absent | Yes | Yes | Off |
| Absent | Present | No | Yes | Strong |

Only the last row — lactose available, glucose gone — earns full expression: an AND gate built from one repressor and one activator.

![Schematic four-state logic diagram of the lac operon: with glucose present and lactose absent, the tetrameric Lac repressor loops O₁ to a secondary operator and the operon is off; with both sugars present, allolactose releases the repressor but low cAMP leaves CRP inactive, giving only basal transcription; with neither sugar, CRP–cAMP is bound but the repressor still blocks the promoter; with lactose present and glucose absent, the repressor is released and CRP–cAMP recruits RNA polymerase for strong transcription of lacZYA. Schematic — not to scale.](/courses/mcat/biochem/bc2-lac-operon.svg)

## Mutant Logic

The MCAT's favorite probe is a broken part. A **lacI⁻** mutant (repressor cannot bind DNA) or an **operator-constitutive (Oᶜ)** mutation (operator cannot be bound) each yields **constitutive** lacZYA expression — always on, though still capped by the CRP requirement. A lacI mutant whose repressor cannot bind allolactose is the opposite: permanently repressed, uninducible. Work each mutant by asking two questions — can the repressor grip? can CRP–cAMP act? — and the table above regenerates itself.`,
        examTip:
          'Glucose acts only through cAMP: glucose up → cAMP down → CRP inactive. If a question gives high glucose and high lactose, the answer is basal (weak) expression — repressor off but activator also off. Never let the repressor and CRP merge into one mechanism; one blocks, the other recruits, and they are independent inputs.',
        quiz: [
          {
            question:
              'E. coli is grown with abundant glucose AND abundant lactose. Expression of the lac operon is:',
            options: [
              'Maximal, because lactose inactivates the repressor',
              'Low (basal), because cAMP is scarce and CRP is inactive despite the released repressor',
              'Zero, because glucose stabilizes repressor binding at O₁',
              'Oscillating, because the two sugars compete for the permease',
            ],
            correctIndex: 1,
            explanation:
              'Lactose (as allolactose) removes the repressor, but glucose keeps cAMP low, so CRP–cAMP never assembles at the weak lac promoter and transcription idles at basal levels. Glucose acts through cAMP, not through the repressor. Full expression requires both conditions: repressor off AND activator on.',
          },
          {
            question:
              'A mutation in lacI produces a repressor that folds normally but cannot bind allolactose. The resulting phenotype is:',
            options: [
              'Constitutive expression of lacZYA in all conditions',
              'Normal induction, since IPTG-like molecules substitute in vivo',
              'Uninducible: the operon stays repressed even when lactose is present',
              'Loss of catabolite repression by glucose',
            ],
            correctIndex: 2,
            explanation:
              'This repressor still grips the operator but has lost its allosteric off-switch, so no amount of lactose can release it — the operon is permanently dark (a super-repressor). Constitutive expression is the opposite lesion: a repressor that cannot bind DNA, or an operator that cannot be bound. The CRP–cAMP circuit is untouched but irrelevant while the promoter is blocked.',
          },
          {
            question:
              'Why must a small number of β-galactosidase and permease molecules exist even in the fully repressed state?',
            options: [
              'They are needed to convert incoming lactose into allolactose, the actual inducer',
              'They degrade the Lac repressor when lactose appears',
              'They synthesize cAMP when glucose is exhausted',
              'They stabilize the DNA loop between O₁ and O₃',
            ],
            correctIndex: 0,
            explanation:
              'The inducer is not lactose itself but allolactose, made from lactose by β-galactosidase in a transglycosylation side reaction — and lactose must first be imported by the permease. Basal leaky expression supplies those few bootstrap molecules; without them the cell could never sense lactose at all. Neither enzyme touches the repressor protein or cAMP metabolism.',
          },
        ],
      },
      {
        id: 'bb2_gr_trp_motifs',
        title: 'The trp Operon and How Proteins Grip DNA',
        content: `## Repression Plus Attenuation

The **trp operon** encodes the tryptophan-synthesis enzymes and inverts the lac logic, as befits an anabolic pathway: here the product shuts the factory. The Trp repressor alone is inactive (an aporepressor); **tryptophan itself is the corepressor**, and the Trp–repressor complex binds the operator to block transcription — end-product negative control. Layered on top is **attenuation**, a second checkpoint that exploits bacteria's coupled transcription and translation: the mRNA leader contains two adjacent Trp codons and four segments that can pair into alternative hairpins, and the position of the ribosome decides which forms. When tryptophan is plentiful the ribosome moves briskly through the Trp codons, allowing a 3:4 **terminator** hairpin that ends transcription early; when tryptophan is scarce the ribosome stalls at those codons, the alternative 2:3 **antiterminator** forms instead, and polymerase reads on. It is an elegant starvation gauge — but its machinery requires a ribosome riding the nascent transcript, so attenuation is impossible in eukaryotes, where the nuclear envelope separates the two processes.

## The Grip Catalog

Regulatory proteins recognize DNA with a small set of reusable motifs, each pressing an α helix (or equivalent) into the major groove:

| Motif | Design | Carried by |
|-------|--------|-----------|
| Helix-turn-helix | Two helices; the second (recognition helix) reads the major groove | Lac and Trp repressors, CRP — the bacterial standard |
| Zinc finger | Short helix–loop module pinned by a Zn²⁺ ion held by Cys/His residues; used in tandem arrays | Many eukaryotic factors, incl. steroid-hormone receptors |
| Homeodomain | A conserved 60-residue helix-turn-helix variant | Developmental (Hox) regulators, Section 7 |
| Leucine zipper | Two helices dimerize via a leucine seam; adjacent basic regions grab DNA | Eukaryotic bZIP factors (e.g., c-Jun/c-Fos) |
| Basic helix-loop-helix | Helices dimerize across a loop; basic region binds DNA | Lineage-defining factors (e.g., MyoD) |

Two design lessons recur. Most DNA-binding proteins work as **dimers on palindromic (twofold-symmetric) sites** — two half-site contacts square the specificity. And zipper/HLH proteins can form **heterodimers**, so a modest set of monomers yields a combinatorial explosion of distinct regulators, a theme that returns in Section 5.`,
        quiz: [
          {
            question: 'Attenuation of the trp operon cannot operate in eukaryotic cells because:',
            options: [
              'Eukaryotes lack RNA hairpin structures',
              'Eukaryotic ribosomes cannot stall at rare codons',
              'Transcription and translation are separated by the nuclear envelope, so no ribosome rides the nascent transcript',
              'Tryptophan cannot enter the eukaryotic nucleus',
            ],
            correctIndex: 2,
            explanation:
              'Attenuation depends on a ribosome translating the leader while RNA polymerase is still transcribing it — the ribosome’s position selects the terminator or antiterminator hairpin. In eukaryotes, transcription finishes in the nucleus and translation happens later in the cytosol, so the coupling the mechanism requires does not exist.',
          },
          {
            question:
              'A eukaryotic transcription factor binds DNA through tandem modules, each organized around a Zn²⁺ ion coordinated by cysteine and histidine residues. This motif is a:',
            options: ['Leucine zipper', 'Zinc finger', 'Helix-turn-helix', 'Basic helix-loop-helix'],
            correctIndex: 1,
            explanation:
              'Zn²⁺ coordination by Cys/His residues pinning a compact DNA-reading module is the zinc finger, typically deployed in tandem arrays — the architecture used by many eukaryotic factors including the steroid-hormone receptors. Leucine zippers and bHLH motifs are dimerization-plus-basic-region designs; helix-turn-helix needs no metal.',
          },
        ],
      },
      {
        id: 'bb2_gr_chromatin',
        title: 'Eukaryotic Layer 1: Opening the Chromatin',
        content: `## Default Off

Bacterial DNA is naked and available; a promoter is on unless a repressor says otherwise. Eukaryotic DNA is spooled around histones into nucleosomes and compacted further, and that packaging is itself repressive — the eukaryotic **default is off**, and regulation begins by deciding which territory gets unpacked. Cytologically the split shows as dense, silent **heterochromatin** versus open, transcribable **euchromatin**.

Access is controlled by three rewritable marking systems. First, **histone acetylation**: HATs (histone acetyltransferases) transfer acetyl groups onto lysine residues of histone tails, **neutralizing their positive charge** and loosening the electrostatic grip on DNA while creating docking sites for activating readers; **HDACs (histone deacetylases)** strip the marks and restore silence. Acetylation is the most reliably "on" mark. Second, **histone methylation**, which carries meaning by position rather than charge: trimethylated H3K4 marks active promoters, while methylated H3K9 or H3K27 recruits silencing proteins — the beginnings of the histone-code idea. Third, **DNA methylation**: methyltransferases convert cytosines in CpG dinucleotides to **5-methylcytosine**, and densely methylated promoter regions (CpG islands) are stably silenced. Because the mark survives replication via maintenance methylation, it is heritable through cell divisions — the workhorse of **epigenetic** memory, underlying genomic imprinting and the permanent silencing of one female X chromosome.

Marks alone do not move nucleosomes; **ATP-dependent chromatin remodelers** such as the **SWI/SNF** family do, sliding or ejecting nucleosomes to expose promoters. The order of operations at an activated gene is a cascade: pioneer activators bind, recruit HATs and remodelers, the promoter clears, and only then can the Section 5 machinery assemble. Medicine already edits these systems — **HDAC inhibitors** (vorinostat) and the **hypomethylating agent** azacitidine are approved in lymphoma and myelodysplasia — and cancer genomes are as riddled with chromatin-regulator mutations as with classic oncogenes.`,
        quiz: [
          {
            question: 'Histone acetylation promotes transcription primarily by:',
            options: [
              'Adding negative supercoils to the DNA',
              'Neutralizing lysine positive charges, loosening histone–DNA contacts and recruiting activating readers',
              'Methylating CpG islands in the promoter',
              'Cleaving histone tails from the nucleosome core',
            ],
            correctIndex: 1,
            explanation:
              'Acetyl transfer onto histone-tail lysines erases their positive charge, weakening the electrostatic embrace of negatively charged DNA and marking the region for proteins that further open it; HDACs reverse the mark. CpG methylation is a separate, generally silencing system on the DNA itself, and no proteolysis is involved.',
          },
          {
            question:
              'Which regulatory mark is stably inherited by daughter cells after DNA replication, providing long-term epigenetic silencing?',
            options: [
              'CRP–cAMP binding at the promoter',
              'EF-Tu–GTP loading on the ribosome',
              '5-Methylcytosine in CpG dinucleotides, restored by maintenance methylation',
              'The open-complex state of RNA polymerase',
            ],
            correctIndex: 2,
            explanation:
              'After replication each CpG site is hemimethylated; maintenance methyltransferase copies the mark onto the new strand, so the silent state persists through divisions — the basis of imprinting and X-inactivation. Protein-binding states such as CRP occupancy are transient and must be re-established continuously.',
          },
        ],
      },
      {
        id: 'bb2_gr_enhancers',
        title: 'Eukaryotic Layer 2: Enhancers, Coactivators, Modular Factors',
        content: `## Action at a Distance

Once chromatin opens, the eukaryotic promoter still needs persuading — recall from chapter II.12 that Pol II plus its general factors gives only feeble basal transcription. The persuasion comes from **enhancers** (called upstream activator sequences in yeast): regulatory sites that can sit hundreds or thousands of base pairs from the promoter, upstream or downstream, and still work, because the intervening **DNA loops out** to bring enhancer-bound activators against the promoter machinery. Activators rarely touch Pol II directly; they act through **coactivators** — above all the huge multiprotein **Mediator complex**, which bridges activators to Pol II and the general factors, and HAT-bearing coactivators such as **p300/CBP** that keep the local chromatin open. Repressors play the same game mirrored: silencer sequences, corepressor complexes, HDAC recruitment.

## Factors Built from Interchangeable Parts

Eukaryotic transcription factors are **modular**: a DNA-binding domain (Section 3's motifs) and a separate **activation domain** that talks to coactivators. The domains are so independent that swapping them experimentally works — a hybrid carrying one protein's DNA-binding domain and another's activation domain activates whatever gene the binding domain targets (the engineering trick behind the yeast two-hybrid method). Modularity enables **combinatorial control**: a promoter-plus-enhancer region carries binding sites for many factors, and the transcriptional output reflects the particular committee assembled, so a few thousand factors specify vastly more expression states.

## Hormones That Are Transcription Factors' Keys

The steroid and thyroid hormones make this concrete and clinical. Being lipophilic, **estrogen, progesterone, cortisol, and thyroid hormone cross the plasma membrane** and bind **nuclear receptors** — zinc-finger transcription factors. Classic steroid receptors wait in the cytosol complexed with heat-shock chaperones; hormone binding releases the chaperone, the receptor dimerizes and enters the nucleus, docks on its **hormone response element (HRE)**, and recruits coactivators. One circulating molecule thus reprograms a battery of genes — hours-scale endocrine signaling, versus the seconds-scale second-messenger cascades of surface receptors. Pharmacology follows: **tamoxifen** parks in the estrogen receptor and holds it in a conformation that recruits corepressors instead of coactivators in breast tissue, which is why it treats ER-positive breast cancer.`,
        quiz: [
          {
            question:
              'An enhancer located 2,000 bp downstream of a gene still stimulates its transcription. The accepted explanation is that:',
            options: [
              'RNA polymerase II binds the enhancer first and slides to the promoter',
              'The intervening DNA loops, letting enhancer-bound activators contact the promoter machinery via coactivators such as Mediator',
              'The enhancer encodes a small RNA that activates the ribosome',
              'Enhancers act only on the antisense strand',
            ],
            correctIndex: 1,
            explanation:
              'Enhancers are position- and orientation-flexible because DNA looping delivers their bound activators to the preinitiation complex; the Mediator complex and HAT coactivators transduce the contact into recruitment and chromatin opening. Polymerase does not scan from enhancers, and no ribosomal mechanism is involved.',
          },
          {
            question:
              'Cortisol alters gene expression over hours, while epinephrine acts within seconds. The difference reflects the fact that cortisol:',
            options: [
              'Is hydrophilic and therefore diffuses faster through plasma',
              'Binds an intracellular receptor that acts directly as a transcription factor at hormone response elements',
              'Activates adenylyl cyclase more slowly than epinephrine does',
              'Must first be converted to a protein before acting',
            ],
            correctIndex: 1,
            explanation:
              'Cortisol is lipophilic: it enters cells and binds a nuclear receptor that, once freed of chaperones, dimerizes and binds HREs to redirect transcription — new mRNA and protein take hours. Epinephrine works at cell-surface receptors through second messengers, modifying pre-existing enzymes within seconds. Different receptors, different timescales.',
          },
        ],
      },
      {
        id: 'bb2_gr_posttranscriptional',
        title: 'After the Message Is Made',
        content: `## Regulating the Translator

A finished mRNA is still a hostage to regulation. Eukaryotic cells throttle translation globally through their initiation factors, at exactly the two handles chapter II.13 installed. The **4E-BPs** are small proteins that sequester the cap-binding factor **eIF4E**, blocking initiation; growth signals (insulin, via mTOR) phosphorylate the 4E-BPs, releasing eIF4E — translation tracks nutritional state. And **phosphorylation of eIF2** locks it in an inactive complex with its recycling factor, freezing delivery of the initiator tRNA; reticulocytes use a heme-regulated eIF2 kinase so that globin translation runs only when heme is available to finish hemoglobin. Stress pathways converge on the same factor, making eIF2 phosphorylation a general brake.

## RNA Silencing RNA

The second post-transcriptional system was hiding in plain sight until 1998: short RNAs that silence messages by base-pairing. **MicroRNAs (miRNAs)** are transcribed (mostly by Pol II) as long **pri-miRNAs** that fold into hairpins; the nuclear nuclease **Drosha** crops each hairpin to a **pre-miRNA**, which is exported to the cytoplasm, where **Dicer** trims it to a ~22-nucleotide duplex. One strand loads into the **RISC** complex on an **Argonaute** protein and guides it to complementary sequences, usually in 3′ UTRs: near-perfect pairing triggers mRNA cleavage, imperfect pairing represses translation and hastens decay. Hundreds of human miRNAs collectively tune a majority of protein-coding genes — a regulatory layer the size of the transcription-factor repertoire. The same machinery processes experimentally introduced double-stranded RNA into **siRNAs**, making **RNA interference** both a universal lab knockdown tool and a drug platform: patisiran, an siRNA that silences hepatic transthyretin, reached the clinic in 2018.`,
        examTip:
          'Sort the two silencing scales instantly: eIF2/4E-BP phosphorylation is global — the whole cell’s initiation rate moves; miRNA/RISC is sequence-targeted — specific messages picked off by base-pairing. And keep the miRNA assembly line in order: pri-miRNA → Drosha (nucleus) → pre-miRNA → export → Dicer (cytoplasm) → RISC/Argonaute.',
        quiz: [
          {
            question:
              'In reticulocytes deprived of heme, globin synthesis halts. The mechanism is:',
            options: [
              'A heme-activated protease that destroys globin mRNA',
              'A heme-regulated kinase that phosphorylates eIF2, blocking translation initiation',
              'Drosha-mediated cleavage of the globin pre-mRNA',
              'Loss of the globin gene’s enhancer looping',
            ],
            correctIndex: 1,
            explanation:
              'When heme is scarce, a heme-regulated kinase phosphorylates eIF2; the phosphorylated factor traps its recycling partner and initiator-tRNA delivery stops, so translation — dominated by globin in these cells — shuts down. This spares the cell from making apoprotein it cannot finish. The control is translational, not transcript degradation or nuclear.',
          },
          {
            question:
              'Which sequence correctly orders miRNA biogenesis and action?',
            options: [
              'Dicer (nucleus) → Drosha (cytoplasm) → ribosome cleavage',
              'Pri-miRNA → Drosha cropping in the nucleus → pre-miRNA export → Dicer trimming → strand loading into RISC/Argonaute',
              'Pre-miRNA → spliceosome → RISC → proteasome',
              'Pri-miRNA → reverse transcription → integration → silencing',
            ],
            correctIndex: 1,
            explanation:
              'The pipeline runs pri-miRNA (long Pol II transcript with hairpins) → Drosha crops in the nucleus → pre-miRNA exported → Dicer trims to a ~22-nt duplex → one strand guides RISC via Argonaute to target mRNAs, cleaving perfect matches or repressing imperfect ones. Drosha before Dicer, nucleus before cytoplasm.',
          },
        ],
      },
      {
        id: 'bb2_gr_development',
        title: 'Building Bodies and Resetting Clocks',
        content: `## Regulation Becomes Anatomy

Development is gene regulation with a spatial axis. The fruit fly shows the logic in four tiers. Before fertilization, the mother deposits mRNAs asymmetrically in the egg — **maternal-effect genes** — and the paradigm is **bicoid**: its mRNA is anchored at the anterior pole, so the translated Bicoid protein (a homeodomain transcription factor) forms an anterior-to-posterior **concentration gradient**, and nuclei read their position from the local Bicoid level. A **morphogen** is exactly this — a substance whose concentration, not mere presence, assigns fate; embryos from bicoid-null mothers develop no head, regardless of the embryo's own genotype. Bicoid and its partners then switch on the zygote's own cascade: **gap genes** carve the embryo into broad blocks, **pair-rule genes** stripe it into segment-sized periods, **segment polarity genes** give each stripe a front and back, and finally the **homeotic (Hox) genes** tell each finished segment what to become — leg, wing, antenna. Homeotic mutants make the point unforgettably: misexpress the wrong Hox gene and a fly grows legs where antennae belong. Hox genes encode homeodomain factors, sit in genomic clusters whose order mirrors the body axis, and are conserved from flies to humans — the deepest shared toolkit in animal biology.

## The Potency Ladder

Differentiation is a one-way descent of regulatory commitments — usually. The zygote and the first cleavage cells are **totipotent**: each can build a whole organism, placenta included. The blastocyst's inner cells are **pluripotent** — able to form every embryonic lineage (all three germ layers) but no longer the extraembryonic support; cultured, they are embryonic stem cells. Adult tissues retain only **multipotent** stem cells, restricted to a family of fates — hematopoietic stem cells replenish every blood lineage but will never make a neuron. Each step down reflects chromatin doors closing and factor committees dissolving, not loss of genes. The 2006 counter-experiment closed this chapter's argument: forcing expression of just four transcription factors — **Oct4, Sox2, Klf4, and c-Myc** — reprograms an adult fibroblast into an **induced pluripotent stem (iPS) cell**, climbing back up the ladder. If four regulators can reset a cell's identity, then identity was never anything more than a self-sustaining pattern of gene expression — which is precisely what this chapter has been claiming all along.`,
        quiz: [
          {
            question:
              'Embryos from mothers lacking functional bicoid fail to form anterior structures even when the embryo itself carries wild-type bicoid. This demonstrates that bicoid is:',
            options: [
              'A zygotic gap gene acting after fertilization',
              'A maternal-effect gene whose mRNA gradient in the egg patterns the embryo',
              'A homeotic gene specifying antennal identity',
              'A pair-rule gene expressed in seven stripes',
            ],
            correctIndex: 1,
            explanation:
              'The phenotype follows the mother’s genotype, the signature of a maternal-effect gene: bicoid mRNA is deposited at the egg’s anterior pole before fertilization, and the resulting protein gradient acts as a morphogen whose local concentration assigns anterior fates. Gap, pair-rule, and homeotic genes act later, in the zygote’s own cascade that Bicoid initiates.',
          },
          {
            question:
              'A hematopoietic stem cell can generate every blood cell type but not neurons or hepatocytes. It is best classified as:',
            options: ['Totipotent', 'Pluripotent', 'Multipotent', 'Terminally differentiated'],
            correctIndex: 2,
            explanation:
              'Multipotent stem cells self-renew and produce the several lineages of one tissue family — here, all blood lineages — but cannot cross into other germ-layer fates. Totipotency (whole organism plus placenta) belongs to the zygote stage; pluripotency (all three germ layers) to embryonic stem cells; and a terminally differentiated cell no longer self-renews.',
          },
          {
            question:
              'Reprogramming a fibroblast into an induced pluripotent stem cell requires expressing Oct4, Sox2, Klf4, and c-Myc. The success of this experiment argues that cellular identity is maintained by:',
            options: [
              'Irreversible deletion of unused genes during differentiation',
              'A self-sustaining network of transcription factors and chromatin states, which a new factor set can overwrite',
              'Permanent chemical modification of ribosomes',
              'The mutation rate of differentiated cells',
            ],
            correctIndex: 1,
            explanation:
              'Differentiated cells retain the whole genome; what differs is which regulatory network is running. Four transcription factors suffice to collapse the fibroblast program and re-establish the pluripotency network — identity is an epigenetic steady state, not a genomic edit, and it can be reset. Gene loss, ribosome marking, and mutation play no role.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Control concentrates at transcription initiation because it is cheapest. Vocabulary: repressor (negative) vs activator (positive), switched allosterically by effectors; bacterial operons yield polycistronic mRNA; regulators read base-pair edges in the major groove without melting DNA.',
      'lac operon: lacZYA (β-galactosidase, permease, transacetylase) + lacI repressor (tetramer on O₁, looping to O₂/O₃). Inducer = allolactose (made by β-galactosidase; IPTG in the lab) — basal leakiness is required to bootstrap sensing. Weak promoter needs CRP–cAMP; glucose lowers cAMP (catabolite repression). Four states: strong expression only with lactose present AND glucose absent.',
      'Mutant logic: lacI⁻ or Oᶜ → constitutive; repressor blind to allolactose → uninducible super-repressor; CRP loss → never strong. Ask two questions: can the repressor grip, can CRP act.',
      'trp operon: Trp is a corepressor arming its aporepressor (end-product control); attenuation is a leader-peptide/hairpin gauge that needs coupled transcription–translation — bacteria only.',
      'DNA-binding motifs: helix-turn-helix (Lac/Trp repressors, CRP), zinc finger (Cys/His-held Zn²⁺; nuclear receptors), homeodomain (Hox), leucine zipper and bHLH (dimerization + basic region; heterodimers multiply specificities). Dimers on palindromic sites.',
      'Eukaryotic layer 1 — chromatin, default off: HATs acetylate histone lysines (charge neutralized, open) vs HDACs; methylation means by address (H3K4 active; H3K9/K27 silent); CpG 5-methylcytosine silences heritably (imprinting, X-inactivation); SWI/SNF remodelers move nucleosomes with ATP. Drugs: HDAC inhibitors, azacitidine.',
      'Eukaryotic layer 2: enhancers/UAS act at a distance via DNA looping; coactivators (Mediator, p300/CBP) bridge activators to Pol II; factors are modular (separable DNA-binding + activation domains) → combinatorial control. Steroid/thyroid hormones enter cells and arm zinc-finger nuclear receptors at HREs — hours-scale signaling; tamoxifen exploits it in ER⁺ breast cancer.',
      'Post-transcriptional: 4E-BPs sequester eIF4E (mTOR/insulin releases); eIF2 phosphorylation is the global brake (heme-regulated in reticulocytes). miRNA line: pri-miRNA → Drosha → pre-miRNA → export → Dicer → RISC/Argonaute; perfect match cleaves, imperfect represses. siRNA drugs (patisiran) run the same machinery.',
      'Development: maternal bicoid gradient (morphogen; homeodomain) → gap → pair-rule → segment polarity → Hox identity genes (clustered, colinear, conserved). Potency ladder: totipotent zygote → pluripotent inner cell mass/ES cells → multipotent adult stem cells; Oct4/Sox2/Klf4/c-Myc reprogram fibroblasts to iPS cells — identity is a rewritable expression state.',
    ],
  },
};

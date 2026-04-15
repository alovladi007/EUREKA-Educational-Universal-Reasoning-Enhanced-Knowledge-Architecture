/**
 * Complete USPTO Patent Bar (Registration Exam) course content.
 * ~45 topics across 8 parts, based on the MPEP, 35 U.S.C., 37 C.F.R., and AIA.
 *
 * All content is authored from primary public sources (MPEP, statutes, regulations, AIA, USPTO
 * Federal Register notices, and USPTO-released past exam questions). No third-party proprietary
 * prep-course content is reproduced.
 *
 * Topic IDs match the existing PATENT_TOPIC_ANCHORS and PATENT_BAR curriculum where applicable
 * (pp_*, pa_*, pi_*, pct_*, eth_*, dp_*). New IDs are added for topics not yet in the curriculum
 * (using the same prefix conventions).
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

export const PATENT_BAR_COURSE: Record<string, TopicLesson> = {

// ═══════════════════════════════════════════════════════════════
// PART 1 — PATENTABILITY
// MPEP Chapter 2100 · 35 U.S.C. §§ 101, 102, 103, 112
// ═══════════════════════════════════════════════════════════════

pa_subject_matter: {
  topicId: 'pa_subject_matter',
  title: `35 U.S.C. §101 — Patent-Eligible Subject Matter`,
  domainWeight: 'Patentability · MPEP 2106',
  overview: `Section 101 is the first threshold of patentability: the claimed invention must fall within one of four statutory categories (process, machine, manufacture, or composition of matter) AND must not be directed to a judicial exception (law of nature, natural phenomenon, or abstract idea) without significantly more. The USPTO applies the two-step Alice/Mayo framework (codified in MPEP §2106) to evaluate §101 eligibility. This is among the most heavily tested and most litigated areas of patent law.`,
  sections: [
    {
      id: '101-statutory-categories',
      title: `1. The Four Statutory Categories`,
      content: `35 U.S.C. §101 provides: "Whoever invents or discovers any new and useful **process, machine, manufacture, or composition of matter**, or any new and useful improvement thereof, may obtain a patent therefor, subject to the conditions and requirements of this title."

This sentence establishes four — and only four — statutory categories of patentable subject matter.

## 1.1 Process (MPEP §2106.03)

A "process" is defined in 35 U.S.C. §100(b) as a "process, art, or method, and includes a new use of a known process, machine, manufacture, composition of matter, or material." Process claims recite a series of **acts or steps** performed on subject matter to produce a given result.

- Method of manufacturing a pharmaceutical → process
- Method of using a known compound to treat a new disease → process (a "new use" claim)
- Method of encrypting data on a computer → process
- A series of mental steps with no physical transformation → may fail §101 as an abstract idea

## 1.2 Machine (MPEP §2106.03)

A "machine" is "a concrete thing, consisting of parts, or of certain devices and combination of devices." *Burr v. Duryee*, 68 U.S. 531 (1863). A machine includes "every mechanical device or combination of mechanical powers and devices to perform some function and produce a certain effect or result."

- A printing press → machine
- A GPS navigation device → machine
- A computer loaded with particular software (functional claim language) → machine

## 1.3 Manufacture (MPEP §2106.03)

A "manufacture" (also "article of manufacture") is an article produced from raw or prepared materials by giving to these materials new forms, qualities, properties, or combinations. *Diamond v. Chakrabarty*, 447 U.S. 303 (1980).

- A chair → manufacture
- A knitted textile → manufacture
- A semiconductor wafer with a specific pattern → manufacture
- A DVD with encoded data → manufacture

## 1.4 Composition of Matter (MPEP §2106.03)

A "composition of matter" is "all compositions of two or more substances and all composite articles, whether they be the results of chemical union, or of mechanical mixture, or whether they be gases, fluids, powders or solids." *Chakrabarty*, 447 U.S. at 308.

- A new pharmaceutical compound → composition of matter
- An alloy of iron and carbon with a specific ratio → composition of matter
- A genetically modified bacterium that degrades crude oil → composition of matter (*Chakrabarty*)
- A mixture of enzymes for a particular reaction → composition of matter

## 1.5 What Is NOT Within Any Statutory Category

| Item | Why It Fails §101 |
|---|---|
| **Transitory signals** (e.g., propagating electromagnetic waves) | *In re Nuijten*, 500 F.3d 1346 (Fed. Cir. 2007) — not a manufacture |
| **Humans** | Policy exclusion (35 U.S.C. §33, Leahy-Smith AIA §33(a)) |
| **Data per se** (pure information divorced from physical medium) | Not a manufacture; see MPEP §2106.03 |
| **Legal contracts, literary works** | Not within any category |
| **Pure business methods with no tangible implementation** | Often fail as abstract ideas at Step 2A |

Transitory signal claims are a **frequent exam trap**: a claim drawn to "a signal encoding data according to [a method]" is NOT patent-eligible because a signal is not a process, machine, manufacture, or composition of matter.`,
      examTip: `Memorize the four statutory categories (Process, Machine, Manufacture, Composition of Matter) — sometimes called **"PMMC."** If a claim doesn't fit in any of these four, it fails §101 at Step 1 without even reaching the judicial-exception analysis. Watch for transitory-signal claims ("a signal carrying..."), which are tested frequently and always fail.`,
    },
    {
      id: '101-judicial-exceptions',
      title: `2. The Three Judicial Exceptions`,
      content: `Even when a claim fits within a statutory category, §101 eligibility can be lost if the claim is "directed to" one of three **judicial exceptions** without adding "significantly more." The Supreme Court has recognized these exceptions for over 150 years. *Le Roy v. Tatham*, 55 U.S. (14 How.) 156 (1853).

## 2.1 Laws of Nature (MPEP §2106.04(b))

A law of nature is a relationship that exists in nature and is not man-made. Examples:
- Newton's law of gravity
- The relationship between thyroid hormone levels and Mayo Clinic thiopurine metabolites (*Mayo Collaborative Services v. Prometheus Laboratories*, 566 U.S. 66 (2012))
- The correlation between a gene mutation and a disease predisposition

A claim that does no more than recite a law of nature plus routine, conventional steps is not patent-eligible.

## 2.2 Natural Phenomena (MPEP §2106.04(b))

Natural phenomena are products or processes that exist in nature without human intervention.
- Naturally occurring minerals
- Naturally occurring DNA sequences, as isolated (*Association for Molecular Pathology v. Myriad Genetics*, 569 U.S. 576 (2013) — isolated BRCA genes held ineligible)
- A new species of microorganism discovered in nature (vs. one genetically engineered, which IS eligible per *Chakrabarty*)

**Key contrast**: cDNA (complementary DNA) is patent-eligible because it is synthetic and does not occur in nature, even though it codes for the same protein as a natural gene (*Myriad*).

## 2.3 Abstract Ideas (MPEP §2106.04(a))

This is the most heavily litigated and amorphous category. The USPTO groups abstract ideas into three enumerated categories in MPEP §2106.04(a)(2):

### A. Mathematical Concepts
- Mathematical relationships, formulas, equations, calculations
- *Gottschalk v. Benson*, 409 U.S. 63 (1972) — algorithm for converting binary-coded decimal to binary
- *Parker v. Flook*, 437 U.S. 584 (1978) — mathematical formula for alarm limits

### B. Certain Methods of Organizing Human Activity
- Fundamental economic practices (hedging, insurance, intermediated settlement)
- Commercial or legal interactions (contracts, advertising, marketing)
- Managing personal behavior or relationships/interactions between people
- *Alice Corp. v. CLS Bank International*, 573 U.S. 208 (2014) — intermediated settlement
- *Bilski v. Kappos*, 561 U.S. 593 (2010) — hedging risk

### C. Mental Processes
- Concepts performed in the human mind (including observations, evaluations, judgments, opinions)
- Even if claimed as performed "on a computer," if the concept itself can be performed mentally, it falls here
- *CyberSource Corp. v. Retail Decisions, Inc.*, 654 F.3d 1366 (Fed. Cir. 2011)

## 2.4 The Policy Behind the Exceptions

The Supreme Court's concern is **preemption**: allowing patents on fundamental tools of science would "tie up the future use" of those tools and thereby inhibit rather than promote innovation. *Mayo*, 566 U.S. at 86. The exceptions exist to prevent monopolization of the basic building blocks of human ingenuity.`,
      importantNote: `The judicial exceptions apply across ALL statutory categories. A claim to a **machine** or **composition** can still fail §101 if it merely implements a natural law or abstract idea without adding significantly more. Do not assume a hardware-sounding claim is automatically eligible.`,
    },
    {
      id: '101-alice-mayo',
      title: `3. The Alice/Mayo Two-Step Framework`,
      content: `The USPTO's §101 analysis is codified in MPEP §2106 and follows a structured flowchart with two major steps. This framework is directly from *Alice* and *Mayo* and is the **single most important framework** for §101 on the Patent Bar exam.

## 3.1 Step 1 — Statutory Category Check

**Question**: Is the claim to a process, machine, manufacture, or composition of matter?

- **No** → Claim is ineligible; §101 rejection.
- **Yes** → Proceed to Step 2A.

Most claims pass Step 1 easily. Transitory signals and claims to humans are the main Step 1 failures.

## 3.2 Step 2A Prong One — Recites a Judicial Exception?

**Question**: Does the claim recite (set forth or describe) a judicial exception (law of nature, natural phenomenon, or abstract idea)?

- **No** → Claim is eligible. End of analysis.
- **Yes** → Proceed to Prong Two.

The examiner must identify the specific judicial exception. For abstract ideas, the examiner must identify **which enumerated grouping** from MPEP §2106.04(a)(2) the claim falls into (mathematical concept, method of organizing human activity, or mental process).

## 3.3 Step 2A Prong Two — Integrated into a Practical Application?

**Question**: Does the claim recite additional elements that integrate the judicial exception into a **practical application**?

A claim integrates the exception into a practical application if the additional elements:
- Reflect an **improvement to computer technology** or other technology/technical field (*Enfish, LLC v. Microsoft Corp.*, 822 F.3d 1327 (Fed. Cir. 2016))
- Apply the exception with a **particular machine** that is integral to the claim
- Effect a **transformation** of an article to a different state or thing
- Apply the exception in a meaningful way beyond merely linking it to a technological environment (*Diamond v. Diehr*, 450 U.S. 175 (1981) — rubber curing with the Arrhenius equation)

If yes → Claim is eligible.
If no → Proceed to Step 2B.

**Things that do NOT provide integration** (MPEP §2106.05(g)–(h)):
- Merely reciting the words "apply it" (or equivalent) with the judicial exception
- Adding insignificant extra-solution activity (data gathering, displaying results)
- Generally linking the exception to a particular technological environment or field of use

## 3.4 Step 2B — Significantly More?

**Question**: Do the additional elements provide an **inventive concept**, i.e., something significantly more than the judicial exception itself?

- **Yes** → Claim is eligible.
- **No** → Claim is ineligible; §101 rejection.

Key considerations:
- Elements that are **well-understood, routine, and conventional (WURC)** do NOT provide significantly more (*Alice*)
- This is a **factual inquiry** — the examiner must provide factual support (e.g., court decision, publication, or Berkheimer Memo-style evidence) before asserting WURC (*Berkheimer v. HP Inc.*, 881 F.3d 1360 (Fed. Cir. 2018))
- Unconventional combinations of known elements CAN provide inventive concept (*BASCOM Global Internet Services, Inc. v. AT&T Mobility LLC*, 827 F.3d 1341 (Fed. Cir. 2016))

## 3.5 The 2019 Revised Guidance

In January 2019, the USPTO issued the Revised Patent Subject Matter Eligibility Guidance (84 Fed. Reg. 50), which added the Prong Two "practical application" analysis to Step 2A. The Guidance is now codified in MPEP §2106. The Federal Circuit has endorsed this framework (*Cardionet, LLC v. InfoBionic, Inc.*, 955 F.3d 1358 (Fed. Cir. 2020)).

## 3.6 Framework Summary Table

| Step | Question | If Yes | If No |
|---|---|---|---|
| **1** | Within statutory category? | Go to 2A | Ineligible |
| **2A(1)** | Recites a judicial exception? | Go to 2A(2) | Eligible |
| **2A(2)** | Integrated into practical application? | Eligible | Go to 2B |
| **2B** | Significantly more (inventive concept)? | Eligible | Ineligible |`,
      examTip: `The exam loves the Alice/Mayo two-step. **Memorize the flowchart**. When a question asks whether a claim is §101-eligible, walk through the steps: (1) statutory category, (2A-1) judicial exception, (2A-2) practical application, (2B) significantly more. A common trap: questions may ask about Step 2B without mentioning that a claim first passing Step 2A Prong Two is already eligible. Always work the steps in order.`,
    },
    {
      id: '101-software-claims',
      title: `4. Software and Computer-Implemented Claims`,
      content: `Software and computer-implemented claims are the most common §101 battleground. *Alice* specifically addressed computer-implemented abstract ideas, and post-*Alice* case law provides a rich set of examples.

## 4.1 The General Rule from Alice

*Alice* held that merely implementing an abstract idea on a generic computer is not enough to confer eligibility. Adding "apply it with a computer" to an abstract idea does not transform it into a patentable invention.

- **Ineligible (under Alice):**
  - "A computer system for performing intermediated settlement" (*Alice* itself)
  - "A method for hedging risk on a computer" (*Bilski*)
  - "A method of tracking financial transactions using a generic server"

## 4.2 When Software Claims Are Eligible

Software claims CAN be eligible under §101 when they demonstrate a technical improvement or technical solution. Key cases:

### Enfish — Improvement to Computer Functionality
*Enfish, LLC v. Microsoft Corp.*, 822 F.3d 1327 (Fed. Cir. 2016) — A self-referential database table with specific architectural features was eligible because it was an improvement to computer functionality, not just using a computer to perform an abstract task.

### McRO — Technical Improvement in Animation
*McRO, Inc. v. Bandai Namco Games America*, 837 F.3d 1299 (Fed. Cir. 2016) — Rules-based lip synchronization for animated characters was eligible because the specific rules produced a technical result that was previously done by human animators.

### DDR Holdings — Technology-Rooted Solution
*DDR Holdings, LLC v. Hotels.com, L.P.*, 773 F.3d 1245 (Fed. Cir. 2014) — A solution to a problem specifically arising in the realm of computer networks (retaining website visitors) was eligible.

### Finjan — Behavior-Based Virus Scanning
*Finjan, Inc. v. Blue Coat Systems, Inc.*, 879 F.3d 1299 (Fed. Cir. 2018) — Generating a security profile identifying suspicious code and attaching it to a downloadable was a non-abstract improvement to computer security.

## 4.3 Claim Drafting Considerations

For software claims to survive §101, the specification and claim language should:
1. Identify a **specific technical problem** being solved
2. Describe the **technical solution** (how the invention works, not just what it does)
3. Recite **specific steps or components** that provide the technical improvement
4. Avoid purely functional claim language (which triggers §112(f) and weakens §101 analysis)
5. Tie the invention to a particular machine or technical field meaningfully

## 4.4 The "Do It On a Computer" Trap

A claim that takes a known process (e.g., keeping books of account, matching buyers and sellers, managing a stock portfolio) and simply says "performed on a computer" or "using a processor" will fail §101. The computer must do something more than execute the abstract concept — it must itself be improved or the process must solve a technical problem.

## 4.5 MPEP §2106 Examples

The MPEP provides numerous hypothetical examples. Know Examples 17, 18, 21, 22, 23, 25, 37, 38, 39, 42, 43 in particular — they illustrate the Step 2A/2B analysis for software. The USPTO's Subject Matter Eligibility Examples are available at uspto.gov and have been tested.`,
    },
    {
      id: '101-diagnostic-claims',
      title: `5. Diagnostic and Life-Sciences Claims`,
      content: `After *Mayo* and *Myriad*, diagnostic method claims face the toughest §101 scrutiny. Understanding these cases is essential for the exam.

## 5.1 Mayo v. Prometheus (2012)

The claims at issue measured metabolite levels in a patient's blood after administering a drug and correlated those levels with dosage adjustments. The Supreme Court held:
- The correlation between metabolite level and dosage adjustment is a **law of nature**
- The additional steps ("administering the drug," "determining the metabolite level") were **routine and conventional**
- Claims ineligible under §101

This case established the modern two-step framework and made most traditional diagnostic claims ineligible.

## 5.2 AMP v. Myriad (2013)

Myriad held patents on isolated BRCA1 and BRCA2 genes (markers for breast cancer risk). The Court ruled:
- **Isolated natural DNA = ineligible** (a product of nature)
- **cDNA = eligible** (synthetic, does not occur in nature, is not a mere isolation)

This remains the leading case for distinguishing natural products from human-made compositions.

## 5.3 Ariosa v. Sequenom (Fed. Cir. 2015)

A groundbreaking non-invasive prenatal test that detected fetal DNA in maternal plasma was held ineligible because the method used conventional techniques to detect a natural phenomenon (the presence of cell-free fetal DNA). Although the discovery was a medical breakthrough, the *implementation* used routine lab steps.

## 5.4 The Diagnostic Method Problem

After *Mayo*, diagnostic claims of the form "detect [natural marker] and infer [condition]" routinely fail. Patent drafters have shifted to:
- **Treatment claims**: "A method of treating [condition] by administering [drug] to a patient having [marker]" — these can survive (*Vanda Pharmaceuticals Inc. v. West-Ward Pharmaceuticals International Ltd.*, 887 F.3d 1117 (Fed. Cir. 2018))
- **Novel detection techniques**: if the detection method itself is non-conventional, the claim may survive
- **Specific reagents or kits**: a novel composition used in the method may carry the claim

## 5.5 2024 USPTO Guidance on AI-Assisted Inventions

In February 2024, the USPTO issued Inventorship Guidance for AI-Assisted Inventions (89 Fed. Reg. 10043). While primarily about inventorship, it reinforces that AI cannot be an inventor — a natural person must make a significant contribution. This is tested.`,
    },
    {
      id: '101-products-of-nature',
      title: `6. Products of Nature`,
      content: `The product-of-nature doctrine limits what naturally occurring substances can be patented. It ties directly into §101 and MPEP §2106.04(b)–(c).

## 6.1 The Markedly Different Characteristics Test

Under MPEP §2106.04(c), a product derived from a natural source is eligible if it has **markedly different characteristics** from what exists in nature. The relevant characteristics can be:
- **Structural** (physical, chemical, genetic makeup)
- **Functional** (what the product does)
- **Other** (properties not present in the natural counterpart)

## 6.2 Chakrabarty (1980) — The Foundation

A genetically engineered bacterium capable of breaking down crude oil was patentable. The bacterium had "markedly different characteristics from any found in nature." The Court's famous phrase: "anything under the sun that is made by man" is eligible. *Chakrabarty*, 447 U.S. at 309.

## 6.3 Funk Brothers (1948) — The Limit

A mixture of naturally occurring bacterial strains, each of which performed its natural function, was not eligible because no new or different function was produced. *Funk Brothers Seed Co. v. Kalo Inoculant Co.*, 333 U.S. 127 (1948). Merely combining natural products doesn't create something markedly different.

## 6.4 Practical Drafting Points

To secure a product-of-nature-based claim:
- Identify a structural difference (e.g., a mutation, a covalent linkage not found in nature)
- Describe a functional difference (e.g., increased stability, different specificity)
- Claim the compound in a non-natural form (isolated AND altered, not merely isolated)

## 6.5 Example Comparison

| Claim | Eligible? | Reason |
|---|---|---|
| Isolated BRCA1 gene | No | Same structure as natural (*Myriad*) |
| cDNA of BRCA1 | Yes | Synthetic; no introns; not in nature |
| Pseudomonas that eats crude oil (engineered) | Yes | Markedly different characteristics |
| Mixture of three soil bacteria, unchanged | No | Each performs natural function (*Funk*) |
| Vitamin B12 in a purified form with therapeutic activity not present in natural form | Yes | Markedly different (*Merck v. Olin Mathieson*, 253 F.2d 156 (4th Cir. 1958)) |`,
    },
  ],
  keyTakeaways: [
    'Four statutory categories: Process, Machine, Manufacture, Composition of Matter (PMMC). Signals and humans are excluded.',
    'Three judicial exceptions: Laws of Nature, Natural Phenomena, and Abstract Ideas. Apply across all four categories.',
    'Alice/Mayo two-step: (1) statutory category → (2A-1) recites exception? → (2A-2) integrated into practical application? → (2B) significantly more?',
    'Abstract ideas are grouped into: mathematical concepts, methods of organizing human activity, and mental processes (MPEP §2106.04(a)(2)).',
    'Merely implementing an abstract idea on a computer is NOT enough. Look for a technical improvement (Enfish, McRO, DDR, Finjan).',
    'Products of nature require markedly different characteristics (structural or functional) to be eligible (Chakrabarty vs. Funk Brothers).',
    'Diagnostic method claims face the toughest §101 scrutiny post-Mayo. Treatment claims are a workaround (Vanda).',
    'Well-understood, routine, conventional (WURC) activity cannot provide significantly more at Step 2B — but the examiner must have factual support (Berkheimer).',
  ],
},

pa_novelty: {
  topicId: 'pa_novelty',
  title: `35 U.S.C. §102 (AIA) — Novelty and Prior Art`,
  domainWeight: 'Patentability · MPEP 2131–2138',
  overview: `Section 102 under the America Invents Act (AIA) defines what counts as prior art and establishes when a claimed invention lacks novelty (anticipation). The AIA fundamentally restructured U.S. patent law from a "first-to-invent" to a "first-inventor-to-file" system for applications with an effective filing date on or after March 16, 2013. Understanding AIA §102(a)(1) and (a)(2), the grace-period exceptions in §102(b)(1) and (b)(2), and the rule of anticipation is essential — this section is tested on essentially every exam sitting.`,
  sections: [
    {
      id: '102-aia-framework',
      title: `1. AIA §102 Framework and Effective Dates`,
      content: `## 1.1 When AIA §102 Applies

The AIA amendments to §102 apply to any patent application that contains or contained at any time:
- A claim with an effective filing date **on or after March 16, 2013**; OR
- A specific reference under 35 U.S.C. §120, §121, or §365(c) to any application that ever contained such a claim.

If the application contains only claims with effective filing dates BEFORE March 16, 2013, pre-AIA §102 applies. "Transition applications" that straddle the date are governed by AIA §102 if ANY claim has a post-AIA effective filing date. **MPEP §2159 controls.**

## 1.2 AIA §102(a) — Two Categories of Prior Art

AIA §102(a) creates two numbered categories of prior art:

### §102(a)(1) — Public Disclosures Before Effective Filing Date

A person shall be entitled to a patent unless the claimed invention was:
- **Patented**, OR
- **Described in a printed publication**, OR
- **In public use**, OR
- **On sale**, OR
- **Otherwise available to the public**

**before the effective filing date** of the claimed invention.

The catch-all phrase "otherwise available to the public" sweeps broadly. Any public disclosure — a YouTube video, a conference presentation, a publicly accessible website — can qualify. *Helsinn Healthcare S.A. v. Teva Pharmaceuticals USA, Inc.*, 586 U.S. ___ (2019), held that a confidential commercial sale can still qualify as "on sale" prior art under AIA §102(a)(1).

### §102(a)(2) — U.S. Patent/Application Prior Art (Secret Prior Art)

A person shall be entitled to a patent unless the claimed invention was:
- **Described in a patent issued under §151**, OR
- **Described in a published application under §122(b)**,

naming **another inventor** and having an **effective filing date** before the effective filing date of the claimed invention.

This is the AIA successor to pre-AIA §102(e). It creates prior art as of the **earlier party's effective filing date** — even though the patent/application may not have been public until later. This is why it's sometimes called "secret prior art."

## 1.3 Key Differences vs. Pre-AIA

| Concept | Pre-AIA §102 | AIA §102 |
|---|---|---|
| **Priority basis** | First-to-invent | First-inventor-to-file |
| **Geographic limits** | "Known or used in this country" (§102(a)) | Worldwide (no geographic restriction) |
| **Grace period** | 1-year statutory bar from public use/sale in U.S. | 1-year grace period only for inventor's own disclosures (and derived disclosures) |
| **Invention date** | Applicant could swear behind prior art dated before invention date (pre-AIA Rule 131) | No swearing behind — effective filing date is dispositive |
| **Interferences** | Available to resolve priority | Replaced by derivation proceedings |

## 1.4 Effective Filing Date (MPEP §2152)

The "effective filing date" is:
- The **actual filing date** of the application; OR
- The filing date of the earliest application to which the claim is entitled to priority or benefit under §119, §120, §121, or §365.

Each claim is evaluated individually. A single application may have claims with different effective filing dates if some claims are supported by a priority document and others are not.`,
      examTip: `When you see "March 16, 2013" in a fact pattern, immediately flag whether AIA or pre-AIA §102 applies. If the application or any claim has an effective filing date on or after March 16, 2013, apply AIA §102. If all claims have effective filing dates BEFORE that date, apply pre-AIA §102. This is one of the most common exam setups.`,
    },
    {
      id: '102-aia-grace-period',
      title: `2. AIA Grace Period — §102(b) Exceptions`,
      content: `AIA §102(b) provides limited exceptions to what qualifies as prior art under §102(a). These are commonly called the "one-year grace period," but the AIA grace period is narrower than the pre-AIA version.

## 2.1 §102(b)(1) — Exceptions to §102(a)(1)

A disclosure made **one year or less** before the effective filing date is NOT prior art under §102(a)(1) if:

### §102(b)(1)(A) — Inventor's Own Disclosure
The disclosure was made by the inventor, a joint inventor, or another who obtained the subject matter directly or indirectly from the inventor.

### §102(b)(1)(B) — Intervening Third-Party Disclosure
The subject matter had, before the third-party disclosure, been publicly disclosed by the inventor, a joint inventor, or someone who obtained it from them.

**Example:** Inventor publishes an article on January 1, 2025. Competitor publishes similar article on March 1, 2025. Inventor files application on December 15, 2025. Both articles fall within the one-year grace period. The inventor's January 1 article is not prior art (§102(b)(1)(A)). The competitor's March 1 article is not prior art either (§102(b)(1)(B)), because the inventor had already publicly disclosed by that date.

## 2.2 §102(b)(2) — Exceptions to §102(a)(2)

A disclosure in a U.S. patent or published application is NOT prior art under §102(a)(2) if:

### §102(b)(2)(A) — Derivation
The subject matter disclosed was obtained directly or indirectly from the inventor or joint inventor.

### §102(b)(2)(B) — Prior Public Disclosure by Inventor
The subject matter had, before the reference's effective filing date, been publicly disclosed by the inventor, a joint inventor, or someone who obtained it from them.

### §102(b)(2)(C) — Common Ownership
The subject matter and the claimed invention were, not later than the effective filing date of the claimed invention, **owned by the same person or subject to an obligation of assignment to the same person**. This is commonly known as the "common ownership" exception.

## 2.3 Joint Research Agreements — AIA §102(c)

Under AIA §102(c), subject matter and a claimed invention are deemed to have been owned by the same person (for §102(b)(2)(C) purposes) if:
1. The subject matter was developed and the claimed invention made by parties to a **joint research agreement** in effect on or before the claimed invention's effective filing date;
2. The claimed invention was made as a result of activities under the joint research agreement; AND
3. The application discloses or is amended to disclose the names of the parties to the joint research agreement.

## 2.4 Grace Period Pitfalls

- **The grace period is only 1 year.** Any disclosure more than 1 year before the effective filing date is a time bar that cannot be overcome.
- **Grace period applies only to the inventor's own (or derived) disclosures.** A third party's independent public disclosure during the year before filing IS prior art unless the inventor had previously publicly disclosed (§102(b)(1)(B)).
- **Foreign filings start the clock.** If the U.S. application claims priority to a foreign application, the 1-year grace period is measured from the U.S. application's effective filing date (which could be the foreign priority date).
- **Grace period does NOT apply to foreign patents.** Foreign patent offices generally do not recognize this grace period; publication before filing can bar foreign patenting.

## 2.5 Affidavits and Declarations Under 37 CFR §1.130

To invoke a §102(b) exception during prosecution, the applicant files an affidavit or declaration under **37 CFR §1.130**:
- **Rule 1.130(a) — Declaration of Attribution**: establishes that a disclosure was made by the inventor or derived from the inventor.
- **Rule 1.130(b) — Declaration of Prior Public Disclosure**: establishes that the inventor's public disclosure occurred before the cited reference.

These differ from **Rule 1.131 affidavits** (pre-AIA "swearing behind"), which are NOT available for AIA §102 because effective filing date is dispositive.`,
      importantNote: `Rule 1.130 (AIA) and Rule 1.131 (pre-AIA) are commonly confused on the exam. **Rule 1.131 is NOT available under AIA.** Under AIA §102, you cannot swear behind a reference based on an earlier invention date. The only way around AIA prior art is: (1) the grace period exceptions, (2) claiming priority to an earlier application, or (3) disqualifying the reference via common ownership (§102(b)(2)(C)).`,
    },
    {
      id: '102-anticipation',
      title: `3. The Rule of Anticipation`,
      content: `Section 102 governs **anticipation** (lack of novelty). Anticipation is a strict test with specific requirements.

## 3.1 The Core Test

A claim is anticipated only if a **single prior art reference** discloses, either expressly or inherently, **every element** of the claimed invention, **arranged as in the claim**. *Verdegaal Bros., Inc. v. Union Oil Co.*, 814 F.2d 628 (Fed. Cir. 1987). Key requirements:

### 3.1.1 Single Reference Rule
Anticipation requires one reference that discloses all elements. You cannot combine multiple references to anticipate (that is §103 obviousness). MPEP §2131.

### 3.1.2 Every Element
Each and every limitation of the claim must be found in the reference. A missing element defeats anticipation. This is the **"all elements rule."**

### 3.1.3 As Arranged in the Claim
The elements must be disclosed in the same functional relationship as claimed. A reference describing elements A, B, and C in different contexts does not anticipate a claim combining them unless the reference itself shows the combination. *Net MoneyIN, Inc. v. VeriSign, Inc.*, 545 F.3d 1359 (Fed. Cir. 2008).

### 3.1.4 Enabling Disclosure
The reference must be **enabling** — it must describe the claimed subject matter in a manner sufficient to enable one of ordinary skill in the art to make and use the invention. *In re Hafner*, 410 F.2d 1403 (CCPA 1969). Unlike §112 for patents, enablement for anticipation requires only enabling the subject matter described in the reference, not any commercial use.

## 3.2 Inherency (MPEP §2112)

A reference can **inherently** disclose a claim limitation even if the reference does not expressly state it. Inherency requires that the missing characteristic is **necessarily present** in the thing described — not merely probably or possibly present.

Key principles:
- **Inherency must be necessary, not speculative.** *In re Robertson*, 169 F.3d 743 (Fed. Cir. 1999).
- **Recognition is not required.** A prior art reference inherently discloses a feature even if those skilled in the art did not recognize the feature at the time. *MEHL/Biophile Int'l Corp. v. Milgraum*, 192 F.3d 1362 (Fed. Cir. 1999).
- **New uses of old compositions** are eligible for process patents (§100(b)), but a claim to the composition itself is anticipated if the composition exists in the prior art, even for a different purpose. *In re Schoenwald*, 964 F.2d 1122 (Fed. Cir. 1992).

## 3.3 Genus/Species Anticipation

- A disclosure of a **specific species** anticipates a later-claimed **genus** that includes it.
- A disclosure of a **genus** generally does NOT anticipate a later-claimed **species** — unless the genus is small enough that one of ordinary skill would "at once envisage" the species (*In re Petering*, 301 F.2d 676 (CCPA 1962)).
- The **Petering doctrine**: a disclosed small genus (e.g., 20 chemical compounds in a Markush group) can anticipate a specific member.

## 3.4 Ranges and Numerical Limits

- A prior art range that **fully encompasses** a claimed range anticipates, absent criticality.
- A prior art range that **overlaps** a claimed range creates a prima facie case of anticipation or obviousness; the applicant can rebut with evidence of criticality (*ClearValue, Inc. v. Pearl River Polymers, Inc.*, 668 F.3d 1340 (Fed. Cir. 2012); *In re Peterson*, 315 F.3d 1325 (Fed. Cir. 2003)).
- A prior art point that falls within a claimed range anticipates (absent criticality showing).

## 3.5 Printed Publications — What Qualifies?

A "printed publication" under §102(a)(1) is a reference that has been **publicly accessible** to interested persons exercising reasonable diligence. MPEP §2128.
- A thesis shelved and indexed in a university library → publication (*In re Hall*, 781 F.2d 897 (Fed. Cir. 1986))
- A slide presentation shown briefly at a conference, with no copies distributed, generally not a printed publication (*In re Klopfenstein*, 380 F.3d 1345 (Fed. Cir. 2004))
- A website accessible via a search engine → publication (once indexed)
- **Effective date** is the date the reference became publicly accessible.

## 3.6 "Public Use" and "On Sale" Activities

- **Public use**: any non-secret commercial use of the invention by or with the inventor's permission. *Egbert v. Lippmann*, 104 U.S. 333 (1881) — a pair of corset springs worn by a single user in private, but without a confidentiality obligation, was public use.
- **On sale**: a commercial offer for sale, for a product that is "ready for patenting." *Pfaff v. Wells Electronics, Inc.*, 525 U.S. 55 (1998). Under AIA, a **confidential sale** still counts (*Helsinn*, 2019).`,
      examTip: `Remember the four elements of anticipation: **(1) single reference, (2) every element, (3) as arranged in the claim, (4) enabled.** If a question uses a combination of references, it's an obviousness question (§103), not anticipation. If a single reference is missing even one claim limitation, there's no anticipation.`,
    },
    {
      id: '102-effective-filing-date',
      title: `4. Effective Filing Date and Priority`,
      content: `The effective filing date (EFD) determines what is prior art. Correctly calculating EFD is one of the most common test scenarios.

## 4.1 Default Rule

Absent a priority claim, the effective filing date is the actual U.S. filing date.

## 4.2 Claims to Priority/Benefit

Under AIA §102(d), a claim's effective filing date can be an earlier date if the claim is entitled to priority or benefit:

| Basis | Statute | Requires |
|---|---|---|
| **Provisional application** | 35 U.S.C. §119(e) | Non-provisional filed within 12 months; §112(a) support in provisional |
| **Continuation** | 35 U.S.C. §120 | Copendency; same inventor/applicant; specific reference |
| **Divisional** | 35 U.S.C. §121 | Filed in response to restriction requirement |
| **Continuation-in-part (CIP)** | 35 U.S.C. §120 | New subject matter gets the CIP's filing date, not parent's |
| **Foreign priority** | 35 U.S.C. §119(a)–(d) | Filed within 12 months of foreign priority application; §112(a) support; priority claim filed within 4 months of U.S. filing or 16 months of priority date |
| **PCT national stage** | 35 U.S.C. §365 | National stage entry under §371 |

## 4.3 Claim-by-Claim Analysis

Each claim is evaluated individually. A CIP application may have some claims supported by the parent (earlier EFD) and other claims containing only new matter (later EFD). The examiner must determine EFD for each claim separately.

**Example:** Parent filed Jan 1, 2023, disclosing compound A. CIP filed Jan 1, 2024, adding disclosure of compound B. Claim to "compound A" has EFD of Jan 1, 2023. Claim to "compound B" has EFD of Jan 1, 2024.

## 4.4 §112(a) Support Requirement

For a claim to get benefit/priority, the earlier application must provide written description support and enablement under §112(a) for the full scope of the claim. Mere mention in the specification is not enough; the disclosure must show possession of the claimed invention.

## 4.5 The 12-Month Window

The 12-month window for claiming priority (provisional, foreign) generally must be met strictly. However, under the Patent Law Treaty (PLT) implementing changes, a 2-month restoration of priority is available for unintentional delay under 37 CFR §1.55(c) and §1.78(b).`,
    },
  ],
  keyTakeaways: [
    'AIA §102 applies to applications with any claim having an effective filing date on or after March 16, 2013.',
    'AIA §102(a)(1) = public disclosures before EFD (worldwide). AIA §102(a)(2) = U.S. patents/published apps naming another inventor with earlier EFD.',
    'AIA grace period (§102(b)(1)): 1-year carve-out only for the inventor\'s own disclosures (and derived ones). Intervening third-party disclosure bars you UNLESS you had already publicly disclosed.',
    'Common ownership exception (§102(b)(2)(C)) removes §102(a)(2) prior art when both the reference and claim are commonly owned by the EFD.',
    'Rule 1.130 affidavits invoke AIA §102(b) exceptions. Rule 1.131 (swearing behind) is NOT available under AIA.',
    'Anticipation requires: (1) a single reference, (2) every element, (3) arranged as in the claim, (4) enabling disclosure.',
    'Inherency: a missing feature is part of the reference only if necessarily present — not merely possibly present. Recognition by POSITA is not required.',
    'Helsinn (2019): a confidential sale can still be §102(a)(1) "on sale" prior art under AIA.',
  ],
},

pa_novelty_preaia: {
  topicId: 'pa_novelty_preaia',
  title: `35 U.S.C. §102 Pre-AIA — Novelty and Statutory Bars`,
  domainWeight: 'Patentability · MPEP 2131–2138 (Pre-AIA)',
  overview: `Pre-AIA §102 governs applications with all claims having effective filing dates before March 16, 2013. Although fewer new applications are filed under pre-AIA, the exam continues to test pre-AIA §102 because (a) many pending applications and recent patents are pre-AIA, (b) interferences and priority disputes arise under pre-AIA, and (c) understanding the contrast with AIA is essential for issue spotting. The pre-AIA statute uses lettered subsections (a) through (g), each creating different prior-art events with different date requirements.`,
  sections: [
    {
      id: '102-preaia-structure',
      title: `1. Pre-AIA §102 Structure and Subsections`,
      content: `Pre-AIA §102 contained seven numbered subsections (a) through (g). Each creates a distinct category of prior art. MPEP §2132–§2138 cover them.

## 1.1 §102(a) — Prior Knowledge or Use

A person shall be entitled to a patent unless the invention was **known or used by others in this country**, or **patented or described in a printed publication** in this or a foreign country, **before the invention thereof** by the applicant.

Key points:
- "Known or used" must be **in the United States** (geographic limit)
- "Patented or described in a printed publication" is **worldwide**
- Measured against the applicant's **invention date**
- Applicant can "swear behind" (Rule 1.131) to establish an earlier invention date

## 1.2 §102(b) — Statutory Bars (One-Year Bar)

A person shall be entitled to a patent unless the invention was:
- **Patented** or described in a **printed publication** anywhere, OR
- **In public use** or **on sale** in the United States,

**more than one year before the U.S. filing date** of the application.

This is the famous "one-year statutory bar" — **absolute, cannot be sworn behind**. Once the one-year clock expires, the patent is barred regardless of when the applicant actually invented.

## 1.3 §102(c) — Abandonment

Patent is barred if the applicant has **abandoned the invention**. Abandonment requires intent to dedicate the invention to the public. Rarely applied.

## 1.4 §102(d) — Foreign Patent Bar

A person is barred if:
1. The invention was first patented, or caused to be patented, or was the subject of an inventor's certificate in a foreign country, by the applicant or his legal representatives or assigns;
2. On an application filed **more than twelve months before** the filing of the U.S. application; AND
3. That foreign application matured into a patent **before the U.S. filing date**.

All three conditions must be met. Rarely triggered but tested.

## 1.5 §102(e) — Secret Prior Art (Pre-AIA)

A U.S. patent or published application by another describing the invention has prior-art effect as of **its own effective U.S. filing date** (not its publication date).
- §102(e)(1): published U.S. application → effective as of its U.S. filing date
- §102(e)(2): U.S. issued patent → effective as of its U.S. filing date
- PCT complication: A PCT application published in English designating the U.S. gets §102(e) effect back to its international filing date.

This is the pre-AIA counterpart to AIA §102(a)(2). The result is similar, but the §102(e) date mechanics have some PCT wrinkles.

## 1.6 §102(f) — Derivation

A person is not entitled to a patent if he did not himself invent the subject matter (i.e., he derived it from another). §102(f) is the derivation bar.

## 1.7 §102(g) — Prior Invention

A person is barred if:
- **§102(g)(1)**: In a U.S. interference proceeding, another inventor established prior invention.
- **§102(g)(2)**: Before the applicant's invention thereof, the invention was made in this country by another inventor who had not abandoned, suppressed, or concealed it.

Priority of invention considers:
- **Conception** (the formation of the definite idea in the mind of the inventor)
- **Reduction to practice** (actual RTP = making/testing; constructive RTP = filing an enabling application)
- **Diligence** from conception to RTP

The "first to invent" system is built on §102(g).

## 1.8 AIA Effective-Date Transition

Pre-AIA §102 applies to applications where **every claim** has an effective filing date before March 16, 2013. If ANY claim has an effective filing date on or after March 16, 2013, AIA §102 applies to the entire application (though pre-AIA §§102(g), 135, and 291 still apply to adjudicate interferences involving pre-AIA claims). MPEP §2159.`,
      examTip: `Memorize the dividing lines: **§102(a)** uses invention date; **§102(b)** uses filing date minus 1 year (statutory bar). Prior art that would fail §102(a) can often be sworn behind via Rule 1.131; prior art under §102(b) cannot. If a fact pattern says the applicant invented earlier than a reference but filed late, §102(b) may still bar the patent.`,
    },
    {
      id: '102-preaia-swearing-behind',
      title: `2. Rule 1.131 — Swearing Behind Under Pre-AIA`,
      content: `Under pre-AIA §102(a) and §102(e), an applicant may antedate (swear behind) a prior art reference by establishing invention before the effective date of the reference. The mechanism is an affidavit or declaration under **37 CFR §1.131**.

## 2.1 When Rule 1.131 Is Available

Rule 1.131 can overcome:
- §102(a) prior art (knowledge, use, patent, publication)
- §102(e) prior art (another's U.S. application/patent)

Rule 1.131 **cannot** overcome:
- §102(b) statutory bars (one-year bar is absolute)
- §102(g) prior invention by another (requires interference or derivation)
- A reference that claims the same invention (requires interference procedure)

## 2.2 What the Declaration Must Establish

The applicant must show:
1. **Actual reduction to practice** of the invention before the reference date; OR
2. **Conception** before the reference date, coupled with **diligence** from a time prior to the reference date up to the later of (a) actual reduction to practice or (b) constructive reduction to practice (filing).

## 2.3 Corroboration

All inventor testimony in priority matters must be corroborated by independent evidence (documents, testimony of others, physical samples). *Mergenthaler v. Scudder*, 11 App. D.C. 264 (1897). The "rule of reason" applies: the court considers all evidence in context.

## 2.4 Procedural Requirements

- File before final rejection (or file a response with the declaration at final)
- Must be signed by each inventor (or legal representative)
- Must be supported by dated exhibits (lab notebooks, drawings, emails, etc.)

## 2.5 Comparison to Rule 1.130

| Feature | Rule 1.131 (Pre-AIA) | Rule 1.130 (AIA) |
|---|---|---|
| **Purpose** | Swear behind prior art by proving earlier invention | Establish §102(b) exceptions (derivation, prior disclosure) |
| **Evidence** | Conception, diligence, reduction to practice | Source of prior art; earlier public disclosure |
| **Effect** | Disqualifies §102(a)/(e) reference | Disqualifies §102(a)(1)/(a)(2) reference as to specific inventor's material |
| **Available under AIA?** | NO | YES |

## 2.6 Common Rule 1.131 Traps

- **Not available for statutory bar references** (§102(b)). If the reference predates the U.S. filing date by more than one year, Rule 1.131 won't help.
- **Not available where the reference claims the same invention**. Use an interference instead.
- **Not available under AIA**. Applications with post-AIA claims use Rule 1.130.
- **Must predate the reference by even one day**. No "same day" invention suffices.`,
    },
  ],
  keyTakeaways: [
    'Pre-AIA §102 has seven subsections (a–g). §102(a) uses invention date; §102(b) uses U.S. filing date minus 1 year.',
    '§102(a) prior art requires "known or used in this country" — geographic limit. Patents and publications are worldwide.',
    '§102(b) one-year statutory bar is ABSOLUTE. Public use, on sale, patent, or printed publication > 1 year before U.S. filing = bar. Cannot swear behind.',
    '§102(e) secret prior art: a U.S. patent/published app by another gets prior-art effect as of its U.S. filing date.',
    '§102(g) prior invention: in pre-AIA, determined by conception, diligence, and reduction to practice. Interferences resolve disputes.',
    'Rule 1.131 lets an applicant antedate §102(a) and §102(e) references by proving earlier invention — but not §102(b) statutory bars.',
    'AIA replaced interferences with derivation proceedings. Rule 1.131 not available under AIA; use Rule 1.130 instead.',
    'Pre-AIA still matters for applications where every claim has EFD before March 16, 2013, and for old patents challenged today.',
  ],
},

pa_prior_art: {
  topicId: 'pa_prior_art',
  title: `Prior Art Categories — Printed Publications, Public Use, On Sale`,
  domainWeight: 'Patentability · MPEP 2128–2133',
  overview: `Even with §102(a) and (b) memorized, applying them requires understanding exactly what qualifies as a "printed publication," "public use," "on sale," or "otherwise available to the public." These categories are fact-intensive and tested repeatedly via hypothetical scenarios. The case law defining them spans over a century and includes landmark cases like Egbert v. Lippmann (1881), Pfaff v. Wells (1998), and Helsinn (2019).`,
  sections: [
    {
      id: 'printed-publications',
      title: `1. Printed Publications`,
      content: `A "printed publication" is any reference that is **publicly accessible** to persons interested and ordinarily skilled in the subject matter, exercising reasonable diligence. The phrase is construed broadly.

## 1.1 Public Accessibility Test

The test is **public accessibility**, not physical printing. Electronic documents, online databases, videos, and even oral presentations with accompanying slides can qualify.

- **Indexed thesis in a university library** → printed publication. *In re Hall*, 781 F.2d 897 (Fed. Cir. 1986). Shelved and cataloged, available for interlibrary loan.
- **Conference presentation with distributed handouts** → printed publication. *In re Klopfenstein*, 380 F.3d 1345 (Fed. Cir. 2004) — factors include length of display, expertise of audience, existence of reasonable expectations of confidentiality, and ease of copying.
- **Website accessible via search engines** → printed publication once indexed. *Voter Verified, Inc. v. Premier Election Solutions, Inc.*, 698 F.3d 1374 (Fed. Cir. 2012).
- **FTP server with publicly listed directory** → printed publication. *SRI International, Inc. v. Internet Security Systems, Inc.*, 511 F.3d 1186 (Fed. Cir. 2008).
- **Internal corporate documents** → NOT printed publications (not publicly accessible).
- **A presentation to a small group under confidentiality** → NOT printed publications.

## 1.2 Effective Date of a Printed Publication

The effective date is the date the reference became **publicly accessible**, not the date it was authored, finalized, or "printed."
- Journal article → date of journal mailing/distribution
- Website → date of public availability (indexing or linking)
- Thesis → date of library accession/cataloging

## 1.3 Patent Documents as Printed Publications

All patents and published applications are printed publications. Their effective date as §102(a)(1)/(b)(1) publications is the **publication date** (not filing date). However, under §102(a)(2) (AIA) or §102(e) (pre-AIA), they have the earlier effective date of the underlying application filing.

## 1.4 Non-English References

A foreign-language reference can be a printed publication, even if the examiner (or applicant) must obtain a translation. The reference's language does not affect its status.`,
      importantNote: `A document can be a printed publication even if only a **handful of people** have seen it. The question is accessibility (could interested persons have obtained it with reasonable diligence?), not actual circulation. But documents held in strict confidence — even if physically "printed" — are not printed publications.`,
    },
    {
      id: 'public-use',
      title: `2. Public Use`,
      content: `"Public use" as prior art under §102(a)(1) (AIA) or §102(b) (pre-AIA) has a specialized legal meaning distinct from its ordinary sense.

## 2.1 Definition

Any use of the invention by a person other than the inventor, without any limitation or restriction or injunction of secrecy, constitutes public use. *Egbert v. Lippmann*, 104 U.S. 333 (1881) — even one user, privately, without confidentiality, was "public use." The corset springs case remains a fundamental exam case.

## 2.2 Key Factors

Courts assess whether a use is "public" by looking at:
- Whether the use was **accessible to the public** (even potentially)
- Whether there were **confidentiality agreements** or reasonable expectations of secrecy
- The **commercial character** of the use
- Whether the use was **experimental** (experimental use doctrine — see below)

## 2.3 Inventor's Own Use

The inventor's own use of the invention — even in private — can be public use if:
- No confidentiality is maintained
- Third parties can observe the operation
- The invention is incorporated into a commercial product, even if the invention itself is hidden (hidden-in-product use)

## 2.4 Experimental Use Exception

An inventor's bona fide testing of an invention is NOT public use. *City of Elizabeth v. American Nicholson Pavement Co.*, 97 U.S. 126 (1877) — testing wooden pavement in a public street for six years was experimental, not public, use because it was necessary to test durability in real conditions.

Factors considered (MPEP §2133.03(e)):
- Length of the test period
- Whether records of progress were kept
- Whether the public had access
- Whether third parties tested the invention
- Whether the inventor maintained control
- Whether the testing related to essential features of the invention
- Whether payment was made

The experimental-use exception is **narrowly construed**. Market testing, customer testing, and commercial exploitation are NOT experimental use.

## 2.5 AIA vs. Pre-AIA

- **Pre-AIA §102(b)**: public use only if **in the United States**.
- **AIA §102(a)(1)**: no geographic limit — public use **anywhere** can bar.`,
    },
    {
      id: 'on-sale',
      title: `3. On-Sale Bar`,
      content: `The on-sale bar is triggered by a commercial offer for sale of the invention. It is one of the most litigated prior-art categories.

## 3.1 Pfaff Two-Part Test (1998)

*Pfaff v. Wells Electronics, Inc.*, 525 U.S. 55 (1998), established the modern two-part test for the on-sale bar:
1. **Commercial offer for sale** of the invention; AND
2. The invention is **"ready for patenting"** at the time of the offer.

"Ready for patenting" can be shown by:
- Actual reduction to practice (working prototype), OR
- Drawings or other descriptions sufficient to enable one skilled in the art to practice the invention.

## 3.2 What Counts as a Commercial Offer?

- A formal offer that the other party could accept to create a binding contract → YES
- Product brochures with pricing and ordering information → often YES
- Market research or soliciting feedback → generally NO
- Contract manufacturing (a supplier making the invention for the inventor) → arguably YES per *Medicines Co. v. Hospira, Inc.*, 881 F.3d 1347 (Fed. Cir. 2018) (en banc held that contract manufacturing where title remained with inventor was NOT on sale; but context-specific).

## 3.3 Helsinn v. Teva (2019) — Confidential Sales

In *Helsinn Healthcare S.A. v. Teva Pharmaceuticals USA, Inc.*, 586 U.S. ___ (2019), the Supreme Court held that under AIA §102(a)(1), a **confidential sale** can still be "on sale" prior art. The AIA language "or otherwise available to the public" did not change the meaning of "on sale"; a sale need not make the details of the invention public.

## 3.4 Experimental Use and the On-Sale Bar

The experimental-use exception applies to the on-sale bar too. An offer made for experimental purposes (not commercial exploitation) is not a barring sale. Again narrowly applied — *Allen Engineering Corp. v. Bartell Industries, Inc.*, 299 F.3d 1336 (Fed. Cir. 2002).

## 3.5 Geographic Scope

- **Pre-AIA §102(b)**: on sale **in the United States** only.
- **AIA §102(a)(1)**: on sale **anywhere** — worldwide.

## 3.6 Timing

The one-year clock starts on the date of the offer for sale, not the date of delivery or payment.

## 3.7 Practical Exam Tips

- A signed purchase order more than one year before the U.S. filing date → on-sale bar (pre-AIA)
- A confidential supply agreement where the invention will be delivered → *Helsinn*-type sale, AIA bar
- A secret, internal company development → not on sale
- A "teaser" announcement with no ability to actually purchase → not on sale (not a commercial offer)`,
      examTip: `The Pfaff two-part test — **(1) commercial offer (2) invention ready for patenting** — is heavily tested. Memorize it verbatim. When a question describes a pre-filing transaction, work through both prongs. If the invention is not yet "ready for patenting," there is no on-sale bar even if a sale occurred.`,
    },
    {
      id: 'otherwise-available',
      title: `4. "Otherwise Available to the Public" (AIA Only)`,
      content: `The AIA added the catch-all phrase "otherwise available to the public" to §102(a)(1). This phrase is intended to sweep in public disclosures that don't fit neatly into the enumerated categories.

## 4.1 Purpose

The phrase covers:
- Public presentations and speeches (without distributed materials)
- Video/audio recordings posted publicly
- Public demonstrations, trade shows
- Public conversations, podcasts, interviews
- Publicly accessible databases

## 4.2 Public Accessibility

The key question is whether the subject matter was **made accessible to the public** such that a person of ordinary skill in the art, exercising reasonable diligence, could have accessed it.

## 4.3 Relation to Other Categories

"Otherwise available to the public" is a **residual** category. If a disclosure fits "printed publication" or "public use," it's analyzed under those categories. The residual category catches public disclosures that don't fit the enumerated categories.

## 4.4 Public vs. Private Disclosures

- Posting a paper on arXiv → public (printed publication or otherwise available)
- Sharing a paper with a colleague under NDA → not public
- Public YouTube video demonstrating the invention → otherwise available
- Unlisted YouTube video shared only with invited viewers → depends on accessibility

## 4.5 Pre-AIA Treatment

Pre-AIA §102 does not contain this catch-all. Pre-AIA disclosures that don't fit knowledge, use, patent, publication, or on-sale/public-use are not prior art. Example: an oral presentation in a foreign country with no printed materials → pre-AIA: probably not prior art; AIA: probably prior art under "otherwise available to the public."`,
    },
  ],
  keyTakeaways: [
    'Printed publication = publicly accessible to interested POSITA exercising reasonable diligence. Includes indexed theses, websites, conference papers. Internal confidential docs are NOT.',
    'Public use (Egbert v. Lippmann): ANY non-confidential use, even by one person, can be public use. Hidden-in-product use counts.',
    'Experimental use exception is narrow: testing must be for patentee control of essential features, not commercial or market testing.',
    'On-sale bar (Pfaff test): (1) commercial offer for sale + (2) invention ready for patenting. Sale date, not delivery date, starts the clock.',
    'Helsinn (2019): a CONFIDENTIAL sale can be AIA §102(a)(1) "on sale" prior art.',
    'Pre-AIA: public use and on-sale events must be IN THE U.S. AIA: worldwide.',
    'AIA "otherwise available to the public" is a residual catch-all for public disclosures that don\'t fit printed publication / public use / on sale.',
    'A single inventor wearing corset springs in private but without confidentiality = public use (Egbert, 1881). This case appears regularly on exams.',
  ],
},

pa_obviousness: {
  topicId: 'pa_obviousness',
  title: `35 U.S.C. §103 — Obviousness`,
  domainWeight: 'Patentability · MPEP 2141–2146',
  overview: `Section 103 bars a patent if the differences between the claimed invention and the prior art are such that the invention as a whole would have been obvious to a person of ordinary skill in the art (POSITA) at the time the invention was made (pre-AIA) or before the effective filing date (AIA). Obviousness is a legal conclusion based on underlying factual findings (the Graham factors). KSR v. Teleflex (2007) modernized the analysis, replacing the rigid "teaching-suggestion-motivation" test with a more flexible approach. Obviousness is the single most common rejection encountered during prosecution.`,
  sections: [
    {
      id: '103-statute-and-framework',
      title: `1. The Statute and Basic Framework`,
      content: `## 1.1 35 U.S.C. §103 (AIA)

"A patent for a claimed invention may not be obtained, notwithstanding that the claimed invention is not identically disclosed as set forth in §102, if the differences between the claimed invention and the prior art are such that the claimed invention **as a whole** would have been obvious **before the effective filing date** of the claimed invention to a **person having ordinary skill in the art** to which the claimed invention pertains. **Patentability shall not be negated by the manner in which the invention was made.**"

## 1.2 Pre-AIA §103(a)

Nearly identical in substance but uses "at the time the invention was made" instead of "before the effective filing date." Prior art is evaluated as of the invention date (which, under pre-AIA, can be earlier than filing date via Rule 1.131).

## 1.3 Key Concepts in §103

### "As a whole"
The obviousness analysis considers the claimed invention as a whole — not element by element. Breaking the claim into its individual pieces and finding each piece in isolation (then arguing "obvious") is **hindsight reasoning** and is improper. *W.L. Gore & Associates, Inc. v. Garlock, Inc.*, 721 F.2d 1540 (Fed. Cir. 1983).

### "Person Having Ordinary Skill in the Art" (POSITA)
The POSITA is a hypothetical person with:
- Ordinary knowledge of the relevant art
- Knowledge of all prior art
- Reasonable creativity (post-KSR)
- NOT an expert, NOT a novice

Factors relevant to POSITA level (*Custom Accessories, Inc. v. Jeffrey-Allan Industries, Inc.*, 807 F.2d 955 (Fed. Cir. 1986)):
- Education of workers in the field
- Type of problems encountered in the art
- Prior art solutions
- Rapidity of innovation
- Sophistication of technology

### "Manner in which the invention was made"
The AIA statute explicitly rejects the "flash of genius" doctrine. It doesn't matter whether the invention came from years of painstaking research, a eureka moment, or computer-aided design — obviousness is judged objectively.

## 1.4 Combination of References

Unlike §102 anticipation (one reference), §103 allows combining multiple references. The examiner must articulate:
- Which specific elements come from which references
- Why a POSITA would have been motivated to combine them
- A reasonable expectation of success in the combination

## 1.5 Analogous Art

References must be **analogous art** to be combined:
- From the **same field of endeavor** as the claimed invention, OR
- **Reasonably pertinent** to the particular problem the inventor was trying to solve.

Non-analogous art is excluded from the combination. *In re Klein*, 647 F.3d 1343 (Fed. Cir. 2011).

## 1.6 Obvious-to-Try

A "finite number of identified, predictable solutions" to a known problem can make a combination obvious to try. *KSR Int'l Co. v. Teleflex Inc.*, 550 U.S. 398 (2007). But a random or experimental approach with many unpredictable variables is NOT obvious to try. *In re Kubin*, 561 F.3d 1351 (Fed. Cir. 2009).`,
      examTip: `The difference between §102 and §103 is one of the most testable distinctions. **§102 = single reference, every element. §103 = multiple references combined, plus motivation to combine.** If a fact pattern has two or more references, it's §103. If the question says "discloses all elements," it's §102.`,
    },
    {
      id: '103-graham-factors',
      title: `2. The Graham Factors`,
      content: `*Graham v. John Deere Co.*, 383 U.S. 1 (1966), established the framework for §103 analysis. The four Graham factors remain the foundation, though KSR expanded the analytical tools.

## 2.1 The Four Graham Factors

### Factor 1: Scope and Content of the Prior Art
Identify the relevant prior art. All analogous art at the time of invention (pre-AIA) or before the effective filing date (AIA) is in scope. This includes:
- Printed publications
- Patents
- Public uses and on-sale activities
- "Common knowledge" in the art (rare, must be supported)

### Factor 2: Differences Between the Prior Art and Claims at Issue
Compare the claimed invention to the prior art. Identify what elements the claim adds beyond the prior art. Do NOT dissect the claim into individual limitations — analyze as a whole.

### Factor 3: Level of Ordinary Skill in the Pertinent Art
Establish the POSITA level (education, experience). This affects what combinations and modifications are considered within the POSITA's reach.

### Factor 4: Secondary Considerations (Objective Indicia of Non-Obviousness)
Evidence offered by the applicant to rebut prima facie obviousness. Must be considered when offered. See §2.4 below.

## 2.2 The Examiner's Burden (MPEP §2142)

To establish prima facie obviousness, the examiner must:
1. Identify the differences between claim and prior art (Graham 2)
2. Find a **reason** a POSITA would have combined the references or modified the prior art
3. Show a **reasonable expectation of success**

## 2.3 Reasons to Combine (MPEP §2143 — KSR Rationales)

After KSR, the USPTO codified seven rationales supporting obviousness in MPEP §2143:
- **(A)** Combining prior art elements according to known methods to yield predictable results
- **(B)** Simple substitution of one known element for another to obtain predictable results
- **(C)** Use of known technique to improve similar devices in the same way
- **(D)** Applying a known technique to a known device ready for improvement to yield predictable results
- **(E)** "Obvious to try" — choosing from a finite number of identified, predictable solutions
- **(F)** Known work in one field prompts variations for use in same or different field based on design incentives
- **(G)** Some teaching, suggestion, or motivation in the prior art (the traditional "TSM" test)

These are **not exhaustive**. Any articulated reasoning supporting obviousness suffices post-KSR.

## 2.4 Secondary Considerations (Graham Factor 4)

Objective evidence that the invention is NOT obvious. Must be given weight when offered. MPEP §2145. Examples:

| Consideration | How It Helps |
|---|---|
| **Commercial success** | The claimed invention achieved commercial success traceable to its novel features (not marketing) |
| **Long-felt but unresolved need** | A problem existed for a long time without a solution, the applicant's invention solved it |
| **Failure of others** | Prior attempts by skilled artisans failed |
| **Unexpected results** | Property or result not predicted by the prior art (e.g., synergistic effect) |
| **Copying by competitors** | Competitors copied the invention rather than independently developing |
| **Licensing / industry praise** | Industry acceptance and third-party licensing |
| **Skepticism** | Experts said it couldn't be done |
| **Near-simultaneous invention** | Evidence AGAINST non-obviousness (others reached the same idea) |

### Nexus Requirement
Secondary considerations require a **nexus** — the evidence must be tied to the claimed features, not features in the prior art or unclaimed features. *Demaco Corp. v. F. von Langsdorff Licensing Ltd.*, 851 F.2d 1387 (Fed. Cir. 1988).

## 2.5 Teaching Away

Prior art that teaches AWAY from the claimed invention supports non-obviousness. A reference teaches away if it would lead a POSITA in a different direction or discourages the combination. *In re Gurley*, 27 F.3d 551 (Fed. Cir. 1994). Mere preference for another alternative is not teaching away.`,
      importantNote: `Secondary considerations (Graham Factor 4) are often overlooked but are critical. When the examiner presents a prima facie obviousness case, the applicant can submit declarations establishing secondary considerations. These MUST be evaluated — the examiner cannot simply dismiss them. The applicant must establish NEXUS between the evidence and the claimed features.`,
    },
    {
      id: '103-ksr',
      title: `3. KSR v. Teleflex and Modern Obviousness`,
      content: `*KSR Int'l Co. v. Teleflex Inc.*, 550 U.S. 398 (2007), is the most important §103 case in 40 years. It rejected the Federal Circuit's rigid TSM test and reaffirmed Graham's flexible approach.

## 3.1 What KSR Rejected

Pre-KSR, the Federal Circuit required the examiner to find an explicit **teaching, suggestion, or motivation (TSM)** in the prior art to combine references. KSR held this rigid formulation conflicted with Graham's flexible framework.

## 3.2 What KSR Established

- **Flexible approach**: any reasoning supporting obviousness suffices, as long as it is articulated with some rational underpinning.
- **Common sense matters**: a POSITA has common sense and can make obvious combinations without explicit TSM in the literature.
- **Predictability**: when combining known elements yields predictable results, it is typically obvious.
- **Obvious to try**: a finite number of identified, predictable solutions can make an invention obvious.
- **Market forces and design incentives** can motivate combinations even without explicit TSM.

## 3.3 KSR's "Obvious to Try" Doctrine (Limits)

Not every "try" is obvious. *In re Kubin*, 561 F.3d 1351 (Fed. Cir. 2009), clarified that obvious to try requires:
- A **finite number of identified, predictable solutions**
- A reasonable expectation of success

By contrast, "throwing metaphorical darts at a board filled with combinatorial prior art possibilities" is NOT obvious to try.

## 3.4 Post-KSR Cases

### In re Kubin (2009) — Biotech context
A cDNA encoding a known protein was obvious to try because there were finite, predictable cloning methods.

### Leo Pharmaceutical Products, Ltd. v. Rea (2013) — Pharmaceutical combinations
A combination of known drugs for a new use can still be non-obvious if the result is unexpected.

### Arendi S.A.R.L. v. Apple Inc. (2016) — Common sense
Examiner's "common sense" conclusion must have evidentiary support; bald assertion of common sense to fill a claim gap is insufficient.

## 3.5 Practical Exam Tips

- The 7 MPEP §2143 rationales (A–G) cover nearly all obviousness rejections. Know them.
- The examiner need not point to an explicit teaching in the references — common sense + predictability + motivation suffices.
- The applicant's counterargument typically focuses on:
  - Lack of motivation to combine
  - Teaching away by a reference
  - Unpredictability in the art
  - Secondary considerations with nexus`,
    },
    {
      id: '103-rebuttal',
      title: `4. Rebutting a §103 Rejection`,
      content: `When the examiner issues a §103 rejection, the applicant has several avenues for response. Understanding these options is key to prosecution strategy.

## 4.1 Attack the Prima Facie Case

The examiner must establish a prima facie case of obviousness. The applicant can argue:
- **Claim construction**: the examiner misreads a claim limitation.
- **Reference misinterpretation**: the cited reference doesn't teach what the examiner says.
- **Non-analogous art**: a cited reference is not analogous.
- **No motivation to combine**: the examiner's rationale is insufficient.
- **Teaching away**: a reference discourages the combination.
- **Unpredictability**: no reasonable expectation of success.

## 4.2 Amend the Claim

Add a limitation not found in the prior art. This is the most common response — but new claim language requires §112(a) support from the original specification (no new matter).

## 4.3 Submit Evidence of Secondary Considerations

Under **37 CFR §1.132**, submit an affidavit or declaration providing evidence of:
- Unexpected results (often the strongest ground, especially in chemical cases)
- Commercial success with nexus
- Long-felt need / failure of others
- Copying, licensing, industry praise, skepticism

The declaration must establish nexus — the evidence must tie back to the claimed subject matter, not unclaimed features or the prior art.

## 4.4 Rule 1.132 Declarations in Practice

Declarations are valuable for:
- **Chemical cases**: showing unexpected properties (e.g., a 10-fold improvement over the closest prior art compound)
- **Combinatorial cases**: showing synergy between components
- **Mechanical cases**: showing commercial success and nexus

Declaration tips:
- Compare to the CLOSEST prior art (*In re Baxter Travenol Labs.*, 952 F.2d 388 (Fed. Cir. 1991))
- Use a side-by-side comparison
- Test at least one representative species within the claimed scope
- Explain why the result was unexpected

## 4.5 Affidavit Under Rule 1.132 vs. Rule 1.130 vs. Rule 1.131

| Rule | Purpose | When Available |
|---|---|---|
| **1.130(a)** | Disclosure attributable to inventor | AIA applications |
| **1.130(b)** | Inventor's prior public disclosure | AIA applications |
| **1.131** | Establish invention before reference date | Pre-AIA applications only |
| **1.132** | Any other facts relevant to patentability | Both AIA and pre-AIA |

## 4.6 Appeal Path

If the examiner maintains the rejection, the applicant can:
- Request reconsideration
- File an RCE (request for continued examination) under 37 CFR §1.114
- Appeal to the PTAB under 37 CFR §41.31

## 4.7 Common Exam Trap

A declaration establishing unexpected results must cover the **full scope of the claim**. If the claim covers a genus and the declaration only tests one species that is not representative, the evidence is insufficient. *In re Clemens*, 622 F.2d 1029 (CCPA 1980).`,
      examTip: `When you see a §103 rejection based on a combination of references, check: (1) are the references analogous? (2) is there a rationale for combining? (3) would there have been a reasonable expectation of success? (4) did the applicant submit Rule 1.132 evidence? Arguments along these four lines are the standard response.`,
    },
  ],
  keyTakeaways: [
    'Obviousness is a legal conclusion based on the four Graham factors: (1) scope of prior art, (2) differences, (3) POSITA level, (4) secondary considerations.',
    'KSR (2007) replaced rigid TSM with a flexible approach. Any articulated rationale for combining references suffices, including common sense.',
    'MPEP §2143 lists 7 rationales for obviousness (A–G). Rationales A-D (predictable results), E (obvious to try), F (design incentive), G (traditional TSM).',
    'References must be analogous art: same field of endeavor OR reasonably pertinent to the problem.',
    'Obvious-to-try requires a finite number of identified, predictable solutions (Kubin). Not a dart-throwing approach.',
    'Secondary considerations (Graham 4): unexpected results, commercial success (with nexus), long-felt need, failure of others, copying.',
    'Rule 1.132 declarations are the primary vehicle for secondary considerations. Must establish NEXUS and cover the full claim scope.',
    'Obviousness is judged as the invention AS A WHOLE — not by dissecting claim elements. "Hindsight reasoning" is improper.',
  ],
},

pa_112a: {
  topicId: 'pa_112a',
  title: `35 U.S.C. §112(a) — Written Description, Enablement, Best Mode`,
  domainWeight: 'Patentability · MPEP 2161–2165',
  overview: `Section 112(a) imposes three separate disclosure requirements on the specification: (1) written description, (2) enablement, and (3) best mode. The first two are rejectable and litigatable; the third (best mode) is still required by statute but cannot be used to invalidate an issued patent under AIA §282. These requirements ensure that an inventor who claims a patent has actually invented what is claimed and has disclosed enough for others to practice it. Written description and enablement rejections are among the most common in biotech and software prosecution.`,
  sections: [
    {
      id: '112a-statute',
      title: `1. The Statute and Three Requirements`,
      content: `## 1.1 35 U.S.C. §112(a)

"The specification shall contain a **written description** of the invention, and of the manner and process of making and using it, in such **full, clear, concise, and exact terms** as to **enable** any person skilled in the art to which it pertains, or with which it is most nearly connected, to make and use the same, and shall set forth the **best mode** contemplated by the inventor or joint inventor of carrying out the invention."

This single sentence creates three distinct requirements:
- **Written description**
- **Enablement**
- **Best mode**

Each must be satisfied separately. A specification that enables the invention but lacks a written description of what was invented fails §112(a), and vice versa.

## 1.2 Policy Rationale

The §112(a) requirements are the "quid pro quo" of the patent system:
- Inventor gets a 20-year monopoly
- Public gets a full disclosure of how to make and use the invention

Without adequate disclosure, the patent system cannot achieve its Constitutional purpose of "promot[ing] the Progress of Science and useful Arts."

## 1.3 Date of Measurement

All three §112(a) requirements are assessed as of the **effective filing date** of the application. If the specification lacks the needed disclosure on filing day, adding it later is **new matter** (prohibited under 35 U.S.C. §132).`,
    },
    {
      id: '112a-written-description',
      title: `2. Written Description (MPEP §2163)`,
      content: `The written description requirement asks: does the specification convey to a POSITA that the inventor had **possession** of the claimed invention at the time of filing?

## 2.1 The Possession Test

The test is whether a POSITA reading the specification would conclude that the inventor had "possession" of the full scope of the claimed invention. *Ariad Pharmaceuticals, Inc. v. Eli Lilly & Co.*, 598 F.3d 1336 (Fed. Cir. 2010) (en banc).

Possession is shown when the specification:
- Describes the invention with sufficient detail and specificity
- Identifies structure (for compositions) or steps (for methods)
- Establishes that the inventor actually made/conceived the full claimed scope

## 2.2 Written Description for Genus Claims

When a claim recites a genus (e.g., a family of compounds), the specification must provide adequate written description for the **full scope** of the genus:
- **Representative number of species**, OR
- **Common structural features** that correlate with the claimed function

*In re Alonso*, 545 F.3d 1015 (Fed. Cir. 2008) — a single species cannot support a genus claim unless the species is representative of the entire genus.

## 2.3 Written Description for Functional Claims

Claims defined by function (what the invention does, not what it is) require special attention:
- The specification must describe enough structure to show possession of the function
- A "wish" or "plan" is not possession
- *Ariad* — a claim to a method of reducing NF-kB activity by an undefined class of molecules failed because the spec didn't disclose structures that perform the function.

## 2.4 Original Claims as Written Description

The original claims are part of the specification for §112(a) purposes. A claim that is part of the original disclosure provides written description for itself — except in cases of unusually broad or functional genus claims.

## 2.5 Amended Claims and New Matter

When the applicant amends a claim (or adds a new claim) during prosecution, the amended claim must have written description support in the **original specification**. Adding a new limitation not disclosed in the original specification violates 35 U.S.C. §132 (no new matter) and fails §112(a) written description.

## 2.6 Common Failure Modes

- **Biotechnology**: a claim to a class of antibodies defined only by target binding, without disclosure of representative antibody sequences (fails Ariad)
- **Pharmaceuticals**: a claim to a compound class defined only by a property (e.g., "compounds having IC50 below 10 nM"), without disclosure of structures
- **Software**: a claim reciting a function without describing the algorithm or data structures that implement it
- **Ranges**: a claim reciting a range narrower than any range disclosed in the specification may lack written description for the narrowed range`,
      importantNote: `Written description and enablement are **separate** requirements. A specification can enable an invention (i.e., teach how to make and use it) without describing it (i.e., without showing possession). Ariad confirmed that written description stands alone. Don't collapse the two on the exam.`,
    },
    {
      id: '112a-enablement',
      title: `3. Enablement (MPEP §2164)`,
      content: `Enablement asks: does the specification enable a POSITA to make and use the full scope of the claimed invention **without undue experimentation**?

## 3.1 The Wands Factors

*In re Wands*, 858 F.2d 731 (Fed. Cir. 1988), set out eight factors for evaluating whether experimentation is "undue":
1. Quantity of experimentation needed
2. Amount of direction or guidance in the specification
3. Presence or absence of working examples
4. Nature of the invention
5. State of the prior art
6. Relative skill of the POSITA
7. Predictability of the art
8. Breadth of the claims

Note: Some experimentation is ALWAYS allowed. The question is whether the experimentation is "undue" relative to what the disclosure provides.

## 3.2 Full Scope Enablement

The specification must enable the **full scope** of the claims, not just one embodiment:
- A claim to "all compounds effective for X" requires disclosure enabling a POSITA to identify compounds across the class.
- A narrow working example supporting a broad genus claim may fail full-scope enablement.

## 3.3 Amgen v. Sanofi (2023)

*Amgen Inc. v. Sanofi*, 598 U.S. 594 (2023), the Supreme Court held that Amgen's patents on PCSK9 antibodies failed enablement. The claims covered antibodies defined by their function (binding a specific region and blocking PCSK9). The Court ruled:
- The specification identified only 26 working antibodies
- The claim covered potentially millions of antibodies
- The specification did not enable the full genus
- POSITA would face undue experimentation to identify all the antibodies in the claim

This case raises the bar for functional genus claims and is increasingly cited in USPTO rejections.

## 3.4 Predictable vs. Unpredictable Arts

- **Predictable arts** (mechanical, electrical): fewer working examples typically suffice; a POSITA can extrapolate.
- **Unpredictable arts** (chemistry, biology): more examples needed; the more unpredictable, the greater the disclosure burden.

## 3.5 Enablement by Incorporation

A specification may incorporate another document by reference. The incorporated material counts as part of the disclosure. Requirements:
- Explicit statement of incorporation
- Identification of the incorporated document
- 37 CFR §1.57 governs essential vs. non-essential material; essential material must generally be included verbatim.

## 3.6 Enablement vs. Written Description

| Requirement | Question |
|---|---|
| **Written Description** | Did the inventor POSSESS what is claimed? |
| **Enablement** | Can a POSITA MAKE and USE what is claimed? |

A specification can fail one without failing the other — though they often rise or fall together.`,
      examTip: `The Wands factors are tested verbatim. **Memorize them**: (1) quantity of experimentation, (2) direction/guidance, (3) working examples, (4) nature of invention, (5) state of art, (6) POSITA skill, (7) predictability, (8) claim breadth. When the question asks whether enablement is satisfied, walk through these factors.`,
    },
    {
      id: '112a-best-mode',
      title: `4. Best Mode`,
      content: `The best mode requirement obligates the inventor to disclose the best way of carrying out the invention known to the inventor at the time of filing.

## 4.1 The Statute

"...and shall set forth the **best mode contemplated by the inventor** or joint inventor of carrying out the invention."

## 4.2 Two-Part Test (Pre-AIA Case Law)

- Subjective: Did the inventor have a best mode in mind at filing?
- Objective: Is that best mode disclosed in the specification?

If the inventor preferred a particular embodiment, reagent, temperature, etc., that preference must be disclosed.

## 4.3 AIA Change (35 U.S.C. §282)

Under the AIA, best mode remains a statutory requirement for patentability during **examination**, but failure to disclose the best mode is **not a basis for invalidity in litigation** (35 U.S.C. §282(b)).

This is a subtle but important distinction:
- USPTO examiner can still reject under §112(a) for best-mode failure (rare in practice)
- An infringer cannot invalidate a granted patent based on best-mode violation

## 4.4 Practical Effect

Despite the AIA change, patent attorneys still advise disclosing best mode because:
- Examiners may still raise best-mode issues
- Foreign jurisdictions may enforce best mode
- Professional responsibility to clients

## 4.5 Scope of the Requirement

Best mode applies only to what the INVENTOR contemplated. If the inventor didn't know of a superior embodiment, nothing was "withheld." The best mode requirement does not obligate the inventor to describe modes developed by third parties.`,
    },
  ],
  keyTakeaways: [
    '§112(a) has three requirements: written description, enablement, best mode. All measured as of the effective filing date.',
    'Written description = "possession" test (Ariad). Does the spec show the inventor had possession of the full claimed scope?',
    'Enablement = whether a POSITA can MAKE and USE the full scope without undue experimentation, using the Wands factors.',
    'Wands factors (8): quantity of experimentation, direction/guidance, working examples, nature of invention, state of art, POSITA skill, predictability, breadth.',
    'Amgen v. Sanofi (2023): functional genus claims need disclosure sufficient to enable the full class — 26 working antibodies did not enable millions.',
    'Written description and enablement are SEPARATE requirements — a claim can satisfy one while failing the other.',
    'New matter is prohibited (§132). Amendments must have support in the original specification.',
    'Best mode is still a statutory requirement but post-AIA cannot be used to INVALIDATE an issued patent (§282(b)). Still matters during examination.',
  ],
},

pa_112b_112f: {
  topicId: 'pa_112b_112f',
  title: `35 U.S.C. §112(b) Definiteness and §112(f) Means-Plus-Function`,
  domainWeight: 'Patentability · MPEP 2173 & 2181–2186',
  overview: `Section 112(b) requires claims to particularly point out and distinctly claim the subject matter — the definiteness requirement. Section 112(f) (pre-AIA §112, sixth paragraph) provides an optional claim format using "means for" or "step for" language that invokes a particular claim construction rule. Together these paragraphs control how claims are written and interpreted. Both are heavily tested, especially §112(f) because it has counterintuitive consequences for claim scope.`,
  sections: [
    {
      id: '112b-definiteness',
      title: `1. §112(b) — Definiteness`,
      content: `## 1.1 The Statute

"The specification shall conclude with one or more claims particularly pointing out and distinctly claiming the subject matter which the inventor or a joint inventor regards as the invention."

## 1.2 The Nautilus Standard

*Nautilus, Inc. v. Biosig Instruments, Inc.*, 572 U.S. 898 (2014), clarified the definiteness standard:

> A claim is indefinite if, read in light of the specification and the prosecution history, it fails to **inform, with reasonable certainty**, those skilled in the art about the scope of the invention.

Pre-Nautilus, the Federal Circuit used an "insolubly ambiguous" standard. Nautilus explicitly rejected that as too lenient.

## 1.3 Common Indefiniteness Rejections (MPEP §2173.05)

| Issue | Example | Why Indefinite |
|---|---|---|
| **Relative terms without reference** | "substantially," "about," "small" (without context) | No reasonable certainty |
| **Subjective terms** | "pleasing appearance" | Depends on viewer |
| **Inconsistency in scope** | Claim says "a widget" but spec describes only one species | Scope unclear |
| **Functional limitations** | "a processor configured to..." with no algorithm disclosed | Potentially indefinite per Williamson |
| **Contradictory claim terms** | Claim 1: "exactly three components"; dependent claim adds a fourth | Internal inconsistency |
| **Trademarks as limitations** | "TEFLON® coating" | Trademark can change, scope uncertain |
| **Negative limitations without support** | "not comprising X" when X isn't discussed | Often unsupported |

## 1.4 Clarifying Terms That ARE Definite

- "About 50%" — if the specification indicates the acceptable range, courts typically find this definite. *Pall Corp. v. Micron Separations, Inc.*, 66 F.3d 1211 (Fed. Cir. 1995).
- "Substantially parallel" — definite if POSITA can reasonably understand what deviation is acceptable.
- Open-ended ranges like "at least 50%" — typically definite.
- Markush groups ("selected from the group consisting of A, B, and C") — typically definite.

## 1.5 Antecedent Basis Problems

Every claim term must have proper antecedent basis:
- First use: "**a** widget"
- Subsequent use: "**the** widget" or "**said** widget"

Using "the widget" without a prior "a widget" is a common indefiniteness issue (MPEP §2173.05(e)).

## 1.6 Multiple Dependent Claims

Multiple dependent claims (a claim depending on more than one other claim) must be in the **alternative**, not cumulative:
- Correct: "The widget of claim 1 or 2, wherein..."
- Incorrect: "The widget of claims 1 and 2, wherein..."
A multiple dependent claim cannot depend on another multiple dependent claim (37 CFR §1.75(c)).`,
      examTip: `The **Nautilus "reasonable certainty"** standard replaced "insolubly ambiguous." Memorize this standard verbatim. Indefiniteness questions often use terms like "substantially," "about," or "a few" — the answer depends on whether the specification provides context. If yes → definite. If no → indefinite.`,
    },
    {
      id: '112f-means-plus-function',
      title: `2. §112(f) — Means-Plus-Function Claims`,
      content: `## 2.1 The Statute

"An element in a claim for a combination may be expressed as a **means** or **step for performing a specified function** without the recital of structure, material, or acts in support thereof, and such claim shall be construed to cover the **corresponding structure, material, or acts described in the specification and equivalents thereof**."

This is the optional "means-plus-function" (MPF) claim format.

## 2.2 How It Works

When an element is written in means-plus-function format:
1. The claim recites a function (e.g., "means for transmitting data")
2. The claim does NOT recite structure
3. The claim is construed to cover the structure disclosed in the specification that performs that function, plus **equivalents** of that structure

## 2.3 The Benefit and the Trap

**Benefit**: the claim can be written abstractly without tying it to specific hardware.

**Trap**: the claim scope is LIMITED to the corresponding structure disclosed in the specification (and equivalents). If the specification discloses only one embodiment, the claim's scope is narrow — much narrower than the plain language suggests.

## 2.4 Triggering §112(f)

§112(f) is triggered when the element uses:
- **"Means for" + function** (the classic trigger)
- **"Step for" + function** (for method claims)
- A **generic placeholder** (e.g., "module," "mechanism," "device") + function, without sufficient structure — per *Williamson v. Citrix Online, LLC*, 792 F.3d 1339 (Fed. Cir. 2015) (en banc)

*Williamson* overruled the strong presumption that absence of "means" avoided §112(f). Now the test is whether a POSITA would understand the claim language to connote "sufficiently definite structure."

## 2.5 Corresponding Structure Must Be Disclosed

For §112(f) to be valid, the specification must disclose structure that performs the claimed function. Failure to disclose corresponding structure renders the claim **indefinite under §112(b)**:
- **Algorithm requirement for computer-implemented functions**: the specification must disclose the algorithm (step-by-step logic), not just "a microprocessor." *Aristocrat Technologies Australia Pty Ltd. v. International Game Technology*, 521 F.3d 1328 (Fed. Cir. 2008).
- Generic "processor" or "computer" does not satisfy corresponding structure — the patentee must disclose the algorithm.

## 2.6 Scope — Equivalents

MPF claims cover the disclosed structure "and equivalents thereof." Equivalents are structures that:
- Perform the same function
- In substantially the same way
- With substantially the same result

This is a narrower form of equivalents than the doctrine of equivalents.

## 2.7 When §112(f) Does NOT Apply

§112(f) does NOT apply if the claim element recites sufficient structure:
- "A processor configured to [specific algorithmic steps]" — if the algorithm is recited, this is structural, not §112(f)
- "A clamp having a hinged jaw and a spring-loaded latch" — structure recited, not §112(f)

## 2.8 Strategic Considerations

- Drafters sometimes AVOID "means for" language to prevent §112(f) narrow claim construction
- Drafters sometimes USE "means for" to obtain broader functional claiming while accepting the scope limitation
- Dependent claims can use different formats to achieve layered protection

## 2.9 Common Exam Traps

- The mere use of "means" or "step" does NOT automatically invoke §112(f) if the claim also recites enough structure to perform the function.
- Nonce words like "module," "mechanism," "element" CAN invoke §112(f) post-Williamson.
- A claim in MPF format without corresponding structure in the spec is INDEFINITE.`,
      importantNote: `§112(f) claim construction is **narrower than it reads**. A claim reciting "means for connecting A to B" reads broadly in English but legally is limited to the specific connecting structure disclosed in the spec plus equivalents. Drafters who want broad claim scope typically avoid MPF format.`,
    },
  ],
  keyTakeaways: [
    '§112(b) definiteness: claims must inform POSITA with REASONABLE CERTAINTY about scope (Nautilus, 2014).',
    'Common indefiniteness issues: relative terms without context, subjective terms, contradictory limitations, improper antecedent basis, trademarks.',
    'Antecedent basis: "a widget" first, "the widget" / "said widget" after. Watch for this nitpick on exams.',
    '§112(f) is an optional claim format using "means for" / "step for" language. Claim is construed to cover disclosed structure + equivalents.',
    'Williamson (2015): nonce terms like "module," "mechanism" CAN trigger §112(f) if they don\'t connote sufficient structure.',
    'For computer-implemented MPF claims, the specification must disclose the ALGORITHM (not just "a processor"). Failure = indefinite.',
    'MPF scope is NARROWER than the plain language suggests — limited to the embodiments in the spec + equivalents.',
    'Multiple dependent claims must be in the ALTERNATIVE, not cumulative. A multiple dependent claim cannot depend on another multiple dependent claim.',
  ],
},

pa_double_patenting: {
  topicId: 'pa_double_patenting',
  title: `Double Patenting and Terminal Disclaimers`,
  domainWeight: 'Patentability · MPEP 804',
  overview: `Double patenting prevents an inventor from obtaining two patents on the same invention or on obvious variants of the same invention. Two types exist: statutory (same invention) and obviousness-type (patentably indistinct variants). Obviousness-type double patenting is overcome by filing a terminal disclaimer under 37 CFR §1.321. This topic is a favorite of exam drafters because it ties together §101, §103, priority claims, and prosecution strategy.`,
  sections: [
    {
      id: 'dp-types',
      title: `1. Two Types of Double Patenting`,
      content: `## 1.1 Statutory (Same Invention) Double Patenting

Based on 35 U.S.C. §101: "whoever invents or discovers any new and useful process..." The word "a" has been interpreted to preclude the same inventor from obtaining more than one patent on the exact same invention.

- Arises when two patents/applications claim the SAME invention (identical claims).
- Cannot be overcome by a terminal disclaimer.
- Rare in practice — typically results from administrative oversight.

## 1.2 Obviousness-Type Double Patenting (ODP)

A judicially created doctrine preventing the same inventor from extending patent term by obtaining a second patent on an obvious variant of a first patent's claims.

- Arises when a later application's claims are patentably indistinct (obvious over) the earlier patent's claims.
- Can be overcome by a **terminal disclaimer** under 37 CFR §1.321(c).
- Very common rejection, especially in continuation/divisional practice.

## 1.3 The Underlying Concern

Double patenting rules prevent:
1. **Term extension**: obtaining multiple patents on slight variants to extend the effective patent life.
2. **Multiple infringement threats**: forcing an accused infringer to defend against multiple identical patents.`,
    },
    {
      id: 'dp-odp-analysis',
      title: `2. Obviousness-Type Double Patenting Analysis`,
      content: `## 2.1 One-Way Test (Default)

For an ODP rejection, the examiner compares the claims of the later application to the claims of the earlier patent (not the specification). The analysis is similar to §103 but uses claims, not prior art:
- Are the later claims an **obvious variant** of the earlier claims?
- If yes, ODP rejection is appropriate.

## 2.2 Two-Way Test (Limited)

Used when the later application's delay is due to the PTO's own actions (not the applicant's fault). The examiner asks whether the later claims are obvious over the earlier claims AND vice versa. This is a narrower test favoring the applicant.

## 2.3 Subject Matter Analysis

ODP examines claim vs. claim, but courts sometimes consider the common specification. The Federal Circuit has gone back and forth on how much the specification can be considered. Modern practice: primarily claim vs. claim with the specifications as context.

## 2.4 Patentably Distinct Inventions

If the applications claim patentably distinct inventions (as a restriction requirement might identify), ODP does not apply. Divisionals filed in response to restriction have special protection under 35 U.S.C. §121 (see §2.6 below).

## 2.5 Common Ownership Requirement

ODP applies when the two applications:
- Have the same inventor, OR
- At least one common inventor, OR
- Are commonly owned/assigned

Applications by truly independent parties don't raise ODP.

## 2.6 §121 Safe Harbor — Divisional Applications

35 U.S.C. §121 provides a "safe harbor": if a divisional application is filed in response to a restriction requirement, the original and divisional cannot be used against each other for ODP. This protection extends to:
- The original application (and its patents)
- The divisional (and its patents)
- "Consonant" continuations of these

Consonance requires that the restriction be maintained — no claim that crosses restricted groups can be added.`,
      importantNote: `**§121 safe harbor** is critical. When the applicant complies with a restriction requirement by filing a divisional, ODP rejections based on the original patent are barred. If the applicant tries to add back claims from the restricted group, the safe harbor is lost. Exam questions love this scenario.`,
    },
    {
      id: 'dp-terminal-disclaimer',
      title: `3. Terminal Disclaimers`,
      content: `## 3.1 What Is a Terminal Disclaimer?

A terminal disclaimer is a formal statement in which the patent owner:
1. Disclaims the portion of the second patent's term that extends beyond the first patent's expiration.
2. Agrees that the second patent will only be enforceable during **common ownership** with the first patent.

Governed by **37 CFR §1.321(c)**.

## 3.2 Requirements

A terminal disclaimer must:
- Identify the conflicting patent
- Be signed by the owner (or a person with authority, e.g., patent attorney)
- Include a common-ownership clause (if overcoming ODP rejection)
- Be filed electronically (preferred) or on paper with correct fee
- Use USPTO Form PTO/SB/26 (for applications) or PTO/SB/25 (for issued patents)

## 3.3 Effect of a Terminal Disclaimer

1. **Aligns expiration**: the second patent expires on the same date as the first.
2. **Common ownership**: the two patents must remain commonly owned for the second to be enforceable.
3. **No PTA gain**: the second patent cannot extend beyond the first patent's term through PTA.
4. **Does NOT affect validity** of the second patent — only its term and enforcement conditions.

## 3.4 Strategic Considerations

- Filing a terminal disclaimer is usually the cheapest and fastest way to overcome ODP rejection.
- Downsides:
  - Lose term extension (PTA stacking)
  - Patents cannot be separated through licensing/sale (common ownership required for enforcement)
- Alternative: argue the claims are patentably distinct (if they are)

## 3.5 Terminal Disclaimer Cannot Overcome

- **Statutory double patenting** (same invention)
- **§102/§103 rejections** over external prior art
- **§101 rejections**
- **§112 rejections**

## 3.6 Recent Developments

### Cellect (Fed. Cir. 2023)
*In re Cellect, LLC*, 81 F.4th 1216 (Fed. Cir. 2023), held that a patent with PTA can still be ODP-invalid over an earlier commonly-owned patent. The extension caused by PTA creates an effective term extension vulnerable to ODP.

### 2024 USPTO Proposed Rule on TD and Unenforceability
USPTO has considered rules tying terminal disclaimers to a promise of joint unenforceability if any claim in either patent is found invalid. These rules remain in flux; check the current state.

## 3.7 Procedural Note

A terminal disclaimer can be filed:
- During prosecution (in response to an ODP rejection)
- After issuance (to retroactively resolve ODP issues discovered later)

When filed after issuance, it requires a separate fee and proper recordation.`,
      examTip: `Memorize the three things a terminal disclaimer DOES: (1) aligns expiration dates, (2) requires common ownership for enforcement, (3) overcomes only ODP (not §§101, 102, 103, 112 rejections). A question asking whether a TD overcomes a §103 rejection is a TRAP — the answer is no.`,
    },
  ],
  keyTakeaways: [
    'Two types of double patenting: statutory (same invention) and obviousness-type (ODP / patentably indistinct variants).',
    'ODP compares CLAIMS to CLAIMS (not claims to specification as prior art). One-way test is default; two-way test used when PTO delay caused the later application.',
    'Terminal disclaimer under 37 CFR §1.321(c) overcomes ODP by (1) aligning expiration dates and (2) requiring common ownership for enforcement.',
    'Terminal disclaimers do NOT overcome statutory double patenting, §101, §102, §103, or §112 rejections.',
    '§121 safe harbor: a divisional filed in response to a restriction cannot be used against the original for ODP — and vice versa. Consonance required.',
    'Cellect (2023): PTA-extended patents are still vulnerable to ODP invalidation over earlier commonly-owned patents.',
    'ODP applies only when the two applications share at least one inventor OR are commonly owned.',
    'Common exam trap: asking whether a terminal disclaimer fixes a §103 rejection. Answer: NO. TDs are ONLY for ODP.',
  ],
},

}; // end PATENT_BAR_COURSE

export function hasPatentBarCourseContent(topicId: string): boolean {
  return topicId in PATENT_BAR_COURSE;
}

export function getPatentBarCourseContent(topicId: string): TopicLesson | null {
  return PATENT_BAR_COURSE[topicId] || null;
}

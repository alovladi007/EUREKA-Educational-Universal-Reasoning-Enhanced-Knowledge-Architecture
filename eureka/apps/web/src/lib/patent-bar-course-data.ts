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

// ═══════════════════════════════════════════════════════════════
// PART 2 — APPLICATION PREPARATION
// MPEP Chapter 600 · 37 CFR 1.52–1.84 · 35 U.S.C. §§ 111, 112, 115
// ═══════════════════════════════════════════════════════════════

pp_specification: {
  topicId: 'pp_specification',
  title: `Specification Requirements — MPEP 608`,
  domainWeight: 'Application Preparation · MPEP 608',
  overview: `The specification is the written description portion of the patent application. It must satisfy both statutory requirements (§112(a) disclosure, §112(b) claim definiteness) and procedural requirements (37 CFR §1.71–§1.75). A properly prepared specification contains a title, cross-references, field of invention, background, summary, brief description of drawings, detailed description, claims, and abstract — arranged in the order set by 37 CFR §1.77. Understanding the required content and sequence of each section is essential for both drafting and answering exam questions about application preparation.`,
  sections: [
    {
      id: 'spec-structure',
      title: `1. Required Specification Structure (37 CFR §1.77)`,
      content: `The USPTO prescribes a specific order for application sections. While not strictly mandatory, applications filed in the correct order are processed more efficiently and avoid formal objections.

## 1.1 The Standard Order (37 CFR §1.77(b))

1. **Title of the invention** (short and specific, 500 characters max per §1.72(a))
2. **Cross-reference to related applications** (if any)
3. **Statement regarding federally sponsored research or development** (if applicable, per Bayh-Dole)
4. **Names of parties to a joint research agreement** (if applicable for AIA §102(c))
5. **Reference to a "Sequence Listing," table, or computer program listing appendix** submitted on compact disc (if applicable)
6. **Statement regarding prior disclosures by inventor or joint inventor** (37 CFR §1.77(b)(6), for AIA applications invoking §102(b)(1) or (b)(2))
7. **Background of the invention**
   - (a) Field of the invention
   - (b) Description of the related art (prior art)
8. **Brief summary of the invention**
9. **Brief description of the several views of the drawing**
10. **Detailed description of the invention**
11. **One or more claims**
12. **Abstract of the disclosure**
13. **Sequence listing** (if applicable)

## 1.2 Title Requirements (37 CFR §1.72(a))

- Short, specific, and technically accurate
- 500 characters maximum
- Cannot contain trademarks, abbreviations (unless universally known), or puffery ("new," "improved")
- Appears on filing receipt, gazette, and front of issued patent

Improper titles: "New Widget" · "Best Ever Device" · "Patent Pending Invention"
Proper titles: "Thermally Actuated Valve Assembly" · "Method of Purifying Recombinant Antibodies"

## 1.3 Abstract Requirements (37 CFR §1.72(b))

- Single paragraph, 150 words maximum
- Starts on a separate sheet (if paper filed) or as a separate section (if electronic)
- Discloses what is NEW about the invention
- Written in narrative form, not list form
- Should not use legal phraseology ("means," "comprising")
- Should be a technical disclosure, not an advertising statement

## 1.4 Paper-Filing Formatting Requirements

If filed on paper (rarely done now, but may appear on exam):
- White, flexible, smooth paper
- 8.5" × 11" (or A4 in some jurisdictions)
- Line spacing: 1.5 or double
- Page margins: at least 1" top, bottom, left; 2/3" right
- Pagination: bottom center, below margin
- One-sided printing only

## 1.5 Electronic Filing

Most applications are filed via EFS-Web or Patent Center. Electronic filing uses:
- DOCX format (preferred since 2024; PDF fallback)
- Specific file-naming conventions
- Digital signatures

Failure to comply with formatting can result in objections (not rejections) requiring correction but not affecting patentability.`,
      examTip: `The numerical order of sections in 37 CFR §1.77(b) is sometimes tested. Memorize the sequence: **title → cross-references → federal research → joint research → sequence listing reference → prior disclosures statement → background → summary → drawings description → detailed description → claims → abstract**. Abstract is last before any sequence listing.`,
    },
    {
      id: 'spec-detailed-description',
      title: `2. Detailed Description Requirements`,
      content: `The detailed description is the heart of the specification. It must satisfy §112(a) for every claim and provide enough support for claim amendments.

## 2.1 What Must Be Disclosed

### Per §112(a):
1. **Written description**: shows possession of the invention (Ariad)
2. **Enablement**: allows POSITA to make and use without undue experimentation (Wands)
3. **Best mode**: the inventor's preferred embodiment

### Practical Content:
- Structure of the invention (parts, components, subsystems)
- Function (how each component operates)
- Methods of making (synthesis, assembly, manufacturing)
- Methods of using (operation, application)
- Alternative embodiments
- Working examples (especially in unpredictable arts)
- Preferred ranges and parameters
- Comparison with prior art (how invention differs)

## 2.2 Drawings Integration

Every numbered element in the drawings must be identified in the detailed description:
- Each reference numeral introduced with a descriptive phrase
- Consistent numbering across drawings
- Cross-reference to multiple figures where applicable

Example: "Turning to FIG. 2, the valve assembly (10) includes a body (12), a stem (14) slidably disposed within body (12), and a biasing spring (16) coupled between stem (14) and cap (18)..."

## 2.3 Use of Examples

Working examples illustrate how to practice the invention:
- Common in chemistry, biology, pharmaceuticals
- Numbered sequentially ("Example 1," "Example 2")
- Provide specific materials, quantities, conditions
- Often labeled as "prophetic" (not actually performed) or "working" (actually performed)

**Prophetic examples** must be written in **present or future tense**, never past tense. A prophetic example written in past tense is a false statement (potential inequitable conduct).

## 2.4 Incorporation by Reference

Material from another document can be incorporated by reference:
- Must be explicit: "[Document] is hereby incorporated by reference in its entirety"
- Identify the document specifically
- **Essential material** cannot be incorporated from a non-essential source — essential material must be reproduced or incorporated from US patents/published applications (37 CFR §1.57(d))
- **Non-essential material** can be incorporated from any publication

## 2.5 Use of Claim Terms

The detailed description must support every term used in the claims. If a claim uses "about 50%," the spec should describe what "about" means. If a claim uses a term of art, the spec should use it consistently.

## 2.6 Section Headings (Optional but Recommended)

Common headings:
- Field of the Invention
- Background
- Brief Summary
- Brief Description of the Drawings
- Detailed Description
- Examples
- Claims

Headings help the reader navigate and the examiner search the disclosure.`,
    },
    {
      id: 'spec-sequence-listings',
      title: `3. Sequence Listings (Biological Sequences)`,
      content: `If the application discloses nucleotide or amino acid sequences, special rules apply for sequence listings (37 CFR §1.831–§1.835 under the new ST.26 standard).

## 3.1 When a Sequence Listing Is Required

Required for sequences:
- Nucleotide sequences of 10 or more bases
- Amino acid sequences of 4 or more residues

All qualifying sequences must be included in a sequence listing, numbered sequentially as SEQ ID NOs.

## 3.2 WIPO ST.26 Standard (Effective July 1, 2022)

The USPTO adopted WIPO Standard ST.26 on July 1, 2022, replacing the older ST.25 standard. ST.26 requires:
- XML format (not text)
- Specific element structure per ST.26 schema
- File extension: .xml

Applications filed BEFORE July 1, 2022, may still use ST.25 format.

## 3.3 Filing Requirements

- ST.26 XML file submitted via Patent Center or EFS-Web
- Referenced in the specification: "The Sequence Listing filed herewith forms part of the specification..."
- Statement of no new matter: the sequences in the listing must match the disclosure; any discrepancy is new matter

## 3.4 Use of SEQ ID NO Throughout

Sequences disclosed in the specification, drawings, or claims must refer to their sequence listing entry by SEQ ID NO.

Example: "The protein comprises the amino acid sequence of SEQ ID NO: 12..."

## 3.5 Sequence Data in Specification

Short sequences (below the threshold) may appear directly in the specification. Longer sequences must be in the listing, but the spec can cite them by SEQ ID NO.`,
    },
  ],
  keyTakeaways: [
    'Specification order per 37 CFR §1.77(b): title, cross-ref, fed research, joint research, sequence listing ref, prior disclosure statement, background, summary, drawings description, detailed description, claims, abstract.',
    'Title: 500 chars max, technically specific, no puffery or trademarks.',
    'Abstract: single paragraph, 150 words max, on separate sheet, no legal phraseology.',
    'Every drawing reference numeral must be identified in the detailed description with descriptive text.',
    'Prophetic examples must be in PRESENT/FUTURE tense, never past tense. Past tense = false statement = potential inequitable conduct.',
    'Incorporation by reference: essential material must come from US patents/published applications; non-essential from any publication (37 CFR §1.57).',
    'Sequence listings: required for nucleotide sequences ≥10 bases or amino acid sequences ≥4 residues. WIPO ST.26 XML format since July 1, 2022.',
    'All specification content measured as of effective filing date. Post-filing additions = new matter (§132 violation).',
  ],
},

pp_claim_drafting: {
  topicId: 'pp_claim_drafting',
  title: `Claim Drafting — Format, Types, and Rules`,
  domainWeight: 'Application Preparation · MPEP 608.01(m)–608.01(n), 2173',
  overview: `Claims define the legal scope of the patent. They must be drafted with precision to balance breadth (covering commercial variants) against invalidity risk (over-broad claims fail §§102, 103, 112). The exam tests specific claim formats (Jepson, Markush, means-plus-function), multiple dependent claim rules, transitional phrases, and the technical requirements of 37 CFR §1.75. Claim drafting rules are heavily tested because they appear in virtually every prosecution scenario.`,
  sections: [
    {
      id: 'claim-format',
      title: `1. Basic Claim Format Requirements (37 CFR §1.75)`,
      content: `## 1.1 The Claim Structure

A claim has three parts:
1. **Preamble** — describes what the invention is (name, category)
2. **Transitional phrase** — links preamble to body (comprising / consisting of / consisting essentially of)
3. **Body** — recites the elements/limitations of the invention

**Example claim structure:**
"A widget [preamble], comprising [transitional]: a first component; a second component connected to the first component; and a third component [body]."

## 1.2 One-Sentence Rule

Each claim must be a **single sentence** (37 CFR §1.75(i)). Use semicolons to separate clauses but no periods within the claim. The sentence begins with a capitalized word and ends with a period.

## 1.3 Numbering and Dependency

- Claims are numbered sequentially with Arabic numerals (1, 2, 3...) from the beginning of the claim section.
- Independent claims can appear anywhere in the sequence but are typically listed first.
- Dependent claims reference earlier claims by number: "The widget of claim 1, wherein..."
- No numbering gaps allowed on the face of a patent.

## 1.4 Transitional Phrases

The transitional phrase determines whether the claim is **open** or **closed**:

| Phrase | Meaning | Scope |
|---|---|---|
| **"Comprising"** | Open — includes the listed elements + any unlisted ones | Broad |
| **"Consisting of"** | Closed — ONLY the listed elements | Narrow |
| **"Consisting essentially of"** | Semi-closed — listed elements + anything that doesn't materially affect basic/novel characteristics | Intermediate |
| **"Including"** | Usually open (like "comprising") | Broad |
| **"Having"** | Context-dependent | Intermediate |

"Comprising" is the most common and most favorable for the patentee. "Consisting of" is narrow but useful to overcome prior art.

## 1.5 Preamble Considerations

- Preamble limitations: whether preamble language limits the claim depends on whether it gives "life, meaning, and vitality" to the claim (*Bell Communications Research, Inc. v. Vitalink Communications Corp.*, 55 F.3d 615 (Fed. Cir. 1995)).
- "A method for X" — preamble purpose often limiting
- Preamble as antecedent basis for body elements — limiting

## 1.6 Dependent Claims

A dependent claim must:
- Reference the claim(s) it depends from
- **Further limit** the referenced claim (not broaden)
- Incorporate all limitations of the referenced claim

Example:
- Claim 1: "A widget comprising A, B, and C."
- Claim 2: "The widget of claim 1, further comprising D." → valid dependent
- Claim 3: "The widget of claim 1, wherein A is replaced by E." → INVALID (broadens, doesn't further limit)

## 1.7 Multiple Dependent Claims (37 CFR §1.75(c))

A multiple dependent claim references multiple other claims in the ALTERNATIVE:
- Correct: "The widget of any one of claims 1-5, wherein..."
- Correct: "The widget of claim 1 or claim 2, wherein..."
- **Incorrect**: "The widget of claims 1 and 2, wherein..." (cumulative)
- **Incorrect**: Multiple dependent claim cannot depend on another multiple dependent claim

Multiple dependent claims count as multiple claims for fee purposes (each referenced claim = one claim).`,
      examTip: `The difference between "comprising," "consisting of," and "consisting essentially of" is tested repeatedly. **Comprising = open** (includes listed + more). **Consisting of = closed** (only listed). **Consisting essentially of = semi-closed** (listed + immaterial additions). If a question describes a composition with extra ingredients not mentioned in the claim, "consisting of" fails but "comprising" passes.`,
    },
    {
      id: 'claim-types',
      title: `2. Types of Claims`,
      content: `## 2.1 Apparatus / Product Claims

Claim the thing itself (machine, manufacture, composition).
- "A widget comprising..." (apparatus)
- "A pharmaceutical composition comprising..." (composition)
- "An article of manufacture having..." (manufacture)

## 2.2 Method / Process Claims

Claim a series of steps.
- "A method of doing X, comprising the steps of: (a)..., (b)..., (c)..."
- Steps should be in a clear sequence if order matters
- Active verbs (forming, heating, applying) preferred

## 2.3 Means-Plus-Function Claims (§112(f))

Covered in depth under Part 1. Uses "means for [function]" format. Construed to cover disclosed structure + equivalents. Narrower than it reads.

## 2.4 Jepson Claims

A Jepson claim admits what is old and claims what is new:
- "In a widget having a frame and a wheel, the improvement comprising [new features]."
- The preamble admits the old elements as prior art
- The transition "wherein the improvement comprises" marks the inventive part

Useful for:
- Improvement inventions
- Situations where the old art is extensive
- Claims following a restriction requirement

Risk: Jepson preamble may be treated as an admission of prior art.

## 2.5 Markush Claims

A Markush claim uses a closed group:
- "A compound selected from the group consisting of A, B, C, and D."
- Treated as disclosing each listed member as alternatives
- Named after *Ex parte Markush*, 1925 Dec. Comm'r Pat. 126

Rules:
- Must use "selected from the group consisting of" (closed language)
- Members should share a common use or property
- Improper Markush: disparate members not sharing a common characteristic

## 2.6 Product-by-Process Claims

Claim a product by reference to the process that made it:
- "A product made by the process of: [step 1], [step 2]..."
- Useful when the product is difficult to describe structurally
- The product is limited by the PROCESS steps (even though claiming the product) per *Abbott Laboratories v. Sandoz, Inc.*, 566 F.3d 1282 (Fed. Cir. 2009)

Caution: product-by-process claims are patentable only if the product itself is novel and nonobvious — the process doesn't save an old product.

## 2.7 Claims for Software / Computer-Implemented Inventions

Common formats:
- **Method claims**: "A method comprising: receiving X; processing Y; outputting Z."
- **System claims**: "A system comprising: a processor configured to [algorithm]; a memory..."
- **Computer-readable medium (CRM) claims**: "A non-transitory computer-readable medium storing instructions that, when executed, cause [result]."

CRM claims MUST recite "non-transitory" — otherwise they fail §101 as transitory signals (*In re Nuijten*).

## 2.8 Beauregard Claims

A specific type of CRM claim named after *In re Beauregard*, 53 F.3d 1583 (Fed. Cir. 1995). Always use "non-transitory" computer-readable medium.

## 2.9 Use Claims

"A use of compound X for treating Y." Common in Europe but generally NOT allowed as method claims in the US. US practice rephrases: "A method of treating Y comprising administering compound X."`,
    },
    {
      id: 'claim-special-rules',
      title: `3. Special Claim Rules`,
      content: `## 3.1 Claim Fees (37 CFR §1.16)

Filing fees depend on claim count:
- First **20 total claims** — included in basic filing fee
- Each additional claim above 20 — excess claim fee
- First **3 independent claims** — included
- Each additional independent claim above 3 — excess independent fee
- Multiple dependent claims — each referenced claim counts separately
- Small/micro entity discounts reduce these fees

## 3.2 Claims Must Be in English (or Translated)

Claims must be in English. Foreign-language applications must include an English translation of the claims for fee calculation and examination (37 CFR §1.52(d)).

## 3.3 Claim Numbering After Amendment

When claims are canceled during prosecution:
- Remaining claims keep their original numbers
- New claims added get new numbers (canceled numbers are NOT reused)
- Final issued patent may have numbering gaps — but the USPTO renumbers at issue

## 3.4 Narrowing Amendments and Estoppel

Narrowing a claim during prosecution may create **prosecution history estoppel** — limiting the doctrine of equivalents. *Festo Corp. v. Shoketsu Kinzoku Kogyo Kabushiki Co.*, 535 U.S. 722 (2002).

Relevant to later infringement litigation, not examination.

## 3.5 Common Claim Drafting Errors

| Error | Problem |
|---|---|
| Missing antecedent basis | "The widget" before "a widget" is introduced |
| Multiple dependent depending on multiple dependent | Violates 37 CFR §1.75(c) |
| Dependent claim broader than independent | Invalid (must further limit) |
| Using "about" without context | Potential indefiniteness (Nautilus) |
| Omitting "non-transitory" from CRM claim | §101 rejection for transitory signals |
| Mixing statutory categories in single claim | "A method and apparatus" — improper |
| Claiming after-arising technology | §112 written description / enablement problem |

## 3.6 Proper Claim Language Checklist

- [ ] Single sentence per claim
- [ ] Proper antecedent basis for every noun
- [ ] Consistent terminology (don't use "widget" and "device" interchangeably)
- [ ] Precise transitional phrase (comprising/consisting of/consisting essentially of)
- [ ] Claim maps to the specification (every term supported)
- [ ] Dependent claims further limit (not broaden)
- [ ] Multiple dependent claims in alternative form
- [ ] CRM claims specify "non-transitory"
- [ ] Proper numbering (sequential Arabic numerals)`,
      importantNote: `A common exam trick: presenting a dependent claim that appears to add a limitation but actually broadens (e.g., "The widget of claim 1, wherein A may be replaced by B"). A dependent claim must ONLY further limit — a claim that introduces an alternative without narrowing is invalid.`,
    },
  ],
  keyTakeaways: [
    'Claim structure: preamble + transitional phrase + body. Must be a single sentence (37 CFR §1.75(i)).',
    'Transitional phrases: comprising (OPEN), consisting of (CLOSED), consisting essentially of (SEMI-CLOSED).',
    'Multiple dependent claims must be in ALTERNATIVE ("any one of claims 1-5"), not cumulative ("claims 1 and 2"). Cannot depend on another multiple dependent claim.',
    'Dependent claims must FURTHER LIMIT, not broaden. Each dependent claim incorporates all limitations of the parent.',
    'Jepson format: "In [known apparatus], the improvement comprising [new]." Preamble may be treated as admitted prior art.',
    'Markush: "selected from the group consisting of A, B, C." Members should share a common property or use.',
    'Product-by-process claims: product is limited by the process (Abbott Labs, 2009). Product must itself be novel/nonobvious.',
    'CRM (Beauregard) claims MUST recite "non-transitory" to avoid §101 rejection for transitory signals (Nuijten).',
  ],
},

pp_drawings: {
  topicId: 'pp_drawings',
  title: `Drawing Requirements — 37 CFR §1.81–§1.84`,
  domainWeight: 'Application Preparation · MPEP 608.02',
  overview: `Drawings are required whenever needed to understand the invention (35 U.S.C. §113). They must comply with specific formatting rules under 37 CFR §1.84 governing sheet size, margins, numbering, line quality, and views. Drawings are often where applications receive non-substantive objections (not rejections) — simple to fix but commonly tested on the exam.`,
  sections: [
    {
      id: 'drawings-when-required',
      title: `1. When Are Drawings Required?`,
      content: `## 1.1 Statutory Standard (35 U.S.C. §113)

The applicant must furnish a drawing **when necessary for the understanding of the subject matter sought to be patented**. If no drawing is necessary, none is required.

## 1.2 Categories Typically Requiring Drawings

- **Mechanical inventions**: nearly always require drawings
- **Electrical circuits**: schematic drawings
- **Chemical apparatus**: often required
- **Methods**: flowcharts if steps are complex
- **Software**: system diagrams, flowcharts, or data-flow diagrams

## 1.3 Inventions That May Not Need Drawings

- **Compositions of matter**: a chemical compound claimed by structural formula may not need a drawing (the formula itself may suffice in the spec)
- **Pure method claims without apparatus**: if the method is simple and clearly described in text, no drawing may be needed
- **Plant patents**: require a drawing or photograph showing the plant's characteristics

## 1.4 Missing Drawings — Filing Date Impact

If a drawing is required and was not filed, the application is incomplete:
- **Pre-AIA filing date**: no filing date until drawings are submitted
- **Post-AIA (December 18, 2013+)**: filing date can be preserved if description enables POSITA to make/use; missing drawings can be added later, but added drawings MUST NOT introduce new matter (per *Hyatt v. Dudas*, 492 F.3d 1365 (Fed. Cir. 2007))

## 1.5 Color Drawings and Photographs

- Black-and-white line drawings are the default
- Color drawings allowed only if granted a petition under 37 CFR §1.84(a)(2) with fee
- Photographs allowed if necessary (e.g., histology, microstructure)
- Color photographs require petition + fee

## 1.6 Electronic Filing

Most drawings are filed electronically in PDF or DOCX. The drawings must be scalable and legible at actual size.`,
    },
    {
      id: 'drawings-format',
      title: `2. Drawing Format Requirements (37 CFR §1.84)`,
      content: `## 2.1 Sheet Size

Two sizes permitted:
- **US Letter**: 8.5" × 11" (preferred in US)
- **A4**: 21 cm × 29.7 cm (international)

All drawings in a single application must use the same size.

## 2.2 Margins

- **Top**: 2.5 cm (1")
- **Left**: 2.5 cm (1")
- **Right**: 1.5 cm (5/8")
- **Bottom**: 1.0 cm (3/8")

Drawings must fit within these margins — no text or illustration may extend into the margin.

## 2.3 Sheet Numbering (37 CFR §1.84(t))

Sheets numbered consecutively using Arabic numerals:
- Format: "current sheet number" / "total sheets" (e.g., "2/5")
- Placed at the top center or top corner
- Not inside the drawing area

## 2.4 View Numbering

Each figure/view is numbered with Arabic numerals:
- "FIG. 1," "FIG. 2," "FIG. 3A," "FIG. 3B"
- Letters allow multiple related views (e.g., FIG. 3A and 3B)

## 2.5 Reference Numerals

Every element shown has a reference numeral:
- Arabic numerals used consistently across all figures
- Same element = same numeral in every figure
- Numerals should be at least 0.32 cm (1/8") in height
- Lead lines connect numerals to the elements they identify
- Cannot cross or overlap

Every reference numeral in the drawings must be mentioned in the specification, and every numeral mentioned in the specification must appear in the drawings (MPEP §608.01(g)).

## 2.6 Line Quality

- Solid black lines
- No gray scale (unless granted petition)
- No shading that obscures details
- Hatching/cross-hatching only where necessary and per standard conventions

## 2.7 Lettering and Graphic Content

- Lettering at least 0.32 cm (1/8") high
- Latin letters (with standard foreign characters OK)
- Chemical and mathematical formulas allowed
- Cross-referencing symbols must match the specification

## 2.8 Flowcharts and Block Diagrams

Flowcharts for methods must:
- Use standard flowchart symbols (rectangles for steps, diamonds for decisions)
- Contain text describing each step
- Have directional arrows showing flow

Block diagrams for systems:
- Rectangular blocks representing components
- Labeled with component names
- Connected by lines showing relationships

## 2.9 Prohibited Content

- Trademarks (except where they identify the invention or prior art)
- Puffery ("best," "new")
- Unnecessary text (drawings should be primarily graphical)
- Frames or borders (internal frames around elements are allowed for clarity)`,
      examTip: `The USPTO drawing rules are **very specific**. Common test points: sheet numbering format (X/Y at top), reference numeral consistency (same element = same number across figures), lettering height (at least 1/8"), margins (1" top/left, 5/8" right, 3/8" bottom). If a question describes a drawing flaw, identify which 37 CFR §1.84 requirement is violated.`,
    },
    {
      id: 'drawings-corrections',
      title: `3. Drawing Corrections and Amendments`,
      content: `## 3.1 Replacement Drawings

Corrections to drawings are submitted as **replacement sheets**:
- Each sheet that contains changed drawings is replaced in full
- Identified as "Replacement Sheet" at the top
- Changed views marked with "REPLACEMENT SHEET" annotation
- Filed with a transmittal letter explaining the changes

## 3.2 Annotated Drawings

Changes to drawings may be shown via annotated drawings:
- Red lines (or other color) showing changes
- "ANNOTATED SHEET" designation
- Optional but encouraged to help examiner understand amendments

## 3.3 New Matter Prohibited

Drawings cannot introduce new matter after filing:
- Adding a new reference numeral not originally disclosed → new matter
- Adding a new view depicting an element not described in original spec → new matter
- Minor cosmetic corrections (line quality, typography) → not new matter

If new matter is identified, the examiner objects; applicant must remove the new matter.

## 3.4 Formal Drawings vs. Informal Drawings

- **Formal drawings**: comply with all 37 CFR §1.84 requirements; required for issuance
- **Informal drawings**: may be accepted at filing, but formal drawings must be submitted before issue
- Rough sketches, photocopies, and computer printouts of informal drawings may be accepted to establish filing date

The Notice of Allowance often notes whether formal drawings are required before issue.

## 3.5 Three-Dimensional Views

- Perspective views allowed and often required for 3D inventions
- Exploded views acceptable (components shown separated with indication of relationships)
- Cross-sectional views marked with hatching showing the section line in the full view
- Phantom lines (dashed) for hidden or movable elements`,
    },
  ],
  keyTakeaways: [
    'Drawings required when necessary to understand the invention (35 U.S.C. §113). Compositions and simple methods may not need them.',
    'Sheet sizes: US Letter (8.5x11") or A4 (21x29.7cm). Must be consistent across the application.',
    'Margins: 1" top/left, 5/8" right, 3/8" bottom. Drawings must fit within margins.',
    'Sheet numbering: Arabic numerals in X/Y format (e.g., "2/5"), at top, outside drawing area.',
    'Every reference numeral in drawings must appear in the spec, and vice versa.',
    'Reference numerals at least 1/8" (0.32 cm) high. Solid black lines. No gray scale unless petitioned.',
    'Color drawings and photographs require petition and fee (37 CFR §1.84(a)(2)).',
    'New drawings cannot introduce new matter — the application is frozen as of the effective filing date.',
  ],
},

pp_oath_declaration: {
  topicId: 'pp_oath_declaration',
  title: `Oath and Declaration — 37 CFR §1.63`,
  domainWeight: 'Application Preparation · MPEP 602',
  overview: `Every patent application must be supported by an oath or declaration from each inventor affirming that they believe themselves to be the original inventor and acknowledging the duty of disclosure. The AIA significantly simplified the oath/declaration regime, eliminating many traditional requirements. Substitute statements allow applications to proceed when an inventor is deceased, legally incapacitated, cannot be found, or refuses to sign. Understanding when an assignee can act in place of an inventor is a frequent exam topic.`,
  sections: [
    {
      id: 'oath-requirements',
      title: `1. Oath/Declaration Requirements (37 CFR §1.63)`,
      content: `## 1.1 The Basic Statement

Each inventor must make an oath or declaration stating:
1. The application was made or authorized to be made by the declarant
2. The declarant believes the named inventor(s) to be the original inventor(s)
3. Acknowledgment of the duty to disclose information material to patentability (37 CFR §1.56)
4. Acknowledgment that willful false statements are punishable under 18 U.S.C. §1001

The declaration must be signed by **each inventor** unless a substitute statement applies.

## 1.2 What the Oath/Declaration Does NOT Require (Post-AIA)

Pre-AIA oaths required additional statements:
- ~~Country of citizenship~~ (removed)
- ~~That applicant has reviewed and understands the specification~~ (removed, though good practice)
- ~~That applicant does not know/believe the invention was ever known~~ (removed)

## 1.3 Form

- USPTO Form PTO/AIA/01 (oath by inventor)
- USPTO Form PTO/AIA/02 (declaration by inventor)
- Must be executed by the inventor(s)
- Can be signed on paper, scanned, and filed, or signed digitally

## 1.4 Timing

- Can be filed with the application at initial filing
- Can be filed later but MUST be filed before payment of the issue fee
- If not filed by then, the application cannot issue

## 1.5 Combined with Assignment

An "assignment with declaration" is a combined document where the inventor both declares inventorship and assigns rights to an entity. This is a common and efficient practice.

## 1.6 One Declaration for Multiple Applications

A single declaration can cover:
- A parent application and its continuations (if the declaration references the parent)
- Divisionals (if the declaration is proper for the divisional)
- CIPs only if the declaration covers all inventive entities across CIP and parent`,
    },
    {
      id: 'substitute-statement',
      title: `2. Substitute Statements (37 CFR §1.64)`,
      content: `When an inventor cannot sign, a substitute statement can be filed by the applicant (assignee or person to whom the inventor is obligated to assign).

## 2.1 When Substitute Statement Is Available

An inventor's oath/declaration may be replaced by a substitute statement if the inventor:
- **Is deceased**
- **Is legally incapacitated**
- **Cannot be found or reached after diligent effort**
- **Refuses to sign** the oath/declaration

## 2.2 Who Can Sign a Substitute Statement

- **Joint inventor** (if the non-signing inventor is deceased, incapacitated, or cannot be found)
- **Legal representative** (of deceased or incapacitated inventor)
- **Assignee or obligated assignee** (the entity to which the inventor is obligated to assign)

## 2.3 Required Content (37 CFR §1.64)

The substitute statement must:
- Identify the inventor in whose place it is executed
- State the relationship of the signer to the inventor
- State the circumstances that warrant the substitute (which of the four reasons above)
- Include the same statements as the inventor oath (belief in inventorship, duty of disclosure)
- Be signed by the substitute signer

## 2.4 Refusal to Sign

If an inventor refuses to sign, the applicant (typically the assignee or employer) can:
1. File a substitute statement with evidence of the inventor's refusal (email correspondence, memorandum, etc.)
2. Provide last known contact information for the inventor
3. Explain efforts made to obtain the inventor's signature

The inventor must still be named as the inventor — the substitute statement does not remove inventorship, only the signature requirement.

## 2.5 Practical Context

Substitute statements are common when:
- An inventor has left a company on bad terms
- An inventor has died during prosecution
- An inventor is a contractor who is no longer reachable
- An inventor is in a foreign country and non-responsive

## 2.6 Correction of Inventorship

The correction of inventorship is covered by **37 CFR §1.48**:
- File a request for correction
- Provide supporting statement
- Pay a fee
- Executed before issuance (different rules apply after issue — §1.324 for issued patents)

Correction of inventorship is different from substitute statements: correction changes WHO is named; substitute statement handles missing signatures.`,
      importantNote: `A **substitute statement** does NOT remove an inventor from the patent. The inventor is still named as the inventor; the substitute statement only handles the signature requirement. If an inventor was wrongly named, the remedy is **correction of inventorship** under 37 CFR §1.48, not a substitute statement.`,
    },
    {
      id: 'applicant-vs-inventor',
      title: `3. Applicant vs. Inventor (Post-AIA)`,
      content: `The AIA changed who can be the "applicant" for a patent. This is a significant shift from the pre-AIA regime.

## 3.1 Pre-AIA: Inventor-Only Applicant

Under pre-AIA, only inventors could be applicants. An assignee was the "applicant of record" but filings had to name the inventors.

## 3.2 AIA: Expanded Applicants (37 CFR §1.46)

Under AIA, the applicant can be:
- **The inventor(s)**
- **The legal representative** (of deceased/incapacitated inventor)
- **The assignee** (if the inventor has assigned the application)
- **An obligated assignee** (someone with an obligation to receive assignment from the inventor)
- **Anyone who shows sufficient proprietary interest**

## 3.3 How Assignee Becomes Applicant

To file as an assignee-applicant:
- Include Form PTO/AIA/96 (Statement Under 37 CFR §1.46) with the filing
- Record the assignment (or obligation) at the Assignment Recordation Branch
- Identify both the applicant (assignee) and the inventors on the Application Data Sheet

## 3.4 Benefits of Assignee as Applicant

- Assignee has direct communication with USPTO (no need to go through inventors)
- Assignee can respond to office actions without inventor signatures
- Assignee can make amendments, argue for allowance, accept the patent
- Reduces delays when inventors are unavailable

## 3.5 The Inventor Still Matters

Even with an assignee-applicant, inventors must still:
- Be correctly named on the application
- Sign oath/declaration OR a substitute statement must be filed
- Sign assignments of their rights (or the rights flow from employment agreement)

## 3.6 Common Practice

Large corporations typically file as assignee-applicants, having inventors execute both:
1. An oath/declaration (Form PTO/AIA/01 or /02)
2. An assignment transferring patent rights to the company

Smaller inventors typically file as inventor-applicants.`,
    },
  ],
  keyTakeaways: [
    'Every inventor must execute an oath/declaration (or have a substitute statement filed on their behalf).',
    'Oath/declaration must: (1) state the application was authorized, (2) affirm inventorship belief, (3) acknowledge duty of disclosure (§1.56), (4) acknowledge false-statement liability.',
    'Post-AIA oath/declaration simplified — no country of citizenship, no statement of reviewing specification, no knowledge statements.',
    'Substitute statement (37 CFR §1.64) available when inventor is deceased, legally incapacitated, cannot be found, or refuses to sign.',
    'Substitute statements DO NOT remove the inventor from the patent — only replace the signature requirement.',
    'Post-AIA applicant can be the inventor OR the assignee OR obligated assignee (37 CFR §1.46), using Form PTO/AIA/96.',
    'Correction of inventorship (changing who is named) uses 37 CFR §1.48 pre-issuance, §1.324 post-issuance. Different from substitute statements.',
    'Oath/declaration can be filed later but MUST be on file before issue fee payment or the patent cannot issue.',
  ],
},

pp_ids: {
  topicId: 'pp_ids',
  title: `Information Disclosure Statements (IDS) — 37 CFR §1.97–§1.98`,
  domainWeight: 'Application Preparation · MPEP 609',
  overview: `Information Disclosure Statements (IDSs) are the formal means by which applicants fulfill their duty of disclosure under 37 CFR §1.56. An IDS must list all material prior art known to the applicant and include copies of non-US references. The timing requirements are strict: IDSs filed late require fees or a certification, and IDSs filed after final rejection may not be considered. Understanding the three-tier timing system is a critical exam topic.`,
  sections: [
    {
      id: 'ids-duty-of-disclosure',
      title: `1. Duty of Disclosure (37 CFR §1.56)`,
      content: `## 1.1 Who Owes the Duty

The duty of disclosure is owed by:
- Each named inventor
- Each attorney or agent who prepares or prosecutes the application
- Every other person substantively involved in the preparation or prosecution

## 1.2 What Must Be Disclosed

**Material information** — information that is not cumulative to information already of record and:
- **Rule 56(b)(1)** establishes a prima facie case of unpatentability, OR
- **Rule 56(b)(2)** refutes or is inconsistent with a position taken by the applicant.

This is the "material to patentability" standard.

## 1.3 No Duty to Search

There is NO obligation to conduct a prior art search. The duty extends only to information actually known by the individuals subject to the duty. If an inventor knows a reference exists, it must be disclosed. If the inventor doesn't know about it, no duty.

## 1.4 Duration

The duty continues throughout prosecution — from filing through issuance. New material information discovered after filing must be disclosed promptly.

## 1.5 Consequences of Breach

Failure to disclose material information with intent to deceive the USPTO is **inequitable conduct**, a doctrine that can render the entire patent unenforceable. *Therasense, Inc. v. Becton, Dickinson & Co.*, 649 F.3d 1276 (Fed. Cir. 2011) (en banc) — requires both materiality (but-for) and specific intent to deceive.

Therasense raised the bar: mere negligence or gross negligence is insufficient. Specific intent to deceive must be the single most reasonable inference from the evidence.`,
    },
    {
      id: 'ids-requirements',
      title: `2. IDS Content and Format (37 CFR §1.98)`,
      content: `## 2.1 Required Content

An IDS must include:
1. **List of references** (citation format on USPTO Form PTO/SB/08 or equivalent)
2. **Copies of non-US patent documents and non-patent literature**
3. **Concise statement of relevance** for non-English references (or English translation)

## 2.2 What References To Include

- US patents (by number; copies not required)
- US published applications (by publication number; copies not required)
- Foreign patent documents (copies required)
- Non-patent literature: journal articles, textbook excerpts, conference papers (copies required)
- Oral or written prior art the applicant has been informed of
- Court pleadings and decisions related to related applications or same subject matter

## 2.3 Format — Form PTO/SB/08

The standard IDS form lists:
- Patent/publication number
- Country code
- Kind code
- Issue/publication date
- Inventor name or patentee
- Relevant pages or claims (optional)

Each reference gets one line.

## 2.4 Copies of References

- **US patents and US published applications**: No copies required; the USPTO has access
- **Foreign patents and applications**: Copies required in full
- **Non-patent literature (NPL)**: Copies required; may be full article or relevant portions
- **Concise statement of relevance**: Required for non-English references; recommended for any non-obvious relevance

## 2.5 Cumulative References

If a reference is merely cumulative to a previously cited reference, it may be omitted per the materiality standard. However, the safer practice is to cite everything known.

## 2.6 Publication Dates

Each reference should have its publication date. For non-patent literature, the date of public availability is the relevant date.

## 2.7 Electronic Filing

IDSs are filed electronically via Patent Center or EFS-Web. The form is typically submitted as a PDF, and referenced documents are uploaded as separate files.`,
    },
    {
      id: 'ids-timing',
      title: `3. IDS Timing Rules (37 CFR §1.97)`,
      content: `The timing of IDS filing dictates whether the IDS is considered and what is required. This three-tier system is one of the most commonly tested aspects of Patent Bar prosecution.

## 3.1 Tier 1 — Early Filing (No Fee, No Statement)

The IDS is timely WITHOUT a fee or statement if filed:
- Within 3 months of the U.S. filing date, OR
- Within 3 months of the date of entry into the national stage (for PCT applications), OR
- Before the first Office action on the merits

Whichever is later. This is the most common timing.

## 3.2 Tier 2 — Middle Filing (Fee OR Statement)

The IDS requires **either** the fee OR a statement if filed:
- After the first Office action on the merits, AND
- Before mailing of: (a) a Final Office Action, (b) a Notice of Allowance, OR (c) an action that closes prosecution

Required:
- **Fee**: 37 CFR §1.17(p) — about $260 ($130 for small entity, $65 for micro entity)
- **Statement** (37 CFR §1.97(e)): certifying that each reference was first cited in a foreign office action not more than 3 months before filing the IDS, OR that no individual with a duty of disclosure knew of the references more than 3 months before filing the IDS

Either the fee OR the statement suffices; both are not required.

## 3.3 Tier 3 — Late Filing (Fee AND Statement)

After final office action or notice of allowance, the IDS requires **both** the fee AND the statement. The statement must be the same §1.97(e) certification as Tier 2.

## 3.4 Tier 4 — After Issue Fee Payment

Once the issue fee is paid, an IDS generally cannot be considered. Options:
- **Withdraw the application from issue** under 37 CFR §1.313 (pay fees, submit new response)
- **File a Request for Continued Examination (RCE)**
- **File a continuation application**

## 3.5 Statement of Non-Knowledge (§1.97(e))

Two alternative certifications:

### (e)(1) — Foreign Office Action Certification
No item in the IDS was cited in a foreign office action dated more than 3 months prior to the filing of the IDS.

### (e)(2) — No Knowledge Certification
No item in the IDS was known to any individual with a duty of disclosure more than 3 months prior to the filing of the IDS.

The certification is a statement that the applicant did NOT know of the references earlier (or recently received them from a foreign office). It is a factual certification — false statements can lead to inequitable conduct.

## 3.6 Timing Trap on Exams

A common exam pattern: "The applicant received a foreign search report today listing a reference. How can the IDS be filed?"

If the search report is fresh (within 3 months), the applicant can use §1.97(e)(1) certification → fee OR statement suffices (Tier 2 or Tier 3 depending on stage).

## 3.7 Refile to Get Consideration

If an IDS is not considered because it's too late, the applicant can file an RCE to get it considered. RCE reopens prosecution and re-sets the IDS timing clock.`,
      examTip: `Memorize the **three-tier IDS timing**: (1) **Tier 1** — within 3 months of filing OR before first OA → no fee, no statement. (2) **Tier 2** — after first OA but before final/NOA → fee OR statement. (3) **Tier 3** — after final/NOA → fee AND statement. The certification in §1.97(e) is the key to Tiers 2 and 3.`,
    },
  ],
  keyTakeaways: [
    'Duty of disclosure (37 CFR §1.56) is owed by inventors, practitioners, and others substantively involved. No duty to search, only to disclose known material info.',
    'Material = not cumulative AND either (a) establishes prima facie unpatentability or (b) refutes a position the applicant has taken.',
    'Therasense (2011): inequitable conduct requires BUT-FOR materiality AND specific intent to deceive — specific intent must be the single most reasonable inference.',
    'IDS tier 1 (before first OA or within 3 months of filing): no fee, no statement.',
    'IDS tier 2 (after first OA, before final/NOA): requires fee OR statement (not both).',
    'IDS tier 3 (after final/NOA): requires fee AND statement.',
    'Statement under 37 CFR §1.97(e): either (e)(1) foreign OA within 3 months, or (e)(2) no knowledge more than 3 months prior.',
    'After issue fee payment, IDS is not considered — must withdraw from issue, RCE, or file continuation to get new references in.',
  ],
},

pp_inventorship: {
  topicId: 'pp_inventorship',
  title: `Inventorship — 35 U.S.C. §115, 37 CFR §1.48`,
  domainWeight: 'Application Preparation · MPEP 2137.01',
  overview: `Inventorship is a matter of federal patent law. An inventor is the person who conceived of the claimed invention — not the person who merely reduced it to practice, provided funding, or supervised the research. Incorrect inventorship can invalidate a patent unless corrected. The AIA simplified the test for joint inventorship and allowed corrections without requiring proof of non-deceptive intent. Inventorship questions are heavily tested, especially where fact patterns involve research teams, contributions of different scopes, and AI-assisted inventions (the 2024 USPTO guidance).`,
  sections: [
    {
      id: 'inventorship-test',
      title: `1. Who Is an Inventor?`,
      content: `## 1.1 The Conception Test

An inventor is one who **conceived** of the claimed invention. Conception is:
> The formation in the mind of the inventor of a definite and permanent idea of the complete and operative invention.

*Sewall v. Walters*, 21 F.3d 411 (Fed. Cir. 1994).

Conception is complete when the inventor has a definite idea such that POSITA could practice the invention without further inventive skill (even if reduction to practice requires ordinary engineering).

## 1.2 NOT Inventorship

The following individuals are NOT inventors merely by their role:
- **Mere reducers to practice**: a technician who builds a prototype based on the inventor's drawings
- **Supervisors**: a boss who funded the research and assigned the project
- **Testers**: someone who only ran experiments to confirm the inventor's idea
- **Consultants**: who gave general advice but not inventive contribution
- **Co-workers**: who merely carried out the inventor's instructions
- **Attorneys**: who drafted the specification (drafting ≠ inventing)
- **Clients**: who provided the problem but not the solution

## 1.3 Joint Inventorship

Under 35 U.S.C. §116, inventors may jointly apply for a patent even though:
1. They did not physically work together or at the same time
2. Each did not make the same type or amount of contribution
3. Each did not make a contribution to every claim

Each joint inventor must contribute to the conception of **at least one claim**. Contribution to the implementation alone is NOT enough — there must be contribution to the inventive concept.

## 1.4 Requirements for Joint Inventorship

Fed. Cir. case law (summarized in MPEP §2137.01) requires joint inventors to:
- Make some contribution to the conception of the invention (not of every claim)
- Make a contribution that is NOT insignificant in quality
- Do more than merely explain what the invention requires (e.g., describing well-known concepts)

*Pannu v. Iolab Corp.*, 155 F.3d 1344 (Fed. Cir. 1998) — the "three-factor Pannu test" for joint inventorship contribution.

## 1.5 The Employer Is Not an Inventor

An employer does not become an inventor by virtue of employing the inventor, even if the employer:
- Paid for the research
- Owns the patent (through assignment)
- Directed the employee to work on the problem
- Has the rights via employment agreement

Employers are OWNERS of patents (through assignment), not INVENTORS.

## 1.6 AI Cannot Be an Inventor

USPTO Guidance on AI-Assisted Inventions (February 2024, 89 Fed. Reg. 10043) confirms:
- Only natural persons can be inventors
- An AI cannot be listed as an inventor
- A natural person may be an inventor if they made a **significant contribution** to the conception of the invention, even if an AI contributed

If a human simply prompted an AI with a problem and the AI produced the solution, the human is likely not an inventor. If the human made specific design choices, refined AI outputs, or integrated AI results creatively, the human may be an inventor. The analysis is fact-specific.`,
      examTip: `Inventorship is about **CONCEPTION**, not reduction to practice or ownership. A technician who built the prototype is NOT an inventor. An employer is NOT an inventor. An AI is NOT an inventor. Only natural persons who contributed to conception of at least one claim are inventors.`,
    },
    {
      id: 'inventorship-correction',
      title: `2. Correction of Inventorship`,
      content: `## 2.1 Why Correction Might Be Needed

Inventorship errors arise because:
- Research team misunderstands conception rules
- New inventors added as claims are amended during prosecution
- Non-inventors initially included in error
- Assignments were signed assuming different inventorship

## 2.2 Correction in Pending Application (37 CFR §1.48)

Under AIA, correction is relatively simple:
- File a request under 37 CFR §1.48(a)
- Include a new Application Data Sheet (ADS) reflecting correct inventorship
- Include a statement of the facts causing the inventorship to be incorrect
- Pay the processing fee
- Include new oath/declaration from any newly added inventor (or substitute statement)

Pre-AIA (Sept. 16, 2012+) required a statement of no deceptive intent. That requirement was eliminated by the AIA for pending applications.

## 2.3 Correction After Issue (37 CFR §1.324)

For issued patents, the correction is via Certificate of Correction:
- Petition under 37 CFR §1.324
- Supporting statement from current named inventors
- Supporting statement from inventors being added
- Consent of the assignee(s)
- Pay the fee

Post-AIA: no requirement to show "without deceptive intent" (previously required).

## 2.4 Correction in Litigation

A patent can also be corrected for inventorship during litigation under 35 U.S.C. §256:
- Court may order correction
- Applies where discovery reveals inventorship error
- Does NOT require showing of no deceptive intent (post-AIA)

## 2.5 Consequences of Wrong Inventorship

- If error is intentional and with deceptive intent → patent can be held unenforceable
- If error is innocent → correction typically fixes the problem
- If correction is not sought when error is known → risk of estoppel or unenforceability

## 2.6 Strategic Considerations

- Correct inventorship ASAP when errors are identified
- Have all inventors (and former inventors) review and sign confirmations
- Document the facts supporting the correction
- Inform the USPTO before any litigation discovery if possible`,
      importantNote: `Under the AIA, correction of inventorship does NOT require a showing that the error was "without deceptive intent." This is a key change from pre-AIA practice. However, evidence of intentional misidentification can still be raised as **inequitable conduct** in litigation, which is a different ground for unenforceability.`,
    },
  ],
  keyTakeaways: [
    'An inventor is one who CONCEIVED the invention. Conception = forming in the mind a definite and permanent idea of the complete, operative invention.',
    'Reducers to practice, supervisors, funders, testers, and attorneys are NOT inventors unless they also contributed to conception of at least one claim.',
    'Joint inventors under §116: each must contribute to conception of at least one claim. Pannu test assesses quality of contribution.',
    'Employers are not inventors. They OWN patents through assignment but do not create inventorship.',
    'AI cannot be an inventor (USPTO 2024 Guidance). A human who makes a significant contribution to conception CAN be an inventor even if AI assisted.',
    'Correction during prosecution: 37 CFR §1.48 — file corrected ADS, statement, new declaration from added inventors, fee.',
    'Correction after issue: 37 CFR §1.324 — petition, inventor statements, assignee consent, fee.',
    'AIA eliminated the "without deceptive intent" requirement for inventorship corrections. But intentional misidentification can still be inequitable conduct.',
  ],
},

// ═══════════════════════════════════════════════════════════════
// PART 3 — FILING & PROSECUTION
// MPEP Chapters 200, 500, 600, 700, 800 · 35 U.S.C. §§ 111, 119, 120, 121, 132
// ═══════════════════════════════════════════════════════════════

pf_provisional: {
  topicId: 'pf_provisional',
  title: `Provisional Applications — 35 U.S.C. §111(b)`,
  domainWeight: 'Filing & Prosecution · MPEP 201.04',
  overview: `A provisional application is a simplified, low-cost filing that establishes an early effective filing date but does NOT get examined and automatically expires after 12 months. It is the most common strategy for securing priority before public disclosure while the applicant prepares a full non-provisional. The key rules: 12-month pendency, must claim benefit within 12 months (no extensions beyond 2-month unintentional restoration), must have §112(a) support for any claim that benefits from it. Heavily tested because of the interplay with §102 prior art dates.`,
  sections: [
    {
      id: 'prov-basics',
      title: `1. What Is a Provisional Application?`,
      content: `## 1.1 Statutory Basis

35 U.S.C. §111(b) authorizes provisional applications. They:
- Establish a **constructive reduction to practice** and an effective filing date
- Are NOT examined
- Cannot mature into an issued patent
- **Expire automatically 12 months** after filing (no extension, though 2-month unintentional-delay restoration is available)
- Cannot claim priority to any other application

## 1.2 Required Components

A provisional application requires (37 CFR §1.53(c)):
- A **specification** (description of the invention) compliant with §112(a) — written description, enablement (best mode arguably required but rarely enforced)
- **Drawings** if necessary to understand the invention
- **Cover sheet** identifying the application as provisional (Form PTO/SB/16 or equivalent)
- **Applicable filing fee** (much lower than non-provisional)
- **Names of all inventors**

## 1.3 What Is NOT Required

A provisional application does NOT need:
- **Claims** (unlike a non-provisional)
- **Oath or declaration** (not required for provisionals)
- **Information Disclosure Statement** (no duty to disclose in provisional since it is not examined)
- **Assignment** (though recording early helps)

## 1.4 The 12-Month Clock

The priority period is **12 months**, measured from the provisional's filing date. Within that window, the applicant must:
- File a non-provisional application claiming benefit under §119(e), OR
- File a PCT application designating the US, OR
- Lose the priority benefit

If the 12-month anniversary is a Saturday, Sunday, or federal holiday, the filing deadline is the next business day (35 U.S.C. §21(b)).

## 1.5 Restoration of Priority (2-Month Window)

Under 37 CFR §1.78(b), if a non-provisional is filed within **2 months after** the 12-month deadline, priority can be restored upon:
- Petition
- Statement that the delay was **unintentional**
- Payment of the restoration fee

Beyond 14 months total, no restoration is available.

## 1.6 Provisional Cannot Claim Priority

A provisional is a standalone filing. It cannot claim priority to any earlier application (domestic or foreign). It is the FIRST link in the priority chain.

## 1.7 Provisional Cannot Become a Patent

A provisional NEVER matures into an issued patent. It is a temporary placeholder. The non-provisional filed within 12 months is the application that can issue as a patent.`,
      examTip: `Memorize: provisional = 12-month lifespan, NO claims required, NO oath/declaration required, NO examination, CANNOT claim priority, CANNOT issue. The non-provisional that claims benefit under §119(e) is the real application. 2-month unintentional-delay restoration extends the priority window to 14 months max.`,
    },
    {
      id: 'prov-support',
      title: `2. §112(a) Support Requirement`,
      content: `## 2.1 The Rule

For a non-provisional claim to get benefit of a provisional's filing date, the provisional must provide §112(a) written description and enablement for that claim.

- Provisional discloses compound A + utility → non-provisional claim to A can get provisional's date
- Provisional discloses A but not B → non-provisional claim to B gets the non-provisional's filing date, not the provisional's

## 2.2 Claim-by-Claim Analysis

Priority benefit is assessed **claim by claim**. A single non-provisional may have some claims entitled to the provisional's date (because the provisional adequately supported them) and other claims entitled only to the non-provisional's date.

## 2.3 Practical Implications

- A prior-art reference published in the gap between provisional and non-provisional may:
  - NOT be prior art against claims supported by the provisional
  - BE prior art against claims added after the provisional was filed

## 2.4 The "Skeleton Provisional" Trap

Inventors sometimes file "skeleton" provisionals with minimal disclosure to preserve early filing dates. Courts strictly enforce §112(a):
- *New Railhead Manufacturing, L.L.C. v. Vermeer Manufacturing Co.*, 298 F.3d 1290 (Fed. Cir. 2002) — provisional that did not disclose the claimed drill bit did not provide priority.
- *Anascape, Ltd. v. Nintendo of America Inc.*, 601 F.3d 1333 (Fed. Cir. 2010) — incomplete provisional lost priority for some claims.

## 2.5 Best Practices

- Draft the provisional like a non-provisional (detailed, multiple embodiments, alternative configurations)
- Include drawings
- Include a claim set even though not required (helps frame the disclosure)
- Describe as many permutations as the invention supports`,
    },
    {
      id: 'prov-strategy',
      title: `3. Strategic Uses and Pitfalls`,
      content: `## 3.1 Why Use a Provisional?

1. **Early filing date**: establishes priority before public disclosure
2. **Lower cost**: filing fee is lower than non-provisional
3. **Time to refine**: 12 months to develop the invention, test, and draft claims
4. **Multiple provisionals**: filing multiple provisionals and combining them in a single non-provisional

## 3.2 Common Pitfalls

- **Missing the 12-month deadline**: catastrophic unless restoration is available
- **Inadequate disclosure**: non-provisional claims lose the provisional's priority
- **No claim to benefit**: forgetting to claim §119(e) benefit in the non-provisional
- **Disclosure exceeds the provisional**: later-added subject matter loses the provisional's date (only supported claims get the earlier date)

## 3.3 Multiple Provisionals

An applicant can file multiple provisionals and then combine them in one non-provisional:
- Provisional A filed Jan 1, 2024 (compound X)
- Provisional B filed June 1, 2024 (method using compound X)
- Non-provisional filed Dec 15, 2024 claiming benefit of both
- Claims to compound X get Jan 1, 2024 EFD; claims to method get June 1, 2024 EFD (assuming proper support)

Each provisional's 12-month clock runs independently.

## 3.4 Provisional + PCT Strategy

A common international strategy:
- File US provisional
- Within 12 months, file PCT designating the US
- PCT gets provisional's priority date
- At 30 months from provisional, enter national stage in US and other countries

## 3.5 Foreign Filing Risks

- **Paris Convention priority** (§119(a)) gives 12 months for foreign filings from the earliest US filing
- If provisional is filed and public disclosure occurs, foreign rights may be lost (most countries lack the US-style grace period)
- File foreign applications within 12 months of the provisional to preserve the priority date abroad

## 3.6 Abandonment

A provisional is automatically "abandoned" after 12 months (effectively expires). It cannot be revived or extended (except 2-month unintentional restoration).`,
    },
  ],
  keyTakeaways: [
    'Provisional: 12-month lifespan, no claims required, no oath required, not examined, cannot claim priority, cannot issue.',
    'Components: specification (§112(a)), drawings (if needed), cover sheet, filing fee, inventor names.',
    'Non-provisional must be filed within 12 months to claim §119(e) benefit. 2-month unintentional restoration available (max 14 months).',
    'Priority benefit is assessed claim-by-claim. Provisional must provide §112(a) support for EACH claim seeking the earlier date.',
    'Multiple provisionals can be combined in one non-provisional; each provisional\'s 12-month clock runs separately.',
    'Provisional + PCT: PCT filed within 12 months of provisional gets provisional\'s priority date. 30-month national stage deadline runs from provisional.',
    'Foreign filings (Paris Convention) must be within 12 months of provisional. Many countries lack US-style grace period.',
    'Drafting trap: skeleton provisionals fail — Federal Circuit strictly enforces §112(a). Provisional should be drafted with the same care as a non-provisional.',
  ],
},

pf_nonprovisional: {
  topicId: 'pf_nonprovisional',
  title: `Non-Provisional Applications — 35 U.S.C. §111(a)`,
  domainWeight: 'Filing & Prosecution · MPEP 601',
  overview: `A non-provisional application (sometimes called a "utility application") is the standard patent application that is examined and can issue as a patent. It requires a full specification, at least one claim, an oath or declaration, drawings (if needed), and appropriate fees. Non-provisionals can be original filings or can claim benefit of earlier provisional, non-provisional, or PCT applications. Understanding filing requirements and fee tiers (micro, small, regular) is frequently tested.`,
  sections: [
    {
      id: 'nonprov-requirements',
      title: `1. Non-Provisional Filing Requirements`,
      content: `## 1.1 Statutory Basis

35 U.S.C. §111(a) governs non-provisional applications. Requirements for a filing date (35 U.S.C. §111(a)(2), as amended by the Patent Law Treaty Implementation Act 2012):

### Post-PLT (December 18, 2013) Requirements:
1. **Specification** (at least a description or a reference to a previously filed application)
2. **Fee** (basic filing fee + search fee + examination fee; can be paid later with surcharge)

Notably, POST-PLT, a non-provisional can get a filing date WITHOUT claims. Claims can be filed later (with a surcharge).

Pre-PLT (before December 18, 2013) required at least one claim to get a filing date.

## 1.2 What Is Required for Complete Application

While a filing date can be obtained with minimal content, a **complete** non-provisional (ready for examination) requires:
- Specification (with detailed description)
- At least one claim
- Drawings (where necessary)
- Oath or declaration (can be filed later, but before issue fee)
- Application Data Sheet (ADS)
- Basic filing fee, search fee, examination fee
- IDS (if prior art is known)

## 1.3 Fee Structure (37 CFR §1.16)

Three entity tiers determine fees:

| Entity | Discount |
|---|---|
| **Regular** | Full fee |
| **Small entity** | 60% discount (40% of regular fee) |
| **Micro entity** | 80% discount (20% of regular fee) |

### Small Entity (37 CFR §1.27):
- Fewer than 500 employees (including affiliates)
- Independent inventors, small businesses, nonprofit organizations
- Not assigned/licensed to a non-qualifying entity

### Micro Entity (37 CFR §1.29):
Meets all four requirements:
1. Qualifies as small entity
2. Not named as inventor on more than 4 previously filed applications (not counting provisionals and foreign apps)
3. Gross income in preceding year does not exceed 3× the median household income
4. Has not assigned or licensed rights to an entity with income above 3× median

## 1.4 Core Fees

Approximate fees at 2025 rates (regular entity):
- **Basic filing fee**: $320
- **Search fee**: $700
- **Examination fee**: $800
- **Total basic filing cost**: ~$1,820 for regular entity
- **Total for small entity**: ~$728
- **Total for micro entity**: ~$364

Excess claim fees and surcharges are additional.

## 1.5 Electronic Filing

Most non-provisionals are filed via Patent Center. Paper filing requires a $400 "non-electronic filing fee" as a surcharge (unless micro entity, who can file paper without surcharge).

## 1.6 Application Data Sheet (ADS) — 37 CFR §1.76

The ADS is a structured form that contains:
- Bibliographic information (applicant, inventors, correspondence address)
- Priority/benefit claims (provisional, foreign, continuation)
- Representative and agent information
- Assignment information

ADS is required whenever the applicant wants to claim priority or benefit.`,
    },
    {
      id: 'nonprov-missing-parts',
      title: `2. Missing Parts and Notice to File Missing Parts`,
      content: `## 2.1 The USPTO's Review

After filing, the Office of Patent Application Processing (OPAP) reviews the application for completeness. If something is missing, OPAP issues a **Notice to File Missing Parts** identifying the deficiencies.

## 2.2 Common Missing Parts

- Oath or declaration
- Signatures
- English translation (if non-English application)
- Claims (pre-PLT requirement if filed before December 18, 2013)
- Drawings (for applications requiring them)
- Fees (some or all)
- ADS

## 2.3 Time to Respond

Typically 2 months, extendable to the statutory maximum (6 months), with petition fees for extensions.

## 2.4 Consequences of Non-Response

If the applicant does not respond:
- Application is **abandoned** for failure to respond
- Can be revived for **unintentional delay** under 37 CFR §1.137(a) with petition fee

## 2.5 Late-Filed Oath/Declaration

Oath or declaration can be filed up to payment of the issue fee with surcharge. Absent oath/declaration, the patent cannot issue.

## 2.6 The Application Number

Upon filing, the USPTO assigns:
- **Application number** (8-digit): 17/XXXXXX or 18/XXXXXX series
- **Confirmation number**: 4-digit code for later correspondence
- **Filing receipt**: issued after initial processing confirming the data on the application

The applicant should verify the filing receipt carefully — errors can affect priority claims and inventorship.`,
    },
    {
      id: 'nonprov-track-one',
      title: `3. Accelerated Examination Options`,
      content: `Standard non-provisional examination takes 18-36+ months from filing to first office action. The USPTO offers several accelerated programs.

## 3.1 Track One — Prioritized Examination (37 CFR §1.102(e))

- Fast-track examination with a goal of final disposition within **12 months**
- Requires prioritized exam fee (approximately $4,200 at regular rate; $1,680 for small; $840 for micro)
- Maximum 4 independent claims and 30 total claims
- Must be original utility or plant non-provisional (not design, not CIP)
- Filed with original application or after RCE

## 3.2 Patent Prosecution Highway (PPH)

If a counterpart application has been allowed in a partner patent office (EPO, JPO, KIPO, etc.), PPH can expedite US examination:
- No additional fee
- Must identify corresponding claims
- First action typically within 3-6 months

## 3.3 Accelerated Examination Program (AEP)

Older program less commonly used now. Requires:
- Pre-examination search document
- Accelerated examination support document
- Limited to 3 independent/20 total claims

## 3.4 Petition to Make Special

Available without fee for specific circumstances:
- **Age or health**: applicant 65+ or in poor health
- **Environmental quality**: invention relates to environmental improvement
- **Energy**: invention relates to energy development
- **Counter-terrorism**: invention relates to counter-terrorism

## 3.5 COVID-19 Prioritized Examination Program (Historical)

The USPTO had a COVID-specific program from 2020-2023 that has since expired.`,
      examTip: `Track One (prioritized examination) is most commonly tested. Memorize: 12-month target, max 4 independent / 30 total claims, requires fee, for original non-provisionals (NOT CIPs).`,
    },
  ],
  keyTakeaways: [
    'Non-provisional under §111(a) is the standard examined application that can issue as a patent.',
    'Post-PLT (Dec 18, 2013+): filing date requires only specification + fee. Claims can be filed later with surcharge.',
    'Entity tiers: regular, small (60% discount), micro (80% discount). Know the qualifying criteria.',
    'Core fees: basic filing, search, examination — total ~$1,820 for regular entity at 2025 rates.',
    'ADS (37 CFR §1.76) required whenever claiming priority/benefit. Contains bibliographic and priority info.',
    'Missing Parts Notice: 2 months to respond, extendable to 6 months. Non-response = abandonment.',
    'Track One prioritized exam: 12-month goal, max 4 indep / 30 total claims, ~$4,200 fee for regular entity.',
    'PPH (Patent Prosecution Highway): no-fee expedite based on favorable foreign office results.',
  ],
},

pf_priority: {
  topicId: 'pf_priority',
  title: `Priority & Benefit Claims — §§119, 120, 365`,
  domainWeight: 'Filing & Prosecution · MPEP 211, 213, 1895',
  overview: `Priority claims allow a later application to benefit from the filing date of an earlier application. There are three major statutory bases: §119(e) for provisionals, §120 for continuations/divisionals/CIPs, and §119(a)/(b) and §365 for foreign applications. Each has specific procedural requirements and timing rules. Properly claiming priority is essential for securing an effective filing date for prior art purposes. The interplay of priority chains, §112(a) support, and effective filing dates is one of the most heavily tested areas on the exam.`,
  sections: [
    {
      id: 'priority-domestic',
      title: `1. Domestic Benefit — §§119(e), 120`,
      content: `## 1.1 §119(e) — Benefit of Provisional

A non-provisional claims benefit of a provisional under §119(e):
- Must be filed within 12 months of the provisional (or 14 months with unintentional-delay restoration)
- Must have at least one common inventor with the provisional
- Specific reference must be made: "This application claims the benefit of U.S. Provisional Application No. 63/XXX,XXX, filed [date]."
- Reference must be in an ADS (Application Data Sheet) filed within the time period of 37 CFR §1.78(a)(4) — usually 4 months from actual filing date OR 16 months from provisional filing date (whichever is later)

## 1.2 §120 — Benefit of Earlier Non-Provisional

A continuation, divisional, or CIP claims benefit of an earlier non-provisional under §120. Requirements:
1. **Copendency**: the earlier application must be pending (or become a patent on the same day as the later application is filed)
2. **Common inventor**: at least one common inventor
3. **Specific reference**: reference to the earlier application (in ADS)
4. **§112(a) support**: the earlier application must provide written description and enablement for claims seeking its filing date

Copendency is a bright-line rule — if the parent is abandoned or issued BEFORE the child is filed, there is no §120 benefit.

## 1.3 Priority Claim Timing (37 CFR §1.78)

The priority claim must be filed within:
- **4 months from the actual filing date** of the later application, OR
- **16 months from the priority date**

Whichever is later. If the deadline is missed, a petition to accept the unintentionally delayed priority claim is available.

## 1.4 Chain of Priority

Priority can chain through multiple applications:
- Provisional A (Jan 2022) → Non-provisional B (Dec 2022) → Continuation C (June 2023) → Continuation D (Jan 2024)

Claims in D that are supported by A can reach back to A's January 2022 EFD, provided:
- Each link in the chain properly claimed priority
- Copendency is maintained at each link
- §112(a) support exists at each link

## 1.5 Common Trap — Chain Break

If any link in the priority chain is defective (no copendency, no specific reference, no §112(a) support), the chain is broken for that application going forward.

**Example**: Provisional A → Non-provisional B claims §119(e) benefit of A. Continuation C claims §120 benefit of B only (not A). C can only reach back to B's date, not A's — even though A → B → C is a valid chain for the claims.

Modern applications typically include multiple priority claims (to A, B, etc.) to preserve the earliest possible date.

## 1.6 Cross-Referencing in the Specification

In addition to the ADS, a cross-reference to related applications should appear in the specification at the beginning (per 37 CFR §1.77(b)(2)). Example:
"This application is a continuation of U.S. Application No. 17/XXX,XXX, filed [date], which claims the benefit of U.S. Provisional Application No. 63/XXX,XXX, filed [date]."`,
      examTip: `The **4-months-from-filing OR 16-months-from-priority, whichever is later** rule is tested verbatim. Copendency is a bright-line rule — miss it and the priority chain breaks irreparably. §119(e) requires provisional priority; §120 requires non-provisional benefit. Do not confuse them.`,
    },
    {
      id: 'priority-foreign',
      title: `2. Foreign Priority — §§119(a)-(d), 365`,
      content: `## 2.1 The Paris Convention Basis

The Paris Convention for the Protection of Industrial Property (1883) grants a 12-month priority period for foreign filings. The US implements this through 35 U.S.C. §119(a)-(d).

## 2.2 Requirements (§119(a)-(d))

A US application can claim foreign priority if:
1. The foreign application was filed in a **Paris Convention country** (or WTO member)
2. The foreign application was filed **within 12 months** of the US application (6 months for design patents under §172)
3. There is a **common inventor** or applicant
4. The applicant makes a specific claim for priority
5. **Certified copy of the foreign application** is filed (usually via PDX digital exchange)

## 2.3 Timing of the Priority Claim (37 CFR §1.55)

For foreign priority, the claim must be filed within:
- **4 months from actual filing date** of the US application, OR
- **16 months from the foreign priority date**

Whichever is later.

## 2.4 Certified Copy Requirements

The certified copy of the foreign application must be:
- Filed in the USPTO, OR
- Retrievable via PDX (Priority Document Exchange — digital exchange with major patent offices), OR
- Retrievable via WIPO DAS (Digital Access Service)

Deadline: generally 4 months from US filing or 16 months from foreign priority date.

## 2.5 Multiple Foreign Priority Claims

An applicant can claim multiple foreign priorities:
- Priority to France filing (Feb 2023)
- Priority to Germany filing (May 2023) — if independent of France filing
- Priority to US provisional (Jan 2023)

Claims in the US application are entitled to the earliest date supported by the originating foreign application AND meeting §112(a).

## 2.6 Restoration of Foreign Priority

Under 37 CFR §1.55(c), foreign priority can be restored within **2 months** after the 12-month deadline (14 months total max), upon:
- Petition
- Statement that delay was unintentional
- Payment of restoration fee

## 2.7 §365 — PCT Application Priority

35 U.S.C. §365 governs priority claims involving PCT applications:
- **§365(a)**: National application can claim priority of PCT (treated like foreign priority)
- **§365(b)**: PCT application can claim priority of foreign application (treated like §119)
- **§365(c)**: National application can claim benefit of PCT designating the US (treated like §120 benefit)

## 2.8 Practical Examples

| Scenario | Authority |
|---|---|
| US non-prov claims priority to 12-mo earlier Japanese patent app | §119(a) |
| US non-prov claims benefit of 12-mo earlier US provisional | §119(e) |
| US non-prov claims benefit of earlier US non-provisional | §120 |
| US non-prov claims benefit of earlier PCT designating US | §365(c) |
| PCT claims priority to earlier US provisional | §365(b) |`,
      importantNote: `The 12-month Paris Convention deadline is critical. A foreign filing even ONE DAY late loses priority, except for the narrow 2-month restoration for unintentional delay. Many applicants file on the LAST DAY, making calendar accuracy essential.`,
    },
    {
      id: 'priority-cip-traps',
      title: `3. Priority Traps with CIPs and Partial Support`,
      content: `## 3.1 Continuation-in-Part (CIP) — Mixed Priority

A CIP adds new matter beyond the parent. This creates CLAIM-by-CLAIM priority:
- Claims fully supported by the parent → parent's filing date
- Claims reciting NEW matter (not in parent) → CIP's filing date (later)

## 3.2 Example — CIP Priority Analysis

Parent filed Jan 1, 2023, discloses compound A and utility X.
CIP filed Jan 1, 2024, adds disclosure of compound B and utility Y.

| Claim | Content | EFD |
|---|---|---|
| Compound A for utility X | Fully supported by parent | Jan 1, 2023 |
| Compound A for utility Y | Y is new matter in CIP | Jan 1, 2024 |
| Compound B | B is new matter in CIP | Jan 1, 2024 |
| Compound A for utility X OR Y | Partial new matter; treated as Jan 1, 2024 for safety |

## 3.3 Prior Art Hits Between Parent and CIP

If prior art is published BETWEEN the parent's filing and the CIP's filing:
- Claims entitled to parent's date → reference is NOT prior art
- Claims entitled only to CIP's date → reference IS prior art

This is a classic trap: the applicant thinks "we have an earlier filing," but the added matter doesn't benefit from it.

## 3.4 §112(a) Support — The Gatekeeper

For ANY claim to benefit from ANY earlier application, §112(a) support must exist in that earlier application. The analysis:
1. Does the earlier application describe the claimed subject matter with sufficient detail (written description)? AND
2. Does it enable a POSITA to practice (enablement)?

If no → claim doesn't get the earlier date.

## 3.5 Common Exam Scenarios

### Scenario A: Provisional Missing the Claimed Feature
- Provisional discloses widget with feature X only
- Non-provisional adds feature Y and claims widget with X or Y
- Claim to X alone: provisional's date
- Claim to Y alone: non-provisional's date
- Claim to X+Y combination: depends on disclosure

### Scenario B: Continuation Adding Narrower Range
- Parent discloses temperature range 100-200°C
- Continuation claims 150-180°C
- If parent discloses or contemplates the narrower range with possession, continuation claim gets parent's date
- If parent is silent on 150-180°C → arguably lacks written description, continuation date applies

### Scenario C: Broadening in Continuation
- Parent discloses and claims A
- Continuation claims A, B, C (where B and C weren't originally disclosed)
- Original claim (A) gets parent's date
- New claims (B, C) require §112(a) support in parent — likely no

## 3.6 Priority Chain Verification

When advising on an EFD question:
1. Identify every application in the priority chain
2. Verify copendency at each step
3. Verify specific reference at each step
4. Verify §112(a) support for the specific claim at issue
5. Only the EARLIEST application providing proper chain continuity AND §112(a) support = EFD`,
    },
  ],
  keyTakeaways: [
    '§119(e) = benefit of US provisional. §120 = benefit of US non-provisional. §119(a)-(d) = foreign priority. §365 = PCT priority/benefit.',
    'Priority claim timing: 4 months from filing OR 16 months from priority date, whichever is later. Must be in ADS.',
    'Copendency is bright-line for §120. Parent must be pending when child is filed, or both mature to patents the same day.',
    'Foreign priority (Paris Convention): 12 months from foreign filing (6 months for design). 2-month unintentional-delay restoration.',
    'Priority is claim-by-claim. Each claim needs §112(a) support in the earlier application to get its filing date.',
    'CIP analysis: claims supported by parent get parent\'s date; claims reciting new matter get CIP\'s date.',
    'Chain breaks if any link is defective (no specific reference, no copendency, no §112(a) support). Modern applications claim priority to all relevant parents.',
    'PDX (Priority Document Exchange) and WIPO DAS allow digital delivery of certified copies — avoid paper certified copy filings when possible.',
  ],
},

pf_continuations: {
  topicId: 'pf_continuations',
  title: `Continuations, Divisionals, and CIPs`,
  domainWeight: 'Filing & Prosecution · MPEP 201.07–201.09',
  overview: `Continuation practice lets an applicant keep prosecution alive by filing a new application that claims the benefit of an earlier application. Three common variants: (1) continuation — same disclosure, different claims; (2) divisional — filed in response to a restriction requirement; (3) continuation-in-part (CIP) — adds new matter. Each has distinct requirements, advantages, and traps. The 2007 proposed "continuation limits" rules were enjoined, so currently there is no limit on the number of continuations. Heavily tested — especially the §121 safe harbor and CIP effective filing date rules.`,
  sections: [
    {
      id: 'cont-types',
      title: `1. Three Types of Continuation Applications`,
      content: `## 1.1 Continuation (§120)

A continuation (sometimes called "straight continuation"):
- Same disclosure as parent (no new matter)
- Different (often broader or different-scope) claims
- Claims benefit of parent under §120
- Filed while parent is pending (copendency)

### Why File a Continuation?
- Pursue claims the examiner wouldn't allow in the parent
- Keep the application alive to pursue emerging market opportunities (claim-scope strategy)
- Respond to competitive developments
- Allow amendment of claims based on later-discovered prior art

## 1.2 Divisional (§121)

A divisional:
- Filed in response to a **restriction requirement** in the parent
- Contains only the claims restricted OUT in the parent (the "non-elected" inventions)
- Gets §121 safe harbor against ODP based on the parent
- Claims benefit of parent under §120

### Key Protection: §121 Safe Harbor
Because the applicant filed the divisional in response to the examiner's restriction, §121 prevents the PTO or courts from rejecting either the parent or divisional based on obviousness-type double patenting (ODP) over the other.

## 1.3 Continuation-in-Part (CIP) (§120)

A CIP:
- Contains the disclosure of the parent PLUS new matter
- Has claims, some of which may be supported by the parent and some only by the new matter
- Each claim gets priority based on where it is fully supported

### When to File a CIP
- Adding improvements developed after parent filing
- Disclosing new embodiments
- Expanding scope
- Supporting new claim limitations

### Risks of CIP
- Claims with new-matter subject matter lose parent's priority date
- Potential terminal disclaimer issues (ODP over parent)
- Extended patent term might create ODP issues later

## 1.4 Summary Table

| Type | Disclosure | Claim Scope | Reason to File | Priority Benefit |
|---|---|---|---|---|
| **Continuation** | Identical to parent | Different/broader | Pursue different claim angles | Full parent date |
| **Divisional** | Identical to parent | Only non-elected inventions | Required by restriction | Full parent date + §121 safe harbor |
| **CIP** | Parent + new matter | May include new-matter claims | Add improvements | Parent date ONLY for claims fully supported in parent |`,
    },
    {
      id: 'cont-filing-requirements',
      title: `2. Filing Requirements and Procedures`,
      content: `## 2.1 Common Requirements

All three types (continuation, divisional, CIP):
- **Filed while parent is pending** (copendency) — MUST be filed before parent is abandoned or issues as a patent (though filing on the day of issuance is acceptable)
- **At least one common inventor** with the parent
- **Specific reference** to the parent in the ADS (and ideally in the specification)
- **Section 120 priority claim** in the ADS
- **Filing fees**, including full non-provisional fees
- **New oath or declaration** (or incorporation of earlier oath if within 37 CFR §1.63 rules)

## 2.2 Filing Mechanism

Option 1: **Straight filing** under 35 U.S.C. §111(a) — file a new application that specifically claims benefit of the parent.

Option 2: **Continued Prosecution Application (CPA)** — available ONLY for design patents under 37 CFR §1.53(d). NOT available for utility patents (was phased out circa 2000).

Option 3: **Request for Continued Examination (RCE)** — different mechanism, discussed separately (not a new application, but continues prosecution of existing application). Covered in Part 4.

## 2.3 Section 120 Reference

The §120 priority claim must:
- Be in an ADS (or in the first sentence of the specification per some older practice)
- Be made within 4 months of the actual filing date OR 16 months from the priority date (whichever is later)
- Specifically identify the parent by application number and filing date

## 2.4 Copendency Details

A continuation or CIP is "copending" with its parent if:
- Filed while parent is pending (not abandoned, not issued), OR
- Filed on the same day the parent issues (the parent is considered pending for this purpose)

Exactly WHEN the parent "issues" can matter: issue is typically Tuesday mornings; the parent is abandoned/issued at the time of issuance. File the continuation BEFORE that specific moment to preserve copendency.

## 2.5 Common Traps

- **Missing copendency**: parent abandoned before continuation filed → no §120 benefit
- **Missing §120 claim**: forgetting to claim benefit → default to non-provisional's own date
- **New matter in continuation (not CIP)**: straight continuations cannot add new matter; if new matter is added, treat as CIP
- **Omitting the ADS**: priority claims in the specification alone are sometimes rejected`,
      importantNote: `The key distinction: **continuation** = same disclosure as parent (no new matter); **CIP** = parent disclosure + new matter. Do not use "continuation" to describe a CIP. The USPTO will reject the continuation as improperly claimed if new matter is present.`,
    },
    {
      id: 'cont-cip-deep-dive',
      title: `3. CIP Deep Dive — Priority Analysis`,
      content: `## 3.1 Why CIPs Are Tricky

A CIP blends old and new disclosure. The claims must be analyzed individually:

- Claim to subject matter fully disclosed in parent → parent's date
- Claim to subject matter disclosed only in CIP → CIP's date
- Claim to a genus that overlaps both → parent's date for the overlapping part; CIP's date for the new genus

## 3.2 Classic CIP Trap — Written Description in Genus

Parent discloses compound A.
CIP discloses compound B and claims "a compound selected from A or B."
- If the claim covers both A and B, the claim can only get the CIP's date (because B is new matter)
- The claim is entitled to A's priority only if separately rewritten to cover A alone

## 3.3 Prior Art Between Parent and CIP

If a third party publishes between parent filing and CIP filing:
- Claims fully supported by parent → reference NOT prior art
- Claims supported only by CIP → reference IS prior art

This scenario is a major strategic consideration. If the applicant anticipates possible third-party disclosures, they should try to support all claim variants in the parent.

## 3.4 Double-Patenting Analysis for CIPs

A CIP risks ODP with its parent:
- Parent claims compound A
- CIP claims compound A and compound B

If the CIP's claim to B is patentably indistinct from the parent's claim to A → ODP rejection. Remedy: terminal disclaimer.

## 3.5 Patent Term Considerations

A CIP's patent term is generally 20 years from its effective filing date — which can be the parent's date or the CIP's date depending on the claim. Since each claim's term is the patent's term (not the claim's EFD), CIP claims have the 20-year term from the earliest priority application.

However, for ODP purposes, patent term differences can create problems (see *In re Cellect*, 81 F.4th 1216 (Fed. Cir. 2023)).

## 3.6 Best Practices

- Identify clearly what is old disclosure (from parent) vs. new matter in the CIP
- File CIPs thoughtfully — sometimes a straight continuation or divisional is better
- For genus claims, include dependent claims that track only the parent's disclosure to preserve earlier priority
- Consider filing multiple CIPs for different improvements, each claiming only one priority chain

## 3.7 Example Prosecution Strategy

Parent: "A widget comprising part A"
Improvement 1: "A widget comprising part A and additional part B"
Improvement 2: "A widget comprising part A and additional part C"

Options:
- Single CIP adding B and C → mixed priority on certain claims
- Two separate CIPs, one for B and one for C → cleaner priority analysis
- Amend parent if still pending (only if new matter supported)`,
    },
  ],
  keyTakeaways: [
    'Three types: continuation (same disclosure, different claims), divisional (non-elected claims from restriction), CIP (adds new matter).',
    'All three require copendency with parent (filed before parent abandons or issues) and at least one common inventor.',
    '§121 safe harbor: divisional filed in response to restriction cannot create ODP with parent. Must maintain consonance.',
    'Continuation cannot add new matter. Adding new matter = CIP.',
    'CIP analysis: priority is claim-by-claim. Claims supported by parent get parent\'s date; claims with new matter get CIP\'s date.',
    '§120 priority claim must be in ADS, filed within 4 months of actual filing OR 16 months from priority (whichever later).',
    'No continuation limits currently — 2007 proposed rules were enjoined. Multiple continuations allowed.',
    'Patent term runs from earliest EFD; CIP claims get 20 years from the priority they are entitled to. Cellect (2023) warns about PTA + ODP interaction.',
  ],
},

pf_restriction: {
  topicId: 'pf_restriction',
  title: `Restriction Requirements and Elections`,
  domainWeight: 'Filing & Prosecution · MPEP 800',
  overview: `A restriction requirement is the examiner's refusal to examine multiple distinct inventions in a single application. The applicant must elect one invention to prosecute; the non-elected inventions can be pursued in divisional applications (§121). Restriction practice is governed by MPEP 800 and 37 CFR §1.141–§1.146. Understanding when a restriction is proper, how to traverse (argue against) it, and the strategic use of divisionals is a major exam topic.`,
  sections: [
    {
      id: 'restriction-basics',
      title: `1. Basis for Restriction`,
      content: `## 1.1 Statutory Authority

35 U.S.C. §121: "If two or more independent and distinct inventions are claimed in one application, the Director may require the application to be restricted to one of the inventions."

## 1.2 Two-Part Test for Restriction

An examiner may require restriction if:
1. The claims are to **two or more inventions** that are **independent and distinct**; AND
2. The inventions would require a **serious search burden** if examined together.

### Independent and Distinct
- **Independent**: the inventions have unrelated subject matter (e.g., a widget vs. an unrelated chemical process)
- **Distinct**: inventions that share subject matter but are separately patentable (e.g., a product and a method of making it; product and method of using it; process and apparatus performing the process)

Two inventions are distinct if one can be made or used without the other.

### Serious Search Burden
The examiner must be able to justify that searching both inventions would require:
- Different classifications in the CPC/USPC schema
- Different fields of search
- Non-coextensive queries

## 1.3 Types of Restriction

Common restriction categories:
- **Product + Process**: apparatus + method of using; composition + method of making
- **Species**: multiple specific embodiments within a genus that are patentably distinct
- **Combination/subcombination**: a system and its components

## 1.4 Species Election

When a generic claim encompasses multiple species (specific embodiments) that are patentably distinct:
- The examiner may require election of a single species to examine
- If the generic claim is allowable, species are typically examined together
- If the generic claim is not allowable, the elected species is examined alone (and non-elected species are withdrawn from consideration)

### Markush Group Election
For Markush claims ("selected from A, B, C, D"), if the members are not patentably indistinct, the examiner may require election of a single member.

## 1.5 Unity of Invention (PCT-Based Standard)

For PCT applications entering the US national stage, a different standard applies: **unity of invention** (37 CFR §1.475). This looks for a single "general inventive concept." More restrictive on the examiner's ability to restrict than US-origin applications.

## 1.6 Timing of the Restriction

Restrictions are typically issued as **preliminary** actions (early in prosecution), before the examiner substantively examines the claims. Late restrictions (after substantial examination) are generally not allowed.`,
      examTip: `Two-step test: **(1) independent and distinct inventions (2) serious search burden**. Both are required. If one claim is a broader genus that reads on multiple species, a species election may be required. Remember: the examiner must articulate the search burden — the applicant can traverse by showing it's not serious.`,
    },
    {
      id: 'restriction-election',
      title: `2. Election and Traversal`,
      content: `## 2.1 Making the Election

When a restriction is issued, the applicant must:
1. **Elect** one invention (the "elected invention") to prosecute
2. State whether the election is **with traversal** or **without traversal**

### Election Without Traversal
- Applicant accepts the restriction as correct
- Only the elected invention will be examined
- Non-elected inventions can be pursued in divisionals
- No argument about the restriction

### Election With Traversal
- Applicant argues the restriction is improper (preserving the right to later challenge)
- Still must pick one invention to examine
- If the traversal prevails later (e.g., on appeal), non-elected claims can be re-joined

## 2.2 Provisional vs. Permanent Election

- An election before a restriction action is called a "tentative" or "provisional" election. It's not binding.
- An election after the restriction action is **binding** unless changed by later examiner action (unlikely).

## 2.3 Consequences of No Election

If the applicant does not respond to a restriction requirement, the application is abandoned.

## 2.4 Traversal Arguments

Common grounds for traversal:
- The inventions are not independent and distinct (they overlap significantly)
- No serious search burden exists (same classification, same art)
- Restriction is improper because the grouped inventions are materially interrelated

## 2.5 Rejoinder

After the elected invention is allowed, **rejoinder** permits previously withdrawn claims to be added back if they depend from or otherwise require all the limitations of an allowed claim:
- Withdrawn method claims may be rejoined to an allowed product claim
- Withdrawn product claims may be rejoined to an allowed process claim
- Applicant requests rejoinder; examiner decides
- Rejoined claims do NOT trigger a new restriction (protection for the applicant)

## 2.6 Withdrawn Claims

Non-elected claims are "withdrawn from consideration" but remain in the application until:
- Rejoinder occurs, OR
- The non-elected inventions are pursued in a divisional, OR
- The claims are canceled

Withdrawn claims are NOT examined for patentability but can be amended for clarity (formatting, antecedent basis) during prosecution.

## 2.7 Continuing the Non-Elected Inventions

After restriction, the non-elected inventions can be pursued in a **divisional application**:
- Divisional gets §120 benefit of parent
- Enjoys §121 safe harbor (no ODP with parent for these claims)
- Divisional must be filed before parent abandons/issues
- Consonance must be maintained (non-elected claims stay in divisional)

## 2.8 Timing for Divisional

The divisional can be filed:
- While the parent is pending — yes, this is the safe path
- After the parent issues/abandons — no §120 benefit (violates copendency)

Best practice: file divisional BEFORE parent issues, even if this means filing immediately after the restriction is entered.`,
      importantNote: `**Election with traversal** preserves the right to argue the restriction was improper without losing the benefit of continued examination. If the examiner refuses to withdraw the restriction, the applicant can appeal or take the restriction as final and pursue divisionals.`,
    },
    {
      id: 'restriction-strategy',
      title: `3. Strategic Use of Restrictions and Divisionals`,
      content: `## 3.1 Advantages of Restriction Practice

For the applicant:
- Restriction creates §121 safe harbor → no ODP between parent and divisional
- Divisionals may issue independently with separate terms
- Each invention gets a fresh patent term (20 years from each filing, subject to priority)

For the examiner:
- Reduced search burden on single application
- Cleaner examination of each invention

## 3.2 Restriction as a Window Into Examiner Thinking

The restriction requirement often signals which combinations the examiner thinks are patentably distinct. This can inform:
- How to draft claims in future applications
- Which embodiments to pursue as primary claims
- Strategy for continuation and divisional practice

## 3.3 Common Restriction Scenarios

### Scenario A: Product + Process
- Claim 1: A widget [product]
- Claim 10: A method of manufacturing a widget [process]
- Examiner restricts → applicant elects the product (Claim 1)
- Method claims (10) pursued in a divisional

### Scenario B: Product + Method of Use
- Claim 1: A drug composition
- Claim 10: A method of treating disease X with the composition
- Restriction → elect composition
- Method of treatment in divisional

### Scenario C: Species Election
- Claim 1: A composition comprising compound selected from the group consisting of A, B, C, D
- If A, B, C, D are patentably distinct, election of one species required
- Remaining species withdrawn; can be pursued in continuations or amendments

## 3.4 Interaction with §121 Safe Harbor

If a divisional is NOT filed in direct response to a restriction (e.g., a continuation that is not a divisional), it does NOT get the §121 safe harbor. ODP rejections may be made against the continuation.

**Example**: Parent → restriction → applicant elects, some claims withdrawn. Applicant files a continuation (not divisional) pursuing the withdrawn claims with amendments. This is NOT a divisional. §121 safe harbor may not apply. → ODP rejection possible.

Best practice: file a true divisional, retaining only non-elected claims without amendment that would make them patentably distinct from the restricted grouping.

## 3.5 Loss of Safe Harbor

The §121 safe harbor can be LOST if:
- The applicant adds claims to the divisional that were elected in the parent (ODP risk returns)
- The restriction "consonance" is broken (the division no longer tracks the examiner's original grouping)

## 3.6 Appeal of Restriction

If the applicant traverses and the examiner maintains the restriction:
- Applicant may file a **petition** under 37 CFR §1.144 within 2 months of the next Office Action
- Alternative: elect with traversal, continue prosecution, and raise the restriction issue in appeal or litigation
- Petitions to withdraw restriction are rare and difficult to win`,
    },
  ],
  keyTakeaways: [
    'Restriction test: (1) independent and distinct inventions, AND (2) serious search burden.',
    'Common restriction types: product + process, product + method of use, species within a genus.',
    'Applicant must elect an invention; election with traversal preserves the right to argue the restriction later.',
    'Non-elected claims are "withdrawn from consideration" and can be pursued in divisionals.',
    '§121 safe harbor: divisional filed in response to restriction cannot create ODP with parent. Requires consonance.',
    'Rejoinder: after allowance of the elected invention, withdrawn claims may be rejoined if they depend on or require the allowed claims.',
    'PCT unity of invention (§1.475) applies to national-stage applications — stricter standard limiting examiner\'s ability to restrict.',
    'Petition under 37 CFR §1.144 to contest restriction. Rare successful; most applicants elect and file divisionals.',
  ],
},

pf_office_action_timing: {
  topicId: 'pf_office_action_timing',
  title: `First Action Timelines and Response Deadlines`,
  domainWeight: 'Filing & Prosecution · MPEP 710',
  overview: `The USPTO sets statutory and regulatory deadlines that drive prosecution pace. A non-final Office Action typically allows 3 months to respond (shortened statutory period), extendable to 6 months (maximum statutory period). Extensions under 37 CFR §1.136(a) are automatic with fee; extensions under §1.136(b) require showing of extraordinary circumstances. Missing these deadlines results in abandonment unless revived. Exam questions on timing are frequent and precise.`,
  sections: [
    {
      id: 'oa-timing-basics',
      title: `1. Basic Timing Rules`,
      content: `## 1.1 Statutory Maximum (35 U.S.C. §133)

The statutory maximum period for response to any USPTO action is **6 months** from the mailing date. Failure to respond within 6 months results in **automatic abandonment** (no extension possible beyond 6 months, with narrow exceptions).

## 1.2 Shortened Statutory Period (SSP)

The USPTO sets a "shortened statutory period" for each action, typically:
- **3 months** for most non-final Office Actions
- **3 months** for final Office Actions
- **2 months** for notices of missing parts, Ex parte Quayle actions
- **1 month** for restriction requirements (shorter than most)
- **3 months** for notices of appeal brief due dates

The SSP starts running from the mailing date of the action.

## 1.3 Extensions (37 CFR §1.136)

Two types of extensions:

### §1.136(a) — Automatic Extensions
- Available for most actions (not for design patents, interferences, etc.)
- Can extend up to the 6-month maximum
- Automatic upon payment of fee (no showing of cause required)
- Each 1 month = 1 extension fee tier (increasing cost)

Extension fee structure (approximate 2025 rates, regular entity):
- 1 month: $220
- 2 months: $640
- 3 months: $1,480
- 4 months: $2,360
- 5 months: $3,240

### §1.136(b) — Extension by Petition
- Required when extraordinary circumstances warrant
- Must file petition explaining the circumstances
- Examples: illness, natural disaster, serious emergencies
- Extension beyond what §1.136(a) allows (rare, subject to discretion)

## 1.4 The 6-Month Absolute Maximum

No extension beyond 6 months from the SSP start date (mailing date), except for:
- Revivals under 37 CFR §1.137 for unintentional delay
- Petitions under 37 CFR §1.313 to withdraw from issue
- Certain extraordinary petitions

## 1.5 Saturday/Sunday/Holiday Rule

If a deadline falls on a Saturday, Sunday, or federal holiday, the deadline is the next business day (35 U.S.C. §21(b)).

## 1.6 Application Filing Date vs. Mailing Date

- **Filing date**: the date an application is filed at the USPTO
- **Mailing date**: the date the USPTO sent an action to the applicant (used to calculate response deadline)
- **Receipt date** (old practice): less relevant today with electronic mailing

## 1.7 Express Mail / Priority Mail Express

Older rule: the "certificate of mailing" or "Express Mail date" can establish filing as of the date of mailing, not the date received at the USPTO. Relevant for paper filings, which are rare today.

For electronic filings, the filing date is the date the submission reaches Patent Center or EFS-Web.`,
      examTip: `The **6-month absolute maximum** is heavily tested. Memorize: SSP is typically 3 months for OA responses, extendable by §1.136(a) fee to 6 months total. Beyond 6 months → abandonment unless revived. Weekend/holiday rule extends to next business day.`,
    },
    {
      id: 'oa-actions-and-responses',
      title: `2. Types of Office Actions and Response Requirements`,
      content: `## 2.1 First Non-Final Office Action

The first substantive action from the examiner. Typical contents:
- Restriction requirement (if applicable)
- Rejections (e.g., §101, §102, §103, §112)
- Objections (informal issues like drawings, formalities)
- Allowable subject matter identified (if any)

**Response deadline**: 3 months (SSP); extendable to 6 months.

**Response requirements** (37 CFR §1.111):
- Address every rejection, objection, and requirement
- Traverse or remedy each issue
- Can include amendments, arguments, evidence

## 2.2 Final Office Action

A "final rejection" closes the prosecution in the current round:
- Generally issued after the applicant has had one round of response to non-final
- Applicant has limited options: RCE, appeal, after-final amendment (limited), abandonment

**Response deadline**: 3 months (SSP); extendable to 6 months.

**Response options at final**:
- File Request for Continued Examination (RCE) with fee
- File an appeal (Notice of Appeal + appeal brief)
- File an amendment that meets narrow after-final rules (may or may not be entered)
- File an After Final Consideration Pilot (AFCP 2.0) request
- Abandon

## 2.3 Notice of Appeal

After final rejection, applicant may file a Notice of Appeal. Triggers:
- Fee required
- 2 months from filing notice to file appeal brief
- Examiner reviews; may issue an Examiner's Answer or withdraw the rejection

## 2.4 Advisory Action

After an after-final amendment or response, the examiner may issue an **Advisory Action**:
- Informs the applicant whether the response overcomes the final rejection
- Does not restart any deadlines
- Applicant should file RCE or appeal within the original 6-month window

## 2.5 Notice of Allowance

- Application is ready for issuance
- Applicant has **3 months** to pay the issue fee (no extensions for issue fee under §1.136(a), but under §1.137 for unintentional delay)
- Failure to pay issue fee → abandonment
- Surcharge available via petition for late issue fee if unintentional (§1.137)

## 2.6 Ex parte Quayle Action

A specialized action when the only outstanding issues are formal (e.g., claim formatting, drawings):
- Prosecution is CLOSED on the merits
- Applicant responds only to formal issues
- Typically 2-month SSP; extendable

## 2.7 Notice to File Missing Parts

Issued by OPAP if application is incomplete. Typical deadlines:
- 2 months for initial response
- Extendable to 6 months total
- Must include missing parts + fees + surcharge (if applicable)`,
    },
    {
      id: 'oa-certificate-of-mailing',
      title: `3. Certificate of Mailing and Date Calculations`,
      content: `## 3.1 Certificate of Mailing (37 CFR §1.8)

Documents mailed to the USPTO via first-class mail can be timely if accompanied by a Certificate of Mailing:
- Certificate states the date of mailing
- Document is deemed filed as of the mailing date, even if received later
- Certificate must be on the document or attached separately

### Exceptions (Cannot Use Certificate of Mailing):
- Pay issue fee
- Initial filings (must have actual receipt)
- Interference papers

## 3.2 Priority Mail Express (Formerly "Express Mail")

Documents sent via USPS Priority Mail Express can be timely as of the date the package was deposited at the USPS:
- Works for initial application filings
- Works for any paper required to be filed
- Use the Express Mail number as the identifier
- Even if USPTO receives the package later, filing date is the PME deposit date

## 3.3 Electronic Filing (Primary Method)

For electronic filings:
- Filing date is the date Patent Center or EFS-Web receives the submission
- Time zone is USPTO's time zone (Eastern)
- A submission at 11:59 PM Eastern on the deadline is timely
- A submission at 12:01 AM Eastern the next day is late

## 3.4 Calculating Deadlines

To calculate a response deadline from an action's mailing date:
1. Identify the mailing date (shown on the action)
2. Add the SSP (typically 3 months)
3. If that date is a weekend/holiday, extend to next business day
4. Beyond that, up to 6 months total from mailing, §1.136(a) extensions with fee
5. After 6 months from mailing date → abandonment

### Example
- OA mailed March 1, 2025
- SSP = 3 months → June 1, 2025 (Sunday) → Monday June 2, 2025 deadline
- §1.136(a) extensions add 1-3 months (with fee) → up to August 1, 2025
- Final hard deadline: September 1, 2025 (6 months); Labor Day = next business day

## 3.5 Common Timing Traps

- Failing to account for weekend/holiday extensions
- Confusing SSP with 6-month maximum
- Missing that extensions §1.136(a) do not extend beyond 6 months
- Treating the mailing date as the filing date of the response (it's not)
- Assuming the Advisory Action extends the response deadline (it does not)`,
    },
  ],
  keyTakeaways: [
    'Statutory maximum response period: 6 months from mailing date (35 USC §133). Absolute — no extensions beyond except revival.',
    'Shortened Statutory Period (SSP) typically 3 months for OA responses. Set by examiner on each action.',
    '37 CFR §1.136(a) extensions: automatic upon fee, up to 6-month maximum. §1.136(b) extensions: require petition with cause.',
    'Weekend/holiday rule: deadlines falling on Sat/Sun/federal holiday extend to next business day (35 USC §21(b)).',
    'Response at final: RCE, appeal, narrow after-final amendment, or abandonment. After-final amendments are limited.',
    'Advisory Action informs whether after-final response overcomes rejection but does NOT extend deadlines.',
    'Issue fee: 3 months to pay after Notice of Allowance; late fee under §1.137 (unintentional delay) but no §1.136(a) extensions.',
    'Certificate of Mailing allows paper filings to be timely as of mailing date (with exceptions). Priority Mail Express also available. Electronic filings dominant.',
  ],
},

pf_extensions: {
  topicId: 'pf_extensions',
  title: `Extensions of Time and Petitions for Revival`,
  domainWeight: 'Filing & Prosecution · MPEP 710.02, 711',
  overview: `When deadlines are missed or additional time is needed, the applicant can seek extensions (before abandonment) or revival (after abandonment). 37 CFR §1.136(a) provides automatic extensions by fee up to 6-month statutory maximum. Abandoned applications can be revived under 37 CFR §1.137 for unintentional delay (most common) or 37 CFR §1.17(l) for unavoidable delay. Understanding when each mechanism applies is frequently tested.`,
  sections: [
    {
      id: 'extensions-automatic',
      title: `1. Automatic Extensions — §1.136(a)`,
      content: `## 1.1 Coverage

§1.136(a) extensions are available for most deadlines in patent prosecution, including:
- Response to Office Actions (non-final and final)
- Response to Notice to File Missing Parts
- Response to Ex parte Quayle actions
- Response to requirements for information
- Filing of appeal briefs

## 1.2 How They Work

- Payment of the extension fee
- No need to show cause or file petition
- Extension granted automatically upon fee payment
- Can be filed at the time of response (extension "retroactively" covers the delay)

## 1.3 Maximum Extension

The extension cannot exceed the 6-month statutory maximum:
- SSP (e.g., 3 months) + extensions (up to 3 more months) = 6 months total
- Cannot extend beyond 6 months from mailing date under §1.136(a)

## 1.4 Fee Structure

Extension fees are tiered by month. Approximate regular-entity fees (2025):

| Months | Regular | Small Entity | Micro Entity |
|---|---|---|---|
| 1 | $220 | $88 | $44 |
| 2 | $640 | $256 | $128 |
| 3 | $1,480 | $592 | $296 |
| 4 | $2,360 | $944 | $472 |
| 5 | $3,240 | $1,296 | $648 |

Note: fees are cumulative (month 3 = cost of months 1+2+3 combined).

## 1.5 Not Available for All Actions

§1.136(a) does NOT apply to:
- Payment of the issue fee (separate rules under §1.137)
- Filing of a notice of appeal for reexamination proceedings
- Interference papers
- Some final notices

## 1.6 Strategic Timing

- File extensions AT RESPONSE TIME, not in advance
- Pay the fee only if actually needed
- One extension request can cover multiple months

## 1.7 Petition for Extraordinary Extension — §1.136(b)

If more than 6 months is needed:
- Must file petition showing extraordinary circumstances
- Rarely granted
- Relief usually through revival instead

## 1.8 The Issue Fee Exception

Issue fee deadline is **not** extendable under §1.136(a). If missed:
- Abandonment results
- Revival under §1.137 for unintentional delay (with fee)
- Surcharge may apply`,
    },
    {
      id: 'revival-unintentional',
      title: `2. Revival Under §1.137 — Unintentional Delay`,
      content: `## 2.1 When an Application Is Abandoned

An application is abandoned when:
- Applicant fails to respond within 6 months of mailing date (absent extensions)
- Applicant expressly abandons
- Failure to pay issue fee (within 3 months + revival window)

## 2.2 §1.137 — Unintentional Delay Standard

Applicable when the abandonment was **unintentional**:
- Applicant states that the delay was unintentional from the time the application became abandoned to the time of the petition
- Pays the petition fee (relatively modest — approximately $2,100 for regular entity, reduced for small/micro)
- Typically granted if statement is credible

## 2.3 What "Unintentional" Means

The applicant did not consciously choose to abandon. Examples:
- Docketing error (missed the deadline)
- Illness or temporary unavailability of responsible person
- Miscommunication between attorney and client
- Mail delay

"Unintentional" does NOT include:
- Strategic decision to let application lapse and reconsider
- Deliberate abandonment that is later regretted (unless no intent to permanently abandon was formed)

## 2.4 Timing of Revival

§1.137 petition must be filed **promptly** after the applicant becomes aware of the abandonment. "Promptly" is not defined but has been interpreted as:
- Within 2 months of becoming aware (strong position)
- Up to 1 year may be acceptable with good explanation
- Lengthy unexplained delays may result in denial

## 2.5 Abandonment History

The USPTO may consider the applicant's history:
- Multiple abandonments in a portfolio → scrutinized more
- Pattern of delays and revivals → may suggest intentional conduct
- USPTO has broad discretion to deny revival when statement lacks credibility

## 2.6 What Happens on Revival

- Application is restored to pending status
- Response/fee/document that was missing must be filed with the petition
- Examination resumes where it left off
- Any deadlines that would have been missed during the abandonment period are handled under normal rules

## 2.7 Content of Petition

The petition must include:
1. The reply (or document that was originally due)
2. The required petition fee
3. A statement that the entire delay was unintentional
4. Any required fees that should have been paid

## 2.8 Duty of Candor

The statement that delay was unintentional is a factual statement. False statements to the USPTO can constitute inequitable conduct. The practitioner should not sign such a statement without confirming the facts.`,
      importantNote: `The "unintentional" standard is BROAD. Most good-faith abandonments qualify — docketing errors, illness, miscommunication. But the applicant must ALWAYS include the required statement and must be willing to certify that the statement is true. False statements create serious liability risks.`,
    },
    {
      id: 'revival-other',
      title: `3. Other Revival Mechanisms and Special Cases`,
      content: `## 3.1 §1.17(l) — "Unavoidable Delay" (Historical)

Before 2013, §1.137 also allowed revival for "unavoidable delay" — a stricter standard than unintentional. The Patent Law Treaty Implementation Act in 2013 merged both into the single "unintentional" standard. The "unavoidable" language is largely historical but may appear on exam questions referencing older cases.

## 3.2 §1.313 — Withdrawal from Issue

If a Notice of Allowance has been issued but the applicant wants to continue prosecution (e.g., to submit an IDS, amend claims):
- File petition under 37 CFR §1.313
- Reasons: errors in claims, need to submit prior art, need to claim additional subject matter
- Fee required
- Petition granted at USPTO's discretion
- If granted, application returns to pending status; further action follows

## 3.3 §1.481 — Express Abandonment

Applicant can expressly abandon an application. This is:
- Voluntary
- Not reversible by §1.137 (abandonment was intentional)
- Useful when withdrawing for strategic reasons (e.g., filing a continuation)

## 3.4 Lost Applications

If an application is lost in the USPTO's system:
- Filing receipt may be unavailable
- File a petition to restore the application under §1.181 if necessary
- Rare in the electronic era

## 3.5 Revival of Provisional

Provisional applications CAN be revived if abandoned under §1.137 for unintentional delay:
- The abandonment typically occurs if missing components or fees aren't corrected
- Revival restores the provisional, but the 12-month clock continues from the original filing date

## 3.6 Revival After Final Abandonment vs. Non-Final

The §1.137 procedure is the same whether abandonment followed a final OA, notice of allowance, or any other action. The timing within the 6-month response period or issue fee period determines whether extensions were first available under §1.136(a).

## 3.7 Revival and Statutory Bars

Revival does NOT restore the application's effective filing date for §102 purposes. The filing date is unchanged. But the RESPONSE is accepted as of the revival date.

## 3.8 Practical Timing Example

- OA mailed: January 1, 2025
- SSP: 3 months → April 1, 2025
- §1.136(a) max: 6 months → July 1, 2025
- Applicant misses July 1 deadline → application ABANDONED on July 2
- Applicant realizes in December 2025 → files §1.137 petition with delayed response, petition fee, and unintentional-delay statement
- Revival likely granted if statement is credible; application restored`,
    },
  ],
  keyTakeaways: [
    '§1.136(a) extensions: automatic upon fee, up to 6-month statutory maximum. Cumulative fee structure.',
    'Extensions NOT available for: issue fee payment, certain reexamination deadlines, interference papers.',
    '§1.137 revival: for unintentional delay, most common revival mechanism. Requires statement, petition fee, and the originally-due document.',
    'Unintentional = did not consciously choose to abandon. Docketing errors, illness, miscommunication qualify. Strategic lapses don\'t.',
    'Revival petition should be filed PROMPTLY after realizing abandonment. Lengthy unexplained delays may result in denial.',
    '§1.17(l) "unavoidable delay" standard was merged into §1.137 "unintentional" standard in 2013 (stricter old standard largely gone).',
    '§1.313 withdrawal from issue: after NOA, lets applicant reopen prosecution. Requires petition and fee.',
    'Provisional applications can be revived under §1.137. Express abandonment under §1.481 is voluntary and not reversible.',
  ],
},

pf_allowance_issue: {
  topicId: 'pf_allowance_issue',
  title: `Notice of Allowance and Issue Fee`,
  domainWeight: 'Filing & Prosecution · MPEP 1303–1311',
  overview: `After the examiner determines the claims are allowable, the USPTO mails a Notice of Allowance. The applicant has 3 months to pay the issue fee — no extensions under §1.136(a). Between the allowance and issue, the applicant can still: withdraw from issue (§1.313), file an IDS (under strict rules), or file a continuation. After issuance, the patent term begins and post-grant procedures govern any changes. This final prosecution stage has specific procedural requirements that are commonly tested.`,
  sections: [
    {
      id: 'notice-of-allowance',
      title: `1. Notice of Allowance (NOA)`,
      content: `## 1.1 When NOA Is Issued

The USPTO mails a Notice of Allowance when:
- All claims have been examined and found allowable
- All rejections, objections, and requirements have been resolved
- Drawings (if required) are approved
- Any formal issues are resolved

## 1.2 Contents of the NOA

The NOA provides:
- Confirmation that the application is in condition for allowance
- Amount of the issue fee due
- Publication fee (if requested)
- 3-month deadline to pay the issue fee
- Allowed claim set
- Issue date (will be set upon payment)

## 1.3 Issue Fee Deadline

The issue fee must be paid **within 3 months** of the NOA mailing date. This is a strict deadline:
- No extensions under §1.136(a)
- Revival under §1.137 for unintentional delay is available with petition fee

## 1.4 Issue Fee Amount

Approximate fees (2025, regular entity):
- Issue fee: $1,200
- Publication fee: $0 (after 2013, no separate publication fee)
- Small entity: 60% discount
- Micro entity: 80% discount

## 1.5 What If the Applicant Disagrees With the Allowance?

If the applicant wants to make changes:
- Changes to claims (amendments): File petition under §1.313 to withdraw from issue + amendment + response
- Changes to specification: Very limited options; certificate of correction may be possible post-issue (§1.322)
- Strategy change: File a continuation before paying issue fee to preserve options`,
      examTip: `**3-month deadline to pay issue fee is NOT extendable** under §1.136(a). Missing it causes abandonment. Revival under §1.137 requires a petition with fee and unintentional-delay statement. This is a common test trap.`,
    },
    {
      id: 'between-noa-and-issue',
      title: `2. Options Between NOA and Issue`,
      content: `## 2.1 Withdrawal from Issue (§1.313)

If the applicant needs to make changes after NOA:
- File petition under 37 CFR §1.313
- Reasons: need to amend claims, submit newly-discovered prior art, etc.
- Fee required
- Discretionary: USPTO may or may not grant

If granted, the application returns to pending status and prosecution resumes.

## 2.2 Late IDS After NOA

Under 37 CFR §1.97(d), an IDS can be filed after NOA but before payment of issue fee if:
- §1.97(e) statement is provided (no knowledge more than 3 months earlier OR derived from a foreign office action within 3 months)
- Fee is paid
- Strict timing: after NOA, before issue fee payment

If the IDS is filed AFTER issue fee payment or after the issue date, it is NOT considered unless the applicant files a petition and the USPTO grants a withdrawal from issue.

## 2.3 Continuation Application

Before issue, applicant can file a continuation:
- Preserves the parent's benefit under §120
- Allows pursuit of different claim sets
- Must be filed BEFORE the parent issues (copendency)

The parent issues Tuesday mornings (typically). The continuation must be filed no later than Monday of that week.

## 2.4 Express Abandonment

If the applicant decides not to proceed to issue:
- File petition for express abandonment under §1.481
- Application abandoned intentionally
- No revival available under §1.137 (because intentional)

Rare, but relevant when applicant has filed a continuation and no longer wants the parent to issue.

## 2.5 Amendment After NOA

If an amendment is filed after NOA (with fees):
- Examiner may allow it without withdrawing from issue (if simple and non-substantive)
- Complex amendments may require withdrawal from issue
- Amendments must comply with 37 CFR §1.312 (amendments after final/allowance)

## 2.6 Prior Art Submissions

If the applicant becomes aware of material prior art after NOA:
- File an IDS under §1.97(d) if before issue fee payment
- File a withdrawal from issue (§1.313) if after issue fee payment
- Failure to disclose material prior art known to the applicant could be inequitable conduct`,
    },
    {
      id: 'patent-issue-process',
      title: `3. Patent Issuance and Post-Issue Actions`,
      content: `## 3.1 Issue Date

The USPTO typically issues patents on **Tuesdays**. After issue fee payment:
- Issue date is scheduled (generally 4-8 weeks after payment)
- Issue date is listed in the Notice of Allowance or PAIR system

## 3.2 Patent Number

- Issued patents are numbered sequentially (utility patents above 11,000,000 as of 2023)
- Patent number is assigned at issue
- Design patents have "D" prefix (e.g., D1,000,000)
- Plant patents have "PP" prefix

## 3.3 Publication

On the issue date:
- Patent is published in the Official Gazette
- Full patent text becomes publicly available via USPTO Public PAIR
- Patent is searchable in databases (Google Patents, etc.)

## 3.4 Certificate of Correction (§1.322, §1.323)

After issue, the applicant can request minor corrections via a Certificate of Correction:
- Clerical or typographical errors made by the USPTO (§1.322) — no fee
- Minor errors made by the applicant (§1.323) — fee required
- Cannot change substantive claim scope
- Cannot add or remove claims

## 3.5 Disclaimer of Claim

After issue, a patent owner may:
- Disclaim individual claims under 35 U.S.C. §253
- Disclaim the remaining patent term (terminal disclaimer) for ODP or term alignment
- These are recorded at the USPTO

## 3.6 Maintenance Fees

Utility patents require maintenance fees at:
- 3.5 years from issue
- 7.5 years from issue
- 11.5 years from issue

Failure to pay → patent EXPIRES for failure to pay maintenance fees. Can be revived under §41(c)(1) if delay was unintentional (2.5-year window + fee).

Design patents and plant patents do NOT require maintenance fees.

## 3.7 Patent Term

Utility patent term: 20 years from effective filing date (earliest non-provisional in the chain). Extended by Patent Term Adjustment (PTA) for USPTO delays.

Design patent term: 15 years from issue.

Plant patent term: 20 years from earliest filing.`,
    },
  ],
  keyTakeaways: [
    'Issue fee deadline: 3 months from NOA mailing date. NOT extendable under §1.136(a). Late payment requires §1.137 revival with petition fee.',
    'IDS after NOA but before issue fee payment: allowed under §1.97(d) with statement + fee.',
    '§1.313 withdrawal from issue: petition to return to pending status for amendments, IDS, etc. Discretionary.',
    'Continuation must be filed BEFORE parent issues (copendency). Issue typically Tuesday mornings.',
    'Certificate of Correction: USPTO errors (§1.322, no fee), applicant errors (§1.323, fee). Cannot change substantive claim scope.',
    'Maintenance fees for utility patents: 3.5, 7.5, 11.5 years from issue. Missed = patent expires. Revival under §41(c)(1) within 2.5 years for unintentional delay.',
    'Patent term: 20 years from earliest non-provisional EFD (utility), 15 years from issue (design), 20 years from filing (plant).',
    'Express abandonment post-NOA is voluntary and cannot be revived under §1.137.',
  ],
},

pf_preissuance: {
  topicId: 'pf_preissuance',
  title: `Preissuance Submissions and Third-Party Participation`,
  domainWeight: 'Filing & Prosecution · MPEP 1134',
  overview: `Third parties (not the applicant) have limited ways to challenge a pending application. The AIA introduced preissuance submissions under 35 U.S.C. §122(e) — allowing third parties to submit relevant prior art to the USPTO for consideration during examination. Preissuance submissions must be filed within specific time windows, contain a concise description of relevance, and meet format requirements. Understanding this procedure is tested because it's a key AIA innovation.`,
  sections: [
    {
      id: 'preissuance-basics',
      title: `1. Preissuance Submissions (§122(e))`,
      content: `## 1.1 Statutory Basis

35 U.S.C. §122(e) (added by AIA) allows any third party to submit **patents, published patent applications, and other printed publications** that may be of potential relevance to the examination of a pending application.

## 1.2 Time Window

Preissuance submissions can be filed:
- Before the earlier of:
  - First Office Action on the merits, OR
  - 6 months after the application's publication date

The publication date is typically 18 months after filing. So the window is roughly:
- From publication (18 months after filing) to about 24 months after filing (or first OA, whichever comes first)

After a Notice of Allowance, no more preissuance submissions are allowed.

## 1.3 What Can Be Submitted

- Patents (US or foreign)
- Published patent applications
- Printed publications (articles, books, websites, etc.)

What CANNOT be submitted:
- Oral art (not memorialized in writing)
- Prior public use or on-sale evidence
- Arguments about inventorship or inequitable conduct

## 1.4 Required Content

A preissuance submission must include:
1. A list of references cited (format similar to IDS)
2. Copies of each reference
3. **Concise description of the asserted relevance** of each reference
4. Statement of compliance with §1.290(a)-(d)
5. Fee (modest, per document or per reference)

## 1.5 Anonymous Submission Allowed

The third party can submit anonymously. The identity of the submitting party is NOT made public.

## 1.6 USPTO's Treatment

The examiner considers preissuance submissions as part of the prior art. The examiner may or may not cite the references. The applicant has no duty to respond specifically to a preissuance submission.

## 1.7 Limitation on Submissions

- A submitter can file MULTIPLE references in a single submission
- The submitter cannot submit an argument more sophisticated than "here is prior art; here's why it's relevant" — no legal briefing

## 1.8 Fee Structure (37 CFR §1.290)

Approximately (2025):
- 1-10 items: $180 (first submission, small entity rates apply)
- 11-20 items: $360
- Etc.`,
    },
    {
      id: 'preissuance-strategy',
      title: `2. Strategic Use of Preissuance Submissions`,
      content: `## 2.1 Why File a Preissuance Submission?

For competitors of the applicant:
- Prevent the grant of overly broad patents
- Bring relevant prior art to the examiner's attention
- Cheaper and faster than post-grant review

For members of the industry:
- Protect freedom to operate
- Influence patent scope

## 2.2 Timing Consideration

Preissuance submissions should be filed EARLY:
- Before first Office Action is ideal (examiner hasn't formed a position)
- Window closes 6 months after publication OR at first OA

## 2.3 How Applicants Can Respond

The applicant typically:
- Does not need to respond in writing
- May amend claims to distinguish over the submitted prior art (to reduce examiner's rejection)
- May submit comments or arguments in a supplemental response

## 2.4 Third-Party Observations (Under PCT)

For PCT applications, third-party observations can be submitted to WIPO:
- Different procedure than USPTO preissuance submissions
- Limited time windows
- Observations are forwarded to the designated offices

## 2.5 Distinction from Post-Grant Review

Preissuance submissions occur DURING examination of a pending application. Post-grant proceedings (IPR, PGR, CBM) occur AFTER issuance — different procedures, different effects.

## 2.6 Limits of Preissuance Submissions

Preissuance submissions do NOT:
- Allow participation in examination
- Allow briefing or legal arguments
- Bind the examiner or applicant
- Estop the third party from later challenging the patent

## 2.7 Relationship to Protest (§1.291)

Protests under 37 CFR §1.291 are a different pre-grant mechanism:
- More limited than preissuance submissions
- Typically require a showing of lack of novelty
- Rarely used; preissuance submissions are the standard path for third-party submissions`,
      importantNote: `Preissuance submissions (§122(e)) are the primary AIA third-party mechanism. Windows are narrow — submissions must generally be filed BEFORE the first Office Action OR within 6 months of publication. Concise description of relevance is required. Anonymous filings allowed.`,
    },
  ],
  keyTakeaways: [
    'Preissuance submissions (§122(e)): AIA-created mechanism for third parties to submit prior art to USPTO during examination.',
    'Submission window: before first Office Action OR within 6 months of publication, whichever is earlier. Ends at Notice of Allowance.',
    'What can be submitted: patents, published applications, printed publications. NOT oral art or inequitable conduct arguments.',
    'Required content: list of references, copies, concise description of relevance, compliance statement, fee.',
    'Submissions may be filed ANONYMOUSLY. Applicant has no duty to respond specifically.',
    'Examiner considers the references as prior art but is not obligated to cite them.',
    'Distinction: preissuance submissions occur before issuance; post-grant (IPR, PGR) occur after issuance — different procedures.',
    'Protests under §1.291 are a narrower alternative; preissuance submissions are the more commonly used path.',
  ],
},

}; // end PATENT_BAR_COURSE

export function hasPatentBarCourseContent(topicId: string): boolean {
  return topicId in PATENT_BAR_COURSE;
}

export function getPatentBarCourseContent(topicId: string): TopicLesson | null {
  return PATENT_BAR_COURSE[topicId] || null;
}

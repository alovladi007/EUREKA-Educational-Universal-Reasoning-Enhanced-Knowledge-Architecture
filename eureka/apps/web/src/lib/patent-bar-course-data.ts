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

}; // end PATENT_BAR_COURSE

export function hasPatentBarCourseContent(topicId: string): boolean {
  return topicId in PATENT_BAR_COURSE;
}

export function getPatentBarCourseContent(topicId: string): TopicLesson | null {
  return PATENT_BAR_COURSE[topicId] || null;
}

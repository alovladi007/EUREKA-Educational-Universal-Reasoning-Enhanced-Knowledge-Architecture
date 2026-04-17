/**
 * Patent Bar (USPTO Registration Exam) — Question Bank
 * 400 questions across 8 sections.
 * AI-generated. Requires SME review.
 */

export interface PatentBarQuestion {
  id: string;
  topicId: number;
  subtopic: string;
  difficulty: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const TOPIC_ID_MAP: Record<number, string> = {
  0: 'patentability',
  1: 'application_prep',
  2: 'filing_prosecution',
  3: 'office_responses',
  4: 'pct_international',
  5: 'post_issuance',
  6: 'design_plant',
  7: 'ethics_conduct',
};

export function getPatentBarTopicSectionId(numericId: number): string {
  return TOPIC_ID_MAP[numericId] || 'patentability';
}

export const PATENT_BAR_QUESTIONS: PatentBarQuestion[] = [
  // =============================================
  // TOPIC 0 — PATENTABILITY & PRIOR ART (70 Qs)
  // =============================================

  // --- §101 Subject Matter (15 questions) ---
  {
    id: 'pb_t0_001',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 1,
    question: 'Under 35 U.S.C. §101, which of the following categories of invention is patent-eligible?',
    options: [
      'A mathematical formula standing alone',
      'A new and useful process for manufacturing a chemical compound',
      'An abstract idea without any practical application',
      'A naturally occurring mineral in its natural state',
    ],
    correct: 1,
    explanation:
      'Under §101, patent-eligible subject matter includes any new and useful process, machine, manufacture, or composition of matter. A manufacturing process for a chemical compound is a "process" and thus patent-eligible. Mathematical formulas alone, abstract ideas, and naturally occurring substances are judicial exceptions.',
  },
  {
    id: 'pb_t0_002',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 1,
    question: 'Which Supreme Court case established the two-step framework for determining patent eligibility of abstract ideas under §101?',
    options: [
      'KSR International Co. v. Teleflex Inc.',
      'Alice Corp. v. CLS Bank International',
      'Graham v. John Deere Co.',
      'Markman v. Westview Instruments',
    ],
    correct: 1,
    explanation:
      'Alice Corp. v. CLS Bank International (2014) established the two-step framework (the Alice/Mayo test): (1) determine whether the claim is directed to a judicial exception (abstract idea, law of nature, or natural phenomenon), and (2) if so, determine whether the claim recites additional elements that amount to "significantly more" than the judicial exception.',
  },
  {
    id: 'pb_t0_003',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 2,
    question: 'Under the Alice/Mayo two-step framework, Step 2A asks whether the claim is "directed to" a judicial exception. Under the USPTO\'s 2019 Revised Patent Subject Matter Eligibility Guidance, Step 2A is further divided into two prongs. What does Prong Two evaluate?',
    options: [
      'Whether the claim recites a judicial exception',
      'Whether the judicial exception is integrated into a practical application',
      'Whether the claim includes an inventive concept',
      'Whether the claim is anticipated by prior art',
    ],
    correct: 1,
    explanation:
      'Under the 2019 PEG, Step 2A Prong One asks whether the claim recites a judicial exception. If yes, Prong Two asks whether the judicial exception is integrated into a practical application. Only if the answer to Prong Two is "no" does the analysis proceed to Step 2B (inventive concept). See MPEP §2106.',
  },
  {
    id: 'pb_t0_004',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 2,
    question: 'In Mayo Collaborative Services v. Prometheus Laboratories, Inc., the Supreme Court held that claims directed to which of the following were patent-ineligible?',
    options: [
      'A genetically modified organism',
      'A method of hedging risk in energy markets',
      'Correlations between blood test results and optimal drug dosages (a law of nature)',
      'A business method implemented on a generic computer',
    ],
    correct: 2,
    explanation:
      'In Mayo (2012), the Court held that claims directed to correlations between thiopurine metabolite levels and dosage effectiveness were directed to a law of nature and lacked an inventive concept sufficient to transform the nature of the claims into a patent-eligible application. This case, together with Alice, established the two-step eligibility framework.',
  },
  {
    id: 'pb_t0_005',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 2,
    question: 'In Bilski v. Kappos, the Supreme Court considered whether the "machine-or-transformation" test is the sole test for patent eligibility of process claims under §101. What did the Court hold?',
    options: [
      'The machine-or-transformation test is the sole test for process claims',
      'The machine-or-transformation test is a useful clue but not the sole test',
      'Process claims are never patent-eligible under §101',
      'The machine-or-transformation test applies only to composition of matter claims',
    ],
    correct: 1,
    explanation:
      'In Bilski v. Kappos (2010), the Supreme Court held that the machine-or-transformation test is a "useful and important clue" for determining patent eligibility of process claims but is not the sole test. The Court affirmed that the hedging method at issue was an unpatentable abstract idea. See MPEP §2106.04(a).',
  },
  {
    id: 'pb_t0_006',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 1,
    question: 'Which of the following is NOT one of the judicially recognized exceptions to patent-eligible subject matter under §101?',
    options: [
      'Abstract ideas',
      'Laws of nature',
      'Natural phenomena',
      'Obvious combinations of known elements',
    ],
    correct: 3,
    explanation:
      'The three judicially recognized exceptions to §101 patent eligibility are abstract ideas, laws of nature, and natural phenomena. Obvious combinations are addressed under §103 (obviousness), not §101. See MPEP §2106.04.',
  },
  {
    id: 'pb_t0_007',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 3,
    question: 'A claim recites: "A method for diagnosing a disease by detecting a naturally occurring correlation between a biomarker level and the disease state, using standard laboratory techniques." Under the Alice/Mayo framework, which of the following best describes why this claim is likely patent-ineligible?',
    options: [
      'The claim is directed to a law of nature (the correlation) and the additional elements (standard lab techniques) are routine and conventional, failing to supply an inventive concept',
      'The claim fails §112 written description because it does not describe the biomarker',
      'The claim is anticipated under §102 because natural correlations are inherent',
      'The claim is obvious under §103 because detecting biomarkers is well-known',
    ],
    correct: 0,
    explanation:
      'Under Alice/Mayo Step 1, the claim is directed to a law of nature (the naturally occurring correlation). At Step 2, the additional elements (standard laboratory techniques) are routine and conventional activity insufficient to constitute an "inventive concept." Therefore, the claim is patent-ineligible under §101. See MPEP §2106.05(d).',
  },
  {
    id: 'pb_t0_008',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 2,
    question: 'Under §101, a claim to a "composition of matter" encompasses which of the following?',
    options: [
      'Only naturally occurring substances',
      'Manufactured articles with specific shapes',
      'Chemical compounds, mixtures, and alloys that are new and useful',
      'Abstract algorithms implemented in software',
    ],
    correct: 2,
    explanation:
      'A "composition of matter" under §101 includes chemical compounds, mixtures, alloys, and other combinations of substances. Naturally occurring substances in their natural state and abstract algorithms are not compositions of matter. Manufactured articles with specific shapes fall under "manufacture." See MPEP §2106.03.',
  },
  {
    id: 'pb_t0_009',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 3,
    question: 'An applicant claims: "A computer-implemented method for organizing digital data by applying a mathematical algorithm to categorize data entries, performed on a generic computer processor." Under current USPTO guidance, which statement is most accurate?',
    options: [
      'The claim is patent-eligible because it is implemented on a computer',
      'The claim is patent-eligible because it organizes data, which is a practical application',
      'The claim is likely patent-ineligible because applying a mathematical algorithm on a generic computer does not integrate the abstract idea into a practical application or provide an inventive concept',
      'The claim is patent-ineligible under §102 because computers are known in the prior art',
    ],
    correct: 2,
    explanation:
      'Under the Alice/Mayo framework and the 2019 PEG, merely reciting implementation on a generic computer does not integrate an abstract idea (mathematical algorithm) into a practical application (Step 2A Prong Two) or provide an inventive concept (Step 2B). Generic computer implementation is considered "well-understood, routine, and conventional." See MPEP §2106.05(f).',
  },
  {
    id: 'pb_t0_010',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 1,
    question: 'Which of the following is considered patent-eligible subject matter under §101?',
    options: [
      'E = mc^2',
      'A newly discovered plant found in the Amazon rainforest in its natural state',
      'A genetically engineered bacterium capable of breaking down crude oil',
      'The concept of hedging financial risk',
    ],
    correct: 2,
    explanation:
      'In Diamond v. Chakrabarty (1980), the Supreme Court held that a genetically engineered bacterium is patent-eligible because it is a human-made composition of matter with markedly different characteristics from anything found in nature. The other options are judicial exceptions (law of nature, natural phenomenon, abstract idea). See MPEP §2106.04(b).',
  },
  {
    id: 'pb_t0_011',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 2,
    question: 'Under the 2019 Revised Patent Subject Matter Eligibility Guidance, which of the following is NOT listed as one of the enumerated groupings of abstract ideas?',
    options: [
      'Mathematical concepts',
      'Certain methods of organizing human activity',
      'Mental processes',
      'Data storage methods',
    ],
    correct: 3,
    explanation:
      'The 2019 PEG identifies three enumerated groupings of abstract ideas: (1) mathematical concepts, (2) certain methods of organizing human activity (e.g., fundamental economic practices, managing personal relationships), and (3) mental processes (concepts performable in the human mind). "Data storage methods" is not an enumerated grouping. See MPEP §2106.04(a)(2).',
  },
  {
    id: 'pb_t0_012',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 3,
    question: 'A claim recites: "A method of treating a disease X by administering a therapeutically effective amount of compound Y to a patient." Under Alice/Mayo analysis, this claim is most likely:',
    options: [
      'Patent-ineligible because compound Y is a natural product',
      'Patent-eligible because it integrates any law of nature into a practical application by providing a specific treatment for a specific disease',
      'Patent-ineligible because diseases are natural phenomena',
      'Patent-eligible only if compound Y is synthetic',
    ],
    correct: 1,
    explanation:
      'Under the 2019 PEG, claims directed to specific methods of treatment using specific compounds to treat specific diseases are generally considered to integrate any judicial exception into a practical application. The claim applies any underlying natural relationship to a particular treatment, which is a practical application. See MPEP §2106.04(d)(2), Example 29 (Vanda Pharmaceuticals).',
  },
  {
    id: 'pb_t0_013',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 2,
    question: 'Under the Alice/Mayo framework, Step 2B evaluates whether a claim recites what?',
    options: [
      'A judicial exception',
      'A practical application of the judicial exception',
      'Additional elements that amount to significantly more than the judicial exception (an "inventive concept")',
      'Novel and non-obvious subject matter',
    ],
    correct: 2,
    explanation:
      'Step 2B of the Alice/Mayo framework asks whether the claim recites additional elements that amount to "significantly more" than the judicial exception, i.e., whether there is an "inventive concept." This is reached only if Step 2A determines the claim is directed to a judicial exception without a practical application. See MPEP §2106.05.',
  },
  {
    id: 'pb_t0_014',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 1,
    question: 'Which of the following statutory categories of patent-eligible subject matter is NOT listed in 35 U.S.C. §101?',
    options: [
      'Process',
      'Machine',
      'Software',
      'Composition of matter',
    ],
    correct: 2,
    explanation:
      'Section 101 lists four statutory categories: process, machine, manufacture, and composition of matter. "Software" is not a statutory category, though software-implemented inventions may be claimed as processes or machines if they satisfy eligibility requirements. See MPEP §2106.03.',
  },
  {
    id: 'pb_t0_015',
    topicId: 0,
    subtopic: '101_subject_matter',
    difficulty: 3,
    question: 'A claim recites: "A computer system comprising a processor and memory, configured to perform a specific machine-learning training process that reduces processor resource consumption by 50% compared to conventional methods." Under the 2019 PEG, this claim is most likely:',
    options: [
      'Patent-ineligible because machine learning is a mathematical concept',
      'Patent-eligible because the claim recites an improvement to computer functionality (reducing resource consumption), which is a practical application',
      'Patent-ineligible because all software claims are abstract ideas',
      'Patent-eligible only if the claim includes specific hardware beyond a generic processor',
    ],
    correct: 1,
    explanation:
      'Under Step 2A Prong Two, a claim that provides a specific technological improvement (such as reducing processor resource consumption) integrates the judicial exception into a practical application. Improvements to computer functionality are recognized as practical applications. See MPEP §2106.05(a).',
  },

  // --- §102 Novelty (15 questions) ---
  {
    id: 'pb_t0_016',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 1,
    question: 'Under 35 U.S.C. §102 (AIA), which of the following qualifies as prior art?',
    options: [
      'A secret internal company memo never shared outside the company',
      'A patented invention that was published before the effective filing date of the claimed invention',
      'An invention conceived by the applicant but never reduced to practice or disclosed',
      'An abandoned patent application that was never published',
    ],
    correct: 1,
    explanation:
      'Under AIA §102(a)(1), prior art includes subject matter that was "patented, described in a printed publication, or in public use, on sale, or otherwise available to the public" before the effective filing date. A published patent meets this criterion. Secret memos, unconceived inventions, and unpublished abandoned applications do not qualify. See MPEP §2152.',
  },
  {
    id: 'pb_t0_017',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 1,
    question: 'Under AIA §102, what is the length of the grace period during which an inventor\'s own disclosure does not constitute prior art against the inventor\'s later-filed application?',
    options: [
      '6 months',
      '12 months',
      '18 months',
      '24 months',
    ],
    correct: 1,
    explanation:
      'Under AIA §102(b)(1), disclosures made by the inventor or a joint inventor, or by another who obtained the subject matter from the inventor, within one year (12 months) before the effective filing date are not prior art. This is the grace period. See MPEP §2153.01.',
  },
  {
    id: 'pb_t0_018',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'For a prior art reference to anticipate a claim under §102, the reference must:',
    options: [
      'Disclose every element of the claimed invention, either expressly or inherently, in a single reference',
      'Disclose a majority of the claim limitations in one or more references',
      'Suggest the claimed invention to a person having ordinary skill in the art',
      'Be authored by someone working in the same field of endeavor as the applicant',
    ],
    correct: 0,
    explanation:
      'Anticipation under §102 requires that a single prior art reference disclose every element of the claimed invention, either explicitly or inherently. Unlike §103, anticipation cannot be based on a combination of references. See MPEP §2131.',
  },
  {
    id: 'pb_t0_019',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'Under AIA §102(a)(2), a U.S. patent or published patent application is prior art as of what date?',
    options: [
      'The issue date of the patent',
      'The publication date of the application',
      'The effective filing date of the patent or application',
      'The date the application was received by the USPTO mailroom',
    ],
    correct: 2,
    explanation:
      'Under AIA §102(a)(2), U.S. patents, published patent applications, and WIPO publications are prior art as of their effective filing date (not publication or issue date). This is a key change from pre-AIA law. See MPEP §2154.01.',
  },
  {
    id: 'pb_t0_020',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'Which of the following is a key difference between AIA §102 and pre-AIA §102?',
    options: [
      'AIA §102 uses a first-to-invent system while pre-AIA used first-to-file',
      'AIA §102 uses a first-inventor-to-file system, eliminating prior art categories based on geographic distinctions',
      'AIA §102 eliminated the grace period for inventor disclosures',
      'AIA §102 requires a showing of diligence to establish a prior art date',
    ],
    correct: 1,
    explanation:
      'The AIA transitioned the U.S. from a first-to-invent system to a first-inventor-to-file system effective March 16, 2013. AIA §102 eliminated geographic distinctions (e.g., prior knowledge and use were previously limited to the U.S.) and simplified prior art categories. The grace period was retained. See MPEP §2150.',
  },
  {
    id: 'pb_t0_021',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 1,
    question: 'Which of the following constitutes "printed publication" prior art under §102(a)(1)?',
    options: [
      'A doctoral thesis cataloged and indexed in a university library',
      'A private letter sent between two researchers',
      'An unpublished manuscript stored in an author\'s desk drawer',
      'A conversation at a private dinner party',
    ],
    correct: 0,
    explanation:
      'A "printed publication" is one that has been sufficiently disseminated or made accessible to persons interested in the art. A doctoral thesis cataloged and indexed in a university library is accessible to the public and qualifies. Private letters, unpublished manuscripts, and private conversations do not meet the accessibility threshold. See MPEP §2128.',
  },
  {
    id: 'pb_t0_022',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 3,
    question: 'Applicant A publicly discloses invention X on January 1, 2024. Third party B, who independently developed the same invention, files a patent application on June 1, 2024. Applicant A files a patent application on August 1, 2024. Under AIA §102, which statement is correct?',
    options: [
      'B\'s application is not prior art against A because A disclosed first and the grace period applies',
      'A\'s public disclosure is not prior art against B because of the grace period',
      'B\'s application is prior art against A because B filed first',
      'Neither A nor B can obtain a patent',
    ],
    correct: 0,
    explanation:
      'Under AIA §102(b)(2)(B), a disclosure that is effectively filed by another (B\'s application filed June 1, 2024) is not prior art against A if the subject matter had been publicly disclosed by A (or someone who obtained it from A) before B\'s effective filing date. A\'s January 1 disclosure triggers this exception for B\'s June 1 filing. See MPEP §2153.02.',
  },
  {
    id: 'pb_t0_023',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'The "effective filing date" of a claimed invention under AIA is:',
    options: [
      'Always the actual filing date of the application containing the claim',
      'The earliest of the actual filing date or any earlier filing date to which the application is entitled under §§119, 120, 121, or 365',
      'The date the invention was first conceived by the inventor',
      'The date the application was assigned to an examiner',
    ],
    correct: 1,
    explanation:
      'Under AIA §100(i), the "effective filing date" is the actual filing date of the application or, if priority or benefit is claimed, the earliest filing date of a prior application to which the claim is entitled. This may include foreign priority dates under §119 or domestic benefit dates under §120. See MPEP §2152.01.',
  },
  {
    id: 'pb_t0_024',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'An offer for sale of an invention made before the effective filing date constitutes prior art under AIA §102(a)(1) if:',
    options: [
      'The offer was made only to a single potential buyer in a private meeting',
      'The invention was the subject of a commercial offer for sale and was ready for patenting',
      'The offer was contingent and no transaction occurred',
      'The sale was made but the buyer signed a nondisclosure agreement',
    ],
    correct: 1,
    explanation:
      'Under AIA §102(a)(1), an invention "on sale" before the effective filing date is prior art. The on-sale bar requires (1) a commercial offer for sale (under general contract law principles) and (2) the invention must be ready for patenting (either by reduction to practice or sufficiently detailed description). See Pfaff v. Wells Electronics; MPEP §2133.03(b).',
  },
  {
    id: 'pb_t0_025',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 3,
    question: 'Under AIA §102(a)(1), the phrase "otherwise available to the public" was added to the prior art categories. What is the significance of this phrase?',
    options: [
      'It limits prior art to only publicly available documents',
      'It serves as a catch-all for disclosures that do not fit neatly into the other enumerated categories (patents, publications, public use, on sale) but were still publicly accessible',
      'It eliminates secret prior art entirely from AIA §102',
      'It means only disclosures in English qualify as prior art',
    ],
    correct: 1,
    explanation:
      'The phrase "otherwise available to the public" in AIA §102(a)(1) is a catch-all provision ensuring that any disclosure that makes the invention available to the public qualifies as prior art, even if it does not fit precisely into the categories of patents, publications, public use, or on-sale activity. See MPEP §2152.02(e).',
  },
  {
    id: 'pb_t0_026',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 1,
    question: 'Under the AIA, prior art under §102(a)(2) includes U.S. patents, published U.S. patent applications, and:',
    options: [
      'Foreign patent applications filed but not yet published',
      'WIPO published applications that designate the United States',
      'Provisional applications that were never converted to nonprovisionals',
      'Trade secret documents filed with the ITC',
    ],
    correct: 1,
    explanation:
      'AIA §102(a)(2) includes as prior art U.S. patents, published U.S. applications, and WIPO publications under the PCT that designate the United States, each as of their effective filing date. Unpublished foreign applications and abandoned provisionals not relied upon for benefit do not qualify. See MPEP §2154.',
  },
  {
    id: 'pb_t0_027',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'Inherent anticipation under §102 requires that the missing claim limitation is:',
    options: [
      'Obvious to a person having ordinary skill in the art',
      'Necessarily present in the prior art reference, even if not expressly disclosed',
      'Mentioned in at least one secondary reference',
      'Capable of being discovered through routine experimentation',
    ],
    correct: 1,
    explanation:
      'Inherent anticipation requires that the undisclosed limitation is necessarily present in (inherent to) the prior art reference. A mere probability or possibility that the limitation is present is insufficient. The inherent feature need not have been recognized by those of skill in the art at the time. See MPEP §2112.',
  },
  {
    id: 'pb_t0_028',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 3,
    question: 'Under AIA §102(b)(1)(A), the grace period exception applies to disclosures made by the inventor within 12 months before the effective filing date. Which of the following third-party disclosures is also excepted from prior art under §102(b)(1)(B)?',
    options: [
      'Any third-party disclosure made within 12 months of the effective filing date',
      'A third-party disclosure of subject matter that had been previously publicly disclosed by the inventor before the third-party disclosure',
      'A third-party disclosure made more than 12 months before the effective filing date',
      'A third-party disclosure that was independently developed',
    ],
    correct: 1,
    explanation:
      'Under AIA §102(b)(1)(B), a disclosure by a third party is not prior art if, before the third party\'s disclosure, the inventor had publicly disclosed the same subject matter. This prevents a third party from creating prior art by publishing after the inventor\'s own disclosure but before the inventor\'s filing date. See MPEP §2153.01(b).',
  },
  {
    id: 'pb_t0_029',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 2,
    question: 'A poster presentation at an academic conference displayed for three days is:',
    options: [
      'Never prior art because it is temporary',
      'Prior art as a printed publication if it was publicly accessible to interested persons',
      'Prior art only if it was published in conference proceedings',
      'Prior art only if the conference was held in the United States',
    ],
    correct: 1,
    explanation:
      'A poster displayed at a conference may qualify as a "printed publication" under §102(a)(1) if it was sufficiently accessible to persons interested and ordinarily skilled in the art. Duration of display is a factor but not dispositive; accessibility and indexing are key. Under AIA, geographic location is irrelevant. See In re Klopfenstein; MPEP §2128.01.',
  },
  {
    id: 'pb_t0_030',
    topicId: 0,
    subtopic: '102_novelty',
    difficulty: 1,
    question: 'For anticipation under §102, can a single genus disclosure in a prior art reference anticipate a later-claimed species?',
    options: [
      'Yes, a genus always anticipates every species within it',
      'No, a genus can never anticipate a species',
      'It depends; a genus may anticipate a species only if the species is clearly envisaged from the genus disclosure',
      'Only if the genus has fewer than ten species',
    ],
    correct: 2,
    explanation:
      'A generic disclosure does not automatically anticipate every species within the genus. However, if the prior art genus is so limited that a person of ordinary skill would at once envisage the claimed species, then anticipation exists. This is a fact-specific inquiry. See MPEP §2131.02.',
  },

  // --- §103 Obviousness (15 questions) ---
  {
    id: 'pb_t0_031',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 1,
    question: 'Under 35 U.S.C. §103, a claim is unpatentable if the differences between the claimed invention and the prior art are such that the claimed invention as a whole would have been obvious to:',
    options: [
      'An expert with the highest degree of skill in the art',
      'A person having ordinary skill in the art (PHOSITA)',
      'Any member of the general public',
      'The inventor at the time of filing',
    ],
    correct: 1,
    explanation:
      'Section 103 measures obviousness from the perspective of a person having ordinary skill in the art (PHOSITA) at the time the invention was made (pre-AIA) or before the effective filing date (AIA). Not an expert, nor a layperson, nor the inventor. See MPEP §2141.03.',
  },
  {
    id: 'pb_t0_032',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 1,
    question: 'The factual inquiries for determining obviousness under §103 were set forth in which Supreme Court case?',
    options: [
      'Alice Corp. v. CLS Bank International',
      'KSR International Co. v. Teleflex Inc.',
      'Graham v. John Deere Co.',
      'Diamond v. Chakrabarty',
    ],
    correct: 2,
    explanation:
      'Graham v. John Deere Co. (1966) established the four factual inquiries for obviousness: (1) scope and content of the prior art, (2) differences between the prior art and the claims, (3) level of ordinary skill in the art, and (4) objective evidence of nonobviousness (secondary considerations). See MPEP §2141.',
  },
  {
    id: 'pb_t0_033',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'Under the Graham v. John Deere framework, which of the following is NOT one of the four factual inquiries for obviousness?',
    options: [
      'The scope and content of the prior art',
      'The differences between the prior art and the claims at issue',
      'The commercial success of the claimed invention',
      'The level of ordinary skill in the pertinent art',
    ],
    correct: 2,
    explanation:
      'The four Graham factors are: (1) scope and content of prior art, (2) differences between prior art and claims, (3) level of ordinary skill, and (4) secondary considerations (which include commercial success, but commercial success itself is not one of the four main inquiries -- it is an example of a secondary consideration under the fourth factor). See MPEP §2141.',
  },
  {
    id: 'pb_t0_034',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'In KSR International Co. v. Teleflex Inc., the Supreme Court rejected a rigid application of which test for obviousness?',
    options: [
      'The machine-or-transformation test',
      'The teaching-suggestion-motivation (TSM) test',
      'The Graham v. John Deere four-factor test',
      'The substantial evidence test',
    ],
    correct: 1,
    explanation:
      'In KSR (2007), the Supreme Court held that the Federal Circuit\'s rigid application of the teaching-suggestion-motivation (TSM) test was inconsistent with §103. While TSM remains a valid approach, the Court emphasized that obviousness analysis must be flexible, considering common sense, market forces, design incentives, and the interrelated teachings of multiple references. See MPEP §2141(III).',
  },
  {
    id: 'pb_t0_035',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'Which of the following "secondary considerations" (objective indicia of nonobviousness) may be used to support a finding of nonobviousness under §103?',
    options: [
      'The applicant\'s subjective belief that the invention is novel',
      'Commercial success of the invention, long-felt but unsolved need, and failure of others',
      'The number of claims in the application',
      'The speed at which the patent application was examined',
    ],
    correct: 1,
    explanation:
      'Secondary considerations (objective indicia of nonobviousness) include: commercial success, long-felt but unsolved need, failure of others, unexpected results, copying, licensing, professional acclaim, and skepticism of experts. These are objective evidence of the fourth Graham factor. See MPEP §2145.',
  },
  {
    id: 'pb_t0_036',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'For secondary considerations of nonobviousness to be persuasive, the applicant must establish:',
    options: [
      'That the evidence is based on the inventor\'s testimony alone',
      'A nexus between the secondary consideration and the merits of the claimed invention',
      'That no prior art exists in the same field',
      'That the examiner failed to find relevant prior art',
    ],
    correct: 1,
    explanation:
      'To be persuasive, secondary considerations must have a nexus (causal connection) to the novel features of the claimed invention. For example, commercial success must be attributable to the claimed features, not to marketing or other factors. See MPEP §716.01(b).',
  },
  {
    id: 'pb_t0_037',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 3,
    question: 'Under KSR, which of the following rationales may support an obviousness rejection?',
    options: [
      'Combining prior art elements according to known methods to yield predictable results',
      'Combining references from completely unrelated fields with no apparent reason',
      'Relying solely on hindsight reconstruction without any evidentiary basis',
      'Rejecting the claim because the examiner personally believes the invention is simple',
    ],
    correct: 0,
    explanation:
      'KSR identified several exemplary rationales for obviousness, including: combining prior art elements according to known methods to yield predictable results, simple substitution, use of known technique to improve similar devices, applying a known technique to a known device ready for improvement, and "obvious to try" from a finite number of identified solutions. See MPEP §2143(I).',
  },
  {
    id: 'pb_t0_038',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 1,
    question: 'In an obviousness analysis, prior art references used in combination must be:',
    options: [
      'From the same inventor',
      'Analogous art (from the same field of endeavor or reasonably pertinent to the problem)',
      'Published in peer-reviewed journals',
      'Filed within one year of the applicant\'s filing date',
    ],
    correct: 1,
    explanation:
      'Prior art must be "analogous art" to be used in an obviousness combination. Art is analogous if it is (1) from the same field of endeavor as the invention, or (2) reasonably pertinent to the particular problem with which the inventor is involved. See MPEP §2141.01(a).',
  },
  {
    id: 'pb_t0_039',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 3,
    question: 'An examiner combines three prior art references (A, B, and C) to reject claims as obvious. The applicant argues that there is no motivation to combine the references. Under KSR, which statement is most accurate?',
    options: [
      'The examiner must cite an explicit teaching in the references themselves that motivates the combination',
      'The examiner may rely on the knowledge of a PHOSITA, market demands, design incentives, or common sense to provide the motivation, and is not limited to explicit teachings in the references',
      'Three-reference combinations are never permissible for obviousness',
      'The applicant automatically prevails if there is no written motivation in the references',
    ],
    correct: 1,
    explanation:
      'Under KSR, the motivation to combine need not come from an explicit statement in the references. The examiner may rely on the background knowledge of a PHOSITA, market forces, design incentives, the interrelated teachings of multiple patents, and common sense. The TSM test remains useful but must not be applied rigidly. See MPEP §2143(I)(G).',
  },
  {
    id: 'pb_t0_040',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'The "obvious to try" rationale for an obviousness rejection under KSR requires:',
    options: [
      'That there was a recognized problem and a finite number of identified, predictable solutions',
      'That the inventor tried multiple approaches before succeeding',
      'That a competitor previously attempted and failed to solve the problem',
      'That the prior art explicitly suggests the claimed solution',
    ],
    correct: 0,
    explanation:
      'Under KSR, "obvious to try" supports obviousness when (1) there was a recognized need or problem, (2) there was a finite number of identified, predictable solutions, and (3) a PHOSITA could have pursued the known options with a reasonable expectation of success. See MPEP §2143(I)(E).',
  },
  {
    id: 'pb_t0_041',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'When evaluating obviousness, the examiner must avoid:',
    options: [
      'Considering the scope and content of the prior art',
      'Using hindsight bias with the applicant\'s disclosure as a roadmap',
      'Considering secondary evidence of nonobviousness',
      'Combining references from the same field of endeavor',
    ],
    correct: 1,
    explanation:
      'Examiners must guard against impermissible hindsight reconstruction -- using the applicant\'s own disclosure as a "roadmap" to piece together prior art references. The analysis must be based on what a PHOSITA would have known and been motivated to do without the benefit of the applicant\'s disclosure. See MPEP §2145(X)(A).',
  },
  {
    id: 'pb_t0_042',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 1,
    question: 'Which of the following would NOT be a proper basis for an obviousness rejection under §103?',
    options: [
      'Substituting one known element for another to obtain predictable results',
      'Combining known elements according to known methods to yield predictable results',
      'A single reference that discloses every element of the claim',
      'Applying a known technique to improve a similar device in the same way',
    ],
    correct: 2,
    explanation:
      'If a single reference discloses every element of the claim, the proper rejection is anticipation under §102, not obviousness under §103. Obviousness under §103 addresses situations where the prior art does not identically disclose the claim but the differences would have been obvious. See MPEP §2131 vs. §2143.',
  },
  {
    id: 'pb_t0_043',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 3,
    question: 'An applicant presents evidence of unexpected results to rebut an obviousness rejection. For this evidence to be persuasive, the results must be:',
    options: [
      'Commercially valuable',
      'Commensurate in scope with the claims and compared against the closest prior art',
      'Reproduced by an independent laboratory',
      'Published in a peer-reviewed journal before the filing date',
    ],
    correct: 1,
    explanation:
      'Evidence of unexpected results must be commensurate in scope with the claims (i.e., the evidence must cover the full breadth of the claims, not just a narrow embodiment) and must compare the claimed invention to the closest prior art. The comparison must show that the results are truly unexpected, not merely different. See MPEP §716.02(d).',
  },
  {
    id: 'pb_t0_044',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 2,
    question: 'Under the pre-AIA version of §103, obviousness was evaluated "at the time the invention was made." Under the AIA, obviousness is evaluated:',
    options: [
      'At the time the invention was made',
      'At the time the application was published',
      'Before the effective filing date of the claimed invention',
      'At the time the patent issues',
    ],
    correct: 2,
    explanation:
      'AIA §103 states that a patent may not be obtained if the claimed invention "would have been obvious before the effective filing date of the claimed invention." This is a change from pre-AIA, which used "at the time the invention was made." See MPEP §2141.',
  },
  {
    id: 'pb_t0_045',
    topicId: 0,
    subtopic: '103_obviousness',
    difficulty: 3,
    question: 'A reference teaches away from the combination proposed by the examiner. This means:',
    options: [
      'The reference is not prior art',
      'The reference discourages or criticizes the approach taken by the claimed invention, which weighs against a finding of obviousness',
      'The examiner must withdraw the rejection immediately',
      'The reference is only relevant to a §102 analysis',
    ],
    correct: 1,
    explanation:
      'A reference that "teaches away" from a proposed combination -- by discouraging, criticizing, or discrediting the approach -- weighs against a finding of obviousness. However, teaching away does not automatically defeat an obviousness rejection; it is one factor among many. See MPEP §2145(X)(D).',
  },

  // --- §112 Requirements (15 questions) ---
  {
    id: 'pb_t0_046',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 1,
    question: 'Under 35 U.S.C. §112(a), the specification must contain:',
    options: [
      'A written description of the invention, enablement, and best mode',
      'Only a written description of the invention',
      'Only enablement and best mode',
      'A statement of commercial applicability',
    ],
    correct: 0,
    explanation:
      'Section 112(a) requires three things: (1) a written description of the invention, (2) enablement (sufficient detail to allow a PHOSITA to make and use the invention without undue experimentation), and (3) best mode (the best way of carrying out the invention known to the inventor at the time of filing). See MPEP §2161.',
  },
  {
    id: 'pb_t0_047',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'The enablement requirement of §112(a) is satisfied when:',
    options: [
      'The specification enables a PHOSITA to make and use the full scope of the claimed invention without undue experimentation',
      'The specification describes at least one embodiment',
      'The claims are clear and definite',
      'The inventor files a working prototype with the USPTO',
    ],
    correct: 0,
    explanation:
      'Enablement requires that the specification teach a PHOSITA how to make and use the full scope of the claimed invention without undue experimentation. The Wands factors are used to evaluate whether experimentation is "undue," including quantity of experimentation, amount of direction provided, working examples, predictability of the art, etc. See MPEP §2164.',
  },
  {
    id: 'pb_t0_048',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'Which of the following is NOT one of the Wands factors used to evaluate undue experimentation for enablement?',
    options: [
      'The quantity of experimentation necessary',
      'The amount of direction or guidance provided by the inventor',
      'The commercial value of the invention',
      'The breadth of the claims',
    ],
    correct: 2,
    explanation:
      'The Wands factors include: (1) breadth of claims, (2) nature of the invention, (3) state of the prior art, (4) level of skill in the art, (5) predictability in the art, (6) amount of direction provided, (7) existence of working examples, and (8) quantity of experimentation needed. Commercial value is not a Wands factor. See In re Wands; MPEP §2164.01(a).',
  },
  {
    id: 'pb_t0_049',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 1,
    question: 'The written description requirement of §112(a) requires the specification to:',
    options: [
      'Claim every possible embodiment of the invention',
      'Reasonably convey to a PHOSITA that the inventor had possession of the claimed invention as of the filing date',
      'Include a description of the best mode of the invention',
      'Describe every prior art reference considered by the inventor',
    ],
    correct: 1,
    explanation:
      'The written description requirement is satisfied when the specification reasonably conveys to a PHOSITA that the inventor had possession of the claimed subject matter at the time of filing. This is distinct from enablement. See Ariad Pharmaceuticals v. Eli Lilly; MPEP §2163.',
  },
  {
    id: 'pb_t0_050',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'Under §112(b), claims must:',
    options: [
      'Be as broad as possible',
      'Particularly point out and distinctly claim the subject matter regarded as the invention (definiteness)',
      'Include at least one means-plus-function element',
      'Be limited to a single embodiment',
    ],
    correct: 1,
    explanation:
      'Section 112(b) requires that the claims "particularly point out and distinctly claim the subject matter" the inventor regards as the invention. This is the definiteness requirement. Claims that are ambiguous, vague, or incoherent fail this requirement. See MPEP §2173.',
  },
  {
    id: 'pb_t0_051',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'A claim limitation recites "means for fastening." Under §112(f), this limitation is:',
    options: [
      'Interpreted as covering any possible fastening device',
      'Interpreted as covering the corresponding structure described in the specification and equivalents thereof',
      'Indefinite per se and must be rejected',
      'Interpreted according to its plain meaning in common usage',
    ],
    correct: 1,
    explanation:
      'Under §112(f), a means-plus-function claim limitation (using "means for" language) is construed to cover the corresponding structure, material, or acts described in the specification and equivalents thereof. It is not given its literal broadest meaning. If no corresponding structure is disclosed, the claim is indefinite. See MPEP §2181.',
  },
  {
    id: 'pb_t0_052',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 3,
    question: 'An applicant adds new claim limitations during prosecution that are not supported by the original specification. This raises a rejection under:',
    options: [
      '§102 for lack of novelty',
      '§112(a) for new matter (failure of written description)',
      '§103 for obviousness',
      '§101 for lack of utility',
    ],
    correct: 1,
    explanation:
      'Adding claim limitations during prosecution that are not supported by the original disclosure constitutes "new matter" and violates the written description requirement of §112(a). The specification as originally filed must support any claimed subject matter. See 37 CFR 1.118; MPEP §2163.06.',
  },
  {
    id: 'pb_t0_053',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 1,
    question: 'Under the AIA, the best mode requirement:',
    options: [
      'Was completely eliminated from §112',
      'Still exists as a requirement for patent applications but failure to comply cannot be the basis for invalidating a patent',
      'Was strengthened with new penalties for nondisclosure',
      'Applies only to design patents',
    ],
    correct: 1,
    explanation:
      'The AIA retained the best mode requirement in §112(a), so applicants must still disclose the best mode. However, AIA §15 amended 35 U.S.C. §282 so that failure to disclose the best mode cannot be used as a defense in invalidity proceedings. Examiners do not reject for best mode. See MPEP §2165.',
  },
  {
    id: 'pb_t0_054',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'A claim recites "a substantially flat surface." Under §112(b), this term is:',
    options: [
      'Always indefinite because "substantially" is a relative term',
      'Definite if the specification provides a standard for measuring the degree of flatness, or if one of ordinary skill would understand the scope',
      'Definite only if a numerical range is provided',
      'Indefinite unless the examiner approves the language',
    ],
    correct: 1,
    explanation:
      'Terms of degree like "substantially" are not automatically indefinite. They satisfy §112(b) if the specification provides some standard for measuring the scope of the term, or if a PHOSITA would understand the boundaries of the claim when read in light of the specification. See MPEP §2173.05(b).',
  },
  {
    id: 'pb_t0_055',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 3,
    question: 'Under Nautilus, Inc. v. Biosig Instruments, Inc. (2014), the Supreme Court held that a claim is indefinite under §112(b) when:',
    options: [
      'The claim is not amenable to construction by a court',
      'The claim, read in light of the specification and prosecution history, fails to inform with reasonable certainty those skilled in the art about the scope of the invention',
      'The claim uses any relative term',
      'The claim includes a means-plus-function limitation',
    ],
    correct: 1,
    explanation:
      'In Nautilus (2014), the Supreme Court held that a patent claim is indefinite if it fails to inform, with reasonable certainty, those skilled in the art about the scope of the invention when read in light of the specification and prosecution history. This replaced the Federal Circuit\'s "insolubly ambiguous" standard. See MPEP §2173.02.',
  },
  {
    id: 'pb_t0_056',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'A dependent claim that fails to further limit the independent claim from which it depends violates:',
    options: [
      '§112(a) written description',
      '§112(b) definiteness',
      '§112(d) dependent claim requirement',
      '§101 subject matter eligibility',
    ],
    correct: 2,
    explanation:
      'Section 112(d) requires that a dependent claim contain a reference to a prior claim and further limit the subject matter of the referenced claim. A dependent claim that fails to further limit its parent violates §112(d). See MPEP §608.01(n)(III).',
  },
  {
    id: 'pb_t0_057',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 1,
    question: 'Which of the following would trigger a §112(f) means-plus-function interpretation?',
    options: [
      '"A processor configured to execute instructions"',
      '"Means for receiving a signal"',
      '"A fastener"',
      '"A method comprising the step of heating"',
    ],
    correct: 1,
    explanation:
      'The use of "means for" followed by a functional recitation (without sufficient structure) is the classic trigger for §112(f) means-plus-function interpretation. The other options recite structure (processor, fastener) or a method step. See MPEP §2181(I).',
  },
  {
    id: 'pb_t0_058',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 3,
    question: 'An applicant claims a genus of chemical compounds but the specification only describes and enables two species within that genus. A PHOSITA cannot predict the properties of other species in the genus. The claim likely fails:',
    options: [
      'Only §112(a) written description',
      'Only §112(a) enablement',
      'Both §112(a) written description and enablement',
      '§112(b) definiteness',
    ],
    correct: 2,
    explanation:
      'If only two species are described and enabled, and the genus is unpredictable, the claim likely fails both (1) written description because the applicant has not demonstrated possession of the full genus, and (2) enablement because a PHOSITA cannot make and use the full scope of the genus without undue experimentation. See MPEP §2163.05 and §2164.08.',
  },
  {
    id: 'pb_t0_059',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'A means-plus-function claim limitation under §112(f) is found to have NO corresponding structure disclosed in the specification. The claim is:',
    options: [
      'Given its broadest reasonable interpretation',
      'Rejected under §112(b) as indefinite',
      'Rejected under §101 as non-statutory',
      'Treated as a product-by-process claim',
    ],
    correct: 1,
    explanation:
      'If a means-plus-function limitation under §112(f) lacks corresponding structure in the specification, the claim is indefinite under §112(b) because a PHOSITA cannot determine the scope of the claim. See MPEP §2181(II)(A).',
  },
  {
    id: 'pb_t0_060',
    topicId: 0,
    subtopic: '112_requirements',
    difficulty: 2,
    question: 'Regarding enablement, which statement is correct?',
    options: [
      'The specification need only enable the preferred embodiment',
      'The specification must enable the full scope of every claim',
      'Enablement is evaluated as of the date the patent issues',
      'Working examples are always required for enablement',
    ],
    correct: 1,
    explanation:
      'Enablement under §112(a) requires that the specification enable a PHOSITA to make and use the full scope of the claimed invention. If the claims are broader than what is enabled, the claims fail the enablement requirement. Enablement is evaluated as of the filing date. Working examples are helpful but not required. See MPEP §2164.08.',
  },

  // --- Double Patenting & Utility (10 questions) ---
  {
    id: 'pb_t0_061',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 1,
    question: 'Statutory (same-invention) double patenting under 35 U.S.C. §101 arises when:',
    options: [
      'Two patents claim obvious variants of each other',
      'Two patents claim the identical invention',
      'A patent and a published application have overlapping claims',
      'An inventor files two provisional applications for the same invention',
    ],
    correct: 1,
    explanation:
      'Statutory double patenting under §101 prohibits two patents claiming the identical invention. This cannot be overcome by a terminal disclaimer. In contrast, nonstatutory (obviousness-type) double patenting addresses claims that are not identical but are patentably indistinct. See MPEP §804(I).',
  },
  {
    id: 'pb_t0_062',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 2,
    question: 'Nonstatutory (obviousness-type) double patenting can be overcome by filing:',
    options: [
      'A continuation-in-part application',
      'A terminal disclaimer',
      'A request for continued examination',
      'A petition to make special',
    ],
    correct: 1,
    explanation:
      'Obviousness-type double patenting (ODP) can be overcome by filing a terminal disclaimer under 37 CFR 1.321, which disclaims the terminal portion of the patent extending beyond the expiration of the reference patent and requires common ownership. See MPEP §804.02.',
  },
  {
    id: 'pb_t0_063',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 2,
    question: 'A terminal disclaimer filed to overcome an obviousness-type double patenting rejection requires:',
    options: [
      'That the later patent expire on the same date as the earlier patent and that the patents remain commonly owned',
      'Payment of a surcharge equal to the maintenance fees',
      'Abandonment of the earlier patent',
      'That all claims in both patents be identical',
    ],
    correct: 0,
    explanation:
      'A terminal disclaimer requires the owner to (1) disclaim the terminal portion of the later patent so that it expires with the earlier patent, and (2) agree that the later patent will be enforceable only while commonly owned with the earlier patent. See 37 CFR 1.321(c); MPEP §804.02(VI).',
  },
  {
    id: 'pb_t0_064',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 1,
    question: 'Under the utility requirement of §101, an invention must have:',
    options: [
      'Significant commercial potential',
      'Specific, substantial, and credible utility',
      'Been reduced to practice before filing',
      'Utility only in the United States',
    ],
    correct: 1,
    explanation:
      'The utility requirement under §101 requires that the invention have specific utility (particular benefit in a currently available form), substantial utility (real-world benefit, not merely the subject of further research), and credible utility (believable to a PHOSITA). See MPEP §2107.',
  },
  {
    id: 'pb_t0_065',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 2,
    question: 'A claim directed to a research tool with no known practical application other than further research has:',
    options: [
      'Specific and substantial utility',
      'Only credible utility but lacks specific and substantial utility',
      'No utility because all inventions must cure a disease or solve a technical problem',
      'Utility only if it is commercially available',
    ],
    correct: 1,
    explanation:
      'An invention that has no known utility other than further research typically lacks "substantial" utility because its benefit is not real-world and currently available. It may be credible (believable) but fails the substantial utility requirement. However, a research tool with a well-established practical application can have utility. See MPEP §2107.01(II).',
  },
  {
    id: 'pb_t0_066',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 3,
    question: 'An examiner issues an obviousness-type double patenting rejection based on claims in a copending application. The applicant cannot file a terminal disclaimer because the applications have different owners. What is the applicant\'s best option?',
    options: [
      'Argue that the claims are patentably distinct',
      'File a petition under 37 CFR 1.182',
      'Abandon the later-filed application',
      'File an interference proceeding',
    ],
    correct: 0,
    explanation:
      'If a terminal disclaimer cannot be filed (e.g., different ownership), the applicant must argue that the claims are patentably distinct -- that is, the claims in the two applications are not obvious variants of each other. If the claims are truly patentably indistinct and cannot be commonly owned, the ODP rejection stands. See MPEP §804.01.',
  },
  {
    id: 'pb_t0_067',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 2,
    question: 'Which of the following asserted utilities would the USPTO most likely find NOT credible?',
    options: [
      'A pharmaceutical compound that treats a known disease',
      'A perpetual motion machine that generates unlimited energy',
      'A software algorithm that compresses data more efficiently',
      'A mechanical device that reduces friction in engines',
    ],
    correct: 1,
    explanation:
      'A perpetual motion machine violates known laws of physics (conservation of energy), and the USPTO would find such an assertion of utility not credible. The other options represent plausible, real-world utilities. See MPEP §2107.01(III).',
  },
  {
    id: 'pb_t0_068',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 1,
    question: 'Can a statutory (same-invention) double patenting rejection be overcome by a terminal disclaimer?',
    options: [
      'Yes, a terminal disclaimer overcomes any double patenting rejection',
      'No, statutory double patenting cannot be overcome by a terminal disclaimer -- the claims must be amended to be non-identical',
      'Yes, but only if accompanied by a supplemental examination fee',
      'No, but it can be overcome by filing a reissue application',
    ],
    correct: 1,
    explanation:
      'Statutory double patenting (where the claims are identical) cannot be overcome by a terminal disclaimer. The applicant must amend the claims so they are no longer identical. Only nonstatutory (obviousness-type) double patenting is overcome by terminal disclaimers. See MPEP §804(I)(A).',
  },
  {
    id: 'pb_t0_069',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 3,
    question: 'Under the two-way test for obviousness-type double patenting, which is applied only in limited circumstances, the analysis considers:',
    options: [
      'Whether the claims of either application are obvious over the claims of the other',
      'Whether the claims of each application would be obvious over the other, and the rejection is only proper if obviousness runs in both directions',
      'Whether the specifications of both applications are identical',
      'Whether both applications claim benefit to the same priority document',
    ],
    correct: 1,
    explanation:
      'The two-way test (as opposed to the one-way test) requires that the claims of each application/patent be obvious over the claims of the other. It is applied in limited circumstances, such as when the applicant could not have filed claims of the later application in the earlier application (e.g., due to a restriction requirement). See MPEP §804(II)(B)(2).',
  },
  {
    id: 'pb_t0_070',
    topicId: 0,
    subtopic: 'double_patenting_utility',
    difficulty: 2,
    question: 'An applicant claims a method of using compound X to treat disease Y. A co-pending application owned by the same applicant claims compound X itself. An obviousness-type double patenting rejection is made. The most appropriate response is:',
    options: [
      'Argue that methods and compositions are always patentably distinct',
      'File a terminal disclaimer linking the two applications',
      'Cancel all claims in the later application',
      'File an appeal to the PTAB',
    ],
    correct: 1,
    explanation:
      'A method-of-use claim and a compound claim by the same owner are often patentably indistinct (the method is an obvious use of the compound). The simplest remedy is filing a terminal disclaimer to overcome the ODP rejection. See MPEP §804.02.',
  },

  // =============================================
  // TOPIC 1 -- SPECIFICATION, CLAIMS & FORMAL PAPERS (50 Qs)
  // =============================================

  // --- Specification (10 questions) ---
  {
    id: 'pb_t1_001',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 1,
    question: 'Under 37 CFR 1.77, the preferred arrangement of a nonprovisional utility patent application specification includes which of the following sections in order?',
    options: [
      'Claims, Abstract, Detailed Description, Drawings',
      'Title, Cross-Reference to Related Applications, Background, Summary, Brief Description of Drawings, Detailed Description, Claims, Abstract',
      'Abstract, Claims, Background, Detailed Description',
      'Drawings, Detailed Description, Claims, Summary',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.77(b), the preferred order is: (1) Title, (2) Cross-reference to related applications, (3) Statement regarding federally sponsored research, (4) Names of joint research parties, (5) Reference to a sequence listing, (6) Background, (7) Summary, (8) Brief description of drawings, (9) Detailed description, (10) Claims, (11) Abstract, (12) Sequence listing. See MPEP §608.01(a).',
  },
  {
    id: 'pb_t1_002',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 1,
    question: 'The abstract of a patent application must:',
    options: [
      'Not exceed 150 words and enable the reader to quickly ascertain the nature of the technical disclosure',
      'Be identical to the first claim',
      'Include all prior art references',
      'Not exceed 500 words and include the complete detailed description',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.72(b), the abstract should not exceed 150 words and should state the nature and gist of the invention so that a reader can quickly ascertain the technical disclosure. It should not be used for interpreting claim scope. See MPEP §608.01(b).',
  },
  {
    id: 'pb_t1_003',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 2,
    question: 'Trademarks or trade names appearing in the specification of a patent application must:',
    options: [
      'Be accompanied by the generic terminology and identified with proper capitalization or symbols',
      'Never appear in a patent specification under any circumstances',
      'Be used as claim limitations to identify the claimed product',
      'Be approved by the trademark owner before inclusion',
    ],
    correct: 0,
    explanation:
      'Trademarks may appear in the specification if accompanied by the generic name and properly identified. They should not be used as claim limitations because trademarks identify the source of goods, not the goods themselves, and their meaning can change over time. See MPEP §608.01(v).',
  },
  {
    id: 'pb_t1_004',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 2,
    question: 'The detailed description of a patent application must:',
    options: [
      'Describe every possible embodiment of the invention',
      'Describe the invention in sufficient detail that a PHOSITA can make and use the invention, and set forth the best mode',
      'Be limited to 10 pages',
      'Include a comparison table with all known prior art',
    ],
    correct: 1,
    explanation:
      'The detailed description must satisfy the §112(a) requirements: it must describe the invention in sufficient detail for a PHOSITA to make and use it (enablement) and must disclose the best mode known to the inventor at the time of filing. See MPEP §608.01(g).',
  },
  {
    id: 'pb_t1_005',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 2,
    question: 'Adding new matter to a patent application specification after filing is:',
    options: [
      'Permitted at any time during prosecution',
      'Prohibited under 35 U.S.C. §132 -- no amendment may introduce new matter',
      'Permitted if accompanied by a supplemental oath',
      'Permitted only if the examiner provides written consent',
    ],
    correct: 1,
    explanation:
      'Under 35 U.S.C. §132, no amendment to an application may introduce new matter into the disclosure. Any added subject matter must be supported by the original disclosure. New matter in the specification is objected to, and new matter in the claims is rejected under §112(a). See MPEP §608.04.',
  },
  {
    id: 'pb_t1_006',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 1,
    question: 'Reference numerals in the specification of a patent application should:',
    options: [
      'Correspond to the reference numerals in the drawings',
      'Be sequential starting from 100',
      'Only appear in the claims section',
      'Be avoided entirely to prevent confusion',
    ],
    correct: 0,
    explanation:
      'Reference numerals used in the specification should correspond to the elements shown in the drawings. This ensures consistency between the written description and the figures. See 37 CFR 1.84(p); MPEP §608.01(g).',
  },
  {
    id: 'pb_t1_007',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 3,
    question: 'An applicant wishes to incorporate by reference the entire disclosure of a prior patent. Under 37 CFR 1.57, this is:',
    options: [
      'Never permitted',
      'Permitted if the reference is identified in the specification by patent number and the incorporation is clear and unambiguous',
      'Permitted only for provisional applications',
      'Permitted only if the incorporated patent has expired',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.57(b) and (c), essential and non-essential material may be incorporated by reference into a nonprovisional application by clearly identifying the referenced document. For essential material, the incorporation must be accompanied by a copy of the referenced document unless it is a U.S. patent or published application. See MPEP §608.01(p).',
  },
  {
    id: 'pb_t1_008',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 2,
    question: 'The title of an invention in a patent application should be:',
    options: [
      'As broad as possible to cover all potential embodiments',
      'Brief, technical, and descriptive of the invention (preferably 2-7 words)',
      'Identical to the first independent claim',
      'A marketing slogan for the product',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.72(a), the title should be brief, technical, and descriptive. It should convey the nature of the invention concisely. The examiner may require a title change if it is not sufficiently descriptive. See MPEP §606.',
  },
  {
    id: 'pb_t1_009',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 2,
    question: 'In a patent application, the "Summary of the Invention" section:',
    options: [
      'Must repeat the claims verbatim',
      'Should present a concise summary commensurate with the invention as claimed, including the nature and gist of the invention',
      'Is not required under any USPTO rule or statute',
      'Must be identical to the abstract',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.73, the summary should be commensurate with the claimed invention and should present the substance or general idea of the invention. It is a preferred element of the specification under §1.77. See MPEP §608.01(d).',
  },
  {
    id: 'pb_t1_010',
    topicId: 1,
    subtopic: 'specification',
    difficulty: 1,
    question: 'A cross-reference to related applications in the specification is used to:',
    options: [
      'Replace the requirement for a priority claim in the ADS',
      'Identify related applications such as continuations, divisionals, and provisional applications',
      'List all competitors\' patents in the same field',
      'Automatically establish priority to the referenced applications',
    ],
    correct: 1,
    explanation:
      'A cross-reference to related applications identifies parent applications, continuations, divisionals, CIPs, and provisional applications. However, under AIA rules, the priority/benefit claim must be made in the Application Data Sheet (ADS) to be effective. The cross-reference alone does not establish priority. See 37 CFR 1.78; MPEP §608.01(a).',
  },

  // --- Claim Drafting (15 questions) ---
  {
    id: 'pb_t1_011',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 1,
    question: 'An independent claim in a patent application is one that:',
    options: [
      'References and further limits another claim',
      'Stands on its own without reference to any other claim',
      'Must be the broadest claim in the application',
      'Is required to recite every element of the specification',
    ],
    correct: 1,
    explanation:
      'An independent claim stands on its own and does not reference any other claim. A dependent claim references and further limits another claim (either independent or dependent). An application may have multiple independent claims. See 37 CFR 1.75; MPEP §608.01(i).',
  },
  {
    id: 'pb_t1_012',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'A Markush group claim uses the format:',
    options: [
      '"A composition comprising X, Y, and Z"',
      '"A composition selected from the group consisting of X, Y, and Z"',
      '"A composition wherein X is any known chemical compound"',
      '"A composition as defined in claim 1"',
    ],
    correct: 1,
    explanation:
      'A Markush group claim recites a closed list of alternatives using the format "selected from the group consisting of A, B, and C." The members must share a common property or activity. This is a proper format for claiming alternative species. See MPEP §2117 and §803.02.',
  },
  {
    id: 'pb_t1_013',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'A Jepson claim format is characterized by:',
    options: [
      'A preamble that recites what is conventional (old) followed by "the improvement comprising" and then the novel elements',
      'A list of numbered steps for a process claim',
      'A claim that references only the drawings',
      'A claim written entirely in means-plus-function language',
    ],
    correct: 0,
    explanation:
      'A Jepson claim has a preamble that describes what is known in the art, followed by the transitional phrase "the improvement comprising" (or similar), followed by the novel features. The preamble is treated as an admission of prior art. See MPEP §2129 and §608.01(m).',
  },
  {
    id: 'pb_t1_014',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 1,
    question: 'The transition phrase "comprising" in a claim means:',
    options: [
      'The claim is limited to only the recited elements (closed)',
      'The claim includes at least the recited elements and is open to additional, unrecited elements',
      'The claim must include every element described in the specification',
      'The claim is restricted to the exact embodiments described in the drawings',
    ],
    correct: 1,
    explanation:
      '"Comprising" is an open-ended transition phrase meaning the claim includes at least the listed elements but does not exclude additional elements. "Consisting of" is closed (limited to the recited elements only). "Consisting essentially of" excludes elements that materially affect basic characteristics. See MPEP §2111.03.',
  },
  {
    id: 'pb_t1_015',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'A multiple dependent claim:',
    options: [
      'Depends from two or more preceding claims in the alternative and cannot serve as a basis for another multiple dependent claim',
      'Can depend from two or more preceding claims conjunctively (i.e., from claim 1 AND claim 2)',
      'Is not permitted under U.S. patent practice',
      'Must depend from the broadest independent claim',
    ],
    correct: 0,
    explanation:
      'Under 35 U.S.C. §112(e), a multiple dependent claim references two or more preceding claims in the alternative (e.g., "The device of claim 1 or claim 2, further comprising..."). A multiple dependent claim cannot serve as a basis for another multiple dependent claim. See 37 CFR 1.75(c); MPEP §608.01(n)(I).',
  },
  {
    id: 'pb_t1_016',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'Under the broadest reasonable interpretation (BRI) standard used during prosecution, claim terms are interpreted:',
    options: [
      'According to their plain and ordinary meaning as understood by a PHOSITA in view of the specification',
      'As narrowly as possible to avoid prior art',
      'Identically to how a court would interpret them in litigation',
      'Only according to dictionary definitions',
    ],
    correct: 0,
    explanation:
      'During examination, the USPTO applies the broadest reasonable interpretation (BRI) consistent with the specification. This means claim terms receive their ordinary meaning to a PHOSITA as informed by the specification, without importing limitations from the specification into the claims. See MPEP §2111.',
  },
  {
    id: 'pb_t1_017',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 3,
    question: 'A claim recites: "A device comprising: a housing; a sensor; and a processor." Which of the following products infringes this claim under the doctrine of equivalents or literal infringement?',
    options: [
      'A device with a housing, sensor, processor, and display',
      'A device with only a housing and sensor but no processor',
      'A device with a housing and processor but no sensor',
      'A method of manufacturing a sensor',
    ],
    correct: 0,
    explanation:
      'Because "comprising" is open-ended, a device that includes all recited elements (housing, sensor, processor) plus additional elements (display) literally infringes the claim. A device missing any recited element (B or C) does not literally infringe. A method claim is a different category entirely. See MPEP §2111.03.',
  },
  {
    id: 'pb_t1_018',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 1,
    question: 'When amending claims during prosecution, an applicant must:',
    options: [
      'Submit an entirely new set of claims replacing all original claims',
      'Show changes using markings (strikethrough for deletions, underlining for additions) relative to the immediately preceding version',
      'Only add new claims; existing claims cannot be modified',
      'Obtain the examiner\'s pre-approval before filing any amendment',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.121(c), claim amendments must show changes relative to the immediately preceding version, with deletions in strikethrough and additions in underlining. The entire claim must be presented with markings. See MPEP §714.02.',
  },
  {
    id: 'pb_t1_019',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'A product-by-process claim:',
    options: [
      'Is always invalid because it mixes statutory categories',
      'Defines a product in terms of the process by which it is made, and is assessed for patentability based on the product itself',
      'Is limited during examination to products made by the exact recited process',
      'Must include the words "product-by-process" in the claim',
    ],
    correct: 1,
    explanation:
      'A product-by-process claim defines a product by the process of its manufacture. During prosecution, the product is not limited to the specific process -- patentability is based on the product itself, regardless of how it is made. If the product is the same as the prior art, the claim is unpatentable. See MPEP §2113.',
  },
  {
    id: 'pb_t1_020',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'The preamble of a claim:',
    options: [
      'Always limits the scope of the claim',
      'Never limits the scope of the claim',
      'Limits the scope of the claim if it gives life, meaning, and vitality to the claim or recites essential structure',
      'Is optional and can be omitted from any claim',
    ],
    correct: 2,
    explanation:
      'The preamble limits the claim if it is necessary to give meaning to the claim, recites essential structure, or is relied upon for differentiation from the prior art. If the preamble merely states an intended use and the body defines a structurally complete invention, it is generally not limiting. See MPEP §2111.02.',
  },
  {
    id: 'pb_t1_021',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 3,
    question: 'An examiner objects to a claim as containing improper antecedent basis. Which statement is correct?',
    options: [
      'Antecedent basis issues are rejections under §102',
      'A claim term should be introduced with "a" or "an" on first use and subsequently referred to with "the" or "said" -- failure to do so creates a §112(b) issue',
      'Antecedent basis only applies to independent claims',
      'The applicant must define every claim term in the specification',
    ],
    correct: 1,
    explanation:
      'Proper antecedent basis requires that a claim element be introduced with an indefinite article ("a" or "an") on its first recitation and referred to with a definite article ("the" or "said") on subsequent recitations. Lack of antecedent basis creates a §112(b) clarity issue. See MPEP §2173.05(e).',
  },
  {
    id: 'pb_t1_022',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 1,
    question: 'The transition "consisting of" in a claim means:',
    options: [
      'The claim is open to additional elements',
      'The claim is closed and limited to the recited elements only, excluding any unrecited elements',
      'The claim includes elements that are substantially similar',
      'The claim requires at least two of the listed elements',
    ],
    correct: 1,
    explanation:
      '"Consisting of" is a closed transition phrase that excludes any elements, steps, or ingredients not specified in the claim. This is the most restrictive transition. See MPEP §2111.03(II).',
  },
  {
    id: 'pb_t1_023',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'A dependent claim that broadens the scope of the independent claim from which it depends:',
    options: [
      'Is permissible because dependent claims define additional embodiments',
      'Violates §112(d), which requires a dependent claim to further limit the referenced claim',
      'Is proper if the dependent claim adds an alternative element',
      'Is only improper if it depends from another dependent claim',
    ],
    correct: 1,
    explanation:
      'Under §112(d), a dependent claim must contain a reference to a prior claim and further limit (narrow) the subject matter of that claim. A dependent claim that broadens the independent claim fails this requirement. See MPEP §608.01(n)(III).',
  },
  {
    id: 'pb_t1_024',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 3,
    question: 'When the claims recite a numerical range (e.g., "10-50% by weight"), and the prior art discloses an overlapping range (e.g., "5-40% by weight"), the claim is:',
    options: [
      'Automatically anticipated because the ranges overlap',
      'Prima facie obvious because of the overlapping range, but the applicant may rebut with evidence of unexpected results in the claimed range',
      'Novel because the ranges are not identical',
      'Non-obvious because the claimed range extends beyond the prior art range',
    ],
    correct: 1,
    explanation:
      'Overlapping ranges create a prima facie case of obviousness. The applicant may rebut this by showing that the claimed range produces unexpected results compared to the prior art range. If the prior art range fully encompasses the claimed range, anticipation may also be at issue. See MPEP §2144.05.',
  },
  {
    id: 'pb_t1_025',
    topicId: 1,
    subtopic: 'claim_drafting',
    difficulty: 2,
    question: 'A "means-plus-function" claim element under §112(f) uses "means for [function]" language. Which of the following is NOT a consequence of invoking §112(f)?',
    options: [
      'The claim element is limited to the structure disclosed in the specification and equivalents',
      'If no corresponding structure is disclosed, the claim is indefinite',
      'The claim is automatically broader than a structural recitation',
      'The specification must disclose adequate structure for the recited function',
    ],
    correct: 2,
    explanation:
      'Invoking §112(f) does NOT make the claim broader. In fact, it narrows the claim by limiting it to the corresponding structure described in the specification and equivalents thereof. If no structure is disclosed, the claim is indefinite under §112(b). See MPEP §2181.',
  },

  // --- Drawings & Formal Papers (10 questions) ---
  {
    id: 'pb_t1_026',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 1,
    question: 'Under 37 CFR 1.84, formal patent drawings must:',
    options: [
      'Be in color in all cases',
      'Be on paper of specific size, with black ink lines sufficiently dense and dark for reproduction',
      'Include photographs only',
      'Be filed within 6 months of the filing date',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.84, drawings must be on paper of certain dimensions (21.6 cm by 27.9 cm or 21 cm by 29.7 cm), with black, sufficiently dense ink lines that are durable and reproducible. Color drawings require a petition. Photographs are allowed only when the subject matter cannot be shown in drawings. See MPEP §608.02.',
  },
  {
    id: 'pb_t1_027',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 2,
    question: 'An applicant files a patent application with informal drawings. The examiner may:',
    options: [
      'Immediately reject the application for lack of drawings',
      'Accept the informal drawings for purposes of examination and require formal drawings before the application can be allowed',
      'Refuse to examine the application until formal drawings are filed',
      'Grant a patent with informal drawings without further action',
    ],
    correct: 1,
    explanation:
      'The USPTO may accept informal drawings for purposes of examination. However, formal drawings meeting the requirements of 37 CFR 1.84 will be required before the application is allowed. An objection to the drawings will be made, giving the applicant an opportunity to submit corrected drawings. See MPEP §608.02(b).',
  },
  {
    id: 'pb_t1_028',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 2,
    question: 'Under 35 U.S.C. §113, drawings are required in a patent application when:',
    options: [
      'Always, regardless of the nature of the invention',
      'When the nature of the case requires a drawing for understanding the invention',
      'Only for mechanical inventions',
      'Only when the examiner requests them',
    ],
    correct: 1,
    explanation:
      'Under §113, drawings are required when necessary for the understanding of the subject matter to be patented. For most inventions, drawings are required. Chemical compound claims may not require drawings. The Director may require drawings if needed for understanding. See MPEP §608.02.',
  },
  {
    id: 'pb_t1_029',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 1,
    question: 'In patent drawings, each figure must be:',
    options: [
      'Drawn to an exact scale specified by the USPTO',
      'Numbered consecutively (FIG. 1, FIG. 2, etc.) and include reference characters corresponding to the specification',
      'In color with shading',
      'Accompanied by a separate written description on the same sheet',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.84(u), figures must be numbered consecutively (FIG. 1, FIG. 2, etc.). Reference characters must correspond to those in the specification and be placed outside the view where possible. See MPEP §608.02(g).',
  },
  {
    id: 'pb_t1_030',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 2,
    question: 'An applicant wishes to file color drawings. Under 37 CFR 1.84(a)(2), this requires:',
    options: [
      'No special action; color drawings are always accepted',
      'A petition explaining why color is necessary, the fee, and three sets of color drawings',
      'Approval from the examiner before filing',
      'A declaration that the invention cannot be shown in black and white',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.84(a)(2), color drawings require a petition explaining why color is necessary, payment of the petition fee, and three sets of the color drawings. The petition must establish that color is the only practical medium. See MPEP §608.02(VIII).',
  },
  {
    id: 'pb_t1_031',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 3,
    question: 'New matter cannot be added to patent drawings after filing. If an applicant files replacement drawings that include features not shown in the original drawings and not described in the original specification, the new features are:',
    options: [
      'Accepted as a correction of the drawings',
      'Objected to as new matter under §132',
      'Automatically added to the claims',
      'Treated as amendments to the specification',
    ],
    correct: 1,
    explanation:
      'Under §132, no amendment may introduce new matter. If replacement drawings include features not supported by the original specification or drawings, the new features constitute new matter and will be objected to. The examiner will require the applicant to remove the unsupported features. See MPEP §608.04(a).',
  },
  {
    id: 'pb_t1_032',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 1,
    question: 'The oath or declaration filed with a patent application must state that:',
    options: [
      'The applicant is a U.S. citizen',
      'The inventor believes himself or herself to be the original inventor of the claimed invention',
      'The invention has been reduced to practice',
      'The applicant is not aware of any prior art',
    ],
    correct: 1,
    explanation:
      'Under 35 U.S.C. §115 and 37 CFR 1.63, the oath/declaration must state that the application was made or authorized by the declarant and that the person believes himself/herself to be the original inventor or joint inventor. Citizenship, reduction to practice, and prior art awareness are not required statements. See MPEP §602.',
  },
  {
    id: 'pb_t1_033',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 2,
    question: 'Under the AIA, a substitute statement under 37 CFR 1.64 may be filed in lieu of an inventor\'s oath or declaration when:',
    options: [
      'The inventor is deceased, legally incapacitated, cannot be found after diligent effort, or refuses to execute the oath',
      'The inventor prefers not to sign paperwork',
      'The application is a provisional application',
      'The applicant is a large entity',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.64, a substitute statement may be filed when the inventor is deceased, legally incapacitated, cannot be found or reached after diligent effort, or is under obligation to assign but has refused to execute the oath/declaration. See MPEP §602.01(b).',
  },
  {
    id: 'pb_t1_034',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 2,
    question: 'An Application Data Sheet (ADS) under 37 CFR 1.76:',
    options: [
      'Is mandatory for all applications and contains bibliographic data including applicant information, correspondence address, and domestic benefit/foreign priority claims',
      'Is optional and used only for design patent applications',
      'Replaces the specification in a patent application',
      'Is filed only after a patent is granted',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.76, the ADS is the primary document for presenting bibliographic data including inventor, applicant, correspondence address, domestic benefit claims, and foreign priority claims. Under AIA rules, it is the vehicle for claiming benefit and priority. See MPEP §601.05.',
  },
  {
    id: 'pb_t1_035',
    topicId: 1,
    subtopic: 'drawings_formal',
    difficulty: 1,
    question: 'A patent application may be assigned to a person or entity. Under 37 CFR 3.73, the assignee:',
    options: [
      'Automatically becomes the applicant without any filing',
      'Must establish ownership to take action in the application, typically by recording the assignment and filing a statement under §3.73(c)',
      'Cannot prosecute the application without the inventor\'s ongoing participation',
      'Must be a U.S. entity',
    ],
    correct: 1,
    explanation:
      'An assignee must establish its ownership of the application to take action (such as signing papers). This is done by recording the assignment at the USPTO and filing a §3.73(c) statement establishing the chain of title. See MPEP §324.',
  },

  // --- IDS & Inventorship (15 questions) ---
  {
    id: 'pb_t1_036',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 1,
    question: 'Under 37 CFR 1.56 (Rule 56), each individual associated with the filing and prosecution of a patent application has a duty of candor to:',
    options: [
      'Disclose all information known to the inventor about any topic',
      'Disclose to the USPTO all information material to patentability',
      'Disclose only prior art references found by the examiner',
      'Disclose information about competitors\' products',
    ],
    correct: 1,
    explanation:
      'Under Rule 56, each individual associated with the filing and prosecution (inventors, attorneys, agents) has a duty to disclose to the USPTO all information known to be material to patentability. This is done by filing an Information Disclosure Statement (IDS). See MPEP §2001.',
  },
  {
    id: 'pb_t1_037',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'An Information Disclosure Statement (IDS) under 37 CFR 1.97 filed within three months of the filing date or before the first office action, whichever is later:',
    options: [
      'Requires a fee and a certification statement',
      'Requires no fee or certification statement -- it is considered as a matter of right',
      'Must be accompanied by an explanation of relevance for each reference',
      'Is only accepted if the examiner agrees to consider it',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.97(b), an IDS filed within 3 months of the filing date (or before the first office action on the merits) requires no fee or certification statement. It is considered by the examiner as a matter of right. See MPEP §609.04(b).',
  },
  {
    id: 'pb_t1_038',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'An IDS filed after the mailing of a first office action but before the mailing of a final office action or notice of allowance requires:',
    options: [
      'Nothing additional -- it is filed as of right',
      'Either a certification statement under 37 CFR 1.97(e) or payment of the fee under 37 CFR 1.17(p)',
      'A petition to the Director',
      'The examiner\'s written permission',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.97(c), an IDS filed after the first office action but before a final OA or notice of allowance must be accompanied by either a certification statement under §1.97(e) or the fee under §1.17(p). See MPEP §609.04(b).',
  },
  {
    id: 'pb_t1_039',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 3,
    question: 'An IDS filed after the mailing of a final office action, notice of allowance, or after payment of the issue fee requires:',
    options: [
      'Only the IDS fee',
      'Both a certification statement under §1.97(e) AND the fee under §1.17(p)',
      'A petition to withdraw from issue under 37 CFR 1.313 and RCE or continuation filing',
      'Either a certification statement or the fee, but not both',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.97(d), an IDS filed after final OA, notice of allowance, or similar requires BOTH the certification statement AND the fee. After payment of the issue fee, an IDS generally cannot be filed without a petition to withdraw from issue or filing an RCE/continuation. See MPEP §609.04(b).',
  },
  {
    id: 'pb_t1_040',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'The certification statement under 37 CFR 1.97(e) for an IDS requires the individual to certify that:',
    options: [
      'All prior art relevant to the application has been disclosed',
      'Each item of information in the IDS was first cited in a foreign office action or was known to any person under Rule 56 not more than 3 months before filing the IDS',
      'The references were found through a professional prior art search',
      'The applicant has no knowledge of any invalidating prior art',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.97(e), the certification states that (1) each item was first cited in a communication from a foreign patent office in a counterpart application not more than 3 months before filing the IDS, or (2) no item was known to any person under Rule 56 more than 3 months prior to the IDS filing. See MPEP §609.04(b).',
  },
  {
    id: 'pb_t1_041',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 1,
    question: 'Under 37 CFR 1.98, an IDS must include:',
    options: [
      'A listing of all references on a PTO/SB/08 form, copies of non-U.S. patent documents, and an English translation or concise explanation of relevance for non-English references',
      'Only a list of patent numbers',
      'A detailed written analysis of each reference\'s relevance',
      'Copies of all U.S. patents cited',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.98, an IDS requires: a list of references (typically on form PTO/SB/08), legible copies of non-U.S. patent documents and non-patent literature, and for non-English references, a concise explanation of relevance or an English translation. Copies of U.S. patents are not required as the USPTO has access. See MPEP §609.04(a).',
  },
  {
    id: 'pb_t1_042',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'Individuals who owe a duty of candor under Rule 56 include:',
    options: [
      'Only the named inventors',
      'Each inventor, the attorney/agent who prepares or prosecutes the application, and every other person substantively involved in preparation or prosecution',
      'Only the patent attorney of record',
      'The examiner and the applicant\'s competitors',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.56(c), the duty of candor extends to: (1) each named inventor, (2) each attorney or agent who prepares or prosecutes the application, and (3) every other person who is substantively involved in the preparation or prosecution and is associated with the inventor, applicant, or assignee. See MPEP §2001.01.',
  },
  {
    id: 'pb_t1_043',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 1,
    question: 'Joint inventorship under 35 U.S.C. §116 requires that:',
    options: [
      'Each joint inventor must have contributed to every claim in the application',
      'Joint inventors need not have worked together, at the same time, or contributed to every claim, but each must have contributed to the conception of at least one claim',
      'All joint inventors must be employed by the same entity',
      'Joint inventors must file separate applications',
    ],
    correct: 1,
    explanation:
      'Under §116, joint inventors need not have physically worked together or at the same time, and each need not have contributed to every claim. Each joint inventor must have made a contribution to the conception of at least one claim. See MPEP §2137.01.',
  },
  {
    id: 'pb_t1_044',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'An error in naming the inventors in a patent application can be corrected under:',
    options: [
      '35 U.S.C. §256 (for issued patents) or 37 CFR 1.48 (for applications), provided the error occurred without deceptive intent',
      'Only by filing a new application',
      '35 U.S.C. §102 by filing a prior art declaration',
      'Only during an interference proceeding',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.48, inventorship in a pending application can be corrected by filing a request, an ADS identifying the correct inventors, and (if adding an inventor) the inventor\'s oath/declaration. For issued patents, §256 allows correction. The error must not have been made with deceptive intent. See MPEP §602.01(c).',
  },
  {
    id: 'pb_t1_045',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 3,
    question: 'A patent practitioner learns of a highly material prior art reference after the notice of allowance but before the issue fee is paid. The practitioner must:',
    options: [
      'Do nothing because prosecution is closed',
      'File an IDS with both the §1.97(e) certification statement and the §1.17(p) fee before the issue fee is paid',
      'Wait until the patent issues and file a supplemental examination',
      'Call the examiner informally to discuss the reference',
    ],
    correct: 1,
    explanation:
      'The duty of candor under Rule 56 continues throughout prosecution. After a notice of allowance but before the issue fee is paid, an IDS may still be filed under 37 CFR 1.97(d), requiring both the certification statement and the fee. The practitioner has an obligation to disclose. See MPEP §609.04(b) and §2001.06(c).',
  },
  {
    id: 'pb_t1_046',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'Failure to comply with the duty of candor under Rule 56 may result in:',
    options: [
      'Criminal prosecution of the inventor',
      'A finding of inequitable conduct, which can render the entire patent unenforceable',
      'Automatic rejection of all pending claims',
      'A fine payable to the USPTO',
    ],
    correct: 1,
    explanation:
      'If material information is withheld with intent to deceive the USPTO, a court may find inequitable conduct, which renders the entire patent unenforceable (not just the affected claims). This is a defense in litigation, not an action taken by the USPTO during prosecution. See MPEP §2016; Therasense v. Becton Dickinson.',
  },
  {
    id: 'pb_t1_047',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'A person who merely suggests a desired result or provides funding for an invention but does not contribute to the conception is:',
    options: [
      'A joint inventor',
      'Not an inventor -- conception requires contribution to the inventive idea, not merely suggesting a goal or providing resources',
      'A co-inventor under §116 by virtue of financial contribution',
      'Automatically listed on the application as a co-applicant',
    ],
    correct: 1,
    explanation:
      'Inventorship requires a contribution to the conception of the invention. Merely suggesting a desired result, providing funding, supervising without intellectual contribution, or performing routine experiments under direction does not qualify as inventorship. See MPEP §2137.01.',
  },
  {
    id: 'pb_t1_048',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 1,
    question: 'Information is "material to patentability" under 37 CFR 1.56(b) if:',
    options: [
      'It is relevant to any legal proceeding involving the applicant',
      'It establishes a prima facie case of unpatentability of a claim, or refutes or is inconsistent with a position taken by the applicant',
      'It is information about the applicant\'s competitors',
      'It was published after the filing date of the application',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.56(b), information is material if (1) it establishes, by itself or in combination, a prima facie case of unpatentability, or (2) it refutes or is inconsistent with a position taken by the applicant in asserting patentability. See MPEP §2001.04.',
  },
  {
    id: 'pb_t1_049',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 3,
    question: 'Under Therasense, Inc. v. Becton, Dickinson & Co. (2011), the Federal Circuit held that to establish inequitable conduct, the challenger must prove:',
    options: [
      'Any failure to disclose relevant information, regardless of intent',
      'That the withheld reference is material under a "but-for" standard (the patent would not have issued but for the nondisclosure) AND that the applicant made a deliberate decision to withhold it with specific intent to deceive',
      'That the applicant negligently failed to conduct a thorough prior art search',
      'That the examiner would have been interested in the reference',
    ],
    correct: 1,
    explanation:
      'In Therasense (2011), the Federal Circuit raised the standard for inequitable conduct, requiring (1) but-for materiality (the withheld reference would have prevented the patent from issuing) and (2) specific intent to deceive the USPTO. The exception is affirmative egregious misconduct, where but-for materiality is not required. See MPEP §2016.',
  },
  {
    id: 'pb_t1_050',
    topicId: 1,
    subtopic: 'ids_inventorship',
    difficulty: 2,
    question: 'Under the AIA, if an application names an incorrect inventive entity (missing a true inventor), and the error is discovered during prosecution, correction is available under:',
    options: [
      '37 CFR 1.48, by filing a request to correct inventorship along with a corrected ADS and the required inventor oath/declaration',
      'Only by filing a new application with the correct inventors',
      '37 CFR 1.131 by filing a declaration of prior invention',
      '35 U.S.C. §135 by filing a derivation proceeding',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.48 (AIA), inventorship in a pending application can be corrected by filing a request, a corrected ADS, the required oath/declaration for any added inventor, and the processing fee. Deceptive intent in the original error is not a bar to correction under AIA rules. See MPEP §602.01(c).',
  },

  // =============================================
  // TOPIC 2 -- FILING TYPES & PROSECUTION TIMELINE (60 Qs)
  // =============================================

  // --- Provisional / Nonprovisional (15 questions) ---
  {
    id: 'pb_t2_001',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 1,
    question: 'A provisional patent application under 35 U.S.C. §111(b) requires:',
    options: [
      'Claims, an oath or declaration, and a formal specification',
      'A cover sheet, a specification (written description), and any drawings necessary for understanding the invention -- but does NOT require claims or an oath/declaration',
      'Only a cover sheet and filing fee',
      'A complete specification, claims, oath, and information disclosure statement',
    ],
    correct: 1,
    explanation:
      'Under §111(b), a provisional application requires: (1) a cover sheet (or equivalent identifying the application as a provisional), (2) a specification containing a written description, (3) any necessary drawings, and (4) the filing fee. Claims and an oath/declaration are NOT required. See MPEP §601.01(b).',
  },
  {
    id: 'pb_t2_002',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 1,
    question: 'A provisional application automatically expires after:',
    options: [
      '6 months',
      '12 months from its filing date',
      '18 months',
      '20 years',
    ],
    correct: 1,
    explanation:
      'A provisional application has a 12-month pendency period from its filing date. It is automatically abandoned at the end of this period. To preserve the benefit of the provisional filing date, a nonprovisional application claiming benefit must be filed within this 12-month window. See 35 U.S.C. §111(b)(5); MPEP §601.01(b).',
  },
  {
    id: 'pb_t2_003',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'To claim the benefit of a provisional application in a later-filed nonprovisional, the nonprovisional must:',
    options: [
      'Be filed within 12 months of the provisional filing date and contain a specific reference to the provisional in the ADS',
      'Be filed within 18 months and contain identical claims',
      'Be filed within 6 months with a certified copy of the provisional',
      'Be filed at any time and include a general reference to "prior applications"',
    ],
    correct: 0,
    explanation:
      'Under 35 U.S.C. §119(e) and 37 CFR 1.78, a nonprovisional application must be filed within 12 months of the provisional filing date and must contain or be amended to contain a specific reference to the provisional application in the ADS. The provisional must also support the claimed subject matter. See MPEP §211.01(a).',
  },
  {
    id: 'pb_t2_004',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'A provisional application:',
    options: [
      'Can be examined on the merits by the USPTO',
      'Cannot be examined on the merits and will not mature into a patent',
      'Automatically converts to a nonprovisional after 12 months',
      'Receives a publication at 18 months',
    ],
    correct: 1,
    explanation:
      'A provisional application is NOT examined on the merits and cannot mature into a patent. It simply establishes a filing date and must be followed by a nonprovisional application within 12 months to preserve the benefit. It is not published. See MPEP §601.01(b).',
  },
  {
    id: 'pb_t2_005',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 1,
    question: 'The filing fee for a provisional application compared to a nonprovisional application is:',
    options: [
      'Higher because provisionals require expedited processing',
      'The same for both application types',
      'Lower, as the provisional has reduced formal requirements',
      'Free for small entities',
    ],
    correct: 2,
    explanation:
      'The provisional filing fee is significantly lower than the nonprovisional filing fee. This, combined with reduced formality requirements (no claims, no oath), makes provisionals a cost-effective way to establish an early filing date. See 37 CFR 1.16; MPEP §601.01(b).',
  },
  {
    id: 'pb_t2_006',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'A nonprovisional utility application under 35 U.S.C. §111(a) requires all of the following EXCEPT:',
    options: [
      'A specification with at least one claim',
      'An oath or declaration (or substitute statement)',
      'A filing fee',
      'A prior art search report',
    ],
    correct: 3,
    explanation:
      'A nonprovisional application under §111(a) requires: a specification (including at least one claim), drawings (if necessary), an oath/declaration, and the filing fee. A prior art search report is NOT required by the USPTO (unlike some foreign patent offices). See MPEP §601.01(a).',
  },
  {
    id: 'pb_t2_007',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'If an applicant files a nonprovisional application 14 months after the provisional filing date without requesting a late benefit claim:',
    options: [
      'The benefit claim is automatically granted with a surcharge',
      'The provisional benefit is lost because the 12-month period has expired and no timely petition was filed',
      'The examiner extends the deadline automatically',
      'The provisional filing date still applies because the AIA eliminated time limits',
    ],
    correct: 1,
    explanation:
      'The nonprovisional must be filed within 12 months of the provisional filing date. If this deadline is missed, the benefit may be restored by petition under 37 CFR 1.78(b) if the delay was unintentional, the nonprovisional was filed within 14 months, and the petition fee is paid. If no petition is filed, the benefit is lost. See MPEP §211.01(a).',
  },
  {
    id: 'pb_t2_008',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 3,
    question: 'An applicant files a provisional application on January 1, 2024, describing embodiment A. On June 1, 2024, the applicant files a second provisional application describing embodiment B (which includes new material not in the first provisional). On December 15, 2024, the applicant files a nonprovisional claiming benefit to both provisionals. The claims of the nonprovisional that are supported only by the second provisional have an effective filing date of:',
    options: [
      'January 1, 2024 (the first provisional)',
      'June 1, 2024 (the second provisional)',
      'December 15, 2024 (the nonprovisional filing date)',
      'The earliest date among all three applications',
    ],
    correct: 1,
    explanation:
      'Each claim\'s effective filing date depends on which provisional adequately supports (under §112(a)) the subject matter of that claim. Claims supported only by the second provisional have an effective filing date of June 1, 2024. Claims supported by the first provisional can claim January 1, 2024. See MPEP §211.05.',
  },
  {
    id: 'pb_t2_009',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 1,
    question: 'A provisional application may claim benefit to an earlier provisional application.',
    options: [
      'True -- provisionals can form a chain of benefit',
      'False -- a provisional cannot claim benefit to another provisional',
      'True, but only if both provisionals have the same inventor',
      'True, but only if the earlier provisional is still pending',
    ],
    correct: 1,
    explanation:
      'A provisional application cannot claim benefit to another provisional under §119(e). Only a nonprovisional application or international application designating the U.S. can claim benefit to a provisional. Provisionals cannot be chained together. See MPEP §211.01.',
  },
  {
    id: 'pb_t2_010',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'The 12-month pendency period for a provisional application:',
    options: [
      'Can be extended by filing a petition with the USPTO',
      'Cannot be extended -- it is a statutory deadline',
      'Can be extended by paying an additional fee',
      'Is automatically extended if the applicant is a small entity',
    ],
    correct: 1,
    explanation:
      'The 12-month pendency period for a provisional application under §111(b)(5) is a statutory deadline that cannot be extended. However, a late benefit claim may be petitioned for under 37 CFR 1.78 if the delay was unintentional. See MPEP §601.01(b).',
  },
  {
    id: 'pb_t2_011',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'A provisional application does NOT establish a date for purposes of:',
    options: [
      'Prior art date under §102(a)(2)',
      'Claiming domestic benefit under §119(e)',
      'Establishing a right of priority under the Paris Convention',
      'Both A and C',
    ],
    correct: 3,
    explanation:
      'A provisional application is NOT treated as a prior art reference under §102(a)(2) (it is not a "patent" or "published application"). It also cannot be used to establish a right of priority under the Paris Convention (which requires a formal filing). Its primary use is to establish a domestic benefit date under §119(e). See MPEP §2136.03 and §213.03.',
  },
  {
    id: 'pb_t2_012',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 1,
    question: 'Under the micro entity fee schedule (37 CFR 1.29), a qualifying applicant pays approximately what percentage of the standard (large entity) fee?',
    options: [
      '25%',
      '50%',
      '75%',
      '80%',
    ],
    correct: 0,
    explanation:
      'Under the micro entity fee schedule, qualifying applicants pay 75% less than the standard fee (i.e., 25% of the large entity fee). Small entities pay 50% of the large entity fee. Micro entity status requires meeting small entity criteria plus additional requirements. See 37 CFR 1.29; MPEP §509.04.',
  },
  {
    id: 'pb_t2_013',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 2,
    question: 'When converting a provisional application to a nonprovisional application under 37 CFR 1.53(c)(3):',
    options: [
      'The provisional is replaced and the filing date is the conversion request date',
      'The provisional filing date is retained as the filing date of the nonprovisional, but the 20-year patent term runs from the provisional filing date',
      'The filing date is the date the claims are added',
      'Conversion is not possible; only benefit claims are allowed',
    ],
    correct: 1,
    explanation:
      'Converting a provisional to a nonprovisional retains the provisional filing date. However, the disadvantage is that the 20-year patent term under §154(a)(2) runs from the provisional filing date, effectively shortening the patent term by the time between the provisional and the conversion. Filing a new nonprovisional claiming benefit avoids this issue. See MPEP §601.01(b)(3).',
  },
  {
    id: 'pb_t2_014',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 3,
    question: 'An applicant inadvertently files a nonprovisional application without any claims. Under current USPTO rules:',
    options: [
      'The application is immediately rejected and the filing date is not granted',
      'The application receives a filing date (since claims are not required for a filing date under 37 CFR 1.53(b)), but the applicant will be notified to file claims to complete the application',
      'The application is treated as a provisional application',
      'The application receives a filing date only if accompanied by an oath',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.53(b), a nonprovisional application receives a filing date based on the specification (with or without claims) and any necessary drawings. Claims are required but their absence does not prevent a filing date; the applicant will be given a time period to submit claims. See MPEP §601.01(a).',
  },
  {
    id: 'pb_t2_015',
    topicId: 2,
    subtopic: 'provisional_nonprovisional',
    difficulty: 1,
    question: 'Which entity size status entitles an applicant to pay 50% of the standard USPTO fee?',
    options: [
      'Micro entity',
      'Small entity',
      'Large entity',
      'Nonprofit entity',
    ],
    correct: 1,
    explanation:
      'Small entity status under 37 CFR 1.27 entitles applicants (individuals, small businesses with fewer than 500 employees, and nonprofits) to pay 50% of the standard fees. Micro entities pay 25%. Large entities pay 100%. See MPEP §509.02.',
  },

  // --- Priority & Benefit (15 questions) ---
  {
    id: 'pb_t2_016',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 1,
    question: 'Foreign priority under 35 U.S.C. §119(a)-(d) based on the Paris Convention allows an applicant to claim priority from a foreign application filed within:',
    options: [
      '6 months for all types of applications',
      '12 months for utility and plant applications, and 6 months for design applications',
      '18 months for utility applications',
      '12 months for all types of applications',
    ],
    correct: 1,
    explanation:
      'Under §119(a)-(d) and the Paris Convention, the priority period is 12 months for utility and plant patent applications and 6 months for design patent applications, measured from the filing date of the foreign application. See MPEP §213.',
  },
  {
    id: 'pb_t2_017',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'To properly claim foreign priority under §119, the applicant must:',
    options: [
      'File the U.S. application within the priority period, identify the foreign application in the ADS, and file a certified copy of the foreign application (unless available through the priority document exchange program)',
      'File the U.S. application and include a copy of the foreign office action',
      'File the U.S. application within 24 months of the foreign filing',
      'File a petition requesting priority with the USPTO Director',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.55, foreign priority requires: (1) timely filing of the U.S. application, (2) identification of the foreign application in the ADS, and (3) filing a certified copy of the foreign application or relying on the priority document exchange (PDX) program. See MPEP §213.02.',
  },
  {
    id: 'pb_t2_018',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'Domestic benefit under 35 U.S.C. §120 allows a later-filed application to claim the benefit of an earlier nonprovisional application. All of the following are required EXCEPT:',
    options: [
      'The earlier application must disclose the claimed invention in compliance with §112(a)',
      'At least one common inventor between the earlier and later applications',
      'The later application must be copending with or filed before the patenting of the earlier application',
      'The later application must be filed within 12 months of the earlier application',
    ],
    correct: 3,
    explanation:
      'Section 120 does not require filing within 12 months (that is the §119(e) provisional requirement). For §120 domestic benefit, the requirements are: (1) disclosure compliance under §112(a), (2) at least one inventor in common (or assignment to the same entity), and (3) copendency (the later application must be filed while the earlier is still pending). See MPEP §211.01.',
  },
  {
    id: 'pb_t2_019',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 1,
    question: 'A continuation-in-part (CIP) application:',
    options: [
      'Contains only subject matter from the parent application',
      'Contains subject matter from the parent application plus new matter not disclosed in the parent',
      'Is identical to a divisional application',
      'Cannot claim benefit to the parent application',
    ],
    correct: 1,
    explanation:
      'A CIP application includes some subject matter from the parent and adds new matter (subject matter not disclosed in the parent). Claims supported by the parent\'s disclosure get the parent\'s filing date; claims relying on the new matter get the CIP\'s filing date. See MPEP §201.08.',
  },
  {
    id: 'pb_t2_020',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'The domestic benefit claim under §120 must be made in the later application by:',
    options: [
      'Including a reference in the specification only',
      'Including the claim in the Application Data Sheet (ADS) filed during the pendency of the later application',
      'Filing a petition with the Director',
      'Including a certified copy of the parent application',
    ],
    correct: 1,
    explanation:
      'Under AIA rules (37 CFR 1.78(d)), a domestic benefit claim must be made in the ADS. A cross-reference in the specification alone is not sufficient under AIA requirements. The benefit claim must be made during the pendency of the later application. See MPEP §211.01.',
  },
  {
    id: 'pb_t2_021',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 3,
    question: 'Applicant files a first nonprovisional application (App A) on January 1, 2023. App A is abandoned on June 1, 2024, without any continuation being filed during its pendency. On August 1, 2024, the applicant files a new application (App B) and attempts to claim benefit to App A under §120. Is this benefit claim proper?',
    options: [
      'Yes, because App A was filed by the same inventor',
      'No, because App B was not copending with App A -- App A was abandoned before App B was filed',
      'Yes, because §120 has no copendency requirement',
      'No, because App B must be a continuation-in-part',
    ],
    correct: 1,
    explanation:
      'Section 120 requires copendency -- the later application must be filed while the earlier application is still pending (or before it issues as a patent). Since App A was abandoned on June 1, 2024, and App B was not filed until August 1, 2024, there is no copendency, and the benefit claim fails. See MPEP §211.01(b).',
  },
  {
    id: 'pb_t2_022',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'Under the Paris Convention, a foreign priority claim provides:',
    options: [
      'An actual filing date in the foreign country for the U.S. application',
      'An effective filing date for prior art purposes, meaning the U.S. application is treated as if filed on the foreign filing date for §102/103 prior art analysis',
      'Automatic patent protection in the United States',
      'Guaranteed examination within 6 months',
    ],
    correct: 1,
    explanation:
      'A properly claimed foreign priority date serves as the "effective filing date" for prior art purposes under §§102 and 103. It does not change the actual U.S. filing date and does not affect the patent term calculation (which runs from the U.S. filing date). See MPEP §213.',
  },
  {
    id: 'pb_t2_023',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 1,
    question: 'A divisional application is:',
    options: [
      'A new application filed for subject matter that was carved out (divided) from a parent application, typically in response to a restriction requirement',
      'An application that adds new matter to the parent application',
      'An application filed in a foreign country based on a U.S. application',
      'An amended version of the parent application',
    ],
    correct: 0,
    explanation:
      'A divisional application is filed for an independent and distinct invention that was required to be restricted from the parent application under a restriction requirement (35 U.S.C. §121). It contains only subject matter disclosed in the parent and receives the parent\'s filing date for supported claims. See MPEP §201.06.',
  },
  {
    id: 'pb_t2_024',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'Under 35 U.S.C. §121, a patent issuing on a divisional application resulting from a restriction requirement:',
    options: [
      'Is subject to obviousness-type double patenting against the parent patent',
      'Is protected from obviousness-type double patenting based on the parent patent, provided the restriction requirement was proper',
      'Must include all claims from the parent application',
      'Has a different patent term than the parent',
    ],
    correct: 1,
    explanation:
      'Section 121 provides a "safe harbor" -- a patent on a divisional application made in response to a restriction requirement cannot be used as a basis for ODP against the parent (or vice versa), provided the divisional is consonant with the restriction requirement. See MPEP §804.01.',
  },
  {
    id: 'pb_t2_025',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 3,
    question: 'An applicant files a U.S. nonprovisional application claiming benefit to a foreign application filed 13 months earlier. The applicant files a petition to restore the right of priority under 37 CFR 1.55(c). For the petition to be granted:',
    options: [
      'The delay must have been intentional',
      'The U.S. application must have been filed within 14 months of the foreign filing date and the delay must have been unintentional',
      'The applicant must file a new foreign application',
      'The petition must be filed within 6 months of the U.S. filing date',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.55(c), the right of foreign priority may be restored by petition if: (1) the U.S. application was filed within 2 months after the 12-month priority period (i.e., within 14 months of the foreign filing), (2) the delay was unintentional, and (3) the petition fee is paid. See MPEP §213.03.',
  },
  {
    id: 'pb_t2_026',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'A continuation application under §120:',
    options: [
      'Must add new matter beyond what was disclosed in the parent',
      'Contains the same disclosure as the parent and does not add new matter',
      'Must be filed within 12 months of the parent filing date',
      'Must be filed after the parent has been abandoned',
    ],
    correct: 1,
    explanation:
      'A continuation application repeats the disclosure of the parent application without adding new matter. It allows the applicant to pursue different claims based on the same disclosure. It must be copending with the parent (filed while the parent is still pending). See MPEP §201.07.',
  },
  {
    id: 'pb_t2_027',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'Under 35 U.S.C. §119(e), the benefit of a provisional filing date is available to:',
    options: [
      'Only the first nonprovisional filed within 12 months',
      'Any nonprovisional or international application designating the U.S. that claims benefit within 12 months and has at least one common inventor',
      'Any application filed by the same assignee regardless of timing',
      'Only continuation applications',
    ],
    correct: 1,
    explanation:
      'Under §119(e), the benefit of a provisional filing date can be claimed by any nonprovisional application (or PCT international application designating the U.S.) filed within 12 months by at least one inventor in common. Multiple nonprovisionals can claim benefit to the same provisional. See MPEP §211.01(a).',
  },
  {
    id: 'pb_t2_028',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 1,
    question: 'The patent term for a utility patent under 35 U.S.C. §154 is:',
    options: [
      '17 years from the issue date',
      '20 years from the earliest U.S. nonprovisional filing date to which benefit is claimed',
      '20 years from the issue date',
      '14 years from the issue date',
    ],
    correct: 1,
    explanation:
      'Under §154(a)(2), the term of a utility patent is 20 years from the earliest U.S. nonprovisional filing date (or PCT international filing date) to which the patent claims benefit under §§120, 121, or 365(c). Foreign priority dates and provisional filing dates do NOT affect the term calculation. See MPEP §2701.',
  },
  {
    id: 'pb_t2_029',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 3,
    question: 'A benefit chain exists: Provisional P (filed Jan 1, 2023) -> Nonprovisional A (filed Dec 1, 2023) -> Continuation B (filed June 1, 2025). What is the patent term expiration date for a patent issuing on Continuation B (ignoring PTA/PTE)?',
    options: [
      '20 years from Jan 1, 2023 (provisional filing date)',
      '20 years from Dec 1, 2023 (earliest nonprovisional filing date)',
      '20 years from June 1, 2025 (continuation filing date)',
      '17 years from the issue date of the patent on B',
    ],
    correct: 1,
    explanation:
      'The patent term is 20 years from the earliest U.S. nonprovisional filing date to which benefit is claimed. Provisional filing dates (P) do not affect term. App A\'s filing date (Dec 1, 2023) is the earliest nonprovisional, so the term expires Dec 1, 2043 (ignoring PTA/PTE). See MPEP §2701.',
  },
  {
    id: 'pb_t2_030',
    topicId: 2,
    subtopic: 'priority_benefit',
    difficulty: 2,
    question: 'Under the Priority Document Exchange (PDX) program, an applicant claiming foreign priority:',
    options: [
      'Must still file a paper certified copy of the foreign application',
      'May rely on electronic retrieval of the priority document from a participating foreign office, without filing a paper certified copy',
      'Does not need to identify the foreign application in the ADS',
      'Automatically receives a priority date without any formal action',
    ],
    correct: 1,
    explanation:
      'Under the PDX program, if the foreign office participates, the applicant can authorize the USPTO to electronically retrieve the priority document, eliminating the need to file a paper certified copy. The applicant must still identify the foreign application in the ADS. See 37 CFR 1.55(i); MPEP §213.07.',
  },

  // --- Continuations & Restriction (15 questions) ---
  {
    id: 'pb_t2_031',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 1,
    question: 'A restriction requirement under 35 U.S.C. §121 requires the applicant to:',
    options: [
      'Elect one invention for prosecution when the application claims two or more independent and distinct inventions',
      'Reduce the number of claims to 20 or fewer',
      'File a continuation application for each independent claim',
      'Pay an additional fee for each group of inventions',
    ],
    correct: 0,
    explanation:
      'Under §121 and 37 CFR 1.142, when an application contains claims to two or more independent and distinct inventions, the examiner may issue a restriction requirement, and the applicant must elect one invention for examination. Non-elected inventions may be pursued in divisional applications. See MPEP §803.',
  },
  {
    id: 'pb_t2_032',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'When responding to a restriction requirement, the applicant may:',
    options: [
      'Only comply without any objection',
      'Elect an invention with or without traverse (objection) -- traverse preserves the right to petition the restriction later',
      'Ignore the restriction and prosecute all inventions together',
      'File an appeal directly to the PTAB',
    ],
    correct: 1,
    explanation:
      'The applicant must elect an invention but may traverse (object to) the restriction requirement. Traversal must include reasons why the restriction is improper. If the applicant does not traverse, the restriction becomes final. Restriction requirements are petitionable (not appealable). See 37 CFR 1.143; MPEP §818.01.',
  },
  {
    id: 'pb_t2_033',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'A species election requirement is issued when:',
    options: [
      'The application claims more than 20 claims',
      'The application claims a genus with multiple species, and examination of all species would impose a serious search burden',
      'The application has multiple independent claims in the same statutory class',
      'The inventor is not a U.S. citizen',
    ],
    correct: 1,
    explanation:
      'An examiner may require election of a species when the claims encompass a genus with patentably distinct species. The applicant elects one species, and the examiner searches/examines it first. If the elected species is allowable, the search may be expanded to other species (rejoinder). See MPEP §803.02 and §809.02(a).',
  },
  {
    id: 'pb_t2_034',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 1,
    question: 'How many continuation applications can an applicant file based on a single parent application?',
    options: [
      'Only one',
      'Up to three',
      'There is no statutory limit on the number of continuations',
      'Up to five, with a petition required for each beyond the first',
    ],
    correct: 2,
    explanation:
      'There is no statutory limit on the number of continuation applications that may be filed. An applicant may file as many continuations as desired, provided copendency with the prior application is maintained and the disclosure supports the claims. See MPEP §201.07.',
  },
  {
    id: 'pb_t2_035',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'A Request for Continued Examination (RCE) under 35 U.S.C. §132(b):',
    options: [
      'Creates a new application with a new filing date',
      'Continues examination of the current application by reopening prosecution after a final rejection or other closing of prosecution, upon submission of a new amendment or IDS and payment of the RCE fee',
      'Is the same as filing a continuation application',
      'Can only be filed once per application',
    ],
    correct: 1,
    explanation:
      'An RCE under §132(b) is a request to reopen prosecution in the current application after final rejection or closure. It requires a submission (amendment, argument, evidence, or IDS) and the RCE fee. It does not create a new application or change the filing date. Multiple RCEs may be filed. See MPEP §706.07(h).',
  },
  {
    id: 'pb_t2_036',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 3,
    question: 'Under 35 U.S.C. §121, the safe harbor from double patenting for divisional applications does NOT apply when:',
    options: [
      'The divisional was filed in response to a restriction requirement',
      'The divisional adds claims that are not consonant with the restriction requirement',
      'The parent and divisional are commonly owned',
      'The restriction requirement was issued by the examiner',
    ],
    correct: 1,
    explanation:
      'The §121 safe harbor protects against ODP only if the divisional is consonant with the restriction requirement -- i.e., the claims in the divisional application relate only to the non-elected invention as divided. If the divisional includes claims that overlap with the elected invention, the safe harbor may not apply. See MPEP §804.01.',
  },
  {
    id: 'pb_t2_037',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'Inventions are "independent" for restriction purposes when:',
    options: [
      'They are claimed by different inventors',
      'They have no disclosed relationship -- they are unrelated in design, operation, and effect',
      'They are in different statutory classes (e.g., process vs. apparatus)',
      'They require examination by different examiners',
    ],
    correct: 1,
    explanation:
      'Inventions are "independent" if they are unrelated in their design, operation, and effect. "Distinct" inventions are related but patentably distinguishable. A restriction may be required for either independent or distinct inventions. See MPEP §802.01 and §806.05.',
  },
  {
    id: 'pb_t2_038',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'An election of species is made without traverse. After examination, the elected species is found allowable. What happens to the non-elected species?',
    options: [
      'They are permanently withdrawn and can never be examined',
      'The examiner extends the search to the non-elected species and may rejoin allowable claims directed to additional species',
      'The applicant must file divisional applications for each non-elected species',
      'The non-elected species are automatically allowed',
    ],
    correct: 1,
    explanation:
      'If the elected species is allowable, the examiner will extend the search to the non-elected species (rejoinder). Claims directed to allowable non-elected species may be rejoined. This is consistent with the policy of allowing genus claims when the species are allowable. See MPEP §821.04.',
  },
  {
    id: 'pb_t2_039',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 1,
    question: 'Which of the following is a key advantage of filing a continuation application rather than an RCE?',
    options: [
      'A continuation creates a separate application that can issue independently, potentially avoiding estoppel issues',
      'A continuation is always less expensive than an RCE',
      'A continuation does not require copendency with the parent',
      'A continuation automatically receives an earlier filing date than the parent',
    ],
    correct: 0,
    explanation:
      'A continuation creates a separate application with its own prosecution history, which may avoid prosecution history estoppel issues. It also allows pursuing different claim strategies independently. The continuation does require copendency and receives the parent\'s filing date (not an earlier one). See MPEP §201.07.',
  },
  {
    id: 'pb_t2_040',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 3,
    question: 'An applicant receives a restriction requirement between Group I (a process) and Group II (an apparatus). The applicant elects Group I. After the patent issues on Group I, the applicant files a divisional for Group II. The divisional patent claims include a claim that is obvious over a claim in the Group I patent. Under §121:',
    options: [
      'The divisional claim is subject to ODP because it is obvious over the parent claim',
      'The §121 safe harbor applies, and the obvious-type double patenting rejection is improper, because the claims are consonant with the restriction requirement',
      'The applicant must file a terminal disclaimer regardless',
      'The divisional patent is automatically invalidated',
    ],
    correct: 1,
    explanation:
      'The §121 safe harbor protects against ODP between a parent and a consonant divisional. If the divisional claims are directed only to the non-elected Group II invention and are consonant with the restriction requirement, the safe harbor prevents an ODP rejection even if the claims are obvious variants. See MPEP §804.01.',
  },
  {
    id: 'pb_t2_041',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'A unity of invention analysis under PCT Rule 13 is used to determine restriction in:',
    options: [
      'U.S. nonprovisional applications',
      'International (PCT) applications entering the U.S. national stage under §371',
      'Provisional applications',
      'Reissue applications',
    ],
    correct: 1,
    explanation:
      'For international applications entering the U.S. national stage under §371, the examiner applies the unity of invention standard (PCT Rule 13) rather than the U.S. restriction practice under §121. This is a different analysis focused on whether the inventions share a "special technical feature." See MPEP §1893.03(d).',
  },
  {
    id: 'pb_t2_042',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'When a continuation-in-part (CIP) adds new matter, the §121 safe harbor from double patenting:',
    options: [
      'Applies to the CIP just as it would for a continuation or divisional',
      'Does NOT apply to a CIP -- the safe harbor is limited to divisional applications filed as a result of restriction requirements',
      'Applies only if the CIP is filed within 12 months of the parent',
      'Applies only to the claims supported by the parent disclosure',
    ],
    correct: 1,
    explanation:
      'The §121 safe harbor is generally limited to divisional applications resulting from a restriction requirement and their parent. CIPs are not treated as divisionals for §121 purposes because they contain new matter. ODP may apply to CIPs, requiring a terminal disclaimer if claims are patentably indistinct. See MPEP §804.01.',
  },
  {
    id: 'pb_t2_043',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 1,
    question: 'For a continuation to maintain copendency under §120, it must be filed:',
    options: [
      'After the parent application has been abandoned',
      'Before the parent application issues as a patent or is abandoned',
      'Within 12 months of the parent filing date',
      'Within 6 months of a final office action in the parent',
    ],
    correct: 1,
    explanation:
      'Copendency requires that the continuation be filed while the parent application is still pending -- i.e., before the parent issues as a patent or is abandoned. If the parent has already been abandoned or issued, copendency is broken and §120 benefit is unavailable. See MPEP §211.01(b).',
  },
  {
    id: 'pb_t2_044',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 3,
    question: 'An examiner issues a restriction requirement between a composition claim and a method-of-use claim. The applicant believes the restriction is improper because the composition is novel. Under MPEP §806.05(d), when a product and its method of use are claimed, restriction is proper only if:',
    options: [
      'The product and method are in different statutory classes',
      'The product can be used in a materially different way and is not novel or nonobvious, OR the method can be practiced with a materially different product',
      'The examiner documents search burden',
      'There are more than 10 claims total',
    ],
    correct: 1,
    explanation:
      'Under MPEP §806.05(d), restriction between a product and its method of use requires showing either: (1) the product as claimed can be used in a materially different way, or (2) the method can be practiced with a materially different product. If the product is novel and non-obvious, restriction may be improper because the method depends on the product. See MPEP §806.05(d).',
  },
  {
    id: 'pb_t2_045',
    topicId: 2,
    subtopic: 'continuations_restriction',
    difficulty: 2,
    question: 'An applicant can petition a restriction requirement under 37 CFR 1.144. The petition must be filed:',
    options: [
      'Within 30 days of the restriction requirement',
      'Before the filing of an appeal',
      'After all claims in the application are finally disposed of (i.e., after final rejection or allowance), by petition to the Director',
      'Within 6 months of the restriction requirement',
    ],
    correct: 2,
    explanation:
      'Under 37 CFR 1.144, a petition challenging a restriction requirement is reviewed by the Director after all claims are finally disposed of. The applicant preserves the right to petition by traversing the restriction when it is made. Restriction requirements are not appealable to the PTAB. See MPEP §818.03(a).',
  },

  // --- Timeline & Extensions (15 questions) ---
  {
    id: 'pb_t2_046',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 1,
    question: 'The statutory period for responding to a non-final office action is generally:',
    options: [
      '1 month, extendable to 6 months',
      '3 months from the mailing date, extendable up to 6 months total',
      '6 months, non-extendable',
      '30 days from receipt',
    ],
    correct: 1,
    explanation:
      'The typical shortened statutory period for responding to an office action is 3 months from the mailing date. This can be extended in one-month increments up to a maximum of 6 months from the mailing date by paying extension of time fees under 37 CFR 1.136(a). See MPEP §710.02(e).',
  },
  {
    id: 'pb_t2_047',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'Under 37 CFR 1.136(a), an extension of time to respond to an office action:',
    options: [
      'Is automatic upon payment of the required fee and does not require a petition',
      'Requires a petition with an explanation of good cause',
      'Is limited to one month maximum',
      'Can extend the deadline beyond 6 months from the mailing date',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.136(a), extensions of time are available as a matter of right (automatic) upon payment of the required fee. No petition or showing of cause is required. Extensions are available in one-month increments, up to the 6-month statutory maximum. See MPEP §710.02(e).',
  },
  {
    id: 'pb_t2_048',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'After receiving a notice of allowance, the applicant must pay the issue fee within:',
    options: [
      '1 month',
      '3 months from the date of the notice',
      '6 months',
      '12 months',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.311, the applicant must pay the issue fee within 3 months of the notice of allowance. This period is NOT extendable. Failure to pay the issue fee within 3 months results in abandonment of the application. See MPEP §1306.',
  },
  {
    id: 'pb_t2_049',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 1,
    question: 'Patent applications filed under §111(a) are generally published:',
    options: [
      'Immediately upon filing',
      'Promptly after 18 months from the earliest filing date (domestic or foreign) to which benefit is claimed',
      'Only after the patent issues',
      'At 12 months from the filing date',
    ],
    correct: 1,
    explanation:
      'Under 35 U.S.C. §122(b), patent applications are published promptly after 18 months from the earliest filing date (including any foreign or domestic priority/benefit date). An applicant may request non-publication if the application will not be filed abroad. See MPEP §1120.',
  },
  {
    id: 'pb_t2_050',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'An applicant may request non-publication of a patent application under 35 U.S.C. §122(b)(2)(B)(i) if:',
    options: [
      'The applicant pays an additional fee',
      'The applicant certifies that the invention has not been and will not be the subject of an application filed in a foreign country that requires publication at 18 months',
      'The application is a provisional',
      'The examiner agrees to non-publication',
    ],
    correct: 1,
    explanation:
      'Under §122(b)(2)(B)(i), the applicant may request non-publication at the time of filing by certifying that the invention has not been and will not be the subject of an application filed in another country (or under a multilateral treaty) that requires 18-month publication. If the applicant later files abroad, the request must be rescinded. See MPEP §1122.',
  },
  {
    id: 'pb_t2_051',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'Patent term adjustment (PTA) under 35 U.S.C. §154(b) compensates patent holders for USPTO delays. Which of the following is a basis for PTA?',
    options: [
      'Delays caused by the applicant\'s extensions of time',
      'Failure of the USPTO to act within 14 months of filing (type A delay), failure to act within 4 months on applicant\'s replies (type B delay), or delays due to interference/appeal (type C delay)',
      'Delays in manufacturing the patented invention',
      'Delays in filing the application after conception',
    ],
    correct: 1,
    explanation:
      'PTA under §154(b) includes: (A) failure of the USPTO to mail an office action within 14 months of filing, issue a patent within 4 months of fee payment, etc.; (B) failure of the USPTO to issue a patent within 3 years of filing (subject to certain exceptions); and (C) delays due to interferences, secrecy orders, or appeals. Applicant delays are subtracted. See MPEP §2730.',
  },
  {
    id: 'pb_t2_052',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 3,
    question: 'Patent term extension (PTE) under 35 U.S.C. §156 is available for patents claiming products subject to:',
    options: [
      'Any government approval process',
      'Pre-market regulatory review by the FDA or other specified agencies (e.g., drugs, medical devices, food additives, veterinary biologics)',
      'International Trade Commission review',
      'Environmental impact assessments',
    ],
    correct: 1,
    explanation:
      'PTE under §156 compensates for time lost during mandatory regulatory review by the FDA (or equivalent) before the product can be marketed. It applies to human drugs, medical devices, food/color additives, and certain animal drugs/veterinary biologics. The extension cannot exceed 5 years, and the total patent term post-approval cannot exceed 14 years. See MPEP §2750.',
  },
  {
    id: 'pb_t2_053',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 1,
    question: 'After a patent issues, maintenance fees must be paid at:',
    options: [
      '4, 8, and 12 years after the grant date',
      '3.5, 7.5, and 11.5 years after the grant date',
      '1, 5, and 10 years after the grant date',
      '2, 6, and 10 years after the grant date',
    ],
    correct: 1,
    explanation:
      'Under 35 U.S.C. §41(b), maintenance fees are due at 3.5, 7.5, and 11.5 years after the grant date. They may be paid during a 6-month window prior to each due date. A 6-month grace period after each due date is also available with a surcharge. Failure to pay results in patent expiration. See MPEP §2504.',
  },
  {
    id: 'pb_t2_054',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'An applicant fails to respond to a non-final office action within the 6-month statutory maximum period. The application:',
    options: [
      'Receives an automatic 3-month extension',
      'Becomes abandoned; however, it may be revived by petition under 37 CFR 1.137 if the delay was unintentional',
      'Is automatically forwarded to appeal',
      'Is held in abeyance until the applicant responds',
    ],
    correct: 1,
    explanation:
      'Failure to timely respond to an office action results in abandonment. Under 37 CFR 1.137, the application may be revived by petition if the entire delay was unintentional, accompanied by the required response, petition fee, and a statement that the delay was unintentional. See MPEP §711.03(c).',
  },
  {
    id: 'pb_t2_055',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'The period for paying the issue fee after a notice of allowance:',
    options: [
      'Can be extended under 37 CFR 1.136(a)',
      'Cannot be extended -- the 3-month period is a statutory deadline',
      'Can be extended by filing an RCE',
      'Is automatically extended if the applicant is a small entity',
    ],
    correct: 1,
    explanation:
      'The 3-month period for paying the issue fee under 37 CFR 1.311 cannot be extended under §1.136(a). It is treated as a non-extendable statutory period. However, an applicant may file an RCE (which withdraws the application from issue) if prosecution needs to continue. See MPEP §1306.',
  },
  {
    id: 'pb_t2_056',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 1,
    question: 'The Track One prioritized examination program allows:',
    options: [
      'Examination by a senior examiner at no additional cost',
      'Prioritized examination with a goal of providing a final disposition within 12 months of filing, upon payment of the prioritized examination fee',
      'Automatic allowance of all claims',
      'Examination within 1 month of filing',
    ],
    correct: 1,
    explanation:
      'Track One prioritized examination under 37 CFR 1.102(e) provides accelerated examination with a goal of reaching final disposition within 12 months. It requires payment of the prioritized examination fee and compliance with certain requirements (e.g., claim limits). See MPEP §708.02(b).',
  },
  {
    id: 'pb_t2_057',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 3,
    question: 'An applicant receives a final office action on March 1. The shortened statutory period is 3 months (June 1). The applicant files an after-final response on May 15. The examiner determines the response does not place the application in condition for allowance and is not entered. The applicant then has until when to file a timely notice of appeal or other response (with extensions)?',
    options: [
      'May 15 (date of the after-final response)',
      'The original 6-month statutory maximum: September 1 (with payment of extension fees)',
      'Within 30 days of the advisory action',
      'Within 2 months of the advisory action',
    ],
    correct: 1,
    explanation:
      'The after-final response does not reset or extend the period for response. The original statutory period continues to run from the mailing date of the final office action. The applicant must act within the 6-month maximum (September 1, with extensions of time under §1.136(a)). An advisory action informing the applicant that the after-final was not entered does not set a new period. See MPEP §706.07(a).',
  },
  {
    id: 'pb_t2_058',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'Under the After Final Consideration Pilot 2.0 (AFCP 2.0), an applicant may request:',
    options: [
      'That the examiner conduct additional search and consideration of an after-final amendment, with no additional fee required',
      'Automatic entry of any after-final amendment',
      'A guaranteed interview with the examiner before the final office action',
      'Re-examination by a different examiner',
    ],
    correct: 0,
    explanation:
      'AFCP 2.0 provides additional time for the examiner to search and consider an after-final amendment without additional fees from the applicant. The examiner has additional time to conduct a search, and if the amendment cannot be entered, the examiner will offer an interview. AFCP 2.0 is voluntary for both applicant and examiner. See MPEP §706.07(a)(II).',
  },
  {
    id: 'pb_t2_059',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 2,
    question: 'A petition to revive an unintentionally abandoned application under 37 CFR 1.137 requires:',
    options: [
      'A showing that the delay was unavoidable',
      'The required reply (or other outstanding item), the petition fee, and a statement that the entire delay in filing the reply was unintentional',
      'A detailed explanation of the reasons for abandonment',
      'That the application was abandoned for less than 6 months',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.137(a), revival of an unintentionally abandoned application requires: (1) the outstanding reply or other required paper, (2) the petition fee, and (3) a statement that the entire delay was unintentional. There is no time limit on when the petition can be filed. See MPEP §711.03(c).',
  },
  {
    id: 'pb_t2_060',
    topicId: 2,
    subtopic: 'timeline_extensions',
    difficulty: 1,
    question: 'Which of the following is NOT a way to respond to a final office action?',
    options: [
      'File a notice of appeal',
      'File an RCE with a submission',
      'File an after-final amendment under 37 CFR 1.116',
      'File a new provisional application',
    ],
    correct: 3,
    explanation:
      'Appropriate responses to a final office action include: (1) filing a notice of appeal to the PTAB, (2) filing an RCE under §132(b) with a submission, (3) filing an after-final amendment under §1.116, or (4) complying with the rejection. Filing a new provisional has no effect on the pending final rejection. See MPEP §706.07.',
  },

  // =============================================
  // TOPIC 3 -- OFFICE ACTIONS & RESPONSES (50 Qs)
  // =============================================

  // --- Non-final / Final OAs (15 questions) ---
  {
    id: 'pb_t3_001',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 1,
    question: 'A non-final office action:',
    options: [
      'Is the last communication from the examiner before the patent issues',
      'Is typically the first substantive office action where the examiner presents rejections and/or objections, and the applicant has a right to respond',
      'Cannot include any rejections under §102 or §103',
      'Requires the applicant to pay a fee to respond',
    ],
    correct: 1,
    explanation:
      'A non-final office action is typically the first office action on the merits, where the examiner identifies rejections (e.g., §101, §102, §103, §112) and objections (e.g., to the specification or drawings). The applicant has the right to respond by amending claims and/or presenting arguments. See MPEP §706.',
  },
  {
    id: 'pb_t3_002',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'An examiner may make an office action final:',
    options: [
      'At any time, including in the first office action',
      'Only after the first non-final office action, when all rejections rely on prior art or grounds previously applied (or necessitated by amendment)',
      'Only after three non-final office actions',
      'Only with the approval of the Technology Center Director',
    ],
    correct: 1,
    explanation:
      'Under MPEP §706.07(a), an office action may be made final when (1) it is the second or subsequent action, and (2) all rejections are based on prior art or grounds previously applied or necessitated by the applicant\'s amendment. A first office action on the merits generally cannot be made final (with limited exceptions). See MPEP §706.07(a).',
  },
  {
    id: 'pb_t3_003',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'After a final office action, an applicant\'s amendment will be entered only if:',
    options: [
      'All amendments after final rejection are always entered as a matter of right',
      'The amendment places the application in condition for allowance, or it merely cancels claims or adopts examiner suggestions, or complies with specific requirements under 37 CFR 1.116',
      'The applicant pays a special after-final fee',
      'The amendment was filed within 1 month of the final OA',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.116, after-final amendments are not entered as a matter of right. An amendment is typically entered if it (1) places the application in condition for allowance, (2) cancels claims or adopts examiner suggestions, (3) does not raise new issues requiring further search, or (4) is otherwise proper under AFCP 2.0. See MPEP §714.13.',
  },
  {
    id: 'pb_t3_004',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 1,
    question: 'The difference between a "rejection" and an "objection" in patent prosecution is:',
    options: [
      'They are the same thing',
      'A rejection involves a substantive patentability issue (§§101, 102, 103, 112) and is appealable; an objection involves form or informality and is petitionable',
      'An objection is more serious than a rejection',
      'Rejections apply only to claims; objections apply only to the specification',
    ],
    correct: 1,
    explanation:
      'A rejection relates to the merits (patentability) of the claims and can be appealed to the PTAB. An objection relates to form, informality, or other procedural matters and is addressed by petition to the Director. While rejections typically apply to claims and objections to the specification/drawings, the distinction is substantive vs. procedural. See MPEP §706.',
  },
  {
    id: 'pb_t3_005',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'A first action final rejection is permissible when:',
    options: [
      'The examiner decides the invention is clearly unpatentable',
      'The application is a continuation or continuation-in-part that contains claims that are patentably indistinct from claims previously examined in the parent application',
      'The applicant has failed to respond to a restriction requirement',
      'The application has more than 30 claims',
    ],
    correct: 1,
    explanation:
      'A first action final rejection is proper in limited situations, such as when a continuation or CIP presents claims that are (1) not patentably distinct from claims previously examined and rejected in the parent, and (2) the prior art and rejection grounds are the same. This avoids re-litigating the same issues. See MPEP §706.07(b).',
  },
  {
    id: 'pb_t3_006',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'An advisory action (PTOL-303) is issued when:',
    options: [
      'The examiner decides to allow all claims',
      'The examiner informs the applicant whether an after-final amendment or response will or will not be entered',
      'The application is abandoned',
      'The applicant files a notice of appeal',
    ],
    correct: 1,
    explanation:
      'An advisory action is issued after a final rejection when the applicant files an after-final response. It informs the applicant whether the after-final amendment is entered, whether it overcomes the rejections, and may set forth the examiner\'s position. It does not set a new response period. See MPEP §706.07(a).',
  },
  {
    id: 'pb_t3_007',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 1,
    question: 'Which of the following types of rejections can be raised in an office action?',
    options: [
      'Only §102 and §103 rejections',
      'Rejections under §§101, 102, 103, 112, and nonstatutory double patenting',
      'Only §112 rejections in a first office action',
      'Only §103 rejections in a final office action',
    ],
    correct: 1,
    explanation:
      'An office action can raise rejections under any applicable ground, including §101 (eligibility/utility), §102 (anticipation), §103 (obviousness), §112 (specification requirements), and nonstatutory double patenting. Multiple grounds may be applied to the same claims. See MPEP §706.02.',
  },
  {
    id: 'pb_t3_008',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 3,
    question: 'An examiner introduces a new ground of rejection in a final office action that was not necessitated by the applicant\'s amendment. The applicant should:',
    options: [
      'Accept the rejection because all final office actions are proper',
      'Request that the finality be withdrawn because the new ground of rejection was not previously applied and was not necessitated by amendment',
      'File an RCE immediately',
      'File a continuation application',
    ],
    correct: 1,
    explanation:
      'If a final office action introduces a new ground of rejection not necessitated by amendment, the finality is improper. The applicant may request withdrawal of the finality so that the action is treated as non-final, giving the applicant a full right to respond. See MPEP §706.07(a).',
  },
  {
    id: 'pb_t3_009',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'Under AFCP 2.0, if the examiner determines that the after-final amendment does not place the application in condition for allowance after additional search, the examiner will:',
    options: [
      'Enter the amendment and issue a new non-final rejection',
      'Offer to conduct an interview with the applicant to discuss the remaining issues',
      'Abandon the application',
      'Issue a final rejection on the amended claims',
    ],
    correct: 1,
    explanation:
      'Under AFCP 2.0, if the examiner\'s additional search and consideration show that the amendment does not resolve all issues, the examiner will contact the applicant to conduct an interview to discuss the outstanding issues and possible paths forward. The original final rejection remains in effect. See MPEP §706.07(a)(II).',
  },
  {
    id: 'pb_t3_010',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 1,
    question: 'An examiner\'s office action must include:',
    options: [
      'Only a list of rejected claims',
      'A statement of reasons for each rejection and/or objection, with references to the relevant prior art and statutory basis',
      'A recommendation on whether the applicant should appeal',
      'A list of all patents in the same art unit',
    ],
    correct: 1,
    explanation:
      'Under 35 U.S.C. §132, the examiner must notify the applicant of the reasons for any rejection or objection, together with information and references useful in judging the propriety of continuing prosecution. This includes statutory bases and specific prior art citations. See MPEP §706.02.',
  },
  {
    id: 'pb_t3_011',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'A restriction requirement is mailed along with a first office action on the merits. The applicant believes this is procedurally improper. Is the applicant correct?',
    options: [
      'Yes, restriction must always be required before examination on the merits begins',
      'No, the examiner may combine a restriction requirement with the first office action on the merits for efficiency',
      'Yes, because restriction requirements must be in a separate communication',
      'No, but only if the examiner has searched all claimed inventions',
    ],
    correct: 1,
    explanation:
      'The examiner may combine a restriction requirement with the first office action on the merits, examining the claims to one invention while requiring restriction of others. This is procedurally proper and promotes efficiency. See MPEP §803.',
  },
  {
    id: 'pb_t3_012',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 3,
    question: 'An examiner issues a second non-final office action applying a new §102(a)(1) reference not previously cited. The applicant responds with an amendment. The examiner then issues a final office action maintaining the rejection with the same reference. This final rejection is:',
    options: [
      'Improper because the applicant only had one opportunity to address this reference',
      'Proper because the applicant had a fair opportunity to address the reference in the second non-final and the final rejection is based on the same prior art',
      'Improper because §102 rejections cannot be made final',
      'Proper only if the examiner obtains supervisory approval',
    ],
    correct: 1,
    explanation:
      'A final rejection is proper after the applicant has had at least one opportunity to respond to the grounds of rejection. Since the reference was applied in the second non-final and the applicant responded, making the next action final is proper because the rejection is based on previously applied art. See MPEP §706.07(a).',
  },
  {
    id: 'pb_t3_013',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'An examiner issues a "Quayle" action (Ex parte Quayle). This means:',
    options: [
      'The application is rejected on all claims',
      'The application is in condition for allowance except for formal matters; prosecution on the merits is closed',
      'The applicant must file an RCE',
      'The examiner is requesting an interview',
    ],
    correct: 1,
    explanation:
      'An Ex parte Quayle action indicates that the application is in condition for allowance on the merits but has outstanding formal issues (e.g., drawing corrections, minor specification errors). The applicant must correct the formal matters within a shortened statutory period. No further examination on the merits occurs. See MPEP §714.14.',
  },
  {
    id: 'pb_t3_014',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 1,
    question: 'The applicant may request an interview with the examiner:',
    options: [
      'Only after a final office action',
      'At any time during prosecution, though it is most productive after the examiner has conducted a prior art search',
      'Only during the appeal process',
      'Only in person at the USPTO office',
    ],
    correct: 1,
    explanation:
      'Interviews may be requested at any point during prosecution. They are most productive after the first office action when the examiner has identified the relevant art. Interviews may be conducted in person, by telephone, or by video conference. See MPEP §713.',
  },
  {
    id: 'pb_t3_015',
    topicId: 3,
    subtopic: 'nonfinal_final_oa',
    difficulty: 2,
    question: 'An examiner sends a "notice of allowability" (PTOL-37). This notice:',
    options: [
      'Is the same as a notice of allowance',
      'Indicates that specific claims are allowable, and is often accompanied by or followed by the formal notice of allowance with issue fee information',
      'Means the application has been abandoned',
      'Requires the applicant to cancel all rejected claims',
    ],
    correct: 1,
    explanation:
      'A notice of allowability indicates that the examiner has determined the claims are allowable. It is often accompanied by the notice of allowance (which includes the issue fee due date). The applicant then has 3 months to pay the issue fee. See MPEP §1303.',
  },

  // --- Amendments & Arguments (15 questions) ---
  {
    id: 'pb_t3_016',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 1,
    question: 'Under 37 CFR 1.111, a reply to a non-final office action must:',
    options: [
      'Address only the most important rejection',
      'Be a bona fide attempt to advance the application to final action on all the merits, addressing every ground of rejection',
      'Include only claim amendments without any arguments',
      'Be filed within 1 month of the office action',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.111(b), a reply to a non-final office action must be a bona fide attempt to advance the application to final action on all the merits. The applicant must address every rejection and objection. Failure to reply to all grounds may result in the response being treated as non-responsive. See MPEP §714.02.',
  },
  {
    id: 'pb_t3_017',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An applicant amends a claim during prosecution to add a limitation. The amendment must:',
    options: [
      'Be supported by the original specification -- no new matter may be added to the claims',
      'Include a new oath or declaration',
      'Be accompanied by a supplemental IDS',
      'Be approved by the examiner before filing',
    ],
    correct: 0,
    explanation:
      'Any claim amendment must be supported by the original disclosure (specification, claims, and drawings as filed). Adding a limitation not supported by the original specification constitutes new matter and will be rejected under §112(a) (written description) and objected to under §132. See MPEP §2163.06.',
  },
  {
    id: 'pb_t3_018',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An examiner objects to a claim as being unclear but does not reject it. The applicant disagrees with the objection. The applicant should:',
    options: [
      'File an appeal to the PTAB',
      'Traverse the objection by explaining why the claim is clear, and/or petition the objection since objections are petitionable, not appealable',
      'Ignore the objection because it is not a rejection',
      'File a continuation application',
    ],
    correct: 1,
    explanation:
      'Objections (as opposed to rejections) are addressed by argument/traverse and, if not resolved, by petition to the Director under 37 CFR 1.181. Objections are not appealable to the PTAB; only rejections are appealable. See MPEP §706 and §1002.02(c).',
  },
  {
    id: 'pb_t3_019',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 1,
    question: 'When traversing an examiner\'s §103 rejection, an applicant may argue:',
    options: [
      'That the references are not analogous art, that there is no motivation to combine, that a key element is missing, or that the applicant has evidence of secondary considerations',
      'Only that the claims are novel over each individual reference',
      'That the examiner did not conduct a thorough search',
      'That the invention is commercially successful (without any supporting evidence)',
    ],
    correct: 0,
    explanation:
      'Arguments against §103 may include: the references are non-analogous art, there is no reason to combine, the combination would not yield the claimed invention, teaching away, and secondary considerations (with supporting evidence). Arguments must be substantive and address the specific rejection. See MPEP §2145.',
  },
  {
    id: 'pb_t3_020',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An applicant argues that the examiner\'s claim construction is incorrect. Under the BRI standard, the applicant should:',
    options: [
      'File a new application with different claims',
      'Point to the specification to show that a PHOSITA would understand the claim term differently than the examiner\'s interpretation',
      'Request that the examiner apply the Phillips v. AWH claim construction standard used in litigation',
      'Add a glossary to the specification defining all terms',
    ],
    correct: 1,
    explanation:
      'During prosecution under BRI, the applicant may argue that the specification, as understood by a PHOSITA, supports a different interpretation of the claim term. The applicant should point to the specification and any special definitions therein. The Phillips litigation standard does not apply during examination. See MPEP §2111.',
  },
  {
    id: 'pb_t3_021',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 3,
    question: 'An examiner rejects claims under §103 based on references A and B. The applicant argues that the combination of A and B would render A "unsatisfactory for its intended purpose." This argument is:',
    options: [
      'Irrelevant to the obviousness analysis',
      'Relevant -- a proposed modification that would render the prior art unsatisfactory for its intended purpose is not a proper basis for an obviousness rejection',
      'Only relevant if the applicant provides a declaration',
      'Only relevant in the context of §102 anticipation',
    ],
    correct: 1,
    explanation:
      'Under MPEP §2143.01(V), if the proposed modification would render the prior art unsatisfactory for its intended purpose, the modification would not have been obvious. This is a recognized basis for rebutting an obviousness rejection. See also KSR rationale guidance.',
  },
  {
    id: 'pb_t3_022',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An applicant submits a declaration under 37 CFR 1.132 to support patentability. The declaration:',
    options: [
      'Must be from the inventor only',
      'May be from any person with personal knowledge of the facts, and is used to present evidence (e.g., unexpected results, secondary considerations) to overcome rejections',
      'Must be notarized by a public notary',
      'Is only used to correct inventorship',
    ],
    correct: 1,
    explanation:
      'A §1.132 declaration may be submitted by any person with relevant knowledge (inventor, expert, etc.) and is used to present factual evidence supporting patentability, such as unexpected results, commercial success, or other secondary considerations. It must comply with the declaration requirements of 37 CFR 1.68. See MPEP §716.',
  },
  {
    id: 'pb_t3_023',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An examiner makes a §102(a)(1) rejection based on a journal article. The applicant discovers that the article was published less than 12 months before the effective filing date and was authored by the inventor. The applicant should:',
    options: [
      'File an RCE',
      'Argue that the §102(b)(1)(A) grace period exception applies because the disclosure was by the inventor within the 12-month grace period',
      'Amend the claims to avoid the reference',
      'File a terminal disclaimer',
    ],
    correct: 1,
    explanation:
      'Under AIA §102(b)(1)(A), a disclosure by the inventor or a joint inventor made within 12 months before the effective filing date is not prior art. The applicant should present evidence (e.g., an affidavit) establishing that the inventor authored the reference and it falls within the grace period. See MPEP §2153.01(a).',
  },
  {
    id: 'pb_t3_024',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 1,
    question: 'When amending claims under 37 CFR 1.121, which of the following is required?',
    options: [
      'Filing replacement claims showing deletions with strikethrough and additions with underlining',
      'Filing a completely new specification',
      'Filing only the changed words of each claim',
      'Filing a summary of the changes without markings',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 1.121(c), claim amendments must present the entire text of each amended claim with markings: deletions in strikethrough (brackets may also be used) and additions in underlining. The status of each claim (original, currently amended, canceled, withdrawn, new, etc.) must also be indicated. See MPEP §714.02.',
  },
  {
    id: 'pb_t3_025',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 3,
    question: 'An examiner issues a rejection under §112(a) for lack of written description. The applicant argues that the specification inherently supports the claim limitation even though it is not explicitly stated. For this argument to succeed:',
    options: [
      'The applicant must show that a PHOSITA would have understood the inventor to be in possession of the claimed subject matter based on the original disclosure',
      'The applicant must add the limitation to the specification via amendment',
      'The applicant must provide a supplemental declaration from the inventor',
      'The argument cannot succeed -- all claim limitations must be explicitly stated in the specification',
    ],
    correct: 0,
    explanation:
      'Written description does not require explicit verbatim support. The applicant must demonstrate that the original disclosure, as understood by a PHOSITA, would convey that the inventor had possession of the claimed subject matter. Implicit support and inherent disclosure can satisfy the requirement. See MPEP §2163.02.',
  },
  {
    id: 'pb_t3_026',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An applicant wishes to submit evidence of commercial success to rebut an obviousness rejection. Which of the following is required?',
    options: [
      'Merely stating that the product was commercially successful',
      'Providing evidence showing a nexus between the commercial success and the novel features of the claimed invention, with supporting data',
      'Showing that the product was sold in every U.S. state',
      'Demonstrating that no competitor has a similar product',
    ],
    correct: 1,
    explanation:
      'Evidence of commercial success must be tied to the merits of the claimed invention (nexus), not to advertising, brand recognition, or unrelated features. The applicant must provide objective evidence (e.g., sales data, market share) demonstrating that the success is due to the novel claim features. See MPEP §716.03.',
  },
  {
    id: 'pb_t3_027',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'The examiner makes a new ground of rejection in the office action. The applicant believes the rejection is improper. Before filing a formal response, the applicant should consider:',
    options: [
      'Conducting an interview with the examiner to discuss the rejection and potentially narrow the issues',
      'Filing an immediate appeal without responding to the rejection',
      'Abandoning the application',
      'Filing a complaint with the Inspector General',
    ],
    correct: 0,
    explanation:
      'Examiner interviews are an effective prosecution tool. Before filing a formal written response, the applicant may request an interview to discuss the rejection, clarify the examiner\'s position, and potentially resolve issues or narrow disputes. This can save time and prosecution costs. See MPEP §713.',
  },
  {
    id: 'pb_t3_028',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 1,
    question: 'An applicant wishes to cancel a claim during prosecution. Under 37 CFR 1.121(c), the applicant:',
    options: [
      'Must file a petition to cancel the claim',
      'Indicates the claim status as "Canceled" -- the text of the canceled claim need not be presented',
      'Must file a terminal disclaimer',
      'Cannot cancel claims once prosecution begins',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 1.121(c)(4), to cancel a claim, the applicant simply indicates the claim number and the status "Canceled." The text of the claim need not be presented. Canceled claims cannot be subsequently re-entered (though new claims covering similar subject matter may be added). See MPEP §714.02.',
  },
  {
    id: 'pb_t3_029',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 3,
    question: 'An examiner rejects claims under both §102 and §103 in the same office action using the same primary reference. The applicant successfully argues that the §102 rejection is improper because the reference does not disclose element X. The §103 rejection using the same primary reference combined with a secondary reference that teaches element X:',
    options: [
      'Is automatically withdrawn because the §102 rejection was overcome',
      'Must still be addressed separately because the §103 analysis involves combining references and may still be proper',
      'Is also overcome because the primary reference was shown to be deficient',
      'Requires a new non-final office action',
    ],
    correct: 1,
    explanation:
      'Overcoming a §102 rejection does not automatically overcome a §103 rejection based on the same primary reference. The §103 rejection involves the combination of references, and the missing element may be supplied by the secondary reference. Each rejection must be addressed independently. See MPEP §2141.',
  },
  {
    id: 'pb_t3_030',
    topicId: 3,
    subtopic: 'amendments_arguments',
    difficulty: 2,
    question: 'An examiner objects to the specification for a minor informality (e.g., a typographical error). The applicant should:',
    options: [
      'Appeal the objection to the PTAB',
      'Correct the informality by filing an amendment to the specification under 37 CFR 1.121(b)',
      'Ignore the objection as immaterial',
      'File a petition to make special',
    ],
    correct: 1,
    explanation:
      'Specification objections for informalities should be corrected by filing an amendment under 37 CFR 1.121(b), which requires showing the change with markings (additions underlined, deletions in brackets). The amendment must not introduce new matter. See MPEP §608.01(q).',
  },

  // --- Appeals (20 questions) ---
  {
    id: 'pb_t3_031',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 1,
    question: 'To initiate an appeal from a final rejection to the Patent Trial and Appeal Board (PTAB), the applicant must first file:',
    options: [
      'A petition to the Director',
      'A notice of appeal under 37 CFR 41.31, along with the appeal fee',
      'An appeal brief',
      'A request for continued examination',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.31, the applicant must file a notice of appeal and pay the notice of appeal fee. This starts the appeal process. The appeal brief is filed afterward within the time set by the rules. See MPEP §1204.',
  },
  {
    id: 'pb_t3_032',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'After filing a notice of appeal, the applicant must file an appeal brief within:',
    options: [
      '1 month of the notice of appeal',
      '2 months from the date of filing the notice of appeal',
      '6 months from the date of filing the notice of appeal',
      '3 months from the date of the final rejection',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.37(a), the appeal brief must be filed within 2 months of the date of filing the notice of appeal. Extensions of time under §1.136(a) are available. See MPEP §1205.01.',
  },
  {
    id: 'pb_t3_033',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'An appeal brief under 37 CFR 41.37 must include:',
    options: [
      'A statement of the real party in interest, statement of related cases, summary of the claimed subject matter, arguments addressing each rejection, claims appendix, and evidence appendix (if applicable)',
      'Only a statement of why the examiner is wrong',
      'A new specification and claims',
      'A petition for supervisory review',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 41.37(c), the appeal brief must include: (1) real party in interest, (2) related appeals/interferences, (3) summary of claimed subject matter, (4) argument (addressing each rejection on appeal), (5) claims appendix, (6) evidence appendix, and (7) related proceedings. See MPEP §1205.02.',
  },
  {
    id: 'pb_t3_034',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'After the applicant files an appeal brief, the examiner may file:',
    options: [
      'A notice of abandonment',
      'An examiner\'s answer under 37 CFR 41.39, which may include a new ground of rejection',
      'A petition to dismiss the appeal',
      'A request for inter partes review',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.39, the examiner files an examiner\'s answer responding to the appeal brief. The answer may maintain the rejections and, in some cases, include a new ground of rejection (which the applicant may request be designated as such). See MPEP §1207.',
  },
  {
    id: 'pb_t3_035',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 3,
    question: 'If the examiner\'s answer includes a new ground of rejection, the applicant may:',
    options: [
      'Only proceed with the appeal as filed',
      'Within 2 months, either (1) reopen prosecution by filing a reply under §1.111 with or without an amendment, or (2) request that the PTAB proceed with the appeal on the new ground',
      'File an immediate petition to the Director',
      'Withdraw the appeal automatically',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.39(b), if the examiner\'s answer contains a new ground of rejection, the applicant has 2 months to either (1) reopen prosecution by filing an appropriate reply (which withdraws the appeal), or (2) maintain the appeal by requesting the PTAB to decide on the new ground. See MPEP §1207.03.',
  },
  {
    id: 'pb_t3_036',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 1,
    question: 'The applicant may file a reply brief after receiving the examiner\'s answer. The reply brief:',
    options: [
      'Must be filed within 2 months of the examiner\'s answer',
      'May not include new arguments or evidence not already in the appeal brief',
      'Both A and B are correct',
      'Neither A nor B is correct',
    ],
    correct: 2,
    explanation:
      'Under 37 CFR 41.41, the applicant may file a reply brief within 2 months of the examiner\'s answer. The reply brief may only respond to arguments raised in the examiner\'s answer and may not include new issues or arguments not previously presented. See MPEP §1208.',
  },
  {
    id: 'pb_t3_037',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'An oral hearing before the PTAB:',
    options: [
      'Is automatic in every appeal',
      'Must be requested by the applicant and is granted if requested, with a fee required',
      'Is only available in inter partes proceedings',
      'Replaces the need for an appeal brief',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.47, an oral hearing is not automatic but is available upon request. The applicant must request it and pay the required fee. Oral arguments are limited to points already made in the briefs. See MPEP §1209.',
  },
  {
    id: 'pb_t3_038',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'After a PTAB decision, if the applicant disagrees, the applicant may seek judicial review by:',
    options: [
      'Filing a petition with the USPTO Director',
      'Filing a civil action in the U.S. District Court for the Eastern District of Virginia or appealing to the U.S. Court of Appeals for the Federal Circuit under 35 U.S.C. §141',
      'Filing a new patent application',
      'Requesting reconsideration by the same PTAB panel',
    ],
    correct: 1,
    explanation:
      'Under 35 U.S.C. §141, the applicant may appeal a PTAB decision to the U.S. Court of Appeals for the Federal Circuit. Alternatively, under §145, the applicant may file a civil action in the U.S. District Court for the Eastern District of Virginia. See MPEP §1216.',
  },
  {
    id: 'pb_t3_039',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 1,
    question: 'The PTAB consists of:',
    options: [
      'Patent examiners from the examining corps',
      'Administrative patent judges (APJs) appointed by the Secretary of Commerce',
      'Federal Circuit judges sitting by designation',
      'Retired patent practitioners',
    ],
    correct: 1,
    explanation:
      'The PTAB is composed of the Director, Deputy Director, Commissioner for Patents, Commissioner for Trademarks, and administrative patent judges (APJs). APJs are appointed by the Secretary of Commerce and have technical and legal qualifications. See 35 U.S.C. §6; MPEP §1002.02(d).',
  },
  {
    id: 'pb_t3_040',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'The pre-appeal brief review (PABR) program allows:',
    options: [
      'The applicant to file a brief statement (5 pages max) with the notice of appeal requesting that a panel of examiners review the rejection before the appeal brief is due',
      'The examiner to review the appeal brief before it is officially filed',
      'The PTAB to issue an expedited decision',
      'The applicant to request a different examiner',
    ],
    correct: 0,
    explanation:
      'The pre-appeal brief review program allows the applicant to submit a concise request (5 pages or less) with the notice of appeal. A panel of examiners (typically three, including the examiner of record) reviews the rejection. If the panel agrees the rejection should be withdrawn, prosecution reopens. Otherwise, the appeal proceeds. See MPEP §1204.02.',
  },
  {
    id: 'pb_t3_041',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 3,
    question: 'During an appeal, the PTAB may designate a new ground of rejection in its decision. If the PTAB does so, the applicant has:',
    options: [
      'No further options except to appeal to the Federal Circuit',
      'Two months to either (1) reopen prosecution by filing a request under 37 CFR 41.50(b)(1), or (2) request rehearing under 37 CFR 41.52',
      'One year to file a continuation with new claims',
      'No recourse because PTAB decisions are final',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.50(b), if the PTAB designates a new ground of rejection, the applicant has 2 months to: (1) submit an amendment, new evidence, or other appropriate response to reopen prosecution, or (2) request rehearing. Failure to take action results in the decision becoming final. See MPEP §1214.01.',
  },
  {
    id: 'pb_t3_042',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'An applicant files a notice of appeal but later decides to continue prosecution instead. The applicant may:',
    options: [
      'Not withdraw the appeal under any circumstances',
      'File an RCE, which automatically withdraws the appeal and reopens prosecution',
      'File a petition to the Director to withdraw the appeal',
      'Wait for the PTAB decision and then reopen prosecution',
    ],
    correct: 1,
    explanation:
      'Filing an RCE after a notice of appeal (but before a PTAB decision) automatically withdraws the appeal and reopens prosecution. The applicant may also expressly withdraw the appeal under 37 CFR 41.31(c). See MPEP §1215.01.',
  },
  {
    id: 'pb_t3_043',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 1,
    question: 'Which of the following rejections can be appealed to the PTAB?',
    options: [
      'Restriction requirements',
      'Drawing objections',
      'Rejections under §§101, 102, 103, and 112',
      'All office actions, including objections',
    ],
    correct: 2,
    explanation:
      'Only rejections (substantive patentability determinations) are appealable to the PTAB. Restriction requirements and objections (form/informality) are addressed by petition, not appeal. Rejections under §§101, 102, 103, 112, and nonstatutory double patenting are all appealable. See MPEP §1201.',
  },
  {
    id: 'pb_t3_044',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'If the applicant fails to file an appeal brief within the required time (including extensions), the appeal is:',
    options: [
      'Decided on the record without a brief',
      'Dismissed, and prosecution is reopened',
      'Dismissed, and the application becomes abandoned if no other timely reply is filed',
      'Extended automatically for 6 months',
    ],
    correct: 2,
    explanation:
      'Under 37 CFR 41.37(a), failure to file a timely appeal brief results in dismissal of the appeal. If no other proper reply to the outstanding office action is pending, the application becomes abandoned. The applicant may seek revival under §1.137. See MPEP §1215.04.',
  },
  {
    id: 'pb_t3_045',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 3,
    question: 'The PTAB reverses the examiner\'s rejection. The examiner:',
    options: [
      'Must allow the application',
      'Must allow the application unless there are other outstanding rejections or the examiner identifies issues not yet addressed (e.g., an issue the PTAB did not reach)',
      'May ignore the PTAB decision',
      'Must request reconsideration from the PTAB',
    ],
    correct: 1,
    explanation:
      'If the PTAB reverses a rejection, the examiner must withdraw that rejection. However, if other rejections remain outstanding, or if the PTAB did not address all claims or all issues, the examiner may continue prosecution on those remaining matters. If all rejections are reversed, the claims should be allowed (absent other issues). See MPEP §1214.06.',
  },
  {
    id: 'pb_t3_046',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'A request for rehearing before the PTAB under 37 CFR 41.52 must be filed within:',
    options: [
      '1 month of the PTAB decision',
      '2 months of the PTAB decision',
      '6 months of the PTAB decision',
      '30 days of the PTAB decision',
    ],
    correct: 1,
    explanation:
      'Under 37 CFR 41.52, a request for rehearing must be filed within 2 months of the PTAB\'s decision. The request must identify specific points the applicant believes the PTAB misapprehended or overlooked. Extensions of time are available. See MPEP §1214.03.',
  },
  {
    id: 'pb_t3_047',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'In the appeal brief, arguments not made for a particular rejection are:',
    options: [
      'Assumed to be conceded by the applicant -- the PTAB may summarily sustain the rejection',
      'Addressed by the PTAB sua sponte',
      'Raised during the oral hearing',
      'Treated as preserved for appeal to the Federal Circuit',
    ],
    correct: 0,
    explanation:
      'Under 37 CFR 41.37(c)(1)(iv), the applicant must present arguments for each rejection on appeal. If the applicant does not separately argue a rejection, it is treated as waived/conceded, and the PTAB may summarily affirm. See MPEP §1205.02.',
  },
  {
    id: 'pb_t3_048',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 1,
    question: 'The notice of appeal fee and the appeal brief filing fee are:',
    options: [
      'Separate fees -- the notice of appeal fee is paid when filing the notice, and the appeal forwarding fee is paid when filing the appeal brief',
      'A single combined fee paid at the time of the notice of appeal',
      'Waived for small entities',
      'Paid only if the PTAB agrees to hear the appeal',
    ],
    correct: 0,
    explanation:
      'The appeal involves two fees: (1) the notice of appeal fee paid when filing the notice of appeal, and (2) the appeal forwarding fee paid when the appeal brief is filed. Both must be timely paid for the appeal to proceed. See 37 CFR 41.20; MPEP §1204.',
  },
  {
    id: 'pb_t3_049',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 3,
    question: 'An examiner reopens prosecution after an appeal brief is filed by issuing a new non-final office action with a new ground of rejection. Under 37 CFR 41.39(b)(1), this is:',
    options: [
      'Always improper because the appeal is pending',
      'Proper only with PTAB approval',
      'Proper if the examiner determines that new grounds not presented in the appealed rejection need to be addressed, and the appeal is effectively withdrawn',
      'Proper only if the applicant consents',
    ],
    correct: 2,
    explanation:
      'Under certain circumstances, the examiner may reopen prosecution after an appeal is filed by issuing a new office action. This typically occurs in the examiner\'s answer or when the examiner identifies a new issue. If the examiner reopens prosecution, the appeal is effectively withdrawn and the applicant responds to the new action. See MPEP §1207.04.',
  },
  {
    id: 'pb_t3_050',
    topicId: 3,
    subtopic: 'appeals',
    difficulty: 2,
    question: 'The PTAB affirms the examiner\'s rejection of all claims. The applicant does not request rehearing or appeal to the Federal Circuit. The PTAB decision becomes final and the application:',
    options: [
      'Remains pending indefinitely',
      'Is abandoned after the time for seeking further review expires (typically 2 months for rehearing or 63 days for Federal Circuit appeal)',
      'Automatically converts to a provisional application',
      'Is refunded all prosecution fees',
    ],
    correct: 1,
    explanation:
      'If the PTAB affirms the rejection and the applicant does not take further action (rehearing, Federal Circuit appeal, amendment under §41.50(b) if new ground, or RCE), the application prosecution is terminated and the application becomes abandoned after the time for seeking review expires. See MPEP §1215.',
  },

  // TOPICS 4-7 CONTINUE BELOW
];

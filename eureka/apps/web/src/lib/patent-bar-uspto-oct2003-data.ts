/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, October 15, 2003 — Morning Session
 * (Test Number 123, Series 203), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (15oct03aq.pdf / 15oct03aa.pdf,
 * via the Internet Archive copy of uspto.gov). US Government works — public
 * domain.
 *
 * Provenance and integrity rules for this file:
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only).
 *  - Option ORDER is the official exam order — never shuffled (several
 *    options reference other options by letter, and official exams are
 *    already key-balanced).
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Questions 2 and 39 of this session were officially discarded by the
 *    USPTO ("CREDIT GIVEN FOR ALL ANSWERS") and are excluded.
 *  - ERA NOTE: this exam predates the AIA (2011-2013). Questions that turn on
 *    pre-AIA 35 U.S.C. 102/103 timing rules carry an explicit [Pre-AIA] tag in
 *    the explanation; procedure/MPEP-practice questions remain broadly
 *    applicable. Verified status: OFFICIAL (USPTO model answers).
 *
 * Ingested so far: AM session Q1, Q3–Q12 (11 of 48 scoreable). The remaining
 * AM questions (Q13–Q50) and the PM session follow the same pipeline — see
 * docs/monetization/TEST_PREP_FIX_BUILD_PROMPT.md (WS2).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2003_AM_SOURCE =
  'USPTO Registration Examination, October 15, 2003 — Morning Session (official model answers; public domain)';

export const USPTO_OCT2003_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct03-am-01',
    topicId: 3,
    subtopic: 'New Matter — Appeal vs Petition (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Assuming that a rejection has been properly made final, which of the following statements is not in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'An objection and requirement to delete new matter from the specification is subject to supervisory review by petition under 37 CFR 1.181.',
      'A rejection of claims for lack of support by the specification (new matter) is reviewable by appeal to the Board of Patent Appeals and Interferences.',
      'If both the claims and the specification contain the same new matter, and there has been both a rejection and objection by the primary examiner, the new matter issue should be decided by petition, and is not appealable.',
      'If both the claims and the specification contain the same new matter, and there has been both a rejection and objection by the examiner, the new matter issue is appealable, and should not be decided by petition.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2163.06 ("Review Of New Matter Objections And Rejections"): a rejection of claims is reviewable by the Board of Patent Appeals and Interferences, whereas an objection and requirement to delete new matter is subject to supervisory review by petition under 37 CFR 1.181. If both the claims and specification contain the same new matter and there has been both a rejection and objection, the issue becomes appealable and should not be decided by petition — so (C) misstates the rule.',
  },
  {
    id: 'uspto-oct03-am-03',
    topicId: 2,
    subtopic: 'Examiner Interviews (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Inventor Joe is anxious to get a patent with the broadest claim coverage possible for the invention. Joe retained a registered practitioner, Jane, to obtain the advantage of legal counsel in obtaining broad protection. Jane filed a patent application for the invention. The inventor heard that, although patent prosecution is conducted in writing, it is possible to get interviews with examiners. Joe believes an interview might hasten the grant of a patent by providing the examiner a better understanding of the true novelty of the invention. Which of the following are consistent with the patent law, rules and procedures as related by the MPEP regarding usage of interviews?',
    options: [
      'Prior to the first Office action being mailed the inventor calls the examiner to whom the application is docketed to offer help in understanding the specification.',
      'After receiving the first Office action Jane calls the examiner for an interview for the purpose of clarifying the structure and operation of the invention as claimed and disclosed, because the examiner’s analysis regarding patentability in the rejection is novel and suggests that the examiner is interpreting the claimed invention in a manner very different from the inventor’s intent.',
      'Jane has Larry, a registered practitioner in the Washington D.C. area, who is more familiar with interview practice, call the examiner. Jane gives Larry a copy of the first Office action, which suggests that the primary examiner’s analysis is incorrect, and offers to explain why. Jane instructs Larry that because Larry is unfamiliar with the inventor, Larry should not agree to possible ways in which the claims could be modified, or at least indicate to the examiner that Jane would have to approve of any such agreement.',
      'Jane calls the primary examiner after receiving the final rejection, demanding that the examiner withdraw the finality of the final action. When the examiner states that the final rejection is proper, Jane demands an interview as a matter of right to explain the arguments.',
      '(B) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 713.01: an interview should be had only when the nature of the case is such that it could develop and clarify specific issues and lead to a mutual understanding between the examiner and the applicant, thereby advancing prosecution. (A) is incorrect — a request for an interview prior to the first Office action is ordinarily not granted (37 CFR § 1.133(a)(2); MPEP § 713.02). (D) is incorrect — an interview after final rejection is not a matter of right.',
  },
  {
    id: 'uspto-oct03-am-04',
    topicId: 0,
    subtopic: 'Claim Interpretation — Special Definition (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Claim 1 of an application recites “[a]n article comprising: (a) a copper substrate; and (b) an electrically insulating layer on said substrate.” The specification defines the term “copper” as being elemental copper or copper alloys. In accordance with the patent laws, rules and procedures as related in the MPEP, for purposes of searching and examining the claim, the examiner should interpret the term “copper” in the claim as reading on:',
    options: [
      'Elemental copper only, based on the plain meaning of “copper.”',
      'Copper alloys only, based on the special definition in the specification.',
      'Elemental copper and copper alloys, based on the special definition in the specification.',
      'Any material that contains copper, including copper compounds.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. When the specification expressly provides a special definition for a term used in the claims, the term must be given that special meaning (MPEP § 2111.01). (A) is incorrect because plain meaning applies only when the specification does not define the term; (B) ignores that the definition includes elemental copper; (D) ignores the specification’s definition.',
  },
  {
    id: 'uspto-oct03-am-05',
    topicId: 0,
    subtopic: 'Prior Art Available Under 103 (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following does not constitute prior art upon which a primary examiner could properly rely upon in making an obviousness rejection under 35 USC 103?',
    options: [
      'A U.S. patent in the applicant’s field of endeavor which was issued two years before the filing date of applicant’s patent application.',
      'A non-patent printed publication in a field unrelated to the applicant’s field of endeavor but relevant to the particular problem with which the inventor-applicant was concerned, which was published the day after the filing date of applicant’s application.',
      'A printed publication published more than 1 year before the filing date of applicant’s patent application, which publication comes from a field outside the applicant’s field of endeavor but concerns the same problem with which the applicant-inventor was concerned.',
      'A printed publication in the applicant’s field of endeavor published 3 years before the filing date of applicant’s patent application.',
      'A U.S. patent which issued more than 1 year before the filing date of applicant’s patent application, which the Office placed in a different class than the applicant’s patent application, but which concerns the same problem with which the applicant-inventor was concerned, and which shows the same structure and function as in the applicant’s patent application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2141.01 (quoting Panduit Corp. v. Dennison Mfg. Co., 810 F.2d 1561 (Fed. Cir. 1987)): before answering Graham’s "content" inquiry, it must be known whether a patent or publication is in the prior art under 35 U.S.C. § 102 — a publication published AFTER the application’s filing date is not prior art. [Pre-AIA framing; the same publication-timing principle carries into AIA § 102 with different rules.]',
  },
  {
    id: 'uspto-oct03-am-06',
    topicId: 5,
    subtopic: 'Reexamination — Late Response / Revival (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In a reexamination proceeding a non-final Office action dated November 8, 2001 set a shortened statutory period of 2 months to reply. The patent owner, represented by a registered practitioner, filed a response on March 7, 2002, which included an amendment of the claims. No request for an extension of time was received. As of May 8, 2002, which of the following actions would be in accord with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'The registered practitioner should file a request and fee for an extension of time of two months.',
      'The registered practitioner should file a petition for revival of a terminated reexamination proceeding showing the delay was unavoidable or unintentional, and the appropriate petition fee for entry of late papers.',
      'The primary examiner responsible for the reexamination should mail a Notice of Allowance and grant a new patent. The patent owner’s failure to timely respond to the outstanding Office action does not affect the allowability of the claims in the patent.',
      'The examiner should provide an Office action based upon the claims in existence prior to the patent owner’s late amendment, and mail a Final Office action.',
      'The registered practitioner should request an extension of time of four months, and file a Notice of Appeal.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.137; MPEP § 2268: pursuant to 37 CFR 1.550(d), an ex parte reexamination proceeding is terminated if the patent owner fails to file a timely and appropriate response to any Office action; a terminated proceeding can be revived on petition showing the delay was unavoidable or unintentional, with the petition fee for entry of late papers.',
  },
  {
    id: 'uspto-oct03-am-07',
    topicId: 3,
    subtopic: 'Utility Rejection — Reply Strategy (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] On January 2, 2001, a registered practitioner filed a patent application with the USPTO for inventor Bloc. The application includes a specification and a single claim to the invention which reads as follows: “1. Compound Y.” In the specification, Bloc explains that compound Y is an intermediate in the chemical manufacture of synthetic Z. With respect to synthetic Z, the specification discloses its structural formula and further states that synthetic Z is modeled on the natural form of Z to give it the same therapeutic ability to alleviate pain. The specification goes on to state that synthetic Z is also a cure for cancer. On June 2, 2001, the practitioner received an Office action from the primary examiner rejecting the claim under 35 U.S.C. 101 as being inoperative; that is, the synthetic Z does not operate to produce a cure for cancer (i.e., incredible utility). Bloc believes he is entitled to a patent to his compound Y. In accordance with the patent laws, rules and procedures as related in the MPEP, how best should the practitioner reply to the rejection of the claim?',
    options: [
      'Advise Bloc that he should give up because a cure for cancer is indeed incredible and is unproven.',
      'File a reply arguing that a cure for cancer is not incredible and he can prove it if given the chance.',
      'File a reply arguing that whether or not a cure for cancer is incredible is superfluous since Bloc has disclosed another utility — alleviating pain, which is not incredible.',
      'File a reply arguing that the claim is directed to compound Y, not synthetic Z.',
      'File a reply arguing that synthetic Z is modeled on the natural form of Z.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the best answer. MPEP §§ 2107.01, 2107.02: inventions asserted to have utility in the treatment of human or animal disorders are subject to the same utility requirements as any other field; where the specification discloses at least one credible utility (alleviating pain), an assertion that another stated utility is incredible does not defeat the claim.',
  },
  {
    id: 'uspto-oct03-am-08',
    topicId: 0,
    subtopic: 'Pre-AIA 102(d) Conditions (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] 35 USC 102(d) establishes four conditions which, if all are present, establish a bar against the granting of a patent in this country. In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following is not one of the four conditions established by 35 USC 102(d)?',
    options: [
      'The foreign application must be filed more than 12 months before the effective U.S. filing date.',
      'The foreign application must have been filed by the same applicant as in the United States or by his or her legal representatives or assigns.',
      'The foreign patent or inventor’s certificate must be actually granted before the U.S. filing date.',
      'The foreign patent or inventor’s certificate must be actually granted and published before the U.S. filing date.',
      'The same invention must be involved.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 2135 ("General Requirements of 35 U.S.C. 102(d)"): the foreign patent or inventor’s certificate must be actually granted (e.g., by sealing of the papers in Great Britain) before the U.S. filing date — it need NOT be published. (A), (B), (C) and (E) are the actual conditions. [Pre-AIA: § 102(d) was eliminated by the AIA; tested here as historical/pre-AIA law.]',
  },
  {
    id: 'uspto-oct03-am-09',
    topicId: 0,
    subtopic: 'CIP Benefit Claims & Intervening Art (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Smith’s first invention is a new method of fabricating a semiconductor capacitor in a dynamic random access memory (DRAM) cell. Smith filed a first patent application on December 13, 2001 disclosing and claiming the first invention. Smith’s later, second invention, is an improved semiconductor capacitor in a DRAM cell and a method of making it. Smith filed a second application on December 16, 2002, claiming the benefit of the filing date of the copending first application. The second application contains claims 1-20, and a specification that provides support for the claimed subject matter in compliance with 35 USC 112, first paragraph. In the second application, claims 1-10 are drawn to Smith’s first invention, and claims 11-20 are drawn to Smith’s second invention. The primary examiner found a non-patent printed publication authored by Jones published on February 4, 2002. The article discloses both of Smith’s inventions. Which of the following courses of action by the examiner would be in accord with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'The examiner can reject claims 1-20 in the second application using the article because the publication date of the article is earlier than the filing date of the second application.',
      'The examiner cannot reject any of the claims in the second application using the article because the second application claims the benefit of the filing date of the first application.',
      'The examiner can reject claims 1-20 in the second application using the article because the second application is not entitled to the benefit of the filing date of the first application since the second application was filed more than one year from the filing date of the first application.',
      'The examiner can reject claims 1-10, but cannot reject claims 11-20 in the second application because the first application did not disclose the improved capacitor set forth in claims 11-20.',
      'The examiner cannot reject claims 1-10, but can reject claims 11-20 in the second application because the first application did not disclose an improved capacitor set forth in claims 11-20.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 201.11: a claim in a continuation-in-part directed solely to subject matter adequately disclosed in the parent is entitled to the parent’s filing date; claims reciting features not disclosed in the parent are entitled only to the CIP’s filing date. Claims 1-10 (first invention) get the December 13, 2001 date and antedate the February 4, 2002 article; claims 11-20 (new subject matter) do not, so the article is available against them. [Pre-AIA benefit/timing analysis.]',
  },
  {
    id: 'uspto-oct03-am-10',
    topicId: 0,
    subtopic: '112 ¶2 Definiteness Factors (Official Oct 2003)',
    difficulty: 1,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, definiteness of claim language under 35 U.S.C. 112, second paragraph must be analyzed, not in a vacuum, but in light of:',
    options: [
      'The content of the particular application disclosure.',
      'The teachings of the prior art.',
      'The claim interpretation that would be given by one possessing the ordinary level of skill in the pertinent art at the time the invention was made.',
      'The claim interpretation that would be given by one possessing expert skill in the pertinent art at the time the invention was made.',
      '(A), (B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 2173.02: definiteness of claim language must be analyzed in light of (A) the content of the particular application disclosure, (B) the teachings of the prior art, and (C) the claim interpretation that would be given by one of ordinary skill in the art at the time of invention — all three, so (E) controls; (D) misstates the standard (ordinary, not expert, skill).',
  },
  {
    id: 'uspto-oct03-am-11',
    topicId: 0,
    subtopic: 'Pre-AIA 103(c) Common-Ownership Exclusion (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Application A was filed after November 29, 2000. Reference X and application A were commonly owned at the time the invention of application A was made. In accordance with the patent laws, rules and procedures as related in the MPEP, the prior art exclusion of 35 USC 103(c) can be properly invoked to obviate which of the following rejections?',
    options: [
      'A rejection under 35 USC 102(e) based on reference X, if reference X is prior art only under 35 USC 102(e).',
      'A double patenting rejection based on reference X, if reference X is available as prior art only under 35 USC 102(e).',
      'A rejection under 35 USC 103(a) based on reference X, if reference X is available as prior art only under 35 USC 102(e).',
      '(B) and (C).',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 706.02(l) et seq.: the prior art exclusion of 35 U.S.C. § 103(c) applies only when the reference qualifies as prior art solely under § 102(e), (f), or (g), the reference and the application were commonly owned at the time the invention was made, and the reference is applied in an OBVIOUSNESS (§ 103(a)) rejection — it does not obviate § 102(e) anticipation rejections or double patenting. [Pre-AIA: § 103(c) was replaced by AIA § 102(b)(2)(C).]',
  },
  {
    id: 'uspto-oct03-am-12',
    topicId: 2,
    subtopic: 'Assignee Control & Inventor Access (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Inventors B and C are employed by Corporation D, which authorized registered practitioner E to prepare and file a patent application claiming subject matter invented by B and C. Inventor B signed the oath, an assignment to Corporation D, and a power of attorney authorizing practitioner E to prosecute the application. Inventor C refused to sign the oath and any assignment documents for the application. The employment contract between inventor C and Corporation D contains no language obligating C to assign any invention to Corporation D. A patent application was properly filed in the USPTO under 37 CFR 1.47 naming B and C as inventors, but without inventor C signing the oath. C has now started his own company competing with Corporation D producing a product with the invention in the application. Inventor B is a friend of inventor C and wants C to have continued access to the application. Which of the following statements is in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Inventor C, who has not signed the oath or declaration, may revoke the power of attorney to practitioner E and appoint practitioner F to prosecute the application.',
      'Inventor C cannot be excluded from access to the application because inventor B has not agreed to exclude inventor C. In order to exclude a co-inventor from access to an application, all the remaining inventors must agree to exclude that co-inventor.',
      'Inasmuch as one of the named joint inventors has not assigned his or her rights to Corporation D, the corporation is not an assignee of the entire right and interest, and therefore cannot exclude inventor C from access to the application.',
      'An inventor who did not sign the oath or declaration filed in an application can always be excluded from access to an application.',
      'An assignee filing an application can control access to an application and exclude inventors who have not assigned their rights and other assignees from inspecting the application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 106: the assignee of record of the ENTIRE interest may intervene in prosecution; because inventor C never assigned, Corporation D is not the assignee of the entire right and interest and cannot exclude C from access. MPEP § 409.03(i) is directly contrary to (A) — a nonsigning inventor cannot revoke the power of attorney.',
  },
];

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
 *  - Question 30 is excluded because the USPTO's model answer accepts TWO
 *    keys ("(B) or (D) is accepted as the correct answer"); this bank's
 *    single-key grading cannot represent dual credit without mis-grading
 *    one of the officially-correct choices.
 *  - ERA NOTE: this exam predates the AIA (2011-2013). Questions that turn on
 *    pre-AIA 35 U.S.C. 102/103 timing rules carry an explicit [Pre-AIA] tag in
 *    the explanation; procedure/MPEP-practice questions remain broadly
 *    applicable. Verified status: OFFICIAL (USPTO model answers).
 *
 * Ingested: AM session Q1, Q3–Q29, Q31–Q38, Q40–Q50 (47 of 48 scoreable;
 * Q30 excluded — dual-keyed, see above). The PM session and the April 2003
 * exam follow the same pipeline — see
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
  {
    id: 'uspto-oct03-am-13',
    topicId: 2,
    subtopic: 'Small Entity Fee Reductions (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following fees may not be reduced by 50 percent for “small entities”?',
    options: [
      'The basic filing fee for a design patent application.',
      'The fee for a disclaimer.',
      'The fee for a petition for an extension of time.',
      'The fee for recording a document affecting title.',
      'The maintenance fee due at 3 years and six months after grant.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 41(h); MPEP §§ 302.06, 509.02. Section 41(h) reduces by 50 percent only fees charged under subsection (a) or (b). The fee for recording a document affecting title is charged under 35 U.S.C. § 41(d)(1) / 37 CFR § 1.21(h) — a miscellaneous fee not entitled to the small-entity discount (MPEP § 509.02). (A), (B), (C) and (E) are all charged under § 41(a) or (b) and ARE reduced.',
  },
  {
    id: 'uspto-oct03-am-14',
    topicId: 0,
    subtopic: 'Enablement — Scope of Claims vs Disclosure (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] The specification of a patent application contains limited disclosure of using antisense technology in regulating three particular genes in E. coli cells. The specification contains three examples, each applying antisense technology to regulating one of the three particular genes in E. coli cells. Despite the limited disclosure, the specification states that the “the practices of this invention are generally applicable with respect to any organism containing genetic material capable of being expressed such as bacteria, yeast, and other cellular organisms.” All of the original claims in the application are broadly directed to the application of antisense technology to any cell. No claim is directed to applying antisense technology to regulating any of the three particular genes in E. coli cells. The claims are rejected under 35 USC 112, first paragraph, for lack of enablement. In support of the rejection, a publication is cited that correctly notes antisense technology is highly unpredictable, requiring experimentation to ascertain whether the technology works in each type of cell. The publication cites the inventor’s own articles (published after the application was filed) that include examples of the inventor’s own failures to control the expressions of other genes in E. coli and other types of cells. In accordance with the patent laws, rules and procedures as related in the MPEP, the rejection is:',
    options: [
      'appropriate because the claims are not commensurate in scope with the breadth of enablement inasmuch as the working examples in the application are narrow compared to the wide breadth of the claims, the unpredictability of the technology, the high quantity of experimentation needed to practice the technology in cells other than E. coli.',
      'appropriate because the claims are not commensurate in scope with the breadth of the enablement inasmuch no information is provided proving the technology is safe when applied to animal consumption.',
      'inappropriate because the claims are commensurate in scope with the breadth of enablement inasmuch as the specification discloses that the “the practices of this invention are generally applicable with respect to any organism containing genetic material capable of being expressed.”',
      'inappropriate because the claims are commensurate in scope with the breadth of enablement inasmuch as the claims are original, and therefore are self-supporting.',
      'inappropriate because the claims are commensurate in scope with the breadth of the enablement inasmuch as the inventor is not required to theorize or explain why the failures reported in the article occurred.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 112, first paragraph; MPEP §§ 2164.01, 2164.06(b). The enablement standard is whether the experimentation needed to practice the invention is undue or unreasonable (Mineral Separation v. Hyde, 242 U.S. 261 (1916); In re Wands, 858 F.2d 731 (Fed. Cir. 1988)) — narrow working examples plus high unpredictability and undue experimentation defeat claims of this breadth (see Enzo Biochem v. Calgene, MPEP § 2164.06(b)). (B) confuses patent-law utility with FDA safety (MPEP § 2107.01). (D) is wrong — claims do not provide their own enablement. (E) fails because countervailing evidence was produced.',
  },
  {
    id: 'uspto-oct03-am-15',
    topicId: 3,
    subtopic: 'Proper Reply to Final Rejection (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A utility application filed in May 2001 has been prosecuted through a second action final rejection. In the final rejection some claims were allowed and other claims were finally rejected. Which of the following accords with the patent laws, rules and the procedures as related in the MPEP for a proper reply to a second action final rejection in the utility application?',
    options: [
      'An amendment canceling all rejected claims and complying with 37 CFR 1.116.',
      'Only a Notice of Appeal.',
      'The appropriate fee for a request for continued examination (RCE).',
      'A continued prosecution application (CPA) under 37 CFR 1.53(d).',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. An amendment complying with 37 CFR § 1.116 is a proper reply under 37 CFR § 1.113 to a final rejection (MPEP § 714.13, “Entry Not A Matter of Right”). (B) fails because a Notice of Appeal must be accompanied by the appeal fee (37 CFR § 1.17(b)); (C) fails because an RCE must be accompanied by a submission meeting 37 CFR § 1.111; (D) fails because CPA practice does not apply to utility or plant applications with a filing date on or after May 29, 2000 (MPEP § 706.07(h)).',
  },
  {
    id: 'uspto-oct03-am-16',
    topicId: 5,
    subtopic: 'Broadening Reissue — Two-Year Window (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Tribell files a patent application for her aroma therapy kit on November 29, 1999, which issues as a patent on August 7, 2001. She tries to market her kit but all of her prospects are concerned that her patent claims are not sufficiently broad. On September 5, 2001, Tribell asks a registered practitioner for advice on what to do to improve her ability to market her aroma therapy kit. At the consultation the practitioner learns that in the original patent application, Tribell had a number of claims which were subjected to a restriction requirement, but were nonelected and withdrawn from further consideration. The practitioner also determines that the claims in the patent obtained by Tribell were narrower than the broader invention disclosed in the specification, and the cited references may not preclude patentability of the broader invention. Which of the following is the best course of action to pursue in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Tribell should file a reissue application under 35 USC 251 within two years of the issuance of the patent, broadening the scope of the claims of the issued patent.',
      'Tribell should file a reissue application under 35 USC 251 any time during the period of enforceability of the patent to broaden the scope of the claims of the issued patent, and then file a divisional reissue application of the first reissue application on the nonelected claims that were subjected to a restriction requirement in the nonprovisional application which issued as a patent.',
      'Tribell should simultaneously file two separate reissue applications under 35 USC 251, one including an amendment of broadening the claims in the original patent, and the other including the nonelected claims that were subjected to a restriction requirement in the nonprovisional application which issued as a patent.',
      'Tribell should immediately file a divisional application under 37 CFR 1.53(b) including the nonelected claims that were subjected to a restriction requirement in the original application.',
      'Tribell should immediately file a reissue application under 35 USC 251, including the nonelected claims that were subjected to a restriction requirement in the original application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 251; MPEP § 1402: claims may be broadened in a reissue application filed by the inventor within two years from the patent issue date. (B) violates § 251, fourth paragraph — no broadening reissue unless applied for within two years of grant. (C) and (E) fail because failure to timely file a divisional on nonelected claims is not error correctable via reissue (In re Orita, 550 F.2d 1277 (CCPA 1977)). (D) fails because a divisional must be filed while the parent is still pending (MPEP § 201.06).',
  },
  {
    id: 'uspto-oct03-am-17',
    topicId: 3,
    subtopic: 'Official Notice — Traversal (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Inventor files an application containing the following original Claim 1: “1. A widget comprising element A, and element B.” In a first Office action on the merits, a primary examiner rejects claim 1 under 35 USC 103 as being obvious over reference X. Reference X explicitly discloses a widget having element A, but it does not disclose element B. The examiner, however, takes official notice of the fact that element B is commonly associated with element A in the art and on that basis concludes that it would have been obvious to provide element B in the reference X widget. In reply to the Office action, the registered practitioner representing the applicant makes no amendments, but instead requests reconsideration of the rejection by demanding that examiner show proof that element B is commonly associated with element A in the art. Which of the following actions, if taken by the examiner in the next Office action would be in accord with the patent laws, rules and procedures as related in the MPEP? I. Vacate the rejection and allow the claim. II. Cite a reference that teaches element B is commonly associated with element A in the art and make the rejection final. III. Deny entry of applicant’s request for reconsideration on the ground that it is not responsive to the rejection and allow applicant time to submit a responsive amendment.',
    options: [
      'I and II only.',
      'II only.',
      'II and III only.',
      'I, II, and III.',
      'I and III only.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2144.03: when an applicant seasonably traverses an officially noticed fact, the examiner may cite a reference teaching the noticed fact and make the next action final (II), and should vacate the rejection if no support for the noticed fact can be found (I) (In re Ahlert, 424 F.2d 1088 (CCPA 1970)). III is improper — an applicant is entitled to respond by requesting reconsideration with or without amendment (37 CFR § 1.111(a)(1)), and must timely challenge a noticed fact to preserve the issue for appeal.',
  },
  {
    id: 'uspto-oct03-am-18',
    topicId: 0,
    subtopic: 'Enabling Prior Art (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following statements regarding operability or enablement of a prior art reference is the most correct?',
    options: [
      'The level of disclosure required for a reference to be enabling prior art is no less if the reference is a United States patent than if it is a foreign patent.',
      'A reference is not presumed to be operable merely because it expressly anticipates or makes obvious all limitations of an applicant’s claimed apparatus.',
      'A non-enabling reference may not qualify as prior art for the purpose of determining anticipation or obviousness of the claimed invention.',
      'A reference does not provide an enabling disclosure merely by showing that the public was in possession of the claimed invention before the date of the applicant’s invention.',
      'All of the above are correct.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2121, citing In re Moreton, 288 F.2d 708 (CCPA 1961): the level of disclosure required to make a reference an enabling disclosure is the same no matter what type of prior art is at issue — there is no basis for discriminating by nationality. (B) is wrong — prior art is PRESUMED operable when it expressly anticipates or makes obvious all elements (MPEP § 2121). (C) is wrong — a non-enabling reference may qualify as prior art for obviousness under § 103 (Symbol Technologies v. Opticon). (D) is wrong — a reference contains an enabling disclosure if the public was in possession of the claimed invention (MPEP § 2121.01).',
  },
  {
    id: 'uspto-oct03-am-19',
    topicId: 0,
    subtopic: 'Overcoming a 102 Rejection (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with patent laws, rules and procedures as related in the MPEP, a rejection under 35 USC 102 can be overcome by demonstrating:',
    options: [
      'the reference is nonanalogous art.',
      'the reference teaches away from the claimed invention.',
      'the reference disparages the claimed invention.',
      '(A), (B) and (C).',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 2131.05: arguments that anticipatory prior art is “nonanalogous art,” “teaches away from the invention,” or is not recognized as solving the claimed problem are not germane to a § 102 rejection (Twin Disc v. United States, 231 USPQ 417; In re Self, 671 F.2d 1344 (CCPA 1982)). A reference is no less anticipatory if it disparages the invention after disclosing it; “teaching away” is inapplicable to anticipation (Celeritas Technologies v. Rockwell, 150 F.3d 1354 (Fed. Cir. 1998)).',
  },
  {
    id: 'uspto-oct03-am-20',
    topicId: 2,
    subtopic: 'Omitted Drawing — Incorporation by Reference (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] On January 3, 2003, a registered practitioner filed a continuation application that includes a benefit claim to a prior-filed application. The practitioner simultaneously filed in the prior-filed application an express abandonment in favor of a continuing application. The prior application contained five drawing figures described in the specification. However, the continuation application contains only four of the five drawing figures. The specification of the continuation application did not include a complete description of the missing drawing figure. A postcard from the USPTO, listing the contents of the continuation application, contains a note that only four drawing figures were received. The practitioner inadvertently omitted one of the drawing figures mentioned in the specification when he filed the continuation application. The missing drawing figure shows a claimed feature of the invention. On February 10, 2003, the practitioner received a Notice of Omitted Item(s) properly according a filing date of January 3, 2003 for the continuation application without the missing drawing figure and notifying the applicant that the drawing is missing. Which of the following procedures for filing the missing drawing would comply with the patent laws, rules and procedures as related in the MPEP for according the continuation application a January 3, 2003 filing date with the five drawing figures that were present in the application?',
    options: [
      'The practitioner files the missing drawing figure in response to the Notice of Omitted Item(s) within the time period set forth in the notice.',
      'The practitioner files the missing drawing figure and an amendment to the specification to add a complete description of the missing drawing figure in response to the Notice of Omitted Item(s) within the time period set forth in the notice.',
      'The practitioner files an amendment to cancel the description of the missing drawing figure from the specification of the continuation application.',
      'If the continuation application as originally filed includes an incorporation by reference of the prior-filed application to which the benefit is claimed, the practitioner can file the missing drawing figure any time prior to the first Office action.',
      'The practitioner files the missing drawing figure accompanied by a petition under 37 CFR 1.53(e) with the petition fee set forth in 37 CFR 1.17(h) only alleging that the drawing figure indicated as omitted was in fact deposited with the USPTO with the application papers.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 201.06(c), “Incorporation by Reference”: if the application as originally filed includes a proper incorporation by reference of the prior application(s), an omitted drawing figure identified in a Notice of Omitted Item(s) may be added by amendment provided it contains only subject matter in common with the prior application — submit before the first Office action. (A)/(B) fail because filing the missing figure that way makes the filing date the date the figure is filed (MPEP § 601.01(g)), and a § 120 benefit claim is NOT an incorporation by reference. (E) fails because a § 1.53(e) petition will not be granted where the figure was inadvertently omitted and never actually deposited.',
  },
  {
    id: 'uspto-oct03-am-21',
    topicId: 0,
    subtopic: 'Overcoming 102(b) via § 120 Priority (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Patent application A was filed on January 12, 1995, containing claims 1-10. A primary examiner rejects the claims under 35 USC 102(b) as being anticipated by a U.S. patent issued on June 2, 1992. The rejection also relies on a technical paper published March 12, 1993 to show that a characteristic is inherent in the patent, although not expressed in its disclosure. According to the patent laws, rules and procedures as related in the MPEP, which of the following actions is most likely to overcome the rejection?',
    options: [
      'Filing a declaration and exhibits under 37 CFR 1.131 to antedate the reference U.S. patent.',
      'Filing evidence under 37 CFR 1.132 tending to show commercial success of the invention.',
      'Filing evidence under 37 CFR 1.132 tending to show unexpected results of the invention.',
      'Amending the specification of application A to claim priority under 35 USC 120 by a specific reference to a prior copending application B that was filed before June 2, 1992 by the same inventor and discloses the invention claimed in at least one claim of application A in the manner provided by the first paragraph of 35 USC 112.',
      'Submitting arguments pointing out that the rejection under 35 USC 102(b) relies on more than one reference.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is most correct. [Pre-AIA] MPEP § 706.02(b): a § 102(b) rejection may be overcome by perfecting priority under § 120 by amending the specification to contain a specific reference to a prior application. (A) fails — a 37 CFR § 1.131 declaration cannot antedate a § 102(b) statutory bar (MPEP § 715). (B)/(C) fail — secondary-considerations evidence is irrelevant to § 102 rejections (MPEP § 2131.04; In re Wiggins). (E) fails — a gap about an inherent characteristic may be filled with extrinsic evidence (Continental Can v. Monsanto; MPEP § 2131.01).',
  },
  {
    id: 'uspto-oct03-am-22',
    topicId: 2,
    subtopic: 'Public Access to Published Application Papers (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Application Number A was published as U.S. Patent Application Publication Number B. A member of the public reviewed the listing of the file contents of the application on the Patent Application Information Retrieval system and determined that the application was still pending, that a final Office action was mailed, and that the application file is in the Technology Center where it is being examined. The member of the public does not have a power to inspect, but would like a copy of the final Office action as well as the other papers in the patent application. In accordance with the patent laws, rules and procedures as related in the MPEP, can a copy of these papers be obtained by the member of the public, and if so, how can the copy be obtained?',
    options: [
      'No, a copy cannot be obtained because patent applications are maintained in confidence pursuant to 35 USC 122(a).',
      'No, a copy cannot be obtained because the patent application is still pending.',
      'Yes, a member of the public can go to the Technology Center and ask for the file for copying at a public photocopier.',
      'Yes, the member of the public can complete a “Request for Access to an Application Under 37 CFR 1.14(e)” and, without payment of a fee, order the file from the File Information Unit. Upon the Unit’s receipt of the application, the member of the public can use a public photocopier to make a copy.',
      'Yes, the member of the public can order a copy from the Office of Public Records, with a written request and payment of the appropriate fee.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 103, “Published U.S. Patent Applications”: once an application has been published pursuant to 35 U.S.C. § 122(b), a copy of the specification, drawings, and all papers relating to the file (whether abandoned or pending) may be provided to any person upon written request and payment of the fee. (A)/(B) fail per 37 CFR § 1.14(c)(2). (C)/(D) fail because while the published application is pending, the application file ITSELF is not available for public inspection.',
  },
  {
    id: 'uspto-oct03-am-23',
    topicId: 0,
    subtopic: 'Step-Plus-Function — Anticipation Reply (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Applicant files a claim which includes the following limitation: “a step for crossing the road.” The specification recites the following acts: “(1) go to the curb, (2) look both ways, (3) if the road appears safe, walk across the road, (4) step up onto the far curb, (5) continue walking.” The primary examiner properly construes the step limitation to cover the foregoing acts. A prior art reference, published two years before the application was filed, expressly describes acts (1)-(4), but not (5). This same reference also discloses the remaining limitations recited in applicant’s claim, i.e., those other than the step plus function limitation. The examiner rejects the claim under 35 USC 102(b) as being anticipated by the prior art reference. In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following is the most complete reply to overcome the rejection under these circumstances?',
    options: [
      'An argument explaining that since act (5) is not disclosed in the reference, it does not anticipate the claim.',
      'An amendment to the specification deleting act (5) – continue walking.',
      'An argument showing that neither the equivalent of act (5) nor act (5) is disclosed in the reference, which therefore does not anticipate the claim.',
      'An amendment to the claim by adding a negative limitation to expressly exclude act (5) from crossing the road.',
      '(B) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 35 U.S.C. § 112, sixth paragraph; In re Donaldson, 16 F.3d 1189 (Fed. Cir. 1994) (in banc); MPEP § 2181: step-plus-function limitations are construed to cover the corresponding acts disclosed in the specification AND their equivalents, so to anticipate, the reference must disclose each act or its equivalent. (A) is incomplete — the equivalent of act (5) must also be addressed. (B) fails because with act (5) removed from the specification, the reference clearly anticipates. (D) fails — the reference still anticipates.',
  },
  {
    id: 'uspto-oct03-am-24',
    topicId: 0,
    subtopic: 'Means-Plus-Function — Overcoming Equivalents (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed an application for an applicant claiming a “a means for pulling the door open.” The specification describes a handle and a knob as being used together as a corresponding structure for pulling the door open. A prior art patent discloses a door opened by pulling on an attached bar. The primary examiner issued an Office action rejecting the claim under 35 USC 102 as being anticipated. In the action, the examiner properly identified the corresponding structure described in applicant’s specification as the means for pulling the door open, and properly explained why the prior art attached bar is the equivalent of the structure described in applicant’s specification. In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following is the most correct reply to overcome the rejection under these circumstances?',
    options: [
      'An amendment to the claim changing the pulling means to expressly include an attached bar.',
      'Only argue that the claimed pulling means is not found in the prior art relied-upon reference and therefore the claim is patentable.',
      'An amendment to the specification that adds an attached bar to correspond to the prior art.',
      'An amendment to the claim substituting for the term “means for pulling the door open” the structure of a handle and a knob.',
      'An amendment to the specification that excludes an attached bar as a pulling means.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 2181; 35 U.S.C. § 112, sixth paragraph: a means-plus-function limitation covers the corresponding structure described in the specification and equivalents thereof. By amending the claim to recite the actual structure (handle and knob) instead of the means limitation, the claim no longer covers § 112 ¶ 6 equivalents, overcoming the anticipation rejection. (A)/(C)/(E) each introduce new matter or fail to distinguish the art; (B) does not rebut the examiner’s prima facie case of equivalence.',
  },
  {
    id: 'uspto-oct03-am-25',
    topicId: 5,
    subtopic: 'Patent Term Adjustment Eligibility (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed a utility patent application on May 15, 2000 pursuant to 35 USC 111(a) claiming a detergent composition. On May 15, 2002 the Office mailed a non-final Office action setting a 3-month period for reply. A proper reply was mailed on August 15, 2002 by first-class mail with sufficient postage to the USPTO. The reply was received by the USPTO on September 15, 2002. On September 30, 2002, the Office mailed a final Office action. On October 15, 2002, the Office received a Request for Continued Examination (RCE) meeting all of the requirements of 37 CFR 1.114. On October 30, 2002, the USPTO mailed a Notice of Allowance in view of the RCE and amendment. The utility application issued on February 11, 2003. Which of the following statements is in accord with the patent laws, rules and procedures as related in the MPEP concerning the amount of additional term applicant X would receive because of Patent Term Adjustment (PTA)?',
    options: [
      'The patentee would earn PTA because the Office failed to mail at least one notification under 35 USC 132 or notice of allowance under 35 USC 151 no later than fourteen months after the date the application was filed under 35 USC 111(a) but would lose some earned PTA because applicant did not file a response to the non-final rejection within three months.',
      'The patentee would earn PTA because the Office failed to mail at least one notification under 35 USC 132 or notice of allowance under 35 USC 151 no later than fourteen months after the date the application was filed under 35 USC 111(a) and would not lose any earned PTA because applicant filed a response to the non-final rejection within three months.',
      'The patentee would not earn any additional time under the provisions of PTA because the application is utility application, not a design application.',
      'The patentee would not earn any additional time because the application was filed prior to May 29, 2000 and the filing of the RCE would not make the application eligible for PTA.',
      'The patentee would earn PTA because the filing of the RCE on October 15, 2002 makes the application eligible for PTA and the Office did not mail at least one notification under 35 USC or notice of allowance under 35 USC 151 within 14 months of the date the application was filed under 35 USC 111(a).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 154(b); 37 CFR § 1.702(f); MPEP § 2730: the application was filed before May 29, 2000 and is ineligible for Patent Term Adjustment, and filing an RCE does not make an ineligible application eligible. (A)/(B) fail on the eligibility date; (C) reverses the rule — utility applications (not design patents, which get fourteen-year terms under 35 U.S.C. § 171) are the ones subject to PTA; (E) fails because the RCE confers no eligibility.',
  },
  {
    id: 'uspto-oct03-am-26',
    topicId: 5,
    subtopic: 'Supplemental Oath in Reissue as § 1.312 Amendment (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] When, in accordance with the patent laws, rules and procedures as related in the MPEP, is a supplemental oath or declaration treated as an amendment under 37 CFR 1.312?',
    options: [
      'When filed in a nonprovisional application after the Notice of Allowance has been mailed.',
      'When filed in a reissue application at any point during the prosecution.',
      'When filed in a nonprovisional application after the payment of the Issue Fee.',
      'When filed in a reissue application after the Notice of Allowance has been mailed.',
      '(A) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 714.16: “a supplemental reissue oath or declaration is treated as an amendment under 37 CFR 1.312 because the correction of the patent which it provides is an amendment of the patent, even though no amendment is physically entered into the specification or claim(s).” (A) fails — outside reissue, a supplemental oath is not treated as a § 1.312 amendment (MPEP § 603.01). (B) fails — only if filed after allowance. (C) fails — amendments after payment of the issue fee are no longer permitted under § 1.312.',
  },
  {
    id: 'uspto-oct03-am-27',
    topicId: 0,
    subtopic: 'Patentable Subject Matter § 101 (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following is patentable subject matter under 35 USC 101?',
    options: [
      'A novel and unobvious abstract idea.',
      'A previously undiscovered law of nature.',
      'A billing process containing mathematical algorithms producing a written invoice.',
      'A novel and unobvious discovery of a physical phenomenon.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2106 (era guidance): claims drawn to a long-distance telephone billing process containing mathematical algorithms were held patentable because the process produces a useful, concrete, tangible result without pre-empting other uses of the mathematical principle (AT&T Corp. v. Excel Communications, 172 F.3d 1352 (Fed. Cir. 1999); State Street Bank v. Signature Financial). (A), (B) and (D) fail — abstract ideas, laws of nature and physical phenomena are unpatentable subject matter (MPEP § 2105). [Note: § 101 doctrine has since evolved (Bilski/Alice), but this remains the official key for this exam.]',
  },
  {
    id: 'uspto-oct03-am-28',
    topicId: 0,
    subtopic: 'Obviousness — Different Purpose Rationale (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner files a patent application with the following claim: “1. A plastic insert for the bottom of a shopping cart comprising circular receptacles to receive wine bottles and to maintain them in an upright and stable position even while the shopping cart is moved about a store so that they do not fall and break.” Patent A discloses a plastic insert for the bottom of a shopping cart comprising rectangular receptacles to receive cereal boxes and to maintain them in an upright and stable position even while the shopping cart is moved about a store in order to keep them organized in the cart. Patent A also discloses that the receptacles could be any circular diameter to receive complementary shaped bottles or jars such as to securely hold 2-liter soft drink bottles or mayonnaise jars. A primary examiner rejected the claim as being obvious under 35 USC 103 over Patent A reasoning that Patent A suggests to one of ordinary skill in the art an insert for a shopping cart with circular receptacles for the purpose of stably maintaining any bottle, including wine bottles, while pushing the cart about a store so that the cart remains organized. Assume the examiner has made a sufficient prima facie case of obviousness. Following receipt of the rejection, the practitioner filed a timely reply. The practitioner argued that Patent A does not render obvious the claimed subject matter because there is no suggestion of a plastic insert to keep a wine bottle from falling and breaking in a shopping cart. Which of the following best explains why, in accordance with the patent laws, rules and the procedures as related in the MPEP, the examiner should or should not be persuaded by the practitioner’s argument?',
    options: [
      'No, because Patent A suggests circular receptacles for any complementary bottle, albeit for a different purpose.',
      'Yes, because there is no suggestion in Patent A that the plastic insert can hold a wine bottle.',
      'Yes, because the claim uses the insert to keep the bottles from falling and breaking while Patent A uses the insert to keep the cart organized.',
      'Yes, because Patent A is more interested in organizing boxes than holding bottles.',
      'Yes, because the prevention from breakage is an unexpected property of the plastic insert.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2144, “Rationale Different From Applicant’s Is Permissible”: the reason or motivation to modify a reference may suggest what the inventor has done but for a different purpose — it is not necessary that the prior art suggest the combination to achieve the same advantage (In re Linter; In re Dillon). Patent A’s generic teaching of complementary-shaped receptacles renders the claim prima facie obvious regardless of the breakage purpose; rebuttal requires showing a difference in structure, not purpose — which is why (C) and (D) fail.',
  },
  {
    id: 'uspto-oct03-am-29',
    topicId: 0,
    subtopic: 'Printed Publications — Accessibility (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following statements regarding publications as references is incorrect?',
    options: [
      'A doctoral thesis indexed and shelved in a library can be sufficiently accessible to the public to constitute prior art as a printed publication.',
      'Evidence showing routine business practices is never sufficient to establish the date on which a publication became accessible to the public.',
      'A paper which is orally presented in a forum open to all interested persons can constitute a “printed publication” if written copies are disseminated without restriction.',
      'Documents distributed only internally within an organization, which has an existing policy of confidentiality or agreement to remain confidential are not “printed publications” even if many copies are distributed.',
      'A publication disseminated by mail is not available as prior art until it is received by at least one member of the public.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most proper answer (the incorrect statement). MPEP § 2128.02: “Evidence showing routine business practices CAN be used to establish the date on which publication became accessible to the public. Specific evidence showing when the specific document actually became available is not always necessary” (Constant v. Advanced Micro-Devices; In re Hall). (A), (C), (D) and (E) each correctly state the law (MPEP §§ 2128.01, 2128.02; In re Hall; MIT v. AB Fortia; In re George; In re Schlittler).',
  },
  {
    id: 'uspto-oct03-am-31',
    topicId: 5,
    subtopic: 'Reexamination — Enlarging Claim Scope § 305 (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Reexamination has been ordered following receipt of a request for reexamination of U.S. Patent X, filed by the patentee. Patent X contains independent claims 1 through 4, each directed to a hydrocyclone separator apparatus. They are the only claims that were ever presented during prosecution of the application that matured into Patent X. In the first Office action during reexamination, claims 1 through 4 are rejected as being obvious under 35 USC 103 over U.S. Patent Z. The apparatus is used for separating material, including fibers suspended in a liquid suspension, into a light fraction containing the fibers, and a heavy fraction containing rejects. Assume there are no issues under 35 USC 102, 103, or 112, and that any dependent claim is properly dependent. Recommend which of the following claims, if any, would be subject to rejection under 35 USC 305 for improperly enlarging the scope of the original claim in accordance with the patent laws, rules and procedures as related in the MPEP.',
    options: [
      'Claim 5. A hydrocyclone separator apparatus according to claim 4, wherein said blades are configured in the form of generally plane surfaces curved in one plane only.',
      'Claim 5. A hydrocyclone separator apparatus according to claim 4, wherein the outlet duct is in the form of two frustro-conical portions joined at their narrow ends.',
      'Claim 5. A method of separating material including fibers suspended in a liquid suspension comprising the steps of separating the material into a light fraction containing the fibers and a heavy fraction containing rejects, and converting the light fraction into a pulp and paper stock suspension.',
      'Claim 5. A hydrocyclone separator apparatus according to claim 4, wherein the separator chamber is conical in shape having at the narrow end an outlet for the heavy fraction and at its wide end an outlet for the light fraction.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. 35 U.S.C. § 305; MPEP §§ 2258, 1412.03: no amended or new claim enlarging the scope of the claims of the patent is permitted in reexamination, and adding process claims as a NEW category of invention where the original patent had no method claims is generally a broadening of the invention (Ex parte Wikdahl, 10 USPQ2d 1546). (A), (B) and (D) are apparatus claims dependent from claim 4 and do not enlarge the scope.',
  },
  {
    id: 'uspto-oct03-am-32',
    topicId: 0,
    subtopic: 'Enablement Rejection — Examiner’s Burden (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] With respect to the examiner’s burden in making an enablement rejection under 35 USC 112, first paragraph, which of the following statements is or are in accordance with the patent laws, rules and procedures as related in the MPEP? (1) The examiner may properly make an enablement rejection before construing the claims. (2) The examiner has the initial burden to establish a reasonable basis to question the enablement provided for the claimed invention. (3) The examiner need not give reasons for the uncertainty of the enablement when there is no evidence of operability beyond the disclosed embodiments.',
    options: [
      'Statement (1) only',
      'Statement (2) only',
      'Statement (3) only',
      'Statements (1) and (2)',
      'Statements (1) and (3)',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct — only statement (2) is true. MPEP § 2164.04: the examiner has the initial burden to establish a reasonable basis to question the enablement provided (In re Wright, 999 F.2d 1557 (Fed. Cir. 1993)). Statement (1) is false — the examiner may not analyze enablement before construing the claims. Statement (3) is false — the minimal requirement is for the examiner to give reasons for the uncertainty of the enablement (In re Brana; In re Bowen, 492 F.2d 859 (CCPA 1974)).',
  },
  {
    id: 'uspto-oct03-am-33',
    topicId: 1,
    subtopic: 'Antecedent Basis — Inherent Components (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which of the following phrases taken from an independent claim has an antecedent basis problem according to the patent laws, rules and the procedures as related in the MPEP?',
    options: [
      '“the center of the circle having ...,” where the claim does not previously recite that the circle has a “center.”',
      '“the major diameter of the ellipse being ...,” where the claim does not previously recite that the ellipse has a “major diameter.”',
      '“the outer surface of the sphere being ...,” where the claim does not previously recite that the sphere has an “outer surface.”',
      '“the lever of the machine being located ...,” where the claim does not previously recite a “lever.”',
      '“the area of the rectangle being ...,” where the claim does not previously define an “area.”',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. MPEP § 2173.05(e): “Inherent components of elements recited have antecedent basis in the recitation of the components themselves” — e.g., “the outer surface of said sphere” needs no antecedent recitation. All circles have a center, ellipses a major diameter (Bose Corp. v. JBL, 61 USPQ2d 1216 (Fed. Cir. 2001)), spheres an outer surface, rectangles an area. A lever, however, is NOT an inherent component of a machine and requires express antecedent basis.',
  },
  {
    id: 'uspto-oct03-am-34',
    topicId: 2,
    subtopic: 'Late IDS After Allowance — § 1.97(e) Certification (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed a utility application on February 11, 2002. On April 4, 2002, the practitioner filed an information disclosure statement (IDS) in the application. The practitioner received a notice of allowance dated January 3, 2003 soon after it was mailed. When discussing the application with the practitioner on January 21, 2003, and before paying the issue fee, the client notices for the first time that a reference, which is one of many patents obtained by the client’s competitor, was inadvertently omitted from the IDS. The client has been aware of this reference since before the application was filed. The client is anxious to have this reference appear on the face of the patent as having been considered by the USPTO. Which of the following actions, if taken by the practitioner, would not be in accord with the patent law, rules and procedures as related by the MPEP?',
    options: [
      'Before paying the issue fee, timely file an IDS citing the reference, along with the certification specified in 37 CFR 1.97(e), and any necessary fees.',
      'Within three months of the mail date of the notice of allowance, without paying the issue fee, timely file a Request for Continued Examination (RCE) under 37 CFR 1.114, accompanied by the fee for filing an RCE, and an IDS citing the reference.',
      'Within three months of the mail date of the notice of allowance, without paying the issue fee, timely file a continuing application under 37 CFR 1.53(b), an IDS citing the reference, and any necessary fees.',
      'After paying the issue fee, timely file a petition to withdraw the application from issue to permit the express abandonment of the application in favor of a continuing application, a continuation application under 37 CFR 1.53(b), an IDS citing the reference, and any necessary fees.',
      'After paying the issue fee, timely file a petition to withdraw the application from issue to permit consideration of a Request for Continued Examination (RCE) under 37 CFR 1.114, the fee for filing an RCE, and an IDS citing the reference.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer (the non-compliant action). MPEP § 609: the 37 CFR § 1.97(e) statement requires certifying that no item in the IDS was known to any § 1.56(c) individual more than three months before the IDS filing — impossible here, since the client knew of the reference before the February 11, 2002 filing. (B)–(E) each state compliant routes: a proper RCE before issue-fee payment needs no withdrawal petition (37 CFR § 1.313(a)); a § 1.53(b) continuing application may be filed before the issue fee is due; and § 1.313(c)(2)/(3) petitions after payment permit an RCE or express abandonment in favor of a continuation.',
  },
  {
    id: 'uspto-oct03-am-35',
    topicId: 3,
    subtopic: 'Written Description vs New Matter — Proper Reply (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner files an amendment to the client’s claim which inserts language into the claim. The primary examiner improperly rejects the claim under 35 USC 112, first paragraph, description requirement. The examiner’s rejection states that the amendment inserted new matter which does not have descriptive support in the original specification. The examiner correctly points out that there is no literal support for the amendatory claim language in the original specification, but erroneously concludes that it constitutes new matter. Assume that there is support for the amendment in the original disclosure. In accordance with the patent laws, rules and procedures as related in the MPEP, a proper reply would include which of the following argument(s) to show the examiner is in error?',
    options: [
      'The original specification would enable one of ordinary skill in the art to practice the invention as now claimed.',
      'Literal support for new claim language is not required.',
      'The original specification reasonably conveys to one of ordinary skill in the art that the inventor had the claimed invention in his/her possession as of the filing date of the application.',
      'The new claim language is described in a related application filed by the inventor that is now a U.S. patent.',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — (B) and (C) together. MPEP § 2163.02: the fundamental written-description inquiry is whether the specification conveys with reasonable clarity that, as of the filing date, applicant was in possession of the invention as now claimed (Vas-Cath v. Mahurkar, 935 F.2d 1555 (Fed. Cir. 1991)); literal support is not required. (A) fails — written description is separate and distinct from enablement (MPEP § 2161). (D) fails — the related case must be one whose filing date the instant application is entitled to (MPEP § 2163.03).',
  },
  {
    id: 'uspto-oct03-am-36',
    topicId: 3,
    subtopic: 'RCE During Appeal — Withdrawal Effect (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed a patent application in the Office in 1999. Following examination and a final rejection, the practitioner timely filed a proper notice of appeal and a proper appeal brief in the application wherein claims 1-3 stand rejected, claims 4 and 5, which depend from claim 1, stand objected to as depending from a rejected claim but are otherwise allowable, and claims 6-10 stand allowed. The appeal involves claims 1-3. After the brief was filed but prior to a decision by the Board of Patent Appeals and Interferences, the practitioner filed a request for continued examination (RCE) with a submission in accordance with 37 CFR 1.114 without paying the fee set forth in 37 CFR 1.17(e). In accordance with the patent laws, rules and procedures as related in the MPEP, what effect does the filing of the RCE without the fee set forth in Rule 1.17(e) have on the application under appeal?',
    options: [
      'The application is abandoned.',
      'The application is still pending and under appeal awaiting a decision by the Board of Patent Appeals and Interferences, because the RCE was improper.',
      'The application is still pending; the appeal is considered withdrawn and the application will be passed to issue with claims 1-3 canceled and claims 4-10 allowed.',
      'The application is still pending; the appeal is considered withdrawn and the application will be passed to issue with claims 1-5 canceled and claims 6-10 allowed.',
      'The appeal is withdrawn; the application is returned to the primary examiner and prosecution is reopened as to claims 1-10.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP §§ 706.07(h), 1215.01: filing an RCE is treated as a withdrawal of the appeal REGARDLESS of whether it includes the fee or a submission. On withdrawal, claims allowable except for dependency from rejected claims are treated as rejected — so rejected claims 1-3 AND dependent claims 4-5 are canceled, and the application passes to issue with allowed claims 6-10. (A) fails — an application with allowed claims is not abandoned by an improper RCE.',
  },
  {
    id: 'uspto-oct03-am-37',
    topicId: 0,
    subtopic: 'Anticipation — Range Limitation Amendment (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Applicant filed an application containing a claim directed to a polishing wheel coated with diamond grit particles. The application discloses, but does not claim, a diamond grit particle size of 5-7 microns. The examiner rejected the claim under 35 USC 102(b) as being anticipated by a U.S. patent which disclosed as its invention a polishing wheel in accordance with the claim of the application but coated with glass grit particles instead of diamond grit particles. The applied patent, which issued more than 1 year prior to the effective filing date of the application, also disclosed that diamond grit particles were known for coating on polishing wheels but were inferior to glass grit particles because they were more expensive and did not adhere as well to the polishing wheel. The applied patent disclosed a grit particle size of 50-100 microns. Which of the following timely taken courses of action would comply with the patent laws, rules and procedures as related in the MPEP for overcoming the rejection?',
    options: [
      'Argue that the patent teaches away from the use of a diamond grit particle coating on a polishing wheel and thus does not teach the claimed invention.',
      'File a declaration under 37 CFR 1.132 showing unexpected results using diamond grit rather than glass grit.',
      'Antedate the applied patent by filing a declaration under 37 CFR 1.131 showing that applicant invented the claimed subject matter prior to the effective date of the applied patent.',
      'Argue the applied patent is nonanalogous art.',
      'Amend the claim by adding a limitation that the diamond grit particle size is 5-7 microns, and arguing that the claimed invention differs from applied patent by limited the diamond grit particle size to 5-7 microns.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. [Pre-AIA] MPEP §§ 2131, 2131.03: anticipation requires each and every claim element in a single reference; a claim limited to 5-7 micron grit is not anticipated by a reference disclosing 50-100 microns — well outside the claimed range. (A) fails — “teaches away” is inapplicable to anticipation, and patents are prior art for all they contain (MPEP § 2123). (B) fails — unexpected results are irrelevant to § 102 (MPEP § 2131.04). (C) fails — a § 1.131 declaration cannot antedate a § 102(b) statutory bar. (D) fails — nonanalogous-art arguments are not germane to § 102 (MPEP § 2131.05).',
  },
  {
    id: 'uspto-oct03-am-38',
    topicId: 3,
    subtopic: 'After Board Affirmance — Examiner Action (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Prosecution before the primary examiner results in the rejection of claim 1. Claim 2 was objected to as being allowable except for its dependency from claim 1. Independent claim 3 has been allowed. The rejection of claim 1 is properly appealed to the Board of Patent Appeals and Interferences. The Board properly affirms the rejection of claim 1. Appellant has filed no response to the decision of the Board, the appellant has taken no action, and the time for filing an appeal to the court or a civil action has expired. In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following actions is the most appropriate response by the examiner?',
    options: [
      'The examiner should hold the application abandoned.',
      'The examiner should cancel claim 1, convert dependent claim 2 into independent form by examiner’s amendment, and allow the application.',
      'The examiner should set a 1-month time limit in which appellant may rewrite the dependent claim in independent form.',
      'The examiner should cancel claims 1 and 2 and allow the application with claim 3 only.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.197(c); MPEP § 1214.06, “Claims Stand Allowed”: because claim 3 stands allowed, the examiner cancels rejected claim 1 and objected-to dependent claim 2, and the application passes to issue with claim 3 only. (A), (B) and (C) describe procedures that apply only when NO claims stand allowed — and even then the examiner is not authorized to convert an objected-to dependent claim to independent form or grant time to rewrite it when other claims stand allowed.',
  },
  {
    id: 'uspto-oct03-am-40',
    topicId: 0,
    subtopic: 'Transitional Phrases — Open vs Closed (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with patent laws, rules and procedures as related in the MPEP, which of the following transitional phrases exclude additional, unrecited elements or method steps from the scope of a claim?',
    options: [
      'Comprising;',
      'Containing;',
      'Characterized by;',
      'Including; or',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 2111.03: the transitional term “comprising,” which is synonymous with “including,” “containing,” or “characterized by,” is inclusive or open-ended and does not exclude additional, unrecited elements or method steps. All four listed phrases are open-ended; only closed transitions like “consisting of” exclude unrecited elements.',
  },
  {
    id: 'uspto-oct03-am-41',
    topicId: 1,
    subtopic: 'Multiple Dependent Claim Wording (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Assume that each claim 5 is in a different patent application. Recommend which, if any, of the following wording is in accord with the patent laws, rules and procedures as related in the MPEP for a multiple dependent claim.',
    options: [
      'Claim 5. A gadget according to claims 1-3, in which …',
      'Claim 5. A gadget as in claims 1, 2, 3, and/or 4, in which …',
      'Claim 5. A gadget as in claim 1 or 2, made by the process of claim 3 or 4, in which …',
      'Claim 5. A gadget as in either claim 6 or claim 8, in which …',
      'None of the above are proper multiple dependent claims.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 608.01(n), “Unacceptable Multiple Dependent Claim Wording”: a proper multiple dependent claim must depend on PRECEDING claims and refer to them in the ALTERNATIVE ONLY. (A) “claims 1-3” and (B) “and/or” do not refer back in the alternative only; (C) refers to two sets of claims to different features; (D) depends on subsequent claims 6 and 8.',
  },
  {
    id: 'uspto-oct03-am-42',
    topicId: 3,
    subtopic: 'Restriction Requirement — Petition vs Appeal (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed a first patent application wherein claims 1-10 claims are directed to a widget and claims 11-20 are directed to a method of making a widget. Following a proper restriction requirement, claims 1-10 were elected for prosecution. The primary examiner rejected claims 1-10. The practitioner filed a reply that only consisted of argument. The examiner was unpersuaded by the argument, and entered a final rejection of claims 1-10. In reply, the practitioner filed a continuing application containing claims 1-10 directed to a widget, and claims 11-20 directed to a method of using a widget. In the continuing application, the examiner enters a new written restriction requirement requiring a provisional election between claims 1-10 and claims 11-20. The practitioner believes the new restriction requirement is improper and would like the rejection in the parent application reviewed as well. The new restriction requirement has not been made final. Which of the following best describes whether and why, in accordance with the patent laws, rules, and procedures as related by the MPEP, the reply to the restriction requirement may be by appeal to the Board of Patent Appeals and Interferences?',
    options: [
      'Yes. An immediate appeal to the Board can be filed to review the restriction requirement if any claims have been twice rejected.',
      'No. An immediate appeal cannot be filed to the Board because the new claims directed to a method of using a widget have not been twice rejected.',
      'Yes. An immediate appeal can be filed for any claims that have been twice rejected because the Board can also review any second restriction requirement made against the same claims.',
      'No. An immediate appeal to the Board cannot be lodged because a provisional election has not been made of either the claims to a widget or claims to a method of use of the widget.',
      'No. An immediate appeal cannot be taken because no claims are currently under rejection. Review of a final restriction requirement is only possible as a petitionable matter before a Technology Center Director. It is not an appealable matter to the Board.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 1002.02(c): petitions from a final restriction requirement are decided by the Technology Center Directors (37 CFR § 1.144; MPEP § 818.03(c)) — restriction is petitionable, not appealable. Moreover, no claim in the continuing application is currently under rejection, and the restriction is not yet final, so no review is possible at this juncture. Appeal under 37 CFR § 1.191(a) lies only from claims twice or finally REJECTED (MPEP § 1205).',
  },
  {
    id: 'uspto-oct03-am-43',
    topicId: 1,
    subtopic: 'Dependent Claims — § 112 ¶ 4 Infringement Test (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, where the independent claim in an application is to an article of manufacture, then a dependent claim to the article of manufacture does not comply with 35 USC 112, fourth paragraph, if:',
    options: [
      'the further limitation changes the scope of the dependent claim from that of the claim from which it depends.',
      'the further limitation of the dependent claim is not significant.',
      'it does not refer back to and further limit the claim from which it depends.',
      'it relates to a separate invention.',
      'it is separately classified from the claim from which it depends.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the answer. 37 CFR § 1.75(c); MPEP § 608.01(n), “Infringement Test”: a proper dependent claim refers back to and further limits another claim, including every limitation of the claim from which it depends. The test is NOT whether the claims differ in scope (A), the significance of the limitation (B), or whether the dependent claim relates to a separate invention or classification (D)/(E) — those might at most trigger a restriction requirement.',
  },
  {
    id: 'uspto-oct03-am-44',
    topicId: 2,
    subtopic: 'Nonpublication Request — Foreign Filing Notice (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed in the USPTO a client’s utility patent application on December 30, 2002. The application was filed with a request for nonpublication, certifying that the invention disclosed in the U.S. application has not and will not be the subject of an application in another country, or under a multilateral international agreement, that requires eighteen month publication. Subsequently, the client files an application in Japan on the invention and some recent improvements to the invention. The improvements are not disclosed or supported in the utility application. Japan is a country that requires eighteen month publication. Two months after filing the application in Japan, and before filing any other papers in the USPTO, the client remembers that a nonpublication request was filed and informs the practitioner about the application that was filed in Japan. Which of the following courses of action is in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'The application is abandoned because the practitioner did not rescind the nonpublication request and provide notice of foreign filing within 45 days of having filed the application in Japan. The applicant must now file a petition and fee to revive under 37 CFR 1.137(b).',
      'The application is abandoned because the applicant did not rescind the nonpublication request before filing the application in Japan. The applicant must now file a petition and fee to revive under 37 CFR 1.137(b).',
      'The applicant should file an amendment to the specification of the U.S. application, adding the recent improvements to the disclosure in the specification.',
      'The application is abandoned because the applicant did not rescind the nonpublication request by notifying the Office under 37 CFR 1.213(c) within the appropriate time. The applicant must now file a petition and fee to revive under 37 CFR 1.137(b).',
      'The applicant could today notify the USPTO of the foreign filing. It is not necessary to file a petition and fee to revive for the application to continue to be examined in the USPTO.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 122(b)(2)(B)(iii); 37 CFR §§ 1.213, 1.137(f); MPEP § 711.03(c): after a nonpublication request, notice of foreign filing must be provided within 45 days of the foreign filing or the application becomes abandoned — two months have passed, so a petition to revive under § 1.137(b) is required. (B) fails — the notice may be filed as late as 45 days after foreign filing. (C) fails — the improvements would be new matter (MPEP § 608.04(a)). (D) fails — the applicant must provide NOTICE of foreign filing, not merely rescind. (E) fails — the 45-day window has passed.',
  },
  {
    id: 'uspto-oct03-am-45',
    topicId: 0,
    subtopic: 'Abandoned Applications as Prior Art (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with patent laws, rules and procedures as related in the MPEP, an abandoned U.S. patent application:',
    options: [
      'is never available as evidence of prior art.',
      'may become prior art only when it is properly incorporated by reference in the disclosure of a U.S. patent.',
      'may become prior art as of its filing date, but only if it is properly incorporated by reference in the disclosure of a U.S. patent.',
      'may become evidence of prior art as of its filing date, but only if it is properly incorporated by reference in the disclosure of a U.S. patent or U.S. application publication.',
      'may become prior art when it is properly incorporated by reference in the disclosure of a U.S. application publication.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. [Pre-AIA] MPEP § 2127, “Abandoned Applications Disclosed to the Public Can Be Used as Prior Art”: the subject matter of an abandoned application referred to in a prior art U.S. patent may be relied on in a § 102(e) rejection if actually included or incorporated by reference (compare In re Lund, 376 F.2d 982 (CCPA 1967)). (A) fails — abandoned applications MAY become evidence of prior art. (B), (C) and (D) fail for using “only,” and (C)/(D) also fail on “as of its filing date” — an abandoned application becomes available only as of the date the public gains access (37 CFR § 1.14).',
  },
  {
    id: 'uspto-oct03-am-46',
    topicId: 0,
    subtopic: 'What Is NOT a Printed Publication (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent law, rules and procedures as related by the MPEP, which of the following is not a “printed publication” under 35 USC 102(b), with respect to a patent application filed June 1, 2002?',
    options: [
      'A paper that was orally presented at a meeting held May 1, 2001, where the meeting was open to all interested persons and the paper was distributed in written form to six people without restriction.',
      'A doctoral thesis that was indexed, cataloged, and shelved May 1, 2001, in a single, university library.',
      'A research report distributed May 1, 2001, in numerous copies but only internally within an organization to persons who understood the organization’s unwritten policy of confidentiality regarding such reports.',
      'A reference available only in electronic form on the Internet, which states that it was publicly posted May 1, 2001.',
      'A technical manual that was shelved and cataloged in a public library as of May 1, 2001, where there is no evidence that anyone ever actually looked at the manual.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. [Pre-AIA § 102(b) framing] MPEP § 2128.01, citing In re George: research reports disseminated in-house only to persons who understood the policy of confidentiality are not printed publications, even where the policy was unwritten. (A) fails — an orally presented paper with unrestricted written copies IS a printed publication; (B) fails — an indexed, cataloged, shelved thesis IS (In re Hall); (D) fails — an Internet posting is publicly available as of its posting date (MPEP § 2128); (E) fails — no proof that anyone actually looked at a shelved, cataloged document is required.',
  },
  {
    id: 'uspto-oct03-am-47',
    topicId: 0,
    subtopic: 'Claim Interpretation — Incorrect Statement (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following statements regarding claim interpretation during patent prosecution is incorrect?',
    options: [
      'A claim is to be given its broadest reasonable interpretation in light of the supporting disclosure in the specification.',
      'Because a claim is read in light of the specification, the claim may properly be narrowed by interpreting it as including elements or steps disclosed in the specification but not recited in the claim.',
      'If an applicant does not define a claim term in the specification, that term is given its ordinary meaning in the art.',
      'When an explicit definition of a claim term is provided in an applicant’s specification, that definition controls the interpretation of the term as it is used in the claims.',
      'Means plus function language in claims which defines the characteristics of a machine or manufacture includes only the corresponding structures or materials disclosed in the specification and equivalents thereof.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most proper answer (the incorrect statement). MPEP § 2111, citing In re Prater, 415 F.2d 1393 (CCPA 1969): “reading a claim in light of the specification” to interpret limitations explicitly recited is a quite different thing from “reading limitations of the specification into a claim” to narrow its scope by implicitly adding disclosed limitations with no express basis in the claim — the latter is improper. (A), (C), (D) and (E) each correctly state the law (MPEP §§ 2111, 2111.01; In re Marosi; In re Donaldson).',
  },
  {
    id: 'uspto-oct03-am-48',
    topicId: 0,
    subtopic: 'On-Sale Bar — Sale of Rights vs Sale of Invention (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Buddy is a recent father and a machinist at a local machine shop. One day while driving to work, Buddy conceived an idea for an improved baby stroller. He quickly worked out many of the details of how to build such an improved stroller, but he still had questions. Buddy later explained his idea to his employer and showed the employer detailed preliminary drawings of the stroller without any agreement as to confidentiality. Buddy wanted use of his employer’s machine shop to build a model. Buddy’s employer was also excited about the stroller idea and its commercial potential, and the two quickly reached an oral agreement. Buddy would have free use of the machine shop equipment and supplies after regular business hours to work on his model. In exchange, Buddy agreed to assign any patent rights in his invention to the employer for $1,000.00. Only Buddy and, occasionally, his employer were ever present in the shop when Buddy was working on the stroller. Buddy finalized the design just over a year later, and a nonprovisional patent application was on file within a month of finalization along with a recently executed written assignment of the rights in the invention to Buddy’s employer. During prosecution of the patent application, the examiner learned of the oral agreement between Buddy and his employer, and rejected the claims on the basis that the invention was on sale more than one year before the application filing date. Determine which of the following would provide the most reasonable basis for traversing the rejection in accordance with the patent laws, rules and procedures as related in the MPEP.',
    options: [
      'The examiner cannot properly make the rejection because it is not based on prior art patents or printed publications.',
      'The oral agreement was a private transaction between Buddy and his employer and no private transaction can provide a basis for an on-sale bar.',
      'An assignment or sale of the rights in an invention and potential patent rights is not a sale of “the invention” that would operate as a bar to patentability under 35 USC 102(b).',
      'There can be no on-sale bar even though there was no express requirement of confidentiality because no one other than Buddy’s employer was present in the shop when Buddy was working on the stroller and the oral agreement was not public.',
      'Although the oral agreement to assign the patent to Buddy’s employer was made more than a year before the filing date, the written assignment was less than a year before the filing date, and under the Statute of Frauds, sales for more than $500.00 require a written agreement. A rejection based on the on-sale bar can never be made unless there is an actual sale.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. [Pre-AIA] 35 U.S.C. § 102(b); MPEP § 2133.03(b): “an assignment or sale of the rights, such as patent rights, in the invention is not a sale of ‘the invention’ within the meaning of section 102(b)” — the sale must involve delivery of the physical invention itself (Moleculon Research v. CBS, 793 F.2d 1261 (Fed. Cir. 1986)). (A) fails — original prosecution is not limited to patents/printed publications. (B)/(D) fail — on-sale activity need not be public. (E) fails — an OFFER to sell suffices; no actual sale is required.',
  },
  {
    id: 'uspto-oct03-am-49',
    topicId: 0,
    subtopic: 'Indefiniteness — Open-Ended Ranges (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Inventor files an application for a non-theoretical metal alloy. The application as originally filed contains the following Claim 1: “1. A metal alloy comprising at least 20% by volume of iron; at least 10% by volume of gallium, and at least 10% by volume of copper.” In accordance with the patent law, rules and procedures as related by the MPEP, which of the following claims would be properly held indefinite under 35 USC 112(2)?',
    options: [
      'Claim 2: The alloy of claim 1 containing 66% by volume of gallium and 14% by volume of copper.',
      'Claim 2: The alloy of claim 1 containing at least 21% by volume of iron, 11% by volume of gallium, and 10.01% by volume of copper.',
      'Claim 2: The alloy of claim 1 containing 20% by volume of iron, 10% by volume of gallium, and 10% by volume of copper.',
      'Claim 2: The alloy of claim 1 containing 54% by volume of copper and 27% by volume of gallium.',
      'Claim 2: The alloy of claim 1 containing at least 1% by volume of silver.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 2173.05(c), “Open-Ended Numerical Ranges”: for a non-theoretical alloy the constituents cannot exceed 100% by volume. In (D), copper (54%) plus gallium (27%) equals 81%, leaving only 19% for iron — but claim 1 requires “at least 20% iron,” creating an ambiguity. (A) leaves exactly 20% for iron (consistent); (B) and (C) fall within all “at least” limits; (E) is fine because “comprising” permits additional elements such as silver.',
  },
  {
    id: 'uspto-oct03-am-50',
    topicId: 2,
    subtopic: 'Claim Counting for Fees — Multiple Dependent Claims (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Ben hires a registered practitioner to prosecute his patent application. The practitioner drafted an application having fifteen claims. Claim 1 is independent, and each of claims 2-15 are singularly dependent upon claim 1. A proper non-final Office action is mailed to the practitioner. Following consultation with Ben, the practitioner timely prepared, signed, and filed a reply to the Office action containing an amendment that does not add new matter, but does add claims 16-27. Each of claims 16-27 is directed to the same invention sought to be patented through claims 1-15. The dependency of each of claims 16-27 reads “any of claims 5-15.” For purposes of fee calculation in accordance with the patent laws, rules and procedures as related in the MPEP, how many total claims are contained in the application after the amendment is entered?',
    options: [
      'One hundred thirty-six.',
      'One hundred thirty-five.',
      'Twenty-seven.',
      'One hundred forty-seven.',
      'Fifteen.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.75(c); MPEP § 608.01(n): for fee calculation, a multiple dependent claim counts as the number of claims to which direct reference is made. Claims 16-27 each refer to “any of claims 5-15” — eleven claims — so the twelve new claims count as 12 × 11 = 132, plus the original 15, for a total of one hundred forty-seven.',
  },
];

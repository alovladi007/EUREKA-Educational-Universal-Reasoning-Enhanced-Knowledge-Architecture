/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, October 15, 2003 — Afternoon Session
 * (Test Number 456, Series 203), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (15oct03pq.pdf / 15oct03pa.pdf,
 * via the Internet Archive copy of uspto.gov). US Government works — public
 * domain.
 *
 * Provenance and integrity rules (same as the AM file,
 * patent-bar-uspto-oct2003-data.ts):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers; `explanation`
 *    is the official model answer, abridged, retaining the controlling
 *    citation.
 *  - Question 9 was officially discarded ("CREDIT GIVEN FOR ALL ANSWERS")
 *    and is excluded.
 *  - Question 23 is excluded because the USPTO's model answer accepts TWO
 *    keys ("(A) or (D) is accepted as correct"); this bank's single-key
 *    grading cannot represent dual credit without mis-grading one of the
 *    officially-correct choices.
 *  - ERA NOTE: this exam predates the AIA. Questions that turn on pre-AIA
 *    35 U.S.C. 102 timing rules carry an explicit [Pre-AIA] tag in the
 *    explanation. Verified status: OFFICIAL (USPTO model answers).
 *
 * Ingested: PM session Q1–Q8, Q10–Q22, Q24–Q50 (48 of 49 scoreable; Q23
 * excluded — dual-keyed, see above).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2003_PM_SOURCE =
  'USPTO Registration Examination, October 15, 2003 — Afternoon Session (official model answers; public domain)';

export const USPTO_OCT2003_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct03-pm-01',
    topicId: 2,
    subtopic: 'Filing Date Requirements § 1.53(b) (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, for a nonprovisional application to receive a filing date in the USPTO under 37 CFR 1.53(b), all of the following must be filed except:',
    options: [
      'The basic filing fee required by 37 CFR 1.16(a).',
      'A specification as prescribed by the first paragraph of 35 USC 112.',
      'A description pursuant to 37 CFR 1.71.',
      'At least one claim pursuant to 37 CFR 1.75.',
      'Any drawing required by 37 CFR 1.81(a).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 111; 37 CFR § 1.53; MPEP § 601.01(a): the filing fee for an application filed under 37 CFR § 1.53(b) can be submitted AFTER the filing date. A filing date requires the specification with a description (§ 1.71), at least one claim (§ 1.75), and any drawing required by § 1.81(a) — so (B)–(E) are all needed.',
  },
  {
    id: 'uspto-oct03-pm-02',
    topicId: 5,
    subtopic: 'Broadening Reissue — Amendment Within Two Years (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A U.S. patent was granted on May 8, 2001. The sole independent claim in the patent is directed to a combination of elements ABCD. A registered practitioner filed a reissue application on April 11, 2003 to narrow sole independent claim. In the reissue application, the independent claim is amended to a combination to elements ABCDE. The reissue application is accompanied by a transmittal letter stating that the application was filed to narrow a claim, that all inventors could not be located to sign the reissue oath or declaration at that time, and that a declaration would be submitted in due course. No other amendments to the claims were filed on April 11, 2003. On May 8, 2003, a declaration signed by all inventors is filed declaring that they had claimed less than they had a right to claim, and that the error arose without deceptive intent. The inventors also filed on May 8, 2003 a preliminary amendment deleting element A from the sole independent claim leaving elements BCDE. The amendment and declaration are filed using the provisions of 37 CFR 1.10. The practitioner included an authorization to charge the practitioner’s deposit account for any necessary fees. Which of the following actions by the primary the examiner in the first Office action is in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Reject all the claims based upon a broadening reissue outside the two year statutory period authorized by 35 USC 251 since applicant did not file a broadened reissue claim at the time of filing.',
      'Reject all the claims based upon a broadening reissue outside the two year statutory period authorized by 35 USC 251 since applicant did not file a claim to a broadened reissue claim within the two year period set by 35 USC 251.',
      'Reject all the claims based upon a broadening reissue outside the two year statutory period authorized by 35 USC 251 since applicant’s indication in the transmittal letter indicated that the filing of the reissue application was a narrowing reissue and that the broadening amendment was not permissible even if filed within the two-years from the grant of the original patent.',
      'Determine that the application is a proper broadening reissue and perform an examination and issue an Office action in due course.',
      'Determine that the application is a proper broadening reissue and reject the claims under the recapture doctrine since the claims are broader than the issued claims.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP §§ 1403, 1412.03 (“When A Broadened Claim Can Be Presented”): a broadening reissue claim must be filed within two years from the grant of the original patent — here the Express Mail (37 CFR § 1.10) amendment deleting element A was deposited May 8, 2003, within two years of the May 8, 2001 grant (cf. Switzer v. Sockman, 333 F.2d 935 (CCPA 1964)). A reissue application may receive a filing date without the oath/declaration or fee (37 CFR § 1.53(f); MPEP § 1410.01). (E) fails — mere deletion of an element does not automatically raise recapture (MPEP § 1412.02).',
  },
  {
    id: 'uspto-oct03-pm-03',
    topicId: 0,
    subtopic: 'Product-by-Process — Shifted Burden (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] An applicant submits a product-by-process claim to a shoe made by a series of specific process steps. The claim is rejected over a publication under 35 USC 102(b) and 103. Assume for this question that the publication reasonably appears to show the identical shoe, but describes a different method of making the shoe. What is the proper procedure to try to overcome the rejection in accordance with the patent laws, rules and the procedures as related in the MPEP?',
    options: [
      'Argue that all limitations in the claim must be given weight and that rejection must be withdrawn because the reference does not disclose the claimed method of making steps.',
      'Argue that the examiner has not carried the burden of proving that the shoes are identical.',
      'Present evidence why the steps of the claimed process produce a patentably different structure.',
      'Submit a declaration under 37 CFR 1.132 by the author of the publication describing in more detail how the shoe in the publication was made by a different method.',
      'Argue that the inventor was not aware of the publication when the invention was made.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. MPEP § 2113: once the examiner provides a rationale tending to show the claimed product appears the same as the prior art product, although produced by a different process, the burden shifts to applicant to come forward with evidence establishing an unobvious difference (In re Marosi, 710 F.2d 798 (Fed. Cir. 1983)). (A) fails — product-by-process patentability is based on the product itself (In re Thorpe, 227 USPQ 964 (Fed. Cir. 1985)). (D) does not tend to show the products differ; (E) — the inventor’s awareness of prior art is of no consequence to patentability.',
  },
  {
    id: 'uspto-oct03-pm-04',
    topicId: 4,
    subtopic: 'PCT — Designations Cannot Be Added by Fax (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner files an international application submission that includes a description, claims and drawings in the United States Receiving Office (RO/US) on Wednesday, January 8, 2003. The submission did not include the required request, international and search fees, or the designation of a PCT contracting State. The RO/US mails an “Invitation to Correct the Purported International Application,” dated January 10, 2003, to the practitioner indicating that the designation of at least one Contracting State, as required by PCT Article 11(1)(iii)(b), was not included. A one-month period for response is set in the Invitation. On Monday, February 10, 2003, the practitioner submits by facsimile a designation sheet of the Request Form designating every available Contracting State, and authorization to charge all required fees. In accordance with the patent laws, rules and procedures as related in the MPEP, will the application be accorded an international filing date?',
    options: [
      'Yes. The application will be accorded a filing date of January 8, 2003.',
      'Yes. The application will be accorded an international filing date of February 10, 2003.',
      'No. The application will not be accorded an international filing date because the failure to designate at least one contracting State cannot be cured by a facsimile transmission.',
      'No. The application was given a one-month period for response. The practitioner would have had to have filed the response on Friday, February 7, 2003 in order to have been timely.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR §§ 1.6(d)(3), 1.8(a)(2)(i)(D); MPEP §§ 502, 512, 1817.01: the failure to designate at least one Contracting State (PCT Article 11(1)(iii)(b)) cannot be cured by facsimile — fax filing is not permitted for such papers. (D) fails — under PCT Rule 80.5, when a response falls due on a day the receiving Office is closed, applicant has until the next business day (February 10, 2003, a Monday, would have been timely by a permitted method).',
  },
  {
    id: 'uspto-oct03-pm-05',
    topicId: 0,
    subtopic: 'Written Description — What Does NOT Show Possession (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, satisfaction of the written description requirement may not be demonstrated by:',
    options: [
      'including in the specification a description of an actual reduction to practice.',
      'describing the claimed invention with all of its limitations using such descriptive means as words, structures, figures, diagrams, and formulas that fully set forth the claimed invention.',
      'describing during prosecution of a new or amended claim an element or limitation (omitted from the original disclosure in the specification) as an essential or critical feature of the invention.',
      'including in the specification a description of distinguishing identifying characteristics sufficient to show that the applicant was in possession of the claimed invention at the time of filing.',
      'including in the patent application disclosure of drawings or structural chemical formulas showing that the invention is complete.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2163, “New or Amended Claims”: a claim that omits an element which applicant describes as an essential or critical feature of the originally disclosed invention does not comply with the written description requirement (Gentry Gallery, 134 F.3d 1473; In re Sus, 306 F.2d 494 (CCPA 1962)) — describing an omitted element as essential during prosecution demonstrates FAILURE, not satisfaction. (A), (B), (D) and (E) each list a proper way to show possession (MPEP § 2163.02; Vas-Cath v. Mahurkar; Pfaff v. Wells Electronics, 525 U.S. 55 (1998)).',
  },
  {
    id: 'uspto-oct03-pm-06',
    topicId: 7,
    subtopic: 'Duty to Disclose — Prophetic Examples (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Inventor Tip, a scientist in a pencil research laboratory, theorized that, based on the abrasive properties of moon dust, a highly efficient erasure can be made by adding a trace amount of moon dust to a normal pencil erasure formulation. Point, in the Sales department, determined that this would be perfect for a high end product. A U.S. patent application has been filed claiming a pencil erasure formulation with a trace amount of moon dust. An example of how to make the formulation with specified percentages of moon dust is presented therein. Thereafter, Tip learns about the duty to disclose information and he recalls signing a declaration under 37 CFR 1.63 stating that he had reviewed and understood the contents of the specification including the claims. Tip becomes concerned that the use of moon dust was only a theory and that to obtain patent would mislead the public to conclude that moon dust was actually used and found to be effective. The application has been allowed, but the issue fee has not yet been paid. Which of the following is most in accord with patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Point is under a duty to disclose material information to the USPTO.',
      'Tip is under a duty to disclose his concern regarding the moon rock information to the USPTO.',
      'Both Point and Tip are under a duty to disclose material information to the UPSTO.',
      'There is no duty to disclose information regarding how the moon rock formulation was developed to the USPTO.',
      'Inasmuch as the application is allowed, an appropriate Request for Continued Prosecution pursuant to 37 CFR 1.114 needs to be filed accompanied by a information disclosure regarding the possibility of rejections under 35 USC 101, and 112, first paragraph.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.56; MPEP §§ 2001.05, 608.01(p): information is not material unless it falls within § 1.56(b)(1)/(2), and simulated or predicted test results and prophetic (paper) examples are PERMITTED in patent applications — that moon dust use was only theorized is not material, provided no prophetic example is presented as actual results (MPEP § 2004, item 8). (A)/(C) also fail because Point (Sales) is not a § 1.56(c) individual; (B) fails because there is no material information to disclose.',
  },
  {
    id: 'uspto-oct03-pm-07',
    topicId: 0,
    subtopic: 'Inherency — Unrecognized Property Still Anticipates (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] The claimed invention in a patent application is directed to an explosive composition “comprising 60-90% solid ammonium nitrate, and 10-40% water-in-oil in which sufficient aeration is entrapped to enhance sensitivity to a substantial degree.” The application discloses that the explosive requires both fuel (the ammonium nitrate), and oxygen to “sensitize the composition.” A prior art reference, published more than two years before the effective filing date of the application, discloses explosive compositions containing water-in-oil emulsions having identical ingredients to those claimed, in ranges overlapping with the claimed composition. The only element of the claim not recited in the reference is “sufficient aeration entrapped to enhance sensitivity to a substantial degree.” The reference does not recognize that sufficient aeration sensitizes the fuel to a substantial degree. In addition to the prior art reference, a printed publication contains test data demonstrating that “sufficient aeration” is necessarily an inherent element in the prior art blasting composition under the circumstances. In accordance with the patent laws, rules and the procedures as related in the MPEP, the prior art reference:',
    options: [
      'anticipates the claim because it discloses every limitation of the claim either explicitly or inherently.',
      'does not anticipate the claim because the prior art reference does not recognize an inherent property.',
      'does not anticipate the claim because the prior art reference does not recognize an inherent function of oxygen.',
      'does not anticipate the claim because the prior art reference does not recognize an inherent ingredient, oxygen.',
      '(B), (C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the best answer. MPEP § 2131.01: extra evidence can show an inherent characteristic of the thing taught by the primary reference — as long as evidence of record establishes inherency, failure of those skilled in the art to contemporaneously recognize an inherent property does not preclude anticipation (Atlas Powder Co. v. IRECO, 190 F.3d 1342 (Fed. Cir. 1999), on materially identical facts). (B), (C), (D) all wrongly demand recognition of the inherent feature.',
  },
  {
    id: 'uspto-oct03-pm-08',
    topicId: 0,
    subtopic: 'Reasonable Diligence Under 102(g) (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] With respect to establishing “reasonable diligence” for under 35 USC 102(g), which of the following statements is or are in accordance with the patent laws, rules and procedures as related in the MPEP? (1) The inventor and his attorney must drop all other work and concentrate on the particular invention involved. (2) The entire period during which diligence is required must be accounted for by either affirmative acts or acceptable excuses. (3) Work relied upon to show reasonable diligence must be directly related to the reduction to practice.',
    options: [
      'Statement (1) only',
      'Statement (2) only',
      'Statement (3) only',
      'Statements (1) and (3)',
      'Statements (2) and (3)',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct — statements (2) and (3) are true. [Pre-AIA] MPEP § 2138.06: the entire period during which diligence is required must be accounted for by affirmative acts or acceptable excuses (Gould v. Schawlow, 363 F.2d 908 (CCPA 1966)), and the work relied upon must be directly related to the reduction to practice (Naber v. Cricchi, 567 F.2d 382 (CCPA 1977)). Statement (1) is false — the inventor and attorney need not drop all other work (Emery v. Ronden, 188 USPQ 264).',
  },
  {
    id: 'uspto-oct03-pm-10',
    topicId: 2,
    subtopic: 'Third-Party Submissions § 1.99 (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following can a third party submit in a pending published application within two months from the publication date where the submission identifies the application to which it is directed by application number and includes the appropriate fee?',
    options: [
      'A list referencing a videotape and copy of the tape showing that the process claimed in the application was in use more than one year before the filing date of the application.',
      'A U.S. patent issued more than one year before the filing date of the application and a written explanation of the patent made by the third party on the patent.',
      'A publication with a publication date more than one year before the filing date of the application and including underlining made by the third party on the publication.',
      'A protest raising fraud and inequitable conduct issues.',
      'A list of the sole Japanese language publication submitted for consideration, including the publication date of the publication, a copy of the Japanese language publication and a written English language translation of the pertinent parts of the publication.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 CFR § 1.99; MPEP § 610: a third party may submit in a published application patents or publications — including a foreign-language publication with an English translation of the pertinent portions — with a list, copies, and the fee. (A) fails — § 1.99 does not authorize things other than patents/publications (no videotapes). (B)/(C) fail — the submission may not include explanations, markings or highlights (§ 1.99(d)). (D) fails — a protest cannot be filed in a published application (37 CFR § 1.291(a)(1); MPEP § 1901.06).',
  },
  {
    id: 'uspto-oct03-pm-11',
    topicId: 5,
    subtopic: 'Broadening Reissue — Unavailable Inventors (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A U.S. patent was granted on May 8, 2001 to five inventors. The five inventors assigned their entire patent rights to Q Company. Q Company needs to file a reissue application to broaden the claims of the patent. The registered practitioner preparing the application has been unable to locate any of the five inventors to sign the reissue oath or declaration. Today is May 8, 2003. Which of the following should the practitioner do to enable the applicant to broaden the patent claims in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Wait to file the reissue application until the first day the signatures of all five inventors can be obtained. At that time, pay the filing fee and file a petition seeking May 8, 2003 as the filing date. File with the petition a showing of the unavailability of all inventors until the filing of the application.',
      'Wait to file the reissue application until the signatures of at least three inventors can be obtained. At that time, file a petition seeking May 7, 2003 as the filing date accompanied by a showing of the unavailability of all inventors on May 8th. Payment of the filing fees may be postponed until receipt of a decision on the petition.',
      'File the reissue application on May 8, 2003, presenting only the claims in the patent, and include a listing of inventors, but not pay the filing fee at the time of filing.',
      'Wait to file the reissue application until the signature of one of the inventors has been obtained since at least one inventor is needed to show a lack of deceptive intent on the part of the applicants.',
      'File the complete reissue application complying with 37 CFR 1.173(a) and 1.53(b) with an unexecuted reissue declaration listing the names of all the inventors with at least one broadening claim on May 8, 2003.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 35 U.S.C. § 251; 37 CFR § 1.53(f); MPEP § 1403: filing a broadened reissue application with at least one broadening claim before the two-year statutory deadline satisfies the diligence provision; the executed reissue oath/declaration and filing fee may be supplied later, with a surcharge period (MPEP § 1410.01). (A), (B) and (D) fail — waiting past the two-year date bars broadening; (C) fails because no broadening claim would be presented within the two-year period.',
  },
  {
    id: 'uspto-oct03-pm-12',
    topicId: 0,
    subtopic: '§ 101 Safe Harbors — Computer Processes (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which of the following is patentable subject matter under 35 USC 101 in accordance with the patent laws, rules, and procedures as set forth in the MPEP?',
    options: [
      'A claim to a new mineral discovered in the earth or a new plant found in the wild.',
      'A claim to a method of using a computer to select a set of arbitrary measurement point values. (The selected values are not to be transformed outside of the computer into computer data).',
      'A claim to a method of controlling a mechanical robot which relies upon storing data in a computer that represents various types of mechanical movements of the robot.',
      'A claim to a method of updating alarm limits by changing the number value of a variable to represent the result of the calculation.',
      'A claim to a data structure per se. (The claim does not specify any location where the data structure is stored).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2106 (era guidance), “Safe Harbors — Independent Physical Acts (Post-Computer Process Activity)”: a method of controlling a mechanical robot relying on stored data representing mechanical movements is a statutory process. (A) — a new mineral or wild plant is unpatentable (MPEP § 2105); (B) — selecting arbitrary measurement values falls outside the safe harbors (In re Sarkar); (D) — updating alarm limits is Parker v. Flook, 437 U.S. 584 (1978); (E) — a data structure per se is nonstatutory (In re Warmerdam). [Note: § 101 doctrine has since evolved (Bilski/Alice), but this remains the official key for this exam.]',
  },
  {
    id: 'uspto-oct03-pm-13',
    topicId: 0,
    subtopic: 'Product-by-Process — Best Rebuttal Evidence (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] On January 2, 2001, a registered practitioner filed a patent application with the USPTO for inventor Beck. The application includes a specification and a single claim to the invention which reads as follows: “1. Mixture Y made by the process Q1.” In the specification, Mr. Beck discloses that mixture Y has a melting point of 150° F. On June 2, 2001, the practitioner received an Office action from the primary examiner rejecting the claim. The claim is rejected under 35 USC 102/103 as being clearly anticipated by or obvious over Patent A. The examiner states “Patent A teaches mixture Y but made by a different process Q2.” Beck believes he is entitled to a patent to mixture Y. In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following would be the best reply to the rejection of his claim?',
    options: [
      'An argument that the claimed product has an unexpectedly low melting point of 150° F, supported by an affidavit showing that the mixture Y made by process Q2 exhibits a melting point of 300° F.',
      'An argument that the processes used by applicant and patent A are different, supported by a third-party declaration stating only that the processes are different.',
      'An argument that the claimed product has an unexpectedly low melting point of 150° F, supported by a third-party declaration stating only that the products are different.',
      'An argument that the processes used by applicant and patent A are different, supported by an affidavit showing that the mixture Y made by process Q2 exhibits a melting point of 300° F.',
      'An argument that the claimed product has an unexpectedly low melting point of 150° F because the claimed mixture Y has a melting point of 150° F and the mixture Y of patent A has a melting point of 300° F.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2113: product-by-process patentability is based on the product itself (In re Thorpe), and once the products appear substantially identical the burden shifts to applicant (In re Marosi). Comparative FACTUAL evidence that the claimed process yields a product with an unexpectedly lower melting point than the patent A process is a persuasive demonstration of a patentable difference (Ex parte Gray, 10 USPQ2d 1922). (B)/(D) argue process differences — not determinative; (C) is conclusory opinion evidence (MPEP § 716.02(c)); (E) lacks the comparative factual support.',
  },
  {
    id: 'uspto-oct03-pm-14',
    topicId: 0,
    subtopic: '102(e) Date — Chain to Provisional (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Inventor Jones files an application under 35 USC 111(a) on March 27, 2002. The application is a continuation of an international application, which was filed on December 1, 2000. The international application claims priority to a U.S. provisional application filed December 2, 1999. The international application designated the United States, and was published in English under PCT Article 21(2). All applications contained the exact same disclosure. In accordance with the patent laws, rules and procedures as related in the MPEP, what, if any, is the earliest prior art date under 35 USC 102(e) for the publication of the 35 U.S.C. 111(a) application under 35 USC 122(b)?',
    options: [
      'None, the publication has no prior art date under 35 U.S.C. 102(e)',
      'March 27, 2002',
      'December 11, 2001',
      'December 1, 2000',
      'December 2, 1999',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. [Pre-AIA] MPEP § 706.02(f)(1) (Example 7): the § 122(b) publication takes a § 102(e) prior art date from its benefit/priority chain — through the international application (filed on/after November 29, 2000, designating the US, published in English) back to the December 2, 1999 provisional. (B)/(D) are later than the earliest available date; (C) is not a filing date of any application in the chain.',
  },
  {
    id: 'uspto-oct03-pm-15',
    topicId: 4,
    subtopic: 'National Stage — No Fax Entry (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Applicant filed an international patent application under the Patent Cooperation Treaty (PCT) designating the United States. A copy of the international application has not been submitted to the USPTO by the International Bureau. The deadline for entering the national stage under 35 USC 371(c) was August 15, 2002. Applicant submitted all of the national stage items required by 35 USC 371(c) by facsimile transmission on August 15, 2002. The facsimile transmission was successfully received by the USPTO on August 15, 2002. The submission included an authorization to charge any required fees to the valid deposit account of the registered practitioner representing applicant. The account contained sufficient funds. Assuming that applicant has made no other national stage submissions under 35 USC 371(c), which of the following statements is most correctly describes why the national stage submission in accordance with the patent laws, rules and the procedures as related in the MPEP is proper or improper?',
    options: [
      'The national stage submission was proper because facsimile transmission is a valid method of correspondence in the USPTO.',
      'The national stage submission was proper because a copy of an originally executed oath or declaration is acceptable, but the original oath or declaration should be retained as evidence of authenticity.',
      'The national stage submission was improper because a copy of the international application and the basic national fee necessary to enter the national stage as required by 35 USC 371(c) may not be submitted by facsimile transmission.',
      'The national stage submission was improper because the USPTO does not accept fee payments via facsimile transmission.',
      'The national stage submission was improper because facsimile transmission may never be used for PCT applications.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 CFR §§ 1.6(d)(3), 1.8(a)(2)(i)(F), 1.495(b); MPEP § 1893.01(a)(1): the copy of the international application and the basic national fee required to enter the national stage may NOT be transmitted by facsimile. (D) overstates — the USPTO does accept some fee payments by fax; (E) overstates — fax may be used for certain PCT correspondence (MPEP § 1805).',
  },
  {
    id: 'uspto-oct03-pm-16',
    topicId: 0,
    subtopic: 'Obviousness — Invention As A Whole (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which of the following statements is or are in accord with the patent laws, rules and procedures as related in the MPEP? (1) In a 35 USC 103 obviousness analysis, the proper question is whether the differences between the prior art and the claims would have been obvious to one of ordinary skill in the art. (2) In a 35 USC 103 obviousness analysis, an inventor’s assertion the he has discovered the source or cause of an identified problem should never be considered. (3) A 35 USC 103 obviousness analysis requires consideration not just of what is literally recited in the claims, but also of any properties inherent in the claimed subject matter that are disclosed in the specification.',
    options: [
      'Statement 1',
      'Statement 2',
      'Statement 3',
      'Statements 1 & 2',
      'Statements 1 & 3',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2141.02, “Disclosed Inherent Properties Are Part Of ‘As A Whole’ Inquiry” (In re Antonie, 559 F.2d 618 (CCPA 1977)): statement (3) is correct. Statement (1) is wrong — the proper question is whether the invention AS A WHOLE, not just the differences, would have been obvious (Stratoflex v. Aeroquip). Statement (2) is wrong — an inventor’s discovery of the source of a problem is part of the subject matter as a whole (In re Sponnoble).',
  },
  {
    id: 'uspto-oct03-pm-17',
    topicId: 0,
    subtopic: 'Which Reference Qualifies Under 102(e) (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A patent application was filed on November 1, 2000 for the invention of J.J. Smithy. The application has no priority or benefit claims to any other application. Claims in the application are separately rejected under 35 USC 102 as being anticipated by each of the following references. Which reference can be properly applied under 35 U.S.C. 102(e) in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'A WIPO publication of an international application under PCT Article 21(2), which has an international filing date of October 3, 2000, was published in English and designated the United States.',
      'A U.S. patent by J.J. Smithy that has a filing date of September 5, 2000.',
      'A U.S. application publication under 35 U.S.C. 122(b) by inventor Jones that was filed on August 8, 2000.',
      'A journal article by Marks published on October 11, 2000.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. [Pre-AIA] 35 U.S.C. § 102(e); MPEP § 706.02(f): the application publication filed by ANOTHER before applicant’s filing date is a proper § 102(e) reference. (A) fails — a WIPO publication qualifies under § 102(e) only if its international filing date is on or after November 29, 2000. (B) fails — not by another (same inventor, J.J. Smithy). (D) fails — § 102(e) covers patents and patent application publications, not journal articles.',
  },
  {
    id: 'uspto-oct03-pm-18',
    topicId: 2,
    subtopic: 'Inventor Name Typo — Cheapest Correction (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner filed a design patent application on December 30, 2003. The application was filed with an inventor-executed declaration naming Jon Jones as the sole inventor, who has not assigned the invention and is not under an obligation to assign his invention. The filing receipt was recently received, indicating that the application will be published on Thursday, July 1, 2004. In reviewing the filing receipt the practitioner realizes that the typed name of the inventor contained a typographical error (an “h” was missing) and that the correct spelling was John Jones. Which of the following would be the course of action at the least expense to correct the error in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'The practitioner should file a request under 37 CFR 1.48 to correct the inventorship of the application with a new declaration under 37 CFR 1.63 signed by John Jones (with the correct spelling of this name), a statement by Mr. Jones as to how the error occurred and that the error was without deceptive intention, and the processing fee set forth in 37 CFR 1.17(q).',
      'The practitioner should file a petition under 37 CFR 1.182 and the petition fee set forth in 37 CFR 1.17(h), requesting correction of the spelling of the inventor’s name.',
      'The practitioner should file a request for a corrected filing receipt and a separate letter to the Office explaining that the declaration contains a typographical error, that the correct spelling of the inventor’s name is John Jones, and requesting correction of the Office records.',
      'The practitioner should expressly abandon the application, and file a continuation with a new declaration with the correct spelling.',
      'The practitioner should call the examiner and tell the examiner that the inventor’s name is wrong, and ask for the examiner to change the name on the declaration.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 605.04(b): for a typographical or transliteration error in the spelling of an inventor’s name discovered during pendency, no petition and no new oath/declaration is required — the Office should simply be notified of the error in writing. (A), (B) and (D) could work but at higher cost; (E) fails — business with the Office is conducted in writing (37 CFR § 1.2), and no one may alter the application or declaration after execution (MPEP § 605.04(a)).',
  },
  {
    id: 'uspto-oct03-pm-19',
    topicId: 0,
    subtopic: 'Obviousness Rationale — Equivalence Limits (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] The claims in an application are rejected under 35 USC 103 as obvious over prior art reference A in view of prior art reference B. All of the following statements are in accord with the patent laws, rules and procedures as related in the MPEP except:',
    options: [
      'Where the combination of prior art references provides motivation to make the claimed invention to achieve the same advantage or result discovered by the applicant, the references do not have to expressly suggest the combination of references.',
      'The rationale to modify or combine the prior art references may be reasoned from knowledge generally available to one of ordinary skill in the art, established scientific principles, or legal precedent established by prior case law.',
      'In considering the disclosure of the prior art references, it is proper to take into account the specific teachings of the references, as well as the inferences that one skilled in the art could reasonably draw from the specific teachings.',
      'An examiner may take official notice of facts outside the record that are capable of instant and unquestionable demonstration as being “well known” prior art or common knowledge in the art.',
      'To rely on equivalence as a rationale supporting an obviousness rejection under 35 USC 103 an examiner may base the rejection on the mere fact that the components at issue are functional or mechanical equivalents.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer (the exception). MPEP § 2144.06, “Substituting Equivalents Known For The Same Purpose”: to rely on equivalence, the equivalency must be recognized in the PRIOR ART — it cannot be based on applicant’s disclosure or the mere fact that the components are functional or mechanical equivalents (In re Ruff, 256 F.2d 590 (CCPA 1958)). (A)–(D) each correctly state the law (MPEP §§ 2144, 2144.01, 2144.03; In re Linter; In re Fine; In re Preda; In re Ahlert).',
  },
  {
    id: 'uspto-oct03-pm-20',
    topicId: 5,
    subtopic: 'Reexamination — Permissible 102 Rejections (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Recommend which of the following rejections under 35 USC 102 in a reexamination proceeding is in accordance with the patent laws, rules and procedures as related in the MPEP.',
    options: [
      'A rejection under 35 USC 102(a) based on an affidavit that the invention was known or used by others before the invention thereof by the applicant for patent.',
      'A rejection under 35 USC 102(b) based on an affidavit that the invention was in the public use in this country more than one year prior to the date of the application for a patent in the United States.',
      'A rejection under 35 USC 102(e) that the invention was described in a patent by another filed in the United States before the invention thereof by the patent applicant.',
      'A rejection under 35 USC 102(f) based on an affidavit that the applicant did not himself invent the subject matter sought to be patented.',
      'A rejection under 35 USC 102(b) that the invention was on sale in this country, more than one year prior to the date of the application for patent in the United States.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 35 U.S.C. § 302; 37 CFR § 1.552; MPEP § 2258: rejections on prior art in reexamination may only be made on the basis of prior PATENTS or PRINTED PUBLICATIONS — a § 102(e) rejection over a patent qualifies. (A), (B), (D) and (E) fail — rejections based on public use, on-sale activity, inventorship, fraud, or affidavit evidence of knowledge/use are not permitted in reexamination (In re Lanham, 1 USPQ2d 1877).',
  },
  {
    id: 'uspto-oct03-pm-21',
    topicId: 3,
    subtopic: 'Fully Responsive Reply § 1.111 (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which of the following would comply with the patent laws, rules and procedures as related in the MPEP and would be a fully responsive reply to a non-final Office action on the merits rejecting all the claims in the application as being unpatentable under 35 USC 102 and/or 103 over prior art references?',
    options: [
      'A timely filed and properly signed written reply which does not include an amendment to the claims, but includes a request for the examiner’s rejections to be reconsidered supported by arguments replying to every ground of rejection and distinctly and specifically points out the supposed errors in every rejection, and pointing out the specific distinctions believed to render the claims patentable over any applied references.',
      'A timely filed and properly signed written reply which includes an amendment canceling all the claims in the application and adding new claims, and a request for the examiner’s rejections to be reconsidered in view of the newly presented claims.',
      'A timely filed and properly signed written reply which does not include an amendment to the claims, but does generally alleges that the claims define a patentable invention.',
      'A timely filed and properly signed written request for continued examination (RCE).',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 CFR § 1.111; MPEP § 714.02: a reply must distinctly and specifically point out the supposed errors, reply to every ground of rejection, and present arguments pointing out the specific distinctions over the applied references — amendment optional. (B)/(C) fail — neither specifically addresses the rejections; a general allegation of patentability does not comply. (D) fails — an RCE is available only after prosecution is CLOSED, and this Office action is non-final (37 CFR § 1.114).',
  },
  {
    id: 'uspto-oct03-pm-22',
    topicId: 1,
    subtopic: 'Oath/ADS/Dependent-Claim Statements — All False (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which, if any, of the following statements is in accord with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Where an inventor’s residence is stated correctly in the 37 CFR 1.76 application data sheet and incorrectly in the inventor’s 37 CFR 1.63 oath or declaration, the discrepancy must be corrected by filing a supplemental 37 CFR 1.67 oath or declaration giving the correct residence.',
      'Where two inventors file separate 37 CFR 1.63 oaths or declarations which do not identify both inventors, the USPTO will presume they are joint inventors and will not require new oaths or declarations.',
      'A dependent claim which merely repeats a limitation that appears in the claim on which it depends is properly rejected under the fourth paragraph of 35 USC 112.',
      'In a statement under 37 CFR 1.97(e)(1) specifying that “each item of information contained in the information disclosure statement was first cited in any communication from a foreign patent office in a counterpart foreign application not more than three months prior to the filing of the statement,” the three-month period begins on the date the communication was first received by either a foreign associate or a U.S. registered practitioner.',
      'None of statements (A) to (D) is correct.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer — none is correct. (A): for a RESIDENCE error the ADS governs and no supplemental oath is required (37 CFR § 1.76(d)(2); MPEP § 601.05). (B): each joint inventor’s oath should reference the other inventors; defective oaths require new ones (MPEP § 602). (C): an improperly dependent claim is OBJECTED to under 37 CFR § 1.75(c), not rejected under § 112 ¶ 4 (MPEP § 608.01(n)). (D): the three-month period runs from the DATE ON the foreign office communication, not the date received by an associate or practitioner (MPEP § 609).',
  },
  {
    id: 'uspto-oct03-pm-24',
    topicId: 5,
    subtopic: 'Patent Term — 20 Years From Which Date (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Applicant filed a provisional patent application in the USPTO under 35 USC 111(b) on Tuesday, November 30, 1999. On Tuesday, November 28, 2000, applicant filed a nonprovisional application in the USPTO under 35 USC 111(a) that properly claimed priority under 35 USC 119(e) to the filing date of the provisional application. On Wednesday, November 29, 2000, applicant filed an international application for patent in the USPTO under the Patent Cooperation Treaty that designated the United States and properly claimed priority to both the provisional and the nonprovisional applications. On Friday, July 28, 2001, applicant filed a national stage application in the USPTO under 35 USC 371, providing all of the requirements under 35 USC 371 and properly claiming benefit to the filing date of the provisional application under 35 USC 119(e) and the nonprovisional application under 35 USC 120. The national stage application was published on Tuesday, January 30, 2002 and issued as a patent on Tuesday, February 4, 2003. Assuming no patent term extension or adjustment, the patent term ends on the date that is 20 years from which of the following dates in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'Tuesday, November 30, 1999',
      'Tuesday, November 28, 2000',
      'Wednesday, November 29, 2000',
      'Friday, July 28, 2001',
      'Tuesday, February 4, 2003',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) — the filing date of the nonprovisional application — is the correct answer. 35 U.S.C. § 154(a)(2)-(3); MPEP § 201.04(b): the domestic priority period from a § 119(e) provisional claim does NOT count toward the 20-year term, but where the application contains a § 120/121/365(c) reference to an earlier application, the term runs 20 years from the earliest such application — here the November 28, 2000 nonprovisional to which the international application claimed § 120 benefit. (D) — the national-stage commencement date is irrelevant; (E) — since 1995 the term is measured from filing, not issue.',
  },
  {
    id: 'uspto-oct03-pm-25',
    topicId: 0,
    subtopic: 'CIP — Unsupported Claims Treatment (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner files a nonprovisional utility application in 2000. In 2002, the practitioner files a continuation-in-part application and claims benefit of the filing date of the 2000 application for the 2002 application. Thereafter, the practitioner amends the 2002 application to include claims that were not present in either the originally filed 2000 application or the originally filed 2002 application. The primary examiner properly concludes that the added claims are not supported by the original disclosure in either application. Which of the following is in accord with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'The added claims are rejected for lack of written description under 35 USC 112, first paragraph.',
      'The added claims are rejected as new matter under 35 USC 132.',
      'The added claims are denied benefit of the filing date of the 2000 application.',
      '(A) and (B).',
      '(A) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — both (A) and (C). MPEP § 2163.01: if the claimed subject matter is not supported in the application as filed, the result is a rejection for lack of written description under 35 U.S.C. § 112, first paragraph, or denial of the benefit of the earlier filing date. (B) fails — unsupported CLAIMS should not be rejected as new matter; the new-matter framework applies to amendments to the abstract, specification or drawings (In re Rasmussen, 650 F.2d 1212 (CCPA 1981)).',
  },
  {
    id: 'uspto-oct03-pm-26',
    topicId: 3,
    subtopic: 'When Both § 1.131 and § 1.132 Affidavits Fit (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which of the following best describes a situation for which a reply to the examiner’s Office action including both an affidavit filed under 37 CFR 1.131 and an affidavit filed under 37 CFR 1.132 may be in accord with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'In a timely reply to a non-final Office action, where the examiner’s sole rejection of appellant’s claims is based on an alleged violation of the enablement requirement of 35 USC 112.',
      'In a timely reply to non-final Office action, where the examiner’s sole rejection of appellant’s claims is a rejection under 35 USC 103(a) employing a non-patent document that was published less than one year prior to the filing date of appellant’s patent application.',
      'In a timely reply to a non-final Office action, where the examiner’s sole rejection of appellant’s claims is a rejection under 35 USC 103(a) employing a non-commonly owned U.S. patent as prior art under 35 USC 102(e) that claims the same invention as applicant.',
      'In a timely reply to an examiner’s answer presenting the affidavits for the first time, where in the examiner’s first Office action and final rejection, the examiner maintains the same rejection under 35 USC 103(a) of all of appellant’s claims based in part on a non-patent document that was published less than one year prior to the filing date of appellant’s patent application.',
      'In a timely reply to a final Office action presenting the affidavits for the first time, where in the examiner’s first Office action, the examiner’s sole rejection of appellant’s claims is a rejection under 35 USC 103(a) employing a non-patent document that was published less than one year prior to the filing date of appellant’s patent application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. [Pre-AIA] MPEP §§ 715, 716: a § 1.131 affidavit may antedate a reference qualifying under § 102(a) (but not § 102(b)), and a § 1.132 affidavit may present objective evidence traversing the rejection — both fit a timely reply to a NON-FINAL action over a publication less than a year old. (A) — a § 1.131 affidavit serves no purpose against an enablement rejection; (C) — § 1.131 is inappropriate where the patent claims the same invention (interference territory); (D)/(E) — affidavits first presented after final or with the appeal are normally untimely (37 CFR §§ 1.116, 1.192(a), 1.195; MPEP §§ 715.09, 716.01).',
  },
  {
    id: 'uspto-oct03-pm-27',
    topicId: 0,
    subtopic: '“On Sale” Scope — Sale of Rights Excluded (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following is not within the scope of the term “on sale” as it is used in 35 USC 102(b)?',
    options: [
      'A sale conditioned on buyer satisfaction.',
      'A sale that did not result in a profit.',
      'A single sale of the claimed subject matter.',
      'A commercial offer to sale the claimed subject matter.',
      'An offer to sale the patent rights in the claimed subject matter.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. [Pre-AIA] MPEP § 2133.03(b), “A Sale of Rights Is Not a Sale of the Invention”: an assignment or sale of patent RIGHTS is not a sale of “the invention” under § 102(b) — the sale must involve delivery of the physical invention itself (Moleculon Research v. CBS, 793 F.2d 1261 (Fed. Cir. 1986)). (A) conditional sales, (B) nonprofit sales (In re Dybel), (C) even a single sale (Consolidated Fruit-Jar v. Wright), and (D) commercial offers (Group One v. Hallmark Cards) are all within the on-sale bar.',
  },
  {
    id: 'uspto-oct03-pm-28',
    topicId: 3,
    subtopic: 'Drawing Objection — Add the Drawing, Claim Stands (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A patent application is filed disclosing and claiming a system for detecting expired parking meters. The specification fully supports the original, sole claim. The application discloses that the “electronics control unit” contains a comparator and an alarm. The application includes several drawings. One of the drawings shows a block diagram of the system, illustrating the electronics control unit as a box, labeled “electronics control unit.” The sole claim of the application is as follows: “A system for detecting expired parking meters, comprising: a timer mechanism; an infrared sensor for detecting the presence of a parked vehicle; and an electronics control unit, including a comparator and an alarm, coupled to the infrared sensor and the timer mechanism.” A final Office action, dated February 3, 2004, indicates that the sole claim contains allowable subject matter, but includes an objection to the specification, on the grounds that the subject matter of the electronics control unit, though described in a sufficiently specific and detailed manner in the original specification, was required to be shown in the drawings under 37 CFR 1.83. The Office action did not set a period for reply. Determine which of the following actions, if any, comports with the patent laws, rules and procedures as related in the MPEP for overcoming the objection.',
    options: [
      'On April 1, 2004, a Notice of Appeal is filed together with appropriate fees, and a brief pointing out that a patent should issue since the subject matter of the electronics control unit was adequately described in the original specification.',
      'On April 1, 2004, a drawing is filed in the USPTO illustrating only the comparator and alarm of the electronics control unit that was described in the original specification.',
      'On April 1, 2004, a Notice of Appeal of appeal is filed together with appropriate fees, and a brief pointing out that the addition of a drawing showing the electronics control unit would not constitute addition of new matter since the electronics control unit was adequately described in the original specification.',
      'On September 1, 2004, a petition is filed urging that no further drawing should be required because the subject matter of the electronics control unit, for purposes of the application, was adequately disclosed in the block diagram drawing.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the answer. 37 CFR § 1.83(a); MPEP §§ 608.01(l), 706.03(o): where originally claimed subject matter is not shown in the drawing and the original claim clearly discloses it, the claim is treated on its merits and applicant is REQUIRED to amend the drawing — it is the drawing that is defective, not the claim. (A)/(C) fail — drawing objections are petitionable, not appealable (MPEP §§ 608.02, 1002). (D) fails — a petition filed more than six months after the action is untimely; a timely petition is filed within two months (37 CFR § 1.181(f); MPEP § 710.01).',
  },
  {
    id: 'uspto-oct03-pm-29',
    topicId: 6,
    subtopic: 'Design — Six-Month 102(d)/172 Bar (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] On Thursday, February 6, 2003, applicant files an application for a design patent in Country X, which issues the patent on the filing date. In accordance with the patent laws, rules and the procedures as related in the MPEP, what is the last date applicant can file a U.S. design application to avoid any loss of patent rights?',
    options: [
      'Friday, February 6, 2004 (assume not a Federal holiday).',
      'Thursday, February 5, 2004 (assume not a Federal holiday).',
      'Wednesday, August 6, 2003.',
      'Wednesday, May 6, 2003.',
      'None of the above are correct.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. [Pre-AIA] 35 U.S.C. § 172; MPEP § 1504.02: the § 102(d) time is SIX months for designs — to avoid the statutory bar, the U.S. design application must be filed within six months of the foreign filing, i.e., by August 6, 2003. Registration of a design abroad is equivalent to patenting under §§ 119(a)-(d) and 102(d) whether or not the foreign grant is published (Ex parte Lancaster, 151 USPQ 713).',
  },
  {
    id: 'uspto-oct03-pm-30',
    topicId: 3,
    subtopic: '§ 1.131 Showing — Facts, Working RTP Required (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Co-inventors Smith and Jones filed an application for a patent on a cell phone, on May 15, 2002. They received a first Office action from a primary examiner rejecting the claims under 35 USC 102(a) over a publication by Bell and Watson, published on April 5, 2002, describing a cell phone having all the same features as is claimed in the patent application. In reply, the co-inventors each submitted a declaration under 37 CFR 1.131 stating that they had actually reduced the invention to practice no later than March 13, 2002. However, the declarations failed to include two claimed features. Neither the particular antenna needed to enable the cell phone could receive transmissions from the local cellular transmitting tower, nor a detachable carrying strap was included in the declarations. As evidence of their prior reduction to practice, Smith and Jones submitted their co-authored journal article. The journal article contained a figure of the cell phone as described in the declarations. That is, the cell phone shown in the figure of the article lacked an antenna and a detachable strap. The article was received by the journal on March 13, 2002, and was published on April 30, 2002. The cell phones shown in the figure in the Bell and Watson publication, and in the Smith and Jones patent application have the particular antenna and a detachable strap. Which of the following actions, if taken by the examiner, would be the most proper in accordance with the patent laws, rules and the procedures as related in the MPEP?',
    options: [
      'The examiner should maintain the rejection of the claims under 35 USC 102(a) and make the rejection final.',
      'The examiner should withdraw the rejection and look for references which have a publication date prior to May 15, 2001.',
      'The examiner should withdraw the rejection and notify Smith and Jones that their application is in condition for allowance.',
      'The examiner should maintain the rejection, but indicate that the claims would be allowable if Smith and Jones provided an original copy of the figure published in their journal article as factual support for their declarations.',
      'The examiner should maintain the rejection and inform Smith and Jones that the declarations are insufficient because they cannot “swear behind” a reference which is a statutory bar.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. [Pre-AIA] MPEP § 715.07: a § 1.131 showing requires FACTS and documentary evidence demonstrating completion of the invention; actual reduction to practice requires the apparatus to have existed and worked for its intended purpose. The declarations and article show a cell phone WITHOUT the claimed antenna — it would not work for its intended purpose — so priority is not established and the rejection is maintained and made final. (E) fails — § 102(a) art is not a statutory bar, so swearing behind is procedurally available; the showing here simply fails on the facts.',
  },
  {
    id: 'uspto-oct03-pm-31',
    topicId: 2,
    subtopic: 'Filing Date — Oath Not Required (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, for a nonprovisional application to receive a filing date in the USPTO under 37 CFR 1.53(b), all of the following must be filed except:',
    options: [
      'An oath or declaration executed by applicant pursuant to 37 CFR 1.63.',
      'A specification as prescribed by the first paragraph of 35 USC 112.',
      'A description pursuant to 37 CFR 1.71.',
      'At least one claim pursuant to 37 CFR 1.75.',
      'A drawing when required by 37 CFR 1.81(a).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 CFR § 1.53(f); MPEP § 601.01(a): the oath or declaration for an application filed under § 1.53(b) can be submitted after the filing date. The specification with description, at least one claim, and any required drawing — (B) through (E) — are what earn the filing date.',
  },
  {
    id: 'uspto-oct03-pm-32',
    topicId: 2,
    subtopic: 'Separate Verification Statements Eliminated (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Determine which of the following documents, if any, must also contain a separate verification statement in accordance with the patent laws, rules and procedures as related in the MPEP.',
    options: [
      'A request to correct inventorship in a pending application.',
      'A petition to make an application special.',
      'A claim for foreign priority.',
      'A substitute specification.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 410: the certification requirement of 37 CFR § 10.18(b) permitted the USPTO to ELIMINATE the separate verification requirement previously contained in 37 CFR §§ 1.48 (correction of inventorship), 1.55 (foreign priority claim), 1.102 (petition to make special), and 1.125 (substitute specification).',
  },
  {
    id: 'uspto-oct03-pm-33',
    topicId: 0,
    subtopic: 'Obviousness Rebuttal — Motivation + Burden (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner files an application on the client’s discovery that adding silica to a known plastic composition containing the flame retardant, X, results in increased flame retardance. The application claims a composition comprising the known plastic composition containing X and also silica. The primary examiner rejects the claim on the basis that applicant admits that X was a known flame retardant and that there is no evidence of improved flame retardance. In accordance with the patent laws, rules and procedures as related in the MPEP, a proper reply could include which of the following argument(s) to rebut and overcome the rejection?',
    options: [
      'The examiner cannot rely on admitted prior art.',
      'The examiner has not shown that the prior art appreciated applicant’s discovery of silica to be a flame retardant.',
      'The examiner has not made out a prima facie case of obviousness due to lack of motivation in the prior art or in the knowledge generally available to one of ordinary skill in the art for adding silica to the known plastic composition.',
      'The applicant does not have to show an improved or unexpected result for the claimed invention.',
      '(C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — (C) and (D) together. MPEP §§ 2141–2143.01: a prima facie case requires some teaching, suggestion, or motivation in the references or in the knowledge generally available to one of ordinary skill (In re Vaeck; In re Kotzab), which the examiner has not shown; and absent a prima facie case, the applicant is under NO obligation to submit evidence of nonobviousness (MPEP § 2142). (A) fails — admissions by applicant CAN be used as prior art (MPEP § 2129). (B) fails — prior art need not appreciate applicant’s advantage (MPEP § 2144).',
  },
  {
    id: 'uspto-oct03-pm-34',
    topicId: 2,
    subtopic: 'Certificate of Mailing — Foreign Mail Excluded (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following paper is precluded from receiving the benefit of a certificate of mailing or transmission under 37 CFR 1.8?',
    options: [
      'An amendment, replying to an Office action setting a period for reply, transmitted by mail with a certificate of mailing to the USPTO from a foreign country.',
      'An amendment, replying to an Office action setting a period for reply, transmitted by facsimile with a certificate of transmission to the USPTO from a foreign country.',
      'An information disclosure statement (IDS) under 37 CFR 1.97 and 1.98 transmitted after the first Office action.',
      'A request for continued examination (RCE) under 37 CFR 1.114.',
      'An appeal brief.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 512: “The Certificate of Mailing procedure does not apply to papers MAILED in a foreign country.” (B) — the certificate of TRANSMISSION procedure does apply to facsimile from a foreign country; (C) — an IDS gets the § 1.8 benefit (MPEP § 609, “Time for Filing”); (D) — an RCE is entitled to the benefit (MPEP § 706.07(h)); (E) — an appeal brief is entitled to the benefit (MPEP § 1206).',
  },
  {
    id: 'uspto-oct03-pm-35',
    topicId: 3,
    subtopic: '§ 1.132 — Attributing a Reference to Applicant (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] The sole claim in an application filed by A and having an effective filing date of June 5, 2002, recites an electrical signal amplifier comprising a plurality of germanium transistors connected together in a particular configuration. The claim is rejected under 35 USC 103(a) as being obviousness over a primary nonpatent reference publication (Reference P) in view of a secondary nonpatent reference publication (Reference S). Reference P has an effective date of April 3, 2002, and names A and B as the authors. Reference S has an effective date of December 10, 2001, and names C as the sole author. Reference P discloses an electrical signal amplifier including a plurality of silicon transistors connected together in the same configuration as that set forth in the claim. Reference S discloses a signal amplifier employing germanium transistors connected in a configuration different from the claimed configuration. The applicant does not deny that the references render the claimed subject matter prima facie obvious. Which, if any, of the declarations under 37 CFR 1.132 set forth below should be sufficient under the patent laws, rules and procedures as related in the MPEP to overcome the rejection?',
    options: [
      'An uncontradicted declaration by A asserting that the subject matter relied on by the examiner in reference P constitutes A’s sole invention, with the result that Reference P is not available as prior art against the claim.',
      'A declaration by A asserting that “the claimed amplifier has satisfied a long-felt need in the art.”',
      'A declaration by A and accompanying copies of competitors’ advertisements which conclusively show that those competitors have exactly copied appellant’s commercial embodiment of the claimed amplifier.',
      'A declaration by A and supporting documentation establishing that ever since the filing date of A’s application, sales of the commercial embodiment of A’s claimed amplifier have consistently constituted ninety percent or more of the relevant signal amplifier market in the United States.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 716.10: an affidavit or declaration may attribute an activity or reference to the applicant — an uncontradicted, unequivocal statement from the applicant regarding the subject matter disclosed in an article will be accepted as establishing inventorship, removing the reference as prior art (In re DeBaun, 687 F.2d 459 (CCPA 1982)). (B) fails without objective evidence of a long-felt, unsolved need (MPEP § 716.04); (C) — mere copying is not enough (Cable Electric v. Genmark); (D) — sales figures alone don’t prove success derives from the invention’s merits (MPEP § 716.03(b); In re Mageli).',
  },
  {
    id: 'uspto-oct03-pm-36',
    topicId: 0,
    subtopic: 'What § 1.131 Cannot Antedate (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] An application naming X and Y as joint inventors, filed on April 3, 2002, has a single pending claim, and does not claim the benefit of any earlier application. Which, if any, of the following items of prior art that have been relied on in various rejections of the claim may be overcome by a suitable affidavit under 37 CFR 1.131 in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'A U.S. patent to G that issued on March 27, 2001, has an effective U.S. filing date of January 4, 2000, and does not claim the “same patentable invention” (as defined in 37 CFR 1.601(n)) as the rejected claim.',
      'A U.S. patent to P that issued on June 5, 2001, has an effective U.S. filing date of February 1, 2000, and includes a claim that is identical to the rejected claim.',
      'A journal article to H published on December 10, 2001, and characterized in the application as “describ[ing] the prior art.”',
      'A foreign patent issued to X and Y on November 7, 2001, which claims the same subject matter as the rejected claim and is based on an application filed on January 3, 2001.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) — none of the above — is correct. [Pre-AIA] MPEP § 715: (A) the G patent issued more than one year before the April 3, 2002 filing date — a § 102(b) statutory bar that § 1.131 cannot antedate. (B) the P patent claims the same patentable invention (identical claim) — § 1.131(a)(1) expressly forbids it (interference territory). (C) applicant clearly ADMITTED the article is prior art — it may not be overcome by § 1.131 (In re Hellsund). (D) is the applicants’ own foreign patent on an application filed more than 12 months before the U.S. filing — § 102(d) territory (MPEP § 715(C)).',
  },
  {
    id: 'uspto-oct03-pm-37',
    topicId: 0,
    subtopic: 'Utility — Well-Established Utility Response (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] The specification of an application does not disclose the utility of the claimed composition. In fact, the claimed invention is useful for shrinking a specific class of tumors. In a first Office action, the primary examiner has properly determined that the claims lack utility, and has rejected all of the composition claims under the first paragraph of 35 USC 112 as lacking utility. Which of the following responses is in accord with the USPTO rules and the procedures of the MPEP for persuading the examiner that the rejection is improper?',
    options: [
      'Explain that the rejection is statutorily improper because the first paragraph of section 112 is concerned with enablement and written description issues and therefore does not support a rejection for lack of utility.',
      'Point out that the rejection is based on an erroneous finding by the examiner because the specification, in fact, clearly discloses that the composition in question possesses “useful biological” properties.',
      'Show that the rejection is improper by filing probative evidence that the claimed composition has unambiguously proven to be useful for shrinking a specific class of tumors.',
      'File declarations by persons with ordinary skill in the art stating that they would immediately appreciate that the claimed composition is useful for shrinking a specific class of tumors due to the fact that similar compositions having the same characteristics as applicant’s claimed composition were known to be effective for this purpose.',
      'Argue that the rejection is improper because the examiner has failed to present evidence in support of his position that the claimed composition has no utility.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 2107.02(II)(B): the absence of a utility statement does not per se negate utility — an invention has a WELL-ESTABLISHED utility if a person of ordinary skill would immediately appreciate why it is useful and the utility is specific, substantial and credible; the declarations establish exactly that. (A) fails — a § 101 utility deficiency also creates a § 112 ¶ 1 deficiency (MPEP § 2107.01(IV)). (B) fails — “useful biological properties” is not specific. (C) fails — later proof does not cure the specification’s failure to identify the utility. (E) fails — the examiner need not present evidence where no specific utility is identified or apparent.',
  },
  {
    id: 'uspto-oct03-pm-38',
    topicId: 2,
    subtopic: 'Assignee on the Patent — Issue Fee Transmittal (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner properly recorded an assignment document for application A identifying XYZ Company as the assignee. The document assigns to XYZ Company the “subject matter claimed in Application A.” A proper restriction requirement was made by a primary examiner in application A between two distinct inventions, and the practitioner elected to prosecute one of the inventions. Application A was prosecuted, and later became abandoned. Before the abandonment date of application A, the practitioner filed a complete application B as a proper divisional application of application A. Application B claimed the nonelected invention of Application A, and was published as a U.S. application publication. XYZ Company remains the assignee of application A. What must the practitioner do in accordance with the patent laws, rules and procedures as related in the MPEP to ensure that XYZ Company is listed as the assignee on the face of any patent issuing from application B?',
    options: [
      'File a proper assignment document in application B identifying XYZ Company as the assignee.',
      'File a proper assignment document in application B identifying XYZ Company as the assignee, and confirm that USPTO’s bibliographic data for application B identifies XYZ Company as the assignee by checking the filing receipt for application B, the U.S. application publication of application B, or the USPTO’s Patent Application Information Retrieval (PAIR) system data for application B, depending on when the practitioner filed the assignment document in application B.',
      'Confirm that XYZ Company is identified as the assignee on the U.S. application publication of application B.',
      'File a proper assignment document in application B identifying XYZ Company as the assignee, and confirm that XYZ Company is identified as the assignee on the U.S. application publication of application B.',
      'Upon allowance of application B, the practitioner must identify XYZ Company as the assignee in the appropriate space on the Issue Fee Transmittal form for specifying the assignee for application B.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP §§ 306, 307: a prior assignment recorded against the original application applies to a division or continuation, so no new assignment document is needed — and the patent issues to the assignee only if so indicated on the Issue Fee Transmittal form PTOL-85B; unless the assignee is identified in item 3, the patent issues to the applicant. Assignment data printed on the patent is based solely on the PTOL-85B information (MPEP §§ 1309, 1481).',
  },
  {
    id: 'uspto-oct03-pm-39',
    topicId: 4,
    subtopic: 'PCT — International Filing Date Requirements (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] An international application is filed in the United States Receiving Office on September 18, 2002. In accordance with the PCT and USPTO rules and the procedures set forth in the MPEP, which of the following will result in the application not being accorded an international filing date of September 18, 2002?',
    options: [
      'The description and claims are in German.',
      'The Request is signed by a registered attorney rather than the applicant.',
      'The sole applicant is a Canadian resident and national.',
      'The application does not contain a claim.',
      'The application is not accompanied by any fees.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. PCT Article 11(1)(iii)(e); 35 U.S.C. § 363; 37 CFR § 1.431(a); MPEP § 1810: an international filing date requires “a part which on the face of it appears to be a claim or claims.” (A)/(C) — a wrong language or non-competent Office results in forwarding to the International Bureau as receiving Office with the same receipt date (PCT Rule 19.4); (B) — a registered attorney may sign the Request, with an invitation to correct under PCT Article 14; (E) — fees may be paid later (PCT Rules 14.1(c), 15.4(a), 16.1(f)).',
  },
  {
    id: 'uspto-oct03-pm-40',
    topicId: 0,
    subtopic: '102(e)(1) Date of a National-Stage Publication (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Applicant files a patent application in Japan on January 5, 2000. Applicant files a PCT international application designating the United States on January 5, 2001, based on the Japanese application. The international application is published in English on July 5, 2001. The international application enters the national stage in the United States on September 5, 2001. The USPTO publishes the application on June 6, 2002. The application issues as a United States patent on December 3, 2002. What is its earliest possible 35 USC 102(e) prior art date for the application published by the United States, in view of the amendment to Title 35 by the American Inventors Protection Act of 1999 and the Intellectual Property and High Technology Technical Amendments Act of 2002?',
    options: [
      'January 5, 2000.',
      'January 5, 2001.',
      'July 5, 2001.',
      'June 6, 2002.',
      'December 3, 2002.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. [Pre-AIA] 35 U.S.C. § 102(e)(1); MPEP § 706.02(f)(1) (Example 4): a US published application of a national stage of an international application filed on or after November 29, 2000 takes a prior art date as of its INTERNATIONAL filing date if the application designated the US and was published in English — here January 5, 2001. (A) fails — the Japanese filing date matters only for § 119(a) priority, not prior art.',
  },
  {
    id: 'uspto-oct03-pm-41',
    topicId: 3,
    subtopic: 'Traversing Restriction — Election Still Required (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A non-final Office action contains, among other things, a restriction requirement between two groups of claims (Group 1 and Group 2). Determine which of the following, if included in a timely reply under 37 CFR 1.111, preserves applicant’s right to petition the Commissioner to review the restriction requirement in accordance with the patent laws, rules and procedures as related in the MPEP.',
    options: [
      'Applicant’s entire reply to the restriction requirement is: “The examiner erred in distinguishing between Group 1 and Group 2, and therefore the restriction requirement is respectfully traversed and no election is being made, in order that applicant’s right to petition the Commissioner to review the restriction requirement is preserved.”',
      'Applicant’s entire reply to the restriction requirement is: “Applicant elects Group 1 and respectfully traverses the restriction requirement, because the examiner erred in requiring a restriction between Group 1 and Group 2.”',
      'Applicant’s reply distinctly points out detailed reasons why applicant believes the examiner erred in requiring a restriction between Group 1 and Group 2, and additionally sets forth, “Applicant therefore respectfully traverses the restriction requirement and no election is being made, in order that applicant’s right to petition the Commissioner to review the restriction requirement is preserved.”',
      'Applicant’s reply distinctly points out detailed reasons why applicant believes the examiner erred in requiring a restriction between Group 1 and Group 2, and additionally sets forth, “Applicant therefore respectfully traverses the restriction requirement and elects Group 2.”',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR §§ 1.111(b), 1.143; MPEP §§ 818.03(a)-(c): a complete traverse must distinctly and specifically point out the supposed errors, AND a provisional election must be made even though the requirement is traversed. (A) fails twice — a mere broad allegation of error does not comply, and no election is made; (B) fails — no distinct reasons; (C) fails — no election.',
  },
  {
    id: 'uspto-oct03-pm-42',
    topicId: 3,
    subtopic: 'Reference Omitted From Statement of Rejection (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] The primary examiner has rejected claims 1-10 under 35 USC 103(a) as being unpatentable over the Smith patent in view of the Jones reference. Appellant properly argues that there is no motivation to combine the teachings of Smith and Jones. The examiner repeats the rejection of claims 1-10 as being “unpatentable over Smith in view of Jones.” The examiner additionally cites a patent to Brown that was necessary to provide motivation for combining the teachings of Smith and Jones. The examiner does not list Brown in the statement of the rejection. Appellant timely appeals to the Board of Patent Appeals and Interferences, and files a proper appeal brief. The examiner files an examiner’s answer addressing the rejection of claims 1-10 under 35 USC 103(a) as being unpatentable over Smith in view of Jones, and cites Brown in the argument as providing motivation to combine Smith and Jones. In accordance with the patent laws, rules and procedures as related in the MPEP, what will be the most proper decision of the Board?',
    options: [
      'The Board will affirm the rejection based on Smith and Jones only.',
      'The Board will affirm the rejection based on Smith, Jones and Brown.',
      'The Board will reverse the rejection based on Smith and Jones only.',
      'The Board will reverse the rejection based on Smith, Jones and Brown.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 CFR § 1.193(a)(2); MPEP § 1208.01: where a reference is relied on to support a rejection — even in a minor capacity — it must be positively included in the statement of the rejection (In re Hoch, 428 F.2d 1341 n.3 (CCPA 1970)). The Board will not consider Brown because it was not listed, and without Brown there is no motivation to combine Smith and Jones — so the rejection over Smith in view of Jones must be REVERSED.',
  },
  {
    id: 'uspto-oct03-pm-43',
    topicId: 1,
    subtopic: 'Application Data Sheet — Governing Rules (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] Which of the following statement(s) is in accordance with patent laws, rules and procedures as related in the MPEP regarding filing of an Application Data Sheet (ADS) in the USPTO?',
    options: [
      'All non-provisional applications must include an ADS when the application is originally filed.',
      'If an ADS is filed at the same time as an oath or declaration under 37 CFR 1.63 or 1.67 and the information supplied in the two documents is inconsistent, the information provided in the ADS will always govern.',
      'If an ADS is filed at the same time as an oath or declaration under 37 CFR 1.63 or 1.67 and the information supplied in the two documents is inconsistent, the oath or declaration will govern any inconsistency related the claiming of benefit under 35 USC 119(e), 120, 121 or 365(c).',
      'If an ADS is filed after an oath or declaration under 37 CFR 1.63 or 1.67 is filed, and the information supplied in the two documents is inconsistent, the information provided in the ADS will always govern.',
      'The oath or declaration under 37 CFR 1.63 or 1.67 governs inconsistencies with the ADS when the inconsistency concerns setting forth the citizenship of the inventor(s) under 35 USC 115.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 CFR § 1.76(d)(3); MPEP § 601.05: the oath or declaration governs inconsistencies with the ADS relating to inventor CITIZENSHIP (35 U.S.C. § 115) — regardless of filing order. (A) fails — an ADS is voluntary (37 CFR § 1.76(a)); (B)/(D) fail on “always” — naming of inventors and citizenship are governed by the oath; (C) fails — domestic-benefit inconsistencies are governed by the ADS (37 CFR § 1.76(d)(2)).',
  },
  {
    id: 'uspto-oct03-pm-44',
    topicId: 0,
    subtopic: 'Transitional Phrases — Consisting Essentially Of (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following statements regarding claim interpretation is the most correct?',
    options: [
      'A claim having the transition term “comprising” is limited to only the limitations, elements or steps recited in the claim, and is not inclusive or open-ended of other unrecited elements or steps.',
      'The transition term “consisting essentially of” limits the claim to the limitations recited in the claim and additional elements or steps which do not materially affect the basic and novel characteristics of the claimed invention.',
      'A claim having the transition term “consisting of” is not limited to the elements or steps recited in the claim, but can include elements or steps other than those recited in addition to any impurities ordinarily associated therewith.',
      'A claim which depends from a claim which claims an invention “consisting of” the recited elements or steps can add an element or step to further limit the claimed invention.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2111.03: “consisting essentially of” limits the claim to the specified materials or steps and those that do not materially affect the basic and novel characteristics (In re Herz, 537 F.2d 549 (CCPA 1976)). (A) inverts “comprising” (open-ended, Genentech v. Chiron); (C) inverts “consisting of” (closed, In re Gray); (D) is directly contradicted — a claim depending from a “consisting of” claim cannot add an element or step.',
  },
  {
    id: 'uspto-oct03-pm-45',
    topicId: 3,
    subtopic: 'Appeal Brief — Grouping of Claims (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A patent application has claims 1-10 pending. Claims 1 and 7 are independent claims. Claims 2-6 depend directly from claim 1 while claims 8-10 depend directly from claim 7. Claims 1-10 have been twice rejected by the primary examiner under 35 USC 103(a) as being unpatentable over Smith patent in view of Jones patent. The applicant has appealed the rejection to the Board of Patent Appeals and Interferences. In the brief under the “grouping of claims” section, appellant states that each of the claims is separately patentable. In the arguments section of the brief, appellant separately argues only claims 1, 4 and 6. In the examiner’s answer, the examiner disagrees with appellant’s claim grouping because all the claims present a similar issue of patentability. The examiner states that the claims all stand or fall together as a single group. In accordance with the patent laws, rules and procedures as related in the MPEP, which claim(s) must the Board consider separately on the merits?',
    options: [
      'The Board must consider each of claims 1-10 separately on the merits.',
      'The Board must only consider claims 1, 4 and 6 separately on the merits.',
      'The Board must only consider claim 1 separately on the merits.',
      'The Board must consider claim 1 and claim 7 separately on the merits as representative of all the claims on appeal.',
      'The Board must determine which claim is representative of all the claims on appeal and consider only that claim separately on the merits.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.192(c)(7); MPEP § 1206: separate consideration requires TWO affirmative acts — stating the claims do not stand or fall together AND presenting arguments why each is separately patentable. Both acts were performed only for claims 1, 4 and 6, so those are the claims the Board must consider separately. The examiner has no input on the grouping; failure to note brief noncompliance does not oblige the Board to consider claims never specifically argued.',
  },
  {
    id: 'uspto-oct03-pm-46',
    topicId: 0,
    subtopic: 'Anticipation — Broadest Reasonable Interpretation (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A primary examiner is examining a patent application. The application includes a specification and a single claim to the invention that reads as follows: “1. A building material to be used as an alternative to brick in the construction of a house, said building material comprising compressed refuse, the majority of which is wood.” In the specification, the inventor explains that the wood to be used in the inventive building material should be balsa wood. According to the specification, balsa-containing building material has the advantage of being lighter than brick. In a first Office action mailed to the registered practitioner representing the inventor the single claim was rejected as anticipated under 35 U.S.C. § 102 over Patent A. Patent A issued more than one year before the effective filing date of the application, and teaches a building material to be used as an alternative to brick in the construction of a house comprising compressed refuse, the majority of which is pine. The practitioner replies to the first Office action by arguing that the invention is different from that of Patent A. According to the practitioner, the inventor uses balsa wood, not pine. The claim has not been amended. Which of the following describes how the examiner should proceed in accordance with the patent laws, rules and procedures as related in the MPEP?',
    options: [
      'The examiner should allow the claim.',
      'The examiner should allow the claim only after including a Reasons for Allowance pointing out that the inventor argues that her invention is directed to using balsa wood, not pine.',
      'The examiner should issue a Final Rejection again rejecting the claim as anticipated under 35 USC 102 over Patent A.',
      'The examiner should reopen prosecution and begin anew, this time searching for a reference that shows a building material containing balsa wood.',
      'The examiner should withdraw the rejection but issue a new Office action this time rejecting the claim under 35 USC 112, second paragraph, because the claim is broad enough to encompass using pine.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the best answer. MPEP §§ 2111, 2131: claims get their broadest reasonable interpretation, and limitations from the specification (balsa) are not read into the claim; the unamended claim broadly recites “wood,” so Patent A’s pine-based material discloses every element and still anticipates (Verdegaal Bros. v. Union Oil, 814 F.2d 628 (Fed. Cir. 1987)) — final rejection. (E) confuses breadth with indefiniteness: the claim is broad but definite.',
  },
  {
    id: 'uspto-oct03-pm-47',
    topicId: 0,
    subtopic: '102(a) — “Known or Used In This Country” (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] To rely in a rejection under 35 USC 102(a) on an invention that is known or publicly used in accordance with patent laws, rules and procedures as related in the MPEP, the invention:',
    options: [
      'must be known or used in NAFTA or WTO member countries.',
      'must be known or used in a NAFTA member country, but only if the filing date of the application is after the effective date of the North American Free Trade Agreement Implementation Act.',
      'must be known or used in this country.',
      'can be known or used in any country.',
      'must be known or used in a WTO member country, but only if the filing date of the application is after the effective date of the implementation of the Uruguay Round (WTO) Agreements Act.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. [Pre-AIA] 35 U.S.C. § 102(a); MPEP § 2132: the knowledge or use relied on in a § 102(a) rejection must be “in this country” — prior knowledge or use not present in the United States, even if widespread abroad, cannot be the basis (In re Ekenstam, 256 F.2d 321 (CCPA 1958)). The NAFTA/Uruguay Round changes to § 104 did not modify the meaning of “in this country” (MPEP § 706.02(c)).',
  },
  {
    id: 'uspto-oct03-pm-48',
    topicId: 3,
    subtopic: 'Petition Does Not Stay the Reply Period (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A registered practitioner timely files a petition under 37 CFR 1.181 while the application is pending before the primary examiner to challenge the prematureness of the final rejection that set a shortened statutory period for reply. Assume the petition is filed within two months of the date on the final rejection. What is the next response that should be docketed by the practitioner in accordance with the patent laws, rules and the procedures as related in the MPEP to avoid a penalty or payment of fees?',
    options: [
      'A reply to the final rejection within 6 months.',
      'A status inquiry 6 months after filing the petition.',
      'A reply to the final rejection within the shortened statutory time period set for reply in the final rejection.',
      'No reply is necessary until a decision is received on the petition.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. 37 CFR § 1.181(f); MPEP §§ 714.13, 1002: “The mere filing of a petition will not stay the period for reply to an Examiner’s action” — so a reply must be docketed within the shortened statutory period to avoid extension fees. (A) fails — replying after the shortened period requires at least extension-of-time fees; (B) — the application would already be abandoned at 6 months without reply (35 U.S.C. § 133); (D) — the petition does not stay the period.',
  },
  {
    id: 'uspto-oct03-pm-49',
    topicId: 1,
    subtopic: 'Improper Dependent Claim — Broadening Dependency (Official Oct 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] A patent specification discloses a personal computer comprising a microprocessor and a random access memory. There is no disclosure in the specification of the minimum amount of storage for the random access memory. In the disclosed preferred embodiment, the microprocessor has a clock speed of 100-200 megahertz. Claims 9 and 10, presented below, are original claims in the application. Claim 11, presented below, was added by amendment after an Office action. “9. A personal computer comprising a microprocessor and a random access memory that includes at least 1 gigabyte of storage. 10. The personal computer of Claim 9, wherein the microprocessor has a clock speed of 100-200 megahertz. 11. The personal computer of Claim 10, wherein the random access memory is greater than ½ gigabyte of storage.” Which of the following statements is or are in accord with the patent laws, rules and procedures as related in the MPEP regarding the respective claims under the fourth paragraph of 35 USC 112?',
    options: [
      'Claim 9 is a proper independent claim, and Claims 10 and 11 are proper dependent claims.',
      'Claim 9 is a proper independent claim, and Claims 10 and 11 are improper dependent claims.',
      'Claim 9 is an improper independent claim, and Claims 10 and 11 are improper dependent claims.',
      'Claim 9 is an improper independent claim, and Claims 10 and 11 are proper dependent claims.',
      'Claim 9 is a proper independent claim, Claim 10 is a proper dependent claim, and Claim 11 is an improper dependent claim.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 CFR § 1.75(c); MPEP § 608.01(n): claim 9, though broad, is supported — the minimum memory recited in an ORIGINAL claim is self-supporting (MPEP §§ 608.01(l), 2163). Claim 10 properly depends from and further restricts claim 9. Claim 11 is improper: claim 10 (via claim 9) already requires at least 1 gigabyte, and claim 11’s “greater than ½ gigabyte” redefines a LOWER minimum — it is inconsistent with and does not further limit claim 10.',
  },
  {
    id: 'uspto-oct03-pm-50',
    topicId: 0,
    subtopic: '102(g) — Ex Parte Rejection Requirements (Official Oct 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2003] In accordance with the patent laws, rules and procedures as related in the MPEP, which of the following facts are required for 35 USC 102(g) to form the basis for an ex parte rejection: (1) The subject matter at issue has been actually reduced to practice by another before the applicant’s invention. (2) There has been no abandonment, suppression or concealment. (3) A U.S. patent application for the subject matter at issue has been filed by another prior to the filing of the applicant’s application. (4) A U.S. patent has been granted for the subject matter at issue prior to the filing of the applicant’s application.',
    options: [
      'Fact (1) only',
      'Fact (2) only',
      'Facts (1) and (2)',
      'Facts (1), (2) and (3)',
      'Facts (1), (2), (3) and (4)',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. [Pre-AIA] MPEP § 2138: 35 U.S.C. § 102(g) may form the basis for an ex parte rejection if (1) the subject matter has been actually reduced to practice by another before the applicant’s invention AND (2) there has been no abandonment, suppression or concealment (Amgen v. Chugai, 927 F.2d 1200 (Fed. Cir. 1991)). Neither a prior U.S. application (3) nor a granted patent (4) is required.',
  },
];

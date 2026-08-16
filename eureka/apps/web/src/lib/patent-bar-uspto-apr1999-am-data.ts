/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — April 21, 1999, MORNING (AM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo499aq.pdf / edo499aa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files here):
 *  - Stems and options are VERBATIM, in the official order (A)-(E). Verbatim
 *    includes the booklet's own typographical slips (e.g. Q1's "(A),(B), and
 *    (C)" with no space, Q28's "35 U.S.C § 119(e)" with no period after the C,
 *    Q34's claim reciting "receiving steam from said steam" and "an inner
 *    having raised surface projections").
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * Keys were produced by `scripts/audit-uspto-ingest.mjs` over the model-answer
 * text and then re-checked one by one against the answer-key page scans.
 *
 * OCR CAVEAT worth recording for anyone re-running the audit: the text layer
 * of the model answers renders Q11's key as "(B)". The page scan (ama-2.png)
 * plainly reads "(E) is the correct answer. MPEP § 1400.1.[p. 1400-1]", and
 * (E) — "(I), (II), (IV), and (V)" — is the only choice that omits the CPA,
 * which the same paragraph says cannot correct an issued patent. The key here
 * is (E). The audit will therefore report one key diff on Q11, plus Q9, Q10,
 * Q15, Q21 and Q43 as "unparsed" (their entries are legible on the scans:
 * 9(D), 10(B), 15(E), 21(C), 43(A)). No other diffs are expected.
 *
 * DISCARDED: none — all 50 delivered questions are scoreable.
 *
 * MULTI-KEYED: none.
 *
 * MODEL-ANSWER QUIRKS preserved rather than cleaned up:
 *  - Q22's model answer cites "37 CFR § 10.510(b)" where it means § 1.510(b).
 *  - Q28's model answer keys (D) and then lists (D) among the incorrect
 *    choices ("(A), (B), (C) and (D) are incorrect"). The ANSWER line governs:
 *    the item is keyed to (D), and the slip is noted in the explanation.
 *  - Q31's model answer discusses "Questions 61 and 62" — an artifact of the
 *    question bank this paper was assembled from; it means Questions 30 and 31.
 *  - Q41's answer line reads "(E) All of the above."
 *
 * ERA NOTES. This paper predates both the AIPA (1999-2000) and the AIA (2011),
 * so much of what it tests is now repealed or rewritten. Items turning on
 * pre-AIA § 102 practice carry [Pre-AIA]; superseded procedure carries
 * [Historical practice]. In particular:
 *  - Q6, Q15, Q27, Q28, Q32 and Q49 apply the pre-AIA §§ 102(a)/(b)/(e)/(g)
 *    framework, including its "in this country" geographic limits.
 *  - Q11 (choice III) and Q47 turn on continued prosecution application (CPA)
 *    practice, eliminated for utility applications in 2003.
 *  - Q21, Q30, Q42, Q43 and Q48 use the pre-AIA § 112 paragraph numbering
 *    ("first paragraph", "second paragraph", "fourth paragraph").
 *  - Q9, Q34, Q37 and Q48 apply the pre-2003 37 C.F.R. § 1.121 amendment
 *    format (bracketed deletions, underlined insertions, five-word limit).
 *  - Q17, Q19 and Q23 apply the 37 C.F.R. Part 10 PTO Code of Professional
 *    Responsibility, replaced by the Part 11 Rules of Professional Conduct.
 *  - Q10 applies the 1999-era PCT national-stage deadlines and § 1.495.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR1999_AM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'April 21, 1999',
  session: 'Morning (AM)',
  questionsFile: 'edo499aq.pdf',
  answersFile: 'edo499aa.pdf',
  totalDelivered: 50,
  discarded: [] as number[],
  multiKeyed: [] as number[],
  ingested: 50,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_APR1999_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr99-am-01',
    topicId: 3,
    subtopic: 'Unsigned reply and objectionable remarks — why an amendment is not entered',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] P, a registered patent practitioner, filed a reply to a first Office action which rejected all claims under 35 U.S.C. § 102(a) based on an earlier patent granted to Z. The Office Action was dated September 15, 1998 and set a three month shortened statutory period for reply. P’s unsigned reply, filed February 3, 1999, did not include a petition for an extension of time and contained only the following paragraph: “Applicant respectfully spits on the ludicrous position taken by the Examiner in rejecting all claims under 35 U.S.C. § 102(a) based on an invalid patent granted to Z. Applicant may be willing to overlook the Examiner’s stupidity in making this rejection since it is possible that the Examiner was unaware that Z is a bum and a thief who stole Applicant’s invention. Applicant has renumbered the claims and has attached a copy of Z’s patent with notations made thereon. Applicant respectfully requests that the Examiner “WAKE UP” and take another look at Applicant’s claims in light of these remarks. Please charge my deposit account number 99-1234 to cover the cost of any required fees.” P should not be surprised when the amendment is not entered because:',
    options: [
      'The reply was not signed.',
      'An amendatory paper determined to contain objectionable remarks will be returned to the sender.',
      'P did not file a petition for an extension of time.',
      '(A) and (B) are correct.',
      '(A),(B), and (C) are correct.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because (A) and (B) are both correct. 37 CFR § 1.3; MPEP §§ 714.19, items (E),(K); 714.25. (C) is not correct because 37 CFR § 1.136(a)(3) provides that “[a]n authorization to charge all required fees, fees under § 1.17, or all required extension of time fees will be treated as a constructive petition for an extension of time in any concurrent or future reply requiring a petition for an extension of time under this paragraph for its timely submission.” Answer (E) is not correct because (C) is not correct. [Historical practice] — decided under the 1999-era §§ 1.3/1.136 fee and petition rules.',
  },
  {
    id: 'uspto-apr99-am-02',
    topicId: 3,
    subtopic: 'Restriction requirement — a provisional election must be made even when traversing',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On August 20, 1998, you filed in the PTO a patent application which claims a new pharmaceutical compound and a method of using the pharmaceutical compound to treat obesity. On January 29, 1999, you received a restriction requirement from the examiner requiring election between the following groups of claims: group (I), directed to the product; and group (II), directed to the method of use. Which of the following statements, if any, is not a proper reply to the restriction requirement?',
    options: [
      'You file a written reply provisionally electing the claims of group I, with traverse, and set forth the reasons why you believe the restriction requirement is improper.',
      'You file a written reply electing the claims of group I for prosecution on the merits, and an amendment canceling the method claims of group II.',
      'You file a written reply traversing the restriction requirement, and setting forth specific reasons why you believe the restriction requirement is improper.',
      'You file a written reply electing the claims of group I for prosecution on the merits, without traverse of the restriction requirement.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.143; MPEP § 818.03(b). No invention is elected in (C). A provisional election must be made in response to a restriction requirement, even if the restriction requirement is traversed. MPEP § 818.03(b). (A), (B), and (D) are incorrect because they are all proper responses to a restriction requirement. MPEP § 818.03. (E) is incorrect because it includes (C) which is a correct answer.',
  },
  {
    id: 'uspto-apr99-am-03',
    topicId: 6,
    subtopic: 'Design patents — broken lines, icons, type fonts and the design search',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements regarding design patents are not true?',
    options: [
      'A design patent and a trademark may be obtained on the same subject matter.',
      'A design patent claim for type fonts will be rejected for failure to comply with the “article of manufacture” requirement.',
      'A computer-generated icon must be embodied in a computer screen, monitor, or other display panel to satisfy 35 U.S.C. § 171.',
      'The claimed design is shown by solid lines in the drawing. It is not permissible to show any portion of the claimed design in broken lines.',
      'Novelty and unobviousness of a design claim must generally be determined by a search in the pertinent design classes. It is mandatory that the search be extended to the mechanical classes encompassing inventions of the same general type.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer because it contains a false statement regarding design patents. MPEP § 1504.01(a), subsection III. [p.1500-11] (A) is a true statement. MPEP § 1512, subsection III. [p.1500-38]. (C) is true. MPEP § 1504.01(a), subsection I.A.[p.1500-10] (D) is also a true statement. MPEP § 1503.03 [p. 1500-8]. (E) is true. MPEP § 1504.',
  },
  {
    id: 'uspto-apr99-am-04',
    topicId: 5,
    subtopic: 'Reexamination — no broadening of claim scope after the patent issues',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] During a reexamination proceeding, the patent owner seeks to amend Claim 1 as follows: “1.(amended) A [knife] cutting means having a handle portion and a serrated blade.” All changes in the claim are fully supported by the original patent disclosure. Should the claim, as amended, be rejected?',
    options: [
      'Yes, because the amendment broadens the scope of the claim of the patent.',
      'No, because the claim is fully supported by the original patent disclosure.',
      'No, because the amendment does not add new matter into the claim.',
      'No, because the amendment narrows the scope of the patent.',
      'Yes, because the claim has not been amended in accordance with PTO rules for amending patent claims.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 305; 37 CFR § 1.530(d)(3); MPEP §§ 2250; 2258 subsection III. (“A broadened claim: A claim is broader than another claim if it is broader (greater in scope) ‘in any respect,’ even though it may be narrower in other respects. In re Freeman, 30 F.3d 1459, 1464, 32 USPQ2d 1444, 1447 (Fed. Cir. 1994).”) The claim is broadened by changing “knife” to “cutting means,” which is not limited to a knife, but may be a blade, scissors, etc.',
  },
  {
    id: 'uspto-apr99-am-05',
    topicId: 2,
    subtopic: '37 C.F.R. § 1.48(a) — what an inventorship correction must contain',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On February 13, 1998, practitioner Wally filed a complete nonprovisional application for patent, filing fee, and an executed oath under 37 CFR § 1.63 in the PTO identifying inventors A and B by their full names, and providing their residence, post office addresses, and citizenship. A and B have assigned their application to XYZ Corporation who Wally represents. Two weeks after the filing of the patent application, XYZ sends Wally a letter informing him that due to an oversight, a third inventor, C, should be added to the joint inventorship. Which of the following is the most proper procedure for correcting the inventorship of the patent application?',
    options: [
      'File a new oath signed by C, and file an amendment adding C as an inventor along with a statement of facts by C noting that the omission of him as an inventor was without deceptive intent and establishing when the error was discovered and how it occurred.',
      'File a new oath signed by A, B, and C, and file an amendment adding C as an inventor along with a verified statement of facts by C noting that the omission of him as an inventor was without deceptive intent and establishing when the error was discovered and how it occurred.',
      'File a new oath signed by A and B, and file an amendment adding C as an inventor along with the written consent of the assignee and a statement of facts verified by A and B noting that the omission of C as an inventor was without deceptive intent and establishing when the error was discovered and how it occurred along with payment of the petition fee.',
      'File a new oath signed by A and B, and file an amendment adding C as an inventor along with the written consent of the assignee and a petition with the appropriate fee giving a verified statement of facts by A and B noting that the omission of C as an inventor was without deceptive intent and establishing when the error was discovered and whether they had reviewed and understood the contents of the specification including the claims as amended by any amendment specifically referred to in the oath or declaration and whether they had reviewed the oath or declaration prior to its execution and if so, how the error had occurred in view of such reviews.',
      'File a new oath signed by A, B, and C, and file an amendment adding C as an inventor along with the written consent of the assignee, a petition, the appropriate fee, and a statement from C that the inventorship error occurred without deceptive intention.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.48; MPEP § 201.03. Under 37 CFR § 1.48(a), if the correct inventor or inventors are not named in an executed oath or declaration under 37 CFR § 1.63 in a nonprovisional application, the application may be amended to name only the actual inventors so long as the error occurred without any deceptive intention. Section 1.48(a) requires that the amendment be accompanied by (1) a petition including a statement from each person being added that the error in inventorship occurred without deceptive intention on his or her part; (2) an oath or declaration by each actual inventor as required by 37 CFR § 1.63; (3) the fee set forth in 37 CFR § 1.17(i); and (4) the written consent of any existing assignee, if any of the originally named inventors has executed an assignment. (A), (C) and (D) are incorrect inasmuch as an oath or declaration under 37 CFR § 1.63 by each actual inventor has not been presented. (B) is incorrect because it does not include the fee required and omits the written consent of the assignee. (E) is in accord with MPEP § 201.03 [p.200-6], which provides that “[t]he statement required from each inventor being added may simply state that the inventorship error occurred without deceptive intention. The statement need not be a verified statement.” [Historical practice] — the pre-AIA § 1.48 deceptive-intent and consent requirements no longer apply.',
  },
  {
    id: 'uspto-apr99-am-06',
    topicId: 0,
    subtopic: 'Express Mail on a Saturday preserves provisional copendency against a § 102(b) bar',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On January 7, 1998, your client published an article containing a complete and enabling disclosure of a new pharmaceutical compound she developed. On February 6, 1998, you prepared and filed in the PTO a provisional application for the client containing an enabling disclosure of the pharmaceutical compound disclosed in the publication. The provisional patent application was filed by depositing it directly with the United States Postal Service via “Express Mail Post Office to Addressee.” On Saturday, February 6, 1999, you deposit a complete, nonprovisional U.S. patent application directly with the U.S. Postal Service via “Express Mail Post Office to Addressee.” The nonprovisional application claims the new pharmaceutical compound and claims priority to the filing date of the provisional application under 35 U.S.C. § 119(e). The nonprovisional application is received in the PTO mailroom on Tuesday, February 9, 1999. The claims to the pharmaceutical compound are:',
    options: [
      'Patentable over your client’s article. The effective filing date of the complete nonprovisional application is February 6, 1998.',
      'Unpatentable. The effective filing date of the complete nonprovisional application is February 9, 1999, and thus the claims to the compound are barred by the publication of your client’s article more than one year before the complete nonprovisional application’s effective filing date.',
      'Unpatentable over your client’s article because the article is prior art under 35 U.S.C. § 102(a).',
      'Patentable over your client’s article. The effective filing date of the complete nonprovisional application is Monday, February 8, 1999. However, because the article was written by the inventor, the inventor can swear behind the article’s publication date.',
      'Unpatentable. The effective filing date of the complete nonprovisional application is February 9, 1999, and thus the claims to the compound are barred by the publication of your client’s article more than one year before the complete application’s effective filing date.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 102(b). The nonprovisional application deposited via Express Mail on Saturday, February 6, 1999, will be given a February 6, 1999, filing date. 37 CFR § 1.10; MPEP §§ 513; 201.04(b) [p. 200-14]. As such, the nonprovisional application was filed on the last day of pendency of the provisional application so as to claim an effective filing date of February 6, 1998. MPEP §§ 201.04(b); 706.02. [Pre-AIA] — turns on the pre-AIA § 102(b) one-year grace period measured from the effective filing date.',
  },
  {
    id: 'uspto-apr99-am-07',
    topicId: 0,
    subtopic: '§ 103 — a newly discovered property does not defeat a prima facie case',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A patent application claims a chemical composition and discloses in the application that the composition has a cleansing property in addition to being able to remove ink stains. The examiner rejected the claims in the application under 35 U.S.C. § 103 as being obvious over Parker in view of Cross. Each reference discloses chemical compositions which can be used to remove ink stains. The proposed combination of references includes all the limitations of the composition claimed in the application. However, neither reference shows nor suggests the cleansing property newly discovered by applicant. Does the combination of Parker and Cross support a prima facie case of obviousness?',
    options: [
      'Yes, even though neither reference shows or suggests the newly discovered property of the claimed composition.',
      'Yes, because after reading applicant’s specification, it would be obvious that both references can be combined to achieve the cleansing property claimed by applicant.',
      'No, unless in addition to structural similarity between the claimed and prior art compositions, the references contain a suggestion that the compositions will have the newly discovered cleansing property.',
      'No, because the discovery of a new property of a previously known composition imparts patentability to the known composition.',
      'No, because the burden of proof cannot be shifted to the applicant to show that the prior art compositions lacked the newly discovered property asserted for claimed composition unless one of the references discloses the property.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 103; MPEP §§ 2112.01; 2144; 2145, paragraph II; In re Dillon, 919 F.2d 688, 16 USPQ2d 1897 (Fed. Cir. 1990) and In re Spada, 911 F.2d 705, 15 USPQ2d 1655 (Fed. Cir. 1990). The rationale to modify or combine the prior art does not have to be expressly stated in the prior art. MPEP § 2144. (B) is not correct because knowledge of applicant’s disclosure cannot be relied upon to provide the motivation to combine the references relied upon. MPEP §§ 2142; 2144.04 [p.2100-120]. (C) is incorrect. It is not necessary that the prior art suggest the combination to achieve the same advantage or result discovered by applicant. MPEP § 2144. (D) is incorrect. The discovery of a new property or use of a previously known composition, even if unobvious from prior art, cannot impart patentability to a claimed composition. MPEP § 2112. (E) is incorrect. MPEP § 2112 [p. 2100-48].',
  },
  {
    id: 'uspto-apr99-am-08',
    topicId: 3,
    subtopic: 'First-action final rejection in a substitute application',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] An original application was prosecuted through final rejection. All of the claims in the original application were properly rejected by the examiner as being obvious over two patent references. The applicant allows the application to go abandoned without replying to the final rejection. Two years after the abandonment, the applicant files a substitute application in which all of the claims are identical to those in the original application. The examiner ____ make a final rejection in the substitute application in the first Office action on the merits ______.',
    options: [
      'can ... provided any assignment in the original application has been applied to the substitute application',
      'can ... because the claims would have been properly finally rejected in the next Office action on the grounds of rejection and the same art of record in the original patent application',
      'can ... because the substitute application is entitled to the filing date of the original application',
      'cannot ... because applicant is entitled to a new search and further consideration of the claims presented in the substitute application',
      'cannot ... because the substitute application does not identify and make reference to the original application',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. MPEP §§ 201.09; 706.07(b).',
  },
  {
    id: 'uspto-apr99-am-09',
    topicId: 3,
    subtopic: 'Supplemental amendment — restoring subject matter of a canceled claim',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In a first Office action dated March 18, 1999, the examiner rejected Claim 1 under 35 U.S.C. § 103 and objected to Claim 2 as being dependent upon a rejected claim. The examiner stated that Claim 2 would be allowable if the subject matter of Claim 2 was rewritten in independent form to include all the limitations of Claim 1. On April 6, 1999, after consulting with your client, you filed an amendment canceling Claim 2 and incorporating the subject matter of Claim 2 into Claim 1. Two weeks later, your client has changed his mind and now desires to traverse the rejection of Claim 1 without incorporating the subject matter of Claim 2 into Claim 1. Which of the following would be the most appropriate procedure to take under the circumstances?',
    options: [
      'Advise your client that there is nothing you can do until a reply is due for the next Office action.',
      'Immediately file a supplemental amendment traversing the rejection of Claim 1 and requesting that Claim 2 be reinstated.',
      'Immediately file a supplemental amendment adding a claim identical to canceled Claim 2. The new claim should be underlined in its entirety with the parenthetical expression (amended) following the original claim number 2.',
      'Immediately file a supplemental amendment adding a new Claim 3 which is identical to original Claim 2, amend Claim 1 to delete the subject matter added by the April 6, 1999, amendment, and traverse the rejection of Claim 1.',
      'Immediately file a supplemental amendment adding a new Claim 3 which is identical to original Claim 2, adding a new Claim 4 which is identical to original Claim 1, cancel amended Claim 1, and traverse the rejection of Claim 1.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR § 1.121(a)(2)(ii); MPEP §§ 714.22; 714.24; 608.01(s). [Historical practice] — applies the pre-2003 § 1.121 amendment format (a canceled claim number is not reused; new matter is added as a new, higher-numbered claim).',
  },
  {
    id: 'uspto-apr99-am-10',
    topicId: 4,
    subtopic: 'PCT — what must be filed to enter the U.S. national stage',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Your client informs you that he has filed an international application in the United States Receiving Office and timely elected and designated the United States. Your client now wishes you to file the necessary documents to enter the U.S. national stage prior to April 27, 1999, the 30 month deadline for entering the national stage. Which of the following actions should you take to obtain the benefit of the international filing date prior to April 27, 1999?',
    options: [
      'File only the oath or declaration since that is all that is required for entry into the U.S. national stage.',
      'File a copy of the international application in the PTO if a copy has not been provided by the International Bureau, and a cover letter instructing that the U.S. national filing fee be deducted from your deposit account.',
      'File a request to enter the national stage with the PTO identifying the international application.',
      'File a paper with the PTO identifying the international application, and asking that the PTO send you a bill for the U.S. national filing fee.',
      'File a request that the International Bureau send all the necessary papers and the fee to the PTO, and send a new oath or declaration signed by your client.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR § 1.495(b); MPEP § 1893.01(b)(1). [Historical practice] — applies the 1999-era § 1.495 national-stage requirements and the then-current 20/30-month deadline structure.',
  },
  {
    id: 'uspto-apr99-am-11',
    topicId: 5,
    subtopic: 'Correcting an issued patent — reissue, disclaimer, reexamination, certificate of correction',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Newly registered patent practitioner, Andy, is working at a large patent law firm. Supervising patent attorney, Pat, asks Andy to prepare a short memo which addresses the manner in which an issued patent may be corrected and/or amended. To fully respond to Pat’s request, which of the subjects set forth below should Andy include in the following sentence: “An issued patent may be corrected by ____”? (I) filing for reissue; (II) filing a disclaimer; (III) filing a Continued Prosecution Application; (IV) filing a request for reexamination; (V) filing a certificate of correction.',
    options: [
      '(I), (II), (III), (IV), and (V)',
      '(I), (II), (III), and (V)',
      '(I) and (IV)',
      '(V) only',
      '(I), (II), (IV), and (V)',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 1400.1.[p. 1400-1] A Continued Prosecution Application is a request to expressly abandon a prior application. It cannot be used to correct an issued patent. MPEP § 201.06(d). [Historical practice] — CPA practice under § 1.53(d) was eliminated for utility applications in 2003 (RCE practice replaced it).',
  },
  {
    id: 'uspto-apr99-am-12',
    topicId: 4,
    subtopic: 'Perfecting foreign priority — certified copy plus translation, filed in time',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Inventor X, a citizen of Germany, invented a new stapler in Germany on July 25, 1997. On January 22, 1998, X filed a patent application for the stapler in the German Patent Office. On January 22, 1999, you filed a complete U.S. patent application in the PTO claiming a stapler on behalf of X. The U.S. application was filed with a declaration under 37 CFR § 1.63 signed by X claiming foreign priority of the German patent application. In an Office action dated April 16, 1999, and setting a three month shortened statutory period for reply, the primary patent examiner properly rejected all the claims in the U.S. patent application as being anticipated under 35 U.S.C. § 102(a) by the disclosure in magazine articles describing how to make and use an identical stapler. The articles were published in the United States in February 1998, and in Great Britain in March 1998. Which of the following actions are in accord with proper PTO practice and procedure, and represent the most appropriate actions for overcoming the rejection?',
    options: [
      'File a petition to have the Commissioner exercise his supervisory authority and withdraw the rejection stating that the references cannot be properly used inasmuch as the declaration under 37 CFR § 1.63 makes clear that the application inventor X filed in the German Patent Office antedates the articles.',
      'File a reply on or before July 16, 1999, which argues that the references cannot be used because the application inventor X filed in the German Patent Office antedates the articles.',
      'On or before July 16, 1999, file a certified copy of the German application, an English translation of the German application, and point out that the references are no longer available as prior art.',
      'File an affidavit under 37 CFR § 1.132 signed by you stating that the references cannot be used because the application which inventor X filed in the German Patent Office antedates the articles.',
      'On or before July 16, 1999, file a certified copy of the German application, and an English translation of the German application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 119(b); 37 CFR §§ 1.55 and 1.111(b); MPEP § 201.13. [Pre-AIA] — the rejection is under pre-AIA § 102(a), which a perfected § 119 priority claim antedates.',
  },
  {
    id: 'uspto-apr99-am-13',
    topicId: 1,
    subtopic: 'Claim interpretation — the abstract is not used to interpret claim scope',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] All of the following portions of an application can be used for interpreting the scope of the claims except the ____________',
    options: [
      'description of the preferred embodiment.',
      'abstract of the disclosure.',
      'background of the invention.',
      'drawings.',
      'detailed description of the drawings.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR § 1.72(b); MPEP § 608.01(b).',
  },
  {
    id: 'uspto-apr99-am-14',
    topicId: 0,
    subtopic: '§ 1.132 evidence against a § 103 rejection — nexus and unexpected results',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Smith discovered that a tungsten carbide insert for a metal cutting tool may be bonded (with a far superior bond strength over other known methods of attachment) to a steel tool holder. Smith filed a patent application containing two claims: (1) a method of bonding a carbide insert to a steel tool holder comprising providing a layer of polystick at the interface of the holder and insert, heating the holder, insert, and polystick to a temperature of 250°F. and thereafter cooling them at a rate of between 12 and 13°F. per hour until a temperature of 120°F. is reached; and (2) a carbide insert bonded to a steel holder by the method of Claim 1. The examiner rejected Claim 1 under 35 U.S.C. § 103 as being unpatentable over a U.S. patent to Y in view of a British patent to Z. The examiner rejected Claim 2 under 35 U.S.C. § 102(b) as being anticipated by the patent to Y. The patent to Y teaches that a tungsten carbide insert is bonded to a steel tool holder by utilizing a layer of polystick at the interface of the insert and holder, but makes no mention of any particular temperatures. The patent to Z teaches that in a grinding tool, diamond chips may be “securely fastened” to a ceramic holder by applying a layer of polystick at the interface of the diamonds and holder, heating the holder, chips, and polystick to a temperature of 150°F. and thereafter “slowly” cooling the holder. Which of the following, if any, if submitted with the reply to the Office action, would most likely overcome the examiner’s rejection of Claim 1?',
    options: [
      'Evidence that a gear cutting machine which includes a carbide insert bonded to a steel tool holder by the method set forth in Claim 1 is outselling all other such machines by a two-to-one margin.',
      'An affidavit by Smith that, in his opinion, the patent to Y is inoperative.',
      'Evidence that heavy advertising resulted in increased sales of Smith’s invention.',
      'An affidavit by Smith showing that the claimed method of bonding a carbide insert to a steel tool holder results in a bond which is 50 times greater than that of the invention disclosed in the patent to Y.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR § 1.132; MPEP § 716. (A) is not the most likely action which would overcome the rejection because there is no nexus to show that the claimed method of bonding the carbide insert is responsible for the increased sales of the gear cutting machine. MPEP § 716.01(b). (B) is not sufficient because it is not based on any factual evidence. MPEP § 716.01(c). (C) is not properly persuasive because it is an admission that the increased sales of Smith’s invention were attributed to heavy advertising and not because of the claimed invention. (E) is not correct because (D) is the correct answer. [Historical practice] — 1999-era § 1.132 affidavit practice.',
  },
  {
    id: 'uspto-apr99-am-15',
    topicId: 0,
    subtopic: 'Secondary considerations cannot overcome a § 102 anticipation rejection',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Smith discovered that a tungsten carbide insert for a metal cutting tool may be bonded (with a far superior bond strength over other known methods of attachment) to a steel tool holder. Smith filed a patent application containing two claims: (1) a method of bonding a carbide insert to a steel tool holder comprising providing a layer of polystick at the interface of the holder and insert, heating the holder, insert, and polystick to a temperature of 250°F. and thereafter cooling them at a rate of between 12 and 13°F. per hour until a temperature of 120°F. is reached; and (2) a carbide insert bonded to a steel holder by the method of Claim 1. The examiner rejected Claim 1 under 35 U.S.C. § 103 as being unpatentable over a U.S. patent to Y in view of a British patent to Z. The examiner rejected Claim 2 under 35 U.S.C. § 102(b) as being anticipated by the patent to Y. The patent to Y teaches that a tungsten carbide insert is bonded to a steel tool holder by utilizing a layer of polystick at the interface of the insert and holder, but makes no mention of any particular temperatures. Which of the following, if any, if submitted with a reply to the Office action, would be most persuasive and most likely overcome the examiner’s rejection of Claim 2?',
    options: [
      'Evidence that a gear cutting machine which includes a carbide insert bonded to a steel tool holder as set forth in Claim 1 is outselling all other such machines by a two-to-one margin.',
      'An affidavit by Smith that, in his opinion, the patent to Z is inoperative.',
      'Evidence that heavy advertising resulted in increased sales of Smith’s invention.',
      'An affidavit by Smith showing that there is a long felt need in the industry for Smith’s carbide insert to a steel tool holder.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP §§ 2131.04; 706.02(b). Claim 2 was rejected as being anticipated by the patent to Y. As set forth in MPEP § 706.02(b), a rejection based on 35 U.S.C. § 102(b) can be overcome by “(A) Persuasively arguing that the claims are patentably distinguishable from the prior art; or (B) Amending the claims to patentably distinguish over the prior art.” Evidence of secondary considerations is irrelevant to § 102 rejections and thus cannot overcome a rejection so based. MPEP § 2131.04, citing In re Wiggins, 488 F.2d 538, 543; 179 USPQ 421, 425 (CCPA 1973). [Pre-AIA] — the rejection is under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-apr99-am-16',
    topicId: 1,
    subtopic: 'Claim drafting — support in the specification and multiple dependent claims',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Pete the patent practitioner is preparing a patent application for his client, Perry. The invention is disclosed in the specification as a pickle machine comprising A, B, and means C for performing a function. The specification discloses two specific embodiments for performing the function defined by means C, namely C\' and C". The specification also discloses that components D or E may be combined with A, B, and means C to form A, B, means C, and D, or to form A, B, means C and E. The specification further discloses that component G may be used with only means C\', and then only if components D and E are not present. The first three claims in the application are as follows: 1. A pickle machine comprising A, B and means C for performing a function. 2. A pickle machine as claimed in Claim 1, wherein means C is C\'. 3. A pickle machine as claimed in Claim 1 or 2 further comprising D. Which of the following would be a proper claim 4 and be supported by the specification?',
    options: [
      'A pickle machine consisting essentially of A, B, means C\' for performing a function, D, and G.',
      'A pickle machine as claimed in Claim 2, further comprising E.',
      'A pickle machine as claimed in Claim 1, further comprising D.',
      'A pickle machine as claimed in Claim 2 or 3, wherein means C is C", and further comprising G.',
      'A pickle machine as claimed in Claims 1, 2 or 3, further comprising G.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR §§ 1.75(b); 1.75(c). (A) is not supported by the specification. (C) is not correct because it does not differ substantially from Claim 3. MPEP § 706.03(k). (D) and (E) are not supported by the specification. Also, (D) and (E) are multiple dependent claims which are dependent on Claim 3, another multiple dependent claim.',
  },
  {
    id: 'uspto-apr99-am-17',
    topicId: 7,
    subtopic: 'Advertising under the PTO Code of Professional Responsibility',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a sole patent practitioner. You have just finished reading the opinion of the Court of Appeals for the Federal Circuit in State Street Bank & Trust Co. v. Signature Financial Group, Inc., wherein the Federal Circuit held that patent claims directed to “a data processing system for managing a financial services configuration of a portfolio . . .” were directed to statutory subject matter under 35 U.S.C. § 101. Convinced that your background as a computer programmer and electrical engineer will now be more in demand as a result of the State Street Bank decision, you decide to place an advertisement in PC Magazine. Your advertisement reads as follows: “INVENTOR NEWSFLASH!!! The highest patent court in the land has just ruled that computer programs can be patented. Don’t miss this opportunity to make millions on your invention. To obtain a patent at a reasonable cost, call 1-888-DO IT NOW! Free initial consultation.” Would your advertisement violate the PTO Code of Professional Responsibility?',
    options: [
      'Yes. Free consultations are not permitted.',
      'No. You have not given anything of value to PC Magazine for recommending your services.',
      'No. The PTO Code of Professional Responsibility permits advertising in magazines.',
      'Yes. The advertisement does not indicate that you are a registered patent agent.',
      'Yes. The advertisement does not include your name.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 10.32(c). [Historical practice] — the 37 C.F.R. Part 10 PTO Code of Professional Responsibility has been replaced by the Part 11 USPTO Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr99-am-18',
    topicId: 2,
    subtopic: 'Provisional pendency — filing date of the provisional and a Saturday Express Mail deposit',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Inventors Beavis and Barbara mailed their complete provisional patent application to the PTO via first class mail on Tuesday, January 13, 1998, with a certificate of mailing. The application was received in the PTO on Friday, January 16, 1998. In late December 1998, Beavis and Barbara acquired financing for their invention. Encouraged by their good fortune, Beavis and Barbara hire a patent attorney to file a patent application for them. It is Monday, January 4, 1999, and you are the patent attorney hired by Beavis and Barbara. What is the latest date that a nonprovisional patent application can be filed claiming the benefit of Beavis and Barbara’s earlier filed provisional patent application?',
    options: [
      'Saturday, January 16, 1999, via “Express Mail” date stamped as such in accordance with 37 CFR § 1.10.',
      'Tuesday, January 13, 1999, via “Express Mail” date stamped as such in accordance with 37 CFR § 1.10.',
      'Tuesday, January 13, 1999, via hand delivery to the PTO.',
      'Friday, January 15, 1999, via facsimile transmission.',
      'Friday, January 15, 1999, with a certificate of mailing.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 201.04(b). The filing date of the provisional application is January 16, 1998, the date the complete provisional application was received in the PTO. 35 U.S.C. § 111(b)(4). The last day of pendency is therefore January 16, 1999, a Saturday. MPEP § 201.04(b) states that “[s]ince a provisional application can be pending for no more than 12 months, if the last day of pendency is on a Saturday, Sunday, or Federal holiday, copendency would require that the later filed nonprovisional application be filed on or prior to the Saturday, Sunday, or Federal holiday. See 37 CFR 1.78(a)(3).” However, “if a new patent application is deposited in ‘Express Mail’ in accordance with 37 CFR 1.10 on a Saturday and the United States Postal Service gives it a date of deposit of Saturday, the Office will accord and stamp the correspondence with the Saturday date. 37 CFR 1.6(a)(2).” Answers (B) and (C) are not the latest date. Answers (D) and (E) are incorrect because patent applications cannot be filed by facsimile, nor can a certificate of mailing be used. See 37 CFR §§ 1.6(d)(3); 1.8(a)(2)(i)(A). [Historical practice] — 1999-era § 1.78(a)(3) copendency and § 1.10 Express Mail practice.',
  },
  {
    id: 'uspto-apr99-am-19',
    topicId: 7,
    subtopic: 'Representations to the PTO — signature requirement, no duty to search',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements, if any, are true regarding representations to the Patent and Trademark Office under 37 CFR § 10.18 and 37 CFR § 1.4(d)(2)? (I) Practitioners are required to advise clients regarding the sanctions which apply for knowingly and willfully concealing a material fact in papers submitted to the PTO. (II) Every paper filed by a practitioner must be personally signed by the practitioner, except those required to be signed by the applicant or party. (III) Applicant has a duty to conduct a prior art search as a prerequisite to filing an application for patent.',
    options: [
      'I and II.',
      'I only.',
      'II only.',
      'I, II, and III.',
      'III only.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 10.18(a); MPEP § 402 (pp. 400-3). Statement (I) is not true because practitioners are not required to advise their clients regarding sanctions. MPEP § 410 (pp.400-30). Statement (III) is also not true. As set forth in MPEP § 410, “an applicant has no duty to conduct a prior art search as a prerequisite to filing an application for patent.” Accordingly, answers (A), (B), (D) and (E) are incorrect. [Historical practice] — 37 C.F.R. § 10.18 has been superseded by the Part 11 rules.',
  },
  {
    id: 'uspto-apr99-am-20',
    topicId: 2,
    subtopic: 'Benefit claims — a broken copendency chain forfeits the earlier filing dates',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A parent application A was filed on September 9, 1988, and became abandoned on October 19, 1993. Application B was filed on October 21, 1993, and referred to application A as well as claimed the benefit of the filing date of application A. Application B issued as a patent on June 17, 1997. Application C was filed on October 29, 1993, and referred to application B as well as claimed the benefit of the filing date of application B. Application D was filed on December 20, 1996. Application D referred to application B and claimed the benefit of the filing date of application B. Both applications C and D were abandoned on July 22, 1998. Application E was filed on July 22, 1998 and is drawn to the same invention as claimed in applications C and D. Application E claims the benefit of the filing dates of applications A, B, C, and D, and makes reference to all preceding applications. The earliest effective filing date of application E with respect to any common subject matter in the prior applications is:',
    options: [
      'October 21, 1993',
      'December 20, 1996',
      'October 29, 1993',
      'September 9, 1988',
      'July 22, 1998',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. There is no copendency between application E and any prior application. MPEP § 201.11 (“If the first application is abandoned, the second application must be filed before the abandonment in order for it to be co-pending with the first.”). See MPEP § 710.01(a), fourth paragraph.',
  },
  {
    id: 'uspto-apr99-am-21',
    topicId: 1,
    subtopic: '§ 112 first paragraph — written description does not support an undisclosed shape',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Mike, an avid cyclist, has developed an invention relating to a bicycle having a “shaped handlebar” which provides improved aerodynamic properties for the bicycle. The invention is described in Mike’s pending U.S. patent application. The “shaped handlebar” is disclosed as being “Y” shaped. The application as filed, however, contained only a single claim (Claim 1) to the bicycle having a “shaped handlebar”. Claim 1 was properly rejected under 35 U.S.C. § 102(b) as anticipated by a U.S. patent to Lois which discloses a “V” shaped handlebar on a bicycle. Claim 1 was amended to add a bicycle wheel structure not disclosed or suggested by the Lois patent. Dependent Claims 2 and 3 were added to add further limitations to the invention. Claim 2 is dependent from Claim 1 and further defined the handlebar as being “Y” shaped. Claim 3 is also dependent from Claim 1 and further defined the handlebar as being “U” shaped. Which of the following statements is true?',
    options: [
      'Claim 3 would be unpatentable under the second paragraph of 35 U.S.C. § 112 as being indefinite.',
      'Claim 2 would be unpatentable under the fourth paragraph of 35 U.S.C. § 112 because it does not further limit the subject matter of independent Claim 1.',
      'Claim 3 would be unpatentable under the first paragraph of 35 U.S.C. § 112 since the description requirement is not satisfied.',
      'Claim 2 would be unpatentable under 35 U.S.C. § 132 as being drawn to new matter.',
      'Claims 2 and 3 would be unpatentable under 35 U.S.C. § 102(b) as being anticipated by the Lois patent.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 112, first paragraph; MPEP § 2163. See Gentry Gallery Inc. v. Berkline Corp., 45 USPQ2d 1498 (Fed. Cir. 1998); In re Kaslow, 217 USPQ 1089 (Fed. Cir. 1983). (A) is incorrect. It is inconsistent with the given facts. (B) is incorrect. Claim 2 further limits claim 1 by limiting the shape of the handlebar. (D) is incorrect. There is no new matter in claim 2 inasmuch as the shape of the handlebar was disclosed in the specification. (E) is incorrect. The Lois patent does not describe a “Y” or “U” shaped handlebar. [Historical practice] — uses the pre-AIA § 112 paragraph numbering (now §§ 112(a), (b) and (d)).',
  },
  {
    id: 'uspto-apr99-am-22',
    topicId: 5,
    subtopic: 'Request for reexamination by the patent owner — required contents',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following does not have to be included as part of a request for reexamination of a patent filed by the patent owner?',
    options: [
      'The entire specification, claims, and drawings of the patent for which reexamination is requested in cut-up form.',
      'Proposed amendments to the patent claims for which reexamination is requested.',
      'A copy of every patent or printed publication relied upon as raising a substantial new question of patentability.',
      'A statement pointing out each substantial new question of patentability based on prior patents and printed publications.',
      'An identification of every claim for which reexamination is requested, and a detailed explanation of the pertinency and manner of applying the cited prior art to every claim for which reexamination is requested.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR § 1.510; MPEP §§ 2210; 2214. (A), (C), (D) and (E) are incorrect because they are required as specified in 37 CFR § 10.510(b)(1), (2), (3) and (4). [The model answer’s “§ 10.510(b)” is the booklet’s own slip for § 1.510(b).] [Historical practice] — this is ex parte reexamination as it stood in 1999.',
  },
  {
    id: 'uspto-apr99-am-23',
    topicId: 7,
    subtopic: 'Mandatory withdrawal after discharge, and the steps that must accompany it',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Grish, Dersh, and you are registered practitioners and partners in a law firm. You prepared and filed in the PTO a patent application for Inahurry, your client. Inahurry has successfully marketed the claimed invention. Financial success of the invention is a real possibility. The application was filed with a combined Declaration and Power of Attorney signed by Inahurry appointing you, Grish, and Dersh as Inahurry’s attorneys to prosecute the application. All of the claims in the application were rejected in the first Office action. After you filed a timely reply to the first Office action, the examiner issued a second Office action dated January 13, 1999, in which he made a final rejection of the claims, and set a three month shortened statutory period for reply. Promptly after receipt of the second Office action, you notified Inahurry of the action and possible replies. Inahurry, who is not well versed in patent practice and procedure, but who is dissatisfied with the course of prosecution with the application, sends you a letter dated April 5, 1999, discharging you, Grish, and Dersh. What are your ethical obligations as a result of Inahurry’s letter?',
    options: [
      'You must file with the Commissioner by July 13, 1999, a request to withdraw signed by you on behalf of yourself, Grish, and Dersh; and take reasonable steps to avoid foreseeable prejudice to Inahurry’s rights, including giving due notice to Inahurry of the request, the period for reply, the availability of extensions of time to reply and fees for the same, and delivery to Inahurry of all papers and property to which Inahurry is entitled, and refund any unearned fees.',
      'You must obtain from the Commissioner approval to withdraw at least thirty days before the expiration of the statutory period for reply, give due notice to Inahurry of the request, and deliver to Inahurry all papers and property to which Inahurry is entitled, and refund any unearned fees.',
      'You must continue to prosecute the application until Inahurry files a revocation of the power of attorney in the PTO and it is approved by the Commissioner.',
      'You have an ethical obligation to talk to Inahurry and find out why he is dissatisfied with your firm and to persuade him to let your firm continue to represent him before the PTO.',
      'You have an ethical obligation to continue to prosecute the application because Inahurry is not well versed in patent practice and procedure, and Inahurry’s financial success will depend on securing a patent.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR §§ 1.36; 10.40(a); 10.40(b)(4); MPEP § 402.06. (A) is incorrect. The timing is inconsistent with MPEP § 402.06. (C) and (E) are incorrect. 37 CFR § 10.40(b)(4). (D) is incorrect. The PTO Disciplinary Rules do not impose the “obligation” to inquire. [Historical practice] — the 37 C.F.R. Part 10 Disciplinary Rules have been replaced by the Part 11 rules.',
  },
  {
    id: 'uspto-apr99-am-24',
    topicId: 1,
    subtopic: 'Multiple dependent claims — alternative reference only, and no multiple-on-multiple',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] The first three claims in a pending patent application read as follows: 1. A widget comprising A, B, and C. 2. A widget as claimed in Claim 1, further comprising D. 3. A widget as claimed in Claims 1 or 2, further comprising E. The application further discloses element G which can be combined with any combination of elements A, B, C, D, and E to form the widget. Which of the following claims would be a correct form for Claim 4?',
    options: [
      'A widget as claimed in Claims 1, 2, and 3, further comprising G.',
      'A widget as claimed in Claim 2, further comprising D.',
      'A widget as claimed in Claim 3, further comprising D.',
      'A widget as claimed in Claims 1 or 2, further comprising G.',
      'A widget as claimed in Claims 1, 2, or 3, further comprising G.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR § 1.75(c); MPEP § 608.01(n). (A) is incorrect. The claim does not refer back in the alternative only. (B) and (C) are incorrect. They do not further limit the claims from which they depend, which already include D as an element. (E) is incorrect. Multiple dependent claim 3 serves as a basis for multiple dependent claim 4, which is not permitted. 37 CFR § 1.75(c), third sentence.',
  },
  {
    id: 'uspto-apr99-am-25',
    topicId: 3,
    subtopic: 'IDS timing under § 1.97 — the last day to file without a fee or statement',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Bert and Ernie are joint inventors of a widget that automatically adjusts television volume levels during commercial breaks. A nonprovisional patent application was filed on October 15, 1998, and a first Office action on the merits was mailed on January 11, 1999. A reply was filed on January 28, 1999, and a Notice of Allowance was mailed on February 26, 1999. The Issue Fee has not been paid. What is the last day that Bert and Ernie can file a properly drafted Information Disclosure Statement (IDS) without having to pay a fee and to ensure that the information submitted in the IDS would be considered by the examiner?',
    options: [
      'Friday, January 15, 1999, via facsimile with a Certificate of Transmission',
      'Sunday, January 10, 1999, via facsimile with a Certificate of Transmission',
      'Thursday, January 28, 1999, via first class mail with no Certificate of Transmission',
      'Friday, January 15, 1999, via “Express Mail Post Office to Post Office” with a Certificate of Express Mailing',
      'Thursday, February 25, 1999, via facsimile with a Certificate of Transmission but without a statement that each item cited in the IDS was cited in a communication from a foreign patent office in a counterpart foreign application not more than three months prior to submission of the IDS',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR § 1.97(b); MPEP § 609(B)(1) [p. 600-106]. (B) is not correct because it is not the latest date. (C) and (D) are incorrect. An Information Disclosure Statement (IDS) will be considered to have been filed on the day it was received in the Office, or on an earlier date of mailing if accompanied by a properly executed certificate of mailing or facsimile transmission. (C) did not include a certificate of mailing and (D) used an incorrect “Express Mail” service designation. 37 CFR § 1.10. (E) is incorrect because filing the IDS before the Notice of Allowance will require Bert and Ernie to pay the fee set forth in 37 CFR § 1.17(p) given that Bert and Ernie did not file a statement under 37 CFR § 1.97(e). An IDS filed pursuant to 37 CFR § 1.97(c) will be considered provided that the IDS is accompanied by either (1) a statement as specified in 37 CFR § 1.97(e); or (2) the fee set forth in 37 CFR § 1.17(p). MPEP § 609(B(2)) [pp. 600-106-107]. [Historical practice] — 1999-era § 1.97 windows and § 1.17(p) fee structure.',
  },
  {
    id: 'uspto-apr99-am-26',
    topicId: 0,
    subtopic: 'Where a double patenting issue can be raised',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A double patenting issue can be raised ____________ I. between two or more pending applications. II. in a reexamination proceeding. III. between a pending international application which has not yet entered the national stage in the United States and a patent. IV. between three pending applications and a patent.',
    options: [
      'I, II, III, and IV',
      'I, III, and IV',
      'I, II, and III',
      'I, II, and IV',
      'I and IV',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 804, subsection I (Instances where Double Patenting Issue Can Be Raised) [p.800-15]. III is not correct because “[d]ouble patenting does not relate to international applications which have not yet entered the national stage in the United States.” Id. (A), (B) and (C) are incorrect because they include III. (E) is not the most correct answer because it omits II, which is included in (D).',
  },
  {
    id: 'uspto-apr99-am-27',
    topicId: 0,
    subtopic: '§ 102(e) — an earlier-filed patent that discloses but does not claim the composition',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On April 3, 1997, Priscilla discovered a process for making a new composition by heating an aqueous mixture of a resin and a metal salt. Priscilla filed a patent application on July 28, 1997, which issued as a patent on January 19, 1999. The patent claims were directed only to the process for making the composition. Priscilla’s patent discloses, but does not claim, the composition. On September 19, 1998, Bruce discovered that Priscilla’s composition could be made by a different process comprising the steps of reacting a resin, a metal oxide, and an acid in a nitrogen atmosphere. On January 11, 1999, Bruce filed an application in the PTO which claims the composition and his method of making the composition. All work by Priscilla and Bruce was done in this country. Bruce’s work is independent of and not derived from Priscilla. Bruce and Priscilla have never been employed by the same employer. The examiner rejected Bruce’s composition claims over Priscilla’s patent under 35 U.S.C. § 102. The rejection is:',
    options: [
      'improper because Priscilla discloses a process which is different from the process used by Bruce to make the composition.',
      'proper because Priscilla’s composition was known by others in this country before the invention thereof by Bruce.',
      'improper because Bruce filed his application before Priscilla’s patent issued.',
      'proper because Priscilla discloses, but does not claim the composition, and has an earlier filing date than Bruce.',
      '(B) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 102(e). (B) is not correct because “known or used” implies knowledge that is publicly accessible. Priscilla’s composition was not publicly known. “The statutory language ‘known or used by others in this country’ (35 U.S.C. § 102(a)), means knowledge or use which is accessible to the public.” MPEP § 2132, subsection I. [p.2100-66] citing Carella v. Starlight Archery, 804 F.2d 135, 231 USPQ 644 (Fed. Cir. 1986). There are no given facts showing that Priscilla’s patent application was accessible to the public, 35 U.S.C. § 122, or that she disclosed her invention to the public before her patent issued. (A) is incorrect. Inasmuch as Priscilla’s patent is not being used to reject Bruce’s claimed process, the difference in their processes does not show any impropriety in the rejection. (C) is incorrect. 35 U.S.C. § 102(e). (E) is incorrect because (B) is incorrect. [Pre-AIA] — applies pre-AIA §§ 102(a)/(e), including the “in this country” limitation.',
  },
  {
    id: 'uspto-apr99-am-28',
    topicId: 2,
    subtopic: 'Abandoned provisional, revival, and an intervening publication that bars the claims',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Inventor Dan invented Y in the United States on February 5, 1998, and hired practitioner P to prepare and file a provisional application. On March 6, 1998, P filed a provisional patent application in the PTO. P received a Notice to File Missing Parts dated June 5, 1998, because the appropriate filing fee was not filed. The Notice set a period for reply which was two months from the date of the Notice. The filing fee and required surcharge were not filed in the PTO. The provisional patent application became abandoned. A Notice of Abandonment, dated August 10, 1998, was duly received by P’s secretary in P’s office, and P’s secretary placed the notice in Dan’s file. On March 3, 1999, Dan furnished P with a copy of a publication by Smith dated March 1, 1998, fully describing Y, and its method of manufacture. On March 4, 1999, P reviewed Dan’s file and found the two notices. To properly protect Dan’s patent rights, the most appropriate course of action for P to take is to ________',
    options: [
      'file in the PTO on Friday, March 5, 1999, a nonprovisional application claiming Y, and file a copy of the Smith publication, and an explanation of the relevance of the Smith publication.',
      'deposit with the U.S. Postal Service as “Express Mail” in accordance with 37 CFR § 1.10, on Saturday, March 6, 1999, a nonprovisional application which claims Y, a copy of the Smith publication, and an explanation of the relevance of the Smith publication.',
      'file in the PTO on Friday, March 5, 1999, another provisional application claiming the benefit of the filing date of the March 6, 1998, provisional application. For the March 6, 1998, provisional application, file the filing fee and surcharge, the appropriate petition and fee to revive the provisional application, a statement by P that the abandonment of the provisional application was unintentional, a copy of the Smith publication, and an explanation of the relevance of the Smith publication.',
      'deposit in the U.S. Postal Service as “Express Mail” in accordance with 37 CFR § 1.10 on Saturday, March 6, 1999, a nonprovisional application claiming Y, and claiming the benefit of the filing date of the provisional application under 35 U.S.C § 119(e) along with a copy of the Smith publication, and an explanation of the relevance of the Smith publication. Also, in the provisional application, file the filing fee and surcharge for the provisional application along with the appropriate petition and fee to revive the provisional application as unintentionally abandoned, and a statement by P that the abandonment of the provisional application was unintentional.',
      'file in the PTO on Monday, March 8, 1999, a nonprovisional application claiming Y and claiming benefit of the filing date of the provisional application under 35 U.S.C § 119(e), and also file the filing fee and surcharge for the provisional application along with the appropriate petition and fee to revive the provisional application as unintentionally abandoned, a statement by P that the abandonment of the provisional application was unintentional, a copy of the Smith publication, and an explanation of the relevance of the Smith publication.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR §§ 1.131; 1.78(a)(3); 1.56; 1.53(c); MPEP §§ 201.11; 711.03(c), part III, subparts C.1 [p. 700-95] and I [p.700-108]. The model answer then states that “(A), (B), (C) and (D) are incorrect. The Smith publication would be a statutory bar under 35 U.S.C. § 102(b) to each nonprovisional application, each of which is filed more than one year after the Smith publication date. (E) is also incorrect because the nonprovisional application is filed later than 12 months after the date on which the provisional application was filed. MPEP § 201.11. Thus, petitioning to revive the abandoned provisional application, even if successful, would not prevent the Smith publication from being a statutory bar.” The listing of (D) among the incorrect choices is the booklet’s own slip; the ANSWER line keys this item to (D), and that key governs. [Pre-AIA] — the bar is the pre-AIA § 102(b) one-year publication bar. [Historical practice] — 1999-era provisional revival and § 1.78(a)(3) copendency practice.',
  },
  {
    id: 'uspto-apr99-am-29',
    topicId: 1,
    subtopic: 'Improper incorporation by reference — amendment plus affidavit of sameness',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On April 1, 1999, Inventor Dave filed a patent application claiming a pancake flipper. To fully describe the pancake flipper, Dave refers to a February 1999 issue of a cooking magazine. The examiner objected to the specification on the ground that it improperly incorporated the material of the publication by reference. Which of the following actions would accord with proper PTO practice and procedure in overcoming the objection?',
    options: [
      'Amend the specification to include the material incorporated by reference.',
      'File a declaration executed by Dave containing the essential material and stating that the material consists of the same material incorporated by reference.',
      'Abandon the application and file a new application incorporating by reference Dave’s prior application.',
      'File an amendment which amends the specification to include the material incorporated by reference and file a petition to the Commissioner stating that the incorporation by reference was inadvertent with the proper fee.',
      'File an amendment to the specification to include the material incorporated by reference, and accompany it with an affidavit executed by Dave stating that the amendatory material consists of the same material incorporated by reference.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is in accord with MPEP § 608.01(p), “Improper Incorporation” [p. 600-73]. (A) is incorrect because it does not include the affidavit or declaration required by MPEP § 608.01(p). (B) is not correct because essential material may not be incorporated by reference to a magazine article and (B) does not state that an amendment has been filed to amend the specification to include the material incorporated by reference. MPEP § 608.01(p). (C) is incorrect because the new application would still contain the same objectionable material and be subject to the same objection. (D) is incorrect because the amendment still needs to be accompanied by an affidavit stating that the amendatory material was the same as that incorporated by reference as required by MPEP § 608.01. The petition and fee are superfluous.',
  },
  {
    id: 'uspto-apr99-am-30',
    topicId: 1,
    subtopic: 'Dependent claim support and antecedent basis under § 112',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You have drafted and filed a patent application for JoJo Industries directed to a device for mechanically flushing food storage containers with gases. The disclosure states: “The gas flushing device of the present invention, illustrated generally at 10 in FIG. 1, includes a main body 11 having a piston portion 12 with holes 14 that is securely attached to a piston rod 16. The piston rod 16 is in communication with a source of a flushing gas such as carbon dioxide. The piston rod 16 conveys flushing gas to a chamber 17 in which the flushing gas under pressure exits through holes 14. In one preferred embodiment, the piston portion 12 of the gas flushing device 10 includes a bottom surface 18 that is substantially circular. The bottom surface 18 of the piston portion 12 is preferably made of a non-stick material such as nylon or teflon. The piston portion 12 also includes a cylindrical side surface 20 that meets the bottom surface 18 at the circumference of the bottom surface 18. For a flat bottom surface 18, the cylindrical surface 20 is substantially perpendicular to the bottom surface 18. The piston portion 12 also includes at least one hole 14. In one embodiment, the hole 14 is positioned in the bottom surface 18 of the piston portion 12. In another embodiment, the piston portion 12 includes a plurality of holes that are located on the bottom surface 18. In another embodiment, the piston portion 12 includes a plurality of holes that are located on each of the bottom surface 18 and the cylindrical surface 20. The piston portion 12 is securely attached to the hollow rod portion 16 by a threaded section 25 on the piston rod portion 16 that engages a threaded section 27 on the piston portion 12.” The following independent claim is included in the application: “1. A gas flushing device for flushing a container enclosing food comprising a main body (11) that includes a piston portion (12) with at least one hole (14) providing direct contact between the gas and the food, a piston rod portion (16) which is threadibly attachable to and detachable to a source of flushing gas and which is securely attached to the piston portion (12), the piston portion (12) having a nonstick surface (18).” Which of the following claims, if any, comply with 35 U.S.C. § 112 based upon JoJo’s disclosure and independent claim?',
    options: [
      '2. The gas flushing device of Claim 1 wherein said piston portion (16) is attached to said piston rod portion (12) by a threaded section (25) on said piston rod portion (12) that engages a threaded section (27) on said piston rod portion (12).',
      '2. The gas flushing device according to Claim 1 wherein said piston portion is made of nylon.',
      '2. The gas flushing device of Claim 1 wherein the piston portion includes a bottom surface and a cylindrical side surface bounding the bottom surface.',
      '2. The gas flushing device of Claim 1 wherein said hole is positioned in said bottom surface of said piston portion.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.75(c). As set forth in the disclosure and in FIG. 1, “The piston portion 12 also includes a cylindrical side surface 20 that meets the bottom surface 18 at the circumference of the bottom surface 18.” (A) is not correct because it contains incorrect reference characters and is not supported by the disclosure. (B) is incorrect because the disclosure states that “The bottom surface 18 of the piston portion 12 is preferably made of a non-stick material such as nylon or teflon.” It is the bottom surface of the piston portion which is made of nylon and not the piston portion itself. (D) is not correct because “said bottom surface” has no antecedent basis in Claim 1. (E) is incorrect because (C) is the correct answer. [Historical practice] — decided under the pre-AIA § 112 paragraph numbering.',
  },
  {
    id: 'uspto-apr99-am-31',
    topicId: 1,
    subtopic: 'Dependent claim that covers a specific embodiment without losing antecedent basis',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Based on the JoJo Industries gas flushing device disclosure (whose lines 15-16 recite: “In another embodiment, the piston portion 12 includes a plurality of holes that are located on each of the bottom surface 18 and the cylindrical surface 20.”) and the independent claim “1. A gas flushing device for flushing a container enclosing food comprising a main body (11) that includes a piston portion (12) with at least one hole (14) providing direct contact between the gas and the food, a piston rod portion (16) which is threadibly attachable to and detachable to a source of flushing gas and which is securely attached to the piston portion (12), the piston portion (12) having a nonstick surface (18)” — which of the following dependent claims, if any, cover the embodiment described in lines 15-16 of the disclosure?',
    options: [
      '2. A gas flushing device as set forth in Claim 1 wherein the piston portion includes a plurality of holes located on each of said bottom surface and said cylindrical surface.',
      '3. A gas flushing device of Claim 2 wherein the piston portion includes a plurality of holes located on each of said bottom surface and said cylindrical surface.',
      '2. The gas flushing device of Claim 1 wherein the piston portion includes a cylindrical surface perpendicular to a bottom surface and said piston portion includes a plurality of holes located on each of said bottom surface and said cylindrical surface.',
      '(A), (B), and (C).',
      '(A) and (C).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. (A) is not correct because there is no antecedent basis for “said bottom surface” and “said cylindrical surface.” (B) is not correct because it is not known what is in Claim 2 and whether or not there is antecedent basis for “said bottom surface” and “said cylindrical surface.” The model answer adds that “Questions 61 and 62 are independent of each other and the dependent Claim 2 set forth in Question 61 cannot properly be relied upon to respond to Question 62” — the numbering is an artifact of the bank this paper was drawn from and refers to Questions 30 and 31. (D) is not correct because (A) and (B) are not correct. (E) is not correct because (A) is not correct.',
  },
  {
    id: 'uspto-apr99-am-32',
    topicId: 0,
    subtopic: 'Common ownership as a way around a § 102(g)/103 rejection',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] XYZ Corporation has hired you to draft and file a patent application relating to a steel alloy. You diligently prepare the application and file it in the PTO on June 23, 1998, naming Baker as the inventor. On February 5, 1999, you receive a first Office action rejecting all the claims under 35 U.S.C. § 102(g)/103 over a patent assigned to XYZ Corporation. Able is the inventor named in the patent. The Able patent was granted on an application filed on June 25, 1996, and issued on January 13, 1998. You can overcome this rejection by ________________',
    options: [
      'filing an affidavit signed by an officer of the XYZ Corporation averring that both Able and Baker were subject to an obligation of assignment on the date the later invention was made, and stating facts which explain the officer’s belief of ownership.',
      'filing an affidavit by Baker averring common ownership on the date of filing the Able patent application with the necessary fee.',
      'filing a terminal disclaimer so as not to extend the term of the Baker application beyond that of the Able patent if the Baker application matures into a patent.',
      'filing a request to suspend the prosecution of the Baker patent application, and petition the Commissioner for a corrected filing receipt dated January 13, 1998, because of common ownership.',
      'filing a request for reexamination of the Able patent based on prior art references not disclosed by Baker.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 706.02(l). (B) is incorrect. MPEP § 706.02(l), item II.B. (C), (D) and (E) are incorrect because no evidence of common ownership is presented. MPEP § 706.02(l). (D) and (E) are also incorrect because no response under 37 CFR § 1.111 has been filed. [Pre-AIA] — applies pre-AIA § 102(g) prior art and the pre-AIA § 103(c) common-ownership disqualification.',
  },
  {
    id: 'uspto-apr99-am-33',
    topicId: 2,
    subtopic: 'Patent term — provisional benefit does not count toward the twenty years',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Inventor Cal files a provisional application in the PTO on June 5, 1997. On June 2, 1998, Cal asks you to prepare and file a nonprovisional utility patent application. On June 3, 1998, you file the nonprovisional utility application with a specific reference to Cal’s June 5, 1997, provisional application. A Notice of Allowance is sent on February 3, 1999, and the Issue fee is timely paid on April 1, 1999. The patent will issue on June 1, 1999. When will Cal’s patent term begin and end?',
    options: [
      'The term will begin on June 1, 1999, and end on June 5, 2017.',
      'The term will begin on February 3, 1999, and will end on June 5, 2017.',
      'The term will begin on April 1, 1999, and will end May 1, 2018.',
      'The term will begin on June 1, 1999, and will end on June 3, 2018.',
      'The term will begin on February 3, 1999, and will end on June 3, 2018.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 154(a); MPEP §§ 1309; 1309.01. (A) and (B) are incorrect. MPEP § 1309.01 (“[P]riority under 35 U.S.C. 119(e) to one or more U.S. provisional applications is not considered in the calculation of the twenty year term.”) (C) is incorrect. 35 U.S.C. § 154(a). (E) is incorrect. 35 U.S.C. § 154(a).',
  },
  {
    id: 'uspto-apr99-am-34',
    topicId: 3,
    subtopic: 'Amendment format — exact matter, exact point of insertion, five-word limit',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A patent application is filed with the following original Claim 1: “A steam cooking device comprising: a steam generating chamber having a steam generator; a cooking chamber adjacent to said steam generating chamber for receiving steam from said steam; and a heat exchanger secured within said steam generator, said heat exchanger including at least one heating zone comprised of an inner having raised surface projections thereon, an outer panel having raised surface projections thereon, and a path between said raised surface projections whereby flue gases may pass for heating the walls of the heat exchanger.” Which of the following is in accord with proper PTO amendment practice and procedure?',
    options: [
      'In Claim 1, line 4, after “steam” insert --generator--.',
      'In Claim 1, line 7, after “inner” insert --panel--.',
      'In Claim 1, line 6, delete [one], insert --two--, and amend “zone” to read --zones--.',
      'In Claim 1, lines 3-4, after “chamber” (second occurrence) delete [for receiving] and insert --to produce sufficient quantities of gas and--.',
      'In Claim 1, line 4, delete “secured within” and insert --attached to--.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR § 1.121; MPEP § 714.22. The amendment in (B) specifies the exact matter to be inserted, the exact point where the insertion is to be made and is limited to five words or less. (A) is incorrect because there are two occurrences of “steam” appearing in line 4 and the exact point where the insertion is to be made has not been specified. (C) is incorrect because the amendment does not specify the exact point where the insertion of “two” is to occur. (D) is incorrect because the amendment would insert more than five words. (E) is incorrect because it fails to identify the correct point where the insertion is to be made. [Historical practice] — the pre-2003 § 1.121 amendment format (line-and-word directions) has been replaced by full claim listings.',
  },
  {
    id: 'uspto-apr99-am-35',
    topicId: 2,
    subtopic: 'Timely payment of the issue fee — no extensions, certificate of mailing permitted',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A Notice of Allowance is dated and mailed on September 25, 1998, to the applicant. In which of the following situations would the issue fee not be considered as timely paid?',
    options: [
      'The issue fee is filed in the PTO on Monday, December 28, 1998.',
      'The issue fee is filed in the PTO on Wednesday, November 25, 1998.',
      'The issue fee is filed in the PTO on Thursday, March 25, 1999, and is accompanied by a petition to the Commissioner for a three month extension of time, as well as the late payment fee.',
      'The issue fee is received in the PTO on December 29, 1998, and is accompanied with a certificate of mailing dated Monday, December 28, 1998.',
      '(A) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 151; 37 CFR § 1.8; MPEP §§ 505; 1306. (A) is incorrect. The procedure complies with 35 U.S.C. §§ 21(b) and 151. (B) is not correct. The procedure complies with 35 U.S.C. § 151. (D) is not correct. The procedure complies with 35 U.S.C. §§ 21(b); 151, and 37 CFR § 1.8. (E) is incorrect because (A) and (D) are incorrect. [Historical practice] — 1999-era issue-fee and certificate-of-mailing practice.',
  },
  {
    id: 'uspto-apr99-am-36',
    topicId: 5,
    subtopic: 'Disclaimer of an invalid claim — 35 U.S.C. §§ 253 and 282',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Whenever a claim of a patent is held invalid:',
    options: [
      'the claim must be disclaimed by the patent owner to avoid invalidity of the remaining claims in the patent.',
      'a portion of the claim can be disclaimed provided the remaining portion of the claim adequately defines the invention.',
      'any disclaimer of the claim shall be in writing, but need not be recorded in the PTO.',
      'and the invalid claim is to a composition of matter, the claims to a biotechnological process which result in that composition of matter will also be held invalid.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 35 U.S.C. §§ 253; 282.',
  },
  {
    id: 'uspto-apr99-am-37',
    topicId: 5,
    subtopic: 'Amending claims in a reexamination proceeding',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements, if any, regarding amendments to claims in a reexamination proceeding are true?',
    options: [
      'If copies of the printed patent are used to amend the claims, additions to the claims are indicated by carets.',
      'Brackets may not be used in amending claims if more than 5 words are being inserted into the claim.',
      'Additions to amended claims are indicated by underlining, and new claims may be added, if and only if, an equal number of existing claims are canceled.',
      'A patent claim should be canceled by a statement canceling the patent claim and renumbering any new claim to have the number of the canceled claim.',
      'A previously proposed new claim should be canceled by a statement canceling the proposed new claim without presentation of the text of the previously proposed new claim.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.530(d)(2)(i)(A); MPEP § 2234. (A) is incorrect. Additions to claims are indicated by underlining. 37 CFR § 1.530(d)(2)(i)(C). (B) is incorrect. 37 CFR § 1.530(d)(i)(C). (C) is incorrect. There is no requirement that the number of new claims equal the number of cancelled claims. 37 CFR § 1.530(d). (D) is incorrect. 37 CFR § 1.530(d)(2)(i)(B). [Historical practice] — 1999-era reexamination amendment format.',
  },
  {
    id: 'uspto-apr99-am-38',
    topicId: 3,
    subtopic: 'Appeal brief — separate patentability must be pointed out and argued claim by claim',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered patent agent representing a corporate client. An appeal is taken from the examiner’s final rejection of Claims 1-8 of your client’s nonprovisional patent application. Independent Claim 1 and its dependent Claims 2-4 stand rejected under 35 U.S.C. § 102(b) based on a U.S. patent to X. Independent Claim 5, independent Claim 6 and its dependent Claims 7-8 stand rejected under 35 U.S.C. § 103 based on a U.S. patent to Y in view of a U.S. patent to Z. None of the dependent claims are multiple dependent claims. The subject matter of Claims 1, 2, 3, 5, 6, and 8 is very important to your client and you consider each of these claims to be separately patentable over the art applied by the examiner in rejecting these claims. In your Appeal Brief, which of the following courses of action, if any, would be the most appropriate to follow on behalf of your client?',
    options: [
      'Specify that dependent Claims 2-4 and 7-8 stand or fall together with their respective independent Claims 1 and 6, and present reasons as to why independent Claims 1, 5, and 6 are considered separately patentable.',
      'Point out the errors in the examiner’s rejection of Claims 1-3 and how the specific limitations of Claims 1-3 are not shown in X’s patent. Point out the errors in the examiner’s rejection of Claims 5, 6, and 8 and how Y and Z, taken as a whole, do not suggest the claimed subject matter of Claims 5, 6, and 8.',
      'Point out that dependent Claims 4 and 7 stand or fall with their respective independent Claims 1 and 6, and present arguments as to the separate patentability of each of Claims 1, 2, 3, 5, 6, and 8.',
      'Argue the importance of each claim to your client, emphasizing the differences in what independent Claims 1, 5, and 6 cover, and state how the examiner erred in relying on X, Y, and Z’s patents.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.192(c)(7)-(8); MPEP § 1206 [pp.1200-8,9]. (A) is incorrect. The separate patentability of claims 2, 3 and 8 is neither pointed out or argued. (B) is incorrect. The separate patentability of the very important claims 1, 2, 3, 5, 6, and 8 is not pointed out and argued. (D) is incorrect. The separate patentability of the very important claims is not argued. (E) is incorrect because (A), (B) and (D) are incorrect. [Historical practice] — 37 C.F.R. § 1.192 appeal-brief practice before the Board has since been rewritten.',
  },
  {
    id: 'uspto-apr99-am-39',
    topicId: 2,
    subtopic: 'Death of one joint inventor after allowance',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are prosecuting a patent application in which there are two named inventors. You received a notice of allowance in the patent application. However, before the Issue fee became due, one of the named inventors died. Which of the following statements is true with respect to the application as a consequence of the death of the inventor?',
    options: [
      'A new power of attorney must be submitted so that you can continue to represent the remaining inventor.',
      'The application is automatically abandoned upon the death of the inventor.',
      'A new application must be filed naming the heirs of the deceased inventor and the remaining inventor.',
      'The executor or administrator of the deceased inventor must intervene to prevent the application from being withdrawn from issue.',
      'The application matures to a patent after timely payment of the required fees.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 409.01 [p. 400-21]. A new power of attorney is needed only if the deceased inventor was the sole inventor, which he or she was not in the given facts. (A) is not correct because a new power of attorney is only necessary if the deceased inventor is the sole inventor or all the powers of attorney in the application have been terminated. MPEP §§ 409.01; 409.01(f). Likewise, (B), (C) and (D) are incorrect based on MPEP § 409.01(f).',
  },
  {
    id: 'uspto-apr99-am-40',
    topicId: 3,
    subtopic: '§ 121 shields a divisional filed on a restriction requirement from the parent patent',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered practitioner and you have filed a patent application in the PTO on behalf of your client, Wannaberich, on January 7, 1998. In the first Office action, the examiner made a restriction requirement. Although your client disagrees with the restriction, you have made a provisional election with traverse and vehemently argue the restriction requirement. In the next Office action, the restriction is made final and an action on the merits follows. The application is eventually allowed. The client now wants to pursue the non-elected invention. You file a divisional application directed to the non-elected invention before the parent application issues as a patent. In the first Office action in the divisional application, the examiner rejects the claims on the grounds of obviousness-type double patenting over the patent which issued from the parent application. What should be the most appropriate reply to the rejection?',
    options: [
      'File a terminal disclaimer to obviate the double patenting rejection.',
      'Amend the claims in the pending application to overcome the rejection.',
      'File a 37 CFR § 1.132 antedating affidavit.',
      'Request reconsideration and point out that it is improper to use the parent patent in an obviousness-type double patenting rejection when a restriction requirement has been made by the examiner in the parent application.',
      'File a petition under 37 CFR § 1.183 to the Commissioner.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 121; MPEP § 804.01. (A), (B) and (C) are incorrect. The use of the patent as a reference against the divisional application is prohibited by 35 U.S.C. § 121. (E) is not the most correct answer because the petition does not stay the period or necessity to reply to the rejection. 37 CFR §§ 1.111; 1.181(f).',
  },
  {
    id: 'uspto-apr99-am-41',
    topicId: 2,
    subtopic: 'Who decides petitions under 37 C.F.R. § 1.48',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Petitions under 37 CFR § 1.48 are generally decided by the primary examiner except:',
    options: [
      'When the application is involved in an interference.',
      'When the application is a national stage application filed under 35 U.S.C. § 371.',
      'When accompanied by a petition under 37 CFR § 1.183 requesting waiver of a requirement under 37 CFR § 1.48(a) or (c), e.g., waiver of the statement of lack of deceptive intent by an inventor to be added or deleted, or waiver of the reexecution of the declaration by all of the inventors.',
      'When a second conversion under 37 CFR § 1.48(a) is attempted.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) All of the above. See MPEP § 201.03 (pp. 200-3 - 200-4). As set forth in MPEP § 201.03, (A) is decided by the Board of Patent Appeals and Interferences; (B) is decided in the PCT Legal Office; (C) is decided in the Office of Petitions; and (D) is decided by the Group Director. [Historical practice] — the deciding offices named here (and the Board’s former name) no longer exist in this form, and the § 1.48 deceptive-intent requirement was removed by the AIA.',
  },
  {
    id: 'uspto-apr99-am-42',
    topicId: 1,
    subtopic: 'New matter in a claim is rejected under § 112, first paragraph — not § 132',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] The examiner determined that amended Claim 1 contains new matter and rejected amended Claim 1. The claim was added by an amendment which was filed after the filing date of the application. Which of the following identifies the proper basis for the rejection of amended Claim 1 and the action which should be taken by the applicant to overcome the rejection? (I) Claim 1 is rejected under 35 U.S.C. § 112, first paragraph. Applicant should amend the specification to include the new matter therein so as to provide antecedent support for the claim. (II) Claim 1 is rejected under 35 U.S.C. § 132. Applicant should cancel the claim. (III) Claim 1 is rejected under 35 U.S.C. § 112, first paragraph. Applicant should cancel the claim. (IV) Claim 1 is rejected under 35 U.S.C. § 132. Applicant should file a declaration in accordance with 37 CFR § 1.63.',
    options: [
      '(I)',
      '(II)',
      '(III)',
      '(IV)',
      '(III) and (IV)',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 2163.06. “If new matter is added to the claims, the examiner should reject the claims under 35 U.S.C. § 112, first paragraph - written description requirement.” In re Rasmussen, 650 F.2d 1212, 211 USPQ 323 (CCPA 1981). (A) is incorrect because it adds new matter to the specification. (B), (D), and (E) are incorrect because they identify an incorrect basis, i.e. 35 U.S.C. § 132, for the rejection. [Historical practice] — uses the pre-AIA § 112 paragraph numbering (now § 112(a)).',
  },
  {
    id: 'uspto-apr99-am-43',
    topicId: 1,
    subtopic: 'Definiteness — a limitation tied to the user, not the claimed article, is indefinite',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following phrases, when appearing in a claim, would render the claim indefinite?',
    options: [
      'A claim to a bicycle that recited “said front and rear wheels so spaced as to give a wheelbase that is between 58 percent and 75 percent of the height of the rider that the bicycle was designed for.”',
      'A claim limitation specifying that a certain part of a pediatric wheelchair be “so dimensional as to be insertable through the space between the doorframe of an automobile and one of the seats.”',
      'A claim limitation defining the stretch rate of a plastic as “exceeding about 10% per second.”',
      '(A) and (B).',
      '(A), (B), and (C).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 2173.05(b) [p. 2100-166]. (B) is not a correct answer inasmuch as such limitation was held to be definite in Orthokinetics, Inc. v. Safety Travel Chairs, Inc., 806 F.2d 1565, 1 USPQ 2d 1081 (Fed. Cir. 1986) cited in MPEP § 2173.05(b) [p. 2100-166]. The limitation recited in choice (C) was likewise found to be definite by the court in W.L. Gore & Associates, Inc. v. Garlock, Inc., 721 F.2d 1540, 220 USPQ 303 (Fed. Cir. 1983) cited in supra. (D) is incorrect because it includes (B). (E) is incorrect because it includes (B) and (C).',
  },
  {
    id: 'uspto-apr99-am-44',
    topicId: 5,
    subtopic: 'Broadening reissue — the two-year anniversary date still counts as within two years',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] B filed a patent application on March 31, 1997, for an ice cream machine. Discovering an added feature that improved productivity, B filed a CIP application on May 14, 1997. Thereafter, B abandoned the application filed on March 31, 1997. On June 30, 1998, a patent was granted to B for his invention in the CIP application. On March 1, 1999, B realizes that he is claiming less than he is entitled to in view of the added feature in the CIP application. B is worried that this will hurt his upcoming negotiations to assign his patent rights to Mega Corporation. B comes to you, a registered patent practitioner, on March 2, 1999, for advice regarding how to file an application for reissue. What is the latest date that B can file an application for reissue and be entitled to seek enlargement of the scope of the claims of the original patent?',
    options: [
      'June 29, 2000',
      'May 14, 1999',
      'March 31, 1999',
      'June 30, 2000',
      'None of the above',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 251 (“No reissued patent shall be granted enlarging the scope of the claims of the original patent unless applied for within two years from the grant of the original patent.”); MPEP § 1403 (“A reissue filed on the 2-year anniversary date is considered as filed within 2 years.”)[p. 1400-3].',
  },
  {
    id: 'uspto-apr99-am-45',
    topicId: 5,
    subtopic: 'Reissue — what is needed for a filing date, as opposed to a complete application',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] B filed a patent application on March 31, 1997, for an ice cream machine. Discovering an added feature that improved productivity, B filed a CIP application on May 14, 1997. Thereafter, B abandoned the application filed on March 31, 1997. On June 30, 1998, a patent was granted to B for his invention in the CIP application. On March 1, 1999, B realizes that he is claiming less than he is entitled to in view of the added feature in the CIP application. B is worried that this will hurt his upcoming negotiations to assign his patent rights to Mega Corporation. B comes to you, a registered patent practitioner, on March 2, 1999, for advice regarding how to file an application for reissue. What documents must be filed as part of B’s application for reissue in order to be granted a filing date? (I) Reissue Oath or Declaration; (II) An offer to surrender; (III) Filing fee; (IV) Written Consent of Mega Corp.; (V) A specification, claims and any required drawings.',
    options: [
      '(I), (II), (III), (IV), and (V)',
      '(I), (II), (III), and (V)',
      '(I), (III), and (V)',
      '(V)',
      '(I), (II), (IV), and (V)',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR §§ 1.53(b) and 1.171 (“An application for reissue must contain the same parts required for an application for an original patent, complying with all the rules relating thereto except as otherwise provided ....”). MPEP §§ 1403 (“A reissue application can be granted a filing date without an oath or declaration, or without the filing fee being present. See 37 CFR 1.53(f).”); 1410; 1410.01.',
  },
  {
    id: 'uspto-apr99-am-46',
    topicId: 0,
    subtopic: 'Overcoming § 103 without amending — unexpected superior properties',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] The claims in an application filed on behalf of McTeal were rejected as being unpatentable under 35 U.S.C. § 103 over Gage in view of Nell. McTeal gave you, a registered practitioner, power of attorney to prosecute her application. Which one of the following items of information available to you would be relevant to overcoming the rejection of the claims without modifying or amending the claims?',
    options: [
      'Gage and Nell do not teach or suggest feature A of McTeal’s invention which is set forth in each of the drawings and in the working examples in McTeal’s application, but which is not recited in any of the rejected claims.',
      'In the opinion of Billy, a noted expert in the field, McTeal’s invention is patentable because it has revitalized the industry and Billy has nominated McTeal to receive the prestigious Phrog Foundation Award for Excellence.',
      'McTeal’s invention can be shown to possess unexpected superior properties over the prior art.',
      'Gage was published 50 years before Nell and therefore contains no specific reference to Nell suggesting that his invention can be modified in the manner suggested by the Examiner.',
      'The teachings of Gage and Nell, taken singularly or combined, would not be followed by one of ordinary skill in the art because it would be cost prohibitive to do so.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 103; MPEP §§ 2145; 716.02(a). (A) is not correct because it is based upon arguing limitations which are not claimed. MPEP § 2145, VI. (B) is based upon the opinion of one person and is not supported by any factual evidence. MPEP § 716.01(c). (D) is incorrect. The age of the Gage reference, in and of itself is not persuasive of nonobviousness. MPEP § 2145, VIII [p. 2100-137]. (E) is not correct. MPEP § 2145, VII (“Arguing Economic Infeasibility”).',
  },
  {
    id: 'uspto-apr99-am-47',
    topicId: 2,
    subtopic: 'CPA — only a request on a separate paper is needed for a filing date',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following must be filed to obtain a filing date for a Continued Prosecution Application? (I) A copy of the originally filed specification, claims and drawings. (II) A newly executed oath or declaration signed by all the originally named inventors. (III) The filing fee. (IV) A request, on a separate paper, for an application under 37 CFR § 1.53(d) in compliance with that paragraph.',
    options: [
      '(I), (II), and (III)',
      '(I)',
      '(I), (II), (III), and (IV)',
      '(IV)',
      '(I) and (IV)',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR § 1.53(d)(2) (“The filing date of a continued prosecution application is the date on which a request on a separate paper for an application under this paragraph is filed.”); MPEP §§ 201.06(d) [p.200-38]; 601.01 (“37 CFR 1.53(d) sets forth the filing date requirements for a continued prosecution application.”). (A), (B), (C) and (E) are incorrect because the specification, claims, drawing, and declaration or oath of the previous application are utilized in a CPA. 37 CFR § 1.53(d)(2)(iv). The filing fee may be filed later. 37 CFR § 1.16(l). [Historical practice] — CPA practice was eliminated for utility applications in 2003; the RCE under § 1.114 replaced it.',
  },
  {
    id: 'uspto-apr99-am-48',
    topicId: 1,
    subtopic: 'Curing improper dependency — a multiple dependent claim must refer in the alternative',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Patent practitioner Luke filed a patent application in the PTO on behalf of his client Vader which contained three original claims directed to Vader’s invention and which were fully supported by the specification. The three original claims read as follows: 1. A widget comprising A, B, and C. 2. A widget as claimed in Claim 1 wherein C further comprises D. 3. A widget as claimed in Claim 1 and 2 wherein B is BB. The examiner issued a rejection of Claim 3 under 35 U.S.C. § 112, second paragraph, citing the improper dependency of the claim. In the absence of issues of supporting disclosure, which of the following proposed amendments will overcome the rejection?',
    options: [
      'Cancel Claim 3 and substitute the following claim: 3.(Amended) A widget as claimed in claim 1 or 2 wherein B is BB.',
      '3. (Amended) A widget as claimed in any one of Claims 1 and 2 wherein B is BB.',
      '3. A widget as claimed in Claims 1 and 2 wherein B is BB.',
      'Cancel Claim 3 and substitute the following Claim: 4. A widget as claimed in Claims 1 or 2 wherein B is BBB.',
      '3. (Amended) A widget as claimed in Claim 1 [and 2] wherein B is BB.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.121(a)(2)(ii); MPEP § 608.01(n). (A) is incorrect because the claim number is underlined, as are all the words in the claim even though no matter is added. 37 CFR § 1.121(a)(2)(ii). (B) and (C) are incorrect because the claim does not refer back in the alternative only. MPEP § 608.01(n). (D) is incorrect because the claim number is changed and omitted words are not bracketed. 37 CFR § 1.121(a)(2)(ii). [Historical practice] — the pre-2003 § 1.121 marking conventions and the pre-AIA § 112 paragraph numbering.',
  },
  {
    id: 'uspto-apr99-am-49',
    topicId: 0,
    subtopic: 'A new use of an old composition — the composition claim is anticipated',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered practitioner and Henry has come to you to determine whether he has a patentable invention. He discloses to you that he has developed a composition that can be used as bait for a conventional mousetrap. He explains to you that his composition is so effective that one need only wait minutes to lure mice to the trap. You explain to Henry that you cannot give a patentability opinion until after a preliminary search has been made of the prior art. You have a search made and find that Henry’s composition is a well known pork barrel lubricant that has been in public use for over 20 years. What should be your advice to Henry?',
    options: [
      'File a U.S. patent application claiming the composition as mouse bait.',
      'File a U.S. patent application with claims directed to a method of using the composition as bait.',
      'Explain that it would be impossible for any claims to the process of using the composition as mouse bait to be allowed under the current guidelines of the PTO.',
      'File a provisional patent application directed only to the composition in order to gain a competitive advantage for one year. Within one year of filing the provisional application, recommend that Henry file a nonprovisional application claiming the composition.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 35 U.S.C. § 102(b); MPEP § 2112.02 [p.2100-51]. (A) is incorrect because the claim is anticipated. 35 U.S.C § 102(b). (C) is incorrect because the process is not disclosed and current PTO guidelines support the claim. MPEP § 2112.02. (D) is incorrect because the process is anticipated. 35 U.S.C. § 102(b). (E) is incorrect because (B) is incorrect. [Pre-AIA] — the bar applied is the pre-AIA § 102(b) public-use bar.',
  },
  {
    id: 'uspto-apr99-am-50',
    topicId: 1,
    subtopic: 'Dependent claims must narrow — “up to”, “at least” and “further comprising” do not',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Your client has invented a widget consisting essentially of an amplifier having a voltage of 100 to 300 amps, preferably 250 amps, and a woofer having a wattage of 400 to 450 watts, preferably 425 watts. You draft a patent application directed to your client’s invention and satisfying the requirements of 35 U.S.C. § 112. You draft the following independent claim: “1. A widget consisting essentially of an amplifier having a voltage of 100 to 300 amps, and a woofer having a wattage of 400 to 450 watts.” Which of the following would not be a proper dependent claim if presented as an original claim in the application when the application is filed in the PTO?',
    options: [
      '2. The widget of Claim 1 wherein the amplifier has a voltage of up to 300 amps.',
      '2. The widget of Claim 1 wherein the woofer has a wattage of 425 to 450 watts.',
      '2. The widget of Claim 1 wherein the amplifier has a voltage of 300 amps and the woofer has a wattage between 430 and 450 watts.',
      '2. A widget of Claim 1 further comprising an amplifier having a voltage of at least 250 amps and a woofer having a wattage of at least 425 amps.',
      '(A) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer because it identifies both (A) and (D). (A) is not a proper dependent claim because “up to” 300 amps would include 0-300 amps which is outside of the 100-300 amp range disclosed in the specification. (D) is not a proper dependent claim because the phrase “at least” would encompass ranges outside those disclosed in the specification. MPEP § 2111.03. Use of the phrase “further comprising” adds an additional amplifier and woofer, which are not supported by the disclosure which describes only one amplifier and one woofer. (B) is a proper dependent claim because the wattage is within the wattage range limitation set out in claim 1. (C) is a proper dependent claim because the voltage and wattage are within the limitations for the same set forth in claim 1.',
  },
];

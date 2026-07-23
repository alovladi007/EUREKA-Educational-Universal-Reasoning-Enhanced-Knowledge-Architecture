/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, April 15, 2003 — Afternoon Session
 * (Test Number 456, Series 103), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (15apr03pq.pdf / 15apr03pa.pdf,
 * via the Internet Archive copy of uspto.gov). US Government works — public
 * domain.
 *
 * Provenance and integrity rules (same as the other USPTO files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers; `explanation`
 *    is the official model answer, abridged, retaining the controlling
 *    citation.
 *  - Question 43 was officially discarded ("All answers accepted") and is
 *    excluded.
 *  - DUPLICATES: the USPTO reused ten items verbatim from exams already
 *    ingested here — Q9 (= Oct AM Q12), Q11 (= Oct PM Q38), Q16 (= Oct AM
 *    Q4), Q20 (= Oct AM Q3), Q26 (= Oct PM Q30), Q28 (= Oct PM Q50),
 *    Q29 (= Oct AM Q18), Q33 (= Oct AM Q22), Q49 (= Oct AM Q47), and
 *    Q50 (= Oct PM Q25). They are excluded so the practice pool never
 *    serves the same stem twice. (Their April keys match the earlier keys
 *    in every case.) Q7 and Q46 share stems with earlier items but carry
 *    REWORDED options — the USPTO ran them as distinct items, so they are
 *    retained.
 *  - ERA NOTE: this exam predates the AIA. Questions turning on pre-AIA
 *    35 U.S.C. 102 timing rules carry a [Pre-AIA] tag in the explanation.
 *    Verified status: OFFICIAL (USPTO model answers).
 *
 * Ingested: PM session Q1–Q8, Q10, Q12–Q15, Q17–Q19, Q21–Q25, Q27,
 * Q30–Q32, Q34–Q42, Q44–Q48 (39 of 49 scoreable after the 10 cross-exam
 * duplicates). This completes the WS2 released-exam ingestion for both
 * 2003 exams — see docs/monetization/TEST_PREP_FIX_BUILD_PROMPT.md.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2003_PM_SOURCE =
  'USPTO Registration Examination, April 15, 2003 — Afternoon Session (official model answers; public domain)';

export const USPTO_APR2003_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr03-pm-01',
    topicId: 2,
    subtopic: 'Small Entity Status — Continuing Applications (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Harriet filed a nonprovisional patent application in the USPTO containing a written assertion of small entity status. Based upon the USPTO rules and the procedures set forth in the MPEP, which of the following statements is correct?',
    options: [
      'If Harriet files a related, continuing application wherein small entity status is appropriate and desired, it will not be necessary to specifically establish assertion of such status in the continuing application.',
      'If Harriet files a related, reissue application wherein small entity status is appropriate and desired, it will be necessary to specifically establish assertion of such status in the reissue application.',
      'If Harriet files a related, divisional application under 37 CFR 1.53, wherein small entity status is appropriate and desired, it will not be necessary to specifically establish assertion of such status in the divisional application.',
      'If Harriet refiles her application as a continued prosecution application under 37 CFR 1.53(d), wherein small entity status is appropriate and desired, it will not be necessary to specifically establish assertion of such status in the continued prosecution application.',
      'If Harriet subsequently assigns her rights to another party for whom small entity status is appropriate and desired, it will be necessary to specifically re-establish assertion of such status.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is correct. 37 CFR § 1.27(c)(4): refiling under § 1.53 as a continuation, divisional, or CIP — including a CPA under § 1.53(d) — or filing a reissue application REQUIRES a new assertion of continued entitlement to small entity status, so (A), (C) and (D) are wrong. (E) is wrong — where rights are assigned to another party who is also a small entity after an assertion, a second assertion is not required (§ 1.27(e)(1)).',
  },
  {
    id: 'uspto-apr03-pm-02',
    topicId: 0,
    subtopic: 'Indefiniteness — “Effective Amount” (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A U.S. patent application discloses a first embodiment of an invention, a composition made of known materials in equal amounts by weight of A, B, and C. The application discloses a second embodiment of the invention comprising equal amounts by weight of A, B, and C, and an effective amount of D, a known material, to reduce excess moisture from the composition. The application also discloses a third embodiment of the invention comprising equal amounts by weight of A, B, and C, and an effective amount of D to reduce the acidity of the composition. The application fully discloses guidelines for determining an effective amount of D to reduce excess moisture from the composition, and determining an effective amount of D to reduce the acidity of the composition. The application discloses that the amount of D needed to reduce excess moisture from the composition differs from the amount of D needed to reduce the acidity of the composition. Which of the following claims, if included in the application, provides a proper basis for a rejection under 35 USC 112, second paragraph in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C, and an effective amount of D to reduce the acidity of the composition.',
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C, and an effective amount of D.',
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C, and an effective amount of D to reduce excess moisture from the composition.',
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2173.05(c), “Effective Amount”: “an effective amount” is indefinite when the claim fails to state the function to be achieved and MORE THAN ONE effect can be implied from the specification (In re Fredericksen, 213 F.2d 547 (CCPA 1954)) — in (B) it is unclear whether the amount is effective to reduce acidity or to reduce moisture. (A) and (C) each state the function and are supported by the disclosed guidelines; (D) is definite since A, B and C are known materials.',
  },
  {
    id: 'uspto-apr03-pm-03',
    topicId: 0,
    subtopic: '102(d) — CIP Breaks the Priority Chain (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures in the MPEP, in which of the following instances is the reference properly available as prior art under 35 USC 102(d)?',
    options: [
      'A U.S. patent application is filed within the one year anniversary date of the filing date of the foreign application. The reference is the foreign application.',
      'The applicant files a foreign application, later timely files a U.S. application claiming priority based on the foreign application, and then files a continuation-in-part (CIP) application, and the claims in the CIP are not entitled to the filing date of the U.S. parent application. The foreign application issues as a patent before the filing date of the CIP application and is used to reject the claims directed to the added subject matter under 35 USC 102(d)/103. The reference is the foreign application.',
      'The applicant files a foreign application, and later timely files a U.S. application claiming priority based on the foreign application. The examined foreign application has been allowed by the examiner and has not been published before the U.S. application was filed. The reference is the foreign application.',
      'The reference is a defensive publication.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. [Pre-AIA] 35 U.S.C. § 102(d); MPEP § 2135.01, “A Continuation-In-Part Breaks The Chain Of Priority As To Foreign As Well As U.S. Parents”: where CIP claims are not entitled to the U.S. parent’s filing date, the effective filing date is the CIP’s own date, and the applicant’s foreign patent issued before that date is available under § 102(d)/103 (In re van Langenhoven, 173 USPQ 426 (CCPA 1972)). (C) fails — an application must issue into a patent before it can be applied under § 102(d) (Ex parte Fujishiro); (D) fails — defensive publications are not prior art as of their filing dates (Ex parte Osmond).',
  },
  {
    id: 'uspto-apr03-pm-04',
    topicId: 3,
    subtopic: 'Improper RCE + Suspension = Abandonment (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] The Office mailed an Office action containing a proper final rejection dated July 8, 2002. The Office action did not set a period for reply. On January 7, 2003, in reply to the final rejection, a registered practitioner filed a request for continued examination under 37 CFR 1.114, a request for a suspension of action under 37 CFR 1.103(c) to suspend action for three months, and proper payment all required fees. No submission in reply to the outstanding Office action accompanied the request for continued examination. No other paper was submitted and no communication with the Office was held until after Midnight, January 8, 2003. Which of the following statements accords with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'If an appropriate reply is submitted within the three month period of suspension permitted under 37 CFR 1.103(c), the application will not be held abandoned.',
      'The application will not be held abandoned if an appropriate reply is submitted within the three month period of suspension and it is accompanied by a showing that the reply could not have been submitted within the period set in the final rejection. For example, the reply includes a showing based on an experiment that required 8 months to conduct.',
      'No reply will prevent the application from being held abandoned.',
      'If, on January 10, 2003, the primary examiner and applicant agree to an examiner’s amendment that places the application in condition for allowance and a notice of allowance is mailed within the three month period of suspension, application X will not be held abandoned.',
      'No other submission by applicant is necessary because application X is still pending. The examiner is required to act on the request for continued examination after expiration of the three month period of suspension.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP §§ 709, 706.07(h): a § 1.103(c) suspension request must accompany a COMPLIANT RCE — one with a submission meeting 37 CFR § 1.111 — and the suspension request cannot substitute for the submission. The RCE here was improper (no submission), and an improper RCE does not toll the running of any time period set for reply. With no shortened period set, the maximum statutory six-month period ran from the final rejection’s mail date, no proper reply was filed before it expired, and the application became abandoned by operation of law — so no later reply can save it. (D) also fails — an examiner’s amendment may not be made more than 6 months from the final action, as the application is abandoned by then (MPEP § 706.07(f)).',
  },
  {
    id: 'uspto-apr03-pm-05',
    topicId: 0,
    subtopic: 'Overcoming a 102(a) Rejection (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following practices or procedures may be properly employed in accordance with the USPTO rules and the procedures set forth in the MPEP to overcome a rejection properly based on 35 USC 102(a)?',
    options: [
      'Perfecting a claim to priority under 35 USC 119(a)-(d) based on a foreign application having a foreign priority filing date that antedates the reference.',
      'Filing a declaration under 37 CFR 1.131 showing that the cited prior art antedates the invention.',
      'Filing a declaration under 37 CFR 1.132 showing that the reference invention is by “others.”',
      'Perfecting priority under 35 USC 119(e) or 120 by, in part, amending the declaration of the application to contain a specific reference to a prior application having a filing date prior to the reference.',
      '(A), (B) (C), and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. [Pre-AIA] MPEP § 706.02(b): a § 102(a) rejection may be overcome by perfecting a § 119(a)-(d) priority claim with a foreign priority date that antedates the reference. (B) and (C) invert the required showings — a § 1.131 declaration must show the INVENTION antedates the art, and a § 1.132 declaration must show the reference is NOT by others. (D) fails — § 119(e)/120 priority is perfected by amending the SPECIFICATION (not the declaration) to reference the prior application.',
  },
  {
    id: 'uspto-apr03-pm-06',
    topicId: 5,
    subtopic: 'Reissue Mechanics — Additions and Deletions (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures of the MPEP, which of the following is true?',
    options: [
      'If after the filing of a reissue application no errors in the original patent are found, a reissue patent will be granted on the reissue application noting no change, and the original patent will be returned to the applicant.',
      'In order to add matter not previously found in the patent, a continuation-in-part reissue application must be filed.',
      'In a reissue application, additions and deletions to the original patent should be made by underlining and bracketing, respectively, except for changes made in prior Certificates of Correction and disclaimer(s) of claims under 37 CFR 1.321(a).',
      'A dependent claim may be broadened in a reissue application only in the first two years of the enforceable life of the patent.',
      '(A), (B), and (C).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 1411.01: reissue additions and deletions are shown by underlining and bracketing respectively, with the stated exceptions for prior Certificate of Correction changes and § 1.321(a) claim disclaimers. (A) fails — where no error is found, a reissue patent is NOT granted (MPEP § 1402); (B) fails — new matter may not be entered in a reissue; (D) — see MPEP § 1412.03 on when broadened claims can be presented (two years from GRANT).',
  },
  {
    id: 'uspto-apr03-pm-07',
    topicId: 2,
    subtopic: 'Filing Date — Oath Under § 1.51(b)(2) Not Required (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, for a nonprovisional application to receive a filing date in the USPTO under 37 CFR 1.53(b), all of the following must be filed except:',
    options: [
      'An oath or declaration under 37 CFR 1.51(b)(2).',
      'A specification as prescribed by the first paragraph of 35 USC 112.',
      'A description pursuant to 37 CFR 1.71.',
      'At least one claim pursuant to 37 CFR 1.75.',
      'Any drawing required by 37 CFR 1.81(a).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 111; 37 CFR § 1.53; MPEP § 601.01(a): the oath or declaration for an application filed under § 1.53(b) can be submitted after the filing date. The specification with description, at least one claim, and any required drawing — (B) through (E) — are what earn the filing date.',
  },
  {
    id: 'uspto-apr03-pm-08',
    topicId: 2,
    subtopic: 'Filing a Continuation Under § 1.53(b) (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A complete continuation application by the same inventors as those named in the prior application may be filed under 35 USC 111(a) using the procedures of 37 CFR 1.53(b) by providing, in accordance with the USPTO rules and the procedures set forth in the MPEP:',
    options: [
      'A copy of the prior application, including a copy of the signed declaration in the prior application, as amended.',
      'A new and proper specification (including one or more claims), any necessary drawings, a copy of the signed declaration as filed in the prior application (the new specification, claim(s), and drawings do not contain any subject matter that would have been new matter in the prior application), and all required fees.',
      'A new specification and drawings and a newly executed declaration. The new specification and drawings may contain any subject matter that would have been new matter in the prior application.',
      'A new specification and drawings, and all required fees.',
      '(A), (B), (C) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR §§ 1.51(b), 1.53(b), 1.63(d)(1)(iv); MPEP §§ 201.06(c), 602.05(a): a continuation may be filed with a new specification and drawings free of new matter plus a copy of the signed declaration AS FILED in the prior application and the fees. (A) fails — the copy must be of the prior application AS FILED, not as amended; (C) fails — a continuation cannot contain what would have been new matter (that is a CIP); (D) fails — the oath/declaration is needed to name the same inventors.',
  },
  {
    id: 'uspto-apr03-pm-10',
    topicId: 3,
    subtopic: 'Objection vs Rejection (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is true?',
    options: [
      'There is no practical difference between an objection and rejection of a claim.',
      'If the form of the claim (as distinguished from its substance) is improper, an objection is made.',
      'An objection, if maintained by an examiner, is subject to review by the Board of Patent Appeals and Interferences.',
      'An example of a proper objection is where the claims are refused because they fail to comply with the second paragraph of 35 USC 112.',
      'An example of a proper rejection is a rejection of a dependent claim for being dependent on a claim that has been rejected only over prior art, where the dependent claim is otherwise allowable.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 706.01: “If the form of the claim (as distinguished from its substance) is improper, an ‘objection’ is made.” (A)/(C) fail — a rejection (on the merits) is reviewable by the Board, while an objection is reviewable only by petition to the Commissioner. (D) fails — a § 112 ¶ 2 failure is a REJECTION (MPEP § 706.03(d)). (E) fails — dependency on a rejected claim, where the dependent claim is otherwise allowable, draws an OBJECTION as a matter of form (MPEP § 608.01(n)).',
  },
  {
    id: 'uspto-apr03-pm-12',
    topicId: 5,
    subtopic: 'Interferences & Reexam Certificates (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is true?',
    options: [
      'Interferences will generally be declared even when the applications involved are owned by the same assignee since only one patent may issue for any given invention.',
      'A senior party in an interference is necessarily the party who obtains the earliest actual filing date in the USPTO.',
      'Reexamination proceedings may not be merged with reissue applications since third parties are not permitted in reissue applications.',
      'After a reexamination proceeding is terminated and the certificate has issued, any member of the public may obtain a copy of the certificate by ordering a copy of the patent.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 2292: after a reexamination certificate issues, any member of the public may obtain a copy by ordering a copy of the patent. (A) fails — see 37 CFR § 1.602(a) (commonly-owned applications); (B) fails — the senior party is the one with the earliest EFFECTIVE filing date (37 CFR § 1.601(m)); (C) fails — reissues and reexaminations MAY be merged (MPEP § 2285).',
  },
  {
    id: 'uspto-apr03-pm-13',
    topicId: 2,
    subtopic: 'Correcting Good-Faith Small Entity Errors (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Prior to filing a patent application for a client, a registered practitioner determined that the client was entitled to claim small entity status under 37 CFR 1.27. The practitioner filed a patent application for the client on November 1, 2002 together with a claim for small entity status under 37 CFR 1.27. On December 2, 2002, a Notice to File Missing Parts was mailed setting a two month period for reply and requiring the basic filing fee and the surcharge under 37 CFR 1.16(e). The practitioner timely submitted the small entity fees for the basic filing fee and the surcharge as required in the Notice. Shortly thereafter, the practitioner discovered that on October 31, 2002, the day before the application was filed, the client, without advising the practitioner, had assigned all rights in the invention that is the subject of the application to an entity that would not qualify for small entity status under 37 CFR 1.27. In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following actions would be the best action for the practitioner to take?',
    options: [
      'File a continuing application under 37 CFR 1.53(b) with the large entity filing fee and then file a letter of express abandonment under 37 CFR 1.138 in the original application after the continuing application has been accorded a filing date.',
      'Promptly file a notification of loss of small entity status under 37 CFR 1.27(g) and, thereafter, pay large entity fees whenever any subsequent fees are required.',
      'Wait until a Notice of Allowance is received and then timely submit the large entity issue fee along with a notification of loss of small entity status under 37 CFR 1.27(g).',
      'File a paper under 37 CFR 1.28(c) requesting that the good faith error in claiming small entity status be excused and complying with the separate submission and itemization requirements of 37 CFR 1.28(c) and including payment of the deficiency owed.',
      'Pay the difference between the large entity filing fee and small entity filing fee and the difference between the large entity surcharge and small entity surcharge within two months from the mail date of the Notice to File Missing Parts.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 509.03, “Correcting Errors In Small Entity Status”: where small entity status was established and fees paid in good faith but in error, the error is excused upon compliance with the separate submission and itemization requirements of 37 CFR § 1.28(c)(1)-(2) plus payment of the deficiency. Status was never proper (the assignment happened the day before filing), and none of the actions in (A), (B), (C) or (E) corrects the error — § 1.28(c) is the ONLY mechanism.',
  },
  {
    id: 'uspto-apr03-pm-14',
    topicId: 5,
    subtopic: 'Broadening Reissue — Who May File, When (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Mark Twine obtains a patent directed to a machine for manufacturing string. The patent contains a single claim (Claim 1) which recites six claim elements. The entire interest in Twine’s patent is assigned to the S. Clemens String Co., and Twine is available and willing to cooperate with S. Clemens String Co. to file a reissue application. A subsequent reissue application includes Claim 2, which is similar to original Claim 1. However, one of the elements recited in Claim 2 is broader than its counterpart element in the original claim. The remaining five elements are narrower than their respective counterpart elements in the original patent claim. Which of the following scenarios accords with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'The S. Clemens String Co. files the reissue application more than 2 years after the issue date of the original patent application.',
      'The S. Clemens String Co. files the reissue application less than 2 years after the issue date of the original patent but more than 2 years after original application filing date.',
      'Mark Twine files the reissue application less than 2 years after the issue date of the original patent but more than 2 years after original application filing date.',
      'Mark Twine files the reissue application more than 2 years after the issue date of the original patent.',
      'Mark Twine and the S. Clemens String Co. jointly file the reissue application more than 2 years after the issue date of the original patent.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. A claim broader in any respect than the original claim is a BROADENING reissue claim, so the application must be filed within two years of the patent’s ISSUE date — (A), (D) and (E) fail on timing (35 U.S.C. § 251; MPEP § 1412.03). (B) fails because the assignee may not file a broadening reissue application (MPEP § 706.03(x)) — the inventor must file, which (C) satisfies.',
  },
  {
    id: 'uspto-apr03-pm-15',
    topicId: 0,
    subtopic: 'Inventorship — Conception Controls (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Able conceived the invention claimed in a patent application. In conceiving the invention, Able used and adopted ideas and materials known in the art and invented by others. Ben, Able’s employee, reduced the invention to practice at Able’s request and totally pursuant to Able’s suggestions. Being unable to afford a patent practitioner’s fees to prepare and prosecute the application, Able convinced John to pay for the practitioner’s services in return for an interest in the invention. John did nothing more than provide the funds for the practitioner. Which of the following is in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Able need not be the one to reduce the invention to practice so long as the reduction to practice occurred on his or her behalf. Able can be properly named as inventor in the application.',
      'To be named an inventor, it is not necessary for John to have contributed to the conception of the invention. Ben, not Able, can be named as inventor in the application.',
      'In conceiving the invention, Able may not consider and adopt ideas and materials derived from any sources, such as ideas of previous inventors. Able cannot be properly named as inventor in the application.',
      'John and Able may be properly named as joint inventors of the invention in the application.',
      'John, Ben, and Able may be properly named as joint inventors of the invention in the application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2137.01, “The Inventor Is Not Required To Reduce The Invention To Practice” (In re DeBaun, 214 USPQ 933 (CCPA 1982)): reduction to practice on the inventor’s behalf suffices. (B) fails — an inventor must contribute to CONCEPTION (Fiers v. Revel). (C) fails — as long as the inventor maintains intellectual domination over making the invention, ideas and materials may be adopted from others (Morse v. Porter). (D)/(E) fail — merely funding the application does not make John a joint inventor (35 U.S.C. § 116).',
  },
  {
    id: 'uspto-apr03-pm-17',
    topicId: 0,
    subtopic: '102(d) Statutory Bar — Foreign Patent (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Rolland files a U.S. patent application fourteen months after he perfects an invention in Europe. In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following would establish a statutory bar against the granting of a U.S. patent to Rolland?',
    options: [
      'A foreign patent issued to Rolland 11 months prior to the filing date of Rolland’s U.S. patent application. The foreign patent was granted on an application that was filed 23 months prior to the effective filing date of Rolland’s U.S. patent application. The foreign patent application and the U.S. patent application claim the same invention.',
      'The invention was described in a printed publication in the United States, 11 months prior to the filing date of the U.S. patent application.',
      'The invention was in public use in the United States, less than one year prior to the filing date of the U.S. patent application.',
      'The invention was on sale in a foreign (NAFTA member) country, more than one year prior to the filing date of the U.S. patent application.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. [Pre-AIA] 35 U.S.C. § 102(d); MPEP §§ 706.02(c), 706.02(e): a foreign patent to the same applicant on the same invention, granted before the U.S. filing date on an application filed more than 12 months before the U.S. filing date, is a statutory bar. (B)/(C) fail — the publication and public use are less than one year before filing (§ 102(b) requires more than one year); (D) fails — the on-sale bar requires sale IN THIS COUNTRY (MPEP § 2133.03(d)).',
  },
  {
    id: 'uspto-apr03-pm-18',
    topicId: 2,
    subtopic: 'When Actual Receipt Is Not the Filing Date (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, in which of the following cases is the date of actual receipt by the USPTO not accorded as the application filing date?',
    options: [
      'Provisional application filed without claims.',
      'Non-provisional application filed containing an error in inventorship.',
      'Non-provisional application filed which fails to identify the inventor(s).',
      'Non-provisional application with executed oath filed without any claim(s).',
      'Non-provisional application filed using a certificate of mailing in accordance with 37 CFR 1.8.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 111(a); 37 CFR § 1.53(b); MPEP § 506: a nonprovisional application filed without at least one claim is incomplete and will NOT be accorded a filing date. (A) fails — provisional applications need no claims (§ 111(b)); (B)/(C) fail — inventorship errors or omissions do not raise a filing-date issue (MPEP § 506.02); (E) fails — a certificate of mailing confers no filing-date benefit for a new application; the actual receipt date governs (37 CFR § 1.8(a)(2)(i)(A)).',
  },
  {
    id: 'uspto-apr03-pm-19',
    topicId: 0,
    subtopic: 'Utility — § 101 and § 112 Relationship (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In connection with the utility of an invention described in a patent application, which of the following conforms to the USPTO rules and the procedure set forth in the MPEP?',
    options: [
      'A deficiency under 35 USC 101 also creates a deficiency under 35 USC 112, first paragraph.',
      'To overcome a rejection under 35 USC 101, it must be shown that the claimed device is capable of achieving a useful result on all occasions and under all conditions.',
      'A claimed invention is properly rejected under 35 USC 101 as lacking utility if the particular embodiment disclosed in the patent lacks perfection or performs crudely.',
      'To overcome a rejection under 35 USC 101, it is essential to show that the claimed invention accomplishes all its intended functions.',
      'A claimed invention lacks utility if it is not commercially successful.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2107.01(IV): “A deficiency under 35 U.S.C. § 101 also creates a deficiency under 35 U.S.C. § 112, first paragraph” (In re Brana; In re Fouche — if compositions are useless, the specification cannot have taught how to use them). (B), (C), (D) and (E) all overstate the utility requirement — an invention need not work perfectly, on all occasions, accomplish every intended function, or be commercially successful (MPEP § 2107; E.I. du Pont v. Berkley).',
  },
  {
    id: 'uspto-apr03-pm-21',
    topicId: 2,
    subtopic: 'Petitions to Make Special — No-Fee Cases (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, a petition to make a patent application special may be filed without fee in which of the following cases?',
    options: [
      'The petition is supported by applicant’s birth certificate showing applicant’s age is 62.',
      'The petition is supported by applicant’s unverified statement that applicant’s age is 65.',
      'The petition is supported by applicant’s statement that there is an infringing device actually on the market, that a rigid comparison of the alleged infringing device with the claims of the application has been made, and that applicant has made a careful and thorough search of the prior art.',
      'The petition is accompanied by a statement under 37 CFR 1.102 by applicant explaining the relationship of the invention to safety of research in the field of recombinant DNA research.',
      'The petition is accompanied by applicant’s statement explaining how the invention contributes to the diagnosis, treatment or prevention of HIV/AIDS or cancer.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 708.02(IV), “Applicant’s Age”: an application may be made special upon a petition with ANY evidence that the applicant is 65 or more — a birth certificate or the applicant’s statement — and no fee is required. (A) fails on age (62 < 65); (C), (D) and (E) fail because the infringement, recombinant-DNA, and HIV/AIDS-or-cancer bases each require a fee (MPEP § 708.02, headings II, VII, X).',
  },
  {
    id: 'uspto-apr03-pm-22',
    topicId: 0,
    subtopic: '103(c) Does NOT Reach 102(e) Rejections (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] The Potter patent application was filed on June 6, 2002, claiming subject matter invented by Potter. The Potter application properly claims priority to a German application filed on June 6, 2001. In a first Office action all the claims of the Potter application are rejected under 35 USC 102(e) based on a U.S. patent application publication to Smith et al (“Smith”). A registered practitioner prosecuting the Potter application ascertains that the relevant subject matter in Smith’s published application and Potter’s claimed invention were, at the time Potter’s invention was made, owned by ABC Company or subject to an obligation of assignment to ABC Company. The practitioner ascertains that the Smith application was filed on April 10, 2001 and that the Smith application was published on December 5, 2002. Smith and Potter do not claim the same patentable invention. To overcome the rejection without amending the claims which of the following replies would not comply with the USPTO rules and the procedures set forth in the MPEP to be an effective reply for overcoming the rejection?',
    options: [
      'A reply that only contains arguments that Smith fails to teach all the elements in the only independent claim, and which specifically points out the claimed element that Smith lacks.',
      'A reply that consists of an affidavit or declaration under 37 CFR 1.131 properly proving invention of the claimed subject matter of the Potter application prior to April 10, 2001.',
      'A reply that consists of an affidavit or declaration under 37 CFR 1.132 properly showing that Smith’s invention is not by “another.”',
      'A reply that properly states that the invention of the Potter application and the Smith application were commonly owned by ABC Company at the time of the invention of the Potter application.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer (the reply that would NOT work). [Pre-AIA] 35 U.S.C. §§ 102(e), 103(c); MPEP § 706.02(l)(1): the § 103(c) common-ownership exception applies only to § 102(e)/(f)/(g) art APPLIED IN A § 103(a) REJECTION — here Smith was applied in a § 102(e) rejection, so common ownership does not disqualify it. (A), (B) and (C) are each proper replies: pointing out a missing element, antedating Smith’s April 10, 2001 filing date under § 1.131, or showing the invention is not by “another” under § 1.132.',
  },
  {
    id: 'uspto-apr03-pm-23',
    topicId: 3,
    subtopic: 'Defective Appeal Brief — When NOT to Notify (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] The claims in a patent application having been twice or finally rejected, the applicant files a timely Notice of Appeal on January 2, 2003. In accordance with USPTO rules and procedures set forth in the MPEP, in which of the following situations should the USPTO not notify the applicant that the Appeal Brief is defective and allow him an opportunity to correct the deficiency?',
    options: [
      'The Appeal Brief is filed on July 10, 2003, without a request for extension of time under 37 CFR 1.136.',
      'The Appeal Brief is submitted unsigned.',
      'The Appeal Brief states that the claims do not stand or fall together, and presents argument as to why the claims are separately patentable, but the primary examiner does not agree with the applicant’s argument.',
      'The Appeal Brief does not state whether the claims stand or fall together, but presents arguments why the claims subject to the same rejection are separately patentable.',
      'The Appeal Brief does not address one of the grounds of rejection stated by the primary examiner.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP §§ 1206, 1208: where the brief makes the stand-or-fall statement AND presents supporting arguments, the brief is compliant — if the examiner merely disagrees with the grouping, the disagreement is addressed in the Examiner’s Answer, not by a defective-brief notice. (A) — the brief was filed under seven months from the notice of appeal, so the applicant is notified and may request the available extension; (B), (D) and (E) are formal deficiencies (unsigned; missing § 1.192(c)(7) statement; unaddressed ground) that DO trigger notification and time to correct.',
  },
  {
    id: 'uspto-apr03-pm-24',
    topicId: 2,
    subtopic: 'IDS After Allowance — RCE Before Issue Fee (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Registered practitioner Joe duly files a non-provisional utility patent application on May 6, 1999. The USPTO sends Joe a notice of allowance dated November 13, 2000. On November 23, 2000, Joe learns about a publication (“Smith reference”) which he knows to be material to patentability of the claims presented in the application, but which was not considered by the examiner during prosecution of the application. Joe prepares an information disclosure statement that complies with the provisions of 37 CFR 1.98, listing the Smith reference. In accordance with USPTO rules and procedure which of the following actions, if taken by Joe, will result in the examiner considering the Smith reference during prosecution of the application?',
    options: [
      'Prior to Wednesday, February 14, 2001, filing a request for continued examination of the application, the information disclosure statement, and the fee for a request for continued examination, but not paying the issue fee.',
      'Timely paying the issue fee, and thereafter filing a request for continued examination of the application together with the information disclosure statement, and the fee for a request for continued examination, but not submitting a petition under 37 CFR 1.313.',
      'After Tuesday, February 13, 2001, filing a request for continued examination of the application together with the information disclosure statement, and the fee for a request for continued examination, but not paying the issue fee.',
      'Timely paying the issue fee, and after the patent issues filing a request for continued examination of the application, the information disclosure statement, the fee for a request for continued examination, and a petition under 37 CFR 1.313.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 CFR § 1.114; MPEP §§ 609 (III.B(1)(b)), 706.07(h): the IDS is a valid RCE submission, and the RCE is proper if filed BEFORE payment of the issue fee — here before the three-month issue-fee deadline. (B) fails — an RCE after issue-fee payment requires a granted § 1.313 petition; (C) fails — by then the application is abandoned for failure to pay the issue fee; (D) fails — after the patent ISSUES a § 1.313 petition cannot withdraw it (§ 1.313(d)).',
  },
  {
    id: 'uspto-apr03-pm-25',
    topicId: 3,
    subtopic: 'Enablement Objection — Drawings Cannot Cure (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] The specification in a patent application has been objected to for lack of enablement. To overcome this objection in accordance with the USPTO rules and the procedures set forth in the MPEP, a registered practitioner may do any of the following except:',
    options: [
      'traverse the objection and specifically argue how the specification is enabling.',
      'traverse the objection and submit an additional drawing to make the specification enabling.',
      'file a continuation-in-part application that has an enabling specification.',
      'traverse the objection and file an amendment without adding new matter in an attempt to show enablement.',
      'traverse the objection and refer to prior art cited in the specification that would demonstrate that the specification is enabling to one of ordinary skill.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer (the action that cannot work). 35 U.S.C. § 113: “Drawings submitted after the filing date of the application may not be used (i) to overcome any insufficiency of the specification due to lack of an enabling disclosure.” (A) and (E) are proper traversals (37 CFR § 1.111); (C) is permitted via 35 U.S.C. § 120; (D) is a permissible amendment under 37 CFR § 1.121.',
  },
  {
    id: 'uspto-apr03-pm-27',
    topicId: 0,
    subtopic: 'Inherency — New Property of an Old Product (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] On January 2, 2001, a registered practitioner filed a patent application with the USPTO for inventor Bock. The application includes a specification and a single claim to the invention, which reads as follows: “1. A new string consisting only of material Z that has the ability to stretch to beyond its initial unstretched length.” On June 2, 2001, the practitioner received an Office action from the primary examiner rejecting the claim. The claim is solely rejected under 35 USC 102 in view of Patent A, which discloses a string consisting only of material Z. The Office action states, “Patent A discloses a string consisting only of material Z. Patent A does not expressly teach the stretchability property of the string. Nevertheless, the recited stretchability is inherent in the string of patent A. Accordingly, patent A anticipates the claimed string.” Mr. Bock believes he is entitled to a patent to his new string and authorizes the practitioner to reply to the Office action by arguing that his string stretches to ten times its initial unstretched length, something that patent A does not teach. Since this is not expressly taught in Patent A, the practitioner argues, Patent A cannot anticipate the claimed string. In accordance with USPTO rules and procedures set forth in the MPEP, is the practitioner’s reply persuasive as to error in the rejection?',
    options: [
      'Yes.',
      'Yes, but the claim should now be rejected again, this time under 35 USC 103 as obvious over Patent A.',
      'Yes, because the stretchability property is expressly taught by Patent A.',
      'Yes, examiner nowhere addresses the claimed limitation of stretching the string beyond its initial unstretched length.',
      'No.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — the reply is NOT persuasive. MPEP § 2112, “Something Which Is Old Does Not Become Patentable Upon The Discovery Of A New Property”: claiming a new use, function or unknown property inherently present in the prior art does not make the claim patentable (In re Best, 562 F.2d 1252 (CCPA 1977)). Patent A teaches every element of the string (shape, material Z, consisting only of Z); the examiner properly stipulated the stretchability as inherent, shifting the burden to applicant to show the products actually differ — arguing a property difference without showing a difference in material or shape fails.',
  },
  {
    id: 'uspto-apr03-pm-30',
    topicId: 2,
    subtopic: 'Status Information & Access — Redacted Publications (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Joan goes to a registered practitioner wanting to know the status of the applications of her competitor Pete. During Joan’s previous relationship with Pete she believes she may have been a coinventor on one of the applications filed by Pete. Pete owns Applications A, B, C and D. Application B is a continuation of Application A and a redacted copy of Application A has been published under 35 USC 122(b). Joan is listed as a coinventor on Application C. Pete has an issued patent that claims priority to Application D. Assume only the last six digits of the numerical identifier are available for Application D and Application D is abandoned. Which of the following, in accordance with the USPTO rules and the procedures set forth in the MPEP, is not true?',
    options: [
      'Joan may obtain status information for Application B that is a continuation of an Application A since Application A has been published under 35 USC 122(b).',
      'Joan may be provided status information for Application D that includes the filing date if the eight-digit numerical identifier is not available and the last six digits of the numerical identifier are available.',
      'Joan may obtain status information for Application D since a U.S. patent includes a specific reference under 35 USC 120 to Application D, an abandoned application. Joan may obtain a copy of that application-as-filed by submitting a written request including the fee set forth in 37 CFR 1.19(b)(1).',
      'Joan may obtain status information as to Application C since a coinventor in a pending application may gain access to the application if his or her name appears as an inventor in the application, even if she did not sign the § 1.63 oath or declaration.',
      'Joan may obtain access to the entire Application A by submitting a written request, since, notwithstanding the fact that only a redacted copy of Application A has been published, a member of the public is entitled to see the entire application upon written request.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Statement (E) is false and thus the most correct answer. 37 CFR § 1.14(c)(2): where a REDACTED copy of the application was used for the patent application publication, the copy of the specification, drawings and papers available to the public may be LIMITED to the redacted copy. (A)-(C) accord with 37 CFR § 1.14(b)-(c); (D) is true — a coinventor is entitled to access independent of whether they signed the declaration (37 CFR § 1.41(a)(2)).',
  },
  {
    id: 'uspto-apr03-pm-31',
    topicId: 3,
    subtopic: 'Examiner Participation at Oral Hearing (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is true?',
    options: [
      'When the subject matter of an appeal is particularly difficult to understand, a patentability report is prepared by an examiner in order to present the technical background of the case to the Board of Patent Appeals and Interferences.',
      'In those appeals in which an oral hearing has been confirmed and either the Board of Patent Appeals and Interferences or the primary examiner has indicated a desire for the examiner to participate in the oral argument, oral argument may be presented by the examiner whether or not the appellant appears.',
      'If a patent applicant files a notice of appeal which is unsigned, it will be returned for signature, but the applicant will still receive the filing date of the unsigned notice of appeal.',
      'Statements made in information disclosure statements are not binding on an applicant once the patent has issued since the sole purpose of the statement is to satisfy the duty of disclosure before the Office.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 1209, “Participation by Examiner”: where an oral hearing is confirmed and the Board or the examiner has indicated a desire for examiner participation, the examiner may present oral argument whether or not the appellant appears. (A) — patentability reports serve a different purpose (MPEP § 705); (C) — a notice of appeal is not returned for signature; no signature is required (37 CFR § 1.196(b); MPEP § 1205); (D) — see Gentry Gallery v. Berkline, 134 F.3d 1473 (Fed. Cir. 1998).',
  },
  {
    id: 'uspto-apr03-pm-32',
    topicId: 0,
    subtopic: 'Utility — One Credible Assertion Suffices (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] On January 2, 2001, a registered practitioner filed a patent application with the USPTO for inventor Bloc. The application includes a specification and a single claim to the invention which reads as follows: “1. Compound Y.” In the specification, Bloc explains that compound Y is an intermediate in the chemical manufacture of synthetic Z. With respect to synthetic Z, the specification discloses its structural formula and further states that synthetic Z is modeled on the natural form of Z to give it the same therapeutic ability to alleviate pain. The specification goes on to state that synthetic Z is also a cure for cancer. On June 2, 2001, the practitioner received an Office action from the primary examiner rejecting the claim. The claim is rejected under 35 USC 101 as being inoperative; that is, the synthetic Z does not operate to produce a cure for cancer (i.e., incredible utility). Bloc believes he is entitled to a patent to his compound Y. In accordance with USPTO rules and procedures set forth in the MPEP, how best should the practitioner reply to the rejection of the claim?',
    options: [
      'Advise Bloc that he should give up because a cure for cancer is indeed incredible and is unproven.',
      'File a reply arguing that a cure for cancer is not incredible and he can prove it if given the chance.',
      'File a reply arguing that whether or not a cure for cancer is incredible is superfluous since Bloc has disclosed another utility – alleviating pain, which is not incredible.',
      'File a reply arguing that the claim is directed to compound Y, not synthetic Z.',
      'File a reply arguing that synthetic Z is modeled on the natural form of Z.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the best answer. MPEP §§ 2107.01, 2107.02, “The Claimed Invention Is The Focus Of The Utility Requirement”: an applicant need only make ONE credible assertion of specific utility; additional statements of utility, even if not credible, do not render the invention lacking in utility (In re Gottlieb, 328 F.2d 1016 (CCPA 1964)). Synthetic Z’s disclosed pain-alleviation utility gives intermediate compound Y a credible, substantial and specific utility, making the cancer-cure disclosure superfluous. (D) merely restates what is claimed without showing the required utility; (E) does not go far enough.',
  },
  {
    id: 'uspto-apr03-pm-34',
    topicId: 3,
    subtopic: 'New Matter in Claims — Examiner Treatment (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A first Office action on the merits rejecting Claim 1 under 35 USC 103 as being obvious in view of reference A set a three month shortened statutory period for reply. A registered practitioner files a timely response (without an extension of time) to the first Office action amending Claim 1 to include a limitation not found in reference A or any other prior art of record. However, the limitation also lacks support in applicant’s original disclosure, i.e., it is new matter. Which of the following courses of action, if taken by the primary examiner, would be in accord with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Hold the application abandoned after expiration of the three month shortened statutory period for reply because an amendment adding new matter to the claims is not a bona fide response.',
      'Consider the new matter and reject Claim 1 under 35 USC 101 because a claim that recites new matter lacks utility.',
      'Consider the new matter and treat Claim 1, determining whether the invention as claimed with the new matter, would have been obvious in view of reference A, and reject Claim 1 under 35 USC 112, first paragraph, for lack of support in the original disclosure for new matter.',
      'Ignore the new matter and reject Claim 1 again under § 103 in view of reference A.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP §§ 706.03(o), 2143.03: when evaluating obviousness, ALL claim limitations must be considered and given weight — including unsupported ones — and a claim reciting elements without support in the original disclosure is rejected under § 112 ¶ 1 (Waldemar Link v. Osteonics; In re Rasmussen). (A) fails — a new-matter amendment is not necessarily non-bona-fide, and the applicant would be notified with remaining time to reply (MPEP § 714.03); (B) fails — new matter does not equal lack of utility; (D) contradicts § 2143.03’s requirement to consider the new matter.',
  },
  {
    id: 'uspto-apr03-pm-35',
    topicId: 5,
    subtopic: 'Reexamination — Substantial New Question Basis (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following is a proper basis for establishing a substantial new question of patentability to obtain reexamination in accordance with proper USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'An admission per se by the patent owner of record that the claimed invention was on sale, or in public use more than one year before any patent application was filed in the USPTO.',
      'A prior art patent that is solely used as evidence of an alleged prior public use.',
      'A prior art patent that is solely used as evidence of an alleged insufficiency of disclosure.',
      'A printed publication that is solely used as evidence of an alleged prior offer for sale.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 35 U.S.C. § 302; MPEP § 2217: a substantial new question of patentability may rest only on prior art PATENTS or PRINTED PUBLICATIONS applied directly to the claims under §§ 102/103. An admission per se cannot be the basis (though it may be used in combination with a patent or printed publication), and a patent or publication used solely as evidence of public use, sale, or insufficiency of disclosure is improper — so (A)–(D) all fail.',
  },
  {
    id: 'uspto-apr03-pm-36',
    topicId: 0,
    subtopic: 'Public Use Bar — Underlying Policies (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following is not a policy underlying the public use bar of 35 USC 102(b)?',
    options: [
      'Discouraging the removal, from the public domain, of inventions that the public reasonably has come to believe are freely available.',
      'Favoring the prompt and widespread disclosure of inventions.',
      'Allowing the inventor(s) a reasonable amount of time following sales activity to determine the potential economic value of a patent.',
      'Increasing the economic value of a patent by extending the effective term of the patent up to one year.',
      'Prohibiting the inventor(s) from commercially exploiting the invention for a period greater than the statutorily prescribed time.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. [Pre-AIA] Extending patent term is not a policy underlying any section of 35 U.S.C. § 102. (A), (B), (C) and (E) each state recognized policies underlying the public use bar (Lough v. Brunswick Corp., 86 F.3d 1113 (Fed. Cir. 1996)).',
  },
  {
    id: 'uspto-apr03-pm-37',
    topicId: 2,
    subtopic: 'What Small Entity Status Actually Buys (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, a grant of small entity status entitles an applicant to which of the following?',
    options: [
      'Applicant will receive an accelerated examination by having the application advanced out of order.',
      'Applicant can use a certificate of mailing under 37 CFR 1.8 to obtain a U.S. filing date that is earlier than the actual USPTO receipt date of the application.',
      'Applicant will obtain a refund of all fees paid to the USPTO where applicant demonstrates: (i) a changed purpose for which the fees were paid, (ii) the fees were not paid by mistake, and (iii) the fees were not paid in excess of the amount required.',
      'Applicant can pay a fee to file a request for continued examination pursuant to 37 CFR 1.114 that is less than the fee paid by other than a small entity.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 41(h)(1); 37 CFR §§ 1.17(e), 1.114; MPEP § 509.02: small entity status halves qualifying fees, including the RCE fee. (A) has no support in 37 CFR § 1.102; (B) has no support in § 1.8 (no filing-date benefit); (C) is inconsistent with 35 U.S.C. § 42(d) and 37 CFR § 1.26 (Miessner v. United States).',
  },
  {
    id: 'uspto-apr03-pm-38',
    topicId: 3,
    subtopic: 'Amendments After Notice of Appeal (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with USPTO rules and the procedures set forth in the MPEP, an amendment filed with or after a notice of appeal under 37 CFR 1.191(a), but before jurisdiction has passed to the Board of Patent Appeals and Interferences, should be entered by the primary examiner where the amendment:',
    options: [
      'requests unofficial consideration by the examiner.',
      'is less than six pages long.',
      'removes issues from appeal.',
      'presents more specific claims, because it is believed that they may have a better chance of being allowable even though the claims do not adopt the examiner’s suggestions.',
      'introduces new issues, allowing the examiner to rethink his position.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 CFR § 1.116; MPEP § 1207, first paragraph: after a notice of appeal but before Board jurisdiction attaches, an amendment may be entered where it cancels claims or otherwise REMOVES ISSUES from the appeal (or rewrites dependent claims in independent form). (A), (B) and (D) are purely fictional bases; (E) — introducing new issues is grounds for NON-entry.',
  },
  {
    id: 'uspto-apr03-pm-39',
    topicId: 0,
    subtopic: 'Rebutting a Prima Facie No-Utility Showing (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] An examiner has properly established a prima facie showing of no specific and substantial credible utility for the claimed invention in a patent application filed in February 2001. An applicant can sustain the burden of rebutting and overcoming the showing in accordance with the USPTO rules and the procedures set forth in the MPEP by:',
    options: [
      'Providing reasoning or arguments rebutting the basis or logic of the prima facie showing.',
      'Amending the claims.',
      'Providing evidence in the form of a declaration under 37 CFR 1.132 rebutting the basis or logic of the prima facie showing.',
      'Providing evidence in the form of a printed publication rebutting the basis or logic of the prima facie showing.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 2107, “Examination Guidelines For The Utility Requirement” (penultimate paragraph): the applicant can rebut a prima facie no-utility showing by providing reasoning or arguments, by amending the claims, or by providing evidence in the form of a § 1.132 declaration or a printed publication rebutting the basis or logic of the showing — all four of (A)–(D) are sanctioned routes.',
  },
  {
    id: 'uspto-apr03-pm-40',
    topicId: 1,
    subtopic: 'Incorporation by Reference — Improper Sources (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following is not a proper incorporation by reference in an application prior to allowance according to the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Incorporating material necessary to describe the best mode of the claimed invention by reference to a commonly owned, abandoned U.S. application that is less than 20 years old.',
      'Incorporating non-essential material by reference to a prior filed, commonly owned pending U.S. application.',
      'Incorporating material that is necessary to provide an enabling disclosure of the claimed invention by reference to a U.S. patent.',
      'Incorporating non-essential material by reference to a hyperlink.',
      'Incorporating material indicating the background of the invention by reference to a U.S. patent which incorporates essential material.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 608.01(p): incorporation by reference to a HYPERLINK is improper. (A) is proper — abandoned applications less than 20 years old can be incorporated to the same extent as copending applications; (B) is proper for non-essential material; (C) is proper — essential (enabling) material may be incorporated by reference to a U.S. patent; (E) is proper — non-essential background material may reference a U.S. patent that itself incorporates essential material.',
  },
  {
    id: 'uspto-apr03-pm-41',
    topicId: 0,
    subtopic: '§ 112 ¶ 2 — Evidence Claim Is Not What Applicant Regards (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Evidence that a claim may not comply with the second paragraph of 35 USC 112 occurs in accordance with the USPTO rules and the procedure set forth in the MPEP where:',
    options: [
      'Remarks filed by applicant in a reply or brief regarding the scope of the invention differ and do not correspond in scope with the claim.',
      'There is a lack of agreement between the language in the claims and the language set forth in the specification.',
      'The scope of the claimed subject matter is narrowed during pendency of the application by deleting the originally much broader claims, and presenting claims to only the preferred embodiment within the originally much broader claims.',
      'Claims in a continuation application are directed to originally disclosed subject matter (in the parent and continuation applications) which applicants did not regard as part of their invention when the parent application was filed.',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2172(II): evidence that a claim does not correspond with what applicant regards as the invention may be found in contentions or admissions in briefs or remarks filed by applicant (In re Prater). (B) fails — claims/specification agreement is a § 112 ¶ 1 issue, irrelevant to ¶ 2 (In re Ehrreich); (C) fails — shifting to narrower claims during pendency is permitted (In re Saunders); (D) fails — such continuation claims were held proper and entitled to the parent’s filing date (In re Brower).',
  },
  {
    id: 'uspto-apr03-pm-42',
    topicId: 0,
    subtopic: 'Anticipation — Method-of-Use Claims Escape (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Paprika is a known product. A patent application discloses a composition which is made by subjecting paprika to processing steps X, Y and Z. The composition is disclosed to be useful in treating cancer. The application was filed June 1, 2002. A reference published May 1, 2001 discloses a food product made by subjecting paprika to processing steps X, Y and Z. The reference does not disclose that the resulting composition has any properties that would make it useful for treating cancer. In accordance with USPTO rules and procedures set forth in the MPEP, which of the following claims is not anticipated by the reference?',
    options: [
      'A composition made by the process of subjecting paprika to processing steps X, Y and Z, wherein the composition is effective for treating cancer.',
      'A composition for treating cancer, made by the process of subjecting paprika to processing steps X, Y and Z.',
      'A method of making a cancer-treating composition, comprising subjecting paprika to processing steps X, Y and Z.',
      'A method of treating cancer, comprising administering an effective amount of a composition made by subjecting paprika to processing steps X, Y and Z.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. [Pre-AIA] MPEP §§ 2112, 2112.01, 2131: the METHOD OF TREATING cancer by administering the composition is not disclosed by the reference, so it is not anticipated (Verdegaal Bros. v. Union Oil). (A) fails — “effective for treating cancer” merely states an inherent property of the identical composition (In re Best); (B) and (C) fail — “for treating cancer” / “cancer-treating” are preamble statements of intended use that do not limit the claims.',
  },
  {
    id: 'uspto-apr03-pm-44',
    topicId: 5,
    subtopic: 'Who May Request Reexamination (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following, if any, is true?',
    options: [
      'The loser in an interference in the PTO is estopped from later claiming he or she was the first to invent in a Federal District Court since the loser must win in the USPTO or he/she will lose the right to contest priority.',
      'A person being sued for infringement may file a request for reexamination without first obtaining the permission of the Court in which the litigation is taking place.',
      'A practitioner may not represent spouses, family members or relatives before the USPTO since such representation inherently creates a conflict of interest and a practitioner is likely to engage in favoritism over his/her other clients.',
      'Employees of the USPTO may not apply for a patent during the period of their employment and for two years thereafter.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 35 U.S.C. § 302: ANY person at ANY time may file a request for reexamination — no court permission is needed. (A) fails — an interference loser may proceed in District Court under 35 U.S.C. § 146; (C) fails — there is no prohibition on representing spouses, family members or relatives; (D) fails — the employment bar runs one year after employment ends, not two (35 U.S.C. § 4).',
  },
  {
    id: 'uspto-apr03-pm-45',
    topicId: 2,
    subtopic: 'Material Art Found After Issue Fee Paid (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Al files an application for a patent. After the Notice of Allowance is mailed and the issue fee has been paid Al discovers a prior art reference which is material to patentability. What should Al do in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Al should file a prior art statement under 37 CFR 1.501 that will be placed in the patent file upon issuance of the application as a patent.',
      'Since the issue fee has been paid, Al no longer has a duty to disclose to the Office material prior art. He is under no obligation to submit the prior art reference to the Office.',
      'Since the issue fee has been paid, it is too late to have the examiner consider the reference in this application. Al should file a continuation application to have the reference considered and allow the original patent application to issue as a patent.',
      'Al should file a petition to have the application withdrawn from issuance, citing the finding of additional material prior art as the reason for withdrawal. A continuation application should also be filed with an information disclosure statement containing the reference in order to have the reference considered.',
      'Al should file an amendment under 37 CFR. 1.312 deleting all of the claims which are unpatentable over the reference since an amendment deleting claims is entitled to entry as a matter of right.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.313(b); MPEP §§ 609(B)(4), 1308: after issue-fee payment it is impractical for the Office to consider information disclosures, so the proper course is a petition to withdraw from issue plus a continuation with an IDS carrying the reference. (A) fails — § 1.501 prior art statements apply only to PATENT files; (B) fails — the duty of disclosure continues until the patent issues; (C) fails — the patent should not be allowed to issue with possibly invalid claims; (E) fails — no amendment is entitled to entry after issue-fee payment (§ 1.312(b)).',
  },
  {
    id: 'uspto-apr03-pm-46',
    topicId: 0,
    subtopic: 'Printed Publication — Confidential Internal Report (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with USPTO rules and procedures set forth in the MPEP, which of the following is not a “printed publication” under 35 USC 102(b), with respect to a patent application filed June 1, 2002?',
    options: [
      'A paper that was orally presented at a meeting held May 1, 2001, where the meeting was open to all interested persons and the paper was distributed in written form to six people without restriction.',
      'A doctoral thesis that was indexed, cataloged, and shelved May 1, 2001, in a single, university library.',
      'A research report distributed May 1, 2001, in numerous copies but only internally within an organization and intended to remain confidential.',
      'A reference available only in electronic form on the Internet, which states that it was publicly posted May 1, 2001.',
      'A technical manual that was shelved and cataloged in a public library as of May 1, 2001, where there is no evidence that anyone ever actually looked at the manual.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. [Pre-AIA § 102(b) framing] MPEP § 2128.01: an internal report intended to remain confidential is not a “printed publication.” (A) fails — an orally presented paper with unrestricted written copies IS one; (B) fails — an indexed, cataloged, shelved thesis IS one; (D) fails — an Internet posting is publicly available as of its posting date (MPEP § 2128); (E) fails — no proof anyone actually looked at a shelved, cataloged document is required.',
  },
  {
    id: 'uspto-apr03-pm-47',
    topicId: 0,
    subtopic: '§ 135(b) as an Ex Parte Rejection (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] John, unaware of the existence of Jane’s U.S. patent, which issued on Tuesday, July 11, 2000, files a patent application on Friday, January 11, 2001. John’s application and Jane’s patent are not commonly owned. On Thursday, July 11, 2001, in reply to an Office action rejecting all of his claims, John files an amendment canceling all of his claims and adding claims setting forth, for the first time, “substantially the same subject matter” as is claimed in Jane’s patent. The examiner rejects John’s claims on the basis of 35 USC 135(b). Which of the following statements accords with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'The rejection is improper because 35 USC 135(b) relates to interferences.',
      'The rejection is proper because 35 USC 135(b) is not limited to inter partes proceedings, but may be used as a basis for ex parte rejections.',
      'Since John’s claims would interfere with Jane’s unexpired patent, the proper procedure is for the examiner to declare an interference rather than to reject John’s claims.',
      'The rejection is proper merely by reason of the fact that John’s claims are broad enough to cover the patent claims.',
      'The rejection is improper inasmuch as John is claiming “substantially the same subject matter” as is claimed in the patent.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. [Pre-AIA] MPEP § 715.05: where a patent claims the same invention and its issue date is one year or more before presentation of the claims in the application, a § 135(b) rejection should be made — and In re McGrew, 120 F.3d 1236 (Fed. Cir. 1997) holds § 135(b) is not limited to interferences and may ground ex parte rejections. (D) fails — mere breadth covering the patent claims is not sufficient (In re Frey); (C)/(E) fail — the one-year deadline for presenting such claims had passed (MPEP § 2307).',
  },
  {
    id: 'uspto-apr03-pm-48',
    topicId: 0,
    subtopic: 'Canceled Matter as Prior Art (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following statements regarding a proper prior art reference is true?',
    options: [
      'Canceled matter in the application file of a U.S. patent is a prior art reference as of the filing date under 35 USC 102(e).',
      'Where a patent refers to and relies on the disclosure of a copending subsequently abandoned application, such disclosure is not available as a reference.',
      'Where the reference patent claims the benefit of an earlier filed, copending but subsequently abandoned application which discloses subject matter in common with the patent, and the abandoned application has an enabling disclosure for the common subject matter and the claimed matter in the reference patent, the effective date of the reference patent as to the common subject matter is the filing date of the reference patent.',
      'Matter canceled from the application file wrapper of a U.S. patent may be used as prior art as of the patent date.',
      'All foreign patents are available as prior art as of the date they are translated into English.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. [Pre-AIA] MPEP § 901.01: matter canceled from the file wrapper of a U.S. patent may be used as prior art AS OF THE PATENT DATE, as prior public knowledge under § 102(a) (In re Lund). (A) fails — canceled matter is NOT a reference as of the filing date under § 102(e) (Ex parte Stalego); (B) fails — disclosure relied on from a copending abandoned application IS available (In re Heritage); (C) fails — the effective date for the common subject matter is the ABANDONED application’s filing date (In re Switzer); (E) fails — foreign patents are references as of their patenting/publication date, not translation date (MPEP § 901.05).',
  },
];

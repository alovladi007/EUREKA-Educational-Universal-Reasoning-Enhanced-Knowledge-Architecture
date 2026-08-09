/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, April 18, 2001 — Morning Session, with the
 * USPTO's official Model Answers. Retrieved from the USPTO's published PDFs
 * (edo0104aq.pdf / edo0104aa.pdf, via the Internet Archive copy of uspto.gov).
 * US Government works — public domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the Oct 2003,
 * Apr 2003, Apr 2002 and Oct 2001 files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper are preserved).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Question 22 of this session was officially discarded by the USPTO
 *    ("All answers accepted") and is excluded.
 *  - DUAL-KEY ANOMALY: for Q10 the USPTO accepted BOTH (A) and (D) as
 *    correct. This bank stores a single key, so Q10 is keyed to (A) — the
 *    answer the model answer analyses first and at length — and the
 *    explanation states plainly that (D) was also officially accepted, so a
 *    learner who reasons to (D) is told they were not wrong.
 *  - ERA NOTE: this exam predates the AIA (2011-2013). Questions turning on
 *    pre-AIA 35 U.S.C. 102/103 (the "in this country" limits of 102(a)/(b),
 *    102(f) derivation, 102(g), Rule 131 antedating, and the pre-KSR
 *    obviousness framework) carry an explicit [Pre-AIA] tag. Questions built
 *    on since-superseded procedure (CPA practice, the pre-2004 Board rules of
 *    37 CFR 1.19x) carry a [Historical practice] tag — the reasoning style
 *    remains instructive, but the specific rule has changed. Verified status:
 *    OFFICIAL (USPTO model answers).
 *
 * Ingested: AM session Q1-Q21 and Q23-Q50 (49 of 49 scoreable).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2001_AM_SOURCE =
  'USPTO Registration Examination, April 18, 2001 — Morning Session (official model answers; public domain)';

export const USPTO_APR2001_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr01-am-01',
    topicId: 3,
    subtopic: 'Affidavits Filed With an Appeal Brief — Jurisdiction (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] You are assigned by your firm to prosecute a patent application, which had been prepared and prosecuted by a former member of the firm. A Notice of Appeal had been filed and while in the process of preparing the Appeal Brief, you discover that data in the applicant’s original notes would materially aid in persuading the Board as to the patentability of the appealed claims. Accordingly, you incorporate the data in an Affidavit and file the Affidavit with the USPTO together with the Appeal Brief. In light of this scenario, which of the following statements is true?',
    options: [
      'Since jurisdiction has not passed to the Board, the examiner may admit the Affidavit but require a showing of good and sufficient reasons why the Affidavit was not earlier presented.',
      'Since jurisdiction has not passed to the Board, the Board will automatically remand the Affidavit for consideration by the examiner and hold consideration of the Appeal Brief in abeyance.',
      'Since jurisdiction has passed to the Board, the Board may or may not consider the Affidavit as it sees fit.',
      'Although authority from the Board is not necessary to consider the Affidavit, the examiner may not consider the Affidavit unless it is remanded to the examiner by the Board.',
      'Since jurisdiction has passed to the Board, the Board will consider the Affidavit concurrently with the Appeal Brief.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.195; MPEP § 1211.02. (E) and (C) are wrong because jurisdiction has NOT passed to the Board — that happens only after the examiner’s answer and the appeal is docketed. MPEP § 1210. (B) and (D) are wrong because a remand is an action by the Board taken when it has jurisdiction of the case. MPEP § 1211. [Historical practice — Board appeal rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-apr01-am-02',
    topicId: 2,
    subtopic: 'Continued Prosecution Application Eligibility (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] You are deciding whether to file continued prosecution applications (CPA) for prior applications before the earliest of payment of any issue fee on the prior application (and absent any petition under 37 C.F.R. § 1.313(c)), abandonment of the prior application, or termination of proceedings on the prior application. In which of the following circumstances is it proper to use the CPA procedure to file the application?',
    options: [
      'To file a divisional application of a prior complete provisional application for a utility invention filed under 35 U.S.C. § 111(b). The provisional application has an actual filing date after June 8, 1995.',
      'To file a continuation-in-part application of a prior complete nonprovisional utility application filed under 35 U.S.C. § 111(a). The nonprovisional application has an actual filing date prior to November 29, 1999.',
      'To file a continuation utility application of a prior complete nonprovisional utility application filed under 35 U.S.C. § 111(a). The nonprovisional application has an actual filing date prior to May 29, 2000.',
      'To file a continuation utility application of a prior complete CPA utility application. The prior CPA application has an actual filing date of June 1, 2000, and is a continuation application of a prior complete utility application filed under 35 U.S.C. § 111(a) having an actual filing date of November 28, 1999.',
      'To file a divisional application of a prior complete nonprovisional plant application filed under 35 U.S.C. § 111(a). The nonprovisional application has an actual filing date after May 29, 2000.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. Under 37 C.F.R. § 1.53(d)(1), a continuation may be filed as a CPA provided the prior nonprovisional was filed under 35 U.S.C. § 111(a) BEFORE May 29, 2000 and is complete under § 1.51(b). (A) is wrong — § 1.53(d)(1) does not authorize a CPA of a prior PROVISIONAL application. (B) is wrong — a continuation-in-part may not be filed as a CPA. (D) is wrong — the prior CPA was itself filed June 1, 2000, after the May 29, 2000 cutoff; the first application’s November 28, 1999 date is used only for identification. (E) is wrong — the prior application was filed on or after May 29, 2000. [Historical practice — CPA practice for utility and plant applications was eliminated in 2003.]',
  },
  {
    id: 'uspto-apr01-am-03',
    topicId: 3,
    subtopic: 'IDS Content Requirements — 37 CFR 1.98 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accordance with proper USPTO practice and procedure regarding patent applications filed in March 2001?',
    options: [
      'If a non-English reference is submitted in an information disclosure statement, the applicant shall include a copy of the translation if a written English-language translation of the non-English-language document, or portion thereof, is within the possession, custody, or control of, or is readily available to any individual designated in § 1.56(c).',
      'Each U.S. patent listed in an information disclosure statement must be identified by inventor, application number, and issue date.',
      'Each publication listed in an information disclosure statement must be identified by publisher, author (if any), title, relevant pages of the publication, date, and place of publication.',
      'When the disclosures of two or more patents or publications listed in an information disclosure statement are substantively cumulative, a copy of one of the patents or publications may be submitted without copies of the other patents or publications, provided that it is stated that these other patents or publications are cumulative.',
      'A copy of any patent, publication, pending U.S. application or other information listed in an information disclosure statement is required to be provided, even if the patent, publication, pending U.S. application or other information was previously submitted to, or cited by, the Office in an earlier application, unless: (1) the earlier application is properly identified in the information disclosure statement and is relied on for an earlier effective filing date under 35 U.S.C. 120; and (2) the information disclosure statement submitted in the earlier application is in full compliance with appropriate regulations.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. The APPLICATION number of each patent is not required — 37 CFR § 1.98(b)(1) provides that "Each U.S. patent listed in an information disclosure statement must be identified by inventor, patent number, and issue date." The elements of (A) are found in § 1.98(a)(3)(ii); of (C) in § 1.98(b)(5); of (D) in § 1.98(c); and of (E) in § 1.98(d).',
  },
  {
    id: 'uspto-apr01-am-04',
    topicId: 5,
    subtopic: 'Maintenance Fees — When the Office May Return Payment (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A maintenance fee in the correct amount is received by the USPTO on February 8, 2001, prior to the due date. The maintenance fee payment includes identification of a U.S. patent number. In accordance with proper USPTO rules and procedure, in which of the following situations may the USPTO return the maintenance fee payment?',
    options: [
      'The maintenance fee payment is submitted by the patentee’s grandmother, without authorization by the patentee, and includes identification of the U.S. application number for patent.',
      'The maintenance fee payment is submitted by the attorney of record in the application, without authorization by the patentee, and includes identification of the U.S. application number for the patent.',
      'The maintenance fee payment is submitted by the attorney of record in the application, with authorization by the patentee, and does not include identification of the U.S. application number for the patent.',
      '(A) and (B).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 CFR § 1.366(c) (effective Sept. 8, 2000). Under § 1.366(a) any person or organization may pay maintenance fees on behalf of a patentee — authorization is not required. Section 1.366(c) provides that if the payment identifies only the patent number and not the application number, "the Office may apply the payment … or may return the payment." Only in (C) does the USPTO have the option of returning the fee. (A) and (B) are each incorrect; (D) is incorrect because (A) and (B) are; (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr01-am-05',
    topicId: 5,
    subtopic: 'Where the Office Sends a Maintenance Fee Reminder (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A patent issued to Joe Inventor on July 25, 2000 based on an application filed in January 1999. Larry Practitioner was the registered practitioner of record in the application, and all correspondence from the USPTO during prosecution was directed to Larry at his then-current address. At the time he paid the issue fee, Larry designated a “fee address” for payment of maintenance fees. Larry moved his office on September 1, 2000, and notified the Office of Enrollment and Discipline of his new address in accordance with 37 C.F.R. § 10.11. Larry did not, however, file a change of correspondence address in the patent file. An assignment of all rights in the patent from Joe Inventor to Big Corporation was made September 5, 2000 and was recorded in the USPTO on September 14, 2000. Under standard USPTO practice and procedure, where will the USPTO send any Maintenance Fee Reminder?',
    options: [
      'Joe Inventor’s address as indicated on the inventor’s declaration, unless a change of address had been filed for Mr. Inventor.',
      'Larry Practitioner’s address prior to September 2000.',
      'Larry Practitioner’s address subsequent to September 1, 2000.',
      'The fee address designated by Larry Practitioner at the time he paid the issue fee.',
      'The address of the assignee as indicated on the assignment recorded in the USPTO.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. The Maintenance Fee Reminder is sent to the correspondence address used during prosecution UNLESS a fee address has been designated — and here one was. 37 C.F.R. § 1.363; MPEP § 2540.',
  },
  {
    id: 'uspto-apr01-am-06',
    topicId: 5,
    subtopic: 'Where the Office Sends Reexamination Correspondence (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] On the same facts (Larry Practitioner of record, a designated fee address, an office move notified only to the Office of Enrollment and Discipline, and a recorded assignment to Big Corporation), under standard USPTO practice and procedure, where will the USPTO send a communication for Big Corporation concerning a request for reexamination involving the patent?',
    options: [
      'Joe Inventor’s address as indicated on the inventor’s declaration, unless a change of address had been filed for Mr. Inventor.',
      'Larry Practitioner’s address prior to September 2000.',
      'Larry Practitioner’s address subsequent to September 1, 2000.',
      'The fee address designated by Larry Practitioner at the time he paid the issue fee.',
      'The address of the assignee as indicated on the assignment recorded in the USPTO.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. See 37 C.F.R. § 1.33(c); MPEP §§ 2222 and 403 — in a reexamination proceeding, correspondence for the patent owner goes to the attorney or agent of record at the address listed on the register of patent attorneys and agents, which Larry updated with the Office of Enrollment and Discipline. The designated fee address governs maintenance fee correspondence only.',
  },
  {
    id: 'uspto-apr01-am-07',
    topicId: 3,
    subtopic: 'RCE — When Prosecution Is Closed (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] For purposes of determining whether a request for continued examination is in accordance with proper USPTO rules and procedure, in which of the following situations will prosecution be considered closed?',
    options: [
      'The last Office action is a final rejection.',
      'The last Office action is an Office action under Ex Parte Quayle.',
      'A notice of allowance has issued following a reply to a first Office action.',
      'The application is under appeal.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.114 (effective August 16, 2000); 65 FR 50092, 50097. (A) is a final action (§ 1.113), and 65 FR 50097 states in pertinent part "…an action that otherwise closes prosecution in the application (e.g., an Office action under Ex Parte Quayle …)." Thus (A), (B), (C) and (D) are individually correct, and (E), being the most inclusive, is the most correct answer.',
  },
  {
    id: 'uspto-apr01-am-08',
    topicId: 5,
    subtopic: 'Interviews in Ex Parte Reexamination (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accord with proper USPTO practice and procedure regarding ex parte reexaminations filed in March 2001?',
    options: [
      'In every instance of an interview with an examiner in an ex parte reexamination proceeding, a complete written statement of the reasons presented at the interview as warranting favorable action must be filed by the patent owner.',
      'An interview does not remove the necessity for reply to Office actions as specified in 37 CFR § 1.111.',
      'A patent owner’s reply to an outstanding Office action after the interview does not remove the necessity for filing the written statement of the reasons presented at the interview as warranting favorable action.',
      'The written statement must be filed as a separate part of a reply to an Office action outstanding at the time of the interview, or as a separate paper within one month from the date of the interview, whichever is later.',
      'Third party requesters have the option of attending interviews, but their presence is not mandatory.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Third party requesters do NOT have the option of attending interviews — 37 CFR § 1.560(a) provides in part that "[r]equests that reexamination requesters participate in interviews with examiners will not be granted." Items (A) through (D) each restate a portion of § 1.560(b).',
  },
  {
    id: 'uspto-apr01-am-09',
    topicId: 1,
    subtopic: 'Written Description — Presumption and Burden (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'A written description as filed in a nonprovisional patent application is presumed adequate under 35 U.S.C. § 112 in the absence of evidence or reasoning to the contrary.',
      'An examiner may show that a written description as filed in a nonprovisional patent application is not adequate by presenting a preponderance of evidence why a person of ordinary skill in the art would not recognize in the applicant’s disclosure a description of the invention defined by the claims.',
      'A general allegation of “unpredictability in the art” is sufficient to support a rejection of a claim for lack of an adequate written description.',
      'When filing an amendment, a practitioner should show support in the original disclosure for new or amended claims.',
      'When there is substantial variation within a genus, an applicant must describe a sufficient variety of species to reflect the variation within the genus.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C), not being in accord with proper USPTO practice and procedure, is the most correct answer. As stated in the "Written Description" Guidelines, 66 F.R. 1099, 1107 (Jan. 5, 2001): "A general allegation of ‘unpredictability in the art’ is not a sufficient reason to support a rejection for lack of adequate written description." (A), (B), (D) and (E) each restate the Guidelines verbatim and are therefore in accord with practice.',
  },
  {
    id: 'uspto-apr01-am-10',
    topicId: 1,
    subtopic: 'Antecedent Basis and Indefiniteness (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Independent claim 1, fully supported by the specification in a patent application states: Claim 1. An apparatus comprising: a plastic valve; a copper pipe connected to the plastic valve; and an aluminum pipe connected to the plastic valve. Which of the following claims, presented in the application, provide the basis for a proper rejection under 35 U.S.C. § 112, second paragraph? Claim 2. The apparatus of claim 1, wherein said pipe is statically charged. Claim 3. The apparatus of claim 1, wherein the outer surface of said copper pipe is statically charged. Claim 4. The apparatus of claim 1, further comprising a thermostat connected to said plastic valve.',
    options: ['Claim 2.', 'Claim 3.', 'Claim 4.', 'Claims 2 and 3.', 'Claims 3 and 4.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): "(A) or (D) are accepted as correct answers." MPEP § 2173.05(e). Claim 2 is indefinite because it is not clear which "said pipe" is referred to, since claim 1 recites both a copper pipe and an aluminum pipe — so claim 2 necessarily supports a § 112 second paragraph rejection. Claim 3 can be construed as definite, since "the outer surface" is an inherent part of the pipe requiring no antecedent recitation; but it can alternatively be read as ambiguous as to WHICH outer surface, so (D) — recognising both claims 2 and 3 — was also accepted. Selecting (B) alone was NOT accepted because it fails to recognise claim 2 as indefinite. Claim 4 is definite because "said plastic valve" has antecedent basis, so (E) is incorrect. NOTE: this bank stores one key and uses (A); if you answered (D), the USPTO accepted that too.',
  },
  {
    id: 'uspto-apr01-am-11',
    topicId: 3,
    subtopic: 'Complete Reply to a Requirement for Information (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Registered practitioner Ethel prepares a utility patent application (not a CPA) for inventor Fred, using her only copy of a published article, “Engineering Design,” published June 8, 1995, to draft the application. Thereafter, Ethel accidentally runs the copy of the article through her paper shredder. Ethel duly files the application in the USPTO on May 29, 1999. The examiner sends Ethel a non-final Office action dated December 7, 2000, setting a three-month period for reply, including a rejection of claim 1 and a requirement for information under 37 CFR § 1.105 requiring her to submit a copy of the article, “Engineering Design.” Which of the following will properly be accepted by the USPTO as a complete reply to the requirement for information?',
    options: [
      'An information disclosure statement, filed by Ethel on Monday, January 15, 2001, that complies with the provisions of 37 CFR § 1.98, listing a foreign patent, and stating that each item of information contained in the information disclosure statement was first cited in a communication from a foreign patent office less than three months prior to the filing of the information disclosure statement.',
      'A statement filed by Ethel on Wednesday, March 7, 2001, stating that Ethel is not an individual identified under 37 CFR § 1.56(c).',
      'A statement filed by Ethel on Thursday, March 8, 2001, with the appropriate petition and fee for a one-month extension, that states that the information required to be submitted is not readily available to the party from which it was requested.',
      'A statement filed by Ethel on Thursday, March 8, 2001, with the appropriate petition and fee for a one month extension, which states that Ethel has a good faith belief that the information required is not material to patentability.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.105(a)(3) — a statement that the required information is not readily available to the party from which it was requested is an accepted complete reply; the one-month extension under § 1.136(a)(1) makes it timely. (A) is incorrect because it is not responsive to the requirement. (B) is incorrect because "each attorney or agent who prepares or prosecutes the application" IS an individual identified under § 1.56(c). (D) is incorrect because information used to draft an application may be required under § 1.105(a)(1)(iv). (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr01-am-12',
    topicId: 7,
    subtopic: 'Duty of Disclosure — Practitioner’s Own Knowledge (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In January 2000, Chris invents an electrical door stop for automatically stopping a door at any position by simply pressing the doorknob downward. During a lunch break before completing the writing of the application, Chris’ patent agent, Sam, visits a local Shack restaurant and notices a door stop which is actuated by stepping with one’s foot on a mechanical lever located at the bottom of the door. Sam makes a mental note to ask a colleague whether he needs to disclose the doorstop at the Shack restaurant to the USPTO in an information disclosure statement, but ultimately neglects to do so. Sam knows that the restaurant (and doorstop) was in existence at least one year prior to Sam’s visit. In the first Office action, the only prior art uncovered by the examiner relates to stopping a door using a lever that engages a channel in the ceiling upon being pressed upward. The examiner rejects the claim asserting it would have been obvious to have either upward or downward actuating motion. In the reply Sam argues that the downward motion is essential because it affords the ability to actuate when one is carrying a package and that the prior art does not disclose a downwardly actuated doorstop. Following Sam’s argument, the case issues. Which of the following is true?',
    options: [
      'Since Sam knew of the doorstop at the restaurant and not Chris, there is no duty to disclose the Shack restaurant doorstop. An attorney need not disclose that which is within his personal knowledge in an information disclosure statement.',
      'Since Sam discovered the Shack restaurant device after he had started writing the application, the invention was fully disclosed to Sam. There is no need to disclose that which occurs after an inventor completes his application disclosure.',
      'Sam needs to disclose only patents or printed publications to the USPTO to satisfy the duty of disclosure. Since Sam was unaware of any patent or printed publication for the Shack restaurant doorstop, Sam does not need to file an information disclosure in this regard.',
      'Chris should file a request for reexamination seeking to have the Shack restaurant door stop considered.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Since the claim reads on a downward moving actuator and only an upward moving actuator was cited, the Shack restaurant device was material to patentability — and Sam argued the significance of the downward motion. 37 C.F.R. § 1.56(b)(2)(i); Sam should have disclosed it under § 1.56(c)(2). As to (A), the duty of disclosure extends to EACH practitioner who prepares or prosecutes the application. As to (B), the sighting occurred before the filing date, and the restaurant doorstop had existed at least a year before Sam’s visit. MPEP § 2001.06. As to (C), material information is more than just patents and printed publications. As to (D), only patents and printed publications may be considered in reexamination. 35 U.S.C. § 303(a).',
  },
  {
    id: 'uspto-apr01-am-13',
    topicId: 1,
    subtopic: 'How Multiple Dependent Claims Are Construed (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] The following statements relate to “multiple dependent claims.” Which statement is not in accord with proper USPTO practice and procedure?',
    options: [
      'A multiple dependent claim contains all the limitations of all the alternative claims to which it refers.',
      'A multiple dependent claim contains in any one embodiment only those limitations of the particular claim referred to for the embodiment under consideration.',
      'A multiple dependent claim must be considered in the same manner as a plurality of single dependent claims.',
      'Restriction may be required between the embodiments of a multiple dependent claim.',
      'The limitations or elements of each claim incorporated by reference into a multiple dependent claim must be considered separately.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it is inconsistent with 35 U.S.C. § 112 and MPEP § 608.01(n), subpart I.B.4. A multiple dependent claim does NOT contain all the limitations of all the alternative claims at once; it contains, in any one embodiment, only the limitations of the particular claim referred to for that embodiment. (B), (C) and (E) are wrong answers because they are consistent with § 112 and MPEP § 608.01(n)(I)(B)(4). (D) is wrong because it is consistent with MPEP § 608.01(n)(I)(C).',
  },
  {
    id: 'uspto-apr01-am-14',
    topicId: 1,
    subtopic: 'Claim Form and Arrangement (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Regarding claims, which of the following practices is not in accordance with proper USPTO practice and procedure?',
    options: [
      'A singular dependent claim 2 could read as follows: 2. The product of claim 1 in which…',
      'An application may contain a series of singular dependent claims in which a dependent claim refers to a preceding claim which, in turn, refers to another preceding claim.',
      'A dependent claim may refer back to any preceding independent claim.',
      'A claim which depends from a dependent claim may be separated therefrom by any claim which does not also depend directly or indirectly from said “dependent claim.”',
      'Each claim begins with a capital letter and ends with a period.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 608.01(n), part "IV. Claim Form and Arrangement": a claim which depends from a dependent claim should NOT be separated therefrom by any claim which does not also depend from said "dependent claim." (A), (B) and (C) are incorrect because they are practices permitted by MPEP § 608.01(n)(IV). (E) is incorrect because it represents a practice encouraged by MPEP § 608.01(m). See Fressola v. Manbeck, 36 USPQ2d 1211 (D.D.C. 1995).',
  },
  {
    id: 'uspto-apr01-am-15',
    topicId: 3,
    subtopic: 'Requirement for Information in a Reissue — 37 CFR 1.105 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is/are information which the USPTO may require an attorney of record in a reissue application to submit in a reply to a first Office action dated April 12, 2001?',
    options: [
      'Information used in invention process: A copy of any non-patent literature, published application, or patent (U.S. or foreign) that was used in the invention process, such as by designing around or providing a solution to accomplish an invention result.',
      'The publication date of an undated document mentioned by applicant which may qualify as printed publication prior art.',
      'Comments on a new decision by the Federal Circuit that appears on point in the examination of the aplication.',
      '(A), (B), and (C).',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR § 1.105(a) (effective Nov. 7, 2000); 65 FR 54604, 54634. (A) is specifically stated as an example in § 1.105(a)(1)(v). (B) and (C) are given as examples at 65 FR 54634 of information the Office may require. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-apr01-am-16',
    topicId: 5,
    subtopic: 'Admissions as Prior Art and the Limits of Reissue (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Stan, through a registered practitioner, files an application for a patent. During the prosecution of Stan’s patent, in an amendment, the practitioner admitted in his discussion as to “all the claims” of Stan’s application, that “the most pertinent available prior art known to the Applicants and their representatives is the Acme Patent, cited by the examiner.” Within one year after the patent issues, Stan comes to you and wants to file a reissue to broaden his claims, based on the fact that the Acme patent is not prior art. He has ample evidence to show that he conceived and reduced his invention to practice before the filing date of the Acme patent. Which of the following is true?',
    options: [
      'Stan should file a reissue application accompanied by a declaration under 37 C.F.R. 1.131 to swear behind the date of the Acme reference. The statement by the registered practitioner, who formerly represented Stan, that the Acme patent was prior art constituted error without deceptive intent and may be corrected by reissue.',
      'The explicit admission by the registered practitioner, who formerly represented Stan, that the Acme patent constituted prior art is binding on Stan in any later proceeding involving the patent.',
      'Stan should file a request for reexamination and submit the Acme patent along with evidence in the form of affidavits or declarations showing that the Acme patent is not prior art.',
      'Since the Acme patent was cited by the examiner and not by the registered practitioner, who formerly represented Stan, Stan can not be held accountable for the error. Moreover, the statement by the registered practitioner was directed to the pertinence of the prior art and not to the issue of whether the date of the Acme patent could be sworn behind. Accordingly, the statement has no binding effect.',
      '(A) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. Admissions by applicant constitute prior art. 37 C.F.R. § 1.104(a)(3). As explained in Tyler Refrigeration v. Kysor Industrial Corp., 777 F.2d 687, 227 USPQ 845 (Fed. Cir. 1985), an attorney’s explicit admission during prosecution that a reference was "the most pertinent available prior art" was binding on the patentee. Since (B) is true, (D) is not. Answers (A), (C) and (D) are also not true, since the Acme patent cannot be sworn behind or otherwise removed as a result of the admission. (E) is not true because (A) and (D) are not. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-17',
    topicId: 3,
    subtopic: 'Statements Commenting on Reasons for Allowance (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following statements involving an examiner’s statement of reasons for allowance in a Notice of Allowance dated February 8, 2001, is in accordance with USPTO rules and procedure?',
    options: [
      'Failure by applicant or patent owner to file a statement commenting on the reasons for allowance cannot give rise to any implication that the applicant or patent owner agrees with or acquiesces in the reasoning of the examiner.',
      'If applicant files a statement commenting on the reasons for allowance, failure by the examiner to respond to applicant’s statement gives rise to the implication that the examiner agrees with applicant’s statement.',
      'If applicant files a statement commenting on the reasons for allowance, failure by the examiner to respond to applicant’s statement does not give rise to any implication.',
      '(A) and (C)',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.104(e) (effective Nov. 7, 2000); 65 FR 54604, 54633: "That the examiner does not respond to a statement by the applicant commenting on reasons for allowance does not mean that the examiner agrees with or acquiesces in the reasoning of such statement." (A) is incorrect — "the failure of an applicant to comment on damaging reasons for allowance would give rise to a presumption of acquiescence to those reasons." (B) is therefore incorrect; (D) is incorrect because (A) is; (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr01-am-18',
    topicId: 6,
    subtopic: 'RCE Practice Does Not Apply to Design Applications (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Registered practitioner Joe files a design patent application under 37 CFR § 1.53(b) having one claim on May 6, 1999. The USPTO sends Joe a notice of allowance dated November 10, 2000. Joe pays the issue fee on November 15, 2000. On November 23, 2000, Joe learns about a publication (the “Smith Reference”) which he knows to be material to patentability of the claim, but which was not considered by the examiner during prosecution of the application. Joe prepares an information disclosure statement that complies with the provisions of 37 CFR § 1.98, listing the Smith reference. Which of the following actions, if taken by Joe on November 24, 2000, will result in a request for continued examination of the application being granted in accordance with USPTO rules and procedure?',
    options: [
      'Filing a request for continued examination of the application with the information disclosure statement listing the Smith Reference, without the fee set forth in 37 CFR § 1.17(e).',
      'Filing a request for continued examination of the application with the information disclosure statement listing the Smith Reference, and the fee set forth in 37 CFR § 1.17(e).',
      'Filing a request for continued examination of the application with the information disclosure statement listing the Smith Reference, the fee set forth in 37 CFR § 1.17(e), and a petition under 37 CFR § 1.313 with the fee set forth in 37 CFR § 1.17(h).',
      '(B) or (C) above.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.114(e) (effective Aug. 16, 2000); 65 FR 50092, 50097. (E) is correct because the provisions of § 1.114 do NOT apply to DESIGN patent applications at all — no RCE can be granted here regardless of fees or petitions. Therefore choices (A) through (D) are incorrect.',
  },
  {
    id: 'uspto-apr01-am-19',
    topicId: 0,
    subtopic: 'On-Sale Bar Despite Misappropriation (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In early 1999, at the request of MC Motors, Eve demonstrated her reverse automobile heating system at a testing facility in Germany. MC Motors signs a confidentiality agreement and agrees not to disclose the invention to anyone. The test is conducted in a secluded area and the persons involved are sworn to secrecy. Unbeknownst to Eve, MC Motors installs the reverse heating system on its MC cars and begins selling its cars with the reverse heating system in the United States in September 1999. In August 2000, MC files a patent application in the United States for the reverse automobile heating system. In December 2000, Eve files a patent application claiming the automobile heating system. The examiner rejects all the claims in Eve’s application based upon an MC Motors brochure advertising its cars in September 1999. Which of the following is true?',
    options: [
      'Eve is not entitled to a patent since the invention was on sale in this country, more than one year prior to the date of the application for patent in the United States.',
      'Since the MC Motors misappropriated the invention and since Eve did not authorize the sale, the rejection may be overcome by showing that the sales by MC Motors were not authorized by Eve.',
      'MC Motors is entitled to a patent since although it misappropriated the idea for the invention from Eve, the misappropriation was beyond the jurisdiction of the USPTO.',
      '(A) and (C).',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. In Evans Cooling Systems, Inc. v. General Motors Corp., 125 F.3d 1448, 44 USPQ2d 1037 (Fed. Cir. 1997), the Federal Circuit held that even though an invention is misappropriated by a third party, the public sale bar of 35 U.S.C. § 102(b) applies. Accordingly (A) is true and (B) is not. (C) is incorrect since the people at MC were not the true inventors, so the misappropriation IS within the jurisdiction of the USPTO; 35 U.S.C. § 102(f). (D) is incorrect inasmuch as (C) is; (E) is incorrect inasmuch as (A) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-20',
    topicId: 0,
    subtopic: 'Obviousness — A Rationale Different From Applicant’s Is Permissible (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A patent application filed in the USPTO claims a nylon rope coated with element E for the purpose of preventing breakage of the rope. In the first Office action, the examiner rejects the claim as obvious over P in view of a trade journal publication, T. P teaches a nylon rope coated with resin for the purpose of making the rope waterproof. T teaches a nylon tent fabric coated with element E for the purpose of making the tent waterproof, and suggests the use of element E for making other nylon products waterproof. Following proper USPTO practices and procedures, the combination of P and T:',
    options: [
      'cannot support a prima facie case of obviousness because T lacks a suggestion to combine with P for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because P lacks a suggestion to combine with T for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness, even though T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness because the applicant is always under an obligation to submit evidence of non-obviousness regardless of whether the examiner fully establishes a prima facie case of obviousness.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. "It is not necessary in order to establish a prima facie case of obviousness … that there be a suggestion or expectation from the prior art that the claimed [invention] will have the same or a similar utility as one newly discovered by the applicant." In re Dillon, 919 F.2d 688, 692 (Fed. Cir. 1990); MPEP § 2144 ("Rationale Different from Applicant’s is Permissible"). (A)-(C) are incorrect because the suggestion to combine need not be for the same purpose the applicant discloses. (E) is incorrect because an applicant is under no obligation to submit evidence of non-obviousness unless the examiner first fully establishes a prima facie case. MPEP § 2142. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-21',
    topicId: 3,
    subtopic: 'New Matter Cannot Be Added by RCE (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is true?',
    options: [
      'For a nonprovisional utility patent application filed in the USPTO on January 10, 2001, formal drawings are required to overcome an objection issued during initial review that drawings in the application do not comply with 37 C.F.R. § 1.84(g) and (u)(1).',
      'If the primary examiner requires formal drawings at the time a patent application is allowed and sets a three month period of time from the mail date of a notice of allowability within which to file the drawings to comply with 37 C.F.R. § 1.84, the applicant may obtain an extension of time to file the formal drawings by filing a petition for an extension of time under 37 CFR § 1.136(a) or (b) and the appropriate fee.',
      'For a nonprovisional application filed on November 2, 2000, to claim the benefit under 35 U.S.C. § 119(e) of the filing date of a provisional application filed on November 6, 1999, the nonprovisional application must be copending with the provisional application.',
      'In those instances in which an applicant seeks to add new matter to the disclosure of an application, a request for continued examination is not a proper procedure for adding the new matter.',
      'A nonprovisional utility application in the name of inventor Smith filed on January 18, 2001, may properly claim the benefit of the filing date of a provisional utility application filed in Smith’s name on January 24, 2000, where the provisional application is entitled to a filing date even though the basic filing fee for the provisional application was not paid.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 132(a); 37 C.F.R. § 1.114. "In those instances in which an applicant seeks to add new matter to the disclosure of an application, the procedure set forth in § 1.114 is not available, and the applicant must file a continuation-in-part application under § 1.53(b)." (A) is wrong — at a minimum, corrected drawings suitable for reproduction are required, not formal drawings. § 1.85(b). (B) is wrong — the three-month period under § 1.85(c) is NOT extendable under § 1.136(a) or (b). (C) is wrong — 35 U.S.C. § 119(e)(2) was amended to eliminate the copendency requirement. (E) is wrong — the provisional basic filing fee must be paid within the § 1.53(g) period. § 1.78(a)(4).',
  },
  {
    id: 'uspto-apr01-am-23',
    topicId: 4,
    subtopic: 'PCT Request — A Missing Applicant Signature (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Mitch and Mac are named inventors on an international application that is filed in the USPTO Receiving Office, and designates the United States of America. Mac now indicates that he will not sign the Request for the international application. Mitch wishes to proceed with the Request and seeks the advice of their patent agent. Which of the following answers accords with the provisions of the Patent Cooperation Treaty?',
    options: [
      'Mitch’s agent should sign the Request and accompany it with a statement indicating why it is believed that Mac refuses to proceed with the Request.',
      'Mitch should sign the request for himself and also sign on behalf of Mac.',
      'Mitch should sign the request and seek a court order to obtain Mac’s signature.',
      'Mitch should sign the Request and Mitch’s agent should sign on behalf of Mac, since he continues to represent Mac.',
      'Mitch should sign the Request and accompany it with a statement providing a satisfactory explanation for the lack of Mac’s signature.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer because the advice is consistent with PCT Rule 4.15(b) and 37 C.F.R. § 1.425 — where an applicant’s signature is missing, the Request may proceed if accompanied by a statement giving a satisfactory explanation for the omission. (A), (B), (C) and (D) are wrong because the advice given is not consistent with § 1.425. MPEP § 1820.',
  },
  {
    id: 'uspto-apr01-am-24',
    topicId: 2,
    subtopic: 'Who May Sign a Request to Correct Inventorship (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] An amendment filed January 8, 2001, in an unassigned nonprovisional application seeks to cancel claims so that fewer than all of the currently named inventors are the actual inventors of the invention being claimed. The amendment includes a request to delete the names of the persons who are not inventors. In accordance with proper USPTO rules and procedure, the request may be signed by which of the following?',
    options: [
      'A registered practitioner not of record who acts in a representative capacity under 37 CFR § 1.34(a).',
      'All of the applicants (37 CFR § 1.41(b)) for patent.',
      'A registered practitioner of record appointed pursuant to 37 CFR § 1.34(b).',
      '(B) and (C).',
      '(A), (B), and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.48(b) (effective Nov. 7, 2000); 65 FR 54604, 54619: "Sections 1.48(b) and (d) are revised to indicate that a request to correct the inventorship thereunder must be signed by a party as set forth in § 1.33(b)…" (A), (B) and (C) are each provided for in § 1.33(b), so (E), the most inclusive answer, is correct.',
  },
  {
    id: 'uspto-apr01-am-25',
    topicId: 2,
    subtopic: 'Provisional Conversion and Patent Term (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accordance with proper USPTO practice and procedure?',
    options: [
      'Conversion of a provisional application to a nonprovisional application will result in the term of any patent to issue from the application being measured from at least the filing date of the provisional application.',
      'Conversion of a provisional application to a nonprovisional application cannot adversely impact on the term of any patent to issue from the application.',
      'An applicant having filed a provisional application can avoid any adverse patent term impact resulting from converting the provisional application to a nonprovisional application by instead filing a nonprovisional application claiming the benefit of the provisional application under 35 U.S.C. § 119(e).',
      'An applicant filing a nonprovisional application claiming the benefit under 35 U.S.C. § 119(e) and 37 C.F.R. § 1.78 of an earlier provisional application, and not requesting conversion of the provisional to a nonprovisional application can avoid the fee required to convert a provisional application to a nonprovisional application, as well as an adverse patent term effect that would result from a conversion.',
      'The twelve month period of pendency of a provisional application extends to the next secular or business day which is not a Saturday, Sunday, or Federal holiday in the District of Columbia if the day that is twelve months after the filing date of the provisional application under 35 U.S.C. § 111(b) and 37 C.F.R. § 1.53(c) falls on a Saturday, Sunday, or a Federal holiday in the District of Columbia.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer — i.e., the statement NOT in accord with practice. Per 65 F.R. 50092 (Aug. 16, 2000), the term of a nonprovisional resulting from conversion of a provisional under 35 U.S.C. § 111(b)(5) is measured from the ORIGINAL provisional filing date, so the provisional’s pendency is counted against the patent term — conversion CAN adversely affect term. (A), (C) and (D) accord with 37 C.F.R. § 1.53(c)(3) and are therefore not the answer. (E) is a correct statement under 35 U.S.C. § 119(e)(3).',
  },
  {
    id: 'uspto-apr01-am-26',
    topicId: 2,
    subtopic: 'Fee Refunds and Specification Formalities (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'If a practitioner, “by mistake,” files an application and basic filing fee, the submission of the filing fee with the application is treated by the Office as not a fee paid by mistake, and the fee will not be refunded.',
      'If, in April 2001, a practitioner files an application, properly establishes the applicant’s small entity status, and “by mistake” pays the filing fee by submitting a check drawn in the amount that is twice the amount of the small entity filing fee, a refund of the excess fee may be obtained upon request filed any time during pendency of the application and life of any patent granted on the application.',
      'The paragraphs of the specification of an original utility patent application filed in January 2001 may, but are not required to be numbered at the time the application is filed.',
      'If a provisional application is filed in a language other than English, an English language translation of the non-English language provisional application will not be required in the provisional application.',
      'If a table having more than 50 pages of text is submitted on compact disc, the specification of a patent application must contain an incorporation-by-reference of the material on a compact disc in a separate paragraph, identifying each compact disc by the names of the files contained on each compact disc, their date of creation, and their sizes in bytes.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. Under 37 C.F.R. § 1.26(b), "Any request for refund must be filed within two years from the date the fee was paid" — not any time during pendency and the life of the patent. (A) accords with § 1.26(a). (C) accords with § 1.52(b)(6) (paragraph numbering is optional outside reissue). (D) accords with § 1.52(d)(2). (E) accords with § 1.52(e)(5).',
  },
  {
    id: 'uspto-apr01-am-27',
    topicId: 1,
    subtopic: 'Specification Contents — What Is Permitted (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Regarding the specification of a nonprovisional patent application, which of the following practices is in accordance with proper USPTO practice and procedure?',
    options: [
      'The specification may include graphical illustrations or flowcharts.',
      'The specification must begin with one or more claims.',
      'The specification may include hyperlinks or other forms of browser-executable code embedded in the text.',
      'The specification may include tables and chemical formulas.',
      'The specification may include a reservation for a future application of subject matter disclosed but not claimed in the application.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 608.01, "Illustrations In the Specification"; 37 C.F.R. § 1.58(a) permits tables and chemical formulas in the specification in lieu of formal drawings. (A) is incorrect — graphical illustrations, diagrammatic views, flowcharts and diagrams in the descriptive portion do not come within § 1.58(a); the examiner should object and require formal drawings under § 1.81. (B) is incorrect — under § 1.75(a) the specification must CONCLUDE with one or more claims. (C) is incorrect — USPTO policy does not permit embedded hyperlinks or browser-executable code. (E) is incorrect — § 1.79 does not permit a reservation for a future application.',
  },
  {
    id: 'uspto-apr01-am-28',
    topicId: 3,
    subtopic: 'Drawing Objections Are Not Held in Abeyance (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Practitioner Smith filed a utility patent application on January 5, 2001, with informal drawings. Upon review of the drawings, the USPTO concluded that the drawings were not in compliance with 37 C.F.R. § 1.84(a)(1) and (k), and were not suitable for reproduction. In an Office communication, Smith was notified of the objection and given two months to correct the drawings in order to place the application in the files of a Technology Center for examination. Which of the following complies with USPTO practices and procedures for a complete bona fide attempt to advance the application to final action?',
    options: [
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance until allowable subject matter is indicated.',
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance since the requirement increases up-front costs for the patent applicant, and the costs can be avoided if patentable subject matter is not found.',
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance until fourteen months from the earliest claimed priority date.',
      'Smith timely files a response correcting the drawings to comply with 37 C.F.R. § 1.84(a)(1) and (k), and making them suitable for reproduction.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. Under 37 C.F.R. § 1.85(a), correcting the drawings to comply with § 1.84(a)(1) and (k) and making them suitable for reproduction is a bona fide response. (A), (B) and (C) each seek to hold the requirement in abeyance, and § 1.85(a) states: "Unless applicant is otherwise notified in an Office action, objections to the drawings in a utility or plant application will not be held in abeyance, and a request to hold objections to the drawings in abeyance will not be considered a bona fide attempt to advance the application to final action." (E) is not correct inasmuch as (A), (B) and (C) are not.',
  },
  {
    id: 'uspto-apr01-am-29',
    topicId: 0,
    subtopic: 'What Does Not Qualify as Prior Art (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following do not represent prior art?',
    options: [
      'The preamble of a Jepson claim.',
      'A technical journal as of its date of publication which is accessible to the public as of the date of its publication.',
      'A disclosure publicly posted on the INTERNET, but containing no publication or retrieval date.',
      'A doctoral thesis indexed, cataloged and shelved in a university library.',
      'Applicant’s labeling of one of the figures in the drawings submitted with his application as prior art.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. See MPEP § 2128, "Date of Availability" under "Electronic Publications As Prior Art" — an Internet disclosure with no publication or retrieval date cannot be relied upon, because its date of public availability cannot be established. (A) is wrong — a Jepson claim results in an implied admission that the preamble is prior art. MPEP § 2129. (B) is wrong — MPEP § 2128.02. (D) is wrong — a thesis placed in a university library may be prior art if sufficiently accessible. MPEP § 2128.01. (E) is wrong — admissions by applicant constitute prior art. In re Nomiya, 184 USPQ 607 (CCPA 1975). [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-30',
    topicId: 3,
    subtopic: 'Suspension of Action With an RCE (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accord with proper USPTO practice and procedure?',
    options: [
      'A utility application was filed in October 1999. Following a restriction requirement, the applicant elected claims 1-5, and the examiner withdrew non-elected claims 6-10. After a final rejection of claims 1-5 in January 2001, the applicant may submit an amendment canceling previously examined claims and present claims to the previously non-elected invention of claims 6-10 when filing a request for continued examination under 37 CFR § 1.114.',
      'Claims in an allowed application may be amended as a matter of right after payment of the issue fee inasmuch as the Office may not rule on amendment filed after a notice of allowance until after the period for payment of the issue fee has expired.',
      'If, at the time an application is allowed in January 2001, a corrected drawing is required or formal drawing is needed, the applicant is given a three month period in the notice of allowability to file the same, and is permitted to file corrected or formal drawings after payment of the issue fee upon filing a request of an extension of time and payment of the requisite fee.',
      'Where, after a final rejection, a request for continued examination complying with 37 CFR § 1.114, is filed in April 2001 accompanied by a request to suspend action by the Office for a period not exceeding three months to provide time to submit an information disclosure statement, and the requisite fees, the Office may grant the requested suspension.',
      'Where an examiner has finally rejected all the claims in a utility application in January 2001, and sets a three month shortened statutory period for reply, the Office may grant a request to suspend action by the applicant for a period not exceeding six months to provide time to gather and submit evidence, if the request and requisite fees are filed within the three month reply period.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 C.F.R. § 1.103(c) permits a suspension of up to three months when requested with a proper RCE. (A) is wrong — "An applicant may not obtain examination of a different or non-elected invention (e.g., a divisional) in a request for continued examination under § 1.114." (B) is wrong — under § 1.312 amendments after allowance are not entered as a matter of right. (C) is wrong — the three-month period set under § 1.85(c) is not extendable under § 1.136(a) or (b). (E) is wrong — the Office will not suspend action when a reply by the applicant is due. § 1.103(a).',
  },
  {
    id: 'uspto-apr01-am-31',
    topicId: 0,
    subtopic: 'When a Rule 131 Affidavit May Be Used (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following statements is correct regarding an antedating declaration or affidavit being used in accordance with proper USPTO practice and procedure?',
    options: [
      'Where the reference publication date is more than one year before applicant’s effective filing date.',
      'Where the reference is a prior U.S. patent to the same entity, claiming the same invention.',
      'Where the subject matter relied on in the reference is prior art under 35 U.S.C. § 102(g).',
      'Where the reference, a U.S. Patent, with a patent issue date less than one year prior to applicant’s effective filing date, shows but does not claim the same patentable invention.',
      'Where the effective filing date of applicant’s parent application or an International Convention-proved filing date is prior to the effective date of the reference.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 102(a); MPEP § 715, "SITUATIONS WHERE 37 C.F.R. 1.131 AFFIDAVITS OR DECLARATIONS CAN BE USED." (A) is incorrect — that is a § 102(b) statutory bar, which cannot be antedated. (B) is incorrect — the question is one of double patenting. (C) is incorrect — subject matter available under § 102(g) must by definition have been made before the applicant’s invention, so a § 1.131 declaration cannot overcome it. In re Bass, 474 F.2d 1276 (CCPA 1973). (E) is incorrect — an affidavit is unnecessary because the reference is not prior art at all. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-32',
    topicId: 3,
    subtopic: 'Amendments and RCEs After Allowance (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'After issuance of a notice of allowance in November 2000, a petition to withdraw an application from issue and requisite fee are required if a request for continued examination, submission, and requisite fee are filed prior to the issuance of the patent.',
      'After issuance of a notice of allowance in April 2001 for an application, an amendment of the claims in the application may be filed before, with, or after payment of the issue fee.',
      'The Office ensures that any petition to withdraw an application from issue, filed after payment of the issue fee, will be acted upon prior to the scheduled date of patent grant.',
      'If a request for continued examination under 37 CFR § 1.114, accompanied by the requisite fee, but not a submission, are filed in March 2001, after an application was allowed in January 2001, the Office will notify the applicant and set a time period within which the deficiency must be corrected.',
      'An amendment filed in the Office in April 2001 in reply to a final rejection must comply with either the provisions of 37 CFR § 1.114 or the provisions of 37 CFR § 1.116(b) and (c).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 C.F.R. §§ 1.114 and 1.116(b) and (c). (A) is wrong — under § 1.313(a) a petition is NOT required if the RCE is filed prior to payment of the issue fee. (B) is wrong — § 1.312 requires any such amendment to be filed before or with payment of the issue fee. (C) is wrong — see § 1.313(d); the Office gives no such assurance. (D) is wrong — if an applicant files an RCE without a submission within the period for reply, the application is abandoned by operation of law (35 U.S.C. § 133); the Office does not set a new period.',
  },
  {
    id: 'uspto-apr01-am-33',
    topicId: 1,
    subtopic: 'Original Claims as Their Own Written Description (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In which of the following situations, considered independently of each other, is the original, new, or amended claim supported in the application as filed?',
    options: [
      'An amendment to the specification changing the definition of “holder” from “is a hook” to “is a hook, clasp, crimp, or tong” and no amendment is made of the claim, which uses the term “holder.” The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'An amendment to the specification and claims changing the definition of “holder” from “is a hook” to “is a hook, clasp, crimp, or tong.” The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'Original claim 1 in the application refers to “a holder,” and original claim 2 depends from and refers to claim 1 stating, “said holder is a hook, clasp, crimp, or tong.” There is no disclosure in the specification preceding the claims in the application as filed for the holder to be a clasp, crimp, or tong.',
      'An amendment is filed presenting a claim to an electrical insulating device, copied from a patent for the purpose of provoking an interference. The claim refers to “nonconductive plastic holder.” The application as filed contains a broad generic disclosure describing electrical insulating devices. The holder is described in the specification of the application as “conducting electricity.” There is no disclosure in the specification of the holder being “nonconductive.”',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2163.03, item I — ORIGINAL claims constitute their own description. In re Koller, 613 F.2d 819, 204 USPQ 702 (CCPA 1980). (A) and (B) are incorrect: "An amendment to the specification (e.g., a change in the definition of a term used both in the specification and claim) may indirectly affect a claim even though no actual amendment is made to the claim," and there is no supporting disclosure for a clasp, crimp or tong. (D) is incorrect — a broad generic disclosure is not necessarily sufficient written description of a specific embodiment, especially where it conflicts with the remainder of the disclosure. Fields v. Conover, 443 F.2d 1386 (CCPA 1970). (E) is not correct because (C) is.',
  },
  {
    id: 'uspto-apr01-am-34',
    topicId: 3,
    subtopic: 'Patent Term Adjustment — Reductions and Board Review (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Joseph filed a nonprovisional utility application February 8, 2001 without an executed oath and without the filing fee. A "Notice to File Missing Parts – Filing Date Granted" issued April 2, 2001 setting a two-month period; Joseph, travelling overseas and having lost the Notice in his luggage, did not reply until August 2, 2001 with a two-month extension and all required fees (his request to waive those fees was denied). A first Office action issued December 19, 2001 with a three-month shortened statutory period; Joseph replied March 19, 2002; a final Office action issued August 12, 2002. Joseph filed a Notice of Appeal September 19, 2002 and an Appeal Brief March 18, 2003. An Examiner’s Answer issued April 2, 2003, a Reply Brief was filed April 15, 2003, and the Board REVERSED the rejections August 19, 2003. A Notice of Allowance issued September 3, 2003, the Issue Fee was paid September 15, 2003, and the patent issued March 9, 2004. The Office determined that the applicant failed to engage in reasonable efforts to conclude prosecution of the application. Which of the following statements is most true?',
    options: [
      'Joseph is entitled to no patent term extension because neither the Uruguay Round Agreements Act nor the Patent Term Guarantee Act of 1999 applies to Joseph’s patent application.',
      'Although the Patent Term Guarantee Act of 1999 applies to Joseph’s application, Joseph forfeited any patent term extension by failing to engage in reasonable efforts to conclude prosecution of the application.',
      'Joseph is entitled to a total patent term extension of approximately two (2) months because the application was pending for more than three (3) years.',
      'Joseph’s successful appellate review adds approximately 11 months to any calculation of patent term extension.',
      'By replying to the Notice to File Missing Parts approximately two (2) months after the deadline set by the USPTO, Joseph reduced any patent term extension by two (2) months.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. See 37 CFR §§ 1.702(e) and 1.703(e) — a SUCCESSFUL appellate review (here the Board reversed) adds to the adjustment. (A) is incorrect at least because the Patent Term Guarantee Act of 1999 applies to this application. (B) is incorrect because failure to engage in reasonable efforts may REDUCE the adjustment but is not a complete forfeiture. (C) is incorrect because the three-year period of § 1.702(b) excludes time consumed by Board review and any applicant-requested delay. (E) is incorrect because any reduction is measured from an expected reply within three months of the Office action regardless of the deadline set. § 1.704(b).',
  },
  {
    id: 'uspto-apr01-am-35',
    topicId: 2,
    subtopic: 'Nonpublication Requests and Patent Term (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In addition to the facts set forth in connection with the previous question, Joseph’s application had not and would not be the subject of an application filed in another country, or under a multilateral international agreement, that requires publication of applications eighteen months after filing. At the time he filed his application in the USPTO, Joseph submitted a nonpublication request and supporting materials that fully complied with all requirements for nonpublication of the application at 18 months. Which of the following statements is most correct?',
    options: [
      'By requesting nonpublication of the application, Joseph “opted out” of the statutory framework for patent term extension and, therefore, no patent term extension is available.',
      'Submission of the nonpublication request does not affect any patent term extension that might be available to Joseph.',
      'Joseph may rescind his nonpublication request at any time.',
      'Statements (A) and (C) are true.',
      'Statements (B) and (C) are true.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Nonpublication of the application does not affect the patent term extension provisions of the Patent Term Guarantee Act of 1999 — the provisions of 37 CFR §§ 1.702 et seq. are separate and independent of the eighteen-month publication provisions — so statement (B) is true and there is no support for statement (A). An applicant may rescind a nonpublication request at any time, so statement (C) is also true. Accordingly the best answer is (E).',
  },
  {
    id: 'uspto-apr01-am-36',
    topicId: 3,
    subtopic: 'Extension of Time for Filing an Appeal Brief (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In the facts set forth in connection with the preceding two questions, what if any extension of time was required by Joseph for filing an Appeal Brief on March 18, 2003?',
    options: [
      'No extension of time was available and the Appeal Brief should have been rejected because it was filed more than six months after the final Office action issued.',
      'No extension of time was available and the Appeal Brief should have been rejected because it was filed more than six months after the Notice of Appeal was filed.',
      'A three-month extension of time was required.',
      'A four-month extension of time was required.',
      'A five-month extension of time was required.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. An appeal brief was due two months after the filing of the Notice of Appeal. 37 CFR § 1.192. Joseph’s Notice of Appeal was filed September 19, 2002, so the Appeal Brief was initially due November 19, 2002. That non-statutory period could be extended under § 1.136(a). Since the brief was filed March 18, 2003, a four-month extension was required. (A) is incorrect because the two-month period runs from the Notice of Appeal and the six-month statutory period does not apply. (B) is incorrect because the premise is factually wrong. [Historical practice — Board appeal rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-apr01-am-37',
    topicId: 3,
    subtopic: 'When an RCE May Be Filed (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In which of the following instances is the filing of a request for continued examination (RCE) of an application, together with a submission and payment of the appropriate fee, in accordance with proper USPTO practice and procedure?',
    options: [
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, in a nonprovisional utility application having a filing date in July 1998. A Notice of Appeal to the Board of Patent Appeals and Interferences had been filed in November 2000, and as of April 17th the appeal is awaiting a decision.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, in a nonprovisional utility application having a filing date in July 1996. A Notice of Appeal to the United States Court of Appeals for the Federal Circuit was properly filed in January 2001, and the appeal has not terminated as of April 17th.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, in a nonprovisional utility application having a filing date in July 1999. The issue fee was filed in the Office on Friday, January 19, 2001, but a petition and fee to withdraw the application has not been filed.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, for a nonprovisional utility application having a filing date in July 1996. On Monday, April 2, 2001, Applicant withdrew a Notice of Appeal to the United States Court of Appeals for the Federal Circuit. There were no allowed claims in the application, and the Court’s dismissal of the appeal did not indicate any further action to be taken by the Office.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, for a provisional utility application having a filing date in July 2000.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.114(a) and (d). Filing an RCE with a submission after a Notice of Appeal to the Board but before decision is treated as a request to withdraw the appeal and reopen prosecution; the submission may be an amendment to the written description (§ 1.114(c)). (B) and (D) are wrong — § 1.114 is unavailable after a Notice of Appeal to the Federal Circuit unless the appeal is terminated and the application is still pending. (C) is wrong — after the issue fee is paid, an RCE without a § 1.313 petition "will not operate to avoid issuance of the application as a patent." (E) is wrong — § 1.114(e)(1) excludes provisional applications.',
  },
  {
    id: 'uspto-apr01-am-38',
    topicId: 2,
    subtopic: 'Deadline for a Small Entity Refund Request (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A registered practitioner filed a nonprovisional U.S. patent application in the USPTO on Monday, October 9, 2000. The full basic fee for other than a small entity accompanied the application. The practitioner later realized that a mistake had occurred because only the basic fee for a small entity should have been paid. On Thursday, November 9, 2000, the practitioner completed proper establishment of the applicant’s small entity status by filing an assertion under 37 C.F.R. § 1.27(c) with the USPTO. On Monday, December 11, 2000, the practitioner filed a petition under 37 CFR 1.136, and the fee required by 37 CFR 1.17(a) for a one month extension of time to file a request for a refund of the excess amount paid based on establishment of small entity status. Absent any other action, which of the following is the latest date that the practitioner can properly file a request for refund and obtain the same in accordance with proper USPTO practice and procedure?',
    options: [
      'Thursday, November 9, 2000.',
      'Friday, December 8, 2000.',
      'Monday, December 11, 2000.',
      'Tuesday, January 9, 2001.',
      'Thursday, January 11, 2001.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 C.F.R. § 1.28(a) and (b) provide that a request for refund based on the excess amount paid on establishment of small entity status must be filed within THREE MONTHS of the date of the timely payment of the full fee. That payment was Monday, October 9, 2000, so the three-month period ends Tuesday, January 9, 2001. The one-month extension filed December 11, 2000 does not help, because § 1.28(a) states "The three-month time period is not extendable under § 1.136."',
  },
  {
    id: 'uspto-apr01-am-39',
    topicId: 5,
    subtopic: 'Requirements for a Third-Party Reexamination Request (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is/are required to be included in a request for reexamination submitted by a person other than the patent owner on January 12, 2001?',
    options: [
      'A statement pointing out each substantial question of patentability based on the arguments stated by the examiner in the first Office action.',
      'A statement that, in the opinion of the requester, the application to which the request is directed meets the requirements of 35 U.S.C. 112.',
      'A copy of the entire patent including the front face, drawings, and specification/claims, in double column format on single-sided sheets, for which reexamination is requested, and a copy of any disclaimer, certificate of correction, or reexamination certificate issued in the patent.',
      'A certification that a copy of the request has been served in its entirety on “the patent owner at the address as provided for in § 1.33(c),” without indicating the name and address of the party served.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.510(b) (effective Nov. 7, 2000); 65 FR 54604, 54649: "Section 1.510(b)(4) now sets forth the requirement that a copy of the patent for which reexamination is requested must be submitted in double column format, on single-sided sheets only." (A) is incorrect because § 1.510(b)(1) requires each substantial new question of patentability to be based on prior PATENTS AND PUBLICATIONS. (B) is incorrect because that statement is required by § 1.293(b) (statutory invention registration), not § 1.510(b). (D) is incorrect because under § 1.510(b)(5) the name and address of the party served must be indicated.',
  },
  {
    id: 'uspto-apr01-am-40',
    topicId: 0,
    subtopic: 'Derivation Under 35 U.S.C. 102(f) (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In June 1998, Jack and Jill, a married couple, are vacationing in Vietnam (not a WTO country) when they encounter a man selling bamboo knives for cleaning fish. The particular curvature of the bamboo both lends support to the knife to prevent it from bending and breaking and facilitates cleaning inside the fish. Jill takes a picture of Jack with the knife cleaning the fish. Subsequently, in November 1998, when Jack returns to the United States he begins to make and sell an identical knife to the one seen in Vietnam. In July 1999, he files a patent application claiming the nearly identical knife. Jack discloses no prior art during the prosecution of his application and fails to mention the knife he saw in Vietnam. The examiner finds no prior art similar to the claimed knife, and Jack is awarded a patent in December 2000. Meanwhile, Jill divorces Jack, and associates with Sam. To raise cash, Sam and Jill begin selling a knife identical to the one Jack produces, only Sam and Jill make their knife out of plastic. Jack sues for infringement. Jill and Sam come to you for advice. Which of the following is not true?',
    options: [
      'Jack is entitled to patent protection since Vietnam is not a WTO country and evidence of the Vietnamese knife cannot be used against him to reject his patent claims.',
      'Jack had a duty under 37 C.F.R. §1.56 to disclose his discovery of the bamboo knife in Vietnam to the examiner during the original patent prosecution.',
      'Since the use in Vietnam was not in this country, it does not constitute a public use bar under 35 U.S.C. § 102(b).',
      'If Jill’s attorney files a request for reexamination, it will be denied because the picture is not a patent or printed publication.',
      'Although Jack marketed the invention before obtaining a patent, the patent claims cannot be invalidated under 35 U.S.C. § 102(a) since Jack’s making and selling of the knife cannot be used against him under 35 U.S.C. § 102(a).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it is NOT true, since Jack did not invent the knife and so is not entitled to a patent. Jack derived the invention from another, and the picture of Jack with the Vietnamese knife is evidence of derivation. 35 U.S.C. § 102(f); MPEP § 2137. (B) is a correct statement — Jack should have disclosed all information material to patentability. (C) is correct — to qualify under § 102(b) the use must be in this country. (D) is correct — reexamination must be based on patents and printed publications. (E) is correct — public use derived from the inventor’s own work cannot be used against the inventor under § 102(a). MPEP § 2132. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-41',
    topicId: 6,
    subtopic: 'Design Applications — Expedited Examination (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accordance with proper USPTO practice and procedure regarding design patent applications filed in March 2001?',
    options: [
      'The expedited treatment available for design applications under 37 CFR § 1.155 expedites design application processing by, among other things, decreasing clerical processing time as well as the time spent routing the application between processing steps.',
      'The “petition to make special” procedure is also available for designs and the petition fee is less than the fee for expedited examination.',
      'To qualify for expedited examination: (1) the application must include drawings in compliance with 37 CFR § 1.84; (2) the applicant must have conducted a preexamination search; and (3) the applicant must file a request for expedited examination including: (i) The appropriate fee; and (ii) a statement that a preexamination search was conducted. The statement must also indicate the field of search and include an information disclosure statement in compliance with 37 CFR § 1.98.',
      'If the design application is not effectively expedited by the Office, the fee for expediting the application will be refunded.',
      'The Office will not examine an application that is not in condition for examination (e.g., missing basic filing fee) even if the applicant files a request for expedited examination under this section.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer — no such refund is permitted. 35 U.S.C. § 42(d) permits refund only of a fee "paid by mistake or any amount paid in excess of that required," and any refund of an excess amount must be based on an overpayment of a fee that was in fact required when paid. See 65 F.R. 54604, 54642. (A) and (B) restate that same Federal Register discussion. (C) contains all the elements of 37 CFR § 1.155(a). (E) contains all the elements of § 1.155(b).',
  },
  {
    id: 'uspto-apr01-am-42',
    topicId: 3,
    subtopic: 'IDS Timing After a Request for Continued Examination (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Registered practitioner Rick files a utility patent application under 37 CFR § 1.53(b) in the USPTO having one claim on May 6, 1998. Following a proper final rejection dated June 28, 2000, of claim 1 Rick files a request for continued examination with the appropriate fee on September 12, 2000, and submits an amendment to claim 1 with the request. On October 7, 2000, Rick learns about a publication (the “Columbus reference”) which he knows to be material to patentability of claim 1, but which was not considered by the examiner during prosecution of the application. Rick prepares an information disclosure statement that complies with the provisions of 37 CFR § 1.98, listing the Columbus reference. The finality of the action dated June 28, 2000, is withdrawn in an Office action, dated November 20, 2000, which is after the filing of the request for continued examination. Which of the following actions, if taken by Rick, will properly result in the Columbus reference being considered by the Office during the pendency of the application?',
    options: [
      'Filing the information disclosure statement on November 15, 2000, without any further statement and without the fee set forth in § 1.17(p).',
      'Filing the information disclosure statement on December 11, 2000, without any further statement and without the fee set forth in § 1.17(p).',
      'Filing the information disclosure statement on December 13, 2000, without any further statement and without the fee set forth in § 1.17(p).',
      'Choices (A) or (B) above.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 CFR § 1.97(b)(4) (effective Nov. 7, 2000). (A) is correct since November 15, 2000 is "before the mailing of a first Office action after the filing of a request for continued examination under § 1.114." As stated at 65 FR 54630, because the filing of an RCE is not the filing of an application but merely a continuation of prosecution, § 1.97(b)(4) does NOT provide a three-month window for submitting an IDS after an RCE. Choices (B) and (C) are therefore incorrect, being subject to § 1.97(c). (D) is incorrect because (B) is; (E) is incorrect since (A) is correct.',
  },
  {
    id: 'uspto-apr01-am-43',
    topicId: 3,
    subtopic: 'New Matter — Petition Versus Appeal (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] As a new member of a law firm, you are assigned to continue the prosecution of a patent application that was prosecuted by Stewart, who recently joined another law firm. After reviewing the file, you note that Stewart\'s reply to a first Office included two amendments: Amendment #1 introduced a change to the specification which did not affect the claims; Amendment #2 introduced a change to the specification, which change was also introduced to all of the claims currently in the application. You also note that the examiner in a current Office action has taken the position that both amendments constituted new matter, required cancellation of the new matter, and rejected all the claims on the ground that they recited elements without support in the original disclosure under 35 U.S.C. 112, first paragraph. For the purpose of reviewing the examiner’s requirement, which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'Both Amendment #1 and Amendment #2 give rise to appealable questions.',
      "Review of the examiner's requirement for cancelation of both Amendment #1 and Amendment #2 is by way of petition.",
      "Review of the examiner's requirement for cancelation of Amendment #1 is by way of petition, and review of the examiner's requirement for cancelation of Amendment #2 is by way of appeal.",
      "Review of the examiner's requirement for cancelation of Amendment #1 is by way of appeal, and review of the examiner's requirement for cancelation of Amendment #2 is by way of petition.",
      'Both Amendment #1 and Amendment #2 give rise to questions which may be reviewed either by petition or on appeal.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 608.04(c): "Where the new matter is confined to amendments to the specification, review of the examiner’s requirement for cancellation is by way of petition. But where the alleged new matter is introduced into or affects the claims, thus necessitating their rejection on this ground, the question becomes an appealable one." See also MPEP § 706.03(o). Amendment #1 touched only the specification (petition); Amendment #2 reached the claims (appeal).',
  },
  {
    id: 'uspto-apr01-am-44',
    topicId: 3,
    subtopic: 'Time for Filing the Appeal Brief (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] After filing a Notice of Appeal, an appeal brief is due. In accordance with proper USPTO practice and procedure:',
    options: [
      'The brief is due within two months of the date of appeal. The Office date of receipt of the Notice of Appeal is the date from which this two month period is measured.',
      'The brief is due within two months of the date of appeal, the date indicated on any Certificate of Mailing under 37 C.F.R. § 1.8 attached to the Notice of Appeal is the date from which this two month period is measured.',
      'Failure to file the appeal brief within the permissible time will result in dismissal of the appeal and abandonment of the application, including any allowed claims.',
      'Failure to file the appeal brief within the permissible time will result in dismissal of the appeal and abandonment of the application containing no allowed claims, and an appeal brief will be due within two months after the date a petition is granted to revive the application and reinstate the appeal.',
      'If the appellant is unable to file an appeal brief within the time allotted by the rules, appellant may file a petition, with fee, to the examining group, requesting additional time, and the time extended is added to the last day the appeal brief would have been due when said last day is a Saturday, Sunday, or Federal holiday.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.192(a); MPEP § 1206, "Time For Filing Appeal Brief" — the period runs from the Office date of receipt of the Notice of Appeal, not a certificate of mailing date, so (B) is incorrect. (C) is incorrect — although failure to file the brief in time dismisses the appeal, if any claims stand allowed the application does not become abandoned but returns to the examiner. (D) is incorrect — a proper brief must be filed before a petition to revive and reinstate the appeal is considered on the merits. (E) is incorrect — the time extended is added to the calendar day of the original period. [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-apr01-am-45',
    topicId: 1,
    subtopic: 'Drawing Requirements — 37 CFR 1.84 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In regard to patent application drawings, which of the following is in accord with proper USPTO practice and procedure?',
    options: [
      'Views in a drawing may be connected by projection lines, and views may contain center lines in patent applications filed in April 2001.',
      'Photographs must be developed on paper that is DIN size A4 or 8½ by 11 inches, and meet margin requirements set by regulation in applications filed in April 2001.',
      'Color drawings are permitted by regulation, and without further authorization, in an application submitted under the Office electronic filing system in April 2001.',
      'The Office will accept black and white photographs in utility or design applications filed in April 2001 only if three copies of black and white photographs, and a petition and fee are filed to have such photographs accepted.',
      'In applications filed in April 2001, the scale of a drawing must be properly indicated by statements such as “actual size” or “scale ½.”',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 C.F.R. § 1.84(e), (f) and (g). (A) is wrong — § 1.84(j) provides that views must NOT be connected by projection lines and must NOT contain center lines. (C) is wrong — § 1.84(a)(2) provides that color drawings are NOT permitted in an application submitted under the Office electronic filing system, and are accepted elsewhere only after a granted petition. (D) is wrong — § 1.84(b)(1) was amended to ELIMINATE the requirement for three copies and a petition for black and white photographs. (E) is wrong — § 1.84(k) provides that indications such as "actual size" or "scale ½" are NOT permitted, since they lose meaning on reproduction.',
  },
  {
    id: 'uspto-apr01-am-46',
    topicId: 7,
    subtopic: 'Power of Attorney and Authorization of Agent (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Regarding a power of attorney or authorization of agent in a patent application, which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'Powers of attorney to firms submitted in applications filed in the year 2001 are recognized by the United States Patent and Trademark Office.',
      'The associate attorney may appoint another attorney.',
      'The filing and recording of an assignment will operate as a revocation of a power or authorization previously given.',
      'Revocation of the power of the principal attorney or agent does not revoke powers granted by him or her to other attorneys or agents.',
      'All notices and official letters for the patent owner or owners in a reexamination proceeding will be directed to the attorney or agent of record in the patent file at the address listed on the register of patent attorneys and agents.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 C.F.R. § 1.33(c). (A) is incorrect — powers of attorney to firms filed in executed applications filed after July 2, 1971 are not recognized, though the firm’s address will be treated as the correspondence address. MPEP § 403. (B) is incorrect — the associate attorney may not appoint another attorney. MPEP §§ 402.02, 406. (C) is incorrect — an assignment will not itself operate as a revocation. § 1.36. (D) is incorrect — revoking the principal attorney’s power DOES revoke powers he or she granted to others. MPEP § 402.05.',
  },
  {
    id: 'uspto-apr01-am-47',
    topicId: 0,
    subtopic: 'Rebutting a Prima Facie Showing of No Utility (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] An examiner has properly established a prima facie showing of no specific and substantial credible utility for the claimed invention in a patent application filed in February 2001. An applicant can sustain the burden of rebutting and overcoming the showing by:',
    options: [
      'Providing reasoning or arguments rebutting the basis or logic of the prima facie showing.',
      'Amending the claims.',
      'Providing evidence in the form of a declaration under 37 C.F.R. § 1.132 rebutting the basis or logic of the prima facie showing.',
      'Providing evidence in the form of a printed publication rebutting the basis or logic of the prima facie showing.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. The "Utility Examination Guidelines," 66 F.R. 1092, 1099 (Jan. 5, 2001), state that the applicant can rebut the showing by "providing reasoning or arguments," by "amending the claims," by "providing evidence in the form of a declaration under 37 C.F.R. § 1.132," and by "providing evidence in the form of a … printed publication … rebutting the basis or logic of the prima facie showing." (A), (B), (C) and (D) alone are therefore not the most correct answer; (E), referencing all of them, is.',
  },
  {
    id: 'uspto-apr01-am-48',
    topicId: 0,
    subtopic: 'Foreign Commercial Use and Priority Under 35 U.S.C. 104 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Your Canadian client, UpNorth Incorporated, came to you on February 11, 2001 with a valuable invention for pulping timber. UpNorth informed you it had been successfully using the invention commercially for the past fourteen months deep in the Canadian forests. The invention has not been used anywhere else by UpNorth, and the pulped timber from the UpNorth operations has not left Canada. At least one competitor, another Canadian company, lawfully observed the invention in operation during its first month of use with no restriction as to confidentiality or disclosure. UpNorth filed a Canadian patent application in December 1, 1999, prior to commercial use of the invention, but chose not to file a corresponding application in the United States. The Canadian patent application remains pending. UpNorth learned that two months ago, in December 2000, its competitor began using the invention commercially in the United States. The invention was never disclosed or used in the United States prior to two months ago. UpNorth would like you to seek a United States patent on the invention to block the competitor from continued use. Which of the following would be reasonable advice from you to UpNorth?',
    options: [
      'Since Canada is a NAFTA country, UpNorth is precluded from getting a United States patent because the Canadian application was filed more than twelve months ago and the invention was in public use more than one year prior to any possible United States filing date for an UpNorth patent application.',
      'UpNorth should promptly file an application in the United States claiming the benefit of the filing date of the Canadian application and should fully disclose the Canadian commercial activities, the observation of the invention in Canada by UpNorth’s competitor, and the competitor’s commercial activities in the United States.',
      'UpNorth should abandon the pending Canadian application to avoid the possibility the Canadian application could be used as prior art against a United States patent application, and then file a patent application in the United States.',
      'UpNorth should promptly file an application in the United States without claiming the benefit of the filing date of the Canadian application and should fully disclose the Canadian commercial activities, the observation of the invention in Canada by UpNorth’s competitor, and the competitor’s commercial activities in the United States.',
      'Since UpNorth’s activities concerning the invention all took place in Canada, the competitor’s commercial use in the United States prior to any possible United States filing date for an UpNorth patent application precludes UpNorth from obtaining a United States patent.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. As to (A), public use in Canada is not a statutory bar under 35 U.S.C. § 102(b) regardless of NAFTA membership — so although UpNorth cannot claim § 119(a) priority (the Canadian filing is more than twelve months old), its commercial activity is not a bar. MPEP § 706.02(c). (B) is incorrect for the same priority reason. (C) is not reasonable — the Canadian application would not be prior art regardless of abandonment. (E) is not reasonable because under 35 U.S.C. § 104 UpNorth can rely on its Canadian activities to establish a date of invention before the competitor’s U.S. use. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-am-49',
    topicId: 0,
    subtopic: 'Specific and Substantial Utility (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In regard to disclosure of a utility in a nonprovisional utility patent application filed in the Office in April 2001, which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'For each claimed invention an applicant need only provide one credible assertion of specific and substantial utility to satisfy the utility requirement.',
      'A patent examiner can properly support a rejection based on lack of utility by providing documentary evidence regardless of the publication date to show a factual basis for the prima facie showing of no specific and substantial credible utility.',
      'Using a complex claimed invention as landfill is an example of a specific and substantial utility for the claimed invention.',
      'An invention has a well-established utility if a person of ordinary skill in the art would immediately appreciate why the invention is useful based on the characteristics of the invention, and the utility is specific, substantial, and credible.',
      'Where the asserted specific and substantial utility is not credible, a prima facie showing of no specific and substantial utility must establish that it is more likely than not that a person skilled in the art would not consider credible any specific and substantial utility asserted by the applicant for the claimed invention.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. Per the "Utility Examination Guidelines," 66 F.R. 1092, 1098 (Jan. 5, 2001): "A claimed invention must have a specific and substantial utility. This requirement excludes ‘throw-away,’ ‘insubstantial,’ or ‘nonspecific’ utilities, such as the use of a complex invention as landfill …" (A), (B), (D) and (E) each restate the Guidelines and are therefore in accord with practice.',
  },
  {
    id: 'uspto-apr01-am-50',
    topicId: 0,
    subtopic: 'Anticipation and "Optional" Claim Elements (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] An article in a popular scientific journal, dated January 13, 2000, fully discloses and teaches how to make a “Smart Shoe” wireless telecommunications device. The article discloses a shoe having a dialer in a rubber sole of the shoe. The article does not teach a metallic shoelace or suggest using the same as an antenna or for any other purpose. Which of the following claims in an application filed January 22, 2001 is/are anticipated by the journal article, and is/are not likely to be properly rejected under 35 U.S.C. § 112, second paragraph as indefinite? Claim 1. A telecommunication device comprising: a shoe having a rubber sole; a dialer in the rubber sole; and a metallic shoelace. Claim 2. A telecommunications device comprising: a shoe having a rubber sole; a dialer in the rubber sole; and optionally a metallic shoelace. Claim 3. A telecommunication device comprising: a shoe having a rubber sole; a dialer in the rubber sole; and optionally a random access memory for storing telephone numbers.',
    options: ['Claim 1.', 'Claim 2.', 'Claim 3.', 'Claims 2 and 3.', 'None of the above.'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct choice. MPEP § 2173.05(h); Ex parte Cordova, 10 USPQ2d 1949 (Bd. Pat. App. & Inter. 1989); 35 U.S.C. § 102(b). (A) is incorrect since the article does not disclose a metallic shoelace, whereas Claim 1 REQUIRES one. Since an "optional" element does not have to be disclosed in a reference for the claim to be anticipated, claims 2 and 3 — which merely permit optional elements — are each anticipated by the article. Thus (B) and (C) alone are incorrect, and (E) is incorrect. [Pre-AIA]',
  },
];

/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — October 16, 2002, AFTERNOON (PM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (oed0210pq.pdf / oed0210pa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files here):
 *  - Stems and options are VERBATIM, in the official order (A)-(E). Verbatim
 *    includes the booklet's own typographical slips (e.g. Q33's double period,
 *    Q45's "subject tot he availability").
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * Keys are from `npm run audit:uspto`, which parsed all 50 entries, and were
 * then re-checked one by one against the model-answer text.
 *
 * DISCARDED: none — all 50 delivered questions are scoreable.
 *
 * MULTI-KEYED: Q22. The model answer reads "22. ANSWERS: (D) and (E) were
 * accepted." It analyses (D) first, so the item is keyed to (D) and the
 * explanation states that (E) was also accepted. Never silently drop the
 * alternative key.
 *
 * ERA NOTES. This paper sits between the AIPA (1999-2000) and the AIA (2011),
 * so it tests some rules that were then NEW and are now repealed or rewritten.
 * Items turning on pre-AIA § 102 practice carry [Pre-AIA]; superseded
 * procedure carries [Historical practice]. In particular:
 *  - Q2, Q11 and Q32 apply § 1.131 antedating practice against pre-AIA
 *    §§ 102(a)/(e) references, which does not survive for AIA applications.
 *  - Q3, Q9 and Q49 apply the pre-AIA § 102(b)/(d) statutory bars, including
 *    their geographic limits, all removed or rewritten by the AIA.
 *  - Q27 applies pre-AIA § 102(e) provisional-rejection practice for commonly
 *    assigned copending applications.
 *  - Q7 and Q25 turn on continued prosecution application (CPA) practice,
 *    eliminated for utility applications in 2003 (RCE practice replaced it).
 *  - Q28 recites pre-AIA 35 U.S.C. § 115 (original-and-first-inventor oath,
 *    citizenship statement); the AIA rewrote § 115 entirely.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2002_PM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'October 16, 2002',
  session: 'Afternoon (PM)',
  questionsFile: 'oed0210pq.pdf',
  answersFile: 'oed0210pa.pdf',
  totalDelivered: 50,
  discarded: [] as number[],
  multiKeyed: [22],
  ingested: 50,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_OCT2002_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct02-pm-01',
    topicId: 4,
    subtopic: 'Foreign priority — the foreign and U.S. inventions must be the same',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions of the MPEP?',
    options: [
      'Where joint inventors are named, the examiner should not inquire of the patent applicant concerning the inventors and the invention dates for the subject matter of the various claims until it becomes necessary to do so in order to properly examine the application.',
      'Under 35 USC 119(a), the foreign priority benefit may be claimed to any foreign application that names a U.S. inventor as long as the U.S. named inventor was the inventor of the foreign application invention and 35 USC 119(a)-(d) requirements are met.',
      'Where two or more foreign applications are combined in a single U.S. application, to take advantage of the changes to 35 USC 103 or 35 USC 116, the U.S. application may claim benefit under 35 USC 119(a) to each of the foreign applications provided all the requirements of 35 USC 119(a)-(d) are met.',
      'One of the conditions for benefit under 35 USC 119(a) is that the foreign application must be for the same or a nonobvious improvement of the invention described in the United States application.',
      'If a foreign application for which priority is being claimed under 35 USC 119 is filed in a country which does not afford similar privileges in the case of applications filed in the United States or to citizens of the United States and the foreign country is not a WTO member country, any claim for the foreign priority thereto by a U.S. application will not be effective.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the best answer as the inventions must be the same in the foreign and U.S. applications. As to (A) through (C), see MPEP § 605.07. As to (E), see 35 U.S.C. § 119, which provides that the previously filed application must have been filed in a country that affords similar privileges in the case of applications filed in the United States or to citizens of the United States, or in a WTO member country.',
  },
  {
    id: 'uspto-oct02-pm-02',
    topicId: 0,
    subtopic: '§ 1.131 — conception before the reference plus diligence to reduction to practice',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Assume that conception of applicant’s complex invention occurred prior to the date of the reference, but reduction to practice occurred after the date of the reference. Which of the following is sufficient to overcome the reference in accordance with proper USPTO practice and procedure?',
    options: [
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to allege that applicant or patent owner has been diligent.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference, and diligence from just prior to the effective date of the reference to actual reduction to practice. The presence of a lapse of time between the reduction to practice of an invention and the filing of an application thereon is not relevant.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference. Diligence need not be considered.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to show conception and reduction to practice in any country.',
      'In a 37 CFR 1.131 affidavit or declaration, it is always sufficient to prove actual reduction to practice for all mechanical inventions by showing plans for the construction of the claimed apparatus.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. See Ex parte Merz, 75 USPQ 296 (Bd. App. 1947) (the “lapse of time between the completion or reduction to practice of an invention and the filing of an application thereon” is not relevant to an affidavit or declaration under 37 C.F.R. § 1.131(b)); MPEP § 715.07(a). (A) is incorrect — applicant must show evidence of facts establishing diligence, not merely allege it. Ex parte Hunter, 1889 C.D. 218 (Comm’r Pat. 1889). (C) is incorrect — after conception is established, diligence must be considered. Ex parte Kantor, 177 USPQ 455 (Bd. App. 1958). (D) is incorrect — § 1.131(a) permits establishing completion only in the United States or in a NAFTA or WTO member country (subject to the effective dates of Public Laws 103-182 and 103-465), not in any country. MPEP § 715.07(c). (E) is incorrect — actual reduction to practice generally requires a showing that the apparatus actually existed and worked, In re Asahi/America Inc., 68 F.3d 442, 37 USPQ2d 1204 (Fed. Cir. 1995); plans alone do not always suffice. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-oct02-pm-03',
    topicId: 0,
    subtopic: '§ 102(b) statutory bars — geographic limits and experimental use',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following establishes a statutory bar under 35 USC 102 to patentability of Applicant’s claimed invention?',
    options: [
      'To further develop the invention, Applicant’s invention was tested and experimented with in the United States more than one year prior to applicant’s effective U.S. filing date, but the invention at the time was not fit for its intended purpose and important modifications concerning the claimed features resulted from the experimentation. The first actual reduction to practice occurred after the effective U.S. filing date.',
      'Applicant’s invention was sold in a WTO member country outside the United States more than one year prior to applicant’s effective U.S. filing date, and the sale was merely market testing of the invention to determine product acceptance.',
      'Applicant’s invention is rendered obvious by the combination of two U.S. patents, both of which were patented more than one year prior to applicant’s effective filing date.',
      'Applicant’s invention was sold outside the United States in a non-WTO member country, more than one year prior to applicant’s effective U.S. filing date, but the sale was merely an attempt at market penetration.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. (A) is incorrect because it is permitted experimental testing. MPEP §§ 2133.03(e)(3) and (6). (B) and (D) are each incorrect because the sales occurred outside of the United States. 35 U.S.C. § 102(b); MPEP §§ 706.02(c) and 2133.03(d). (C) is incorrect as it provides the basis for a rejection under 35 U.S.C. § 103, but not 35 U.S.C. § 102(b). [Pre-AIA] — decided under the pre-AIA § 102(b) on-sale/public-use bars and their U.S.-only geographic limit; AIA § 102 has no such geographic limit.',
  },
  {
    id: 'uspto-oct02-pm-04',
    topicId: 7,
    subtopic: 'Former examiner may not acquire an interest in an application for one year',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A patent examiner resigned from the USPTO on June 7, 2001, and returned to Sheboygan, Wisconsin. The next day, on June 8, 2001, the former examiner signed up for a one week seminar entitled, “How to Become Rich Without Really Working.” During the seminar, the sponsors offered the former examiner a golden opportunity to purchase a 10% interest in a U.S. patent application that they stated is “guaranteed to produce significant royalties and give her a 1000% return on her investment.” Soon after attending the seminar, the former examiner became a registered practitioner. Which of the following accords with proper practice and procedure?',
    options: [
      'The former examiner may accept the offer, but only if an ownership interest in the application is transferred to the former examiner by an instrument in writing.',
      'The former examiner can accept the offer, but only if an ownership interest in the application is transferred to the former examiner by an instrument in writing, which is made of record in the assignment records of the USPTO.',
      'The former examiner can accept the offer, but only if an ownership interest in the application is transferred to the former examiner by an instrument in writing, which is made of record in the file of the application.',
      'The former examiner should accept the offer, but only if an ownership interest in the application is transferred to the former examiner by an instrument in writing, and the original or a true copy of the original instrument, in writing, is made of record in the assignment records of the USPTO and in the file of the application.',
      'The former examiner cannot accept the offer because she is incapable of acquiring an interest in the application at that time under the circumstances.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct and (A), (B), (C) and (D) are wrong. As a former employee of the USPTO, the former examiner is incapable of acquiring an interest, directly or indirectly, in a patent application in the manner described during the period of appointment as an examiner, and for one year thereafter. 35 U.S.C. § 4; MPEP § 309. Inasmuch as the former examiner resigned on June 7, 2001, she is incapable of acquiring an interest in the application in said manner until June 8, 2002. Registration as a practitioner does not affect the restrictions on the former examiner.',
  },
  {
    id: 'uspto-oct02-pm-05',
    topicId: 7,
    subtopic: 'Duty of disclosure applies to individuals, not to organizations',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with the MPEP and USPTO rules and procedure, certain individuals owe a duty to the USPTO to disclose all information known to be material to patentability of the claim(s) pending in an application. Which of the following parties does not have the duty?',
    options: [
      'An inventor named in the application who relies on a patent attorney to prepare and prosecute the application.',
      'A corporation to which an assignment of the entire interest in the application is on record at the USPTO.',
      'An agent who prepares the application.',
      'An attorney who prosecutes the application.',
      'A person, who is not an inventor named in the application, who is substantively involved in the preparation and prosecution of the application, and who is associated with an inventor named in the application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (B) is the correct answer. MPEP § 2001.01, and 37 C.F.R. § 1.56(c). MPEP § 2001.01 states that “the duty applies only to individuals, not to organizations…the duty of disclosure would not apply to a corporation or institution as such.” (A) is incorrect because the duty applies to each inventor named in the application. 37 C.F.R. § 1.56(c)(1). (C) and (D) are each incorrect because the duty applies to each attorney or agent who prepares or prosecutes the application. 37 C.F.R. § 1.56(c)(2). (E) is incorrect because the duty applies to every person substantively involved in the preparation or prosecution of the application who is associated with the inventor, with the assignee, or with anyone to whom there is an obligation to assign. 37 C.F.R. § 1.56(c)(3).',
  },
  {
    id: 'uspto-oct02-pm-06',
    topicId: 0,
    subtopic: 'Rebutting a prima facie showing of no specific and substantial credible utility',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] An examiner has properly established a prima facie showing of no specific and substantial credible utility for the claimed invention in a patent application filed in February 2001. An applicant can sustain the burden of rebutting and overcoming the showing by:',
    options: [
      'Providing reasoning or arguments rebutting the basis or logic of the prima facie showing.',
      'Amending the claims.',
      'Providing evidence in the form of a declaration under 37 CFR 1.132 rebutting the basis or logic of the prima facie showing.',
      'Providing evidence in the form of a printed publication rebutting the basis or logic of the prima facie showing.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. For (A) through (D), see “Utility Examination Guidelines,” 66 F.R. 1092, 1099, left column (Jan. 5, 2001): “The applicant can do this by… providing reasoning or arguments…,” “by amending the claims…,” “by…providing evidence in the form of a declaration under 37 C.F.R. § 1.132…rebutting the basis or logic of the prima facie showing,” and “by…providing evidence in the form of a…printed publication…rebutting the basis or logic of the prima facie showing.” (A), (B), (C), and (D) alone are not the most correct answer inasmuch as (E), referencing all of the above, is the most correct answer.',
  },
  {
    id: 'uspto-oct02-pm-07',
    topicId: 3,
    subtopic: 'Interviews before first action — permitted in continuing and substitute applications',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following requests by the registered practitioner of record for an interview with an examiner concerning an application will be granted in accordance with proper USPTO rules and procedure?',
    options: [
      'A request for an interview in a substitute application prior to the first Office action, for the examiner and attorney of record to meet in the practitioner’s office without the authority of the Commissioner.',
      'A request for an interview in a continued prosecution application prior to the first Office action, to be held in the examiner’s office.',
      'A request for an interview in a non-continuing and non-substitute application, prior to the first Office action to be held in the examiner’s office.',
      'None of the above.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 C.F.R. § 1.133 (effective November 7, 2000); “Changes To Implement the Patent Business Goals; Final Rule,” 65 FR 54604, 54640-54641 (September 8, 2000): interviews before first action are allowed in all continuations and substitute applications conforming to MPEP practice, including a CPA. (A) is incorrect because an interview will not be permitted off Office premises without the authority of the Commissioner. 37 C.F.R. § 1.133(a)(1). (C) is incorrect because an interview for the discussion of patentability will not occur before the first Office action unless the application is a continuing or substitute application. 37 C.F.R. § 1.133(a)(2). (D) and (E) are incorrect because (B) is correct and (A) and (C) are incorrect. [Historical practice] — CPA practice was eliminated for utility applications in 2003; the continuing/substitute-application interview rule itself survives.',
  },
  {
    id: 'uspto-oct02-pm-08',
    topicId: 1,
    subtopic: '§ 112 first paragraph — amendment claiming subject matter the disclosure does not enable',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] An application includes independent claims 1 and 2. Which of the following, in a reply to a non-final Office action, provides the proper basis for a rejection under 35 USC 112, first paragraph?',
    options: [
      'Applicant amends claim 2 of the originally filed application by adding a limitation which was previously written only in claim 1 of the originally filed application, and one of ordinary skill in the art is enabled by the original disclosure to make and use the invention as claimed in amended claim 2.',
      'Applicant amends claim 1 of the originally filed application by adding a limitation that was written in the original disclosure of the application, but the original disclosure does not enable one of ordinary skill in the art to make or use the invention as claimed in amended claim 1.',
      'Applicant amends and broadens claim 2 by removing a limitation which was written in the original disclosure of the application, and one of ordinary skill in the art is enabled by the original disclosure to make and use the invention as claimed in amended claim 2.',
      'Applicant adds new matter to the disclosure, but does not amend the claims of the originally filed application, and one of ordinary skill in the art is enabled by the original disclosure to make and use the invention as described in each of the claims.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). MPEP § 2163.01. (A) is incorrect because the claims as filed in the original application are part of the disclosure, MPEP §§ 2163.03 and 2163.06(III), and claim 2 is enabled by the original disclosure. (C) is incorrect — the original disclosure enables claim 2. (D) is incorrect because although the specification should be objected to for the new matter, the original disclosure enables each of the claims. MPEP § 2163.06(I). (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-oct02-pm-09',
    topicId: 0,
    subtopic: 'Jepson claim preamble as implied admission of prior art',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with proper USPTO practice and procedure, which of the following statements is true?',
    options: [
      'Where sole patent applicant Able claims his invention in a Jepson-type claim, and the specification discloses that the subject matter of the preamble was invented by Baker before applicant’s invention, the preamble is properly treated as prior art.',
      'Where the sole patent applicant Able claims his invention in a Jepson-type claim, and the specification makes it clear that the claimed invention is an improvement on Able’s own prior invention, which Able discovered less than one year before the filing date of the application, the preamble in the claim is properly treated as prior art.',
      'Where the sole patent applicant Able claims his invention in a Jepson-type claim, and the specification makes it clear that the claimed invention is an improvement on an invention that Able discovered and publicly used and commercially sold by Able in Texas for several years before the filing date of the application, the preamble in the claim cannot properly be treated as prior art.',
      'Where the sole applicant, Baker, states that something is prior art, the statement can be taken as being admitted prior art only if corroborated by objective evidence proffered by Baker, or found by the examiner.',
      'No claim, including a Jepson-type claim, carries with it an implied admission that the elements in the preamble are old in the art.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is true, and thus the most correct answer. MPEP § 2129; In re Fout, 675 F.2d 297, 300-01, 213 USPQ 532, 535-36 (CCPA 1982). (B) is not true — where the Jepson preamble describes the applicant’s own prior invention it is not treated as prior art; MPEP § 2129; Reading & Bates Construction Co. v. Baker Energy Resources Corp., 748 F.2d 645, 650, 223 USPQ 1168, 1172 (Fed. Cir. 1984). (C) is not true because the admitted foundational discovery, publicly used and sold for years, is a statutory bar. (D) is not true — an applicant’s own statement can be an admission without corroboration; In re Nomiya, 184 USPQ 607, 610 (CCPA 1975). (E) is not true — a Jepson claim results in an implied admission that the preamble is prior art; MPEP § 2129; In re Ehrreich, 590 F.2d 902, 200 USPQ 504 (CCPA 1979); Sjolund v. Musland, 847 F.2d 1573, 6 USPQ2d 2020 (Fed. Cir. 1988); Pentec, Inc. v. Graphic Controls Corp., 776 F.2d 309, 227 USPQ 766 (Fed. Cir. 1985). [Pre-AIA] — options (B) and (C) turn on the pre-AIA one-year statutory bars.',
  },
  {
    id: 'uspto-oct02-pm-10',
    topicId: 3,
    subtopic: 'Objection vs. rejection — form vs. merits, and the review path for each',
    difficulty: 2,
    question: '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is true?',
    options: [
      'There is no practical difference between an objection and rejection of a claim.',
      'If the form of the claim (as distinguished from its substance) is improper, an objection is made.',
      'An objection, if maintained by an examiner, is subject to review by the Board of Patent Appeals and Interferences.',
      'An example of a proper objection is where the claims are refused because they fail to comply with the second paragraph of 35 USC 112.',
      'An example of a proper rejection is a rejection of a dependent claim for being dependent on a claim that has been rejected only over prior art, where the dependent claim is otherwise allowable.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 706.01. (A) and (C) are incorrect: as stated in MPEP § 706.01, “The practical difference between a rejection and an objection is that a rejection, involving the merits of the claim, is subject to review by the Board of Patent Appeals and Interferences, while an objection, if persisted, may be reviewed only by way of petition to the Commissioner.” (D) is incorrect — failure to comply with § 112, second paragraph, is a ground of rejection, not objection. MPEP § 706.03(d). (E) is incorrect: dependency of a claim on a rejected claim, where the dependent claim is otherwise allowable, is a matter of form as to which an objection (not a rejection) is made. MPEP §§ 706.01, 608.01(n).',
  },
  {
    id: 'uspto-oct02-pm-11',
    topicId: 0,
    subtopic: 'Overcoming a § 102(e) rejection — argument, § 1.132, or § 1.131',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following practices or procedures may be properly employed to overcome a rejection properly based on 35 USC 102(e)?',
    options: [
      'Persuasively arguing that the claims are patentably distinguishable from the prior art.',
      'Filing an affidavit or declaration under 37 CFR 1.132 showing that the reference invention is not by “another.”',
      'Filing an affidavit or declaration under 37 CFR 1.131 showing prior invention, if the reference is not a U.S. patent that either claims the same invention or claims an obvious variation of the subject matter in the rejected claim(s).',
      '(A) and (C).',
      '(A), (B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). See MPEP § 706.02(b) (8th ed.), under the heading “Overcoming a 35 U.S.C. § 102 Rejection Based on a Printed Publication or Patent.” (A), (B), and (C) alone, as well as (D), are not correct because they are not the most inclusive. [Pre-AIA] — § 102(e) and § 1.131 antedating practice do not survive under the AIA.',
  },
  {
    id: 'uspto-oct02-pm-12',
    topicId: 2,
    subtopic: '§ 1.47(a) — refusal to join is an acceptable reason; temporary unavailability is not',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with the MPEP and USPTO rules and procedure, a joint inventor on behalf of himself or herself and a nonsigning joint inventor in certain circumstances may make a patent application. Which of the following is an acceptable reason for filing an application with a declaration signed by a joint inventor, who is not the legal guardian of the other joint inventor, on behalf of himself and the nonsigning joint inventor?',
    options: [
      'The nonsigning joint inventor refuses to join in the application.',
      'The nonsigning joint inventor is on vacation and is temporarily unavailable to sign the declaration.',
      'The nonsigning joint inventor is hospitalized and is temporarily unavailable to sign the declaration.',
      'The nonsigning joint inventor is out of town and is temporarily unavailable to sign the declaration.',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (A) is the correct answer. MPEP § 409.03 and subpart (d); 37 C.F.R. § 1.47(a). (B) and (D) are each incorrect because MPEP § 409.03(d) states that “The fact that a nonsigning inventor is on vacation or out of town and is therefore temporarily unavailable to sign the declaration is not an acceptable reason for filing under 37 C.F.R. § 1.47.” (C) is incorrect because MPEP § 409.03(d) further states that “the fact that an inventor is hospitalized and/or is not conscious is not an acceptable reason for filing under 37 C.F.R. § 1.47.” (E) is incorrect because each of (B), (C), and (D) is incorrect.',
  },
  {
    id: 'uspto-oct02-pm-13',
    topicId: 2,
    subtopic: '§ 1.52(c) — handwritten alterations must be initialed and dated by the applicant',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is in accordance with the practice and procedures of Chapter 600 of the MPEP and/or 37 CFR 1.52(c)?',
    options: [
      'Handwritten alterations to the claims in a newly filed patent application should be dated and initialed or signed by the applicant on the same sheet of paper.',
      'The Office will consider evidence of whether noninitialed and/or nondated alterations were made before or after the signing of the oath or declaration rather than require a new oath or declaration.',
      'Any alteration to a patent application made by the applicant may be made after the application was signed and sworn to.',
      'Non-initialed or non-dated handwritten alterations to the claims on an application filed in the USPTO are considered to be a minor informality. Thus, the Office personnel should not object to the same.',
      'It is proper for an applicant to sign an oath or declaration even when the oath or declaration (i) does not identify a patent application or (ii) is not attached to or physically located together with the patent application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 605.04(a) provides that non-initialed or non-dated alterations are not in accord with 37 C.F.R. § 1.52(c). As to (B) and (C), MPEP § 605.04 states that the Office will not consider whether noninitialed and/or nondated alterations were made before or after the signing of the oath or declaration but will require a new oath or declaration. As to (D), see MPEP § 605.04(a) — such alterations are objectionable, not a minor informality. As to (E), according to MPEP § 605.04(a), it is improper for an applicant to sign an oath or declaration which is not attached to or does not identify the patent application.',
  },
  {
    id: 'uspto-oct02-pm-14',
    topicId: 2,
    subtopic: 'Provisional at 6 months — claim § 119(e) benefit rather than convert',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following timely actions should you take to accord maximum patent protection at minimum government fees for your client whose invention is described in a provisional patent application that was filed 6 months ago with no claim?',
    options: [
      'File a request to convert the provisional application to a nonprovisional application, accompanied by a proper executed declaration, an amendment including at least one claim as prescribed by paragraph 2 of 35 USC 112 and the proper fee set forth in 37 CFR 1.17(i).',
      'File a request to convert the provisional application to a nonprovisional application, accompanied by a proper executed declaration, an amendment including at least one claim as prescribed by paragraph 2 of 35 USC 112, the proper fee set forth in 37 CFR 1.17(i), and the basic filing fee for the nonprovisional application.',
      'File a request to convert the provisional application to a nonprovisional application, accompanied by a proper executed declaration, an amendment including at least one claim as prescribed by paragraph 2 of 35 USC 112, the proper fee set forth in 37 CFR 1.17(i), the basic filing fee for the nonprovisional application, and the surcharge required by 37 CFR 1.16(e).',
      'File a nonprovisional application including at least one claim accompanied by a proper executed declaration, and the basic filing fee. The application contains a specific reference to the provisional application in compliance with 37 CFR 1.78(a)(5).',
      'File a nonprovisional application including at least one claim accompanied by a proper executed declaration but without the basic filing fee. The application contains a specific reference to the provisional application in compliance with 37 CFR 1.78(a)(5).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. (A), (B) and (C) are wrong because MPEP § 601.01(c) states, “Claiming priority is less expensive [than conversion] and will result in a longer patent term.” Conversion requires payment of the conversion fee, and, per MPEP § 601.01(c), if the provisional was not filed with an executed oath or declaration and the nonprovisional filing fee, the surcharge set forth in 37 C.F.R. § 1.16(e) is also required. (E) is wrong because the action taken claims priority under 35 U.S.C. § 119(e)(1) rather than conversion under 37 C.F.R. § 1.53(c)(3), and omitting the basic filing fee triggers a surcharge that is otherwise avoidable.',
  },
  {
    id: 'uspto-oct02-pm-15',
    topicId: 1,
    subtopic: '§ 112 ¶ 2 — "said pipe" with two possible antecedents is indefinite',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Independent claim 1, fully supported by the specification in a patent application states: Claim 1. An apparatus comprising: a plastic valve; a copper pipe connected to the plastic valve; and an aluminum pipe connected to the plastic valve. Which of the following claims, presented in the application, provide the basis for a proper rejection under 35 USC 112, second paragraph? Claim 2. The apparatus of claim 1, wherein said pipe is statically charged. Claim 3. The apparatus of claim 1, wherein the outer circumference of said copper pipe is statically charged. Claim 4. The apparatus of claim 1, further comprising a thermostat connected to said plastic valve.',
    options: ['Claim 2.', 'Claim 3.', 'Claim 4.', 'Claims 2 and 3.', 'Claims 3 and 4.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is accepted as the most correct answer. MPEP § 2173.05(e). Claim 2 is indefinite because it is not clear which “said pipe” the claim is referring to since claim 1 recites a copper pipe and an aluminum pipe. Claim 3 would be construed as definite, inasmuch as “the outer circumference” is an inherent part of the pipe and would not require antecedent recitation — so (B) and (D) are incorrect. Claim 4 is definite inasmuch as there is antecedent basis for “said plastic valve” — so (C) and (E) are incorrect.',
  },
  {
    id: 'uspto-oct02-pm-16',
    topicId: 1,
    subtopic: 'Original claims constitute their own written description',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In which of the following situations, considered independently of each other, is the original, new, or amended claim supported in the application as filed?',
    options: [
      'An amendment to the specification changing the definition of “holder” from “is a hook” to “is a hook, clasp, crimp, or tong” and no amendment is made of the claim, which uses the term “holder.” The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'An amendment to the specification and claims changing the definition of “holder” from “is a hook” to “is a hook, clasp, crimp, or tong.” The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'Original claim 1 in the application refers to “a holder,” and original claim 2 depends from and refers to claim 1 stating, “said holder is a hook, clasp, crimp, or tong.” There is no disclosure in the specification preceding the claims in the application as filed for the holder to be a clasp, crimp, or tong.',
      'An amendment is filed presenting a claim to an electrical insulating device, copied from a patent for the purpose of provoking an interference. The claim refers to “nonconductive plastic holder.” The application as filed contains a broad generic disclosure describing electrical insulating devices. The holder is described in the specification of the application as “conducting electricity.” There is no disclosure in the specification of the holder being “nonconductive.”',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2163.03, item I. Original claims constitute their own description. In re Koller, 613 F.2d 819, 204 USPQ 702 (CCPA 1980). (A) and (B) are incorrect: as stated in MPEP § 2163.03, item I, “An amendment to the specification (e.g., a change in the definition of a term used both in the specification and claim) may indirectly affect a claim even though no actual amendment is made to the claim,” and there is no supporting disclosure in the original description for the holder to be a clasp, crimp, or tong. (D) is incorrect. MPEP § 2163.03, item IV. A broad generic disclosure is not necessarily a sufficient written description of a specific embodiment, especially where it conflicts with the remainder of the disclosure. Fields v. Conover, 443 F.2d 1386, 170 USPQ 276 (CCPA 1971). (E) is not correct because only (C) is correct.',
  },
  {
    id: 'uspto-oct02-pm-17',
    topicId: 1,
    subtopic: 'Multiple dependent claims must refer back in the alternative only',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Claims 1 and 2 in a patent application state the following: Claim 1. An apparatus for sitting comprising: (i) a square shaped base member; (ii) four elongated members mounted to the bottom of the base member; and (iii) a circular back member mounted to the base member. Claim 2. An apparatus as in claim 1, further comprising a spring connected to the back member and to the base member. Which, if any, of the following claims fully supported by the specification and presented in the application, is in accordance with USPTO rules and procedure?',
    options: [
      '3. An apparatus as in claim 1, wherein the base member is rectangularly shaped.',
      '3. An apparatus as in claim 2, wherein the wheels connected to each of the elongated members are plastic.',
      '3. An apparatus as in the preceding claims, further comprising a pressure-sensing device connected to the base member.',
      '3. An apparatus as in any of the preceding claims, in which the circular back member is wooden.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 608.01(n). (A) is incorrect because a dependent claim must further limit the subject matter of a previous claim, 37 C.F.R. § 1.75(c), and a rectangular base member is inconsistent with the square base member of claim 1. (B) is incorrect because there is no antecedent basis for the wheels. MPEP § 2173.05(e). (C) is incorrect because a multiple dependent claim must refer back in the alternative only. MPEP § 608.01(n). (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-oct02-pm-18',
    topicId: 3,
    subtopic: 'Preserving the right to petition a restriction requirement — traverse with reasons AND elect',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A U.S. patent application for inventor William Tull discloses a target-shooting gun for improved accuracy, and a bullet impregnated with a new chemical composition. The new chemical composition minimizes damage to a target struck by the bullet. In a non-final Office action, an examiner includes a restriction requirement between a group of claims drawn to the target-shooting gun (Group 1), and a group of claims drawn to the bullet (Group 2). Which of the following, included in a timely reply to the non-final Office action, preserves Tull’s right to petition for review of the restriction requirement, if the requirement is made final?',
    options: [
      'A reply that distinctly points out supposed errors in the restriction requirement, and also states, “The restriction requirement is traversed, and no election is made, thereby preserving Applicant’s right to petition for review of the restriction requirement.”',
      'A reply that states, “Applicant elects Group 2 and traverses the restriction requirement because the requirement for restriction between Group 1 and Group 2 is in error.”',
      'A reply that distinctly and specifically points out supposed errors in the restriction requirement, and states, “Applicant traverses the restriction requirement and elects Group 2.”',
      'A reply that states, “The restriction requirement between Group 1 and Group 2 is traversed because it is in error, and no election is made, thereby preserving Applicant’s right to petition for review of the restriction requirement.”',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 C.F.R. § 1.144; MPEP §§ 818.03(a)-(c). A complete reply must both distinctly and specifically point out the supposed errors in the restriction requirement AND make a provisional election. (A), (B), and (D) are each incorrect because no supposed errors are distinctly and specifically pointed out; (A) and (D) are further incorrect because no election is made. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct02-pm-19',
    topicId: 0,
    subtopic: 'A § 101 utility deficiency also creates a § 112 ¶ 1 deficiency',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In connection with the utility of an invention described in a patent application, which of the following conforms to proper USPTO practice and procedure?',
    options: [
      'A deficiency under 35 USC 101 also creates a deficiency under 35 USC 112, first paragraph.',
      'To overcome a rejection under 35 USC 101, it must be shown that the claimed device is capable of achieving a useful result on all occasions and under all conditions.',
      'A claimed invention is properly rejected under 35 USC 101 as lacking utility if the particular embodiment disclosed in the patent lacks perfection or performs crudely.',
      'To overcome a rejection under 35 USC 101, it is essential to show that the claimed invention accomplishes all its intended functions.',
      'A claimed invention lacks utility if it is not commercially successful.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). As stated in MPEP § 2107.01(IV), a deficiency under 35 U.S.C. § 101 also creates a deficiency under 35 U.S.C. § 112, first paragraph. See In re Brana, 51 F.3d 1560, 34 USPQ2d 1436 (Fed. Cir. 1995); In re Fouche, 439 F.2d 1237, 1243, 169 USPQ 429, 434 (CCPA 1971) (“If such compositions are in fact useless, appellant’s specification cannot have taught how to use them.”). (B) is not correct. MPEP § 2107(II); Brooktree Corp. v. Advanced Micro Devices, Inc., 977 F.2d 1555, 24 USPQ2d 1401 (Fed. Cir. 1992). (C), (D) and (E) are not correct. MPEP § 2107(II); E.I. du Pont De Nemours and Co. v. Berkley and Co., 620 F.2d 1247, 1260 n.17, 205 USPQ 1, 10 n.17 (8th Cir. 1980) — utility does not require perfection, accomplishment of all intended functions, or commercial success.',
  },
  {
    id: 'uspto-oct02-pm-20',
    topicId: 1,
    subtopic: 'Drawings filed later may not cure lack of enablement — § 113',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The specification in your client’s patent application has been objected to for lack of enablement. To overcome this objection, your client may do any of the following except:',
    options: [
      'traverse the objection and specifically argue how the specification is enabling.',
      'traverse the objection and submit an additional drawing to make the specification enabling.',
      'file a continuation-in-part application that has an enabling specification.',
      'traverse the objection and file an amendment without adding new matter in an attempt to show enablement.',
      'traverse the objection and refer to prior art cited in the specification that would demonstrate that the specification is enabling to one of ordinary skill.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 35 U.S.C. § 113 reads, “Drawings submitted after the filing date of the application may not be used (i) to overcome any insufficiency of the specification due to lack of an enabling disclosure.” Since choice (A) may be done, 37 C.F.R. § 1.111, it is an incorrect answer. Since choice (C) may be done, 35 U.S.C. § 120, it is an incorrect answer. Since choice (D) may be done, 37 C.F.R. § 1.121, it is an incorrect answer. Since choice (E) may be done, 37 C.F.R. § 1.111, it also is an incorrect answer.',
  },
  {
    id: 'uspto-oct02-pm-21',
    topicId: 3,
    subtopic: 'Appeal after claims twice rejected — rejections may span parent and continuing applications',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with the MPEP and USPTO rules and procedure, an applicant for a patent dissatisfied with the primary examiner’s decision may appeal to the Board of Patent Appeals and Interferences (“the Board”) in certain situations. In which of the following situations may the applicant properly appeal to the Board?',
    options: [
      'Applicant’s claims have been twice objected to, but have not been rejected.',
      'Applicant’s claims have been rejected once in a non-final Office action during examination of a parent application, and once in a non-final Office action during examination of a continuing application.',
      'Applicant’s claims in an original application have been rejected only once.',
      'Applicant’s claims have been objected to only once, and have been rejected only once in a non-final Office action.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (B) is the correct answer. MPEP § 1205; 37 C.F.R. § 1.191(a). MPEP § 1205 states that “A notice of appeal may be filed after any of the claims has been twice rejected, regardless of whether the claim(s) has/have been finally rejected. The limitation of ‘twice or finally…rejected’ does not have to be related to a particular application. For example, if any claim was rejected in a parent application, and the claim is again rejected in a continuing application, then applicant will be entitled to file an appeal in the continuing application, even if the claim was rejected only once in the continuing application.” Choices (A), (C), and (D) are each incorrect because the claims were not twice or finally rejected — objections are reviewed by petition, not appeal (MPEP § 706.01). (E) is incorrect because (A), (C), and (D) are incorrect.',
  },
  {
    id: 'uspto-oct02-pm-22',
    topicId: 2,
    subtopic: 'Correction of inventorship under § 1.48 — second § 1.48(a) conversion decided by the TC Director',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is in accordance with the provisions in the MPEP?',
    options: [
      'In order to correct inventorship in a nonprovisional application where the statement of the lack of deceptive intent is not available from an inventor to be added, a petition under 37 CFR 1.181 may be properly filed.',
      'If a person A learns that a patent application has been filed by person B without naming A as coinventor, A may file in the USPTO a petition that protests inventorship and directs B to add A’s name as a coinventor to the patent application.',
      'If the application is involved in an interference, and a petition under 37 CFR 1.48 is filed to correct inventorship, the Board of Patent Appeals and Interferences will remand the case to the primary examiner for consideration of the petition to ensure that a search of the relevant prior art is performed.',
      'When a second conversion under 37 CFR 1.48(a) is attempted by the practitioner, the conversion decision will be decided by the Technology Center Director.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) and (E) were BOTH accepted — the official answer line reads “ANSWERS: (D) and (E) were accepted.” This bank keys the item to (D), which the model answer analyses first. As to (D), see MPEP § 201.03: “Requests under 37 CFR 1.48 are generally decided by the primary examiner except . . . When a second conversion under 37 CFR 1.48(a) is attempted (decided by the Technology Center (TC) Director).” Answer (E) was accepted because the word “conversion” in answer (D) and MPEP § 201.03 may be inaccurate terminology in the context of correction of inventorship, which may reasonably have led candidates to select (E), none of the above. As to (A), the petition to be filed would be under 37 C.F.R. § 1.183. As to (B), 35 U.S.C. § 116 provides that inventors may apply for a patent jointly; a person not named in the application could not file a petition under 37 C.F.R. § 1.48, inventorship may only be contested inter partes through the interference process, and MPEP §§ 1901.05 and 1901.07 preclude a protestor from participation (see also 37 C.F.R. § 1.291(c)). (C) is incorrect at least because if the application is involved in an interference the Board will decide the petition. MPEP § 201.03. [Historical practice] — the AIA revised inventorship-correction practice and removed the deceptive-intent requirements.',
  },
  {
    id: 'uspto-oct02-pm-23',
    topicId: 6,
    subtopic: 'Design patents are not included in the PCT',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following statements relating to design patents does not accord with proper USPTO practice and procedure?',
    options: [
      'Both design and utility patents may be obtained on an article if the invention resides both in its utility and ornamental appearance.',
      'The design for an article consists of the visual characteristics embodied in or applied to an article.',
      'Design patent applications are included in the Patent Cooperation Treaty (PCT), and the procedures followed for PCT international applications are to be followed for design patent applications.',
      'A claim directed to a computer-generated icon shown on a computer screen complies with the “article of manufacture” requirement of 35 USC 171.',
      'A claimed design may encompass multiple articles or multiple parts within an article.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the best choice because there is no provision for design patents under the PCT. MPEP § 1502.01. (A) is a true statement. MPEP § 1502.01. (B) is a true statement. MPEP § 1502. (D) is a true statement. MPEP § 1504.01(a), I.A. (E) is a true statement. MPEP § 1504.01(b).',
  },
  {
    id: 'uspto-oct02-pm-24',
    topicId: 2,
    subtopic: 'A provisional application requires no claim — § 111(b)(2)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A claim, as required by the second through fifth paragraphs of section 112, shall not be required in a _____________ patent application.',
    options: ['reissue', 'design', 'continuation', 'provisional', 'plant'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct because 35 U.S.C. § 111(b)(2) states, “A claim, as required by the second through fifth paragraphs of section 112, shall not be required in a provisional application.” MPEP § 201. (A) is wrong because an application for reissue must contain the entire specification, including the claims, and the drawings of the patent. 37 C.F.R. § 1.173(a). (B) is wrong because a design patent application contains a single claim. 37 C.F.R. § 1.53(b); MPEP § 1503.03. (C) is wrong because a continuation is a second application for the same invention claimed in a prior nonprovisional application. MPEP § 201.07. (E) is wrong because 35 U.S.C. § 162 states, “The claim in the specification shall be in formal terms to the plant shown and described.” MPEP § 1605.',
  },
  {
    id: 'uspto-oct02-pm-25',
    topicId: 3,
    subtopic: 'Improper second CPA treated as improper RCE — application abandoned',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Applicant Jones filed a request for a first continued prosecution application (CPA) on December 29, 2000 in a utility application that was filed on April 28, 2000. Jones received a final Office action mailed on June 28, 2001. In response, Jones filed an amendment amending the claims in the first CPA. Jones received an advisory action on September 27, 2001 stating that the proposed amendment to the first CPA would not be entered because it raises new issues that would require further consideration. Additionally, the proposed amendment did not meet the requirements for a complete reply under 37 CFR 1.111. On December 28, 2001, Jones filed a petition for a 3-month extension of time with appropriate petition fee, a request for a second continued prosecution application, a request for suspension of action, and appropriate processing fee for the request for suspension of action. No application filing fee was filed with the request for the second CPA. Which of the following would be a proper communication mailed by the Office based on Jones’ actions?',
    options: [
      'A Notice of Allowability.',
      'A Notice to File Missing Parts.',
      'A first Office action on the merits.',
      'A notice of improper Request for Continued Examination (RCE) and a notice of abandonment.',
      'A letter granting the suspension of action.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). See MPEP § 706.07(h), under “IV. IMPROPER CPA TREATED AS RCE.” The request for a second CPA filed on December 28, 2001 is improper because the application in which it was filed has a filing date of December 29, 2000, and CPA practice does not apply to applications with a filing date on or after May 29, 2000. The Office automatically treats the improper CPA request as a Request for Continued Examination under 37 C.F.R. § 1.114, but it does not satisfy § 1.114 because it lacks the filing fee required by 37 C.F.R. § 1.17 and the required submission. The time period set in the final Office action mailed June 28, 2001 continued to run and expired on December 28, 2001, so the application is abandoned. (A), (B), and (C) are incorrect because the second CPA request is improper and the amendment was not entered. (E) is incorrect because a request for suspension of action will not be granted if the CPA or the RCE is improper. 37 C.F.R. § 1.103; MPEP § 709. [Historical practice] — CPA practice was eliminated for utility applications in 2003; RCE practice under § 1.114 replaced it.',
  },
  {
    id: 'uspto-oct02-pm-26',
    topicId: 1,
    subtopic: 'Product-by-process claims — replacing an improper multiple dependent claim',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A patent application filed in the USPTO contains the following three original claims, including product by process Claim 3: Claim 1. A method for making an Ethernet cable comprising the steps of A, B and C. Claim 2. The method of claim 1, further characterized by the step of D. Claim 3. The Ethernet cable as in any one of the preceding claims. In the first Office action, the examiner objects to Claim 3 as being an improper dependent claim and requires cancellation of the claim. Following proper USPTO practices and procedures, which of the following replies best overcomes the examiner’s objection and provides the client with the broadest patent protection?',
    options: [
      'Amend Claim 3 to read: “The Ethernet cable as made by the process set forth in claims 1-2.”',
      'Cancel Claim 3. Add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.” Add Claim 5, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.”',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
      'Cancel Claim 3.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. The cancellation of Claim 3 overcomes the examiner’s objection, and the addition of Claims 4 and 5 provides the client with patent protection in product-by-process format for the cable by both methods of manufacture; if Claim 4 is invalid, Claim 5 may remain valid. (A) is incorrect because it is an improper multiple dependent claim. 35 U.S.C. § 112 ¶ 5; 37 C.F.R. § 1.75(c); MPEP § 608.01(n), part (I)(B)(1). (C) and (D) alone are not the most correct answers because each leaves the application without a claim to the cable made by the other process. (E) alone is incorrect because it leaves the application without any claim to the Ethernet cable.',
  },
  {
    id: 'uspto-oct02-pm-27',
    topicId: 0,
    subtopic: 'Copending commonly assigned applications — provisional § 102(e) rejection',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Adams filed Application X on March 1, 2001. Beth filed application Y on May 1, 2001. Neither application has been published. Applications X and Y are copending and commonly assigned. Earlier filed application X claims the same invention as claimed in application Y using identical language. In accordance with the MPEP, which of the following actions should the examiner or assignee follow?',
    options: [
      'The claims to the same invention in application Y should be rejected under 35 USC 102(a) as being anticipated by application X.',
      'The claims to the same invention in application Y should be rejected under 35 USC 102(b) as being anticipated by application X.',
      'The claims to the same invention in application Y should be rejected under 35 USC 102(e) as being provisionally anticipated by application X.',
      'The common assignee should file a terminal disclaimer in application Y to avoid any question of double patenting.',
      'The claims to the same invention in application Y should be rejected under 35 USC 102(e) as being anticipated by application X.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. 35 U.S.C. § 102(e); MPEP § 804, Chart III-A. Section I of MPEP § 706.02(f) states, “If (1)…the applications are commonly assigned and (2) the effective filing dates are different, then a provisional rejection of the later filed application should be made.” (A) is wrong because the facts do not indicate prior knowledge or use by others, or publication. (B) is wrong because the facts do not indicate a patent, publication, public use, or on-sale bar. (D) is wrong — this is a statutory (same-invention) double patenting situation that cannot be avoided by a terminal disclaimer. In re Bartfeld, 17 USPQ2d 1885 (Fed. Cir. 1991); MPEP §§ 706.02(f), 804.02. (E) is wrong because a nonprovisional § 102(e) rejection is improper in these circumstances. MPEP § 804, Chart I-A. [Pre-AIA] — § 102(e) provisional-rejection practice; the AIA rewrote § 102 entirely.',
  },
  {
    id: 'uspto-oct02-pm-28',
    topicId: 2,
    subtopic: '§ 115 oath — a declaration need not be notarized',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions of 35 USC 115 (Oath of applicant)?',
    options: [
      'The applicant shall make oath (or declaration) that he believes himself to be the original and first inventor of the process, machine, manufacture, or composition of matter, or improvement thereof, for which he solicits a patent.',
      'In the oath or declaration, the applicant must state of what country he is a citizen.',
      'An oath may be made before any person within the United States authorized by law to administer oaths.',
      'An oath executed in a foreign country must be properly authenticated.',
      'A declaration which accompanies a patent application must state on the document a warning that willful false statements and the like are punishable by fine or imprisonment or both under 18 USC 1001, and the declaration must be notarized.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the best answer. The declaration need not be notarized. See 37 C.F.R. § 1.63(a). A declaration may be used in lieu of an oath. 37 C.F.R. § 1.68; MPEP § 602. As to (A) through (C), see 35 U.S.C. § 115. As to (D), see MPEP § 602.04. [Pre-AIA] — the AIA rewrote 35 U.S.C. § 115; the original-and-first-inventor and citizenship recitations describe the pre-AIA statute.',
  },
  {
    id: 'uspto-oct02-pm-29',
    topicId: 3,
    subtopic: 'RCE — situations in which prosecution is considered closed',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] For purposes of determining whether a request for continued examination is in accordance with proper USPTO rules and procedure, in which of the following situations will prosecution be considered closed?',
    options: [
      'The last Office action is a final rejection.',
      'The last Office action is an Office action under Ex Parte Quayle.',
      'A notice of allowance has issued following a reply to a first Office action.',
      'The application is under appeal.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 C.F.R. § 1.114 (effective August 16, 2000); “Request for Continued Examination Practice and Changes to Provisional Application Practice; Final Rule,” 65 FR 50092, 50097 (August 16, 2000): prosecution is closed after a final rejection (§ 1.113), an Office action under Ex Parte Quayle, 1935 Comm’r Dec. 11 (1935), a notice of allowance, or an action that otherwise closes prosecution in the application. Thus (A), (B), (C) and (D) are individually correct, and (E), being the most inclusive, is the most correct answer.',
  },
  {
    id: 'uspto-oct02-pm-30',
    topicId: 3,
    subtopic: 'Telephone election without traverse — what follows a finding of allowability',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The MPEP sets forth a procedure whereby an examiner may contact an applicant to discuss election of claims after the examiner determines that a restriction requirement should be made. Assume that a primary examiner contacts a practitioner representing applicant by telephone prior to any Office action on the merits, and the examiner orally makes a restriction requirement. During the telephone conversation, the practitioner orally makes an election of claims without traverse. On examination, the examiner finds the elected claims to be allowable. Which of the following would be improper for the examiner to include in a letter to the practitioner attached to a Notice of Allowability?',
    options: [
      'A cancellation of the non-elected claims.',
      'A statement that the prosecution is closed.',
      'A statement that a Notice of Allowance will be sent in due course.',
      'A statement that the applicant’s election is not upheld because an election must only be made in writing, and cannot be made by telephone.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (D) is the correct answer. MPEP § 812.01. Choices (A), (B), and (C) are each proper because MPEP § 812.01 reads, “If, on examination, the examiner finds the elected claims to be allowable and no traverse was made, the letter should be attached to the Notice of Allowability form PTOL-37 and should include cancellation of the nonelected claims, a statement that the prosecution is closed, and that a notice of allowance will be sent in due course.” Choice (E) is incorrect because only choice (D) is improper.',
  },
  {
    id: 'uspto-oct02-pm-31',
    topicId: 1,
    subtopic: 'Specification content — tables and chemical formulas permitted, hyperlinks not',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Regarding the specification of a nonprovisional patent application, which of the following practices is in accordance with proper USPTO practice and procedure?',
    options: [
      'The specification may include graphical illustrations or flowcharts.',
      'The specification may include tables and chemical formulas.',
      'The specification may include hyperlinks or other forms of browser-executable code embedded in the text.',
      'The specification must begin with one or more claims.',
      'The specification may include a reservation for a future application of subject matter disclosed but not claimed in the application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 608.01, subsection “Illustrations In the Specification”; 37 C.F.R. § 1.58(a) permits tables and chemical formulas in the specification in lieu of formal drawings. (A) is incorrect — graphical illustrations, diagrammatic views, flowcharts, and diagrams in the descriptive portion do not come within § 1.58(a); the examiner should object and request formal drawings under 37 C.F.R. § 1.81. (C) is incorrect. MPEP § 608.01, subsection “Hyperlinks And Other Forms Of Browser-Executable Code In The Specification.” (D) is incorrect — the specification must CONCLUDE with one or more claims. 37 C.F.R. § 1.75(a). (E) is incorrect — a reservation for a future application will not be permitted in the pending application. 37 C.F.R. § 1.79.',
  },
  {
    id: 'uspto-oct02-pm-32',
    topicId: 0,
    subtopic: 'Overcoming a § 102(a) rejection — perfecting foreign priority that antedates the reference',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following practices or procedures may be properly employed to overcome a rejection properly based on 35 USC 102(a)?',
    options: [
      'Perfecting a claim to priority under 35 USC 119(a)-(d) based on a foreign application having a foreign priority filing date that antedates the reference.',
      'Filing a declaration under 37 CFR 1.131 showing that the cited prior art antedates the invention.',
      'Filing a declaration under 37 CFR 1.132 showing that the reference invention is by “others.”',
      'Perfecting priority under 35 USC 119(e) or 120 by, in part, amending the declaration of the application to contain a specific reference to a prior application having a filing date prior to the reference.',
      '(A), (B) (C), and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). See MPEP § 706.02(b) (8th ed.), under the heading “Overcoming a 35 U.S.C. § 102 Rejection Based on a Printed Publication or Patent.” (B) and (C) are incorrect because they present showings that support the rejection — a proper § 1.131 declaration must show the invention antedates the reference, not the reverse, and a proper § 1.132 declaration must show the reference invention is not by “others.” (D) is not correct because to perfect priority under 35 U.S.C. §§ 119(e) or 120 it is necessary to amend the SPECIFICATION of the application to contain a specific reference to the prior application; the declaration is not to be amended. (E) is incorrect because (B), (C) and (D) are incorrect. [Pre-AIA] — § 102(a) and § 1.131 antedating practice do not survive under the AIA.',
  },
  {
    id: 'uspto-oct02-pm-33',
    topicId: 3,
    subtopic: 'Authorization for an examiner’s amendment after final — extension required outside the SSP',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Xavier files a complete first reply exactly 10 weeks after the mailing date of a final Office action that sets a 3 month shortened statutory period for reply. An Examiner’s Amendment is necessary for the purpose of placing the application in condition for allowance. Which of the following statements is true?',
    options: [
      'If Xavier gives authorization for the Examiner’s Amendment exactly 2 months after his reply, the application will be allowed.',
      'Authorization for the Examiner’s Amendment may be made at any time within 6 months of Xavier’s reply to avoid abandonment of the application..',
      'Unless Xavier gives authorization for the Examiner’s Amendment within the 3 months shortened statutory period for reply, the application will be abandoned.',
      'If Xavier gives authorization for the Examiner’s Amendment exactly 2 months after his reply, the application will be abandoned unless accompanied by a proper petition and fee for an extension of time.',
      'Abandonment of the application will be avoided if Xavier gives authorization for the Examiner’s Amendment any time within 6 months of the mail date of a final Office action. No extension of time need be filed if Xavier gives the authorization between 3 months and 6 months after the Office action.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. (A), (C), and (E) are wrong because MPEP § 706.07(f), paragraph (I), states, “Where a complete first reply to a final Office action has not been filed within 2 months of the final Office action, applicant’s authorization to make an amendment to place the application in condition for allowance must be made either within the 3 month shortened statutory period or within an extended period for reply that has been petitioned and paid for by applicant pursuant to 37 C.F.R. § 1.136(a).” (B) is wrong because MPEP § 706.07(f), paragraph (H), states, “Note that an examiner’s amendment may not be made more than 6 months from the date of the final Office action, as the application would be abandoned at that point by operation of law.”',
  },
  {
    id: 'uspto-oct02-pm-34',
    topicId: 2,
    subtopic: 'Express Mail under § 1.10 — label number must be on the papers when mailed',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] On Monday, May 13, 2002, John’s secretary deposited in an “Express Mail” drop box prior to the last scheduled pick-up for that day, an envelope properly addressed to the USPTO for delivery to the USPTO by the “Express Mail Post Office to Addressee” service. The envelope was received by the USPTO on Wednesday, May 15, 2002, containing a reply to an Office action which set a shortened statutory period (“SSP”) for reply ending on Tuesday, May 14, 2002. The reply was marked by the Office as being received on May 15, 2002. The number of the “Express Mail” mailing label had not been placed on the response papers, and upon receipt of the “Express Mail” mailing label John learned that the “date in” was not clearly marked. John promptly filed a petition requesting the filing date to be the date of deposit. The petition included a showing that the date of deposit accompanied by evidence of USPS corroboration of the deposit. Accordingly,',
    options: [
      'The reply will be regarded as timely filed in the USPTO on May 15, 2002.',
      'The reply will be regarded as timely filed in the USPTO on May 14, 2002.',
      'The reply will be regarded as timely filed in the USPTO on May 13, 2002.',
      'The reply will be regarded as timely filed in the USPTO if a petition with proper fee for a one month extension of time is filed in the USPTO on or before June 14, 2002.',
      'The reply will be regarded as timely filed in the USPTO if the number of the “Express Mail” mailing label is placed on each page of a copy of the original response and hand carried to the USPTO on May 15, 2002, rather than being sent by “Express Mail.”',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. 37 C.F.R. § 1.136(a) states, “[A]pplicant may extend the time period for reply up to the earlier of the expiration of any maximum period set by statute or five months after the time period set for reply, if a petition for an extension of time and the fee set in § 1.17(a) are filed…” (A) is wrong because the response was received after the SSP expired and so was not timely without an extension. (B) and (C) are wrong — the reply cannot get the deposit date because the conditions of 37 C.F.R. § 1.10(b) were not satisfied: the number of the “Express Mail” mailing label must have been placed on each page of the response prior to the original mailing, and the petition should not be expected to be granted without it. See § 1.10(c)(2), (d)(2), and (e)(2). (E) is wrong because § 1.10(b) requires the label number to have been placed on each page PRIOR to the original mailing by “Express Mail.”',
  },
  {
    id: 'uspto-oct02-pm-35',
    topicId: 2,
    subtopic: 'Application papers — metric (SI) units first, English equivalents second',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions of the MPEP?',
    options: [
      'If there is a discrepancy between the information submitted in an application data sheet and the information submitted elsewhere in the application, the application data sheet will control except for the naming of the inventors and the citizenship of the inventors, which is governed by the oath or declaration.',
      'A patent examiner should object to text of a patent application if it contains an embedded hyperlink and /or other form of browser-executable code.',
      'All patent applicants should use the English units of measurement followed by the equivalent metric units when describing their inventions in the specifications of patent applications.',
      'The paper used for patent applications must have a surface such that amendments may be written thereon in ink; so-called “Easily Erasable” paper having a special coating so that erasures can be made more easily may not provide a permanent copy as is required.',
      'The following documents may be submitted to the Office on a compact disc: a computer program listing, a sequence listing, and a table that has more than 50 pages of text.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). According to MPEP § 608.01, “In order to minimize the necessity in the future for converting dimensions given in the English system of measurements to the metric system of measurements when using printed patents as research and prior art search documents, all patent applicants should use the metric units (SI) followed by the equivalent English units when describing their inventions in the specifications of patent applications” — the opposite order from that stated in (C). As to (A), see MPEP § 601.05 and 37 C.F.R. § 1.76(d)(3). As to (B), see MPEP § 608.01(a) regarding hyperlinks. As to (D), see 37 C.F.R. § 1.52(a); MPEP § 608.01. As to (E), see MPEP § 608.01 and 37 C.F.R. § 1.52.',
  },
  {
    id: 'uspto-oct02-pm-36',
    topicId: 3,
    subtopic: '§ 1.251 — reconstructing a lost application file',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The USPTO notifies John, a registered patent agent who is representing applicant A, that after a reasonable search, the USPTO has been unable to locate applicant A’s patent application. By which of the following procedures may John avoid abandonment of applicant A’s application within the time period set by the USPTO?',
    options: [
      'Provide the USPTO with a copy of his record of all the correspondence between his office and the USPTO, assuming the existence of such record.',
      'Provide the USPTO with a list of all the correspondence between his office and the USPTO, assuming the existence of such list, and a statement that the list is complete and accurate.',
      'Provide the USPTO with a statement that he does not possess any record of the correspondence between his office and the USPTO because his files were destroyed.',
      'Provide the USPTO with a record of all the correspondence between his office and the USPTO, and a statement that the papers produced are his complete record of all the correspondence between his office and the USPTO, assuming the existence of such record.',
      'Provide the USPTO with a copy of his record of all the correspondence between his office and the USPTO, assuming the existence of such record, a list of all such correspondence, and a statement that he is not aware of any correspondence between his office and the USPTO that is not among his records.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct because there is compliance with 37 C.F.R. § 1.251(a)(3). (A) is wrong because along with a copy of the record, he is required to provide a list of all correspondence and a statement that the copy is complete and accurate and that he is not aware of any correspondence between his office and the USPTO that is not among his records. 37 C.F.R. § 1.251(a)(1)(ii). (B) is wrong because a copy of the record of all correspondence is also required, with the full statement. 37 C.F.R. § 1.251(a)(1)(i). (D) is wrong because the statement omits the recitation that he is not aware of any correspondence not among his records. 37 C.F.R. § 1.251(a)(2)(ii). (E) is wrong because the statement omits the recitation that the copy of his record of all the correspondence is complete and accurate. 37 C.F.R. § 1.251(a)(1)(iii).',
  },
  {
    id: 'uspto-oct02-pm-37',
    topicId: 1,
    subtopic: 'Detailed description — reference characters must appear in the drawings',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the recommended characteristics set forth in the MPEP for the detailed description of the invention?',
    options: [
      'The detailed description of the invention must include a description of the preferred embodiment(s) of the invention as required in 37 CFR 1.71.',
      'The detailed description should be as short and specific as is necessary to describe the invention adequately and accurately.',
      'Where elements or groups of elements, compounds, and processes, which are conventional and generally widely known in the field of the invention described, and their exact nature or type is not necessary for an understanding and use of the invention by a person skilled in the art, they should not be described in detail.',
      'The detailed description of the invention may include reference characters to the parts of the invention that do not appear in the drawings.',
      'Where particularly complicated nonessential subject matter is involved or where the elements, compounds, or processes may not be commonly or widely known in the field, absent disclosure elsewhere in the application, the specification should refer to another patent or readily available publication that adequately describes the subject matter.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. Reference characters mentioned in the detailed description must appear in the drawings. 37 C.F.R. §§ 1.83(a) and 1.84(p)(5); MPEP § 608.02. As to (A), (B), (C), and (E), see MPEP § 608.01(a).',
  },
  {
    id: 'uspto-oct02-pm-38',
    topicId: 1,
    subtopic: '§ 112 ¶ 2 — failure to interrelate essential elements defined in the specification',
    difficulty: 3,
    question: '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is true?',
    options: [
      'A claim to a process omitting a step in a disclosed process, where the step is disclosed in the specification to be essential to the invention, may not be properly rejected under 35 USC 112, first paragraph, for lack of enablement where the specification provides an enabling disclosure only for the process which includes the essential step.',
      'Failure to disclose the best mode must rise to the level of active concealment or grossly inequitable conduct in order to support a rejection under 35 USC 112, first paragraph.',
      'A claim failing to interrelate essential elements of the invention, as defined by the applicant in the specification, where the interrelation is critical to the invention may be properly rejected under 35 USC 112, second paragraph, for failure to properly point out and distinctly claim the invention.',
      'Where the best mode contemplated by the inventor at the time of filing the application is not disclosed, a proposed amendment adding a specific mode of practicing the invention would not be new matter.',
      'The best mode requirement is the same as the enablement requirement of the first paragraph of 35 USC 112.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. As stated in MPEP § 2172.01, “a claim which fails to interrelate essential elements of the invention as defined by applicant(s) in the specification may be rejected under 35 U.S.C. § 112, second paragraph, for failure to point out and distinctly claim the invention. See In re Venezia, 530 F.2d 956, 189 USPQ 149 (CCPA 1976); In re Collier, 397 F.2d 1003, 158 USPQ 266 (CCPA 1968).” (A) is incorrect — such a claim MAY be rejected as not enabling. In re Mayhew, 527 F.2d 1229, 188 USPQ 356 (CCPA 1976); MPEP §§ 2172.01, 2164.08(c). (B) is incorrect — failure to disclose the best mode need not rise to active concealment or grossly inequitable conduct. MPEP § 2165; Union Carbide Corp. v. Borg-Warner, 550 F.2d 555, 193 USPQ 1 (6th Cir. 1977). (D) is incorrect — such an amendment should be treated as new matter. In re Hay, 534 F.2d 917, 189 USPQ 790 (CCPA 1976); MPEP § 2165.01. (E) is incorrect — best mode is separate and distinct from enablement. In re Newton, 414 F.2d 1400, 163 USPQ 34 (CCPA 1969); MPEP § 2165.02.',
  },
  {
    id: 'uspto-oct02-pm-39',
    topicId: 1,
    subtopic: 'Summary of the invention — directed to the invention, not the disclosure as a whole',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the recommended characteristics set forth in the provisions of the MPEP for the summary of the invention?',
    options: [
      'The summary is separate and distinct from the abstract and is directed toward the disclosure as a whole, rather than just the invention.',
      'The summary may point out the advantages of the invention or how it solves problems previously existent in the prior art (and preferably indicated in the Background of the Invention).',
      'In chemical cases the summary should point out in general terms the utility of the invention.',
      'If possible, the summary should set forth the nature and gist of the invention or the inventive concept should be set forth.',
      'Any stated objects of the invention should be treated briefly in the summary and only to the extent that they contribute to an understanding of the invention.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). Item (A) should read, “The summary is separate and distinct from the abstract and is directed toward the invention rather than the disclosure as a whole.” As to (B) through (E), see 37 C.F.R. § 1.73; MPEP § 608.01(a) and (d).',
  },
  {
    id: 'uspto-oct02-pm-40',
    topicId: 0,
    subtopic: 'Internet disclosure with no publication or retrieval date is not prior art',
    difficulty: 2,
    question: '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following does not represent prior art?',
    options: [
      'The preamble of a Jepson claim.',
      'A technical journal as of its date of publication which is accessible to the public as of the date of its publication.',
      'A disclosure publicly posted on the INTERNET, but containing no publication or retrieval date.',
      'A doctoral thesis indexed, cataloged and shelved in a university library.',
      'Applicant’s labeling of one of the figures in the drawings submitted with his application as prior art.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. See MPEP § 2128 under the subheading “Date of Availability” of the heading “Electronic Publications As Prior Art” — an Internet disclosure with no publication or retrieval date cannot be relied on as prior art. (A) is wrong. See MPEP § 2129 under “A Jepson Claim Results In An Implied Admission That Preamble Is Prior Art.” (B) is wrong. See MPEP § 2128.02 — a journal article becomes available as prior art on the date it is received by at least one member of the public. (D) is wrong. See MPEP § 2128.01 under “A Thesis Placed In A University Library May Be Prior Art If Sufficiently Accessible To The Public.” (E) is wrong. In re Nomiya, 184 USPQ 607, 610 (CCPA 1975); MPEP § 2129 under “Admissions By Applicant Constitute Prior Art.”',
  },
  {
    id: 'uspto-oct02-pm-41',
    topicId: 0,
    subtopic: 'CIP — per-claim effective filing dates',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In 1995 Patent Agent filed a U.S. patent application containing five claims (Application 1). All five claims are fully supported under 35 USC 112 by the disclosure of Application 1. In 2000, Patent Agent filed a U.S. patent application (Application 2) that was a continuation-in-part of Application 1. Application 2 adds new subject matter to the disclosure of Application 1, and ten additional claims. Of the fifteen claims in Application 2, claims 1-5 are exactly the same as Application 1, claims 6-10 are fully supported under 35 USC 112 by the disclosure of Application 1, and claims 11-15 are fully supported under 35 USC 112 only by the newly added subject matter of Application 2. The effective filing date for claims in Application 2 is:',
    options: ['1-15 is 2000.', '1-15 is 1995.', '1-10 is 1995.', '11-15 is 2000.', '(C) and (D).'],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 706.02 (8th ed.), under “DETERMINING THE EFFECTIVE FILING DATE OF THE APPLICATION”: “If the application is a continuation-in-part of an earlier U.S. application, any claims in the new application not supported by the specification and claims of the parent application have an effective filing date equal to the filing date of the new application. Any claims which are fully supported under 35 U.S.C. § 112 by the earlier parent application have the effective filing date of that earlier parent application.” Accordingly, the effective filing date of claims 1-10 is 1995 and of claims 11-15 is 2000. (A) and (B) are incorrect because they do not account for the two different effective filing dates. (C) and (D) are both correct, therefore (E), which includes both, is the most correct answer.',
  },
  {
    id: 'uspto-oct02-pm-42',
    topicId: 0,
    subtopic: 'Unexpected results — attorney argument cannot substitute for factual evidence',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Evidence of unexpected results is relied upon to overcome a prima facie case of obviousness. Which of the following is incorrect?',
    options: [
      'The evidence must compare the claimed invention to the closest prior art.',
      'The evidence must be commensurate in scope with the claims.',
      'Data relied upon to show unexpected results need not cover the full range of the claims if one of ordinary skill in the art could ascertain a trend in the data that would allow that person to reasonably extend the probative value of the data to the full scope of the claims.',
      'Unexpected results can be shown by factual evidence or, if no factual evidence is available to the applicant, by sound argument by the applicant’s agent or attorney.',
      'The evidence need not be in an affidavit or declaration under 37 CFR 1.132 if the evidence is presented in the specification of an application to which the applicant has attested.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer because mere attorney argument, unsupported by factual evidence, is insufficient to establish unexpected results. See In re Geisler, 116 F.3d 1465, 1470-71, 43 USPQ2d 1362, 1365-66 (Fed. Cir. 1997). (A) is not the proper choice because such a comparison is required. In re Baxter Travenol Labs., 952 F.2d 388, 21 USPQ2d 1281 (Fed. Cir. 1991); In re De Blauwe, 736 F.2d 699, 222 USPQ 191 (Fed. Cir. 1984); MPEP § 716.02(e). (B) is not the proper choice because evidence must be commensurate in scope with the claims. In re Grasselli, 713 F.2d 731, 218 USPQ 769 (Fed. Cir. 1983); In re Clemens, 622 F.2d 1029, 206 USPQ 289 (CCPA 1980). (C) is not the proper choice because a trend in narrower data can prove the unobviousness of a broader claimed range. In re Kollman, 595 F.2d 48, 201 USPQ 193 (CCPA 1979). (E) is not the proper choice because the relied-upon evidence can be in the specification. In re Soni, 54 F.3d 746, 34 USPQ2d 1684 (Fed. Cir. 1995).',
  },
  {
    id: 'uspto-oct02-pm-43',
    topicId: 0,
    subtopic: 'Obviousness — the prior art suggestion need not be for the applicant’s purpose',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A patent application filed in the USPTO claims a nylon rope coated with element E for the purpose of preventing breakage of the rope. In the first Office action, the examiner rejects the claim as obvious over P in view of a trade journal publication, T. P teaches a nylon rope coated with resin for the purpose of making the rope waterproof. T teaches a nylon tent fabric coated with element E for the purpose of making the tent waterproof, and suggests the use of element E for making other nylon products waterproof. Following proper USPTO practices and procedures, the combination of P and T:',
    options: [
      'cannot support a prima facie case of obviousness because T lacks a suggestion to combine with P for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because P lacks a suggestion to combine with T for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness, even though T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness because the applicant is always under an obligation to submit evidence of non-obviousness regardless of whether the examiner fully establishes a prima facie case of obviousness.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). “It is not necessary in order to establish a prima facie case of obviousness…that there be a suggestion or expectation from the prior art that the claimed [invention] will have the same or a similar utility as one newly discovered by the applicant.” In re Dillon, 919 F.2d 688, 692, 16 USPQ2d 1897, 1900 (Fed. Cir. 1990); MPEP § 2144 (“Rationale Different from Applicant’s is Permissible”). Here, T suggests the combination with P to achieve a different advantage (waterproofing) from that discovered by applicant (reducing breakage). (A)-(C) are incorrect because the suggestion to combine does not need to be for the same purpose as applicant discloses. (E) is incorrect because an applicant is under no obligation to submit evidence of non-obviousness unless the examiner meets the initial burden of fully establishing a prima facie case. MPEP § 2142.',
  },
  {
    id: 'uspto-oct02-pm-44',
    topicId: 4,
    subtopic: 'Foreign priority — no requirement that the inventive entities be identical',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The procedures in the MPEP do not require an applicant claiming foreign priority in a nonprovisional utility application to:',
    options: [
      'submit the processing fee set forth in 37 CFR 1.17(i) if the claim for priority or submission of the certified copy of the priority document is made after payment of the issue fee and before the patent is granted.',
      'identify the foreign application for which priority is being claimed as well as any foreign application for the same subject matter having a filing date before that of the application for which priority is being claimed.',
      'file the claim in the application.',
      'have the same inventive entity listed in the foreign application as in the U.S. application in which the priority claim has been filed.',
      'identify the intellectual property authority or country in or for which the foreign application was filed.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). There is no requirement as to the inventive entity being the same. As to (A), see 37 C.F.R. § 1.55(a)(2). As to (B), see 37 C.F.R. § 1.55(a)(1)(i) and MPEP § 201.14(a). As to (C), see MPEP § 201.14(a). As to (E), see MPEP § 201.14.',
  },
  {
    id: 'uspto-oct02-pm-45',
    topicId: 2,
    subtopic: 'Access and intervention — a part-interest assignee may not always intervene',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with Chapter 100 of the Manual of Patent Examining Procedure and 35 USC 122, which of the following statements is not true?',
    options: [
      'All requests for reexamination and related patent files are available to the public subject tot he availability of the reexamination file.',
      'The Board of Patent Appeals and Interferences handles all petitions for access to applications involved in an interference.',
      'An abandoned application referenced in a U.S. patent application publication, U.S. patent or a U.S. application that is open to public inspection may be ordered for inspection by any member of the public.',
      'The assignee of record of a part interest in an application may always intervene in the prosecution of the application, appointing a registered attorney or agent of his or her own choice, without participation by any or all other assignees.',
      'All provisional patent applications are screened upon receipt in the USPTO for subject matter that, if disclosed, might impact the national security, and such applications are referred to appropriate agencies for consideration of restrictions on disclosure of the subject matter.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best choice is (D). Choices (A), (B), (C) and (E) are each TRUE statements. See MPEP Chapter 100 (at pp. 100-13, 100-12, 100-8 and 100-18, respectively). Choice (D) is NOT TRUE because only the assignee of record of the ENTIRE interest in an application may intervene in the prosecution of the application, appointing an attorney or agent of his or her own choice. MPEP at p. 100-16. An assignee of record of a part interest is, however, entitled to inspect the application.',
  },
  {
    id: 'uspto-oct02-pm-46',
    topicId: 3,
    subtopic: 'Protests — must be filed before publication or notice of allowance, whichever is earlier',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following statements does not accord with proper USPTO practice and procedure?',
    options: [
      'A protest may be filed by an attorney or other representative on behalf of an unnamed principal.',
      'Information which may be relied on in a protest includes information indicating violation of the duty of disclosure under 37 CFR 1.56.',
      'While a protest must be complete and contain a copy of every document relied on by the protestor, a protest without copies of prior art documents will not necessarily be ignored.',
      'A protest must be submitted prior to the date the application was published or the mailing of a notice of allowance, whichever occurs later, provided the application is pending.',
      'Since a protestor is not authorized to participate in the prosecution of a pending application, the examiner must not communicate in any manner with the protestor.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the best answer. MPEP § 1901.04 — a protest must be submitted prior to the date the application was published or the mailing of a notice of allowance, whichever occurs FIRST, not later. (A) is a true statement. MPEP § 1901.01. (B) is a true statement. MPEP § 1901.02, paragraph (G). (C) is a true statement. MPEP § 1901.03. (E) is a true statement. MPEP § 1907.',
  },
  {
    id: 'uspto-oct02-pm-47',
    topicId: 2,
    subtopic: 'Certified copies of assignment records — § 1.19(b)(5) fee',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A registered practitioner’s client, Apex Mfg. Corporation, bought the entire assets of Pinnacle Mfg. Corporation. Pinnacle gave Apex a list of its patent applications but did not maintain records of the patent assignments. Apex wishes to know which of the assignment documents, if any, of the pending patent applications in Pinnacle’s patent portfolio were never recorded. In accordance with the MPEP, which of the following actions could the practitioner rely upon to most expeditiously answer this question?',
    options: [
      'Request certified copies of the patent applications as filed.',
      'Request certified copies of the assignment documents of record of the patent applications.',
      'Request certified copies of the patent applications as filed accompanied by the fees set forth in 37 CFR 1.19(b)(1)(i).',
      'Request certified copies of the patent applications as filed accompanied by the fees set forth in 37 CFR 1.19(b)(1)(ii).',
      'Request certified copies of the assignment documents of record of the patent applications accompanied by the fees set forth in 37 CFR 1.19(b)(5).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct and (A), (B), (C) and (D) are incorrect. As MPEP § 303 states: “Certified copies of patent applications as filed do not include an indication of assignment documents. Applicants desiring an indication of assignment documents of record should request separately certified copies of assignment documents and submit the fees required by 37 C.F.R. § 1.19.” (B) is incorrect because the fee required by 37 C.F.R. § 1.19(b)(5) has not been paid for the requested certified copy of assignment records.',
  },
  {
    id: 'uspto-oct02-pm-48',
    topicId: 2,
    subtopic: 'Power of attorney naming only a law firm will not be recognized',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with the MPEP and USPTO rules and procedure, a registered attorney or agent may be appointed to prosecute a patent application for an applicant. In which of the following situations will the USPTO not recognize the appointment of an attorney or agent to prosecute a patent application for an applicant?',
    options: [
      'The principal agent of record appoints a registered associate attorney to prosecute the application.',
      'The applicant executes a power of attorney naming only a law firm to prosecute the application.',
      'The applicant executes a power of attorney appointing more than one registered individual to prosecute the application.',
      'The principal attorney of record appoints an associate registered agent to prosecute the application.',
      'The assignee of the entire interest of record, who has established the right to prosecute the patent application, executes a power of attorney appointing a registered attorney to prosecute the patent application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (B) is the correct answer. MPEP § 402; 37 C.F.R. § 1.34. MPEP § 402 states that “Powers of attorney or authorizations of agent naming firms of attorneys or agents filed in patent applications will not be recognized.” (A) and (D) are each incorrect because according to 37 C.F.R. § 1.34(b), “A principal registered attorney or agent, so appointed, may appoint an associate registered attorney or agent who shall also then be of record.” (C) is incorrect — powers of attorney naming one or more registered individuals, or all registered practitioners associated with a Customer Number, may be made. MPEP §§ 402, 403. (E) is incorrect because, as set forth in MPEP § 402.07, a power of attorney by the assignee of the entire interest revokes all powers given by the applicant and prior assignees if the assignee establishes the right to take action under 37 C.F.R. § 3.73(b).',
  },
  {
    id: 'uspto-oct02-pm-49',
    topicId: 0,
    subtopic: '§ 102(d) bar — foreign patent granted before U.S. filing on an application filed over a year earlier',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Roberto files a U.S. patent application fourteen months after he perfects an invention in Europe. Which of the following would establish a statutory bar against the granting of a U.S. patent to Roberto?',
    options: [
      'A foreign patent issued to Roberto 11 months prior to the filing date of Roberto’s U.S. patent application. The foreign patent was granted on an application that was filed 23 months prior to the effective filing date of Roberto’s U.S. patent application. The foreign patent application and the U.S. patent application claim the same invention.',
      'The invention was described in a printed publication in the United States, 11 months prior to the filing date of the U.S. patent application.',
      'The invention was in public use in the United States, less than one year prior to the filing date of the U.S. patent application.',
      'The invention was on sale in a foreign (NAFTA member) country, more than one year prior to the filing date of the U.S. patent application.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 102(d); MPEP §§ 706.02(c) and (e). The foreign patent establishes a bar under § 102(d): it issued before the U.S. filing date on a foreign application filed more than twelve months before the U.S. application, and both claim the same invention. (B) is incorrect because the invention was not described in a printed publication more than one year prior to the U.S. filing date. 35 U.S.C. § 102(b). (C) is incorrect because the public use was not more than one year prior to the U.S. filing date. MPEP § 2133. (D) is incorrect because the sale was not in the United States. 35 U.S.C. § 102(b); MPEP §§ 706.02(c) and 2133.03(d). (E) is incorrect because (A) is correct. [Pre-AIA] — § 102(d) was repealed by the AIA, and the § 102(b) geographic limits do not survive.',
  },
  {
    id: 'uspto-oct02-pm-50',
    topicId: 0,
    subtopic: 'Combinability alone does not make a combination obvious — desirability must be shown',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] An applicant’s claim stands rejected under 35 USC 103 as being obvious over Larry in view of Morris. Larry and Morris are references published more than one year before applicant’s effective filing. Although the examiner cites no suggestion or motivation for combining the references, they are, in fact, combinable. Which of the following arguments could properly show that the claim is not obvious?',
    options: [
      'The inventions disclosed by Larry and Morris cannot be physically combined.',
      'Neither Larry nor Morris provides an express suggestion to combine the references.',
      'As recognized by businessmen, the high cost of Larry’s device teaches away from combining it with the simpler device of Morris.',
      'Absent a suggestion or motivation, the examiner has not shown that combining Larry’s with Morris’s device would have been within the level of ordinary skill of the art.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. “The mere fact that references can be combined or modified does not render the resultant combination obvious unless the prior art also suggests the desirability of the combination.” MPEP § 2143.01 (citing In re Mills, 916 F.2d 680, 16 USPQ2d 1430 (Fed. Cir. 1990)). Here, the examiner fails to show that the combination would have been desirable. (A) is incorrect — the test of obviousness is not whether the features of the references are physically combinable. In re Keller, 642 F.2d 413, 208 USPQ 871 (CCPA 1981); In re Sneed, 710 F.2d 1544, 218 USPQ 385 (Fed. Cir. 1983). (B) is incorrect — the rationale to modify or combine does not have to be expressly stated in the prior art; it may be implied or reasoned from knowledge generally available to one of ordinary skill. MPEP § 2144 (citing In re Fine, 837 F.2d 1071, 5 USPQ2d 1596 (Fed. Cir. 1988); In re Jones, 958 F.2d 347, 21 USPQ2d 1941 (Fed. Cir. 1992)). (C) is incorrect — “The fact that a combination would not be made by businessmen for economic reasons does not mean that a person of ordinary skill in the art would not make the combination because of some technological incompatibility.” MPEP § 2145 (citing In re Farrenkopf, 713 F.2d 714, 219 USPQ 1 (Fed. Cir. 1983)).',
  },
];

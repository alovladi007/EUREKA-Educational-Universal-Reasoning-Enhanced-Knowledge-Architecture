/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, April 17, 2002 — Afternoon Session
 * (Test Number 456, Series 102), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (edo0204pq.pdf / edo0204pa.pdf,
 * via the Internet Archive copy of uspto.gov). US Government works — public
 * domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the Oct 2003,
 * Apr 2003 and Apr 2002 AM files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper — e.g. "Missle", "USTPO" — are preserved).
 *  - Option ORDER is the official exam order — never shuffled (several
 *    options reference other options by letter, and official exams are
 *    already key-balanced).
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Question 41 of this session was officially discarded by the USPTO
 *    ("All answers accepted") and is excluded.
 *  - ERA NOTE: this exam predates the AIA (2011-2013) and much of modern
 *    practice. Questions that turn on pre-AIA 35 U.S.C. 102/103 rules carry
 *    an explicit [Pre-AIA] tag in the explanation. Questions built on
 *    since-superseded procedure (CPA practice, inter partes reexamination,
 *    the pre-2003 amendment format of 37 CFR 1.121, the pre-2004 Board rules
 *    of 37 CFR 1.19x) carry a [Historical practice] tag — the reasoning style
 *    remains instructive, but the specific rule has changed. Verified status:
 *    OFFICIAL (USPTO model answers).
 *
 * Ingested: PM session Q1–Q40 and Q42–Q50 (49 of 49 scoreable; Q41 excluded —
 * officially discarded, see above).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2002_PM_SOURCE =
  'USPTO Registration Examination, April 17, 2002 — Afternoon Session (official model answers; public domain)';

export const USPTO_APR2002_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr02-pm-01',
    topicId: 0,
    subtopic: 'Public Use Bar — Experimental Use (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Mr. Block, the inventor, files an application with the USPTO on January 2, 2001 containing a single claim for his invention: a new bouncing ball called “O.” As part of his duty of disclosure, he also files a copy of a written agreement that he and Mrs. Cone signed on January 2, 1998. The agreement states, in its entirety, that “Mr. Block will transfer my new bouncing ball ‘O’ to Mrs. Cone for experimental uses only to perfect the ball’s bounce. Mr. Block retains full control over the new bouncing ball ‘O.’” The primary examiner has no evidence that the ball was ever actually delivered to Cone. On June 2, 2001, Block receives an Office action dated June 4, 2001 from the primary examiner. The examiner has rejected Block’s claim only under 35 U.S.C. § 102(b). The examiner explains in the Office action that “the 1998 written agreement signed by Block and Cone proves that the new bouncing ball ‘O’ was in public use more than one year prior to the January 2, 2001 filing date of the application.” Block believes he is entitled to a patent for his new bouncing ball “O.” How should Block respond to the rejection of his claim?',
    options: [
      'Block should give up because the agreement is dated more than one year before the filing date of the application and that is enough to statutorily bar Block from getting a patent under 35 U.S.C. § 102(b).',
      'Block should respond by arguing that although the agreement was signed more than one year prior to the filing date of the application, it was never published and therefore cannot be relied upon as a “printed publication” under 35 U.S.C. § 102(b).',
      'Block should respond by presenting evidence by way of an oath or declaration of experimental use and arguing that any use of the ball by Cone would have been experimental use, not “public” use.',
      'Block should respond by arguing the agreement was signed by him, the same person who filed the application, which means that the invention was not “known or used by others in this country.”',
      'Block should respond by arguing that even though the agreement may suggest that the ball was in use more than one year prior to the filing of the application, it does not indicate that the ball was put on sale in this country.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 2133.03(e). The issue is whether the invention was in “public use” more than one year before filing, determined on the totality of the circumstances. In re Brigance, 792 F.2d 1103, 229 USPQ 988 (Fed. Cir. 1986). Here (1) even if Cone received the ball she was limited to experimental, not public, use, and (2) control of the ball remained with Block — so no public use occurred. (A) is wrong: a document dated more than a year before filing is not by itself a § 102(b) bar. (B) is wrong: the rejection is on “public use,” not “printed publication.” (D) is wrong: “known or used by others in this country” goes to § 102(a), not § 102(b). (E) is wrong: it assumes an “on sale” rejection. [Pre-AIA]',
  },
  {
    id: 'uspto-apr02-pm-02',
    topicId: 3,
    subtopic: 'RCE — When Prosecution Is Closed (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] For purposes of determining whether a request for continued examination is in accordance with proper USPTO rules and procedure, in which of the following situations will prosecution be considered closed?',
    options: [
      'The last Office action is a final rejection.',
      'The last Office action is an Office action under Ex Parte Quayle.',
      'A notice of allowance has issued following a reply to a first Office action.',
      'The application is under appeal.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 C.F.R. § 1.114 (effective August 16, 2000); “Request for Continued Examination Practice and Changes to Provisional Application Practice; Final Rule,” 65 FR 50092, 50097 (Aug. 16, 2000). (A) is a final action (§ 1.113); 65 FR 50097 states that prosecution is closed by “an action that otherwise closes prosecution in the application (e.g., an Office action under Ex Parte Quayle …).” (A), (B), (C) and (D) are each individually correct, so (E), being the most inclusive, is the most correct answer.',
  },
  {
    id: 'uspto-apr02-pm-03',
    topicId: 5,
    subtopic: 'Reissue — Filing and Amendment Requirements (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] When filing a reissue application in November 2001 for the purpose of expanding the scope of the original patent claims, which of the following would not be in accordance with the USPTO rules of practice and procedure?',
    options: [
      'The specification, including the claims, of the patent for which reissue is requested, must be furnished in the form of a copy of the printed patent, in double column format, each page on only one side of a single sheet of paper.',
      'Applicant’s intent to broaden the scope of the claims can be made known in a reissue application filed within 2 years of the patent grant date by presenting in the application when filed new or amended claims.',
      'Any amendments made to the original patent by physically incorporating the changes within the specification or by way of a preliminary amendment must comply with the revised amendment practice of 37 CFR 1.121(b) and (c) and include appropriate “clean” and “marked-up” versions of the paragraphs or claims being amended.',
      'Applicant’s intent to broaden the scope of the claims can be made in a reissue application filed within 2 years of the patent grant date by specifying in the reissue declaration as one of the errors on which the reissue is based is that applicant claimed less than he had a right to claim.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (C). 37 C.F.R. § 1.173 and MPEP § 1453 govern amendments in reissue applications, and § 1.121(h) refers reissue applicants to § 1.173 — not to the § 1.121(b)/(c) practice. (A) is consistent with § 1.173 and MPEP § 1411. (B) is consistent with In re Graff, 42 USPQ2d 1471, and MPEP § 1412.03. (D) is consistent with the two-year limit of 35 U.S.C. § 251 for broadening reissues, MPEP § 1414. (E) is incorrect because (C) is correct. [Historical practice — the “clean”/“marked-up” amendment format of former § 1.121 was superseded in 2003.]',
  },
  {
    id: 'uspto-apr02-pm-04',
    topicId: 0,
    subtopic: 'Rule 131 Affidavit — Conception and Diligence (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Assume that conception of applicant’s complex invention occurred prior to the date of the reference, but reduction to practice occurred after the date of the reference. Which of the following is sufficient to overcome the reference in accordance with proper USPTO practice and procedure?',
    options: [
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to allege that applicant or patent owner has been diligent.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference, and diligence from just prior to the effective date of the reference to actual reduction to practice. The presence of a lapse of time between the reduction to practice of an invention and the filing of an application thereon is not relevant.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference. Diligence need not be considered.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to show conception and reduction to practice in any country.',
      'In a 37 CFR 1.131 affidavit or declaration, it is always sufficient to prove actual reduction to practice for all mechanical inventions by showing plans for the construction of the claimed apparatus.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. See Ex parte Merz, 75 USPQ 296 (Bd. App. 1947) (a lapse of time between reduction to practice and filing is not relevant to a § 1.131(b) showing); MPEP § 715.07(a). (A) is wrong — applicant must show evidence of facts establishing diligence, not merely allege it. Ex parte Hunter, 1889 C.D. 218. (C) is wrong — once conception before the reference date is established, diligence must still be considered. Ex parte Kantor, 177 USPQ 455. (D) is wrong — § 1.131(a) permits establishing completion only in the U.S., a NAFTA country (on/after Dec. 8, 1993) or a WTO country (on/after Jan. 1, 1996); MPEP § 715.07(c). (E) is wrong — actual reduction to practice generally requires a showing the apparatus existed and worked; MPEP § 715.07. [Pre-AIA]',
  },
  {
    id: 'uspto-apr02-pm-05',
    topicId: 2,
    subtopic: 'Correction of Inventorship — 37 CFR 1.48 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Regarding correction of inventorship in a pending application, where no waiver is granted, which of the following is not required under USPTO practice and procedure?',
    options: [
      'In connection with filing an amendment to correct inventorship in a nonprovisional application, seeking the deletion of one of the four co-inventors, because, in light of the cancellation of three claims, that inventor’s invention is no longer being claimed, the submission of a statement from the person whose name is being deleted that there was no deceptive intent on his part in being named in the original application.',
      'In connection with filing an amendment to correct inventorship in a provisional application, seeking the deletion of one of the four co-inventors, the submission of a statement from the person whose name is being deleted that there was no deceptive intent on his part in being named in the original application.',
      'In connection with filing an amendment to correct inventorship by adding previously omitted inventors to a nonprovisional application that has been assigned, the submission of a written consent from the assignee.',
      'In connection with filing an amendment to correct inventorship by adding previously omitted inventors to a provisional application, the submission of a statement that the inventorship error occurred without deceptive intention on the part of the omitted inventors.',
      'In connection with filing an amendment to correct inventorship in a nonprovisional application involved in an interference, the submission of a motion under 37 CFR 1.634.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. See 37 C.F.R. § 1.48(b) — where the claims covering that inventor’s invention are cancelled, a statement regarding lack of deceptive intent is not required. (B) is incorrect; see § 1.48(e)(2). (C) is incorrect; see § 1.48(c)(5). (D) is incorrect; see § 1.48(d)(1). (E) is incorrect; see § 1.48(a), (b) & (c). [Historical practice — the AIA removed the “deceptive intention” requirements and § 1.48 was rewritten in 2012.]',
  },
  {
    id: 'uspto-apr02-pm-06',
    topicId: 0,
    subtopic: 'Rule 131 — Who May Sign the Declaration (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Patent practitioner files a patent application on behalf of inventors X, Y and Z. The patent application includes ten claims. X, Y and Z are joint inventors of the subject matter of claims 1-5. X and Y are joint inventor of the subject matter of claims 6-8. Y invented the subject matter of claim 9. Z is the inventor of the subject matter of claim 10. A patent examiner properly rejects independent claim 10 under 35 U.S.C. § 102(a) as anticipated by reference A, which is not a patent. In an attempt to overcome this rejection, a declaration that clearly antedates reference A is filed under 37 CFR 1.131. The declaration is signed by inventor Z, but not by X and Y. The declaration is:',
    options: [
      'improper because all named inventors of an application must sign a declaration filed under 37 CFR 1.131.',
      'improper because the patent practitioner did not sign the declaration.',
      'proper if it is shows that inventor Z is the sole inventor of the subject matter of claim 10.',
      'proper because 37 CFR 1.131 has no requirement on who must sign the declaration.',
      'proper because 37 CFR 1.131 only requires that the declaration be signed by an inventor named in the application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 715.04 (8th ed.), “WHO MAY MAKE AFFIDAVIT OR DECLARATION,” accepts an affidavit or declaration by less than all named inventors “where it is shown that less than all named inventors of an application invented the subject matter of the claim or claims under rejection.” 37 C.F.R. § 1.131(a) likewise refers to “the inventor of the subject matter of the rejected claim.” (A) is wrong because fewer than all inventors may sign on that showing. (B) is wrong — the declaration was properly signed. (D) is wrong — § 1.131(a) expressly provides who must sign. (E) is wrong — it must be the inventor of the subject matter of the rejected claim, not just any named inventor. [Pre-AIA]',
  },
  {
    id: 'uspto-apr02-pm-07',
    topicId: 2,
    subtopic: 'Provisional Conversion and Patent Term (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not in accordance with proper USPTO practice and procedure?',
    options: [
      'Conversion of a provisional application to a nonprovisional application will result in the term of any patent to issue from the application being measured from at least the filing date of the provisional application.',
      'Conversion of a provisional application to a nonprovisional application cannot adversely impact on the term of any patent to issue from the application.',
      'An applicant having filed a provisional application can avoid any adverse patent term impact resulting from converting the provisional application to a nonprovisional application by instead filing a nonprovisional application claiming the benefit of the provisional application under 35 U.S.C. § 119(e).',
      'An applicant filing a nonprovisional application claiming the benefit under 35 U.S.C. § 119(e) and 37 CFR 1.78 of an earlier provisional application, and not requesting conversion of the provisional to a nonprovisional application can avoid the fee required to convert a provisional application to a nonprovisional application, as well as an adverse patent term effect that would result from a conversion.',
      'The twelve month period of pendency of a provisional application extends to the next secular or business day which is not a Saturday, Sunday, or Federal holiday in the District of Columbia if the day that is twelve months after the filing date of the provisional application under 35 U.S.C. § 111(b) and 37 CFR 1.53(c) falls on a Saturday, Sunday, or a Federal holiday in the District of Columbia.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer — i.e., it is the statement NOT in accord with practice. Per “Request for Continued Examination Practice and Changes to Provisional Application Practice; Final Rule,” 65 F.R. 50092 (Aug. 16, 2000), the term of a nonprovisional resulting from conversion of a provisional under 35 U.S.C. § 111(b)(5) is measured from the original provisional filing date, so the provisional’s pendency is counted against the patent term — conversion CAN adversely affect term. (A), (C) and (D) accord with 37 C.F.R. § 1.53(c)(3) and are therefore not the answer. (E) is a correct statement under 35 U.S.C. § 119(e)(3).',
  },
  {
    id: 'uspto-apr02-pm-08',
    topicId: 2,
    subtopic: 'Small Entity Status — Which Fees Are Reduced (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A grant of small entity status entitles an applicant to which of the following?',
    options: [
      'Applicant can pay a fee to file an information disclosure statement pursuant to 37 CFR 1.97(c) that is less than the fee required to be paid by other than a small entity.',
      'Applicant can file a Continued Prosecution Application (“CPA”) using a certificate of mailing under 37 CFR 1.8 to obtain a U.S. filing date that is earlier than the actual USPTO receipt date of the CPA.',
      'Applicant can pay a fee to file a petition for revival of an unavoidably abandoned application under 35 U.S.C. § 111 that is less than the fee required to be paid by other than a small entity.',
      'After issuance of a non-final first action, but before the close of the prosecution in a patent application, applicant may properly file a Request for Continued Examination and pay a fee that is less than the fee required to be paid by other than a small entity.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 41(h); 37 C.F.R. §§ 1.17(l) and 1.27(b). (A) is incorrect because § 1.17(p) sets a single IDS fee with no small-entity reduction. (B) is incorrect — it is inconsistent with § 1.8(a)(2)(i)(A) (a CPA may not be filed by certificate of mailing). (D) is incorrect — it is inconsistent with § 1.114(a) because prosecution is not closed. (E) is incorrect because (C) is correct. [Historical practice — CPA practice for utility applications was eliminated in 2003.]',
  },
  {
    id: 'uspto-apr02-pm-09',
    topicId: 0,
    subtopic: 'Obviousness — Suggestion to Combine (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] An applicant’s claim stands rejected under 35 U.S.C. § 103 as being obvious over Larry in view of Morris. Larry and Morris are references published more than one year before applicant’s effective filing. Although the examiner cites no suggestion or motivation for combining the references, they are, in fact, combinable. Which of the following arguments could properly show that the claim is not obvious?',
    options: [
      'The inventions disclosed by Larry and Morris cannot be physically combined.',
      'Neither Larry nor Morris provides an express suggestion to combine the references.',
      'As recognized by businessmen, the high cost of Larry’s device teaches away from combining it with the simpler device of Morris.',
      'Absent a suggestion or motivation, the examiner has not shown that combining Larry’s with Morris’s device would have been within the level of ordinary skill of the art.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. “The mere fact that references can be combined or modified does not render the resultant combination obvious unless the prior art also suggests the desirability of the combination.” MPEP § 2143.01 (citing In re Mills, 916 F.2d 680). (A) is wrong — the test is not physical combinability. In re Keller, 642 F.2d 413. (B) is wrong — the rationale need not be expressly stated in the prior art; it may be implied or reasoned from ordinary skill. MPEP § 2144. (C) is wrong — “The fact that a combination would not be made by businessmen for economic reasons does not mean that a person of ordinary skill in the art would not make the combination.” MPEP § 2145 (citing In re Farrenkopf). [Pre-AIA — decided under the pre-KSR teaching-suggestion-motivation framework.]',
  },
  {
    id: 'uspto-apr02-pm-10',
    topicId: 5,
    subtopic: 'Maintenance Fees — Return of Payment (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A maintenance fee in the correct amount is received by the USPTO on February 8, 2001, prior to the due date. The maintenance fee payment includes identification of a U.S. patent number. In accordance with proper USPTO rules and procedure, in which of the following situations may the USPTO return the maintenance fee payment?',
    options: [
      'The maintenance fee payment is submitted by the patentee’s grandmother, without authorization by the patentee, and includes identification of the U.S. application number for patent.',
      'The maintenance fee payment is submitted by the attorney of record in the application, without authorization by the patentee, and includes identification of the U.S. application number for the patent.',
      'The maintenance fee payment is submitted by the attorney of record in the application, with authorization by the patentee, and does not include identification of the U.S. application number for the patent.',
      '(A) and (B).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 C.F.R. § 1.366(c) (effective Sept. 8, 2000); 65 FR 54604, 54649. Under § 1.366(a) any person or organization may pay maintenance fees on behalf of a patentee — authorization is not required. Section 1.366(c) provides that if the payment identifies only the patent number and not the application number, “the Office may apply the payment … or may return the payment.” Only in (C) does the USPTO have the option of returning the fee. (A) and (B) are each incorrect; (D) is incorrect because (A) and (B) are; (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr02-pm-11',
    topicId: 2,
    subtopic: 'Provisional Benefit and Reduction to Practice (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] While vacationing in Mexico on April 14, 2001, Henrietta invented a camera that operated at high temperature and is waterproof. She carefully documented her invention and filed a provisional application in the USPTO on April 30, 2001. She conducted tests in which the camera withstood temperatures of up to 350 degrees Fahrenheit. However, when the camera was placed in the water leaks were discovered rendering the camera inoperable. On April 12, 2002, Henrietta conceived of means that she rightfully believed will fix the leakage issue. Henrietta came to you and asked whether she can file another application. Henrietta desires to obtain the broadest patent protection available to her. Which of the following is the best manner in accordance with proper USPTO practice and procedure for obtaining the patent covering both aspects of her invention?',
    options: [
      'She can file a nonprovisional application on April 30, 2002 claiming benefit of the filing date of the provisional application, disclosing the means for fixing the leak and presenting a claim covering a camera that operates at high temperatures and a claim covering a camera that is waterproof, or presenting a claim covering a camera that both operates at high temperatures and is waterproof.',
      'Henrietta cannot rightfully claim a camera that is waterproof in a nonprovisional application filed on April 30, 2002, since she tested the camera and the camera developed leaks.',
      'Henrietta can file another provisional application on April 30, 2002 and obtain benefit of the filing of the provisional application filed on April 30, 2001.',
      'Henrietta may establish a date of April 14, 2001 for a reduction to practice of her invention for claims directed to the waterproofing feature.',
      'Henrietta should file a nonprovisional application on April 30, 2002 having claims directed only to a camera that withstands high temperatures since the camera that she tested developed leaks.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). As to (B) and (E), an actual reduction to practice is not a necessary requirement for filing an application so long as the specification enables one of ordinary skill in the art to make and use the invention. (D) is incorrect, as a reduction to practice may not be established since the camera leaked. As to (C), a second provisional is not entitled to the benefit of the filing date of the first provisional application. 35 U.S.C. § 111(b)(7).',
  },
  {
    id: 'uspto-apr02-pm-12',
    topicId: 0,
    subtopic: 'Obviousness — Unsatisfactory for Intended Purpose (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] An applicant’s claim stands rejected as being obvious under 35 U.S.C. § 103 over Lance in view of Barry. Lance and Barry are patents that issued and were published more than one year before applicant’s effective filing date. Which of the following arguments could properly overcome the rejection?',
    options: [
      'Barry’s device is too large to combine with Lance’s device.',
      'The Barry reference is nonanalogous art, because, although pertinent to the particular problem with which Lance was concerned, it relates to a different field of endeavor that the applicant’s invention.',
      'The combination of Lance and Barry would have precluded Lance’s device from performing as Lance intended.',
      'The Barry reference does not show all of the claimed elements arranged in the same manner as the elements are set forth in the claim.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. “If proposed modification would render the prior art invention being modified unsatisfactory for its intended purpose, then there is no suggestion or motivation to make the proposed modification.” MPEP § 2143.01 (citing In re Gordon, 733 F.2d 900). (A) is wrong — the test is not whether a secondary reference can be bodily incorporated, but what the combined teachings suggest. MPEP § 2145 (quoting In re Keller). (B) is wrong — art outside the field of endeavor is still analogous if reasonably pertinent to the problem the inventor faced. MPEP § 2141.01(a) (quoting In re Oetiker). (D) is wrong — it argues anticipation under § 102, not the § 103 rejection made. (E) is wrong because (A), (B) and (D) are incorrect. [Pre-AIA]',
  },
  {
    id: 'uspto-apr02-pm-13',
    topicId: 3,
    subtopic: 'Preliminary Amendments — Disapproval Factors (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is or are a factor that will be considered in disapproving a preliminary amendment in an application filed November 10, 2000?',
    options: [
      'The nature of any changes to the claims or specification that would result from entry of the preliminary amendment.',
      'The state of preparation of a first Office action as of the date of receipt of the preliminary amendment by the Office.',
      'The state of preparation of a first Office action as of the certificate of mailing date under 37 CFR 1.8, of the preliminary amendment.',
      'All of the above.',
      '(A) and (B).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 C.F.R. § 1.115(b)(1). As stated at 65 FR 54636: “Factors that will be considered in disapproving a preliminary amendment include: the state of preparation of a first Office action as of the date of receipt (§ 1.6, which does not include § 1.8 certificate of mailing dates) of the preliminary amendment by the Office …” Thus (C) — and therefore (D) — are incorrect.',
  },
  {
    id: 'uspto-apr02-pm-14',
    topicId: 3,
    subtopic: 'IDS Timing — 37 CFR 1.97(c) (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On November 7, 2000, registered practitioner Toby files in the USPTO a utility patent application having only one claim. The USPTO sends Toby a non-final Office action dated May 11, 2001 setting a three month shortened statutory period for reply, and properly rejecting the claim under 35 U.S.C. § 102(b). On June 1, 2001, Toby learns about a publication (“the Jones reference”). Toby determines that the Jones reference is material to patentability of the claim, but the publication has not been considered by the examiner during prosecution of the application. Toby prepares a complete reply (“complete reply”) to the Office action dated May 11, 2001, pursuant to 37 CFR 1.111 traversing the rejection. Toby also prepares an information disclosure statement (“IDS”) that complies with the provisions of 37 CFR 1.98, listing the Jones reference. In accordance with USPTO rules and procedure, which of the following actions, if taken by Toby, will result in the examiner considering the Jones reference during prosecution of the application?',
    options: [
      'On July 2, 2001, submitting to the USPTO a request for continued examination (“RCE”) and fee for an RCE, with the complete reply and the IDS, but with neither the fee set forth in 37 CFR 1.17(p) nor the statement required by 37 CFR 1.97(e).',
      'On October 12, 2001, submitting to the USPTO a request for continued examination (“RCE”) and fee for an RCE, with the complete reply and the IDS, but with neither the fee set forth in 37 CFR 1.17(p) nor the statement required by 37 CFR 1.97(e).',
      'On October 12, 2001, submitting to the USPTO the complete reply and the IDS, but with neither the fee set forth in 37 CFR 1.17(p) nor the statement required by 37 CFR 1.97(e).',
      'On July 2, 2001, submitting to the USPTO the complete reply and the IDS, and the fee set forth in 37 CFR 1.17(p), but without the statement required by 37 CFR 1.97(e).',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 C.F.R. § 1.97(c) — after the first Office action but before final action/allowance, the IDS is considered if accompanied by either the § 1.17(p) fee or the § 1.97(e) statement; (D) supplies the fee. (A) and (B) fail at least because the Office action is non-final so the RCE is improper (§ 1.114(b); MPEP § 706.07(h)) and the IDS still lacks the fee or statement. (C) fails because the IDS came after the first Office action without either the fee or the statement. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-apr02-pm-15',
    topicId: 3,
    subtopic: 'Non-Compliant Amendment — 37 CFR 1.121 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant files a preliminary amendment on Friday, March 2, 2001, in an application filed on November 6, 2000. In the preliminary amendment, applicant provides instructions to amend paragraph one of the specification to include a claim for priority to a previously filed U.S. patent application as required by 35 U.S.C. § 120. Applicant provides instructions to insert the priority claim in line one of paragraph one on page one of the specification. Applicant also directs that page 20 of the specification be replaced with a new page 20 supplied therewith and that claims 9 and 10 be cancelled. Upon receipt and review of the preliminary amendment in the Technology Center, wherein the application has been assigned, the designated USPTO Legal Instruments Examiner (LIE) mails applicant a Notice of Non-Compliant Amendment. Select from the following an answer that completes the following statement, such that the completed statement accords with proper USPTO practice and procedure: “Applicant has received the Notice of Non-Compliant Amendment ___________________”',
    options: [
      'in error because applicant’s preliminary amendment was filed in an application filed on November 6, 2000, which precedes the effective date, November 7, 2000, of the Patent Business Goals rules.',
      'due to applicant’s failure to amend the specification at page one (1) and page 20 by providing a clean version of the paragraph(s), with no underlining or bracketing, with an instruction to substitute it for the pending paragraph(s), and an accompanying marked-up version of the paragraph(s) with all changes, relative to the prior paragraph(s), being shown by any conventional comparison system as required by 37 CFR 1.121(b).',
      'due to applicant’s failure to provide a marked-up version of claims 9 and 10.',
      'due only to applicant’s failure to amend the specification at page 20 by providing a clean version of the paragraph(s), with no underlining or bracketing, with an instruction to substitute it for the pending paragraph, and an accompanying marked-up version of the paragraph(s) with all changes, relative to the prior paragraph(s), being shown by any conventional comparison system as required by 37 CFR 1.121(b).',
      'and now has a one month extendable time period in which to resubmit the preliminary amendment in compliance with revised 37 CFR 1.121. Extensions of time may be granted under 37 CFR 1.136.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 C.F.R. § 1.121(b); MPEP § 714 (8th ed.). (A) is wrong — “After March 1, 2001, all amendments to the specification including the claims must be made by replacement paragraph/section/claim in clean form,” regardless of the application’s filing date. (C) is wrong — § 1.121(c)(1): “A marked up version does not have to be supplied for any added or cancelled claims.” (D) is wrong — page one also had to be amended in the required format, and replacement pages are not accepted (65 Fed. Reg. 54639, Response to Comment 61). (E) is wrong — MPEP § 714.01(e) gives a one-month NON-extendable period. [Historical practice — this clean/marked-up format was superseded by the 2003 revision of § 1.121.]',
  },
  {
    id: 'uspto-apr02-pm-16',
    topicId: 1,
    subtopic: 'Product-by-Process and Improper Dependent Claims (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A patent application filed in the USPTO contains the following three original claims, including product by process Claim 3: Claim 1. A method for making an Ethernet cable comprising the steps of A, B and C. Claim 2. The method of claim 1, further characterized by the step of D. Claim 3. The Ethernet cable as in any one of the preceding claims. In the first Office action, the examiner objects to Claim 3 as being an improper dependent claim and requires cancellation of the claim. Following proper USPTO practices and procedures, which of the following replies best overcomes the examiner’s objection and provides the client with the broadest patent protection?',
    options: [
      'Amend Claim 3 to read: “The Ethernet cable as made by the process set forth in claims 1-2.”',
      'Cancel Claim 3. Add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.” Add Claim 5, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.”',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
      'Cancel Claim 3.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. Cancelling Claim 3 overcomes the objection, and adding Claims 4 and 5 secures product-by-process protection for the cable made by BOTH methods of manufacture — so if Claim 4 is invalid, Claim 5 may remain valid. (A) is incorrect because it is an improper multiple dependent claim. 35 U.S.C. § 112 ¶ 5; 37 C.F.R. § 1.75(c); MPEP § 608.01(n), part (I)(B)(1). (C) and (D) each leave the application without a claim to the cable made by the other process. (E) leaves the application without any product claim at all.',
  },
  {
    id: 'uspto-apr02-pm-17',
    topicId: 5,
    subtopic: 'Inter Partes vs. Ex Parte Reexamination Eligibility (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] It is a late spring day in 2001. Mr. Gordon bursts into your office. “I want you to get rid of my competitor’s patents,” shouts Mr. Gordon “They’re no good. Look at these references! But I’ve got to tell the USPTO what’s really going on.” The first patent, P1, issued on March 6, 2001, based on an application filed on November 29, 1999. The second patent, R2, is a reissue, filed on January 3, 2000, of a patent issued in 1995. The third patent, P3, issued on March 6, 2001, based on an application filed in 1994. Mr. Gordon wants to participate as much as possible in the proceedings at the USPTO. Which of the following options should be followed to accomplish Mr. Gordon’s objective?',
    options: [
      'File requests for inter partes reexaminations of P1, R2, and P3.',
      'File requests for ex parte reexaminations of P1 and P3, and a request for inter partes reexamination of R2.',
      'File requests for ex parte reexaminations of R2 and P3, and a request for inter partes reexamination of P1.',
      'File requests for ex parte reexamination of P1, R2, and P3.',
      'File requests for inter partes reexaminations of P1 and P3, and a request for ex parte reexamination of R2.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (C). Inter partes reexamination is available only for patents that issued from an ORIGINAL application filed on or after November 29, 1999. 37 C.F.R. § 1.913. An original application is any application other than a reissue application. MPEP § 201.04(a). So only P1 qualifies; R2 (a reissue) and P3 (1994 filing) must go the ex parte route. (A), (B) and (E) misapply the November 29, 1999 cutoff; (D) is not the most correct answer because ex parte reexamination of P1 would not let Mr. Gordon participate to the same extent. [Historical practice — inter partes reexamination was replaced by inter partes review in 2012.]',
  },
  {
    id: 'uspto-apr02-pm-18',
    topicId: 2,
    subtopic: 'Joint Inventorship — Who Executes the Oath (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Roger Rocket is a designer of paper cups at Paper America. During his free time, he likes to attend baseball games at Yankee Stadium. One day, while seated in the stands, he caught a fly ball. He took the baseball home and played catch with his friends Andy Cannon, Orlando Torpedo, and Mariano Missle. Unfortunately for Rocket, Cannon has a problem with accuracy. Cannon threw the ball over Rocket’s head and straight through a neighbor’s front window. The shattered glass ripped the lining off of the baseball. Instantly, Rocket conceived a more durable baseball with an exterior similar to that of a golf ball. Rocket worked for months on his invention in Missle’s garage. His new baseball was comprised of a titanium core, and a plastic shell having circular dimples and V-shaped laces. Torpedo realized and told Rocket that Y-shaped laces would enable baseball players to throw the ball faster. Cannon, an engineer in a radar gun laboratory, tested the velocity of the baseball with both V and Y-shaped laces. To Cannon’s surprise, the baseball traveled 10 M.P.H. faster with the Y-shaped laces. Rocket wanted patent protection for a baseball having a titanium core, and a plastic shell having circular dimples and Y-shaped laces, so he approached Yogi Practitioner for assistance. Rocket has no obligation, contractual or otherwise, to assign his inventions to Paper America. In accordance with proper USPTO practice and procedure, who should execute the oath?',
    options: ['Rocket', 'Rocket and Torpedo', 'Rocket and Cannon', 'Rocket, Torpedo, and Cannon', 'Rocket, Torpedo, Cannon, and Missle'],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 35 U.S.C. § 116 requires joint inventors to apply jointly and each make the required oath; 37 C.F.R. § 1.64(a) requires the oath to be made by all of the actual inventors. Rocket invented all the claimed elements except the Y-shaped laces, and Torpedo contributed the Y-shaped laces — so Rocket and Torpedo must execute the oath. (A) is incorrect because Rocket is not the sole inventor. (C), (D) and (E) are incorrect because neither Cannon (who merely tested) nor Missle (who merely provided the garage) contributed to any portion of the claimed subject matter.',
  },
  {
    id: 'uspto-apr02-pm-19',
    topicId: 2,
    subtopic: 'Oath by Legal Representative of a Deceased Inventor (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Before executing the oath, Rocket wanted to ask Practitioner a question. On his way to Practitioner’s office, Rocket was instantly killed when a drunk driver hit his car. The officers or employees of Paper America are not related to Rocket. Who can execute an oath on Rocket’s behalf?',
    options: [
      'The President of Paper America',
      'The CEO of Paper America',
      'Rocket’s manager at Paper America',
      'Rocket’s legal representative',
      'None of the above',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 C.F.R. § 1.42 provides that “[i]n case of the death of the inventor, the legal representative … of the deceased inventor may make the necessary oath.” (A), (B) and (C) are incorrect because the facts reveal no assignment to Paper America, and because the officers and employees are not related to Rocket they may not act as his legal representative.',
  },
  {
    id: 'uspto-apr02-pm-20',
    topicId: 2,
    subtopic: 'Express Mail Filing Date — 37 CFR 1.10 (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On October 12, 2001, Practitioner received all of the proper papers required to receive a filing date. However, due to an unexpected emergency, he had to fly out of the country that evening to conduct discovery in another matter. Practitioner knew that he would be out of the office for at least 4 weeks, so before leaving, he left a note instructing his assistant to file the Rocket application on October 13, 2001, using an Express Mailing label. His assistant did not see the note until 8:00 P.M. on Friday, October 19, 2001. On Monday, October 22, 2001, Rocket’s assistant deposited the Rocket application in the United States Postal Service with a proper Express Mailing label. The Postal Service properly completed a legible label showing an October 22, 2001 date in. The correspondence was received in the USPTO on October 27, 2001. What is the filing date of the Rocket application absent any Postal Service Emergency?',
    options: [
      'October 12, 2001',
      'October 13, 2001',
      'October 19, 2001',
      'October 22, 2001',
      'October 27, 2001',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 C.F.R. § 1.10 provides that correspondence delivered by the “Express Mail Post Office to Addressee” service “will be considered filed in the Office on the date of deposit … with the USPS.” Although the application could have been deposited as early as October 13, 2001, the facts show it was not actually deposited until October 22, 2001. MPEP § 573. (A), (B), (C) and (E) are incorrect because the application was not deposited with the USPS on any of those dates.',
  },
  {
    id: 'uspto-apr02-pm-21',
    topicId: 3,
    subtopic: 'New Matter — Petition vs. Appeal (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] As a new member of a law firm, you are assigned to continue the prosecution of a patent application that was prosecuted by Stewart, who recently joined another law firm. After reviewing the file, you note that Stewart’s reply to a first Office included two amendments: Amendment #1 introduced a change to the specification which did not affect the claims; Amendment #2 introduced a change to the specification, which change was also introduced to all of the claims currently in the application. You also note that the examiner in a current Office action has taken the position that both amendments constituted new matter, required cancellation of the new matter, and rejected all the claims on the ground that they recited elements without support in the original disclosure under 35 U.S.C. § 112, first paragraph. For the purpose of reviewing the examiner’s requirement, which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'Both Amendment #1 and Amendment #2 give rise to appealable questions.',
      'Review of the examiner’s requirement for cancellation of both Amendment #1 and Amendment #2 is by way of petition.',
      'Review of the examiner’s requirement for cancellation of Amendment #1 is by way of petition, and review of the examiner’s requirement for cancellation of Amendment #2 is by way of appeal.',
      'Review of the examiner’s requirement for cancellation of Amendment #1 is by way of appeal, and review of the examiner’s requirement for cancellation of Amendment #2 is by way of petition.',
      'Both Amendment #1 and Amendment #2 give rise to questions which may be reviewed either by petition or on appeal.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 608.04(c): “Where the new matter is confined to amendments to the specification, review of the examiner’s requirement for cancellation is by way of petition. But where the alleged new matter is introduced into or affects the claims, thus necessitating their rejection on this ground, the question becomes an appealable one.” See also MPEP § 706.03(o).',
  },
  {
    id: 'uspto-apr02-pm-22',
    topicId: 5,
    subtopic: 'Reissue — Broadening and the Orita Doctrine (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Patentee, Iam Smarter, filed and prosecuted his own nonprovisional patent application on November 29, 1999, and received a patent for his novel cellular phone on June 5, 2001. He was very eager to market his invention and spent the summer meeting with potential licensees of his cellular phone patent. Throughout the summer of 2001, all of the potential licensees expressed concern that the claim coverage that Smarter obtained in his cellular phone patent was not broad enough to corner the market on this technology, and therefore indicated to him that they feel it was not lucrative enough to meet their financial aspirations. By the end of the summer, Smarter is discouraged. On September 5, 2001, Smarter consults with you to find out if there is anything he can do at this point to improve his ability to market his invention. At your consultation with Smarter, you learn the foregoing, and that in his original patent application, Smarter had a number of claims that were subjected to a restriction requirement, but were nonelected and withdrawn from further consideration. You also learn that Smarter has no currently pending application, that the specification discloses Smart’s invention more broadly than he ever claimed, and that the claims, in fact, are narrower than the supporting disclosure in the specification. Which of the following will be the best recommendation in accordance with proper USTPO practice and procedure?',
    options: [
      'Smarter should immediately file a divisional application under 37 CFR 1.53(b) including the nonelected claims that were subjected to a restriction requirement in the nonprovisional application that issued as the patent.',
      'Smarter should file a reissue application under 35 U.S.C. § 251, including the nonelected claims that were subjected to the restriction requirement in the nonprovisional application that issued as the patent.',
      'Smarter should file a reissue application under 35 U.S.C. § 251, broadening the scope of the claims of the issued patent, and then file a divisional reissue application presenting only the nonelected claims that were subjected to a restriction requirement in the nonprovisional application which issued as the patent.',
      'Smarter should simultaneously file two separate reissue applications under 35 U.S.C. § 251, one including broadening amendments of the claims in the original patent, and one including the nonelected claims that were subjected to a restriction requirement in the nonprovisional application which issued as the patent.',
      'Smarter should file a reissue application under 35 U.S.C. § 251 on or before June 5, 2003, broadening the scope of the claims of the issued patent.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 35 U.S.C. § 251 permits Smarter to broaden the claimed subject matter within two years of grant (June 5, 2003). (A) is incorrect — there must be copendency between a divisional and the original application. 35 U.S.C. § 120. (B), (C) and (D) are each incorrect because an applicant’s failure to timely file a divisional application while the original application was still pending is not an error correctable by reissue. In re Orita, 550 F.2d 1277, 193 USPQ 145 (CCPA 1977); MPEP § 1402.',
  },
  {
    id: 'uspto-apr02-pm-23',
    topicId: 2,
    subtopic: 'Express Mail vs. Ordinary Mail — Filing Dates (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On September 12, 2001, Jill and Jack invent a new electrically charged brush that removes lint from black wool sweaters and coats. Jill and Jack draft a nonprovisional application and send it to the USPTO and the mailing envelope is postmarked September 13, 2001. They fail to use Express Mail and their application becomes delayed in the mail for over a month. The USPTO finally receives the Jill and Jack application on December 3, 2001. On September 14, 2001, Mike and Millie invent a new electrically charged brush that removes lint from black wool sweaters and coats. Mike and Millie had no knowledge of Jill and Jack and/or their invention on September 14, 2001. Mike and Millie draft a nonprovisional application and send it to the USPTO on September 15, 2001, using U.S. Postal Service Express Mail and include the Express Mail label number on the cover sheet of their application. The mailing envelope received by the U.S. Postal Service and the date-in is clearly marked on the Express Mail label as September 15, 2001. The application of Mike and Millie becomes delayed in the mail for two months. The USPTO receives the Mike and Millie application on December 5, 2001. Assume the inventions of Jill and Jack, and of Mike and Millie are the same. Also assume that no Postal Service Emergency was involved in the delivery of the mail. Which of the following is true?',
    options: [
      'The nonprovisional application of Mike and Millie will be accorded a filing date of September 15, 2001 upon receipt in the USPTO, and their filing date will be prior to that of Jill and Jack’s application.',
      'Since the time the application was lost in the mail was unforeseeable, Jill and Jack will be entitled upon petition the USPTO to the benefit of a filing date as of the time they mailed their application on September 13, 2001.',
      'Since Jill and Jack were the first inventors, unless Jill and Jack draft their claims so as to read directly on or substantially for the same invention as Mike and Millie claim, both applications would issue as patents since the United States has a first to invent patent system.',
      'The application for the invention of Jill and Jack will be accorded a September 13, 2001 filing date in the USPTO, since the postmark or date placed on the envelope by the U.S. Postal Service is the determinative date for the purposes of according a filing date.',
      'Since the application of Mike and Millie sent by Express Mail was not received until December 5, 2001, Mike and Millie will need to certify that they mailed their application on September 15, 2001, before the USPTO will accord them a filing date of September 15, 2001.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). Under 37 C.F.R. § 1.10(a), correspondence delivered by “Express Mail Post Office to Addressee” service “will be considered filed in the [USPTO] on the date of deposit with the USPS,” shown by the “date-in” on the mailing label. As to (B), (C) and (D), no such procedures are available. (C) is also wrong because if Mike and Millie’s claims read on Jill and Jack’s invention an interference would be declared and only one application would issue. As to (E), § 1.10(a) requires no such certification. [Pre-AIA — decided under the first-to-invent system.]',
  },
  {
    id: 'uspto-apr02-pm-24',
    topicId: 0,
    subtopic: 'CIP — Effective Filing Date of Claims (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] In 1995 Patent Agent filed a U.S. patent application containing five claims (Application 1). All five claims are fully supported under 35 U.S.C. § 112 by the disclosure of Application 1. In 2000, Patent Agent filed a U.S. patent application (Application 2) that was a continuation-in-part of Application 1. Application 2 adds new subject matter to the disclosure of Application 1, and ten additional claims. Of the fifteen claims in Application 2, claims 1-5 are exactly the same as Application 1, claims 6-10 are fully supported under 35 U.S.C. § 112 by the disclosure of Application 1, and claims 11-15 are fully supported under 35 U.S.C. § 112 only by the newly added subject matter of Application 2. The effective filing date for claims in Application 2 is:',
    options: [
      '1-15 is 2000.',
      '1-15 is 1995.',
      '1-10 is 1995.',
      '11-15 is 2000.',
      '(C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 706.02 (8th ed.), “DETERMINING THE EFFECTIVE FILING DATE OF THE APPLICATION”: in a continuation-in-part, claims not supported by the parent have an effective filing date equal to the new application’s filing date, while claims fully supported under § 112 by the parent take the parent’s filing date. So claims 1-10 are effective as of 1995 and claims 11-15 as of 2000. (A) and (B) fail to account for the two different effective filing dates; (C) and (D) are each individually correct, making (E) the most correct answer.',
  },
  {
    id: 'uspto-apr02-pm-25',
    topicId: 3,
    subtopic: 'RCE — When It Is Available (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] In which of the following instances is the filing of a request for continued examination (RCE) of an application, together with a submission and payment of the appropriate fee, in accordance with proper USPTO practice and procedure?',
    options: [
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, in a nonprovisional utility application having a filing date in July 1998. A Notice of Appeal to the Board of Patent Appeals and Interferences had been filed in November 2000, and as of April 17th the appeal is awaiting a decision.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, in a nonprovisional utility application having a filing date in July 1996. A Notice of Appeal to the United States Court of Appeals for the Federal Circuit was properly filed in January 2001, and the appeal has not terminated as of April 17th.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, in a nonprovisional utility application having a filing date in July 1999. The issue fee was filed in the Office on Friday, January 19, 2001, but a petition and fee to withdraw the application has not been filed.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, for a nonprovisional utility application having a filing date in July 1996. On Monday, April 2, 2001, Applicant withdrew a Notice of Appeal to the United States Court of Appeals for the Federal Circuit. There were no allowed claims in the application, and the Court’s dismissal of the appeal did not indicate any further action to be taken by the Office.',
      'The RCE, including an amendment to the written description, is filed on April 17, 2001, for a provisional utility application having a filing date in July 2000.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.114(a) and (d). Filing an RCE with a submission after a Notice of Appeal to the Board but before decision is treated as a request to withdraw the appeal and reopen prosecution; the submission may be an amendment to the written description (§ 1.114(c)). (B) and (D) are wrong — § 1.114 is unavailable after a Notice of Appeal to the Federal Circuit unless the appeal is terminated and the application is still pending. (C) is wrong — after the issue fee is paid, an RCE without a § 1.313 petition to withdraw from issue “will not operate to avoid issuance.” (E) is wrong — § 1.114(e)(1) excludes provisional applications.',
  },
  {
    id: 'uspto-apr02-pm-26',
    topicId: 5,
    subtopic: 'Choosing Between Reissue and Reexamination (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Jack Flash filed an application for patent on December 16, 1998, disclosing and claiming self-extinguishing safety candles, methods of making them, and a special reflective housing for holding the burning candles. Following a three-way restriction, Mr. Flash prosecuted the claims for the candle, and was granted a patent (“P1”), which issued on April 6, 1999. Mr. Flash filed a divisional application containing claims for the method of making the candles and for the reflective housing on April 5, 1999. The examiner did not restrict the claims, but before the first action on the merits was mailed, Mr. Flash suffered business reversals and canceled the claims to the reflective housing to reduce the cost of obtaining his patent. A patent on the method of making the candles (“P2”), issued on November 30, 1999. On April 1, 2001, Mr. Flash wants to “revive his patents.” He is also concerned about an article he tore out of the February 1986 issue of the trade publication Wicks and Sticks, that shows a drawing of a dissimilar candle that would nevertheless raise a question of patentability, with the caption “It’s just a dream: it can’t be made we’ve tried a thousand times, don’t bother.” He also has a video tape first sold by a local hobbyist at his store in October 1999, showing a process of candle making that may be within the scope of his process claims. Which of the following acts would be in accordance with proper USPTO practice and procedure?',
    options: [
      'File a broadening reissue application on P1, alleging error in failing to claim sufficiently broadly by not filing claims for the reflective housing.',
      'File a request for reexamination of P1 based on the Wicks and Sticks article.',
      'File a new, nonprovisional patent application claiming benefit of the filing date of parent application that issued as patent P2.',
      'File a request for reexamination of P2 in view of the video tape, intending to narrow the process claims to avoid the video tape if the USPTO finds a significant new question of patentability, and seeking to add claims to the reflective housing.',
      'File a broadening reissue of P2, alleging error in claiming the process too broadly, because it covers the process disclosed on the video tape, and alleging further error in claiming less than the inventor had a right to claim, by not claiming the reflective housing.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (B), because under the facts the Wicks and Sticks article “shows a drawing of a dissimilar candle that would nevertheless raise a question of patentability” — although perhaps not anticipatory, a published article can raise a substantial new question of patentability under 37 C.F.R. § 1.515. (A) is incorrect: it is not error to fail to claim restricted, nonelected inventions. In re Orita, 550 F.2d 1277; MPEP § 1450. (C) is not the best answer — there is no copendency with the parent of P2. 35 U.S.C. § 120. (D) is incorrect — broadened claims may not be filed in a reexamination. (E) is not the best answer because it is not clear there is an “error” under 35 U.S.C. § 251 as to the reflective-housing claims. MPEP §§ 1402, 1450.',
  },
  {
    id: 'uspto-apr02-pm-27',
    topicId: 2,
    subtopic: 'Declaration Requirements — 37 CFR 1.63(a) and (b) (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Judy Practitioner is preparing the declaration form (PTO/SB/01) for her clients, inventors A and B, to sign prior to filing their utility patent application. Inventor A lives in California, and inventor B lives in Germany. Prior to sending declaration forms to the inventors, only inventor A had reviewed the final version of the application. Which of the following situations below would result in the declaration form(s) being compliant with 37 CFR 1.63(a) and (b)?',
    options: [
      'Judy mailed only a copy of the declaration form (PTO/SB/01), which identified the application and both inventors by their full names and citizenships, to inventor A with the instruction to return to her after he signs the declaration form. After inventor A returned the form, Judy then proceeded to mail out the declaration form to inventor B. After inventor B signed the declaration, Judy then attached the declaration, signed by both inventors, to the application and filed it with the USPTO.',
      'Judy mailed to inventor A only a copy of the declaration form (PTO/SB/01) which identified the application and only inventor A’s full name and citizenship. At the same time, Judy sent by facsimile to inventor B only a copy of the declaration form, which identified the application and only inventor B’s full name and citizenship. Judy then attached both signed declaration forms to the patent application and filed it with the USPTO.',
      'Judy sent by facsimile (e.g. fax) to inventor A only a copy of the declaration form (PTO/SB/01) which identified the application and both inventors by their full names and citizenships. At the same time, Judy mailed to inventor B a copy of the application and a copy of the declaration form, which identified the application and both inventors by their full name and citizenship. Judy then attached both signed declaration forms to the patent application and filed it with the USPTO.',
      'Judy mailed only a copy of the declaration form (PTO/SB/01), which identified the application and both inventors by their full names and citizenships, to inventor A. Judy then attached the declaration, signed only by inventor A, to the application and filed it with the USPTO.',
      'Judy files a petition under 37 CFR 1.48 just stating that inventor B’s signature could not be obtained at this time, and files a copy of the declaration form (PTO/SB/01), which identified the application and both inventors by their full names and citizenships, signed by only inventor A.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (C) because (1) the declaration identified the application and the full name and citizenship of both inventors and (2) a copy of the application was sent to inventor B to review and understand. (A) is incorrect because inventor B never reviewed and understood the application before signing. (B) is incorrect because each declaration form failed to identify all the inventors and no copy of the application went to inventor B. (D) is incorrect because inventor B never signed. (E) is incorrect because petitions for nonsigning inventors are filed under 37 C.F.R. § 1.47, not § 1.48 — and even under § 1.47 a bare statement that B’s signature could not be obtained is insufficient.',
  },
  {
    id: 'uspto-apr02-pm-28',
    topicId: 3,
    subtopic: 'RCE — What Counts as a Submission (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] In accordance with proper USPTO practice and procedure, a submission for a request for continued examination does not include:',
    options: [
      'An appeal brief or reply brief (or related papers).',
      'New arguments in support of patentability.',
      'New evidence in support of patentability.',
      'An amendment of the drawings.',
      'An amendment of the claims.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.114(d), last sentence. (B), (C), (D) and (E) are each recognized as a “submission” within the scope of 37 C.F.R. § 1.114(c).',
  },
  {
    id: 'uspto-apr02-pm-29',
    topicId: 3,
    subtopic: 'Public Access to a Redacted Published Application (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On June 1, 2001, a redacted copy of a pending patent application is filed by the inventor, I. M. Abridged and is published pursuant to 35 U.S.C. § 122(b). J. Q. Practitioner has reason to believe that the application is still pending. J. Q. Practitioner is not an attorney or agent for I. M. Abridged. J. Q. Practitioner is entitled to see or obtain copies of which, if any, portions of the Abridged application?',
    options: [
      'J.Q. Practitioner may order only the redacted printed publication document since pending patent applications are otherwise preserved in confidence.',
      'J.Q. Practitioner may order a copy of the redacted printed publication document, and inspect, but not copy, the file.',
      'J.Q. Practitioner may inspect the contents of the entire patent application file and obtain copies thereof in addition to obtaining copies of the redacted application publication.',
      'J.Q. Practitioner may inspect and obtain copies of only the redacted application and no other documents unless applicant I. M. Abridged supplied them in a redacted form.',
      'J.Q. Practitioner may obtain a copy of the entire application and the file contents if applicant I. M. Abridged failed to submit redacted copies of those documents forming the subsequent prosecution history; otherwise, J.Q. Practitioner may obtain a copy of the redacted application including the redacted contents of the file.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The model answer is choice (E). 37 C.F.R. §§ 1.217(d), 1.14(c)(2), and MPEP § 103, “Published U.S. Patent Applications.” While a published application is still pending the file itself is not available for inspection, but copies may be ordered; where a redacted copy was published, copies of the redacted application and redacted materials are provided under § 1.217(d). (A) is incorrect because at least the redacted portion of any subsequent prosecution history can be ordered. (B), (C) and (D) are incorrect because inspection of the file of a pending published application is not permitted — only copies may be ordered. MPEP § 103.',
  },
  {
    id: 'uspto-apr02-pm-30',
    topicId: 1,
    subtopic: 'Specification Contents — What Is Permitted (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Regarding the specification of a nonprovisional patent application, which of the following practices is in accordance with proper USPTO practice and procedure?',
    options: [
      'The specification may include tables and chemical formulas.',
      'The specification must begin with one or more claims.',
      'The specification may include hyperlinks or other forms of browser-executable code embedded in the text.',
      'The specification may include graphical illustrations or flowcharts.',
      'The specification may include a reservation for a future application of subject matter disclosed but not claimed in the application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 608.01, “Illustrations In the Specification”; 37 C.F.R. § 1.58(a) permits tables and chemical formulas in the specification in lieu of formal drawings. (B) is incorrect — under § 1.75(a) the specification must CONCLUDE with one or more claims. (C) is incorrect — USPTO policy does not permit embedded hyperlinks or browser-executable code. (D) is incorrect — graphical illustrations, diagrammatic views, flowcharts and diagrams in the descriptive portion do not come within § 1.58(a); the examiner should object and require formal drawings under § 1.81. (E) is incorrect — § 1.79 does not permit a reservation for a future application.',
  },
  {
    id: 'uspto-apr02-pm-31',
    topicId: 2,
    subtopic: 'Avoiding Pre-Grant Publication (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant Smith filed a nonprovisional utility application on January 2, 2001 claiming the benefit of a prior provisional application filed January 3, 2000. He received a filing receipt with a projected publication date of July 5, 2001. He did not want his application to be published under the provisions of eighteen-month publication. On April 2, 2001, Applicant Smith asked you what is the best way to avoid pre-grant publication of his application with respect to proper USPTO procedure. Which of the following represents the best advice to Applicant Smith without forfeiting his patent rights if you are representing him?',
    options: [
      'File a nonpublication request that certifies that the invention disclosed in the nonprovisional application has not been and will not be the subject of an application filed in another country (or under international agreement) that requires eighteen-month publication.',
      'File a petition to convert the nonprovisional application to a provisional application under 37 CFR 1.53(c)(2) accompanied by the petition fee, and then file a second non-provisional application with a nonpublication request that includes a proper certification, claiming the benefit of the prior provisional application under 35 U.S.C. § 119(e).',
      'File a petition for express abandonment to avoid publication under 37 CFR 1.138(c) accompanied by the petition fee.',
      'File (1) a continued prosecution application under 37 CFR 1.53(d) claiming the benefit of the prior applications under 35 U.S.C. §§ 119(e) and 120 with a nonpublication request that includes a proper certification, (2) a petition for express abandonment to avoid publication under 37 CFR 1.138(c) for the application filed on January 2, 2001, and (3) the required fees.',
      'File (1) a continuing application under 37 CFR 1.53(b) claiming the benefit of the prior applications under 35 U.S.C. §§ 119(e) and 120 with a nonpublication request that includes a proper certification, (2) a petition for express abandonment to avoid publication under 37 CFR 1.138(c) for the application filed on January 2, 2001, and (3) the required fees.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). The continuing application will not be published and will have an effective filing date of January 3, 2000. (A) is incorrect because a nonpublication request under 35 U.S.C. § 122(b)(2)(B)(i) must be made UPON FILING. (B) is incorrect because a provisional resulting from conversion cannot claim benefit of the earlier provisional. 37 C.F.R. § 1.53(c)(4). (C) is incorrect because the application would be abandoned and the provisional benefit lost. (D) is incorrect because the January 2, 2001 nonprovisional is not eligible for CPA practice. MPEP § 706.07(h). [Historical practice — CPA practice for utility applications ended in 2003.]',
  },
  {
    id: 'uspto-apr02-pm-32',
    topicId: 3,
    subtopic: 'Requesting an Oral Hearing Before the Board (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On behalf of your client you have appealed to the Board of Patent Appeals and Interferences a final rejection of claims in the client’s patent application. To request an oral hearing for the appeal, you must in a timely manner:',
    options: [
      'show that the hearing is necessary and desirable for a proper presentation of the appeal.',
      'telephone the Board to schedule the hearing and pay the appropriate fee.',
      'visit the Board to schedule the hearing and pay the appropriate fee.',
      'confer with the examiner for a date, file a written request, and pay the appropriate fee.',
      'file a written request and pay the appropriate fee.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 C.F.R. § 1.194(b): “If appellant desires an oral hearing, appellant must file, in a separate paper, a written request for such hearing accompanied by the fee set forth in § 1.17(d) within two months from the date of the examiner’s answer.” (A) through (D) are not required by § 1.194. Further, communications with the Office are to be conducted in writing. 37 C.F.R. § 1.4(d). [Historical practice — Board appeal rules moved to 37 CFR Part 41 in 2004; the oral-hearing request is now § 41.47.]',
  },
  {
    id: 'uspto-apr02-pm-33',
    topicId: 0,
    subtopic: 'On-Sale Bar Despite Misappropriation (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] In early 1999, at the request of MC Motors, Eve demonstrated her reverse automobile heating system at a testing facility in Germany. MC Motors signs a confidentiality agreement and agrees not to disclose the invention to anyone. The test is conducted in a secluded area and the persons involved are sworn to secrecy. Unbeknownst to Eve, MC Motors installs the reverse heating system on its MC cars and begins selling its cars with the reverse heating system in the United States in September 1999. In August 2000, MC files a patent application in the United States for the reverse automobile heating system. In December 2000, Eve files a patent application claiming the automobile heating system. The examiner rejects all the claims in Eve’s application based upon an MC Motors brochure advertising its cars in September 1999. Which of the following is true?',
    options: [
      'Eve is not entitled to a patent since the invention was on sale in this country, more than one year prior to the date of the application for patent in the United States.',
      'Since the MC Motors misappropriated the invention and since Eve did not authorize the sale, the rejection may be overcome by showing that the sales by MC Motors were not authorized by Eve.',
      'MC Motors is entitled to a patent since although it misappropriated the idea for the invention from Eve, the misappropriation was beyond the jurisdiction of the USPTO.',
      '(A) and (C).',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. In Evans Cooling Systems, Inc. v. General Motors Corp., 125 F.3d 1448, 44 USPQ2d 1037 (Fed. Cir. 1997), the Federal Circuit held that even where an invention is misappropriated by a third party, the public sale bar of 35 U.S.C. § 102(b) applies. So (A) is true and (B) is not. (C) is incorrect since the people at MC were not the true inventors, and the misappropriation is therefore within the jurisdiction of the USPTO. 35 U.S.C. § 102(f). (D) fails because (C) is incorrect; (E) fails because (A) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-apr02-pm-34',
    topicId: 3,
    subtopic: 'RCE After Payment of the Issue Fee (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On June 9, 1995 you filed a nonprovisional utility patent application on behalf of your client. On May 30, 2000, you have successfully obtained allowance of the claims, and you have paid the issue fee. After further discussions with your client you discover that the client would like to amend the claims by possibly adding new claims that are fully supported by the original disclosure. The new claims would likely be allowable over the prior art in the record. Shortly after paying the issue fee, but before issuance of a patent on the application, you file a request for continued examination along with a proposed amendment and the necessary fee. No other documents are filed. Have you done all that is necessary for your request for continued examination to be granted?',
    options: [
      'Yes, since prosecution was closed and your filing date was after June 8, 1995, you can file an RCE upon submitting a request, a submission and the proper fee.',
      'No, because after the issue fee is paid, you cannot file an RCE unless you have successfully withdrawn the case from issue by petition under 37 CFR 1.313.',
      'Yes, because the application had not yet been abandoned.',
      'No, because the application was not a provisional application.',
      'Yes, because the patent had not been issued at the time the request was filed.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). See 37 C.F.R. § 1.114. (A) is wrong because the issue fee has been paid and § 1.114(a)(1) prohibits an RCE unless a petition under § 1.313 is granted. (C) is wrong for the same reason, and further, if the application had been abandoned an RCE could not be filed. (D) is wrong because RCE practice does not apply to provisional applications, § 1.114(e). (E) is wrong because, as explained in (B), after the issue fee is paid an RCE requires successful withdrawal from issue under § 1.313.',
  },
  {
    id: 'uspto-apr02-pm-35',
    topicId: 5,
    subtopic: 'Reissue Applications and Pre-Grant Publication (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Ramone filed a nonprovisional patent application in the USPTO on November 5, 1999. A patent was granted on the application on December 5, 2000. On January 5, 2001, Ramone files an application for reissue of the patent accompanied by an amendment enlarging the scope of the claims. On February 5, 2001, Ramone also files in the USPTO a copy of the application, as amended, in compliance with the Office electronic filing system requirements. Which of the following statements is true based upon proper USPTO practice and procedure?',
    options: [
      'The copy of the reissue application as amended is subject to pre-grant publication because it was supplied to the USPTO within one month of the actual filing date of the reissue application, i.e., within one month of January 5, 2001.',
      'The copy of the reissue application as amended is subject to pre-grant publication because it was supplied to the USPTO within fourteen months of the filing date of the issued patent, i.e., within fourteen months of November 5, 1999.',
      'The reissue application is subject to pre-grant publication because it was not accompanied by a nonpublication request at the time of filing.',
      'The reissue application is exempt from pre-grant publication.',
      'The reissue application unchanged by the amendment is subject to pre-grant publication.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct and (A), (B), (C) and (E) are wrong. Under 37 C.F.R. § 1.211(b): “Provisional applications under 35 U.S.C. § 111(b) shall not be published, and design applications under 35 U.S.C. chapter 16 and reissue applications under 35 U.S.C. chapter 25 shall not be published under this section.”',
  },
  {
    id: 'uspto-apr02-pm-36',
    topicId: 6,
    subtopic: 'Design Applications — Expedited Examination (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not in accordance with proper USPTO practice and procedure regarding design patent applications filed in March 2001?',
    options: [
      'The expedited treatment available for design applications under 37 CFR 1.155 expedites design application processing by, among other things, decreasing clerical processing time as well as the time spent routing the application between processing steps.',
      'The “petition to make special” procedure is also available for designs and the petition fee is less than the fee for expedited examination.',
      'To qualify for expedited examination: (1) the application must include drawings in compliance with 37 CFR 1.84; (2) the applicant must have conducted a preexamination search; and (3) the applicant must file a request for expedited examination including: (i) The appropriate fee; and (ii) a statement that a preexamination search was conducted. The statement must also indicate the field of search and include an information disclosure statement in compliance with 37 CFR 1.98.',
      'If the design application is not effectively expedited by the Office, the fee for expediting the application will be refunded.',
      'The Office will not examine an application that is not in condition for examination (e.g., missing basic filing fee) even if the applicant files a request for expedited examination under this section.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer — no such refund is permitted. 35 U.S.C. § 42(d) permits refund only of a fee “paid by mistake or any amount paid in excess of that required,” and any refund of an excess amount must be based on an overpayment of a fee that was in fact required when paid. See 65 F.R. 54604, 54642 (Sept. 8, 2000). (A) and (B) restate that same Federal Register discussion. (C) contains all the elements of 37 C.F.R. § 1.155(a). (E) contains all the elements of 37 C.F.R. § 1.155(b).',
  },
  {
    id: 'uspto-apr02-pm-37',
    topicId: 5,
    subtopic: 'Third-Party Options Against an Issued Patent (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant Einstein files a patent application on November 26, 1999, that claims a new type of football pads. Prosecution is conducted and the application issues as a patent to Einstein on April 3, 2001. A competitor, Weisman, who has been making and selling football pads since April of 1998, learns of Einstein’s patent when Einstein approaches him on May 3, 2001, with charges of infringement of the Einstein patent. Weisman makes an appointment to see you to find out what he can do about Einstein’s patent, since Weisman believes that he is the first inventor of the claimed subject matter. At your consultation on May 17, 2001, with Weisman, you discover that Weisman widely distributed printed publications containing a fully enabling disclosure of the invention and all claimed elements in the Einstein patent. Weisman used the printed publication for marketing his football pads in April of 1998. Weisman explains that he wishes to avoid litigation. Which of the following is a proper USTPO practice and procedure that is available to Weisman?',
    options: [
      'Weisman should file a petition to correct inventorship under 37 CFR 1.324 in the patent, along with a statement by Weisman that such error arose without any deceptive intention on his part, requesting that a certificate of correction be issued for the patent under 35 U.S.C. § 256, naming the correct inventive entity, Weisman.',
      'Weisman should file a reissue application under 35 U.S.C. § 251, requesting correction of inventorship as an error in the patent that arose or occurred without deceptive intention, wherein such error is corrected by adding the inventor Weisman and deleting the inventor Einstein, as well as citing Joe Weisman’s April 1998 printed publication for the football pads as evidence that Weisman is the correct inventor.',
      'Weisman should file a prior art citation under 35 U.S.C. § 301, citing the sales in April 1998 of football pads, and explain the pertinency and manner of applying such sales to at least one claim of the Einstein patent.',
      'Weisman should file a request for ex parte reexamination of the Einstein patent under 35 U.S.C. § 302, citing the April 1998 printed publication of football pads in, and explain the pertinency and manner of applying such prior art to at least one claim of the Einstein patent.',
      'Weisman should file a request for inter partes reexamination of the Einstein patent under 35 U.S.C. § 311, citing public use of the football pads in April 1998, and explain the pertinency and manner of applying such prior use to at least one claim of the Einstein patent.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct — it is the only answer proposing a practice available here. 35 U.S.C. § 302. (A) is incorrect because the statement by the currently named inventor required by 37 C.F.R. § 1.324(b)(2) and the § 1.20(b) fee were not filed. (B) is incorrect — a reissue application can only be filed by the inventor(s) or assignee(s). MPEP § 1412.04. (C) is incorrect because § 301 citations are limited to patents or printed publications, not sales. (E) is incorrect because inter partes reexamination is available only for patents issuing from original applications filed on or after November 29, 1999. 37 C.F.R. § 1.913. [Historical practice — inter partes reexamination was replaced by IPR in 2012.]',
  },
  {
    id: 'uspto-apr02-pm-38',
    topicId: 2,
    subtopic: 'Correcting Inventorship — 37 CFR 1.48(f) (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following can correct the inventorship of a patent application in accordance with proper USPTO practice and procedure?',
    options: [
      'An unexecuted nonprovisional application was filed January 3, 2001 naming Jones and Smith as inventors. Smith was named an inventor in error. A Notice to File Missing Parts of Application was mailed by the Office, that requested a surcharge and an executed oath or declaration under 37 CFR 1.63 by Jones and Smith. A registered practitioner in timely response to the Notice submitted the requested surcharge and a declaration under 37 CFR 1.63 that named only Jones as the inventor, which declaration was only executed by Jones. The registered practitioner had determined that a request to correct inventorship under 37 CFR 1.48(a) was unnecessary. No papers were submitted, by Smith, clarifying that she is not an inventor.',
      'A nonprovisional application was filed January 3, 2001 with a declaration under 37 CFR 1.63 naming Jones and Smith as inventors, which declaration was signed only by Jones. Smith was named an inventor in error. A Notice to File Missing Parts of Application was mailed by the Office that requested a surcharge and an executed oath or declaration by Smith. A registered practitioner timely responded to the Notice by submitting the requested surcharge and a new declaration under 37 CFR 1.63 that identified Jones as the sole inventor, which declaration was executed only by Jones.',
      'A nonprovisional application was filed February 28, 2000 that improperly named Jones as the sole inventor in a declaration under 37 CFR 1.63. Only Jones executed the declaration. Applicant need only re-file the application as a continued prosecution application naming the correct inventorship of Jones and Smith in the new application’s transmittal letter.',
      'A continuation application was filed under 37 CFR 1.53(b) using a copy of an executed declaration from the prior application for which a continuation was filed to correct the inventorship. The continuation application papers were accompanied by a request by a registered practitioner, in the continuation application transmittal paper, that Smith, named as an inventor in the prior application, be deleted as an inventor in the continuation application.',
      '(A) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E), which includes (A) and (D), is the correct answer. (A) is correct: where an application is filed identifying inventorship but no executed § 1.63 declaration has been filed, the first submission of an executed declaration automatically corrects the earlier identification. 37 C.F.R. § 1.48(f)(1). (D) is correct: a continuation using a copy of the prior declaration may name fewer than all prior inventors provided a request for deletion accompanies the declaration copy. §§ 1.53(b)(1), 1.63(d)(1)(iv) and 1.63(d)(2). (B) is incorrect because once a § 1.63 declaration signed by at least one inventor has been submitted, a second declaration with a different inventive entity does not correct inventorship absent a § 1.48(a) petition. (C) is incorrect — inventorship cannot be corrected by ADDING an inventor via a CPA; a § 1.48 petition is required. § 1.53(d)(4).',
  },
  {
    id: 'uspto-apr02-pm-39',
    topicId: 2,
    subtopic: 'Small Entity — Written Assertion and Later Fees (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A nonprovisional application under 37 CFR 1.53(b) is filed with a check for the exact amount of a small entity basic filing fee. A registered practitioner’s well trained legal assistant when filing the application forgot to also submit a written assertion of entitlement to small entity status that had been executed by the sole assignee who is a small entity. Which of the following is/are in accordance with proper USPTO practice and procedure?',
    options: [
      'Applicant need not supplement the initial filing with the omitted written assertion of small entity status as the payment of the small entity filing fee will suffice to accord small entity status.',
      'If the application is allowed, applicant cannot pay the issue fee in the small entity amount unless the fee is accompanied by a written assertion of small entity status.',
      'If after filing of the application small entity status becomes no longer appropriate, applicant may continue to pay small entity fees for newly added claims in a response to a first Office action rejection.',
      'If the application is allowed, a registered practitioner could pay a small entity issue fee solely based on the assignee’s written assertion of small entity status that was not originally submitted if the practitioner now submits it with the issue fee.',
      '(A) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer, as both (A) and (C) accord with Office practice. (A) is correct because payment of the small entity filing fee is treated as a written assertion of entitlement to small entity status. 37 C.F.R. § 1.27(c)(3). (C) is correct because once small entity status is properly established on filing, small entity fees may continue to be paid without regard to a change in status until the issue fee is due. § 1.27(g)(1). (B) is incorrect — a new determination is made at issue-fee payment, but a written assertion is not required at that time. (D) is incorrect — the practitioner cannot rely on the earlier written assertion; a new investigation of entitlement must be conducted at the time the issue fee is paid. § 1.27(g)(1), (e)(1).',
  },
  {
    id: 'uspto-apr02-pm-40',
    topicId: 1,
    subtopic: 'Dependent Claim Form and Antecedent Basis (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Claims 1 and 2 in a patent application state the following: Claim 1. An apparatus for sitting comprising: (i) a square shaped base member; (ii) four elongated members mounted to the bottom of the base member; and (iii) a circular back member mounted to the base member. Claim 2. An apparatus as in claim 1, further comprising a spring connected to the back member and to the base member. Which, if any, of the following claims fully supported by the specification and presented in the application, is in accordance with USPTO rules and procedure?',
    options: [
      '3. An apparatus as in claim 1, wherein the base member is rectangularly shaped.',
      '3. An apparatus as in claim 2, wherein the wheels connected to each of the elongated members are plastic.',
      '3. An apparatus as in the preceding claims, further comprising a pressure-sensing device connected to the base member.',
      '3. An apparatus as in any of the preceding claims, in which the circular back member is wooden.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 608.01(n). (A) is incorrect because a dependent claim must further limit the subject matter of a previous claim (37 C.F.R. § 1.75(c)) — “rectangularly shaped” is inconsistent with the “square shaped” base of claim 1. (B) is incorrect because there is no antecedent basis for the wheels. MPEP § 2173.05(e). (C) is incorrect because a multiple dependent claim must refer back in the ALTERNATIVE only. MPEP § 608.01(n). (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-apr02-pm-42',
    topicId: 7,
    subtopic: 'Power of Attorney and Authorization of Agent (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Regarding a power of attorney or authorization of agent in a patent application, which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'Powers of attorney to firms submitted in applications filed in the year 2001 are recognized by the United States Patent and Trademark Office.',
      'The associate attorney may appoint another attorney.',
      'The filing and recording of an assignment will operate as a revocation of a power or authorization previously given.',
      'Revocation of the power of the principal attorney or agent does not revoke powers granted by him or her to other attorneys or agents.',
      'All notices and official letters for the patent owner or owners in a reexamination proceeding will be directed to the attorney or agent of record in the patent file at the address listed on the register of patent attorneys and agents.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 C.F.R. § 1.33(c). (A) is incorrect — powers of attorney to firms filed in executed applications filed after July 2, 1971 are not recognized, though the firm’s address will be treated as the correspondence address. MPEP § 403. (B) is incorrect — the associate attorney may not appoint another attorney. MPEP §§ 402.02, 406. (C) is incorrect — an assignment will not itself operate as a revocation of a power previously given. § 1.36. (D) is incorrect — revoking the principal attorney’s power DOES revoke powers he or she granted to others. MPEP § 402.05.',
  },
  {
    id: 'uspto-apr02-pm-43',
    topicId: 4,
    subtopic: 'Foreign Priority — 12-Month Deadline (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On December 24, 2001, you were retained to file a U.S. nonprovisional patent application for inventions X, and Y. In preparing the U.S. patent application, you discovered that the same inventors filed an application for invention X in Germany on December 28, 2000 and an application for inventions X and Y in France on March 13, 2001. The German application was never published and was abandoned on July 2, 2001. What is the latest date you could file a U.S. patent application at the USPTO to properly have the right of priority for the inventions disclosed in the U.S. patent application?',
    options: [
      'December 27, 2001 (Thursday)',
      'December 28, 2001 (Friday)',
      'January 2, 2002 (Wednesday)',
      'March 12, 2002 (Tuesday)',
      'March 13, 2002 (Wednesday)',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (B). See MPEP § 201.13. An application must be filed in the U.S. within 12 months of the EARLIEST foreign filing, except as provided in 35 U.S.C. § 119(c). Invention X was first filed in Germany on December 28, 2000, so the U.S. filing must occur by December 28, 2001 — a Friday on which the USPTO is open for business. The § 119(c) exception does not apply because the German application was abandoned AFTER the second foreign (French) application was filed, and because the subsequent application must be filed in the same country. (A) is not the latest date. (C), (D) and (E) are too late to preserve priority for invention X.',
  },
  {
    id: 'uspto-apr02-pm-44',
    topicId: 1,
    subtopic: 'Claim Definiteness — 35 U.S.C. 112 ¶2 and 101 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A U.S. patent application discloses an adhesive composition described as useful for causing a football to stick to human skin. The application discloses that the composition is made of known materials in equal amounts by weight of A and B. The application discloses that A must be at a temperature between 10 and 30 degrees Celsius, and that B can be either of known materials X or Y. The application discloses that by adding different effective amounts of known material C to the composition, the composition’s stickiness or hardness can be changed. In one example, the application discloses an effective amount of material C that can be added to the composition to increase stickiness of the composition. The application also discloses in another example a different effective amount of material C that must be added to the composition to increase the composition’s hardness. The effective amounts of material C used in the two examples differ, and the examples describe the effective amounts. Which of the following claims, included in the application, complies with the requirements of 35 U.S.C. § 112, second paragraph, and 35 U.S.C. § 101?',
    options: [
      'Claim 1. A process for using a composition to cause a football to stick to human skin.',
      'Claim 2. A composition comprising equal amounts by weight of A and B, wherein A is at a temperature between 10 and 30 degrees Celsius, and B is X or Y.',
      'Claim 3. A composition comprising equal amounts by weight of A and B, and an effective amount of C, wherein A is at a temperature between 10 and 30 degrees Celsius.',
      'Claim 4. A composition comprising equal amounts by weight of A and B, wherein A is at a temperature between 10 and 30 degrees Celsius, preferably between 15 and 20 degrees Celsius.',
      'Claim 5. A composition comprising equal amounts by weight of A and B and a process of using the composition to cause a football to stick to human skin.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 35 U.S.C. § 112 ¶ 2; 35 U.S.C. § 101; MPEP § 2173.05(h)(II) (a proper Markush-type alternative, “B is X or Y”). (A) is incorrect because it claims a process without setting forth any steps. MPEP § 2173.05(q). (C) is incorrect because “an effective amount” is recited without stating the function to be achieved and more than one effect is implied — stickiness or hardness. In re Fredericksen, 213 F.2d 547; MPEP § 2173.05(c)(III). (D) is incorrect because it is unclear whether “preferably between 15 and 20 degrees Celsius” limits the claim. MPEP § 2173.05(c)(I). (E) is incorrect at least because it claims both a composition and a process of using it. MPEP § 2173.05(p)(II).',
  },
  {
    id: 'uspto-apr02-pm-45',
    topicId: 2,
    subtopic: 'Changing the Correspondence Address (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] An application is transmitted to the USPTO on January 12, 2001, without an oath or declaration by any of the inventors. Which of the following, prior to the filing of an oath or declaration, may properly change the address to which the Office will direct all notices, official letters, and other communications relating to the application?',
    options: [
      'A registered practitioner that filed the application.',
      'Any registered practitioner named in the transmittal papers accompanying the original application, if the application was filed by a registered practitioner.',
      'One inventor who solely filed the application, where two inventors are named in the transmittal papers accompanying the original application.',
      '(A), (B), and (C).',
      '(A) and (B).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 C.F.R. § 1.33(a)(1) (effective Nov. 7, 2000); 65 FR 54604, 54617. Section 1.33(a)(1) provides that “the inventor(s), any registered practitioner named in the transmittal papers accompanying the original application, or a party that will be the assignee who filed the application, may change the correspondence address.” The Federal Register notice adds that this includes “only the one inventor filing the application, even if more than one inventor was identified on the application transmittal letter.” Since (A), (B) and (C) are all provided for, (D) is correct; (E) is incorrect because (D) is.',
  },
  {
    id: 'uspto-apr02-pm-46',
    topicId: 3,
    subtopic: 'Requirement for Information — 37 CFR 1.105 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is/are information which the USPTO may require an attorney of record in a reissue application to submit in a reply to a first Office action dated April 12, 2001?',
    options: [
      'Information used in invention process: A copy of any non-patent literature, published application, or patent (U.S. or foreign) that was used in the invention process, such as by designing around or providing a solution to accomplish an invention result.',
      'The publication date of an undated document mentioned by applicant which may qualify as printed publication prior art.',
      'Comments on a new decision by the Federal Circuit that appears on point in the examination of the application.',
      '(A), (B), and (C).',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 C.F.R. § 1.105(a) (effective Nov. 7, 2000); 65 FR 54604, 54634. (A) is specifically stated as an example in § 1.105(a)(1)(v). (B) and (C) are given as examples at 65 FR 54634 of information the Office may require. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-apr02-pm-47',
    topicId: 1,
    subtopic: 'Compact Disc Submission of Tables and Program Listings (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Practitioner prepared a patent application containing a table of 52 pages and a computer program listing of 360 lines (up to 72 characters per line). The application is sent via the U.S. Mail to the USPTO. Which of the following identifies the proper submission using electronic media in accordance with USPTO rules and procedure?',
    options: [
      'The computer program listing must be submitted on a duplicate set of compact discs, while the table may be submitted on a duplicate set of compact discs.',
      'The computer program listing may be submitted on a magnetic floppy disc and the rest of the application must be submitted on paper.',
      'The computer program listing and the table may be submitted on a magnetic floppy disc, magnetic tape or paper.',
      'The table must be submitted, and optionally the computer program listing may be submitted, on either magnetic floppy disc, compact disc, magnetic tape.',
      'The entire application may be sent on a single copy of a compact disc.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The model answer is choice (A). MPEP §§ 608.05, 608.05(a) and (b); 37 C.F.R. §§ 1.96(c) and 1.52(e). A computer program listing of more than 300 lines (up to 72 characters per line) MUST be submitted on compact disc; tables over 50 pages MAY be submitted on compact disc; and if either is submitted on compact disc, a duplicate copy of each disc must also be submitted. (B) and (C) are incorrect because only CD-R and CD-ROM are acceptable media — not floppy discs, magnetic tape or paper — for program listings over 300 lines. (D) is incorrect because submitting a table over 50 pages on compact disc is optional, not mandatory. (E) is incorrect because only tables over 50 pages, computer program listings and genomic sequence information may be filed on compact disc, and the disc must be provided in duplicate.',
  },
  {
    id: 'uspto-apr02-pm-48',
    topicId: 3,
    subtopic: 'Corrected Drawings After Notice of Allowability (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On March 29, 2002, you received a Notice of Allowability (PTO-37) and Notice of Allowance (PTOL-85) on the first application that you filed as a registered practitioner. The Notice of Allowability and the Notice of Allowance were dated March 26, 2002, and mailed from the USPTO on March 26, 2002. Each notice set a three month period for reply. The Notice of Allowability indicated that new drawings were required to incorporate the proposed drawing correction you filed with your reply to the final Office action. The Notice of Allowance indicated that you must pay the issue fee and publication fee. What is the latest date you could file new drawings to prevent the abandonment of the application?',
    options: [
      'June 25, 2002 (Tuesday).',
      'June 26, 2002 (Wednesday).',
      'July 29, 2002 (Monday), with a petition for a one-month extension of time.',
      'August 26, 2002 (Monday), with a petition for a two-month extension of time.',
      'September 25, 2002 (Wednesday), with a petition for a three-month extension of time.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (B). No extensions of time under 37 C.F.R. § 1.136 are permitted. See 37 C.F.R. § 1.85(c). The drawings must therefore be filed three months from the mailing date of the Notice of Allowability — March 26, 2002 plus three months = June 26, 2002. (A) is not the latest date. (C), (D) and (E) are incorrect because no extensions of time are permitted.',
  },
  {
    id: 'uspto-apr02-pm-49',
    topicId: 2,
    subtopic: 'Replying to a Notice to File Missing Parts (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On January 2, 2001, Mr. Star filed a patent application naming Mr. Stripe, Ms. Ross and Mr. Flag as joint inventors using the Express Mail service of the United States Post Office. The filing fee was included with the application on filing. The application that was filed on January 2, 2001 was not filed with an executed declaration, but the transmittal letter for the application clearly identified Stripe, Ross and Flag as joint inventors. On February 15, 2001, a “Notice to File Missing Parts of Application” was mailed, requiring an executed oath or declaration, and a surcharge for their late filing. Star mailed a copy of a blank declaration naming Stripe, Ross and Flag as joint inventors and a copy of the application papers (specification, claims and drawings) to each named inventor. Ross and Flag contact Star and inform him that Stripe was not an inventor. Stripe does not reply and Star is unable to reach Mr. Stripe. Star investigates the matter, and determines that the correct inventorship is Ross and Flag. Which of the following should be filed in reply to the Notice, together with a surcharge?',
    options: [
      'A declaration under 37 CFR 1.63 that names Stripe, Ross, and Flag as inventors, and is signed by Ross and Flag.',
      'A request to delete Mr. Stripe as an inventor under 37 CFR 1.48 and an executed declaration signed by Ross and Flag.',
      'A petition under 37 CFR 1.47 to accept a declaration under 37 CFR 1.63 signed by Ross and Flag, but without the signature of Stripe.',
      'A declaration under 37 CFR 1.63 that names only Ross and Flag as inventors, and is signed by Ross and Flag.',
      'A request to hold the requirements of the notice in abeyance pending further inquiry into the inventorship.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. In addition to the surcharge, only what was required in the notice — an executed declaration — should be filed. 37 C.F.R. § 1.48(f)(1). As to (A), it is improper to continue to represent that Stripe is an inventor once it is recognized that he is not. 35 U.S.C. § 116, third paragraph. As to (B), a request to delete an inventor is unnecessary because inventors are not considered named until an executed declaration has been filed. As to (C), a § 1.47 petition would only be appropriate if Stripe were an inventor. As to (E), to avoid abandonment the missing parts must be filed within the period set in the notice or as extended.',
  },
  {
    id: 'uspto-apr02-pm-50',
    topicId: 1,
    subtopic: 'Claim Form and Arrangement (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Regarding claims, which of the following practices is not in accordance with proper USPTO practice and procedure?',
    options: [
      'A singular dependent claim 2 could read as follows: 2. The product of claim 1 in which…',
      'An application may contain a series of singular dependent claims in which a dependent claim refers to a preceding claim which, in turn, refers to another preceding claim.',
      'A dependent claim may refer back to any preceding independent claim.',
      'A claim which depends from a dependent claim may be separated therefrom by any claim which does not also depend directly or indirectly from said “dependent claim.”',
      'Each claim begins with a capital letter and ends with a period.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 608.01(n), part “IV. Claim Form and Arrangement”: a claim which depends from a dependent claim should NOT be separated therefrom by any claim which does not also depend from said “dependent claim.” (A), (B) and (C) are incorrect because they are practices permitted by MPEP § 608.01(n), subsection IV. (E) is incorrect because it represents a practice encouraged by MPEP § 608.01(m). See Fressola v. Manbeck, 36 USPQ2d 1211 (D.D.C. 1995).',
  },
];

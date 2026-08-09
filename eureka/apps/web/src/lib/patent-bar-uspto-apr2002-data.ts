/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, April 17, 2002 — Morning Session
 * (Test Number 123, Series 102), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (edo0204aq.pdf / edo0204aa.pdf,
 * via the Internet Archive copy of uspto.gov). US Government works — public
 * domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the Oct 2003
 * and Apr 2003 files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper are preserved).
 *  - Option ORDER is the official exam order — never shuffled (several
 *    options reference other options by letter, and official exams are
 *    already key-balanced). Note: in Q28 options (A) and (B) are identical
 *    in the official paper; both are preserved verbatim.
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Question 49 of this session was officially discarded by the USPTO
 *    ("All answers accepted") and is excluded.
 *  - ERA NOTE: this exam predates the AIA (2011-2013) and much of modern
 *    practice. Questions that turn on pre-AIA 35 U.S.C. 102/103 rules carry
 *    an explicit [Pre-AIA] tag in the explanation. Questions built on
 *    since-superseded procedure (CPA practice, the pre-2003 amendment format
 *    of 37 CFR 1.121, the PCT 20/30-month transition of 2002) carry a
 *    [Historical practice] tag — the reasoning style remains instructive,
 *    but the specific rule has changed. Verified status: OFFICIAL (USPTO
 *    model answers).
 *
 * Ingested: AM session Q1–Q48 and Q50 (49 of 49 scoreable; Q49 excluded —
 * officially discarded, see above). The PM session (edo0204pq/pa) follows
 * the same pipeline.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2002_AM_SOURCE =
  'USPTO Registration Examination, April 17, 2002 — Morning Session (official model answers; public domain)';

export const USPTO_APR2002_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr02-am-01',
    topicId: 1,
    subtopic: 'Means-Plus-Function Recitation (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is the best way to recite a claim limitation so that it will be interpreted by the examiner in accordance with 35 U.S.C. § 112, paragraph 6?',
    options: [
      'dot matrix printer for printing indicia on a first surface of a label.',
      'dot matrix printer means coupled to a computer.',
      'means for printing indicia on a first surface of a label.',
      'printer station for printing indicia on a first surface of a label.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2181 expressly requires that for a claim limitation to be interpreted in accordance with 35 U.S.C. § 112, paragraph 6, the limitation must (1) use the phrase "means for", (2) the "means for" must be modified by functional language, and (3) the "means for" must not be modified by sufficient structure for achieving the specified function. Only (C) satisfies all three. (A) and (D) recite structure and do not use "means for"; (B) modifies the "means" with structure and lacks functional language.',
  },
  {
    id: 'uspto-apr02-am-02',
    topicId: 3,
    subtopic: 'IDS After Allowance — Patent Term Adjustment (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Registered practitioner Pete received on September 13, 2001 a notice of allowance dated September 10, 2001 in a utility application filed December 5, 2000. The client for whom the application is being prosecuted has repeatedly stressed to counsel how valuable the invention is, and that it will remain so throughout the entire life of any patent that should issue. Pete is determined to take no chances with this application, particularly since patent term adjustment has been accumulated and the lack of any action or inaction by applicant that would cause loss of patent term adjustment. Thus, Pete is ready to pay the issue fee on the very day the Notice of Issue Fee Due is received. Before payment of the issue fee, the client faxes Pete information identifies prior art first cited on September 3, 2001 by the foreign office examining a foreign counterpart application. This prior art was not previously cited by another foreign patent office. The invention had been filed with a second foreign office that mailed the same prior art at a later date than the first foreign office. Also, this prior art was previously unknown to the client. The client is very desirous of having this cited art made of record in the file. Which of the following alternatives would best achieve the client’s objectives of maximizing patent term and having the foreign cited prior art considered by the USPTO?',
    options: [
      'Pete should file a petition for withdrawal from issue of the allowed application for consideration of a request for continued examination based on an information disclosure statement (IDS) and include in the petition an offer to file the request and IDS upon the petition being granted.',
      'As it is still within three months from the date cited by the foreign office, Pete can submit the prior art in the allowed application up to the last day of the three month period making any required statements and fee payments.',
      'Pete should submit an IDS citing the prior art in the allowed application within 30 days of the September 3, 2001 mailing by the foreign office with any appropriate fees and statements.',
      'If, Pete could use the date of mailing by the second foreign office to file the IDS in the allowed application within three months of the communication of prior art by the second foreign office thereby allowing the client extra time to evaluate the allowed claims and still have the IDS entered.',
      '(B) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.704(d): submission of an IDS under §§ 1.97/1.98 will not be considered a failure to engage in reasonable efforts to conclude prosecution (§ 1.704(c)(10)) if the communication was not received by a § 1.56 individual more than thirty days prior to filing the IDS — so filing within 30 days of the foreign office mailing preserves the accumulated patent term adjustment. (A) delays issuance and loses term. (B) meets § 1.97(d) but may blow the 30-day § 1.704(d) window, risking PTA reduction. (D) is wrong — § 1.97(e) measures the three-month period from the FIRST citation by any foreign office; a later second citation cannot restart it.',
  },
  {
    id: 'uspto-apr02-am-03',
    topicId: 4,
    subtopic: 'PCT Chapter II — Preliminary Examination (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Belle Bordeaux files a French patent application for a rejuvenating lotion in the French Patent Office on January 10, 2000. On January 10, 2001, she files a PCT Chapter I Request in the EPO Receiving Office, in which she requests that the European Patent Office act as the International Searching Authority. In her PCT application, Bordeaux claims priority to the French application, and indicates the U.S. as a designated state. Bordeaux makes an appointment to meet with you on June 8, 2001, to discuss filing a patent application in the USPTO on the rejuvenating lotion, in which she wants to claim priority not only to the PCT application, but also the French application. In preparing for your meeting with Bordeaux, you realize that she has several options here, and so you prepare an analysis of the various options, which are detailed below. Before entering the U.S. national stage, Bordeaux wishes to have an official international preliminary search report that indicates claims having the best chance of being patentable. Which of the following will achieve Bordeaux’s objective in accordance with proper USPTO practice and procedure?',
    options: [
      'Bordeaux should enter the national stage by filing an application under 35 U.S.C. § 371 on or before September 10, 2001.',
      'Bordeaux should file an application under 35 U.S.C. § 111(a) on or before September 10, 2001, claiming priority under 35 U.S.C. § 120 to the PCT application, and claiming priority under 35 U.S.C. § 119 to the French application.',
      'Bordeaux should first file a PCT Chapter II Demand in the USPTO on or before August 10, 2001, and then file a provisional application under 35 U.S.C. § 111 on or before September 4, 2001.',
      'Bordeaux should first file a PCT Chapter II Demand in the USPTO on or before August 10, 2001, and then enter the national stage by filing an application under 35 U.S.C. § 371 on or before July 10, 2002.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct — filing a Chapter II Demand by the 19-month date and entering the national stage under 35 U.S.C. § 371 by 30 months gives Bordeaux the PCT filing date as her U.S. filing date for prior-art purposes, the foreign priority date with no further need to provide the priority document, and the full PCT benefit of a search report and preliminary examination report BEFORE the national filing. (A) and (B) forgo the preliminary examination report; (C) fails because a provisional application is not entitled to priority of any other application under 35 U.S.C. §§ 119/365(a) or benefit under §§ 120/121/365(c). [Historical practice: the Chapter II 19-month Demand deadline was mooted by the 2002 amendment of PCT Article 22.]',
  },
  {
    id: 'uspto-apr02-am-04',
    topicId: 1,
    subtopic: 'Enablement Objection — Late Drawings (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] The specification in your client’s patent application has been objected to for lack of enablement. To overcome this objection, your client may do any of the following except:',
    options: [
      'traverse the objection and specifically argue how the specification is enabling.',
      'traverse the objection and submit an additional drawing to make the specification enabling.',
      'file a continuation-in-part application that has an enabling specification.',
      'traverse the objection and file an amendment without adding new matter in an attempt to show enablement.',
      'traverse the objection and refer to prior art cited in the specification that would demonstrate that the specification is enabling to one of ordinary skill.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 35 U.S.C. § 113: "Drawings submitted after the filing date of the application may not be used (i) to overcome any insufficiency of the specification due to lack of an enabling disclosure." (A) and (E) may be done under 37 CFR § 1.111; (C) may be done under 35 U.S.C. § 120; (D) may be done under 37 CFR § 1.121.',
  },
  {
    id: 'uspto-apr02-am-05',
    topicId: 6,
    subtopic: 'RCE Not Available for Design Applications (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Registered practitioner Joe files a design patent application under 37 CFR 1.53(b) having one claim on May 6, 1999. The USPTO sends Joe a notice of allowance dated November 10, 2000. Joe pays the issue fee on November 15, 2000. On November 23, 2000, Joe learns about a publication (the “Smith Reference”) which he knows to be material to patentability of the claim, but which was not considered by the examiner during prosecution of the application. Joe prepares an information disclosure statement that complies with the provisions of 37 CFR 1.98, listing the Smith reference. Which of the following actions, if taken by Joe on November 24, 2000, will result in a request for continued examination of the application being granted in accordance with USPTO rules and procedure?',
    options: [
      'Filing a request for continued examination of the application with the information disclosure statement listing the Smith Reference, without the fee set forth in 37 CFR 1.17(e).',
      'Filing a request for continued examination of the application with the information disclosure statement listing the Smith Reference, and the fee set forth in 37 CFR 1.17(e).',
      'Filing a request for continued examination of the application with the information disclosure statement listing the Smith Reference, the fee set forth in 37 CFR 1.17(e), and a petition under 37 CFR 1.313 with the fee set forth in 37 CFR 1.17(h).',
      '(B) or (C) above.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.114(e) (effective Aug. 16, 2000; see 65 FR 50092, 50097): the provisions of § 1.114 (request for continued examination) do not apply to design patent applications. Therefore no RCE can be granted in this design application and (A)–(D) are incorrect.',
  },
  {
    id: 'uspto-apr02-am-06',
    topicId: 3,
    subtopic: 'Improper CPA Treated as Improper RCE (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant Jones filed a request for a first continued prosecution application (CPA) on December 29, 2000 in a utility application that was filed on April 28, 2000. Jones received a final Office action mailed on June 28, 2001. In response, Jones filed an amendment amending the claims in the first CPA. Jones received an advisory action on September 27, 2001 stating that the proposed amendment to the first CPA would not be entered because it raises new issues that would require further consideration. Additionally, the proposed amendment did not meet the requirements for a complete reply under 37 CFR 1.111. On December 28, 2001, Jones filed a petition for a 3-month extension of time with appropriate petition fee, a request for a second continued prosecution application, a request for suspension of action, and appropriate processing fee for the request for suspension of action. No application filing fee was filed with the request for the second CPA. Which of the following would be a proper communication mailed by the Office based on Jones’ actions?',
    options: [
      'A Notice of Allowability.',
      'A Notice to File Missing Parts.',
      'A first Office action on the merits.',
      'A notice of improper Request for Continued Examination (RCE) and a notice of abandonment.',
      'A letter granting the suspension of action.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). MPEP § 706.07(h) ("Improper CPA Treated as RCE"): CPA practice does not apply to applications filed on or after May 29, 2000, so the December 28, 2001 request for a second CPA in an application filed December 29, 2000 is improper and is automatically treated as an RCE under 37 CFR § 1.114 — but it fails § 1.114 too (no filing fee, no submission). The improper CPA is therefore treated as an improper RCE, the period set in the June 28, 2001 final action continued to run, and the application went abandoned. A suspension of action (E) will not be granted on an improper CPA/RCE (37 CFR § 1.103; MPEP § 709). [Historical practice: CPA practice for utility applications has been eliminated.]',
  },
  {
    id: 'uspto-apr02-am-07',
    topicId: 0,
    subtopic: 'Unexpected Results — Attorney Argument (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Evidence of unexpected results is relied upon to overcome a prima facie case of obviousness. Which of the following is incorrect?',
    options: [
      'The evidence must compare the claimed invention to the closest prior art.',
      'The evidence must be commensurate in scope with the claims.',
      'Data relied upon to show unexpected results need not cover the full range of the claims if one of ordinary skill in the art could ascertain a trend in the data that would allow that person to reasonably extend the probative value of the data to the full scope of the claims.',
      'Unexpected results can be shown by factual evidence or, if no factual evidence is available to the applicant, by sound argument by the applicant’s agent or attorney.',
      'The evidence need not be in an affidavit or declaration under 37 CFR 1.132 if the evidence is presented in the specification of an application to which the applicant has attested.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer — mere attorney argument, unsupported by factual evidence, is insufficient to establish unexpected results. In re Geisler, 116 F.3d 1465, 1470-71 (Fed. Cir. 1997). (A) comparison to the closest prior art is required (In re Baxter Travenol Labs.; MPEP § 716.02(e)); (B) evidence must be commensurate in scope with the claims (In re Grasselli; MPEP § 716.03(a)); (C) a trend in narrower data can support a broader range (In re Kollman); (E) the evidence can be in the specification (In re Soni).',
  },
  {
    id: 'uspto-apr02-am-08',
    topicId: 0,
    subtopic: '§ 103(c) Common Ownership — 102(a) Art (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On March 20, 2000, Patsy Practitioner filed a patent application on widget Y for the ABC Company based on a patent application filed in Germany for which benefit of priority was claimed. The sole inventor of widget Y is Clark. On September 13, 2000, Patsy received a first Office action on the merits rejecting all the claims of widget Y under 35 U.S.C. § 103(a) as being obvious over Jones in view of Smith. When reviewing the Jones reference, Patsy notices that the assignee is the ABC Company, that the Jones patent application was filed on April 3, 1999, and that the Jones patent was granted on January 24, 2000. Jones does not claim the same patentable invention as Clark’s patent application on widget Y. Patsy wants to overcome the rejection without amending the claims. Which of the following replies independently of the other replies would not be in accordance with proper USPTO practice and procedures?',
    options: [
      'A reply traversing the rejection by correctly arguing that Jones in view of Smith fails to teach widget Y as claimed, and specifically and correctly pointing out claimed elements that the combination lacks.',
      'A reply traversing the rejection by relying on an affidavit or declaration under 37 CFR 1.131 that antedates the Jones reference.',
      'A reply traversing the rejection by relying on an affidavit or declaration under 37 CFR 1.132 containing evidence of criticality or unexpected results.',
      'A reply traversing the rejection by stating that the invention of widget Y and the Jones patent were commonly owned by ABC Company at the time of the invention of widget Y, and therefore, Jones is disqualified as a reference via 35 U.S.C. § 103(c).',
      'A reply traversing the rejection by perfecting a claim of priority to Clark’s German application, filed March 21, 1999, disclosing widget Y under 35 U.S.C. § 119(a)-(d).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] The correct answer is (D). The prior art exception in pre-AIA 35 U.S.C. § 103(c) applies only to references that are prior art ONLY under 35 U.S.C. § 102(e), (f), or (g). Here the Jones patent issued January 24, 2000 — before Clark’s March 20, 2000 filing — so it qualifies under § 102(a), and § 103(c) cannot disqualify it; moreover evidence of common ownership (not mere argument) must be presented. MPEP § 706.02(l)(3). (A) is proper argument under 37 CFR § 1.111; (B) is proper under MPEP § 715; (C) is proper under MPEP § 716; (E) properly antedates the reference by perfecting foreign priority.',
  },
  {
    id: 'uspto-apr02-am-09',
    topicId: 1,
    subtopic: 'Written Description Guidelines (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'A written description as filed in a nonprovisional patent application is presumed adequate under 35 U.S.C. § 112 in the absence of evidence or reasoning to the contrary.',
      'An examiner may show that a written description as filed in a nonprovisional patent application is not adequate by presenting a preponderance of evidence why a person of ordinary skill in the art would not recognize in the applicant’s disclosure a description of the invention defined by the claims.',
      'A general allegation of “unpredictability in the art” is sufficient to support a rejection of a claim for lack of an adequate written description.',
      'When filing an amendment, a practitioner should show support in the original disclosure for new or amended claims.',
      'When there is substantial variation within a genus, an applicant must describe a sufficient variety of species to reflect the variation within the genus.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. Per the Written Description Guidelines, 66 F.R. 1099, 1107 (Jan. 5, 2001): "A general allegation of ‘unpredictability in the art’ is not a sufficient reason to support a rejection for lack of adequate written description." (A), (B), (D) and (E) each state the Guidelines correctly (presumption of adequacy; examiner’s initial burden by preponderance; showing support for amendments — see MPEP §§ 714.02, 2163.06; describing species reflecting variation within a genus).',
  },
  {
    id: 'uspto-apr02-am-10',
    topicId: 2,
    subtopic: 'Correcting Inventorship — Unexecuted Declaration (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A nonprovisional patent application was filed by a registered practitioner in the USPTO with a declaration under 37 CFR 1.63. The declaration named the individuals known to the practitioner to be the inventors of the claimed invention, but the declaration was not signed by any of the individuals. Within two weeks of the filing the application, the practitioner discovered that there is one more individual, who was not named on the unexecuted declaration, who is an inventor in the claimed invention. Which of the following actions, if undertaken by the practitioner, would properly correct the inventorship in the patent application?',
    options: [
      'File a new declaration under 37 CFR 1.63, identifying all the inventors including the newly discovered inventor, which is signed by each of the inventors.',
      'File only a letter requesting that the inventorship be changed to add the newly discovered inventor.',
      'File a petition under 37 CFR 1.48(a) for correction of inventorship. The petition contains only a request to add the newly discovered inventor. File with the petition (1) a new oath or declaration identifying and signed by only the newly discovered inventor, and (2) the petition fee set forth in 37 CFR 1.17(i).',
      'File a petition under 37 CFR 1.48(a) for correction of inventorship consisting only of a request to add the newly discovered inventor, a statement by the newly discovered inventor that the error occurred without deceptive intention on his part and a petition fee set forth in 37 CFR 1.17(i).',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (A). 37 CFR § 1.48(f)(1): the FIRST submission of an executed oath or declaration under § 1.63 by any of the inventors during pendency acts to correct the earlier identification of inventorship in the unexecuted declaration — no § 1.48(a) petition is needed. (B) fails because no executed declaration is filed; (C) and (D) are unnecessary petitions and incomplete in any event (missing the without-deceptive-intent statement or a declaration naming all inventors). [Historical practice: § 1.48 was substantially rewritten under the AIA; the deceptive-intent statement is no longer required.]',
  },
  {
    id: 'uspto-apr02-am-11',
    topicId: 0,
    subtopic: '§ 102(e)(1) — Published Application Prior Art Date (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant files a patent application in Japan on February 28, 1996. Applicant files a PCT international application designating the United States on February 27, 1997, based on the Japanese application. The international application is published in English on August 28, 1997. The international application enters the national stage in the United States on August 28, 1998. The USPTO publishes the application on June 7, 2001 at the request of the applicant. The application issues as a United States patent on December 4, 2001. When examining an application filed on or after November 29, 2000 or any application that has been voluntarily published, what is its earliest possible prior art date, for the June 7th U.S. published application in view of 35 U.S.C. § 102(e) as amended by the American Inventors Protection Act of 1999?',
    options: [
      'February 28, 1996.',
      'February 27, 1997.',
      'August 28, 1997.',
      'August 28, 1998.',
      'June 7, 2001.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (B) is the most correct answer. Pre-AIA 35 U.S.C. § 102(e)(1) (as amended by the AIPA): a USPTO published application based on an earlier international application has prior art effect as of its INTERNATIONAL FILING DATE if the international application designated the United States and was published in English — both conditions met here, so February 27, 1997. (A) is wrong — the Japanese date matters only for § 119 priority, not prior art; (D) is wrong — the AIPA made national-stage entry irrelevant for prior-art purposes.',
  },
  {
    id: 'uspto-apr02-am-12',
    topicId: 0,
    subtopic: '§ 102(e)(2) — Patent Prior Art Date (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant files a patent application in Japan on February 28, 1996. Applicant files a PCT international application designating the United States on February 27, 1997, based on the Japanese application. The international application is published in English on August 28, 1997. The international application enters the national stage in the United States on August 28, 1998. The USPTO publishes the application on June 7, 2001 at the request of the applicant. The application issues as a United States patent on December 4, 2001. For the United States patent, what is the patent’s earliest date, for prior art purposes as a patent, in view of the amendment to 35 U.S.C. § 102(e) by the American Inventors Protection Act of 1999?',
    options: [
      'February 28, 1996.',
      'February 27, 1997.',
      'August 28, 1997.',
      'August 28, 1998.',
      'December 4, 2001.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (E) is the most correct answer. Pre-AIA 35 U.S.C. § 102(e)(2) (as amended by the AIPA): a United States patent is prior art as of its earliest filing date IN THE UNITED STATES, and is expressly not entitled to any international application filing date. Since no application was ever filed in the United States (the case entered via the national stage), the patent as a patent is entitled to no prior-art date earlier than its issue date. The published application has its own § 102(e)(1) effect (Q11), but that is separate from the patent’s effect.',
  },
  {
    id: 'uspto-apr02-am-13',
    topicId: 2,
    subtopic: 'Small Entity — Government Agency (Official Apr 2002)',
    difficulty: 1,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following could never qualify as a small entity under 37 CFR 1.27 for certain fee reductions?',
    options: [
      'A nonprofit organization.',
      'A two-person business concern with a $4,000,000 income.',
      'A federal government agency.',
      'A university in Canada.',
      'A person.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 35 U.S.C. § 41(e) lets the Director waive fees for occasional government requests, but the statute does not make a government agency a small entity. (A), (B), (D) and (E) all can qualify under 37 CFR § 1.27(a) (person, small business concern, nonprofit organization — including a foreign university).',
  },
  {
    id: 'uspto-apr02-am-14',
    topicId: 5,
    subtopic: 'Ex Parte Reexamination Interviews (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not in accord with proper USPTO practice and procedure regarding ex parte reexaminations filed in March 2001?',
    options: [
      'In every instance of an interview with an examiner in an ex parte reexamination proceeding, a complete written statement of the reasons presented at the interview as warranting favorable action must be filed by the patent owner.',
      'Third party requesters have the option of attending interviews, but their presence is not mandatory.',
      'A patent owner’s reply to an outstanding Office action after the interview does not remove the necessity for filing the written statement of the reasons presented at the interview as warranting favorable action.',
      'The written statement must be filed as a separate part of a reply to an Office action outstanding at the time of the interview, or as a separate paper within one month from the date of the interview, whichever is later.',
      'An interview does not remove the necessity for reply to Office actions as specified in 37 CFR 1.111.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.560(a): "[r]equests that reexamination requesters participate in interviews with examiners will not be granted" — third party requesters do NOT have the option of attending. (A), (C), (D) and (E) each track § 1.560(b) accurately.',
  },
  {
    id: 'uspto-apr02-am-15',
    topicId: 7,
    subtopic: 'Death of Practitioner — Power of Attorney (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Able is a registered solo practitioner. Ben asks Able to prepare and prosecute an application for a utility patent. As part of the application, Able prepares a declaration and power of attorney, which Ben reviews and signs. Able files the application, the declaration, and power of attorney with the USPTO. Able quickly recognizes that help is necessary and contacts another registered practitioner, Chris, who often assists Able in such instances. Able, with Ben’s consent, sends a proper associate power of attorney to the Office for Ben’s application and directs that correspondence be sent to Chris. The examiner in the application takes up the application in the regular course of examination and sends out a rejection in an Office action. Chris sends a copy of the action to Ben to obtain Ben’s comments on a proposed response. Unfortunately, after the first Office action, Able becomes terminally ill and dies. Ben does not know what to do, so Ben calls the examiner at the number on the Office action and explains that A died and Ben is worried how to proceed. Which of the following statement(s) is/are true?',
    options: [
      'Chris should inform Ben that the Office will not correspond with both the registered representative and the applicant and therefore, Ben should not have any further contact with the Office and let Chris send in a proper response.',
      'Ben should send in a new power of attorney for anyone Ben intends to represent him before the Office.',
      'Ben should execute and sent to the USPTO a new power of attorney for any registered patent practitioner that Ben intends to have represent him before the Office.',
      '(B) and (C).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 406: the power of a principal attorney is revoked or terminated by death, which also terminates the powers of those the principal appointed — so Chris’s associate power is revoked and Ben must execute a new power for a REGISTERED practitioner. (A) is incorrect (and the Office will send correspondence to both Chris and Ben on notification of the death); (B) is not best because it would allow appointing a non-practitioner and does not require execution.',
  },
  {
    id: 'uspto-apr02-am-16',
    topicId: 2,
    subtopic: 'Issue Fee Payment — Certificate of Mailing (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Jill, a registered patent agent, receives a Notice of Allowance from the USPTO with a mail date of November 13, 2001, regarding a utility patent application for an improved garden hose which she had filed on behalf of one of her small entity clients. The Notice of Allowance specifies a sum that must be paid within three months of the mailing date to avoid abandonment. The sum specified includes both the issue fee and the publication fee. As a result of a small fire in her office building, Jill is unable to resurrect her files until the last day of the three month period. Jill mails a letter to the USPTO on February 13, 2002 using the U.S. Postal Service. Jill does not employ the procedures of 37 CFR 1.8 or 1.10 to mail the letter. The letter is received in the USPTO on February 15, 2002. The letter correctly identifies the application. The letter authorizes the USPTO to charge the proper issue fee for a small entity to her deposit account. The account has been identified in a previously filed authorization to charge fees. At the time the letter was filed in the USPTO, the account had a balance of $1000.00 in funds. Nothing in the letter authorized payment of the publication fee, no petition for an extension of time was filed, and an Office-provided issue fee transmittal form was not filed. No postal emergency was involved in filing the letter. Which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'The application will become abandoned because Jill did not authorize payment of the publication fee.',
      'The application will not become abandoned because the authorization to charge fees operates as a request to charge the correct fees to any deposit account identified in a previously filed authorization to charge fees.',
      'The application will become abandoned because Jill’s letter did not include a petition for an extension of time accompanied by the proper fee.',
      'The application will become abandoned because a completed Office-provided issue fee transmittal form, PTOL-85B, did not accompany Jill’s letter.',
      'The application will become abandoned because Jill’s letter was not timely filed in the USPTO and it was not mailed in accordance with the provisions of 37 CFR 1.8 or 1.10.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct. Without the certificate-of-mailing/Express Mail procedures of 37 CFR § 1.8 or § 1.10, the filing date of the letter is its RECEIPT date — February 15, 2002, after the non-extendable statutory three-month period (37 CFR § 1.311(a); 35 U.S.C. § 151) that expired February 13, 2002. (C) is wrong because the period is statutory and not extendable by petition; (A), (B) and (D) misstate the ground — § 1.311(b) authorization mechanics do not cure a late-received payment.',
  },
  {
    id: 'uspto-apr02-am-17',
    topicId: 2,
    subtopic: 'Patent Term Adjustment Eligibility (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which one of the following applications is eligible for Patent Term Adjustment under the Patent Term Guarantee Act of 1999?',
    options: [
      'A plant application filed June 8, 1995.',
      'A utility application filed June 8, 1995.',
      'A design application filed May 29, 2000.',
      'A continued prosecution application (CPA) filed on June 6, 2001 where the CPA is based upon a plant application originally filed on February 2, 2000.',
      'A utility application originally filed on February 2, 2000 when a request for continued examination (RCE) was filed on June 6, 2001.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. An original plant or utility application filed on or after May 29, 2000 is eligible for patent term adjustment (35 U.S.C. § 154(b); 37 CFR § 1.702; MPEP § 2730), and a CPA under 37 CFR § 1.53(d) is a NEW (continuing) application — so a CPA filed on or after May 29, 2000 is eligible. (A)/(B): pre-2000 filings may accrue only the more limited patent term extension. (C): design applications are not eligible. (E): an RCE is not a new application and does not make a pre-May 29, 2000 application eligible.',
  },
  {
    id: 'uspto-apr02-am-18',
    topicId: 1,
    subtopic: 'Written Description — Possession (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] To satisfy the written description requirement of the first paragraph of 35 U.S.C. § 112, an applicant must show possession of the invention. An applicant’s lack of possession of the invention may be evidenced by:',
    options: [
      'Describing an actual reduction to practice of the claimed invention.',
      'Describing the claimed invention with all of its limitations using such descriptive means as words, structures, figures, diagrams, and formulas that fully set forth the claimed invention.',
      'Requiring an essential feature in the original claims, where the feature is not described in the specification or the claims, and is not conventional in the art or known to one of ordinary skill in the art.',
      'Amending a claim to add a limitation that is supported in the specification through implicit or inherent disclosure.',
      'Amending a claim to correct an obvious error by the appropriate correction.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. Written Description Guidelines, 66 F.R. 1099, 1105 (Jan. 5, 2001): "The claimed invention as a whole may not be adequately described if the claims require an essential or critical feature that is not described in the specification and is not conventional in the art or known to one of ordinary skill in the art." (A) and (B) are ways of SHOWING possession; (D) is permitted (implicit/inherent support suffices); (E) correcting an obvious error is not new matter.',
  },
  {
    id: 'uspto-apr02-am-19',
    topicId: 3,
    subtopic: 'RCE vs CPA by Application Type (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] On June 9, 2000, you file two complete patent applications on behalf of your client, ABC Inc. The subject matter of the patent applications relates to a new automotive body design. One of the applications is filed as a utility application (A#1), and other is filed as a design application (A#2). Prosecution of each application moves forward independently of each other, and you receive final office actions in each application rejecting the respective claim(s) in each application. Your client, in consultation with you, decides that she would rather pursue prosecution in each case rather than appeal the final rejections. Which of following options is available to you under the USPTO rules and procedures?',
    options: [
      'File a request for continuing examination (RCE) for both A#1 and A#2.',
      'File a request for continuing examination (RCE) for A#1 and a continuing prosecution application (CPA) for A#2.',
      'File a request for continuing examination (RCE) for A#2 but not A#1.',
      'File a continuing prosecution application (CPA) for both A#1 and A#2.',
      'File a continuing prosecution application (CPA) for A#1 but not A#2.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). A design application remains eligible for CPA procedure (37 CFR § 1.53(d)), while RCE procedure is not available for design applications (37 CFR § 1.114(e)) — so A#2 takes a CPA. The utility application A#1, filed on or after May 29, 2000, cannot use CPA practice (so (D)/(E) fail) but can use an RCE. (A) and (C) fail because a design application cannot take an RCE.',
  },
  {
    id: 'uspto-apr02-am-20',
    topicId: 2,
    subtopic: 'Status Information — 35 U.S.C. § 122 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] J. Q. Practitioner represents the IMAKECOPY Corp., which is an importer of widgets into the USA. At the request of his client, J. Q. Practitioner is reviewing the prosecution history of a published patent application filed under 35 U.S.C. § 111, that contains process claims for making widgets and other claims directed to the widget products. The application lists Rob M. Blind as the inventor and Wesue Corp. as the assignee. Rob M. Blind is an employee of the Wesue Corp. which is a competitor of the IMAKECOPY Corp. The prosecution history of the published patent application contains a restriction requirement made by the examiner followed by an election of the process claims by the applicant, and cancellation of the non-elected product claims. No related patent applications are referenced in the published patent application or its prosecution history. A search of public USPTO databases indicates no divisional patent application has been published or issued as a patent. J. Q. Practitioner wants to obtain more information concerning the cancelled product claims. Which of the following statements is true?',
    options: [
      'J. Q. Practitioner cannot obtain other information because no information about pending unpublished applications is available under 35 U.S.C. § 122, except for previously filed applications.',
      'J. Q. Practitioner may obtain a copy of the originally filed application and a copy of all unpublished divisional applications containing the non-elected product claims.',
      'J. Q. Practitioner may obtain a copy of all unpublished applications including their prosecution histories for any patent application containing the non-elected product claims.',
      'J. Q. Practitioner may file a written request for the File Information Unit (FIU) to ascertain if there are any earlier or subsequently filed applications claiming benefit under 35 U.S.C. § 120 of the published application and their status.',
      'J. Q. Practitioner may request, either in person or in writing, that the File Information Unit (FIU) ascertain and disclose if there are any subsequently filed applications claiming benefit under 35 U.S.C. § 120 of the published application and their status.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 37 CFR § 1.14(b)(4); MPEP § 102: the Office may provide STATUS information for pending applications that claim the benefit of the filing date of an application for which status information may be provided — i.e., for subsequently filed benefit-claiming applications. (B)/(C) fail because only status information, not copies, is available; (D) fails because status is given only for subsequently filed applications.',
  },
  {
    id: 'uspto-apr02-am-21',
    topicId: 5,
    subtopic: 'Certificate of Correction — Third Party (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Company X competes with Patentee Y. In response to an accurate notification from Company X, acting as a third party, that Patentee Y’s patent contains a printing error, incurred through the fault of the USPTO, the USPTO:',
    options: [
      'must issue a certificate of correction.',
      'must reprint the patent to correct the printing error.',
      'need not respond to Company X.',
      'should include Company X’s notification in the patent file.',
      'must notify Company X of any USPTO decision not to correct the printing error.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 CFR § 1.322(a)(2)(i): "There is no obligation on the Office to act on or respond to a submission of information or request to issue a certificate of correction by a third party." See MPEP § 1480. (A), (B), (E) wrongly impose mandatory action — 35 U.S.C. § 254 leaves response to the Director’s discretion; (D) is wrong because third-party papers under this section are not made of record (§ 1.322(a)(2)(ii)).',
  },
  {
    id: 'uspto-apr02-am-22',
    topicId: 1,
    subtopic: 'Transitional Phrases — Consisting Of (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A patent application filed in the USPTO contains the following dependent claim: “Claim 2. The method of Claim 1, further consisting of the step of cooling the mixture to a temperature of 32° F.” Following proper USPTO practices and procedures, from which of the following claims does Claim 2 not properly depend?',
    options: [
      'Claim 1. A method of making liquid compound A consisting of the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A comprising the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A including the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A characterized by the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '(C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 2111.03: "consisting of" excludes any step not specified in the claim, so a dependent claim cannot ADD a cooling step to a closed claim. "Comprising" (B) is open-ended, and "including" (C) and "characterized by" (D) are synonymous with comprising — those parents accept the added step.',
  },
  {
    id: 'uspto-apr02-am-23',
    topicId: 4,
    subtopic: 'PCT Article 22 — 30-Month National Stage (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] An international application designating the United States is filed with the USPTO in its capacity as a Receiving Office, which properly accords the application an international filing date of 02 August 2001. The application properly claims priority solely to an earlier British application filed 02 August 2000. A Demand was not filed within 19 months from this priority date. On 10 April 2002, applicant filed a “Transmittal Letter to the United States Designated/Elected Office (DO/EO/US) Concerning a Filing Under 35 U.S.C. § 371” (Form PTO-1390), which identified the international application, and was accompanied by payment in full of the basic national fee. An oath or declaration, as required under 35 U.S.C. § 371(c)(4), was not submitted. As of 10 April 2002, the U.S. national stage application was:',
    options: [
      'Abandoned for failure to submit the basic national fee within 20 months from the priority date.',
      'Abandoned for failure to submit the basic national fee and copy of the international application within 20 months from the priority date.',
      'Abandoned for failure to submit the basic national fee, copy of the international application, and oath or declaration within 20 months from the priority date.',
      'Abandoned for failure to submit the basic national fee within 20 months from the international filing date.',
      'Not abandoned.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (E). PCT Article 22 was amended to permit the applicant to delay national-stage entry until 30 months from the earliest claimed priority date, regardless of whether a Demand was filed within 19 months — effective for international applications whose former 20-month time limit expired on or after 1 April 2002, as here. [Historical practice: this question captures the 2002 transition; the 30-month rule is now standard.]',
  },
  {
    id: 'uspto-apr02-am-24',
    topicId: 3,
    subtopic: 'Final Rejection — Declaration Ignored (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Mr. Brick, the inventor, files an application with the USPTO on January 2, 2001 containing a single claim for his invention: a new bouncing ball called “Y”. Brick receives a first Office action dated June 4, 2001 from the primary examiner handling Brick’s application. The examiner rejected Brick’s claim only under 35 U.S.C. § 103 on the grounds that Reference X teaches a bouncing ball called “Q,” and that although “Y” and “Q” are not the same, it would have been obvious to one of ordinary skill to make changes to the “Q” ball in order to obtain a ball just like Brick’s “Y” ball. On August 2, 2001, Brick responds by stating that his new “Y” ball bounces unexpectedly higher than the “Q” ball described in Reference X. Brick includes a declaration, signed by Mrs. Kane, that includes extensive data comparing the bouncing results for the “Y” and “Q” balls and showing that the “Y” ball bounces unexpectedly higher than the “Q” ball. Brick argues that the rejection under 35 U.S.C. § 103 should be withdrawn because he has proven that, in view of the unexpectedly higher bounce of the “Y” ball as compared to the “Q” ball, it would not have been obvious to one of ordinary skill in the art to make changes to the “Q” ball to obtain Brick’s “Y” ball. On October 2, 2001, Brick receives a final rejection from the examiner. The rejection states, in its entirety: “The response has been reviewed but has not been found persuasive as to error in the rejection. The claim is finally rejected under 35 U.S.C. § 103 for the reasons given in the first Office action.” Brick believes he is entitled to a patent to his new bouncing ball “Y.” How should Brick proceed?',
    options: [
      'Brick should give up because the declaration did not persuade the examiner of the merits of Brick’s invention.',
      'Brick should timely file a Request for Reconsideration asking the examiner to reconsider the rejection on the basis of the Kane declaration and, as a precaution against the Request for Reconsideration being unsuccessful, also timely file a Notice of Appeal.',
      'Brick should respond by submitting a request for reconsideration presenting an argument that Reference X does not provide an enabling disclosure for a new ball with the unexpectedly higher bounce of his “Y” ball.',
      'Brick should respond by submitting a request for reconsideration presenting an argument that Reference X does not provide a written description for a new ball with the unexpectedly higher bounce of his “Y” ball.',
      'Brick should respond by submitting a request for reconsideration presenting an argument the declaration data proves that the “Q” ball and the “Y” are not identical.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. It is inappropriate to disregard admissible evidence (Stratoflex v. Aeroquip); the examiner neither analyzed the declaration data nor reweighed the prima facie case in light of it (In re Hedges). Brick should request reconsideration under 37 CFR § 1.116 and file a Notice of Appeal to preserve Board review. (C)/(D) are immaterial — any enablement question would concern the reference’s "Q" ball, not applicant’s; (E) misses the point — a § 103 rejection already concedes the balls are not identical.',
  },
  {
    id: 'uspto-apr02-am-25',
    topicId: 2,
    subtopic: 'Patent Term — Interference Adjustment (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] John filed a utility patent application for a high strength steel composition on June 9, 1997. During prosecution of the application, an interference under 35 U.S.C. § 135(a) was declared on June 9, 1998 between John’s application and an unexpired patent. Subsequently, the interference was terminated in John’s favor on June 9, 2000. The year 2000 was a leap year having 366 days. Ultimately, John’s application was allowed and issued as a patent on June 12, 2001. Based on proper USPTO practice and procedure, and absent any other events necessitating adjustment of the patent term, when should John’s patent expire?',
    options: [
      'Twenty (20) years from issue date.',
      'Twenty (20) years and one day from filing date.',
      'Twenty (20) years plus three years inasmuch as granting of the patent was delayed by the interference.',
      'Twenty (20) years plus the number of days in the period beginning the date prosecution is suspended in another application that is not in the interference, but is related to the application in interference.',
      'Twenty (20) years plus the period beginning on the date the interference was declared and ending on the date that the interference was terminated with respect to the application.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct. 35 U.S.C. § 154(a)(2): the term runs 20 years from the U.S. filing date; for applications filed on or after June 8, 1995 and before May 29, 2000, 37 CFR § 1.701(c)(1)(i) extends the term by the number of days from the date the interference was declared to the date it was terminated with respect to the application. (D) describes § 1.701(c)(1)(ii), which governs a different application whose prosecution was suspended due to an interference not involving it.',
  },
  {
    id: 'uspto-apr02-am-26',
    topicId: 2,
    subtopic: 'Fees, Refunds and Filing Formalities (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'If a practitioner, “by mistake,” files an application and basic filing fee, the submission of the filing fee with the application is treated by the Office as not a fee paid by mistake, and the fee will not be refunded.',
      'If, in April 2001, a practitioner files an application, properly establishes the applicant’s small entity status, and “by mistake” pays the filing fee by submitting a check drawn in the amount that is twice the amount of the small entity filing fee, a refund of the excess fee may be obtained upon request filed any time during pendency of the application and life of any patent granted on the application.',
      'The paragraphs of the specification of an original utility patent application filed in January 2001 may, but are not required to be numbered at the time the application is filed.',
      'If a provisional application is filed in a language other than English, an English language translation of the non-English language provisional application will not be required in the provisional application.',
      'If a table having more than 50 pages of text is submitted on compact disc, the specification of a patent application must contain an incorporation-by-reference of the material on a compact disc in a separate paragraph, identifying each compact disc by the names of the files contained on each compact disc, their date of creation, and their sizes in bytes.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. Under 37 CFR § 1.26(b), "Any request for refund must be filed within two years from the date the fee was paid" — not any time during pendency and patent life. See 65 F.R. 54604, 54608 (Sept. 8, 2000). (A) tracks § 1.26(a); (C) tracks § 1.52(b)(6); (D) tracks § 1.52(d)(2); (E) tracks § 1.52(e)(5).',
  },
  {
    id: 'uspto-apr02-am-27',
    topicId: 3,
    subtopic: 'Restriction — Timely Responsive Reply (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] James Salt developed an environmentally friendly technique for controlling deer overpopulation, discovering a non-hormonal substance XYZ (“Antiagra”) that suppresses sexual function in male deer, dispersed in salt-lick blocks. The only relevant prior art is a patent to Deere disclosing a salt lick sprayed with a hormonal substance that suppresses ovulation in does. You prepare and file a fully enabling application with claims 1-5 to the substance, claims 6-9 to the laced salt lick, claims 9-14 to the method of forming it, and claims 14-20 to the population-control method, properly establishing small entity status. Upon initial examination, the patent examiner issues a requirement for restriction on the basis that the application claims two or more independent and distinct inventions — requiring an election between (a) claims 1-5; (b) claims 6-14; and (3) claims 15-20. The restriction requirement was set forth in an Office action dated December 12, 2001, and the examiner set a one month (not less than 30 days) shortened statutory period for response. December has 31 calendar days. Which of the following is most likely to be treated by the USPTO as a timely, fully responsive reply to the Office action.',
    options: [
      'You contact the examiner on the telephone on December 27, 2001 and make an oral election of the subject matter of claims 6-14 without traverse, and request cancellation of claims 1-5 and 15-20 without prejudice to resubmission of those claims in a continuation application. You do not, however, subsequently confirm the substance of the telephone conversation in writing and the examiner does not complete an Interview Summary Record.',
      'On February 12, 2002, you file a Reply to Office Action, a Petition for One Month Extension of Time and all necessary fees. The Reply to Office Action traverses the restriction requirement on the basis that the requirement would force the small entity applicant to file multiple patent applications and is therefore unduly burdensome. The Reply to Office Action requests reconsideration of the restriction without making an election.',
      'On February 12, 2002, you file a Reply to Office Action, a Petition for Two Month Extension of Time and all necessary fees. The Reply to Office Action does not make an election. Instead, the Reply to Office Action traverses the restriction requirement and requests reconsideration of the restriction without specifically pointing out the supposed errors in the examiner’s action.',
      'On February 14, 2002, you file a Reply to Office Action, a Petition for One Month Extension of Time and all necessary fees. The Reply to Office Action traverses the restriction requirement on the basis that the claims as originally presented in a single application do not pose a serious burden on the examiner, and therefore requests reconsideration of the election requirement. The Reply to Office Action provisionally elects the subject matter of claims 6-14. There is no authorization to charge a deposit account.',
      'On February 12, 2002, you file a Reply to Office Action, a Petition for One Month Extension of Time and all necessary fees. The Reply to Office Action elects claims 6-14 without traverse.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (E). The original deadline was January 12, 2002; a one-month extension makes a February 12, 2002 filing timely, and the reply makes the required election. (A) fails — the reply must be in writing (MPEP § 818.03(a)); (B) fails — a proper reply must include an election even when traversing (MPEP § 818.03(b)), and small entity status does not change restriction practice; (C) makes no election and no specific traversal; (D) is untimely (February 14 with only a one-month extension).',
  },
  {
    id: 'uspto-apr02-am-28',
    topicId: 3,
    subtopic: 'Arguing Limitations Actually Claimed (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] (Deer-population facts continued.) Claim 6 of the application reads: “A composition for reducing the pregnancy rate among wild deer population, said composition comprising salt and a non-hormonal substance that, when ingested by a male deer, is operable to suppress sexual function in the male deer.” Claim 7 reads: “The composition of claim 6, wherein said non-hormonal substance is XYZ.” Claim 8 reads, “The composition of claim 6, wherein said composition is formed in a block and wherein said non-hormonal substance is interspersed substantially evenly throughout said block.” Each of these claims is fully supported by the specification. An Office action is mailed March 15, 2002. Claim 6 was rejected under 35 U.S.C. § 103 as being unpatentable over the Deere patent. Which of the following arguments, if presented in a timely reply to the March 15 Office action, is most likely to persuade the examiner to remove the § 103 rejection without presenting unpersuasive arguments?',
    options: [
      '“The invention of claim 6 provides an advantageous feature in that the substance that helps reduce the pregnancy rate is interspersed throughout the salt lick. Thus, the present invention is effective to reduce the pregnancy rate in deer so long as any portion of the salt lick is available to deer. In contrast, the Deere patent utilizes a substance that is sprayed on the outer surface of the salt lick and, therefore, is effective only so long as the outer portion of the salt lick is available.”',
      '“The invention of claim 6 provides an advantageous feature in that the substance that helps reduce the pregnancy rate is interspersed throughout the salt lick. Thus, the present invention is effective to reduce the pregnancy rate in deer so long as any portion of the salt lick is available to deer. In contrast, the Deere patent utilizes a substance that is sprayed on the outer surface of the salt lick and, therefore, is effective only so long as the outer portion of the salt lick is available.”',
      '“In contrast to the present invention, the Deere patent calls for the use of a hormonal substance that suppresses ovulation in female deer. Deere neither discloses nor suggests the use of a non-hormonal substance that, when ingested by a male deer, is operable to suppress sexual function in the male deer, as set forth in claim 6.”',
      '“The present invention relates to a technique for reducing deer overpopulation by causing male deer to ingest a novel substance (XYZ) that is operable to suppress sexual function in the male deer. The Deere patent neither discloses nor suggests such a technique and, therefore, claim 6 is neither anticipated nor rendered obvious by the Deere patent.”',
      '“Applicant was aware of the Deere patent prior to filing of the present application, and the claims were carefully drafted to distinguish the present invention over the Deere patent. Accordingly, reconsideration and withdrawal of the § 103 rejection of claim 6 is respectfully requested.”',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (C) — it distinguishes on limitations actually recited in claim 6 (non-hormonal substance, ingestion by a MALE deer, suppression of male sexual function). (A) and (B) (identical in the official paper) argue interspersed-throughout, a feature of claim 8 not recited in claim 6; (D) relies on XYZ, which appears only in claim 7; (E) is a mere conclusory statement with no distinguishing features.',
  },
  {
    id: 'uspto-apr02-am-29',
    topicId: 0,
    subtopic: 'Analogous Art — § 103 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] (Deer-population facts continued.) Claim 15 of the application reads: “A method for reducing pregnancy rate in wild deer population comprising the step of placing at least one salt lick containing an effective amount of XYZ in a location accessible to wild male deer so that XYZ is ingested by said male deer.” The specification provides adequate disclosure as to what constitutes an “effective amount” of XYZ. In addition to the Deere patent, the examiner locates a prior art patent to John Doe that discloses the non-hormonal substance XYZ for use as a softening agent in skin cream. There is no disclosure or suggestion in the Doe patent of any other potential use for XYZ. Which of the following statements is most consistent with proper USPTO practice and procedure?',
    options: [
      'The Examiner may properly reject claim 15 under 35 U.S.C. § 103 as being obvious over Deere in view of Doe because Deere teaches the method of distributing salt licks treated with a substance to reduce pregnancy rates and suppression of sexual activity in male deer is merely an inherent characteristic of a known substance XYZ.',
      'The examiner may not rely on the Doe patent in a 35 U.S.C. § 103 obviousness rejection because there is no evidence that Salt was aware of its teachings at the time the invention was made and therefore the invention could not have been obvious to Salt at that time.',
      'The examiner may rely on the Doe patent in making an obviousness rejection under 35 U.S.C. § 103 only if the Doe patent is in the field of Salt’s endeavor or, if not in that field, then reasonably pertinent to the problem with which Salt was concerned.',
      'The examiner may properly reject claim 15 under the first paragraph of 35 U.S.C. § 112 because the specification is inadequate to enable a person skilled in the art to which it pertains to practice the invention.',
      'The examiner may properly reject claim 15 under the second paragraph of 35 U.S.C. § 112 because the recitation of “an effective amount of XYZ” renders the claim indefinite.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (C) — the analogous-art test, MPEP § 2141.01(a): a reference is available for § 103 only if in the field of the inventor’s endeavor or reasonably pertinent to the inventor’s problem. (A) fails — no teaching or suggestion to combine, and what is inherent is not necessarily obvious; (B) misstates the test — obviousness is judged from one of ordinary skill, not the inventor’s actual awareness; (D)/(E) contradict the stated facts (fully enabling, "effective amount" adequately disclosed).',
  },
  {
    id: 'uspto-apr02-am-30',
    topicId: 1,
    subtopic: 'Multiple Dependent Claims (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] The following statements relate to “multiple dependent claims.” Which statement is not in accord with proper USPTO practice and procedure?',
    options: [
      'A multiple dependent claim contains all the limitations of all the alternative claims to which it refers.',
      'A multiple dependent claim contains in any one embodiment only those limitations of the particular claim referred to for the embodiment under consideration.',
      'A multiple dependent claim must be considered in the same manner as a plurality of single dependent claims.',
      'Restriction may be required between the embodiments of a multiple dependent claim.',
      'The limitations or elements of each claim incorporated by reference into a multiple dependent claim must be considered separately.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it is INCONSISTENT with 35 U.S.C. § 112 and MPEP § 608.01(n), subpart I.B.4: a multiple dependent claim does not contain all limitations of all alternatives; in any one embodiment it contains only the limitations of the particular claim referred to. (B), (C), (E) state the rule correctly, and (D) is consistent with MPEP § 608.01(n), subpart I.C.',
  },
  {
    id: 'uspto-apr02-am-31',
    topicId: 0,
    subtopic: 'Overcoming § 102(a) (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following practices or procedures may be properly employed to overcome a rejection properly based on 35 U.S.C. § 102(a)?',
    options: [
      'Perfecting a claim to priority under 35 U.S.C. § 119(a)-(d) based on a foreign application having a foreign priority filing date that antedates the reference.',
      'Filing a declaration under 37 CFR 1.131 showing that the cited prior art antedates the invention.',
      'Filing a declaration under 37 CFR 1.132 showing that the reference invention is by “others.”',
      'Perfecting priority under 35 U.S.C. §§ 119(e) or 120 by, in part, amending the declaration of the application to contain a specific reference to a prior application having a filing date prior to the reference.',
      '(A), (B) (C), and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (A). See MPEP § 706.02(b) ("Overcoming a 35 U.S.C. § 102 Rejection Based on a Printed Publication or Patent"). (B) and (C) as stated would SUPPORT the rejection (a 1.131 declaration must show the invention antedates the ART, and a 1.132 declaration must show the reference work is NOT by others); (D) fails because benefit under §§ 119(e)/120 is perfected by amending the SPECIFICATION (not the declaration) to specifically reference the prior application.',
  },
  {
    id: 'uspto-apr02-am-32',
    topicId: 0,
    subtopic: 'Public Use, Experimental Use, Joint Invention (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Johnnie owns a supermarket store in Cleveland, Ohio, and is constantly frustrated when little children drop their chewing gum on Johnnie’s clean floor in the supermarket. In her spare time, Johnnie develops an entirely novel type of coating material that she applies to floor tile. The coating material resists adhesion to chewing gum. In order to check out the effectiveness of the floor tile coating material, on December 31, 2000, she secretly covers the floor tiles in her supermarket with the new chewing gum resistant floor tile coating material. Johnnie is amazed at the results inasmuch as cleaning the floor was never easier. On January 30, 2001, Johnnie, satisfied with the experimental use results, ceased testing the use of the coating material. The ability of the coating material to withstand chewing gum adhesion continued unabated throughout the remainder of 2001. On January 1, 2002, one of Johnnie’s many customers, James, remarked at how clean the floor looked. Johnnie then told James of her invention. James thinks for one moment and suggests that the floor tile coating material may be useful in microwave ovens, so that food will not stick to the interior sides of the microwave oven. James discusses getting patent protection with Johnnie. Which of the following is true?',
    options: [
      'Johnnie could never be entitled to a patent on a floor tile in combination with a coating material affixed to the outer surface of the tile.',
      'James can be named as a coinventor with Johnnie in a patent application claiming a microwave oven wherein the internal surfaces of the oven are coated with the coating material.',
      'Since for one year Johnnie told nobody that the floor tile in her supermarket contained the new chewing gum resistant coating material, she would never be barred from obtaining patent protection for the floor coating material.',
      'Use of the floor tile coating material in microwave ovens would have been obvious to one of ordinary skill in the art, since James thought of it within seconds after first learning of the floor tile coating material, and James was not skilled in the art.',
      'The floor tile having the coating material affixed to the outer surface of the tile, an article of manufacture, would not be patentable as of January 1, 2002 inasmuch as the article was in public use on the supermarket floor for one year.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (B). Johnnie developed the material and James conceived its use in microwave ovens — they rightfully could be joint inventors of that article. As to (A)/(C): public use began when experimental use ended (January 30, 2001), even though the public was unaware — use in a public place counts; the one-year § 102(b) clock ran from then, so Johnnie could still file before January 30, 2002 (making (E) wrong as of January 1, 2002). (D) is wrong — obviousness is measured against one of ordinary skill and the prior art, not by how quickly the idea occurred to an unskilled observer.',
  },
  {
    id: 'uspto-apr02-am-33',
    topicId: 3,
    subtopic: 'Requirement for Information — 37 CFR 1.105 (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following may properly be required to submit information in reply to a requirement for information under 37 CFR 1.105 in a patent application filed in December 2002?',
    options: [
      'A named inventor in the application.',
      'An assignee of the entire interest in the application.',
      'An attorney who prepares and prosecutes the application.',
      'All of the above.',
      '(A) or (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.105 and § 1.56(c): a named inventor and the preparing/prosecuting attorney are § 1.56(c) individuals, and an assignee of the entire interest is specified in § 1.105(a)(1) — all three may be required to submit information.',
  },
  {
    id: 'uspto-apr02-am-34',
    topicId: 3,
    subtopic: 'Amendment Format — 37 CFR 1.121 (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant received a final rejection dated and mailed Wednesday, February 28, 2001. The final rejection set a three month shortened statutory period for reply. In reply, applicant filed an amendment on Wednesday, March 21, 2001. In the amendment, applicant requested that block diagrams, figures 32-34, be amended by inserting the term --computer-- in place of [CPU] in block “2” of each block diagram. Applicant further supplied a clean version of the entire set of pending claims. Applicant did not provide the proposed changes to the drawings on separate sheets marked in red nor did the applicant supply a marked-up version of any claim. The examiner upon receipt and review of the amendment discovered that the applicant made changes to pending claims 2 and 15 and that the applicant added claims 21-25 to the application. The examiner in an Advisory Action notifies the applicant that the amendment fails to comply with the requirements of 37 CFR 1.121. Which of the following answers is most correct?',
    options: [
      'Applicant is given a time period of one month or thirty days from the mailing date of the Advisory Action, whichever is longer, within which to supply the omission or correction in order to avoid abandonment. This time period is in addition to any remaining period of time set in the final rejection.',
      'Applicant may not provide a clean version of the entire set of pending claims because the applicant may only consolidate all previous versions of pending claims into a single clean version in an amendment after a non-final Office action.',
      'Applicant must submit the proposed changes to figures 32-34 on a separate paper showing the proposed changes in red and a marked up version of new claims 21-25 as required by 37 CFR 1.121(c).',
      'Applicant should request reconsideration by the examiner, pointing out that the Final Rejection was mailed on February 28, 2001, which precedes the March 1, 2001 effective date of the changes to patent rule 37 CFR 1.121.',
      'Applicant must submit the changes to figures 32-34 on separate paper showing the proposed changes in red and a marked up version of rewritten claims 2 and 15 showing all changes (relative to the previous version of claims 2 and 15) shown by any conventional marking system as required by 37 CFR 1.121(c). Applicant should also indicate the status of claims 2 and 15, e.g. “amended,” “twice amended,” etc. on both the clean version of the claims and the marked up version.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 CFR § 1.121(c) and (d) (2001 practice) and MPEP § 714: drawing changes go on separate paper marked in red, and amended claims 2 and 15 require a marked-up version showing all changes with status indicators; newly ADDED claims 21-25 need no marked-up version. (A) is wrong — after final, no new period is set; applicant may resubmit within the time remaining in the final-rejection period (MPEP § 714.22). (B) is wrong — consolidation into a clean version may be done at any time (MPEP § 714.22(a)). [Historical practice: the marked-up/clean format of former § 1.121 has since been replaced.]',
  },
  {
    id: 'uspto-apr02-am-35',
    topicId: 5,
    subtopic: 'Reissue — Restriction to Unclaimed Method (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Joe Inventor received a patent in July 1999, containing claims to both an article and an apparatus. When filed in the USPTO, the application contained disclosure of a method, but the method was not claimed. The patent contained the same disclosure of the method, but the method had never been claimed in the application. In May 2001, Joe asks Pete Practitioner to file a reissue application to add claims to the method disclosed in the specification. Once filed, which of the following will most likely occur during the prosecution of the reissue application in accordance with published USPTO practice and procedure?',
    options: [
      'The examiner should reject the added method claims on the basis of not being for the invention claimed in the original patent, under 35 U.S.C. § 251, citing In re Rowand, 187 USPQ 487, and allow the original unamended article and apparatus patent claims in the reissue application.',
      'Following a restriction requirement by the examiner in the reissue application, the original unamended article and apparatus patent claims will be constructively elected, examined, and, if found allowable, passed to issue, while the non-elected method claims should be filed in a divisional application.',
      'Following a restriction requirement in the reissue application and the filing of a divisional application to claim the method, the applicant should request a duplicate copy of the original patent so that a copy of said patent can be surrendered in each reissue application.',
      'Following a restriction requirement by the examiner in the reissue application, the original unamended article and apparatus patent claims will be considered constructively elected; if after examination they become allowable in unamended form, they will be held in abeyance in a withdrawn status inasmuch as no “error” under 35 U.S.C. § 251 exists, while Joe prosecutes the claims to the method in a divisional application.',
      'A three-way restriction requirement among the article, apparatus and method claims should be made by the examiner in the reissue application, and an election made by applicant. Each invention should issue in a separate reissue patent.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (D). MPEP § 1450: on restriction in a reissue between original and previously unclaimed subject matter, the original unamended patent claims are constructively elected; since the Office cannot reissue original unamended claims (no § 251 error to correct), they are held in abeyance in withdrawn status while the method is prosecuted in a divisional reissue. (A) is contrary to In re Amos (reissue applicants may claim any disclosed subject matter satisfying § 112 ¶ 1; MPEP § 1412.01); (C) fails because the original patent is surrendered only once; (E) fails because 37 CFR § 1.176 authorizes restriction only between original and previously unclaimed subject matter.',
  },
  {
    id: 'uspto-apr02-am-36',
    topicId: 1,
    subtopic: 'Claim Formalities — Recommendations (Official Apr 2002)',
    difficulty: 1,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not a USPTO recommendation or requirement?',
    options: [
      'Product and process claims should be separately grouped.',
      'Claims should be arranged in order of scope so that the first claim presented is the least restrictive.',
      'Every application should contain no more than three dependent claims.',
      'A claim which depends from a dependent claim should not be separated from that dependent claim by any claim which does not also depend from the dependent claim.',
      'Each claim should start with a capital letter and end with a period.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer — the USPTO does not require or recommend any minimum or maximum number of dependent claims (37 CFR § 1.75(c)). (A), (B), (D) are MPEP § 608.01(m)/(n) recommendations and (E) is a § 608.01(m) requirement.',
  },
  {
    id: 'uspto-apr02-am-37',
    topicId: 0,
    subtopic: '§ 135(b) vs Interference — Patent Claiming Same Invention (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Select from the following an answer which completes the following statement, such that the completed statement accords with proper USPTO practice and procedure: “When the reference in question is a noncommonly owned U.S. patent claiming the same invention as applicant, and its issue date is _____________________”',
    options: [
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'exactly one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'more than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of affidavit or declaration “swearing back” of reference.',
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of affidavit or declaration traversing the ground of rejection.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (A) is the most correct answer. MPEP § 715.05: when a noncommonly owned U.S. patent CLAIMS the same invention and issued less than one year before presentation of the claims, the remedy is via 37 CFR § 1.608 (interference), not § 1.131 — the patent can be overcome only by interference. If issued one year or more prior, a 35 U.S.C. § 135(b) rejection applies (In re McGrew). (E) fails because a § 1.132 traversal lies only where the reference shows but does not CLAIM the same invention.',
  },
  {
    id: 'uspto-apr02-am-38',
    topicId: 0,
    subtopic: 'Printed Publication — § 102(b) Dates (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant files an application claiming a nutritional supplement comprising ingredients (1) through (9) on September 6, 2001. The examiner’s search on November 12, 2001 retrieved several documents, each of which provides an enabling disclosure of a nutritional supplement comprising ingredients (1) through (9). Which of the following documents retrieved by the examiner may be properly used by the examiner to reject applicant’s claims under 35 U.S.C. § 102(b)?',
    options: [
      'An advertisement in the September 2000 issue of Dieticians and Nutritionists Health Weekly where the examiner is not able to determine the actual date of publication.',
      'A printout on November 12, 2001 by the examiner of a MEDLINE database abstract 123456 of an article by Food et al., “Nutritional supplements for infants,” published in Azerbijan Pediatrics, Vol. 33, No. 8, pp. 33-37 (September 2000). The printout does not include the date on which the MEDLINE abstract was publicly posted.',
      'A printout, on November 12, 2001 by the examiner, of a product brochure from the Internet website of PRO-BIOTICS VITAMIN CORP. The examiner determines that the brochure was posted on September 7, 2000 on the website.',
      'A Japanese patent application published on September 1, 2000.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (D) is the most correct answer. A § 102(b) reference must have been published (publicly accessible) more than one year before the September 6, 2001 filing date — the Japanese application laid open September 1, 2000 qualifies. (C) was posted September 7, 2000 — less than one year; (A) lacks proof of the actual publication date; (B) relies on a printout with no public-posting date, retrieved after filing.',
  },
  {
    id: 'uspto-apr02-am-39',
    topicId: 3,
    subtopic: 'CPA Eligibility — 37 CFR 1.53(d) (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] You are deciding whether to file continued prosecution applications (CPA) for prior applications before the earliest of payment of any issue fee on the prior application (and absent any petition under 37 CFR 1.313(c)), abandonment of the prior application, or termination of proceedings on the prior application. In which of the following circumstances is it proper to use the CPA procedure to file the application?',
    options: [
      'To file a continuation-in-part application of a prior complete nonprovisional utility application filed under 35 U.S.C. § 111(a). The nonprovisional application has an actual filing date prior to November 29, 1999.',
      'To file a divisional application of a prior complete provisional application for a utility invention filed under 35 U.S.C. § 111(b). The provisional application has an actual filing date after June 8, 1995.',
      'To file a continuation utility application of a prior complete nonprovisional utility application filed under 35 U.S.C. § 111(a). The nonprovisional application has an actual filing date prior to May 29, 2000.',
      'To file a continuation utility application of a prior complete CPA utility application. The prior CPA application has an actual filing date of June 1, 2000, and is a continuation application of a prior complete utility application filed under 35 U.S.C. § 111(a) having an actual filing date of November 28, 1999.',
      'To file a divisional application of a prior complete nonprovisional plant application filed under 35 U.S.C. § 111(a). The nonprovisional application has an actual filing date after May 29, 2000.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 CFR § 1.53(d)(1): a continuation (or divisional) of a prior complete nonprovisional utility application filed under § 111(a) BEFORE May 29, 2000 may be filed as a CPA. (A) fails — § 1.53(d) does not authorize CIPs as CPAs; (B) fails — no CPA off a provisional; (D) fails — the prior CPA itself was filed June 1, 2000 (on/after the cutoff; the 1999 grandparent date is irrelevant, see 65 FR 50092, 50093); (E) fails — plant applications filed on/after May 29, 2000 are not CPA-eligible. [Historical practice: CPA practice survives today only for design applications.]',
  },
  {
    id: 'uspto-apr02-am-40',
    topicId: 2,
    subtopic: 'Return Postcard Receipt Practice (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following identifications of document(s) set forth in a return postcard that is stamped and returned by the USPTO will suffice for the postcard receipt to serve as prima facie evidence of the USPTO’s receipt of the document(s) specified where the USPTO cannot locate the document(s)?',
    options: [
      'For all pages of a complete new application — an identification stating: “the items listed in the transmittal letter that accompanied the application”, where the registered practitioner can furnish a copy of the transmittal letter, and where the transmittal letter contained a list of the component parts of a complete application.',
      'For all pages of a complete new application — an identification stating: “a complete application”.',
      'For all pages of a complete new application containing the following components — an identification stating: “specification (including written description, claims and abstract), drawings, declaration”.',
      'For two sheets of drawings — an identification stating “2 sheets of drawings”.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 503: the return postcard itself must specifically itemize the component parts AND the number of pages of each part to serve as prima facie evidence of receipt — "2 sheets of drawings" does that. (A)/(B) fail because the postcard itself must itemize; (C) fails because page counts are missing.',
  },
  {
    id: 'uspto-apr02-am-41',
    topicId: 0,
    subtopic: 'Rule 1.131 Declarations (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Regarding an affidavit or declaration filed pursuant to 37 CFR 1.131, which of the following statements is incorrect?',
    options: [
      'The affidavit or declaration may establish a date of completion of applicant’s claimed invention before January 1, 1996 in a NAFTA country or before December 8, 1993 in a WTO member country other than a NAFTA country.',
      'The affidavit or declaration cannot be used to overcome a rejection under 35 U.S.C. § 102(e) based on a U.S. patent which claims the same patentable invention as defined in 37 CFR 1.601(n).',
      'The affidavit or declaration may be used to overcome a rejection under 35 U.S.C. § 103 based on reference to a foreign patent which qualifies as prior art under 35 U.S.C. § 102(a).',
      'The affidavit or declaration containing references to notebook entries may properly include reproductions of the notebook entries, as opposed to the original notebook pages.',
      'The affidavit or declaration must show facts establishing reduction to practice prior to the effective date of the reference, or conception of the invention prior to the effective date of the reference coupled with due diligence from prior to said date to subsequent actual reduction to practice or to the filing of the application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (A) is the best answer because it is an INCORRECT statement — it reverses the dates. 37 CFR § 1.131(a)(2): a date of completion may not be established before December 8, 1993 in a NAFTA country, or before January 1, 1996 in a WTO member country other than a NAFTA country. (B)–(E) are correct statements (§ 1.131; MPEP § 715.07; 35 U.S.C. § 104 history).',
  },
  {
    id: 'uspto-apr02-am-42',
    topicId: 3,
    subtopic: 'Bona Fide Non-Compliant Reply (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Applicant Homer filed a nonprovisional utility application on December 3, 2001 with 3 sheets of drawings. He received a non-final Office action on the merits on March 1, 2002 rejecting all claims under 35 U.S.C. § 102(b) with reference A and including objections to the drawings. The Office action set a shortened statutory period of 3 months for reply. Homer wants to submit several references in an information disclosure statement (IDS) for the examiner’s consideration. Under proper USPTO practices and procedures which of the following actions, if taken, would avoid abandonment?',
    options: [
      'Homer timely files a continued prosecution application under 37 CFR 1.53(d) with an IDS and required fees.',
      'Homer timely files a request for continued examination under 37 CFR 1.114 with an IDS and required fees.',
      'Homer timely files a request for suspension of action under 37 CFR 1.103 with an IDS and required fees.',
      'Homer timely files a photocopy of the originally filed claims with proposed amendments marked in red, arguments that support the claims are patentable over the reference, proposed drawing corrections, an IDS, and any required fees or certification.',
      'Homer timely files conclusory arguments that the examiner’s rejection is without merit and has no statutory basis.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 714.03: Homer’s reply is a bona fide attempt to advance the application; a non-compliant (37 CFR § 1.121) but bona fide amendment earns a new one-month/30-day period to correct (37 CFR § 1.135(c)). (A) fails — a December 3, 2001 application is not CPA-eligible; (B) fails — prosecution is not closed, so no RCE lies (§ 1.114(a)); (C) fails — action cannot be suspended with an outstanding Office action awaiting reply (§ 1.103; MPEP § 709); (E) is not a bona fide § 1.111 reply and ignores the drawing objections.',
  },
  {
    id: 'uspto-apr02-am-43',
    topicId: 5,
    subtopic: 'Certificate of Correction — Office Mistake (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] The Commissioner may issue a certificate of correction to correct a mistake in a patent, incurred through the fault of the Office:',
    options: [
      'only if demanded by a third party having standing with the Office and the third party pays the fee required by 37 CFR 1.20(a).',
      'without notifying the patentee, (including any assignee of record) if the correction is of a nature that the meaning intended is obvious from the context of the portion of the patent where the mistake occurs.',
      'only if the request for correction relates to a patent involved in an interference.',
      'acting sua sponte, after first notifying the patentee, for mistakes that the Office discovers.',
      'only if patentee or the patentee’s assignee makes a request.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 254, 37 CFR § 1.322(a)(1)(ii), MPEP § 1480: the Office may act sua sponte on mistakes it discovers, after first notifying the patentee. (A) — third parties have no standing to demand a certificate; (B) — the Office will not issue one without first notifying the patentee and giving an opportunity to be heard (§ 1.322(a)(4)); (C)/(E) — correction is not limited to interference patents or patentee requests.',
  },
  {
    id: 'uspto-apr02-am-44',
    topicId: 2,
    subtopic: 'Who May Sign — Correction of Inventorship by Amendment (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] An amendment filed in January 8, 2002, in an unassigned nonprovisional application seeks to cancel claims so that fewer than all of the currently named inventors are the actual inventors of the invention being claimed. The amendment includes a request to delete the names of the persons who are not inventors. In accordance with proper USPTO rules and procedure, the request may be signed by which of the following?',
    options: [
      'A registered practitioner not of record who acts in a representative capacity under 37 CFR 1.34(a).',
      'All of the applicants (37 CFR 1.41(b)) for patent.',
      'A registered practitioner of record appointed pursuant to 37 CFR 1.34(b).',
      '(B) and (C).',
      '(A), (B), and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.48(b) (effective November 7, 2000; 65 FR 54604, 54619): a request to correct inventorship thereunder must be signed by a party as set forth in § 1.33(b) — which includes a practitioner of record, a practitioner acting in a representative capacity under § 1.34(a), and all of the applicants. (E) is the most inclusive correct choice.',
  },
  {
    id: 'uspto-apr02-am-45',
    topicId: 0,
    subtopic: 'Overcoming § 102(e) (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following practices or procedures may be properly employed to overcome a rejection properly based on 35 U.S.C. § 102(e)?',
    options: [
      'Persuasively arguing that the claims are patentably distinguishable from the prior art.',
      'Filing an affidavit or declaration under 37 CFR 1.132 showing that the reference invention is not by “another.”',
      'Filing an affidavit or declaration under 37 CFR 1.131 showing prior invention, if the reference is not a U.S. patent that either claims the same invention or claims an obvious variation of the subject matter in the rejected claim(s).',
      '(A) and (C).',
      '(A), (B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (E). MPEP § 706.02(b) ("Overcoming a 35 U.S.C. § 102 Rejection Based on a Printed Publication or Patent"): all three — persuasive argument, a § 1.132 showing that the reference work is not by another, and a § 1.131 showing of prior invention (where the reference patent does not claim the same or an obviously variant invention) — are proper routes. The narrower combinations are not the most inclusive.',
  },
  {
    id: 'uspto-apr02-am-46',
    topicId: 0,
    subtopic: 'Product-by-Process Claims (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] A product-by-process claim is properly rejected over a reference under 35 U.S.C. § 102(b). Which of the following statements is incorrect?',
    options: [
      'There is no anticipation unless each of the process steps recited in the claim is disclosed or inherent in the applied reference.',
      'If the applied reference reasonably indicates that a product disclosed therein is the same or substantially the same as the claimed product, the burden shifts to the applicant to provide evidence to the contrary.',
      'The rejection cannot be overcome by evidence of unexpected results.',
      'The rejection can be overcome by evidence that the product in the reference does not necessarily or inherently possess a characteristic of the applicant’s claimed product.',
      'An affidavit or declaration under 37 CFR 1.131 cannot overcome a proper rejection under 35 U.S.C. § 102(b) over a reference.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it is INCORRECT because the patentability of a product-by-process claim is determined by the PRODUCT itself, not the process of making it (In re Thorpe; MPEP § 2113); the process steps need not be disclosed. (B)/(D) state the burden-shifting rule of In re Fitzgerald / In re Best (MPEP § 2112); (C) is correct — unexpected results are irrelevant to anticipation (In re Malagari); (E) is correct — § 1.131 cannot antedate a § 102(b) statutory bar (§ 1.131(a)(2)).',
  },
  {
    id: 'uspto-apr02-am-47',
    topicId: 2,
    subtopic: 'Provisional Priority Chain — 12-Month Limits (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Xavier residing in Canada, a NAFTA country, files an application for a Canadian patent Monday, September 18, 2000. At the same time, Xavier forwards a copy of the Canadian application to registered practitioner Young in the United States, asking that Young prepare a U.S. application based on the Canadian application and claim the benefit of the Canadian filing. Young advises Xavier on the relative merits of filing a provisional versus a non-provisional application and Xavier decides to have Young initially file a provisional U.S. application. Young prepares the application and files it as a provisional application on Friday, January 19, 2001, claiming the benefit of the Canadian application. In August 2001, Young reminds Xavier that the filing was only provisional and that Xavier must decide whether to file a non-provisional application. In early January 2002, Xavier directs Young to get a non-provisional application, with a certified copy of the English language Canadian application, into the Office, which Young does on Friday January 11, 2002. Young files no other correspondence prior to the first Office action. Which of the following is true?',
    options: [
      'Because of the federal holiday, the filing of the non-provisional is timely to maintain a priority claim to the provisional application under 35 U.S.C. § 119(e), and therefore also to maintain a priority claim to the Canadian application filed less than 12 months before the initial US application.',
      'If Young files the non-provisional application by converting the provisional application to a non-provisional application. The patent term will be measured from the date of conversion.',
      'If Young files the non-provisional application by submitting a new application that claims the benefit of the provisional application and the Canadian application, in a first Office action rejection an examiner may apply a reference published September 19, 2000 as a prior art publication.',
      '(A) and (B).',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (C). 35 U.S.C. §§ 111(b)(7), 119(e); 37 CFR §§ 1.55, 1.78(a)(4); MPEP §§ 201.04(b), 201.15. Xavier is not entitled to the Canadian priority date — the non-provisional was filed more than one year after the Canadian filing, and a provisional cannot itself claim priority to any other application. The earliest available date is the January 19, 2001 provisional date, so an examiner may apply an intervening reference published September 19, 2000. (A) is false; (B) is false — on conversion the term is measured from the provisional’s filing date.',
  },
  {
    id: 'uspto-apr02-am-48',
    topicId: 2,
    subtopic: 'Small Entity — University License to Large Entity (Official Apr 2002)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Engineers and scientists at Poly Tech Institute (PTI) have invented a new system for a wireless computer network. On November 9, 2001, they asked you to file a U.S. patent application for their invention. PTI is located in the United States, has an attendance of over 5,000 students, and (1) admits, as regular students, only persons having a certificate of graduation from a school providing secondary education, or the recognized equivalent of such a certificate, (2) is legally authorized within the jurisdiction in which it operates to provide a program of education beyond secondary education, (3) provides an educational program for which it awards a bachelor’s degree or provides less than a 2-year program which is acceptable for full credit toward such a degree, (4) is a public institution, and (5) is accredited by a nationally recognized accrediting agency. You also find out that Poly Tech’s research which led to the invention of the new system was funded by Atlantic Telcom Corporation (ATC) (a for profit corporation with over 500 employees and that does not meet the small business standard defined in 13 CFR 121) and a license agreement has been signed which would give ATC the right to participate in the prosecution of the patent application and also the right to make and use the invention, upon the payment of royalties, if the application ultimately issues as a patent. Based on the above facts, you should advise PTI that:',
    options: [
      'the application must be filed under large entity status because enrollment in the university exceeds 500.',
      'the application must be filed under large entity status because PTI has entered into a license agreement.',
      'the application may be filed under small entity status because the enrollment at PTI exceeds 5000 students.',
      'the application may be filed under small entity status because PTI is an institution of higher education located in the United States.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.27(a)(3)(i)-(ii): small entity status is unavailable if the nonprofit organization has assigned, granted, conveyed, or licensed rights in the invention to an entity that would not itself qualify — ATC, a large for-profit corporation, does not qualify, so the license defeats small entity status. Student enrollment is irrelevant either way (MPEP § 509.02).',
  },
  {
    id: 'uspto-apr02-am-50',
    topicId: 0,
    subtopic: '§ 102(d) Requirements (Official Apr 2002)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2002] Which of the following is not required in order for a foreign application that has matured into a foreign patent to qualify as a reference under 35 U.S.C. § 102(d)?',
    options: [
      'The foreign application must have actually been published before the filing of an application in the United States, but the patent rights granted need not be enforceable.',
      'The foreign application must be filed more than 12 months before the effective filing date of the United States application.',
      'The foreign and United States applications must be filed by the same applicant, his or her legal representatives or assigns.',
      'The foreign application must have actually issued as a patent or inventor’s certificate before the filing of an application in the United States. It need not be published but the patent rights granted must be enforceable.',
      'The same invention must be involved.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): [Pre-AIA] (A) is the most correct answer — it is NOT a requirement. Under pre-AIA 35 U.S.C. § 102(d) the foreign application need not be published; what matters is that the patent actually issued with enforceable rights before the U.S. filing (MPEP § 706.02(e)). (B), (C), (D) and (E) are the actual § 102(d) requirements.',
  },
];

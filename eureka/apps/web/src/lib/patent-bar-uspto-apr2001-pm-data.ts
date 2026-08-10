/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, April 18, 2001 — Afternoon Session, with
 * the USPTO's official Model Answers. Retrieved from the USPTO's published
 * PDFs (edo0104pq.pdf / edo0104pa.pdf, via the Internet Archive copy of
 * uspto.gov). US Government works — public domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the Oct 2003,
 * Apr 2003, Apr 2002, Oct 2001 and Apr 2001 AM files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper are preserved).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Questions 3, 10, 20 and 34 of this session were officially discarded by
 *    the USPTO ("All answers accepted") and are excluded — an unusually high
 *    four discards in one session.
 *  - DUAL-KEY ANOMALY: for Q41 the USPTO accepted BOTH (C) and (D). As with
 *    Apr 2001 AM Q10, this bank stores a single key, so Q41 is keyed to (C) —
 *    the first answer the model answer accepts — and the explanation states
 *    plainly that (D) was also officially accepted, so a learner who reasons
 *    to (D) is told they were not wrong.
 *  - ERA NOTE: this exam predates the AIA (2011-2013). Questions turning on
 *    pre-AIA 35 U.S.C. 102/103 (102(a) "known by others", 102(b) statutory
 *    bars and their geographic limits, 102(d), 102(g) abandonment/suppression/
 *    concealment, 135(b), Rule 131 antedating, and 35 U.S.C. 104 proof of
 *    invention abroad) carry an explicit [Pre-AIA] tag. Questions built on
 *    since-superseded procedure (CPA practice, the pre-2004 Board rules of
 *    37 CFR 1.19x) carry a [Historical practice] tag. Verified status:
 *    OFFICIAL (USPTO model answers).
 *
 * Ingested: PM session Q1-Q2, Q4-Q9, Q11-Q19, Q21-Q33 and Q35-Q50
 * (46 of 46 scoreable).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2001_PM_SOURCE =
  'USPTO Registration Examination, April 18, 2001 — Afternoon Session (official model answers; public domain)';

export const USPTO_APR2001_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr01-pm-01',
    topicId: 2,
    subtopic: 'Converting a Provisional Application (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accord with proper USPTO practice and procedure?',
    options: [
      'Upon request to convert a provisional application to a nonprovisional utility application, the nonprovisional application is accorded a filing date as of the date on which the request to convert was filed, but the original filing date of the provisional application is preserved.',
      'If a provisional application does not have a claim as filed, and a claim is not filed with a timely request to convert the provisional application to a nonprovisional utility application, the Office will notify the applicant and set a time period for submitting a claim for examination.',
      'A provisional application filed in November 2000 is entitled to the right of priority under 35 U.S.C. § 119 of a copending utility application for patent filed in Great Britain in January 2000.',
      'A request filed in January 2001, to convert a provisional application filed in the USPTO in April 2000, to a nonprovisional utility application is timely if filed after the abandonment of the provisional application, i.e., after the pendency of the provisional application, but within twelve months of the filing date of the provisional application provided no petition to revive has been filed and granted.',
      'A nonprovisional utility application filed under the provisions of 37 CFR § 1.53(b) in January 2001, and claiming the benefit of the earlier filing date of a provisional application must be filed during the pendency of the provisional application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer — the Office will set a time period within which a claim must be submitted for it to grant the conversion request. 65 F.R. 50092, 50099 (Aug. 16, 2000). (A) is wrong — 37 C.F.R. § 1.53(c)(3): there is only ONE application, with a single filing date, that of the provisional. (C) is wrong; 35 U.S.C. § 111(b)(7); § 1.53(c)(4). (D) is wrong — § 1.53(c)(3) requires any conversion request to be filed PRIOR to abandonment of the provisional. (E) is wrong — 35 U.S.C. § 119(e)(2) was amended to eliminate the requirement that the nonprovisional be filed during the provisional’s pendency.',
  },
  {
    id: 'uspto-apr01-pm-02',
    topicId: 0,
    subtopic: 'Interference Versus Rule 131 When a Patent Claims the Same Invention (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Select from the following an answer which completes the following statement, such that the completed statement accords with proper USPTO practice and procedure: “When the reference in question is a noncommonly owned U.S. patent claiming the same invention as applicant, and its issue date is _____________________”',
    options: [
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'exactly one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'more than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of affidavit or declaration “swearing back” of reference.',
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of affidavit or declaration traversing the ground of rejection.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer, while (D) is not. MPEP § 715.05: when the reference is a noncommonly owned U.S. patent claiming the same invention and its issue date is LESS than 1 year before the claims are presented, applicant’s remedy must be by way of 37 CFR § 1.608 rather than § 1.131 — the reference patent can then be overcome only by interference. (B) and (C) are not the most correct: if the patent issued 1 year or more before the claims are presented, a rejection under 35 U.S.C. § 135(b) should be made. In re McGrew, 120 F.3d 1236 (Fed. Cir. 1997). (E) is wrong because an affidavit traversing a ground of rejection is available only where the reference "substantially shows or describes but does not claim the same patentable invention." § 1.132. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-04',
    topicId: 3,
    subtopic: 'Who May Be Required to Submit Information — 37 CFR 1.105 (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following may properly be required to submit information in reply to a requirement for information under 37 CFR § 1.105 in a patent application filed December 5, 2000?',
    options: [
      'A named inventor in the application.',
      'An assignee of the entire interest in the application.',
      'An attorney who prepares and prosecutes the application.',
      'All of the above.',
      '(A) or (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.105 (effective Nov. 7, 2000); 65 FR 54604, 54633; and § 1.56(c). A named inventor and an attorney who prepares and prosecutes the application are both identified in § 1.56(c), and an assignee is specified in § 1.105(a)(1). (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-apr01-pm-05',
    topicId: 3,
    subtopic: 'Preliminary Amendments — Disapproval Factors (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is or are a factor that will be considered in disapproving a preliminary amendment in an application filed November 10, 2000?',
    options: [
      'The nature of any changes to the claims or specification that would result from entry of the preliminary amendment.',
      'The state of preparation of a first Office action as of the date of receipt of the preliminary amendment by the Office.',
      'The state of preparation of a first Office action as of the certificate of mailing date under 37 CFR § 1.8, of the preliminary amendment.',
      'All of the above.',
      '(A) and (B).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.115(b)(1) (effective Nov. 7, 2000). As stated at 65 FR 54636: "Factors that will be considered in disapproving a preliminary amendment include: the state of preparation of a first Office action as of the date of receipt (§ 1.6, which does not include § 1.8 certificate of mailing dates) of the preliminary amendment by the Office…" Thus choices (C) — and therefore (D) — are incorrect.',
  },
  {
    id: 'uspto-apr01-pm-06',
    topicId: 1,
    subtopic: 'Product-by-Process Claims After an Improper Dependent Claim (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A patent application filed in the USPTO contains the following three original claims, including product by process Claim 3: Claim 1. A method for making an Ethernet cable comprising the steps of A, B and C. Claim 2. The method of claim 1, further characterized by the step of D. Claim 3. The Ethernet cable as in any one of the preceding claims. In the first Office action, the examiner objects to Claim 3 as being an improper dependent claim and requires cancellation of the claim. Following proper USPTO practices and procedures, which of the following replies best overcomes the examiner’s objection and provides the client with the broadest patent protection?',
    options: [
      'Amend Claim 3 to read: “The Ethernet cable as made by the process set forth in claims 1-2.”',
      'Cancel Claim 3.',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.”',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
      'Cancel Claim 3. Add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.” Add Claim 5, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Cancelling Claim 3 overcomes the objection, and adding Claims 4 and 5 secures product-by-process protection for the cable by BOTH methods of manufacture — so if Claim 4 is invalid, Claim 5 may remain valid. (A) is incorrect because it is an improper multiple dependent claim. 35 U.S.C. § 112 ¶ 5; 37 C.F.R. § 1.75(c); MPEP § 608.01(n)(I)(B)(1). (B) leaves the application with no product claim at all; (C) and (D) each leave it without a claim to the cable made by the other process.',
  },
  {
    id: 'uspto-apr01-pm-07',
    topicId: 6,
    subtopic: 'Design Application Format — 37 CFR 1.154 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accordance with proper USPTO practice and procedure regarding design patent applications filed in March 2001?',
    options: [
      'The elements of the design application, if applicable, should appear in the following order: (1) design application transmittal form; (2) fee transmittal form; (3) application data sheet; (4) specification; (5) drawings or photographs; and (6) executed oath or declaration.',
      'The specification should include the following sections in order: (1) preamble, stating the name of the applicant, title of the design, and a brief description of the nature and intended use of the article in which the design is embodied; (2) cross-reference to related applications (unless included in the application data sheet); (3) statement regarding federally sponsored research or development; (4) description of the figure or figures of the drawing; (5) feature description; and (6) a single claim.',
      'The text of the specification sections, if applicable, should be preceded by a section heading in uppercase letters without underlining or bold type.',
      'The elements of the design application, if applicable, should appear in the following order: (1) design application transmittal form; (2) fee transmittal form; (3) photographs; (4) application data sheet; (5) specification; (6) drawings; and (7) executed oath or declaration.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D), not being in accord with proper USPTO practice and procedure, is the most correct answer. Photographs and ink drawings may not appear in the same application (see 37 CFR § 1.152), and the order given is not that of § 1.154. (A) contains the elements of § 1.154(a); (B) the elements of § 1.154(b); and (C) the elements of § 1.154(c). Since (D) is incorrect, (E) is not the right answer.',
  },
  {
    id: 'uspto-apr01-pm-08',
    topicId: 0,
    subtopic: 'Printed Publication Prior Art and the Inventor’s Own Article (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] While travelling through Germany (a WTO member country) in December 1999, Thomas (a Canadian citizen) conceived of binoculars for use in bird watching. Upon Thomas’ return to Canada (a NAFTA country) in January 2000, he enlisted his brothers Joseph and Roland to help him market the product under the tradename “Birdoculars.” On February 1, 2000, without Thomas’ knowledge or permission, Joseph anonymously published a promotional article written by Thomas and fully disclosing how the Birdoculars were made and used. The promotional article was published in the Saskatoon Times, a regional Canadian magazine that is also widely distributed in the United States. Thomas first reduced the Birdoculars to practice on March 17, 2000 in Canada. A United States patent application properly naming Thomas as the sole inventor was filed September 17, 2000. That application has now been rejected as being anticipated by the Saskatoon Times article. Which of the following statements is most correct?',
    options: [
      'The promotional article in the Saskatoon Times constituted an offer to sell that operates as an absolute bar against Thomas’ patent application.',
      'Thomas, as the inventor, can overcome the rejection by establishing he is also the author of the promotional article.',
      'The Saskatoon Times article is not prima facie prior art because it was published without Thomas’ knowledge or permission.',
      'The Saskatoon Times article is not prima facie prior art because it does not evidence knowledge or use in the United States.',
      'The promotional article cannot be used as prior art because the Birdoculars had not been reduced to practice at the time the article appeared in the Saskatoon Times.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. See Ex parte Lemieux, 115 USPQ 148 (Bd. Pat. App. & Int. 1957); MPEP § 715.01(c) — an applicant may remove a publication as a reference by establishing that he is its author, i.e. that it is his own work and not "by another." (A) is incorrect because even if the article were an offer to sell in the U.S., it was made less than a year before Thomas’ filing date. (C) is incorrect — there is no requirement under § 102 that a publication be made with the inventor’s knowledge or permission. (D) is incorrect because the invention was "described in a printed publication in … a foreign country" under § 102(a). (E) is incorrect — a publication need not describe something already reduced to practice. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-09',
    topicId: 0,
    subtopic: 'Proving a Date of Invention Abroad — 35 U.S.C. 104 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] On the same Birdoculars facts (conception in Germany, a WTO member country; reduction to practice in Canada, a NAFTA country), which of the following statements is most correct?',
    options: [
      'Thomas can rely on his activities in Canada in establishing a date of invention prior to publication of the Saskatoon Times article.',
      'In a priority contest against another inventor, Thomas can rely on his activities in Canada in establishing a date of invention.',
      'In a priority contest against another inventor, Thomas can rely on his activities in Germany in establishing a date of invention.',
      'Statements (A) and (B) are correct, but statement (C) is incorrect.',
      'Statements (A), (B), and (C) are each correct.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Thomas may rely on activities in BOTH Germany (a WTO member country) and Canada (a NAFTA country) in establishing a date of invention prior to publication of the Saskatoon Times article or in establishing priority. 35 U.S.C. § 104; see also MPEP § 715.01(c). [Pre-AIA — § 104 and the invention-date regime were superseded by first-inventor-to-file.]',
  },
  {
    id: 'uspto-apr01-pm-11',
    topicId: 1,
    subtopic: 'Means-Plus-Function and the Other Paragraphs of 112 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'If a claim limitation invokes the sixth paragraph of 35 U.S.C. § 112, it must be interpreted to cover the corresponding structure, material, or acts in the specification and “equivalents thereof.”',
      'If means-plus-function language is employed in a claim, the specification must set forth an adequate disclosure showing what that language means.',
      'A means-plus-function claim limitation satisfies the second paragraph of 35 U.S.C. § 112 if the written description links or associates particular structure, material, or acts to the function recited in a means-plus-function claim limitation.',
      'A step-plus-function claim limitation satisfies the second paragraph of 35 U.S.C. § 112 if it is clearly based on the disclosure in the application that one skilled in the art would have known what structure, material, or acts perform the function recited in a step-plus-function limitation.',
      'The invocation of the sixth paragraph of 35 U.S.C. § 112 exempts an applicant from compliance with the first and second paragraphs of 35 U.S.C. § 112.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Invocation of the sixth paragraph of 35 U.S.C. § 112 does NOT exempt an applicant from compliance with the first and second paragraphs. "Supplemental Examination Guidelines for Determining the Applicability of 35 U.S.C. 112, para. 6," 65 F.R. 38510, 38514 (June 21, 2000). (A), (B), (C) and (D) each conform to those Guidelines and to In re Donaldson, 16 F.3d 1189 (Fed. Cir. 1994), and are therefore not the answer.',
  },
  {
    id: 'uspto-apr01-pm-12',
    topicId: 4,
    subtopic: 'Foreign Priority Claims and Delayed-Claim Petitions (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accordance with proper USPTO practice and procedure regarding patent applications filed in March 2001?',
    options: [
      'An applicant in a nonprovisional application may only claim the benefit of the filing date of the earliest one of prior foreign applications under the conditions specified in 35 U.S.C. §§ 119(a) through (d) and (f), 172, and 365(a) and (b).',
      'In an original application filed under 35 U.S.C. § 111(a), the claim for priority must be presented within either four months from the actual filing date of the application or sixteen months from the filing date of the prior foreign application, whichever occurs earlier.',
      'Notwithstanding the fact that the claim for foreign priority was not filed within either four months from the actual filing date of the application or sixteen months from the filing date of the prior foreign application, if the claim for priority and the certified copy of the foreign application specified in 35 U.S.C. § 119(b) or PCT Rule 17 is filed before the patent is granted and the claim was unintentionally delayed, a petition to accept a delayed claim for priority, with the appropriate fee and statement, may be filed.',
      'The claim for foreign priority need only identify foreign applications for which priority is claimed.',
      'A claim for foreign priority may be based upon an inventor\'s certificate provided it is accompanied by a statement by the applicant that patent coverage was not available.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. Per 65 F.R. 57024, 57030, § 1.55(c) provides that a priority claim not presented within the § 1.55(a) period is considered waived, but may be accepted on a petition showing the delay was unintentional. (A) is incorrect — § 1.55(a) lets an applicant claim the benefit of one or MORE prior foreign applications, not just the earliest. (B) states the period disjunctively as "whichever occurs earlier," which is not the rule as written. (D) is incorrect — the claim must also identify any foreign application for the same subject matter having an earlier filing date. § 1.55(a)(1)(i). (E) is incorrect — § 1.55(b) requires a specific statement that the applicant had the OPTION to file for either a patent or an inventor’s certificate.',
  },
  {
    id: 'uspto-apr01-pm-13',
    topicId: 7,
    subtopic: 'Professional Conduct — Advertising, Fees and Partnership Restrictions (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In August 2000, a recently registered patent agent, who is not an attorney, asked a registered patent attorney to help the agent establish a practice. Considering the additional facts in the following choices separately, which choice best comports with the professional responsibilities of both the agent and the attorney?',
    options: [
      'The agent advertises as a registered practitioner authorized to practice before the Office in patent and trademark cases. The attorney supervises all the trademark work done by the agent.',
      'The attorney has the agent prosecute trademark applications before the Office and the attorney signs all the papers submitted to the Office without reading the papers.',
      'The attorney and agent enter into a partnership agreement that has no health or retirement benefits, but specifies that after termination of the partnership, the agent and the attorney will not practice in each other’s neighborhoods or accept each other’s established clients.',
      'The agent advertises on television and radio as a registered patent agent and accepts patent cases on a reasonable contingent fee.',
      'Without receiving anything of value from the agent, the attorney refers patent application clients to the agent, the agent informs the clients that the agent is a registered patent attorney, and the agent competently represents the clients in patent cases.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. Practitioners, including registered patent agents (37 C.F.R. § 10.1(r)), may advertise on television and radio (§ 10.32(a)), and a registered patent agent may accept cases on a contingent fee basis (§ 10.36(b)(8), which permits contingent and fixed fees that are not clearly excessive or illegal). (A) and (B) are incorrect — a patent agent is not authorized to practice in trademark cases. § 10.14(b). (C) is incorrect — practitioners are proscribed from partnership agreements restricting their right to practice before the USPTO. § 10.38(a). (E) is incorrect — a patent agent is proscribed from misrepresenting himself as a registered patent attorney. §§ 10.23(b)(4), 10.34(b).',
  },
  {
    id: 'uspto-apr01-pm-14',
    topicId: 5,
    subtopic: 'Restriction Requirements in Reissue Applications (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following statements concerning a restriction requirement in a reissue application filed January 10, 2001, is in accordance with proper USPTO rules and procedure?',
    options: [
      'The Office cannot properly make a restriction requirement in the reissue application between claims added in the reissue application and the original patent claims, where the added claims are directed to an invention which is separate and distinct from the invention defined by the original patent claims.',
      'The Office cannot properly make a restriction requirement involving only subject matter of the original patent claims.',
      'If restriction is required by the Office, the subject matter of the original patent claims will not be held to be constructively elected unless a disclaimer of all the patent claims is filed in the reissue application, which disclaimer cannot be withdrawn by applicant.',
      '(A) and (B)',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR § 1.176(b) (effective Nov. 7, 2000); 65 FR 54604, 54644: "Section 1.176(b) now allows the Office to make a restriction requirement in a reissue application between claims added in a reissue application and the original patent claims, where the added claims are directed to an invention which is separate and distinct from the invention(s) defined by the original patent claims" — so (A) is incorrect. (C) is incorrect because the original patent claims "will be held to be constructively elected." § 1.176(b). (D) is incorrect because (A) is; (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-apr01-pm-15',
    topicId: 2,
    subtopic: 'Conditional Assignments Are Treated as Absolute (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Joe and Jim, local businessmen, conceived the idea of an improved fishing pole and filed a patent application on their invention. Both men are widowers, Joe with a grown son, and Jim with a grown daughter. Joe and Jim invite their children to come to the next Lions Club social event, and it isn’t long before the children are thinking in terms of wedding bells. Ecstatic at the thought of the upcoming marriage, Joe and Jim decide to assign their patent application to their children as a wedding present. Accordingly, they execute a document properly assigning their patent application to their children effective on the date of their marriage, and mail it to the USPTO with a cover letter requesting that the document be recorded. Shortly after the document is recorded, Joe’s son meets another woman, and breaks off his engagement to Jim’s daughter. In light of this scenario, which of the following statements is true?',
    options: [
      'Since the assignment was conditioned on the marriage of the children, and the condition was not fulfilled, the USPTO will regard the assignment as without effect for Office purposes.',
      'Since the assignment was recorded, the USPTO will require the parties to certify that the marriage condition was fulfilled before the assignment will be effective for Office purposes.',
      'Since the assignment was recorded, the USPTO will not determine whether the marriage condition was fulfilled and will regard the assignment as absolute.',
      'Since the USPTO does not record conditional assignments, the recording of the assignment document will be regarded as inadvertent, and without effect for Office purposes.',
      'Since the assignment was recorded, the USPTO will regard it as a determination of the validity of the document and the effect that the document has on the title to the patent application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 C.F.R. § 3.56 recites: "Assignments which are made conditional … are regarded as absolute assignments for Office purposes… . The Office does not determine whether such conditions have been fulfilled." MPEP § 317.03. (A), (B), (D) and (E) are false. As to (B), MPEP § 317.03 adds that the Office "will treat the submission of such an assignment for recordation as signifying that the act or event has occurred." As to (E), recording "is not a determination by the Office of the validity of the document or the effect that document has on the title."',
  },
  {
    id: 'uspto-apr01-pm-16',
    topicId: 0,
    subtopic: 'New Use of a Preexisting Article (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In June 1998 Michael buys a television set with a remote control for automatically changing channels. In June 2000, Michael moves to a new neighborhood and discovers while watching television that the remote control not only changes the channels but also operates to open his neighbor’s garage door. Michael goes to a registered practitioner to seek patent protection on his new idea, and the practitioner files a patent application in 2000 with claims 11 (an electronic device comprising circuitry emitting signals used to change television channels and open a garage door) and 12 (a method for opening a garage door using a television remote control device, comprising adapting, pointing and actuating steps). Which of the following is true?',
    options: [
      'Since the television and remote control were sold in June 1998, claims 11 and 12 are barred by 35 U.S.C. § 102(b) since the device was on sale more than one year prior to the invention by Michael.',
      'Since the television remote control device was in public use more than one year prior to the filing date of the application, Michael may obtain the patent coverage for the method claim 12 but not the device of claim 11.',
      'Although the device was bought in June 1998, Michael did not use it to open a garage door until 2000. Since claim 11 requires that the signals of the remote control operate to open the garage door, the limitations of claim 11 are not met by the device bought in 1998, and 35 U.S.C. § 102(b) does not apply.',
      'Since Michael did not make the remote control himself and only inadvertently discovered that his neighbor’s garage door opens when changing the channel on his television set, this is merely an inadvertent discovery and not entitled to patent protection.',
      'Whether or not claim 11 is patentable is solely a question of obviousness. Michael need only produce evidence of commercial success to overcome an obviousness rejection.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. When the article is preexisting, one may only secure patent protection for the METHOD of using the article. Since claim 11 is defined in terms of circuitry and that circuitry was preexisting, claim 11 is not allowable. Cf. Monsanto Co. v. Rohm & Haas Co., 312 F. Supp. 778 (E.D. Pa. 1970) (new use of a preexisting chemical as herbicide entitles applicant to method claims). (A) is incorrect because claim 12 is not barred. (C) is incorrect — claim 11 reads on the circuitry as it already existed. (D) is incorrect — the manner of invention, whether painstaking research or inadvertent discovery, is without significance. (E) is incorrect — commercial success cannot overcome a § 102 rejection. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-17',
    topicId: 1,
    subtopic: 'Written Description — Evidence of Lack of Possession (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] To satisfy the written description requirement of the first paragraph of 35 U.S.C. § 112, an applicant must show possession of the invention. An applicant’s lack of possession of the invention may be evidenced by:',
    options: [
      'Describing an actual reduction to practice of the claimed invention.',
      'Describing the claimed invention with all of its limitations using such descriptive means as words, structures, figures, diagrams, and formulas that fully set forth the claimed invention.',
      'Requiring an essential feature in the original claims, where the feature is not described in the specification or the claims, and is not conventional in the art or known to one of ordinary skill in the art.',
      'Amending a claim to add a limitation that is supported in the specification through implicit or inherent disclosure.',
      'Amending a claim to correct an obvious error by the appropriate correction.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. Per the "Written Description" Guidelines, 66 F.R. 1099, 1105 (Jan. 5, 2001): "The claimed invention as a whole may not be adequately described if the claims require an essential or critical feature that is not described in the specification and is not conventional in the art or known to one of ordinary skill in the art." (A) and (B) each describe ways of SHOWING possession. (D) is not correct — newly added limitations may be supported through express, implicit or inherent disclosure. (E) is not correct — an amendment correcting an obvious error does not constitute new matter where one skilled in the art would recognize both the error and the correction.',
  },
  {
    id: 'uspto-apr01-pm-18',
    topicId: 0,
    subtopic: 'Requirements for a 35 U.S.C. 102(d) Reference (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not required in order for a foreign application that has matured into a foreign patent to qualify as a reference under 35 U.S.C. § 102(d)?',
    options: [
      'The foreign application must have actually been published before the filing of an application in the United States, but the patent rights granted need not be enforceable.',
      'The foreign application must be filed more than 12 months before the effective filing date of the United States application.',
      'The foreign and United States applications must be filed by the same applicant, his or her legal representatives or assigns.',
      'The foreign application must have actually issued as a patent or inventor’s certificate before the filing of an application in the United States. It need not be published but the patent rights granted must be enforceable.',
      'The same invention must be involved.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it states the requirement backwards. 35 U.S.C. § 102(d); MPEP § 706.02(e): the foreign application need NOT be published, but the patent rights granted MUST be enforceable. (B), (C), (D) and (E) are each genuinely required by § 102(d). [Pre-AIA — § 102(d) was eliminated by the AIA.]',
  },
  {
    id: 'uspto-apr01-pm-19',
    topicId: 2,
    subtopic: 'Changing the Correspondence Address (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] An application is transmitted to the USPTO on January 12, 2001, without an oath or declaration by any of the inventors. Which of the following, prior to the filing of an oath or declaration, may properly change the address to which the Office will direct all notices, official letters, and other communications relating to the application?',
    options: [
      'A registered practitioner that filed the application.',
      'Any registered practitioner named in the transmittal papers accompanying the original application, if the application was filed by a registered practitioner.',
      'One inventor who solely filed the application, where two inventors are named in the transmittal papers accompanying the original application.',
      '(A), (B), and (C).',
      '(A) and (B).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 37 CFR § 1.33(a)(1) (effective Nov. 7, 2000); 65 FR 54604, 54617. Section 1.33(a)(1) provides that "the inventor(s), any registered practitioner named in the transmittal papers accompanying the original application, or a party that will be the assignee who filed the application, may change the correspondence address," and the Federal Register notice adds that this includes "only the one inventor filing the application, even if more than one inventor was identified on the application transmittal letter." Since (A), (B) and (C) are all provided for, (D) is correct; (E) is incorrect because (D) is.',
  },
  {
    id: 'uspto-apr01-pm-21',
    topicId: 1,
    subtopic: 'USPTO Claim Recommendations Versus Requirements (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not a USPTO recommendation or requirement?',
    options: [
      'Every application should contain no more than three dependent claims.',
      'Claims should be arranged in order of scope so that the first claim presented is the least restrictive.',
      'Product and process claims should be separately grouped.',
      'A claim which depends from a dependent claim should not be separated from that dependent claim by any claim which does not also depend from the dependent claim.',
      'Each claim should start with a capital letter and end with a period.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. The USPTO does not require or recommend a minimum or maximum number of dependent claims. 37 C.F.R. § 1.75(c). (B) is a recommendation — MPEP § 608.01(m) ("Claims should preferably be arranged in order of scope so that the first claim presented is the least restrictive."). (C) is a recommendation — same section ("product and process claims should be separately grouped"). (D) is a recommendation — MPEP § 608.01(n), part IV. (E) is a requirement — MPEP § 608.01(m).',
  },
  {
    id: 'uspto-apr01-pm-22',
    topicId: 0,
    subtopic: 'What Cannot Overcome a 35 U.S.C. 102(a) Rejection (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A rejection based on 35 U.S.C. § 102(a) cannot be overcome by:',
    options: [
      'Filing an affidavit under 37 C.F.R. § 1.131 “swearing back” of a U.S. patent which substantially shows or describes, and claims the same patentable invention as the rejected invention.',
      'Filing an affidavit under 37 C.F.R. § 1.132 showing that the reference invention is not by “another.”',
      'Perfecting a claim to priority under 35 U.S.C. § 119(a)-(d).',
      'Amending the claims to patentably distinguish over the prior art.',
      'Persuasively arguing that the claims are patentably distinguishable from the prior art.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer, because 37 C.F.R. § 1.131(a)(1) requires that the reference NOT claim the same patentable invention as the rejected invention — where the reference patent claims the same invention, the remedy is interference, not a § 1.131 affidavit. (B), (C), (D) and (E) are wrong because MPEP § 706.02(b) identifies each of them as an action that CAN be taken to overcome a § 102(a) rejection. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-23',
    topicId: 2,
    subtopic: 'Certificates of Mailing and Transmission From Abroad (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Mr. and Mrs. Noteworthy (Henry and Alice) are registered patent practitioners on vacation in Acapulco, Mexico. Henry, laid up ill, learned that an Office action he had overlooked contained a shortened statutory period (SSP) expiring that very day. He prepared a reply, prepared a certificate of mailing per MPEP § 512, and deposited the reply with the certificate, properly addressed to the USPTO, in the local post office that same day. Days later Alice, also ill, learned one of her cases had an SSP expiring the same day; she prepared a proper response and forwarded it to the USPTO by facsimile with a certificate of transmission per MPEP § 512 and 37 C.F.R. § 1.6(d). Assume the certificates recite dates matching their respective SSP expiration dates, and that both communications reached the USPTO after those dates and were stamped with the actual receipt date. Which of the following statements is true?',
    options: [
      'The application wherein Henry filed a reply is abandoned because the USPTO stamped date is controlling.',
      'The application wherein Henry filed a reply is not abandoned because the certificate of mailing date is controlling.',
      'The application wherein Alice filed a reply is abandoned because the USPTO stamped date is controlling.',
      'Both the application wherein Henry filed a reply and the application wherein Alice filed a reply are abandoned.',
      'Neither the application wherein Henry filed a reply nor the application wherein Alice filed a reply is abandoned.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 C.F.R. § 1.8(a)(1)(i)(A); MPEP § 512 states, "The Certificate of Mailing procedure does not apply to papers mailed in a foreign country." Since Henry’s reply was MAILED in Mexico, the stamped date of receipt in the USPTO controls and that application is abandoned. (B) and (E) are wrong for the same reason. (C) and (D) are wrong because Alice’s reply was TRANSMITTED by facsimile — the Certificate of Transmission procedure does apply to papers transmitted from a foreign country, so her reply was timely. §§ 1.6(d), 1.8(a)(1)(i)(B).',
  },
  {
    id: 'uspto-apr01-pm-24',
    topicId: 2,
    subtopic: 'What Gets the Benefit of a Certificate of Mailing (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is entitled to the benefit of a certificate of mailing under 37 CFR § 1.8?',
    options: [
      'Filing a request for continued examination under 37 CFR § 1.114.',
      'Filing a request for a continued prosecution application under 37 CFR § 1.53(d).',
      'Filing a reply under 37 CFR § 1.111 in a non-provisional patent application.',
      '(A) and (C).',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.114; 65 FR 50092, 50096: "a request for continued examination under § 1.114 is entitled to the benefit of a certificate of mailing under § 1.8 (cf. 1.8(a)(2)(i)(A))." So (A) qualifies, and (C) is included in § 1.8(a)(1). (B) is incorrect — a CPA is expressly excluded by § 1.8(a)(2)(i)(A). (E) is incorrect because (B) is. [Historical practice — CPA practice for utility applications ended in 2003.]',
  },
  {
    id: 'uspto-apr01-pm-25',
    topicId: 3,
    subtopic: 'RCE Versus CPA and Patent Term Adjustment (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'The filing of a request for continued examination and payment of the fee for the request in a nonprovisional utility application that was filed in January 2000, is sufficient to toll the running of any time period set in a final rejection for reply to avoid abandonment of the application.',
      'Where a request for continued examination, a submission, and requisite fee are filed in April 2001 for a nonprovisional utility application that was filed in January 2000, the submission will be considered though it was filed after the application became abandoned in February 2001.',
      'An applicant in a utility application originally filed on or after June 8, 1995, and before May 29, 2000, may obtain further examination either by timely filing a request for continued examination, a proper submission, and requisite fee, or by timely filing a continued prosecution application.',
      'An applicant in a utility application originally filed on or after June 8, 1995, and before May 29, 2000, may obtain further examination by timely filing in April 2001 a request for continued examination, a proper submission, and requisite fee, and the application is entitled to patent term adjustment provisions of the Patent Statute.',
      'An applicant in a utility application originally filed on or after June 8, 1995, and before May 29, 2000, may obtain further examination by timely filing in April 2001 a continued prosecution application under 37 C.F.R. § 1.53(d), but the CPA application is not entitled to patent term adjustment provisions of the Patent Statute.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 C.F.R. §§ 1.114, 1.53(d): "An applicant in a utility application filed on or after June 8, 1995, and before May 29, 2000, may obtain further examination either by timely filing a request for continued examination under § 1.114, or by timely filing a continued prosecution application under § 1.53(d)." (A) is wrong — the fee alone does not toll the period; a § 1.111 submission must be timely received. (B) is wrong — the submission and fee must be filed PRIOR to abandonment. § 1.114(a)(2). (D) is wrong — an RCE does not make it an application filed on or after May 29, 2000, so no PTA. (E) is wrong — a CPA filed after May 29, 2000 IS a new application on that date and IS entitled to PTA. [Historical practice — CPA practice ended in 2003.]',
  },
  {
    id: 'uspto-apr01-pm-26',
    topicId: 3,
    subtopic: 'RCE — What Counts as a Submission (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In accordance with proper USPTO practice and procedure, a submission for a request for continued examination does not include:',
    options: [
      'An appeal brief or reply brief (or related papers).',
      'New arguments in support of patentability.',
      'New evidence in support of patentability.',
      'An amendment of the drawings.',
      'An amendment of the claims.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.114(d), last sentence. (B), (C), (D) and (E) are each recognized as being a "submission" within the scope of 37 C.F.R. § 1.114(c).',
  },
  {
    id: 'uspto-apr01-pm-27',
    topicId: 0,
    subtopic: 'Statutory Bars — Foreign Sales and Experimental Use (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following properly creates a statutory bar to patentability of applicant’s claimed invention? I. Applicant’s invention was sold in Tokyo and New York more than one year prior to the effective U.S. filing date, but the sales were merely attempts at market penetration. II. Applicant’s invention was experimented with and tested to further develop the invention more than one year prior to the effective U.S. filing date, but important modifications resulted from the experimentation causing the invention to be reduced to practice after the effective U.S. filing date. III. Applicant’s invention was sold in Tokyo more than one year prior to the effective U.S. filing date, but the sale was merely market testing of the invention to determine product acceptance.',
    options: ['I.', 'II.', 'III.', 'I and III.', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2133.03(e)(1); 35 U.S.C. § 102(b) — I creates a bar because the sales included New York, i.e. in this country, and a market-penetration attempt is a commercial sale rather than experimental use. II does not create a bar because it is permitted experimental testing. MPEP §§ 2133.03(e)(3), 2133.03(e) — so (B) is incorrect. III does not create a bar because the sale did not occur in the United States. MPEP § 2133.03(d) — so (C) and (D) are incorrect. (E) is incorrect because (A) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-28',
    topicId: 0,
    subtopic: 'Abandonment, Suppression and Concealment Under 102(g) (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] In December 1988, Molly invents a new potato cutter that cuts potatoes into shapes having a star cross section. Molly, thinking the invention is important, has two people, Sue and Tom, both sworn to secrecy, witness a drawing of the invention. Molly then locks the drawing in a safe deposit box where it remains for the next twelve years. Neither Molly, Sue, nor Tom discloses the invention to anyone for the next twelve years. In December 2000, Troy invents a new potato cutter which produces potatoes having a star cross section. The invention becomes an overnight success. Troy files a patent application on February 1, 2001. Molly, after seeing the success of Troy’s invention in the marketplace, decides to file an application, also on February 1, 2001. The examiner is unable to find any prior art and no other prior art is cited by either applicant. Which of the following is true?',
    options: [
      'Since Molly effectively concealed her invention, Troy is entitled to a patent since although Molly conceived of the idea prior to Troy, she effectively abandoned the invention by not filing for twelve years.',
      'Since Troy conceived of the idea after Molly and because Troy did not file a patent application before Molly, he is not entitled to priority over Molly.',
      'Since Molly disclosed the invention to Sue and Tom, the invention was known by others prior to the invention by Troy. Therefore, Troy is precluded by 35 U.S.C. § 102(a) from obtaining a patent on his idea.',
      'Since Molly invented the cutter before Troy, she is entitled to a patent and not Troy.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 102(g) applies only when another inventor has not abandoned, suppressed or concealed the invention. Molly concealed hers for twelve years and filed only after seeing Troy’s device succeed, so her earlier conception does not defeat Troy. (B) is not true for the same reason. (C) is not true because § 102(a) applies only when the invention is publicly KNOWN by others, and Sue and Tom were sworn to secrecy. (D) is not true. Since (A) is true, (E) is not. [Pre-AIA — § 102(g) priority contests were replaced by first-inventor-to-file.]',
  },
  {
    id: 'uspto-apr01-pm-29',
    topicId: 3,
    subtopic: 'Board New Ground of Rejection — Appellant Options (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is true?',
    options: [
      'The statement, “Whether claims 1 and 2 are unpatentable,” complies with the requirement of 37 C.F.R. § 1.192(c)(6) for a concise statement in the appeal brief of the issues presented for review.',
      'Following a new ground of rejection raised by the Board of Patent Appeals and Interferences, the applicant may request a rehearing, or submit an appropriate amendment of the rejected claims or a showing of facts relating to the rejected claims.',
      'A reissue application may be filed in order to broaden claims back to their original form where the claims were mistakenly narrowed during the original prosecution to avoid the prior art provided that the narrowing of the claims was made without deceptive intent on the part of the applicant.',
      'If the Board of Patent Appeals and Interferences decides to require an appellant to address a particular matter, and the appellant cannot respond within the time period set, he may obtain an extension of time by paying the requisite fee.',
      'In an ex parte reexamination proceeding of a patent that arises from an application filed in the United States before November 29, 1999, a third party requester who is dissatisfied with a decision of the Board of Patent Appeals and Interferences may seek judicial review by appeal to either the U.S. Court of Appeals for the Federal Circuit or by civil action in the U.S. District Court for the District of Columbia.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. See 37 C.F.R. § 1.196(b); MPEP § 1214.01. As to (A), see MPEP § 1206 "(6) Issues" — the bare statement is not a concise statement of the issues. As to (C), the recapture doctrine prevents such claims from being recaptured; MPEP § 1412.02. As to (D), see § 1.196(d) and MPEP § 1212 — failure to respond in time results in dismissal of the appeal. As to (E), a third party may not appeal; §§ 1.310, 1.303(a); Syntex (U.S.A.) Inc. v. USPTO, 11 USPQ2d 1866 (Fed. Cir. 1989). [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-apr01-pm-30',
    topicId: 0,
    subtopic: 'Rule 131 Affidavit — Conception and Diligence (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Assume that conception of applicant’s complex invention occurred prior to the date of the reference, but reduction to practice occurred after the date of the reference. Which of the following is sufficient to overcome the reference in accordance with proper USPTO practice and procedure?',
    options: [
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to allege that applicant or patent owner has been diligent.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference, and diligence from just prior to the effective date of the reference to actual reduction to practice. The presence of a lapse of time between the reduction to practice of an invention and the filing of an application thereon is not relevant.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference. Diligence need not be considered.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to show conception and reduction to practice in any country.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is always sufficient to prove actual reduction to practice for all mechanical inventions by showing plans for the construction of the claimed apparatus.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. See Ex parte Merz, 75 USPQ 296 (Bd. App. 1947) (a lapse of time between reduction to practice and filing is not relevant to a § 1.131(b) showing); MPEP § 715.07(a). (A) is incorrect — applicant must show evidence of facts establishing diligence, not merely allege it. (C) is incorrect — once conception before the reference date is established, diligence must still be considered. Ex parte Kantor, 177 USPQ 455. (D) is incorrect — § 1.131(a) permits establishing completion only in the U.S., a NAFTA country (on/after Dec. 8, 1993) or a WTO country (on/after Jan. 1, 1996). (E) is incorrect — actual reduction to practice generally requires a showing the apparatus existed and worked. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-31',
    topicId: 1,
    subtopic: 'Acceptable Multiple Dependent Claim Form (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Assuming that each of the following claims is in a separate application, and there is no preceding multiple dependent claim in any of the applications, which claim is in acceptable multiple dependent claim form?',
    options: [
      'Claim 8. A machine according to any one of the preceding claims wherein…',
      'Claim 5. A device as in one of claims 1-4, wherein…',
      'Claim 10. A device as in any of claims 1-4 or 6-9, in which…',
      'Claim 4. A machine according to claim 2 or 3, also comprising…',
      'The claim form in (A), (B), (C) and (D) is acceptable.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer, because 35 U.S.C. § 112 authorizes multiple dependent claims as long as they are in the ALTERNATIVE form — and each of (A) through (D) refers to the preceding claims in the alternative. MPEP § 608.01(n), subsection I.A.',
  },
  {
    id: 'uspto-apr01-pm-32',
    topicId: 0,
    subtopic: 'Statutory Classes and Naturally Occurring Compositions (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Your client Bill found a natural specimen of tree sap that had bonded rock material to a log and was impervious to water, and determined it was 10% A, 30% B, and 60% C. Bill found he could synthetically produce the sap by mixing one part A by weight and three parts B by weight at 20 degrees Celsius, heating to 100 degrees Celsius, adding six parts C by weight, and cooling to 20 degrees Celsius; and that adding an effective amount of D before cooling decreases viscosity. Your specification includes guidelines that an effective amount of D for decreasing viscosity is 1% to 2% of the total weight after cooling, and for brightening the color is 3% to 4%. Which if any of the following claims would not be properly rejected pursuant to 35 U.S.C. § 101? Claim 1. A composition for bonding asphalt shingles to wood sheathing and a method, comprising: a mixture of 10%A, 30%B, and 60%C, and adding an effective amount of D to decrease the viscosity of the mixture. Claim 2. A composition produced by the steps of: mixing one part A by weight with three parts B by weight at 20 degrees Celsius; heating to 100 degrees Celsius; adding six parts C by weight; cooling to 20 degrees Celsius; and adding an effective amount of D to decrease the viscosity. Claim 3. A composition for bonding asphalt shingles to wood sheathing, comprising 10% A, 30% B, and 60% C.',
    options: ['Claim 1.', 'Claim 2.', 'Claim 3.', 'Claims 2 and 3.', 'None of the above.'],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer, because patentability of a product claimed by a product-by-process claim is based on the product itself, and the claimed subject matter in claim 2 is not naturally occurring. MPEP § 2105. (A) is incorrect because claim 1 recites both a product and a process in the same claim and is therefore not within one of the statutory classes of 35 U.S.C. § 101. MPEP § 2173.05(p)(II). (C) and (D) are incorrect because claim 3 is drawn to a NATURALLY OCCURRING composition — the sap as found. MPEP § 2105. (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-apr01-pm-33',
    topicId: 0,
    subtopic: 'Examiner Reliance on Common Knowledge in the Art (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following statements concerning reliance by an examiner on common knowledge in the art, in a rejection under 35 U.S.C. § 103 is correct? I. An examiner’s statement of common knowledge in the art is taken as admitted prior art, if applicant does not seasonably traverse the well known statement during examination. II. Applicant can traverse an examiner’s statement of common knowledge in the art, at any time during the prosecution of an application to properly rebut the statement. III. If applicant rebuts an examiner’s statement of common knowledge in the art in the next reply after the Office action in which the statement was made, the examiner can never provide a reference to support the statement of common knowledge in the next Office action and make the next Office action final.',
    options: ['I.', 'II.', 'III.', 'I and II.', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2144.03 — an examiner’s statement of common knowledge is taken as admitted prior art if not seasonably traversed. In re Chevenard, 60 USPQ 239 (CCPA 1943). II is incorrect because the traverse must be SEASONABLE, not at any time — so (B) and (D) are incorrect. III is incorrect because the next action can potentially be made final — so (C) is incorrect. (E) is incorrect because (A) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-35',
    topicId: 1,
    subtopic: '"Consisting Of" and Dependent Claims (Official Apr 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A patent application filed in the USPTO contains the following dependent claim: Claim 2. The method of Claim 1, further consisting of the step of cooling the mixture to a temperature of 32° F. Following proper USPTO practices and procedures, from which of the following claims does Claim 2 not properly depend?',
    options: [
      'Claim 1. A method of making liquid compound A comprising the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A consisting of the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A including the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A characterized by the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '(C) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. The phrase "consisting of" excludes any step not specified in the claim. MPEP § 2111.03. Thus a claim depending from a claim that "consists of" the recited steps cannot add a step — and here the dependent claim adds cooling. (A) is incorrect because "comprising" is inclusive and open-ended. (C) and (D) are incorrect because "including" and "characterized by" are synonymous with "comprising." (E) is incorrect because (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-apr01-pm-36',
    topicId: 3,
    subtopic: 'Specificity of a Reply to a Requirement for Information (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A member of the public submits a protest under 37 CFR § 1.291 relating to a public sale of the subject matter of a patent application (effective filing date June 1, 1999). The protest includes submission of a business circular authored by the assignee of the invention. In a first Office action dated January 10, 2001, the examiner includes a requirement for information requesting the date of publication of the business circular. The reply to the requirement for information states that the publication date is “approximately June 1, 2000.” Which of the following would be proper for the examiner to include in the next Office action?',
    options: [
      'A requirement that the date in the reply be made more specific.',
      'A holding that the previous reply is incomplete.',
      'A requirement seeking confirmation that “approximately June 1, 2000” is the most specific date that was obtained or can be obtained based on a reasonable inquiry if that is not already clear from the reply.',
      '(A) and (C).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.105 (effective Nov. 7, 2000). The example at 65 FR 54634 states: "The examiner cannot require that the reply be more specific or hold the reply to be incomplete based on such information. The examiner can, however, in the next Office action seek confirmation that this is the most specific date that was obtained or can be obtained based on a reasonable inquiry being made if that is not already clear from the reply." Thus (A) and (B) are incorrect; (D) is incorrect because (A) is; (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr01-pm-37',
    topicId: 4,
    subtopic: 'Foreign Priority — Timing of the Claim and Certified Copy (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accordance with proper USPTO practice and procedure regarding patent applications filed in March 2001?',
    options: [
      'The claim for priority and the certified copy of the foreign application specified in 35 U.S.C. 119(b) or PCT Rule 17 must, in any event, be filed before the examiner allows the claims.',
      'If the claim for priority or the certified copy of the foreign application is filed after the date the issue fee is paid, it must be accompanied by the processing fee set forth in 37 CFR § 1.17(i), but the patent will not include the priority claim unless corrected by a certificate of correction under 35 U.S.C. 255 and 37 CFR § 1.323.',
      'In an application that entered the national stage from an international application after compliance with 35 U.S.C. § 371, the claim for priority must be made during the pendency of the application and within the time limit set forth in the PCT and the Regulations under the PCT.',
      'If a U.S. patent application publication or patent incorporates by reference, or includes a specific reference under 35 U.S.C. §§ 119(e) or 120 to, a pending or abandoned application, a copy of that application-as-filed may be provided to any person upon written request including the fee set forth in 37 CFR § 1.19(b)(1).',
      'If an international application, which designates the U.S. and which has been published in accordance with PCT Article 21(2), incorporates by reference or claims priority under PCT Article 8 to a pending or abandoned U.S. application, a copy of that application-as-filed may be provided to any person upon written request including a showing that the publication of the application in accordance with PCT Article 21(2) has occurred and that the U.S. was designated, and upon payment of the appropriate.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. The claim for priority and certified copy must, in any event, be filed BEFORE THE PATENT IS GRANTED — not before the examiner allows the claims. 37 CFR § 1.55(a)(2). (B) contains the elements of § 1.55(a)(2); (C) the elements of § 1.55(a)(1)(ii); (D) the elements of § 1.14(c)(1)(i); and (E) the elements of § 1.14(c)(1)(ii).',
  },
  {
    id: 'uspto-apr01-pm-38',
    topicId: 3,
    subtopic: 'Preliminary Amendments in Continuing Applications (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following statements concerning preliminary amendments is/are in accordance with proper USPTO rules and procedure?',
    options: [
      'A preliminary amendment filed in a continuation-in-part application cannot be disapproved if it is filed within three months from the December 7, 2000, filing date.',
      'A preliminary amendment filed in a continued prosecution application cannot be disapproved if it is filed four months from the December 7, 2000, filing date with a petition for a one month extension of time.',
      'A preliminary amendment filed in a continued prosecution application cannot be disapproved if it is filed four months from the December 7, 2000, filing date with a petition for a one month extension of time and the appropriate fee for the extension.',
      'A preliminary amendment filed in a continuation prosecution application after the filing date of the application cannot be disapproved.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR § 1.115(b)(2) and (c) (effective Nov. 7, 2000). (A) is correct because a continuation-in-part is filed under § 1.53(b) and such a preliminary amendment will not be disapproved under § 1.115(b)(2)(i). (B), (C) and (D) are incorrect because a preliminary amendment in a CPA will be disapproved if it is not filed ON the filing date of the CPA. § 1.115(b)(2)(ii). (E) is incorrect because (A) is correct. [Historical practice — CPA practice for utility applications ended in 2003.]',
  },
  {
    id: 'uspto-apr01-pm-39',
    topicId: 3,
    subtopic: 'Interviews Before the First Office Action (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following requests by the registered practitioner of record for an interview with an examiner concerning an application will be granted in accordance with proper USPTO rules and procedure?',
    options: [
      'A request for an interview in a substitute application prior to the first Office action, for the examiner and attorney of record to meet in the practitioner’s office without the authority of the Commissioner.',
      'A request for an interview in a continued prosecution application prior to the first Office action, to be held in the examiner’s office.',
      'A request for an interview in a non-continuing and non-substitute application, prior to the first Office action to be held in the examiner’s office.',
      'None of the above.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR § 1.133 (effective Nov. 7, 2000). As stated at 65 FR 54641: "Comment 65: One comment urged that interviews be allowed in a CPA prior to a first action. Response: The comment has been adopted in a broader manner to apply to all continuations and substitute applications…" (A) is incorrect because an interview will not be permitted off Office premises without the authority of the Commissioner. § 1.133(a)(1). (C) is incorrect because an interview on patentability will not occur before the first Office action unless the application is a continuing or substitute application. § 1.133(a)(2). (D) is incorrect because (B) is correct; (E) is incorrect because (A) and (C) are.',
  },
  {
    id: 'uspto-apr01-pm-40',
    topicId: 0,
    subtopic: 'Overcoming Anticipation of a Markush Group (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] You filed a patent application for a client containing a claim to a composition consisting of X, water and plaster. In the claim X is defined as follows: “X is a member selected from the group consisting of elements A, B, and C.” The claim is properly rejected under 35 U.S.C. § 102(b) as being anticipated by a reference describing the composition made of A, water and plaster. The rejection may be properly overcome by:',
    options: [
      'Amending the claim by canceling elements B and C because the reference is concerned only with element A.',
      'Amending the claim by canceling element A from the Markush group.',
      'Arguing that the reference is not relevant because it lacks elements B and C.',
      'Amending the claim by changing “consisting of” to “consisting essentially of.”',
      'Amending the claim to redefine X as “being a member selected from the group comprising elements A, B, and C.”',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 35 U.S.C. § 102(b); MPEP § 2173.05(h). Deleting the anticipated element A from the Markush group leaves an invention that is no longer anticipated by the reference. (A), (D) and (E) are incorrect because the claim remains anticipated — element A would still be a member of the group. (C) is incorrect because the argument does not change the fact that the claim still reads on the reference where X is element A. (E) is further incorrect because "comprising" cannot be used in a proper Markush group. [Pre-AIA]',
  },
  {
    id: 'uspto-apr01-pm-41',
    topicId: 2,
    subtopic: 'Declaration Contents Versus the Application Data Sheet (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] A nonprovisional patent application was filed on December 1, 2000, including a patent application declaration and an application data sheet. The application data sheet includes the applicant’s full name, residence, mailing address, and citizenship. The application data sheet does not include any foreign priority information. Which of the following must be identified in the declaration?',
    options: [
      'Applicant’s mailing address.',
      'Applicant’s citizenship.',
      'Any foreign application for patent for which a claim for priority is made by Applicant pursuant to 37 CFR § 1.55.',
      '(B) and (C).',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): "(C) or (D) are accepted as correct answers." 37 CFR § 1.76(d) and § 1.63 (effective Nov. 7, 2000). Under § 1.63(c)(1) the applicant’s mailing address need NOT be in the declaration if it is in the application data sheet, so (A) is incorrect. The foreign priority information MUST be in the declaration because it was not in the application data sheet — § 1.63(c)(2) — so (C) is correct. Applicant’s citizenship in (B) must also be in the declaration under § 1.63(a)(3) IF "applicant" is construed as a person or party other than the inventor (e.g. § 1.42), since no citizenship exception is made by § 1.63(c); on that construction both (B) and (C) are correct and (D), being inclusive of them, is most correct. (B) alone was not accepted. (E) is incorrect because (A) is. NOTE: this bank stores one key and uses (C); if you answered (D), the USPTO accepted that too.',
  },
  {
    id: 'uspto-apr01-pm-42',
    topicId: 3,
    subtopic: 'Petitions to Make Special — Age Versus Infringement (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] You prepare and file a patent application directed to an invention for improving the safety of research in the field of recombinant DNA. Your client, Inventor Joe, informs you he has licensed exclusive rights to his invention to a major pharmaceutical company. Inventor Joe also informs you that another pharmaceutical company, Titan Pharmaceuticals, learned of the invention from a paper he presented at a technical conference, and is preparing to use the technology in its commercial research labs in the United States. Inventor Joe demonstrates that Titan is about to begin practicing the invention by showing you a rigid comparison of Titan’s intended activities and the claims of the application. He also informs you that although he is currently in very good health, he is 67 years old and fears he will not be in good health when the invention reaches its peak commercial value. Accordingly, if possible he would like for you to expedite prosecution in the simplest, most inexpensive way. Given the foregoing circumstances, which of the following statements is most correct?',
    options: [
      'You should recommend filing a petition to make special on the basis of Inventor Joe’s age.',
      'Since the invention relates to improving the safety of research in the field of recombinant DNA, you should recommend filing a petition to make special on that basis.',
      'Since Titan is actually practicing the invention set forth in the pending claims, you should recommend filing a petition to make special on that basis.',
      'Statements (A), (B) and (C) are equally correct.',
      'Statements (A), (B) and (C) are each incorrect.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. A petition to make special may be made simply by filing a petition including any evidence showing that the applicant is 65 years of age or more, such as a birth certificate or a statement from the applicant — and NO FEE is required. MPEP § 708.02. A petition on the recombinant-DNA-safety basis in (B) is likely available but would require a petition fee and a statement explaining the relationship of the invention to that safety. The infringement basis in (C) is likely not available because such a petition may not be based on PROSPECTIVE infringement, and would in any event require a fee. Neither would be the simplest, most inexpensive route.',
  },
  {
    id: 'uspto-apr01-pm-43',
    topicId: 1,
    subtopic: 'Dependent Claim Form and Antecedent Basis (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Claims 1 and 2 in a patent application state the following: Claim 1. An apparatus for sitting comprising: (i) a square shaped base member; (ii) four elongated members mounted to the bottom of the base member; and (iii) a circular back member mounted to the base member. Claim 2. An apparatus as in claim 1, further comprising a spring connected to the back member and to the base member. Which, if any, of the following claims fully supported by the specification and presented in the application, is in accordance with USPTO rules and procedure?',
    options: [
      '3. An apparatus as in claim 1, wherein the base member is rectangularly shaped.',
      '3. An apparatus as in claim 2, wherein the wheels connected to each of the elongated members are plastic.',
      '3. An apparatus as in any of the preceding claims, in which the circular back member is wooden.',
      '3. An apparatus as in the preceding claims, further comprising a pressure-sensing device connected to the base member.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 608.01(n). (A) is incorrect because a dependent claim must further limit the subject matter of a previous claim, and "rectangularly shaped" is inconsistent with the "square shaped" base of claim 1. 37 C.F.R. § 1.75(c). (B) is incorrect because there is no antecedent basis for the wheels. MPEP § 2173.05(e). (D) is incorrect because it does not refer back in the alternative only. MPEP § 608.01(n). (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr01-pm-44',
    topicId: 1,
    subtopic: 'Essential Elements, Best Mode, and 112 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is true?',
    options: [
      'A claim to a process omitting a step in a process, where the step is disclosed in the specification to be essential to the invention, may not be properly rejected under 35 U.S.C. 112, first paragraph, for lack of enablement where the specification provides an enabling disclosure only for the process which includes the essential step.',
      'Failure to disclose the best mode must rise to the level of active concealment or grossly inequitable conduct in order to support a rejection under 35 U.S.C. 112, first paragraph.',
      'The best mode requirement is the same as the enablement requirement of the first paragraph of 35 U.S.C. 112.',
      'If the best mode contemplated by the inventor at the time of filing the application is not disclosed, a proposed amendment adding a specific mode of practicing the invention would not be new matter.',
      'A claim failing to interrelate essential elements of the invention as defined by the applicant in the specification, where the interrelation is critical to the invention may be properly rejected under 35 U.S.C. 112, second paragraph, for failure to properly point out and distinctly claim the invention.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 2172.01: "a claim which fails to interrelate essential elements of the invention as defined by applicant(s) in the specification may be rejected under 35 U.S.C. 112, second paragraph." In re Venezia, 530 F.2d 956 (CCPA 1976). (A) is incorrect — a claim omitting matter disclosed to be essential may be rejected under § 112, first paragraph, as not enabling. In re Mayhew, 527 F.2d 1229 (CCPA 1976). (B) is incorrect — failure to disclose the best mode need NOT rise to active concealment. MPEP § 2165. (C) is incorrect — best mode is separate and distinct from enablement. In re Newton, 414 F.2d 1400 (CCPA 1969). (D) is incorrect — such an amendment is new matter and cannot cure the defect. In re Hay, 534 F.2d 917 (CCPA 1976).',
  },
  {
    id: 'uspto-apr01-pm-45',
    topicId: 3,
    subtopic: 'An RCE Submission Must Meet 37 CFR 1.111 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] The USPTO mails a final Office action dated November 8, 2000, in a utility patent application filed May 5, 1999, to registered practitioner Ted. The final Office action includes claim rejections and objections. Which of the following, with a request for continued examination along with the required fee filed by Ted on January 8, 2001, is a proper submission in accordance with the provisions of 37 CFR § 1.114?',
    options: [
      'A telephone call from Ted to the examiner on January 8, 2001, wherein Ted distinctly and specifically points out the supposed errors in the examiner’s action, and wherein Ted presents arguments addressing each ground of objection and rejection in the Office action dated November 8, 2000.',
      'A written reply to the Office action dated November 8, 2000, with no amendments or new claims, which distinctly and specifically points out the supposed errors in the examiner’s action, addresses each ground of objection and rejection in the Office action, and presents arguments pointing out the specific distinctions believed to render the claims patentable over the references applied by the examiner.',
      'A written reply to the Office action dated November 8, 2000, which does not present arguments pointing out the specific distinctions believed to render the claims patentable over the references applied by the examiner, and which requests that objections or requirements as to form not necessary to further consideration of the claims be held in abeyance until allowable subject matter is indicated.',
      'All of the above.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.114(c) (effective Aug. 16, 2000) and § 1.111(b). As stated at 65 FR 50097: "Section 1.114(c) also provides that if reply to an Office action under 35 U.S.C. 132 is outstanding, the submission must meet the reply requirements of § 1.111." (B) complies with § 1.111(b). (A) is incorrect because a reply under § 1.111(b) must be reduced to writing. § 1.2. (C) is incorrect because a § 1.111(b) reply must present arguments pointing out the specific distinctions believed to render the claims patentable. (D) is incorrect because (A) and (C) are; (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-apr01-pm-46',
    topicId: 2,
    subtopic: 'Fees — RCE, Certificates of Mailing, and Conversion (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'The fee an applicant must pay to request continued examination of an application is set in an amount equal to the basic filing fee the same applicant must pay for a utility patent application.',
      'A Certificate of Mailing or Transmission under 37 C.F.R. § 1.8 is proper for filing a Continued Prosecution Application under 37 C.F.R. § 1.53(d) to obtain the date of the Certificate as the filing date for the application.',
      'The Office does not charge a fee for processing a fee paid by a check that has been refused, i.e., dishonored and returned, by a financial institution.',
      'To first request conversion of a provisional application containing a claim to a nonprovisional application after the provisional application has become abandoned, a petition to revive, accompanied by the appropriate fees, a showing of unavoidable delay, and a request for the conversion must be filed within one year of the date of abandonment.',
      'The conversion of a provisional application, for which a basic filing fee was properly paid, to a nonprovisional application will result in the savings of filing and other fees over the filing of a nonprovisional application claiming the benefit under 35 U.S.C. § 119(e) and 37 C.F.R. § 1.78 of the earlier provisional filing date.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. §§ 1.16(a) and 1.17(e) — the RCE fee equals the basic filing fee for an original patent application. (B) is not correct — § 1.8(a)(2) excludes from the certificate benefit "the filing of a national patent application specification and drawing or other correspondence for the purpose of obtaining an application filing date, including a request for a continued prosecution application under § 1.53(d)." (C) is not correct; § 1.21(m). (D) is not correct — § 1.53(c)(3) requires the conversion petition before the earlier of abandonment or twelve months from the provisional filing date. (E) is not correct — a properly paid provisional basic filing fee is not applied to the nonprovisional fees on conversion.',
  },
  {
    id: 'uspto-apr01-pm-47',
    topicId: 3,
    subtopic: 'Factors in Disapproving a Supplemental Reply (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Applicant receives a rejection and objection in a non-final Office action dated December 12, 2000. Applicant timely files a reply dated February 12, 2001, that distinctly and specifically points out the supposed errors in the examiner’s action. The reply addresses every ground of objection and rejection in the Office action dated December 12, 2000, by presenting arguments pointing out specific distinctions believed to render the claims, including any newly presented claims, patentable over the applied references. Applicant mails a second reply. Thereafter, Applicant mails a third reply to the USPTO, which would result in a change to the specification only, if entered. In accordance with proper USPTO rules and procedure, which of the following are factors that will be considered in deciding whether to disapprove Applicant’s third reply?',
    options: [
      'Whether Applicant’s reply dated February 12, 2001, includes a request that objections or requirements as to form not necessary to further consideration of the claims be held in abeyance until allowable subject matter is indicated.',
      'The state of preparation of an Office action responsive to the Applicant’s reply dated February 12, 2001, as of the date of receipt of Applicant’s third reply.',
      'The nature of any changes to the specification that would result from entry of Applicant’s second reply.',
      '(A), (B), and (C).',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.111(a)(2) (effective Nov. 7, 2000); 65 FR 54604, 54635. (C) and (B) are the factors specified in § 1.111(a)(2)(i) and (ii). (A) is incorrect because although such a request may be included in a reply under § 1.111(b), it is not set forth as a factor in disapproving a supplemental reply under § 1.111(a)(2). (D) is incorrect because (A) is.',
  },
  {
    id: 'uspto-apr01-pm-48',
    topicId: 5,
    subtopic: 'Format of the Patent Copy in a Reissue Application (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is in accord with proper USPTO practice and procedure for filing a reissue application in April 2001?',
    options: [
      'The specification, including the claims, of the patent for which reissue is requested must be furnished in the form of a copy of the printed patent, in double column format, each page on only one side of a single sheet of paper.',
      'The specification, including the claims, of the patent for which reissue is requested must be furnished in the form of cut-up soft copies of the printed patent, with only a single column of the printed patent securely mounted on a separate sheet of paper.',
      'The specification, including the claims, of the patent for which reissue is requested must be furnished in the form of a copy of the printed patent, in single column format, each page on only one side of a single sheet of paper.',
      'The specification, including the claims, of the patent for which reissue is requested must be furnished in the form of a copy of the printed patent, in double column format, each page on both sides of a single sheet of paper.',
      'The specification, including the claims, of the patent for which reissue is requested must be furnished in the form of cut-up soft copies of the printed patent, with only a single column of the printed patent securely mounted on both sides of a single sheet of paper.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.173(a)(1); 65 FR 54604 (Sept. 8, 2000) (effective Nov. 7, 2000). (C) is wrong because it would furnish the patent copy in SINGLE column format instead of the required double column. (D) is wrong because it would use BOTH sides of a sheet instead of one side. (B) is wrong because it describes the cut-up-soft-copy format formerly offered as an option in MPEP § 1411 but changed by the new rule; (E) mimics (B) with both-sided mounting. (B) and (E) are also incorrect because the rules no longer require "cut-up soft copies."',
  },
  {
    id: 'uspto-apr01-pm-49',
    topicId: 3,
    subtopic: 'Access to and Status of Applications — 37 CFR 1.14 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] Which of the following is not in accordance with proper USPTO practice and procedure regarding patent applications filed in March 2001?',
    options: [
      'Status information is available for Application B, that is a continuation of an application A, when application A has been published under 35 U.S.C. § 122(b).',
      'A person requesting status information may be provided the filing date if the eight-digit numerical identifier is not available and the last six digits of the numerical identifier is available.',
      'If a U.S. patent application publication or patent incorporates by reference, or includes a specific reference under 35 U.S.C.§§ 119(e) or 120 to, a pending or abandoned application, a copy of that application-as-filed may be provided to any person upon written request including the fee set forth in 37 CFR § 1.19(b)(1).',
      'A coinventor in a pending application may gain access to the application if his name appears as an inventor in the application, even if he did not sign the oath or declaration.',
      'Notwithstanding the fact that only a redacted copy of an application has been published, a member of the public is entitled to see the entire application upon written request.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — it is the statement NOT in accord with practice. Since a redacted copy was used for publication, 37 C.F.R. § 1.14(c)(2) provides that "the copy of the specification, drawings, and papers may be limited to a redacted copy." (A) contains the elements of § 1.14(b)(2); (B) is within § 1.14(a)(1)(iii); (C) contains the elements of § 1.14(c)(1)(i); and as to (D), a coinventor is entitled to access independent of whether he or she signed the declaration — per § 1.41(a)(2), if no declaration is filed the inventorship is that set forth in the application papers.',
  },
  {
    id: 'uspto-apr01-pm-50',
    topicId: 2,
    subtopic: 'Express Mail Filing Dates — 37 CFR 1.10 (Official Apr 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2001] If an application is deposited with the U.S. Postal Service in the manner recited in each of the following answers, and there is a dispute as the filing date of the application, which will result in the earliest filing date?',
    options: [
      'As “Express Mail Post Office to Post Office” without the Express Mail mailing label number being placed on the application and with the “date-in” entered by the USPS on Friday, March 9, 2001, and the application being received in the USPTO on Monday, March 12, 2001.',
      'As “Express Mail Post Office to Addressee” without the Express Mail mailing label number being placed on the application and with the “date-in” entered by the USPS on Saturday, March 10, 2001, and the application being received in the USPTO on Tuesday, March 13, 2001.',
      'As “Express Mail Post Office to Addressee” without the Express Mail mailing label number being placed on the application and with the “date-in” entered by the applicant on Thursday, March 8, 2001, and the application being received in the USPTO on Wednesday, March 14, 2001.',
      'As “Express Mail Post Office to Addressee” with the Express Mail mailing label number being placed on the application and with the “date-in” entered by the applicant on Thursday, March 22, 2001, and the application being received in the USPTO on Monday, March 26, 2001.',
      'As “Express Mail Post Office to Post Office” with the Express Mail mailing label number being placed on the application and with the “date-in” entered by the USPS on Saturday, March 24, 2001, and the application being received in the USPTO on Monday, March 26, 2001.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer, because the application is properly deposited as "Express Mail Post Office to Addressee" and the "date-in" is properly entered by the USPS — giving a filing date of March 10, 2001. Only the "Post Office to Addressee" service may be used (MPEP § 502; 37 C.F.R. § 1.10); the "date-in" must be completed by the USPS, not the applicant (MPEP § 513); the mailing label number need no longer be placed on the correspondence; and § 1.6(a)(2) makes the deposit date effective even on a Saturday, Sunday or Federal holiday. (A) and (E) fail because "Post Office to Post Office" is ruled out. (C) and (D) fail because the "date-in" was entered by the applicant rather than the USPS.',
  },
];

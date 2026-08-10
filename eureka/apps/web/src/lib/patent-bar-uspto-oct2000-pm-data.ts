/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — October 18, 2000, AFTERNOON (PM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo0010pq.pdf / edo0010pa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files in this directory):
 *  - Stems and options are VERBATIM, in the official order (A)-(E). Typos in
 *    the original are preserved where they are part of the question (e.g. Q17's
 *    "talbecloth", which the question itself asks about, and Q35's claim text).
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * DISCARDED QUESTIONS: none. The model answers were swept case-insensitively
 * for "all answers accepted" (this exam date writes the phrase with a capital
 * A elsewhere -- see the AM session, where Q9, Q29 and Q40 were discarded) and
 * this session contains no such item. All 50 are scoreable.
 *
 * DUAL-KEYED QUESTIONS: none. Swept for "or (X) is", "both", "either" and
 * "also accepted" in the model answers; no alternates were offered.
 *
 * ERA NOTES. This paper predates the AIA by eleven years, and its own cover
 * page states it applies "the statute and rules in place as of November 28,
 * 1999". Items turning on pre-AIA § 102/§ 103 carry [Pre-AIA]; items turning
 * on procedure that has since been superseded carry [Historical practice].
 * Three deserve specific mention because a candidate could otherwise learn a
 * repealed rule:
 *  - Q9 and Q33 are keyed to the 37 C.F.R. Part 10 Code of Professional
 *    Responsibility, REPLACED in 2013 by the Part 11 USPTO Rules of
 *    Professional Conduct. The outcomes happen to survive the change, but the
 *    citations do not.
 *  - Q37 turns on a preliminary amendment NOT being part of the original
 *    disclosure unless referred to in the declaration. Reversed in 2004:
 *    a preliminary amendment present on the filing date is now part of the
 *    original disclosure.
 *  - Q3 and Q17 apply the pre-2003 § 1.121 amendment format (the five-word
 *    hand-entry rule), replaced by the current replacement-paragraph practice.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2000_PM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'October 18, 2000',
  session: 'Afternoon (PM)',
  questionsFile: 'edo0010pq.pdf',
  answersFile: 'edo0010pa.pdf',
  totalDelivered: 50,
  discarded: [] as number[],
  ingested: 50,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_OCT2000_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct00-pm-01',
    topicId: 0,
    subtopic: '35 U.S.C. § 102(d) foreign patent as a reference',
    difficulty: 3,
    question:
      'Which of the following is not required in order for a foreign application that has matured into a foreign patent will qualify as a reference under 35 U.S.C. § 102(d)?',
    options: [
      'The foreign application must be filed more than 12 months before the effective filing date of the United States application.',
      'The foreign and United States applications must be filed by the same applicant, his or her legal representatives or assigns.',
      'The foreign application must have actually issued as a patent or inventor’s certificate before the filing of an application in the United States. It need not be published but the patent rights granted must be enforceable.',
      'The foreign application must have actually been published before the filing of an application in the United States, but the patent rights granted need not be enforceable.',
      'The same invention must be involved.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 102(d). The foreign application need not be published, but the patent rights granted must be enforceable. MPEP § 706.02(e). (A), (B), (C), and (E) are required by 35 U.S.C. § 102(d). [Pre-AIA] — the AIA repealed § 102(d) as a distinct prior-art category.',
  },
  {
    id: 'uspto-oct00-pm-02',
    topicId: 1,
    subtopic: 'Incorporation by reference — essential vs non-essential material',
    difficulty: 3,
    question:
      'Which of the following is not a proper incorporation by reference in an application prior to allowance according to USPTO rules and procedures?',
    options: [
      'Incorporating material necessary to describe the best mode of the claimed invention by reference to a commonly owned, abandoned U.S. application that is less than 20 years old.',
      'Incorporating non-essential material by reference to a prior filed, commonly owned pending U.S. application.',
      'Incorporating material that is necessary to provide an enabling disclosure of the claimed invention by reference to a U.S. patent.',
      'Incorporating non-essential material by reference to a hyperlink.',
      'Incorporating material indicating the background of the invention by reference to a U.S. patent which incorporates essential material.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 608.01(p). (A) is incorrect because abandoned applications less than 20 years old can be incorporated by reference to the same extent as copending applications. (B) is incorrect because non-essential material may be incorporated by reference to patents or applications published by the United States. (C) is incorrect because material necessary to provide an enabling disclosure is essential material, which may be incorporated by reference to a U.S. patent. (E) is incorrect because non-essential material may be incorporated by reference to a U.S. patent which incorporates essential material.',
  },
  {
    id: 'uspto-oct00-pm-03',
    topicId: 5,
    subtopic: 'Amending a reissue application',
    difficulty: 3,
    question: 'Which of the following statements regarding amending a reissue application is not correct?',
    options: [
      'An entire paragraph in the specification other than the claims may be deleted by a statement deleting the paragraph without presentation of the text of the paragraph.',
      'In a claim, hand entry of an amendment of five words or less is permitted.',
      'Each amendment submission must set forth the status, on the date of the amendment, of all patent claims and of all added claims.',
      'When responding to an Office action, each amendment when originally submitted must be accompanied by an explanation of the support in the disclosure of the patent for the amendment.',
      'A new claim added by amendment must be presented with underlining throughout the claim.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Hand entry of amendments to a claim in a reissue application is no longer permitted. 37 C.F.R. § 1.121(b)(2). Answers (A), (C) and (D) are all changes that were made pursuant to the December 1, 1997, change. 37 C.F.R. §§ 1.121(b)(2)(ii), and 1.121(b)(2)(iii). Answer (E) is also a correct statement. 37 C.F.R. § 1.121(b)(2)(i)(A) and MPEP § 1453. [Historical practice] — the § 1.121 amendment format was replaced in 2003 by the current replacement-paragraph/claim-listing practice.',
  },
  {
    id: 'uspto-oct00-pm-04',
    topicId: 7,
    subtopic: 'Duty of disclosure — material information beyond patents and publications',
    difficulty: 3,
    question:
      'In January 1997, Chris invents an electrical door stop for automatically stopping a door at any position by simply pressing the doorknob downward. During a lunch break before completing the writing of the application, Chris’ patent agent, Sam, visits a local Shack restaurant and notices a door stop which is actuated by stepping with one’s foot on a mechanical lever located at the bottom of the door. Sam makes a mental note to ask a colleague as to whether he needs to disclose the doorstop at the Shack restaurant to the USPTO in an information disclosure statement, but ultimately neglects to do so. Sam knows that the restaurant (and doorstop) was in existence at least one year prior to Sam’s visit. In the first Office action, the only prior art uncovered by the examiner relates to stopping a door using a lever that engages a channel in the ceiling upon being pressed upward. The examiner rejects the claim asserting it would have been obvious to have either upward or downward actuating motion. In the reply Sam argues that the downward motion is essential because it affords the ability to actuate when one is carrying a package and that the prior art does not disclose a downwardly actuated doorstop. Following Sam’s argument, the case issues. Which of the following is true?',
    options: [
      'Since Sam knew of the doorstop at the restaurant and not Chris, there is no duty to disclose the Shack restaurant doorstop. An attorney need not disclose that which is within his personal knowledge in an information disclosure statement.',
      'Since Sam discovered the Shack restaurant device after he had started writing the application, the invention was fully disclosed to Sam. There is no need to disclose that which occurs after an inventor completes his application disclosure.',
      'Sam needs to disclose only patents or printed publications to the USPTO to satisfy the duty of disclosure. Since Sam was unaware of any patent or printed publication for the Shack restaurant doorstop, Sam does not need to file an information disclosure in this regard.',
      'Chris should file a request for reexamination seeking to have the Shack restaurant door stop considered.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Since the claim reads on a downward moving actuator and only an upward moving actuator was cited during prosecution, the Shack restaurant device was material to patentability. Moreover, Sam argued the significance of the downward motion feature. 37 C.F.R. § 1.56(b)(2)(i). Sam should have disclosed it under 37 C.F.R. § 1.56(c)(2). As to (A), the duty of disclosure extends to each practitioner who prepares or prosecutes the application. As to (B), the sighting occurred prior to the filing date. MPEP § 2001.06. As to (C), information material to the invention is more than just patents and printed publications. 37 C.F.R. § 1.56; MPEP § 2001.04. As to (D), only patents and printed publications may be considered during a reexamination. 35 U.S.C. § 303(a); MPEP § 2209.',
  },
  {
    id: 'uspto-oct00-pm-05',
    topicId: 5,
    subtopic: 'Substantial new question of patentability — reexamination',
    difficulty: 3,
    question:
      'Which of the following is a proper basis for establishing a substantial new question of patentability to obtain reexamination in accordance with proper USPTO practice and procedure?',
    options: [
      'An admission per se by the patent owner of record that the claimed invention was on sale, or in public use more than one year before any patent application was filed in the USPTO.',
      'A prior art patent that is solely used as evidence of an alleged prior public use.',
      'A prior art patent that is solely used as evidence of an alleged insufficiency of disclosure.',
      'A printed publication that is solely used as evidence of an alleged prior offer for sale.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. § 302; MPEP § 2217. The prior art applied may only consist of prior art patents or printed publications. (A) is incorrect: an admission, per se, may not be the basis for establishing a substantial new question of patentability, though an admission by the patent owner in the file or in a court record may be used in combination with a patent or printed publication. (B), (C), and (D) are incorrect — a prior art patent cannot be applied as a ground for reexamination if it is merely used as evidence of alleged prior public use or sale, or insufficiency of disclosure. [Pre-AIA] — the prior-art subsections cited are pre-AIA; ex parte reexamination itself survives.',
  },
  {
    id: 'uspto-oct00-pm-06',
    topicId: 3,
    subtopic: 'Overcoming § 102(b) anticipation — Markush groups',
    difficulty: 3,
    question:
      'You filed a patent application for a client containing a claim to a composition consisting of X, water and plaster. In the claim X is defined as follows: "X is a member selected from the group consisting of elements A, B, and C." The claim is properly rejected under 35 U.S.C. § 102(b) as being anticipated by a reference describing the composition made of A, water and plaster. The rejection may be properly overcome by:',
    options: [
      'Amending the claim by canceling elements B and C because the reference is concerned only with element A.',
      'Arguing that the reference is not relevant because it lacks elements B and C.',
      'Amending the claim by canceling element A from the Markush group.',
      'Amending the claim by changing "consisting of" to "consisting essentially of."',
      'Amending the claim to redefine X as "being a member selected from the group comprising elements A, B, and C."',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 102(b); MPEP § 2173.05(h). Deletion of the anticipated element from the claim leaves an invention that is no longer anticipated by the reference. (A), (D), and (E) are incorrect despite the amendments because the claim remains anticipated — element A would still be a member of the group. (B) is incorrect because the argument does not change the fact that the claim remains anticipated. (E) is also incorrect because "comprising" cannot be used in a proper Markush group. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct00-pm-07',
    topicId: 2,
    subtopic: 'Issue fee period; deferral of issuance; reexamination requester identity',
    difficulty: 2,
    question: 'Which of the following is true?',
    options: [
      'Once an application is ready to be issued, there is a public policy that the patent will issue in regular course once the issue fee is timely paid. In accordance with the foregoing, issuance of a patent may not be deferred.',
      'The time period set for the payment of the issue fee is statutory and cannot be extended.',
      'While anyone may file a request for ex parte reexamination, a patent practitioner filing a request for ex parte reexamination must disclose the client’s name.',
      'It is necessary to claim priority under 35 U.S.C. § 120 to earlier filed applications for which a corresponding claim of priority has been made in the corresponding foreign filed applications of the same applicant.',
      '(A), (B), and (C).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is correct. See 35 U.S.C. § 151; MPEP § 1306. As to (A) see MPEP § 1306.01. As to (C) see MPEP § 2212. As to (D), the claim for priority is not required as a person may not wish to do so in order to increase the term of his or her patent. Since (A) and (C) are incorrect, (E) is incorrect.',
  },
  {
    id: 'uspto-oct00-pm-08',
    topicId: 0,
    subtopic: 'On-sale bar where the invention was misappropriated',
    difficulty: 3,
    question:
      'In early 1998, at the request of MC Motors, Eve demonstrated her reverse automobile heating system at a testing facility in Germany. MC Motors signs a confidentiality agreement and agrees not to disclose the invention to anyone. The test is conducted in a secluded area and the persons involved are sworn to secrecy. Unbeknownst to Eve, MC Motors installs the reverse heating system on its MC cars and begins selling its cars with the reverse heating system in the United States in September 1998. In August 1999, MC files a patent application in the United States for the reverse automobile heating system. In December 1999, Eve files a patent application claiming the automobile heating system. The examiner rejects all the claims in Eve’s application based upon an MC Motors brochure advertising its cars in September 1998. Which of the following is true?',
    options: [
      'Since the MC Motors misappropriated the invention and since Eve did not authorize the sale, the rejection may be overcome by showing that the sales by MC Motors were not authorized by Eve.',
      'Eve is not entitled to a patent since the invention was on sale in this country, more than one year prior to the date of the application for patent in the United States.',
      'MC Motors is entitled to a patent since although it misappropriated the idea for the invention from Eve, the misappropriation was beyond the jurisdiction of the USPTO.',
      '(B) and (C).',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). In Evans Cooling Systems, Inc. v. General Motors Corp., 125 F.3d 1448, 44 USPQ2d 1037 (Fed. Cir. 1997), the Federal Circuit held that even though an invention is misappropriated by a third party, the public sale bar applies (35 U.S.C. § 102(b)). Accordingly, (B) is true and (A) is not. (D) is incorrect since the people at MC were not the true inventors. (E) is incorrect inasmuch as (B) is correct. [Pre-AIA] — the AIA restructured the on-sale bar and added the derivation remedy of § 291 / derivation proceedings.',
  },
  {
    id: 'uspto-oct00-pm-09',
    topicId: 7,
    subtopic: 'Patent agent conduct — advertising, contingent fees, partnership restrictions',
    difficulty: 3,
    question:
      'In August 1999, a recently registered patent agent, who is not an attorney, asked a registered patent attorney to help the agent establish a practice. Considering the additional facts in the following choices separately, which choice best comports with the professional responsibilities of both the agent and the attorney?',
    options: [
      'The agent advertises as a registered practitioner authorized to practice before the Office in patent and trademark cases. The attorney supervises all the trademark work done by the agent.',
      'The agent advertises on television and radio as a registered patent agent and accepts patent cases on a reasonable contingent fee.',
      'The attorney has the agent prosecute trademark applications before the Office and the attorney signs all the papers submitted to the Office without reading the papers.',
      'The attorney and agent enter into a partnership agreement that has no health or retirement benefits, but specifies that after termination of the partnership, the agent and the attorney will not practice in each other’s neighborhoods or accept each other’s established clients.',
      'Without receiving anything of value from the agent, the attorney refers patent application clients to the agent, the agent informs the clients that the agent is a registered patent attorney, and the agent competently represents the clients in patent cases.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Practitioners, including registered patent agents (37 C.F.R. § 10.1(r)), may advertise on television and radio. 37 C.F.R. § 10.32(a). A registered patent agent may accept cases on a contingent fee basis. 37 C.F.R. § 10.36(b)(8). (A) and (C) are incorrect — the patent agent is not authorized to practice in trademark cases. 37 C.F.R. § 10.14(b). (D) is incorrect — practitioners are proscribed from entering into partnership agreements restricting their right to practice before the USPTO. 37 C.F.R. § 10.38(a). (E) is incorrect — a patent agent is proscribed from misrepresenting himself or herself as a registered patent attorney. 37 C.F.R. §§ 10.23(b)(4) and 10.34(b). [Historical practice] — the 37 C.F.R. Part 10 Code of Professional Responsibility was replaced in 2013 by the Part 11 USPTO Rules of Professional Conduct; the outcomes survive but the citations do not.',
  },
  {
    id: 'uspto-oct00-pm-10',
    topicId: 5,
    subtopic: 'Maintenance fee reminder — fee address',
    difficulty: 2,
    question:
      'A patent issued to Joe Inventor on July 25, 2000 based on an application filed in January 1999. Larry Practitioner was the registered practitioner of record, and all correspondence from the USPTO during prosecution was directed to Larry at his then-current address. At the time he paid the issue fee, Larry designated a "fee address" for payment of maintenance fees. Larry moved his office on September 1, 2000, and notified the Office of Enrollment and Discipline of his new address in accordance with 37 C.F.R. § 10.11. Larry did not, however, file a change of correspondence address in the patent file. An assignment of all rights in the patent from Joe Inventor to Big Corporation was made September 5, 2000 and was recorded in the USPTO on September 14, 2000. Under standard USPTO practice and procedure, where will the USPTO send any Maintenance Fee Reminder?',
    options: [
      'Joe Inventor’s address as indicated on the inventor’s declaration, unless a change of address had been filed for Mr. Inventor.',
      'Larry’s address prior to September 2000.',
      'Larry’s address subsequent to September 1, 2000.',
      'The fee address designated by Larry at the time he paid the issue fee.',
      'The address of the assignee as indicated on the assignment recorded in the USPTO.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (D). The Maintenance Fee Reminder is sent to the correspondence address used during prosecution unless a fee address has been designated. 37 C.F.R. § 1.363; MPEP § 2540.',
  },
  {
    id: 'uspto-oct00-pm-11',
    topicId: 5,
    subtopic: 'Correspondence address in reexamination',
    difficulty: 2,
    question:
      'A patent issued to Joe Inventor on July 25, 2000 based on an application filed in January 1999. Larry Practitioner was the registered practitioner of record, and all correspondence from the USPTO during prosecution was directed to Larry at his then-current address. At the time he paid the issue fee, Larry designated a "fee address" for payment of maintenance fees. Larry moved his office on September 1, 2000, and notified the Office of Enrollment and Discipline of his new address in accordance with 37 C.F.R. § 10.11. Larry did not, however, file a change of correspondence address in the patent file. An assignment of all rights in the patent from Joe Inventor to Big Corporation was made September 5, 2000 and was recorded in the USPTO on September 14, 2000. Under standard USPTO practice and procedure, where will the USPTO send a communication for Big Corporation concerning a request for reexamination involving the patent?',
    options: [
      'Joe Inventor’s address as indicated on the inventor’s declaration, unless a change of address had been filed for Mr. Inventor.',
      'Larry’s address prior to September 2000.',
      'Larry’s address subsequent to September 1, 2000.',
      'The fee address designated by Larry at the time he paid the issue fee.',
      'The address of the assignee as indicated on the assignment recorded in the USPTO.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (C). See, e.g., 37 C.F.R. § 1.33(c); MPEP §§ 2222 and 403.',
  },
  {
    id: 'uspto-oct00-pm-12',
    topicId: 0,
    subtopic: 'Grounds of rejection — disclaimer, res judicata, statutory subject matter',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'Claims may be properly rejected on the ground that applicant has disclaimed the subject matter involved if the applicant fails to copy a claim from a patent when suggested by the examiner.',
      'Res Judicata, as a proper ground for rejection, should be applied when the earlier decision was a final rejection by the same examiner.',
      'If an article of manufacture capable of illustration is originally claimed and it is not shown in the drawing, the claim should be rejected based on the reason the claimed subject matter is not shown in the drawing, and applicant is required to add it to the drawing.',
      'A thing occurring in nature, which is substantially unaltered, such as a shrimp with the head and digestive tract removed, is a "manufacture."',
      'A scientific principle, divorced from any tangible structure, is a statutory class of patentable subject matter.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 706.03(u). (B) is incorrect — MPEP § 706.03(w): res judicata should be applied only when the earlier decision was a decision of the Board of Appeals or a reviewing court and there is no opportunity for further court review. (C) is incorrect — MPEP §§ 608.01(l) and 706.03(o): the claim should not be rejected; applicant is required to add it to the drawing. (D) is incorrect — MPEP § 706.03(a): a thing occurring in nature, substantially unaltered, is not a "manufacture." Ex parte Grayson, 51 USPQ 413 (Bd. App. 1941). (E) is incorrect — a scientific principle divorced from any tangible structure can be rejected as not within the statutory classes. O’Reilly v. Morse, 56 U.S. (15 Howard) 62 (1854). [Historical practice] — the interference-era practice of suggesting claims for copying no longer exists.',
  },
  {
    id: 'uspto-oct00-pm-13',
    topicId: 3,
    subtopic: 'Overcoming § 102(b) by perfecting § 120 benefit',
    difficulty: 3,
    question:
      'On February 3, 1999, you filed an application for inventor Sam, fully disclosing and claiming only the following: "Claim 1. A system for preventing unauthorized entry into a garage, comprising: an electric garage opener coupled to a computer and to a video camera." You received a non-final Office action dated February 4, 2000, wherein the examiner rejected claim 1 under 35 U.S.C. § 102(b) as anticipated by Dan. The examiner attached a copy of Dan’s journal article published on July 4, 1997, fully disclosing an electric garage opener coupled to a computer and to a video camera. Which of the following actions, if taken by you, can overcome the rejection in accordance with proper USPTO practice and procedure?',
    options: [
      'Timely filing a reply traversing the rejection, arguing that claim 1 is patentably distinguished from the Dan reference.',
      'Timely filing a reply traversing the rejection, arguing that since the date of the Dan reference falls on a Federal holiday, the Dan reference is not a statutory bar under 35 U.S.C. § 102(b).',
      'Timely filing a reply with an affidavit under 37 C.F.R. § 1.131 showing prior invention by Sam.',
      'Timely filing a reply traversing the rejection, arguing that the examiner did not demonstrate why one of ordinary skill in the art at the time the invention was made would have been motivated to modify the system disclosed by Dan.',
      'Timely filing a reply including an amendment to the specification perfecting priority under 35 U.S.C. § 120, containing a specific reference in accordance with 37 C.F.R. § 1.78(a), to a U.S. application filed by Sam on July 3, 1997 that fully disclosed but did not claim a garage opener coupled to a computer and a video camera.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 706.02(b). (A) is incorrect because the Dan reference includes all the elements of claim 1. (B) is incorrect because the Federal holiday merely moves the statutory bar date to the next succeeding business day. Ex parte Olah, 131 USPQ 41 (Bd. App. 1960). (C) is incorrect because a 37 C.F.R. § 1.131 affidavit cannot be used to overcome a rejection under 35 U.S.C. § 102(b). (D) is incorrect because the rejection was not made under 35 U.S.C. § 103. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct00-pm-14',
    topicId: 4,
    subtopic: 'Right of priority under 35 U.S.C. § 119(a)-(d)',
    difficulty: 3,
    question:
      'The right of priority under 35 U.S.C. § 119 (a)-(d) may be obtained where, if all other requirements are met:',
    options: [
      'A is the inventor of the U.S. nonprovisional application, and B is the inventor of the foreign application, and the two applications are owned by the same party.',
      'The United States nonprovisional application, or its earliest parent nonprovisional application under 35 U.S.C. § 120, was filed 18 months from the earliest, and only foreign filing.',
      'The right is premised upon the second foreign filed application disclosing and claiming the same invention as is claimed in the earliest United States nonprovisional application, the first foreign application having been filed twenty-four months before said United States nonprovisional application.',
      'The U.S. application contains only process claims, and the foreign application does not enable the disclosed process.',
      'The claim for foreign priority includes the application number, and filing date of the foreign application, as well as the name of the treaty under which the application was filed, if appropriate, and the name and location of the national or intergovernmental authority which received such application.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP § 201.13 "The Priority Claim." (A) is incorrect — a right of priority does not exist where inventor B filed abroad and inventor A in the United States, even if commonly owned. (B) is incorrect — the U.S. nonprovisional application, or its earliest § 120 parent, must have been filed within twelve months of the earliest foreign filing. (C) is incorrect — the twelve months runs from the earliest foreign filing except as provided in § 119(c). (D) is incorrect — the foreign application must be for the same invention. 35 U.S.C. § 119(a).',
  },
  {
    id: 'uspto-oct00-pm-15',
    topicId: 0,
    subtopic: '§ 102(g) — abandonment, suppression or concealment',
    difficulty: 3,
    question:
      'In December 1987, Molly invents a new potato cutter that cuts the potatoes into shapes having a star cross section. Molly, thinking that the invention is important, has two people, Sue and Tom, both sworn to secrecy, witness a drawing of the invention. Molly then locks the drawing in a safe deposit box where it remains for the next twelve years. Neither Molly, Sue, or Tom discloses the invention to anyone for the next twelve years. In December 1999, Troy invents a new potato cutter which produces potatoes having a star cross section. The invention becomes an overnight success. Troy files a patent application on February 1, 2000. Molly, after seeing the success of Troy’s invention in the marketplace, decides to file an application, also on February 1, 2000. The examiner is unable to find any prior art and no other prior art is cited by either applicant. Which of the following is true?',
    options: [
      'Since Molly invented the cutter before Troy, she is entitled to a patent and not Troy.',
      'Since Troy conceived of the idea after Molly and because Troy did not file a patent application before Molly, he is not entitled to priority over Molly.',
      'Since Molly disclosed the invention to Sue and Tom, the invention was known by others prior to the invention by Troy. Therefore, Troy is precluded by 35 U.S.C. § 102(a) from obtaining a patent on his idea.',
      'Since Molly effectively concealed her invention, Troy is entitled to a patent since although Molly conceived of the idea prior to Troy, she effectively abandoned the invention by not filing for twelve years.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 102(g) applies only when another inventor has not abandoned, suppressed or concealed the invention. Molly concealed the invention for 12 years, filing only after seeing the popularity of Troy’s device. (A) and (B) are not true because Molly concealed and effectively abandoned. (C) is not true since § 102(a) applies only when the invention is publicly known by others. Since (D) is true, (E) is not. [Pre-AIA] — under the AIA’s first-inventor-to-file system § 102(g) no longer applies to applications filed on or after March 16, 2013.',
  },
  {
    id: 'uspto-oct00-pm-16',
    topicId: 0,
    subtopic: 'Preexisting article — method-of-use claims vs apparatus claims',
    difficulty: 3,
    question:
      'In June 1995 Michael buys a television set with a remote control for automatically changing channels. In June 1997, Michael moves to a new neighborhood and discovers that the remote control not only changes the channels on his television set but also operates to open his neighbor’s garage door. The practitioner files a patent application in 1997 with claims 11 and 12: "11. An electronic device comprising: circuitry; said circuitry operating to emit signals of a predetermined waveform; said signals being used to automatically change channels on a television set and automatically open the door of a garage. 12. A method for opening a garage door comprising using a television remote control device to emit signals, comprising the steps of: a) adapting a television remote control device to emit signals to open a garage door; b) pointing said television remote control device at said garage door; and c) actuating said television remote control to cause said garage door to open." Which of the following is true?',
    options: [
      'Since the television and remote control were sold in June 1995, claims 11 and 12 are barred by 35 U.S.C. § 102(b) since the device was on sale more than one year prior to the invention by Michael.',
      'Although the device was bought in June 1995, Michael did not use it to open a garage door until 1997. Since claim 11 requires that the signals of the remote control operate to open the garage door, the limitations of claim 11 are not met by the device bought in 1995, and 35 U.S.C. § 102(b) does not apply.',
      'Since the television remote control device was in public use more than one year prior to the filing date of the application, Michael may obtain the patent coverage for the method claim 12 but not the device of claim 11.',
      'Since Michael did not make the remote control himself and only inadvertently discovered that his neighbor’s garage door opens when changing the channel on his television set, this is merely an inadvertent discovery and not entitled to patent protection.',
      'Whether or not claim 11 is patentable is solely a question of obviousness. Michael need only produce evidence of commercial success to overcome an obviousness rejection.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). When the article is preexisting, one may only secure patent protection of the method of using the article. Since claim 11 is defined in terms of circuitry and this circuitry was preexisting, claim 11 is not allowable. Cf. Monsanto Co. v. Rohm & Haas Co., 312 F. Supp. 778, 164 USPQ 556 (E.D. Pa. 1970), aff’d, 456 F.2d 592 (3d Cir.). (A) is incorrect because claim 12 is not barred by § 102(b). As to (B), the remote control device was preexisting and claim 11 reads on the circuitry as it existed in 1995. (D) is incorrect — the manner of invention, whether painstaking research or inadvertent discovery, is without significance. As to (E), evidence of commercial success may be relevant to § 103 but cannot overcome a rejection under § 102. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct00-pm-17',
    topicId: 3,
    subtopic: 'Amendment practice — specifying exact matter and precise point',
    difficulty: 3,
    question:
      'A patent application filed in the USPTO contains the following original claim: "Claim 1. A talbecloth for protecting the finish of a table comprising: a layer of cotton; a layer of vinyl affixed to the layer of cotton; and a backing of felt." Which of the following amendment(s) is/are not in accord with proper USPTO amendment practices and procedures?',
    options: [
      'In claim 1, line 3, add -with an epoxy resin-.',
      'In claim 1, line 2, after "cotton" add -woven to have 250 threads per inch-.',
      'In claim 1, line 3, before "layer" add –thin-.',
      'In claim 1, line 1, correct the spelling of "talbecloth" please.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). A claim may be amended by specifying the exact matter to be deleted or added, and the precise point where the deletion or addition is to be made. 37 C.F.R. § 1.121(a)(2)(i). Amendments are limited to deletions and/or additions of no more than 5 words per claim. (A) is improper because it does not specify the precise point where the addition is to be made. (B) is improper because it adds more than 5 words. (C) is improper because line 3 contains the word "layer" twice and the amendment does not specify which occurrence. (D) is improper because it does not specify the exact matter to be deleted and the exact matter to be inserted. [Historical practice] — the pre-2003 § 1.121 amendment format has been replaced by the current replacement-paragraph/claim-listing practice.',
  },
  {
    id: 'uspto-oct00-pm-18',
    topicId: 0,
    subtopic: 'Common ownership does not disqualify § 102(a) prior art',
    difficulty: 3,
    question:
      'Sally, an employee of Ted, conceived of and reduced to practice a spot remover for Ted on May 1, 1997. On June 2, 1997, Sally filed a nonprovisional U.S. patent application for the spot remover, and assigned the entire rights in the application to Ted. Sally’s assignment was not recorded in the USPTO, but was referred to in her application. On June 12, 1998, Jane, also an employee of Ted, having no knowledge of Sally’s spot remover, conceived of and reduced to practice a spot remover for Ted. On May 26, 1998, the USPTO granted Sally a patent. On November 6, 1998, Jane filed a nonprovisional U.S. patent application for the spot remover. As noted in Jane’s application, Jane assigned the entire rights in her application to Ted. Jane’s assignment was duly recorded in the USPTO. The examiner mailed a non-final Office action rejection under 35 U.S.C. § 103 to Jane in October 2000, citing the patent to Sally as prior art. Which of the following, if timely filed by Jane, would be effective in disqualifying Sally’s patent? I. An affidavit by Jane stating that the application files of Sally and Jane both refer to assignments to Ted. II. A copy of Sally’s assignment to Ted, clearly indicating that common ownership of Jane’s and Sally’s inventions existed at the time Jane’s invention was made. III. An affidavit by Ted stating sufficient facts to show that there is common ownership of the Sally and Jane inventions and that common ownership existed at the time the Jane invention was made.',
    options: ['I', 'II', 'III', 'II and III', 'None of the above.'],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer because Sally’s patent is prior art under 35 U.S.C. § 102(a) and cannot be disqualified by a showing of common ownership, which can be used to disqualify prior art under 35 U.S.C. § 102(f) and (g). 37 C.F.R. § 1.104(a)(5); MPEP §§ 706.02(l) and 706.02(l)(2). [Pre-AIA] — the AIA replaced the common-ownership disqualification with the § 102(b)(2)(C) and § 102(c) provisions.',
  },
  {
    id: 'uspto-oct00-pm-19',
    topicId: 0,
    subtopic: '35 U.S.C. § 101 — statutory classes and naturally occurring compositions',
    difficulty: 3,
    question:
      'Bill found a natural specimen of tree sap that had bonded rock material to a log, and was impervious to water. Chemical analysis showed it was 10% A, 30% B, and 60% C. Bill found he could synthetically produce the sap by mixing one part A by weight and three parts B by weight at 20 degrees Celsius, heating the mixture to 100 degrees Celsius, adding six parts C by weight, and cooling to 20 degrees Celsius. Adding an effective amount of D prior to cooling decreases viscosity. Which if any of the following claims, included in Bill’s application, would not be properly rejected pursuant to 35 U.S.C. § 101? "Claim 1. A composition for bonding asphalt shingles to wood sheathing and a method, comprising: a mixture of 10%A, 30%B, and 60%C, and adding an effective amount of D to decrease the viscosity of the mixture. Claim 2. A composition for bonding asphalt shingles to wood sheathing, comprising 10% A, 30% B, and 60% C. Claim 3. A composition produced by the steps of: mixing one part A by weight with three parts B by weight at 20 degrees Celsius to form a mixture of A and B; heating the mixture of A and B to 100 degrees Celsius; adding six parts C by weight to form a mixture of A, B, and C; cooling the mixture of A, B, and C to 20 degrees Celsius; and adding an effective amount of D to decrease the viscosity of the composition."',
    options: ['Claim 1', 'Claim 2', 'Claim 3', 'Claims 2 and 3', 'None of the above.'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer because patentability of a product claimed by a product-by-process claim is based on the product itself, and the claimed subject matter in claim 3 is not naturally occurring. MPEP § 2105. (A) is incorrect because claim 1 recites both a product and a process in the same claim and is therefore not within one of the statutory classes set forth by 35 U.S.C. § 101. MPEP § 2173.05(p), subpart (II). (B) and (D) are incorrect because claim 2 is drawn to a naturally occurring composition. MPEP § 2105. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct00-pm-20',
    topicId: 1,
    subtopic: '35 U.S.C. § 112, second paragraph — "effective amount" without stated function',
    difficulty: 3,
    question:
      'Assuming that A, B, C, and D are known materials, which if any of the following claims, included in Bill’s application, would not be properly rejected pursuant to 35 U.S.C. 112, second paragraph? "Claim 1. A composition produced by the steps of: mixing one part A by weight with three parts B by weight at 20 degrees Celsius to form a mixture of A and B; heating the mixture of A and B to 100 degrees Celsius; and adding six parts C by weight to the mixture of A and B. Claim 2. A composition for bonding asphalt shingles to wood sheathing, comprising 10% A, 30% B, and 60% C. Claim 3. A composition produced by the steps of: mixing one part A by weight with three parts B by weight at 20 degrees Celsius to form a mixture of A and B; heating the mixture of A and B to 100 degrees Celsius; adding six parts C by weight to form a mixture of A, B, and C; cooling the mixture of A, B, and C to 20 degrees Celsius; and adding an effective amount of D."',
    options: ['Claim 1.', 'Claim 2.', 'Claim 3.', 'Claims 1 and 2.', 'None of the above.'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. Claims 1 and 2 are drawn to a naturally occurring composition but do not provide the basis for a rejection under 35 U.S.C. § 112, second paragraph, even though they do provide the basis for a rejection under 35 U.S.C. § 101. MPEP § 2105. Therefore (A) and (B) are incorrect. Claim 3 is indefinite because it recites an "effective amount" without stating the function to be achieved. MPEP § 2173.05(c). Therefore (C) is incorrect. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-oct00-pm-21',
    topicId: 3,
    subtopic: 'Proposing drawing corrections in a reply',
    difficulty: 2,
    question:
      'You are prosecuting a patent application wherein an Office action has been issued rejecting the claims as being obvious over the prior art and objecting to the drawings as failing to illustrate an item that is fully described in the specification and included in a dependent claim. The examiner has required an amendment to Figure 1 to illustrate the item. In preparing a reply, you identify several errors in Figure 2 that should also be corrected. Assuming that you make an amendment to the claims and develop persuasive arguments to overcome the obviousness rejection and that the examiner will not object to your desired changes to Figure 2, which of the following actions is likely to lead to the most favorable result?',
    options: [
      'Submit a reply amending the claims and setting forth your arguments to overcome the obviousness rejection. Submit a separate cover letter for replacement Figures 1 and 2 that incorporate the amendments to the drawings.',
      'Submit a reply amending the claims and setting forth your arguments to overcome the obviousness rejection. In the Remarks portion of the reply, explain the proposed drawing changes and attach copies of Figures 1 and 2 with the changes marked in red for the examiner’s review and approval.',
      'Submit a reply amending the claims and setting forth your arguments to overcome the obviousness rejection. In a separate paper, explain the proposed drawing changes and attach copies of Figures 1 and 2 with the changes marked in red for the examiner’s review and approval.',
      'Options (A), (B) and (C) are equally likely to lead to the most favorable result.',
      'Options (B) and (C) are equally likely to lead to the most favorable result.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). (A) is not the best answer because drawing changes normally must be approved by the examiner before the application will be allowed; the examiner must give written approval before the drawing is corrected. MPEP § 608.02(q). (B) is not the best answer because any proposal for amendment of the drawing to cure defects must be embodied in a separate letter to the draftsman. MPEP § 608.02(r). (D) is not the best answer because it incorporates (A) and (B), and (E) is not the best answer because it incorporates (B). [Historical practice] — the separate-letter-to-the-draftsman practice and red-ink marked prints have since been replaced by replacement-sheet drawing practice.',
  },
  {
    id: 'uspto-oct00-pm-22',
    topicId: 3,
    subtopic: 'Overcoming a § 102(a) rejection — limits of 37 C.F.R. § 1.131',
    difficulty: 3,
    question: 'A rejection based on 35 U.S.C. § 102(a) cannot be overcome by:',
    options: [
      'Filing an affidavit under 37 C.F.R. § 1.132 showing that the reference invention is not by "another."',
      'Perfecting a claim to priority under 35 U.S.C. § 119(a)-(d).',
      'Filing an affidavit under 37 C.F.R. § 1.131 "swearing back" of a U.S. patent which substantially shows or describes, and claims the same patentable invention as the rejected invention.',
      'Amending the claims to patentably distinguish over the prior art.',
      'Persuasively arguing that the claims are patentably distinguishable from the prior art.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer because 37 C.F.R. § 1.131 requires that the reference not claim the same patentable invention as the rejected invention. (A), (B), (D), and (E) are wrong because MPEP § 706.02(b) identifies these answers as actions that can be taken to overcome a 35 U.S.C. § 102(a) rejection. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-oct00-pm-23',
    topicId: 3,
    subtopic: 'When a 37 C.F.R. § 1.131 antedating declaration is appropriate',
    difficulty: 3,
    question:
      'Which of the following statements is correct regarding an antedating declaration or affidavit being used in accordance with proper USPTO practice and procedure?',
    options: [
      'Where the reference, a U.S. Patent, with a patent issue date less than one year prior to applicant’s effective filing date, shows but does not claim the same patentable invention.',
      'Where the reference publication date is more than one year before applicant’s effective filing date.',
      'Where the reference is a prior U.S. patent to the same entity, claiming the same invention.',
      'Where the subject matter relied on in the reference is prior art under 35 U.S.C. § 102(g).',
      'Where the effective filing date of applicant’s parent application or an International Convention-proved filing date is prior to the effective date of the reference.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 102(a); MPEP § 715, "SITUATIONS WHERE 37 C.F.R. 1.131 AFFIDAVITS OR DECLARATIONS CAN BE USED." (B) is incorrect — § 102(b) statutory bar. (C) is incorrect — the question involved is one of "double patenting." (D) is incorrect — when the subject matter relied on is also available under § 102(g), a § 1.131 affidavit cannot be used to overcome it, because § 102(g) subject matter must by definition have been made before the applicant made his invention. In re Bass, 474 F.2d 1276, 177 USPQ 178 (CCPA 1973). (E) is incorrect — an affidavit is unnecessary because the reference is not prior art. MPEP § 715. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-oct00-pm-24',
    topicId: 6,
    subtopic: 'Design patents vs utility patents',
    difficulty: 2,
    question:
      'Abigail has invented a novel watering mechanism for a flower pot. The flower pot also possesses a unique ornamental design. Abigail consults with patent practitioner P for advice on the differences between a design patent and a utility patent. Which of the following general statements regarding design and utility patents, if made by P, would be accurate?',
    options: [
      'A "utility patent" protects the way an article is used and works, while a "design patent" protects the way an article looks.',
      'Unlike utility patent applications, a design patent application may not make a claim for priority of a provisional patent application.',
      'Maintenance fees are required for utility patents, while no maintenance fees are required for design patents.',
      'Both design and utility patents may be obtained on an article if the invention resides both in its utility and ornamental appearance.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP §§ 1502.01; 201.04(b).',
  },
  {
    id: 'uspto-oct00-pm-25',
    topicId: 3,
    subtopic: 'Examiner reliance on common knowledge in a § 103 rejection',
    difficulty: 3,
    question:
      'Which of the following statements concerning reliance by an examiner on common knowledge in the art, in a rejection under 35 U.S.C. § 103 is correct? I. Applicant can traverse an examiner’s statement of common knowledge in the art, at any time during the prosecution of an application to properly rebut the statement. II. An examiner’s statement of common knowledge in the art is taken as admitted prior art, if applicant does not seasonably traverse the well known statement during examination. III. If applicant rebuts an examiner’s statement of common knowledge in the art in the next reply after the Office action in which the statement was made, the examiner can never provide a reference to support the statement of common knowledge in the next Office action and make the next Office action final.',
    options: ['I', 'II', 'III', 'I and II', 'None of the above.'],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. MPEP § 2144.03. I is incorrect because an applicant must seasonably traverse the well-known statement or the object of the well-known statement is taken to be admitted prior art. In re Chevenard, 60 USPQ 239 (CCPA 1943). Therefore (A) and (D) are incorrect. III is incorrect because the action can potentially be made final. Therefore (C) is incorrect. (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-oct00-pm-26',
    topicId: 3,
    subtopic: 'Overcoming a § 102(e) rejection — antedating by foreign priority',
    difficulty: 3,
    question:
      'In which of the following situations can the applicant overcome a rejection under 35 U.S.C. § 102(e) over a U.S. patent in accordance with proper USPTO practice and procedure?',
    options: [
      'An applicant can antedate the filing date of the patent used to reject claims under 35 U.S.C. § 102(e) by relying upon the filing date of applicant’s prior abandoned nonprovisional patent application, which was filed before the effective date of the prior art. The abandoned application was not copending with the applicant’s current patent application. The applicant did not file any other patent applications, and is not entitled to benefit of priority of the abandoned application.',
      'An applicant can antedate the filing date of the patent used to reject claims under 35 U.S.C. § 102(e) if the applicant relies on the applicant’s earlier foreign priority application, which conforms to the requirements of the first paragraph of 35 U.S.C. § 112 for all claims in the applicant’s U.S. patent application, and all relevant provisions of 35 U.S.C. § 119 have been met. The foreign application has a filing date prior to the filing date of the patent.',
      'An applicant can antedate the publication of his own invention more than one year before his first patent application was filed by showing that it is a publication of his own work.',
      'An applicant can antedate the patent to a different inventive entity where the patent discloses but does not claim the applicant’s invention, the patent describes the applicant’s own work, and the applicant states that the different inventive entity derived the invention from him. The applicant files an affidavit disclosing the foregoing, but lacks evidence showing who invented the claimed subject matter.',
      '(A), (B), (C) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). In re Gosteli, 10 USPQ2d 1614 (Fed. Cir. 1989); MPEP § 2136.05. (A) is incorrect — a prior abandoned application that was not copending with the application in issue cannot be used to antedate a reference. In re Costello, 219 USPQ 389 (Fed. Cir. 1983). (C) is incorrect — the one year time bar precludes antedating the publication. 35 U.S.C. § 102(b); In re DeBaun, 214 USPQ 933 (CCPA 1982). (D) is incorrect — the applicant must produce evidence showing who invented the subject matter. In re Whittle, 172 USPQ 535, 537 (CCPA 1972). (E) is incorrect inasmuch as (A), (C) and (D) are incorrect. [Pre-AIA] — decided under pre-AIA § 102(e).',
  },
  {
    id: 'uspto-oct00-pm-27',
    topicId: 0,
    subtopic: 'Statutory bars — foreign sales and experimental use',
    difficulty: 3,
    question:
      'Which of the following properly creates a statutory bar to patentability of applicant’s claimed invention? I. Applicant’s invention was sold in Tokyo and New York more than one year prior to the effective U.S. filing date, but the sales were merely attempts at market penetration. II. Applicant’s invention was experimented with and tested to further develop the invention more than one year prior to the effective U.S. filing date, but important modifications resulted from the experimentation causing the invention to be reduced to practice after the effective U.S. filing date. III. Applicant’s invention was sold in Tokyo more than one year prior to the effective U.S. filing date, but the sale was merely market testing of the invention to determine product acceptance.',
    options: ['I', 'II', 'III', 'I and III', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 2133.03(e)(1) and 35 U.S.C. § 102(b). II does not create a statutory bar because it is permitted experimental testing. MPEP §§ 2133.03(e)(3) and (6). Therefore (B) is incorrect. III does not create a statutory bar because the sale did not occur in the United States. MPEP § 2133.03(d). Therefore (C) and (D) are incorrect. (E) is incorrect because (A) is correct. [Pre-AIA] — the AIA removed the geographic limitation, so a sale outside the United States can now bar patentability.',
  },
  {
    id: 'uspto-oct00-pm-28',
    topicId: 2,
    subtopic: 'Information disclosure statement after a Notice of Allowance',
    difficulty: 3,
    question:
      'You filed an application on behalf of inventor Sam, obtaining an effective filing date of September 7, 1999. You received a non-final Office action dated August 7, 2000. On October 6, 2000, you timely filed a reply under 37 C.F.R. § 1.111. You received a Notice of Allowance dated October 12, 2000. On October 15, 2000, Sam showed you a journal article dated September 5, 1998, which is material to the patentability of Sam’s invention as claimed. Which of the following actions, if taken by you, are in accordance with proper USPTO rules and procedure? I. Pay the issue fee on October 18, 2000 and do not file an information disclosure statement disclosing the article dated September 5, 1999, since after the issue fee has been paid on an application, it is impractical for the Office to attempt to consider newly submitted information. II. Prior to paying the issue fee, file an information disclosure statement disclosing the article dated September 5, 1998, and the fee set forth in 37 C.F.R. § 1.17(p). III. Prior to paying the issue fee, file an information disclosure statement disclosing the article dated September 5, 1998, a statement as specified in 37 C.F.R. § 1.97(e), a petition requesting consideration of the information disclosure statement, and the petition fee set forth in 37 C.F.R. § 1.17(i).',
    options: ['I', 'II', 'III', 'I and III', 'I, II, and III'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 609(B)(3) and 37 C.F.R. § 1.97. (A) is incorrect because each individual associated with the filing and prosecution of a patent application has a duty to disclose to the Office all information which they know to be material to the patentability of pending claims. 37 C.F.R. § 1.56. (B) is incorrect because 37 C.F.R. § 1.97(d) requires the filing of the items specified in III, including the § 1.97(e) statement, after the mailing date of a notice of allowance. (D) is incorrect because I is incorrect. (E) is incorrect because only III is correct.',
  },
  {
    id: 'uspto-oct00-pm-29',
    topicId: 4,
    subtopic: 'Foreign activity — § 102(b) public use abroad and § 104 proof of invention date',
    difficulty: 3,
    question:
      'Your Canadian client, UpNorth Incorporated, came to you on August 11, 2000 with a valuable invention for pulping timber. UpNorth informed you it had been successfully using the invention commercially for the past fourteen months deep in the Canadian forests. The invention has not been used anywhere else by UpNorth. At least one competitor, another Canadian company, lawfully observed the invention in operation during its first month of use with no restriction as to confidentiality. UpNorth filed a Canadian patent application prior to commercial use of the invention, but chose not to file a corresponding application in the United States. The Canadian patent application remains pending. UpNorth just learned that two months ago its competitor began using the invention commercially in the United States. The invention was never disclosed or used in the United States prior to two months ago. UpNorth would like you to seek a United States patent on the invention to block the competitor. Which of the following would be reasonable advice from you to UpNorth?',
    options: [
      'Since Canada is a NAFTA country, UpNorth is precluded from getting a United States patent because the Canadian application was filed more than twelve months ago and the invention was in public use more than one year prior to any possible United States filing date for an UpNorth patent application.',
      'UpNorth should promptly file an application in the United States claiming the benefit of the filing date of the Canadian application and should fully disclose the Canadian commercial activities, the observation of the invention in Canada by UpNorth’s competitor, and the competitor’s commercial activities in the United States.',
      'UpNorth should promptly file an application in the United States without claiming the benefit of the filing date of the Canadian application and should fully disclose the Canadian commercial activities, the observation of the invention in Canada by UpNorth’s competitor, and the competitor’s commercial activities in the United States.',
      'UpNorth should abandon the pending Canadian application to avoid the possibility the Canadian application could be used as prior art against a United States patent application, and then file a patent application in the United States.',
      'Since UpNorth’s activities concerning the invention all took place in Canada, the competitor’s commercial use in the United States prior to any possible United States filing date for an UpNorth patent application precludes UpNorth from obtaining a United States patent.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (C). With regard to (A), public use in Canada is not a statutory bar under 35 U.S.C. § 102(b) regardless of whether Canada is a NAFTA country. MPEP § 706.02(c). Thus, although UpNorth cannot claim priority to the Canadian application under § 119, their commercial activity is not a bar. (B) is incorrect because UpNorth cannot rely on the Canadian application for priority. Under the given facts the Canadian application would not be prior art against a U.S. application regardless of abandonment, so (D) is not reasonable advice. Under 35 U.S.C. § 104, UpNorth can rely on Canadian activities to establish a date of invention prior to the competitor’s commercial use in the United States, so (E) is not reasonable advice. [Pre-AIA] — the AIA removed the geographic limitation on public use and repealed § 104.',
  },
  {
    id: 'uspto-oct00-pm-30',
    topicId: 3,
    subtopic: 'Petition to make special — grounds and fees',
    difficulty: 3,
    question:
      'You prepare and file a patent application directed to an invention for improving the safety of research in the field of recombinant DNA. Your client, Inventor Joe, informs you he has licensed exclusive rights to his invention to a major pharmaceutical company. Inventor Joe also informs you that he is aware that another pharmaceutical company, Titan Pharmaceuticals, learned of the invention from a paper he presented at a technical conference, and is preparing to use the technology in its commercial research labs in the United States. Inventor Joe demonstrates that Titan is about to begin practicing the invention by showing you a rigid comparison of Titan’s intended activities and the claims of the application. He also informs you that although he is currently in very good health, he is 67 years old. Accordingly, if possible he would like for you to expedite prosecution in the simplest, most inexpensive way. Given the foregoing circumstances, which of the following statements is most correct?',
    options: [
      'Since the invention relates to improving the safety of research in the field of recombinant DNA, you should recommend filing a petition to make special on that basis.',
      'Since Titan is actually practicing the invention set forth in the pending claims, you should recommend filing a petition to make special on that basis.',
      'You should recommend filing a petition to make special on the basis of Inventor Joe’s age.',
      'Statements (A), (B) and (C) are equally correct.',
      'Statements (A), (B) and (C) are each incorrect.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (C). A petition to make special may be made simply by filing a petition including any evidence showing that the applicant is 65 years of age or more, such as a birth certificate or a statement from the applicant. No fee is required. MPEP § 708.02. Although a petition to make special as indicated in (A) is likely available, it would require a petition fee and a statement explaining the relationship of the invention to safety of research in recombinant DNA. A petition as indicated in (B) is likely not available because such a petition may not be based on prospective infringement, and would in any event require a fee.',
  },
  {
    id: 'uspto-oct00-pm-31',
    topicId: 3,
    subtopic: '37 C.F.R. § 1.131 — conception plus diligence',
    difficulty: 3,
    question:
      'Assume that conception of applicant’s complex invention occurred prior to the date of the reference, but reduction to practice occurred after the date of the reference. Which of the following is sufficient to overcome the reference in accordance with proper USPTO practice and procedure?',
    options: [
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to allege that applicant or patent owner has been diligent.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference. Diligence need not be considered.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference, and diligence from just prior to the effective date of the reference to actual reduction to practice. The presence of a lapse of time between the reduction to practice of an invention and the filing of an application thereon is not relevant.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is sufficient to show conception and reduction to practice in any country.',
      'In a 37 C.F.R. 1.131 affidavit or declaration, it is always sufficient to prove actual reduction to practice for all mechanical inventions by showing plans for the construction of the claimed apparatus.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). See Ex parte Merz, 75 USPQ 296 (Bd. App. 1947) (the "lapse of time between the completion or reduction to practice of an invention and the filing of an application thereon" is not relevant to a § 1.131 affidavit); MPEP § 715.07(a). (A) is incorrect — applicant must show evidence of facts establishing diligence. (B) is incorrect — after conception is clearly established, diligence must be considered. (D) is incorrect — § 1.131(a) permits establishing a date of completion in a NAFTA member country on or after December 8, 1993 and in a WTO member country on or after January 1, 1996; not all countries are members. MPEP § 715.07(c). (E) is incorrect — actual reduction to practice generally requires a showing that the apparatus actually existed and worked. MPEP § 715.07. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-oct00-pm-32',
    topicId: 4,
    subtopic: 'Perfecting a foreign priority claim after issuance',
    difficulty: 3,
    question: 'Which of the following statements is not true?',
    options: [
      'The failure to perfect a claim to foreign priority benefit prior to issuance of the patent may be cured by filing a reissue application.',
      'The failure to both express a desire to obtain the benefits of foreign priority and perfect a claim to foreign priority benefit prior to issuance of a parent patent may be cured by filing a Certificate of Correction request provided the requirements of 35 U.S.C. § 119(a)-(d) are satisfied in a continuation application.',
      'The failure to perfect a claim to foreign priority benefit prior to issuance of a patent on a continuation application may be cured by filing a Certificate of Correction request provided the requirements of 35 U.S.C. § 119(a)-(d) are satisfied in the parent application prior to issuance, and the requirements of 35 U.S.C. § 120 and 37 C.F.R. § 1.55 are satisfied.',
      'No renewal of previously made claims for foreign priority under 35 U.S.C. § 119 or continuation status of an application under 35 U.S.C. § 120 is necessary during reexamination.',
      'A sole or joint applicant may rely on two or more different foreign applications and may be entitled to the filing date of one of them with respect to certain claims and to another with respect to other claims.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). There must be a previously expressed desire by the applicant to receive benefits under a claim of priority before a Certificate of Correction request will be granted. While a continuation application can rely on a previously expressed desire in a parent case, a parent case has no prior application to look to. MPEP § 201.16. (A) is incorrect because it is a true statement. See Brenner v. State of Israel, 158 USPQ 584 (D.C. Cir. 1968). (C) and (D) are true statements. In re Van Esdonk, 187 USPQ 671 (Comm’r Pat. 1975); MPEP §§ 201.16 and 2258. (E) is a true statement. MPEP § 201.15.',
  },
  {
    id: 'uspto-oct00-pm-33',
    topicId: 7,
    subtopic: 'Who may sign papers — unregistered practitioners and void powers of attorney',
    difficulty: 3,
    question:
      'Mike and Jill are members of the Virginia Bar with a general law practice. Jill is registered to practice before the USPTO. Jake, one of Mike’s former clients, invented a tool that easily extracts a broken bit. Jake asked Mike if he could patent his invention, and Mike said, "No problem." Using a "how to" book, Mike prepared an application on Jake’s invention and filed it in the USPTO together with a power of attorney which Jake executed naming Jack as attorney of record. Shortly thereafter, the Mike and Jill firm hired Jim, a registered patent attorney, and Mike physically filed a document with the USPTO naming Jim as an associate attorney in Jake’s application. Upon reviewing Jake’s application, Jim discovered that the original claims omitted the recitation of a critical element which was disclosed in the specification. Assuming a preliminary amendment is filed with the USPTO adding the critical element to the claims, which of the following is the most comprehensive answer in identifying the individual(s), if any, who by signing the amendment will be recognized by the USPTO for representation?',
    options: ['Jake', 'Jim', 'Jill', 'All of the above', 'None of the above'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Jake is the applicant, and Jim and Jill are registered practitioners. "An applicant for patent may file and prosecute his or her own application." MPEP § 401. The applicant is not required to revoke Mike’s power of attorney because Jack is unregistered, and therefore his appointment is void ab initio. MPEP § 402. Jim and Jill’s signature constitutes "a representation to the Patent and Trademark Office that … he or she is authorized to represent the particular party in whose behalf he or she acts." 37 C.F.R. § 1.34. This privilege applies whether or not the registered attorney is of record. 37 C.F.R. § 1.31; MPEP § 402. (A), (B), and (C) are wrong because they do not represent the "most comprehensive" answer. [Historical practice] — the governing conduct rules are now 37 C.F.R. Part 11, not Part 10.',
  },
  {
    id: 'uspto-oct00-pm-34',
    topicId: 2,
    subtopic: 'Notice to File Missing Parts — extensions of time',
    difficulty: 3,
    question:
      'You filed a patent application naming your client, Sam, as the sole inventor without an executed declaration under 37 C.F.R. § 1.63. The USPTO mailed you a Notice to File Missing Parts dated January 3, 2000. The Notice set a 2-month period for reply. Which of the following statements is in accordance with proper USPTO rules and procedure? I. An appropriate reply is, on August 3, 2000 you file a declaration under 37 C.F.R. § 1.63 executed by Sam, with a petition under 37 C.F.R. § 1.136(a) for an extension of five months, and the fee set forth in 37 C.F.R. § 1.17(a). II. In no situation can any extension requested by you carry the date on which reply is due to the Notice to File Missing Parts beyond Monday, July 3, 2000. III. An appropriate reply is, on August 3, 2000 you file a declaration under 37 C.F.R. § 1.63 executed by Sam, with a petition under 37 C.F.R. § 1.136(b).',
    options: ['I', 'II', 'III', 'I and III', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 710.02(d), last paragraph, and 37 C.F.R. § 1.136(a). (B) is incorrect because a Notice to File Missing Parts of an Application is not identified on the Notice as a statutory period subject to 35 U.S.C. § 133. (C) and (D) are incorrect because the provisions of 37 C.F.R. § 1.136(a) are available. (E) is incorrect because (A) is correct.',
  },
  {
    id: 'uspto-oct00-pm-35',
    topicId: 1,
    subtopic: 'Transitional phrases — dependent claim adding a step to a "consisting of" claim',
    difficulty: 2,
    question:
      'A patent application filed in the USPTO contains the following dependent claim: "2. The method of Claim 1, further consisting of the step of cooling the mixture to a temperature of 32° F." Following proper USPTO practices and procedures, from which of the following claims does Claim 2 not properly depend?',
    options: [
      '1. A method of making liquid compound A consisting of the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '1. A method of making liquid compound A comprising the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '1. A method of making liquid compound A including the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '1. A method of making liquid compound A characterized by the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '(C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. The phrase "consisting of" excludes any step not specified in the claim. MPEP § 2111.03. Thus, a claim that depends from a claim which "consists of" the recited steps cannot add a step. Here, the dependent claim adds the step of cooling. (B) is incorrect because the transitional term "comprising" is inclusive or open-ended. (C) and (D) are incorrect because the terms "including" and "characterized by" are synonymous with "comprising." (E) is incorrect because (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-oct00-pm-36',
    topicId: 1,
    subtopic: 'Multiple dependent claims',
    difficulty: 3,
    question:
      'The following statements relate to "multiple dependent claims." Which statement is not in accord with proper USPTO practice and procedure?',
    options: [
      'A multiple dependent claim contains all the limitations of all the alternative claims to which it refers.',
      'A multiple dependent claim contains in any one embodiment only those limitations of the particular claim referred to for the embodiment under consideration.',
      'A multiple dependent claim must be considered in the same manner as a plurality of single dependent claims.',
      'Restriction may be required between the embodiments of a multiple dependent claim.',
      'The limitations or elements of each claim incorporated by reference into a multiple dependent claim must be considered separately.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). The answer is inconsistent with 35 U.S.C. § 112 and MPEP § 608.01(n), subpart I.B.4. (B), (C), and (E) are wrong answers because they are consistent with 35 U.S.C. § 112 and MPEP § 608.01(n), subpart I.B.4. (D) is wrong because it is consistent with MPEP § 608.01(n), subpart I.C.',
  },
  {
    id: 'uspto-oct00-pm-37',
    topicId: 3,
    subtopic: 'Preliminary amendment and new matter',
    difficulty: 3,
    question:
      'You have taken over prosecution of a patent application in January 1998 that had previously been handled by another patent practitioner. The original application had been filed with all required fees, a preliminary amendment, and a signed inventor’s declaration referring to the original application. The original application contained independent claims 1 and 7 and dependent claims 2-6 and 8-14. The preliminary amendment added independent claim 15 and dependent claims 16-19, but made no changes to the specification. A first, nonfinal Office action issued wherein the examiner determined that claim 17 included new matter. The examiner rejected claim 17 on this basis and required cancellation of the claim. All other claims were allowed. Which of the following is the most reasonable reply?',
    options: [
      'File a Request for Reconsideration explaining that since the Preliminary Amendment was filed concurrently with the original application, the examiner should consider the Preliminary Amendment to be part of the original disclosure and the rejection should be removed.',
      'File a Petition under 37 C.F.R. § 1.181 for a review of the examiner’s determination that claim 17 includes new matter along with any required fees.',
      'File a Notice of Appeal along with any required fees.',
      'Submit a new inventor’s declaration that refers to both the original application and the preliminary amendment along with a Request for Reconsideration explaining that since the Preliminary Amendment was filed concurrently with the original application, the examiner should consider the Preliminary Amendment to be part of the original disclosure and the rejection should be removed.',
      'Submit a new inventor’s declaration that refers to both the original application and the preliminary amendment, file a Petition under 37 C.F.R. § 1.182 along with the petition fee, requesting that the original oath or declaration be disregarded and that the application be treated as an application filed without an oath or declaration, and pay the surcharge for missing parts.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP §§ 608.04(b) and 608.04(c). (A) is incorrect because the preliminary amendment does not enjoy the status as part of the original disclosure in an application accompanied by a signed declaration unless the preliminary amendment is referred to in the declaration. (B) is incorrect because a petition under § 1.181 would only be appropriate if the new matter is confined to the specification; if it affects the claims, the question becomes an appealable one. (C) is incorrect because the Office action is a first, non-final action and the issue is not yet ripe for appeal. 37 C.F.R. § 1.191. (D) is incorrect because the original disclosure cannot be altered merely by filing a subsequent oath or declaration referring to different papers. [Historical practice] — reversed in 2004: a preliminary amendment present on the filing date is now part of the original disclosure.',
  },
  {
    id: 'uspto-oct00-pm-38',
    topicId: 1,
    subtopic: 'Dependent claim form — alternative reference and antecedent basis',
    difficulty: 3,
    question:
      'Claims 1 and 2 in a patent application state the following: "Claim 1. An apparatus for sitting comprising: (i) a square shaped base member; (ii) four elongated members mounted to the bottom of the base member; and (iii) a circular back member mounted to the base member. Claim 2. An apparatus as in claim 1, further comprising a spring connected to the back member and to the base member." Which, if any, of the following claims fully supported by the specification and presented in the application, is in accordance with USPTO rules and procedure?',
    options: [
      '3. An apparatus as in any of the preceding claims, in which the circular back member is wooden.',
      '3. An apparatus as in claim 1, wherein the base member is rectangularly shaped.',
      '3. An apparatus as in claim 2, wherein the wheels connected to each of the elongated members are plastic.',
      '3. An apparatus as in the preceding claims, further comprising a pressure-sensing device connected to the base member.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 608.01(n). (B) is incorrect because a dependent claim must further limit the subject matter of a previous claim; the claim in (B) is actually inconsistent with claim 1. 37 C.F.R. § 1.75(c). (C) is incorrect because there is no antecedent basis for the wheels. MPEP § 2173.05(e). (D) is incorrect because it does not refer back in the alternative only. MPEP § 608.01(n). (E) is incorrect because (A) is correct.',
  },
  {
    id: 'uspto-oct00-pm-39',
    topicId: 2,
    subtopic: 'Material prior art discovered after the issue fee is paid',
    difficulty: 3,
    question:
      'Al files an application for a patent. After the Notice of Allowance is mailed and the issue fee has been paid Al discovers a prior art reference which is material to patentability. What should Al do?',
    options: [
      'Al should file a prior art statement under 37 C.F.R. § 1.501 that will be placed in the patent file upon issuance of the application as a patent.',
      'Since the issue fee has been paid, Al no longer has a duty to disclose to the Office material prior art. He is under no obligation to submit the prior art reference to the Office.',
      'Since the issue fee has been paid, it is too late to have the examiner consider the reference in this application. Al should file a continuation application to have the reference considered and allow the original patent application to issue as a patent.',
      'Al should file a petition to have the application withdrawn from issuance, citing the finding of additional material prior art as the reason for withdrawal. A continuation application should also be filed with an information disclosure statement containing the reference in order to have the reference considered.',
      'Al should file an amendment under 37 C.F.R. 1.312 deleting all of the claims which are unpatentable over the reference since an amendment deleting claims is entitled to entry as a matter of right.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). See 37 C.F.R. § 1.313(b); MPEP §§ 609, subpart (B)(4) and 1308. After payment of the issue fee it is impractical for the Office to consider any information disclosures. As to (A), a prior art statement is applicable only to patent, not application, files. 37 C.F.R. § 1.501. As to (B), the duty of disclosure continues until the patent is issued. As to (C), the patent should not be allowed to issue since it may contain invalid claims. As to (E), no amendment is entitled to entry after payment of the issue fee. 37 C.F.R. § 1.312(b).',
  },
  {
    id: 'uspto-oct00-pm-40',
    topicId: 5,
    subtopic: 'Admissions as prior art — binding effect in reissue',
    difficulty: 3,
    question:
      'Stan, through a registered practitioner, files an application for a patent. During prosecution, in an amendment, the practitioner admitted in his discussion as to "all the claims" of Stan’s application, that "the most pertinent available prior art known to the Applicants and their representatives is the Acme Patent, cited by the examiner." Within one year after the patent issues, Stan comes to you and wants to file a reissue to broaden his claims, based on the fact that the Acme patent is not prior art. He has ample evidence to show that he conceived and reduced his invention to practice before the filing date of the Acme patent. Which of the following is true?',
    options: [
      'Stan should file a reissue application accompanied by a declaration under 37 C.F.R. 1.131 to swear behind the date of the Acme reference. The statement by the registered practitioner, who formerly represented Stan, that the Acme patent was prior art constituted error without deceptive intent and may be corrected by reissue.',
      'Stan should file a request for reexamination and submit the Acme patent along with evidence in the form of affidavits or declarations showing that the Acme patent is not prior art.',
      'The explicit admission by registered practitioner, who formerly represented Stan, that the Acme patent constituted prior art is binding on Stan in any later proceeding involving the patent.',
      'Since Acme patent was cited by the examiner and not by the registered practitioner, who formerly represented Stan, Stan can not be held accountable for the error. Moreover, the statement by was directed to the pertinence of the prior art and not to the issue of whether the date of the Acme patent could be sworn behind. Accordingly, the statement has no binding effect.',
      '(A) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Admissions by applicant constitute prior art. As explained in Tyler Refrigeration v. Kysor Industrial Corp., 777 F.2d 687, 227 USPQ 845 (Fed. Cir. 1985), an attorney’s explicit admission in a wrap-up amendment that a cited reference is "the most pertinent available prior art known to the Applicants and their representatives" was binding. Since (C) is true, (D) is not. Answers (A), (B) and (D) also are not true since the Acme patent cannot be sworn behind or otherwise removed as a result of the admission. (E) is not true because (A) and (D) are not true.',
  },
  {
    id: 'uspto-oct00-pm-41',
    topicId: 3,
    subtopic: 'Amendments after a Notice of Allowance — 37 C.F.R. § 1.312',
    difficulty: 3,
    question:
      'Where an amendment of a specification or claims is filed after a notice of allowance has been mailed, which of the following is not in accordance with proper USPTO practice and procedure?',
    options: [
      'Even though prepared by a practitioner and mailed without a certificate of mailing and not by express mail, all prior to allowance, and the amendment reaches the Office only after the notice of allowance has been mailed, such amendment has the status of one filed after the mailing of the notice of allowance.',
      'A supplemental oath or declaration is treated as an amendment of the specification or claims.',
      'The amendment may be refused entry because an additional search is required.',
      'The amendment may be refused entry because more than a cursory review of the record is necessary.',
      'The amendment may be refused entry because the amendment would involve materially added work on the part of the examiner; e.g., checking excessive editorial changes in the specification or claims.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is not in accordance with proper USPTO practice and procedure, and is the correct answer. A supplemental oath or declaration in a nonprovisional application other than a reissue application is not treated as an amendment of the specification or claims. MPEP §§ 603.01 and 714.16(d). (A), (C), (D), and (E), being in accordance with proper USPTO practice and procedure, are incorrect answers. 37 C.F.R. § 1.312; MPEP §§ 714.15 and 714.16.',
  },
  {
    id: 'uspto-oct00-pm-42',
    topicId: 3,
    subtopic: 'Affidavit filed with an appeal brief — jurisdiction of the Board',
    difficulty: 3,
    question:
      'You are assigned by your firm to prosecute a patent application which had been prepared and prosecuted by a former member of the firm. A Notice of Appeal had been filed and while in the process of preparing the Appeal Brief, you discover that data in the applicant’s original notes would materially aid in persuading the Board as to the patentability of the appealed claims. Accordingly, you incorporate the data in an Affidavit and file the Affidavit with the USPTO together with the Appeal Brief. In light of this scenario, which of the following statements is true?',
    options: [
      'Since jurisdiction has passed to the Board, the Board will consider the Affidavit concurrently with the Appeal Brief.',
      'Since jurisdiction has not passed to the Board, the Board will automatically remand the Affidavit for consideration by the examiner and hold consideration of the Appeal Brief in abeyance.',
      'Since jurisdiction has passed to the Board, the Board may or may not consider the Affidavit as it sees fit.',
      'Although authority from the Board is not necessary to consider the Affidavit, the examiner may not consider the Affidavit unless it is remanded to the examiner by the Board.',
      'Since jurisdiction has not passed to the Board, the examiner may admit the Affidavit but require a showing of good and sufficient reasons why the Affidavit was not earlier presented.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer because there is compliance with 37 C.F.R. § 1.195. MPEP § 1211.02. (A) and (C) are wrong because jurisdiction has not passed to the Board. MPEP § 1210. (B) and (D) are wrong because a remand is an action by the Board when it has jurisdiction of the case. MPEP § 1211. Under the present facts, the Board has no jurisdiction. MPEP § 1210. [Historical practice] — the Board of Patent Appeals and Interferences was replaced by the PTAB in 2012 and the appeal rules of 37 C.F.R. Part 41 have since been revised.',
  },
  {
    id: 'uspto-oct00-pm-43',
    topicId: 1,
    subtopic: '"Optionally" in a claim — anticipation and definiteness',
    difficulty: 3,
    question:
      'An article in a popular scientific journal, dated January 13, 1998, fully discloses and teaches how to make a "Smart Shoe" wireless telecommunications device. The article discloses a shoe having a dialer in a rubber sole of the shoe. The article does not teach or suggest using a metallic shoelace as an antenna or for any other purpose. Which of the following claims in an application filed January 20, 1999 is/are anticipated by the journal article, and is/are not likely to be properly rejected under 35 U.S.C. § 112, second paragraph as indefinite? "Claim 1. A telecommunications device comprising: a shoe having a rubber sole; a dialer in the rubber sole; and optionally a metallic shoelace. Claim 2. A telecommunication device comprising: a shoe having a rubber sole; a dialer in the rubber sole; and a metallic shoelace. Claim 3. A telecommunication device comprising: a shoe having a rubber sole; a dialer in the rubber sole; and optionally a random access memory for storing telephone numbers."',
    options: ['Claim 1.', 'Claim 2.', 'Claim 3.', 'Claims 1 and 3.', 'None of the above.'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct choice. MPEP § 2173.05(h); Ex parte Cordova, 10 USPQ2d 1949 (Bd. Pat. App. & Inter. 1989); 35 U.S.C. § 102(b). (B) is incorrect since the article does not disclose a metallic shoelace. Since the "optional" element does not have to be disclosed in a reference for the claim to be anticipated, claims 1 and 3 are each anticipated by the article. Thus, (A), (C), and (E) are incorrect. [Pre-AIA] — the anticipation analysis is under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct00-pm-44',
    topicId: 1,
    subtopic: '35 U.S.C. § 112 — essential elements, best mode and enablement',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'A claim to a process omitting a step in a process, where the step is disclosed in the specification to be essential to the invention, may not be properly rejected under 35 U.S.C. 112, first paragraph, for lack of enablement where the specification provides an enabling disclosure for the process which includes the essential step.',
      'A claim failing to interrelate essential elements of the invention as defined by the applicant in the specification, where the interrelation is critical to the invention may be properly rejected under 35 U.S.C. 112, second paragraph, for failure to properly point out and distinctly claim the invention.',
      'The best mode requirement is the same as the enablement requirement of the first paragraph of 35 U.S.C. 112.',
      'If the best mode contemplated by the inventor at the time of filing the application is not disclosed, a proposed amendment adding a specific mode of practicing the invention would not be new matter.',
      'Failure to disclose the best mode must rise to the level of active concealment or grossly inequitable conduct in order to support a rejection under 35 U.S.C. 112, first paragraph.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). As stated in MPEP § 2172.01, "a claim which fails to interrelate essential elements of the invention as defined by applicant(s) in the specification may be rejected under 35 U.S.C. 112, second paragraph." In re Venezia, 530 F.2d 956 (CCPA 1976); In re Collier, 397 F.2d 1003 (CCPA 1968). (A) is incorrect — a claim which omits matter disclosed to be essential may be rejected under § 112, first paragraph, as not enabling. In re Mayhew, 527 F.2d 1229 (CCPA 1976). (C) is incorrect — the best mode requirement is separate and distinct from enablement. In re Newton, 414 F.2d 1400 (CCPA 1969). (D) is incorrect — such an amendment should be treated as new matter. In re Hay, 534 F.2d 917 (CCPA 1976). (E) is incorrect — failure to disclose the best mode need not rise to the level of active concealment. MPEP § 2165. [Historical practice] — the AIA eliminated failure to disclose the best mode as a ground for invalidity or unenforceability, though the disclosure requirement itself remains.',
  },
  {
    id: 'uspto-oct00-pm-45',
    topicId: 2,
    subtopic: '"Express Mail" filing date under 37 C.F.R. § 1.10',
    difficulty: 3,
    question:
      'If an application is deposited with the U.S. Postal Service in the manner recited in each of the following answers, and there is a dispute as the filing date of the application, which will result in the earliest filing date?',
    options: [
      'As "Express Mail Post Office to Addressee" without the Express Mail mailing label number being placed on the application and with the "date-in" entered by the USPS on Saturday, June 24, 2000, and the application being received in the USPTO on Tuesday, June 27, 2000.',
      'As "Express Mail Post Office to Post Office" without the Express Mail mailing label number being placed on the application and with the "date-in" entered by the USPS on Friday, June 23, 2000, and the application being received in the USPTO on Monday, June 26, 2000.',
      'As "Express Mail Post Office to Addressee" without the Express Mail mailing label number being placed on the application and with the "date-in" entered by the applicant on Thursday, June 29, 2000, and the application being received in the USPTO on Wednesday, July 5, 2000.',
      'As "Express Mail Post Office to Addressee" with the Express Mail mailing label number being placed on the application and with the "date-in" entered by the applicant on Thursday, June 29, 2000, and the application being received in the USPTO on Monday, July 3, 2000.',
      'As "Express Mail Post Office to Post Office" with the Express Mail mailing label number being placed on the application and with the "date-in" entered by the USPS on Saturday, July 1, 2000, and the application being received in the USPTO on Monday, July 3, 2000.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer because the application is properly deposited with the USPS as "Express Mail Post Office to Addressee" and the "date-in" is properly entered by the USPS. MPEP § 502: the only type of service which can be used is "Post Office to Addressee." 37 C.F.R. § 1.10. MPEP § 513: the "date-in" must be completed by the USPS, not the applicant; and effective December 2, 1996, § 1.10(b) no longer requires the mailing label number be placed on the correspondence. Correspondence deposited as "Express Mail" is considered filed on the date of deposit regardless of whether that date is a Saturday, Sunday or Federal holiday. Therefore (A) provides a filing date of June 24, 2000. (B) and (E) are wrong because "Post Office to Post Office" is ruled out. (C) and (D) are wrong because the "date-in" was not entered by the USPS. [Historical practice] — the USPS retired the "Express Mail" brand (now Priority Mail Express) and § 1.10 has since been revised.',
  },
  {
    id: 'uspto-oct00-pm-46',
    topicId: 2,
    subtopic: 'Extensions of time — constructive petition under § 1.136(a)(3)',
    difficulty: 3,
    question:
      'A non-final Office action was mailed in a pending patent application on Friday, November 12, 1999. The examiner set a three month shortened statutory period for reply. The practitioner petitioned for a one-month extension of time on Monday, February 14, 2000 and paid the appropriate one-month extension fee. An amendment responsive to the Office action was filed Tuesday, March 14, 2000. Each independent claim in the application was revised and two dependent claims were cancelled. No claim was added by the amendment. In the Remarks portion of the amendment, the practitioner expressed his belief that no fees are required by the amendment, but nevertheless gave authorization to charge any fees to the practitioner’s account, nn-nnnn, if any fees are necessary, including fees for any required extension of time. A duplicate copy of the amendment was filed. No fees were submitted with the amendment. Assuming nn-nnnn is a valid deposit account, which of the following statements is true?',
    options: [
      'The amendment should be entered with no fees charged to practitioner’s deposit account.',
      'The amendment should be entered, but the fee for a second month extension of time should be charged to the practitioner’s deposit account.',
      'The amendment should not be entered because it is untimely.',
      'The request to charge any required fees, including fees for any necessary extension of time, is ineffective because it was not made in a separate paper.',
      'Statements (C) and (D) are true.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). The petition for extension of time filed February 14, 2000 provided applicant with a one-month extension of time from the original due date, February 12, 2000 (not from the date the petition was filed). See MPEP § 710.01(a). Thus, the extended due date was Sunday, March 12, which means a reply was due by Monday, March 13. Since an additional extension of time is needed, (A) is incorrect. Under 37 C.F.R. § 1.136(a)(3), applicant’s statement is treated as a constructive petition for extension of time. MPEP § 710.02(e). (C) is incorrect because the statement acted as a constructive petition and the amendment is timely. There is no need for the petition to appear in a separate paper, so (D) is not correct. (E) is incorrect because (C) and (D) are both incorrect.',
  },
  {
    id: 'uspto-oct00-pm-47',
    topicId: 1,
    subtopic: 'Product-by-process claims — curing an improper dependent claim',
    difficulty: 3,
    question:
      'A patent application filed in the USPTO contains the following three original claims, including product by process Claim 3: "Claim 1. A method for making an Ethernet cable comprising the steps of A, B and C. Claim 2. The method of claim 1, further characterized by the step of D. Claim 3. The Ethernet cable as in any one of the preceding claims." In the first Office action, the examiner objects to Claim 3 as being an improper dependent claim and requires cancellation of the claim. Following proper USPTO practices and procedures, which of the following replies best overcomes the examiner’s objection and provides the client with the broadest patent protection?',
    options: [
      'Amend Claim 3 to read: "The Ethernet cable as made by the process set forth in claims 1-2."',
      'Cancel Claim 3.',
      'Cancel Claim 3 and add Claim 4, which reads: "An Ethernet cable made by a process comprising the steps of A, B and C."',
      'Cancel Claim 3 and add Claim 5, which reads: "An Ethernet cable made by a process comprising the steps of A, B, C and D."',
      'Cancel Claim 3. Add Claim 4, which reads: "An Ethernet cable made by a process comprising the steps of A, B and C." Add Claim 5, which reads: "An Ethernet cable made by a process comprising the steps of A, B, C and D."',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). The cancellation of Claim 3 overcomes the examiner’s objection. The addition of Claims 4 and 5 provides the client with patent protection in product-by-process format for the cable by both methods of manufacture; thus, if Claim 4 is invalid, Claim 5 may remain valid. (A) is incorrect because it is an improper multiple dependent claim. 35 U.S.C. § 112 ¶ 5; 37 C.F.R. § 1.75(c); MPEP § 608.01(n). (B) alone is incorrect because canceling the claim leaves the application without a claim to the Ethernet cable. (C) alone is not the most correct answer because it leaves the application without a claim to the cable made by steps A, B, C, and D. (D) alone is not the most correct answer because it leaves the application without a claim to the cable made by steps A, B, and C.',
  },
  {
    id: 'uspto-oct00-pm-48',
    topicId: 1,
    subtopic: 'Claim form and arrangement',
    difficulty: 2,
    question:
      'Regarding claims, which of the following practices is not in accordance with proper USPTO practice and procedure?',
    options: [
      'A singular dependent claim 2 could read as follows: 2. The product of claim 1 in which…',
      'An application may contain a series of singular dependent claims in which a dependent claim refers to a preceding claim which, in turn, refers to another preceding claim.',
      'A claim which depends from a dependent claim may be separated therefrom by any claim which does not also depend directly or indirectly from said "dependent claim."',
      'A dependent claim may refer back to any preceding independent claim.',
      'Each claim begins with a capital letter and ends with a period.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 608.01(n), part "IV. Claim Form and Arrangement." A claim which depends from a dependent claim should not be separated therefrom by any claim which does not also depend from said "dependent claim." (A), (B), and (D) are incorrect because they are practices encouraged by the MPEP. (E) is incorrect because it represents a practice encouraged by MPEP § 608.01(m). See Fressola v. Manbeck, 36 USPQ2d 1211 (D.D.C. 1995).',
  },
  {
    id: 'uspto-oct00-pm-49',
    topicId: 2,
    subtopic: 'Continuation application under 37 C.F.R. § 1.53(b)',
    difficulty: 3,
    question:
      'A complete continuation application by the same inventors as those named in the prior application may be filed under 35 U.S.C. § 111(a) using the procedures of 37 C.F.R. § 1.53(b) by providing:',
    options: [
      'A copy of the prior application, including a copy of the signed declaration in the prior application, as amended.',
      'A new and proper specification (including one or more claims), any necessary drawings, a copy of the signed declaration as filed in the prior application (the new specification, claim(s), and drawings do not contain any subject matter that would have been new matter in the prior application), and all required fees.',
      'A new specification and drawings and a newly executed declaration. The new specification and drawings may contain any subject matter that would have been new matter in the prior application.',
      'A new specification and drawings, and all required fees.',
      '(A), (B), (C) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. §§ 1.51(b), 1.53(b), and 1.63(d)(1)(iv); MPEP §§ 201.06(c) and 602.05(a). (A) is incorrect — a continuation may be filed by providing a copy of the prior application, including a copy of the signed declaration in the prior application, as filed (not as amended). (C) is incorrect — a new specification and drawings and a newly executed declaration may be used provided they do not contain any subject matter that would have been new matter in the prior application. (D) is incorrect — the oath or declaration is needed to name the same inventor in the continuation application. (E) is incorrect because (A), (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-oct00-pm-50',
    topicId: 1,
    subtopic: 'USPTO claim recommendations vs requirements',
    difficulty: 2,
    question: 'Which of the following is not a USPTO recommendation or requirement?',
    options: [
      'Claims should be arranged in order of scope so that the first claim presented is the least restrictive.',
      'Product and process claims should be separately grouped.',
      'Every application should contain no more than three dependent claims.',
      'A claim which depends from a dependent claim should not be separated from that dependent claim by any claim which does not also depend from the dependent claim.',
      'Each claim should start with a capital letter and end with a period.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). The USPTO does not require or recommend a minimum or maximum number of dependent claims. 37 C.F.R. § 1.75(c). (A) is a USPTO recommendation. MPEP § 608.01(m) ("Claims should preferably be arranged in order of scope so that the first claim presented is the least restrictive."). (B) is a USPTO recommendation. MPEP § 608.01(m). (D) is a USPTO recommendation. MPEP § 608.01(n), part IV. (E) is a USPTO requirement. MPEP § 608.01(m).',
  },
];

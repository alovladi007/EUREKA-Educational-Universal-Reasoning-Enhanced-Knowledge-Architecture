/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — April 12, 2000, AFTERNOON (PM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo0004pq.pdf / edo0004pa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files in this directory):
 *  - Stems and options are VERBATIM, in the official order (A)-(E).
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * DISCARDED QUESTIONS: none. Swept case-insensitively for "all answers
 * accepted"; this session contains no such item, so all 50 are scoreable.
 *
 * MULTI-KEYED QUESTION: Q50 — the model answer reads
 * "50. ANSWER: (A),(B), or (E)." THREE options were accepted as correct. The
 * bank stores a single key, so per the established convention Q50 is keyed to
 * (A), the first option the model answer analyses, and the explanation states
 * plainly that (B) and (E) were also accepted. Nothing is silently dropped.
 *
 * NOTE ON THE SWEEP THAT FOUND IT: the earlier dual-key sweep looked for the
 * phrasing "(X) or (Y) are accepted as correct" used by the April 2001 papers.
 * Q50 uses a bare comma-separated list on the ANSWER line and would have been
 * read as a plain "(A)" by that sweep. Always ALSO grep the ANSWER lines
 * themselves for a second parenthesised letter:
 *   grep -nE '^\s*[0-9]{1,2}\.\s*ANSWER[:.]?\s*\(?[A-E]\)?\s*[,)]?\s*(,|and|or|/)\s*\(?[A-E]\)?'
 *
 * ERA NOTES. This paper predates the AIA by eleven years. Items turning on
 * pre-AIA § 102/§ 103 carry [Pre-AIA]; superseded procedure carries
 * [Historical practice]. Specifically worth flagging:
 *  - Q7, Q36 and Q43 are keyed to the 37 C.F.R. Part 10 Code of Professional
 *    Responsibility, replaced in 2013 by the Part 11 Rules of Professional
 *    Conduct.
 *  - Q17 is a first-to-invent priority contest under § 102(g), abolished for
 *    applications subject to first-inventor-to-file.
 *  - Q26 and Q27 apply the pre-2003 § 1.121 amendment format (five-word rule,
 *    underlining, exact-point recitation).
 *  - Q24 routes Board appeals through the BPAI; the PTAB replaced it in 2012.
 *  - Q32's reference to a Disclosure Document concerns the Disclosure Document
 *    Program, discontinued by the USPTO in 2007.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2000_PM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'April 12, 2000',
  session: 'Afternoon (PM)',
  questionsFile: 'edo0004pq.pdf',
  answersFile: 'edo0004pa.pdf',
  totalDelivered: 50,
  discarded: [] as number[],
  multiKeyed: [50],
  ingested: 50,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_APR2000_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr00-pm-01',
    topicId: 0,
    subtopic: 'Commercial success requires a comparative basis',
    difficulty: 3,
    question:
      'Which of the following does not constitute probative evidence of commercial success to support a contention of non-obviousness?',
    options: [
      'In a utility case, gross sales figures accompanied by evidence as to market share.',
      'In a utility case, gross sales figures accompanied by evidence as to the time period during which the product was sold.',
      'In a utility case, gross sales figures accompanied by evidence as to what sales would normally be expected in the market.',
      'In a utility case, gross sales figures accompanied by evidence of brand name recognition.',
      'In a design case, evidence of commercial success clearly attributable to the design, and not to improved performance of the device.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct because gross sales figures must be measured against a logical standard in order to determine whether or not there is commercial success. The recitations in (A), (B), and (C) are logical in that they provide a comparative basis; (D) recites evidence which is illogical in that it does not provide a comparative basis. (E) is wrong because it provides a logical basis for attributing commercial success to the design of the device rather than the utilitarian function. MPEP § 716.03(b).',
  },
  {
    id: 'uspto-apr00-pm-02',
    topicId: 0,
    subtopic: 'Objective evidence must be commensurate in scope with the claims',
    difficulty: 3,
    question: 'Which of the following statements is true based on current PTO practice and procedure?',
    options: [
      'Where claims in an application on appeal have been rejected on prior art, the Board cannot consider a reference having a publication date after the effective date of the application.',
      'Objective indicia of non-obviousness cannot depend on facts developed after the effective date of the application under consideration.',
      'Evidence that has developed only after the filing date of an application cannot be used to show non-obviousness.',
      'The scope of objective evidence of non-obviousness is independent of the scope of the claim for which the evidence is offered to support.',
      'Objective evidence of non-obviousness must be commensurate in scope with the claims for which the evidence is offered to support.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). In re Tiffin and Erdman, 171 USPQ 294 (CCPA 1971). MPEP § 716.03(a). (A), (B), (C), and (D) are wrong. In re Tiffin and Erdman, 170 USPQ 88, 91, 92 (CCPA 1971).',
  },
  {
    id: 'uspto-apr00-pm-03',
    topicId: 5,
    subtopic: 'Interferences, reexamination merger, and reexamination certificates',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'Interferences will generally be declared even when the applications involved are owned by the same assignee since only one patent may issue for any given invention.',
      'A senior party in an interference is necessarily the party who obtains the earliest actual filing date in the PTO.',
      'Reexamination proceedings may not be merged with reissue applications since third parties are not permitted in reissue applications.',
      'After a reexamination proceeding is terminated and the certificate has issued, any member of the public may obtain a copy of the certificate by ordering a copy of the patent.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 2292. As to (A) see 37 C.F.R. § 1.602(a). As to (B) see 37 C.F.R. § 1.601(m), which provides that the senior party has the earliest EFFECTIVE filing date. As to (C), see MPEP § 2285 regarding merger of reissues and reexamination proceedings. As to (E), (D) is true. [Historical practice] — interference practice was replaced by derivation proceedings for post-AIA filings.',
  },
  {
    id: 'uspto-apr00-pm-04',
    topicId: 1,
    subtopic: 'Antecedent basis across an independent claim and its dependents',
    difficulty: 3,
    question:
      'A patent application includes an incomplete Claim 1 for a shaving implement whose remaining elements recite "said first end" (part ii), "said dispensing chamber" (part iii), "said second end" (part iv), and "said longitudinal sides of said channel" (part v). Which of the following, if included as paragraph (i) of Claim 1, properly completes the claim?',
    options: [
      'an elongated handle including a dispensing chamber and a channel formed in said handle, said channel being defined by longitudinal sides within said handle and communicating over substantially its entire length with said dispensing chamber;',
      'an elongated handle having a first end, said handle including a chamber and a channel formed in said handle, said channel being defined by longitudinal sides within said handle and communicating over substantially its entire length with said chamber;',
      'an elongated handle having a first end, said handle including a dispensing chamber and an elongated channel formed in said handle, said channel communicating over substantially its entire length with said chamber;',
      'an elongated handle having a first end and a second end, said handle including a dispensing chamber and a channel formed in said handle, said channel being defined by longitudinal sides within said handle and communicating over substantially its entire length with said dispensing chamber;',
      'an elongated handle having a first end and a second end, said handle including a channel formed in said handle, said channel being defined by longitudinal sides within said handle and communicating over substantially its entire length with said chamber;',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). (A) does not provide proper antecedent basis for "said first end" in part (ii) and "said second end" in part (iv). (B) fails to provide antecedent basis for "said dispensing chamber" in part (iii) and "said second end" in part (iv). (C) fails for "said second end" in part (iv) and "said longitudinal sides of said channel" in part (v). (E) fails for "said dispensing chamber" in part (iii) and subsequent parts.',
  },
  {
    id: 'uspto-apr00-pm-05',
    topicId: 0,
    subtopic: 'A shelved, indexed thesis as a printed publication',
    difficulty: 3,
    question:
      'Beverly prepared (in German) a doctoral thesis on a new "all-in-one" shampoo and conditioner. Following approval by her faculty advisor on December 21, 1998, the sole copy was placed on the shelves of the university library on January 29, 1999, accessible to faculty, students and the general public, and indexed in a general user’s catalog by author, title and subject. On March 4, 1999, the catalog was made freely available on an Internet web page. Which of the following statements is most correct?',
    options: [
      'Beverly’s thesis may be used under 35 U.S.C. § 102(b) as a prior art printed publication against a United States application for patent filed January 15, 2000.',
      'Beverly’s thesis may be used under 35 U.S.C. § 102(b) as a prior art printed publication against a United States application for patent filed February 26, 2000.',
      'Beverly’s thesis may be used under 35 U.S.C. § 102(b) as a prior art printed publication against a United States application for patent filed March 8, 2000.',
      '(A), (B) and (C).',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct reply. Beverly’s thesis constitutes a printed publication as of January 29, 1999. In re Hall, 228 USPQ 453 (Fed. Cir. 1986). Since (B) and (C) are both correct statements, the most correct response is (E). (A) is incorrect — to be used under § 102(b) the thesis must have been published more than one year before the application; publication on January 29, 1999 is less than one year before a January 15, 2000 filing. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-apr00-pm-06',
    topicId: 2,
    subtopic: 'Petition to withdraw holding of abandonment (non-receipt of a Notice)',
    difficulty: 3,
    question:
      'In the course of prosecuting a patent application for his client, Smith did not receive a Notice of Allowance and Issue Fee Due from the PTO. Fifteen months after submitting a reply to a final rejection, Smith received a Notice of Abandonment advising that the application became abandoned for failure to pay the issue fee. Which of the following actions, if any, accords with proper PTO practice and procedure, and is most likely to succeed in protecting the interests of Smith’s client?',
    options: [
      'File a petition to revive the application including a statement that the entire delay in paying the issue fee, from the due date for the payment of the fee until the filing of a grantable petition pursuant to 37 C.F.R. § 1.137(a), was unavoidable, accompanied by the issue fee then in effect, and any required terminal disclaimer.',
      'File a petition to revive the application including a statement that the entire delay in paying the issue fee, from the due date for the payment of the fee until the filing of a grantable petition pursuant to 37 C.F.R. § 1.137(b), was unintentional, and required terminal disclaimer.',
      'File a timely petition to withdraw the holding of abandonment accompanied by a statement that the Notice of Allowance and Issue Fee Due was not received, and that a search of the file jacket and docket records indicates that the Notice of Allowance and Issue Fee Due was not received. Include with the petition a copy of the docket record where the nonreceived Office communication would have been entered had it been received and docketed.',
      'All of the above.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct because it sets forth the modified showing discussed in MPEP § 711.03(c), subsection II, and complies with the fact that a petition to withdraw holding of abandonment does not require a fee. (A) and (B) are wrong because they fail to recite that each petition must be accompanied by a petition fee under 37 C.F.R. §§ 1.17(l) and (m). (A) is also incorrect because a mere statement that the delay was unavoidable is insufficient; evidence is necessary. [Historical practice] — the "unavoidable" revival standard of § 1.137(a) was eliminated in 2013.',
  },
  {
    id: 'uspto-apr00-pm-07',
    topicId: 7,
    subtopic: 'Conflict of interest — representing differing interests',
    difficulty: 3,
    question:
      'A potential new client XYZ Corp. calls you for representation. XYZ has been accused by ANY Corp. of infringing ANY’s soon-to-be-issued patent, has been making the accused device for three months, and wants to file its own patent application. You determine that your law partner, also a registered practitioner, represents ANY before the PTO in the application filed by ANY, and that you and the partner have a power of attorney in that application from ANY. Which of the following should you do and/or advise XYZ to do in accordance with the PTO Disciplinary Rules?',
    options: [
      'Decline to accept employment from XYZ.',
      'Perform a patent search, and upon locating a published PCT application referencing the patent application filed by ANY, you decide that no information about the ANY application is confidential. Thus, you can ask your partner for information regarding the ANY application to relay to your client, XYZ.',
      'Advise XYZ that you can file a patent application for the device on behalf of XYZ. Even though ANY was the first to file, an interference may be declared to determine priority of invention if the claims are the same or substantially similar.',
      'Advise XYZ that because your partner has had experience with similar types of cases, that it will be easy for him to file a patent application on behalf of XYZ.',
      'You must ask XYZ for any prior art which they have available and give it to your partner in order to satisfy the duty of disclosure rules with respect to the case which your partner is handling for ANY.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 10.66(a). If not an actual conflict of interest, clearly there is a potential conflict between a present and prospective client — the partner already represents ANY Corp., and the prospective client is accused by that present client of infringing. Acceptance would be likely to involve the practitioner in representing differing interests. (B), (C), (D) and (E) are not the most correct answers; even in potential conflict situations the practitioner must obtain the consent of ANY Corp. after full disclosure, and no such consent is shown. 37 C.F.R. § 10.66(c). [Historical practice] — the Part 10 Code was replaced in 2013 by the 37 C.F.R. Part 11 Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr00-pm-08',
    topicId: 5,
    subtopic: 'No broadening of claims during reexamination',
    difficulty: 3,
    question:
      'It is widely understood in the relevant art that a knife is but one of many types of "cutting means," and that a knife can have a blade that is "serrated" or "honed." During reexamination of a patent, the patent owner seeks to amend Claim 1 as follows: "(amended) A [knife] cutting means having a handle portion and a serrated blade." All changes in the claim are fully supported by the original disclosure in the patent. Which of the following correctly explains why the claim, as amended, should or should not be rejected?',
    options: [
      'The claim should be rejected because the amendment broadens the scope of the patent claim by changing replacing "knife" with "cutting means," a broader recitation.',
      'The claim should be rejected because the claim has not been amended in accordance with PTO rules for amending patent claims.',
      'The claim should not be rejected because the claim is fully supported by the original patent disclosure.',
      'The claim should not be rejected because the amendment does not add new matter into the claim.',
      'The claim should not be rejected because the amendment narrows the scope of the patent by modifying "blade" to being a "serrated blade."',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 305; 37 C.F.R. § 1.530(d)(3); MPEP §§ 2250, 2258 ("A claim is broader than another claim if it is broader (greater in scope) ‘in any respect,’ even though it may be narrower in other respects." In re Freeman, 30 F.3d 1459, 32 USPQ2d 1444 (Fed. Cir. 1994)). The claim is broadened by changing "knife" to "cutting means," which is not limited to a knife but may be a blade, scissors, etc.',
  },
  {
    id: 'uspto-apr00-pm-09',
    topicId: 2,
    subtopic: 'Extension fee measured from a late-mailed Advisory Action',
    difficulty: 3,
    question:
      'In the course of prosecuting a patent application, you receive a final rejection wherein the examiner has set a 3 month shortened statutory period for reply. You file an initial reply within 2 months of the Final Rejection mail date, and the examiner responds with an Advisory Action having a mail date after the end of the 3 month shortened statutory period. In accordance with proper PTO practice and procedure, the fee for an extension of time for applicant to take subsequent appropriate action in the PTO is calculated from:',
    options: [
      'the date your reply is received by the PTO.',
      'the mail date of the Final Rejection.',
      'the mail date of the Advisory Action.',
      'the date the Advisory Action is received by you.',
      'the date the shortened statutory period expires.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. As explained in MPEP § 710.02(e), if an applicant initially replies within 2 months from the date of mailing of a final rejection, and the examiner does not mail an Advisory Action until after the end of 3 months, the shortened statutory period will expire on the date the examiner mails the Advisory Action and any extension fee may be calculated from that date. (A), (B), (D), and (E) are contrary to MPEP § 710.02(e).',
  },
  {
    id: 'uspto-apr00-pm-10',
    topicId: 5,
    subtopic: 'Reexamination proceeds despite the patent owner ceasing prosecution',
    difficulty: 3,
    question:
      'Sam filed a request for reexamination of a patent owned by his client, Hurley Corp., along with a Russian patent. The request was granted, and an Office action properly rejected independent claim 1 under 35 U.S.C. §§ 102 and 103 using the Russian reference and objected to the remaining claims as being dependent upon a rejected claim. Sam agrees claim 1 is unpatentable. Hurley Corp. files for bankruptcy protection and advises Sam it has no funds to further prosecute the reexamination. In accordance with proper PTO practice and procedure what should Sam do?',
    options: [
      'Advise the Examiner on the telephone that the patentee has filed for bankruptcy protection, and that nothing should be done in the reexamination proceeding until the bankruptcy is settled.',
      'Do nothing and a reexamination certificate will issue indicating that claim 1 is canceled and that the patentability of claims 2 - 10 is confirmed.',
      'File a fallacious reply arguing the patentability of claim 1 in order to allow the reexamination proceeding to continue.',
      'File a divisional reexamination proceeding whereby claims 2 through 10 will be transferred into the divisional and allowed to issue. Claim 1, still in the original reexamination proceeding, can then be appealed to the Board of Patent Appeals and Interferences at a later point in time after the bankruptcy is resolved.',
      'Send a letter to his client Hurley Corp. advising them that unless he is paid in advance, he will take no further action in the proceeding and file no papers with the PTO.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). See MPEP §§ 2287 and 2288. As to (E), Sam must request to withdraw and obtain permission from the PTO in accordance with 37 C.F.R. § 10.40 and MPEP § 402.06. As to (A), bankruptcy will not stay a reexamination. As to (C), false representations are prohibited by the rules. As to (D), there are no divisional reexaminations.',
  },
  {
    id: 'uspto-apr00-pm-11',
    topicId: 2,
    subtopic: 'Continuation vs continuation-in-part; reissue grounds',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'The differences between a continuation application and a continuation-in-part (C-I-P) application include: (1) new matter can be added when a C-I-P is filed and (2) the inventive entity in an original application and continuation application must be the same, whereas only one common inventor is necessary between an original application and a CIP application.',
      'A reissue applicant’s failure to timely file a divisional application is error and proper grounds for filing a reissue application.',
      'A patent claiming a process is shown to be inoperative by showing no more than that it is possible to operate within the disclosure of the patent without obtaining the alleged product.',
      'Where appeal to the Board of Patent Appeals and Interferences is dismissed for failure to argue a ground of rejection involving all the appealed claims, but allowed claimed remain in the application, the application becomes abandoned.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). As to (A), a continuation need only have one inventor in common. MPEP § 201.07. As to (B), failure to timely file a divisional application is not considered "error" and proper grounds for filing a reissue. MPEP § 1402. As to (C), "since in a patent it is presumed that a process if used by one skilled in the art will produce the product or result described therein, such presumption is not overcome by a mere showing that it is possible to operate within the disclosure without obtaining the alleged product." In re Weber, 405 F.2d 1403, 160 USPQ 549 (CCPA 1969); MPEP § 716.07. As to (D), the application is not abandoned. MPEP § 1215.',
  },
  {
    id: 'uspto-apr00-pm-12',
    topicId: 2,
    subtopic: 'Joint inventorship and protests',
    difficulty: 3,
    question:
      'Clem and Tine, while dating, invent a wedding ring programmed to chime on each wedding anniversary. Clem now wants to file a patent application and admits it was partly Tine’s idea. Clem further advises you that before the couple ended their relationship, Tine deceptively filed a patent application for the same wedding ring in her name alone, application No. 09/123456. Which of the following is the proper advice to give Clem in accordance with proper PTO practice and procedure?',
    options: [
      'File a patent application listing Clem as the sole inventor, and the appropriate fees. Since Tine has already filed an application for the same device as sole inventor, she cannot be listed as a co-inventor in another application for the same device. An interference must be declared to determine proper inventorship.',
      'File a patent application listing both Clem and Tine as coinventors, and the appropriate fees. If Tine refuses to sign the declaration, Clem has to file (i) a declaration signed by him naming himself and Tine as joint inventors, (ii) a petition, and (iii) the appropriate fees.',
      'File a protest in the PTO (prior to the mailing of a notice of allowance in Tine’s application) indicating the application serial number 09/123456 and informing the PTO that Clem is a coinventor.',
      'Advise Clem that he could save money by allowing Tine to continue to prosecute her application and then, after the patent issues, he can sue her for half of the royalties.',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Protests may be filed pursuant to 37 C.F.R. § 1.291. See MPEP § 1901.02. However, since a protester may not be advised as to the outcome of the protest, it behooves him to file a patent application listing both parties as co-inventors in accordance with 35 U.S.C. § 116. As to (D), since the inventorship is not correct and was deceptively filed, the issued patent is likely to be declared invalid and he would not recover any royalties. (A) is incorrect because Clem is misrepresenting that he believes himself to be the sole inventor, whereas he has admitted the invention "was partly Tine’s idea." 37 C.F.R. § 1.56.',
  },
  {
    id: 'uspto-apr00-pm-13',
    topicId: 2,
    subtopic: 'Counting dependent claims for fee purposes with multiple dependencies',
    difficulty: 3,
    question:
      'Upon filing in the PTO, an original, nonprovisional patent application contains the following claims: Claim 1 is independent. Claim 2 depends from Claim 1. Claim 3 depends from Claim 2. Claim 4 depends from Claim 2 or 3. Claim 5 depends from Claim 3. Claim 6 depends from Claim 2, 3, or 5. The application contains only the foregoing claims. How many dependent claims are there for fee calculation purposes?',
    options: ['4', '5', '7', '8', '9'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 41(a). For fee calculation purposes, MPEP § 608.01(n), subsection G.2, states that "claims in proper multiple dependent form may not be considered as single dependent claims for the purpose of calculating fees. Thus, a multiple dependent claim is considered to be that number of dependent claims to which it refers. Any proper claim depending directly or indirectly from a multiple dependent claim is also considered as the number of dependent claims as referred to in the multiple dependent claim from which it depends."',
  },
  {
    id: 'uspto-apr00-pm-14',
    topicId: 2,
    subtopic: 'Proving an Express Mail deposit date when the PTO never receives the paper',
    difficulty: 3,
    question:
      'A practitioner submitted a new patent application to the PTO using the Express Mail service of the U.S. Postal Service. The PTO never receives the new patent application. Which of the following is not necessary to comply with the requirements for receiving the date of deposit with the U.S. Postal Service as the filing date?',
    options: [
      'A petition showing that the number of the Express Mail mailing label was placed on the application before the application was sent.',
      'A true copy of the new application showing certificate of mailing thereon signed by the practitioner’s secretary stating when the correspondence was deposited with the U.S. Postal Service as first class mail with sufficient postage in an envelope addressed to the Commissioner of Patents and Trademarks, Washington, DC 20231.',
      'A true copy of the of the Express Mail mailing label showing the "date-in" or other official notation entered by the U.S. Postal Service.',
      'A true copy of the new application showing the number of the Express Mail mailing label thereon.',
      'A true copy of any returned postcard receipt.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). A certificate of mailing is not required for Express Mail. See 37 C.F.R. § 1.10(e); MPEP § 513. As to the others see § 1.10(e) or MPEP § 513. (A), (C), (D) and (E) are necessary to comply with the provisions of 37 C.F.R. § 1.10(e). [Historical practice] — the USPS retired the "Express Mail" brand (now Priority Mail Express) and § 1.10 has since been revised.',
  },
  {
    id: 'uspto-apr00-pm-15',
    topicId: 1,
    subtopic: 'Acceptable multiple dependent claim form',
    difficulty: 2,
    question:
      'Assuming that each of the following claims is in a separate application, and there is no preceding multiple dependent claim in any of the applications, which claim is in acceptable multiple dependent claim form?',
    options: [
      'Claim 8. A machine according to any one of the preceding claims wherein…',
      'Claim 5. A device as in one of claims 1-4, wherein…',
      'Claim 10. A device as in any of claims 1-4 or 6-9, in which…',
      'Claim 4. A machine according to claim 3 or 4, also comprising…',
      'The claim form in (A), (B), (C) and (D) is acceptable.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because 35 U.S.C. § 112 authorizes multiple dependent claims as long as they are in the alternative form. MPEP § 608.01(n), subsection I.A.',
  },
  {
    id: 'uspto-apr00-pm-16',
    topicId: 0,
    subtopic: 'Near-simultaneous invention as evidence of the level of skill',
    difficulty: 3,
    question:
      'Debbie conceived a system for caging and automatically feeding hunting dogs on February 15, 1999, and reduced it to practice on June 17, 1999. Billie conceived a substantively identical idea on May 15, 1999 and filed a patent application on June 14, 1999. Assuming Debbie’s patent application is substantively identical to Billie’s patent application, which of the following statements is most correct?',
    options: [
      'Nearly simultaneous invention by Debbie and Billie is proof that the invention is obvious and precludes patentability.',
      'Nearly simultaneous invention by Debbie and Billie may be evidence of the level of skill in the art at the time of the invention.',
      'Nearly simultaneous invention by Debbie and Billie may be evidence of a long-felt need for the invention.',
      'Nearly simultaneous invention by Debbie and Billie may be evidence of commercial success of the invention.',
      'Statements (A), (B), (C) and (D) are each incorrect.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). In re Merck & Co., 231 USPQ 375 (Fed. Cir. 1986); Newell Cos. v. Kenney Mfg., 9 USPQ2d 1417 (Fed. Cir. 1988). (A) is not correct because, although nearly simultaneous invention may be a factor in an obviousness determination, it does not in itself preclude patentability. Environmental Designs, Ltd. v. Union Oil Co., 218 USPQ 865 (Fed. Cir. 1983). (C) and (D) are incorrect because nearly simultaneous invention bears on neither long-felt need nor commercial success. (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-apr00-pm-17',
    topicId: 0,
    subtopic: 'Priority contest — diligence from just before the rival’s conception',
    difficulty: 3,
    question:
      'With regard to a priority contest between Debbie (conception February 15, 1999; actual reduction to practice June 17, 1999; application filed December 1999) and Billie (conception May 15, 1999; application filed June 14, 1999), which of the following statements is most correct?',
    options: [
      'To encourage prompt disclosure of inventions to the public, the PTO always awards priority to the first to file an application, in this case Billie.',
      'Debbie will be awarded priority only if she can establish diligence for the entire time between May 14, 1999 and her actual reduction to practice in June 1999, and can establish that she did not suppress, abandon or conceal the invention.',
      'Debbie will be awarded priority only if she can establish diligence for the entire time between her conception in February 1999 and actual reduction to practice in June 1999, and can establish that she did not suppress, abandon or conceal the invention.',
      'Debbie will be awarded priority if she can establish diligence for the entire time between May 14, 1999 and her patent filing in December 1999, and can establish that she did not suppress, abandon or conceal the invention.',
      'Billie must be awarded priority because his patent application established a constructive reduction to practice prior to Debbie’s actual reduction to practice, even if Debbie was diligent in reducing her invention to practice.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 35 U.S.C. § 102(g); MPEP § 2138.01; Mahurkar v. C.R. Bard, Inc., 38 USPQ2d 1288 (Fed. Cir. 1996). If (A) were correct there would be no need for interference proceedings. (C) is incorrect because Debbie need not establish diligence for the period from February 1999 until just before Billie’s conception on May 15, 1999. (D) is incorrect — Debbie needs to show diligence only from May 14th to her actual reduction to practice in June; she is not required to show diligence between actual reduction to practice and her subsequent constructive reduction to practice, so long as she has not abandoned, suppressed or concealed. (E) is inconsistent with § 102(g). [Pre-AIA] — first-to-invent priority contests were abolished for applications subject to first-inventor-to-file.',
  },
  {
    id: 'uspto-apr00-pm-18',
    topicId: 3,
    subtopic: 'Attorney argument is not a substitute for evidence',
    difficulty: 3,
    question: 'Which of the following statements regarding a registered practitioner is most correct?',
    options: [
      'An unsubstantiated argument by a practitioner that applicant discovered the problem is insufficient to show that applicant discovered the source of the problem.',
      'An unsubstantiated argument by a practitioner that the invention provides a solution of a long-felt need is insufficient to show that the invention fills a long-felt need.',
      'Where an examiner has advanced a reasonable basis for questioning the adequacy of disclosure, an argument by a practitioner that the application meets the requirements of 35 U.S.C. § 112, first paragraph, is entitled to little, if any weight, in the absence of facts supporting a basis for deciding that the specification complies with 35 U.S.C. § 112, first paragraph.',
      'An argument by a practitioner that the prior art reference is inoperative is insufficient to show the claimed subject matter is unobvious in the absence of objective evidence demonstrating inoperability of the prior art reference.',
      'Each of (A), (B), (C), and (D) is correct.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer because each of (A), (B), (C) and (D) is correct. (A) — MPEP § 2141.02; In re Wiseman, 596 F.2d 1019 (CCPA 1979). (B) and (C) — MPEP § 716.01(c); In re Knowlton, 500 F.2d 566 (CCPA 1974). Arguments of counsel alone cannot take the place of evidence in the record once an examiner has advanced a reasonable basis for questioning the disclosure. In re Budnick; In re Schulze, 346 F.2d 600 (CCPA 1965); In re Cole, 326 F.2d 769 (CCPA 1964). (D) — MPEP §§ 716.01(c) and 2145.',
  },
  {
    id: 'uspto-apr00-pm-19',
    topicId: 5,
    subtopic: 'Effect of a district court validity decision on reexamination',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'A final decision by a United States District Court finding a patent to be invalid will have no binding effect during reexamination since the PTO may still find the claims of the patent to be valid.',
      'A final decision by a United States District Court finding a patent to be valid will have no binding effect during reexamination since the PTO may still find the claims of the patent to be invalid.',
      'Once the Court of Appeals for the Federal Circuit determines that the claims of a patent are valid, the USPTO may not find such claims invalid based upon newly discovered art.',
      'If a patentee fails to disclose prior art to the PTO during regular prosecution, the only way that a patentee can disclose later discovered prior art to the PTO after issuance is by filing a request for reexamination.',
      'Once a patent claim is found valid during a District Court Proceeding then the patent claims are entitled to a higher standard of patentability and the presumption of validity can only be rebutted by clear and convincing evidence in a concurrent or later reexamination proceeding.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2286: "[t]he issuance of a final district court decision upholding validity during a reexamination also will have no binding effect on the examination of the reexamination." (A) is incorrect because a final holding of INVALIDITY is binding on the PTO. As to (C), the PTO may discover new art and find claims unpatentable as that art would raise a substantial new question. As to (D), the patentee could file a prior art statement under 35 U.S.C. § 301, or disclose prior art in a reissue application. As to (E), the preponderance of evidence standard does not change in reexamination proceedings.',
  },
  {
    id: 'uspto-apr00-pm-20',
    topicId: 3,
    subtopic: 'Restarting the period for reply — examiner error',
    difficulty: 3,
    question:
      'Which of the following is (are) appropriate for restarting the period for replying to an Office action, dated September 25, 2000? I. The examiner set a shortened statutory period of three months, and three months from September 25, 2000 falls on Christmas Day, a federal holiday, and the practitioner calls this to the attention of the examiner within one month of the mail date. II. The examiner’s interpretation of the prior art is believed by the practitioner to be contrary to the interpretation given by one of ordinary skill in the art, and the practitioner calls this alone to the examiner’s attention within one month of the mail date. III. The examiner incorrectly cited one of the references, and the practitioner calls this to the attention of the examiner within one month of the mail date.',
    options: ['I.', 'II.', 'III.', 'II and III.', 'None of the above.'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 710.06. (I) is incorrect since this does not constitute error by the examiner. (II) is incorrect, since a reply would be due by the reply date regardless of whether the rejection was traversed. Thus (A), (B), and (D) are incorrect. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr00-pm-21',
    topicId: 0,
    subtopic: '35 U.S.C. § 102(f) — one must invent the subject matter oneself',
    difficulty: 3,
    question:
      'Mr. Roberts, an American citizen touring a vineyard, saw a unique grape-squeezing machine in France. The vineyard owner was not hiding the machine, but it was out of public view and was the only one of its kind; he had built it himself several years earlier and no drawing or technical description was ever made. The vineyard made only local sales of its wines. Using his photographic memory, Roberts made technical drawings of what he had seen and, upon returning to the United States, promptly filed a patent application directed to the machine. Which of the following statements is correct?',
    options: [
      'Roberts may not obtain a patent on the machine because it was known by others before Mr. Roberts made technical drawings of the machine.',
      'Roberts may not obtain a patent on the machine because wine made by the machine had been sold more than a year before Roberts’ application filing date.',
      'Roberts is entitled to a patent because a goal of the patent system is public disclosure of technical advances, and the machine would not have been disclosed to the public without Roberts’ efforts.',
      'Roberts may not obtain a patent on the machine because the vineyard owner was not hiding the machine and therefore the machine was in public use more than a year before Roberts’ application filing date.',
      'Statements (A), (B), (C) and (D) are each incorrect.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Roberts is not entitled to a patent because he did not himself invent the subject matter sought to be patented. 35 U.S.C. § 102(f). Therefore (C) cannot be correct. (A) is incorrect because, although the machine was known by others, it was not known by others IN THIS COUNTRY as required under § 102(a). Similarly (B) and (D) are incorrect because, even if there was a sale or public use more than a year before Roberts’ filing date, it was not "in this country" as required by § 102(b). [Pre-AIA] — the AIA removed the geographic limitations and replaced § 102(f) with derivation proceedings.',
  },
  {
    id: 'uspto-apr00-pm-22',
    topicId: 2,
    subtopic: 'Express Mail drop boxes are used at the filer’s own risk',
    difficulty: 3,
    question:
      'You are responsible for filing a patent application on Thursday, February 3, 2000. The application has a foreign priority date of February 3, 1999. You place on the transmittal page (a) the Express Mail Label number and (b) a certificate of mailing pursuant to 37 C.F.R. § 1.8. At 5:10 p.m. on February 3, 2000, you place the Express Mail envelope in an Express Mail Deposit box which has a clear sign stating that the box will be cleared for the last time at 5:00 p.m., and which was in fact cleared at 5:00 p.m. On February 4, 2000, the U.S. Postal Service picks up the envelope and clearly stamps the "date in" as 2/4/2000. What is the filing date that will be assigned to the application upon its receipt in the PTO?',
    options: [
      'February 3, 1999, since the envelope was mailed by Express Mail and was in the custody of the United States Postal Service on February 3, 2000.',
      'February 4, 2000 since the operative date is the date stamped by the U.S. Postal Service.',
      'February 3, 1999 since a certificate of mailing under 37 C.F.R. § 1.8 allows the applicant the benefit of the date on which the envelope was mailed.',
      'February 3, 2000, since in order to be entitled to foreign priority the application had to have been deposited before 5:00 p.m., which is the time that the U.S. Patent & Trademark Office closed for business that day.',
      '(A) and (C).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). See 37 C.F.R. § 1.10. Parties using "Express Mail" drop boxes do so at their own risk. As MPEP § 513 explains, a paper placed in an "Express Mail" box receptacle AFTER the box has been cleared for the last time on a given day will be considered deposited as of the date of receipt ("date-in") indicated on the mailing label by the Postal Service acceptance clerk. [Historical practice] — the USPS retired the "Express Mail" brand and § 1.10 has since been revised.',
  },
  {
    id: 'uspto-apr00-pm-23',
    topicId: 0,
    subtopic: 'Third-party public use as a statutory bar; a CIP gains no earlier date for new matter',
    difficulty: 3,
    question:
      'Chris invented a windshield wiper device. An article he submitted was edited so that the version published August 1, 1998 fails to enable the invention. On August 31, 1998 Chris offered the device for sale to Ajax, leaving a sample. Without Chris’ knowledge, Ajax modified and successfully tested the device for trucks on a public highway on September 1, 1998. Chris filed an application for the automotive concept on August 2, 1999. On August 30, 1999 he realized his claims do not cover the truck embodiment; there is no basis in the application supporting such a claim, but the modification would have been obvious. What should you advise Chris to do in accordance with proper PTO practice and procedure?',
    options: [
      'The Popular Scientist publication is a bar under 35 U.S.C. § 102(b) since it was filed over a year before the application was filed.',
      'Chris can still file a claim in the pending application directed to windshield wipers for trucks because the modification of the sensors would have been obvious to the artisan.',
      'Chris must file a new application on or before September 1, 1999, to avoid the testing by Ajax from becoming a statutory bar to him obtaining a second patent directed to the windshield wiper for trucks embodiment.',
      'Chris may file a continuation-in-part application anytime before the first patent application issues in which he can disclose and claim the windshield wiper device for use on trucks and buses since a continuation-in-part is entitled to the parent filing date for everything disclosed in the continuation-in-part application.',
      'Since the Ajax use of the device on trucks was not discovered until August 31, 1999, Chris has one year from August 31, 1999, to file a new patent application directed to use of his invention on trucks.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). As to (A), the publication was not enabling; the level of disclosure required to make a reference an "enabling disclosure" is the same whatever the type of prior art. In re Hoeksema, 399 F.2d 269 (CCPA 1968); MPEP § 2121.01. As to (B), 35 U.S.C. § 132 states that "[n]o amendment shall introduce new matter into the disclosure of the invention." As to (C), statutory bars of § 102(b) apply even though the public use is by a third party. MPEP § 2133.03(e)(7). As to (E), it is not necessary that the applicant be aware of the third party’s public use. As to (D), a C-I-P would not receive the benefit of the earlier filing date with respect to the truck embodiment since the original disclosure did not include it. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-apr00-pm-24',
    topicId: 3,
    subtopic: 'Review of a Board decision — CAFC appeal or civil action',
    difficulty: 2,
    question:
      'Adam is a foreign national legally residing in Baltimore, Maryland. The claims in his United States patent application were finally rejected and the rejection was affirmed on appeal to the Board of Patent Appeals and Interferences. Adam wishes to pursue further review. Which of the following will properly consider a request by Adam for official review of the decision by the Board of Patent Appeals and Interferences?',
    options: [
      'The Commissioner of Patents and Trademarks.',
      'The Chairman of the Board of Patent Appeals and Interferences.',
      'The Director of Patent Quality Review.',
      'The United States Secretary of Commerce.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). An applicant dissatisfied with a decision by the Board of Patent Appeals and Interferences may appeal the decision to the United States Court of Appeals for the Federal Circuit (35 U.S.C. § 141) or may have remedy by civil action against the Commissioner in the United States District Court for the District of Columbia (35 U.S.C. § 145). MPEP § 1216. [Historical practice] — the PTAB replaced the BPAI in 2012 and § 145 actions now lie in the Eastern District of Virginia.',
  },
  {
    id: 'uspto-apr00-pm-25',
    topicId: 2,
    subtopic: 'Revoking a power of attorney — who may sign for the assignee',
    difficulty: 3,
    question:
      'You filed a patent application on behalf of Smith, an employee of Fix Corporation, containing a power of attorney authorizing you to transact all business. After filing, Smith assigns all rights to Fix Corp. In which of the following situations will the power of attorney granted to you be properly revoked? I. Joe, in-house corporate counsel at Fix Corp. but not an officer, signs a 37 C.F.R. § 3.73(b) submission establishing ownership and forwards it with a revocation; Joe is not a registered practitioner and has not been authorized to bind Fix Corp. II. Smith refuses to revoke, but Snix, president of Fix Corp., signs a § 3.73(b) submission establishing ownership and forwards it with a Snix-signed revocation. III. Joe advises Snix that the assignment automatically operates as a revocation, and Snix relies on that advice in good faith and takes no further action.',
    options: ['I.', 'II.', 'III.', 'I and II.', 'None of the above.'],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP §§ 324 and 402.07. The submission may be signed by a person in the organization having apparent authority to sign on behalf of the organization — an officer. In (B) the submission is signed by the President, an office having apparent authority. (I) and (III) are incorrect since Joe is neither a registered practitioner nor an officer. (III) is also incorrect since the assignment by Smith to Fix does not automatically operate as a revocation of the power of attorney. 37 C.F.R. § 1.36.',
  },
  {
    id: 'uspto-apr00-pm-26',
    topicId: 3,
    subtopic: 'Amending an improper multiple dependent claim into proper form',
    difficulty: 3,
    question:
      'Original claims in Smith’s application: "1. A widget comprising A, B, and C. 2. A widget as claimed in Claim 1 wherein C further comprises D. 3. A widget as claimed in Claim 1 and 2 wherein B is B’B’." The examiner properly rejected Claim 3 under 35 U.S.C. § 112, second paragraph, citing the claim’s improper dependency. In the absence of issues of supporting disclosure, which of the following proposed amendments is presented in proper claim format?',
    options: [
      '3. (Amended) A widget as claimed in Claim 1 [and 2] wherein B is B’B’.',
      '3. (Amended) A widget as claimed in any one of Claims 1 and 2 wherein B is B’B’.',
      '3. A widget as claimed in Claims 1 and 2 wherein B is B’B’.',
      'Cancel Claim 3 and substitute the following Claim: 4. A widget as claimed in Claims 1 or 2 wherein B is B’B’B’.',
      'Cancel Claim 3 and substitute the following claim: 3. (Amended) A widget as claimed in Claim 1 or 2 wherein B is B’B’.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.121(a)(2)(ii); MPEP § 608.01(n). (B) and (C) are incorrect because the claim does not refer back in the alternative only. (D) is incorrect because it combines procedures for adding a claim (claim 4) and amending an existing claim (claim 3) — a newly added claim would not contain underlined words. (E) is incorrect because the claim number is underlined as are all the words in the claim even though no matter is added. [Historical practice] — the pre-2003 § 1.121 amendment format has been replaced by the current claim-listing practice.',
  },
  {
    id: 'uspto-apr00-pm-27',
    topicId: 3,
    subtopic: 'Amendment must specify exact matter, exact point, and ≤ five words',
    difficulty: 3,
    question:
      'A patent application is filed with an original Claim 1 for a steam cooker reciting (i) a steam generating chamber having a steam generator; (ii) a cooking chamber adjacent to said steam generating chamber for receiving steam from said steam; and (iii) a heat exchanger secured within said steam generator… including at least one heating zone comprised of an inner having raised surface projections thereon… Assuming all of the following amendments are supported by the original disclosure, which amendment is in accord with proper PTO amendment practice and procedure?',
    options: [
      'In Claim 1, line 4, after "steam" insert, --generator--.',
      'In Claim 1, line 6, after "inner" insert --panel--.',
      'In Claim 1, line 6, delete [one], insert --two--, and amend "zone" to read –zones--.',
      'In Claim 1, line 3, after "chamber" (second occurrence) delete [for receiving] and insert --to produce sufficient quantities of gas and--.',
      'In Claim 1, line 4, delete "secured within" and insert --attached to--.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 C.F.R. § 1.121; MPEP § 714.22. The amendment in (B) specifies the exact matter to be inserted, the exact point where the insertion is to be made, and is limited to five words or less. (A) is incorrect because there are two occurrences of "steam" in line 4 and the exact location is unspecified. (C) is incorrect because the amendment does not specify the exact point where the insertion of "two" is to occur. (D) is incorrect because it would insert more than five words. (E) is incorrect because it fails to identify the correct point where the deletion and insertion is to be made. [Historical practice] — pre-2003 § 1.121 amendment format.',
  },
  {
    id: 'uspto-apr00-pm-28',
    topicId: 5,
    subtopic: 'Reissue oath must claim foreign priority; appeal practice',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'On appeal of a rejection of ten claims to the Board of Patent Appeals and Interferences, each appealed claim stands or falls separately as a result of appellant pointing out differences in what the claims cover.',
      'The 2-month period for filing a petition mentioned in 37 CFR 1.181(f) is extendable under 37 CFR 1.136(a).',
      'An examiner may enter a new ground of rejection in the examiner’s answer to an applicant’s appeal brief.',
      'After filing a notice of appeal, an applicant is estopped from further prosecuting the same claims in a continuation application.',
      'When desiring to claim foreign priority, the oath or declaration in a reissue application must claim foreign priority even though the priority claim was made in the original patent.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). See MPEP § 1414 and 37 C.F.R. § 1.175(a), which states that reissue oaths/declarations must meet the requirements of § 1.63, including § 1.63(c) relating to a claim for foreign priority. As to (A), § 1.192(c)(7) requires appellant to state that the claims do not stand or fall together and to present argument why each claim is separately patentable; merely pointing out differences is not such argument. As to (B), see MPEP § 1002. As to (C), § 1.193(a)(2) prohibits the entry of a new ground of rejection in an examiner’s answer. As to (D), a continuation may be filed during pendency of the parent. [Historical practice] — the Part 41 appeal rules have since been revised and a new ground of rejection in an examiner\'s answer is now permitted under specified conditions.',
  },
  {
    id: 'uspto-apr00-pm-29',
    topicId: 0,
    subtopic: '35 U.S.C. § 102(d) — the foreign patent need not be published',
    difficulty: 3,
    question:
      'Which of the following is not a requirement of 35 U.S.C. § 102(d) to bar the granting of a patent in this country?',
    options: [
      'The foreign patent or inventor’s certificate must have been published prior to the date of the application for patent in the United States.',
      'The foreign application must have been filed more than 12 months before the effective filing of the application in the United States.',
      'The foreign application must have been filed by the same applicant as in the United States or by his or her legal representatives or assigns.',
      'The foreign patent or inventor’s certificate must be actually granted before the U.S. filing date.',
      'The same invention must be involved.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 35 U.S.C. § 102(d) and MPEP § 2135 expressly list (B), (C), (D) and (E) as the four conditions which, if all are present, establish a bar against the granting of a patent in this country. The foreign patent or inventor’s certificate described in (A) need not be published to establish a § 102(d) bar. MPEP § 2135.01(III)(E). [Pre-AIA] — the AIA repealed § 102(d) as a distinct prior-art category.',
  },
  {
    id: 'uspto-apr00-pm-30',
    topicId: 2,
    subtopic: 'What may and may not be filed by facsimile',
    difficulty: 3,
    question:
      'Which of the following actions, if taken by a registered practitioner, comports with proper PTO rules and procedure?',
    options: [
      'Faxing a request for reexamination to the PTO on a weekday, during the period of enforceability of a patent, within two years of the patent’s issue date.',
      'Faxing an amendment under 37 C.F.R. § 1.111 to the PTO on the last day of the period for reply set by the examiner with a proper Certificate of Transmission.',
      'Faxing a request for reexamination to the PTO on a weekday, during the period of enforceability of a patent, but more than two years after the patent’s issue date.',
      'Filing, by facsimile, a national patent application under 37 C.F.R. § 1.53(b) with a specification and drawings for the purpose of obtaining an application filing date.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. § 1.6(d); MPEP § 502. Choices (A) and (C) are incorrect since a request for reexamination may not be properly transmitted by facsimile. 37 C.F.R. § 1.6(d)(5). Choice (D) is incorrect because a filing date for a national patent application filed under § 1.53(b) may not be obtained by facsimile. 37 C.F.R. §§ 1.6(d)(3) and 1.8(a)(2)(i)(A). (E) is incorrect since (B) is correct.',
  },
  {
    id: 'uspto-apr00-pm-31',
    topicId: 1,
    subtopic: 'A dependent claim may not be broader than its parent',
    difficulty: 3,
    question:
      'The application discloses a widget consisting essentially of, in series, an amplifier having a power output of 100 to 300 amps, preferably 250 amps, and a woofer having a wattage of 400 to 450 watts, preferably 425 watts, and does not disclose any power output or wattage outside those limits. Claim 1 reads: "A widget consisting essentially of an amplifier having a power output of 100 to 300 amps, and woofer having a wattage of 400 to 450 watts." Which of the following claims would not be a proper dependent claim if presented as an original claim in the application?',
    options: [
      '2. The widget of Claim 1 wherein the woofer has a wattage of 425 to 450 watts.',
      '2. The widget of Claim 1 wherein the amplifier has a power output of 300 amps and the woofer has a wattage between 430 and 450 watts.',
      '2. The widget of Claim 1 wherein the amplifier has a power output of 250 amps.',
      '2. The widget of Claim 1 wherein the woofer has a wattage of 425 watts.',
      '2. The widget of Claim 1 wherein the amplifier has a power output of up to 300 amps.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. §§ 112, fourth paragraph, and 251. The claim is not a proper dependent claim because it is broader than the claim from which it depends — the expression "up to 300 amps" would include 0 to 300 amps, which is outside the 100-300 amp range disclosed in the specification and recited in Claim 1. (A)-(D) are proper dependent claims because the wattage and voltage are within the range limitations set out in Claim 1.',
  },
  {
    id: 'uspto-apr00-pm-32',
    topicId: 0,
    subtopic: 'A new use of a known composition — method-of-use claims',
    difficulty: 3,
    question:
      'Your client developed a fishing lure made of a composition so effective that a fisherman need wait only a few minutes to lure fish. Your client purchased the material and cut it with a knife into a fishing lure, and does not know how to make the composition. A prior art search shows the composition is a well known gel used in shoes that has been in public use for 5 years; the prior art does not disclose the use of the composition as a fishing lure. Which of the following is the most appropriate advice to give the client?',
    options: [
      'Explain that it would be impossible for any claims to the process of using the composition as a fish lure to be allowed under the current PTO guidelines.',
      'File a U.S. patent application (and required fees) claiming the composition.',
      'File a U.S. patent application (and required fees) claiming a method of using the composition as a fishing lure.',
      'File a provisional patent application (and required fees) directed only to the composition to gain a competitive advantage for one year. Within one year of filing the provisional application, file a nonprovisional application claiming the composition.',
      'File a Disclosure Document (and required fee) to obtain a document from the PTO showing that the invention is registered with and protected by the PTO.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. The method of use is neither disclosed nor suggested by the prior art. 35 U.S.C. §§ 102(b) and 103. (A) is incorrect because the process of using the composition as a fishing lure is not disclosed in the prior art, and the PTO guidelines support such a claim. MPEP § 2112.02. (B) and (D) are incorrect because the composition itself is anticipated. § 102(b). (E) is incorrect because filing a Disclosure Document does not provide protection; it may be relied on only as evidence of its content and is not a patent application. MPEP § 1706. [Historical practice] — the Disclosure Document Program was discontinued by the USPTO in 2007.',
  },
  {
    id: 'uspto-apr00-pm-33',
    topicId: 1,
    subtopic: 'A broad range plus a preferred narrower range may be indefinite',
    difficulty: 3,
    question:
      'A claim limitation reads "having 10 to 20 grams of iron, preferably 13-18 grams of iron." The specification preceding the claim supports not only the limitation, but also the broader amounts of iron. Which of the following statements is correct?',
    options: [
      'The limitation may be indefinite.',
      'Since the limitation properly sets forth outer limits, it is definite.',
      'As long as the limitation is supported in the written description, it is proper.',
      'The limitation is definite since the limitation sets forth a preferred range.',
      'The applicant, having set forth a limitation in the claim, i.e., a range of 10 to 20 grams, is precluded by the doctrine of equivalents from expanding the claim coverage beyond the 10 to 20 grams of iron.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is correct. MPEP § 2173.05(c) indicates that a preferred narrower range set forth within a broader range may render the claim indefinite if the boundaries of the claim are not discernable. (B), (C) and (D) are incorrect — reciting in a single claim both a broad range and a preferred narrower range within the broad range may render the claim indefinite. (E) is incorrect; the doctrine of equivalents operates to EXPAND claim coverage beyond the literal scope of the claim language.',
  },
  {
    id: 'uspto-apr00-pm-34',
    topicId: 2,
    subtopic: 'Timeliness of issue fee payment',
    difficulty: 3,
    question:
      'A Notice of Allowance, setting a three month statutory period for reply, is dated and mailed on April 4, 2000, to the applicant. In which of the following situations would the issue fee be considered to be paid late?',
    options: [
      'The issue fee is filed in the PTO on Monday, July 3, 2000.',
      'The issue fee is filed in the PTO on Wednesday, July 5, 2000, inasmuch as the PTO was closed for a Federal holiday on Tuesday, July 4, 2000.',
      'The issue fee is filed in the PTO on Wednesday, October 4, 2000, and is accompanied by a petition to the Commissioner for a three month extension of time, as well as the late payment fee.',
      'The issue fee is received in the PTO on Thursday, July 6, 2000, accompanied by a certificate of mailing complying with 37 C.F.R. § 1.8 and dated Monday, July 3, 2000.',
      '(B), (C), and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. 35 U.S.C. § 151; 37 C.F.R. § 1.311; MPEP §§ 505 and 1306. (A) is incorrect — the procedure complies with 35 U.S.C. §§ 21(b) and 151. (B) is incorrect — the procedure complies with § 151 and 37 C.F.R. § 1.7. (D) is not correct — the procedure complies with §§ 21(b) and 151, and 37 C.F.R. § 1.8. (E) is incorrect because (B) and (D) are incorrect.',
  },
  {
    id: 'uspto-apr00-pm-35',
    topicId: 6,
    subtopic: 'Design patent applications — embodiments must be shown in the drawings',
    difficulty: 3,
    question: 'Which of the following statements regarding design patent applications is not correct?',
    options: [
      'The specification may contain a brief description denoting the nature and environmental use of the claimed design.',
      'Different embodiments or modifications may be set forth in the specification, but do not need to be shown in the drawings.',
      'The drawings may be color drawings or color photographs if accompanied by a grantable petition.',
      'The design application may have only a single claim.',
      'The inventive novelty or nonobviousness of a design resides in the shape or configuration, and/or surface ornamentation embodied in or applied to an article of manufacture.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer because different embodiments or modifications MUST be shown in the drawings. MPEP § 1503.01. (A) is a proper statement. MPEP § 1503.01. (C) is a correct statement. 37 C.F.R. § 1.152(a)(2). (D) is a correct statement — a design application may only contain a single claim. MPEP § 1503.03; 37 C.F.R. § 1.153(a). (E) is a correct statement of how designs are evaluated. MPEP § 1504.',
  },
  {
    id: 'uspto-apr00-pm-36',
    topicId: 7,
    subtopic: 'Registration roster maintenance and practitioner obligations',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'As a registered practitioner, it is not necessary to notify the Director of Enrollment and Discipline of your address changes as long as you file a change of address in each individual application for which you are responsible.',
      'At any time the Director of Enrollment and Discipline may send out letters to registered practitioners for the purpose of ascertaining whether they wish to remain on the register and if no reply is received, without further warning, the name may be removed from the register.',
      'A practitioner may not refuse to aid or participate in conduct that the practitioner believes to be unlawful, even though the client presents some support for an argument that the conduct is legal.',
      'Any person who passes this examination and is registered as a patent agent or patent attorney is entitled to file and prosecute patent applications and trademark registration applications before the PTO for the same client.',
      'It is permissible to give examiners gifts valued at between $25 and $250 so long as the gift is made after issuance of all patent applications that the practitioner or the practitioner’s firm has before the Examiner.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). See 37 C.F.R. § 10.11(b), where "the names of individuals so removed will be published in the Official Gazette"; the rule does not require notice to be published before removal. As to (A), a practitioner must notify the Director as set forth in § 10.11(a). As to (C), see § 10.84(b)(2). As to (D), registration only entitles one to practice before the USPTO in patent cases. §§ 10.5 and 10.14(a). As to (E), see § 10.23(c)(4)(iii) regarding improperly bestowing any gift, favor or thing of value. [Historical practice] — the Part 10 Code was replaced in 2013 by the 37 C.F.R. Part 11 Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr00-pm-37',
    topicId: 3,
    subtopic: 'A reply must distinctly point out the supposed errors',
    difficulty: 3,
    question:
      'Today, April 12, 2000, is the last day of a three month shortened statutory period for reply to a non-final rejection over references under 35 U.S.C. § 103. Today your client, located overseas, requests by facsimile that you cancel all of the current claims, and advises that a new set of claims will be sent no later than April 29, 2000. There is no deposit account. The client pays all fees in a timely manner. In accordance with proper PTO practice and procedure, which of the following is the most appropriate course of action to take regarding the non-final rejection?',
    options: [
      'Await receipt of the new claims and necessary fees, and then file the amendment, request for reconsideration, and appropriate fee for an extension of time, no more than six months from the date of the non-final rejection.',
      'File a request for a one month extension of time today and pay the fee when you file the amendment.',
      'File an amendment today canceling all claims in accordance with your client’s instructions.',
      'File a request for reconsideration today, stating only that "[t]he rejection is in error because the claims define a patentable invention."',
      'File a request for reconsideration today, and state that a supplemental amendment will be forthcoming.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 1.111; MPEP § 714.02. (B) is incorrect because the fee must be paid when the request for extension of time is made. § 1.136(a). (C) is incorrect — the client did not give instructions to file the amendment today, and an amendment canceling all claims is non-responsive. (D) is incorrect — "A general allegation that the claims define a patentable invention without specifically pointing out how the language of the claims patentably distinguishes them from the references does not comply with the requirements of this section." § 1.111(b). (E) is incorrect inasmuch as it does not comply with § 1.111(b).',
  },
  {
    id: 'uspto-apr00-pm-38',
    topicId: 0,
    subtopic: 'Different inventive entities and "another" under § 102(e)',
    difficulty: 3,
    question: 'Which of the following statements correctly describes current PTO practice and procedure?',
    options: [
      'A joint application by inventors Sam and Will, and a joint application by Will and Sam are different inventive entities.',
      'A joint application by inventors Sam and Will, and a sole application by Sam are different inventive entities.',
      'Where a patent is granted to Will, and later Will and Sam file a joint application, the presence of Will, a common inventor in the patent, prevents a determination that the patent entity is to "another" within the meaning of 35 U.S.C. § 102(e).',
      'The fact that an application has named a different inventive entity (Sam and Will) than a patent reference (Will) makes the patent prior art, even where one of the inventors is common to both.',
      '(A) and (C).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. Ex parte Utschig, 156 USPQ 156 (Bd. App. 1966); MPEP § 2137.01. (A) is incorrect — the same inventive entity obtains regardless of the order in which the inventors are listed. (C) is incorrect — the presence of a common inventor does not preclude a determination that the inventive entity in the reference is "another" within the meaning of § 102(e). Ex parte DesOrmeaus, 25 USPQ2d 2040 (Bd. Pat. App. & Inter. 1992). (D) is incorrect — merely that the inventive entities differ does not cause the patent to necessarily be prior art. Applied Materials Inc. v. Gemini Research Corp., 835 F.2d 279 (Fed. Cir. 1988). (E) is incorrect because (A) and (C) are incorrect. [Pre-AIA] — decided under pre-AIA § 102(e).',
  },
  {
    id: 'uspto-apr00-pm-39',
    topicId: 5,
    subtopic: 'Further broadening after the two-year reissue window',
    difficulty: 3,
    question:
      'A U.S. patent issued to Smith on January 6, 1998. Smith properly filed a broadening reissue application on September 30, 1999. On March 17, 2000, Smith submitted an Amendment adding new claims 20-33. Claims 20-22 were broader than the claims originally submitted with the reissue; claims 23-28 were narrower than those but broader than the original patent claims; claims 29-33 were narrower than the original patent claims. The reissue oath originally filed is adequate to support the newly submitted claims. Which of the following best describes a proper action by the examiner in reply to the Amendment?',
    options: [
      'Each of claims 20-33 is rejected as being improper since the claims were added after the two-year anniversary of the original patent issuance.',
      'Each of claims 20-33 is examined on the merits, but are not rejected for improperly broadening the reissue application after the two-year anniversary of the original patent issue.',
      'Claims 20-28 are rejected as being improper because they were added after the two-year anniversary of the original patent issue, but claims 29-33 are examined on the merits.',
      'Claims 20-22 are rejected as being improper because they were added after the two-year anniversary of the original patent issue, but claims 23-33 are examined on the merits.',
      'Claims 20-28 are examined on the merits, but claims 29-33 are rejected as improper because this is a broadening reissue application and these claims are narrower than the original patent claims.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). When, as here, a broadening reissue is applied for within the two-year time limit set forth in 35 U.S.C. § 251, an amendment presenting further broadened claims after the two-year period is appropriate if the later-presented claims are supported by the original reissue oath. In re Doll, 419 F.2d 925, 164 USPQ 218 (CCPA 1970); MPEP § 1412.03. Thus (A), (C) and (D) are not correct. (E) is not correct because a broadening reissue application does not preclude presentation of narrower claims. 37 C.F.R. § 1.175(a)(1); MPEP § 1444.',
  },
  {
    id: 'uspto-apr00-pm-40',
    topicId: 2,
    subtopic: 'When the Commissioner may refund a fee',
    difficulty: 3,
    question: 'In which of the following situations is the Commissioner authorized to refund a fee?',
    options: [
      'After receiving a final rejection, a notice of appeal and appeal fee are filed. After the notice of appeal and correct appeal fee are filed, the examiner thereafter withdraws the final rejection.',
      'Upon a showing of an extraordinary situation, when justice requires refund of a fee paid to the PTO where a practitioner paid the correct fee for an extension of time to provide the client with time to given instructions, and the client thereafter informs the practitioner that the client would not pay the fee and authorizes the practitioner to permit the application to become abandoned.',
      'Upon a showing that the application, which had been filed in the PTO and for which the correct filing fee had been paid, has been withdrawn from examination and expressly abandoned.',
      'Upon a petition to the Commissioner to exercise his supervision to refund a fee, though paid in the correct amount, when the practitioner no longer desired copies of patents ordered.',
      'Upon a showing that the fee was paid by mistake or in excess of the amount required by law.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Under 35 U.S.C. § 42(d) the Commissioner may refund any fee paid by mistake or in excess of the fee required by law. Where the fee is not paid by mistake or in excess of the fee required by law, the Commissioner is not obligated to make the refund. Miessner v. United States, 228 F.2d 643, 108 USPQ 6 (D.C. Cir. 1955). (A), (B), (C) and (D) are incorrect inasmuch as fees were not paid by mistake or in excess of the fee required. 37 C.F.R. § 1.26.',
  },
  {
    id: 'uspto-apr00-pm-41',
    topicId: 0,
    subtopic: 'What may not be used as § 102(b) prior art',
    difficulty: 3,
    question:
      'Which of the following may not be properly used as prior art for purposes of rejecting a claim under 35 U.S.C. § 102(b) in an application having an effective filing date of Monday, May 3, 1999?',
    options: [
      'A journal article, published Saturday, May 2, 1998, disclosing all the claimed elements and fully teaching how to make and use the invention as claimed.',
      'A foreign patent, published March 3, 1998, which applicant referenced in the application when claiming foreign priority based on the foreign application date, and applicant submitted a certified copy of the original foreign application.',
      'Applicant’s statement in a declaration under 37 C.F.R. § 1.132 that although the invention as claimed had been offered for sale in department stores in New York during 1997, this was done only to analyze consumer acceptance of the packaging in which the invention is marketed.',
      'A journal article, published May 1, 1997, disclosing all the elements of the claim and teaching how to make and use the claimed invention. The examiner used the article in combination with another journal article in a previous non-final Office action to reject the same claim under 35 U.S.C. § 103.',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 706.02(a). (B) is incorrect since the foreign patent, published more than one year before the effective filing date, would serve as a bar regardless of the attempt to claim priority. § 102(b). (C) is incorrect since market testing is not a proper exception to a statutory bar; also the facts do not involve testing the invention, only the packaging. MPEP § 2133.03(e)(6). (D) is incorrect since a reference may be used to reject claims under both § 102 and § 103. MPEP § 2141.01. (E) is incorrect since only (A) may not properly be used. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-apr00-pm-42',
    topicId: 1,
    subtopic: 'A process claim must recite acts, not a bare "use"',
    difficulty: 3,
    question:
      'Assuming that each of the following claims is in a different utility patent application, and each claim is fully supported by the disclosure, which of the claims properly presents a process claim?',
    options: [
      'A process of utilizing a filter having electrical components, said process comprising placing a plurality of electrodes on the human body, receiving electrical signals from the electrodes and passing the signals through said filter.',
      'A process of polymerizing an organic compound comprising combining a catalyst, organic compound reactants, and solvent in a reaction vessel, heating the combination in the vessel to a high temperature to start the reaction, separating the organic layer from the remaining materials, and evaporating the solvent.',
      'The use of a water repellant paint as a sealant for wooden patio furniture.',
      '(A), (B) and (C).',
      '(A) and (B).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). The claim in (A) recites sufficient acts performed on subject matter, e.g., passing the signals through the filter. MPEP § 2173.05(q); Ex parte Porter, 25 USPQ2d 1144 (Bd. Pat. App. & Int. 1992). The claim in (B) recites the act of polymerizing by sufficient acts. The claim in (C) is not a proper process claim because it does not recite an act specifying how a use or process is accomplished; the claim is indefinite under § 112 and/or an improper definition of a process under § 101. Ex parte Erlich, 3 USPQ2d 1011 (Bd. Pat. App. & Int. 1986); Clinical Products Ltd. v. Brenner, 255 F. Supp. 131 (D.D.C. 1966). (D) is incorrect because (C) is incorrect.',
  },
  {
    id: 'uspto-apr00-pm-43',
    topicId: 7,
    subtopic: 'Mandatory withdrawal upon discharge by the client',
    difficulty: 3,
    question:
      'Which of the following is not prohibited conduct for a practitioner under the PTO Code of Professional Responsibility?',
    options: [
      'The practitioner entering into a business partnership with an individual who is neither an attorney nor a registered practitioner, where the activities of the partnership consist of the practice of patent law before the Office by the practitioner, and the individual will market the practitioner’s services and the client’s inventions.',
      'Filing an amendment wherein claims are presented that have been copied from an issued patent of another, and knowingly withholding from the Office information identifying the patent from which the claims have been copied.',
      'Telling a client that the client’s application will go abandoned if the client’s bill is not paid and refusing to file any papers in the PTO unless and until the fee is paid.',
      'Upon being discharged by a client, filing a request to withdraw wherein the client’s intent to discharge is set forth as the reason for the request.',
      'When the client refuses to pay, without the client’s consent after full disclosure, accepting compensation from a client’s friend for the practitioner’s legal services on behalf of the client.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). See 37 C.F.R. § 10.40: "(b) Mandatory withdrawal. A practitioner representing a client before the Office shall withdraw from employment if:… (4) The practitioner is discharged by the client." As to (A), a practitioner may not enter into a partnership with a nonpractitioner where any of the practice of the partnership consists of patent, trademark or other law before the PTO. § 10.49. As to (B), see § 10.23(c)(7). As to (C), a practitioner is proscribed from neglecting an entrusted legal matter (§ 10.77(c)) and must file a request to withdraw and avoid foreseeable prejudice. As to (E), a practitioner may not accept compensation from someone other than the client. § 10.68. [Historical practice] — the Part 10 Code was replaced in 2013 by the 37 C.F.R. Part 11 Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr00-pm-44',
    topicId: 0,
    subtopic: 'Inventorship and § 102(f) — contribution to conception',
    difficulty: 3,
    question: 'Which of the following statements best correctly describes current PTO practice and procedure?',
    options: [
      'Where a patent discloses subject matter being claimed in an application undergoing examination, if the patent’s designation of inventorship differs from that of the application, then the patent’s designation of inventorship does not raise a presumption of inventorship regarding the subject matter disclosed but not claimed in the patent so as to justify a rejection under 35 U.S.C. § 102(f).',
      'The fact that a claim recites various components, all of which can be argumentatively assumed to be old, provides a proper basis for a rejection under 35 U.S.C. § 102(f).',
      'A person can be an inventor without having contributed to the conception of the invention.',
      'In arriving at conception, an inventor may not consider and adopt ideas and materials derived from other sources such as an employee or hired consultant.',
      'It is essential for the inventor to be personally involved in reducing the invention to actual practice.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2137. (B) is incorrect — the mere fact that a claim recites components argumentatively assumed to be old does not provide a basis for rejection under § 102(f). Ex parte Billottet, 192 USPQ 413 (Bd. App. 1976). (C) is incorrect — one must contribute to the conception to be an inventor. In re Hardee, 223 USPQ 1122 (Comm’r Pat. 1984); Fiers v. Revel, 984 F.2d 1164 (Fed. Cir. 1993). (D) is incorrect — an inventor may consider and adopt suggestions from many sources. Morse v. Porter, 155 USPQ 280 (Bd. Pat. Inter. 1965). (E) is incorrect — "there is no requirement that the inventor be the one to reduce the invention to practice so long as the reduction to practice was done on his behalf." In re DeBaun, 687 F.2d 459 (CCPA 1982). [Pre-AIA] — § 102(f) was replaced by derivation proceedings.',
  },
  {
    id: 'uspto-apr00-pm-45',
    topicId: 5,
    subtopic: 'Reissue cannot add an embodiment absent from the original patent',
    difficulty: 3,
    question:
      'You obtained a patent for inventor Jones. The patent, although disclosing a use for her invention and the best mode contemplated by Jones at the time of filing, through error and without deceptive intent failed to describe an embodiment of her invention. The embodiment has become a commercial success. Eighteen months after the patent issued, you filed a reissue application adding a claim and new, necessary supporting disclosure directed to the omitted embodiment, together with Jones’ declaration explaining the error and other required papers. In accordance with proper PTO practice and procedure:',
    options: [
      'The claim is subject to a new matter rejection under 35 U.S.C. § 132.',
      'The specification is subject to rejection under 35 U.S.C. § 101 for failure to disclose the best mode for achieving commercial success.',
      'The claim is subject to a rejection under 35 U.S.C. § 251 and a rejection under 35 U.S.C. § 112, first paragraph.',
      'The claim is allowable.',
      '(B) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 1411.02. (A) is incorrect because a rejection for new matter in a reissue application must be made under 35 U.S.C. § 251, not § 132. (B) is incorrect because the patent complied with § 101 inasmuch as it disclosed a use for the invention, and Jones is not required to disclose the best mode for achieving commercial success. (D) is incorrect because the embodiment was not disclosed in the original patent. (E) is incorrect because (B) and (D) are incorrect.',
  },
  {
    id: 'uspto-apr00-pm-46',
    topicId: 2,
    subtopic: 'Small entity status',
    difficulty: 2,
    question:
      'Assume that a corporation employing more than 500 persons does not qualify as a small business entity. Which of the following qualifies for reduction of certain patent fees by claiming small entity status in an application?',
    options: [
      'An independent inventor, who intends to make a profit through producing goods made according to the invention disclosed in the application, who has not assigned, granted, conveyed, or licensed any rights in the invention disclosed in the application, and is under no obligation to assign, grant, convey, or license any rights in the invention disclosed in the application.',
      'A corporation, assigned all rights in the invention disclosed in the application, having 600 employees, which derives a profit from producing and selling energy-saving devices.',
      'An eighty-five year-old inventor who has assigned to a corporation, having 600 employees, all rights in the invention disclosed in the application. The corporation derives a profit from producing and selling energy-saving devices.',
      'A patent examiner who works in a group which examines applications which are funded solely by Federal agencies.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 41(h); 37 C.F.R. § 1.9; MPEP § 509.02. Choices (B) and (C), although raising issues involving a "petition to make special" (MPEP § 708.02), are not provided for regarding small entity status. Choice (D) is incorrect. (E) is incorrect since (A) is correct.',
  },
  {
    id: 'uspto-apr00-pm-47',
    topicId: 3,
    subtopic: 'Disputing the propriety of a final rejection',
    difficulty: 3,
    question:
      'Which of the following actions, if any, when taken as an initial step to dispute the propriety of the finality of an Office action, comports with proper PTO rules and procedure? I. Filing a request for reconsideration concerning the finality of the Office action, while the application is still pending before the primary examiner. II. Filing a Notice of Appeal, then a brief, and arguing in the brief the impropriety of the finality of the rejection. III. Filing a petition under 37 C.F.R. 1.181 based on improper finality of the rejection to stay the running of the period for reply set in the final Office action.',
    options: ['I. only.', 'II. only.', 'III. only.', 'I. and III.', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP §§ 706.07(c) and (d) set forth that prematureness of a final rejection may not be advanced as a ground for appeal, so (II) is improper; (II) is also improper because required fees have not been paid. 37 C.F.R. §§ 1.191 and 1.192. (III) is improper because the filing of the petition does not stay the period for reply. MPEP § 1002. Thus (B), (C), and (D) are incorrect. (E) is incorrect because (A) is correct.',
  },
  {
    id: 'uspto-apr00-pm-48',
    topicId: 0,
    subtopic: '§ 103 "as a whole" includes disclosed inherent properties',
    difficulty: 3,
    question: 'Which of the following statements regarding 35 U.S.C. § 103 is most correct?',
    options: [
      'PTO classification of prior art references used to reject a claim under 35 U.S.C. § 103, and the similarities and differences in structure and function carry equal weight as evidence of whether the references are analogous or non-analogous.',
      'The question of obviousness under 35 U.S.C. § 103 is resolved by determining whether the differences between the prior art and the claims would have been obvious.',
      'Obviousness of an invention can be properly determined by identifying the "gist" of the invention, even where the "gist" does not take into regard an express limitation in the claims.',
      'In delineating the invention, consideration is given not only to the subject matter recited in the claim, but also the properties of the subject matter which are inherent in the subject matter and disclosed in the specification.',
      'Obviousness can be predicated on what is not known at the time an invention is made, where the inherency of the feature is later established.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 103(a); In re Antonie, 559 F.2d 618 (CCPA 1977) ("In delineating the invention as a whole, we look not only to the subject matter which is literally recited in the claim in question… but also to those properties of the subject matter which are inherent in the subject matter and are disclosed in the specification…"); MPEP § 2141.02. (A) is incorrect — PTO classification is some evidence of analogy, but structure and function carry more weight. In re Ellis, 476 F.2d 1370 (CCPA 1973). (B) is incorrect — the question is whether the claimed invention AS A WHOLE would have been obvious. Stratoflex, Inc. v. Aeroquip Corp., 713 F.2d 1530 (Fed. Cir. 1983). (C) is incorrect — distilling the invention down to a "gist" disregards the "as a whole" requirement. W.L. Gore & Associates v. Garlock, 721 F.2d 1540 (Fed. Cir. 1983). (E) is incorrect — "Obviousness cannot be predicated on what is not known at the time an invention is made, even if the inherency of a certain feature is later established." In re Rijckaert, 9 F.3d 1531 (Fed. Cir. 1993). [Pre-AIA] — analysis under pre-AIA § 103(a).',
  },
  {
    id: 'uspto-apr00-pm-49',
    topicId: 2,
    subtopic: 'Copendency — a chain of benefit claims breaks on abandonment',
    difficulty: 3,
    question:
      'Parent application A was filed September 9, 1988, and became abandoned October 19, 1993. Application B was filed October 21, 1993, referred to A and claimed benefit of A’s filing date, and issued June 17, 1997. Application C was filed October 29, 1993, referring to and claiming benefit of B. Application D was filed December 20, 1996, referring to and claiming benefit of B. Both C and D were abandoned for failure to file a timely reply to Office actions mailed April 20, 1999. Application E was filed July 22, 1999, is drawn to the same invention as claimed in C and D, claims the benefit of the filing dates of A, B, C, and D, and makes reference to all preceding applications. The earliest effective filing date of application E with respect to any common subject matter in the prior applications is:',
    options: [
      'October 21, 1993.',
      'December 20, 1996.',
      'October 29, 1993.',
      'September 9, 1988.',
      'July 22, 1999.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Applications C and D were abandoned after midnight of July 21, 1999, therefore they are technically not abandoned on July 21, 1999. There is no copendency between application E and any prior application. MPEP § 201.11 ("If the first application is abandoned, the second application must be filed before the abandonment in order for it to be co-pending with the first."). See also MPEP § 710.01(a).',
  },
  {
    id: 'uspto-apr00-pm-50',
    topicId: 5,
    subtopic: 'Reissue window, multi-party interferences, repeat reexamination requests',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'Reissue applications may be filed to correct errors made without deceptive intent provided that an application is filed within two years from issuance.',
      'An interference may be declared between three parties who invent their inventions in three different countries and each party may be declared the winner for some of the counts at issue.',
      'An assignment may not be made conditional on the performance of the payment of money since the public has no way of knowing whether or not payment is made.',
      'A patent may not be issued to an assignee and if the inventor dies before the patent issues, the rights to the invention are forfeited.',
      'Anyone may obtain reexamination of a patent upon filing a request for the same as many times as they please provided they pay the required fee each time.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): THREE ANSWERS WERE ACCEPTED — the model answer reads "50. ANSWER: (A),(B), or (E)." As to (A), it is true that reissues may be filed within two years to correct errors made without deceptive intent. 35 U.S.C. § 251. As to (B), there is no limit on the number of parties or countries or winners; a given inventor may have reduced to practice certain counts without having reduced to practice others. As to (E), it too is true inasmuch as no facts are given that the request is filed for purposes of harassment — see MPEP § 2240 on second or subsequent requests filed during reexamination. This item is keyed to (A) here because the bank stores a single key and (A) is the first option the model answer analyses; (B) and (E) were equally accepted by the USPTO. [Historical practice] — interference practice was replaced by derivation proceedings, and the two-year broadening-reissue limit in (A) applies to BROADENING reissues specifically.',
  },
];

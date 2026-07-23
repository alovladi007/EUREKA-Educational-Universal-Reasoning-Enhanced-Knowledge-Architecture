/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, April 15, 2003 — Morning Session
 * (Test Number 123, Series 103), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (15apr03aq.pdf / 15apr03aa.pdf,
 * via the Internet Archive copy of uspto.gov). US Government works — public
 * domain.
 *
 * Provenance and integrity rules (same as the October 2003 files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers; `explanation`
 *    is the official model answer, abridged, retaining the controlling
 *    citation.
 *  - Question 28 was officially discarded ("All answers were accepted") and
 *    is excluded.
 *  - Questions 2 and 33 are excluded because the USPTO's model answers accept
 *    TWO keys each ("(A) and (D)" / "(A) and (E)"); this bank's single-key
 *    grading cannot represent dual credit without mis-grading an
 *    officially-correct choice.
 *  - DUPLICATES: the USPTO reused seven items verbatim from the October 2003
 *    exam already ingested here — Q16 (= Oct PM Q1), Q21 (= Oct AM Q1),
 *    Q22 (= Oct PM Q13), Q26 (= Oct AM Q34), Q29 (= Oct PM Q34),
 *    Q34 (= Oct AM Q17), Q50 (= Oct AM Q49). They are excluded so the
 *    practice pool never serves the same stem twice. (Their April keys match
 *    the October keys in every case.)
 *  - ERA NOTE: this exam predates the AIA. Questions turning on pre-AIA
 *    35 U.S.C. 102 timing rules carry a [Pre-AIA] tag in the explanation.
 *    Verified status: OFFICIAL (USPTO model answers).
 *
 * Ingested: AM session Q1, Q3–Q15, Q17–Q20, Q23–Q25, Q27, Q30–Q32, Q35–Q49
 * (40 of 47 usable after the 7 cross-exam duplicates). The April PM session
 * follows the same pipeline — see
 * docs/monetization/TEST_PREP_FIX_BUILD_PROMPT.md (WS2).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2003_AM_SOURCE =
  'USPTO Registration Examination, April 15, 2003 — Morning Session (official model answers; public domain)';

export const USPTO_APR2003_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr03-am-01',
    topicId: 0,
    subtopic: 'Reduction to Practice & Diligence (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following statements is most correct?',
    options: [
      'The same evidence sufficient to establish a constructive reduction to practice is necessarily also sufficient to establish actual reduction to practice.',
      'Proof of constructive reduction to practice does not require sufficient disclosure to satisfy the “how to use” and “how to make” requirements of 35 USC 112, first paragraph.',
      'A process is reduced to actual practice when it is successfully performed.',
      'The diligence of 35 USC 102(g) requires an inventor to drop all other work and concentrate on the particular invention.',
      'The diligence of 35 USC 102(g) does not impose on a registered practitioner any need for diligence in preparing and filing a patent application inasmuch as such the practitioner’s acts do not inure to the benefit of the inventor.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct. [Pre-AIA] Corona v. Dovan, 273 U.S. 692 (1928); MPEP § 2138.05: a process is reduced to actual practice when it is successfully performed. (A) fails — actual reduction requires a physical or tangible form with every element (Wetmore v. Quick); (B) fails — constructive reduction requires § 112 ¶ 1 compliance (Kawai v. Metlesics); (D) fails — diligence does not require dropping all other work (Keizer v. Bradley); (E) fails — a practitioner’s diligence in preparing and filing inures to the inventor’s benefit (Haskell v. Coleburne).',
  },
  {
    id: 'uspto-apr03-am-03',
    topicId: 3,
    subtopic: 'Requirement for Information — Complete Reply (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Registered practitioner Rick drafted a patent application for inventor Sam. The application was filed in the USPTO on May 15, 2000, with a power of attorney appointing Rick. On March 15, 2001, Sam filed a revocation of the power of attorney to Rick, and a new power of attorney appointing registered practitioner Dave. In a non-final Office action dated September 12, 2001, the examiner included a requirement for information, requiring Dave to submit a copy of any non-patent literature, published application, or patent that was used to draft the application. Which of the following, if timely submitted by Dave in reply to the requirement for information, will be accepted as a complete reply to the requirement for information?',
    options: [
      'A statement by Dave that the information required to be submitted is unknown and is not readily available to Dave.',
      'A statement by Dave that the requirement for information is improper because it was included in a non-final Office action.',
      'A statement by Dave that the requirement for information is improper because Dave is not an individual identified under 37 CFR 1.56(c).',
      'A statement by Dave that the requirement for information is improper because information used to draft a patent application may not be required unless the examiner identifies the existence of a relevant database known by Sam that could be searched for a particular aspect of the invention.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR § 1.105(a)(3); MPEP § 704.12(b): “A reply stating that the information required to be submitted is unknown and/or is not readily available to the party or parties from which it was requested will generally be sufficient.” (B) fails — a requirement for information may be included in an Office action or sent separately (§ 1.105(b)); (C) fails — § 1.56(c) includes each attorney or agent who prepares or prosecutes the application; (D) has no support in § 1.105.',
  },
  {
    id: 'uspto-apr03-am-04',
    topicId: 1,
    subtopic: 'Markush Group Form (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following presents a Markush group in accordance with proper PTO practice and procedure?',
    options: [
      'R is selected from the group consisting of A, B, C, or D.',
      'R is selected from the group consisting of A, B, C, and D.',
      'R is selected from the group comprising A, B, C, and D.',
      'R is selected from the group comprising A, B, C or D.',
      'R is A, B, C, and D.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2173.05(h): a Markush group is an acceptable form of alternative expression provided the introductory phrase “consisting of” and the conjunctive “and” are used. (A)/(D) misuse the conjunctive “or”; (C)/(D) misuse the open phrase “comprising”; (E) requires R to be all of A, B, C AND D simultaneously rather than one selected member.',
  },
  {
    id: 'uspto-apr03-am-05',
    topicId: 2,
    subtopic: 'What May NOT Be Filed by Fax (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following may not be filed by facsimile transmission?',
    options: [
      'A request for continued examination under 37 CFR 1.114 along with a submission.',
      'A continued prosecution application under 37 CFR 1.53(d).',
      'An amendment in reply to a non-final Office action.',
      'The filing of a provisional patent application specification and drawing for the purpose of obtaining an application filing date.',
      '(B) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.6(d)(3); MPEP § 502.01: correspondence not permitted by facsimile includes “a national patent application specification and drawing (provisional or nonprovisional)… for the purpose of obtaining an application filing date, other than a continued prosecution application filed under 37 CFR 1.53(d).” An RCE (not a new application), a CPA under § 1.53(d), and an amendment replying to a non-final action MAY all be filed by fax — so (A), (B), (C) and (E) fail.',
  },
  {
    id: 'uspto-apr03-am-06',
    topicId: 3,
    subtopic: 'Improper Finality — First-Action Final (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] According to the USPTO rules and the procedures set forth in the MPEP, in which of the following situations would the finality of an Office action rejection be improper? I. The final Office action rejection is in a first Office action in a substitute application that contains material which was presented in the earlier application after final rejection but was denied entry because the issue of new matter was raised. II. The final Office action rejection is in a first Office action in a continuing application, all claims are drawn to the same invention claimed in the earlier application, and the claims would have been properly finally rejected on the grounds and art of record in the next Office action if they had been entered in the earlier application. III. The final Office action rejection is in a first Office action in a continuation-in-part application where at least one claim includes subject matter not present in the earlier application.',
    options: [
      'I',
      'II',
      'III',
      'I and III',
      'II and III',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 706.07(b): finality is IMPROPER in both I (first action in a substitute application containing material denied entry as new matter after final in the earlier application) and III (first action in a CIP where any claim includes subject matter not present in the earlier application). Finality is PROPER in II — a first-action final in a continuing application is permitted where all claims are to the same invention and would have been properly finally rejected on the record in the earlier application.',
  },
  {
    id: 'uspto-apr03-am-07',
    topicId: 0,
    subtopic: 'Examiner Knowledge, SIR Waivers, Statutory Bars (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is true?',
    options: [
      'In rejecting claims the examiner may rely upon facts within his own personal knowledge, unless the examiner qualifies as an expert within the art, in which case he is precluded from doing so, since only evidence of one of ordinary skill in the art is permitted.',
      'If an applicant desires to claim subject matter in a reissue which was the same subject matter waived in the statutory invention registration of another, the applicant is precluded by the waiver from doing so, even though the applicant was not named in the statutory invention registration.',
      'If an applicant, knowing that the subject matter claimed in his patent application was on sale in Michigan and sales activity is a statutory bar under 35 USC 102(b) to the claims in his application, nevertheless withholds the information from the patent examiner examining the application, and obtains a patent including the claims in question, the applicant may remove any issue of inequitable conduct by filing a request for reexamination based on the sales activity.',
      'An applicant for a patent may overcome a statutory bar under 35 USC 102(b) based on a patent claiming the same invention by acquiring the rights to the patent pursuant to an assignment and then asserting the assignee’s right to determine priority of invention pursuant to 37 CFR 1.602.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — none is true. [Pre-AIA] (A) fails — facts within the examiner’s knowledge may be used whether or not the examiner is an expert (37 CFR § 1.104(c)(3)). (B) fails — an SIR waiver is effective only against those named in the statutory registration. (C) fails — on-sale activity is not proper subject matter for reexamination, and inequitable conduct cannot be resolved or absolved by reexamination. (D) fails — a statutory bar cannot be overcome by acquiring the patent.',
  },
  {
    id: 'uspto-apr03-am-08',
    topicId: 3,
    subtopic: 'Notice of Appeal — Twice Rejected Across Applications (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Following a restriction requirement and election, a registered practitioner received a first Office action dated Friday, December 1, 2000. The primary examiner indicated that claims 1 to 10 were rejected and claims 11 to 20 were withdrawn from consideration. The first Office action set a 3 month shortened statutory period for reply. On February 28, 2001, the practitioner properly filed an express abandonment in the application and at the same time filed a request for continuing application. In a non-final Office action dated May 1, 2001 in the continuing application, the examiner indicated in that claims 1 to 20, all of the pending claims, are rejected. The practitioner filed a notice of appeal on Monday, July 2, 2001. In accordance with USPTO rules and procedures set forth in the MPEP, which of the following most accurately describes the propriety of the practitioner’s reply to the May 1st Office action?',
    options: [
      'The notice of appeal is not a proper response because the claims of the continuing application have not been finally rejected.',
      'The notice of appeal is not a proper reply because all of the claims in the continuing application have not been twice rejected.',
      'The filing of a notice of appeal is not a proper reply because not all the claims in the continuing application have been twice rejected.',
      'A notice of appeal is never a proper response to a non-final rejection.',
      'The reply is proper.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 1205, “Appeal By Patent Applicant”: a notice of appeal may be filed after ANY of the claims has been twice rejected, regardless of final rejection — and the “twice… rejected” limitation does not have to occur in a single application. Claims 1-10 were rejected in the parent and again in the continuing application, so the appeal is proper even though the continuing application’s rejection is non-final.',
  },
  {
    id: 'uspto-apr03-am-09',
    topicId: 4,
    subtopic: 'Foreign Priority § 119(a) Conditions (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following is not in accordance with the provisions of the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Where joint inventors are named, the examiner should not inquire of the patent applicant concerning the inventors and the invention dates for the subject matter of the various claims until it becomes necessary to do so in order to properly examine the application.',
      'Under 35 USC 119(a), the foreign priority benefit may be claimed to any foreign application that names a U.S. inventor as long as the U.S. named inventor was the inventor of the foreign application invention and 35 USC 119(a)-(d) requirements are met.',
      'Where two or more foreign applications are combined in a single U.S. application, to take advantage of the changes to 35 USC 103 or 35 USC 116, the U.S. application may claim benefit under 35 USC 119(a) to each of the foreign applications provided all the requirements of 35 USC 119(a)-(d) are met.',
      'One of the conditions for benefit under 35 USC 119(a) is that the foreign application must be for the same or a nonobvious improvement of the invention described in the United States application.',
      'If a foreign application for which priority is being claimed under 35 USC 119 is filed in a country which does not afford similar privileges in the case of applications filed in the United States or to citizens of the United States and the foreign country is not a WTO member country, any claim for the foreign priority thereto by a U.S. application will not be effective.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the best answer (the statement NOT in accordance) — under 35 U.S.C. § 119(a) the inventions must be the SAME in the foreign and U.S. applications, not “the same or a nonobvious improvement.” (A)–(C) accord with MPEP § 605.07; (E) accords with § 119’s reciprocity/WTO-membership condition.',
  },
  {
    id: 'uspto-apr03-am-10',
    topicId: 2,
    subtopic: 'Missing Parts — Extensions Under § 1.136(a) (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A registered practitioner filed a patent application naming Sam as the sole inventor without an executed declaration under 37 CFR 1.63. The USPTO mailed a Notice to File Missing Parts dated January 3, 2000. The Notice to File Missing Parts set a two-month period for reply. Which of the following statements is in accordance with proper USPTO rules and the procedure set forth in the MPEP? I. Submit an appropriate reply to the Notice to File Missing Parts by filing, on August 3, 2000, a declaration under 37 CFR 1.63 executed by Sam, accompanied by a petition under 37 CFR 1.136(a) for an extension of five months, and the fee set forth in 37 CFR 1.17(a). II. In no situation can any extension requested by the practitioner carry the date on which a reply is due to the Notice to File Missing Parts beyond Monday, July 3, 2000. III. An appropriate reply by the practitioner to the Notice to File Missing Parts is to file, on August 3, 2000 a declaration under 37 CFR 1.63 executed by Sam, accompanied by a petition under 37 CFR 1.136(b).',
    options: [
      'I',
      'II',
      'III',
      'I and III',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 710.02(d), last paragraph; 37 CFR § 1.136(a): the two-month Missing Parts period may be extended up to five additional months under § 1.136(a) with the fee — a reply on August 3, 2000 with a five-month extension petition is proper. II fails because § 1.136(a) extensions ARE available (the period is not the statutory § 133 bar date); III fails because § 1.136(b) (cause-shown extensions) does not apply where § 1.136(a) is available.',
  },
  {
    id: 'uspto-apr03-am-11',
    topicId: 5,
    subtopic: 'Certificate of Correction — Proper Grounds (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and procedures set forth in the MPEP, a Certificate of Correction effectuates correction of an issued patent where:',
    options: [
      'Through error and without deceptive intent, there is a failure to make reference to a prior copending application according to 37 CFR 1.78, and the failure does not otherwise affect what is claimed, but the prior copending application is referenced in the record of the application, and a petition under 37 CFR 1.324 and appropriate fees were filed.',
      'Through error and without deceptive intent, a preferred embodiment that materially affects the scope of the patent was omitted in the original disclosure in the filed application, and a petition under 37 CFR 1.324 and appropriate fees were filed.',
      'Through error and without deceptive intent, a prior copending application is incorrectly referenced in the application, the incorrect reference does not otherwise affect the claimed subject matter, and the prior copending application is correctly identified elsewhere in the application file, and a petition under 37 CFR 1.324 and appropriate fees were filed.',
      'Through error and without deceptive intent, an inventor’s name is omitted from an issued patent, a petition under 37 CFR 1.324 and appropriate fees were filed, and the petition was granted.',
      '(A), (C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 1481; 37 CFR § 1.324: a missing or incorrect reference to a prior copending application that does not affect the claims (A, C), and an inventor’s name omitted with a granted § 1.324 petition (D), can each be corrected by Certificate of Correction. (B) fails — omission of a preferred embodiment that materially affects the scope of the patent is not the “minor” character of mistake required for a Certificate of Correction.',
  },
  {
    id: 'uspto-apr03-am-12',
    topicId: 0,
    subtopic: '103(c) Common Ownership Exception (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] The Potter patent application was filed on June 6, 2002, claiming subject matter invented by Potter. The Potter application properly claims priority to a German application filed on June 6, 2001. A first Office action contains a rejection of all the claims of the application under 35 USC 103(a) based on a U.S. patent application publication to Smith in view of a U.S. patent to Jones. A registered practitioner prosecuting the Potter application ascertains that the relevant subject matter in Smith’s published application and Potter’s claimed invention were, at the time Potter’s invention was made, owned by ABC Company or subject to an obligation of assignment to ABC Company. The practitioner also observes that the Smith patent application was filed on April 10, 2001 and that the patent application was published on December 5, 2002. Smith and Potter do not claim the same patentable invention. To overcome the rejection without amending the claims, which of the following timely replies would comply with the USPTO rules and the procedures set forth in the MPEP to be an effective reply for overcoming the rejection?',
    options: [
      'A reply that only contains arguments that Smith fails to teach all the elements in the only independent claim, and which specifically points out the claimed element that Smith lacks.',
      'A reply that properly states that the invention of the Potter application and the Smith application were commonly owned by ABC Company at the time of the invention of the Potter application.',
      'A reply that consists of an affidavit or declaration under 37 CFR 1.132 stating that the affiant has never seen the invention in the Potter application before.',
      'A reply that consists of an affidavit or declaration under 37 CFR 1.131 properly proving invention of the claimed subject matter of Potter application only prior to June 6, 2001.',
      'A reply that consists of a proper terminal disclaimer and affidavit or declaration under 37 CFR 1.130.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. [Pre-AIA] 35 U.S.C. § 103(c); MPEP § 706.02(l)(1): the prior-art exception applies because Smith is prior art only under § 102(e), was applied in a § 103(a) rejection, and was commonly owned at the time Potter’s invention was made — a proper statement of common ownership disqualifies the reference. (A) fails — one cannot attack references individually against a combination rejection (MPEP § 2145). (D) fails — invention must be proven before Smith’s April 10, 2001 filing date, not merely before June 6, 2001. (E) fails — § 1.130 applies where the same patentable invention is claimed, which is not the case.',
  },
  {
    id: 'uspto-apr03-am-13',
    topicId: 5,
    subtopic: 'Impermissible Recapture (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, impermissible recapture in an application exists ________________________',
    options: [
      'if the limitation now being added in the present reissue was originally presented/argued/stated in the original application to make the claims allowable over a rejection or objection made in the original application.',
      'if the limitation now being omitted or broadened in the present continuation was originally presented/argued/stated in a parent application to make the claims allowable over a rejection or objection made in the parent application.',
      'if the limitation now being omitted or broadened in the present reissue was originally presented/argued/stated in the original application to make the claims allowable over a rejection or objection made in the original application.',
      'if the limitation now being omitted or broadened in the present reissue was being broadened for the first time more than two years after the issuance of the original patent.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct. MPEP § 1412.02 (Recapture): impermissible recapture exists where a limitation being OMITTED or BROADENED in a reissue was originally presented/argued to make the claims allowable in the original application. (A) fails — adding a limitation narrows, and recapture concerns broadening; (B) fails — recapture does not apply to continuations; (D) fails — the two-year limit of § 251 governs broadening reissues generally, not recapture.',
  },
  {
    id: 'uspto-apr03-am-14',
    topicId: 2,
    subtopic: 'Fees Payable in Advance (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] With the exception that under 37 CFR 1.53 an application for patent may be assigned a filing date without payment of the basic filing fee, USPTO fees and charges payable to the USPTO requesting any action by the Office for which a fee or charge is payable, are required to be paid, in accordance with the MPEP and USPTO rules and procedure:',
    options: [
      'in advance, that is, at the time of requesting any action.',
      'upon written notice from the USPTO.',
      'within 20 days of requesting any action.',
      'by the end of the fiscal year.',
      'there are no fees.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 CFR § 1.22(a); MPEP § 509: fees and charges payable to the USPTO are required to be paid IN ADVANCE — at the time of requesting the action. Answers (B) through (E) have no factual basis or foundation in the MPEP.',
  },
  {
    id: 'uspto-apr03-am-15',
    topicId: 3,
    subtopic: 'Proper First-Action Finality (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In which of the following final Office action rejections is the finality of the Office action rejection in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'The final Office action rejection is in a second Office action and uses newly cited art under 35 USC 102(b) to reject unamended claims that were objected to but not rejected in a first Office action.',
      'The final Office action rejection is in a first Office action in a continuation-in-part application where at least one claim includes subject matter not present in the parent application.',
      'The final Office action rejection is in a first Office action in a continuing application, all claims are drawn to the same invention claimed in the parent application, and the claims would have been properly finally rejected on the grounds and art of record in the next Office action if they had been entered in the parent application.',
      'The final Office action rejection is in a first Office action in a substitute application that contains material that was presented after final rejection in an earlier application but was denied entry because the issue of new matter was raised.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 706.07(b): a first-action final rejection is proper in a continuing application where all claims are drawn to the same invention as the parent and would have been properly finally rejected on the grounds and art of record. (A) fails — a second-action final is improper when it rests on newly cited art (other than IDS-submitted art under § 1.97(c)) (MPEP § 706.07(a)); (B) and (D) restate the two improper first-action-final situations of § 706.07(b).',
  },
  {
    id: 'uspto-apr03-am-17',
    topicId: 0,
    subtopic: '§ 112 — Essential Elements & Best Mode (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is true?',
    options: [
      'A claim to a process omitting a step in a disclosed process, where the step is disclosed in the specification to be essential to the invention, may not be properly rejected under 35 USC 112, first paragraph, for lack of enablement where the specification provides an enabling disclosure only for the process which includes the essential step.',
      'Failure to disclose the best mode must rise to the level of active concealment or grossly inequitable conduct in order to support a rejection under 35 USC 112, first paragraph.',
      'A claim failing to interrelate essential elements of the invention, as defined by the applicant in the specification, where the interrelation is critical to the invention may be properly rejected under 35 USC 112, second paragraph, for failure to properly point out and distinctly claim the invention.',
      'Where the best mode contemplated by the inventor at the time of filing the application is not disclosed, a proposed amendment adding a specific mode of practicing the invention would not be new matter.',
      'The best mode requirement is the same as the enablement requirement of the first paragraph of 35 USC 112.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2172.01: a claim which fails to interrelate essential elements of the invention as defined by applicant in the specification may be rejected under § 112 ¶ 2 (In re Venezia, 530 F.2d 956 (CCPA 1976)). (A) inverts the rule — omitting an essential step MAY draw a § 112 ¶ 1 rejection (In re Mayhew); (B) fails — no active concealment is required (Union Carbide v. Borg-Warner); (D) fails — a best-mode defect cannot be cured by amendment; such an amendment is new matter (In re Hay; MPEP § 2165.01); (E) fails — best mode is separate and distinct from enablement (In re Newton).',
  },
  {
    id: 'uspto-apr03-am-18',
    topicId: 0,
    subtopic: 'Admissions as Prior Art — Jepson Claims (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following statements is true?',
    options: [
      'Where sole patent applicant Able claims his invention in a Jepson-type claim, and the specification discloses that the subject matter of the preamble was invented by Baker before applicant’s invention, the preamble is properly treated as prior art.',
      'Where the sole patent applicant Able claims his invention in a Jepson-type claim, and the specification makes it clear that the claimed invention is an improvement on Able’s own prior invention, which Able discovered less than one year before the filing date of the application, the preamble in the claim is properly treated as prior art.',
      'Where the sole patent applicant Able claims his invention in a Jepson-type claim, and the specification makes it clear that the claimed invention is an improvement on an invention that Able discovered and publicly used and commercially sold by Able in Texas for several years before the filing date of the application, the preamble in the claim cannot properly be treated as prior art.',
      'Where the sole applicant, Baker, states that something is prior art, the statement can be taken as being admitted prior art only if corroborated by objective evidence proffered by Baker, or found by the examiner.',
      'No claim, including a Jepson-type claim, carries with it an implied admission that the elements in the preamble are old in the art.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is true and thus the most correct answer. MPEP § 2129; In re Fout, 675 F.2d 297 (CCPA 1982): a Jepson preamble covering another’s prior invention is properly treated as admitted prior art. (B) fails — a Jepson preamble reciting the applicant’s OWN recent work is not automatically prior art (Reading & Bates v. Baker Energy). (C) fails — Able’s own public use and sales for several years create a statutory bar. (D) fails — an applicant’s statement that something is prior art is an admission without corroboration (In re Nomiya). (E) fails — a Jepson claim does imply the preamble elements are old (In re Ehrreich; Pentec v. Graphic Controls).',
  },
  {
    id: 'uspto-apr03-am-19',
    topicId: 2,
    subtopic: 'Interviews Before First Action (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following requests by the registered practitioner of record for an interview with an examiner concerning an application will be granted in accordance with proper USPTO rules and procedure?',
    options: [
      'A request for an interview in a substitute application prior to the first Office action, for the examiner and attorney of record to meet in the practitioner’s office without the authority of the Commissioner.',
      'A request for an interview in a continued prosecution application prior to the first Office action, to be held in the examiner’s office.',
      'A request for an interview in a non-continuing and non-substitute application, prior to the first Office action to be held in the examiner’s office.',
      'All of the above.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.133; MPEP § 713.02: “a request for an interview prior to the first Office action is ordinarily granted in continuing or substitute applications” — a CPA qualifies, held in the examiner’s office. (A) fails — interviews will not be held off Office premises without the Commissioner’s authority (§ 1.133(a)(1)); (C) fails — before the first action, interviews are not granted in ordinary (non-continuing, non-substitute) applications.',
  },
  {
    id: 'uspto-apr03-am-20',
    topicId: 0,
    subtopic: 'Microorganism Claims — Proper Rejection (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] During his summer vacation to the mountains, Eric discovered and isolated a microorganism which secretes a novel compound. Eric purified and tested the compound in tumor-containing control mice and found that the tumors disappeared after one week; whereas tumor-containing mice which did not receive the compound died. Eric was very excited about his results and so he did a few additional experiments to characterize the microorganism and the compound which it was secreting. Eric determined that the microorganism was an S. spectaculus, and that the secreted compound was so unlike any other compounds that Eric named it spectaculysem. Eric told his friend Sam about his discovery, who urged him to apply for a U.S. patent on the microorganism and the secreted product. Eric did so, but to his amazement, a primary examiner rejected all the claims to his inventions. Which of the following, if made by the examiner, would be a proper rejection in accordance with USPTO rules and procedures set forth in the MPEP?',
    options: [
      'The examiner’s rejection of the claims to the microorganism under 35 USC 101 as being unpatentable because microorganisms are living matter and living matter is non-statutory subject matter.',
      'The examiner’s rejection of the claims to the compound under 35 USC 101 as having no credible utility because Eric has only tested the compound in mice and curing mice of cancer has no “real world” value. The examiner also states that Eric must demonstrate that the compound works in humans in order to show that it has a patentable utility.',
      'The examiner’s rejection of the claims to the compound under 35 USC 103, stating that it would have been obvious to one of ordinary skill in the art to test the byproduct of a newly-discovered microorganism for therapeutic uses.',
      'The examiner’s rejection of the claims to the microorganism under 35 USC 102/103 over a reference which teaches an S. spectaculus microorganism stating that Eric’s claimed microorganism is the same as, or substantially the same as, the microorganism described in the prior art.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP §§ 2112.01, 2131: where the claimed and prior art products are identical or substantially identical, a prima facie case of anticipation or obviousness is established (In re Best, 562 F.2d 1252 (CCPA 1977)). (A) fails — living matter made by man is patentable (Diamond v. Chakrabarty; isolation and purification makes it a product of human ingenuity). (B) fails — mouse testing supports utility; safety/efficacy in humans is not required (Cross v. Iizuka; In re Brana). (C) fails — the rejection rests on impermissible hindsight from applicant’s own disclosure (MPEP § 2145).',
  },
  {
    id: 'uspto-apr03-am-23',
    topicId: 7,
    subtopic: 'Professional Responsibility — Permitted Conduct (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following is not prohibited conduct for a practitioner under the USPTO Code of Professional Responsibility?',
    options: [
      'Entering into an agreement with the client to limit the amount of any damages which the client may collect for any mistakes the practitioner may make during prosecution of the client’s patent application in exchange for prosecuting the application at a reduced fee.',
      'Encouraging the client to meet with an opposing party for settlement discussions.',
      'Failing to disclose controlling legal authority which is adverse to the practitioner’s client’s interest when arguing the patentability of claims in a patent application.',
      'In reply to an Office action, stating honestly and truthfully in the remarks accompanying an amendment that the practitioner has personally used the device and found it to be very efficient and better than the prior art.',
      'Investing the funds the client advanced for the practitioner legal fees (not costs and expenses) in long term United States Treasury Bills in order to obtain guaranteed protection of the principal.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer — encouraging settlement discussions is permitted (37 CFR § 10.87). (A) is prohibited — a practitioner may not limit malpractice damages (§ 10.78); (C) is prohibited — controlling adverse legal authority must be disclosed (§ 10.89(b)(1)); (D) is prohibited — asserting personal knowledge/opinion as advocate (§ 10.89(c)(4)); (E) is prohibited — client funds advanced for legal fees must be deposited in a bank account (§ 10.112(a)).',
  },
  {
    id: 'uspto-apr03-am-24',
    topicId: 2,
    subtopic: 'Small Entity Status — Scope of Reduction (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Sam is a sole proprietor of Sam’s Labs, which has no other employees. Sam invented a new drug while doing research under a Government contract. Sam desires to file a patent application for his invention and assign it to Sam’s Labs. Sam has licensed Rick, also a sole proprietor with no employees, to make and use his invention. Sam wants to claim small entity status when filing a patent application for his invention. Sam also wants to grant the Government a license, but will not do so if he will be denied small entity status. Sam has limited resources and wants to know whether, how, and to what extent he may claim small entity status. Which of the following is not in accord with the USPTO rules and the procedures set forth in the MPEP in relation to applications filed on or after January 1, 2001?',
    options: [
      'Sam’s Labs is a small business concern for the purposes of claiming small entity status for fee reduction purposes.',
      'If Sam grants a license to the Government resulting from a rights determination under Executive Order 10096, it will not constitute a license so as to prohibit claiming small entity status.',
      'The establishment of small entity status permits the recipient to pay reduced fees for all patent application processing fees charged by the USPTO.',
      'Sam may establish small entity status by a written assertion of entitlement to small entity status. A written assertion must: (i) be clearly identifiable; (ii) be signed; and (iii) convey the concept of entitlement to small entity status, such as by stating that applicant is a small entity, or that small entity status is entitled to be asserted for the application or patent.',
      'While no specific words or wording are required to assert small entity status, the intent to assert small entity status must be clearly indicated in order to comply with the assertion requirement.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer (the statement NOT in accord) — not ALL fees are subject to the small-entity reduction (see, e.g., 37 CFR § 1.17(p)). (A) accords with § 1.27(a)(2); (B) accords with § 1.27(a)(4) (an Executive Order 10096 government license does not defeat small-entity status); (D) and (E) accord with § 1.27(c)(1).',
  },
  {
    id: 'uspto-apr03-am-25',
    topicId: 3,
    subtopic: 'Board Remand — Improper Basis (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with USPTO rules and procedures set forth in the MPEP, which of the following is not a proper basis on which the Board of Patent Appeals and Interferences may remand a case to the examiner?',
    options: [
      'Remand for a fuller description of the claimed invention.',
      'Remand for a clearer explanation of the pertinence of the references.',
      'Remand for a selection by the primary examiner of a preferred or best ground of rejection when multiple rejections of a cumulative nature have been made by the examiner.',
      'Remand to the primary examiner with instructions to consider an affidavit not entered by the examiner which was filed after the final rejection but before the appeal.',
      'Remand to the primary examiner to prepare a supplemental examiner’s answer in response to a reply brief.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 1211.02: the Board has no authority to require the examiner to consider an affidavit not entered after final rejection — review of an examiner’s refusal to enter an affidavit as untimely is by PETITION, not appeal (In re Deters, 515 F.2d 1152 (CCPA 1975); MPEP § 715.09). (A), (B), (C) and (E) are each proper remand bases specifically provided in MPEP § 1211.',
  },
  {
    id: 'uspto-apr03-am-27',
    topicId: 3,
    subtopic: '§ 1.131 — Conception Plus Diligence (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Assume that conception of applicant’s complex invention occurred prior to the date of the reference, but reduction to practice occurred after the date of the reference. Which of the following is sufficient to overcome the reference in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to allege that applicant or patent owner has been diligent.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference, and diligence from just prior to the effective date of the reference to actual reduction to practice. The presence of a lapse of time between the reduction to practice of an invention and the filing of an application thereon is not relevant.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to clearly establish conception of the invention prior to the effective date of the reference. Diligence need not be considered.',
      'In a 37 CFR 1.131 affidavit or declaration, it is sufficient to show conception and reduction to practice in any country.',
      'In a 37 CFR 1.131 affidavit or declaration, it is always sufficient to prove actual reduction to practice for all mechanical inventions by showing plans for the construction of the claimed apparatus.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. [Pre-AIA] MPEP § 715.07(a); Ex parte Merz, 75 USPQ 296: conception before the reference plus diligence from just prior to the reference date to actual reduction to practice suffices, and the lapse of time between reduction to practice and filing is not relevant. (A) fails — facts, not allegations, must establish diligence (Ex parte Hunter); (C) fails — diligence must be considered (Ex parte Kantor); (D) fails — completion may be shown only in the U.S. or NAFTA/WTO member countries with date limits (§ 1.131(a); MPEP § 715.07(c)); (E) fails — plans alone do not generally prove actual reduction to practice.',
  },
  {
    id: 'uspto-apr03-am-30',
    topicId: 1,
    subtopic: 'Dependent Claims — Comprising vs Consisting Gas (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A patent application includes the following Claim 1: “Claim 1. A method of making an electrical device comprising the steps of: (i) heating a base made of carbon to a first temperature in the range of 1875°C to 1925°C; (ii) passing a first gas over said heated base, said first gas comprising a mixture of hydrogen, SiCl4, phosphorus, and methane, whereby said first gas decomposes over said heated base and thereby forms a first deposited layer of silicon, phosphorus and carbon on said heated base; (iii) heating said base having said deposited layer to a second temperature of approximately 1620°C; and (iv) passing a second gas over said base heated to said second temperature, said second gas consisting of a mixture of hydrogen, SiCl4, AlCl3, and methane, whereby said second gas decomposes over said heated base to form a second deposit layer adjacent said first layer, said second layer comprising silicon, aluminum and carbon.” Assuming proper support in the specification, which of the following claims, if presented in the same application, is a proper claim in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'Claim 2. The method of claim 1, wherein said first temperature is in the range of 1800°C to 2000°C.',
      'Claim 3. The method of claim 1, wherein said first gas further comprises an inert gas.',
      'Claim 4. The method of claim 1, wherein said second gas further comprises Argon.',
      'Claim 5. The method of claim 1, wherein said first gas is an inert gas such as Argon.',
      'Claim 6. The method of claim 1, wherein said second gas consists of a mixture of hydrogen, SiCl4 and AlCl3 only.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR § 1.75(c): the first gas is recited with the open term “comprising,” so a dependent claim may further add an inert gas. (A) broadens the temperature range below the stated limit; (C) fails because the second gas uses closed “consisting,” precluding added components; (D) uses improper exemplary language “such as” (§ 112 ¶ 2; MPEP § 2173.05(d)) and is inconsistent with claim 1; (E) broadens by removing a recited component (methane) of the second gas.',
  },
  {
    id: 'uspto-apr03-am-31',
    topicId: 2,
    subtopic: 'Verification Statements Eliminated (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following documents, if any, must also contain a separate verification statement?',
    options: [
      'Small entity statements.',
      'A petition to make an application special.',
      'A claim for foreign priority.',
      'An English translation of a non-English language document.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 410: the certification requirement of 37 CFR § 10.18(b) permitted the PTO to eliminate the separate verification requirement previously contained in 37 CFR §§ 1.27 (small entity statements), 1.52 (English translations of non-English documents), 1.55 (foreign priority claims), and 1.102 (petitions to make special).',
  },
  {
    id: 'uspto-apr03-am-32',
    topicId: 1,
    subtopic: 'Application Data Sheet — Error Correction (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Lucy, new associate of a registered practitioner, wants to know whether she must file an application data sheet with a provisional patent application of an applicant and what information she should include on the application data sheet. Lucy has previously submitted an application data sheet with a previously filed application for another applicant, but has discovered a discrepancy with the information contained in the declaration and application data sheet. Lucy wonders if she needs to correct the error if the correct information is contained in the declaration. She also asks how errors may be corrected. With respect to the filing of an application data sheet, which of the following is not in accord with the USPTO rules and the procedures set forth in the MPEP for applications filed on or after January 1, 2001?',
    options: [
      'An application data sheet is a sheet or sheets that may be voluntarily submitted in either provisional or nonprovisional applications, which contains bibliographic data, arranged in a format specified by the Office. If an application data sheet is provided, the application data sheet is part of the provisional or nonprovisional application for which it has been submitted.',
      'Bibliographic data on an application data sheet includes: (1) applicant information, (2) correspondence information, (3) application information, (4) representative information, (5) domestic priority information, (6) foreign priority information, and (7) assignee information.',
      'Once captured by the Office, bibliographic information derived from an application data sheet containing errors may not be corrected and recaptured by a request therefore accompanied by the submission of a supplemental application data sheet, an oath or declaration under 37 CFR 1.63 or 1.67; nor will a letter pursuant to 37 CFR 1.33(b) be acceptable.',
      'In general, supplemental application data sheets may be subsequently supplied prior to payment of the issue fee either to correct or update information in a previously submitted application data sheet.',
      'The Office will initially capture bibliographic information from the application data sheet notwithstanding whether an oath or declaration governs the information. Thus, the Office shall generally not look to an oath or declaration under 37 CFR 1.63 to see if the bibliographic information contained therein is consistent with the bibliographic information captured from an application data sheet (whether the oath or declaration is submitted prior to or subsequent to the application data sheet).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer (the statement NOT in accord). 37 CFR § 1.76(d)(4): captured bibliographic information containing errors MAY be recaptured by a request with a supplemental ADS, an oath or declaration under §§ 1.63/1.67, or a letter pursuant to § 1.33(b) — (C) says the opposite. (A), (B), (D) and (E) accord with 37 CFR § 1.76(a)-(d).',
  },
  {
    id: 'uspto-apr03-am-35',
    topicId: 6,
    subtopic: 'Design Patent — Terminal Disclaimer of Term (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Igor filed a design patent application in the USPTO on January 24, 2000, which issued as a design patent on January 23, 2001. Igor’s design patent covered a design that became immediately popular, resulting in numerous inquiries for licenses from various manufacturers. Igor would like to financially exploit his patent by licensing for five years. However, Igor has decided to dedicate five years of his patent term to the public. Which of the following is in accord with the USPTO rules and the procedures set forth in the MPEP, while best allowing Igor to pursue his intentions?',
    options: [
      'Record in the USPTO an assignment of all right, title, and interest in the patent to the public, conditioned on the receipt by Igor of all royalties from licensing the patent after the first five years of the patent term.',
      'File a disclaimer in the USPTO dedicating to the public the first five years of the patent term.',
      'File a disclaimer in the USPTO dedicating to the public that portion of the term of the patent from January 24, 2015 to January 24, 2020.',
      'File a disclaimer in the USPTO dedicating to the public half of all royalties received from licensing the patent for the terminal part of the term of the patent.',
      'File a disclaimer in the USPTO dedicating to the public that portion of the term of the patent from January 24, 2010 to January 23, 2015.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct. 37 CFR § 1.321(a): a patentee may disclaim or dedicate to the public “the entire term, or any terminal part of the term” of the patent; 35 U.S.C. § 173 gives designs a fourteen-year term from grant (here ending January 23, 2015), so dedicating January 24, 2010 to January 23, 2015 — the final five years — works. (B) fails — the FIRST five years is not a terminal part; (C) fails — that period is after the term expires; (A) results in an absolute assignment for Office purposes (37 CFR § 3.56); (D) — royalties are not addressed by § 1.321(a).',
  },
  {
    id: 'uspto-apr03-am-36',
    topicId: 2,
    subtopic: 'Who May File — Unavailable Inventor (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Mike and Alice, who are not related, are shipwrecked on a heretofore uninhabited and undiscovered island in the middle of the Atlantic Ocean. In order to signal for help, Mike invents a signaling device using bamboo shoots. Alice witnesses but does not assist in any way in the development of the invention. The signaling device works and a helicopter comes and rescues Alice. However, Mike remains on the island due to overcrowding on the helicopter. Unfavorable weather conditions have prevented Mike’s rescue to date. Alice comes to you, a registered patent practitioner, to file an application for a patent and offers to pay you in advance. Which of the following, in accordance with the USPTO rules and the procedures set forth in the MPEP, is true?',
    options: [
      'Since Mike invented the invention, Alice cannot properly file an application for a patent in her name even though Mike is unavailable.',
      'Since Mike is unavailable, you may properly file an application for a patent without his consent. You can accept the money from Alice as payment for the application.',
      'Since Mike is not available and cannot be reached, Alice may properly sign the declaration on his behalf since she has witnessed the invention and knows how to make and use it.',
      'Alice should file an application in her name since she has witnessed the invention and knows how to make and use it. Subsequently, when Mike becomes available, the inventorship may be changed to the correct inventorship.',
      'Even though Mike and Alice are not related, Alice may properly file an application on Mike’s behalf.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — only the inventor may file for a patent (35 U.S.C. § 101). (C)/(E) fail — Alice is not a joint inventor and lacks sufficient proprietary interest, so she may not file on Mike’s behalf (35 U.S.C. § 116; 37 CFR § 1.47(b)). (B) fails — a practitioner ordinarily may not accept payment from someone other than the client (37 CFR § 10.68(a)(1)). (D) fails — inventorship cannot be changed where there is deceptive intent.',
  },
  {
    id: 'uspto-apr03-am-37',
    topicId: 3,
    subtopic: 'Board Affirms — No Claims Stand Allowed (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Applicant properly appealed the primary examiner’s final rejection of the claims to the Board of Patent Appeals and Interferences (Board). Claims 1 to 10 were pending in the application. The examiner did not reject the subject matter of claims 7 to 10, but objected to these claims as being dependent on a rejected base claim. Claim 1 was the sole independent claim and the remaining claims, 2 through 10, were either directly or indirectly dependent thereon. After a thorough review of Appellant’s brief and the examiner’s answer, the Board affirmed the rejection of claims 1 to 6. In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is the appropriate action for the examiner to take upon return of the application to his jurisdiction when the time for appellant to take further action under 37 CFR 1.197 has expired?',
    options: [
      'Abandon the application since the Board affirmed the rejection of independent claim 1.',
      'Convert the dependent claims 7 to 10 into independent form by examiner’s amendment, cancel claims 1 to 6, and allow the application.',
      'Mail an Office action to applicant setting a 1-month time limit in which the applicant may rewrite dependent claims 7 to 10 in independent form. If no timely reply is received, the examiner should amend the objected to claims, 7 to 10, and allow the application.',
      'Mail an Office action to applicant with a new rejection of claims 7 to 10 based on the Board’s decision.',
      'No action should be taken by the examiner since the Board affirmed the rejection of independent claim 1, the application was abandoned on the date the Board decision was mailed.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 1214.06, “No Claims Stand Allowed”: claims indicated as allowable prior to appeal EXCEPT for their dependency from rejected claims are treated as if they were rejected — with no allowed claims remaining after affirmance, the application is abandoned. (B)/(C) would apply had the Board reversed as to the dependent claims; (D) fails — the Board renders no decision on objected-to claims (37 CFR § 1.191(c)); (E) fails — mailing of a Board decision does not itself abandon an application (§ 1.197(a)).',
  },
  {
    id: 'uspto-apr03-am-38',
    topicId: 5,
    subtopic: 'Issue Fee Delay & Confidential Citations (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following is true?',
    options: [
      'Once the issue fee has become due, provided an original application has not been pending more than three years, the applicant may request and the Office may grant a request for deferral of payment of the issue fee.',
      'The time period set for the payment of the issue fee is statutory and cannot be extended. However, if payment is not timely made and the delay in making the payment is shown to be unavoidable, upon payment of a fee for delayed payment, it may be accepted as though no abandonment had occurred, but there will be a reduction on the patent term adjustment for the period of abandonment.',
      'Upon written request, a person citing patents and printed publications to the Office that the person believes has a bearing on the patentability of a particular patent, may request that his or her name remain confidential.',
      'To obtain benefit of priority based on an earlier filed U.S. patent application, an applicant in a later filed continuation application is not required to meet the conditions and requirements of 35 USC 120.',
      'Each of statements (B) and (C) is true.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer — both (B) and (C) are true. (B): the issue-fee period is statutory and unextendable, but unavoidably delayed payment may be accepted with a fee, with a PTA reduction for the abandonment period (35 U.S.C. §§ 151, 154(b)(2); 37 CFR § 1.704(c)(3); MPEP § 1306). (C): a person citing prior art against a patent may request confidentiality (MPEP §§ 2203, 2212). (A) fails — deferral under 37 CFR § 1.103 is not available after the notice of allowance; (D) fails — § 120’s conditions must be met.',
  },
  {
    id: 'uspto-apr03-am-39',
    topicId: 3,
    subtopic: 'Appeal Brief Deadline After Advisory Action (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Applicant received a Final Rejection with a mail date of Tuesday, February 29, 2000. The Final Rejection set a 3 month shortened statutory period for reply. Applicant files an Amendment and a Notice of Appeal on Monday, March 27, 2000. The examiner indicates in an Advisory Action that the Amendment will be entered for appeal purposes, and how the individual rejection(s) set forth in the final Office action will be used to reject any added or amended claim(s). The mail date of the examiner’s Advisory Action is Wednesday, May 31, 2000. In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following dates is the last date for filing a Brief on Appeal without an extension of time?',
    options: [
      'Saturday, May 27, 2000.',
      'Monday, May 29, 2000 (a Federal holiday, Memorial Day).',
      'Tuesday, May 30, 2000.',
      'Wednesday, May 31, 2000.',
      'Tuesday, August 29, 2000.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 710.02(e), “Final Rejection – Time For Reply”: where applicant initially replies within 2 months of a final rejection setting a 3-month period and the Office mails the advisory action after the period ends, the period for reply (for extension-fee purposes) becomes the advisory action’s mail date. Under 37 CFR § 1.192(a) the brief is due within two months of the notice of appeal OR within the time allowed for reply to the action appealed from, if later — here May 31, 2000, the Advisory Action mail date.',
  },
  {
    id: 'uspto-apr03-am-40',
    topicId: 2,
    subtopic: 'Provisional Application Requirements (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with USPTO rules and the procedure set forth in the MPEP, which one of the following is not required for a provisional application filed in the USPTO?',
    options: [
      'A specification.',
      'A drawing as prescribed by 35 USC 113.',
      'An application fee.',
      'A claim.',
      'A cover sheet complying with the rule.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 35 U.S.C. § 111(b)(2); 37 CFR § 1.51(c); MPEP §§ 601, 601.01(b): “[a] claim, as required by the second through fifth paragraphs of section 112, shall not be required in a provisional application.” The specification, any required drawing, the fee, and the cover sheet ARE required (35 U.S.C. § 111(b); 37 CFR § 1.51(c)).',
  },
  {
    id: 'uspto-apr03-am-41',
    topicId: 0,
    subtopic: 'Overcoming a 103 Rejection — Missing Limitation (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A claim in a pending patent application is rejected under 35 USC 103(a) as being obvious over Barry in view of Foreman. The Barry reference is a U.S. Patent that was issued on an application filed before the date of the application in question. In accordance with USPTO rules and procedures set forth in the MPEP, which of the following arguments, if true, would overcome the rejection?',
    options: [
      'The Foreman reference is nonanalogous art, but the reference may be reasonably pertinent to Barry’s endeavor to solving the particular problem with which Barry was concerned.',
      'The rejection does not address a claimed limitation, and neither of the references teaches the claimed limitation.',
      'The Barry patent issued after the filing date of the pending patent application.',
      'The original specification states that the results achieved by the claimed invention are unexpected. (The statement is unsubstantiated by evidence).',
      'The Foreman patent issued 105 years before the filing date of the pending patent application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2143.03: to establish prima facie obviousness, ALL claimed limitations must be taught or suggested by the prior art — if neither reference teaches a claimed limitation, the rejection fails. (A) concedes the reference is reasonably pertinent (analogous art, In re Oetiker); (C) fails — U.S. patents apply as of their FILING dates (MPEP § 2136.02); (D) fails — unexpected results require factual evidence, not conclusory statements (In re De Blauwe); (E) fails — mere age of a reference is not persuasive (In re Wright).',
  },
  {
    id: 'uspto-apr03-am-42',
    topicId: 0,
    subtopic: 'Overcoming a 102(e) Rejection (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Which of the following practices or procedures may be employed in accordance with the USPTO rules and the procedures set forth in the MPEP to overcome a rejection properly based on 35 USC 102(e)?',
    options: [
      'Persuasively arguing that the claims are patentably distinguishable from the prior art.',
      'Filing an affidavit or declaration under 37 CFR 1.132 showing that the reference invention is not by “another.”',
      'Filing an affidavit or declaration under 37 CFR 1.131 showing prior invention, if the reference is not a U.S. patent that either claims the same invention or claims an obvious variation of the subject matter in the rejected claim(s).',
      '(A) and (C).',
      '(A), (B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. [Pre-AIA] MPEP § 706.02(b), “Overcoming A 35 U.S.C. § 102 Rejection Based On A Printed Publication Or Patent”: a § 102(e) rejection may be overcome by persuasive argument distinguishing the claims, by a § 1.132 showing that the reference is not by “another,” or by a § 1.131 showing of prior invention (where the reference does not claim the same or obviously-variant invention). All three work, so (A)–(D) alone are not the most inclusive.',
  },
  {
    id: 'uspto-apr03-am-43',
    topicId: 2,
    subtopic: 'Power of Attorney Rules (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Regarding a power of attorney or authorization of agent in a patent application, which of the following is in accordance with the USPTO rules and the procedure set forth in the MPEP?',
    options: [
      'All notices and official letters for the patent owner or owners in a reexamination proceeding will be directed to the attorney or agent of record in the patent file at the address listed on the register of patent attorneys and agents.',
      'Powers of attorney to firms submitted in applications filed in the year 2000 are recognized by the USPTO.',
      'The associate attorney may appoint another attorney.',
      'The filing and recording of an assignment will operate as a revocation of a power or authorization previously given.',
      'Revocation of the power of the principal attorney or agent does not revoke powers granted by him or her to other attorneys or agents.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 CFR § 1.33(c): notices and official letters for the patent owner in a reexamination are directed to the attorney or agent of record. (B) fails — powers of attorney to FIRMS in applications filed after July 2, 1971 are not recognized (MPEP § 403); (C) fails — an associate attorney may not appoint another attorney (MPEP §§ 402.02, 406); (D) fails — an assignment does not itself revoke a power (37 CFR § 1.36); (E) fails — revoking the principal’s power revokes powers the principal granted to others (MPEP § 402.05).',
  },
  {
    id: 'uspto-apr03-am-44',
    topicId: 0,
    subtopic: 'Close Ranges — Obvious, Not Anticipated (Official Apr 2003)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] A claim in an application recites “[a] composition containing: (a) 35-55% polypropylene; and (b) 45-65% polyethylene.” The sole prior art reference describes, as the only relevant disclosure, a composition containing 34.9% polypropylene and 65.1% polyethylene. In accordance with USPTO rules and procedures set forth in the MPEP, the primary examiner should properly:',
    options: [
      'Indicate the claim allowable over the prior art because there is no teaching, motivation or suggestion to increase the amount of polypropylene from 34.9% to 35% and decrease the amount of polyethylene from 65.1% to 65%.',
      'Reject the claim under 35 USC 102 as anticipated by the prior art reference.',
      'Reject the claim under 35 USC 103 as obvious over the prior art reference.',
      'Reject the claim alternatively under 35 USC 102 as anticipated by or under 35 USC 103 as obvious over the prior art reference.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2144.05: a prima facie case of obviousness exists where the claimed ranges and the prior art are close enough that one of ordinary skill would expect the same properties (Titanium Metals Corp. v. Banner, 778 F.2d 775 (Fed. Cir. 1985) — proportions “so close that prima facie one skilled in the art would have expected them to have the same properties”). (B)/(D) fail — 34.9%/65.1% is outside the claimed ranges, so there is no anticipation; (A) fails — the close-range doctrine supplies the prima facie case.',
  },
  {
    id: 'uspto-apr03-am-45',
    topicId: 3,
    subtopic: 'New Ground in Examiner’s Answer — Petition (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] An examiner’s answer, mailed on January 2, 2003, contains a new ground of rejection in violation of 37 CFR 1.193(a)(2). If an amendment or new evidence is needed to overcome the new ground of rejection, what is the best course of action the appellant should take in accordance with the USPTO rules and the procedures set forth in the MPEP?',
    options: [
      'File a reply brief bringing the new ground of rejection to the attention of the Board of Patent Appeals and Interferences and pointing out that 37 CFR 1.193(a)(2) prohibits entry of the new ground of rejection.',
      'File a timely petition pursuant to 37 CFR 1.181 seeking supervisory review of the examiner’s entry of an impermissible new ground of rejection in the answer, after efforts to persuade the examiner to reopen prosecution or remove the new ground of rejection are unsuccessful.',
      'File a reply brief arguing the merits of the new ground of rejection.',
      'File an amendment or new evidence to overcome the new ground of rejection.',
      'Ignore the new ground of rejection.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 1208.01: “Any allegation that an examiner’s answer contains an impermissible new ground of rejection is waived if not timely (37 CFR 1.181(f)) raised by way of a petition under 37 CFR 1.181(a).” (A)/(C) fail — the issue is petitionable, not appealable (MPEP § 1201); (D) fails — entry of post-appeal amendments or evidence is discretionary (37 CFR §§ 1.116, 1.195); (E) waives the issue.',
  },
  {
    id: 'uspto-apr03-am-46',
    topicId: 3,
    subtopic: 'Drawing Objections — No Abeyance (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] Practitioner Smith filed a utility patent application on January 5, 2001, with informal drawings. Upon review of the drawings, the USPTO concluded that the drawings were not in compliance with the 37 CFR 1.84(a)(1) and (k), and were not suitable for reproduction. In an Office communication, Smith was notified of the objection and given two months to correct the drawings so that the application can be forwarded to a Technology Center for examination. Which of the following complies with the USPTO rules and the procedures set forth in the MPEP for a complete bona fide attempt to advance the application to final action?',
    options: [
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance until allowable subject matter is indicated.',
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance since the requirement increases up-front costs for the patent applicant, and the costs can be avoided if patentable subject matter is not found.',
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance until fourteen months from the earliest claimed priority date.',
      'Smith timely files a response correcting the drawings to comply with 37 CFR 1.84(a)(1) and (k), and making them suitable for reproduction.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR § 1.85(a); MPEP § 608.02(b): correcting the drawings to comply and making them suitable for reproduction is a bona fide response. (A), (B) and (C) fail — “a request to hold objections to the drawings in abeyance will not be considered a bona fide attempt to advance the application to final action” (37 CFR §§ 1.85(a), 1.135(c)).',
  },
  {
    id: 'uspto-apr03-am-47',
    topicId: 1,
    subtopic: 'What Claims May Not Contain (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with USPTO rules and the procedures set forth in the MPEP, claims in a patent application may not contain:',
    options: [
      'chemical formulas.',
      'mathematical equations.',
      'drawings or flow diagrams.',
      'only one sentence.',
      'tables not necessary to conform with 35 USC 112.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 608.01, “Illustrations In The Specification”: “[t]he specification, including any claims… may not contain drawings or flow diagrams.” As to (A) and (B), the same section states the specification, including any claims, MAY contain chemical formulas and mathematical equations. As to (D), each claim is a single sentence beginning with a capital letter and ending with a period (MPEP § 608.01(m)). As to (E), the official answer cites MPEP § 608.01’s statement that claims “may contain tables only if necessary to conform to 35 U.S.C. 112” in support of (C) as the most correct choice.',
  },
  {
    id: 'uspto-apr03-am-48',
    topicId: 0,
    subtopic: 'Commercial Success — Probative Evidence (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] In accordance with the USPTO rules and the procedures set forth in the MPEP, which of the following does not constitute probative evidence of commercial success to support a contention of non-obviousness?',
    options: [
      'In a utility case, gross sales figures accompanied by evidence as to market share.',
      'In a utility case, gross sales figures accompanied by evidence as to the time period during which the product was sold.',
      'In a utility case, gross sales figures accompanied by evidence as to what sales would normally be expected in the market.',
      'In a utility case, gross sales figures accompanied by evidence of brand name recognition.',
      'In a design case, evidence of commercial success clearly attributable to the design, and not to improved performance of the device.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 716.03(b): gross sales figures must be measured against a LOGICAL comparative standard (market share, time period, expected sales) to show commercial success. Brand-name recognition provides no comparative basis — indeed it suggests success may derive from the brand rather than the merits of the claimed invention. (E) is probative in a design case because the success is attributed to the design itself.',
  },
  {
    id: 'uspto-apr03-am-49',
    topicId: 0,
    subtopic: 'Rebutting a Nonenablement Rejection (Official Apr 2003)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 2003] An examiner has advanced a reasonable basis for questioning the adequacy of the enabling disclosure in the specification of your client’s patent application, and has properly rejected all the claims in the application. The claims in the application are drawn to a computer program system. In accordance with the USPTO rules and the procedures set forth in the MPEP, the rejection should be overcome by submitting _____________',
    options: [
      'factual evidence directed to the amount of time and effort and level of knowledge required for the practice of the invention from the disclosure alone.',
      'arguments by you (counsel) alone, inasmuch as they can take the place of evidence in the record.',
      'an affidavit under 37 CFR 1.132 by an affiant, who is more than a routineer in the art, submitting few facts to support his conclusions on the ultimate legal question of sufficiency, i.e., that the system “could be constructed.”',
      'opinion evidence directed to the ultimate legal issue of enablement.',
      'patents to show the state of the art for purposes of enablement where these patents have an issue date later than the effective filing date of the application under consideration.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2106.02, “Affidavit Practice (37 CFR 1.132)”: factual evidence directed to the time, effort and level of knowledge required to practice the invention from the disclosure alone can rebut a prima facie case of nonenablement (Hirschfield v. Banner, 200 USPQ 276 (D.D.C. 1978)). (B) fails — arguments of counsel cannot take the place of evidence (In re Budnick); (C)/(D) fail — conclusory or opinion evidence on the ultimate legal issue carries little weight (In re Brandstadter); (E) fails — later-issued patents do not show the state of the art at filing (In re Gunn).',
  },
];

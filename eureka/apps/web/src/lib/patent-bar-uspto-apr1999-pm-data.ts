/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — April 21, 1999, AFTERNOON (PM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo499pq.pdf / edo499pa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files here):
 *  - Stems and options are VERBATIM, in the official order (A)-(E). Verbatim
 *    includes the booklet's own typographical slips (e.g. Q13(B)'s "the U.S
 *    patent", Q23(D)'s "35 U.S.C § 112", Q30(B)'s "A unsigned Notice of
 *    Appeal", Q35's "35 U.S.C § 103").
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *    Where the model answer is only one line (Q16, Q49) it is reproduced as
 *    published rather than padded out.
 *
 * Keys are from `npm run audit:uspto`, which parsed 45 of the 50 entries, and
 * every one of those 45 was then re-checked against the answer scans and
 * matched exactly. The five the OCR could not parse — Q6, Q8, Q11, Q16 and
 * Q17 — were read directly off pma-2.png and pma-3.png: (C), (C), (C), (E)
 * and (C) respectively.
 *
 * DISCARDED: none — all 50 delivered questions are scoreable.
 *
 * MULTI-KEYED: none.
 *
 * PRINTED SLIP IN THE MODEL ANSWERS. Q6's answer reads "there is no reduced
 * fee for small entities for III or IV" even though the keyed answer (C) is
 * "I, II, and IV" — i.e. IV (issue fees) plainly IS reduced and the sentence
 * was evidently meant to read "III or V". The line is reproduced as printed;
 * it is the USPTO's own text, not a transcription error.
 *
 * ERA NOTES. This paper predates the AIA by twelve years and predates the AIPA
 * (1999-2000) as well, so much of what it tests has since been repealed or
 * rewritten. Items turning on pre-AIA § 102 practice carry [Pre-AIA];
 * superseded procedure carries [Historical practice]. In particular:
 *  - Q1 and Q42 turn on continued prosecution application (CPA) practice under
 *    37 C.F.R. § 1.53(d), eliminated for utility applications in 2003 (RCE
 *    practice replaced it); Q28(D) recites CPA practice for reissues.
 *  - Q7, Q8, Q9, Q10, Q11, Q22, Q29, Q43 and Q48 apply the pre-AIA
 *    §§ 102(a)/(b)/(d)/(e)/(f)/(g) bars, including their geographic limits.
 *  - Q4 and Q13 apply § 1.131/§ 1.132 antedating and swearing-behind practice,
 *    which does not survive for AIA applications.
 *  - Q34, Q36, Q45 and Q50 recite pre-AIA § 112 paragraph numbering (first,
 *    fifth, sixth paragraph); the AIA relettered § 112 as (a)-(f).
 *  - Q3 sits under the 37 C.F.R. Part 10 conduct regime, replaced in 2013 by
 *    the Part 11 Rules of Professional Conduct.
 *  - Q30, Q31 and Q40 apply the 1999 appeal rules (37 C.F.R. §§ 1.191, 1.192),
 *    replaced by the Part 41 rules in 2004.
 *  - Q14 and Q32 rest on the "without deceptive intent" showings the AIA
 *    removed from inventorship correction.
 *  - Q5, Q6 and Q47 describe 1999-era petition, fee and disclosure practice:
 *    the MPEP § 708.02 make-special categories were superseded in 2006, the
 *    micro entity did not yet exist, and the Disclosure Document Program was
 *    discontinued in 2007.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR1999_PM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'April 21, 1999',
  session: 'Afternoon (PM)',
  questionsFile: 'edo499pq.pdf',
  answersFile: 'edo499pa.pdf',
  totalDelivered: 50,
  discarded: [] as number[],
  multiKeyed: [] as number[],
  ingested: 50,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_APR1999_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr99-pm-01',
    topicId: 2,
    subtopic: 'Facsimile filing — a CPA gets no certificate-of-transmission benefit',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Registered patent attorneys, Will, Able and Fleet, are partners in their own California law firm specializing in patent law. As luck would have it, a PTO filing deadline falls due for each partner on Friday, February 12, 1999. Having to forego their weekly Friday afternoon discussion of the MPEP, all three partners are scrambling to finish their papers. Will is drafting a Continued Prosecution Application (CPA) under 37 CFR § 1.53(d) which must be filed by Friday, February 12, 1999. Having just received the client’s instructions that morning, Able is replying to a Final Office action dated August 12, 1998, which set a three month shortened statutory period for reply. Fleet, working hard to satisfy a forgetful, new client, is putting the finishing touches on a nonprovisional patent application based on a provisional application his new client had filed on February 12, 1998. Finishing their work at 8:30 p.m. Pacific time, all three partners head to the mailroom. There is only one facsimile machine. With their deadline fast approaching, Will and Able begin to argue about who should use the facsimile machine first to send their papers to the PTO. A complete transmission of Able’s amendment would take fifteen minutes. A complete transmission of Will’s CPA would take ten minutes. Thankful that they had been studying their MPEP, Will and Able come to an agreement. At exactly 8:40 p.m. Pacific time, a first facsimile transmission is sent to the PTO from Will and Able’s firm. Which one of the following choices outlines the best course of action taken by Will and Able so that both Will and Able’s documents received a Friday, February 12, 1999, filing date?',
    options: [
      'Will files his CPA via facsimile at 8:40 p.m. Pacific time with all the necessary papers including a Certificate of Transmission. The CPA is received in the PTO exactly ten minutes later. Able files his amendment via facsimile at 8:50 p.m. Pacific time with all the necessary papers including a Certificate of Transmission which states the date of transmission. Able’s amendment is received in the PTO exactly fifteen minutes after he sent it.',
      'Able files his amendment via facsimile at 8:40 p.m. Pacific time with all the necessary papers including a Certificate of Transmission. The amendment is received in the PTO exactly fifteen minutes later. Will files his CPA via facsimile at 8:55 p.m. Pacific time with all the necessary papers including a Certificate of Transmission which states the date of transmission. Will’s CPA is received in the PTO exactly ten minutes after he sent it.',
      'Will files his CPA via facsimile at 8:40 p.m. Pacific time with all the necessary papers including a Certificate of Transmission. The CPA is received in the PTO exactly ten minutes later. After a quick conference call with his client about the amendment, Able files the amendment via facsimile at 9:10 p.m. Pacific time with all the necessary papers but fails to include a Certificate of Transmission. Able’s CPA is received in the PTO exactly fifteen minutes after he sent it.',
      '(A) and (B).',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. The date of receipt accorded to any correspondence permitted to be sent by facsimile transmission, including a continued prosecution application (CPA) filed under 37 CFR § 1.53(d), is the date the complete transmission is received by an Office facsimile unit. A CPA may be transmitted to the Office by facsimile as specified in 37 CFR § 1.6(d)(3), but cannot receive the benefit of a certificate of transmission as specified in 37 CFR § 1.8(a)(2)(i)(A). (A) provides that Will’s CPA was received in the PTO at 8:50 p.m. Pacific time or 11:50 p.m. Eastern time, i.e. by Friday, February 12, 1999. An amendment can receive the benefit of a certificate of transmission. 37 CFR §§ 1.6(d); 1.8(a). Under 37 CFR § 1.8(a)(1), Able’s amendment is considered timely, even though received by the PTO on Saturday, because transmission via facsimile began on February 12, 1999, prior to expiration of the set period of time, and included a Certificate of Transmission stating the February 12, 1999, date of transmission. 37 CFR §§ 1.6(d); 1.8(a)(1)(i)(B); MPEP § 502.01. (B) is not correct because Will’s CPA was not timely filed: under 37 CFR § 1.8(a)(2) no benefit will be given to a Certificate of Mailing for a CPA and the actual date of receipt controls; in (B) the CPA was received at 12:05 a.m. Eastern time on Saturday and would be accorded a receipt date of Tuesday, February 16, 1999 (Monday, February 15, 1999, is a Federal holiday - President’s Day). (C) is not correct because Able’s amendment was not timely filed under 37 CFR § 1.8(a)(1); it was received at 12:25 Eastern time on Saturday, and “Correspondence for which transmission was completed on a Saturday . . . will be accorded a receipt date of the next succeeding day which is not a . . . Federal holiday within the District of Columbia.” (D) is incorrect because (B) is incorrect. (E) is incorrect because (A) is correct. [Historical practice] — CPA practice under 37 C.F.R. § 1.53(d) was eliminated for utility applications in 2003.',
  },
  {
    id: 'uspto-apr99-pm-02',
    topicId: 2,
    subtopic: 'Express Mail Post Office to Addressee — the only route to a same-day filing date',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Registered patent attorneys, Will, Able and Fleet, are partners in their own California law firm specializing in patent law. A PTO filing deadline falls due for each partner on Friday, February 12, 1999. Fleet, working hard to satisfy a forgetful, new client, is putting the finishing touches on a nonprovisional patent application based on a provisional application his new client had filed on February 12, 1998. At 8:45 p.m. Pacific time that same day, Fleet rushes to the nearest United States Post Office (USPS) down the street to send his nonprovisional patent application with all the necessary papers to the PTO. What is the best action for Fleet to take to receive a Friday, February 12, 1999, filing date?',
    options: [
      'Send the application with a Certificate of Mailing via first class mail no later than 11:59 p.m. Pacific time on Friday.',
      'Deposit the application directly with an employee of the U.S. Postal Service by “Express Mail Post Office to Post Office” at 8:59 p.m. Pacific time.',
      'Deposit the application directly with an employee of the U.S. Postal Service by “Express Mail Post Office to Addressee” no later than 11:59 p.m. Pacific time.',
      'Send the application via “Federal Express” before 11:59 p.m. Pacific time.',
      '(B) and (C).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 513 [p. 500-46]. (A) is incorrect. 37 CFR § 1.8(a)(2)(i)(A). The filing date in (A) would be the day the application is received in the PTO. (B) is incorrect because “Express Mail” must be sent by “Express Mail Post Office to Addressee” and not “Express Mail Post Office to Post Office.” MPEP § 502 (“Express Mail” Service at p. 500-7). (D) is incorrect. MPEP § 512 (“Office Procedure. A” at p. 500-43). (E) is incorrect because (B) is incorrect.',
  },
  {
    id: 'uspto-apr99-pm-03',
    topicId: 2,
    subtopic: '§ 10.18(b) certification eliminated the separate verification requirement',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In addition to complying with 37 CFR § 1.4(d)(2), which of the following documents, if any, must also contain a separate verification statement?',
    options: [
      'Small entity statements.',
      'An English translation of a non-English-language document.',
      'A claim for foreign priority.',
      'Petition to make an application special.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) “None of the above” is the correct answer. As noted in MPEP § 410, the first certification requirement set forth in 37 CFR § 10.18(b) “has permitted the PTO to eliminate the separate verification requirement previously contained in 37 CFR . . . 1.27 [small entity statements], . . . 1.52 [English translations of non-English documents], 1.55 [Claim for foreign priority], . . . 1.102 [Petition to make an application special], . . . .” [Historical practice] — the 37 C.F.R. Part 10 conduct rules were replaced in 2013 by the Part 11 Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr99-pm-04',
    topicId: 0,
    subtopic: 'Overcoming § 102(e) — foreign priority reaches only the claims the foreign application supports',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In early 1997, Goforgold, a company based in Australia, developed a widget with increased reflective properties. Goforgold filed a patent application in the Australian Patent Office on January 8, 1997, and filed a corresponding application in the USPTO on January 5, 1998. All research activities for the inventions disclosed and claimed in the U.S. and Australian applications took place in Australia. The U.S. patent application contains five claims: 1. A widget comprising elements A and B. 2. A widget according to Claim 1 wherein the widget further includes element D. 3. A widget comprising elements A and C. 4. A widget according to Claim 3 wherein the widget further includes element E. 5. A widget comprising elements A, B, and C. The Australian application only supports claims 1, 2, and 5 of the U.S. application. During the course of prosecution of the U.S. application, the examiner properly rejected all of the claims under 35 U.S.C. § 102(e) as being anticipated by a U.S. patent assigned to Gotthesilver. The Gotthesilver patent was granted on October 6, 1998, on a U.S. application filed on June 15, 1997. The Gotthesilver patent specifically describes, but does not claim, the widget in claims 1-5 of the U.S. application filed by Goforgold. The subject matter of the Gotthesilver patent was reduced to practice in Flushing, New York as of February 12, 1997. Which of the following proposed arguments or actions would properly overcome the examiner’s § 102(e) rejection with respect to all the claims?',
    options: [
      'File an affidavit under 37 CFR § 1.132 swearing behind the claims of the Gotthesilver patent by relying on the 1997 research activities of Goforgold in Australia.',
      'File a claim for a right of priority based on the application filed in Australia along with a certified copy of the Australian patent application and canceling Claims 3 and 4.',
      'File a claim for a right of priority based on the application filed in Australia along with a certified copy of the Australian patent application.',
      'File an affidavit under 37 CFR § 1.132 swearing behind the February 12, 1997, reduction to practice date of the Gotthesilver patent.',
      'File a terminal disclaimer.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP §§ 706.02(b); 2136.05. (A) and (D) are incorrect because an affidavit under 37 CFR § 1.132 is inappropriate in this situation. MPEP § 715.01. (C) will not result in overcoming the rejection of claims 3 and 4 inasmuch as the disclosure of the Australian patent application only supported claims 1, 2, and 5. (E) is not correct because a terminal disclaimer will not overcome a 35 U.S.C. § 102(e) rejection. MPEP § 2136.05 [p. 2100-87]. [Pre-AIA] — § 102(e) and the swearing-behind practice it invites do not survive under the AIA.',
  },
  {
    id: 'uspto-apr99-pm-05',
    topicId: 3,
    subtopic: 'Petition to make special — the biotechnology small-entity petition requires a fee',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In which of the following situations would a petition to make special not be granted?',
    options: [
      'The applicant files a petition with the petition fee requesting special status and stating that small entity status has been established; that the subject of the biotechnology patent application is a major asset of the small entity; and that the development of the technology will be significantly impaired if examination of the application is delayed, including an explanation of the basis for making the statement.',
      'Applicant’s invention materially enhances the quality of the environment. Applicant files a petition that the application be accorded special status and includes a statement explaining how the invention contributes to the restoration of a basic life-sustaining element. No fee is included.',
      'Applicants have filed a request that their application which is directed to an invention for a superconductive material be accorded special status. Applicants’ request is accompanied by a statement that the invention involves superconductivity. No fee is included.',
      'Applicant’s invention is directed to a system for detecting explosives. Applicant files a petition for special status which is accompanied by a statement explaining how the invention contributes to countering terrorism. No fee is included.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because a fee is required, but is not included with the petition. 37 CFR § 1.102(c) and (d); MPEP § 708.02 [pp. 700-72-73]. (A), (B), and (C) are incorrect because they conform to 37 CFR § 102. (E) is incorrect because (D) is correct. [Historical practice] — the MPEP § 708.02 make-special categories described here were superseded by the 2006 accelerated examination program.',
  },
  {
    id: 'uspto-apr99-pm-06',
    topicId: 2,
    subtopic: 'Small entity fee reductions — filing, extension of time and issue fees',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following fees are reduced for small entities? I. Patent application filing fees II. Petition for an extension of time fees III. Petition to suspend the rules fees IV. Patent Issue fees V. Certificate of Correction fees',
    options: [
      'I, II, III, IV, and V.',
      'I, IV, and V.',
      'I, II, and IV.',
      'I and IV.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 41(h); 37 CFR §§ 1.17(h); 1.20(a); MPEP § 509.02. (A), (B), and (D) are incorrect because there is no reduced fee for small entities for III or IV. MPEP § 509.02. (E) is incorrect because (C) is correct. [Historical practice] — this is the 1999 fee schedule; the micro entity discount did not exist until 2013. The published answer’s phrase “III or IV” is reproduced as printed even though the keyed answer (C) includes IV.',
  },
  {
    id: 'uspto-apr99-pm-07',
    topicId: 4,
    subtopic: 'National-stage patent — the § 102(e) date is when § 371(c)(1), (2) and (4) were met',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered patent agent with an office in Buffalo, New York. On January 13, 1998, Murphy, a resident of Canada, came to your office for purpose of obtaining a U.S. patent on her invention. She tells you that she first conceived her invention at her home in Ontario on December 18, 1996, and that she reduced it to practice on January 10, 1997, at her home. On January 13, 1998, Murphy provided you with a detailed written description fully disclosing her invention. You diligently proceeded to prepare the application. You filed the application in the PTO on February 12, 1998. Consider the situation presented in the question below in light of the facts presented above and determine which paragraph of 35 U.S.C. § 102, if any, would prevent Murphy from obtaining a U.S. patent. Murphy’s invention is described and claimed in a U.S. patent to O’Malley granted on February 9, 1999, on a national stage application filed in the United States on February 17, 1998, based on a PCT international application filed in France on November 13, 1997. O’Malley satisfied the requirements of 35 U.S.C. § 371(c)(1), (2), and (4) on February 17, 1998.',
    options: [
      '35 U.S.C. § 102(b).',
      '35 U.S.C. § 102(c).',
      '35 U.S.C. § 102(e).',
      '35 U.S.C. § 102(f).',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. “Once a patent issues from a national stage application, the filing date for prior art purposes under 35 U.S.C. § 102(e) is not the international filing date, but is the date on which the requirements of 35 U.S.C. § 371(c)(1), (2) and (4) were met. . . . ” MPEP §§ 1895.01, subsection E. [p. 1800-130]; 2136.03, subsection II. The effective filing date of O’Malley’s patent, therefore, is February 17, 1998 - which is after Murphy’s U.S. filing date of February 12, 1998. The O’Malley patent is not prior art under 35 U.S.C. § 102(e). (A), (B), (C) and (D) are incorrect. 35 U.S.C. §§ 102(b), (c), (e) and (f). [Pre-AIA] — the AIA rewrote § 102 and gave national-stage applications their international filing date for prior-art purposes.',
  },
  {
    id: 'uspto-apr99-pm-08',
    topicId: 0,
    subtopic: '§ 102(d) — foreign patent granted before the U.S. filing on an application over 12 months old',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered patent agent with an office in Buffalo, New York. On January 13, 1998, Murphy, a resident of Canada, came to your office for purpose of obtaining a U.S. patent on her invention. She tells you that she first conceived her invention at her home in Ontario on December 18, 1996, and that she reduced it to practice on January 10, 1997, at her home. On January 13, 1998, Murphy provided you with a detailed written description fully disclosing her invention. You diligently proceeded to prepare the application. You filed the application in the PTO on February 12, 1998. Consider the situation presented in the question below in light of the facts presented above and determine which paragraph of 35 U.S.C. § 102, if any, would prevent Murphy from obtaining a U.S. patent. Murphy patented her invention in Canada on December 30, 1997 on a Canadian patent application filed on February 10, 1997.',
    options: [
      '35 U.S.C. § 102(a).',
      '35 U.S.C. § 102(b).',
      '35 U.S.C. § 102(d).',
      '35 U.S.C. § 102(e).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. The filing date in Canada is more than 12 months before the U.S. filing date for the same invention and the invention was patented in Canada before the U.S. filing date. MPEP § 2135; 2135.01. (A), (B), and (D) are incorrect. 35 U.S.C. §§ 102(a), (b) and (e). (E) is incorrect because (C) is correct. [Pre-AIA] — § 102(d) was repealed by the AIA.',
  },
  {
    id: 'uspto-apr99-pm-09',
    topicId: 0,
    subtopic: '§ 102(b) on-sale bar does not reach sales outside the United States',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered patent agent with an office in Buffalo, New York. On January 13, 1998, Murphy, a resident of Canada, came to your office for purpose of obtaining a U.S. patent on her invention. She tells you that she first conceived her invention at her home in Ontario on December 18, 1996, and that she reduced it to practice on January 10, 1997, at her home. On January 13, 1998, Murphy provided you with a detailed written description fully disclosing her invention. You diligently proceeded to prepare the application. You filed the application in the PTO on February 12, 1998. Consider the situation presented in the question below in light of the facts presented above and determine which paragraph of 35 U.S.C. § 102, if any, would prevent Murphy from obtaining a U.S. patent. In January of 1997, Murphy sold prototypes of her invention in Canada.',
    options: [
      '35 U.S.C. § 102(a).',
      '35 U.S.C. § 102(b).',
      '35 U.S.C. § 102(f).',
      '35 U.S.C. § 102(g).',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) “None of the above” is the correct answer. There is no statutory bar because the sales did not take place in the United States. MPEP § 2133.03(d). (A), (B), (C), and (D) are incorrect because the requirements of 35 U.S.C. §§ 102(a), (b), (f), and (g) were not satisfied. [Pre-AIA] — the AIA removed the geographic limit on the on-sale and public-use bars.',
  },
  {
    id: 'uspto-apr99-pm-10',
    topicId: 0,
    subtopic: '§ 102(f) — the applicant did not invent the subject matter sought to be patented',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered patent agent with an office in Buffalo, New York. On January 13, 1998, Murphy, a resident of Canada, came to your office for purpose of obtaining a U.S. patent on her invention. She tells you that she first conceived her invention at her home in Ontario on December 18, 1996, and that she reduced it to practice on January 10, 1997, at her home. On January 13, 1998, Murphy provided you with a detailed written description fully disclosing her invention. You diligently proceeded to prepare the application. You filed the application in the PTO on February 12, 1998. Consider the situation presented in the question below in light of the facts presented above and determine which paragraph of 35 U.S.C. § 102, if any, would prevent Murphy from obtaining a U.S. patent. After the application was filed in the U.S., Murphy admitted that in order to make the claimed invention operative, the mechanic who built the prototype of Murphy’s invention added a novel feature without consulting Murphy which is included in all the claims of the application.',
    options: [
      '35 U.S.C. § 102(a).',
      '35 U.S.C. § 102(b).',
      '35 U.S.C. § 102(f).',
      '35 U.S.C. § 102(g).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. Murphy did not invent the subject matter sought to be patented. MPEP § 2137; 2137.01. (A), (B), and (D) are incorrect. 35 U.S.C. §§ 102(a), (b) and (g). (E) is incorrect because (C) is correct. [Pre-AIA] — § 102(f) was replaced by the AIA derivation provisions.',
  },
  {
    id: 'uspto-apr99-pm-11',
    topicId: 0,
    subtopic: 'A German Gebrauchsmuster petty patent is usable in a § 102(d) rejection',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] You are a registered patent agent with an office in Buffalo, New York. On January 13, 1998, Murphy, a resident of Canada, came to your office for purpose of obtaining a U.S. patent on her invention. She tells you that she first conceived her invention at her home in Ontario on December 18, 1996, and that she reduced it to practice on January 10, 1997, at her home. On January 13, 1998, Murphy provided you with a detailed written description fully disclosing her invention. You diligently proceeded to prepare the application. You filed the application in the PTO on February 12, 1998. Consider the situation presented in the question below in light of the facts presented above and determine which paragraph of 35 U.S.C. § 102, if any, would prevent Murphy from obtaining a U.S. patent. Murphy’s invention is described and claimed in a German Gebrauchsmuster petty patent granted on February 11, 1998, based on an application filed by Murphy on February 2, 1997. The German Gebrauchsmuster patent was published on February 14, 1998.',
    options: [
      '35 U.S.C. § 102(b).',
      '35 U.S.C. § 102(c).',
      '35 U.S.C. § 102(d).',
      '35 U.S.C. § 102(e).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. A German Gebrauchmuster petty patent is usable in a 35 U.S.C. § 102(d) rejection. MPEP § 2135.01, subsection III. [p. 2100-81]. The foreign patent was granted prior to Murphy’s U.S. filing date. MPEP § 2135.01, subsection III, (E). Thus, Murphy’s German application was filed more than 12 months prior to her U.S. filing date for the same invention and was granted before the U.S. filing date. (A), (B), and (D) are incorrect. 35 U.S.C. §§ 102(b), (c), and (e). (E) is incorrect because (C) is correct. [Pre-AIA] — § 102(d) was repealed by the AIA.',
  },
  {
    id: 'uspto-apr99-pm-12',
    topicId: 2,
    subtopic: 'Secrecy Orders — no notice to the foreign recipient, and no facsimile correspondence',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements, if any, regarding Secrecy Orders are false?',
    options: [
      'A Secrecy Order remains in effect for a period of one year from its date of issuance.',
      'If the Secrecy Order is applied to an international application, the application will not be forwarded to the International Bureau as long as the Secrecy Order remains in effect.',
      'If, prior to or after the issuance of the Secrecy Order, any significant part of the subject matter or material information relevant to the application has been or is revealed to any person in a foreign country, the principals must promptly inform such person of the Secrecy Order and the penalties for improper disclosure.',
      'Use of facsimile transmissions to file correspondence in a Secrecy Order case is permitted so long as it is transmitted to the Office in a manner that would preclude disclosure to unauthorized individuals and is properly addressed.',
      '(C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. Both (C) and (D) are false statements. MPEP § 120 [p. 100-15] states that “if such part of the subject matter was or is disclosed to any person in a foreign country . . . , the principals must not inform such person of the Secrecy Order, but instead must promptly furnish to the Assistant Commissioner . . . the following information . . . .” (D) is also a false statement. “Use of facsimile transmission is not permitted. 37 CFR 1.6(d)(6)” MPEP § 120 (“Correspondence”). (A) and (B) are true statements. MPEP §§ 120; 130. [Historical practice] — the Assistant Commissioner titles and the facsimile-correspondence rules recited here have since been superseded.',
  },
  {
    id: 'uspto-apr99-pm-13',
    topicId: 0,
    subtopic: '§ 1.131 antedating and claim amendment both overcome §§ 102(a)/(e); foreign priority does not',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On January 19, 1999, inventor B filed a patent application in the PTO claiming invention X. Inventor B did not claim priority based on a foreign application filed by inventor B on April 3, 1998, in the Patent Office in Japan. In the foreign application, inventor B disclosed and claimed invention X, which inventor B had conceived on August 11, 1997, and reduced to practice on November 5, 1997, all in Japan. The U.S. patent examiner issued an Office action where all the claims in the patent application were properly rejected under 35 U.S.C. § 102(a) and (e) as being anticipated by a U.S. patent granted to inventor Z on September 1, 1998, on a patent application filed in the PTO on December 5, 1997. There is no common assignee between Z and B, and they are not obligated to assign their invention to a common assignee. Moreover, inventors Z and B, independently of each other, invented invention X, and did not derive anything from the other. The U.S. patent to Z discloses, but does not claim, invention X. Which of the following is/are appropriate reply(replies) which could overcome the rejections under §§ 102(a) and (e) when timely filed?',
    options: [
      'File an antedating affidavit or declaration under 37 CFR § 1.131 showing conception on August 11, 1997, and actual reduction to practice on November 5, 1997, all in Japan.',
      'File a claim for the right and benefit of foreign priority wherein the Japanese application is correctly identified, file a certified copy of the original Japanese patent application, and argue that as a result of the benefit of foreign priority, the U.S patent is no longer available as a prior art reference against the claims.',
      'Amend the claims to require particular limitations disclosed in inventor B’s application, but not disclosed or suggested in inventor Z’s patent, and argue that the limitations patentably distinguish the claimed invention over the prior art.',
      '(A) and (C).',
      '(B) and (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer because it includes both (A) and (C). Following the procedure in (A) is in accord with 37 CFR § 1.131 and MPEP § 715.07(c). By following the procedure in (C), the claims are no longer anticipated by Z’s patent because particular limitations are now claimed in inventor B’s application which are not disclosed or suggested by inventor Z’s patent. 35 U.S.C. § 102 (a) and (e); MPEP § 2131. (B) is not correct. 37 CFR § 1.131; MPEP §§ 201.15; 715.07(c); 2132.01; 2136; and 2136.05. [Pre-AIA] — §§ 102(a)/(e) and § 1.131 antedating do not survive under the AIA.',
  },
  {
    id: 'uspto-apr99-pm-14',
    topicId: 5,
    subtopic: 'Certificate of Correction cannot add an omitted embodiment that changes claim scope',
    difficulty: 2,
    question: '[OFFICIAL USPTO EXAM, Apr 1999] A Certificate of Correction cannot be used to correct:',
    options: [
      'the failure to make reference to a prior copending application.',
      'an incorrect reference to a prior copending application.',
      'the omission of an inventor’s name from an issued patent through error and without deceptive intent.',
      'the omission of a preferred embodiment in the original disclosure overlooked by the inventor which would materially affect the scope of the patent.',
      '(A), (B), and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer because such a mistake could affect the scope and meaning of the patent and is not considered to be of the “minor” character required for the issuance of a Certificate of Correction. MPEP § 1481. (A) and (B) can be corrected by a Certificate of Correction. MPEP § 1481 [p. 1400-47]. (C) can also be corrected by a Certificate of Correction. 37 CFR § 1.324; MPEP § 1481 [p. 1400-44]. [Historical practice] — the AIA removed the “without deceptive intent” showing recited in option (C).',
  },
  {
    id: 'uspto-apr99-pm-15',
    topicId: 3,
    subtopic: 'Comments on the examiner’s reasons for allowance are optional, not required',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In responding to a final rejection of Claims 1 to 5 as being obvious, applicant’s patent agent argued that the references applied in the rejection neither taught nor suggested the claimed invention. The examiner issued a Notice of Allowance which included a statement of reasons for allowance. In the statement, the examiner explained her reasons for allowance of the claims. Upon receipt of the statement from the examiner, which of the following, if any, describes the most appropriate course of action the agent may take in reply to the examiner’s reasons for allowance?',
    options: [
      'The agent may file a reply commenting on the examiner’s statement, even though the failure to do so will not give rise to any implication that applicant agrees with or acquiesces in the examiner’s reasoning.',
      'The agent should object to the examiner’s statement to avoid any implication that applicant agrees with or acquiesces in the examiner’s reasoning.',
      'Applicant may file comments on the reasons for allowance after payment of the issue fee upon submission of a petition for an extension of time.',
      'Under current Office policy and procedure, the agent cannot reply to the examiner’s statement.',
      'The agent must file a timely reply to the examiner’s statement to enable the examiner to reply to the comments submitted by applicant and to minimize processing delays.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR § 1.104(e); MPEP § 1302.14. (B) is incorrect. As set forth in 37 CFR § 1.104(e), “[f]ailure to file such a statement does not give rise to any implication that the applicant or patent owner agrees with or acquiesces in the reasoning of the examiner.” (C) and (D) are incorrect. Comments are allowed and must be submitted no later than the payment of the issue fee. MPEP § 1302.14. (E) is incorrect. “[C]omments made by applicants on the examiner’s statement of reasons for allowance will not be returned to the examiner after their entry in the file and will not be commented on by the examiner.” MPEP § 1302.14 [p. 1300-11].',
  },
  {
    id: 'uspto-apr99-pm-16',
    topicId: 6,
    subtopic: 'Plant patent applications — one claim, asexual reproduction averment, no method claims',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements regarding plant patent applications is (are) true?',
    options: [
      'Only one claim is necessary and only one claim is permitted.',
      'The oath or declaration required of the applicant, in addition to the averments required by 37 CFR § 1.63, must state that he or she has asexually reproduced the plant.',
      'A method claim in a plant patent application is improper.',
      'Specimens of the plant variety, its flower or fruit, should not be submitted unless specifically called for by the examiner.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR § 1.162; MPEP §§ 1604; 1605; and 1607.',
  },
  {
    id: 'uspto-apr99-pm-17',
    topicId: 3,
    subtopic: 'A complete reply must be timely and must specifically address the rejection',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] The last day of a three month shortened statutory period to reply to a non-final rejection occurs today, April 21, 1999. Your client is overseas and sends you a facsimile asking you to cancel all of the current claims in the application. There is no deposit account. She further advises you that a new set of claims to replace the current claims will be sent to you no later than April 29, 1999. Which of the following would be the most appropriate course of action to take with regard to the outstanding Office action?',
    options: [
      'File a request for a one month extension of time today and pay the fee when you file the amendment.',
      'File an amendment today canceling all claims in accordance with your client’s instructions.',
      'Await receipt of the new claims and then file the amendment and request for reconsideration with the appropriate fee for an extension of time, no more than 6 months from the date of the non-final rejection.',
      'File a request for reconsideration today and state that a supplemental amendment will be forthcoming.',
      'File a request for reconsideration today, stating that the rejection is in error because the claims define a patentable invention.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR § 1.111; MPEP § 714.02. (A) is incorrect because the fee must be paid when the request for an extension of time is made. 37 CFR § 1.136(a); MPEP § 710.02(e). (B) is not correct. MPEP §§ 714.19(A); 711.01. An amendment canceling all claims is non-responsive to the Office action. As set forth in 37 CFR § 1.111(b), “In order to be entitled to reconsideration . . ., the applicant . . . must reply to the Office action. The reply . . . must be reduced to a writing which distinctly and specifically points out the supposed errors in the examiner’s action and must reply to every ground of objection and rejection in the prior Office action.” (D) is not correct and does not comply with 37 CFR § 1.111(b). (E) is incorrect. As set forth in 37 CFR § 1.111(b), “A general allegation that the claims define a patentable invention without specifically pointing out how the language of the claims patentably distinguishes them from the references does not comply with the requirements of this section.”',
  },
  {
    id: 'uspto-apr99-pm-18',
    topicId: 1,
    subtopic: 'Product-by-process claims — a lesser burden of proof for prima facie obviousness',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements is true respecting product-by-process claims?',
    options: [
      'A lesser burden of proof may be required to make out a case of prima facie obviousness for product-by-process claims than is required to make out a prima facie case of obviousness when a product is claimed in the conventional fashion.',
      'It is proper to use product-by-process claims only when the process is patentable.',
      'It is proper to use product-by-process claims only when the product is incapable of description in the conventional fashion.',
      'Product-by-process claims cannot vary in scope from each other.',
      'Product-by-process claims may only be used in chemical cases.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 2113 citing In re Fessmann, 489 F.2d 742, 744, 180 USPQ 324, 326 (CCPA 1974). (B) is incorrect inasmuch as “determination of patentability is based on the product itself. The patentability of a product does not depend on its method of production. If the product in the product-by-process claim is the same as or obvious from a product of the prior art, the claim is unpatentable even though the prior art product was made by a different process.” MPEP § 2113 [p. 2100-51]. (C) and (D) are incorrect because “[t]he fact that it is necessary for an applicant to describe his product in product-by-process terms does not prevent him from presenting claims of varying scope.” MPEP § 2173.05(p), item (I). (E) is incorrect. “A claim to a device, apparatus, manufacture, or composition of matter may contain a reference to the process in which it is intended to be used . . . so long as it is clear that the claim is directed to the product and not the process.” MPEP § 2173.05(p), item (I) [p. 2100-174].',
  },
  {
    id: 'uspto-apr99-pm-19',
    topicId: 0,
    subtopic: 'Obviousness — the prior art need not suggest the applicant’s newly discovered advantage',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Patent applicant Smith claims “a rotary vane pump having impellers coated with ceramic X for the purpose of preventing cavitation of the impellers.” The examiner rejected the claim under 35 U.S.C. § 103 as being unpatentable over a patent to John in view of a patent to Alex. John teaches a rotary vane pump having impellers coated with epoxy resin for the purpose of preventing corrosion of the impellers. Alex teaches a mixing device having agitator blades coated with ceramic X for the purpose of preventing corrosion of the blades. Alex also suggests that the ceramic X coating material “is useful on various types of pumps for the purpose of preventing corrosion.” The examiner determined that (i) it would have been obvious to one having ordinary skill in the art to substitute the ceramic X coating material taught by Alex for the epoxy resin coating material in John and (ii) the resultant rotary vane pump would have coated impeller blades which would inherently prevent cavitation. The combination of John and Alex:',
    options: [
      'cannot support a prima facie case for obviousness unless the Alex reference contains a suggestion that ceramic X will cause cavitation.',
      'cannot support a prima facie case for obviousness inasmuch as the discovery that ceramic X prevents cavitation imparts patentability to a known composition.',
      'may support a prima facie case for obviousness even though the Alex reference does not disclose that ceramic X will prevent cavitation or can be used on the impellers of a rotary vane pump.',
      'cannot shift the burden of proof to the applicant to show that the prior invention lacked the newly discovered property asserted for the claimed invention unless one of the references discloses the property.',
      'can support a prima facie case for obviousness only if both references show or suggest that ceramic X can be used in a rotary vane pump.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 103; MPEP §§ 2143; 2144; 2145; In re Dillon, 919 F.2d 688, 16 USPQ2d 1897 (Fed. Cir. 1990). The motivation to modify the reference may suggest what the applicant has done, but for a different purpose. As discussed in MPEP § 2144 [p. 2100-115], “[i]t is not necessary that the prior art suggest the combination to achieve the same advantage . . . [citations omitted]” (A), (B), (D) and (E) are in correct because they are inconsistent with MPEP §§ 2143, 2144, and 2145, as well as In re Dillon, supra.',
  },
  {
    id: 'uspto-apr99-pm-20',
    topicId: 1,
    subtopic: 'Fee calculation — a multiple dependent claim counts as the number of claims it refers to',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Claim 1 is independent. Claim 2 depends from Claim 1. Claim 3 depends from Claim 2. Claim 4 depends from Claims 2 or 3. Claim 5 depends from Claim 3. Claim 6 depends from Claims 2, 3 or 5. The application contains one independent claim. How many dependent claims are there for fee calculation purposes?',
    options: ['5', '7', '8', '9', '11'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 41(a). For fee calculation purposes, MPEP § 608.01(n), subsection G.2.(a) provides that “claims in proper multiple dependent form may not be considered as single dependent claims for the purpose of calculating fees. Thus, a multiple dependent claim is considered to be that number of dependent claims to which it refers. Any proper claim depending directly or indirectly from a multiple dependent claim is also considered as the number of dependent claims as referred to in the multiple dependent claim from which it depends.”',
  },
  {
    id: 'uspto-apr99-pm-21',
    topicId: 3,
    subtopic: '§ 1.97(c) IDS — a statement OR the § 1.17(p) fee, not both',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Registered patent practitioner P prepares and files a patent application for his Japanese client, XYZ Corp., on October 5, 1998. The application claims a banana peeler device. A Notice to File Missing Parts dated December 7, 1998, is received by P on December 10, 1998. P submits an executed oath, along with the surcharge, in order to fully reply to the Notice to File Missing Parts which is received by the PTO on December 23, 1998. In the first Office action dated January 6, 1999, the examiner rejects all of claims 1-5 as being anticipated by the disclosure of a U.S. patent to Apple. The Apple patent discloses, but does not claim, a banana peeler. The Apple patent issued October 7, 1997, and is based on an application filed on June 26, 1996. On January 20, 1999, P faxes a copy of the Office action and the Apple patent to his client in Japan. There is no common ownership between the prior art patent and XYZ’s patent application. On March 20, 1999, XYZ faxed instructions to P which distinguish the claims from the Apple patent and includes a reference to a U.S. patent to Zucchini. XYZ discovered the Zucchini patent in February 1999. The Zucchini patent issued on January 12, 1993, and contradicts the teachings of the Apple patent. On March 20, 1999, XYZ instructs P to file an Information Disclosure Statement (IDS) which includes the Zucchini patent, ten Japanese patents, and a November 13, 1998, magazine article. The magazine article and the ten patents were received from the Japanese Patent Office in XYZ’s counterpart foreign application on February 1, 1999. Which of the following actions, if any, taken by P would best comply with PTO practice and procedure?',
    options: [
      'File a properly drafted IDS via “Express Mail” in accord with 37 CFR § 1.10 on March 30, 1999, with the fee set forth in 37 CFR § 1.17(p).',
      'File a properly drafted IDS via first class mail with a Certificate of Mailing dated March 30, 1999, with the required fee and a statement that each item of information was cited in a communication from a foreign patent office in a counterpart foreign application not more than three months prior to the filing of the IDS.',
      'File a properly drafted IDS via facsimile with a Certificate of Transmission on March 23, 1999, along with a legible copy of each reference.',
      '(B) and (C).',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR § 1.97(c); MPEP § 609. An IDS filed pursuant to 37 CFR § 1.97(c) will be considered provided that the IDS is accompanied by either (1) a statement as specified in 37 CFR § 1.97(e); or (2) the fee set forth in 37 CFR § 1.17(p). The filing date of the XYZ patent application is October 5, 1998. The omission of the oath from the XYZ application did not affect the filing date of the XYZ application. 37 CFR § 1.53(b); MPEP § 601.01(a). (B) is not correct because the Zucchini patent was not cited by the Japanese Patent Office. The Zucchini patent was discovered by XYZ. Also, under 37 CFR § 1.97(c), XYZ was not required to submit both a fee and a statement. (C) is not correct because it did not include either the statement or fee required by 37 CFR § 1.97(c). (D) is not correct because (B) and (C) are incorrect. (E) is not correct because (A) is correct.',
  },
  {
    id: 'uspto-apr99-pm-22',
    topicId: 0,
    subtopic: '§ 102(a) — a patent issued before the application’s filing date',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Registered patent practitioner P prepares and files a patent application for his Japanese client, XYZ Corp., on October 5, 1998. The application claims a banana peeler device. In the first Office action dated January 6, 1999, the examiner rejects all of claims 1-5 as being anticipated by the disclosure of a U.S. patent to Apple. The Apple patent discloses, but does not claim, a banana peeler. The Apple patent issued October 7, 1997, and is based on an application filed on June 26, 1996. There is no common ownership between the prior art patent and XYZ’s patent application. Which of the following most correctly sets forth the sections of Title 35 U.S.C. under which XYZ would not be entitled to a U.S. patent based on the Apple patent?',
    options: ['102(a)', '102(c)', '102(d)', '102(f)', '102(g)'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. The invention was disclosed in a patent by Apple which issued on October 7, 1997, which is prior to the U.S. patent application by XYZ filed October 5, 1998. 35 U.S.C. § 102(a); MPEP § 2132. [Pre-AIA] — the AIA rewrote § 102 entirely.',
  },
  {
    id: 'uspto-apr99-pm-23',
    topicId: 3,
    subtopic: 'Reply to a rejection, objection and requirement — request reconsideration and reply fully',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In a first action on the merits dated February 12, 1997, the examiner (1) rejected all of the claims under 35 U.S.C. § 112, second paragraph; (2) objected to new matter added to the specification by a preliminary amendment; and (3) required a substitute specification that includes a revised summary of invention, abstract, and an additional drawing showing the prior art. You, as a patent practitioner prosecuting the application, disagree with the propriety of the rejection, objection and requirement. Which of the following would be the most appropriate course of action to take to reply to the examiner’s action?',
    options: [
      'File a petition with the Group Director requesting withdrawal of the examiner’s objection to the specification, and suspension of further action on the claims until three months after the petition has been decided.',
      'File a request for reconsideration and present arguments distinctly and specifically pointing out the supposed errors in the examiner’s requirement, rejection, and objection, and otherwise fully reply to the rejection and objection.',
      'Appeal the objection and requirement of the examiner to the Board of Patent Appeals and Interferences, and request that the final rejection of the claims be suspended until the appeal is decided.',
      'Amend the claims to overcome the examiner’s rejection under 35 U.S.C § 112, and file a motion to the Board of Patent Appeals and Interferences appealing the examiner’s objection to the specification.',
      'Change the summary of invention to conform to the broadest claim, request reconsideration of the requirement for a substitute specification, request that the requirement for submission of the additional drawings be held in abeyance until after allowance of the application, and generally allege that the claims define a patentable invention.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR §§ 1.111(b); 1.191(a); and 10.18; MPEP §§ 706.01; 714.02. (A), (C), (D), and (E) are incorrect because they do not constitute a reply and request for reconsideration in accordance with 37 CFR § 1.111.',
  },
  {
    id: 'uspto-apr99-pm-24',
    topicId: 4,
    subtopic: 'PCT papers are excluded from the § 1.8 certificate procedures; the Demand may be faxed',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements correctly sets forth the manner in which Inventor Ann, a U.S. citizen, may file documents regarding her international patent application with the United States Receiving Office?',
    options: [
      'Where the document is the PCT international application and Ann needs to receive an April 1, 1999, filing date, Ann should file her PCT international application via first class mail with the United States Post Office and include a Certificate of Mailing dated April 1, 1999.',
      'Where the document is a Demand for international preliminary examination, two weeks before the deadline, Ann should file her Demand by facsimile transmission with a dated Certificate of Transmission.',
      'Where the document is the PCT international application and Ann needs to receive an April 12, 1999, filing date, Ann should file a copy of her international application via facsimile transmission with a Certificate of Transmission dated April 12, 1999.',
      'Where the documents are substituted drawing sheets due on April 15, 1999, Ann should file her substitute drawing sheets via facsimile on April 15, 1999.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. MPEP §§ 1805; 1834.01. (A), (C), (D) and (E) are incorrect. MPEP § 1805. PCT international applications and papers relating to the applications are specifically excluded from the Certificate of Mailing or Transmission procedures of 37 CFR § 1.8. Also, facsimile may not be used to file applications or drawings for PCT applications. MPEP § 1805.',
  },
  {
    id: 'uspto-apr99-pm-25',
    topicId: 1,
    subtopic: 'A multiple dependent claim incorporates all limitations of the claims it refers to',
    difficulty: 2,
    question: '[OFFICIAL USPTO EXAM, Apr 1999] A multiple dependent claim __________',
    options: [
      'may indirectly serve as a basis for another multiple dependent claim.',
      'may directly serve as a basis for a multiple dependent claim.',
      'shall be construed to incorporate by reference all the limitations of each of the particular claims to which it refers.',
      'added by amendment should not be entered until the proper fee has been received by the PTO.',
      '(C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer because both (C) and (D) are correct. 37 CFR § 1.75(c); MPEP § 608.01(n) [pp. 600-66-67]. (A) and (B) are not correct. MPEP § 608.01(n) (“[A] multiple dependent claim may not serve as a basis for any other multiple dependent claim, either directly or indirectly.”).',
  },
  {
    id: 'uspto-apr99-pm-26',
    topicId: 6,
    subtopic: 'There is no maintenance fee for a design patent',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A design patent application was filed on July 5, 1995, which issued as a design patent on December 3, 1996. On December 16, 1996, a proper reissue design application was filed. The reissue patent was granted on September 2, 1997. When will the first maintenance fee be due?',
    options: [
      'December 2, 2000',
      'December 16, 1999',
      'December 3, 1999',
      'March 3, 2000',
      'None of the above',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. There is no maintenance fee for a design patent. 35 U.S.C. § 41(b); 37 CFR §§ 1.362(b); 1.362(c)(4); and MPEP § 2504.',
  },
  {
    id: 'uspto-apr99-pm-27',
    topicId: 3,
    subtopic: 'A substantial duplicate claim is not “independent and distinct” for a divisional',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] After one of your client’s claims has been allowed, another claim in the same application stands objected to as being a substantial duplicate of the allowed claim, i.e. they both cover the same thing. You and your client agree that the claim is a substantial duplicate. Which of the following could NOT overcome the objection?',
    options: [
      'Amending the claim objected to in a manner consistent with the specification to have a different scope.',
      'Amending the allowed claim consistent with the specification to have a different scope.',
      'Canceling the allowed claim to obviate the objection.',
      'Filing a divisional application that includes the objected claim.',
      'Canceling the claim objected to so as to permit issuance of the allowed claim.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 121. MPEP § 706.03(k) reads “when two claims in an application are duplicates, or else are so close in content that they both cover the same thing, despite a slight difference in wording, it is proper after allowing one claim to object to the other claim under 37 CFR 1.75 as being a substantial duplicate of the allowed claim.” 35 U.S.C. § 121 refers to an “independent and distinct” invention being in a divisional application. Including the objected claim in a divisional application is incorrect because it is not “independent and distinct.” (A), (B), (C) and (E) are proper replies which could overcome the rejection.',
  },
  {
    id: 'uspto-apr99-pm-28',
    topicId: 5,
    subtopic: 'Reissue — a silent file record raises no presumption that an assignee exists',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements regarding reissue applications is false?',
    options: [
      'If the file record is silent as to the existence of an assignee, it will be presumed that an assignee does exist.',
      'An examination on the merits of a reissue application will not be made without an offer to surrender the original patent, the actual surrender, or an affidavit or declaration to the effect that the original is lost or inaccessible.',
      'A broadened claim can be presented after two years from the grant in a broadening reissue which was filed within two years from the grant.',
      'The filing of a continued prosecution application (CPA) under 37 CFR § 1.53(d) of a reissue application will not be announced in the Official Gazette.',
      'When making amendments to the claims, patent claims must not be renumbered and the numbering of any claims added to the patent must follow the number of the highest numbered patent claim.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer because it is a false statement. MPEP § 1416. (A) is a true statement. MPEP § 1410.01. (C) is true. MPEP § 1412.03 (“When a Broadened Claim Can Be Presented”). (D) is a true statement. MPEP § 1430. (E) is also true. 37 CFR § 1.121(b)(2)(i)(B). [Historical practice] — option (D) recites CPA practice for reissues, eliminated in 2003, and the § 1.121 amendment format was rewritten in 2003.',
  },
  {
    id: 'uspto-apr99-pm-29',
    topicId: 0,
    subtopic: '§ 102(g)/103 rejection between commonly owned inventions — the § 1.132 assignee statement',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Employees Larry and Curly work for Taylor, Inc., each with knowledge of the other’s work, and with obligations to assign to Taylor inventions conceived while employed by Taylor. Larry invented a novel coating apparatus which utilized a spring released mechanism that worked well at temperatures of at least 32° F. Larry discussed his invention with Curly during work at Taylor. After their discussion, Curly conceived of an improvement and developed a piston activated mechanism for use in Larry’s novel coating apparatus. Curly’s piston activated mechanism worked extremely well at temperatures between 45 to 60° F. On April 8, 1997, Curly filed a patent application in the PTO disclosing the fact that Larry invented a novel coating apparatus and claiming an improved coating apparatus with a piston activated mechanism. Curly’s specification disclosed the excellent results obtained when the piston activated mechanism was used at temperatures between 45 to 60° F. On August 14, 1997, Larry’s application claiming the coating apparatus with the spring released mechanism for use at temperatures of at least 32° F. was filed in the PTO. On December 29, 1998, a patent was granted to Larry. In an Office action dated March 18, 1999, the examiner rejected the claims in Curly’s application under 35 U.S.C. §§ 102(g)/103 over Larry’s patent in view of a patent granted to Moe on August 25, 1992. Larry’s patent claims the coating apparatus with the spring released mechanism for operation at temperatures of at least 32° F. The patent to Moe discloses a piston activated mechanism (substantially similar to Curly’s piston activated mechanism) in combination with a different coating apparatus. The Moe patent also discloses that the piston activated mechanism would only operate at temperatures below 32° F. The examiner properly found that substitution of the piston activated mechanism of Moe for the spring released mechanism in Larry’s coating apparatus would have been obvious. As a registered practitioner hired by Taylor to prosecute both the Larry and Curly applications, which of the following best describes the course of action you should take to provide Taylor with all the patent protection it is entitled to receive?',
    options: [
      'Traverse the rejection by arguing that the rejection is improper, and in support thereof, submit an affidavit under 37 CFR § 1.132 signed by an officer of Taylor, Inc. attesting to the fact that at the time the inventions were made, Larry and Curly were obligated to assign their inventions to Taylor, Inc.',
      'Traverse the rejection by arguing that the rejection is improper and provide an affidavit signed by Larry stating that Curly derived his work from Larry and that both Curly and Larry were under an obligation to assign their inventions to Taylor.',
      'Traverse the rejection and submit an affidavit signed by Curly under 37 CFR § 1.131 stating that he made his invention in the United States before Larry filed his patent application and that both Larry and Curly were obligated to assign their inventions to Taylor, Inc. at the time the inventions were made.',
      'Amend the Curly application to claim only a piston activated mechanism which operates at temperatures between 45 - 60° F., and delete the coating apparatus from the claims.',
      'File a terminal disclaimer to have any patent granted on Curly’s application expire on the same date the Larry patent expires.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP §§ 2146; 706.02(l); 715.01; 715.01(b); and 716.10. (D) is not the best answer because it does not provide the assignee with the best patent protection. (B) and (C) are incorrect because they are both missing a statement from the assignee. The filing of a terminal disclaimer in (E) is inappropriate. [Pre-AIA] — § 102(g) prior invention and the common-ownership disqualification of pre-AIA § 103(c) do not survive under the AIA.',
  },
  {
    id: 'uspto-apr99-pm-30',
    topicId: 3,
    subtopic: 'A Notice of Appeal need not be signed nor identify the appealed claims',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Horatio invented a new widget for vacuum cleaners. You prepared and filed a patent application containing claims 1 through 10 directed to the widget. In a second Office action dated September 10, 1998, the examiner rejected claims 1 through 10 for the second time and on the same grounds and set a three month shortened statutory period for reply. You filed a reply to the second Office action on December 9, 1998. On January 8, 1999, the examiner sent another Office action containing a final rejection of claims 1 through 10 and set a three month shortened statutory period for reply. Horatio asked you to file a Notice of Appeal. In which of the following situations, would the Notice of Appeal be considered acceptable?',
    options: [
      'A Notice of Appeal signed by you, and the appropriate appeal fee are filed on April 8, 1999. The Notice does not identify the rejected claims appealed.',
      'A unsigned Notice of Appeal and the appropriate appeal fee is filed on April 8, 1999, and the Notice identifies the rejected claims appealed.',
      'A Notice of Appeal, signed by you, with the necessary fee for appeal and extension of time, are filed on July 8, 1999, without identifying the rejected claims appealed.',
      '(A) and (B).',
      '(A), (B), and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. (A), (B), and (C) would all be considered acceptable. 37 CFR § 1.191; MPEP § 1205 (“the rules no longer require that the notice of appeal identify the rejected claim(s) appealed, or be signed . . .”) (D) is incorrect because it does not include (C). [Historical practice] — the 37 C.F.R. § 1.191 appeal rules were replaced by the Part 41 rules in 2004.',
  },
  {
    id: 'uspto-apr99-pm-31',
    topicId: 3,
    subtopic: 'Appeal brief — two months from the Notice of Appeal, extendable five months',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Horatio invented a new widget for vacuum cleaners. You prepared and filed a patent application containing claims 1 through 10 directed to the widget. In a second Office action dated September 10, 1998, the examiner rejected claims 1 through 10 for the second time and on the same grounds and set a three month shortened statutory period for reply. You filed a reply to the second Office action on December 9, 1998. On January 8, 1999, the examiner sent another Office action containing a final rejection of claims 1 through 10 and set a three month shortened statutory period for reply. An acceptable Notice of Appeal is timely filed in the PTO on March 23, 1999. Absent extraordinary circumstances, which of the following is the last day that an appeal brief can be filed if a proper petition and the necessary fees for the brief and extension of time are filed with the brief?',
    options: [
      'April 8, 1999',
      'Monday, October 25, 1999',
      'August 23, 1999',
      'Monday, May 24, 1999',
      'September 23, 1999',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. (B) sets forth the latest date that an appeal brief can be filed based on a March 23, 1999, Notice of Appeal filing date. 37 CFR § 1.192; MPEP § 1206. The two month period from the date of the Notice of Appeal is not a statutory period and a proper extension of time can be obtained for an additional five months. [Historical practice] — the 37 C.F.R. § 1.192 brief-timing rule was replaced by the Part 41 rules in 2004.',
  },
  {
    id: 'uspto-apr99-pm-32',
    topicId: 2,
    subtopic: 'Provisional application — a new cover sheet during pendency adds the omitted inventor',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On a sunny January day in Minnesota, neighbors X and Y working together stumble across a novel means for melting snow with a device that X and Y have jointly invented. Being low on funds to market their invention, X and Y decide to save money and file their own patent application. X and Y decide to file a provisional patent application in order to have more time to market their invention. X and Y carefully prepare all the necessary papers for the filing of their provisional patent application and come up with the money to cover the filing fee. On Saturday, January 9, 1999, X and Y meet at their favorite coffee shop to take a final look at the specification and drawings they had prepared and to prepare a cover letter to accompany their application. In their eagerness to get to the Post Office after drinking two double mocha cappuccinos, the handwritten cover letter prepared by X and Y fails to identify X as an inventor. The cover letter only identifies the application as a provisional patent application; inventor Y’s full name, residence and correspondence address; and the title of the invention. Unaware that X has not been identified as an inventor, X and Y make a copy of their application papers and mail the cover letter with the specification, drawings and the proper fee to the Patent and Trademark Office via first class mail that same morning. A huge winter storm is expected to hit Minnesota by dusk and X and Y hurry home to conduct further experiments with their snow melting invention. The papers are received in the Patent and Trademark Office on Monday, January 11, 1999. Three weeks later, X and Y return to their favorite coffee shop to celebrate the outstanding success of their experiments with their snow melting device during the huge winter storm which hit Minnesota and to discuss the minor adjustment they made to their invention. In reviewing their application papers for the first time since they were mailed, X notices that the handwritten cover letter does not identify him as an inventor, and fails to include his residence and correspondence address. Which of the following is the best action to be taken by X and Y to correct these omissions from their handwritten cover letter in accordance with proper PTO practice and procedure?',
    options: [
      'X and Y should timely file an amendment to the provisional patent application to add X as an inventor, accompanied by a petition stating that the error occurred without deceptive intent on the part of X and the appropriate fee.',
      'X and Y should file an amendment to their provisional patent application which describes the minor adjustment made to the snow melting device and sign the amendment naming X and Y as joint inventors.',
      'X and Y should file a request for a certificate of correction and with an explanation of how the error occurred without deceptive intent.',
      'X and Y should file a continuation application with a new declaration signed by X and Y.',
      'X and Y should timely file a new cover sheet during the pendency of their provisional application which identifies both X and Y as inventors, and provides the title of the invention, as well as the residences of X and Y and the correspondence address.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR § 1.48(d); MPEP § 201.03 [p. 200-11]. Answer (B) is wrong because “[n]o amendment, other than to make the provisional application comply with the patent statute and all applicable regulations, may be made to the provisional application after the filing date of the provisional application.” 37 CFR § 1.53(c); MPEP § 201.04(b). Answer (C) is wrong because a certificate of correction applies only after a patent issues. MPEP § 1481. Answer (D) is not the best answer. MPEP § 201.03. There is no prior nonprovisional application from which a continuing application can be filed. (E) is incorrect because the filing of a new cover sheet is not sufficient to add X as an inventor when the earlier filed cover sheet identified only Y as the inventor and complied with 37 CFR § 1.51(c). MPEP § 201.04 [p. 200-12]. [Historical practice] — the AIA removed the “without deceptive intent” showing from inventorship correction.',
  },
  {
    id: 'uspto-apr99-pm-33',
    topicId: 0,
    subtopic: '“Up to 2.5% chromium” reads on zero chromium; “consisting of” excludes added nickel',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] The claim, “An alloy consisting of 70.5 to 77.5% iron, 15.0 to 17.0% cobalt, 0.5 to 1.0% carbon, up to 2.5% chromium, and at least 7.0% tungsten” is anticipated by a reference disclosing an alloy having:',
    options: [
      '76.0% iron, up to 15.0% cobalt, 0.5% carbon, and 8.5% tungsten.',
      '71% iron, 15% cobalt, 1.0% carbon, 1% chromium, 8% tungsten, and 4% nickel.',
      '71.3% iron, 15.2% cobalt, 0.9% carbon, 2.6% chromium, and 10% tungsten.',
      '76% iron, 15% cobalt, 1.0% carbon, at least 2.0% chromium, and 6% tungsten.',
      '72.0% iron, 16.5% cobalt, at least 2.0% carbon, 2.5% chromium, and up to 7.0% tungsten.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP §§ 2131; 2131.03; 2173.05(c). The requirement for “up to 2.5% chromium” reads on an alloy containing no chromium since “up to” requires no minimum and includes zero as a lower limit. In re Mochel, 176 USPQ 194 (CCPA 1974). Each other element in the claim is disclosed in the reference, and the range amount of each element in the claim reads on the amount disclosed in the reference for each element. Choice (B) is incorrect because the term “consisting of” excludes the inclusion of nickel from the claimed alloy. Answer (C) is incorrect because “2.6% chromium” is not within the scope of “up to 2.5% chromium” recited in the claim. (D) is incorrect because “6% tungsten” is not within the scope of “at least 7% tungsten” recited in the claim. (E) is incorrect because “at least 2% carbon” is not within the claimed range of “0.5-1.0% carbon.”',
  },
  {
    id: 'uspto-apr99-pm-34',
    topicId: 1,
    subtopic: 'A claim to an undisclosed screw-type mechanism is new matter under § 112 ¶ 1',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On January 6, 1999, Doe asked patent agent Bronson to prepare and file a patent application on an automobile jack which Doe had invented. Doe gave Bronson several sketches and a written description of the jack which described and showed the jack as utilizing only a scissors-type lifting mechanism. Bronson prepared a patent application disclosing the scissors-type lifting mechanism based on information provided by Doe. The claims of the patent application recited the lifting mechanism generically as “lifting means” since the specific type of lifting mechanism was not thought by Doe to be critical to the inventive feature of his jack. After Doe reviewed and signed the application, Bronson filed it in the PTO on February 3, 1999. On March 19, 1999, Doe discovered that his jack worked much better with a screw-type lifting mechanism as opposed to the scissors-type mechanism. The screw-type lifting mechanism is not disclosed in the application. Doe immediately informed Bronson of this fact. In reply to the first Office action, Bronson canceled all of the original claims and presented a new claim to the jack which included the provision of the screw-type lifting mechanism. Is the new claim proper at this stage of the prosecution?',
    options: [
      'Yes, because the claim particularly points out and distinctly claims the subject matter which Doe regards as his invention or discovery.',
      'No, because the claim could be properly rejected under 35 U.S.C. § 112, first paragraph.',
      'Yes, because the claim sets forth the best mode contemplated by Doe for carrying out his invention.',
      'No, because the claim could be properly rejected under 35 U.S.C. § 132.',
      'No, because the claim could be properly rejected under 35 U.S.C. § 112, sixth paragraph.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. The claim is rejected on the ground that it recites elements without support in the original disclosure under 35 U.S.C. § 112, first paragraph. MPEP §§ 706.03(o); 2163.06. “If new matter is added to the claims, the examiner should reject the claims under 35 U.S.C. § 112, first paragraph - written description requirement.” MPEP 2163.06, citing In re Rasmussen, 650 F.2d 1212, 211 USPQ 323 (CCPA 1981) [p. 2100-144]. (A) and (C) are incorrect. MPEP § 2165.01(IV). [Pre-AIA] — the AIA relettered 35 U.S.C. § 112 as subsections (a)-(f); the paragraph numbering recited here is the pre-AIA form.',
  },
  {
    id: 'uspto-apr99-pm-35',
    topicId: 0,
    subtopic: 'Traversing a § 103 combination — point to specific claim language the references lack',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On January 7, 1998, you filed a U.S. patent application containing Claims 1 through 8 on behalf of your client, Grumpy. In a first Office action, the examiner rejected Claims 1-8 under 35 U.S.C § 103 over a U.S. patent to Happy in view of a U.S. patent to Sleepy. The Happy patent issued on January 6, 1998, based on an application filed on June 11, 1996. The Sleepy patent issued in 1950. Which of the following responses would be the most persuasive in having the rejections withdrawn?',
    options: [
      'Argue that the claimed invention is patentably distinguishable over the combination of the Happy and Sleepy patents, pointing out the specific language in the claims that is not shown by the combination of the references.',
      'Argue that the Sleepy patent is outdated and that its teachings are so obsolete that it would no longer be read by one of ordinary skill in the art.',
      'Argue that the claimed invention is patentably distinguishable from Sleepy, and point out the specific language in the claims that is not shown by Sleepy.',
      'Argue that the devices disclosed by Sleepy and Happy are not physically combinable.',
      'Argue that the Happy patent is not prior art because it was not granted more than one year before Grumpy filed his patent application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 103; MPEP §§ 2141 - 2143; § 2143.01; and § 2145. (B) is incorrect. MPEP § 2145(VIII). (C) is incorrect. MPEP § 2145(IV). (D) is incorrect. MPEP § 2145(III). (E) is incorrect. 35 U.S.C. §§ 102(a) and 103. [Pre-AIA] — option (E) turns on the pre-AIA § 102(a) analysis of a patent granted before the applicant’s filing date.',
  },
  {
    id: 'uspto-apr99-pm-36',
    topicId: 1,
    subtopic: '§ 112 ¶ 1 — enablement, written description and best mode',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] The specification shall conclude with one or more claims and must set forth:',
    options: [
      'the manner of making the invention, the theory of why the invention works, and at least one working example showing how the invention works.',
      'the manner and process of making and using the invention, a written description of the invention, and the best mode of carrying out the invention.',
      'a description of the invention, how the invention is distinguishable over the most relevant prior art, and the best mode of carrying out the invention.',
      'only a full, clear, and concise description of the invention.',
      'a complete description of the invention, and how to use the invention so that a person having ordinary skill in the art to which the invention pertains would be able to practice the invention.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 35 U.S.C. § 112, first paragraph; MPEP § 2161. (A) is incorrect. MPEP § 2138.05. (C), (D), and (E) are incorrect. MPEP § 2161. [Pre-AIA] — the AIA relettered § 112 as subsections (a)-(f); the paragraph numbering recited here is the pre-AIA form.',
  },
  {
    id: 'uspto-apr99-pm-37',
    topicId: 0,
    subtopic: '“Comprising” is open-ended — a species within a Markush group anticipates',
    difficulty: 3,
    question: '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements, if any, is true?',
    options: [
      'A claim for a “soap composition comprising a maximum of 0.2 parts by weight of X per part by weight of Y” is anticipated by a soap composition disclosed in a publication as having 5 parts by weight of X per part weight of Y.',
      'A claim for “a laminate circuit material comprising a sheet of adhesive film, and a sheet of conductive material disposed on said sheet of adhesive film” is not anticipated by an article of manufacture consisting of an adhesive film disposed on one surface of a sheet of conductive material and a glass reinforced adhesive film disposed on the opposite surface of said sheet of conductive material.”',
      'An independent Claim 1 for an “article comprising a widget having a coating from 0.05 to 1 mm thickness,” and a dependent Claim 2 for “an article according to Claim 1 wherein the coating is 0.3 mm thick,” both are anticipated by “a widget having a coating of 0.5 mm thickness” described in a printed publication.',
      'A claim for a “nickel alloy comprising nickel, chromium, iron and at least one member selected from the group consisting of copper, silver and tin” is anticipated by a printed publication which discloses “an alloy consisting of nickel, silver, chromium, iron, copper, and cobalt.”',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 2111.03. The term “comprising” is inclusive or open ended and does not exclude additional, unrecited elements or method steps. (A) is incorrect because the amount of R in the prior art exceeds the limitation in the claim. (B) is incorrect because the claim does not exclude the glass reinforced adhesive film or its location. (C) is incorrect because the dependent claim is not anticipated by the prior art where the coating thickness is not 0.3mm thick. (E) is not correct because (D) is correct.',
  },
  {
    id: 'uspto-apr99-pm-38',
    topicId: 3,
    subtopic: 'A period ending on a Federal holiday runs to the next succeeding business day',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On Monday, April 5, 1999, an Office action was mailed to practitioner P. The Office action contained a rejection of all claims in the application and set a three month shortened statutory period for reply. The very last day for filing a reply without requesting an extension of time would be ______________.',
    options: [
      'July 2, 1999',
      'July 3, 1999',
      'July 5, 1999',
      'July 6, 1999',
      'August 3, 1999',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 710.01(a). (“[I]f the period ends on a Saturday, Sunday, or Federal holiday, the reply is timely if it is filed on the next succeeding business day.”) July 5, 1999, was a Federal holiday inasmuch as July 4, 1999, occurred on a Sunday.',
  },
  {
    id: 'uspto-apr99-pm-39',
    topicId: 1,
    subtopic: 'A preliminary amendment filed with the application can still add new matter',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Jones invented a widget. She disclosed to her patent agent that the widget can be any combination of colors, the most preferred embodiment being a widget having a blue, orange, yellow or purple color. The agent prepared a patent application which disclosed a widget having a blue, orange or purple color and which included the following claim: “1. A widget having a blue, orange or purple color.” On January 8, 1999, Jones reviewed the application and signed the oath. Just after Jones left the agent’s office, the agent remembered that Jones had also disclosed to him a yellow widget. The attorney immediately prepared a preliminary amendment which included instructions to amend the specification to also include a yellow widget and to rewrite Claim 1 as follows: “A widget having a blue, orange, yellow or purple color.” The specification, oath, and the amendment were mailed to the PTO in the same envelope and were received in the PTO on January 12, 1999. Given these facts, which one of the following statements is true?',
    options: [
      'Claim 1 cannot be properly rejected under 35 U.S.C. § 102(a) as being anticipated by a patent to Smith which was filed on March 2, 1997, and issued on August 13, 1998, and which discloses but does not claim, a widget having an orange color.',
      'Claim 1 can be considered to contain new matter even though the preliminary amendment was filed concurrently with the filing of the specification.',
      'Claim 1 can be properly rejected under 35 U.S.C. § 112, second paragraph, because the use of the word “or” renders the metes and bounds of the claim indeterminate.',
      'Claim 1 can be properly rejected on the ground of disclaimer.',
      'None of the above statements is true.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. MPEP § 608.04(b). (A) is incorrect. 35 U.S.C. § 102(a). (C) is incorrect. 35 U.S.C. § 112, second paragraph; MPEP § 2173.05(h). (D) is incorrect. MPEP § 706.03(u). (E) is not correct because (B) is correct. [Pre-AIA] — option (A) turns on the pre-AIA § 102(a) analysis and § 112 paragraph numbering.',
  },
  {
    id: 'uspto-apr99-pm-40',
    topicId: 3,
    subtopic: 'The date-stamped return postcard establishes the Notice of Appeal filing date',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In order to calculate when an appeal brief must be filed, which of the following documents should be used to establish the date that a Notice of Appeal was filed?',
    options: [
      'A separate letter sent from the Patent and Trademark Office which acknowledges receipt of your Notice of Appeal.',
      'A self-addressed postcard included with the filing of your Notice of Appeal which was date stamped and returned to you.',
      'A copy of the Certificate of Mailing you signed which states the date you deposited the Notice of Appeal via first class mail.',
      '(A), (B), and (C).',
      '(B) and (C).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR §§ 1.8(a)(1); 1.8(b); MPEP §§ 1205; 1206. (A) is incorrect. MPEP § 1205 (“The Patent and Trademark Office does not acknowledge receipt of a Notice of Appeal by separate letter.”) (C) is incorrect. MPEP § 1206 (“The Office date of receipt of the Notice of Appeal (and not the date indicated on any Certificate of Mailing under 37 CFR 1.8) is the date from which this 2 month time period is measured. See MPEP 512.”) (D) is not correct because (A) and (C) are incorrect. (E) is not correct because (C) is not correct. [Historical practice] — the 1999 appeal rules were replaced by the Part 41 rules in 2004.',
  },
  {
    id: 'uspto-apr99-pm-41',
    topicId: 5,
    subtopic: 'Reissue grounds — spelling and grammatical errors are not independent grounds',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following choices would be considered as independent grounds for filing a reissue application? (I) The claims are too narrow or too broad. (II) The disclosure contains inaccuracies. (III) Applicant failed to or incorrectly claimed foreign priority. (IV) The specification contains a plurality of obvious spelling and grammatical errors. (V) Applicant failed to make reference to or incorrectly made reference to prior copending applications.',
    options: [
      '(I),(II), and (IV)',
      '(II), (III), and (V)',
      '(I), (II), (III), (IV), and (V)',
      '(I), (II), (III), and (V)',
      '(I), (III), and (V)',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 1402. (IV) is not considered independent grounds for filing a reissue application. “[A]n error under 35 U.S.C. 251 has not been presented where the correction to the patent is one of spelling, or grammar, or a typographical, editorial or clerical error which does not cause the patent to be deemed wholly or partly inoperative or invalid for the reasons specified in 35 U.S.C 251.” Id. [p. 1400-2].',
  },
  {
    id: 'uspto-apr99-pm-42',
    topicId: 2,
    subtopic: 'A provisional cannot be amended, converted by CPA, or given provisional benefit',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] On April 19, 1999, Inventor Mary hires you for advice on a patent application. Mary informs you that she previously filed a provisional application for her invention on May 1, 1998. However, Mary has since made some improvements that were not described in her provisional application. To fully protect Mary’s patent rights, what is the best course of action to recommend to Mary?',
    options: [
      'File an amendment in the provisional application on or before May 1, 1999, which describes the improvements made by Mary.',
      'Immediately file a continued prosecution application based on the provisional application filed on May 1, 1998, and include a preliminary amendment which adds a description of the improvements made.',
      'File a second provisional patent application which claims the benefit of the May 1, 1998, filing date of the first provisional patent application.',
      'File a continuation-in-part application as soon as possible which adds a disclosure of the improvements made.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer because none of the choices provided are in accord with proper PTO practice and procedure. (A) is not correct because no amendment, other than to make the provisional application comply with the patent statute and all applicable regulations, may be made to a provisional application after the filing date. 37 CFR § 1.53 (c). (B) is not correct because only a continuation or divisional application may be filed as a CPA. MPEP § 601.01 (p. 600-7). (C) is incorrect because a provisional application is not entitled to the benefit of the earlier filed provisional application. 35 U.S.C. § 111(b)(7); 37 CFR § 1.53(c). (D) is wrong because a continuation-in-part “is an application filed during the lifetime of an earlier nonprovisional application.” MPEP § 201.08 (emphasis added). [Historical practice] — CPA practice was eliminated for utility applications in 2003.',
  },
  {
    id: 'uspto-apr99-pm-43',
    topicId: 0,
    subtopic: 'CIP — new claims get the CIP filing date, so the applicant’s own foreign patent bars them',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A U.S. patent application to AuGratin, a French national, was filed in the U.S. Patent and Trademark Office on August 10, 1997. The application disclosed and claimed an apparatus having a combination of elements A, B, and C. AuGratin filed a claim for priority in his U.S. application based upon an application which he filed in the French Patent Office on September 16, 1996. AuGratin’s U.S. patent application as filed is an exact English translation of his French application. AuGratin’s French application was issued and published as French Patent No. 1,234,567 on March 20, 1998. On April 12, 1999, AuGratin filed a continuation-in-part application (CIP) containing disclosure of new element D in the apparatus. The CIP application included new claims to an apparatus comprising a new combination of elements A, B, C, and D. The examiner properly rejected the new claims in the CIP application as being obvious over AuGratin’s French Patent No. 1,234,567 in view of a U.S. patent to Baker which clearly suggests modifying AuGratin’s apparatus by adding element D to the combination of elements A, B, and C. The rejection is a prima facie case of obviousness. Can AuGratin’s French patent be removed as a reference?',
    options: [
      'Yes, because AuGratin can swear behind French Patent No. 1,234,567 since the publication date of AuGratin’s French patent is less than one year prior to AuGratin’s August 10, 1997, U.S. filing date.',
      'Yes, because the claims in the parent application are supported in the CIP application.',
      'No, because the new claims in the CIP are not entitled to the benefit of the filing date of the parent application since the combination of elements A, B, C, and D is not supported in the parent application.',
      'Yes, because AuGratin’s French patent cannot be used as prior art in view of the claim for priority in the parent application.',
      'No, because the new claims are not supported in the CIP application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 120; MPEP §§ 2133.01; 715; 2126; 2127. AuGratin’s new claims to A, B, C and D is not supported by AuGratin’s parent application. As such, the effective filing date of AuGratin’s CIP application for the new claim is April 12, 1999. AuGratin’s French Patent No. 1, 234, 567 has a critical reference date of more than one year before his April 12, 1999, effective filing date and cannot be removed as a reference. (A), (B) and (D) are incorrect because the CIP application does not get the benefit of the filing date of the parent application for the new claims. 35 U.S.C. § 120. (E) is incorrect because the new claims provide the supporting disclosure. MPEP § 2163.06. [Pre-AIA] — the one-year critical reference date applied here is the pre-AIA § 102(b) bar.',
  },
  {
    id: 'uspto-apr99-pm-44',
    topicId: 2,
    subtopic: 'Customer Number — fee address, correspondence address and a practitioner list',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A Customer Number in the USPTO may be used to do which of the following?',
    options: [
      'Designate the fee address of a patent.',
      'Designate the correspondence address of a patent application.',
      'Serve as the Deposit Account Number to pay an extension of time fee.',
      'Submit a list of practitioners so that an applicant may in a Power of Attorney appoint those practitioners associated with the Customer Number.',
      '(A), (B), and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer because it includes (A), (B) and (D) which are identified in MPEP § 403 (pp. 400-9). (C) is incorrect because a Deposit Account number is not the same as a Customer Number. When authorizing charges to a Deposit Account, it is extremely important that the authorization be clear and unambiguous. MPEP § 509.01.',
  },
  {
    id: 'uspto-apr99-pm-45',
    topicId: 1,
    subtopic: 'Claiming a combination — the second element must be positively recited, not merely capable',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Where a flat board and parallel legs are separate elements which are intended to be included in a claim to the combination of the flat board and legs, the combination is properly set forth in which of the following claims?',
    options: [
      'A table having a flat board and parallel legs secured to the flat board.',
      'A table having a flat board capable of being connected to parallel legs.',
      'A table having a flat board and means for securing parallel legs to the flat board.',
      'A table having a flat board with means whereby parallel legs can be secured to the flat board.',
      'A table having a flat board for receiving parallel legs.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 112, first paragraph. (B) and (E) are incorrect because the only element of the table required by the claim is the flat board. (C) and (D) are incorrect because the claim requires only the flat board and securing means. [Pre-AIA] — the AIA relettered § 112 as subsections (a)-(f); the paragraph numbering recited here is the pre-AIA form.',
  },
  {
    id: 'uspto-apr99-pm-46',
    topicId: 6,
    subtopic: 'A copyright notice is not prohibited in a design patent application',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements regarding design patent applications is (are) false?',
    options: [
      'The use of trademarks in design patent application specifications is permitted under limited circumstances.',
      'It is improper to use a trademark alone or coupled with the word “type” in the title of a design patent.',
      'A design patent and a trademark may be obtained on the same subject matter.',
      'It is the policy of the Patent and Trademark Office to prohibit the inclusion of a copyright notice in a design patent application.',
      '(A) and (B).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because it is a false statement. MPEP § 1512, II. Inclusion of Copyright Notice [p. 1500-37]. (A), (B), and (C) are true statements. See MPEP § 1512, III. Design Patent/Trademark Overlap and IV. Inclusion of Trademarks in Design Patent Applications [p. 1500-38]. (E) is incorrect because it includes (A) and (B) which are both true statements.',
  },
  {
    id: 'uspto-apr99-pm-47',
    topicId: 2,
    subtopic: 'Confidentiality — reissues are open; Disclosure Documents are not',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Which of the following statements concerning the confidentiality of patent applications before the Patent and Trademark Office is true?',
    options: [
      'All documents filed as part of the Disclosure Document Program are open to the public two years after filing.',
      'All reissue applications are open to the public.',
      'Copies of any document contained in the application file for which the United States acted as the International Preliminary Examining Authority will be furnished in accordance with Patent Cooperation Treaty (PCT) Rule 94.2 or 94.3 upon payment of the appropriate fee.',
      '(B) and (C).',
      '(A) and (B).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because both (B) and (C) are true statements. 37 CFR §§ 1.11(b); 1.14(g). (A) is false. MPEP § 1706. (E) is incorrect because it includes (A) which is a false statement. [Historical practice] — the Disclosure Document Program was discontinued in 2007, and this answer predates 18-month pre-grant publication (November 2000).',
  },
  {
    id: 'uspto-apr99-pm-48',
    topicId: 0,
    subtopic: 'Disclosed-but-unclaimed matter derived from the applicant — the § 1.132 derivation affidavit',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] Apple’s claims have been properly rejected under 35 U.S.C. § 102(e) as being anticipated by Carrot. The rejection is based upon the disclosed, but unclaimed, subject matter in the Carrot patent. The Carrot patent issued six months after the filing date of Apple’s application. The unclaimed subject matter in the Carrot patent was not invented by Carrot, but rather was disclosed to Carrot by Apple. Carrot’s claimed invention is patentably distinct from Apple’s claimed invention. The proper reply to obviate this rejection would be to:',
    options: [
      'Copy the claims in the Carrot patent to provoke an interference.',
      'File an affidavit by Carrot establishing that Carrot derived his knowledge of the relevant subject matter from Apple.',
      'Argue that the Carrot patent is not prior art because the patent did not issue before Apple filed his application.',
      'File a terminal disclaimer signed by Apple.',
      'File a terminal disclaimer signed by Carrot.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. MPEP §§ 715.01(c); 716.10. (A) is incorrect because the facts are given that Apple invented that which Carrot claims. 35 U.S.C. § 102(g). (C) is incorrect. 35 U.S.C. § 102(g). (D) and (E) are incorrect. A terminal disclaimer does not overcome a 35 U.S.C. § 102(e) rejection. MPEP § 2136.05. [Pre-AIA] — §§ 102(e) and 102(g) do not survive under the AIA.',
  },
  {
    id: 'uspto-apr99-pm-49',
    topicId: 3,
    subtopic: '§ 121 shield does not apply to claims drawn to the “same invention”',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] In which of the following situations does the prohibition against double patenting rejections under 35 U.S.C. § 121 not apply?',
    options: [
      'The applicant voluntarily files two or more cases without a restriction requirement by the examiner.',
      'The requirement for restriction was only made in an international application by the International Searching Authority or the International Preliminary Examining Authority.',
      'The requirement for restriction was withdrawn by the examiner before the patent issues.',
      'The claims of the second application are drawn to the “same invention” as the first application or patent.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 804.01.',
  },
  {
    id: 'uspto-apr99-pm-50',
    topicId: 1,
    subtopic: 'Multiple dependent claims must refer to preceding claims in the alternative',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Apr 1999] A patent application is filed with 10 claims. Claims 1, 2, and 3 are independent claims directed to a product. Claim 4 is an independent claim directed to a process for making the product. Which of the following would be acceptable form for a dependent Claim 5?',
    options: [
      'A product as in claims 1-3, wherein …',
      'A product as claimed in claims 1, 2, and 3, wherein …',
      'A product as in claim 1, made by the process of claim 4.',
      'A product as claimed in any one of claims 1, 2, or 3 wherein …',
      'A product as claimed in claim 6 or claim 7, wherein …',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 112; fifth paragraph; 37 CFR § 1.75(c); MPEP § 608.01 (n) [pp. 600-65-66]. (A), (B) and (C) are incorrect because they are dependent on multiple claims in the conjunctive. (E) is incorrect because it depends on claims which follow, as opposed to precede, the claim. 37 CFR § 1.75(c). [Pre-AIA] — the AIA relettered § 112 as subsections (a)-(f); the paragraph numbering recited here is the pre-AIA form.',
  },
];

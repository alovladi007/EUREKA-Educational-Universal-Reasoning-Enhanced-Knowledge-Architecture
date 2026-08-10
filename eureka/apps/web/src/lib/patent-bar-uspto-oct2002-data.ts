/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — October 16, 2002, MORNING (AM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (oed0210aq.pdf / oed0210aa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * A NOTE ON FINDING THIS EXAM. October 2002 was missing from every previous
 * "remaining exams" list, and the reason is the filename: it is `oed0210*`,
 * with the letters TRANSPOSED relative to the `edoYYMM` convention used by
 * 1999-2002. Guessing `edo0210*` returns nothing. The 2003 papers break the
 * convention differently again (`15apr03*` / `15oct03*`). Always enumerate the
 * directory rather than extrapolating a filename pattern.
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files here):
 *  - Stems and options are VERBATIM, in the official order (A)-(E).
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * Keys are from `npm run audit:uspto`, which parsed all 50 entries with no
 * anomalies, and were then re-checked one by one against the model-answer text.
 *
 * DISCARDED: Q30 only — "All answers accepted." 49 of the 50 delivered
 * questions are scoreable.
 *
 * MULTI-KEYED: none in this session. (The October 2002 PM session does have
 * one — Q22 — so do not assume the date is clean as a whole.)
 *
 * ERA NOTES. This paper sits between the AIPA (1999-2000) and the AIA (2011),
 * so it tests some rules that were then NEW and are now repealed or rewritten.
 * Items turning on pre-AIA § 102/§ 103 carry [Pre-AIA]; superseded procedure
 * carries [Historical practice]. In particular:
 *  - Q17's § 102(e) answer describes the AIPA amendment as of 2002; the AIA
 *    rewrote § 102 entirely for applications with post-March-2013 filing dates.
 *  - Q6, Q29, Q32 and Q38 apply pre-AIA statutory bars and § 1.131 practice,
 *    neither of which survives in AIA cases.
 *  - Q16 applies the § 1.121 amendment format as it stood in 2001-2002
 *    (marked-up claims on separate paper); current practice uses claim listings
 *    with status identifiers.
 *  - Q18 turns on the pre-AIA § 104 geography rules for proving a date of
 *    invention, which the AIA's first-inventor-to-file system removed.
 *  - Q39's CIP/CPA discussion predates the 2003 elimination of CPA practice
 *    for utility applications.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2002_AM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'October 16, 2002',
  session: 'Morning (AM)',
  questionsFile: 'oed0210aq.pdf',
  answersFile: 'oed0210aa.pdf',
  totalDelivered: 50,
  discarded: [30],
  multiKeyed: [] as number[],
  ingested: 49,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_OCT2002_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct02-am-01',
    topicId: 2,
    subtopic: 'Filing under § 1.47(a) when a joint inventor refuses to sign',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with the MPEP and USPTO rules and procedure, an application for patent may be made on behalf of a joint inventor in certain situations. Who, by petition, may make application on behalf of a joint inventor who has refused to sign the application ("nonsigning inventor"), if the other joint inventor ("signing inventor") executes the application?',
    options: [
      'A person other than the signing inventor, to whom the nonsigning inventor has assigned the invention.',
      'A person other than the signing inventor, with whom the nonsigning inventor has agreed in writing to assign the invention.',
      'The signing inventor.',
      'A person other than the signing inventor, who shows a strong proprietary interest in the invention.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (C) is the correct answer. MPEP § 409.03(a); 37 C.F.R. § 1.47(a), which provides: "If a joint inventor refuses to join in an application for patent or cannot be found or reached after diligent effort, the application may be made by the other inventor on behalf of himself or herself and the nonsigning inventor." The oath must be accompanied by a petition including proof of the pertinent facts, the § 1.17(h) fee, and the nonsigning inventor\'s last known address. (A), (B) and (D) are each incorrect because they are not provided for by § 1.47(a) — MPEP § 409.03(b) provides that "[w]here 37 C.F.R. § 1.47(a) is available, application cannot be made under 37 C.F.R. § 1.47(b)." (E) is incorrect because (A), (B) and (D) are each incorrect.',
  },
  {
    id: 'uspto-oct02-am-02',
    topicId: 1,
    subtopic: 'Written description — an essential feature claimed but not described',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] To satisfy the written description requirement of the first paragraph of 35 USC 112, an applicant must show possession of the invention. An applicant’s lack of possession of the invention may be evidenced by:',
    options: [
      'Describing an actual reduction to practice of the claimed invention.',
      'Describing the claimed invention with all of its limitations using such descriptive means as words, structures, figures, diagrams, and formulas that fully set forth the claimed invention.',
      'Requiring an essential feature in the original claims, where the feature is not described in the specification or the claims, and is not conventional in the art or known to one of ordinary skill in the art.',
      'Amending a claim to add a limitation that is supported in the specification through implicit or inherent disclosure.',
      'Amending a claim to correct an obvious error by the appropriate correction.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. "Guidelines for Examination of Patent Applications under 35 U.S.C. § 112, ¶ 1, \'Written Description\' Requirement," 66 F.R. 1099, 1105 (Jan. 5, 2001): "The claimed invention as a whole may not be adequately described if the claims require an essential or critical feature that is not described in the specification and is not conventional in the art or known to one of ordinary skill in the art." (A) and (B) are not most correct — each is a means of SHOWING possession, not of showing its lack. (D) is not most correct — "[w]hile there is no in haec verba requirement, newly added claim limitations must be supported by in the specification through express, implicit, or inherent disclosure." (E) is not most correct — "[a]n amendment to correct an obvious error does not constitute new matter where one skilled in the art would not only recognize the existence of the error in the specification, but also recognize the appropriate correction."',
  },
  {
    id: 'uspto-oct02-am-03',
    topicId: 1,
    subtopic: 'Recommended claim format — no requirement to begin with "A", "An" or "In"',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the recommended format for a claim set forth in the provisions of the MPEP?',
    options: [
      'Where a claim sets forth a plurality of elements or steps, each element or step of the claim should be separated by a line indentation.',
      'A claim may include plural indentations to further segregate subcombinations or related steps.',
      'The claim or claims must commence on a separate sheet after the detailed description of the invention.',
      'Each claim should end with a period.',
      'A claim should always begin with "A", "An" or "In."',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). There is no such requirement. As to (C), see 37 C.F.R. § 1.52(b). As to (A) through (D), see MPEP § 608.01(m); 37 C.F.R. § 1.75(i).',
  },
  {
    id: 'uspto-oct02-am-04',
    topicId: 1,
    subtopic: 'A dependent claim may not omit an element of its parent',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] An application as originally filed contains the following Claim 1: "Claim 1. A doughnut making machine comprising: (i) an input conveyor that receives dough to be used in making said doughnuts; (ii) means for portioning dough from said input conveyor into a plurality of dough balls, each of said plurality of balls containing dough sufficient to create a single doughnut; (iii) means for forming each of said dough balls into a ring of dough; (iv) a deep fat fryer which receives rings of dough from said forming means and cooks said rings of dough; (v) means for selectively applying a flavored coating on cooked rings of dough to produce doughnuts; and (vi) means for placing a plurality of said doughnuts on a flat sheet." The specification adequately describes the claimed subject matter. Two different "means for selectively applying" are described in the specification: a sprayer and a brush. Which of the following original claims is an improper dependent claim?',
    options: [
      'Claim 2. The doughnut making machine of Claim 1, wherein said placing means is a conveyor that extends from said applying means to said flat sheet.',
      'Claim 3. The doughnut making machine of Claim 1, wherein said forming means includes a cutter that removes a center portion of each of said dough balls to form a ring of dough.',
      'Claim 4. The doughnut making machine of Claim 1, wherein said applying means includes a sprayer which receives a sugar based flavored coating, wherein said sugar based flavored coating is sprayed on said cooked rings of dough.',
      'Claim 5. The doughnut making machine of Claim 1, wherein said applying means is a sprayer.',
      'Claim 6. The doughnut making machine of Claim 1, wherein said applying means is omitted for making plain doughnuts.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). A dependent claim must further limit the claim from which it depends. 35 U.S.C. § 112, ¶ 4; 37 C.F.R. § 1.75(c). Dependent claim 6 improperly seeks to BROADEN Claim 1 by omitting an element set forth in the parent claim.',
  },
  {
    id: 'uspto-oct02-am-05',
    topicId: 3,
    subtopic: 'Prematureness of a final rejection is petitionable, not appealable',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Where a final rejection of claims has been made, any question of prematureness of the final rejection should be raised, if at all:',
    options: [
      'as a ground of appeal.',
      'as the basis of a complaint before the Board of Patent Appeals and Interferences.',
      'by petition under 37 CFR 1.181 while the application is pending before the examiner.',
      'after 2 months from the examiner’s answer plus mail room time, if no reply brief has been timely filed during an appeal to the Board of Patent Appeals and Interferences.',
      'after a supplemental examiner’s answer, pursuant to a remand from the Board of Patent Appeals and Interferences has been mailed.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is most correct. 37 C.F.R. § 1.181; MPEP § 706.07(c). (A) and (B) are wrong — prematureness of a final rejection is not appealable. 37 C.F.R. §§ 1.181(a)(1), 1.191(a). (D) and (E) are wrong because MPEP § 706.07(c) states, "Any question as to prematureness of a final rejection should be raised, if at all, while the application is still pending before the primary examiner," and MPEP § 1210 indicates jurisdiction lies with the Board at the times set forth in (D) and (E). [Historical practice] — the appeal rules of 37 C.F.R. Part 41 have since been revised.',
  },
  {
    id: 'uspto-oct02-am-06',
    topicId: 3,
    subtopic: '§ 1.131 cannot antedate a statutory bar, an admission, or same-invention art',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] According to USPTO rules and procedure, which of the following can be overcome by an affidavit under 37 CFR 1.131?',
    options: [
      'A rejection properly based on statutory double patenting.',
      'A rejection properly made under 35 USC 102(d) based on a foreign patent granted in a non-WTO country.',
      'A rejection properly made under 35 USC 102(a) based on a journal article dated one month prior to the effective filing date of the U.S. patent application. Applicant has clearly admitted on the record during the prosecution of the application that subject matter in the journal article relied on by the examiner is prior art.',
      'A rejection properly made under 35 USC 102(b) based on a U.S. patent that issued 18 months before the effective filing date of the application. The patent discloses, but does not claim, the invention.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 715. (A) is incorrect because a § 1.131 affidavit is not appropriate where the reference is a prior U.S. patent to the same entity claiming the same invention. (B) and (D) are each incorrect because § 1.131 is not appropriate against a statutory bar — under § 102(d) in (B) or § 102(b) in (D). (C) is incorrect because § 1.131 is not appropriate where applicant has clearly admitted on the record that the subject matter relied on is prior art. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-oct02-am-07',
    topicId: 0,
    subtopic: 'Inherent properties; admissions by applicant and counsel',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Paul, a registered patent practitioner and counsel for Superior Aircraft, Inc. ("Superior"), filed a patent application naming chief engineer Davis as sole inventor, and claiming a titanium and aluminum alloy designed for use in advanced gas turbine engines in aircraft. The application described the alloy as having unexpectedly excellent and improved room temperature ductility. The application was filed with an assignment document transferring all right, title and interest in the application to Superior. During prosecution of the application, the examiner had an interview with Paul and Davis of Superior. The examiner noted the existence of a prior art publication that disclosed test data demonstrating that the claimed alloys exhibited poor room temperature ductility, and stated that he had personal knowledge that the alloy was old and well known. Davis agreed with the examiner, and stated that such information was "old hat," but that they overcame the ductility problem by simply resorting to a 3-step process of microstructure refinement. Paul concurred and pointed to the fact that not only had they disclosed the process in the application, but that microstructure refinement of alloys to improve ductility was so well-known that the technique was even taught in metallurgy courses in college. Which of the following statements is false?',
    options: [
      'The examiner may reject the alloy claims on the basis of the prior art publication.',
      'The examiner may not reject the alloy claims on the basis of the prior art publication, because the alloys of the application are characterized by unexpected, improved ductility properties.',
      'The examiner may rely upon the chief engineer’s statement as an admission against patentability.',
      'The examiner may rely upon the patent counsel’s statement as an admission against patentability.',
      'The examiner, having facts within his or her personal knowledge, may rely on the facts in rejecting the alloy claims.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the best choice because it is a FALSE statement. MPEP § 2112.01 cites Titanium Metals Corp. v. Banner, 778 F.2d 660, 227 USPQ 773 (Fed. Cir. 1985): "it was immaterial what properties the alloys had…because the composition is the same and thus must necessarily exhibit the properties." (A) is not correct because it is a true statement. (C), (D) and (E) are incorrect because the stated reliance IS permitted. 37 C.F.R. § 1.104(c)(3); MPEP § 706.',
  },
  {
    id: 'uspto-oct02-am-08',
    topicId: 3,
    subtopic: 'Nonstatutory double patenting is overcome by a terminal disclaimer',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The MPEP and USPTO rules and procedure provide for ways that a nonstatutory double patenting rejection can be overcome. Which of the following is an effective way to overcome a nonstatutory double patenting rejection?',
    options: [
      'Filing a 37 CFR 1.131 affidavit to swear behind the patent on which the rejection is based.',
      'Filing a terminal disclaimer under 37 CFR 1.321(c).',
      'Filing a 37 CFR 1.131 affidavit arguing that the claims are for different inventions that are not patentably distinct.',
      'Filing a reply arguing that there is only one common inventor regarding the claims of the application and the claims of the patent.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (B) is the correct answer. MPEP § 804.02(II): "A rejection based on a nonstatutory type of double patenting can be avoided by filing a terminal disclaimer in the application or proceeding in which the rejection is made." (A) and (C) are each incorrect — "[t]he use of a 37 C.F.R. § 1.131 affidavit in overcoming a double patenting rejection is inappropriate… § 1.131 is inapplicable if the claims of the application and the patent are \'directed to substantially the same invention\'… [or] if there is a lack of \'patentable distinctness.\'" (C) is further incorrect since a nonstatutory rejection can be based on the claims not being patentably distinct. (D) is incorrect because MPEP § 804(I)(A) reads, "Double patenting may exist between an issued patent and an application filed by the same inventive entity, or by an inventive entity having a common inventor with the patent." (E) is incorrect because (A), (C) and (D) are each incorrect.',
  },
  {
    id: 'uspto-oct02-am-09',
    topicId: 1,
    subtopic: 'The title must be technically accurate; the limit is characters, not words',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions of the MPEP?',
    options: [
      'The title of the invention should be placed at the top of the first page of the specification unless it is provided in the application data sheet.',
      'The title need not be technically accurate, but should be descriptive and should contain fewer than 10 words.',
      'Inasmuch as the words "improved," "improvement of," and "improvement in" are not considered as part of the title of an invention, these words should not be included at the beginning of the title of the invention and will be deleted when the Office enters the title into the Office’s computer records, and when any patent issues.',
      'If a satisfactory title is not supplied by the applicant the examiner may, at the time of allowance, change the title by examiner’s amendment. If the change to the title is the only change being made by the examiner at the time of allowance, a separate examiner’s amendment need not be prepared and the examiner is to indicate the change in title in the file.',
      'A title in a U.S. application need not be identical to the corresponding foreign filed application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer inasmuch as the title DOES need to be technically accurate, and the limitation is 500 characters, not 10 words. MPEP § 606. As to (A), (C) and (D), see MPEP §§ 606 and 606.01. As to (E), the title can be amended by the examiner.',
  },
  {
    id: 'uspto-oct02-am-10',
    topicId: 3,
    subtopic: 'An appeal brief is not an RCE "submission"',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with proper USPTO practice and procedure, a submission for a request for continued examination does not include:',
    options: [
      'An amendment of the drawings.',
      'New arguments in support of patentability.',
      'New evidence in support of patentability.',
      'An appeal brief or reply brief (or related papers).',
      'An amendment of the claims.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 C.F.R. § 1.114(d), last sentence. (A), (B), (C) and (E) are not the most correct answers — each is recognized as being a "submission" within the scope of 37 C.F.R. § 1.114(c).',
  },
  {
    id: 'uspto-oct02-am-11',
    topicId: 6,
    subtopic: 'Design applications — photographs may not be combined with ink drawings',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with MPEP § 1500, relating to design patent applications:',
    options: [
      'the invention may be properly represented in a single application by both an ink drawing and a black and white photograph.',
      'the invention may be properly represented in a single application by a black and white photograph disclosing environmental structure by broken lines, in lieu of an ink drawing if the invention is shown more clearly in the photograph.',
      'the invention may be properly represented in a single application by both an ink drawing and a color photograph, and the application should be accompanied by the required petition, fee, three sets of color photographs, and an amendment to the specification.',
      'the invention may be properly represented by a color photograph disclosing environmental structure by broken lines, in lieu of an ink drawing if the invention is not capable of being illustrated in an ink drawing.',
      'the invention may be properly represented by a color photograph if the invention is not capable of being illustrated in an ink drawing, and if the application is accompanied by the required petition, fee, and an amendment to the specification is presented to insert required language regarding the color photographs, and three sets of color photographs.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct, and finds support in MPEP § 1503.02(V), "Photographs and Color Drawings." (A) and (C) are wrong because 37 C.F.R. § 1.152 states, "Photographs and ink drawings are not permitted to be combined as formal drawings in one application." (B) and (D) are wrong because § 1.152 states, "Photographs submitted in lieu of ink drawings in design patent applications must not disclose environmental structure but must be limited to the design claimed for the article."',
  },
  {
    id: 'uspto-oct02-am-12',
    topicId: 5,
    subtopic: 'Reissue corrects inventorship, and is not subject to the two-year limit',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Inventor A filed a patent application and assigned the entire interest in the application to his employer, MegaCorp. The application issued as a utility patent on July 9, 2002. In June 2004, MegaCorp’s management first learns that a second inventor, Inventor B, should have been named as a co-inventor with respect to at least one claim of the issued patent. There was no deceptive intent in failing to name Inventor B in the original application. Inventor A, who is unfamiliar with patent law and concepts of inventorship, incorrectly believes that he should be the sole named inventor on the patent, and refuses to cooperate with any effort by MegaCorp to change the named inventive entity. The issued patent contains no other error. In accordance with the Manual of Patent Examining Procedure, which of the following procedures is/are available for MegaCorp to seek correction of the named inventive entity without any agreement, cooperation or action from Inventor A?',
    options: [
      'File, on or before July 9, 2004, a reissue application, made by MegaCorp only, that seeks to add Inventor B.',
      'File, after July 9, 2004, a reissue application, made by MegaCorp only, that seeks to add Inventor B.',
      'Request a Certificate of Correction to add Inventor B as a named inventor.',
      'Submit in the issued patent file: a Request for Correction of Inventorship Under the Provisions of 37 CFR 1.48 that sets forth the desired inventorship change; a statement by Inventor B that the error in inventorship occurred without deceptive intention on her part; an oath or declaration executed by Inventor B; all required fees; and the written consent of MegaCorp.',
      'A and B are each available procedures.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best choice is (E). MPEP § 1412.04. Reissue is a proper vehicle for correcting inventorship in a patent, and because correction of inventorship does not ENLARGE the scope of the patent claims, the reissue application may be filed more than two years after the patent issued. (A) and (B) are therefore both correct, making (E) the best response. Although a certificate of correction may be used where all parties are in agreement, Inventor A is not in agreement, so (C) is unavailable. (D) is incorrect because 37 C.F.R. § 1.48 is not available to correct inventorship in an ISSUED patent. [Historical practice] — the AIA revised inventorship-correction practice and removed the deceptive-intent requirements.',
  },
  {
    id: 'uspto-oct02-am-13',
    topicId: 3,
    subtopic: 'Official notice must be seasonably traversed; the next action may still be final',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following statements concerning reliance by an examiner on common knowledge in the art, in a rejection under 35 USC 103 is correct? I. An examiner’s statement of common knowledge in the art is taken as admitted prior art, if applicant does not seasonably traverse the well known statement during examination. II. Applicant can traverse an examiner’s statement of common knowledge in the art, at any time during the prosecution of an application to properly rebut the statement. III. If applicant rebuts an examiner’s statement of common knowledge in the art in the next reply after the Office action in which the statement was made, the examiner can never provide a reference to support the statement of common knowledge in the next Office action and make the next Office action final.',
    options: ['I.', 'II.', 'III.', 'I and II.', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. MPEP § 2144.03. II is incorrect because an applicant must SEASONABLY traverse the well-known statement or the object of that statement is taken to be admitted prior art. In re Chevenard, 60 USPQ 239 (CCPA 1943). Therefore (B) and (D) are incorrect. III is incorrect because the action can potentially be made final; therefore (C) is incorrect. (E) is incorrect because (A) is correct. [NOTE: the published model answer\'s discussion labels the reasoning against statement I, but its stated key and its rejection of (B), (C), (D) and (E) all resolve to choice (A).] [Pre-AIA] — decided under pre-AIA § 103.',
  },
  {
    id: 'uspto-oct02-am-14',
    topicId: 0,
    subtopic: 'Nothing in the list overcomes a proper § 102(b) anticipation',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Claims in your client’s patent application have been rejected as unpatentable over prior art. In accordance with proper USPTO practice and procedure, which, if any, of the following statements is true?',
    options: [
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 USC 102(b) of the disclosure in the patent that anticipates the claimed invention. Evidence of secondary considerations, such as unexpected results or commercial success, is relevant to the rejection and thus can overcome the rejection.',
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 USC 102(b) over the disclosure in the patent that anticipates the claimed invention. The rejection can be overcome by arguing that the alleged anticipatory prior art is "nonanalogous art."',
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 USC 102(b) over the disclosure in the patent that anticipates the claimed invention. The rejection can be overcome by arguing that the alleged anticipatory prior art teaches away from the invention.',
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 USC 102(b) over the disclosure in the patent that anticipates the claimed invention. The rejection can be overcome by arguing that the alleged anticipatory prior art is not recognized as solving the problem solved by the claimed invention.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). (A), (B), (C) and (D) are not in accordance with proper USPTO practice. As to (A), MPEP § 2131.04; In re Wiggins, 179 USPQ 421, 425 (CCPA 1973) — secondary considerations are irrelevant to anticipation. As to (B), (C) and (D), MPEP § 2131.05; Twin Disc, Inc. v. United States, 231 USPQ 417, 424 (Cl. Ct. 1986); In re Self, 213 USPQ 1, 7 (CCPA 1982). [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct02-am-15',
    topicId: 3,
    subtopic: 'Statutory double patenting is overcome by amending, not by a terminal disclaimer',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The MPEP and USPTO rules and procedure provide for ways that a statutory double patenting rejection can be overcome. Which of the following is an effective way to overcome a statutory double patenting rejection?',
    options: [
      'Filing a 37 CFR .131 affidavit to swear behind the patent on which the rejection is based.',
      'Filing a terminal disclaimer under 37 CFR 1.321(c).',
      'Filing a 37 CFR 1.131 affidavit and arguing that the conflicting claims are coextensive in scope.',
      'Amending the conflicting claims so that they are not coextensive in scope.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (D) is the correct answer. MPEP § 804.02: "A rejection based on the statutory type of double patenting can be avoided by amending the conflicting claims so that they are not coextensive in scope." (A) and (C) are each incorrect because "[t]he use of a 37 C.F.R. § 1.131 affidavit in overcoming a statutory double patenting rejection is inappropriate"; (C) is further incorrect since the statutory rejection is PREDICATED on the claims being coextensive. (B) is incorrect because "[a] terminal disclaimer is not effective in overcoming a statutory double patenting rejection." (E) is incorrect because (A), (B) and (C) are each incorrect.',
  },
  {
    id: 'uspto-oct02-am-16',
    topicId: 3,
    subtopic: 'Non-compliant amendment under the 2001 § 1.121 format',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Applicant received a final rejection dated and mailed Wednesday, February 28, 2001. The final rejection set a three month shortened statutory period for reply. In reply, applicant filed an amendment on Wednesday, March 21, 2001. In the amendment, applicant requested that block diagrams, figures 32-34, be amended by inserting the term - -computer- - in place of [CPU] in block "2" of each block diagram. Applicant further supplied a clean version of the entire set of pending claims. Applicant did not provide the proposed changes to the drawings on separate sheets marked in red nor did the applicant supply a marked-up version of any claim. The examiner upon receipt and review of the amendment discovered that the applicant made changes to pending claims 2 and 15 and that the applicant added claims 21-25 to the application. The examiner in an Advisory Action notifies the applicant that the amendment fails to comply with the requirements of 37 CFR 1.121. Which of the following answers is most correct?',
    options: [
      'Applicant is given a time period of one month or thirty days from the mailing date of the Advisory Action, whichever is longer, within which to supply the omission or correction in order to avoid abandonment. This time period is in addition to any remaining period of time set in the final rejection.',
      'Applicant may not provide a clean version of the entire set of pending claims because the applicant may only consolidate all previous versions of pending claims into a single clean version in an amendment after a non-final Office action.',
      'Applicant must submit the proposed changes to figures 32-34 on a separate paper showing the proposed changes in red and a marked up version of new claims 21-25 as required by 37 CFR 1.121(c).',
      'Applicant should request reconsideration by the examiner, pointing out that the Final Rejection was mailed on February 28, 2001, which precedes the March 1, 2001 effective date of the changes to patent rule 37 CFR 1.121.',
      'Applicant must submit the changes to figures 32-34 on separate paper showing the proposed changes in red and a marked up version of rewritten claims 2 and 15 showing all changes (relative to the previous version of claims 2 and 15) shown by any conventional marking system as required by 37 CFR 1.121(c). Applicant should also indicate the status of claims 2 and 15, e.g. "amended," "twice amended," etc. on both the clean version of the claims and the marked up version.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. 37 C.F.R. § 1.121(c) and (d); MPEP § 714. (A) is incorrect — MPEP § 714.22: applicant may resubmit the amendment within any REMAINING period set in the final rejection; no new period that would extend the six-month statutory period will be set in the advisory action. (B) is incorrect — MPEP § 714.22(a): applicants may consolidate all previous versions of pending claims into a single clean version at any time during prosecution, subject to §§ 1.116(b) and 1.312. (C) is incorrect — although drawing changes must be on separate paper in red, changes to the specification including the claims must be made by replacement paragraph/section/claim in clean form, regardless of the mailing date of the Office action. [Historical practice] — this is the pre-2003 § 1.121 format; current practice uses claim listings with status identifiers.',
  },
  {
    id: 'uspto-oct02-am-17',
    topicId: 0,
    subtopic: 'Declassified material is effective as of its release date',
    difficulty: 3,
    question: '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following statements is true?',
    options: [
      'In the context of 35 USC 102(b), a magazine need only be placed in the mail to be effective as a printed publication.',
      'The earliest date declassified printed material may be taken as prima facie evidence of prior knowledge under 35 USC 102(a) is as of the date the material is cataloged and placed on the shelf of a public library.',
      'Declassified printed material is effective as a printed publication under 35 USC 102(b) as of the date of its release following declassification.',
      'The American Inventors Protection Act (AIPA) amended 35 USC 102(e) to provide that U.S. patents, U.S. application publications, and certain international application publications can be used as prior art under 35 USC 102(e) based on their earliest effective filing date only against applications filed on or after November 29, 2000.',
      'The American Inventors Protection Act (AIPA) amended 35 USC 102(e) to provide that U.S. patents, U.S. application publications, and certain international application publications can be used as prior art under 35 USC 102(e) based on their earliest effective filing date only against applications filed prior to November 29, 2000 which have been voluntarily published.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. MPEP § 707.05(f): "In the use of [declassified material]… as an anticipatory publication, the date of release following declassification is the effective date of publication within the meaning of the statute." (A) is wrong — MPEP § 706.02(a): "A magazine is effective as a printed publication under 35 U.S.C. § 102(b) as of the date it reached the addressee and not the date it was placed in the mail." (B) is wrong — for anticipation predicated on prior knowledge under § 102(a), declassified material may be taken as prima facie evidence as of its PRINTING date even though classified at that time. (D) and (E) are wrong because the AIPA made such references available under § 102(e) against applications filed on or after November 29, 2000 AND applications filed before that date which have been voluntarily published — each answer states only half the rule. [Pre-AIA] — the AIA rewrote § 102 for applications with post-March-2013 filing dates.',
  },
  {
    id: 'uspto-oct02-am-18',
    topicId: 0,
    subtopic: '§ 104 — inventive activity in NAFTA and WTO member countries',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] While traveling through Germany (a WTO member country) in December 1999, Thomas (a Canadian citizen) conceived of binoculars for use in bird watching. The binoculars included a pattern recognition device that recognized birds and would display pertinent information on a display. Upon Thomas’ return to Canada (a NAFTA country) in January 2000, he enlisted his brothers Joseph and Roland to help him market the product under the tradename "Birdoculars." On February 1, 2000, without Thomas’ knowledge or permission, Joseph anonymously published a promotional article written by Thomas and fully disclosing how the Birdoculars were made and used. The promotional article was published in the Saskatoon Times, a regional Canadian magazine that is also widely distributed in the United States. Thomas first reduced the Birdoculars to practice on March 17, 2000 in Canada. A United States patent application properly naming Thomas as the sole inventor was filed September 17, 2000. That application has now been rejected as being anticipated by the Saskatoon Times article. Which of the following statements is most correct?',
    options: [
      'Thomas can rely on his activities in Canada in establishing a date of invention prior to publication of the Saskatoon Times article.',
      'In a priority contest against another inventor, Thomas can rely on his activities in Canada in establishing a date of invention.',
      'In a priority contest against another inventor, Thomas can rely on his activities in Germany in establishing a date of invention.',
      'Statements (A) and (B) are correct, but statement (C) is incorrect.',
      'Statements (A), (B), and (C) are each correct.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Thomas may rely on activities in BOTH Germany (a WTO member country) and Canada (a NAFTA country) in establishing a date of invention prior to publication of the Saskatoon Times article or in establishing priority. 35 U.S.C. § 104; MPEP § 715.01(c). [Pre-AIA] — § 104\'s geographic rules for proving a date of invention were removed by the AIA\'s first-inventor-to-file system.',
  },
  {
    id: 'uspto-oct02-am-19',
    topicId: 2,
    subtopic: 'Refunds — no "one year from discovery" provision exists',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions of the MPEP Chapter 600?',
    options: [
      'A request for a refund must be filed within two years from the date the fee was paid or, in the case of a fee paid by mistake, within one year from the time the error was discovered.',
      'A change of purpose after the payment of a fee, such as when a party desires to withdraw a patent filing for which the fee was paid, including an application, an appeal or a request for an oral hearing, will not entitle a party to a refund of such fee.',
      'The Office will not refund amounts of twenty-five dollars or less, unless a refund is specifically requested.',
      'Any refund of a fee paid by credit card will be by a credit to the credit card account to which the fee was charged.',
      'When a fee is paid where no fee is required, this is considered to be a fee paid by mistake.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the best answer as there is no provision regarding one year from discovery in 37 C.F.R. § 1.26. As to (B) through (E), see MPEP § 607.02 — the Office WILL refund amounts of twenty-five dollars or less if requested to do so by the applicant.',
  },
  {
    id: 'uspto-oct02-am-20',
    topicId: 1,
    subtopic: 'The Wands factors for undue experimentation',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] There are many factors to be considered when determining whether there is sufficient evidence to support a determination that a disclosure does not satisfy the enablement requirement and whether any necessary experimentation is "undue." Which of the following are among the factors for determining whether necessary experimentation is "undue"?',
    options: [
      'The breadth of the claims.',
      'The nature of the invention.',
      'The state of the prior art.',
      'The level of one of ordinary skill.',
      '(A), (B), (C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). MPEP § 2164.01(a).',
  },
  {
    id: 'uspto-oct02-am-21',
    topicId: 2,
    subtopic: 'Public access to assignment records tied to unpublished applications',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following documents is not open to public inspection?',
    options: [
      'The abandoned parent application of a divisional application. A patent was granted on the divisional application, which refers to the abandoned parent application.',
      'Assignment document relating to both an issued patent and a patent application not published under 35 USC 122(b).',
      'Assignment document relating to a pending reissue application.',
      'Copy of assignment record relating to both a pending patent application and an abandoned patent application not published under 35 USC 122(b).',
      'Assignment document relating to both an abandoned patent application not published under 35 USC 122(b) and a pending reissue application.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. (A) is wrong — 37 C.F.R. § 1.14(e)(2); MPEP § 103: the application files are available upon request because the divisional application refers to the abandoned parent and the divisional issued as a patent, causing the parent to be open to inspection. (B), (C) and (E) are wrong, and (D) is correct. MPEP § 301.01.',
  },
  {
    id: 'uspto-oct02-am-22',
    topicId: 1,
    subtopic: 'A preliminary amendment filed with the application is part of the original disclosure',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with provisions of the MPEP?',
    options: [
      'In return for a patent, the inventor gives a complete disclosure of the invention for which protection is sought.',
      'Amendments filed after the filing date that lack descriptive basis in the original disclosure involve new matter.',
      'If during the course of examination of a patent application, an examiner notes the use of language that could be deemed offensive to any race, religion, sex, ethnic group, or nationality, he or she should object to the use of the language as failing to comply with the Rules of Practice.',
      'The examiner should object to application drawings that include depictions or caricatures that might reasonably be considered offensive to any race, religion, sex, ethnic group or nationality.',
      'Where an amendment is filed with a patent application that has no signed oath or declaration, a subsequently filed oath or declaration must refer to both the application and amendment, but in any case the amendment will not be considered as part of the original disclosure and will be treated as new matter.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is incorrect — and therefore is the answer — because a preliminary amendment may be filed with the original disclosure and WILL be treated as part of the original disclosure. MPEP § 608.04(b). (A) through (D) are all correct statements. See MPEP § 608.',
  },
  {
    id: 'uspto-oct02-am-23',
    topicId: 1,
    subtopic: 'Invoking § 112 ¶ 6 — "means for" plus function, without sufficient structure',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is the best way to recite a claim limitation so that it will be interpreted by the examiner in accordance with 35 USC 112, paragraph 6?',
    options: [
      'dot matrix printer for printing indicia on a first surface of a label.',
      'dot matrix printer means coupled to a computer.',
      'means for printing indicia on a first surface of a label.',
      'printer station for printing indicia on a first surface of a label.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2181 expressly requires that for a claim limitation to be interpreted under 35 U.S.C. § 112, ¶ 6, the limitation must (1) use the phrase "means for", (2) the "means for" must be modified by functional language, and (3) the "means for" must not be modified by sufficient structure for achieving the specified function. Only (C) satisfies all three. (A) is wrong because it does not use "means for" and recites structure ("printer"). (B) is wrong because it modifies the "means" with structure and fails to modify it with functional language. (D) is wrong because it does not use "means for" and recites structure.',
  },
  {
    id: 'uspto-oct02-am-24',
    topicId: 2,
    subtopic: 'Small refunds ARE made on request',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with Office practice under 35 USC 42?',
    options: [
      'The Director may refund any fee paid by mistake or any amount paid in excess of that required.',
      'A change of purpose after the payment of a fee, such as when a party desires to withdraw a patent for which the fee was paid, including an application, an appeal or a request for an oral hearing, will not entitle a party to a refund of such fee.',
      'Even if an applicant specifically requests a refund, the Office will not refund amounts of twenty-five dollars or less.',
      'Any refund of fee paid by credit card will be by a credit to the credit card account to which the fee was charged.',
      'If an applicant mistakenly files an application, the filing fee is not considered a fee paid by mistake.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is incorrect — and therefore is the answer — as the Office WILL refund amounts of twenty-five dollars or less if requested to do so by the applicant. MPEP § 607.02. As to (A), (B), (D) and (E), see MPEP § 607.02.',
  },
  {
    id: 'uspto-oct02-am-25',
    topicId: 0,
    subtopic: 'Rebutting a prima facie case — objective evidence, not attorney argument',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] If a prima facie case of obviousness is properly established by a primary examiner, how can an applicant effectively rebut the rejection in accordance with proper USPTO practice and procedure?',
    options: [
      'Rebuttal may be by way of arguments of counsel used in place of factually supported objective evidence to rebut the prima facie case.',
      'Rebuttal may be by way of an affidavit or declaration under 37 CFR 1.132 containing objective evidence arising out of a secondary consideration related to the claimed invention.',
      'No substantive showing is required by applicant. The burden remains on the examiner to maintain a prima facie case.',
      'Rebuttal evidence must be found elsewhere than in the specification.',
      'Rebuttal may be by way of arguing that the prior art did not recognize latent properties.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 716.01(a) — affidavits or declarations containing objective evidence of criticality, unexpected results, commercial success, long-felt but unsolved needs, failure of others, or skepticism of experts is considered by an examiner. (A) is incorrect: arguments of counsel cannot take the place of factually supported objective evidence. In re Schulze, 346 F.2d 600, 602 (CCPA 1965); MPEP §§ 716.01(c), 2145(I). (C) is incorrect: the burden SHIFTS to the applicant to come forward with arguments and/or evidence. In re Hoeksema, 399 F.2d 269 (CCPA 1968); MPEP § 2145. (D) is incorrect. In re Soni, 54 F.3d 746, 750 (Fed. Cir. 1995); MPEP § 2144.05. (E) is incorrect: mere recognition of latent properties in the prior art does not render a known invention unobvious. In re Wiseman, 596 F.2d 1019 (CCPA 1979); MPEP § 2145(II). [Pre-AIA] — decided under pre-AIA § 103.',
  },
  {
    id: 'uspto-oct02-am-26',
    topicId: 1,
    subtopic: 'The abstract must not compare the invention with the prior art',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the recommended form for an abstract of the disclosure as provided for in the MPEP?',
    options: [
      'A patent abstract is a concise statement of the technical disclosure of the patent and should include that which is new in the art to which the invention pertains.',
      'If the patent is of a basic nature, the entire technical disclosure may be new in the art, and the abstract should be directed to the entire disclosure.',
      'If the patent is in the nature of an improvement in an old apparatus, process, product, or composition, the abstract should include the technical disclosure of the improvement.',
      'In certain patents, particularly those for compounds and compositions, wherein the process for making and/or the use thereof are not obvious, the abstract should set forth a process for making and/or a use thereof.',
      'The abstract should compare the invention with the prior art.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). The abstract should NOT compare the invention with the prior art. MPEP § 608.01(b). As to (A) through (C), see MPEP § 608.01(b). As to (D), when the process for making is not obvious, the process should be set forth in the abstract.',
  },
  {
    id: 'uspto-oct02-am-27',
    topicId: 0,
    subtopic: 'The four Graham v. John Deere factual inquiries',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Office policy has consistently been to follow Graham v. John Deere Co., 383 U.S. 1, 148 USPQ 459 (1966), in the consideration and determination of obviousness under 35 USC 103. Each of the following are the four factual inquires enunciated therein as a background for determining obviousness except:',
    options: [
      'Determining the scope and contents of the prior art.',
      'Resolving any issue of indefiniteness in favor of clarity.',
      'Ascertaining the differences between the prior art and the claims in issue.',
      'Resolving the level of ordinary skill in the pertinent art.',
      'Evaluating evidence of secondary considerations.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). 35 U.S.C. § 103; Graham v. John Deere Co., 383 U.S. 1, 148 USPQ 459 (1966); MPEP § 2141. Resolving any issue of indefiniteness in favor of clarity is NOT among the factual inquiries enunciated in Graham. The four factual inquiries are set forth in answers (A), (C), (D) and (E).',
  },
  {
    id: 'uspto-oct02-am-28',
    topicId: 1,
    subtopic: 'Improper multiple dependent wording — "as in the preceding claims"',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Claims 1 and 2, fully disclosed and supported in the specification of a patent application having an effective filing date of March 15, 2000, for sole inventor Ted, state: "Claim 1. An apparatus intended to be used for aerating water in a fish tank, comprising: (i) an oxygen source connected to a tube, and (ii) a valve connected to the tube. Claim 2. An apparatus as in claim 1, further comprising an oxygen sensor connected to the valve." Which of the following claims, if fully disclosed and supported in the specification, and included in the application, provides a proper basis for an objection under 37 CFR 1.75(c)?',
    options: [
      'Claim 3. An apparatus as in any one of the preceding claims, in which the tube is plastic.',
      'Claim 3. An apparatus according to claims 1 or 2, further comprising a temperature sensor connected to the valve.',
      'Claim 3. An apparatus as in the preceding claims, in which the tube is plastic.',
      'Claim 3. An apparatus as in any preceding claim, in which the tube is plastic.',
      'Claim 3. An apparatus as in either claim 1 or claim 2, further comprising a temperature sensor connected to the valve.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. Claim 3 in (C) employs improper multiple dependent claim wording — "as in the preceding claims" is conjunctive rather than alternative. MPEP § 608.01(n)(I)(B). (A), (B), (D) and (E) are incorrect as each uses ACCEPTABLE multiple dependent claim wording. MPEP § 608.01(n)(I)(A).',
  },
  {
    id: 'uspto-oct02-am-29',
    topicId: 0,
    subtopic: 'Intended-use preamble carries no patentable weight; § 102(b) statutory bar',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Referring to Ted’s application (effective filing date March 15, 2000) with Claim 1 to an apparatus for aerating water in a fish tank and Claim 2 adding an oxygen sensor connected to the valve: which of the following, if relied on by an examiner in a rejection of claim 2, can be a statutory bar under 35 USC 102 of claim 2?',
    options: [
      'A U.S. patent to John, issued February 2, 1999, that discloses and claims an apparatus intended to be used for aerating ice cream, having an oxygen source connected to a tube, a valve connected to the tube, and a battery coupled to the oxygen source.',
      'A U.S. patent to John, issued April 6, 1999, that discloses and claims an apparatus intended to be used for aerating water in a fish tank, having an oxygen source connected to a tube, a valve connected to the tube, and an oxygen sensor connected to the tube.',
      'A U.S. patent to Ned, issued February 9, 1999, that discloses, but does not claim, an apparatus intended to be used for aerating ice cream, having an oxygen source connected to a tube, a valve connected to the tube, an oxygen sensor connected to the valve, and a battery coupled to the oxygen source.',
      'A foreign patent to Ted issued April 12, 2000, on an application filed on March 12, 1997. The foreign patent discloses and claims an apparatus intended to be used for aerating water in a fish tank, having an oxygen source connected to a tube, a valve connected to the tube, and an oxygen sensor connected to the tube.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 102(b). MPEP § 2111.02 provides that the preamble generally is not accorded patentable weight where it merely recites the INTENDED USE of a structure — so the "aerating ice cream" preamble does not distinguish. (A) is incorrect because it does not disclose an oxygen sensor. (B) is incorrect because the patent is not more than one year prior to the date of Ted\'s application. (D) is incorrect because the foreign patent issued AFTER the date of Ted\'s application. 35 U.S.C. § 102(d). (E) is incorrect because (C) is correct. [Pre-AIA] — decided under pre-AIA §§ 102(b) and 102(d).',
  },
  {
    id: 'uspto-oct02-am-31',
    topicId: 1,
    subtopic: 'Acceptable multiple dependent claim forms are alternative in wording',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Assuming that each of the following claims is in a separate application, and there is no preceding multiple dependent claim in any of the applications, which claim is in acceptable multiple dependent claim form?',
    options: [
      'Claim 8. A machine according to any one of the preceding claims wherein…',
      'Claim 5. A device as in one of claims 1-4, wherein…',
      'Claim 10. A device as in any of claims 1-4 or 6-9, in which…',
      'Claim 4. A machine according to claim 2 or 3, also comprising…',
      'The claim form in (A), (B), (C) and (D) is acceptable.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because 35 U.S.C. § 112 authorizes multiple dependent claims as long as they are in the ALTERNATIVE form, and each of (A) through (D) is. MPEP § 608.01(n)(I)(A).',
  },
  {
    id: 'uspto-oct02-am-32',
    topicId: 0,
    subtopic: 'Product-by-process patentability turns on the product, not the process steps',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A product-by-process claim is properly rejected over a reference under 35 USC 102(b). Which of the following statements is incorrect?',
    options: [
      'There is no anticipation unless each of the process steps recited in the claim is disclosed or inherent in the applied reference.',
      'If the applied reference reasonably indicates that a product disclosed therein is the same or substantially the same as the claimed product, the burden shifts to the applicant to provide evidence to the contrary.',
      'The rejection cannot be overcome by evidence of unexpected results.',
      'The rejection can be overcome by evidence that the product in the reference does not necessarily or inherently possess a characteristic of the applicant’s claimed product.',
      'An affidavit or declaration under 37 CFR 1.131 cannot overcome a proper rejection under 35 USC 102(b) over a reference.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it is the INCORRECT statement. The patentability of a product-by-process claim is determined based on the PRODUCT itself, not on the process of making it. In re Thorpe, 777 F.2d 695, 697 (Fed. Cir. 1985); MPEP § 2113. (B) and (D) are proper statements: when the evidence indicates the products are identical or substantially identical, the burden shifts to applicant to show the prior art product does not necessarily or inherently possess the relied-upon characteristic. In re Fitzgerald, 619 F.2d 67, 70 (CCPA 1980); In re Best, 562 F.2d 1252, 1255 (CCPA 1977); MPEP § 2112. (C) is a proper statement: evidence of unexpected results is not relevant to anticipation. In re Malagari, 499 F.2d 1297, 1302 (CCPA 1974). (E) is a proper statement: a § 102(b) rejection is a statutory bar, and 37 C.F.R. § 1.131(a)(2) bars using § 1.131 against one. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct02-am-33',
    topicId: 3,
    subtopic: 'Examiner’s amendment after a complete first reply within 2 months of final',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Xavier files a complete first reply exactly 2 months after the mailing date of a final Office action which sets a 3 month shortened statutory period for reply. An Examiner’s Amendment is necessary for the purpose of placing the application in condition for allowance. Which of the following statements is true?',
    options: [
      'If the Examiner’s Amendment is mailed exactly 5 months after Xavier’s reply, the application will be allowed.',
      'The Examiner’s Amendment must be made within the 3 month shortened statutory period of the final Office action to avoid abandonment of the application.',
      'If the Examiner’s Amendment is made exactly 4 months after Xavier’s reply, the application will be allowed.',
      'The Examiner’s Amendment may be made at any time within 6 months of Xavier’s reply to avoid abandonment.',
      'Abandonment of the application will be avoided if Xavier accompanies his reply with a request for extension of time accompanied by the proper fee and the Examiner’s Amendment is made within 6 months of Xavier’s reply.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct and (B) is wrong because MPEP § 706.07(f)(H) states, "Where a complete first reply to a final Office action has been filed within 2 months of the final Office action, an examiner\'s amendment to place the application in condition for allowance may be made without the payment of extension fees even if the examiner\'s amendment is made more than 3 months from the date of the final Office action." (A), (D) and (E) are wrong because "an examiner\'s amendment may not be made more than 6 months from the date of the FINAL OFFICE ACTION, as the application would be abandoned at that point by operation of law" — in (A), an amendment mailed 5 months after the reply falls more than 6 months after the Office action.',
  },
  {
    id: 'uspto-oct02-am-34',
    topicId: 2,
    subtopic: 'Notice of Omitted Items — accepting the application as filed keeps the filing date',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Jane files a nonprovisional application with the USPTO containing at least one drawing figure under 35 USC 113 (first sentence) and at least one claim. Subsequently, Jane receives a "Notice of Omitted Items" from the USPTO indicating that the application which Jane filed lacks page 5 of the specification. Assuming that the application without page 5 satisfies 35 USC 112, which of the following statements is true based on proper USPTO practice and procedure?',
    options: [
      'If Jane is willing to accept the application as filed, she need not respond to the Notice, and the Office will accord the filing date of the original application. Jane will need to file an amendment renumbering the pages consecutively and canceling incomplete sentences caused by the missing page 5.',
      'Jane must promptly submit the omitted page and accept an application filing date as of the date of submission of the omitted page.',
      'Jane must promptly submit the omitted page and will be accorded a filing date as of the date of filing the original application.',
      'Within 3 months of the Notice date, Jane must file an affidavit asserting that page 5 was in fact deposited in the USPTO with the original application. Jane will be accorded the filing date of the original application.',
      'Within 3 months of the Notice date, Jane must file a proper petition asserting that page 5 was in fact deposited in the USPTO with the original application, accompanied by the proper petition fee and evidence that page 5 was in fact deposited as alleged. Jane will be accorded the original filing date of the application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is correct and (B), (C), (D) and (E) are wrong. MPEP § 601.01(d).',
  },
  {
    id: 'uspto-oct02-am-35',
    topicId: 1,
    subtopic: 'Original claims are part of the disclosure — the drawing is defective, not the claim',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Where subject matter for which there is an enabling disclosure, but is not shown in the drawing or described in the detailed description preceding the claim(s), which of the following is not in accordance with the provisions of the MPEP?',
    options: [
      'In establishing a disclosure, applicant may rely not only on the description and drawing as filed but also on the original claims to show compliance with the first paragraph of 35 USC 112.',
      'Where subject matter not shown in the drawing or described in the description is claimed in the application as filed, and such original claim itself constitutes a clear disclosure of this subject matter, then the claim should be treated on its merits, and the applicant should be required to amend the drawing and description to show this subject matter.',
      'If subject matter appearing in the original claim is not found in the drawing or detailed description, the claim should be rejected for noncompliance with the first paragraph of 35 USC 112.',
      'If the subject matter found in the claim is lacking in the drawing or detailed description, it is the drawing and description that are defective, not the claim.',
      'The subject matter found in the original claims, but lacking in the drawing or detailed description, must be sufficiently specific and detailed to support an amendment of the drawing and detailed description.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). According to MPEP § 608.01(l), "[t]he claim should not be attacked either by objection or rejection because this subject matter is lacking in the drawing and description." As to (A), (B), (D) and (E), see MPEP § 608.01(l).',
  },
  {
    id: 'uspto-oct02-am-36',
    topicId: 1,
    subtopic: '"Consisting of" in the parent bars a dependent claim from adding a step',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] A patent application filed in the USPTO contains the following dependent claim: "Claim 2. The method of Claim 1, further consisting of the step of cooling the mixture to a temperature of 32° F." Following proper USPTO practices and procedures, from which of the following claims does Claim 2 not properly depend?',
    options: [
      'Claim 1. A method of making liquid compound A consisting of the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A comprising the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A including the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A characterized by the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '(C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. The phrase "consisting of" excludes any step not specified in the claim, so a claim depending from a claim which "consists of" the recited steps cannot ADD a step — and here the dependent claim adds cooling. MPEP § 2111.03. (B) is incorrect because the transitional term "comprising" is inclusive or open-ended. (C) and (D) are incorrect because "including" and "characterized by" are synonymous with "comprising." (E) is incorrect because (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-oct02-am-37',
    topicId: 1,
    subtopic: 'A non-compliant abstract is fixed by examiner’s amendment, not an Ex parte Quayle action',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions of the MPEP regarding an abstract of the disclosure?',
    options: [
      'The abstract of the disclosure has been interpreted to be a part of the specification for the purpose of compliance with paragraph 1 of 35 USC 112.',
      'Any submission of a new abstract of the disclosure or amendment to an existing abstract should be carefully reviewed for introduction of new matter.',
      'If an application is otherwise in condition for allowance except that the abstract of the disclosure does not comply with the guidelines, the examiner generally cannot make any necessary revisions by examiner’s amendment, but should instead issue an Ex parte Quayle action requiring applicant to make the necessary revisions.',
      'Under current practice, in all instances where the application contains an abstract of the disclosure when sent to issue, the abstract will be printed on the patent.',
      'The content of a patent abstract should be such as to enable the reader thereof, regardless of his or her degree of familiarity with patent documents, to ascertain quickly the character of the subject matter covered by the technical disclosure and should include that which is new in the art to which the invention pertains.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). As indicated in MPEP § 608.01(b), if an application is otherwise in condition for allowance except that the abstract does not comply with the guidelines, the examiner generally SHOULD make any necessary revisions by examiner’s amendment rather than issuing an Ex parte Quayle action. As to (A), (B), (D) and (E), see MPEP § 608.01(b).',
  },
  {
    id: 'uspto-oct02-am-38',
    topicId: 0,
    subtopic: 'Printed-publication proof — a laid-open Japanese application more than a year before filing',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Applicant files an application claiming a nutritional supplement comprising ingredients (1) through (9) on September 6, 2001. The examiner’s search on November 12, 2001 retrieved several documents, each of which provides an enabling disclosure of a nutritional supplement comprising ingredients (1) through (9). Which of the following documents retrieved by the examiner may be properly used by the examiner to reject applicant’s claims under 35 USC 102(b)?',
    options: [
      'An advertisement in the September 2000 issue of Dieticians and Nutritionists Health Weekly where the examiner is not able to determine the actual date of publication.',
      'A printout on November 12, 2001 by the examiner of a MEDLINE database abstract 123456 of an article by Food et al., "Nutritional supplements for infants," published in Azerbijan Pediatrics, Vol. 33, No. 8, pp. 33-37 (September 2000). The printout does not include the date on which the MEDLINE abstract was publicly posted.',
      'A printout, on November 12, 2001 by the examiner, of a product brochure from the Internet website of PRO-BIOTICS VITAMIN CORP. The examiner determines that the brochure was posted on September 7, 2000 on the website.',
      'A Japanese patent application published on September 1, 2000.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. A reference is a "printed publication" if one of ordinary skill in the art can locate it with reasonable diligence; its availability under § 102(b) depends on proof of when it was published or became publicly accessible. (D) is correct because the Japanese application was published — "laid open" — more than 1 year before applicant\'s filing date. (C) is incorrect because it was posted less than one year before the filing date. (B) is incorrect because the retrieval date is after the filing date, the printout lacks the public-posting date, and reliance is on the printout rather than the actual article. (A) is incorrect because there is no evidence of when the journal was publicly available. (E) is incorrect because (A), (B) and (C) are incorrect. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-oct02-am-39',
    topicId: 2,
    subtopic: 'A CIP must be filed before PATENTING of the parent, not before allowance',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not in accordance with the provisions in the MPEP?',
    options: [
      'A continuation-in-part is an application filed during the lifetime of an earlier nonprovisional application by the same applicant, which repeat either some substantial portion or all of the earlier nonprovisional application, and adds matter not disclosed in the said earlier nonprovisional application.',
      'A continuation-in-part application may only be filed under 37 CFR 1.53(b).',
      'A continuation-in-part application cannot be filed as a continued prosecution application (CPA) under 37 CFR 1.53(d).',
      'An application claiming the benefits of a provisional application under 35 USC 119(e) should not be called a "continuation-in-part" of the provisional application.',
      'One of the formal requirements of 35 USC 120 is that a continuation-in-part application must be "filed before a notice of allowance or abandonment is mailed in the prior application."',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). It is not in accord with MPEP § 201.08 since the application need not be filed before a notice of allowance, but instead before PATENTING of the first application. (A) through (C) are found in MPEP § 201.08. As to (D), calling the application a continuation-in-part of a provisional would cause its patent term to be calculated from its own filing date; an application filed under 35 U.S.C. §§ 120, 121 or 365(c) has its term calculated from the earliest application\'s filing date. 35 U.S.C. § 154(a)(2) and (a)(3). [Historical practice] — CPA practice for utility applications was eliminated in 2003.',
  },
  {
    id: 'uspto-oct02-am-40',
    topicId: 1,
    subtopic: 'There is no recommended maximum number of dependent claims',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following is not a USPTO recommendation or requirement?',
    options: [
      'Product and process claims should be separately grouped.',
      'Claims should be arranged in order of scope so that the first claim presented is the least restrictive.',
      'Every application should contain no more than three dependent claims.',
      'A claim which depends from a dependent claim should not be separated from that dependent claim by any claim which does not also depend from the dependent claim.',
      'Each claim should start with a capital letter and end with a period.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. The USPTO does not require or recommend a minimum or maximum number of dependent claims. 37 C.F.R. § 1.75(c). (A) and (B) are USPTO recommendations — MPEP § 608.01(m) ("product and process claims should be separately grouped"; "[c]laims should preferably be arranged in order of scope so that the first claim presented is the least restrictive"). (D) is a recommendation — MPEP § 608.01(n)(IV). (E) is a requirement — MPEP § 608.01(m) ("Each claim begins with a capital letter and ends with a period.").',
  },
  {
    id: 'uspto-oct02-am-41',
    topicId: 1,
    subtopic: 'A multiple dependent claim takes only the limitations of the claim referred to',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The following statements relate to "multiple dependent claims." Which statement is not in accord with proper USPTO practice and procedure?',
    options: [
      'A multiple dependent claim contains all the limitations of all the alternative claims to which it refers.',
      'A multiple dependent claim contains in any one embodiment only those limitations of the particular claim referred to for the embodiment under consideration.',
      'A multiple dependent claim must be considered in the same manner as a plurality of single dependent claims.',
      'Restriction may be required between the embodiments of a multiple dependent claim.',
      'The limitations or elements of each claim incorporated by reference into a multiple dependent claim must be considered separately.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer — it is inconsistent with 35 U.S.C. § 112 and MPEP § 608.01(n)(I)(B)(4). A multiple dependent claim does not take ALL the limitations of ALL the alternatives at once; in any one embodiment it takes only those of the particular claim referred to. (B), (C) and (E) are wrong answers because they are CONSISTENT with § 112 and MPEP § 608.01(n)(I)(B)(4). (D) is wrong because it is consistent with MPEP § 608.01(n)(I)(C).',
  },
  {
    id: 'uspto-oct02-am-42',
    topicId: 2,
    subtopic: 'A reply filed one day after the shortened period needs an extension',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Absent a Certificate of Mailing or Transmission, or use of Express Mail, which of the following actions requires a petition for an extension of time and the appropriate fee?',
    options: [
      'Applicant’s complete first reply to a final Office action filed on the first day following the end of a shortened statutory period for reply. The Shortened Statutory Period ended on a Wednesday that was not a federal holiday, and the Office is open.',
      'Interview with examiner conducted after the expiration of the shortened statutory period for reply to a final Office action, but within the 6 months statutory period.',
      'Action by applicant to correct formal matters identified for the first time after a reply was made to a final Office action in an Ex parte Quayle action where the application is otherwise in condition for allowance.',
      'Applicant’s complete first reply to a final Office action filed within 2 months of the final Office action setting a 3 month shortened statutory period for reply.',
      'Applicant’s complete first reply to an Office action on the last day of a shortened statutory period for reply, where the Office action withdraws the finality of a previous Office action in view of a new ground of rejection.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is correct. MPEP § 706.07(f), paragraph (I). (B) is wrong — MPEP § 706.07(f), paragraph (M). (C) is wrong — paragraph (N). (D) is wrong — paragraph (H). (E) is wrong — paragraph (O).',
  },
  {
    id: 'uspto-oct02-am-43',
    topicId: 3,
    subtopic: 'Indefinite limitations must be considered, not disregarded',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Upon examination of your client’s patent application, the patent examiner is considering whether and what rejections to apply to the claims. One or more of the limitations in the claims is indefinite or lacks supporting disclosure. The examiner may not properly take which of the following actions or inactions?',
    options: [
      'If the claim is subject to plural interpretations due to a limitation being indefinite, the examiner may disregard any possibility of multiple interpretations.',
      'If a claim is subject to more than one interpretation due to a limitation being indefinite, at least one of which would render the claim unpatentable over the prior art, the examiner should reject the claim as indefinite under 35 USC 112, second paragraph, and should reject the claim over the prior art based on the interpretation of the claim that renders the prior art applicable.',
      'If no reasonably definite meaning can be ascribed to certain claim language, the examiner should reject the claim as indefinite under 35 USC 112, second paragraph, and not reject the claim as obvious.',
      'When evaluating claims for obviousness under 35 USC 103, all the limitations of the claims, including new matter lacking supporting disclosure in the originally filed specification, must be considered and given weight.',
      '(C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). MPEP § 2143.03 ("Indefinite Limitations Must Be Considered"). (B) is not correct because it IS proper examiner procedure. Ex parte Ionescu, 222 USPQ 537 (Bd. Pat. App. & Inter. 1984). (C) is not correct because it is proper procedure. In re Wilson, 165 USPQ 494 (CCPA 1970) (if no reasonably definite meaning can be ascribed to certain claim language, the claim is indefinite, not obvious). (D) is not correct because it is proper procedure. Ex parte Grasselli, 231 USPQ 393 (Bd. App. 1983), aff\'d mem., 738 F.2d 453 (Fed. Cir. 1984). (E) is incorrect because the examiner may properly take the actions in (B), (C) and (D).',
  },
  {
    id: 'uspto-oct02-am-44',
    topicId: 3,
    subtopic: 'After final, only a reply complying with a requirement of form is entered as of right',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Jack, a registered patent agent, received a final rejection of all of the claims in an application directed to an article of manufacture. Jack is about to file a timely Notice of Appeal to the Board of Patent Appeals and Interferences. Before filing his notice of appeal, Jack would like to tie up some loose ends by amendment. Which of the following reply (replies) may he file without triggering the requirements of 37 CFR 1.116(b)?',
    options: [
      'A reply that presents his argument in a more defensible light and adds additional claims.',
      'A reply amending the claims into process claims.',
      'A reply amending all of the independent claims, accompanied by a declaration from the inventor.',
      'A reply complying with a requirement of form expressly set forth in the previous Office action.',
      '(A) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.116; MPEP § 714.13, "Entry Not Matter of Right." The reply in (D) is one permitted to be made under 37 C.F.R. § 1.116(a). (A), (B) and (C) are directed to the MERITS of the application and are not in accord with § 1.116(a).',
  },
  {
    id: 'uspto-oct02-am-45',
    topicId: 2,
    subtopic: 'A recorded assignment of the parent reaches the divisional; § 261 constructive notice',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] John filed a nonprovisional patent application in the USPTO claiming two distinct inventions, a combination and a subcombination. At the time of filing the nonprovisional application, he recorded an assignment of all right, title, and interest in the inventions claimed in the application to ABC Corporation. In the first Office action, the examiner required restriction, and John elected the combination. A year later, during the pendency of the nonprovisional application, John filed a divisional patent application claiming the subcombination. At the time of filing the divisional application, John assigned all right, title, and interest in the inventions claimed in the divisional application to XYZ Corporation, and the latter party recorded the assignment within three months of the assignment. Following recordation of the assignment to XYZ Corporation, which of the following statements is false?',
    options: [
      'The Office should treat John as having no ownership rights in the combination.',
      'The Office should treat John as having no ownership rights in the subcombination.',
      'ABC Corporation has no ownership rights in the subcombination.',
      'XYZ Corporation has no ownership rights in the combination.',
      'XYZ Corporation has no ownership rights in the subcombination.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is a FALSE statement and therefore the correct answer. Under 35 U.S.C. § 261, "An assignment, grant, or conveyance shall be void as against any subsequent purchaser or mortgagee for a valuable consideration, without notice, unless it is recorded in the Patent and Trademark Office within three months from its date or prior to the date of such subsequent purchase or mortgage." ABC Corporation acquired all of John\'s ownership rights in the original application, including the subcombination, and recorded before XYZ\'s acquisition — giving XYZ constructive notice. MPEP § 306: in the case of a division, a prior assignment recorded against the original application applies to the division because it gives the assignee rights to the subject matter common to both. (A) and (B) are TRUE statements and therefore wrong answers: John gave up his rights on assigning to ABC. (D) and (E) are true and therefore wrong because XYZ acquired no rights in either application.',
  },
  {
    id: 'uspto-oct02-am-46',
    topicId: 2,
    subtopic: 'Third-party submission — two months from publication or before allowance, whichever is EARLIER',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] Which of the following statements relevant to a third party submission in a published patent application accords with proper USPTO practice and procedure?',
    options: [
      'A submission of patents by a member of the public must be made within 2 months of the date of publication of the application.',
      'A submission of patents by a member of the public must be made prior to the mailing of a Notice of Allowance.',
      'A submission of patents by a member of the public must be made within 2 months of the date of publication of the application or prior to the mailing of a Notice of Allowance, whichever is later.',
      'A submission of patents by a member of the public must be made within 2 months of the date of publication of the application or prior to the mailing of a Notice of Allowance, whichever is earlier.',
      'Any submission not filed within the period set forth in the patent rules will be accepted provided it is accompanied by the processing fee set forth in 37 CFR 1.17(i).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct. 37 C.F.R. § 1.99(e): "A submission under this section must be filed within two months from the date of publication of the application (§ 1.215(a)) or prior to the mailing of a notice of allowance (§ 1.311), whichever is EARLIER." Answers (A), (B) and (C) are therefore incorrect. (E) is wrong because § 1.99(e) recites that a non-complying submission "will be returned or discarded." [Historical practice] — the AIA replaced § 1.99 with the current 37 C.F.R. § 1.290 preissuance-submission practice.',
  },
  {
    id: 'uspto-oct02-am-47',
    topicId: 1,
    subtopic: 'Rebutting non-enablement with factual evidence, not counsel argument or opinion',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] An examiner has advanced a reasonable basis for questioning the adequacy of the enabling disclosure in the specification of your client’s patent application, and has properly rejected all the claims in the application. The claims in the application are drawn to a computer program system. In accordance with proper USPTO practice and procedure, the rejection should be overcome by submitting _____________',
    options: [
      'factual evidence directed to the amount of time and effort and level of knowledge required for the practice of the invention from the disclosure alone.',
      'arguments by you (counsel) alone, inasmuch as they can take the place of evidence in the record.',
      'an affidavit under 37 CFR 1.132 by an affiant, who is more than a routineer in the art, submitting few facts to support his conclusions on the ultimate legal question of sufficiency, i.e., that the system "could be constructed."',
      'opinion evidence directed to the ultimate legal issue of enablement.',
      'patents to show the state of the art for purposes of enablement where these patents have an issue date later than the effective filing date of the application under consideration.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). MPEP § 2106.02 ("Affidavit Practice"). Factual evidence directed to the amount of time and effort and level of knowledge required for the practice of the invention from the disclosure alone can rebut a prima facie case of non-enablement. Hirschfield v. Banner, 200 USPQ 276, 281 (D.D.C. 1978). (B) is not correct — arguments of counsel cannot take the place of evidence. In re Budnick, 190 USPQ 422, 424 (CCPA 1976); In re Schulze, 145 USPQ 716 (CCPA 1965). (C) is not correct — conclusory affidavits carry little weight. In re Brandstadter, 179 USPQ 286 (CCPA 1973). (D) is not correct — opinion on the ultimate legal issue does not suffice. (E) is not correct — MPEP § 2106.02 ("Referencing Prior Art Documents"); In re Gunn, 190 USPQ 402, 406 (CCPA 1976).',
  },
  {
    id: 'uspto-oct02-am-48',
    topicId: 3,
    subtopic: 'Obviousness-type double patenting uses the full Graham inquiry',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] The MPEP and USPTO rules and procedure set out factual inquiries that are employed when making an obviousness-type double patenting analysis. Which of the following is not a factual inquiry that would be properly employed when making an obviousness-type double patenting determination with regard to a pending application vis-a-vis a claim in an issued patent?',
    options: [
      'Determine the level of ordinary skill in the pertinent art.',
      'Determine the scope and content of a patent claim and the prior art relative to a claim in the application at issue.',
      'Evaluate any objective indicia of nonobviousness of the claim of the application at issue.',
      'Determine the differences between the scope and content of: the patent claim and the prior art determined in choice (B) above and the claim in the application at issue.',
      'None of the above (that is, each of the above factual inquiries is properly employed when making an obviousness-type double patenting determination with regard to an issued patent).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (E) is the correct answer. MPEP § 804(II)(B)(1): "Since the analysis employed in an obviousness-type double patenting determination parallels the guidelines for a 35 U.S.C. § 103(a) rejection, the factual inquiries set forth in Graham v. John Deere Co., 383 U.S. 1 (1966)… are employed when making an obvious-type double patenting analysis." Each of (A), (B), (C) and (D) is incorrect because each IS a Graham factual inquiry.',
  },
  {
    id: 'uspto-oct02-am-49',
    topicId: 2,
    subtopic: 'Facsimile filing — a CPA with an authorization to charge is permitted',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] In accordance with the MPEP and USPTO rules and procedure, correspondence transmitted to the USPTO by facsimile is not permitted in certain situations. Which of the following facsimile transmissions to the USPTO will be accorded a date of receipt by the USPTO?',
    options: [
      'Facsimile transmission of a request for reexamination under 37 CFR 1.510 or 1.913.',
      'Facsimile transmission of drawings submitted under 37 CFR 1.81, 1.83 through 1.85, 1.152, 1.165, 1.174, or 1.437.',
      'Facsimile transmission of a response to a Notice of Incomplete Nonprovisional Application for the purpose of obtaining an application filing date.',
      'Facsimile transmission of a correspondence to be filed in a patent application subject to a secrecy order under 37 CFR 5.1 through 5.5 and directly related to the secrecy order content of the application.',
      'Facsimile transmission of a continued prosecution application under 37 CFR 1.53(d) and an authorization to charge the basic filing fee to a deposit account.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Choice (E) is the correct answer. MPEP § 502.01; 37 C.F.R. § 1.6(d)(3). MPEP § 502.01: "The date of receipt accorded to any correspondence permitted to be sent by facsimile transmission, including a continued prosecution application (CPA) filed under 37 C.F.R. § 1.53(d), is the date the complete transmission is received by an Office facsimile unit… An applicant filing a CPA by facsimile transmission must include an authorization to charge the basic filing fee to a deposit account or to a credit card." (A) is barred by § 1.6(d)(5); (B) by § 1.6(d)(4); (C) by § 1.6(d)(3) read with § 1.8(a)(2)(i)(A) (correspondence for the purpose of obtaining a filing date); and (D) by § 1.6(d)(6) (secrecy-order correspondence). [Historical practice] — CPA practice for utility applications was eliminated in 2003.',
  },
  {
    id: 'uspto-oct02-am-50',
    topicId: 5,
    subtopic: 'Broadening reissue — intent to broaden must be indicated within two years',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2002] If a reissue application is filed within two years of the original patent grant, the applicant may subsequently broaden the claims during prosecution of the pending reissue prosecution beyond the two year limit, ________________________________.',
    options: [
      'if the applicant indicates in the oath accompanying the reissue application that the claims will be broadened.',
      'if an intent to broaden is indicated in the reissue application at any time within three years from the patent grant.',
      'if the reissue application is filed on the 2-year anniversary date from the patent grant, even though an intent to broaden the claims was not indicated in the application at that time.',
      'if the reissue application is a continuing reissue application of a parent reissue application, and neither reissue application contained an indication of an intent to broaden the claims until 4 years after the patent grant..',
      'provided, absent any prior indication of intent to broaden, an attempt is made to convert the reissue into a broadening reissue concurrent with the presentation of broadening claims beyond the two year limit.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is correct. MPEP § 1412.03; In re Doll, 164 USPQ 218, 220 (CCPA 1970). (B) is wrong because 35 U.S.C. § 251 prescribes a 2-year limit for filing broadening reissues. (C) is wrong because although Switzer v. Sockman, 142 USPQ 226 (CCPA 1964), holds that a reissue filed ON the 2-year anniversary is filed within two years, it is still necessary that an intent to broaden be indicated within those two years. (D) is wrong because a proposal for broadened claims must be made in the PARENT reissue application within two years from the grant. In re Graff, 42 USPQ2d 1471, 1473-74 (Fed. Cir. 1997). (E) is wrong because there was no intent to broaden indicated within the two years. In re Fotland, 228 USPQ 193 (Fed. Cir. 1985).',
  },
];

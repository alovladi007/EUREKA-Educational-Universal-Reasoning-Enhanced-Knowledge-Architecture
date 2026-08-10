/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — November 3, 1999, AFTERNOON (PM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo9911pq.pdf / edo9911pa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files in this directory):
 *  - Stems and options are VERBATIM, in the official order (A)-(E).
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * KEYS COME FROM `npm run audit:uspto`, NOT FROM A HAND PASS. This matters
 * here more than anywhere else in the bank: an earlier hand extraction of this
 * exact file produced a key list that was WRONG THROUGHOUT — it gave Q1 as (D)
 * where the source plainly reads "1. ANSWER: (A)", because citation lines were
 * being read as answer entries. That list was never transcribed, but it looked
 * entirely plausible. Re-run the script rather than trusting any notes.
 *
 * DISCARDED: Q39 only — "ANSWER: All answers accepted." 49 of the 50 delivered
 * questions are scoreable.
 *
 * MULTI-KEYED: none.
 *
 * FORMAT NOTE: Q40's answer line reads "40. ANSWER: (C )." with a space inside
 * the parenthesis — a pdftotext artifact that made the item unparseable until
 * the audit script was taught to tolerate inner whitespace.
 *
 * ERA NOTES. This paper predates the AIA by twelve years. Items turning on
 * pre-AIA § 102/§ 103 carry [Pre-AIA]; superseded procedure carries
 * [Historical practice]. Specifically:
 *  - Q3 and Q46 concern practice that no longer exists: the Continued
 *    Prosecution Application (CPA) was eliminated for utility applications in
 *    2003 in favour of the RCE, and 37 C.F.R. § 1.129(a) was a transitional
 *    rule for applications pending on 8 June 1995.
 *  - Q9, Q30 and Q7 sit under the 37 C.F.R. Part 10 conduct regime, replaced
 *    in 2013 by the Part 11 Rules of Professional Conduct.
 *  - Q17 applies the pre-2003 § 1.121 amendment format.
 *  - Q31's § 102(e) date for a national-stage application turns on the
 *    pre-AIA § 102(e); the AIA rewrote this entirely.
 *  - Q21's confidentiality answer predates 18-month pre-grant publication
 *    (November 2000), which changed what is open to the public.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_NOV1999_PM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'November 3, 1999',
  session: 'Afternoon (PM)',
  questionsFile: 'edo9911pq.pdf',
  answersFile: 'edo9911pa.pdf',
  totalDelivered: 50,
  discarded: [39],
  multiKeyed: [] as number[],
  ingested: 49,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_NOV1999_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-nov99-pm-01',
    topicId: 1,
    subtopic: '"Substantially" is definite with guidelines; a preferred range inside a range is not',
    difficulty: 3,
    question:
      'Your client Smith invents a composition for adhering metal to glass. The specification sets forth: the composition is made from a combination of A, B, and C; it is at least 20% A but can be up to 30% A; it works best at 24% to 26% A; and it contains substantially equal portions of B and C. The specification includes guidelines for determining what constitutes substantially equal portions of B and C, and a detailed explanation of why 24% to 26% A is preferable. Among the following claims, which is the broadest claim that is unlikely to be properly rejected under 35 U.S.C. 112, second paragraph?',
    options: [
      'A composition comprising 20 to 30% A, and substantially equal portions of B and C.',
      'A composition comprising 20 to 30% A, preferably 24% to 26%A.',
      'A composition comprising 20 to 30% A, 30% B, and 30% C.',
      'A composition comprising 24% A, and substantially equal portions of B and C.',
      'A composition comprising 20 to 30% A, and equal portions of B and C.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 2173.05(b). The term "substantially" has been held definite given sufficient guidelines in the specification. In re Mattison, 509 F.2d 563, 184 USPQ 484 (CCPA 1975). (B) is incorrect because the narrow range within the broad range using "preferably" will likely render the claim indefinite. MPEP § 2173.05(c). (C)-(E) are incorrect because each is narrower in scope than (A).',
  },
  {
    id: 'uspto-nov99-pm-02',
    topicId: 5,
    subtopic: 'A reply to a non-final action in a reissue is entered even if it adds new matter',
    difficulty: 3,
    question:
      'On August 17, 1999, you filed a reissue application to enlarge the scope of the claims of a patent granted January 20, 1998. The broadest disclosure regarding resistance is "the device’s resistance is .02 to 1.5 ohms." Your reply to the non-final first Office action presents an amendment to the specification adding: "The device can have a resistance of 3.0 to 4.5 ohms." No petition and fee requesting entry was filed. In accordance with PTO practice and procedure, ___________________',
    options: [
      'the amendment will be entered, and if the examiner objects to the amendment to the specification as being new matter, you should traverse the objection on the grounds that the patent owner is entitled to enlarge the scope of the content of the patent.',
      'the amendment will not be entered because the amendment to the specification does not enlarge the scope of the claim.',
      'the amendment will not be entered because a petition and necessary fee requesting entry of the amendment was not filed.',
      'the amendment will be entered, and if the examiner objects to the amendment to the specification as being new matter, you should file another amendment canceling "The device can have a resistance of 3.0 to 4.5 ohms."',
      'the amendment will be entered because is does not introduce new matter.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 251; 37 C.F.R. §§ 1.111, 1.173, 1.176; MPEP §§ 706.03(o), 1411.02, 1440. (A) is wrong because the statute pertains to a patentee "claiming… less than he had a right to claim," not to enlarging the CONTENT of the patent. (B) and (C) are wrong because the amendment will be entered even if it contains new matter — a reissue is examined in the same manner as the original application, and a reply to a non-final first Office action is entitled to entry; no petition and fee are needed. (E) is wrong because the 3.0 to 4.5 ohm range is outside the broadest range of resistance disclosed in the patent.',
  },
  {
    id: 'uspto-nov99-pm-03',
    topicId: 3,
    subtopic: 'First-action final rejection is improper in a continuing application',
    difficulty: 3,
    question:
      'Smith received a final rejection of claims 1-20. He submitted an Amendment After Final narrowing independent claims 1 and 11; the Examiner denied entry on the ground that it presented new issues requiring further consideration or search. Rather than appeal, Smith filed a Continuing Prosecution Application (CPA) asking that the Amendment After Final be entered as a Preliminary Amendment. The Examiner issued a first Office action in the CPA allowing claims 1-10 and finally rejecting claims 11-20 on substantially the same grounds as in the parent. Which of the following statements regarding the first Office action in the CPA is correct?',
    options: [
      'The Examiner cannot properly allow claims 1-10 because a determination was made in the parent application that the Amendment After Final Rejection presented new issues requiring further consideration or search.',
      'The Examiner is precluded from rejecting claims 11-20 on substantially the same grounds that these claims had been rejected in the parent application because a determination was made in the parent case that the Amendment After Final Rejection presented new issues requiring further consideration or search.',
      'The Amendment After Final Rejection cannot be entered as a Preliminary Amendment in the CPA application.',
      'The finality of the rejection of claims 11-20 is improper.',
      '(B) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). It would not be proper to make final a first Office action in a continuing application where that application contains material presented in the earlier application after final rejection and denied entry because new issues were raised. MPEP § 706.07(b). (A) is incorrect — nothing prevents the Examiner from reconsidering and allowing the claims. (B) is incorrect — nothing prevents the Examiner from determining in the CPA that the revisions do not overcome the rejection, and there is no requirement that the grounds differ. (C) is incorrect — the applicant may request that the amendment after final be entered in the CPA before issuance of an Office action. 37 C.F.R. § 1.53(d)(3)(ii). [Historical practice] — the CPA was eliminated for utility applications in 2003 in favour of the RCE.',
  },
  {
    id: 'uspto-nov99-pm-04',
    topicId: 3,
    subtopic: 'Amendment filed after the appeal brief',
    difficulty: 3,
    question:
      'After filing a proper appeal brief, you agree to the examiner’s suggestions and file an amendment incorporating all of them after the appeal brief and before an examiner’s answer is mailed. In accordance with PTO practice and procedure, the amendment ____________________',
    options: [
      'may be entered if the amendment obviously places the application in condition for allowance and there is a showing of good and sufficient reasons why it was not earlier presented.',
      'will not be entered as it was not sent prior to or with the appeal brief.',
      'will not be entered because it was not in the form of a petition.',
      'will be entered and appended to the appeal brief for the Board’s consideration.',
      'will not be entered because a petition should have accompanied it since it was filed after the appeal brief.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP §§ 714.13 and 1207. [Historical practice] — the appeal rules of 37 C.F.R. Part 41 have since been revised.',
  },
  {
    id: 'uspto-nov99-pm-05',
    topicId: 5,
    subtopic: 'Reissue — broadening window, recapture, and new matter all at once',
    difficulty: 3,
    question:
      'A March 1, 1995 application disclosed a base member that was generally elliptical and in particular could be circular, and stated that all leg members must be parallel to each other. Claim 1 recited a circular base and three leg members. After a § 102(e) rejection over Pigeon (legs at thirty degree angles), applicant amended the specification to state the legs could be "substantially parallel" with guidelines, and amended claim 1 to add "wherein the leg members are parallel to each other." The patent granted January 5, 1997. On January 5, 1999, applicant filed a reissue application with a proper § 1.175 declaration. Which statement concerning the reissue application is true?',
    options: [
      'Any amendment to claim 1 so as to broaden its scope will likely be considered untimely.',
      'If applicant amends claim 1 to replace "a circular shaped member" with "an elliptical shaped member," then the amendment should be considered untimely since the amendment would broaden the scope of the claim.',
      'If applicant amends claim 1 to delete "wherein the leg members are parallel to each other," then the amended claim should be allowed.',
      'If applicant amends claim 1 to replace "parallel" with "substantially parallel," then the amended claim will likely be allowed.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). (A) and (B) are incorrect because a broadened claim CAN be presented within two years from the grant of the original patent in a reissue. MPEP § 1412.03. (C) is incorrect because it would attempt to recapture claimed subject matter deliberately cancelled. MPEP § 1412.02. (D) is incorrect because it relies on new matter — the original disclosure states the legs "must be parallel," so there was no support for "substantially parallel," and the later amendment to the nonprovisional does not cure that. MPEP § 1411.02.',
  },
  {
    id: 'uspto-nov99-pm-06',
    topicId: 1,
    subtopic: 'A process claim must recite acts, not a bare use',
    difficulty: 3,
    question:
      'If each of the following claims is in a different utility patent application, and each claim is fully supported by the disclosure, which claim properly presents a process claim?',
    options: [
      'A process of utilizing a filter comprising electrical components, placing a plurality of electrodes on the human body, receiving electrical signals from the electrodes, and passing the signals through the filter which comprises electrical components.',
      'A process of polymerizing an organic compound by combining in a reaction vessel a catalyst and reactants dissolved in a solvent, heating the mixture in the vessel to a high temperature to start the reaction, separating an upper organic layer from the remaining materials, and evaporating the solvent.',
      'The use of a water repellant paint as a sealant for wooden patio furniture.',
      '(A) and (B).',
      '(A), (B), and (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). (A) recites sufficient acts performed on subject matter, e.g. passing the signal through the filter. MPEP § 2173.05(q); Ex parte Porter, 25 USPQ2d 1144 (Bd. Pat. App. & Int. 1992). (B) recites the act of polymerizing. (C) is not a proper process claim because it does not recite an act specifying how the use is accomplished, and would be rejected as indefinite under § 112 or as an improper definition of a process under § 101. Ex parte Erlich, 3 USPQ2d 1011 (Bd. Pat. App. & Int. 1986); Clinical Products Ltd. v. Brenner, 255 F. Supp. 131 (D.D.C. 1966). (E) is incorrect because (C) is incorrect.',
  },
  {
    id: 'uspto-nov99-pm-07',
    topicId: 7,
    subtopic: 'Duty to identify the patent claim copied to provoke an interference',
    difficulty: 3,
    question:
      'You are about to file Able’s application containing claim 9, which you copied from claim 5 of a QED patent granted May 4, 1999 on an application filed December 22, 1997, together with an information disclosure statement listing several patents including the QED patent. You have evidence that Able invented his widget before December 22, 1997. Which of the following would be the most proper course of action to take to comply with your duties to your client and the PTO?',
    options: [
      'In the IDS, state and explain why the identified patents may be relevant, and state that the burden has shifted to the examiner to find and disclose other pertinent or relevant prior art.',
      'Identify the QED patent in bold in the list in the IDS, and include the following explanation about the QED patent: "QED discloses a relevant type of widget."',
      'In the IDS, state, "The QED patent discloses a relevant type of widget," and provide a copy of the patent.',
      'In the IDS, state, "Claim 9 in this application has been copied from claim 5 in the QED patent," and provide a copy of the patent.',
      'In the IDS, state, "Claim 9 in this application has been copied from a claim in a QED patent," and argue that "Claim 6 in the QED patent is an obvious improvement to the instant invention," and provide a copy of a QED patent.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. §§ 1.97, 1.98, 1.607(c), and 10.23(c)(7). (A), (B) and (C) are not correct because they do not identify the NUMBER of the patent claim that has been copied. (E) is not the most proper course — the IDS does not identify the QED patent from which the claim was copied, and arguing that Claim 6 is an obvious improvement would not be considered relevant. 37 C.F.R. § 1.98(a)(3). [Historical practice] — the Part 10 conduct rules were replaced in 2013 by Part 11, and interference practice by derivation proceedings.',
  },
  {
    id: 'uspto-nov99-pm-08',
    topicId: 3,
    subtopic: '37 C.F.R. § 1.131 against a genus claim — completing the reference species',
    difficulty: 3,
    question:
      'Jones’ application was filed January 1999 claiming an invention conceived and reduced to practice in the United States. Claim 1 was rejected under 35 U.S.C. § 102 as unpatentable over a U.S. patent to Smith. Neither derived from the other, and they were never obligated to assign to the same employer. In which of the following situations should a declaration by Jones under 37 CFR § 1.131 overcome the rejection?',
    options: [
      'The rejected claim is drawn to a genus. The Smith patent issued in March 1998, on an application filed in June 1994. The patent discloses, but does not claim, a single species of the genus claimed by Jones. The declaration shows completion in April 1994, of the same species disclosed by Smith.',
      'The rejected claim is drawn to a species. The Smith patent issued in March 1998 on an application filed in June 1994. The patent discloses, but does not claim, the species claimed by Jones. The declaration shows completion in April 1994, of a different species.',
      'The rejected claim is drawn to a genus. The Smith patent issued in March 1998, on an application filed in June 1994. The patent discloses, but does not claim, several species within the genus claimed by Jones. The declaration shows completion in April 1994, of a species different from the reference’s species and the species within the scope of the claimed genus.',
      'The rejected claim is drawn to a genus. The Smith patent issued in March 1997, on an application filed in June 1994. The patent discloses, but does not claim, several species within the genus claimed by Jones. The declaration shows completion in April 1994, of one or more of the species disclosed in the patent.',
      'The rejected claim is drawn to a genus. The Smith patent issued in November 1998, on an application filed in June 1994, and the patent discloses and claims several species within the genus claimed by Jones. The declaration shows completion in April 1994, of each species claimed in the Smith patent.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. 37 C.F.R. § 1.131; MPEP § 715.03; In re Spiller, 500 F.2d 1170, 182 USPQ 614 (CCPA 1974). (B) and (C) are incorrect — to overcome a reference indirectly, a showing of prior completion of a DIFFERENT species must be coupled with a showing that the claimed species would have been an obvious modification of the species completed. (D) is incorrect because the declaration cannot antedate a statutory bar, and that reference issued more than one year before the Jones application was filed. (E) is incorrect because the declaration is ineffective against a U.S. patent where there is no patentable distinction between the claims of the application and of the patent. In re Hidy, 303 F.2d 954 (CCPA 1962). [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-nov99-pm-09',
    topicId: 7,
    subtopic: 'Who may conduct a personal interview with the examiner',
    difficulty: 2,
    question: 'A personal interview with an examiner to discuss the merits of the claims may not be properly conducted by:',
    options: [
      'the inventor, even though the attorney of record is present at the interview.',
      'a registered practitioner who does not have power of attorney in the application, but who is known to the examiner to be the local representative of the attorney of record in the case.',
      'an unregistered attorney who is the applicant in the application.',
      'an unregistered attorney who has been given the associate power of attorney in the particular application.',
      'a registered practitioner who is not an attorney of record in the application, but who brings a copy of the application file to the interview.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 713.05. [Historical practice] — practitioner-authority rules now sit in 37 C.F.R. Part 11 and § 1.34.',
  },
  {
    id: 'uspto-nov99-pm-10',
    topicId: 1,
    subtopic: 'Markush groups require "consisting of" joined by "and"',
    difficulty: 2,
    question: 'Which of the following claim phrases may be used in accordance with proper PTO practice and procedure?',
    options: [
      'R is selected from the group consisting of A, B, C, or D.',
      'R is selected from the group consisting of A, B, C, and D.',
      'R is selected from the group comprising A, B, C, and D.',
      'R is selected from the group comprising A, B, C, or D.',
      'R is A, B, C, and D.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Ex parte Markush, 1925 CD 126 (Comm’r Pat. 1925) sanctions claiming a genus as a group "consisting of" elements connected by "and." MPEP § 2173.05(h). (A) is not most correct because the elements are improperly connected by "or." (C) and (D) are not most correct — it is improper to use "comprising" instead of "consisting of." Ex parte Dotter, 12 USPQ 283 (Bd. App. 1931).',
  },
  {
    id: 'uspto-nov99-pm-11',
    topicId: 2,
    subtopic: 'The six-month statutory period runs from the Office action date, not receipt',
    difficulty: 3,
    question:
      'A final rejection, with a mailing date of Thursday, February 4, 1999, was received Saturday, February 6, 1999. The examiner set a three month shortened statutory period for reply. Which of the following will be considered as being timely filed?',
    options: [
      'A reply mailed first class on Friday, August 6, 1999 and received August 9, 1999, with a petition and fee for a three-month extension and a § 1.8 certificate of mailing dated August 6, 1999, signed by one who reasonably expected the response to be mailed in the normal course of business by another no later than August 6, 1999.',
      'A reply mailed Tuesday, May 4, 1999 and received May 6, 1999, accompanied by a copy of a U.S. Postal Service certificate of mailing stating "One piece of ordinary mail addressed to: Assistant Commissioner for Patents," with an official USPS date stamp of May 4, 1999.',
      'A reply mailed first class Wednesday, August 4, 1999 and received August 9, 1999, with a petition and fee for a three-month extension and a certificate of mailing stating the correspondence is being deposited "on August 6, 1999," signed by one who reasonably expected mailing no later than August 4, 1999.',
      '(A) and (C).',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 37 C.F.R. § 1.8(a); MPEP § 512. (A) is incorrect because the response would not be timely even if given the August 6th date — the six month statutory period runs from the DATE OF THE OFFICE ACTION, not the date it was received, and the response was mailed beyond it. (B) is incorrect because the USPS certificate of mailing does not comply with § 1.8(a). (C) is incorrect because the date of the certificate of mailing is after the statutory six month period. (D) is incorrect because (A) and (C) are incorrect.',
  },
  {
    id: 'uspto-nov99-pm-12',
    topicId: 1,
    subtopic: 'Terms of degree and definiteness',
    difficulty: 3,
    question:
      'Which of the following statements is true concerning terms of degree (relative terms, e.g., such as, "hotter") used in claim language?',
    options: [
      'Definiteness of claim language using terms of degree should not be analyzed using a claim interpretation that would be given by one possessing the ordinary level of skill in the art, and only the specification should be used to interpret the claim.',
      'A claim may be rendered indefinite even if the specification uses the same term of degree as the claim language, if the term of degree is not understandable by one of ordinary skill in the art when the term of degree is read in light of the specification.',
      'If the specification includes guidelines which would enable one of ordinary skill in the art to determine the scope of a claim having a term of degree, then the language of the guidelines must be included in the claim in order to render the claim definite.',
      'If the original disclosure does not include guidelines which would enable one of ordinary skill in the art to determine the scope of a claim having a term of degree, then as long as the term of degree in the claim was part of the original disclosure, the claim will be properly rendered definite by amending the specification to provide guidelines concerning the term of degree.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 2173.05(b). (A) is incorrect because the claim interpretation of one possessing ordinary skill IS relevant. MPEP § 2173.02. (C) is incorrect because the guidelines in the specification may be sufficient. (D) is incorrect since it relies on the improper addition of new matter. (E) is incorrect since (B) is correct.',
  },
  {
    id: 'uspto-nov99-pm-13',
    topicId: 2,
    subtopic: 'A new Office action resets the reply period',
    difficulty: 3,
    question:
      'You received an Office action mailed August 13, 1999, setting a three month shortened statutory period and rejecting all claims under 35 U.S.C. § 112. On September 28, 1999, you filed an amendment copying claims from a recently issued patent to provoke an interference and notified the examiner. In a second Office action dated October 13, 1999, the examiner rejected the copied claims under § 112 as based on a non-enabling disclosure and set a three month shortened statutory period. If no requests for an extension of time are filed, the last day(s) for filing replies to the first and second Office actions, is(are):',
    options: [
      'Monday, November 15, 1999.',
      'Monday, November 15, 1999, and Thursday, January 13, 2000, respectively.',
      'Monday, November 29, 1999, and Wednesday, January 12, 2000 respectively.',
      'Tuesday, December 28, 1999.',
      'Thursday, January 13, 2000.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP §§ 710.04 and 710.04(a).',
  },
  {
    id: 'uspto-nov99-pm-14',
    topicId: 1,
    subtopic: 'Dependent claims: antecedent basis and further limitation',
    difficulty: 3,
    question:
      'Claim 1 recites a modular telephone plug crimping tool comprising a pair of body parts "each having a fixed length," a flexible member, a hand lever, a pivot pin, an interchangeable crimping punch and anvil, a roller, and a guide pin. Which, if any, of the following claims, if presented in the application, is a proper dependent claim?',
    options: [
      '2. The modular telephone according to claim 1, wherein said crimping punch comprises integral contact and strain relief punch portions.',
      '2. The modular telephone plug crimping tool according to claim 1, wherein said second body part has an adjustable length.',
      '2. A process for using the modular telephone plug crimping tool of claim 1 to connect a telephone to a telephone line.',
      '2. The modular telephone plug crimping tool according to claim 1, further comprising: a free end on each of said first and second body parts; first and second stripping blades adjustably and detachably provided at said free ends…; and at least one severing blade held in cooperating relationship with a severing anvil…',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Claim 1 provides antecedent basis for Claim 2 of answer (D). 35 U.S.C. § 112, second paragraph. (A) is incorrect — Claim 1 is drawn to a "modular telephone plug crimping tool" and provides no antecedent basis for "the modular telephone." MPEP § 2173.05(e). (B) is incorrect because it fails to incorporate all the limitations of the claim it refers to — Claim 1 requires the body part have a FIXED length, so an ADJUSTABLE length contradicts it. § 112, fourth paragraph. (C) is incorrect because it recites a process without setting forth any steps. MPEP § 2173.05(q).',
  },
  {
    id: 'uspto-nov99-pm-15',
    topicId: 3,
    subtopic: 'Nothing overcomes § 102(b) over a patent claiming the same invention',
    difficulty: 3,
    question:
      'You are prosecuting an application for inventor Smith that receives a rejection under 35 U.S.C. § 102(b) based on a U.S. patent to Jones that discloses and claims the same invention. Which of the following, if any, will overcome the rejection?',
    options: [
      'An affidavit or declaration showing that Jones is not the true inventor.',
      'An affidavit or declaration showing commercial success of the Smith invention.',
      'An affidavit or declaration containing an argument that the invention claimed in the Smith application provides synergistic results.',
      'An affidavit or declaration swearing back of the Jones patent.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 37 C.F.R. §§ 1.131 and 1.132; MPEP §§ 706.02(b), 715, and 716. [Pre-AIA] — a § 102(b) statutory bar cannot be antedated, and § 1.131 is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-nov99-pm-16',
    topicId: 1,
    subtopic: 'Dependent claims supported by the specification; "consisting of" bars additions',
    difficulty: 3,
    question:
      'A process claim for manufacturing water soluble crayons contacts "an organic compound selected from the group consisting of alcohols and carboxylic acids" with an alkylene oxide, adds a coloring agent, pours into a mold and solidifies by cooling. The specification discloses pigments (titanium dioxide, red iron oxide, carbon black) at about 1 to 30 weight percent or greater, preferably about 4 to about 25; that preferred organic compounds also include amines; and that the compositions harden when exposed to about 10ºC to 15ºC. Which of the following choices would be a proper dependent claim which could be added by amendment and be supported by the specification?',
    options: [
      '2. A process according to Claim 1 wherein said water soluble crayon composition is exposed to a temperature of at least 10ºC.',
      '2. A process as set forth in Claim 1 wherein said coloring agent is titanium dioxide.',
      '2. A process for manufacturing water soluble crayons as set forth in Claim 1 wherein said coloring agent is 1 to 30 weight percent of the total weight of the crayon composition.',
      '2. A process as set forth in Claim 1 wherein said organic compound further comprises amines.',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Both (B) and (C) are proper dependent claims supported by the specification. 37 C.F.R. § 1.75. (A) is incorrect — "at least" has no upper limit and could include temperatures greater than the disclosed "about 10ºC to 15ºC." MPEP § 2163.05. (D) is incorrect — MPEP § 2111.03 provides that "A claim which depends from a claim which \'consists of\' the recited elements or steps cannot add an element or step," and (D) seeks to add amines in violation of that caveat.',
  },
  {
    id: 'uspto-nov99-pm-17',
    topicId: 3,
    subtopic: 'Amendment must cite the correct line and the exact matter',
    difficulty: 3,
    question:
      'Which of the following amendments to Claim 1 (the water soluble crayon process claim) are in accordance with PTO policy and procedure and are supported by specification?',
    options: [
      'In Claim 1, line 3, before "alcohols" delete "monohydric".',
      'In Claim 1, line 4, after "alcohols" insert "amines".',
      'In Claim 1, line 6, delete "a coloring agent" and insert "titanium dioxide".',
      'In Claim 1, line 7, after "cooling" insert "to a temperature of 13ºC."',
      '(B) and (C).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). The amendment points out two words occurring in line 6 that are to be deleted, and two words to be inserted in their place. 37 C.F.R. § 1.121(a)(2)(i). (A) is incorrect because "dihydric" appears on line 4 and not line 3. (B) is incorrect because "alcohols" does not occur in line 4 of claim 1. (D) is incorrect because "cooling" appears on line 9 and not line 8. (E) is not correct because (B) is incorrect. [Historical practice] — the pre-2003 § 1.121 amendment format has been replaced by the current claim-listing practice.',
  },
  {
    id: 'uspto-nov99-pm-18',
    topicId: 5,
    subtopic: 'Broadening is a reissue remedy only, and only within two years',
    difficulty: 3,
    question:
      'Bill wishes to amend the sole original Claim 1 of his patent to delete "unconditional" and "from the local pool subset", fully supported by the original disclosure. In the absence of questions of recapture, novelty, obviousness, and utility, which of the following statements, if any, is true?',
    options: [
      'A claim so amended is properly presented during a reexamination proceeding where a request for reexamination was filed on September 9, 1999, and a certificate of reexamination may be issued where reexamination is sought of a patent granted on July 15, 1997.',
      'A claim so amended is properly presented in a reissue application filed on September 9, 1999, and a reissue patent is grantable where reissuance is sought of a patent granted on July 15, 1997.',
      'A claim so amended is properly presented in a reissue application filed on September 9, 1999, and a reissue patent is grantable where reissuance is sought of a patent granted on November 18, 1997.',
      'A claim so amended is properly presented in a request for reexamination filed on September 9, 1999, and a certificate of reexamination may be issued where reexamination is sought of a patent granted on November 18, 1997.',
      'A claim so amended is properly presented in a reissue application filed any time before expiration of the term of the patent inasmuch as the scope of Claim 1 in the original patent is narrowed by replacing the word "unconditional" with the word "interruptable."',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). The scope of Claim 1 is enlarged by the deletion of "from the local pool subset." In (C) the reissue application is filed LESS than two years after the original patent was granted and seeks to enlarge scope, so a reissue may properly be granted. 35 U.S.C. § 251. (A) and (B) are incorrect — claims cannot be enlarged in a reexamination regardless of when filed (35 U.S.C. § 305; 37 C.F.R. § 1.552(b)), and (B)\'s reissue was filed more than two years after grant. (D) and (E) are incorrect for the same reasons.',
  },
  {
    id: 'uspto-nov99-pm-19',
    topicId: 6,
    subtopic: 'Best mode does not apply to design claims',
    difficulty: 3,
    question: 'Which of the following requirements of 35 U.S.C. § 112 does not apply to design patent claims?',
    options: [
      'The written description requirement of the first paragraph.',
      'The best mode requirement of the first paragraph.',
      'The requirement in the second paragraph to distinctly claim the subject matter which the applicant regards as his invention.',
      'The requirement in the third paragraph for an independent claim.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). In Racing Strollers Inc. v. TRI Industries Inc., 11 USPQ2d 1300 (Fed. Cir. 1989) (in banc), the Federal Circuit stated that for design patents "the \'best mode\' requirement of the first paragraph of § 112 is not applicable, as a design has only one \'mode\' and it can be described only by illustrations showing what it looks like." 35 U.S.C. § 171; MPEP § 1504.04. The written description, definiteness and independent claim requirements DO apply to design applications, so (A), (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-nov99-pm-20',
    topicId: 2,
    subtopic: 'One joint inventor revoking a power of attorney',
    difficulty: 3,
    question:
      'Inventors Moe and Jeff originally gave attorney Curly a power of attorney. Jeff no longer wants Curly to represent him and wants you instead; Moe does not agree and wants Curly to continue. How, if at all, should the revocation and appointment of a new power of attorney be properly handled?',
    options: [
      'Papers revoking Curly’s power of attorney with regard to Jeff, and giving you a new power of attorney need to be signed by Jeff and must include a statement from Moe indicating that Moe wishes to retain Curly.',
      'Papers revoking Curly’s power of attorney with regard to Jeff, and giving you a new power of attorney cannot be accepted without concurrence by Curly.',
      'Papers revoking Curly’s power of attorney with regard to Jeff, and giving you a new power of attorney signed only by you should be accompanied by a petition giving good and sufficient reasons as to why such papers should be accepted upon being filed together with an appropriate fee.',
      'Papers revoking Curly’s power of attorney with regard to Jeff, and giving you a new power of attorney signed only by Jeff should be accompanied by a petition giving good and sufficient reasons for acceptance should be filed together with an appropriate fee.',
      'Papers revoking Curly’s power of attorney with regard to Jeff, and giving you a new power of attorney cannot be accepted without concurrence of Moe and Curly.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 402.10.',
  },
  {
    id: 'uspto-nov99-pm-21',
    topicId: 2,
    subtopic: 'Which files are not open to the public',
    difficulty: 2,
    question: 'Which of the following files is ordinarily not open to the public?',
    options: [
      'A substitute application.',
      'An interference proceeding file involving a U.S. patent.',
      'A reissue application.',
      'A reexamination proceeding file.',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 1.11; MPEP §§ 103 and 201.09. [Historical practice] — this answer predates 18-month pre-grant publication (November 2000), which changed what application files are open to the public.',
  },
  {
    id: 'uspto-nov99-pm-22',
    topicId: 1,
    subtopic: '"Consisting of" inside a clause; a claim depending from an improper claim is improper',
    difficulty: 3,
    question:
      'Independent Claim 1 recites a micro-computer with "(iv) an output device for viewing information consisting of a video monitor". Claim 2 adds random access memory; Claim 3 depends from Claim 1 or 2 and adds a light pen; Claim 4 depends from "any one of the preceding claims" and recites the output device is "a printer or a video monitor"; Claim 5 depends from Claim 4 and adds read-only memory. Which of the following dependent claim(s) is (are) an improper dependent claim?',
    options: ['Claim 2.', 'Claim 2 and Claim 3.', 'Claim 3.', 'Claim 5.', 'Claim 4 and Claim 5.'],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). The transitional phrase "consisting of" excludes any element not specified; when it appears in a CLAUSE of the body rather than after the preamble, it limits only the elements in that clause. MPEP § 2111.03. Here "consisting of" limits the output device to a video monitor, so Claim 4\'s recitation of "a printer" is improper, and reciting "a video monitor" again does not further limit. Claim 5 depends on improper Claim 4, and a claim depending from an improper base claim is itself improper. MPEP § 608.01(n). Claims 2 and 3 are proper, so (A), (B), (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-nov99-pm-23',
    topicId: 1,
    subtopic: 'Terms requiring a disclosed standard to avoid indefiniteness',
    difficulty: 3,
    question:
      'To avoid a proper rejection of a claim for being indefinite, which of the following expressions in the claims must be supported by a specification disclosing a standard for ascertaining what the inventor means to cover?',
    options: [
      '"relatively shallow."',
      '"of the order of."',
      '"similar" in the following claim preamble: "A nozzle for high-pressure cleaning units or similar apparatus."',
      '"essentially" in the following phrase following the claim preamble: "a silicon dioxide source that is essentially free of alkali metal."',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. MPEP § 2173.05(b), "Reference To An Object That Is Variable May Render A Claim Indefinite," items B, C, and F. Each expression has been found to require support in the specification disclosing a standard for ascertaining what the inventor meant.',
  },
  {
    id: 'uspto-nov99-pm-24',
    topicId: 1,
    subtopic: 'Inherent antecedent basis; ambiguous "said memory chip"',
    difficulty: 3,
    question:
      'Claim 1 recites a computer comprising a microprocessor with a maximum clock rate of 350 megahertz, a random access memory chip, a read only memory chip, and a case. Claim 2 adds that the case has an outer surface comprised of plastic; Claim 3 depends from claims 1 or 2 adding a peripheral controller chip; Claim 4 depends from claim 1 and recites "said memory chip has eight million storage locations"; Claim 5 depends from claim 2 and recites the microprocessor has a maximum clock rate of 400 megahertz. Which of the following is/are proper dependent claims(s) in accordance with 37 CFR §1.75?',
    options: ['Claims 2 and 3.', 'Claim 4 only.', 'Claims 2 and 5.', 'Claim 2 only.', 'None of the above.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 1.75; MPEP § 2173.05(b). The limitation "the outer surface of said case" does not lack antecedent basis since it is an inherent part of the case. (B) is incorrect because claim 1 recites TWO different memory chips, so "said memory chip" renders the claim indefinite. MPEP § 2173.05(e). (C) is incorrect because claim 5 does not further limit claim 1. (D) and (E) are incorrect because (A) is correct.',
  },
  {
    id: 'uspto-nov99-pm-25',
    topicId: 2,
    subtopic: 'Filing date requires specification, claim and any required drawing',
    difficulty: 3,
    question:
      'On Tuesday, August 17, 1999, you hand-delivered a nonprovisional application with ten claims but neither the names of the actual inventors nor the drawings necessary to understand the invention (the specification refers to the drawings). You mailed the drawings first class on September 13, 1999 and the PTO received them September 15, 1999. On September 29, 1999 you deposited a § 1.63 declaration signed by all the actual inventors via Express Mail; the PTO received it October 1, 1999. What will be the earliest filing date given to the application by the PTO?',
    options: ['August 17, 1999.', 'September 13, 1999.', 'September 15, 1999.', 'September 29, 1999.', 'October 1, 1999.'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. §§ 1.10(a) and 1.53(b): "The filing date of an application for patent filed under this section is the date on which a specification as prescribed by 35 U.S.C. § 112 containing a description pursuant to § 1.71 and at least one claim pursuant to § 1.75, and any drawing required by § 1.81(a) are filed in the Patent and Trademark Office." The drawings were required, so the filing date is the date they arrived.',
  },
  {
    id: 'uspto-nov99-pm-26',
    topicId: 1,
    subtopic: 'Direct contact and negative limitations to avoid an intermediate layer',
    difficulty: 3,
    question:
      'X invented a laminate most broadly disclosed as containing a transparent protective layer and a light-sensitive layer, without an intermediate layer. The prior art included a laminate containing those layers held together by an intermediate adhesive layer. Which of the following claims would overcome a 35 USC § 102 rejection based on the prior art?',
    options: [
      '1. A laminate comprising a transparent protective layer and a light-sensitive layer.',
      '1. A laminate comprising a transparent protective layer and a light-sensitive layer which is in continuous and direct contact with the transparent protective layer.',
      '1. A laminate comprising a transparent protective layer and a light-sensitive layer, but not including an adhesive layer.',
      '(A) and (B).',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because (B) and (C) are correct. (A) does not overcome the prior art because the broad "comprising" language permits additional layers such as an intermediate adhesive layer. MPEP § 2111.03. (B) overcomes the rejection by reciting actual contact, eliminating the possibility of an intermediate adhesive layer. (C) avoids the prior art by using a negative limitation. MPEP § 2173.05(i).',
  },
  {
    id: 'uspto-nov99-pm-27',
    topicId: 5,
    subtopic: 'Who signs the reissue oath when the patent is partly assigned',
    difficulty: 3,
    question:
      'A patent issued to Belinda April 21, 1998. She then assigned 50% of her right, title and interest to Ace and 25% to Duce, and the assignments were recorded. Belinda later discovered her claim coverage is too narrow because her attorney did not appreciate the full scope of the invention. Today, November 3, 1999, she consults you about filing a reissue application. The reissue oath must be signed and sworn to by:',
    options: [
      'Belinda, Ace and Duce.',
      'Belinda only.',
      'Belinda and either Ace or Duce.',
      'Ace and Duce only.',
      'the attorney or agent of record.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. § 1.172. [Historical practice] — the AIA revised reissue oath/declaration practice, including who may sign under §§ 1.172 and 1.175.',
  },
  {
    id: 'uspto-nov99-pm-28',
    topicId: 2,
    subtopic: 'Interlineations must be initialled and dated before the oath is signed',
    difficulty: 2,
    question:
      'A patent specification can be altered by interlineation before it is filed in the PTO. Such alterations are permitted if each interlineation is initialed and dated by the:',
    options: [
      'registered practitioner who prepared the specification, even if the applicant is available to sign the oath or declaration.',
      'applicant, before the oath or declaration is signed by the registered practitioner.',
      'applicant, at any time after the oath or declaration is signed.',
      'applicant, before the oath or declaration is signed by the applicant.',
      'registered practitioner who prepared the specification before the oath or declaration is signed by the applicant.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.52(c); MPEP § 605.04(a).',
  },
  {
    id: 'uspto-nov99-pm-29',
    topicId: 1,
    subtopic: 'Lexicography cannot give a term a meaning repugnant to its usual one',
    difficulty: 3,
    question:
      'Billie’s application states: "The most common meaning of the term \'fluid\' includes both gases and liquids. However… the present invention properly operates when B is in a gaseous, fluid, or solid state, so long as temperature of the solid B is above 2°C… Thus, in the context of the present invention, the term \'fluid\' means \'gaseous\', \'liquid\', and/or certain solid states." Claim 1 is directed to "[a] method for forming composition X comprising mixing compound A with fluid compound B at a temperature between 0°C and 10°C". Greene\'s research, conducted in England and published January 5, 1999 (after Billie\'s January 2, 1999 filing), discloses the identical method. Which rejection of Claim 1 is in accordance with proper PTO practices and procedures?',
    options: [
      'Claim 1 is rejected under 35 U.S.C. § 112, paragraph 2 as being indefinite because the meaning of the term "fluid" is unclear. Billie is encouraged to clarify the claim by deleting "fluid" and inserting --liquid-- in its place.',
      'Claim 1 is rejected under 35 U.S.C. § 102(a) as being anticipated by Greene because, although the research results were published after Billie’s filing date, the research results were submitted to the British technical journal before the filing date and were therefore known in the art.',
      'Claim 1 is rejected under 35 U.S.C. § 112, paragraph 1 as being based on an insufficient specification because the claim does not specify a pressure at which A and B are mixed and, depending on that pressure, compound B could be either a gas or a liquid at the recited temperature range.',
      'Claim 1 is rejected under 35 U.S.C. § 101 as being directed to non-statutory subject matter because composition X occurs naturally.',
      'Claim 1 is rejected under 35 U.S.C. § 112, paragraph 2 as being based on an incorrect theory of operation because the theory of operation disclosed in the specification is inconsistent with the claim.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 112, paragraph 2; MPEP §§ 2173.05(a) and 706.03(d). A patentee can be his own lexicographer, but a term may not be given a meaning repugnant to its usual meaning — using "fluid" to mean "solid" is repugnant to its ordinary meaning. Where more than one definition exists it is incumbent on the applicant to make clear which is relied upon, and here "fluid" is inconsistently defined (above 2°C in the specification vs 0° to 10°C in the claim). (B) is incorrect because the Greene results were published AFTER Billie\'s filing date and the research occurred in Great Britain, so they are not prior art under § 102(a). (C) confuses enablement with definiteness. (D) is incorrect because whether the resulting composition occurs naturally is immaterial to whether a METHOD for forming it is statutory. (E) is incorrect because an applicant need not understand how an invention works or recite the theory in a claim. [Pre-AIA] — the § 102(a) analysis is pre-AIA and turns on the now-repealed geographic limitation.',
  },
  {
    id: 'uspto-nov99-pm-30',
    topicId: 7,
    subtopic: 'PTO employees may not apply for a patent',
    difficulty: 2,
    question: 'Which of the following may not properly apply for a patent on an invention?',
    options: [
      'A child.',
      'A convicted felon.',
      'A British subject.',
      'A current employee of the PTO.',
      'A scientist who has assigned to his employer all rights to the invention.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 4; MPEP § 309.',
  },
  {
    id: 'uspto-nov99-pm-31',
    topicId: 4,
    subtopic: '§ 102(e) date of a national-stage application under § 371(c)',
    difficulty: 3,
    question:
      'A PCT international application designating the United States was filed November 1, 1996, claiming priority of a French national application filed December 6, 1995. A demand electing the United States was filed June 5, 1997, so the thirty month period expired June 6, 1998. The applicant submitted the basic national fee June 2, 1998. On August 3, 1998, the applicant timely submitted a translation of the international application and a declaration of the inventors; on August 10, 1998, a translation of Article 19 amendments. A Notice of Acceptance was mailed August 29, 1998, and the national stage application issued as a U.S. patent October 13, 1999. What is the effective date of the U.S. patent as a reference under 35 U.S.C. § 102(e)?',
    options: ['November 1, 1996.', 'June 2, 1998.', 'August 3, 1998.', 'August 10, 1998.', 'October 13, 1999.'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). August 3, 1998 was the date on which the requirements of 35 U.S.C. § 371(c)(1), (2), and (4) were completed. PCT Articles 11 and 20; PCT Rule 47.1(c); and 35 U.S.C. § 102(e), under which a person is entitled to a patent unless "the invention was described in a patent granted on… an international application by another who has fulfilled the requirements of paragraphs (1), (2), and (4) of section 371(c) of this title before the invention thereof by applicant for patent." [Pre-AIA] — the AIA rewrote § 102(e) entirely; the § 102(a)(2)/(d) framework now governs.',
  },
  {
    id: 'uspto-nov99-pm-32',
    topicId: 5,
    subtopic: 'Reexamination is the route to challenge a patent on patents and publications',
    difficulty: 3,
    question:
      'A client is accused of infringing a competitor’s patent and shows you several published articles, two United States patents, and two written statements by experts clearly supporting the conclusion that the invention was well known when the application was filed. The articles and patents were not considered by the examiner during prosecution. The client wants to avoid litigation and have the PTO act to invalidate the patent. Which of the following choices would be an appropriate course of action?',
    options: [
      'Petition the Commissioner of Patents and Trademarks to revoke the patent.',
      'File a request and fee for reexamination of the claims in the patent relying on the published articles and the U.S. patents as the basis for reexamination, and include all statements, information, and documents required by PTO rules for initiating reexamination proceedings.',
      'File a protest in the PTO with copies of the published articles, patents and the written statements from the experts, along with an explanation of their pertinence to the claims of the patent.',
      'File in the PTO copies of all of the documents provided to you by your client and request that they be made of record in the patented file.',
      '(B) and (C).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. §§ 1.291 and 1.501; MPEP §§ 2202 and 2203. A protest under § 1.291 is not available against an issued patent, and expert statements are not a proper basis for reexamination — only patents and printed publications are.',
  },
  {
    id: 'uspto-nov99-pm-33',
    topicId: 3,
    subtopic: 'Terminal disclaimer must include the common-ownership provision',
    difficulty: 3,
    question:
      'Ann filed a first application May 1, 1997 claiming a capacitor, which also disclosed better results if coupled to a resistor. On February 1, 1999, while the first was pending, she filed a § 1.53(b) continuation claiming the capacitor plus a resistor. The claim was provisionally rejected under the judicially created doctrine of double patenting over the copending first application. Neither application was ever assigned. The rejection may be properly overcome by a timely reply:',
    options: [
      'traversing the rejection and arguing that since the first application had not yet matured into a patent, a double patenting rejection was unfounded.',
      'arguing that rejections of this type are no longer warranted for continuation applications, since any utility application filed on or after June 8, 1995, will expire 20 years from its filing date, and therefore Ann’s continuation application would expire at the same time as the first application anyway.',
      'arguing that the claim in the continuation application is patentably distinct and unobvious from the claim in the first application.',
      'including a terminal disclaimer, signed by Ann, disclaiming any portion of the term of any patent granted on the continuation application beyond twenty years from May 1, 1997, and including a provision in the terminal disclaimer that any patent granted on the continuation application shall be enforceable only for and during such period that said patent is commonly owned with the first application.',
      'including the filing of a terminal disclaimer, signed by Ann, disclaiming any portion of the term of any patent granted on the continuation application beyond twenty years from May 1, 1997.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.321(c); MPEP § 804.02. (A) is incorrect because provisional double patenting rejections between copending applications are provided for. MPEP § 804. (B) is incorrect because the rejection still applies even though the continuation gets the parent\'s filing date. (C) is incorrect because the rejection is proper — applicant voluntarily filed a second application without a restriction requirement. In re Schneller, 158 USPQ 210 (CCPA 1968). (E) is incorrect because it OMITS the provision concerning common ownership required by § 1.321(c).',
  },
  {
    id: 'uspto-nov99-pm-34',
    topicId: 0,
    subtopic: '35 U.S.C. § 101 — naturally occurring compositions, mixed classes, bare equations',
    difficulty: 3,
    question:
      'Vada discovered a salt lake saturated with NaCl that cures skin rashes, determined an ideal temperature Ti = Ts + (Tr – Ts)², and found she could obtain the same solution by mixing NaCl with water, heating to 212°F and cooling to 80°F. Which, if any, of the following claims would provide the proper basis for a rejection pursuant to 35 U.S.C. § 101?',
    options: [
      'A composition comprising: water saturated with NaCl.',
      'A composition for restoring youth.',
      'A composition and method for treating skin rashes, comprising: a solution of water saturated with NaCl; heating said solution to a temperature defined by skin temperature plus the square of the difference between room temperature and skin temperature; and applying said solution to skin rashes.',
      'An expression comprising: Ti = Ts + (Tr – Ts)².',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). (A) provides a basis because the composition is naturally occurring. MPEP § 2106. (B) — patentability of a product claimed by a product-by-process claim is based on the product itself, and since the product is naturally occurring the claim is properly rejectable under § 101. (C) is drawn to more than one statutory class in the same claim (a product and a process) and is therefore not within one of the statutory classes, and is also properly rejectable under § 112, second paragraph. MPEP § 2173.05(p). (D) — mathematical equations alone are not patentable subject matter. (E) is correct because each provides a basis.',
  },
  {
    id: 'uspto-nov99-pm-35',
    topicId: 1,
    subtopic: 'Original claims may enable a later claim; claim numbering and fee counting',
    difficulty: 3,
    question: 'Which, if any, of the following statements is true according to PTO rules and procedure?',
    options: [
      'If a claim is cancelled by an amendment and a new claim is added in the amendment, then the new claim should be numbered using the number previously assigned to the canceled claim.',
      'A claim which recites the best mode of carrying out the invention can only properly incorporate by reference the limitations having the essential material into the claim, for purposes of satisfying the requirements of 35 U.S.C. § 112, second paragraph, if the reference is made to a U.S. patent or U.S. patent application.',
      'For fee calculation purposes, a multiple dependent claim which refers directly to independent claims and dependent claims will always be considered to be the number of independent claims to which direct reference is made therein.',
      'The subject matter disclosed in a first claim which is part of the original disclosure in a nonprovisional patent application may be relied upon for purposes of enabling a second claim in the application in order to satisfy the requirements of 35 U.S.C. § 112, first paragraph, even if the detailed description and drawings, taken alone, are inadequate.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 608.01(l). (A) is incorrect because the original numbering of the claims must be preserved throughout prosecution. 37 C.F.R. § 1.126. (B) is incorrect and nonsensical. (C) is incorrect because a multiple dependent claim will always be considered to be the TOTAL number of claims (dependent and independent) to which direct reference is made. 37 C.F.R. § 1.75(c). (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-nov99-pm-36',
    topicId: 1,
    subtopic: 'A single means claim is rejected under § 112 ¶ 1, not ¶ 2',
    difficulty: 3,
    question:
      'A specification describes a mechanical fastener attaching a rubber heel to a shoe, with a drawing and an accurate written description, and states that "an adhesive may be used in conjunction with the mechanical fastener." No specific adhesive formulation is given, but such adhesives are well known. Claim 1 reads: "A system for securely attaching a rubber heel to the bottom of a shoe and providing a cushioning effect when worn, said system comprising cushioning means for mechanically fastening said heel to said shoe." Which of the following statements is correct?',
    options: [
      'Claim 1 is a "means plus function" claim subject to 35 U.S.C. § 112, paragraph 6 and is construed to cover only the specific mechanical structure of the fastener described in the specification and equivalents of that mechanical structure.',
      'Claim 1 is a "means plus function" claim subject to § 112, paragraph 6 and is construed to cover both (a) the specific mechanical structure and its equivalents; and (b) that structure together with an adhesive and equivalents thereof.',
      'Claim 1 is indefinite because it covers every conceivable means for achieving the stated result.',
      'Claim 1 is not supported by an enabling specification because the claim covers every conceivable means for achieving the stated result.',
      'Because claim 1 is drafted in means plus function language, proper claim interpretation under § 112, paragraph 6 requires that there be a specific description in the specification of an acceptable adhesive formulation.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Claim 1 is a "single means claim," which is NOT subject to the interpretive rules of § 112, paragraph 6 (that paragraph applies only to claims for combinations) — so (A), (B) and (E) are incorrect for at least that reason. Per In re Hyatt, 708 F.2d 712, 218 USPQ 195 (Fed. Cir. 1983), the proper basis for rejecting a single means claim is the FIRST paragraph of § 112 (enablement) rather than the second (definiteness), so (C) is not correct. See also MPEP § 2181.',
  },
  {
    id: 'uspto-nov99-pm-37',
    topicId: 1,
    subtopic: 'A dependent claim that broadens the parent range is improper',
    difficulty: 3,
    question:
      'Fred discloses a circuit with a DC current source of 10-30 amperes (preferably 18-22), a resistor of 10-20 ohms (preferably 14-16), and a capacitor of 3-8 mf (preferably 5-6). Claim 1 recites 18-22 amperes, 10-20 ohms and 5-6 mf. Claim 2 narrows the resistor to 14-16 ohms; Claim 3 recites the capacitor "has a value in the range of 3-8 mf"; Claim 4 recites the DC source produces variable current in the range of 18-22 amperes. Barry’s Canadian patent, published thirteen months before Fred’s effective filing date, discloses 20 amperes, 12 ohms and 6 mf. Which of the following statements regarding the claims is correct?',
    options: [
      'Each of Claims 1-4 is patentable over Barry’s Canadian patent.',
      'Claim 1 is unsupported by a sufficient written description because the specification does not set forth the claimed combination of component values in a single disclosed embodiment.',
      'Claim 2 is an improper dependent claim.',
      'Claim 3 is an improper dependent claim.',
      'Claim 4 is an improper dependent claim.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Claim 3 is improper because it does not further limit the claim from which it depends — Claim 1 recites 5-6 mf and Claim 3 broadens it to 3-8 mf, violating 35 U.S.C. § 112, paragraph 4 and 37 C.F.R. § 1.75(c). (A) is wrong because the Barry patent anticipates claims 1, 3 and 4. (B) is wrong because Claim 1 is an original claim and an original claim provides its own written description. In re Anderson, 471 F.2d 1237 (CCPA 1973). (C) is wrong because claim 2 properly narrows the resistance range. (E) is wrong because claim 4 adds that the source produces VARIABLE current, a limitation not in claim 1.',
  },
  {
    id: 'uspto-nov99-pm-38',
    topicId: 1,
    subtopic: 'A process claim needs positive steps, not a bare "use"',
    difficulty: 3,
    question:
      'Assuming that each of the following claims is in a different utility patent application, and each claim is fully supported by the disclosure, which of the claims properly presents a process claim?',
    options: [
      'A process for using monoclinal antibodies to isolate and purify interferon.',
      'A process of using paint to cover a surface comprising applying paint to a surface and removing any excess paint.',
      'A use of a metallic fibrous compound having a proportion of metallic granules as a motor compression part subject to stress by sliding friction.',
      'The use of a sustained release therapeutic agent in a human body wherein said sustained release therapeutic agent comprises a painkiller absorbed on a polymeric surface.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 35 U.S.C. §§ 101 and 112, second paragraph; MPEP § 2173.05(q). The claim in (B) recites two positive steps of using paint — applying it to a surface, and removing the excess. (A), (C) and (D) are not proper process claims because they do not recite a positive step specifying HOW the use is accomplished; for example, (A) does not set forth the step(s) by which the antibodies isolate interferon.',
  },
  {
    id: 'uspto-nov99-pm-40',
    topicId: 0,
    subtopic: 'Market testing is not experimental purpose',
    difficulty: 2,
    question:
      'Which of the following factors would not be indicative of an experimental purpose for testing a utility invention?',
    options: [
      'Testing is conducted over a substantial period of time to determine the operativeness of the invention.',
      'Testing is conducted under the supervision and control of the inventor.',
      'Testing to determine product acceptance or market testing.',
      'The nature of the invention was such that any testing had to be, to some extent, public.',
      'The inventor regularly inspected the invention during the period of experimentation.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 102; MPEP §§ 2133.03(e)(4) and 2133.03(e)(6). Market testing is not an experimental purpose. [Pre-AIA] — the experimental-use analysis is under pre-AIA § 102(b). NOTE: this item\'s answer line reads "40. ANSWER: (C )." with a space inside the parenthesis, a pdftotext artifact.',
  },
  {
    id: 'uspto-nov99-pm-41',
    topicId: 1,
    subtopic: '"About" pushes a dependent claim outside the parent range',
    difficulty: 3,
    question:
      'Your client invented a miniature vacuum tube comprising a capacitor having a capacitance of 0.003 to 0.012 µf, preferably 0.006 µf. Claim 1 reads: "A miniature vacuum tube comprising a capacitor having a capacitance of 0.003 to 0.012 µf." Which of the following would not be a proper dependent claim if presented as an original claim in the application?',
    options: [
      '2. The miniature vacuum tube of Claim 1 wherein the capacitor has a capacitance of 0.006 µf.',
      '2. A miniature vacuum tube as in Claim 1 wherein the capacitor has a capacitance of 0.006 to 0.012 µf.',
      '2. A miniature vacuum tube as in Claim 1 wherein the capacitor has a capacitance of about 0.003 to 0.011 µf.',
      '2. The miniature vacuum tube of Claim 1 wherein the capacitor has a capacitance of between 0.005 and 0.012 µf.',
      '(C) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). It fails to comply with 37 C.F.R. § 1.75(c) because it does not properly limit the capacitance recited in Claim 1 — the term "about" allows for a range slightly above 0.011 µf or below 0.003 µf, and a range below 0.003 is outside the scope of Claim 1. MPEP § 2144.05. (A), (B), and (D) are proper dependent claims limiting capacitance to values within the scope of Claim 1; in (D) the applicant may rely upon the original claim for the description of the range. MPEP § 608.01(l). (E) is wrong because (D) is proper.',
  },
  {
    id: 'uspto-nov99-pm-42',
    topicId: 1,
    subtopic: 'A multiple dependent claim may not depend on another multiple dependent claim',
    difficulty: 2,
    question: 'A multiple dependent claim may not properly depend upon ______________.',
    options: [
      'an independent claim.',
      'another dependent claim.',
      'any other multiple dependent claim.',
      'a claim containing Markush language.',
      'a claim which is in Jepson-type format.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. § 1.75(c); MPEP § 608.01(n).',
  },
  {
    id: 'uspto-nov99-pm-43',
    topicId: 0,
    subtopic: 'An assignment of patent rights is not a sale of "the invention"',
    difficulty: 3,
    question:
      'In which of the following situations, considered independently of each other, does the event described below not constitute a statutory bar to the granting of a patent on an application filed August 30, 1999, claiming a bottle cap?',
    options: [
      'The inventor reduced the invention to practice in June, 1998, and sold the claimed bottle caps to a bottling company on July 30, 1998. The sale was conditioned on the bottling company’s satisfaction.',
      'The inventor reduced to practice in June, 1998, and sold the claimed bottle caps to bottling companies beginning July 30, 1998. Although sold to commercially exploit the invention, the inventor’s costs exceeded income and he did not profit.',
      'The inventor reduced to practice in June, 1998, and on July 30, 1998, assigned to Company X his patent rights to the claimed bottle cap invention for good and valuable consideration.',
      'The inventor reduced to practice in June, 1998, and on July 30, 1998, offered to sell his inventory of the claimed bottle cap to a bottling company. The sale was not consummated until September 3, 1999.',
      'The inventor reduced to practice in June, 1998, and the inventor’s offer, on July 30, 1998, to sell the claimed bottle caps was delayed in the mail and not received by the company until September 10, 1998.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 102(b); MPEP § 2133.03(b): "An assignment or sale of the rights, such as patent rights, in the invention is not a sale of \'the invention\' within the meaning of section 102(b). The sale must involve the delivery of the physical invention itself." Moleculon Research Corp. v. CBS, Inc., 793 F.2d 1261 (Fed. Cir. 1986). (A) is incorrect — a sale conditioned on buyer satisfaction does not without more prove an experimental purpose. Strong v. General Elec. Co., 434 F.2d 1042 (5th Cir. 1970). (B) is incorrect — a sale need not be for profit to bar a patent. In re Dybel, 187 USPQ 593 (CCPA 1975). (D) is incorrect — it is not necessary that a sale be consummated. Buildex v. Kason Indus., 849 F.2d 1461 (Fed. Cir. 1988). (E) is incorrect — a mere offer suffices, and the offer need not even be actually received. In re Theis, 610 F.2d 786 (CCPA 1979); Wende v. Horine, 225 F. 501 (7th Cir. 1915). [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-nov99-pm-44',
    topicId: 0,
    subtopic: 'Provisional § 102(e)/103 rejection requires a common assignee and a later filing',
    difficulty: 3,
    question:
      'G is the sole inventor in an application describing and claiming a surgical instrument. H is the sole inventor in an application describing G’s surgical instrument, as well as describing and claiming a modified embodiment of it. Under which circumstance is it most likely that you will need to overcome a provisional 35 U.S.C. § 102(e)/103 rejection in G’s application?',
    options: [
      'G’s application is filed in the PTO before H’s application, and they do not have a common assignee.',
      'H’s application is filed in the PTO before G’s application, and they do not have a common assignee.',
      'G’s application is filed in the PTO on the same date as H’s application, and they have a common assignee.',
      'G’s application is filed in the PTO after H’s application, and they have a common assignee.',
      'G’s application is filed in the PTO before H’s application, and they have a common assignee.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Applications are kept in confidence under 35 U.S.C. § 122, but when applications share a common assignee an examiner may provisionally reject claims under § 102(e)/103 in the LATER filed application. MPEP § 706.02(k). (A) and (E) are incorrect because such a rejection would not maintain the confidence of the applications. (B) is incorrect — with no common assignee, confidentiality must be maintained and no rejection can rely on the earlier filed application as prior art. MPEP § 706.02(g). (C) is incorrect because a provisional § 102(e)/103 rejection cannot properly be made when the applications have the same filing date (a provisional double patenting rejection may be proper). [Pre-AIA] — decided under pre-AIA § 102(e).',
  },
  {
    id: 'uspto-nov99-pm-45',
    topicId: 1,
    subtopic: 'Interconnection of elements is no longer required in a claim',
    difficulty: 3,
    question:
      'Based on drawings and a description of a toy building element for use as a dump body — comprising an open container part and a bottom, hingedly interconnected, the bottom provided with coupling means for coupling with other toy elements — which of the following claims, if any, are in accordance with proper PTO practice and procedure?',
    options: [
      'A toy building element for use as a dump body (1) for a toy vehicle, said toy building element comprising an open container part (3) and a bottom (4).',
      'A toy building element for use as a dump body (1) for a toy vehicle, said toy building element comprising an open container part (3) and a bottom (4), said container part (3) and bottom (4) being hingedly interconnected by a hinge (2).',
      'A toy building element comprising an open container part and a bottom, said open container part and bottom being hingedly interconnected, said bottom being provided with coupling means for coupling with other toy building elements.',
      '(A), and (B).',
      '(A), (B), and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. § 112, first and second paragraphs. Interconnection of the elements as described in the written description provided by the inventor and as disclosed in the drawings is no longer required.',
  },
  {
    id: 'uspto-nov99-pm-46',
    topicId: 3,
    subtopic: '37 C.F.R. § 1.129(a) — new evidence must precede the appeal brief',
    difficulty: 3,
    question:
      'On June 22, 1999, you receive a final Office action dated June 17, 1999 that did not set a shortened statutory period for reply. Under which circumstances is it most likely your submission of new evidence under 37 CFR § 1.129(a) in support of patentability, along with the appropriate fee, will result in the automatic withdrawal of the finality of the final rejection?',
    options: [
      'The application is filed on June 8, 1995, it has an effective filing date of June 8, 1993, and you file the submission on October 14, 1999, one month after you file a Notice of Appeal to the Board of Patent Appeals and Interferences.',
      'The application is filed on June 7, 1995, it has an effective filing date of June 8, 1993, and you file the submission on October 14, 1999, one month after you file an appeal brief to the Board of Patent Appeals and Interferences.',
      'The application is filed on June 8, 1995, it has an effective filing date of June 7, 1993, and you file the submission on December 20, 1999.',
      'The application is filed on June 7, 1995, it has an effective filing date of June 7, 1993, and you file the submission on the same day you file an appeal brief to the Board of Patent Appeals and Interferences.',
      '(A) and (C).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). An applicant in an application filed on or before June 8, 1995 with an effective filing date of June 8, 1993 or earlier is entitled to have new evidence entered and the finality withdrawn, provided the submission and fee are filed PRIOR to the filing of an appeal brief or abandonment. 37 C.F.R. § 1.129(a); MPEP § 706.07(g). (B) and (D) are incorrect because the submission was not filed prior to the appeal brief. (C) is incorrect because the submission was not filed prior to abandonment. (E) is incorrect because (C) is incorrect. [Historical practice] — § 1.129(a) was a transitional rule for applications pending on 8 June 1995.',
  },
  {
    id: 'uspto-nov99-pm-47',
    topicId: 3,
    subtopic: 'Overcoming § 102(b) by deleting the anticipated Markush member',
    difficulty: 3,
    question:
      'You filed a patent application containing a claim to a composition wherein X is defined as "X is a member selected from the group consisting of elements A, B, and C." The claim is properly rejected under 35 U.S.C. § 102(b) as anticipated by a reference describing the same composition wherein X is element A. The rejection may be properly overcome by:',
    options: [
      'Amending the claim by canceling elements B and C because the reference is concerned only with element A.',
      'Arguing that the reference is not relevant because it lacks elements B and C.',
      'Amending the claim by canceling element A from the Markush group.',
      'Amending the claim by changing "consisting of" to "consisting essentially of."',
      'Amending the claim to redefine X as "being a member selected from the group comprising elements A, B, and C."',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 102(b); MPEP §§ 715.03, 2111.03, and 2173.05(h). Deletion of the anticipated element from the claim leaves an invention which is no longer anticipated by the reference. (A), (D), and (E) are incorrect because despite the amendments the claim remains anticipated — element A would still be a member of the group. (B) is incorrect because the argument does not change the fact that the claim remains anticipated. (E) is also incorrect because "comprising" cannot be used in a proper Markush group. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-nov99-pm-48',
    topicId: 0,
    subtopic: 'Overcoming § 102(e) by showing the reference describes applicant’s own work',
    difficulty: 3,
    question: 'Which of the following statements is in accordance with proper PTO practice and procedure?',
    options: [
      'A claim to a computer which recites various components, such as motherboard and RAM, which are old in the art, as well as a novel disc drive, is unpatentable under 35 U.S.C. § 102(f) inasmuch as the inventor derived one or more components, and did not himself invent each of the components of the claimed computer.',
      'Where a patent granted to Able discloses subject matter being claimed in an application filed by Baker undergoing examination, the designation of Able as the sole inventor in Able’s patent raises a presumption of inventorship with respect to the subject matter disclosed but not claimed in the patent.',
      'A terminal disclaimer overcomes a rejection under 35 U.S.C. § 102(e).',
      'When Able’s patent application, filed on June 2, 1999, is rejected based on unclaimed subject matter of a patent granted to Smith on July 6, 1999, on Smith’s application filed on February 18, 1997, and the unclaimed subject matter is Able’s own invention, Able may overcome a prima facie case by showing that the patent discloses Able’s own previous work.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 2136.05. (A) is incorrect — "The mere fact that a claim recites the use of various components, each of which can be argumentatively assumed to be old, does not provide a proper basis for a rejection under 35 U.S.C. 102(f)." Ex parte Billottet, 192 USPQ 413 (Bd. App. 1976); derivation requires complete conception and communication by another. Kilbey v. Thiele, 199 USPQ 290 (Bd. Pat. Inter. 1978). (B) is incorrect — the designation of inventorship in a patent does not raise a presumption of inventorship with respect to subject matter disclosed but UNCLAIMED. MPEP § 2137. (C) is incorrect — a terminal disclaimer does not overcome a § 102(e) rejection. In re Bartfeld, 925 F.2d 1450 (Fed. Cir. 1991). [Pre-AIA] — decided under pre-AIA §§ 102(e) and 102(f).',
  },
  {
    id: 'uspto-nov99-pm-49',
    topicId: 2,
    subtopic: 'Retaining the filing date when a figure was omitted',
    difficulty: 3,
    question:
      'In preparing an application claiming only apparatus, you inadvertently forgot to include a figure in the drawings. You did include a brief description of the figure in the specification, but the invention of Claim 10 cannot be understood without the omitted figure. You realized this only after filing. The application as filed included a proper § 1.63 declaration signed by the inventor. What document(s), if any, must be filed in the PTO to obtain the original filing date?',
    options: [
      'An amendment deleting the description of the figure and Claim 10, and a petition with the proper fee to have the application accepted without the omitted figure.',
      'An amendment filed before the first Office action deleting all references to the omitted figure and Claim 10 to have the application accepted without the omitted figure.',
      'A petition and an amendment to add the figure to the application as soon as possible, and a supplemental declaration stating the omitted figure accurately illustrates and is part of the applicant’s invention.',
      'The omitted figure along with a supplemental oath or declaration stating that the omitted figure accurately illustrates and is part of the applicant’s invention.',
      'An amendment adding the figure to the application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. § 1.53; MPEP §§ 601.01 and 601.01(g). The only way to retain the ORIGINAL filing date of the application is to delete all reference to the omitted figure and comply with the requirements set forth in MPEP § 608.02 — adding the figure later would be new matter and would cost the original date.',
  },
  {
    id: 'uspto-nov99-pm-50',
    topicId: 0,
    subtopic: 'The suggestion to modify may be implicit',
    difficulty: 3,
    question:
      'Prior art references have been combined to show obviousness of the claimed invention under 35 U.S.C. § 103. Which of the following most correctly completes the statement: "In establishing obviousness, ______________',
    options: [
      'a suggestion to modify the art must be expressly stated in one of the references used to show obviousness."',
      'a suggestion to modify the art must be expressly stated in all the references used to show obviousness."',
      'a suggestion to modify the art may be inherently or implicitly taught in one of the references used to show obviousness."',
      'a suggestion to modify the art is unnecessary unless the patent applicant presents evidence or argument tending to show unobviousness."',
      'a suggestion to modify the art can come from recent nonanalogous prior art references."',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 35 U.S.C. § 103; In re Napier, 55 F.3d 610 (Fed. Cir. 1995); In re Grasselli, 713 F.2d 731 (Fed. Cir. 1983); MPEP § 2112. (A) and (B) are incorrect because a suggestion to modify need not be expressly stated in one or all of the references. (D) is incorrect — the burden is on the examiner to show that the prior art suggests the modification; only if that burden is met does it shift to the applicant. Hodosh v. Block Drug Co., 786 F.2d 1136 (Fed. Cir. 1986). (E) is incorrect because only ANALOGOUS art can be used in a § 103 rejection. [Pre-AIA] — analysis under pre-AIA § 103.',
  },
];

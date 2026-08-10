/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — April 12, 2000, MORNING (AM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo0004aq.pdf / edo0004aa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files in this directory):
 *  - Stems and options are VERBATIM, in the official order (A)-(E).
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * DISCARDED QUESTION: Q15 only. Its model answer reads "15. ANSWER: All
 * answers accepted." — the USPTO threw it out, so it is not ingested and 49
 * of the 50 delivered questions are scoreable. Swept case-insensitively.
 *
 * DUAL-KEYED QUESTIONS: none.
 *
 * ERA NOTES. This paper predates the AIA by eleven years. Items turning on
 * pre-AIA § 102/§ 103 carry [Pre-AIA]; items turning on superseded procedure
 * carry [Historical practice]. Worth calling out specifically:
 *  - Q44 and Q49 are keyed to the 37 C.F.R. Part 10 Code of Professional
 *    Responsibility, REPLACED in 2013 by the Part 11 Rules of Professional
 *    Conduct. Q49's answer turns on § 10.84(b)(2) specifically.
 *  - Q43 is interference practice under § 135(b); the AIA replaced
 *    interferences with derivation proceedings for post-March-2013 filings.
 *  - Q33 applies the URAA transitional term rule (greater of 17-from-grant or
 *    20-from-filing), which reaches only applications filed before 8 June 1995.
 *  - Q46 applies the pre-2003 § 1.121 reissue amendment format.
 *  - Q11 relies on 35 U.S.C. § 104, repealed by the AIA.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_APR2000_AM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'April 12, 2000',
  session: 'Morning (AM)',
  questionsFile: 'edo0004aq.pdf',
  answersFile: 'edo0004aa.pdf',
  totalDelivered: 50,
  discarded: [15],
  ingested: 49,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_APR2000_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-apr00-am-01',
    topicId: 0,
    subtopic: 'Inherent anticipation — overlapping ranges',
    difficulty: 3,
    question:
      'The claimed invention in a patent application is directed to an explosive composition "comprising 60-90% solid ammonium nitrate, and 10-40% water-in-oil in which sufficient aeration is entrapped to enhance sensitivity to a substantial degree." A prior art reference, published more than two years before the effective filing date of the application, discloses explosive compositions containing water-in-oil emulsions having identical ingredients to those claimed, in ranges overlapping with the claimed composition. The only element of the claim not recited in the reference is "sufficient aeration entrapped to enhance sensitivity to a substantial degree." The reference does not recognize that sufficient aeration sensitizes the fuel to a substantial degree. However, in fact, "sufficient aeration" is necessarily an inherent element in the prior art blasting composition within the overlapping ranges inasmuch as the blasting composition explodes. The prior art reference:',
    options: [
      'anticipates the claim because it discloses every limitation of the claim either explicitly or inherently.',
      'does not anticipate the claim because the prior art reference does not recognize an inherent property.',
      'does not anticipate the claim because the prior art reference does not recognize an inherent function of oxygen.',
      'does not anticipate the claim because the prior art reference does not recognize an inherent ingredient, oxygen.',
      '(B), (C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 102. When a patent claims a composition in terms of ranges of element, any single prior art reference falling within each of the ranges anticipates the claim. Atlas Powder Co. v. IRECO, Inc., 51 USPQ2d 1943 (Fed. Cir. 1999) ("Artisans of ordinary skill may not recognize the inherent characteristics or functioning of the prior art… However, the discovery of a previously unappreciated property of a prior art composition… does not render the old composition new to the discoverer."). (B), (C) and (D) are not the most correct answers because the prior art reference, to anticipate, is not required to recognize an inherent property, function or ingredient. (E) is not most correct because (A) is correct. [Pre-AIA] — decided under pre-AIA § 102.',
  },
  {
    id: 'uspto-apr00-am-02',
    topicId: 5,
    subtopic: 'Certificate of Correction — scope of correctable errors',
    difficulty: 3,
    question: 'A Certificate of Correction effectuates correction of an issued patent where:',
    options: [
      'Through error and without deceptive intent, there is a failure to make reference to a prior copending application according to 37 C.F.R. § 1.78, and the failure does not otherwise affect what is claimed, but the prior copending application is referenced in the record of the application, and a petition under 37 C.F.R. § 1.324 and appropriate fees were filed.',
      'Through error and without deceptive intent, a preferred embodiment that materially affects the scope of the patent was omitted in the original disclosure in the filed application, and a petition under 37 C.F.R. § 1.324 and appropriate fees were filed.',
      'Through error and without deceptive intent, a prior copending application is incorrectly referenced in the application, the incorrect reference does not otherwise affect the claimed subject matter, and the prior copending application is correctly identified elsewhere in the application file, and a petition under 37 C.F.R. § 1.324 and appropriate fees were filed.',
      'Through error and without deceptive intent, an inventor’s name is omitted from an issued patent, a petition under 37 C.F.R. § 1.324 and appropriate fees were filed, and the petition was granted.',
      '(A), (C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. (A) and (C) can be corrected by a Certificate of Correction. MPEP § 1481. (D) can be corrected by a Certificate of Correction. 37 C.F.R. § 1.324; MPEP § 1481. (B) is incorrect — such a mistake, which affects the scope and meaning of the claims in a patent, is not considered to be of the "minor" character required for issuance of a Certificate of Correction.',
  },
  {
    id: 'uspto-apr00-am-03',
    topicId: 1,
    subtopic: 'Multiple dependent claims',
    difficulty: 2,
    question: 'A multiple dependent claim:',
    options: [
      'may indirectly serve as a basis for another multiple dependent claim.',
      'added by amendment to a pending patent application should not be entered until the proper fee has been received by the PTO.',
      'may directly serve as a basis for another multiple dependent claim.',
      'is properly construed to incorporate by reference all the limitations of each of the particular claims to which it refers.',
      '(B) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because (B) and (D) are correct. 37 C.F.R. § 1.75(c); MPEP § 608.01(n). (A) and (C) are incorrect. MPEP § 608.01(n) ("[A] multiple dependent claim may not serve as a basis for any other multiple dependent claim, either directly or indirectly").',
  },
  {
    id: 'uspto-apr00-am-04',
    topicId: 0,
    subtopic: 'On-sale bar — assignment of rights is not a sale of the invention',
    difficulty: 3,
    question:
      'Buddy conceived an idea for an improved baby stroller and explained it to his employer, showing detailed preliminary drawings without any agreement as to confidentiality. Buddy wanted use of his employer’s machine shop to build a model. The two reached an oral agreement: Buddy would have free use of the machine shop after hours, and in exchange Buddy agreed to assign any patent rights in his invention to the employer for $1000.00. Only Buddy and, occasionally, his employer were ever present in the shop. Buddy finalized the design just over a year later, and a patent application was on file within a month of finalization. During prosecution the examiner learned of the oral agreement and rejected the claims on the basis that the invention was on sale more than one year before the application filing date. Which of the following would provide the most reasonable basis for traversing the rejection?',
    options: [
      'The Examiner cannot properly make the rejection because it is not based on prior art patents or printed publications.',
      'The oral agreement was a private transaction between Buddy and his employer and no private transaction can provide a basis for an on-sale bar.',
      'An assignment or sale of the rights in an invention and potential patent rights is not a sale of "the invention" that would operate as a bar to patentability.',
      'Because no one other than Buddy’s employer was present in the shop when Buddy was working on the stroller and the oral agreement was not public, there can be no on-sale bar even though there was no express requirement of confidentiality.',
      'Although the oral agreement to assign the patent to Buddy’s employer was made more than a year before the filing date, the written assignment was less than a year before the filing date, and under the Statute of Frauds, sales for more than $500.00 require a written agreement. A rejection based on the on-sale bar can never be made unless there is a binding contract for sale.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Moleculon Research Corp. v. CBS, Inc., 229 USPQ 805, 809 (Fed. Cir. 1986); MPEP § 2133.03(b). Although reexaminations are limited to prior art patents and printed publications, that limitation is not present in original prosecution, so (A) is incorrect. (B) and (D) are wrong because there is no requirement that on-sale activity be public. (E) is wrong at least because an on-sale bar does not require an actual sale; a bar can also be based on an offer to sell. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-apr00-am-05',
    topicId: 1,
    subtopic: 'Dependent claims may not broaden the parent — "consisting of"',
    difficulty: 3,
    question:
      'A patent application includes Claim 1, a method of making an electrical device comprising the steps of (i) heating a base made of carbon to a first temperature in the range of 1875°C to 1925°C; (ii) passing a first gas over said heated base, said first gas comprising a mixture of hydrogen, SiCl4, phosphorus, and methane…; (iii) heating said base having said deposited layer to a second temperature of approximately 1620°C; and (iv) passing a second gas over said base heated to said second temperature, said second gas consisting of a mixture of hydrogen, SiCl4, AlCl3, and methane… Assuming proper support in the specification, which of the following claims, if presented in the same application, is a proper claim?',
    options: [
      'Claim 2. The method of claim 1, wherein said first temperature is in the range of 1800°C to 2000°C.',
      'Claim 3. The method of claim 1, wherein said first gas further comprises an inert gas.',
      'Claim 4. The method of claim 1, wherein said second gas further comprises Argon.',
      'Claim 5. The method of claim 1, wherein said first gas is an inert gas such as Argon.',
      'Claim 6. The method of claim 1, wherein said second gas consists of a mixture of hydrogen, SiCl4 and AlCl3 only.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Answers (A) and (E) are incorrect because they improperly seek to broaden the parent claim. 37 C.F.R. § 1.75(c). (A) broadens the range by going below the stated limit; (E) broadens by trying to remove a member of the Markush group. (C) is incorrect because claim 1 uses the close-ended term "consists" in connection with the second gas, which precludes the addition of further components. (D) is incorrect because the exemplary language "such as" is improper under 35 U.S.C. § 112, second paragraph, and is inconsistent with claim 1. MPEP § 2173.05(d).',
  },
  {
    id: 'uspto-apr00-am-06',
    topicId: 1,
    subtopic: 'Product-by-process claims',
    difficulty: 3,
    question: 'Which of the following statements is true regarding a product-by-process claim?',
    options: [
      'Product-by-process claims cannot vary in scope from each other.',
      'Product-by-process claims may only be used in chemical cases.',
      'A lesser burden of proof may be required to make out a case of prima facie obviousness for product-by-process claims than is required to make out a prima facie case of obviousness when the product is claimed in the conventional fashion.',
      'It is proper to use product-by-process claims only when the process is patentable.',
      'It is proper to use product-by-process claims only when the product is incapable of description in the conventional fashion.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2113, citing In re Fessman, 489 F.2d 742, 180 USPQ 324 (CCPA 1974). (A) and (E) are incorrect because "[t]he fact that it is necessary for an applicant to describe his product in product-by-process terms does not prevent him from presenting claims of varying scope." MPEP § 2173.05(p). (D) is incorrect because determination of patentability is based on the product itself; if the product is the same as or obvious from a product of the prior art, the claim is unpatentable even though the prior art was made by a different process. (B) is incorrect — such a reference to process may appear in device, apparatus or composition claims.',
  },
  {
    id: 'uspto-apr00-am-07',
    topicId: 1,
    subtopic: 'Antecedent basis — most broadly completing an independent claim',
    difficulty: 3,
    question:
      'An application directed to hand shearing of sheep includes an incomplete independent Claim 1 with elements (i) a first cutting member having a first cutting edge at one end and a thumb loop at the other end; (ii) a second cutting member having a second cutting edge at one end and a finger loop at the other end; (iii) [blank]; and (iv) said second cutting member additionally including a pointer loop between said finger loop and said mid-point… Claim 2 recites a threaded aperture extending through said first cutting member between said thumb loop and said mid-point, and Claim 3 recites "wherein said connector is a rivet." Which of the following most broadly completes missing paragraph (iii) of Claim 1?',
    options: [
      '"wherein said first cutting member and said second cutting member are pivotally secured to each other at respective mid-points, and wherein said finger loop is padded; and"',
      '"said first cutting member having a mid-point between its ends and said second cutting member having a mid-point between its ends, wherein said first cutting member and said second cutting member are pivotally secured to each other at their respective mid-points by a connector; and"',
      '"said first cutting member including a reservoir for dispensing disinfectant solution and having a mid-point between its ends, said second cutting member having a mid-point between its ends, and wherein said first cutting member and said second cutting member are pivotally secured to each other at their respective mid-points by a connector; and"',
      '"said first cutting member and said second cutting member being pivotally secured to each other by a connector; and"',
      '"said first cutting member having a mid-point between its ends and said second cutting member having a mid-point between its ends, and said first cutting member and said second cutting member are pivotally secured to each other at their respective mid-points; and"',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Answer (B) provides proper antecedent basis for "said mid-point" in part (iv) of Claim 1 and in Claim 2, and "said connector" in Claim 3. (A) is incorrect at least because it does not provide antecedent basis for "said connector" in Claim 3. (C) is narrower than (B) because it includes the additional limitation of a reservoir and therefore does not "most broadly" complete claim 1. (D) is incorrect because it does not provide proper antecedent basis for "said mid-point." (E) is incorrect because it does not provide antecedent basis for "said connector."',
  },
  {
    id: 'uspto-apr00-am-08',
    topicId: 3,
    subtopic: 'Appeal brief due date measured from the Advisory Action',
    difficulty: 3,
    question:
      'Applicant received a Final Rejection with a mail date of Tuesday, February 29, 2000. The Final Rejection set a 3 month shortened statutory period for reply. Applicant files an Amendment and a Notice of Appeal on Monday, March 27, 2000. The examiner indicates in an Advisory Action that the Amendment will be entered for appeal purposes. The mail date of the examiner’s Advisory Action is Wednesday, May 31, 2000. Which of the following dates is the last date for filing a Brief on Appeal without an extension of time?',
    options: [
      'Saturday, May 27, 2000.',
      'Monday, May 29, 2000 (a Federal holiday, Memorial Day).',
      'Tuesday, May 30, 2000.',
      'Wednesday, May 31, 2000.',
      'Tuesday, August 29, 2000.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 710.02(e): "If an applicant initially replies within 2 months from the date of mailing of any final rejection setting a 3-month shortened statutory period for reply and the Office does not mail an advisory action until after the end of the 3-month shortened statutory period, the period for reply for purposes of determining the amount of any extension fee will be the date on which the Office mails the Advisory Action…" Hence the time allowed for reply is the mail date of the Advisory Action, May 31, 2000. 37 C.F.R. § 1.192(a): appellant must file a brief "within two months from the date of the notice of appeal… or within the time allowed for reply to the action from which the appeal was taken, if such time is later." (A), (B) and (C) recite earlier dates; (E) is after the last date without an extension.',
  },
  {
    id: 'uspto-apr00-am-09',
    topicId: 3,
    subtopic: 'Preserving the right to petition review of a restriction requirement',
    difficulty: 3,
    question:
      'A non-final Office action contains a restriction requirement between two groups of claims (Group 1 and Group 2). Which of the following, if included in a timely reply under 37 C.F.R. § 1.111, preserves applicant’s right to petition the Commissioner to review the restriction requirement? I. Applicant’s entire reply is: "The examiner erred in distinguishing between Group 1 and Group 2, and therefore the restriction requirement is respectfully traversed and no election is being made…" II. Applicant’s entire reply is: "Applicant elects Group 1 and respectfully traverses the restriction requirement, because the examiner erred in requiring a restriction between Group 1 and Group 2." III. Applicant’s reply distinctly points out detailed reasons why the examiner erred, and additionally sets forth, "Applicant therefore respectfully traverses the restriction requirement and no election is being made…" IV. Applicant’s reply distinctly points out detailed reasons why the examiner erred, and additionally sets forth, "Applicant therefore respectfully traverses the restriction requirement and elects Group 2."',
    options: ['I.', 'II.', 'III.', 'IV.', 'None of the above.'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.111(b); MPEP §§ 818.03(a)-(c). (I) is incorrect since the traversal does not distinctly point out the supposed errors in the examiner’s action, and no election is made. 37 C.F.R. § 1.143. (II) is incorrect since the traversal does not distinctly point out the supposed errors. (III) is incorrect since no election is made. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-apr00-am-10',
    topicId: 0,
    subtopic: 'Foreign printed publication as prior art',
    difficulty: 3,
    question:
      'Mario conceived of an aerodynamic hockey helmet design while travelling through Germany (a WTO member country) in December 1998. On February 1, 1999, without Mario’s knowledge or permission, his brother Luigi anonymously published a promotional article written by Mario fully disclosing how the Wing Cap was made and used, in Moose Jaw Monthly, a regional Canadian magazine not distributed in the United States. The Wing Cap was first reduced to practice on March 17, 1999. A United States patent application naming Mario as sole inventor was filed September 17, 1999, and has been rejected as anticipated by the Moose Jaw Monthly article. Which of the following statements is most correct?',
    options: [
      'The promotional article cannot be used as prior art because the Wing Cap had not been reduced to practice at the time the article appeared in the regional Canadian magazine.',
      'The regional Canadian magazine article is not prima facie prior art because it was published without Mario’s knowledge or permission.',
      'The regional Canadian magazine article is not prima facie prior art because it appeared in a regional Canadian publication and does not evidence knowledge or use in the United States.',
      'The promotional article in the regional Canadian magazine constituted an offer to sell that operates as an absolute bar against Mario’s patent application.',
      'Mario, as the inventor, can overcome the rejection by filing an affidavit under 37 C.F.R. § 1.132 establishing that he is the inventor, and the article describes his work.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP § 716.10. There is no requirement that a publication describe something actually reduced to practice before it can act as prior art, so (A) is not correct. There is no requirement under § 102 that a publication be made with an inventor’s knowledge or permission, so (B) is incorrect. (C) is incorrect at least because the Wing Cap was "described in a printed publication in… a foreign country" (35 U.S.C. § 102(a)) before Mario’s filing date and is therefore presumptive prior art. (D) is incorrect because even if the article constituted an offer to sell, it was not in this country and was made less than a year prior to Mario’s filing date. [Pre-AIA] — decided under pre-AIA § 102(a)/(b).',
  },
  {
    id: 'uspto-apr00-am-11',
    topicId: 4,
    subtopic: '35 U.S.C. § 104 — establishing a date of invention abroad',
    difficulty: 3,
    question:
      'Mario conceived of the hockey helmet design in Germany (a WTO member country) in December 1998 and returned to Canada (a NAFTA country) to market it. Which of the following statements is most correct?',
    options: [
      'In a priority contest against another inventor, Mario can rely on his activities in Canada in establishing a date of invention.',
      'In a priority contest against another inventor, Mario can rely on his activities in Germany in establishing a date of invention.',
      'Mario can rely on his activities in Canada in establishing a date of invention prior to publication of the regional Canadian magazine article.',
      '(A) and (C).',
      '(A), (B), and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Mario may rely on activities in both Germany (a WTO member country) and Canada (a NAFTA country) in establishing a date of invention prior to publication of the Moose Jaw Monthly article or in establishing priority. 35 U.S.C. § 104; see also MPEP § 715.01(c). [Pre-AIA] — the AIA repealed § 104 and replaced the first-to-invent priority contest with first-inventor-to-file.',
  },
  {
    id: 'uspto-apr00-am-12',
    topicId: 2,
    subtopic: 'Separate verification statements eliminated by 37 C.F.R. § 10.18(b)',
    difficulty: 2,
    question: 'Which of the following documents, if any, must also contain a separate verification statement?',
    options: [
      'Small entity statements.',
      'A petition to make an application special.',
      'A claim for foreign priority.',
      'An English translation of a non-English language document.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP § 410 makes clear that the certification requirement set forth in 37 C.F.R. § 10.18(b) "has permitted the PTO to eliminate the separate verification requirement previously contained in 37 C.F.R. …1.27 [small entity statements], …1.52 [English translations of non-English documents], …1.55 [claim for foreign priority], [and] …1.102 [petition to make an application special]."',
  },
  {
    id: 'uspto-apr00-am-13',
    topicId: 1,
    subtopic: '35 U.S.C. § 112, first paragraph — scope of enablement',
    difficulty: 3,
    question:
      'The specification of a patent application contains limited disclosure of using antisense technology in regulating three particular genes in E. coli cells, with three corresponding examples. Despite the limited disclosure, the specification states that "the practices of this invention are generally applicable with respect to any organism containing genetic material capable of being expressed such as bacteria, yeast, and other cellular organisms." All of the original claims are broadly directed to the application of antisense technology to any cell. The examiner rejects the claims under 35 U.S.C. § 112, first paragraph, for lack of enablement citing a publication that correctly notes antisense technology is highly unpredictable, requiring experimentation to ascertain whether the technology works in each type of cell. The publication cites the inventor’s own articles (published after the application was filed) that include examples of the inventor’s own failures. The rejection is:',
    options: [
      'appropriate. The claims are not commensurate in scope with the breadth of enablement inasmuch as the working examples in the application are narrow compared to the wide breadth of the claims, the unpredictability of the technology, the high quantity of experimentation needed to practice the technology in cells other than E. coli.',
      'appropriate. The claims are not commensurate in scope with the breadth of the enablement inasmuch no information is provided proving the technology is safe when applied to animal consumption.',
      'inappropriate. The claims are commensurate in scope with the breadth of enablement inasmuch as the specification discloses that the "the practices of this invention are generally applicable with respect to any organism containing genetic material capable of being expressed."',
      'inappropriate. The claims are commensurate in scope with the breadth of enablement inasmuch as the claims are original, and therefore are self-supporting.',
      'inappropriate. The claims are commensurate in scope with the breadth of the enablement inasmuch as the inventor is not required to theorize or explain why the failures reported in the article occurred.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 112, first paragraph. Enzo Biochem, Inc. v. Calgene, Inc., 52 USPQ2d 1129 (Fed. Cir. 1999). MPEP § 2164.01: the question is whether the experimentation needed to practice the invention is undue or unreasonable. In re Wands, 858 F.2d 731, 8 USPQ2d 1400 (Fed. Cir. 1988). (B) is incorrect — § 101 utility does not require demonstrating safety for human or animal consumption. In re Brana, 51 F.3d 1560 (Fed. Cir. 1995). (C) is incorrect because the disclosure is inconsistent with published information. (D) is incorrect — enablement is found in the specification preceding the claims; the claims do not provide their own enablement. (E) is incorrect — the lack of necessity to theorize does not alleviate the inventor from providing an enabling disclosure commensurate in scope with the claims.',
  },
  {
    id: 'uspto-apr00-am-14',
    topicId: 3,
    subtopic: 'Who may sign a 37 C.F.R. § 1.131 affidavit',
    difficulty: 3,
    question:
      'On August 7, 1997, practitioner Costello filed a patent application identifying Laurel, Abbot, and Hardy as inventors. Each named inventor assigned his patent rights to Burns just prior to filing. Laurel and Abbot, alone, jointly invented the subject matter of independent claim 1. Hardy contributed to inventing the subject matter of claim 2, which properly depends upon claim 1. The examiner rejected claims 1 and 2 under 35 U.S.C. § 102(a) as anticipated by a journal article by Allen, dated July 9, 1997. Laurel, Abbot, and Hardy are readily available to provide evidence in support of and sign an antedating affidavit under 37 C.F.R. § 1.131. Which of the following may properly make an affidavit under 37 C.F.R. § 1.131 to overcome the rejection of claims 1 and 2?',
    options: [
      'Laurel and Abbot.',
      'Laurel, Abbot, and Hardy.',
      'Laurel, Hardy and Burns.',
      'Burns only.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 715.04. (A) is incorrect since it cannot be shown that less than all the inventors invented the subject matter of claim 2. (C) and (D) are incorrect since the assignee can make an affidavit under 37 C.F.R. § 1.131 only when it is not possible to produce the affidavit of the inventor; the facts indicate all inventors were readily available. (E) is incorrect since (B) is correct. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-apr00-am-16',
    topicId: 1,
    subtopic: '35 U.S.C. § 112, fourth paragraph — a dependent claim may not broaden',
    difficulty: 3,
    question:
      'A patent specification discloses a personal computer comprising a microprocessor and a random access memory. There is no disclosure of the minimum amount of storage for the random access memory. In the disclosed preferred embodiment, the microprocessor has a clock speed of 100-200 megahertz. Claims 9 and 10 are original claims; Claim 11 was added by amendment. "9. A personal computer comprising a microprocessor and a random access memory including at least 1 gigabyte of storage. 10. The personal computer of Claim 9, wherein the microprocessor has a clock speed of 100-200 megahertz. 11. The personal computer of Claim 10, wherein the random access memory is greater than ½ gigabyte of storage." Which of the following statements is or are true about the respective claims under 35 U.S.C. § 112, fourth paragraph?',
    options: [
      'Claim 9 is a proper independent claim, and Claims 10 and 11 are proper dependent claims.',
      'Claim 9 is a proper independent claim, and Claims 10 and 11 are improper dependent claims.',
      'Claim 9 is an improper independent claim, and Claims 10 and 11 are improper dependent claims.',
      'Claim 9 is an improper independent claim, and Claims 10 and 11 are proper dependent claims.',
      'Claim 9 is a proper independent claim, Claim 10 is a proper dependent claim, and Claim 11 is an improper dependent claim.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. Claim 9, though broad, is supported by the specification; the minimum memory recited in the claim as original disclosure is self-supporting. 35 U.S.C. § 112, first paragraph. Claim 10 is a proper dependent claim because it depends from and further restricts the scope of a preceding claim. 37 C.F.R. § 1.75(c). Claim 11 is an improper dependent claim because it expands upon, as opposed to further restricts, the scope of claim 10 — Claim 10 has a 1 gigabyte memory minimum, whereas Claim 11 sets a lower minimum of ½ gigabyte.',
  },
  {
    id: 'uspto-apr00-am-17',
    topicId: 1,
    subtopic: 'Claim drafting to avoid § 102 — direct contact and negative limitations',
    difficulty: 3,
    question:
      'Smith invented a laminate, most broadly disclosed as comprising a transparent protective layer in continuous, direct contact with a light-sensitive layer without any intermediate layer between them. The prior art published two years before the effective filing date included a laminate containing a transparent protective layer and a light-sensitive layer held together by an intermediate adhesive layer. Which of the following is a proper claim that would overcome a 35 U.S.C. § 102 rejection based on the prior art?',
    options: [
      '1. A laminate comprising a transparent protective layer and a light-sensitive layer.',
      '1. A laminate comprising a transparent protective layer and a light-sensitive layer which is in continuous and direct contact with the transparent protective layer.',
      '1. A laminate comprising a transparent protective layer and a light-sensitive layer, but not including an adhesive layer.',
      '(A) and (B).',
      '(B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because (B) and (C) are correct. (A) does not overcome the prior art because the broad "comprising" language permits the laminate to include additional layers, such as an adhesive layer. MPEP § 2111.03. (B) overcomes a § 102 rejection because the claim requires continuous and direct contact, whereas the prior art interposes an adhesive layer. (C) also avoids the prior art by using a negative limitation to particularly point out and distinctly claim that Smith does not claim any laminate including an adhesive layer. MPEP § 2173.05(i).',
  },
  {
    id: 'uspto-apr00-am-18',
    topicId: 0,
    subtopic: 'Policies underlying the public use bar',
    difficulty: 2,
    question: 'Which of the following is NOT a policy underlying the public use bar of 35 U.S.C. § 102(b)?',
    options: [
      'Discouraging the removal, from the public domain, of inventions that the public reasonably has come to believe are freely available.',
      'Favoring the prompt and widespread disclosure of inventions.',
      'Allowing the inventor(s) a reasonable amount of time following sales activity to determine the potential economic value of a patent.',
      'Increasing the economic value of a patent by extending the effective term of the patent up to one year.',
      'Prohibiting the inventor(s) from commercially exploiting the invention for a period greater than the statutorily prescribed time.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Extending patent term is not a policy underlying any section of 35 U.S.C. § 102. Answers (A), (B), (C) and (E) do state policies underlying the public use bar. Lough v. Brunswick Corp., 86 F.3d 1113, 39 USPQ2d 1100 (Fed. Cir. 1996). [Pre-AIA] — the AIA restructured § 102(b) into the grace-period provisions of § 102(b)(1).',
  },
  {
    id: 'uspto-apr00-am-19',
    topicId: 3,
    subtopic: 'Objection requiring subject matter be shown in the drawings',
    difficulty: 3,
    question:
      'On February 1, 1999, you filed an application on behalf of Williams directed to a system for detecting expired parking meters. One drawing shows a block diagram of the system, illustrating the electronics control unit as a box labeled "electronics control unit." You received a final Office action, dated February 1, 2000, indicating that claim 1 is allowable subject matter, but objecting to the specification on the grounds that the subject matter of the electronics control unit, though adequately described in the original specification, was required to be shown in the drawings. Which of the following actions, if any, comports with proper PTO practice and procedure for overcoming the objection?',
    options: [
      'On April 1, 2000, file a Notice of Appeal, appropriate fees, and a brief pointing out that a patent should issue since the subject matter of the electronics control unit was adequately described in the original specification.',
      'On April 1, 2000, file in the PTO a drawing illustrating only the portion of the electronics control unit that was described in the original specification.',
      'On April 1, 2000, file a Notice of Appeal, appropriate fees, and a brief pointing out that the addition of a drawing showing the electronics control unit would not constitute addition of new matter since the electronics control unit was adequately described in the original specification.',
      'On September 1, 2000, file a petition urging that no further drawing should be required because the subject matter of the electronics control unit, for purposes of the application, was adequately disclosed in the block diagram drawing.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. § 1.83(a); MPEP §§ 608.02(d) and 706.03(o). Choices (A), (C), and (D) are incorrect. As stated in MPEP § 706.03(o), "If subject matter capable of illustration is originally claimed and it is not shown in the drawing, the claim is not rejected but applicant is required to add it to the drawing." (D) is further incorrect because the reply is not timely. (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-apr00-am-20',
    topicId: 2,
    subtopic: 'Extension-of-time fee calculation after an Advisory Action',
    difficulty: 3,
    question:
      'In the course of prosecuting a patent application, you receive a final rejection wherein the examiner has set a 3 month shortened statutory period for reply. You file an initial reply with a Certificate of Mailing in accordance with 37 C.F.R. § 1.8 within 2 months of the final rejection mail date. The examiner responds with an Advisory Action having a mail date before the end of the 3 month shortened statutory period. In accordance with proper PTO practice and procedure, the fee for an extension of time for applicant to take subsequent appropriate action in the PTO is calculated from:',
    options: [
      'the mail date of the Advisory Action.',
      'the date your reply is received by the PTO.',
      'the date your reply is mailed with a Certificate of Mailing in accordance with 37 C.F.R. § 1.8.',
      'the mail date of the Final Rejection.',
      'the date the shortened statutory period expires.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct and (A)-(D) are wrong because MPEP § 710.02(e) recites, "[I]f applicant initially replies within 2 months from the date of mailing of a final rejection and the examiner mails an advisory action before the end of 3 months from the date of mailing of the final rejection, the shortened statutory period will expire at the end of 3 months from the date of mailing of the final rejection. In such a case, any extension fee would then be calculated from the end of the 3-month period."',
  },
  {
    id: 'uspto-apr00-am-21',
    topicId: 1,
    subtopic: 'The abstract may not be used to interpret claim scope',
    difficulty: 2,
    question:
      'All of the following portions of a patent application can be used for interpreting the scope of the claims in the application except the _____________________',
    options: [
      'description of the preferred embodiment.',
      'abstract of the disclosure.',
      'background of the invention.',
      'drawings.',
      'detailed description of the drawings.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 C.F.R. § 1.72(b); MPEP § 608.01(b).',
  },
  {
    id: 'uspto-apr00-am-22',
    topicId: 3,
    subtopic: 'Rejections that a 37 C.F.R. § 1.131 affidavit can overcome',
    difficulty: 3,
    question:
      'Which of the following rejections can properly be overcome using a 37 C.F.R. § 1.131 affidavit? I. A rejection under 35 U.S.C. § 102(a) based on a journal article that describes the invention as claimed. II. A rejection under 35 U.S.C. § 102(b) based on a patent that discloses but does not claim the invention. III. A rejection based on statutory double patenting. IV. A rejection under 35 U.S.C. § 102(e) based on a patent that discloses but does not claim the same patentable invention.',
    options: ['I.', 'II.', 'III.', 'IV.', 'I and IV.'],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP §§ 715 and 804.02. (II) is incorrect since a 37 C.F.R. § 1.131 affidavit cannot be used to overcome a rejection under 35 U.S.C. § 102(b). MPEP § 715. (III) is incorrect since a § 1.131 affidavit cannot be used to overcome a statutory double patenting rejection. MPEP § 804.02. Thus (B) and (C) are incorrect. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-apr00-am-23',
    topicId: 2,
    subtopic: 'Correction of inventorship under 37 C.F.R. § 1.48',
    difficulty: 3,
    question:
      'Jo and Tommie collaborated on inventions assigned to Dowel Chemical Company. A single application was filed with claims 1-9 directed to Jo’s method of manufacturing, claims 10-19 to Tommie’s method of cleaning up toxic waste spills, and claim 20 to a method using the chemical manufactured in accordance with claim 1. The application was filed June 1, 1999 without an executed oath, and the information sheet inadvertently listed Jo as sole inventor. After a Notice to File Missing Parts, an oath executed by both Jo and Tommie was submitted. No paper was filed to change the named inventive entity. Following a restriction requirement you elect Jo’s invention, cancel claims 10-20, and file a divisional directed to claims 10-19 with an oath executed by Tommie only. Which of the following statements is correct?',
    options: [
      'Because the original application as filed named only Jo as an inventor, Tommie’s divisional application is not entitled to the filing date of the original application because there is no common inventor between the original application and the divisional application.',
      'The incorrect inventorship listed on the information sheet of the original application was never properly corrected and, therefore, any patent issuing on that application will be invalid under 35 U.S.C. § 116 unless the inventorship is later corrected.',
      'After canceling claims 10-20, it is necessary to change the named inventive entity in the original application by filing a petition including a statement identifying Tommie as being deleted and acknowledging that Tommie’s invention is no longer being claimed in the application and an appropriate fee.',
      'Written consent of Dowel Chemical Company is required before Tommie can be deleted as an inventor in the original application.',
      'It is necessary in the divisional application to file a petition including a statement identifying Jo as being deleted as an inventor and acknowledging that Jo’s invention is not being claimed in the divisional application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). The original mistake in omitting Tommie was automatically corrected by filing the oath executed by both Jo and Tommie. 37 C.F.R. § 1.48(f)(1). Under § 1.48(b), a change in inventive entity is thereafter required upon cancellation of the non-elected claims. (B) is wrong because inventorship was automatically corrected. (A) is wrong because Tommie was properly named as a co-inventor and § 120 requires only one common inventor. (D) is incorrect because an assignee’s written consent is not required where prosecution results in cancellation of claims so that fewer than all named inventors are the actual inventors. (E) is incorrect because the divisional never named Jo. [Historical practice] — 37 C.F.R. § 1.48 was substantially revised under the AIA in 2012.',
  },
  {
    id: 'uspto-apr00-am-24',
    topicId: 2,
    subtopic: '35 U.S.C. § 121 protection against double patenting in a divisional',
    difficulty: 3,
    question:
      'Continuing the Dowel Chemical facts (claim 20 omitted from the divisional, which incorporated the original application by reference), which of the following statements is most correct?',
    options: [
      'Since claim 20 was omitted from the divisional application as filed, it cannot be added to the divisional application by a subsequent Amendment because such an Amendment would constitute new matter.',
      'It was improper to include Tommie and Jo as joint inventors in the parent application.',
      'The examiner may properly make a provisional obviousness-type double patenting rejection in the divisional application based on the parent application, but that rejection may be readily overcome with the filing of a terminal disclaimer.',
      'Because the inventive entity of the amended parent application is different than the inventive entity of the divisional application, the examiner may reject the claims of the divisional application under the provisions of 35 U.S.C. § 102(e).',
      'Statements (A), (B), (C) and (D) are each incorrect.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). (A) is incorrect at least because the parent application, which included claim 20, was incorporated by reference; adding claim 20 does not constitute new matter. (B) is wrong because at least claim 20 is properly viewed as a joint invention; under 35 U.S.C. § 116 inventors may apply jointly even if they did not make the same type or amount of contribution and did not each contribute to every claim. MPEP §§ 605.07 and 2137.01. (C) is wrong because 35 U.S.C. § 121 precludes such a rejection. (D) is wrong at least because Tommie is entitled to the filing date of the parent application.',
  },
  {
    id: 'uspto-apr00-am-25',
    topicId: 5,
    subtopic: 'Deliberately cancelled claims cannot be recaptured by reissue',
    difficulty: 3,
    question:
      'GMD Corp. filed an application on a solar-powered computer with a display screen. The examiner restricted claims 1-5 (combination) from claims 6-10 (display screen alone). GMD instructed practitioner Sam to delete claims 6-10 and file a divisional. Sam deleted the claims and the patent granted on May 4, 1999 for claims 1-5, but Sam inadvertently failed to file the divisional. Today, April 12, 2000, GMD’s president asks how they can obtain patent protection for the subject matter in claims 6-10. Which of the following is the best advice in accordance with proper PTO practice and procedure?',
    options: [
      'GMD is barred from filing an application for claims 6-10 since during the original prosecution they deleted the very same claims following a restriction requirement.',
      'Since GMD instructed Sam to file a divisional application and because his failure to do so was inadvertent, GMD may file a reissue application to obtain patent protection for those claims based upon inadvertent error without deceptive intent.',
      'Since the restriction was made in the original case and not contested, a divisional reissue and appropriate fees must be filed to obtain patent coverage for claims 6-10.',
      'Since the inventions were not separate and distinct, a reissue application and appropriate fees may be filed in which the restriction requirement may be traversed, and if successful, claims 6-10 can be added and entered.',
      'Before one year transpires from the issuance of the patent, GMD should file a patent application containing claims directed to the same subject matter as deleted claims 6-10, and the appropriate fee.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because the patent does not become a statutory bar against the subject matter of claims 6-10 until one year from the issuance of the patent. 35 U.S.C. § 102(b). As to (B) and (D), deliberately cancelled claims cannot be recaptured by reissue. In re Watkinson, 14 USPQ2d 1407 (Fed. Cir. 1990); MPEP §§ 1412.02 and 1450. (A) is incorrect because (E) is correct. (C) is incorrect because there is no provision in 35 U.S.C. § 251 for filing a reissue application as a divisional application of an issued patent. [Pre-AIA] — the one-year self-bar analysis is under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-apr00-am-26',
    topicId: 0,
    subtopic: 'Reduction to practice and diligence under § 102(g)',
    difficulty: 3,
    question: 'Which of the following statements is most correct?',
    options: [
      'The same evidence sufficient to establish a constructive reduction to practice is necessarily also sufficient to establish actual reduction to practice.',
      'Proof of constructive reduction to practice does not require sufficient disclosure to satisfy the "how to use" and "how to make" requirements of 35 U.S.C. §112, first paragraph.',
      'A process is reduced to actual practice when it is successfully performed.',
      'The diligence of 35 U.S.C. § 102(g) requires an inventor to drop all other work and concentrate on the particular invention.',
      'The diligence of 35 U.S.C. § 102(g) does not impose on a registered practitioner any need for diligence in preparing and filing a patent application inasmuch as such the practitioner’s acts do not inure to the benefit of the inventor.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct. Corona v. Dovan, 273 U.S. 692 (1928); MPEP § 2138.05. (A) is incorrect — the same evidence sufficient to establish constructive reduction to practice is not necessarily sufficient to establish actual reduction to practice, which requires a showing of the invention in a physical or tangible form containing every element of the count. Wetmore v. Quick, 536 F.2d 937 (CCPA 1976). (B) is incorrect. Kawai v. Metlesics, 489 F.2d 880 (CCPA 1973). (D) is incorrect — diligence does not require "an inventor or his attorney to drop all other work." Keizer v. Bradley, 270 F.2d 396 (CCPA 1959). (E) is incorrect — the diligence of a practitioner in preparing and filing an application inures to the benefit of the inventor. MPEP § 2138.06. [Pre-AIA] — § 102(g) no longer applies to applications filed on or after March 16, 2013.',
  },
  {
    id: 'uspto-apr00-am-27',
    topicId: 3,
    subtopic: 'Overcoming § 102(a) — preamble "use" creates no structural difference',
    difficulty: 3,
    question:
      'On February 8, 1999, you filed an application for Mr. Bond disclosing a composition having 20%A, 20%B, and either 60%C or 60%D, with a single claim: "Claim 1. A composition useful for bonding semiconductor materials to metals, comprising 20%A, 20%B, and 60%C." The examiner found a patent to Gold, dated March 8, 1998, which only disclosed and claimed a composition having 20%A, 20%B, and 60%C, and taught that the composition would only be useful for insulating metals from corrosion. The examiner rejected Claim 1 under 35 U.S.C. § 102(a) as anticipated by Gold, in an Office action dated August 9, 1999. Which of the following is most likely to overcome the rejection, and comports with proper PTO rules and procedure?',
    options: [
      'Filing a reply, on March 9, 2000, with a petition for a three-month extension and the fee for a three-month extension, traversing the rejection on the ground that Gold does not disclose using the composition for bonding semiconductor materials to metals, and therefore does not disclose all the elements of Claim 1.',
      'Filing a reply, on September 9, 1999, traversing the rejection on the ground that Gold does not disclose using the composition for bonding semi-conductor materials to metals, and therefore does not disclose all the elements of Claim 1.',
      'Filing a reply on October 9, 1999, amending Claim 1 to state as follows: "Claim 1. A composition comprising: 20%A, 20%B, and 60%D." In the reply, pointing out why the amendment gives the claim patentable novelty.',
      'Filing a reply on October 9, 1999, traversing the rejection on the grounds that the patent to Gold teaches away from using the invention in the manner taught in Bond’s application.',
      'Filing (i) a 37 C.F.R. § 1.132 affidavit objectively demonstrating the commercial success of the invention as claimed, and (ii) a reply containing an argument why the claimed invention is patentable, but no amendment to Claim 1.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2111.02. (A), (B), and (D) are incorrect since the "use" recited in the preamble of Claim 1 does not result in a structural difference between the claimed invention and the disclosure in the Gold patent. In re Casey, 370 F.2d 576 (CCPA 1967). (A) is further incorrect since the reply would not be filed within the statutory period. (D) is further incorrect since the rejection is not under § 103, and any "teaching away" is not applicable to a § 102(a) rejection. (E) is incorrect since commercial success is relevant to § 103, not to overcoming § 102(a). (C) is correct since the amendment is timely, supported by the disclosure, and renders the rejection inapplicable. [Pre-AIA] — decided under pre-AIA § 102(a).',
  },
  {
    id: 'uspto-apr00-am-28',
    topicId: 1,
    subtopic: 'Enablement judged at the filing date; later publications',
    difficulty: 3,
    question:
      'Which of the following three statements is(are) true? (i) An applicant cannot use a patent to prove the state of the art for the purpose of satisfying the enablement requirement if the patent has an issue date later than the effective filing date of the applicant’s application. (ii) A publication dated after the effective filing date of an application may be properly used to demonstrate that an application is nonenabling if the publication provides evidence of what one skilled in the art would have known on or before the application’s effective filing date. (iii) The state of the art existing at the issue date of the patent is used to determine whether a particular disclosure in the patent is enabling.',
    options: ['(i), (ii) and (iii).', '(i) and (ii).', '(i).', '(ii) and (iii).', 'None of the above.'],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 2164.05(a). Statement (i) is true because a later dated publication cannot be used to enable an earlier dated application. Statement (ii) is true since an examiner can look to later dated art if the art discloses the state of the art at the time of the invention. Statement (iii) is false since enablement is judged at the date of filing and later dated references cannot be used to establish enablement.',
  },
  {
    id: 'uspto-apr00-am-29',
    topicId: 2,
    subtopic: 'Express abandonment — no revival for a deliberate course of action',
    difficulty: 3,
    question:
      'You are attorney of record appointed by XYZ Corp. In the course of prosecution you receive an Office action rejecting all claims as anticipated by a patent to Williams. After carefully reviewing the Office action and discussing it with XYZ officers, it is concluded that the rejection is sound. On instructions from XYZ officers, you file a certification by XYZ Corp. that it is the assignee, and an express abandonment signed by you under 37 C.F.R. § 1.138, which the PTO accepts. Shortly thereafter the employee-inventor informs you that she has reviewed the Williams patent and concluded that her invention differs in a subtle but significant manner. Which of the following courses of action, if any, are properly available to you to successfully revive the application?',
    options: [
      'Request reconsideration of the abandonment on the ground that the filing of the express abandonment was without the inventor’s consent.',
      'Request reconsideration of the abandonment on the ground that the filing of the express abandonment was the result of a mistake.',
      'File a petition to revive the application with all the elements required under 37 C.F.R. § 1.137(a) on the ground that the filing of the express abandonment was unavoidable.',
      'File a petition to revive the application with all the elements required under 37 C.F.R. § 1.137(b) on the ground that the filing of the express abandonment was unintentional.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because the express abandonment was the result of a deliberative, intentional course of action. MPEP § 711.01. (A) is wrong because an express abandonment is effective if signed by the attorney or agent of record. 37 C.F.R. § 1.138. (B) is wrong because arriving at a different conclusion after reviewing the same facts a second time is not a mistake of fact. In re Maldague, 10 USPQ2d 1477 (Comm’r Pat. 1988). (C) and (D) are wrong because MPEP § 711.03(c) recites that an intentional abandonment precludes a finding of unavoidable or unintentional delay under § 1.137. [Historical practice] — the "unavoidable" revival standard of § 1.137(a) was eliminated in 2013.',
  },
  {
    id: 'uspto-apr00-am-30',
    topicId: 1,
    subtopic: 'Indefiniteness — "effective amount" with two disclosed functions',
    difficulty: 3,
    question:
      'You filed an application for Smith claiming a method for heating automobile windshields. The specification disclosed guidelines explaining that an effective amount of voltage to protect windshield glass from cracking was at least 0.5 volts, and that an effective amount for defrosting windshields was at least 1.0 volt. Claim 1 recited "adjusting the voltage source to an effective amount of voltage." You received a non-final Office action, dated February 4, 2000, rejecting claim 1 only under 35 U.S.C. § 112, second paragraph, stating that "an effective amount of voltage" rendered the claim indefinite. Which, if any, of the following actions comport with proper PTO rules and procedure, and will overcome the rejection? I. Filing an appeal with a brief, on August 3, 2000, arguing that the claim is not rendered indefinite since guidelines in the specification fully disclosed what "an effective voltage" would be. II. Filing a reply on May 4, 2000, traversing the rejection on the same ground. III. Filing a reply on May 4, 2000, amending the limitation to read, "an effective amount of voltage for defrosting the automobile windshield".',
    options: ['I.', 'II.', 'III.', 'II and III.', 'I, II, and III.'],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2173.05(c), section III. (I) and (II) are incorrect since the phrase "an effective amount of voltage" has two different functions, i.e., to "protect windshield glass from cracking" and "for defrosting windshields." A claim has been held indefinite when it fails to state which of two disclosed functions is to be achieved. Thus (A), (B), and (D) are incorrect. (C) is correct, since the amended claim would state the function to be achieved. (E) is incorrect since (C) is correct.',
  },
  {
    id: 'uspto-apr00-am-31',
    topicId: 0,
    subtopic: 'Prima facie obviousness — where the suggestion may be found',
    difficulty: 3,
    question:
      'A prima facie case of obviousness requires a suggestion, teaching, or motivation to modify the references to produce the claimed invention. The suggestion, teaching, or motivation is established:',
    options: [
      'only if the suggestion, teaching, or motivation to do so is found in the references themselves.',
      'if the claimed invention is within the capabilities of one of ordinary skill in the art.',
      'by the mere fact that the references can be combined.',
      'if the suggestion, teaching, or motivation is found either in the references themselves or in the knowledge generally available to one of ordinary skill in the art.',
      '(A), (B), (C) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. MPEP § 2143.01: "Obviousness can only be established by combining or modifying the teachings of the prior art to produce the claimed invention where there is some teaching, suggestion, or motivation to do so found either in the references themselves or in the knowledge generally available to one of ordinary skill in the art." In re Fine, 837 F.2d 1071 (Fed. Cir. 1988); In re Jones, 958 F.2d 347 (Fed. Cir. 1992). (A) is incorrect because the location of the suggestion is not limited to the references themselves. (B) and (C) are incorrect — neither the capabilities of one of ordinary skill nor the mere fact that references can be combined is sufficient by itself. (E) is incorrect inasmuch as (A), (B) and (C) are incorrect. [Pre-AIA] — the rigid teaching-suggestion-motivation test was relaxed by KSR v. Teleflex, 550 U.S. 398 (2007).',
  },
  {
    id: 'uspto-apr00-am-32',
    topicId: 0,
    subtopic: 'Evidence demonstrating nonobviousness',
    difficulty: 3,
    question: 'Nonobviousness of a claimed invention may be demonstrated by:',
    options: [
      'producing evidence that all the beneficial results are expected based on the teachings of the prior art references.',
      'producing evidence of the absence of a property the claimed invention would be expected to possess based on the teachings of the prior art.',
      'producing evidence showing that unexpected results occur over less than the entire claimed range.',
      'producing evidence showing that the unexpected properties of a claimed invention have a significance less than equal to the expected properties.',
      '(A), (B), (C) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Ex parte Mead Johnson & Co., 227 USPQ 78 (Bd. Pat. App. & Int. 1985); MPEP § 716.02(a) (Absence of Expected Property is Evidence of Nonobviousness). (A) is incorrect — "Expected beneficial results are evidence of obviousness of the claimed invention." In re Gershon, 372 F.2d 535 (CCPA 1967). (C) is incorrect — unexpected results must be commensurate in scope with the claimed invention. In re Clemens, 622 F.2d 1029 (CCPA 1980). (D) is incorrect. In re Nolan, 553 F.2d 1261 (CCPA 1977). (E) is incorrect because (A), (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-apr00-am-33',
    topicId: 5,
    subtopic: 'Patent term under the URAA transitional rule',
    difficulty: 3,
    question:
      'Applicant filed a utility patent application in the PTO on Wednesday, June 8, 1994, and the examiner issued a requirement for restriction to one of two inventions claimed. On Wednesday, June 7, 1995, applicant elected one of the inventions and filed a divisional application thereon in compliance with 35 U.S.C. § 120. During prosecution of the divisional application the examiner issued a Final Rejection, and following a successful appeal to the Board of Patent Appeals and Interferences the application issued as a patent on Tuesday, February 11, 1997. Assuming all required maintenance fees are timely paid, on which of the following dates will the patent term end?',
    options: [
      'Tuesday, February 11, 2014.',
      'Sunday, June 8, 2014.',
      'Sunday, June 7, 2015.',
      'Friday, August 8, 2014.',
      'Friday, August 7, 2015.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 35 U.S.C. § 154(c)(1). The term of a patent that results from an application filed before the date that is 6 months (June 8, 1995) after enactment of the Uruguay Round Agreements Act shall be the greater of the 20-year term or 17 years from grant. The 20 year term is the "greater" term here. MPEP § 1309.01. Thus (A), (C), (D), and (E) are wrong. [Historical practice] — this transitional rule reaches only applications filed before 8 June 1995.',
  },
  {
    id: 'uspto-apr00-am-34',
    topicId: 0,
    subtopic: 'Declassified material as prima facie evidence of prior knowledge',
    difficulty: 3,
    question:
      'You receive an Office action rejecting all claims as anticipated under 35 U.S.C. § 102(a) using published declassified material as the reference. The examiner explains that the declassified material is being used as prima facie evidence of prior knowledge as of the printing date. The material was printed six months before the filing date of the application and published two months after the application’s filing date; it was classified as of its printing date and not declassified until its publication date. Each element of the claimed invention is described in the publication. Which of the following statements is true?',
    options: [
      'The rejection is not supported by the reference.',
      'The publication is not available as a reference because it did not become available to the general public until after the filing date of your patent application.',
      'The publication is prima facie evidence of prior knowledge even though it was available only for limited distribution as of its printing date.',
      'The publication constitutes an absolute statutory bar.',
      'It is not possible to use a Rule 131 affidavit or declaration to antedate the printing date of the publication.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). As stated in MPEP § 707.05(f), "For the purpose of anticipation predicated upon prior knowledge under 35 U.S.C. 102(a), the above noted declassified material may be taken as prima facie evidence of such prior knowledge as of its printing date even though such material was classified at that time." (A) is incorrect — the reference supports the rejection inasmuch as each element of the claimed invention is disclosed. (B), (D), and (E) are not the most correct. [Pre-AIA] — "known by others" prior knowledge under pre-AIA § 102(a) has no AIA counterpart.',
  },
  {
    id: 'uspto-apr00-am-35',
    topicId: 0,
    subtopic: 'A later-dated abstract evidencing an earlier public sale',
    difficulty: 3,
    question:
      'On July 1, 1998, a registered practitioner files an application containing 10 claims directed to a computer. The practitioner receives an Office action wherein claims 1-5 are properly rejected under 35 U.S.C. § 102 based upon reference A dated January 3, 1999. Reference A is an abstract identifying a computer, the computer’s vendor, and purchasing information, and describes in sufficient detail to meet § 112 a computer having all of the elements of the rejected claims. According to reference A, the computer described therein was publicly sold in the United States in June 1997. What should you advise your client to do in accordance with proper PTO practice and procedure?',
    options: [
      'File a reply arguing that Reference A cannot constitute prior art since it is dated subsequent to the filing date of the application.',
      'File an amendment canceling the rejected claims and argue patentability of the remaining claims.',
      'Argue that reference A constitutes hearsay evidence because there is no direct evidence that the computer of Reference A was actually in existence in June 1997.',
      'Argue that even if the computer of Reference A was in existence in June 1997, the failure to disclose the invention until 1999 constituted abandonment of the invention.',
      'Request a public use hearing to determine if there actually was public use in June 1997.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). As to (A), (D) and (E), see MPEP §§ 716.07 and 2133.03(b) and In re Epstein, 32 F.3d 1559, 31 USPQ2d 1817 (Fed. Cir. 1994). [Pre-AIA] — decided under pre-AIA § 102(b); public use proceedings under former § 1.292 no longer exist.',
  },
  {
    id: 'uspto-apr00-am-36',
    topicId: 3,
    subtopic: 'Petition to make special without a fee — applicant age 65 or more',
    difficulty: 2,
    question: 'A petition to make a patent application special may be filed without fee in which of the following cases?',
    options: [
      'The petition is supported by applicant’s birth certificate showing applicant’s age is 62.',
      'The petition is supported by applicant’s unverified statement that applicant’s age is 65.',
      'The petition is supported by applicant’s statement that there is an infringing device actually on the market, that a rigid comparison of the alleged infringing device with the claims of the application has been made, and that applicant has made a careful and thorough search of the prior art.',
      'The petition is accompanied by a statement under 37 C.F.R. § 1.102 by applicant explaining the relationship of the invention to safety of research in the field of recombinant DNA research.',
      'The petition is accompanied by applicant’s statement explaining how the invention contributes to the diagnosis, treatment or prevention of HIV/AIDS or cancer.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). (A) is wrong because MPEP § 708.02, IV, recites, "An application may be made special upon filing a petition including any evidence showing that the applicant is 65 years of age, or more, such as a birth certificate or applicant’s statement. No fee is required with such a petition." (C), (D), and (E) are wrong because a fee is required with respect to each petition. MPEP § 708.02, II, VII, and X, respectively. [Historical practice] — the MPEP § 708.02 petition-to-make-special categories were largely replaced by the 2006 Accelerated Examination programme.',
  },
  {
    id: 'uspto-apr00-am-37',
    topicId: 1,
    subtopic: 'Proper dependent claim supported by the disclosure',
    difficulty: 3,
    question:
      'The invention is disclosed as a doodad making machine comprising elements A, B, and means C for performing a function, with two embodiments C’ and C". Components D or E may be combined with A, B, and means C. Component G may be used, but only with means C’, to improve performance; the machine is rendered inoperative if G is used with C", or whenever D or E are present. The first three claims are: 1. A doodad making machine comprising A, B, and means C for performing a function. 2. A doodad making machine as claimed in Claim 1 wherein means C is C’. 3. A doodad making machine as claimed in Claim 1 or 2 further comprising D. Which of the following would be a proper claim 4 and be supported by the specification?',
    options: [
      'A doodad making machine as claimed in Claim 2, further comprising E.',
      'A doodad making machine consisting essentially of A, B, means C for performing a function, D and G.',
      'A doodad making machine as claimed in Claim 1 or 2, further comprising D.',
      'A doodad making machine as claimed in Claims 1 and 2, further comprising G.',
      'A doodad making machine as claimed in any of the following claims, wherein means C is C", and further comprising G.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct, being supported by the disclosure and further limiting Claim 2. 35 U.S.C. § 112, first paragraph; 37 C.F.R. §§ 1.75(b), 1.75(c). (B) is not supported by the specification. (C) is incorrect because it is identical to, and does not differ substantially from, Claim 3. MPEP § 706.03(k). (D) and (E) are not supported by the disclosure; (D) is also an improper multiple dependent claim because it depends on claims in the conjunctive ("and") rather than the alternative, and (E) is improper because it does not refer to a preceding claim. 37 C.F.R. § 1.75(c); MPEP § 608.01(n).',
  },
  {
    id: 'uspto-apr00-am-38',
    topicId: 5,
    subtopic: 'Reissue recapture based on argument alone',
    difficulty: 3,
    question:
      'Inventor Charles patented a whirlwind device for defeathering poultry. Although the scope of the claims never changed substantively during original prosecution, practitioner Roberts repeatedly argued that limitations appearing in the original claims distinguished the claimed subject matter from prior art. After the patent issued, Charles realized the claims were unduly narrow and timely applied for a broadened reissue seeking claims without the limitations relied upon by Roberts. The new claims were properly supported by the original specification. Charles asserted in his reissue oath that there was an error resulting from Roberts’ failure to appreciate the full scope of the invention. No supporting declaration from Roberts was submitted. Which of the following statements is most accurate?',
    options: [
      'Although the scope of the claims was not changed substantively during prosecution of the original patent, the recapture doctrine may preclude Charles from obtaining the requested reissue because of the repeated arguments made by practitioner Roberts.',
      'The recapture doctrine cannot apply because the claims were not amended substantively during original prosecution.',
      'The reissue application will not be given a filing date because no supporting declaration from practitioner Roberts was submitted.',
      'The doctrine of prosecution history estoppel prevents Charles from seeking by reissue an effective claim scope that is broader than the literal scope of the original claims.',
      'The doctrine of late claiming prevents Charles from seeking an effective claim scope broader than the literal scope of the original claims.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). Hester v. Stein, 46 USPQ2d 1641 (Fed. Cir. 1998). (B) is wrong because arguments alone can cause a surrender of subject matter that may not be recaptured in reissue. (C) is wrong because the reissue application will receive a filing date without an oath or declaration. 37 C.F.R. § 1.53(f); MPEP § 1403. (D) is not correct because prosecution history estoppel relates to efforts to expand the effective scope of an issued patent through the doctrine of equivalents. (E) is incorrect because "late claiming" was long ago discredited. Correge v. Murphy, 217 USPQ 753 (Fed. Cir. 1983).',
  },
  {
    id: 'uspto-apr00-am-39',
    topicId: 5,
    subtopic: 'Definition of impermissible recapture',
    difficulty: 3,
    question: 'Impermissible recapture in an application exists ________________________',
    options: [
      'if the limitation now being added in the present reissue was originally presented/argued/stated in the original application to make the claims allowable over a rejection or objection made in the original application.',
      'if the limitation now being omitted or broadened in the present continuation was originally presented/argued/stated in a parent application to make the claims allowable over a rejection or objection made in the parent application.',
      'if the limitation now being omitted or broadened in the present reissue was originally presented/argued/stated in the original application to make the claims allowable over a rejection or objection made in the original application.',
      'if the limitation now being omitted or broadened in the present reissue was being broadened for the first time more than two years after the issuance of the original patent.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct. See MPEP § 1412.02 Recapture. As to (A), recapture occurs when the claim is broadened; adding a limitation would narrow the claim. As to (B), recapture does not apply to continuations. As to (D), the two-year date relates to broadening reissue applications, not to the issue of recapture — 35 U.S.C. § 251 prescribes a 2-year limit for filing broadening reissues. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-apr00-am-40',
    topicId: 5,
    subtopic: 'Broadening dependent claims during reexamination',
    difficulty: 3,
    question: 'Which of the following is true?',
    options: [
      'Once the claims of a patent application are determined to be invalid by the Board of Patent Appeals and Interferences, an applicant may not thereafter file another patent application regarding the same invention with narrower claims.',
      'Once the claims of a patent application are determined to be invalid by the Court of Appeals for the Federal Circuit, an applicant may not thereafter file another patent application regarding the same invention with narrower claims.',
      'Collateral estoppel bars an applicant from filing several applications for obvious improvements of the same invention.',
      'The failure of an independent claim in a patent to claim a feature of the invention, which is not found in a genus, results in Jepson estoppel against the inventor claiming the invention with the feature in another patent application.',
      'During reexamination, if the independent claims of a patent are not broadened, then amendments to the dependent claims cannot broaden the scope of the invention covered by the claims.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Since independent claims are the broadest claims in an application, and dependent claims depend on the independent claims, broadening of a dependent claim cannot broaden the scope of invention. In re Portola Packaging Inc., 110 F.3d 786, 42 USPQ2d 1295 (Fed. Cir. 1997). As to (A) and (B), continuation applications may be filed before application pendency terminates, and narrower claims may be patentable even though broader claims are unpatentable. As to (C), obviousness-type double patenting prevents several patents from being based upon obvious improvements. As to (D), failure to claim a feature not found in a genus is of no consequence. [Historical practice] — the Board of Patent Appeals and Interferences was replaced by the PTAB in 2012.',
  },
  {
    id: 'uspto-apr00-am-41',
    topicId: 2,
    subtopic: 'Declarations where an inventor is deceased or cannot be reached',
    difficulty: 3,
    question:
      'On July 1, 1998, you file an application wherein the inventors are listed as Mae, Bea and Seya, with an unexecuted declaration. On July 15, 1998, Mae and Bea sell their patent rights by assignment of the application to Seya. On July 25, 1998, Seya advises the practitioner that Bea has died, and Mae has moved to the West Indies. On July 27, 1998, you receive a notice from the PTO indicating that the declaration was not executed and an executed declaration must be submitted. As a registered practitioner, what would you do in accordance with proper PTO practice and procedure to file a proper reply?',
    options: [
      'Find out who is the executor or administrator of the estate of Bea, and file a declaration (naming Mae, Bea, and Seya as inventors) executed by the executor or administrator in the signature block for Bea.',
      'Since Bea and Mae assigned their rights in the patent application to Seya, only Seya needs to sign the declaration. A declaration should be filed with the PTO, which is signed only by Seya with the names of Bea, and Mae deleted, and with an explanation that they no longer have rights in the application and should no longer be listed as inventors.',
      'Attempt to contact Mae and, if after a diligent effort, no response is forthcoming, file a statement executed by practitioner stating the diligent effort made to obtain the signature of Mae, and that she could not be located and no response ensued. File a declaration (naming Mae, Bea, and Seya as inventors) signed by Seya in the signature block for Seya’s signature.',
      'Have Seya sign the declaration on his own behalf and on behalf of the missing inventors.',
      'Both (A) and (C) are required.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. §§ 116 and 117; 37 C.F.R. § 1.47. (B) is incorrect because the assignment did not relieve each live inventor from the statutory requirements (35 U.S.C. §§ 115 and 116) to sign the declaration, and for the executor or administrator to sign the declaration (35 U.S.C. § 117); (B) is also incorrect in deleting the names of Bea and Mae as inventors. (D) is incorrect because the deceased inventor is not missing (MPEP § 409.03(c)), and Seya has not shown that Mae could not be found or reached after diligent effort, or refused to sign. [Historical practice] — the AIA substantially revised inventor-declaration practice, including substitute statements under § 1.64.',
  },
  {
    id: 'uspto-apr00-am-42',
    topicId: 0,
    subtopic: 'What can never be § 102(a) prior art — a reference by the applicant alone',
    difficulty: 3,
    question:
      'Which of the following can never properly be available as prior art for purposes of a rejection under 35 U.S.C. § 102(a)?',
    options: [
      'A drawing, labeled "Prior Art," submitted by the applicant.',
      'Canceled matter in an application that matured into a U.S. patent where the matter is not published in the patent.',
      'An abandoned patent application referenced in a publication available to the public.',
      'The combination of two references, where one of the references is used merely to explain the meaning of a term used in the primary reference.',
      'A reference authored only by applicant, and published less than one year prior to the effective filing date of applicant’s patent application.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. (A) is incorrect since admissions, including figures labeled "prior art," may be used. MPEP § 2129. (B) is incorrect since canceled matter in the application file of a U.S. patent becomes available as prior art as of the date the application issues into a patent. MPEP § 2127; Ex parte Stalego, 154 USPQ 52 (Bd. App. 1966). (C) is incorrect since an abandoned application may become evidence of prior art when appropriately disclosed, as when referenced in a publication. Lee Pharmaceutical v. Kreps, 577 F.2d 610 (9th Cir. 1978). (D) is incorrect because multiple reference rejections under § 102 may be used where one reference merely explains a term. In re Baxter Travenol Labs., 952 F.2d 388 (Fed. Cir. 1991). (E) is correct since the reference is not by "another." [Pre-AIA] — decided under pre-AIA § 102(a).',
  },
  {
    id: 'uspto-apr00-am-43',
    topicId: 0,
    subtopic: '35 U.S.C. § 135(b) — one-year bar on copying patent claims',
    difficulty: 3,
    question:
      'On January 3, 2000, inventor Jones became aware of a patent issued to Smith directed to subject matter very similar to that claimed in Jones’ pending application. Smith’s patent issued on February 2, 1999, but was based on an application filed after Jones’ application. On January 14, 2000, Jones asked practitioner Wilson to copy claims 1-5 of the Smith patent and seek an interference. Wilson was away and did not see the letter until February 7, 2000, filing an Amendment the next day adding claims 21-25 copied from Smith. The examiner rejected the claims and refused to declare an interference because the copied claims were not presented in a timely manner. Which of the following should help Jones obtain priority in the PTO to the commonly claimed subject matter?',
    options: [
      'Jones petitions the Commissioner under 37 C.F.R. § 1.183 for acceptance of the copied claims on the basis that any delay in presenting the claims was unavoidable, and requesting that an interference then be declared. Jones pays the appropriate fee.',
      'Jones petitions the Commissioner under 37 C.F.R. § 1.183 for acceptance of the copied claims on the basis that any delay in presenting the claims was unintentional, and requesting that an interference then be declared. Jones pays the appropriate fee.',
      'While his application is still pending, Jones files a civil action against Smith in U.S. District Court under 35 U.S.C. § 291 seeking to adjudge the validity of the Smith patent.',
      'Jones files with the examiner a request for reconsideration noting that Smith’s filing date is subsequent to Jones’ filing date and, therefore, an interference should be declared and Jones named the senior party.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. § 135(b) precludes an applicant from copying a claim from a patent that has been issued for more than one year. The Commissioner cannot waive a statutory requirement, so (A) and (B) are wrong. (D) is wrong because the examiner does not have discretionary power to accept claims barred by statute. (C) is wrong not only because Jones does not have an issued patent on which to base jurisdiction under 35 U.S.C. § 291, but also because the PTO is not a party to the suit. In re McGrew, 120 F.3d 1236 (Fed. Cir. 1997); MPEP § 2307. [Historical practice] — the AIA replaced interference practice with derivation proceedings for applications subject to first-inventor-to-file.',
  },
  {
    id: 'uspto-apr00-am-44',
    topicId: 7,
    subtopic: 'Prohibited conduct under the PTO Code of Professional Responsibility',
    difficulty: 3,
    question:
      'Which of the following is not prohibited conduct for a practitioner under the PTO Code of Professional Responsibility?',
    options: [
      'Entering into an agreement with your client to limit the amount of any damages which your client may collect for any mistakes you make during prosecution of your client’s patent application in exchange for prosecuting the application at a reduced fee.',
      'Encouraging your client to meet with an opposing party for settlement discussions.',
      'Failing to disclose controlling legal authority which is adverse to the client’s interest when arguing the patentability of claims in a patent application.',
      'In reply to an Office action, stating honestly and truthfully in the remarks accompanying an amendment that you have personally used the device and found it to be very efficient and better than the prior art.',
      'Investing the funds your client advanced for your legal fees (not costs and expenses) in long term United States Treasury Bills in order to obtain guaranteed protection of the principal.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). See 37 C.F.R. § 10.87. As to (A), a practitioner may not limit damages under 37 C.F.R. § 10.78. As to (C), see 37 C.F.R. § 10.89(b)(1). As to (D), see 37 C.F.R. § 10.89(c)(4). As to (E), see 37 C.F.R. § 10.112(a), where client funds advanced for legal services are required to be deposited in a bank account. [Historical practice] — the 37 C.F.R. Part 10 Code of Professional Responsibility was replaced in 2013 by the Part 11 USPTO Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr00-am-45',
    topicId: 1,
    subtopic: 'Proper form of a Markush group',
    difficulty: 2,
    question: 'Which of the following presents a Markush group in accordance with proper PTO practice and procedure?',
    options: [
      'R is selected from the group consisting of A, B, C, or D.',
      'R is selected from the group consisting of A, B, C, and D.',
      'R is selected from the group comprising A, B, C, and D.',
      'R is selected from the group comprising A, B, C or D.',
      'R is A, B, C, and D.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is correct. MPEP § 2173.05(h). A Markush group is an acceptable form of alternative expression provided the introductory phrase "consisting of," and the conjunctive "and" are used. (A) and (D) are incorrect because the conjunctive "or" is used. (C) and (D) are incorrect because the introductory phrase "comprising" is used. (E) is incorrect because R must simultaneously be A, B, C, and D, as opposed to being a single member of the group.',
  },
  {
    id: 'uspto-apr00-am-46',
    topicId: 5,
    subtopic: 'Amending a reissue application',
    difficulty: 3,
    question: 'Which of the following statements regarding amending a reissue application is not correct?',
    options: [
      'In a claim, hand entry of an amendment of five words or less is permitted.',
      'Each amendment submission must set forth the status, on the date of the amendment, of all patent claims and of all added claims.',
      'An entire paragraph in the specification other than the claims may be deleted by a statement deleting the paragraph without presentation of the text of the paragraph.',
      'When responding to an Office action, each amendment when originally submitted must be accompanied by an explanation of the support in the disclosure of the patent for the amendment.',
      'A new claim added by amendment must be presented with underlining throughout the claim.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. Hand entry of amendments is no longer permitted. 37 C.F.R. § 1.121(b)(2). Answers (B), (C) and (D) are all correct pursuant to the December 1, 1997, change. 37 C.F.R. §§ 1.121(b)(2)(ii), and 1.121(b)(2)(iii). Answer (E) is also a correct statement. 37 C.F.R. § 1.121(b)(2)(i)(A) and MPEP § 1453. [Historical practice] — the § 1.121 amendment format was replaced in 2003 by the current replacement-paragraph/claim-listing practice.',
  },
  {
    id: 'uspto-apr00-am-47',
    topicId: 5,
    subtopic: 'Who may request reexamination',
    difficulty: 3,
    question: 'Which of the following, if any, is true?',
    options: [
      'The loser in an interference in the PTO is estopped from later claiming he or she was the first to invent in a Federal District Court since the loser must win in the PTO or he/she will lose the right to contest priority.',
      'A person being sued for infringement may file a request for reexamination without first obtaining the permission of the Court in which the litigation is taking place.',
      'A practitioner may not represent spouses, family members or relatives before the PTO since such representation inherently creates a conflict of interest and a practitioner is likely to engage in favoritism over his/her other clients.',
      'Employees of the PTO may not apply for a patent during the period of their employment and for two years thereafter.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Any person at any time may file a request for reexamination. 35 U.S.C. § 302. As to (A), the loser may appeal to District Court under 35 U.S.C. § 146. As to (C), there is no prohibition regarding spouses, family members, and other relatives. As to (D), according to 35 U.S.C. § 4, employees are prohibited during the period of their employment and one year thereafter. As to (E), (B) is true. [Historical practice] — interference practice under § 146 was replaced by derivation proceedings for post-AIA filings.',
  },
  {
    id: 'uspto-apr00-am-48',
    topicId: 7,
    subtopic: 'Duty of disclosure — inventor and practitioner, in writing',
    difficulty: 3,
    question:
      'Kevin invents a solar energy device for cooking food having a parabolic reflector with a rod connected along the center axis and a cooking grill connected to the top of the rod. A search locates Bill’s United States patent, issued July 22, 1997, disclosing a parabolic reflector having a cut-out portion from the base with a rod along the center axis and a grill connected to the top of the rod. Bill’s patent specifically teaches away from omitting the cut-out portion because the base portion would unnecessarily gather fat and grease. Kevin states that his invention would be advantageous since by leaving out the cut-out portion the invention could collect fat and grease, which could be sold. You file an application for Kevin on July 20, 1998. During examination an examiner finds a publication disclosing a solar energy cooking device having a reflector without a cut-out portion. Which of the following accurately describes the duty to disclose Bill’s patent to the PTO?',
    options: [
      'Only you have a duty to disclose the patent to the PTO.',
      'Both you and Kevin have a duty to disclose the patent to the PTO, but the disclosure need not be in writing.',
      'Both you and Kevin have a duty to disclose the patent to the PTO, and the disclosure must be in writing.',
      'There is no duty to disclose the patent to the PTO, since it is a United States patent, and the examiners already independently have access to electronically search the database with all the United States patents.',
      'There is no duty to disclose the patent to the PTO, because the patent is not material to patentability since it teaches away from the inventive concept of Kevin’s invention.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. § 1.56; MPEP § 2001.01. (A) is incorrect since both the inventor and registered practitioner have a duty to disclose under 37 C.F.R. § 1.56(c)(1) & (2). (B) is incorrect since the disclosure must be in writing. (D) is incorrect because the duty does not depend on the likelihood that an examiner would find the art independently. (E) is incorrect since the patent may be relied upon for a rejection under 35 U.S.C. § 102(a) and the patent therefore is material to patentability.',
  },
  {
    id: 'uspto-apr00-am-49',
    topicId: 7,
    subtopic: 'Professional responsibility — refusing unlawful conduct, partnerships, fraud',
    difficulty: 3,
    question: 'Which of the following statements is NOT true?',
    options: [
      'In representation of a client, a patent practitioner may not refuse a client’s request that the practitioner aid or participate in conduct that the practitioner believes to be unlawful so long as there is some support for an argument that the conduct is legal.',
      'A patent practitioner may not form a partnership with a non-practitioner if any of the activities of the partnership consists of the practice of patent law before the PTO.',
      'In a patent case, a practitioner may take an interest in the patent as part or all of his or her fee.',
      'If a practitioner receives information clearly establishing that a client has, in the course of representation, perpetrated a fraud on the PTO that the client refuses or is unable to reveal, the practitioner must reveal the fraud to the PTO.',
      'A patent practitioner may not accept compensation from a friend of a client for legal services performed by the practitioner for the client, unless the client consents after full disclosure.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 10.84(b)(2) specifies that a practitioner MAY refuse to aid or participate in conduct the practitioner believes to be unlawful, even though there is some support for an argument that the conduct is legal. Thus statement (A) is FALSE. Statement (B) is TRUE. 37 C.F.R. § 10.49. Statement (C) is TRUE. 37 C.F.R. § 10.64(a)(3). Statement (D) is TRUE. 37 C.F.R. § 10.85(b)(1). Statement (E) is TRUE. 37 C.F.R. § 10.68(a)(1). [Historical practice] — the Part 10 Code was replaced in 2013 by the 37 C.F.R. Part 11 Rules of Professional Conduct.',
  },
  {
    id: 'uspto-apr00-am-50',
    topicId: 0,
    subtopic: 'Market testing is not experimental use',
    difficulty: 3,
    question:
      'On Saturday, February 6, 1999, in Texas, inventor Smith successfully tested a wireless telephone. On Sunday, February 7, 1999, Smith began testing the market place by offering to sell the wireless telephone in a variety of urban and rural regions throughout Texas. On Tuesday, February 8, 2000, registered practitioner Bill filed a patent application for Smith fully disclosing and claiming the same wireless telephone. Bill received a non-final Office action rejection of the claim under 35 U.S.C. § 102(b) based on Smith’s activities. Which, if any, of the following actions taken by Bill comport with proper PTO rules and procedure, and will overcome the rejection?',
    options: [
      'Filing a timely reply traversing the rejection on the grounds that February 7, 1999 was a Sunday, that Smith could not file an application on the one-year anniversary Sunday because the PTO is closed, so Smith’s activities must be measured from Monday, February 8, 1999, which is not more than one year prior to the application date.',
      'Filing a timely reply traversing the rejection on the grounds that Smith’s activities were experimental only and therefore excepted from 35 U.S.C. § 102(b).',
      'Filing a timely reply with an affidavit under 37 C.F.R. § 1.131 presenting statements by Smith that the activities were by Smith, himself, as opposed to another, and the activities were experimental.',
      'Filing a timely reply with an affidavit under 37 C.F.R. § 1.132 demonstrating by objective evidence of the commercial success of the wireless telephone.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP § 2133.03(e)(6) sets forth that while technological, developmental testing is permitted and is not a bar under 35 U.S.C. § 102(b), market testing is not permitted. Choice (A) is incorrect. Since Smith’s activities included market testing, choices (B) and (C) are incorrect. (C) is further incorrect since an affidavit under 37 C.F.R. § 1.131 is not applicable to rejections under § 102(b). (D) is incorrect since secondary considerations such as commercial success are not applicable to rejections under § 102(b). [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
];

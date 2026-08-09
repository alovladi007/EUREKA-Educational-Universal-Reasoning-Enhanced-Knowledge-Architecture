/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, October 17, 2001 — Morning Session
 * (Test Number 123, Series 201), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (edo0110aq.pdf, and the combined
 * AM+PM model answers edo0110apa.pdf, via the Internet Archive copy of
 * uspto.gov). US Government works — public domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the Oct 2003,
 * Apr 2003 and Apr 2002 files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper are preserved).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Questions 4 and 26 of this session were officially discarded by the
 *    USPTO ("All answers accepted") and are excluded.
 *  - ERA NOTE: this exam predates the AIA (2011-2013). Questions that turn on
 *    pre-AIA 35 U.S.C. 102/103 (the "in this country" limits of 102(a)/(b),
 *    102(d) foreign-patent bars, 102(e)/(f)/(g), Rule 131 antedating, 135(b),
 *    and the pre-KSR obviousness framework) carry an explicit [Pre-AIA] tag.
 *    Questions built on since-superseded procedure (the pre-2004 Board rules
 *    of 37 CFR 1.19x, the 2000-01 EFS publication-copy practice) carry a
 *    [Historical practice] tag — the reasoning style remains instructive, but
 *    the specific rule has changed. Verified status: OFFICIAL (USPTO model
 *    answers).
 *
 * Ingested: AM session Q1-Q3, Q5-Q25 and Q27-Q50 (48 of 48 scoreable).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2001_AM_SOURCE =
  'USPTO Registration Examination, October 17, 2001 — Morning Session (official model answers; public domain)';

export const USPTO_OCT2001_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct01-am-01',
    topicId: 0,
    subtopic: 'Graham v. John Deere Factual Inquiries (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Office policy has consistently been to follow Graham v. John Deere Co., 383 U.S. 1, 148 USPQ 459 (1966), in the consideration and determination of obviousness under 35 U.S.C. § 103. Each of the following are the four factual inquires enunciated therein as a background for determining obviousness except:',
    options: [
      'Determining the scope and contents of the prior art.',
      'Resolving any issue of indefiniteness in favor of clarity.',
      'Ascertaining the differences between the prior art and the claims in issue.',
      'Resolving the level of ordinary skill in the pertinent art.',
      'Evaluating evidence of secondary considerations.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). 35 U.S.C. § 103; Graham v. John Deere Co., 383 U.S. 1, 148 USPQ 459 (1966); MPEP § 2141. Resolving any issue of indefiniteness in favor of clarity is not among the factual inquiries enunciated in Graham. The four factual inquiries are set forth in answers (A), (C), (D) and (E). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-02',
    topicId: 3,
    subtopic: 'IDS Content Requirements — 37 CFR 1.98 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] You are a registered practitioner. Earl, your new associate, has been assigned the task of filing information disclosure statements for patents and publications submitted by a client Tony, who is the named inventor on several patent applications, all of which were filed on or after January 1, 2001. Earl wants to know what information must be included on the information disclosure statements. Which of the following is not accurate with respect to proper USPTO procedure?',
    options: [
      'If a non-English reference is submitted in an information disclosure statement, the applicant shall include a copy of the translation if a written English-language translation of a non-English-language document, or portion thereof, if it is within the possession, custody, or control of, or is readily available to any individual designated in 37 CFR 1.56(c).',
      'Each U.S. patent listed in an information disclosure statement must be identified by inventor, application number, and issue date.',
      'Each publication listed in an information disclosure statement must be identified by publisher, author (if any), title, relevant pages of the publication, date, and place of publication.',
      'When the disclosures of two or more patents or publications listed in an information disclosure statement are substantively cumulative, a copy of one of the patents or publications may be submitted without copies of the other patents or publications, provided that it is stated that these other patents or publications are cumulative.',
      'A copy of any patent, publication, pending U.S. application or other information listed in an information disclosure statement is required to be provided, even if the patent, publication, pending U.S. application or other information was previously submitted to, or cited by, the Office in an earlier application, unless: (1) the earlier application is properly identified in the information disclosure statement and is relied on for an earlier effective filing date under 35 U.S.C. § 120; and (2) the information disclosure statement submitted in the earlier application is in full compliance with appropriate regulations.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. The application number of each U.S. patent is not required to be listed by 37 CFR 1.98(b)(1), which provides "(b)(1) Each U.S. patent listed in an information disclosure statement must be identified by inventor, patent number, and issue date." The elements of (A) are found in 37 CFR 1.98(a)(3)(ii); (C) in § 1.98(b)(5); (D) in § 1.98(c); and (E) in § 1.98(d).',
  },
  {
    id: 'uspto-oct01-am-03',
    topicId: 4,
    subtopic: 'Foreign Priority — Timing of the Claim and Certified Copy (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is not in accordance with proper USPTO practice and procedure regarding patent applications filed in October 2001?',
    options: [
      'If a U.S. patent application publication or patent incorporates by reference, or includes a specific reference under 35 U.S.C. §§ 119(e) or 120, to a pending or abandoned application, a copy of that application-as-filed may be provided to any person upon written request including the fee set forth in 37 CFR 1.19(b)(1).',
      'If the claim for priority or the certified copy of the foreign application is filed after the date the issue fee is paid, it must be accompanied by the processing fee set forth in 37 CFR § 1.17(i), but the patent will not include the priority claim unless corrected by a certificate of correction under 35 U.S.C. § 255 and 37 CFR 1.323.',
      'In an application that entered the national stage from an international application after compliance with 35 U.S.C. § 371, the claim for priority must be made during the pendency of the application and within the time limit set forth in the PCT and the Regulations under the PCT.',
      'The claim for priority and the certified copy of the foreign application specified in 35 U.S.C. § 119(b) or PCT Rule 17 must, in any event, be filed before the examiner allows the claims.',
      'If an international application, which designates the U.S. and which has been published in accordance with PCT Article 21(2), incorporates by reference or claims priority under PCT Article 8 to a pending or abandoned U.S. application, a copy of that application-as-filed may be provided to any person upon written request including a showing that the publication of the application in accordance with PCT Article 21(2) has occurred and that the U.S. was designated, and upon payment of the appropriate.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. The claim for priority and the certified copy of the foreign application specified in 35 U.S.C. § 119(b) or PCT Rule 17 must, in any event, be filed BEFORE THE PATENT IS GRANTED — not before the examiner allows the claims. (B) contains the elements of 37 CFR 1.55(a)(2); (C) the elements of § 1.55(a)(1)(ii); (A) the elements of § 1.14(c)(1)(i); and (E) the elements of § 1.14(c)(1)(ii).',
  },
  {
    id: 'uspto-oct01-am-05',
    topicId: 1,
    subtopic: 'Color Photographs as Drawings — Petition Under 37 CFR 1.84 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] You have agreed to represent an independent inventor in connection with a patent application that was filed in the USPTO by the inventor on a pro se basis. As filed, the application included a detailed written description that, when viewed together with four accompanying color photographs, enabled one of ordinary skill in the pertinent art to make and use the invention. The application was filed with an inventor’s declaration in compliance with 37 CFR 1.63, a small entity statement (independent inventor) under 37 CFR 1.27, and all necessary small entity filing fees. MEGACORP, a very large multi-national corporation, licensed rights in the invention after the application was filed. You have been asked to suggest steps to remove any formal objections that can be expected from the patent examiner, without incurring unnecessary government fees. You determine that the first color photograph is the only practical medium by which to disclose certain aspects of the claimed invention, but that the substance of the remaining photographs could readily be illustrated through ordinary ink drawings. You correctly recall that the Office announced in the Official Gazette in May 2001 (1246 OG 106) that it is sua sponte waiving 37 CFR 1.84(a)(2)(iii), and is no longer requiring a black and white photocopy of any color drawing or color photograph. Which of the following represents the most reasonable advice to the independent inventor?',
    options: [
      'Submit a request for approval of drawing changes wherein the first photograph is labeled “Figure 1” and the remaining photographs are cancelled in favor of corresponding ink drawings labeled Figures 2 through 4; and immediately withdraw the claim for small entity status because of the license to MEGACORP.',
      'Submit a request for approval of drawing changes wherein the first photograph is labeled “Figure 1” and the remaining photographs are cancelled in favor of corresponding ink drawings labeled Figures 2 through 4; and submit a petition for acceptance of Figure 1 in the form of a color photograph along with three sets of the color photograph, a proposed amendment to insert language concerning the color photograph as the first paragraph of the specification and the required petition fee. The photographs must be sufficient quality that all details in the photographs are reproducible in a printed patent.',
      'Submit a request for approval of drawing changes wherein the first photograph is labeled “Figure 1” and the remaining photographs are cancelled in favor of corresponding ink drawings labeled Figures 2 through 4.',
      'Immediately withdraw the claim for small entity status because of the license to MEGACORP and submit to the USPTO the difference between the small entity filing fee and the large entity filing fee.',
      'File a rewritten application as a continuation application including a color photograph as Figure 1, ink drawings as Figures 2-4, a new inventor’s declaration and a small entity filing fee.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). 37 CFR 1.84(a)(2); MPEP § 608.02; 1246 OG 106 (May 22, 2001). (A) is wrong because a petition under § 1.84 is required to avoid an objection to the color photographs, and because small entity status properly established at filing may be maintained until the issue fee is due (§ 1.27(g)(1)). (C)-(E) are wrong because they do not provide for the required petition under § 1.84. In (D), the change in status after filing does not require retroactive payment of a large entity filing fee. (E) is further wrong because a continuation would require a large entity filing fee and so does not avoid unnecessary government fees.',
  },
  {
    id: 'uspto-oct01-am-06',
    topicId: 0,
    subtopic: 'Utility Under 35 U.S.C. 101 and Its 112 Consequence (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In connection with the utility of an invention described in a patent application, which of the following conforms to proper USPTO practice and procedure?',
    options: [
      'A deficiency under 35 U.S.C. § 101 also creates a deficiency under 35 U.S.C. § 112, first paragraph.',
      'To overcome a rejection under 35 U.S.C. § 101, it must be shown that the claimed device is capable of achieving a useful result on all occasions and under all conditions.',
      'A claimed invention is properly rejected under 35 U.S.C. § 101 as lacking utility if the particular embodiment disclosed in the patent lacks perfection or performs crudely.',
      'To overcome a rejection under 35 U.S.C. § 101, it is essential to show that the claimed invention accomplishes all its intended functions.',
      'A claimed invention lacks utility if it is not commercially successful.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). As stated in MPEP § 2107.01(IV), a deficiency under 35 U.S.C. § 101 also creates a deficiency under 35 U.S.C. § 112, first paragraph. See In re Brana, 51 F.3d 1560, 34 USPQ2d 1436 (Fed. Cir. 1995); In re Fouche, 439 F.2d 1237, 169 USPQ 429 (CCPA 1971) ("If such compositions are in fact useless, appellant’s specification cannot have taught how to use them."). (B) is not correct; MPEP § 2107(II). (C), (D) and (E) are not correct; MPEP § 2107(II).',
  },
  {
    id: 'uspto-oct01-am-07',
    topicId: 6,
    subtopic: 'Plant Patent Applications — Drawings and Specification (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Sue has discovered a plant variety that has been asexually reproduced for which she desires patent protection. She comes to you for advice as to how she may file for a plant patent. Which of the following is not accurate with respect to proper USPTO procedure in relation to plant patent applications filed on or after January 1, 2001?',
    options: [
      'The specification must be drafted so as to contain as full and complete a disclosure as possible of the plant and the characteristics thereof that distinguish the same over related known varieties, and its antecedents, and must particularly point out where and in what manner the variety of plant has been asexually reproduced. For a newly found plant, the specification must particularly point out the location and character of the area where the plant was discovered.',
      'View numbers and reference characters must be used for the plant patent drawings unless excused by the examiner.',
      'The elements of her plant application should be organized in the following order: (1) plant patent application transmittal form, (2) fee transmittal form, (3) application data sheet, (4) specification, (5) drawings (in duplicate), and (6) executed oath or declaration under 37 CFR 1.162.',
      'The specification should include the following sections in order: (1) title of the invention, which may include an introductory portion stating the name, citizenship, and residence of the applicant, (2) cross-reference to related applications (unless included in the application data sheet), (3) statement regarding federally sponsored research or development, (4) latin name of the genus and species of the plant claimed, (5) variety denomination, (6) background of the invention, (7) brief summary of the invention, (8) brief description of the drawing, (9) detailed botanical description, (10) a single claim, and (11) abstract of the disclosure.',
      'A section heading in upper case, without underlining or bold type, should precede each section of the plant specification.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). The opposite is true — 37 CFR 1.165 (Plant Drawings) expressly provides that "[v]iew numbers and reference characters need not be employed unless required by the examiner." The elements of (A) are all present in 37 CFR 1.163; of (C) in § 1.163(b); of (D) in § 1.163(c); and of (E) in § 1.163(d).',
  },
  {
    id: 'uspto-oct01-am-08',
    topicId: 3,
    subtopic: 'Access to and Status of Applications — 37 CFR 1.14 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Joan comes to you wanting to know the status of the applications of her competitor Pete. During Joan’s previous relationship with Pete she believes she may have been a coinventor on one of the applications filed by Pete. Pete owns Applications A, B, C and D. Application B is a continuation of application A and a redacted copy of application A has been published under 35 U.S.C. § 122(b). Joan is listed as a coinventor on Application C. Pete has an issued patent that claims priority to Application D. Assume only the last six digits of the numerical identifier are available for Application D and Application D is abandoned. Which of the following is not true?',
    options: [
      'Joan may obtain status information for Application B that is a continuation of an application A since application A has been published under 35 U.S.C. § 122(b).',
      'Joan may be provided status information for Application D that includes the filing date if the eight-digit numerical identifier is not available and the last six digits of the numerical identifier are available.',
      'Joan may obtain status information for Application D since a U.S. patent includes a specific reference under 35 U.S.C. §120 to Application D, an abandoned application. Joan may obtain a copy of that application-as-filed by submitting a written request including the fee set forth in 37 CFR 1.19(b)(1).',
      'Joan may obtain status information as to Application C since a coinventor in a pending application may gain access to the application if his or her name appears as an inventor in the application, even if she did not sign the § 1.63 oath or declaration.',
      'Joan may obtain access to the entire Application A by submitting a written request, since, notwithstanding the fact that only a redacted copy of Application A has been published, a member of the public is entitled to see the entire application upon written request.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): Statement (E) is false and is therefore the answer. Since a redacted copy of the application was used for publication, 37 CFR 1.14(c)(2) provides that "[i]f a redacted copy of the application was used for the patent application publication, the copy of the specification, drawings, and papers may be limited to a redacted copy." For (A) and (B), see § 1.14(b)(2). For (C), see § 1.14(b)(2) and (c)(1)(i). As to (D), a coinventor is entitled to access independent of whether he or she signed the declaration; per § 1.41(a)(2), if no declaration is filed the inventorship is that set forth in the application papers.',
  },
  {
    id: 'uspto-oct01-am-09',
    topicId: 0,
    subtopic: '35 U.S.C. 135(b) as an Ex Parte Rejection (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] John, unaware of the existence of Jane’s U.S. patent, which issued on Tuesday, July 11, 2000, files a patent application on Friday, January 11, 2001. John’s application and Jane’s patent are not commonly owned. On Thursday, July 11, 2001, in reply to an Office action rejecting all of his claims, John files an amendment canceling all of his claims and adding claims setting forth, for the first time, “substantially the same subject matter” as is claimed in Jane’s patent. The examiner rejects John’s claims on the basis of 35 U.S.C. § 135(b). Which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'The rejection is improper because 35 U.S.C. § 135(b) relates to interferences.',
      'The rejection is proper because 35 U.S.C. § 135(b) is not limited to inter partes proceedings, but may be used as a basis for ex parte rejections.',
      'Since John’s claims would interfere with Jane’s unexpired patent, the proper procedure is for the examiner to declare an interference rather than to reject John’s claims.',
      'The rejection is proper merely by reason of the fact that John’s claims are broad enough to cover the patent claims.',
      'The rejection is improper inasmuch as John is claiming “substantially the same subject matter” as is claimed in the patent.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer, and (A) and (C) are wrong. MPEP § 715.05: if the patent claims the same invention and issued one year or more before the claims are presented, a rejection under 35 U.S.C. § 135(b) should be made. See In re McGrew, 120 F.3d 1236, 43 USPQ2d 1632 (Fed. Cir. 1997) (§ 135(b) is not limited to inter partes interference proceedings but may be used as a basis for ex parte rejections). (D) is wrong — that the application claim is broad enough to cover the patent claim is not sufficient. In re Frey, 182 F.2d 184 (CCPA 1950); MPEP § 2307. (E) is also wrong. [Pre-AIA — interference practice was replaced by derivation proceedings.]',
  },
  {
    id: 'uspto-oct01-am-10',
    topicId: 3,
    subtopic: 'Time for Filing the Appeal Brief (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] After filing a Notice of Appeal, an appeal brief is due. In accordance with proper USPTO practice and procedure:',
    options: [
      'The brief is due within two months of the date of appeal, the date indicated on any Certificate of Mailing under 37 CFR 1.8 attached to the Notice of Appeal is the date from which this two month period is measured.',
      'The brief is due within two months of the date of appeal. The Office date of receipt of the Notice of Appeal is the date from which this two month period is measured.',
      'Failure to file the appeal brief within the permissible time will result in dismissal of the appeal and abandonment of the application, including any allowed claims.',
      'Failure to file the appeal brief within the permissible time will result in dismissal of the appeal and abandonment of the application containing no allowed claims, and an appeal brief will be due within two months after the date a petition is granted to revive the application and reinstate the appeal.',
      'If the appellant is unable to file an appeal brief within the time allotted by the rules, appellant may file a petition, with fee, to the examining group, requesting additional time, and the time extended is added to the last day the appeal brief would have been due when said last day is a Saturday, Sunday, or Federal holiday.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR 1.192(a); MPEP § 1206, "Time For Filing Appeal Brief." (C) is incorrect — although failure to file the brief in time dismisses the appeal, if any claims stand allowed the application does not become abandoned but returns to the examiner for action on the allowed claims. MPEP §§ 1206, 1215.04. (D) is incorrect — a proper brief must be filed before a petition to revive and reinstate the appeal is considered on the merits; alternatively a continuing application or RCE may be filed. § 1.137(c). (E) is incorrect — the time extended is added to the calendar day of the original period. [Historical practice — Board appeal rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct01-am-11',
    topicId: 3,
    subtopic: 'When a Final Rejection Is Proper (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In which of the following final Office action rejections is the finality of the Office action rejection proper?',
    options: [
      'The final Office action rejection is in a second Office action and uses newly cited art under 35 U.S.C. § 102(b) to reject unamended claims that were objected to but not rejected in a first Office action.',
      'The final Office action rejection is in a first Office action in a continuation-in-part application where at least one claim includes subject matter not present in the parent application.',
      'The final Office action rejection is in a first Office action in a continuing application, all claims are drawn to the same invention claimed in the parent application, and the claims would have been properly finally rejected on the grounds and art of record in the next Office action if they had been entered in the parent application.',
      'The final Office action rejection is in a first Office action in a substitute application that contains material that was presented after final rejection in an earlier application but was denied entry because the issue of new matter was raised.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. MPEP § 706.07(b). (A) is incorrect because a final rejection is not proper on a second action if it includes a rejection on newly cited art other than information submitted in an IDS under 37 CFR 1.97(c). MPEP § 706.07(a). (B) is incorrect because it is improper to make final a first Office action in a continuation-in-part where any claim includes subject matter not present in the parent. (D) is incorrect because it is improper to make final a first Office action in a substitute application containing material denied entry in the earlier application because new matter was raised. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct01-am-12',
    topicId: 2,
    subtopic: 'Application Data Sheets — 37 CFR 1.76 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] You are a registered practitioner. Lucy, your new associate, wants to know whether she must file an application data sheet with a provisional patent application of a client and what information she should include on the application data sheet. Lucy has previously submitted an application data sheet with a previously filed application for another client, but has discovered a discrepancy with the information contained in the declaration and application data sheet. Lucy wonders if she needs to correct the error if the correct information is contained in the declaration. She also asks how errors may be corrected. With respect to the filing of an application data sheet, which of the following is not accurate under proper USPTO procedure for applications filed on or after January 1, 2001?',
    options: [
      'An application data sheet is a sheet or sheets that may be voluntarily submitted in either provisional or nonprovisional applications, which contains bibliographic data, arranged in a format specified by the Office. If an application data sheet is provided, the application data sheet is part of the provisional or nonprovisional application for which it has been submitted.',
      'Bibliographic data on an application data sheet includes: (1) applicant information, (2) correspondence information, (3) application information, (4) representative information, (5) domestic priority information, (6) foreign priority information, and (7) assignee information.',
      'Once captured by the Office, bibliographic information derived from an application data sheet containing errors may not be corrected and recaptured by a request therefor accompanied by the submission of a supplemental application data sheet, an oath or declaration under 37 CFR 1.63 or § 1.67; nor will a letter pursuant to 37 CFR 1.33(b) be acceptable.',
      'In general, supplemental application data sheets may be subsequently supplied prior to payment of the issue fee either to correct or update information in a previously submitted application data sheet.',
      'The Office will initially capture bibliographic information from the application data sheet notwithstanding whether an oath or declaration governs the information. Thus, the Office shall generally not look to an oath or declaration under 37 CFR 1.63 to see if the bibliographic information contained therein is consistent with the bibliographic information captured from an application data sheet (whether the oath or declaration is submitted prior to or subsequent to the application data sheet).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). This is not true, since 37 CFR 1.76(d)(4) provides in part that "[c]aptured bibliographic information derived from an application data sheet containing errors may be recaptured by a request therefor and the submission of a supplemental application data sheet, an oath or declaration under 37 CFR 1.63 or § 1.67, or a letter pursuant to 37 CFR 1.33(b)." (A) accords with § 1.76(a); (B) with § 1.76(b); (D) with § 1.76(c); and (E) with § 1.76(d)(4).',
  },
  {
    id: 'uspto-oct01-am-13',
    topicId: 3,
    subtopic: 'RCE — What Counts as a Submission (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In accordance with proper USPTO practice and procedure, a submission for a request for continued examination does not include:',
    options: [
      'An amendment of the drawings.',
      'New arguments in support of patentability.',
      'New evidence in support of patentability.',
      'An appeal brief or reply brief (or related papers).',
      'An amendment of the claims.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the most correct answer. 37 CFR 1.114(d), last sentence. (A), (B), (C) and (E) are each recognized as being a "submission" within the scope of 37 CFR 1.114(c).',
  },
  {
    id: 'uspto-oct01-am-14',
    topicId: 1,
    subtopic: 'Written Description — Presumption and Burden (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is not in accord with proper USPTO practice and procedure?',
    options: [
      'A written description as filed in a nonprovisional patent application is presumed adequate under 35 U.S.C. § 112 in the absence of evidence or reasoning to the contrary.',
      'An examiner may show that a written description as filed in a nonprovisional patent application is not adequate by presenting a preponderance of evidence why a person of ordinary skill in the art would not recognize in the applicant’s disclosure a description of the invention defined by the claims.',
      'A general allegation of “unpredictability in the art” is sufficient to support a rejection of a claim for lack of an adequate written description.',
      'When filing an amendment, a practitioner should show support in the original disclosure for new or amended claims.',
      'When there is substantial variation within a genus, an applicant must describe a sufficient variety of species to reflect the variation within the genus.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C), not being in accord with proper USPTO practice and procedure, is the most correct answer. As stated in the "Written Description" Guidelines, 66 F.R. 1099, 1107 (Jan. 5, 2001), "A general allegation of ‘unpredictability in the art’ is not a sufficient reason to support a rejection for lack of adequate written description"; MPEP § 2163(III)(A). (A), (B), (D) and (E) each restate the Guidelines and MPEP § 2163 and are therefore in accord with practice.',
  },
  {
    id: 'uspto-oct01-am-15',
    topicId: 2,
    subtopic: 'Small Entity Status — Scope of the Fee Reduction (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Sam is a sole proprietor of Sam’s Labs, which has no other employees. Sam invented a new drug while doing research under a Government contract. Sam desires to file a patent application for his invention and assign it to Sam’s Labs. Sam has licensed Rick, also a sole proprietor with no employees, to make and use his invention. Sam wants to claim small entity status when filing a patent application for his invention. Sam also wants to grant the Government a license, but will not do so if he will be denied small entity status. Sam has limited resources and wants to know whether, how, and to what extent he may claim small entity status. Which of the following is not accurate with respect to proper USPTO procedure in relation to applications filed on or after January 1, 2001?',
    options: [
      'Sam’s Labs is a small business concern for the purposes of claiming small entity status for fee reduction purposes.',
      'If Sam grants a license to the Government resulting from a rights determination under Executive Order 10096, it will not constitute a license so as to prohibit claiming small entity status.',
      'The establishment of small entity status permits the recipient to pay reduced fees for all patent application processing fees charged by the USPTO.',
      'Sam may establish small entity status by a written assertion of entitlement to small entity status. A written assertion must: (i) be clearly identifiable; (ii) be signed; and (iii) convey the concept of entitlement to small entity status, such as by stating that applicant is a small entity, or that small entity status is entitled to be asserted for the application or patent.',
      'While no specific words or wording are required to assert small entity status, the intent to assert small entity status must be clearly indicated in order to comply with the assertion requirement.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Not all fees are subject to the small entity reduction — see, for example, 37 CFR 1.17(p). As to (A), Sam’s Labs meets all the elements of a small business concern under 37 CFR 1.27(a)(2). Statement (B) contains all the elements of § 1.27(a)(4); statement (D) all the elements of § 1.27(c)(1); and statement (E) all the elements of § 1.27(c)(1)(iii).',
  },
  {
    id: 'uspto-oct01-am-16',
    topicId: 1,
    subtopic: 'Multiple Dependent Claim Wording — 37 CFR 1.75(c) (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Claims 1 and 2, fully disclosed and supported in the specification of a patent application having an effective filing date of March 15, 2000, for sole inventor Ted, state the following: Claim 1. An apparatus intended to be used for aerating water in a fish tank, comprising: (i) an oxygen source connected to a tube, and (ii) a valve connected to the tube. Claim 2. An apparatus as in claim 1, further comprising an oxygen sensor connected to the valve. Which of the following claims, if fully disclosed and supported in the specification, and included in the application, provides a proper basis for an objection under 37 CFR 1.75(c)?',
    options: [
      'Claim 3. An apparatus as in any one of the preceding claims, in which the tube is plastic.',
      'Claim 3. An apparatus according to claims 1 or 2, further comprising a temperature sensor connected to the valve.',
      'Claim 3. An apparatus as in the preceding claims, in which the tube is plastic.',
      'Claim 3. An apparatus as in any preceding claim, in which the tube is plastic.',
      'Claim 3. An apparatus as in either claim 1 or claim 2, further comprising a temperature sensor connected to the valve.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. Claim 3 in answer (C) employs improper multiple dependent claim wording — "as in the preceding claims" is conjunctive rather than alternative. MPEP § 608.01(n)(I)(B). (A), (B), (D) and (E) are incorrect as each uses acceptable multiple dependent claim wording. MPEP § 608.01(n)(I)(A).',
  },
  {
    id: 'uspto-oct01-am-17',
    topicId: 0,
    subtopic: 'Statutory Bar and Intended-Use Preambles (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Claims 1 and 2, fully disclosed and supported in the specification of a patent application having an effective filing date of March 15, 2000, for sole inventor Ted, state the following: Claim 1. An apparatus intended to be used for aerating water in a fish tank, comprising: (i) an oxygen source connected to a tube, and (ii) a valve connected to the tube. Claim 2. An apparatus as in claim 1, further comprising an oxygen sensor connected to the valve. Which of the following, if relied on by an examiner in a rejection of claim 2, can be a statutory bar under 35 U.S.C. § 102 of claim 2?',
    options: [
      'A U.S. patent to John, issued February 2, 1999, that discloses and claims an apparatus intended to be used for aerating ice cream, having an oxygen source connected to a tube, a valve connected to the tube, and a battery coupled to the oxygen source.',
      'A U.S. patent to John, issued April 6, 1999, that discloses and claims an apparatus intended to be used for aerating water in a fish tank, having an oxygen source connected to a tube, a valve connected to the tube, and an oxygen sensor connected to the tube.',
      'A U.S. patent to Ned, issued February 9, 1999, that discloses, but does not claim, an apparatus intended to be used for aerating ice cream, having an oxygen source connected to a tube, a valve connected to the tube, an oxygen sensor connected to the valve, and a battery coupled to the oxygen source.',
      'A foreign patent to Ted issued April 12, 2000, on an application filed on March 12, 1997. The foreign patent discloses and claims an apparatus intended to be used for aerating water in a fish tank, having an oxygen source connected to a tube, a valve connected to the tube, and an oxygen sensor connected to the tube.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 35 U.S.C. § 102(b). MPEP § 2111.02 provides that the preamble generally is not accorded patentable weight where it merely recites the intended use of a structure — so the "aerating ice cream" preamble does not distinguish. (A) is incorrect because it does not disclose an oxygen sensor. (B) is incorrect because the patent issued less than one year before Ted’s filing date. (D) is incorrect because the foreign patent issued after Ted’s filing date. 35 U.S.C. § 102(d). (E) is incorrect because (C) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-18',
    topicId: 0,
    subtopic: 'Statutory Subject Matter — Purely Mathematical Processes (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is in accord with proper USPTO practice and procedure?',
    options: [
      'Satisfaction of the enablement requirement of the first paragraph of 35 U.S.C. § 112 by the disclosure in a specification also satisfies the written description requirement of the second paragraph of 35 U.S.C. § 112',
      'A claim to a process consisting solely of mathematical operations, i.e., converting one set of numbers into another set of numbers, does not manipulate appropriate subject matter and thus cannot constitute a process eligible for patent protection.',
      'A claim for a machine can encompass only one machine, such as a single computer, for performing the underlying process.',
      'A claim that recites nothing but the physical characteristics of a form of energy, such as a frequency, voltage, or the strength of a magnetic field, define energy or magnetism, per se, and as such are statutory natural phenomena.',
      'A composition of matter is a single substance, as opposed to two or more substances, whether it be a gas, fluid, or solid.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). MPEP § 2106(IV)(B)(2)(b)(ii): "If the ‘acts’ of a claimed process manipulate only numbers, abstract concepts or ideas, or signals representing any of the foregoing, the acts are not being applied to appropriate subject matter. Thus, a claim to a process consisting solely of mathematical operations … cannot constitute a statutory process." (A) is not correct — a specification may enable yet fail the written description requirement (In re Barker, 559 F.2d 588 (CCPA 1977)), and written description is in the FIRST paragraph. (C), (D) and (E) are not correct; MPEP § 2106(IV)(B); Diamond v. Chakrabarty, 447 U.S. 303 (1980).',
  },
  {
    id: 'uspto-oct01-am-19',
    topicId: 0,
    subtopic: 'Derivation and the "In This Country" Limits of 102 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Mr. Adams was touring the central Mexican highland desert when he came across a small tequila production facility. While touring the facility, Adams saw a unique machine for squeezing the sap from the blue agave plant and preparing the sap for fermentation. The machine, which had been in operation for more than three years, was highly efficient and helped produce excellent tequila from a minimal number of agave plants. The owner of the production facility had sold a number of identical machines to other local tequila producers over the past two years. All of the machines remained local and none of the producers sold their tequila outside the local area. Aware that the blue agave plant was becoming increasingly rare, Adams immediately recognized the commercial possibilities of such an efficient machine. Adams returned to the facility under cover of night and took numerous photographs of the machine. Upon Adams’ return to the United States, he worked from the photographs to make detailed technical drawings of the machine. He then promptly filed a patent application directed to the machine. Which of the following statements is correct?',
    options: [
      'Adams may not obtain a patent on the machine because it was known by others in a NAFTA country before Mr. Adams made technical drawings of the machine.',
      'Adams may not obtain a patent on the machine because the machine had been sold more than a year before Adams’ application filing date.',
      'Adams is entitled to a patent because all sales of the machine and the tequila produced by the machine were in Mexico; a goal of the patent system is public disclosure of technical advances; and the machine likely would not have been disclosed to the United States public without Adams.',
      'Adams may not obtain a patent on the machine because the machine was in public use more than a year before Adams’ application filing date.',
      'Statements (A), (B), (C) and (D) are each incorrect.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct response is (E). Adams is not entitled to a patent because he did not himself invent the subject matter sought to be patented — 35 U.S.C. § 102(f) — so (C) cannot be correct. (A) is incorrect because although the machine was known by others, it was not known by others IN THIS COUNTRY as required by § 102(a); that Mexico is a NAFTA country does not matter. (B) and (D) are incorrect for the same reason: any sale or public use was not "in this country" as required by § 102(b). [Pre-AIA — the AIA removed the geographic limits from 102.]',
  },
  {
    id: 'uspto-oct01-am-20',
    topicId: 3,
    subtopic: 'Board New Ground of Rejection — Appellant Options (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is true?',
    options: [
      'The statement, “Whether claims 1 and 2 are unpatentable,” complies with the requirement of 37 CFR 1.192(c)(6) for a concise statement in the appeal brief of the issues presented for review.',
      'A reissue application may be filed in order to broaden claims back to their original form where the claims were mistakenly narrowed during the original prosecution to avoid the prior art provided that the narrowing of the claims was made without deceptive intent on the part of the applicant.',
      'Following a new ground of rejection raised by the Board of Patent Appeals and Interferences, the applicant may request a rehearing, or submit an appropriate amendment of the rejected claims or a showing of facts relating to the rejected claims.',
      'If the Board of Patent Appeals and Interferences decides to require an appellant to address a particular matter, and the appellant cannot respond within the time period set, he may obtain an extension of time by paying the requisite fee.',
      'In an ex parte reexamination proceeding of a patent that arises from an application filed in the United States before November 29, 1999, a third party requester who is dissatisfied with a decision of the Board of Patent Appeals and Interferences may seek judicial review by appeal to either the U.S. Court of Appeals for the Federal Circuit or by civil action in the U.S. District Court for the District of Columbia.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. See 37 CFR 1.196(b); MPEP § 1214.01. As to (A), see MPEP § 1206 "(6) Issues" — the bare statement is not a concise statement of the issues. As to (B), the recapture doctrine prevents such claims from being recaptured; MPEP § 1412.02. As to (D), see § 1.196(d) and MPEP § 1212 — failure to respond in time results in dismissal of the appeal. As to (E), a third party may not appeal; Syntex (U.S.A.) Inc. v. USPTO, 11 USPQ2d 1866 (Fed. Cir. 1989). [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct01-am-21',
    topicId: 0,
    subtopic: 'Obviousness — Changes to Prior Art That May Confer Patentability (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] An inventor, working with prior art subject matter, changes the subject matter, and thereafter files a patent application only claiming the changed subject matter. Which of the following changes might render the claimed subject matter patentable?',
    options: [
      'Where the only difference between the prior art device and the claim device was a recitation of relative dimensions of the claimed device and the claimed device would not perform differently than the prior art device.',
      'Where the only difference between the prior art device and the claimed device is the configuration of the claimed device, and the configuration is a matter of choice without significance regarding the use of the device.',
      'Where the difference between the prior art, an impure material, and the claimed subject matter, the purified form of the impure material, is the purity of the material and the utility of the purified material, which differs from the impure material.',
      'Where the only difference between the prior art device and the claimed device is a reversal of the parts that move relative to each other, and without any unexpected results.',
      'Where the only difference between the prior art device and the claimed device is elimination of an element and its function, and elimination of the function was desired, required, or expected.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). MPEP § 2144.04(VII), citing In re Bergstrom, 427 F.2d 1394, 166 USPQ 256 (CCPA 1970) — a purified material with a utility differing from the impure material may be patentable. (A) is not correct; MPEP § 2144.04(IV)(A) (Gardner v. TEC Systems). (B) is not correct; § 2144.04(IV)(B) (In re Dailey). (D) is not correct; § 2144.04(VI)(A) (In re Gazda). (E) is not correct; § 2144.04(II)(A) (In re Larson; In re Kuhle). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-22',
    topicId: 3,
    subtopic: 'IDS — Not a Representation That a Search Was Made (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Tony, an inventor/client in several pending applications which you have filed, comes to you with several publications and patents which he has discovered for the first time while cleaning out his brother-in-law’s attic last week. Tony’s brother-in-law was not an individual within the scope of 37 CFR 1.56. Tony’s brother-in-law has what appears to be material prior art for four of Tony’s applications, A, B, C and D. Tony wants to know if it is too late to file information disclosure statements to have the examiner consider the information. Tony also wants to know if he does file an information disclosure statement, is he making a statement that a search has been conducted and that the items he discovered are material? Application A was filed two months ago and no Office action has issued. Application B was filed six months ago and a first, non-final, action has issued. In Application C, a Notice of Allowability has issued and the issue fee has not been paid. In Application D, a Notice of Allowability has issued and the issue fee has been paid. Which of the following is not true with respect to the proper USPTO procedure in relation to Tony’s applications, all of which were filed on or after January 1, 2001?',
    options: [
      'The USPTO would consider an information disclosure statement signed by Tony in regard to application B, if the statement signed by Tony is filed within three months of Tony knowing the information and before the mailing date of a final action under 37 CFR 1.113, a notice of allowance under 37 CFR 1.311, or an action that otherwise closes prosecution in the application. The information disclosure statement must be accompanied by one either (1) the appropriate fee or (2) a statement that no item of information contained in the information disclosure statement was cited in a communication from a foreign patent office in a counterpart foreign application. Further, the statement must include Tony’s certification, after making reasonable inquiry, to his knowledge that no item of information contained in the information disclosure statement was known to any individual within the scope of 37 CFR 1.56(c) more than three months prior to the filing of the information disclosure statement.',
      'For application C, an information disclosure statement must be considered by the Office if the statement, signed by Tony, is filed after Notice of Allowance was mailed and on or before payment of the issue fee, and is accompanied by both the appropriate fee, and a statement that no item of information contained in the information disclosure statement was cited in a communication from a foreign patent office in a counterpart foreign application. Further, the statement must include Tony’s certification, after making reasonable inquiry, to his knowledge that that no item of information contained in the information disclosure statement was known to any individual within the scope of 37 CFR 1.56(c) more than three months prior to the filing of the information disclosure statement.',
      'No extensions of time for filing an information disclosure statement are permitted under 37 CFR 1.136, however, if a bona fide attempt is made to comply with 37 CFR 1.98, but part of the required content is inadvertently omitted, additional time may be given to enable full compliance.',
      'A properly filed information disclosure statement shall be construed as a representation that a diligent and thorough search has been made.',
      'The filing of an information disclosure statement shall not be construed to be an admission that the information cited in the statement is, or is considered to be, material to patentability as defined in 37 CFR 1.56(b).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 CFR 1.97(g) specifically states that "[a]n information disclosure statement filed in accordance with this section shall not be construed as a representation that a search has been made." The elements of (A) are supported by § 1.97(c); of (B) by § 1.97(d); of (C) by § 1.97(f); and of (E) by § 1.97(h).',
  },
  {
    id: 'uspto-oct01-am-23',
    topicId: 0,
    subtopic: '35 U.S.C. 102(d) Foreign Patent Bar (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Roberto files a U.S. patent application fourteen months after he perfects an invention in Europe. Which of the following would establish a statutory bar against the granting of a U.S. patent to Roberto?',
    options: [
      'A foreign patent issued to Roberto 11 months prior to the filing date of Roberto’s U.S. patent application. The foreign patent was granted on an application that was filed 23 months prior to the effective filing date of Roberto’s U.S. patent application. The foreign patent application and the U.S. patent application claim the same invention.',
      'The invention was described in a printed publication in the United States, 11 months prior to the filing date of the U.S. patent application.',
      'The invention was in public use in the United States, less than one year prior to the filing date of the U.S. patent application.',
      'The invention was on sale in a foreign (NAFTA member) country, more than one year prior to the filing date of the U.S. patent application.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 35 U.S.C. § 102(d); MPEP § 706.02(c). The foreign patent establishes a bar under § 102(d) because it issued before the U.S. filing date on an application filed more than twelve months earlier. (B) is incorrect because the publication is not more than one year before the U.S. filing date. § 102(b). (C) is incorrect because the public use is less than one year before filing. MPEP § 2133. (D) is incorrect because the sale was not in the United States. § 102(b); MPEP § 2133.03(d). (E) is incorrect because (A) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-24',
    topicId: 2,
    subtopic: 'Joint Inventorship of a Combination and Its Subcombinations (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Able and Baker conceived an improved gas grille for cookouts. Using elements A, B, C, D, E and F found in their backyards, as well as elements G, H, I, J, K, L, M and N purchased at a local hardware store, they successfully constructed and used a gas grille conforming to their concept. The grille includes subcombination of elements K, L and M conceived by Able, and subcombination C, D, F, G and M conceived by Baker. Able and Baker conceived their respective subcombinations separately and at different times. Able and Baker retain you to prepare and file a patent application for them. You are considering whether and what can be claimed in one patent application. Which of the following is true?',
    options: [
      'For Able and Baker to properly execute an oath or declaration under 37 CFR 1.63 in a patent application claiming not only the grille, but also the two subcombinations, Able and Baker must be joint inventors of the grille, and each of the two subcombinations.',
      'A characteristic of U.S. patent law that is generally shared by other countries is that the applicant for a patent must be the inventor.',
      'If Able and Baker execute an oath or declaration under 37 CFR 1.63 as joint inventors and file an application claiming the grille (a combination of elements A, B, C, D, E, F, G, H, I, J, K, L, M and N), the existence of the claim to the grille is evidence of their joint inventorship of the individual elements.',
      'Able and Baker may properly execute an oath or declaration under 37 CFR 1.63 as joint inventors and file an application containing claims to the grille (a combination of elements A, B, C, D, E, F, G, H, I, J, K, L, M and N), claims to the subcombination conceived by Able, and claims to the subcombination conceived by Baker.',
      'Able and Baker could not properly claim the combination unless they successfully and personally reduced the grille to practice.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). 35 U.S.C. § 116, first paragraph; MPEP § 2137.01; Kimberly-Clark Corp. v. Procter & Gamble Distributing, 23 USPQ2d 1921 (Fed. Cir. 1992). Inventors need not have made the same type or amount of contribution to every claim. (A) is not correct for the same reason. (B) is not correct — the inventor-as-applicant rule is characteristic of U.S. law, not generally shared. (C) is not correct — the inventor of an element per se and the inventor of a combination using it may differ. In re DeBaun, 214 USPQ 933 (CCPA 1982). (E) is not correct — there is no requirement of reduction to practice to file.',
  },
  {
    id: 'uspto-oct01-am-25',
    topicId: 0,
    subtopic: 'On-Sale Bar Abroad and Rule 131 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Ada invented a computer memory retrieval system in the United States. In June 1999, at the request of MC Computer Corp. and with the benefit of an export license, Ada demonstrates her invention at a testing facility in England. MC Computer Corp. signs a confidentiality agreement and agrees not to disclose the invention to anyone. The test is conducted in a secluded area and the persons involved are sworn to secrecy. Unbeknownst to Ada, MC Computer Corp. installs the computer memory retrieval system on its MC computers and begins selling its computers in England in September 1, 1999, with Ada’s memory retrieval system. The first sale in the United States of MC Computer Corp’s computers with Ada’s memory retrieval system occurs on October 1, 1999. On August 1, 2000, MC Computer Corp. publishes an advertisement in the United States, and files a U.S. patent application that discloses but does not claim the memory retrieval system invented by Ada. The MC Computer Corp.’s patent issues on October 1, 2001. On September 12, 2000, Ada files a patent application. On October 15, 2001, the examiner rejects all the claims in Ada’s application based upon MC Computer Corp.’s advertisement published on August 1, 2000. Which of the following is true?',
    options: [
      'Since the MC Computer Corp. misappropriated the invention and since Ada did not authorize the sales in England on September 1, 1999, or the advertisement on August 1, 2000 in the United States, the rejection may be overcome by showing that the idea was misappropriated by MC Computer and the sales were not authorized by Ada.',
      'Ada is not entitled to a patent since the invention was on sale more than one year prior to the date of the application for patent in the United States.',
      'Ada may file a declaration pursuant to 37 CFR 1.131 to antedate MC Computer Corp.’s published advertisement.',
      'Ada may file a request for reexamination of the MC Computer Corp.’s patent on the grounds that her idea was misappropriated.',
      'The MC Computer Corp.’s patent is invalid for breach of the confidentiality agreement and disclosing the invention of another.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Ada may file an affidavit or declaration pursuant to 37 CFR 1.131. As to (A), Evans Cooling Systems v. General Motors, 125 F.3d 1448 (Fed. Cir. 1997) holds that the public sale bar applies even to a misappropriated invention — however, the sale here occurred in England, not "in the United States" as § 102(b) requires. As to (B), the sale in England is not a bar for the same reason. As to (D), reexaminations are based solely upon patents and printed publications. (E) is incorrect since disclosure of another’s idea and breach of a confidentiality agreement do not render a patent invalid. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-27',
    topicId: 3,
    subtopic: 'Traversing a Restriction Requirement (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A U.S. patent application for inventor William Tull discloses a target-shooting gun for improved accuracy, and a bullet impregnated with a new chemical composition. The new chemical composition minimizes damage to a target struck by the bullet. In a non-final Office action, an examiner includes a restriction requirement between a group of claims drawn to the target-shooting gun (Group 1), and a group of claims drawn to the bullet (Group 2). Which of the following, included in a timely reply to the non-final Office action, preserves Tull’s right to petition for review of the restriction requirement, if the requirement is made final?',
    options: [
      'A reply that distinctly points out supposed errors in the restriction requirement, and also states, “The restriction requirement is traversed, and no election is made, thereby preserving Applicant’s right to petition for review of the restriction requirement.”',
      'A reply that states, “Applicant elects Group 2 and traverses the restriction requirement because the requirement for restriction between Group 1 and Group 2 is in error.”',
      'A reply that distinctly and specifically points out supposed errors in the restriction requirement, and states, “Applicant traverses the restriction requirement and elects Group 2.”',
      'A reply that states, “The restriction requirement between Group 1 and Group 2 is traversed because it is in error, and no election is made, thereby preserving Applicant’s right to petition for review of the restriction requirement.”',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR 1.144; MPEP §§ 818.03(a)-(c). A traverse must both make an election and distinctly and specifically point out the supposed errors. (A), (B) and (D) are each incorrect because no supposed errors are distinctly and specifically pointed out; (A) and (D) are further incorrect because no election is made. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct01-am-28',
    topicId: 3,
    subtopic: 'Board New Ground of Rejection and Special Status (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is true?',
    options: [
      'When an applicant successfully petitions to make his case special, the special status ends if applicant appeals the case to the Board of Patent Appeals and Interferences.',
      'A reissue application may be filed in order to broaden claims back to their original form where the claims were mistakenly narrowed during the original prosecution to avoid the prior art provided that the narrowing of the claims was made without deceptive intent on the part of the applicant.',
      'If the Board of Patent Appeals and Interferences decides to require an appellant to address a particular matter, and the appellant cannot respond within the time period set, he may obtain an extension of time by paying the requisite fee.',
      'Following a new ground of rejection raised by the Board of Patent Appeals and Interferences, the applicant may request a rehearing, or submit an appropriate amendment of the rejected claims or a showing of facts relating to the rejected claims.',
      'In an ex parte reexamination proceeding, a third party requester who is dissatisfied with a decision of the Board of Patent Appeals and Interferences may seek judicial review by appeal to either the U.S. Court of Appeals for the Federal Circuit or by civil action in the U.S. District Court for the District of Columbia.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). See 37 CFR 1.196(b); MPEP § 1214.01. As to (A), see MPEP § 1204 under "Special Case" — special status does not end on appeal. As to (B), the recapture doctrine prevents such claims from being recaptured; MPEP § 1412.02. As to (C), see § 1.196(d) and MPEP § 1212 — failure to respond in time results in dismissal of the appeal. As to (E), a third party may not appeal; 35 U.S.C. § 306; MPEP § 2273; Syntex (U.S.A.) Inc. v. USPTO, 11 USPQ2d 1866 (Fed. Cir. 1989). [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct01-am-29',
    topicId: 7,
    subtopic: 'Duty of Disclosure — What Must Be Cited (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Kat Forrest conceived, constructed and successfully tested a golfer’s aid to help less-skilled players, and asks you in September 2001 to prepare and file a patent application. She informs you that she has shown the golfer’s aid only to her caddie and only under terms of strict confidentiality, and that she finalized the design on June 5, 2001. Her golfer’s aid has not been sold or offered for sale. She also informs you that she derived the general idea for the golfer’s aid, in part, from (1) an article appearing in the July 2000 edition of a golf magazine concerning a commercial distance finder and (2) a customized personal digital assistant (PDA) she saw on a store shelf while traveling in Thailand in April 2001. The distance finder has been available for sale in the United States since August 2000. The customized PDA was first offered for sale in the United States on June 8, 2001, but has not been disclosed in any publication or patent document. You prepare a patent application with claims that you believe are likely to be found patentably distinct over the commercially available distance finder and the golf magazine article, either alone or in combination. The application is filed with the USPTO on September 17, 2001. Which of the following statements is most true?',
    options: [
      'Kat should disclose the golf magazine article to the USPTO for consideration by the examiner, but need not disclose information concerning the customized PDA.',
      'Kat need not disclose either the golf magazine article or information concerning the customized PDA to the USPTO for consideration by the examiner.',
      'Kat should disclose both the golf magazine article and information concerning the customized PDA to the USPTO for consideration by the examiner.',
      'Kat’s observation of the customized PDA is not material to patentability because the observation took place in Thailand and the PDA was not offered for sale in the United States until June 2001, the PDA has not been described in a publication, and the PDA has not been patented.',
      'Kat’s observation of the customized PDA cannot be material to patentability because golfer’s aids are nonanalogous art.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). Regardless of whether the customized PDA or the golf magazine article qualifies as prior art under 35 U.S.C. § 102(a) and/or § 102(b), and despite the belief that the claims are patentably distinct, Kat’s derivation of the idea for the golfer’s aid from those sources raises a possible obviousness rejection under 35 U.S.C. § 103/102(f). See 37 CFR 1.56. Moreover, the golf magazine article published more than a year before Kat’s filing date and is therefore available as prior art under at least § 102(b). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-30',
    topicId: 0,
    subtopic: 'What Is Considered in an Obviousness Determination (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is most likely to be considered in a proper obviousness determination?',
    options: [
      'Evidence demonstrating the manner in which the invention was made.',
      'Evidence that a combination of prior art teachings, although technically compatible, would not be made by businessmen for economic reasons.',
      'Evidence demonstrating the level of ordinary skill in the art.',
      'Evidence that one of ordinary skill in the art, after reading Kat’s application, would readily be able to make and use Kat’s invention without undue experimentation.',
      'Evidence that the distance finder described in the July 2000 golf magazine has enjoyed great commercial success.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). The level of ordinary skill in the art is one of the factors that must be considered in any obviousness determination. Graham v. John Deere, 383 U.S. 1, 148 USPQ 459 (1966). (A) is not the best answer because 35 U.S.C. § 103 specifically states that patentability shall not be negated by the manner in which the invention was made. (B) is not the best answer because economic unfeasibility is not a basis for nonobviousness; MPEP § 2145(VII). (D) is directed to enablement, not obviousness. (E) is wrong because commercial success of the PRIOR ART is not relevant (commercial success of the claimed invention would be). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-31',
    topicId: 0,
    subtopic: 'Effective Prior Art Date of a U.S. Patent (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A United States patent issued to Jack Nichols on September 18, 2001 based on an application filed in the USPTO in May 2000. The Nichols patent claimed priority from a German application that was filed in April 2000 and was first published in October 2001. The Nichols U.S. application was an exact translation of the German priority application, and fully anticipated the subject matter of Kat’s broadest claims. The Examiner locates the Nichols U.S. patent and the Nichols published priority application during prosecution. Which of the following actions, if taken by the Examiner, would be most proper (keeping in mind that the Examiner has no evidence of Kat’s activities prior to September 17, 2001)?',
    options: [
      'Reject Kat’s broadest claims under 35 U.S.C. § 102(a) because Nichols’ U.S. patent is evidence that the claimed subject matter was known by others prior to Kat’s invention.',
      'Reject Kat’s broadest claims under 35 U.S.C. § 102(a) because the claimed subject matter was patented or described in a printed publication by Nichols before Kat’s invention.',
      'Reject Kat’s broadest claims under 35 U.S.C. § 102(b) because the claimed subject matter was patented or described in a printed publication by Nichols before Kat’s invention.',
      'Reject Kat’s broadest claims under 35 U.S.C. § 102(d) because the claimed subject matter was first patented or caused to be patented in a foreign country on an application filed more than twelve months before Kat’s filing date.',
      'Reject Kat’s broadest claims under 35 U.S.C. § 102(e) because the claimed subject matter was described in a U.S. patent granted to Nichols on an application filed before Kat’s invention.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (E). The effective prior art date of Nichols’ U.S. patent under 35 U.S.C. §§ 102(a) and 102(b) is its issue date, September 18, 2001 — after Kat’s September 17, 2001 filing — so answers (A), (B) and (C) are incorrect. Under § 102(e), however, the patent is available as of its U.S. filing date in May 2000. The provisions of § 102(d) do not apply at least because Nichols’ German application was not filed by Kat, so (D) is incorrect. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-32',
    topicId: 1,
    subtopic: 'Antecedent Basis in a Claim Set (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Kat’s patent application includes the following incomplete independent claim 8 and complete dependent claims 9 and 10: Claim 8. An aid for assisting a golfer comprising: i) a display device; ii) an input device adapted to receive user inputs from said golfer; iii) __________; iv) a memory for storing user specific data indicating, at least in part, a skill level for said golfer; and v) a processor which (1) obtains signals from said input device, said receiver, and said memory, (2) calculates a suggested play based at least in part on said signals from said input device, said receiver, and said memory, and (3) displays said suggested play on said display device. Claim 9. The aid of claim 8, wherein said plurality of remote devices includes multiple sensors distributed on a golf course for detecting and transmitting playing condition data. Claim 10. The aid of claim 9, wherein said plurality of remote devices further includes a global positioning system for obtaining position data. Which of the following best completes claim 8?',
    options: [
      'a plurality of remote devices operable to detect playing conditions and position and to generate sensor signals that indicate playing condition data and position data;',
      'a plurality of remote devices, said plurality of remote devices including at least one device that indicates playing condition data and at least one device that indicates position data;',
      'means for receiving playing condition data and position data transmitted by a plurality of remote devices;',
      'a receiver operable to obtain data transmitted by a plurality of remote devices, said plurality of remote devices including at least one device that transmits playing condition data and at least one device that transmits position data;',
      'a receiver operable to obtain a plurality of remote sensor signals, said remote sensor signals indicating playing condition data and position data;',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (D). Answers (A), (B) and (C) do not provide antecedent basis for "said receiver" in part v of claim 8. Answer (E) does not provide antecedent basis for "said plurality of remote devices" in claims 9 and 10. Only (D) supplies both antecedents.',
  },
  {
    id: 'uspto-oct01-am-33',
    topicId: 6,
    subtopic: 'Design Patent Term and Terminal Disclaimers (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Igor, a refugee from the civil turmoil that recently befell his native country, filed a design patent application in the USPTO on January 24, 2000, which issued as a design patent on January 23, 2001. Igor’s design patent covered a design of a cell phone holder for motor vehicles and became immediately popular with cell phone owners, resulting in numerous inquiries for licenses from various manufacturers. Igor would like to financially exploit his patent by licensing for five years. However, in appreciation for the benefits bestowed upon him since immigrating to the U.S., Igor has decided to dedicate five years of his patent term to the public. Which of the following is in accord with proper USPTO practice and procedure, while best allowing Igor to pursue his intentions?',
    options: [
      'Record in the USPTO an assignment of all right, title, and interest in the patent to the public, conditioned on the receipt by Igor of all royalties from licensing the patent after the first five years of the patent term.',
      'File a disclaimer in the USPTO dedicating to the public the first five years of the patent term.',
      'File a disclaimer in the USPTO dedicating to the public that portion of the term of the patent from January 24, 2015 to January 24, 2020.',
      'File a disclaimer in the USPTO dedicating to the public half of all royalties received from licensing the patent for the terminal part of the term of the patent.',
      'File a disclaimer in the USPTO dedicating to the public that portion of the term of the patent from January 24, 2010 to January 23, 2015.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because 37 CFR 1.321(a) permits any patentee to "disclaim or dedicate to the public … any terminal part of the term" of the patent, and 35 U.S.C. § 173 grants design patents a term of fourteen years from grant — here expiring January 23, 2015. (A) is wrong because a conditional assignment is regarded as absolute for Office purposes (37 CFR 3.56) and would not let Igor exploit any part of the term. (B) is wrong because the FIRST five years is not a "terminal part" of the term. (C) is wrong because the design patent term already expires January 23, 2015. (D) is wrong because royalties are not addressed by § 1.321(a).',
  },
  {
    id: 'uspto-oct01-am-34',
    topicId: 1,
    subtopic: '"Consisting Of" and Dependent Claims (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A patent application filed in the USPTO contains the following dependent claim: Claim 2. The method of Claim 1, further consisting of the step of cooling the mixture to a temperature of 32° F. Following proper USPTO practices and procedures, from which of the following claims does Claim 2 not properly depend?',
    options: [
      'Claim 1. A method of making liquid compound A comprising the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A characterized by the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A including the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      'Claim 1. A method of making liquid compound A consisting of the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '(B) and (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. The phrase "consisting of" excludes any step not specified in the claim. MPEP § 2111.03. Thus a claim depending from a claim that "consists of" the recited steps cannot add a step — and here the dependent claim adds cooling. (A) is incorrect because "comprising" is open-ended. (B) and (C) are incorrect because "including" and "characterized by" are synonymous with "comprising." (E) is incorrect because (B) and (C) are incorrect.',
  },
  {
    id: 'uspto-oct01-am-35',
    topicId: 2,
    subtopic: 'Nonpublication Request — Notice of Foreign Filing (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] During their period of courtship, Amy and Pierre invented and actually reduced to practice an improved frying pan. Acting as pro se joint inventors, they filed a nonprovisional patent application in the USPTO on January 10, 2001, along with a proper nonpublication request. The application disclosed both Amy’s and Pierre’s concepts in the specification, and contained three independent claims: claim 1 was generic to the two concepts; claim 2 was directed to Amy’s concept, and claim 3 was directed to Pierre’s concept. Thereafter, Amy and Pierre had a “falling out” and Pierre returned to his home in France where he filed a corresponding patent application in the French Patent Office on January 31, 2001. Pierre was completely unaware of any obligation to inform the USPTO of the French application. Amy first learned of Pierre’s application in the French Patent Office on October 10, 2001. Once Amy learns of the French application, which of the following actions should she take which accords with proper USPTO practice and procedure and which is in her best interest?',
    options: [
      'Immediately notify the USPTO of the filing of the corresponding application in the French Patent Office.',
      'Promptly submit a request to the USPTO under Amy’s signature to rescind the nonpublication request.',
      'File an amendment under Amy’s signature deleting claim 3 and requesting that Pierre’s name be deleted as an inventor on the ground that he is not an inventor of the invention claimed.',
      'Promptly file a document, jointly signed with Pierre, giving notice to the USPTO of the filing of the corresponding application in the French Patent Office and showing that any delay in giving the notice was unintentional.',
      'File an application for a reissue patent that is accompanied by an amendment paper with proper markings deleting Pierre’s concept from the specification and a statement canceling claims 1 and 3.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct because 35 U.S.C. § 122(b)(2)(B)(iii) indicates that such action may avoid abandonment of the application. (A) is wrong because the action is being taken more than 45 days after the French filing and so will not avoid abandonment. (B) is wrong because 37 CFR 1.213(a)(4) requires the request to be signed in compliance with § 1.33(b)(4), which requires ALL applicants to sign. (C) is wrong because it will not avoid abandonment under § 122(b)(2)(B)(iii). (E) is wrong because Amy’s application has not issued as a patent, and reissue relates only to issued patents.',
  },
  {
    id: 'uspto-oct01-am-36',
    topicId: 3,
    subtopic: 'Date of Abandonment After an Extension of Time (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] The claims of a pending patent application were rejected in an Office action mailed Thursday, November 23, 2000. The Examiner set a three-month shortened statutory period for reply. The applicant petitioned for a one-month extension of time on Friday, February 23, 2001 and paid the appropriate one-month extension fee. No further papers or fees were submitted and the application became abandoned. What was the date of abandonment?',
    options: [
      'Friday, February 23, 2001.',
      'Friday, March 23, 2001.',
      'Saturday, March 24, 2001.',
      'Monday, March 26, 2001.',
      'Thursday, May 24, 2001.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). The one-month extension filed February 23, 2001 properly extended the deadline for reply to Friday, March 23, 2001. When a timely reply is ultimately not filed, the application is regarded as abandoned after midnight of the date the period for reply expired — i.e., at 12:01 AM on Saturday, March 24, 2001. That March 24 was a Saturday does not change the abandonment day, because the reply was due March 23, a business day. MPEP § 710.01(a).',
  },
  {
    id: 'uspto-oct01-am-37',
    topicId: 1,
    subtopic: 'Basis for a 35 U.S.C. 112, First Paragraph Rejection (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] An application includes independent claims 1 and 2. Which of the following, in a reply to a non-final Office action, provides the proper basis for a rejection under 35 U.S.C. § 112, first paragraph?',
    options: [
      'Applicant amends claim 2 of the originally filed application by adding a limitation which was previously written only in claim 1 of the originally filed application, and one of ordinary skill in the art is enabled by the original disclosure to make and use the invention as claimed in amended claim 2.',
      'Applicant amends claim 1 of the originally filed application by adding a limitation that was written in the original disclosure of the application, but the original disclosure does not enable one of ordinary skill in the art to make or use the invention as claimed in amended claim 1.',
      'Applicant amends and broadens claim 2 by removing a limitation which was written in the original disclosure of the application, and one of ordinary skill in the art is enabled by the original disclosure to make and use the invention as claimed in amended claim 2.',
      'Applicant adds new matter to the disclosure, but does not amend the claims of the originally filed application, and one of ordinary skill in the art is enabled by the original disclosure to make and use the invention as described in each of the claims.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). MPEP § 2163.01 — the claim as amended is not enabled by the original disclosure. (A) is incorrect because the claims as filed are part of the disclosure (MPEP §§ 2163.03, 2163.06(III)) and claim 2 is enabled. (C) is incorrect because the original disclosure enables claim 2. (D) is incorrect because although the specification should be objected to for new matter, the original disclosure enables each of the claims; MPEP § 2163.06(I). (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-oct01-am-38',
    topicId: 3,
    subtopic: 'IDS Timing After a Request for Continued Examination (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Registered practitioner Roni files a utility patent application under 37 CFR 1.53(b) in the USPTO having one claim on May 6, 1998. A proper final rejection of claim 1 was mailed on June 28, 2000. Roni files a request for continued examination with the appropriate fee on September 12, 2000, and submits an amendment to claim 1 with the request. On October 7, 2000, Roni learns about a publication (the “Columbus reference”) which she knows to be material to patentability of claim 1, but which was not considered by the examiner during prosecution of the application. Roni prepares an information disclosure statement that complies with the provisions of 37 CFR 1.98, listing the Columbus reference. The finality of the action on June 28, 2000, is withdrawn in an Office action on November 20, 2000, which is after the filing of the request for continued examination. Which of the following actions, if taken by Roni, will properly result in the Columbus reference being considered by the Office during the pendency of the application?',
    options: [
      'Filing the information disclosure statement on November 15, 2000, without any further statement and without the fee set forth in 37 CFR 1.17(p).',
      'Filing the information disclosure statement on December 11, 2000, without any further statement and without the fee set forth in 37 CFR 1.17(p).',
      'Filing the information disclosure statement on December 13, 2000, without any further statement and without the fee set forth in 37 CFR 1.17(p).',
      '(A) or (B) above.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR 1.97(b)(4) (effective Nov. 7, 2000). (A) is correct since November 15, 2000 is "before the mailing of a first Office action after the filing of a request for continued examination under § 1.114." As stated at 65 FR 54630, because filing an RCE is not the filing of an application but merely a continuation of prosecution, § 1.97(b)(4) does NOT provide a three-month window for submitting an IDS after an RCE. Choices (B) and (C) are therefore each incorrect, being subject to the requirements of § 1.97(c). (E) is incorrect since (A) is correct.',
  },
  {
    id: 'uspto-oct01-am-39',
    topicId: 3,
    subtopic: 'Constructive Petition for Extension of Time (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A non-final Office action in a pending patent application was mailed on Friday, March 16, 2001. The patent examiner set a three month shortened statutory period for reply. The applicant petitioned for a one-month extension of time on Monday, June 18, 2001 and paid the appropriate one-month extension fee. An Amendment responsive to the Office action was filed Tuesday, July 17, 2001. In the Remarks portion of the Amendment, the applicant stated: “It is believed that no fees are required by the present Amendment. However, if any fees are necessary, including fees for any required extension of time, the Director of the United States Patent and Trademark Office is hereby authorized to charge any such fees to applicant’s deposit account number nn-nnnn. A duplicate copy of this paper is enclosed.” No fees were submitted with the Amendment. Assuming nn-nnnn is a valid deposit account with sufficient funds deposited, which of the following statements is true?',
    options: [
      'The Amendment should not be entered because it is untimely.',
      'The Amendment should be entered with no fees charged to applicant’s deposit account.',
      'The Amendment should be entered, but the fee for a second month extension of time should be charged to applicant’s deposit account.',
      'The request to charge any required fees, including fees for any necessary extension of time, is ineffective because it was not made in a separate paper.',
      'Statements (A) and (D) are true.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). The petition filed June 18, 2001 gave a one-month extension from the ORIGINAL due date, June 16, 2001 (not from the date the petition was filed), so the extended due date was Monday, July 16 — meaning an additional extension is needed, and (B) is incorrect. Under 37 CFR 1.136(a)(3), applicant’s statement is treated as a constructive petition for extension of time; MPEP § 710.02(e). (A) is therefore incorrect because the Amendment is timely, and (D) is incorrect because the petition need not appear in a separate paper. (E) is incorrect because (A) and (D) are both incorrect.',
  },
  {
    id: 'uspto-oct01-am-40',
    topicId: 2,
    subtopic: 'Only the Inventor May Apply; Payment by a Third Party (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Mike and Alice, who are not related, are shipwrecked on a heretofore uninhabited and undiscovered island in the middle of the Atlantic Ocean. In order to signal for help, Mike invents a signaling device using bamboo shoots. Alice witnesses but does not assist in any way in the development of the invention. The signaling device works and a helicopter comes and rescues Alice. However, Mike remains on the island due to overcrowding on the helicopter. Unfavorable weather conditions have prevented Mike’s rescue to date. Alice comes to you, a registered patent practitioner, to file an application for a patent and offers to pay you in advance. Which of the following is true?',
    options: [
      'Since Mike invented the invention, Alice cannot properly file an application for a patent in her name even though Mike is unavailable.',
      'Since Mike is unavailable, you may properly file an application for a patent without his consent. You can accept the money from Alice as payment for the application.',
      'Since Mike is not available and cannot be reached, Alice may properly sign the declaration on his behalf since she has witnessed the invention and knows how to make and use it.',
      'Alice should file an application in her name since she has witnessed the invention and knows how to make and use it. Subsequently, when Mike becomes available, the inventorship may be changed to the correct inventorship.',
      'Even though Mike and Alice are not related, Alice may properly file an application on Mike’s behalf.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is true since only the inventor may file for a patent. 35 U.S.C. § 101. As to (C) and (E), since Alice is not a joint inventor and does not have sufficient proprietary interest in the invention, she may not file on Mike’s behalf. 35 U.S.C. § 116; 37 CFR 1.47(b). As to (B), you ordinarily may not accept payment from someone other than your client. 37 CFR 10.68(a)(1). As to (D), inventorship cannot be changed when there is deceptive intent. [Historical practice — the AIA now permits an assignee or party with sufficient proprietary interest to file.]',
  },
  {
    id: 'uspto-oct01-am-41',
    topicId: 3,
    subtopic: 'RCE — When Prosecution Is Closed (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] For purposes of determining whether a request for continued examination is in accordance with proper USPTO rules and procedure, in which of the following situations will prosecution be considered closed?',
    options: [
      'The last Office action is a final rejection.',
      'The last Office action is an Office action under Ex parte Quayle.',
      'A notice of allowance has issued following a reply to a first Office action.',
      'The application is under appeal.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR 1.114 (effective August 16, 2000); 65 FR 50092, 50097; MPEP § 706.07(h)(I). (A) is a final action (§ 1.113), and 65 FR 50097 states in pertinent part "…an action that otherwise closes prosecution in the application (e.g., an Office action under Ex Parte Quayle …)." Thus (A), (B), (C) and (D) are individually correct, and (E), being the most inclusive, is the most correct answer.',
  },
  {
    id: 'uspto-oct01-am-42',
    topicId: 1,
    subtopic: 'Dependent Claim That Omits an Element (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] An application as originally filed contains the following Claim 1: Claim 1. A doughnut making machine comprising: (i) an input conveyor that receives dough to be used in making said doughnuts; (ii) means for portioning dough from said input conveyor into a plurality of dough balls, each of said plurality of balls containing dough sufficient to create a single doughnut; (iii) means for forming each of said dough balls into a ring of dough; (iv) a deep fat fryer which receives rings of dough from said forming means and cooks said rings of dough; (v) means for selectively applying a flavored coating on cooked rings of dough to produce doughnuts; and (vi) means for placing a plurality of said doughnuts on a flat sheet. The specification adequately describes the claimed subject matter. Two different “means for selectively applying” are described in the specification: a sprayer and a brush. Which of the following original claims is an improper dependent claim?',
    options: [
      'Claim 2. The doughnut making machine of Claim 1, wherein said placing means is a conveyor that extends from said applying means to said flat sheet.',
      'Claim 3. The doughnut making machine of Claim 1, wherein said forming means includes a cutter that removes a center portion of each of said dough balls to form a ring of dough.',
      'Claim 4. The doughnut making machine of Claim 1, wherein said applying means includes a sprayer which receives a sugar based flavored coating, wherein said sugar based flavored coating is sprayed on said cooked rings of dough.',
      'Claim 5. The doughnut making machine of Claim 1, wherein said applying means is a sprayer.',
      'Claim 6. The doughnut making machine of Claim 1, wherein said applying means is omitted for making plain doughnuts.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). A dependent claim must further limit the claim from which it depends. 35 U.S.C. § 112, ¶ 4; 37 CFR 1.75(c). Dependent claim 6 improperly seeks to BROADEN Claim 1 by omitting an element set forth in the parent claim.',
  },
  {
    id: 'uspto-oct01-am-43',
    topicId: 0,
    subtopic: 'Statutory Bars — Experimental Use and Foreign Sales (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following establishes a statutory bar under 35 U.S.C. § 102 to patentability of Applicant’s claimed invention?',
    options: [
      'To further develop the invention, Applicant’s invention was tested and experimented with in the United States more than one year prior to applicant’s effective U.S. filing date, but the invention at the time was not fit for its intended purpose and important modifications concerning the claimed features resulted from the experimentation. The first actual reduction to practice occurred after the effective U.S. filing date.',
      'Applicant’s invention was sold in a WTO member country outside the United States more than one year prior to applicant’s effective U.S. filing date, and the sale was merely market testing of the invention to determine product acceptance.',
      'Applicant’s invention is rendered obvious by the combination of two U.S. patents, both of which were patented more than one year prior to applicant’s effective filing date.',
      'Applicant’s invention was sold outside the United States in a non-WTO member country, more than one year prior to applicant’s effective U.S. filing date, but the sale was merely an attempt at market penetration.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. (A) is incorrect because it is permitted experimental testing. MPEP §§ 2133.03(e)(3) and (6). (B) and (D) are each incorrect because the sales occurred outside of the United States. 35 U.S.C. § 102(b); MPEP §§ 706.02(c) and 2133.03(d). (C) is incorrect as it provides the basis for a rejection under 35 U.S.C. § 103, but not a statutory bar under § 102(b). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-44',
    topicId: 3,
    subtopic: 'RCE After a Notice of Allowance to Get an IDS Considered (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Registered practitioner Joe duly files a non-provisional utility patent application on May 6, 1999. The USPTO sends Joe a notice of allowance dated November 13, 2000. On November 23, 2000, Joe learns about a publication (“Smith reference”) which he knows to be material to patentability of the claims presented in the application, but which was not considered by the examiner during prosecution of the application. Joe prepares an information disclosure statement that complies with the provisions of 37 CFR 1.98, listing the Smith reference. In accordance with USPTO rules and procedure which of the following actions, if taken by Joe, will result in the examiner considering the Smith reference during prosecution of the application?',
    options: [
      'Prior to Wednesday, February 14, 2001, filing a request for continued examination of the application, the information disclosure statement, and the fee for a request for continued examination, but not paying the issue fee.',
      'Timely paying the issue fee, and thereafter filing a request for continued examination of the application together with the information disclosure statement, and the fee for a request for continued examination, but not submitting a petition under 37 CFR 1.313.',
      'After Tuesday, February 13, 2001, filing a request for continued examination of the application together with the information disclosure statement, and the fee for a request for continued examination, but not paying the issue fee.',
      'Timely paying the issue fee, and after the patent issues filing a request for continued examination of the application, the information disclosure statement, the fee for a request for continued examination, and a petition under 37 CFR 1.313.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR 1.114; MPEP §§ 609(III)(B)(1)(b) and 706.07(h)(II). In (A) the IDS is a submission under § 1.114(c) and the RCE was filed before payment of the issue fee, satisfying § 1.114(a)(1). (B) is incorrect because the RCE followed payment of the issue fee without a granted § 1.313 petition. (C) is incorrect because the application becomes abandoned on February 14, 2001 for failure to pay the issue fee. (D) is incorrect because a § 1.313 petition is ineffective unless received and granted before the date of issue. § 1.313(d). (E) is incorrect because (A) is correct.',
  },
  {
    id: 'uspto-oct01-am-45',
    topicId: 2,
    subtopic: 'Pre-Grant Publication — Redacted Copies and Republication (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'A request for publication of a provisional application on a certain date will be treated as a request for publication as soon as possible.',
      'If an applicant filed an application in a foreign country and the description of the invention in the foreign application is less extensive than the description of the invention in the application filed in the USPTO, the applicant may submit a redacted copy, eliminating the description not contained in the foreign application, for publication within 12 months after the filing date for which a benefit is sought under 35 U.S.C.',
      'Early publication of a reissue application may be honored only if accompanied by a copy of the application in compliance with the Office electronic filing system requirements.',
      'If an applicant filed an application in a foreign country and the description of the invention in the foreign application is more extensive than the description of the invention in the application filed in the USPTO, the applicant may submit a redacted copy, eliminating the description not contained in the foreign application, for publication within 14 months after the filing date for which a benefit is sought under 35 U.S.C.',
      'Re-publication of a patent application is available where the Office makes a material mistake apparent from the records and the request for re-publication is filed within 3 months from the date of the patent application publication.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is correct because 37 CFR 1.217(a) permits such action within 16 months after the filing date for which a benefit is sought under 35 U.S.C. § 119(a), and 12 months is within 16 months. (A) and (C) are wrong because provisional and reissue applications are excepted from the publication provisions of § 1.211(a) by § 1.211(b). (D) is wrong because the redacted-publication provisions do not apply when the foreign application is MORE extensive than the U.S. application. (E) is wrong because § 1.221(b) limits the period for requesting re-publication to 2 months from the date of the patent application publication.',
  },
  {
    id: 'uspto-oct01-am-46',
    topicId: 0,
    subtopic: 'On-Sale Bar Despite Misappropriation (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In early 1999, at the request of MC Motors, Eve demonstrated her automobile heating system at a testing facility in Germany. MC Motors signs a confidentiality agreement and agrees not to disclose the invention to anyone. The test is conducted in a secluded area and the persons involved are sworn to secrecy. Unbeknownst to Eve, MC Motors installs the heating system on its MC cars and begins selling its cars with the heating system in the United States in September 1999. In August 2000, MC files a patent application in the United States for the automobile heating system. In December 2000, Eve files a patent application claiming the automobile heating system. The examiner rejects all the claims in Eve’s application based upon an MC Motors brochure advertising its cars in September 1999. Which of the following is true?',
    options: [
      'MC Motors is entitled to a patent even though it misappropriated the idea for the invention from Eve since the misappropriation was beyond the jurisdiction of the USPTO.',
      'Since the MC Motors misappropriated the invention and since Eve did not authorize the sale, the rejection may be overcome by showing that the sales by MC Motors were not authorized by Eve.',
      'Eve is not entitled to a patent since the invention was on sale in this country more than one year prior to the date of the application for patent in the United States.',
      '(A) and (C).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. In Evans Cooling Systems, Inc. v. General Motors Corp., 125 F.3d 1448, 44 USPQ2d 1037 (Fed. Cir. 1997), the Federal Circuit held that even though an invention is misappropriated by a third party, the public sale bar of 35 U.S.C. § 102(b) applies. Accordingly (C) is true and (B) is not. (A) is incorrect since the people at MC were not the true inventors, so the misappropriation is within the jurisdiction of the USPTO; 35 U.S.C. § 102(f). (D) is incorrect inasmuch as (A) is incorrect. (E) is incorrect inasmuch as (C) is correct. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-am-47',
    topicId: 3,
    subtopic: 'Requirement for Information — 37 CFR 1.105 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Registered practitioner Rick drafted a patent application for inventor Sam. The application was filed in the USPTO on May 15, 2000, with a power of attorney appointing Rick. On March 15, 2001, Sam filed a revocation of the power of attorney to Rick, and a new power of attorney appointing registered practitioner Dave. In a non-final Office action dated September 12, 2001, the examiner included a requirement for information, requiring Dave to submit a copy of any non-patent literature, published application, or patent that was used to draft the application. Which of the following, if timely submitted by Dave in reply to the requirement for information, will be accepted as a complete reply to the requirement for information?',
    options: [
      'A statement by Dave that the information required to be submitted is unknown and is not readily available to Dave.',
      'A statement by Dave that the requirement for information is improper because it was included in a non-final Office action.',
      'A statement by Dave that the requirement for information is improper because Dave is not an individual identified under 37 CFR 1.56(c).',
      'A statement by Dave that the requirement for information is improper because information used to draft a patent application may not be required unless the examiner identifies the existence of a relevant database known by Sam that could be searched for a particular aspect of the invention.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. 37 CFR 1.105(a)(3) — a statement that the information required to be submitted is unknown and not readily available to the party is an accepted complete reply. MPEP § 704.12(b). (B) is incorrect because the requirement may be included in an Office action or sent separately; § 1.105(b). (C) is incorrect because § 1.56(c)(2) includes each attorney or agent who prepares or prosecutes the application. (D) is incorrect because information used to draft an application may be required and there is no support for (D) in § 1.105. (E) is incorrect because (A) is correct.',
  },
  {
    id: 'uspto-oct01-am-48',
    topicId: 3,
    subtopic: 'Insufficient Extension Request Construed as Adequate (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] An Office action was mailed in which a three month shortened statutory period for reply was set. Four and one-half months after the mailing date of the Office action, the applicant submitted a fully responsive Amendment along with a petition and fee for a one-month extension of time. The petition for extension of time included an authorization to charge fees under 37 CFR 1.17 to applicant’s deposit account. The applicant knew at the time the Amendment was filed that a two-month extension of time was required. Unfortunately, however, a clerical error was made that resulted in only a one-month extension of time being requested. Applicant overlooked this error when the amendment was filed. Assuming no further papers by applicant, which of the following statements is true?',
    options: [
      'The Amendment is treated as untimely and the application becomes abandoned. However, applicant may petition to revive the abandoned application on the basis that the abandonment was unavoidable.',
      'The Amendment is treated as untimely and the application becomes abandoned. However, applicant may petition to revive the abandoned application on the basis that the abandonment was unintentional.',
      'Applicant will be notified that the petition for extension of time was insufficient and will be given 30 days from the mailing date of the notification to request an extension of time for a second month.',
      'The petition for a one-month extension of time will be construed as a petition requesting the appropriate period of extension.',
      'Each of statements (A), (B), (C) and (D) is untrue.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). MPEP § 710.02(e) — where an authorization to charge extension fees is present, a petition for an insufficient period is construed as a petition for the appropriate period. (A) and (B) are not true because the amendment is treated as timely. (C) is incorrect because there is no authority for giving 30 days from the notification mailing date to request an extension; 37 CFR 1.136; MPEP § 710.02(a). (E) is untrue because (D) is true.',
  },
  {
    id: 'uspto-oct01-am-49',
    topicId: 2,
    subtopic: 'Publication Based on an EFS Copy as Amended (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Joe files a nonprovisional patent application containing claims 1 through 10 in the USPTO and properly receives a filing date of December 6, 2000. The first Filing Receipt including a confirmation number for the application was mailed on December 20, 2000. On January 30, 2001, the examiner mails Joe a NOTICE indicating that a nucleotide sequence listing in accordance with 37 CFR §§ 1.821-1.825 is required. On February 27, 2001, Joe files the required sequence listing as well as a preliminary amendment adding claims 11 through 13 to the application, along with a copy of the application as amended in compliance with the Office electronic filing system requirements. Assuming the Office has not started the publication process at such time and that Joe’s application is subsequently published pursuant to 35 U.S.C. § 122(b), which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'The published application will contain claims 1 through 10 only because the preliminary amendment adding claims 11 through 13 was not submitted in reply to the NOTICE.',
      'The published application will contain claims 1 through 13 because a copy of the application as amended in compliance with the Office electronic filing system requirements was filed.',
      'The published application will contain claims 1 through 10 only because the copy of the application as amended in compliance with the Office electronic filing system requirements was not filed within one month of the actual filing date of the application.',
      'The published application may contain claims 1 through 13 because the Office may use an untimely filed copy of the application as amended in compliance with the Office electronic filing system requirements where the Office has not started the publication process.',
      'The published application will contain claims 1 through 10 only because publication is based solely on the application papers deposited on the filing date of the application.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is correct and (A), (B), (C) and (E) are wrong. 37 CFR 1.215(c) lets the publication be based on a copy as amended if supplied within one month of the actual filing date, and § 1.215(d) provides that if the Office has not started the publication process it "may use an untimely filed copy of the application supplied by the applicant." The Office notice at 1241 O.G. 97 (Dec. 26, 2000) advised that an EFS copy will be used even if submitted outside the § 1.215(c) period, provided it is submitted within one month of the mailing date of the first Filing Receipt including a confirmation number — which is not satisfied here, so the permissive § 1.215(d) route is the answer. [Historical practice — this EFS publication-copy procedure has since been superseded.]',
  },
  {
    id: 'uspto-oct01-am-50',
    topicId: 5,
    subtopic: 'Admissions as Prior Art and the Limits of Reissue (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Stan, through a registered practitioner, files an application for a patent. During the prosecution of Stan’s patent, in an amendment, the practitioner admitted in his discussion as to “all the claims” of Stan’s application, that “the most pertinent available prior art known to the Applicants and their representatives is the Acme Patent, cited by the examiner.” Within one year after the patent issues, Stan comes to you and wants to file a reissue to broaden his claims, based on the fact that the Acme patent is not prior art. He has ample evidence to show that he conceived and reduced his invention to practice before the filing date of the Acme patent. Which of the following is true?',
    options: [
      'Stan should file a reissue application accompanied by a declaration under 37 CFR 1.131 to swear behind the date of the Acme reference. The statement by the registered practitioner, who formerly represented Stan, that the Acme patent was prior art constituted error without deceptive intent and may be corrected by reissue.',
      'The explicit admission by the registered practitioner, who formerly represented Stan, that the Acme patent constituted prior art is binding on Stan in any later proceeding involving the patent.',
      'Stan should file a request for reexamination and submit the Acme patent along with evidence in the form of affidavits or declarations showing that the Acme patent is not prior art.',
      'Since the Acme patent was cited by the examiner and not by the registered practitioner, who formerly represented Stan, Stan can not be held accountable for the error. Moreover, the statement by the registered practitioner was directed to the pertinence of the prior art and not to the issue of whether the date of the Acme patent could be sworn behind. Accordingly, the statement has no binding effect.',
      '(A) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. Admissions by applicant constitute prior art. 37 CFR 1.104(a)(3). As explained in Tyler Refrigeration v. Kysor Industrial Corp., 777 F.2d 687, 227 USPQ 845 (Fed. Cir. 1985), an attorney’s explicit admission during prosecution that a reference was "the most pertinent available prior art" was binding on the patentee. Since (B) is true, (D) is not. Answers (A), (C) and (D) are also not true, since the Acme patent cannot be sworn behind or otherwise removed as a result of the admission. (E) is not true because (A) and (D) are not true. [Pre-AIA]',
  },
];

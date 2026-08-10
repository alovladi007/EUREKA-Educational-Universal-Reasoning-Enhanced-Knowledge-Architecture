/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, October 18, 2000 — Morning Session, with
 * the USPTO's official Model Answers. Retrieved from the USPTO's published
 * PDFs (edo0010aq.pdf / edo0010aa.pdf, via the Internet Archive copy of
 * uspto.gov). US Government works — public domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the 2003,
 * 2002 and 2001 files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper are preserved).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - Questions 9, 29 and 40 of this session were officially discarded and are
 *    excluded. NOTE: this exam writes the phrase as "All Answers accepted" /
 *    "All Answers Accepted" with a capital A, unlike every earlier exam's
 *    lowercase "All answers accepted" — a case-sensitive search finds nothing
 *    and would silently ingest three questions the USPTO threw out.
 *  - DUAL-KEY ANOMALY: for Q50 the USPTO accepted BOTH (D) and (E) ("ANSWERS:
 *    (D) and (E) … As to (D), it is accepted due to ambiguity contained
 *    therein"). As with Apr 2001 AM Q10 and Apr 2001 PM Q41, this bank stores
 *    a single key, so Q50 is keyed to (D) and the explanation states plainly
 *    that (E) was also accepted.
 *  - ERA NOTE: this exam predates BOTH the AIA and the American Inventors
 *    Protection Act rules — its own cover sheet states it applies "the statute
 *    and rules in place as of November 28, 1999, regardless of any date(s)
 *    appearing in the questions," so it is the most historically distant set
 *    in this bank. Items turning on pre-AIA 35 U.S.C. 102/103 carry [Pre-AIA];
 *    items built on since-superseded procedure (the pre-2003 37 CFR 1.121
 *    amendment format, public use proceedings under 37 CFR 1.292, the pre-2004
 *    Board rules of 37 CFR 1.19x, pre-publication confidentiality under 35
 *    U.S.C. 122) carry [Historical practice]. Verified status: OFFICIAL
 *    (USPTO model answers).
 *
 * Ingested: AM session Q1-Q8, Q10-Q28, Q30-Q39 and Q41-Q50 (47 of 47
 * scoreable).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2000_AM_SOURCE =
  'USPTO Registration Examination, October 18, 2000 — Morning Session (official model answers; public domain)';

export const USPTO_OCT2000_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct00-am-01',
    topicId: 1,
    subtopic: 'Specification Contents — What Is Permitted (Official Oct 2000)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Regarding the specification of a nonprovisional patent application, which of the following practices is in accordance with proper USPTO practice and procedure?',
    options: [
      'The specification may include graphical illustrations or flowcharts.',
      'The specification may include tables and chemical formulas.',
      'The specification may include hyperlinks or other forms of browser-executable code embedded in the text.',
      'The specification must begin with one or more claims.',
      'The specification may include a reservation for a future application of subject matter disclosed but not claimed in the application.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 608.01, "Illustrations In the Specification"; 37 C.F.R. § 1.58(a) permits tables and chemical formulas in the specification in lieu of formal drawings. (A) is incorrect — graphical illustrations, diagrammatic views, flowcharts and diagrams in the descriptive portion do not come within § 1.58(a); the examiner should object and request formal drawings under § 1.81. (C) is incorrect — USPTO policy does not permit linking to commercial sites. (D) is incorrect — § 1.75(a): the specification must CONCLUDE with one or more claims. (E) is incorrect — § 1.79 does not permit a reservation for a future application.',
  },
  {
    id: 'uspto-oct00-am-02',
    topicId: 0,
    subtopic: 'Copying Claims to Provoke an Interference While on Appeal (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] On December 31, 1998, Sam Practitioner files a notice of appeal in a patent application assigned to ABC Corp. after the examiner has rejected all of the claims on prior art. Within two months he sends in his appeal brief and three months after the examiner’s answer is filed the case is sent to the Board of Patent Appeals and Interferences (Board). Subsequently, while reading the Official Gazette Sam notices that a patent issued to XYZ Corp. on October 26, 1999, contains claims which read on an unclaimed embodiment in the ABC application, which is an invention that is not within the scope of the invention claimed in the ABC application. The ABC application was filed one month after the issuance of the XYZ patent. Upon learning of the XYZ patent, ABC Corp. wants to provoke an interference by adding additional claims to its application relating to the previously unclaimed embodiment. It is October 18, 2000 and Sam comes to you for advice. Which of the following is the best and correct course of action?',
    options: [
      'Since the ABC application is at the Board of Patent Appeals and Interferences already, Sam need only request that the case be transferred to the Interference part of the Board where an interference can be declared between the ABC application and the XYZ patent.',
      'Sam should file an amendment adding the claims copied from the XYZ patent and the Board is required to enter the amendment.',
      'Sam should promptly file an amendment containing the claims copied from the XYZ patent and request entry. If the Board declines to enter the amendment, Sam should file a separate, continuation application no later than October 26, 2000, containing the claims copied from the XYZ patent as well as claims previously appealed, and then, to avoid the rendering of a decision of the Board, he should promptly inform the clerk of the Board in writing that they have decided to refile and abandon the application containing an appeal waiting a decision.',
      'Sam should file an amendment containing the claims copied from the XYZ patent and ask that the interference between the ABC application and the XYZ patent be considered while the case is at the Board.',
      'Sam should wait until the appeal is decided before filing an amendment to incorporate claims copied from the XYZ patent and to provoke an interference. There is no benefit to filing new claims since only allowable claims will be considered during an interference.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 135(b) requires the claim to be made within ONE YEAR of the issuance of the XYZ patent — here by October 26, 2000. MPEP § 1211.01: there is no obligation on the Board to consider new or amended claims submitted while the case is on appeal; MPEP § 1210: when an application is refiled the Board should be promptly notified. (E) is incorrect because of the one-year limit. (D) is incorrect because the Board may refuse the amendment and the claims have not been determined allowable. (A) is incorrect — with no claims in the application no interference could be declared. (B) is incorrect — the Board is not required to enter the amendment. [Pre-AIA — interference practice was replaced by derivation proceedings.]',
  },
  {
    id: 'uspto-oct00-am-03',
    topicId: 3,
    subtopic: 'Petition to Make Special — Age and Health (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] You are a registered practitioner and filed a new application on behalf of John. All claims were drawn to a single invention. With the application, you submitted an offer to elect without traverse if the Office deems the application to be drawn to more than one invention, a search made by a foreign patent office, one copy each of the references deemed most closely related to the claimed subject matter, and a detailed discussion of the references pointing out with the particularity required by 37 C.F.R. § 1.111(b) and (c), how the claimed subject matter is patentable over the references. You also submitted a petition to make John’s application special. John was 75 years of age at the time of filing, and in such poor health that his doctor had issued a certificate stating that John is unable to assist in the prosecution of his application. Which of the following, singularly or in combination, submitted with the petition, is not sufficient to result in the petition being granted? I. The fee set forth in 37 C.F.R. § 1.17(i). II. John’s birth certificate showing his date of birth. III. The doctor’s certificate stating that John’s health is such that he is unable to assist in the prosecution of his application.',
    options: ['I', 'II', 'III', 'II and III', 'None of the above.'],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 708.02. Each of I, II and III is by itself sufficient to result in the petition being granted — I under subpart (VIII) (the special-examination route with a search and detailed discussion, which requires the fee), II under subpart (IV) (applicant’s age), and III under subpart (III) (applicant’s health). Therefore (A) through (D) are incorrect.',
  },
  {
    id: 'uspto-oct00-am-04',
    topicId: 3,
    subtopic: 'Amendment Practice Under 37 CFR 1.121 (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Regarding amendments to the specification of an application or the claims in an application, which of the following is not true?',
    options: [
      'If an amendment signed by the applicant is received in an application in which there is a duly appointed registered patent attorney or agent, the amendment should be entered and acted upon.',
      'Where, by amendment under 37 C.F.R. § 1.121(a), a dependent claim is rewritten to be in independent form, the subject matter from the prior independent claim is considered to be “added” matter and should be underlined.',
      'Any amendment using parentheses to indicate canceled matter in a claim rewritten under 37 C.F.R. 1.121(a) may be held nonresponsive.',
      'Amendments to the original patent drawings in a reissue application are not permitted. Any change to the patent drawings must be by way of a new sheet of drawings with the amended figures identified as “amended” and with added figures identified as “new” for each sheet changed.',
      'Amendment to the claims in a nonprovisional application, other than a reissue application may be made by specifying only the exact matter to be added or deleted, and the precise point where the deletion or insertion is to be made, where the change is limited to deletions and/or additions of no more than ten words in any one claim.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Amendment in that manner is limited to deletions or additions of no more than FIVE words, not ten. 37 C.F.R. § 1.121(a)(2)(i)(B) — so the statement is not true and is the answer. (A) is true; MPEP § 714.01(d). (B) is true; MPEP § 714.22. (C) is true; § 1.121(a); MPEP § 714.22. (D) is true; § 1.121(b)(3)(i). [Historical practice — § 1.121 amendment format was substantially revised in 2003.]',
  },
  {
    id: 'uspto-oct00-am-05',
    topicId: 0,
    subtopic: 'Traversing a 102(e) Rejection That Lacks Anticipation (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] You filed a U.S. patent application for Pete, obtaining an effective filing date of January 5, 1999, for a legal slot machine, fully disclosing and claiming only one claim as follows. Claim 1. A slot machine comprising: a cylindrical drum mechanically coupled to a motor; an electronic random data generator electrically coupled to the motor; and a push button coupled to the random data generator. You received a non-final Office action dated September 20, 1999. The examiner rejected claim 1 under 35 U.S.C. 102(e) as anticipated by a U.S. patent dated May 4, 1999 to Bud. The examiner stated and pointed out that the Bud patent, filed January 7, 1998, disclosed a slot machine with a cylindrical drum mechanically coupled to a motor; a mechanically spinning random data generator electrically coupled to the motor; and a push button coupled to the random data generator. The examiner further stated, “The examiner takes official notice that it was well known by those of ordinary skill in the art of slot machines, prior to applicant’s invention, to use interchangeably either a mechanically spinning, or an electronic random data generator.” The examiner did not provide any references to support the official notice. Which of the following timely filed replies to the Office action (compared to each other) is best?',
    options: [
      'Traverse the rejection arguing that the examiner’s use of official notice was improper because the examiner did not provide any references to support the official notice.',
      'Traverse the rejection arguing that Bud’s invention was patented after Pete’s effective filing date.',
      'Amend Pete’s claim to further include a flat screen video monitor display and point out that the newly added feature distinguishes Pete’s invention over Bud.',
      'Traverse the rejection arguing that the examiner did not create a prima facie case of obviousness because the examiner did not show why one of ordinary skill in the art of slot machines would be motivated to modify the patent to Bud.',
      'Traverse the rejection arguing that the examiner’s rejection under 35 U.S.C. § 102(e) was improper because Pete’s claim is not anticipated by the patent to Bud.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 706.02 distinguishes rejections under §§ 102 and 103: for anticipation the reference must teach every aspect of the claimed invention explicitly or impliedly — and Bud discloses a MECHANICALLY SPINNING generator, not the claimed electronic one. (A) is further incorrect — it is proper to take official notice without citing a reference until the practitioner seasonably challenges it. MPEP § 2144.03. (B) is further incorrect — a § 102(e) reference can properly have a patent date after the application’s filing date. (C) is further incorrect — no amendment is necessary. (D) is further incorrect — a prima facie case of obviousness is not necessary in a § 102 rejection. [Pre-AIA]',
  },
  {
    id: 'uspto-oct00-am-06',
    topicId: 1,
    subtopic: 'What Applicant "Regards As" the Invention — 112 Second Paragraph (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Evidence that a claim may not comply with the second paragraph of 35 U.S.C. § 112 occurs in accordance with proper USPTO practice and procedure where:',
    options: [
      'Remarks filed by applicant in a reply or brief regarding the scope of the invention differ and do not correspond in scope with the claim.',
      'There is a lack of agreement between the language in the claims and the language set forth in the specification.',
      'The scope of the claimed subject matter is narrowed during pendency of the application by deleting the originally much broader claims, and presenting claims to only the preferred embodiment within the originally much broader claims.',
      'Claims in a continuation application are directed to originally disclosed subject matter (in the parent and continuation applications) which applicants did not regard as part of their invention when the parent application was filed.',
      'All of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). Per MPEP § 2172, part II, evidence that a claim does not correspond in scope with what applicant regards as the invention may be found in contentions or admissions in briefs or remarks filed by applicant. In re Prater, 415 F.2d 1393 (CCPA 1969). (B) is incorrect — agreement between claims and specification is properly considered only under § 112, FIRST paragraph. In re Ehrreich, 590 F.2d 902 (CCPA 1979). (C) is incorrect — § 112 second paragraph does not prohibit applicants from changing what they regard as their invention during pendency. In re Saunders, 444 F.2d 599 (CCPA 1971). (D) is incorrect. In re Brower, 433 F.2d 813 (CCPA 1970). (E) is incorrect because (B), (C) and (D) are.',
  },
  {
    id: 'uspto-oct00-am-07',
    topicId: 1,
    subtopic: 'Color Photographs as Drawings — Petition Required (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] You have agreed to represent an independent inventor in connection with a patent application filed pro se. As filed, the application lacks an abstract of the disclosure, but included a detailed written description that contained numerous errors; when viewed together with four accompanying color photographs, the disclosure was adequate to enable one of ordinary skill to make and use the invention. The application also included three independent claims, an inventor’s declaration under 37 C.F.R. § 1.63, a small entity statement under § 1.27, and all necessary small entity filing fees. MEGACORP, a very large multi-national corporation, licensed rights in the invention shortly after the application was filed. The inventor has asked you to suggest steps to help expedite prosecution and to remove any formal objections, without incurring unnecessary government fees. You determine that the first color photograph is the only practical medium by which to disclose certain aspects of the claimed invention, but that the substance of the remaining photographs could readily be illustrated through ordinary ink drawings. Which of the following represents the most reasonable advice to the independent inventor?',
    options: [
      'Prepare a preliminary amendment to correct errors in the detailed description, add an abstract of the disclosure, revise the existing claims and present additional dependent claims to more fully protect the invention; submit a request for approval of drawing changes wherein the first photograph is labeled “Figure 1” and the remaining photographs are cancelled in favor of corresponding ink drawings labeled Figures 2 through 4; and immediately withdraw the claim for small entity status because of the license to MEGACORP.',
      'Prepare a preliminary amendment to correct errors in the detailed description, add an abstract of the disclosure, revise the existing claims and present additional dependent claims to more fully protect the invention; submit a request for approval of drawing changes wherein the first photograph is labeled “Figure 1” and the remaining photographs are cancelled in favor of corresponding ink drawings labeled Figures 2 through 4; and submit a petition for acceptance of Figure 1 in the form of a color photograph along with a proposed amendment to insert language concerning the color photograph as the first paragraph of the specification and the required petition fee.',
      'Prepare a preliminary amendment to correct errors in the detailed description and to present additional dependent claims to more fully protect the invention; and submit a request for approval of drawing changes wherein the first photograph is labeled “Figure 1” and the remaining photographs are cancelled in favor of corresponding ink drawings labeled Figures 2 through 4.',
      'Prepare a preliminary amendment to correct errors in the detailed description and to present additional claims that more fully protect the invention; and immediately withdraw the claim for small entity status because of the license to MEGACORP and submit to the USPTO the difference between the small entity filing fee and the large entity filing fee.',
      'Completely rewrite the written description and claims as part of a new application and file it as a continuation application, including a color photograph as Figure 1, ink drawings as Figures 2-4, a new inventor’s declaration and a small entity filing fee.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). 37 C.F.R. § 1.84(a)(2); MPEP § 608.02, "Color Drawings or Color Photographs." (A) is wrong because a petition under § 1.84 is required to avoid an objection to the color photographs, and because small entity status properly established at filing may be maintained until the issue fee is due (§ 1.28(b)). (C)-(E) are wrong because they do not provide for the required § 1.84 petition. In (D), the change in status after filing does not require retroactive payment of a large entity fee. (E) is further wrong because a continuation would require a large entity filing fee and so does not avoid unnecessary government fees.',
  },
  {
    id: 'uspto-oct00-am-08',
    topicId: 5,
    subtopic: 'Reissue Fundamentals — Marking, New Matter, Broadening (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following is true?',
    options: [
      'If after the filing of a reissue application no errors in the original patent are found, a reissue patent will be granted on the reissue application noting no change, and the original patent will be returned to the applicant.',
      'In order to add matter not previously found in the patent, a continuation-in-part reissue application must be filed.',
      'In a reissue application, additions and deletions to the original patent should be made by underlining and bracketing, respectively, except for changes made in prior Certificates of Correction and disclaimer(s) of claims under 37 C.F.R. §1.321(a).',
      'A dependent claim may be broadened in a reissue application only in the first two years of the enforceable life of the patent.',
      '(A), (B), and (C).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is correct. See MPEP § 1411.01 — additions and deletions are shown by underlining and bracketing, with the stated exceptions. As to (A), see MPEP § 1402 — a reissue patent is not granted where no error is found. As to (B), new matter may NOT be entered in a reissue at all, so no CIP reissue can add it. As to (D), see MPEP § 1412.03. Since (A) and (B) are incorrect, (E) is incorrect.',
  },
  {
    id: 'uspto-oct00-am-10',
    topicId: 1,
    subtopic: 'Antecedent Basis and Indefiniteness (Official Oct 2000)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Independent claim 1, fully supported by the specification in a patent application states: Claim 1. An apparatus comprising: a plastic valve; a copper pipe connected to the plastic valve; and an aluminum pipe connected to the plastic valve. Which of the following claims, presented in the application, provide the basis for a proper rejection under 35 U.S.C. § 112, second paragraph? Claim 2. The apparatus of claim 1, wherein said pipe is statically charged. Claim 3. The apparatus of claim 1, wherein the outer surface of said copper pipe is statically charged. Claim 4. The apparatus of claim 1, further comprising a thermostat connected to said plastic valve.',
    options: ['Claim 2.', 'Claim 3.', 'Claim 4.', 'Claims 2 and 3.', 'Claims 3 and 4.'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer. MPEP § 2173.05(e). Claim 2 is indefinite because "said pipe" lacks antecedent basis — claim 1 recites both a copper pipe and an aluminum pipe. Claim 3 is definite, as "the outer surface" is an inherent part of the pipe and would not require antecedent recitation — so (B), (D) and (E) are incorrect. Claim 4 is definite because there is antecedent basis for "said plastic valve" — so (C) is incorrect.',
  },
  {
    id: 'uspto-oct00-am-11',
    topicId: 3,
    subtopic: 'Insufficient Extension Request Construed as Adequate (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] An Office action issued with a three month shortened statutory period for reply. Four and one-half months after the mailing date of the Office action, the applicant submitted a fully responsive amendment along with a petition and fee for a one-month extension of time. The petition for extension of time included an authorization to charge fees under 37 C.F.R. § 1.17 to applicant’s deposit account. The applicant knew at the time the amendment was filed that a two-month extension of time was required. Unfortunately, however, a clerical error was made that resulted in only a one-month extension of time being requested. Applicant overlooked this error when the amendment was filed. Assuming no further papers by applicant, which of the following statements is true?',
    options: [
      'The amendment is treated as untimely and the application becomes abandoned. However, applicant may petition to revive the abandoned application on the basis that the abandonment was unavoidable.',
      'The amendment is treated as untimely and the application becomes abandoned. However, applicant may petition to revive the abandoned application on the basis that the abandonment was unintentional.',
      'The petition for a one-month extension of time will be construed as a petition requesting the appropriate period of extension, and the appropriate fee will be charged to the deposit account.',
      'Applicant will be notified that the petition for extension of time was insufficient and will be given 30 days from the mailing date of the notification to request an extension of time for a second month.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. § 1.136; MPEP § 710.02(e) — where an authorization to charge extension fees is present, a petition for an insufficient period is construed as a petition for the appropriate period and the correct fee is charged. (A) and (B) are not true because the amendment is treated as timely. There is no authority for (D). (E) is untrue because (C) is true.',
  },
  {
    id: 'uspto-oct00-am-12',
    topicId: 7,
    subtopic: 'Power of Attorney and Authorization of Agent (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Regarding a power of attorney or authorization of agent in a patent application, which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'All notices and official letters for the patent owner or owners in a reexamination proceeding will be directed to the attorney or agent of record in the patent file at the address listed on the register of patent attorneys and agents.',
      'Powers of attorney to firms submitted in applications filed in the year 2000 are recognized by the United States Patent and Trademark Office',
      'The associate attorney may appoint another attorney.',
      'The filing and recording of an assignment will operate as a revocation of a power or authorization previously given.',
      'Revocation of the power of the principal attorney or agent does not revoke powers granted by him or her to other attorneys or agents.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 1.33(c). (B) is incorrect — powers of attorney to firms filed in executed applications filed after July 2, 1971 are not recognized, though the firm’s address will be treated as the correspondence address. MPEP § 403. (C) is incorrect — the associate attorney may not appoint another attorney. MPEP §§ 402.02, 406. (D) is incorrect — an assignment will not itself operate as a revocation. § 1.36. (E) is incorrect — revoking the principal attorney’s power DOES revoke powers he or she granted to others. MPEP § 402.05.',
  },
  {
    id: 'uspto-oct00-am-13',
    topicId: 5,
    subtopic: 'Converting a Narrowing Reissue to a Broadening One (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] A United States patent issued to inventor Smith on January 6, 1998. The Smith patent had a total of nine claims, with claim 1 being the only independent claim. Smith subsequently became aware of prior art that was not before the examiner that likely invalidated claim 1. Accordingly, Smith properly filed a narrowing reissue application on September 30, 1999 along with a reissue oath stating that he believed the original patent to be wholly or partly invalid by reason of the patentee claiming more than he had the right to claim. As filed, the reissue application sought to narrow the first limitation of claim 1; claims 2 through 9 were rewritten in independent form. On March 17, 2000, Smith submitted an amendment that added new claims 10-19, with claims 10 and 16 in independent form. Each of claims 10-15 was narrower than original claim 1 in certain aspects, but broader than original claim 1 in other aspects. Each of claims 16-19 was narrower than claim 1 in all aspects, and was fully supported by the original reissue oath. Smith also submitted a supplemental reissue oath stating that he believed the original patent to be wholly or partly inoperative by reason of the patentee claiming less than he had the right to claim. Which of the following best describes a likely action by the examiner in response to the amendment?',
    options: [
      'Each of claims 10-19 is rejected as being improper since the claims were added after the two-year anniversary of the original patent issuance.',
      'Each of claims 10-19 is examined on the merits.',
      'Claims 10-15 are rejected as being improper because they improperly seek to broaden the invention claimed in the original patent, and need not be further examined on their merits, but claims 16-19 are examined on the merits.',
      'Claims 16-19 are examined on the merits, and claims 10-15 are examined on the merits if there is no prosecution history estoppel during the original prosecution relating to the broadened aspects of the claims.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). An effort to convert a narrowing reissue application to a BROADENING reissue application more than two years after issuance of the original patent is ineffective, and a claim broader than the original claims IN ANY ASPECT is a broadened claim for reissue purposes. Claims 10-15 are therefore improper regardless of any prosecution history estoppel, making (B) and (D) incorrect. (A) is incorrect because claims 16-19 are narrower in all aspects and fully supported by the original reissue oath. (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct00-am-14',
    topicId: 3,
    subtopic: 'Amendments After Final Rejection — 37 CFR 1.116 (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Jack, a registered patent agent, received a final rejection of all of the claims in an application directed to an article of manufacture. Jack is about to file a timely Notice of Appeal to the Board of Patent Appeals and Interferences. Before filing his notice of appeal, Jack would like to tie up some loose ends by amendment. Which of the following reply (replies) may he file without triggering the requirements of 37 C.F.R. § 1.116(b)?',
    options: [
      'A reply that presents his argument in a more defensible light and adds additional claims.',
      'A reply amending the claims into process claims.',
      'A reply amending all of the independent claims, accompanied by a declaration from the inventor.',
      'A reply complying with a requirement of form expressly set forth in the previous Office action.',
      '(A) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.116; MPEP § 714.13 ("Entry Not Matter of Right"). The reply in (D) is one permitted to be made under § 1.116(a) — complying with a requirement of form expressly set forth in the previous Office action. (A), (B) and (C) are each directed to the MERITS of the application and are not in accord with § 1.116(a).',
  },
  {
    id: 'uspto-oct00-am-15',
    topicId: 1,
    subtopic: 'Incorporation by Reference — Essential Material (Official Oct 2000)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following would not be permitted to be incorporated by reference in your client’s U.S. utility patent application?',
    options: [
      'Essential material from a U.S. patent.',
      'Essential material from a foreign application.',
      'Non-essential material from a prior filed, commonly owned U.S. application.',
      'Essential material from a magazine article.',
      '(B) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Both (B) and (D) cannot be incorporated by reference into a U.S. utility application — essential material may be incorporated only by reference to a U.S. patent or a pending U.S. application, not to a foreign application or a non-patent publication such as a magazine article. MPEP § 608.01(p).',
  },
  {
    id: 'uspto-oct00-am-16',
    topicId: 0,
    subtopic: 'Canceled Matter and Abandoned Applications as Prior Art (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following statements regarding a proper prior art reference is true?',
    options: [
      'Canceled matter in the application file of a U.S. patent is a prior art reference as of the filing date under 35 U.S.C. 102(e).',
      'Where a patent refers to and relies on the disclosure of a copending subsequently abandoned application, such disclosure is not available as a reference.',
      'Where the reference patent claims the benefit of an earlier filed, copending but subsequently abandoned application which discloses subject matter in common with the patent, and the abandoned application has an enabling disclosure for the common subject matter and the claimed matter in the reference patent, the effective date of the reference patent as to the common subject matter is the filing date of the reference patent.',
      'Matter canceled from the application file wrapper of a U.S. patent may be used as prior art as of the patent date.',
      'All foreign patents are available as prior art as of the date they are translated into English.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 102(a); MPEP § 901.01 — "matter canceled from the application file wrapper of a U.S. patent may be used as prior art as of the patent date in that it then constitutes prior public knowledge under 35 U.S.C. 102(a)." In re Lund, 376 F.2d 982 (CCPA 1967). (A) is incorrect — canceled matter is NOT a proper reference as of the filing date under § 102(e). Ex parte Stalego, 154 USPQ 52. (B) is incorrect — such disclosure IS available as a reference. In re Heritage, 182 F.2d 639 (CCPA 1950). (C) is incorrect — the effective date is the filing date of the ABANDONED application. (E) is incorrect — a foreign patent should not be cited until its date of patenting or publication is confirmed. MPEP § 901.05. [Pre-AIA]',
  },
  {
    id: 'uspto-oct00-am-17',
    topicId: 5,
    subtopic: 'The Recapture Rule Bars Broadening Reissue (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In June 1997, Rene invents a circuit board device which automatically logs a computer onto the Internet without the need for entering passwords. During prosecution the practitioner files claims 1 (an electronic device for automatically logging onto the Internet comprising communication means, circuit means for automatically entering a password, and storage means for automatically storing a password) and 2 (the device of claim 1 wherein the communication means is a desktop computer). The examiner cites as prior art a telephone with a memory which automatically dials a telephone number, reasoning that it would have been obvious to store a password in the memory as well, and objects to claim 2 as dependent upon a rejected claim. Being very eager to get patent protection and low on financial resources, Rene instructs the practitioner to combine claims one and two and allow the application to issue. One year and one day after issuance, Rene comes to you inquiring if her patent reads on a widely distributed, hand-held, pocket sized, portable device that is not a telephone and does not use a desktop computer, and if not, what corrective action is available. Which of the following choices is the best advice for Rene?',
    options: [
      'Since the two-year period for broadening has not expired, Rene may file a reissue with a declaration stating that the failure to claim more was due to error without deceptive intent. Rene may broaden her claims to the extent permitted by the prior art, since at no time did she narrow her claims to avoid the prior art.',
      'Since the prior art device was a telephone, Rene is entitled to seek patent protection on all that which is not in the prior art. Rene should be able to obtain broadened patent protection by reissue of the patent.',
      'Since Rene’s original claim 1 was broadly written and since Rene narrowed her scope of patent protection by incorporating the limitations of the original claim 2 during the original prosecution, she is barred by the doctrine of recapture from enlarging her claims to the scope of the original claim 1.',
      'Although Rene narrowed her claims during the original prosecution, she can file a declaration stating that the narrowing of her claims was not because she believed the prior art precluded her from claiming more but due to financial concerns. Therefore, the narrowing of the claim was error without deceptive intent and Rene may file a reissue seeking broader claims.',
      'Rene should file a request for reexamination seeking to enlarge the scope of her patent protection.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Rene is barred by the recapture rule. MPEP § 1412.02 — she responded to a rejection by amending her claims, similar to Example B in that section. As to (A) and (B), recapture is the determinative factor regardless of the two-year window. As to (D), the issue of financial concerns is of no import. As to (E), independent claims may not be broadened during a reexamination.',
  },
  {
    id: 'uspto-oct00-am-18',
    topicId: 3,
    subtopic: 'Suspension of Action Requires No Outstanding Reply (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] You are handling prosecution of an application assigned to ManCo. In discussing a reply to a first, non-final Office action with the sole named inventor (I. M. Putin) on August 11, 2000, you uncover evidence that suggests an individual employed by your client may have intentionally concealed the identity of a possible joint inventor (Phil Leftout). You decide it is necessary to further investigate the identity of the proper inventive entity, which would take at least three months and perhaps longer. The outstanding Office action issued 5½ months ago with a 3-month shortened statutory period for reply. The examiner has raised only minor matters of form, and you are confident the application would be in condition for allowance after you submit a reply. ManCo informs you they want the matter straightened out before any patent issues. How do you best advise ManCo?',
    options: [
      'Recommend promptly filing a Request for Stay of Prosecution until you can complete your investigation, and upon completion of the investigation filing an appropriate reply to the outstanding Office action along with a petition and associated fees for a three month extension of time.',
      'Recommend promptly filing a petition and associated fees for a three month extension of time along with a Request for Stay of Prosecution until you can complete your investigation, and upon completion of the investigation filing an appropriate reply to the outstanding Office action.',
      'Recommend proceeding with prosecution by promptly filing an appropriate reply to the outstanding Office action along with a petition and associated fees for a three month extension of time; and allowing the patent to issue in Putin’s name alone with the understanding that, if the investigation shows the possible joint inventor should have been named, correcting the inventorship after issuance of the patent in accordance with 37 C.F.R. § 1.48.',
      'Recommend promptly filing an appropriate reply to the outstanding Office action along with a petition and fees for a three-month extension of time and concurrently submitting a petition and associated fees for suspension of action for a reasonable time until you can complete your investigation.',
      'Recommend promptly filing a petition and associated fees for suspension of action for a reasonable time until you can complete your investigation.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (D). (A), (B) and (E) are each wrong at least because action cannot be suspended in an application that contains an OUTSTANDING Office action awaiting reply — 37 C.F.R. § 1.103; MPEP § 709 — and following them would likely lead to abandonment. (C) is wrong at least because inventorship in an ISSUED patent is corrected through § 1.324, not § 1.48; it is also contrary to ManCo’s instruction that the matter be resolved before issuance, and may raise questions about the duty of candor.',
  },
  {
    id: 'uspto-oct00-am-19',
    topicId: 2,
    subtopic: 'Correcting Inventorship — 37 CFR 1.48 or a Continuation (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Further assume that the application is awaiting action by the Office at the time you complete your investigation. The investigation revealed that Leftout should indeed have been named as a joint inventor and that the error resulted from Putin’s assistant purposely omitting Leftout from an invention disclosure form to avoid increasing the value of Leftout’s severance package. Although the application was originally filed with an inventor’s Declaration and an Assignment to ManCo signed by Putin as a sole inventor, Putin did not realize at the time that he was not the sole inventor. Leftout was unaware that the application had even been prepared and filed. Thus, neither Putin nor Leftout were aware that an error had been made in the named inventive entity. There was never any deceptive intent by either Putin or Leftout concerning the error. How do you correct the named inventive entity?',
    options: [
      'Promptly file a replacement declaration executed jointly by Putin and Leftout along with a cover letter explaining that Leftout was inadvertently omitted as an inventor.',
      'Because Putin’s assistant purposely omitted Leftout’s name, the mistake in the named inventive entity was not an error without deceptive intention and the mistake cannot be corrected.',
      'Simply file a continuation application naming Leftout and Putin as inventors and submit any necessary filing fee.',
      'Amend the application to name Leftout and Putin as joint inventors and, along with the amendment, submit a petition including a statement from Leftout that the error in inventorship occurred without deceptive intention on his part, a declaration executed by both Putin and Leftout, and all necessary fees.',
      '(C) and (D) are each an appropriate way to correct the named inventive entity.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Correction of inventorship may be made under 37 C.F.R. § 1.48 or by filing a continuation application. MPEP § 201.03. Since the original application was filed WITH an inventor’s declaration, correction cannot be made merely by submitting a corrected declaration — so (A) is incorrect. (B) is incorrect because there was no deceptive intention on the part of the OMITTED inventor, Leftout. (D) is incorrect on these facts because it omits the written consent of the assignee ManCo required under § 1.48(a)(4). (E) is incorrect because (D) is incorrect.',
  },
  {
    id: 'uspto-oct00-am-20',
    topicId: 4,
    subtopic: 'Foreign Priority Must Be Claimed Again in a Reissue (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Assume a “claim” for the benefit of an earlier filing date in a foreign country under 35 U.S.C. § 119(a)-(d) was made and a certified copy of the foreign application was filed in a corresponding U.S. application on which the original U.S. patent was granted, and the benefit of priority is desired in a reissue patent application. Which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'It is unnecessary to make such claim in the reissue application.',
      'It is unnecessary to make such claim in the reissue application provided a certified copy of the foreign application is provided in the reissue application.',
      'It is unnecessary to make such claim in a reissue application provided the oath or declaration identifies the foreign application and its filing date.',
      'It is necessary to make such claim in the reissue application, and in addition, the oath or declaration must identify the foreign application on which priority is claimed, and any foreign applications having a filing date before that of the application on which priority is claimed.',
      'It is necessary to make such claim in the reissue application, and in addition, a certified copy of the foreign application must be provided in the reissue application.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because the statement complies with 35 U.S.C. §§ 119(a)-(d) and 251; 37 C.F.R. §§ 1.55 and 1.63; MPEP § 1417 — the priority claim must be made anew in the reissue, and the oath or declaration must identify the foreign application relied on and any earlier-filed foreign applications for the same subject matter. (A), (B), (C) and (E) are wrong because their statements do not comply with MPEP § 1417.',
  },
  {
    id: 'uspto-oct00-am-21',
    topicId: 2,
    subtopic: 'Conditional Assignments Are Treated as Absolute (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Joe and Jim, local businessmen, conceived the idea of an improved fishing pole and filed a patent application. Both men are widowers, Joe with a grown son, and Jim with a grown daughter. Joe and Jim decide to assign their patent application to their children as a wedding present, and execute a document properly assigning their patent application to their children effective on the date of their marriage, mailing it to the USPTO with a cover letter requesting that the document be recorded. Shortly after the document is recorded, Joe’s son meets another woman, and breaks off his engagement to Jim’s daughter. In light of this scenario, which of the following statements is true?',
    options: [
      'Since the assignment was conditioned on the marriage of the children, and the condition was not fulfilled, the USPTO will regard the assignment as without effect for Office purposes.',
      'Since the assignment was recorded, the USPTO will require the parties to certify that the marriage condition was fulfilled before the assignment will be effective for Office purposes.',
      'Since the assignment was recorded, the USPTO will not determine whether the marriage condition was fulfilled and will regard the assignment as absolute.',
      'Since the USPTO does not record conditional assignments, the recording of the assignment document will be regarded as inadvertent, and without effect for Office purposes.',
      'Since the assignment was recorded, the USPTO will regard it as a determination of the validity of the document and the effect that the document has on the title to the patent application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. § 3.56 recites: "Assignments which are made conditional … are regarded as absolute assignments for Office purposes… . The Office does not determine whether such conditions have been fulfilled." MPEP § 317.03. (A), (B), (D) and (E) are false. As to (B), the Office "will treat the submission of such an assignment for recordation as signifying that the act or event has occurred." As to (E), recording "is not a determination by the Office of the validity of the document or the effect that document has on the title."',
  },
  {
    id: 'uspto-oct00-am-22',
    topicId: 3,
    subtopic: 'Examiner Participation in Oral Argument (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following is true?',
    options: [
      'When the subject matter of an appeal is particularly difficult to understand, a patentability report is prepared by an examiner in order to present the technical background of the case to the Board of Appeals and Patent Interferences.',
      'In those appeals in which an oral hearing has been confirmed and either the Board of Appeals and Patent Interferences or the primary examiner has indicated a desire for the examiner to participate in the oral argument, oral argument may be presented by the examiner whether or not the appellant appears.',
      'If a patent applicant files a notice of appeal which is unsigned, it will be returned for signature, but the applicant will still receive the filing date of the unsigned notice of appeal.',
      'Statements made in information disclosure statements are not binding on an applicant once the patent has issued since the sole purpose of the statement is to satisfy the duty of disclosure before the Office.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). See MPEP § 1209, "Participation by Examiner." As to (A), see MPEP § 705 — a patentability report serves a different purpose. As to (C), the signature requirement does not apply in the way stated and the notice will not be returned; 37 C.F.R. § 1.196(b); MPEP § 1205. As to (D), statements in an IDS can be binding — see Gentry Gallery v. Berkline Corp., 134 F.3d 1473 (Fed. Cir. 1998). [Historical practice — Board appeal rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct00-am-23',
    topicId: 4,
    subtopic: 'PCT Request — A Missing Applicant Signature (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Mitch and Mac are named inventors on an international application that is filed in the USPTO Receiving Office, and designates the United States of America. Mac now indicates that he will not sign the Request for the international application. Mitch wishes to proceed with the Request and seeks the advice of their patent agent. Which of the following answers accords with the provisions of the Patent Cooperation Treaty?',
    options: [
      'Mitch’s agent should sign the Request and accompany it with a statement indicating why it is believed that Mac refuses to proceed with the Request.',
      'Mitch should sign the request for himself and also sign on behalf of Mac.',
      'Mitch should sign the request and seek a court order to obtain Mac’s signature.',
      'Mitch should sign the Request and accompany it with a statement providing a satisfactory explanation for the lack of Mac’s signature.',
      'Mitch should sign the Request and Mitch’s agent should sign on behalf of Mac, since he continues to represent Mac.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because the advice is consistent with 37 C.F.R. § 1.425 — where an applicant’s signature is missing, the Request may proceed if accompanied by a statement giving a satisfactory explanation for the omission. (A), (B), (C) and (E) are wrong because the advice provided is not consistent with § 1.425. MPEP § 1820.',
  },
  {
    id: 'uspto-oct00-am-24',
    topicId: 3,
    subtopic: 'Petitions to Make Special — Who Must Make the Statement (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following actions accords with proper USPTO practice and procedure?',
    options: [
      'Filing a petition to make special on the ground of applicant’s health accompanied by a doctor’s certificate showing that the state of health of the applicant is such that he might not be available to assist in the prosecution of the application if it were to run its normal course, unaccompanied by a petition fee.',
      'Filing a petition to make special on the ground of prospective manufacture by applicant’s business competitor accompanied by the required petition fee and a statement by applicant alleging the possession by the competitor of sufficient available capital (stating an approximate amount) and facilities (stating the nature) to manufacture the invention in quantity, that the business competitor is manufacturing the invention in the United States, and that the competitor has a good knowledge of the pertinent prior art, on information and belief.',
      'Filing a petition to make special on the ground of prospective infringement accompanied by the required fee and a statement by the applicant alleging that an infringing device is about to be put on the market, that a rigid comparison of the alleged infringing device with the claims of the application has been made, and that in applicant’s opinion, some of the claims are unquestionably infringed, and that applicant has made a careful and thorough search of the prior art.',
      'Filing a petition to make special on the ground of environmental quality accompanied by a statement from a Professor of Environmental Engineering at a leading university explaining how the invention contributes to the restoration of lakes and streams, but unaccompanied by a petition fee.',
      'Filing a petition to make special on the ground of inventions relating to recombinant DNA accompanied by a statement from a Professor of Genetics at a leading university explaining the relationship of the invention to safety of research in the field of recombinant DNA research, and accompanied by the required fee.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the correct answer because it satisfies MPEP § 708.02, part (III) — a health-based petition needs the doctor’s certificate and no fee. (B) is wrong because part (I) calls for a statement by the applicant, assignee or a registered attorney/agent, and applicant’s business competitor does not qualify as a prospective manufacturer. (C) is wrong because part (II) applies to "actual infringement" and expressly excludes "prospective infringement." (D) and (E) are wrong because parts (V) and (VII) call for a statement by the applicant, assignee or registered practitioner — a Professor does not qualify.',
  },
  {
    id: 'uspto-oct00-am-25',
    topicId: 0,
    subtopic: 'Derivation Under 35 U.S.C. 102(f) (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In June 1997, Jack and Jill, a married couple, are vacationing in Vietnam (not a WTO country) when they encounter a man selling bamboo knives for cleaning fish. Jill takes a picture of Jack with the knife cleaning the fish. Subsequently, in November 1997, when Jack returns to the United States he begins to make and sell a identical knife to the one seen in Vietnam. In July 1998, he files a patent application claiming the nearly identical knife. Jack discloses no prior art during the prosecution of his application and fails to mention the knife he saw in Vietnam. The examiner finds no prior art similar to the claimed knife, and Jack is awarded a patent in December 1999. Meanwhile, Jill divorces Jack, and associates with Sam. To raise cash, Sam and Jill begin selling a knife identical to the one Jack produces, only made out of plastic. Jack sues for infringement. Jill and Sam come to you for advice. Which of the following is not true?',
    options: [
      'Jack had a duty under 37 C.F.R. §1.56 to disclose his discovery of the bamboo knife in Vietnam to the examiner during the original patent prosecution.',
      'Jack is entitled to patent protection since Vietnam is not a WTO country and evidence of the Vietnamese knife cannot be used against him to reject his patent claims.',
      'Since the use in Vietnam was not in this country, it does not constitute a public use bar under 35 U.S.C. § 102(b).',
      'If Jill’s attorney files a request for reexamination, it will be denied because the picture is not a patent or printed publication.',
      'Although Jack marketed the invention before obtaining a patent, the patent claims cannot be invalidated under 35 U.S.C. § 102(a) since Jack’s making and selling of the knife cannot be used against him under 35 U.S.C. § 102(a).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Answer (B) is NOT true since Jack was not the first to invent the knife and so is not entitled to a patent. Jack derived the invention from another, and the picture of Jack with the Vietnamese knife is evidence of derivation. 35 U.S.C. § 102(f); MPEP § 2137. (A) is correct — Jack should have disclosed all information material to patentability. (C) is correct — to qualify under § 102(b) the use must be in this country. (D) is correct — reexamination must be based on patents and printed publications. (E) is correct — public use derived from the inventor’s own work cannot be used against the inventor under § 102(a). MPEP § 2132. [Pre-AIA]',
  },
  {
    id: 'uspto-oct00-am-26',
    topicId: 5,
    subtopic: 'Reissue — Foreign Priority, New Matter and Recapture (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In a reissue patent application, which of the following statements is correct?',
    options: [
      'It is unnecessary to claim the benefit of an earlier filing date in a foreign country in order to gain the benefits of 35 U.S.C. § 119(a) - (d) so long as such a claim was made in the application on which the original patent was granted.',
      'New matter, that is, matter not present in the patent sought to be reissued, may be included in a reissue application in accordance with 35 U.S.C. § 251.',
      'No additional certified copy of the foreign application is necessary if a claim for the benefit of an earlier filing date in a foreign country under 35 U.S.C. § 119(a) - (d) is made in a reissue application as well as in the application on which the original patent was granted.',
      'The recapture rule permits a patentee to acquire through reissue claims that are, in all respects, of the same scope as, or are broader than, those claims canceled from the original application to obtain a patent.',
      'A practitioner’s failure to appreciate the full scope of the invention is not an error correctable through reissue.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 1417 — the procedure is similar to that for continuing applications; no ADDITIONAL certified copy is needed where the claim is made in both. (A) is incorrect — a § 119(a)-(d) claim MUST be made in the reissue application even though it was made in the original. (B) is incorrect — new matter is excluded from a reissue under 35 U.S.C. § 251. (D) is incorrect — the recapture rule BARS a patentee from acquiring such claims. Ball Corp. v. United States, 729 F.2d 1429 (Fed. Cir. 1984). (E) is incorrect — failure to appreciate the full scope of the invention HAS been held correctable through reissue. In re Wilder, 736 F.2d 1516 (Fed. Cir. 1984).',
  },
  {
    id: 'uspto-oct00-am-27',
    topicId: 0,
    subtopic: 'Rebutting a Prima Facie Case of Obviousness (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] If a prima facie case of obviousness is properly established by a primary examiner, how can an applicant effectively rebut the rejection in accordance with proper USPTO practice and procedure?',
    options: [
      'Rebuttal may be by way of arguments of counsel used in place of factually supported objective evidence to rebut the prima facie case.',
      'Rebuttal may be by way of an affidavit or declaration under 37 C.F.R. § 1.132 containing objective evidence arising out of a secondary consideration related to the claimed invention.',
      'No substantive showing is required by applicant. The burden remains on the examiner to maintain a prima facie case.',
      'Rebuttal evidence must be found elsewhere than in the specification.',
      'Rebuttal may be by way of arguing that the prior art did not recognize latent properties.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 716.01(a) — affidavits or declarations containing objective evidence of criticality, unexpected results, commercial success, long-felt but unsolved needs, failure of others, or skepticism of experts are considered by an examiner. (A) is incorrect — arguments of counsel cannot take the place of factually supported objective evidence. In re Schulze, 346 F.2d 600 (CCPA 1965). (C) is incorrect — the burden shifts to the applicant. In re Hoeksema, 399 F.2d 269 (CCPA 1968). (D) is incorrect. In re Soni, 54 F.3d 746 (Fed. Cir. 1995). (E) is incorrect — mere recognition of latent properties in the prior art does not render a known invention unobvious. In re Wiseman, 596 F.2d 1019 (CCPA 1979). [Pre-AIA]',
  },
  {
    id: 'uspto-oct00-am-28',
    topicId: 3,
    subtopic: 'Objection Versus Rejection (Official Oct 2000)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following is true?',
    options: [
      'There is no practical difference between an objection and rejection of a claim.',
      'If the form of the claim (as distinguished from its substance) is improper, an objection is made.',
      'An objection, if maintained by an examiner, is subject to review by the Board of Patent Appeals and Interferences.',
      'An example of a proper objection is where the claims are refused because they fail to comply with the second paragraph of 35 U.S.C. § 112.',
      'An example of a proper rejection is a rejection of a dependent claim for being dependent on a claim that has been rejected only over prior art, where the dependent claim is otherwise allowable.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). MPEP § 706.01: "If the form of the claim (as distinguished from its substance) is improper, an ‘objection’ is made." (A) and (C) are incorrect — "a rejection, involving the merits of the claim, is subject to review by the Board of Patent Appeals and Interferences, while an objection, if persisted, may be reviewed only by way of petition to the Commissioner." (D) is incorrect — a § 112 second paragraph refusal is a REJECTION; MPEP § 706.03(d). (E) is incorrect — dependency on a rejected claim, where the dependent claim is otherwise allowable, is a matter of form and so an OBJECTION.',
  },
  {
    id: 'uspto-oct00-am-30',
    topicId: 1,
    subtopic: 'Acceptable Multiple Dependent Claim Form (Official Oct 2000)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Assuming that each of the following claims is in a separate application, and there is no preceding multiple dependent claim in any of the applications, which claim is in acceptable multiple dependent claim form?',
    options: [
      'Claim 8. A machine according to any one of the preceding claims wherein…',
      'Claim 5. A device as in one of claims 1-4, wherein…',
      'Claim 10. A device as in any of claims 1-4 or 6-9, in which…',
      'Claim 4. A machine according to claim 2 or 3, also comprising…',
      'The claim form in (A), (B), (C) and (D) is acceptable.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because 35 U.S.C. § 112 authorizes multiple dependent claims as long as they are in the ALTERNATIVE form — and each of (A) through (D) refers to the preceding claims in the alternative. MPEP § 608.01(n), subsection I.A.',
  },
  {
    id: 'uspto-oct00-am-31',
    topicId: 0,
    subtopic: 'What Does Not Qualify as Prior Art (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following do not represent prior art?',
    options: [
      'The preamble of a Jepson claim.',
      'A technical journal as of its date of publication which is accessible to the public as of the date of its publication.',
      'A doctoral thesis indexed, cataloged and shelved in a university library.',
      'A disclosure publicly posted on the INTERNET, but containing no publication or retrieval date.',
      'Applicant’s labeling of one of the figures in the drawings submitted with his application as prior art.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). See MPEP § 2128, "Date of Availability" under "Electronic Publications As Prior Art" — an Internet disclosure with no publication or retrieval date cannot be relied upon because its date of public availability cannot be established. (A) is wrong — a Jepson claim results in an implied admission that the preamble is prior art. MPEP § 2129. (B) is wrong; MPEP § 2128.02. (C) is wrong — a thesis shelved in a university library may be prior art if sufficiently accessible. MPEP § 2128.01. (E) is wrong — admissions by applicant constitute prior art. In re Nomiya, 184 USPQ 607 (CCPA 1975).',
  },
  {
    id: 'uspto-oct00-am-32',
    topicId: 0,
    subtopic: 'Obviousness — A Rationale Different From Applicant’s Is Permissible (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] A patent application filed in the USPTO claims a nylon rope coated with element E for the purpose of preventing breakage of the rope. In the first Office action, the examiner rejects the claim as obvious over P in view of a trade journal publication, T. P teaches a nylon rope coated with resin for the purpose of making the rope waterproof. T teaches a nylon tent fabric coated with element E for the purpose of making the tent waterproof, and suggests the use of element E for making other nylon products waterproof. Following proper USPTO practices and procedures, the combination of P and T:',
    options: [
      'cannot support a prima facie case of obviousness because T lacks a suggestion to combine with P for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because P lacks a suggestion to combine with T for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness, even though T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness because the applicant is always under an obligation to submit evidence of non-obviousness regardless of whether the examiner fully establishes a prima facie case of obviousness.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). "It is not necessary in order to establish a prima facie case of obviousness … that there be a suggestion or expectation from the prior art that the claimed [invention] will have the same or a similar utility as one newly discovered by the applicant." In re Dillon, 919 F.2d 688, 692 (Fed. Cir. 1990); MPEP § 2144 ("Rationale Different from Applicant’s is Permissible"). (A)-(C) are incorrect because the suggestion to combine need not be for the same purpose the applicant discloses. (E) is incorrect because an applicant is under no obligation to submit evidence of non-obviousness unless the examiner first fully establishes a prima facie case. MPEP § 2142. [Pre-AIA]',
  },
  {
    id: 'uspto-oct00-am-33',
    topicId: 1,
    subtopic: 'Original Claims as Their Own Written Description (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In which of the following situations, considered independently of each other, is the original, new, or amended claim supported in the application as filed?',
    options: [
      'An amendment to the specification changing the definition of “holder” from “is a hook” to “is a hook, clasp, crimp, or tong” and no amendment is made of the claim, which uses the term “holder.” The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'An amendment to the specification and claims changing the definition of “holder” from “is a hook” to “is a hook, clasp, crimp, or tong.” The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'Original claim 1 in the application refers to “a holder,” and original claim 2 depends from and refers to claim 1 stating, “said holder is a hook, clasp, crimp, or tong.” There is no disclosure in the specification preceding the claims in the application as filed for the holder to be a clasp, crimp, or tong.',
      'An amendment is filed presenting a claim to an electrical insulating device, copied from a patent for the purpose of provoking an interference. The claim refers to “nonconductive plastic holder.” The application as filed contains a broad generic disclosure describing electrical insulating devices. The holder is described in the specification of the application as “conducting electricity.” There is no disclosure in the specification of the holder being “nonconductive.”',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2163.03, item I — ORIGINAL claims constitute their own description. In re Koller, 613 F.2d 819 (CCPA 1980). (A) and (B) are incorrect: "An amendment to the specification (e.g., a change in the definition of a term used both in the specification and claim) may indirectly affect a claim even though no actual amendment is made to the claim," and there is no supporting disclosure for a clasp, crimp or tong. (D) is incorrect — a broad generic disclosure is not necessarily sufficient written description of a specific embodiment, especially where it conflicts with the remainder of the disclosure. Fields v. Conover, 443 F.2d 1386 (CCPA 1970). (E) is not correct because (C) is.',
  },
  {
    id: 'uspto-oct00-am-34',
    topicId: 3,
    subtopic: 'When Finality of an Office Action Is Improper (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In which of the following situations would the finality of an Office action rejection be improper? I. The final Office action rejection is in a first Office action in a substitute application that contains material which was presented in the earlier application after final rejection but was denied entry because the issue of new matter was raised. II. The final Office action rejection is in a first Office action in a continuing application, all claims are drawn to the same invention claimed in the earlier application, and the claims would have been properly finally rejected on the grounds and art of record in the next Office action if they had been entered in the earlier application. III. The final Office action rejection is in a first Office action in a continuation-in-part application where at least one claim includes subject matter not present in the earlier application.',
    options: ['I', 'II', 'III', 'I and III', 'II and III'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 706.07(b). In both I and III the finality is IMPROPER — a first action may not be made final in a substitute application containing material denied entry for new matter, nor in a continuation-in-part where any claim includes subject matter not present in the earlier application. Therefore (A) and (C) are incorrect. In II the finality is PROPER. Therefore (B) and (E) are incorrect.',
  },
  {
    id: 'uspto-oct00-am-35',
    topicId: 3,
    subtopic: 'IDS Filed After the Issue Fee Is Paid (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] You receive a Notice of Allowance and Issue Fee Due in an application very important to your client, Acme Incorporated. In accordance with standing instructions you immediately pay the issue fee and then report to the client. One week later, Acme’s CEO informs you that three weeks earlier a competitor had forwarded to her copies of several prior art patents whose materiality to the claims she immediately recognized, but she was busy and did not previously inform you. She wants you to ensure that the examiner officially considers the prior art patents during prosecution. Which of the following is likely to be your best course of action to ensure proper consideration of the prior art by the examiner, while minimizing unnecessary costs and delays in issuance of a patent to Acme?',
    options: [
      'Promptly file an Information Disclosure Statement (“IDS”) signed by you that includes a statement that no item of information contained in the IDS was cited in a communication from a foreign patent office in a counterpart foreign application, and, to your knowledge after a reasonable inquiry, no item of information contained in the IDS was known to any individual designated in 37 C.F.R. § 1.56(c) more than three months prior to the filing of the IDS.',
      'Promptly file an Information Disclosure Statement (“IDS”) signed by you that includes a statement that no item of information contained in the IDS was cited in a communication from a foreign patent office in a counterpart foreign application, and, to your knowledge after a reasonable inquiry, no item of information contained in the IDS was known to any individual designated in 37 C.F.R. § 1.56(c) more than three months prior to the filing of the IDS; and pay a fee for late submission of the IDS.',
      'Promptly file an Information Disclosure Statement (“IDS”) along with payment of a fee for late submission of the IDS.',
      'Promptly file an Information Disclosure Statement (“IDS”) signed by you that includes a statement that no item of information contained in the IDS was cited in a communication from a foreign patent office in a counterpart foreign application, and, to your knowledge after a reasonable inquiry, no item of information contained in the IDS was known to any individual designated in 37 C.F.R. § 1.56(c) more than three months prior to the filing of the IDS; and submit a petition requesting consideration of the IDS and payment.',
      'Promptly petition to withdraw the application from issue, pay the necessary petition fee, and file continuation application along with an Information Disclosure Statement.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (E). MPEP § 609(B)(4). Statements (A), (B) and (C) do not apply at least because the IDS was not filed within three months of the filing date or before the mailing date of a notice of allowance. 37 C.F.R. § 1.97(c). Statement (D) does not apply because the ISSUE FEE HAS BEEN PAID. § 1.97(d). The remaining route is to petition to withdraw from issue and file a continuation with the IDS.',
  },
  {
    id: 'uspto-oct00-am-36',
    topicId: 5,
    subtopic: 'Broadening Intent Must Be Shown Within Two Years (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In July 1999, Pete Practitioner files a reissue application for Sam’s patent on a combination washing machine and dryer, which issued on August 5, 1997. The original 20 claims are filed in the reissue application along with two additional dependent claims. The declaration indicates that there was error without deceptive intent in that applicant failed to claim the subject matter of the two newly added dependent claims. Sam also indicates in the declaration that he has no intention doing anything other than adding the two dependent claims. In September 1999 the examiner allows claims 1-10 of the reissue but rejects claims 11-22. Sam is eager to enforce claims 1-10 against a competitor but does not want to give up prosecuting claims 11-22. Sam also wants to add additional claims 23-30 directed to an entirely different invention, which was disclosed in the patent but not claimed. Which of the following is true?',
    options: [
      'Sam may file a second continuing reissue application with claims 11-20 as well as new claims 23-30. Sam would then cancel claims 11-20 from the first reissue application. The second reissue application would then issue and Sam could file a Notice of Appeal to the Board of Patent Appeals and Interferences in the first reissue application. Since the first application was filed within the two year time limit, Sam would not be subjected to a rejection for broadening his claims',
      'Since Sam’s reissue application was filed within the two-year statutory time limit on broadening, Sam may add the additional claims 23 -30 to the reissue application.',
      'Although Sam’s reissue application was filed within two years, Sam did not indicate his intention to broaden the claims until after the two year period had expired. Sam may not now file broader reissue claims.',
      'Since Sam had only one patent and all reissue applications for the same patent must issue simultaneously, it would not be advantageous to file two reissue applications since they must issue at the same time.',
      'Since the new invention was disclosed but not claimed in the original application, Sam may file claims directed to this new invention at any time during the life of the patent since claiming entirely different subject matter in entirely new claims does not constitute broadening as long as the original claims are not broadened.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). It is essential that Sam file broader claims AND indicate his intention to broaden within the two-year limit of 35 U.S.C. § 251. MPEP § 1412.03; In re Graf, 111 F.3d 874 (Fed. Cir. 1997). As to (D), the requirement of 37 C.F.R. § 1.177 that all divisional reissue applications issue simultaneously will be routinely waived sua sponte; MPEP § 1451. Since (C) is true, (A), (B) and (E) are false — and as to (E), claims reading on subject matter not covered by the original claims ARE broader.',
  },
  {
    id: 'uspto-oct00-am-37',
    topicId: 3,
    subtopic: 'Date of Abandonment After an Extension of Time (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] An Office action was mailed in a pending patent application on Wednesday, November 17, 1999. The examiner set a three month shortened statutory period for reply. The applicant petitioned for a one-month extension of time on Thursday, February 17, 2000 and paid the appropriate one-month extension fee. No further papers or fees were submitted and the application became abandoned. What was the date of abandonment?',
    options: [
      'Friday, February 18, 2000.',
      'Friday, March 17, 2000.',
      'Saturday, March 18, 2000.',
      'Monday, March 20, 2000.',
      'Thursday, May 18, 2000.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The correct answer is (C). The one-month extension filed February 17, 2000 properly extended the deadline for reply to Friday, March 17, 2000. When a timely reply is ultimately not filed, the application is regarded as abandoned after midnight of the date the period expired — i.e., at 12:01 AM on Saturday, March 18, 2000. That March 18 was a Saturday does not change the abandonment day, because the reply was due March 17, a business day. MPEP § 710.01(a).',
  },
  {
    id: 'uspto-oct00-am-38',
    topicId: 3,
    subtopic: 'Public Use Proceedings — 37 CFR 1.292 (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Ace Equipment Corp. approaches you with information concerning a pending original U.S. patent application of its chief competitor, filed July 9, 1999, a copy of which and its entire prosecution history was provided to Ace during negotiations. The application stands rejected on the basis of a prior art patent. A foreign patent application corresponding to the competitor’s U.S. application had previously published, and Ace was not required to maintain its knowledge of the U.S. application in confidence. Ace is virtually certain that the competitor had used the claimed invention publicly more than one year before the filing date and would like to take whatever steps are available to prevent the application from issuing, but does not want the competitor to know they oppose issuance. Which of the following would be the best advice from you to Ace?',
    options: [
      'Recommend initiating a public use proceeding by filing a petition signed by you and serving a copy of the petition on the competitor. The petition would assert that a statutory bar exists that prohibits the patenting of the subject matter of the application, would be supported by appropriate affidavits or declarations, and would describe the subject matter that was in public use sufficiently to enable the examiner to compare the claimed subject matter to the subject matter in public use. The petition would indicate that a copy of the petition was served on the applicant and would specifically identify the application by serial number and filing date, but would not identify Ace. Any required fee would also be submitted with the petition.',
      'Recommend filing a copy of the competitor’s application as a new patent application naming an Ace employee as the inventor. You then submit a statement that the claims have been copied from the competitor’s application, and request that an interference proceeding be declared. During the interference proceeding, you can file a preliminary motion under 37 C.F.R. § 1.633(a) in an effort to obtain a ruling that the subject matter is not patentable to the competitor due to the earlier public use.',
      'Inform Ace that because patent applications are maintained in confidence under 35 U.S.C. § 122 and because patent prosecution is conducted ex parte, there is nothing that can be done until the patent issues. Once the patent issues, you can file an anonymous request for re-examination based on the competitor’s public use of the invention more than one year before the filing date.',
      'For strategic reasons, recommend waiting to see if the competitor is able to overcome the examiner’s rejection. If the patent issues, you can then file an anonymous request for re-examination on Ace’s behalf based on the competitor’s public use of the invention more than one year before the filing date.',
      'Recommend initiating an inter partes protest by submitting a written protest signed by you. The protest would not provide any information other than identifying the application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). See 37 C.F.R. § 1.292; MPEP § 720 — a public use proceeding is the available route, and the petition need not identify the real party in interest. (B) is unreasonable at least because no employee at Ace can legitimately be identified as an inventor. (C) and (D) are unreasonable at least because reexamination may not be based on public use; (C) is also wrong in suggesting nothing can be done. (E) is incorrect at least because a protest is not conducted as an inter partes proceeding. § 1.291(c); MPEP § 1901.07. [Historical practice — public use proceedings under § 1.292 were eliminated by the AIA.]',
  },
  {
    id: 'uspto-oct00-am-39',
    topicId: 3,
    subtopic: 'Confidentiality of Pending Applications Under 35 U.S.C. 122 (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Based on the foregoing facts, which of the following statements is true?',
    options: [
      'Since the corresponding foreign patent application was published, confidentiality of the U.S. application is waived and Ace may inspect the Patent Office file to monitor its progress simply by filing a request for access.',
      'Since the competitor provided Ace with a copy of the U.S. patent application and the prosecution history, confidentiality of the U.S. application is waived and Ace may inspect the Patent Office file to monitor its progress simply by filing a request for access.',
      'The competitor violated 35 U.S.C. § 122 by providing a copy of the application to Ace.',
      'A violation of 35 U.S.C. § 122 would occur if Ace publicly disclosed the competitor’s patent application.',
      'Statements (A), (B), (C) and (D) are each untrue.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. § 122; 37 C.F.R. §§ 1.11 and 1.14. Statements (A) and (B) are untrue because neither publication of a foreign counterpart nor disclosure of the U.S. application by the applicant waives confidentiality under § 122. (C) and (D) are wrong because § 122 controls the actions of the USPTO, not private parties. [Historical practice — this exam predates 18-month pre-grant publication.]',
  },
  {
    id: 'uspto-oct00-am-41',
    topicId: 3,
    subtopic: 'Board New Ground of Rejection — Appellant Options (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following is true?',
    options: [
      'The statement, “Whether claims 1 and 2 are unpatentable,” complies with the requirement of 37 C.F.R. § 1.192(c)(6) for a concise statement in the appeal brief of the issues presented for review.',
      'A reissue application may be filed in order to broaden claims back to their original form where the claims were mistakenly narrowed during the original prosecution to avoid the prior art provided that the narrowing of the claims was made without deceptive intent on the part of the applicant.',
      'If the Board of Patent Appeals and Interferences decides to require an appellant to address a particular matter, and the appellant cannot respond within the time period set, he may obtain an extension of time by paying the requisite fee.',
      'Following a new ground of rejection raised by the Board of Patent Appeals and Interferences, the applicant may request a rehearing, or submit an appropriate amendment of the rejected claims or a showing of facts relating to the rejected claims.',
      'In an ex parte reexamination proceeding, a third party requester who is dissatisfied with a decision of the Board of Patent Appeals and Interferences may seek judicial review by appeal to either the U.S. Court of Appeals for the Federal Circuit or by civil action in the U.S. District Court for the District of Columbia.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). See 37 C.F.R. § 1.196(b); MPEP § 1214.01. As to (A), see MPEP § 1206 — the bare statement is not a concise statement of the issues. As to (B), the recapture doctrine prevents such claims from being recaptured; MPEP § 1412.02. As to (C), see § 1.196(d) and MPEP § 1212 — failure to respond in time results in dismissal of the appeal. As to (E), a third party may not appeal; Syntex (U.S.A.) Inc. v. USPTO, 11 USPQ2d 1866 (Fed. Cir. 1989). [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct00-am-42',
    topicId: 2,
    subtopic: 'What Prevents a Filing Date From Being Accorded (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] In which of the following cases is the date of actual receipt by the USPTO not accorded as the application filing date?',
    options: [
      'Provisional application filed without claims.',
      'Non-provisional application filed containing an error in inventorship.',
      'Non-provisional application filed which fails to identify the inventor(s).',
      'Non-provisional application with executed oath filed without any claim(s).',
      'Non-provisional application filed using a certificate of mailing in accordance with 37 C.F.R. § 1.8.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). A non-provisional application filed without at least one claim is regarded as incomplete and will NOT be accorded a filing date. 35 U.S.C. § 111(a); 37 C.F.R. § 1.53(b); MPEP § 506. (A) is wrong because the parts necessary for a PROVISIONAL filing date do not include claims. § 111(b); § 1.53(c). (B) and (C) are wrong because "[a]n error in or failure to identify inventorship does not raise a filing date issue." MPEP § 506.02. (E) is wrong — under § 1.8(a)(2)(i)(A) no benefit is accorded to a certificate of mailing date for obtaining a filing date; the effective date is the actual date of receipt, which is what the question posits.',
  },
  {
    id: 'uspto-oct00-am-43',
    topicId: 1,
    subtopic: 'Drawing Definitions — Original, Formal, Substitute (Official Oct 2000)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following definitions does not accord with proper USPTO practice and procedure relating to drawings in patent applications?',
    options: [
      'Original drawings are drawings submitted with the application when filed, and may be either formal or informal.',
      'Formal drawings are stamped “approved” by the Draftsperson.',
      'Drawings may be informal for reasons such as the size of reference elements.',
      'A substitute drawing is usually submitted to replace an original formal drawing.',
      'A drawing may be declared as informal by the applicant when filed.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because a substitute drawing is usually submitted to replace an original INFORMAL drawing, not an original formal drawing. MPEP § 608.02, "Definitions." (A), (B), (C) and (E) are wrong answers because they accord with the definitions set forth in MPEP § 608.02.',
  },
  {
    id: 'uspto-oct00-am-44',
    topicId: 3,
    subtopic: 'Time for Filing the Appeal Brief (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] After filing a Notice of Appeal, an appeal brief is due. In accordance with proper USPTO practice and procedure:',
    options: [
      'The brief is due within two months of the date of appeal. The Office date of receipt of the Notice of Appeal is the date from which this two month period is measured.',
      'The brief is due within two months of the date of appeal, the date indicated on any Certificate of Mailing under 37 C.F.R. § 1.8 attached to the Notice of Appeal is the date from which this two month period is measured.',
      'Failure to file the appeal brief within the permissible time will result in dismissal of the appeal and abandonment of the application, including any allowed claims.',
      'Failure to file the appeal brief within the permissible time will result in dismissal of the appeal and abandonment of the application containing no allowed claims, and an appeal brief will be due within two months after the date a petition is granted to revive the application and reinstate the appeal.',
      'If the appellant is unable to file an appeal brief within the time allotted by the rules, appellant may file a petition, with fee, to the examining group, requesting additional time, and the time extended is added to the last day the appeal brief would have been due when said last day is a Saturday, Sunday, or Federal holiday.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. § 1.192(a); MPEP § 1206, "Time For Filing Appeal Brief" — the period runs from the Office date of receipt of the Notice of Appeal, not a certificate of mailing date, so (B) is incorrect. (C) is incorrect — although failure to file the brief in time dismisses the appeal, if any claims stand allowed the application does not become abandoned but returns to the examiner. (D) is incorrect — a proper brief must be filed before a petition to revive and reinstate the appeal is considered on the merits. (E) is incorrect — the time extended is added to the calendar day of the original period. [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct00-am-45',
    topicId: 0,
    subtopic: 'A 102(b) Reference Cannot Be Antedated (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] On February 12, 1999, you filed a patent application containing two independent claims, Claims 1 and 2, directed to methods of forming an integrated circuit device. The applicant conceived the methods in Jacksonville, Florida on June 10, 1997. Commencing on June 10, 1997, the applicant exercised due diligence until she reduced the methods to practice on February 27, 1998. In an Office action dated August 18, 1999, the examiner rejected Claim 1 as being anticipated by Doppler under 35 U.S.C. § 102(b). Doppler is a French patent that was filed on July 18, 1996, and issued on January 13, 1998. The Doppler patent claims the method of the applicant’s Claim 1. Claim 2 was rejected as being anticipated by Spot under 35 U.S.C. § 102(e). Spot is a U.S. patent that was filed on January 7, 1998, and discloses, but does not claim, the method of applicant’s Claim 2. The Spot patent issued on May 5, 1999. Which of the following would be the most proper course of action to take to respond to the rejections?',
    options: [
      'File an antedating affidavit to overcome the rejection of Claim 1 and cancel Claim 2.',
      'File an antedating affidavit to overcome both the rejections and request that an interference be declared with the Doppler patent.',
      'File an antedating affidavit to overcome the rejection of Claim 2 and cancel Claim 1.',
      'File a reply arguing that the rejections are improper because the Spot patent issued after the filing date of your client’s application.',
      'File an antedating affidavit to overcome both rejections.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. §§ 102(b) and (e); 37 C.F.R. § 1.131(a). A reference under § 102(b) CANNOT be antedated — Doppler issued January 13, 1998, more than one year before the February 12, 1999 filing date — so Claim 1 must be cancelled and (A), (B) and (E) are incorrect. The § 102(e) rejection over Spot CAN be antedated, since applicant conceived June 10, 1997 with due diligence to reduction to practice February 27, 1998, before Spot’s January 7, 1998 filing date. (D) is incorrect because it is non-responsive and it does not matter when the Spot patent issued. [Pre-AIA]',
  },
  {
    id: 'uspto-oct00-am-46',
    topicId: 1,
    subtopic: 'When the Examiner May Require a Drawing (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following statements regarding an applicant’s duty to submit a drawing in a U.S. patent application is true? I. The examiner may only require a drawing where the drawing is necessary for the understanding of the invention. II. If a drawing is not necessary for the understanding of the invention, but the case admits of illustration, the examiner may require the drawing, but the lack of a drawing in the application when filed will not affect the filing date of the application. III. If a drawing is necessary for the understanding of an invention, but is not submitted on filing, the application cannot be given a filing date until the drawing is received by the USPTO.',
    options: ['I', 'II', 'III', 'II and III', 'I, II, and III'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 113; MPEP § 608.02(a), "Handling of Drawing Requirements Under The Second Sentence Of 35 U.S.C. 113." Statements II and III are both true. (A) is incorrect inasmuch as I is FALSE — the examiner will normally require a drawing where the case admits of illustration, not only where it is necessary for understanding. 37 C.F.R. § 1.81(c). (B) is incorrect because III is also true; (C) is incorrect because II is also true; (E) is incorrect because I is false.',
  },
  {
    id: 'uspto-oct00-am-47',
    topicId: 7,
    subtopic: 'Authority to Conduct an Examiner Interview (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Blackacre is a registered patent agent employed by an intellectual property law firm located in Arlington, Virginia. He is awakened at 5:30 AM one morning by a frantic call from Whiteaker, a senior partner at the law firm. Whiteaker informs Blackacre that she has an examiner interview scheduled for 3:00 PM that day in connection with an important patent application she is handling. However, a family emergency arose during the night and she will not be able to attend the interview. It is also the last day of the statutory six-month period for reply, so the interview cannot be rescheduled. She requests that Blackacre conduct the examiner interview for her and, based on the outcome of the interview, file appropriate papers with the USPTO. She tells him exactly where he can locate the file in her office. Blackacre has not been given a power of attorney in the application, but has been given a power to inspect the USPTO file for the application. Assuming Blackacre has adequate time to prepare for the interview and will competently represent the applicant, which of the following statements is true?',
    options: [
      'Blackacre can participate in the interview if he brings along a copy of the application file and states to the examiner that he is authorized to represent the applicant.',
      'Blackacre cannot participate in the examiner interview because he does not have an express power of attorney and has not previously made an appearance in the application.',
      'The power to inspect alone is sufficient authority for an examiner to grant an interview involving the merits of an application.',
      'Blackacre must obtain either a written power of attorney from the applicant or a written associate power of attorney from Whiteaker before he can participate in the examiner interview.',
      'Statements (B) and (D) are true.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 37 C.F.R. §§ 1.31 and 1.34; MPEP § 713.05. Statements (B) and (D) are incorrect because Blackacre may participate in the interview if he possesses a copy of the application file and states he is authorized to represent the applicant — (E) is therefore also incorrect. (C) is incorrect because a mere power to inspect is INSUFFICIENT authority for an examiner to grant an interview involving the merits of an application.',
  },
  {
    id: 'uspto-oct00-am-48',
    topicId: 2,
    subtopic: 'Converting a Nonprovisional to a Provisional Application (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] A nonprovisional patent application is filed on June 3, 1999, and on September 3, 1999, an Office action is mailed setting a 3 month shortened statutory period for reply. On March 3, 2000, a proper reply is filed together with a petition for a 3 month extension of time accompanied by the appropriate petition fee. A proper petition for conversion of the nonprovisional patent application to a provisional patent application along with the appropriate petition fee is deposited with the U.S. Postal Service as Express Mail pursuant to 37 C.F.R. § 1.10 on Saturday, June 3, 2000. Assuming the petition for conversion is granted shortly thereafter, which of the following statements is true?',
    options: [
      'The provisional application is entitled to a filing date of June 3, 1999.',
      'The provisional application is entitled to a filing date of September 3, 1999.',
      'The provisional application is entitled to a filing date of March 3, 2000.',
      'The provisional application is entitled to a filing date of June 3, 2000.',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). Under 37 C.F.R. § 1.53(c)(2), a nonprovisional patent application "may be converted to a provisional application and be accorded the original filing date of the" nonprovisional application. MPEP § 601.01(c). (B), (C) and (D) are wrong because they recite dates other than the ORIGINAL filing date of the nonprovisional application. (E) is wrong because (A) is correct.',
  },
  {
    id: 'uspto-oct00-am-49',
    topicId: 3,
    subtopic: 'Oral Hearings Before the Board (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following is true?',
    options: [
      'When an applicant petitions to make his case special, he forfeits the opportunity to request an oral hearing if he should decide to appeal his application to the Board of Patent Appeals and Interferences.',
      'An oral hearing is a good way to argue a case before the Board of Patent Appeals and Interferences as an appeal decided by an oral hearing is likely to be given closer consideration by the Board of Appeals and Patent Interferences than those without such a hearing.',
      'During an appeal to the Board of Appeals and Patent Interferences, it is a good idea to schedule the oral hearing before filing a reply brief so that if questions arise at the hearing they may be responded to in the reply brief.',
      'A rehearing of an appeal involves conducting an oral hearing a second time.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). As to (A), see MPEP § 708.02 — no such forfeiture requirement is stated; see also MPEP § 1200-2 under "Special Case." As to (B), see MPEP § 1209 and 37 C.F.R. § 1.194 — an oral hearing does not secure closer consideration. As to (C), a reply brief must be filed within two months of the examiner’s answer, so it cannot follow the hearing; MPEP § 1208.03. As to (D), see MPEP § 1214.03 — a rehearing is not a second oral hearing. [Historical practice — Board rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct00-am-50',
    topicId: 5,
    subtopic: 'Reissue, Reexamination and Maintenance Fee Timing (Official Oct 2000)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2000] Which of the following is true?',
    options: [
      'In order to have a reissue application expedited, the reissue applicant should file a Petition to Make Special.',
      'Once a reissue issues, the date on which the maintenance fee is due is calculated from the date of issuance of the reissue certificate.',
      'A dependent claim may not be broadened during a reexamination proceeding.',
      'If the examiner raises a new ground of rejection in the Examiner’s Answer, the applicant has the option of continuing with the appeal or asking that prosecution be reopened.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): "ANSWERS: (D) and (E)." As to (A), see MPEP § 1442 — all reissue applications (except those suspended for litigation) are already taken up ahead of other "special" applications, so a petition to make special would do no good. As to (B), maintenance fees are ALWAYS calculated from the original patent issue date. MPEP §§ 2506, 1415.01. As to (C), claims may not enlarge the scope of the patent during reexamination; but because a dependent claim contains all the limitations of the claim it depends from, broadening it does not necessarily enlarge the scope of the patent — so the flat statement in (C) is not correct. As to (D), the USPTO stated it "is accepted due to ambiguity contained therein." NOTE: this bank stores one key and uses (D); if you answered (E), the USPTO accepted that too.',
  },
];

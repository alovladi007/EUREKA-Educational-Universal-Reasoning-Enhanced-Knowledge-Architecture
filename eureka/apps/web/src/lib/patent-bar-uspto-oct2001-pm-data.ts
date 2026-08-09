/**
 * Patent Bar — OFFICIAL USPTO released exam questions (public domain).
 *
 * Source: United States Patent and Trademark Office, Registration Examination
 * for Patent Attorneys and Agents, October 17, 2001 — Afternoon Session
 * (Test Number 456, Series 201), with the USPTO's official Model Answers.
 * Retrieved from the USPTO's published PDFs (edo0110pq.pdf, and the combined
 * AM+PM model answers edo0110apa.pdf, via the Internet Archive copy of
 * uspto.gov). US Government works — public domain.
 *
 * Provenance and integrity rules for this file (same pipeline as the Oct 2003,
 * Apr 2003, Apr 2002 and Oct 2001 AM files):
 *  - Question stems and options are transcribed VERBATIM from the official
 *    paper (PDF text-extraction spacing artifacts repaired only; genuine
 *    typos in the official paper are preserved).
 *  - Option ORDER is the official exam order — never shuffled.
 *  - `correct` comes from the USPTO's official Model Answers.
 *  - `explanation` is the official model answer, abridged, always retaining
 *    the controlling citation.
 *  - No question in this session was discarded — all 50 are scoreable.
 *  - ERA NOTE: this exam predates the AIA (2011-2013). Questions that turn on
 *    pre-AIA 35 U.S.C. 102/103 (the "in this country" limits of 102(a)/(b),
 *    the 102(c) abandonment bar, 102(d) foreign-patent bars, 102(g) priority
 *    contests and diligence, 135(b), and Rule 131 antedating) carry an
 *    explicit [Pre-AIA] tag. Questions built on since-superseded procedure
 *    (CPA practice, inter partes reexamination, the pre-2004 Board rules of
 *    37 CFR 1.19x/1.304) carry a [Historical practice] tag — the reasoning
 *    style remains instructive, but the specific rule has changed. Verified
 *    status: OFFICIAL (USPTO model answers).
 *
 * Ingested: PM session Q1-Q50 (50 of 50 scoreable).
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_OCT2001_PM_SOURCE =
  'USPTO Registration Examination, October 17, 2001 — Afternoon Session (official model answers; public domain)';

export const USPTO_OCT2001_PM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-oct01-pm-01',
    topicId: 1,
    subtopic: 'Indefiniteness of "An Effective Amount" (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A U.S. patent application discloses a first embodiment of an invention, a composition made of known materials in equal amounts by weight of A, B, and C. The application discloses a second embodiment of the invention comprising equal amounts by weight of A, B, and C, and an effective amount of D, a known material, to reduce excess moisture from the composition. The application also discloses a third embodiment of the invention comprising equal amounts by weight of A, B, and C, and an effective amount of D to reduce the acidity of the composition. The application fully discloses guidelines for determining an effective amount of D to reduce excess moisture from the composition, and determining an effective amount of D to reduce the acidity of the composition. The application discloses that the amount of D needed to reduce excess moisture from the composition differs from the amount of D needed to reduce the acidity of the composition. Which of the following claims, if included in the application, provides a proper basis for a rejection under 35 U.S.C. § 112, second paragraph?',
    options: [
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C, and an effective amount of D to reduce the acidity of the composition.',
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C, and an effective amount of D.',
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C, and an effective amount of D to reduce excess moisture from the composition.',
      'Claim 1. A composition comprising: equal amounts by weight of A, B, and C.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 35 U.S.C. § 112, second paragraph; MPEP § 2173.05(c)(III). "An effective amount" is indefinite when the claim fails to state the function to be achieved and more than one effect can be implied from the specification. In re Fredericksen, 213 F.2d 547, 102 USPQ 35 (CCPA 1954). It is unclear whether the effective amount in (B) reduces acidity or moisture. The claims in (A) and (C) each state the function and find support in the disclosed guidelines. The claim in (D) is not indefinite, since A, B and C are known materials. (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-oct01-pm-02',
    topicId: 2,
    subtopic: 'Inventorship — Conception, Reduction to Practice, Funding (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Able conceived the invention claimed in a patent application. In conceiving the invention, Able used and adopted ideas and materials known in the art and invented by others. Ben, Able’s employee, reduced the invention to practice at Able’s request and totally pursuant to Able’s suggestions. Being unable to afford a patent practitioner’s fees to prepare and prosecute the application, Able convinced John to pay for the practitioner’s services in return for an interest in the invention. John did nothing more than provide the funds for the practitioner. Which of the following is in accordance with proper USPTO practice or procedure?',
    options: [
      'Able need not be the one to reduce the invention to practice so long as the reduction to practice occurred on his or her behalf. Able can be properly named as inventor in the application.',
      'To be named an inventor, it is not necessary for John to have contributed to the conception of the invention. Ben, not Able, can be named as inventor in the application.',
      'In conceiving the invention, Able may not consider and adopt ideas and materials derived from any sources, such as ideas of previous inventors. Able cannot be properly named as inventor in the application.',
      'John and Able may be properly named as joint inventors of the invention in the application.',
      'John, Ben, and Able may be properly named as joint inventors of the invention in the application.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). MPEP § 2137.01 ("The Inventor Is Not Required To Reduce The Invention To Practice"), citing In re DeBaun, 214 USPQ 933, 936 (CCPA 1982). (B) is not correct — an inventor must contribute to the CONCEPTION of the invention. Fiers v. Revel, 25 USPQ2d 1601 (Fed. Cir. 1993). (C) is not correct — as long as the inventor maintains intellectual domination over making the invention, ideas, suggestions and materials may be adopted from others. Morse v. Porter, 155 USPQ 280 (Bd. Pat. Inter. 1965). (D) and (E) are not correct; 35 U.S.C. § 116; MPEP § 2137.01 (Requirements For Joint Inventorship) — merely funding the work confers no inventorship.',
  },
  {
    id: 'uspto-oct01-pm-03',
    topicId: 3,
    subtopic: 'Drawing Objections Are Not Held in Abeyance (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Practitioner Smith filed a utility patent application on January 5, 2001, with informal drawings. Upon review of the drawings, the USPTO concluded that the drawings were not in compliance with the 37 CFR 1.84(a)(1) and (k), and were not suitable for reproduction. In an Office communication, Smith was notified of the objection and given two months to correct the drawings so that the application can be forwarded to a Technology Center for examination. Which of the following complies with USPTO practices and procedures for a complete bona fide attempt to advance the application to final action?',
    options: [
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance until allowable subject matter is indicated.',
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance since the requirement increases up-front costs for the patent applicant, and the costs can be avoided if patentable subject matter is not found.',
      'Smith timely files a response requesting that the objections to the drawings be held in abeyance until fourteen months from the earliest claimed priority date.',
      'Smith timely files a response correcting the drawings to comply with 37 CFR 1.84(a)(1) and (k), and making them suitable for reproduction.',
      'All of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). Under 37 CFR 1.85(a), correcting the drawings to comply with § 1.84(a)(1) and (k) and making them suitable for reproduction is a bona fide response. (A), (B) and (C) each seek to hold the requirement in abeyance, and § 1.85(a) (effective Nov. 29, 2000) states: "Unless applicant is otherwise notified in an Office action, objections to the drawings in a utility or plant application will not be held in abeyance, and a request to hold objections to the drawings in abeyance will not be considered a bona fide attempt to advance the application to final action." (E) is not correct inasmuch as (A), (B) and (C) are not.',
  },
  {
    id: 'uspto-oct01-pm-04',
    topicId: 0,
    subtopic: 'Rule 131 and the Geographic Limits of Prior Invention (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In 1996, Sydney, while vacationing at the North Pole, invents a new method of ice fishing using a solar powered fishhook with a transmission device for indicating the presence of a fish. For 5 years, Sydney practiced his invention exclusively at the North Pole, outside of the United States, its possessions, or its territories or any WTO or NAFTA country. He showed his invention to only one person, his friend Charlie, while Charlie was visiting him at the North Pole in June 2001. Charlie spoke to no one in the United States about the idea and crafted a near duplicate and began to publicly use it upon his return to Wisconsin in September 2001. On October 18, 2001, Sydney telephones you and complains to you that Charlie, the only person who has ever seen Sydney’s device, has begun using his device. In the October 18, 2001 phone conversation, Sydney asks you for advice as to the filing of a patent application. Which of the following is the best advice for Sydney?',
    options: [
      'The witnessing of the fishhook by Charlie in June 2001 constitutes knowledge of the invention, and claims directed to Sydney’s invention could be properly rejected under 35 U.S.C. §102(a).',
      'Use of the device in Wisconsin constitutes public use and since Sydney cannot establish prior invention through activities at the North Pole, he is precluded from antedating the date of the first public use in the United States.',
      'Since Sydney invented the fishing device in 1996, he is the prior inventor and can overcome the first date of public use by Charlie by filing a 37 CFR 1.131 affidavit or declaration.',
      'Since Charlie first used the fishing device in the United States, Charlie may file a patent application.',
      'Since Charlie’s public use in Wisconsin was not authorized, Sydney may still file a patent application on the fishing device.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Sydney is precluded by Charlie’s public use in Wisconsin. A declaration under 37 CFR 1.131 is not permissible since the activity at the North Pole did not occur in the United States, a NAFTA country or a WTO country. (A) is not correct as the knowledge did not occur in the United States and was not public knowledge. (C) is not correct for the reasoning in (B). (D) is not correct since Charlie was not the inventor. (E) is not correct since public use in the United States by a third party may establish a date for prior art purposes. 35 U.S.C. § 102(a). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-05',
    topicId: 2,
    subtopic: 'Best Evidence of Receipt — The Itemized Return Postcard (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] You are a registered patent agent with a busy patent practice in Arlington, Virginia. You are scheduled to leave for a long-awaited three-week trip to the Galapagos Islands on Friday, October 19, 2001. You recently completed a draft of a provisional patent application and forwarded it to the client for review and comment. She informs you that the provisional patent application relates to an invention upon which the continued success of her business depends and that she first offered the invention for sale on October 21, 2000. She also informs you that the provisional application is ready for filing, but that she will be unable to forward to you a declaration signed by the inventors for at least four weeks. Understandably, you wish to make absolutely certain that the provisional application, having ten pages of specification, and three sheets of drawings, is properly filed with the USPTO and accorded a filing date before you leave for your trip, and that you are timely informed should anything be omitted. Which of the following scenarios provides the best evidence that the USPTO has received the provisional application with no missing parts, and the application is accorded a filing date?',
    options: [
      'You promptly hand-carry the provisional application, an application data sheet, and the appropriate filing fee to the USPTO Customer Service Window. You file these materials and have the attendant date stamp a card reciting that the deposited document is a new application and reciting the title of the invention and listing the names of the inventors.',
      'You promptly mail the provisional application, an application data sheet, and the appropriate filing fee to the official USPTO address employing a proper Certificate of Mailing in accordance with 37 CFR 1.8.',
      'You promptly mail the provisional application, an application data sheet and the appropriate filing fee to the official USPTO address employing Express Mail Post Office to Addressee service of the U.S. Postal Service in accordance with 37 CFR 1.10.',
      'You promptly mail the provisional application to the official USPTO address accompanied by a Return Postcard identifying the type of deposited document as a new patent application and reciting the title of the invention and listing the names of the inventors.',
      'You promptly hand-carry the provisional application and an application data sheet to the USPTO Customer Service Window. You file these materials and have the attendant date stamp a card reciting the title of the invention, the names of the inventors, and listing the number of pages of the cover sheet, the number of pages of specification, and the number of sheets of drawings.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the most correct answer. (A) is not the best answer because the items — pages of specification, sheets of drawings — are not itemized on the card. (B) and (C) are wrong because they do not provide a receipt from the USPTO; (B) is also wrong because § 1.8 cannot be used to obtain an early filing date for a new application. (D) will not provide the earliest possible filing date. Per MPEP § 503, "RETURN POSTCARD": a postcard receipt that itemizes and properly identifies the items filed serves as prima facie evidence of receipt of all items listed — "If a new application is being filed, all parts of the application being submitted should be separately listed on the postcard."',
  },
  {
    id: 'uspto-oct01-pm-06',
    topicId: 1,
    subtopic: 'Rebutting a Prima Facie Case of Nonenablement (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] An examiner has advanced a reasonable basis for questioning the adequacy of the enabling disclosure in the specification of your client’s patent application, and has properly rejected all the claims in the application. The claims in the application are drawn to a computer program system. In accordance with proper USPTO practice and procedure, the rejection should be overcome by submitting _____________',
    options: [
      'factual evidence directed to the amount of time and effort and level of knowledge required for the practice of the invention from the disclosure alone.',
      'arguments by you (counsel) alone, inasmuch as they can take the place of evidence in the record.',
      'an affidavit under 37 CFR 1.132 by an affiant, who is more than a routineer in the art, submitting few facts to support his conclusions on the ultimate legal question of sufficiency, i.e., that the system “could be constructed.”',
      'opinion evidence directed to the ultimate legal issue of enablement.',
      'patents to show the state of the art for purposes of enablement where these patents have an issue date later than the effective filing date of the application under consideration.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). MPEP § 2106.02 (Affidavit Practice (37 CFR 1.132)). Factual evidence directed to the amount of time and effort and level of knowledge required for the practice of the invention from the disclosure alone can rebut a prima facie case of nonenablement. Hirschfield v. Banner, 200 USPQ 276, 281 (D.D.C. 1978). (B) is not correct — arguments of counsel cannot take the place of evidence. In re Schulze, 145 USPQ 716 (CCPA 1965). (C) is not correct — conclusory affidavits with few supporting facts are insufficient. In re Brandstadter, 179 USPQ 286 (CCPA 1973). (D) is not correct — opinion on the ultimate legal issue is not the evidence required. (E) is not correct — later-issued patents do not show the state of the art at filing. In re Budnick, 190 USPQ 422 (CCPA 1976).',
  },
  {
    id: 'uspto-oct01-pm-07',
    topicId: 3,
    subtopic: 'New Matter — Petition Versus Appeal (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Izzy decides one day that the hydrogen fuel cell research in which he is engaged shows great potential and retains the services of a patent law firm. A patent application is promptly prepared and filed in the USPTO disclosing and claiming a hydrogen fuel cell wherein the electrodes employed to catalyze the hydrogen gas into positive ions and negative ions consist of a platinum catalyst. The original claims are fully supported by the application as filed. Two preliminary amendments are submitted after the original filing, but prior to initial examination. In the first preliminary amendment, the specification, but not the claims, is amended to recite that the electrodes may consist of a niobium catalyst. In the second preliminary amendment, the specification and the claims are amended to recite that the electrodes may consist of an iridium catalyst. In the first Office action, the examiner determined that both amendments involve new matter and required their cancellation. In addition, the examiner rejected all the claims under 35 U.S.C. § 112, first paragraph on the ground that they recited elements without support in the original disclosure. Ultimately, the examiner issued a Final Rejection on the same basis. Based upon proper USPTO practice and procedure, which of the following is correct?',
    options: [
      'Review of the determination that both the first preliminary amendment and the second preliminary amendment contain new matter is by appeal.',
      'Review of the determination that both the first preliminary amendment and the second preliminary amendment contain new matter is by petition.',
      'Review of the determination that the first preliminary amendment contains new matter is by appeal, and review of the determination that the second preliminary amendment contains new matter is by petition.',
      'Review of the determination that the first preliminary amendment contains new matter is by petition, and review of the determination that the second preliminary amendment contains new matter is by appeal.',
      '(A), (B), (C), and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 608.04(c): "Where the new matter is confined to amendments to the specification, review of the examiner’s requirement for cancellation is by way of petition. But where the alleged new matter is introduced into or affects the claims, thus necessitating their rejection on this ground, the question becomes an appealable one." See also MPEP § 706.03(o). The first amendment touched only the specification (petition); the second reached the claims (appeal). (A), (B) and (C) are incorrect; (E) is incorrect inasmuch as (A), (B) and (C) are.',
  },
  {
    id: 'uspto-oct01-pm-08',
    topicId: 0,
    subtopic: 'Interference Versus Rule 131 When a Patent Claims the Same Invention (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Select from the following an answer which completes the following statement, such that the completed statement accords with proper USPTO practice and procedure: “When the reference in question is a noncommonly owned U.S. patent claiming the same invention as applicant, and its issue date is _____________________”',
    options: [
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'exactly one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'more than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of requesting an interference.',
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of affidavit or declaration “swearing back” of reference.',
      'less than one year prior to the presentation of claims to that invention in the application being examined, applicant’s remedy, if any, is by way of affidavit or declaration traversing the ground of rejection.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer, while (D) is not. MPEP § 715.05: when the reference is a noncommonly owned U.S. patent claiming the same invention and its issue date is LESS than 1 year before the claims are presented, applicant’s remedy must be by way of 37 CFR 1.608 rather than § 1.131 — the reference patent can then be overcome only by interference. (B) and (C) are not the most correct: if the patent issued 1 year or more before the claims are presented, a rejection under 35 U.S.C. § 135(b) should be made. In re McGrew, 120 F.3d 1236 (Fed. Cir. 1997). (E) is wrong because an affidavit traversing a ground of rejection is available only where the reference "substantially shows or describes but does not claim the same patentable invention." 37 CFR 1.132. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-09',
    topicId: 0,
    subtopic: 'Thesis on a Library Shelf as a Printed Publication (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Bill was working toward a Ph.D. in physics from a university in Japan. As part of his doctoral program, Bill prepared (in Japanese) a thesis directed to his work in the semiconductor field. Following approval of the thesis by his faculty advisor on December 21, 2000, the sole copy of Bill’s thesis was placed on the shelves of the university library on January 29, 2001, where it was accessible to the faculty and students of the university as well as to the general public. At that time, the thesis was indexed in a general user’s catalog maintained locally at the university library by author, title and subject. On March 4, 2001, the general user’s catalog was made freely available on an Internet web page maintained by the university. Which of the following statements is most correct?',
    options: [
      'Bill’s thesis may be used under 35 U.S.C. § 102(b) as a prior art printed publication against a United States application for patent filed January 4, 2002.',
      'Bill’s thesis may be used under 35 U.S.C. § 102(b) as a prior art printed publication against a United States application for patent filed February 19, 2002.',
      'Bill’s thesis may be used under 35 U.S.C. § 102(b) as a prior art printed publication against a United States application for patent filed March 6, 2002.',
      'Each of statements (B) and (C) is correct.',
      'Because the thesis was written in Japanese, it cannot be a prior art printed publication against a United States application for patent.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct response is (D). Bill’s thesis constitutes a printed publication as of January 29, 2001 — the date it was shelved and indexed so as to be accessible to the interested public. In re Hall, 228 USPQ 453 (Fed. Cir. 1986). A § 102(b) bar therefore runs against applications filed more than one year later, so both (B) and (C) are correct statements and (D) is the most correct response. (E) is wrong — the provisions of § 102(b) apply equally to publications in non-English languages. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-10',
    topicId: 2,
    subtopic: 'Small Entity Status in Continuing and Reissue Applications (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Harriet filed a nonprovisional patent application in the USPTO containing a written assertion of small entity status. Based upon proper USPTO practice and procedure, which of the following statements is correct?',
    options: [
      'If Harriet files a related, continuing application wherein small entity status is appropriate and desired, it will not be necessary to specifically establish assertion of such status in the continuing application.',
      'If Harriet files a related, reissue application wherein small entity status is appropriate and desired, it will be necessary to specifically establish assertion of such status in the reissue application.',
      'If Harriet files a related, divisional application under 37 CFR 1.53, wherein small entity status is appropriate and desired, it will not be necessary to specifically establish assertion of such status in the divisional application.',
      'If Harriet refiles her application as a continued prosecution application under 37 CFR 1.53(d), wherein small entity status is appropriate and desired, it will not be necessary to specifically establish assertion of such status in the continued prosecution application.',
      'If Harriet subsequently assigns her rights to another party for whom small entity status is appropriate and desired, it will be necessary to specifically re-establish assertion of such status.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is correct and (A), (C) and (D) are wrong. 37 CFR 1.27(c)(4): "The refiling of an application under § 1.53 as a continuation, divisional, or continuation-in-part application, including a continued prosecution application under § 1.53(d), or the filing of a reissue application, requires a new assertion as to continued entitlement to small entity status." (E) is also wrong — § 1.27(e)(1) provides that where an assignment to other small entities occurs after an assertion of small entity status, a second assertion is not required. [Historical practice — CPA practice for utility applications ended in 2003.]',
  },
  {
    id: 'uspto-oct01-pm-11',
    topicId: 1,
    subtopic: 'Product-by-Process Claims After an Improper Dependent Claim (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A patent application filed in the USPTO contains the following three original claims, including product by process Claim 3: Claim 1. A method for making an Ethernet cable comprising the steps of A, B and C. Claim 2. The method of claim 1, further characterized by the step of D. Claim 3. The Ethernet cable as in any one of the preceding claims. In the first Office action, the examiner objects to Claim 3 as being an improper dependent claim and requires cancellation of the claim. Following proper USPTO practices and procedures, which of the following replies best overcomes the examiner’s objection and provides the client with the broadest range of patent protection?',
    options: [
      'Cancel Claim 3. Add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.” Add Claim 5, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
      'Amend Claim 3 to read: “The Ethernet cable as made by the process set forth in claims 1-2.”',
      'Cancel Claim 3.',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B and C.”',
      'Cancel Claim 3 and add Claim 4, which reads: “An Ethernet cable made by a process comprising the steps of A, B, C and D.”',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. Cancelling Claim 3 overcomes the objection, and adding Claims 4 and 5 secures product-by-process protection for the cable by BOTH methods of manufacture — so if Claim 4 is invalid, Claim 5 may remain valid. (B) is incorrect because it is an improper multiple dependent claim. 35 U.S.C. § 112 ¶ 5; 37 CFR 1.75(c); MPEP § 608.01(n)(I)(B)(1). (C) leaves the application with no product claim at all; (D) and (E) each leave it without a claim to the cable made by the other process.',
  },
  {
    id: 'uspto-oct01-pm-12',
    topicId: 5,
    subtopic: 'Joint Ownership, Assignment, and Who May File a Reissue (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Mike and Mary jointly invented a cornhusk peeler. Mary invented a wrap around handle for the peeler that keeps the hand protected. Mike invented the portion that engages the cornhusk and removes the cornhusk without damaging the kernels. An application is filed and eighteen months later the patent issues listing Mike and Mary as joint inventors with claims to a cornhusk peeler having the portions invented by both Mike and Mary. Mike and Mary have an argument and never speak or communicate in any way with each other again. Subsequently, Mary sells all of her ownership in the patent to Bird’s Beak, who then records the assignment in the USPTO. Mike comes to you for advice as to what he can do. Which of the following is true?',
    options: [
      'Mike should file a reissue application in which he names only himself as inventor and claims only the cornhusk-removing portion. Mike can then sue Bird’s Beak to prevent them from manufacturing a device with the cornhusk-removing portion.',
      'Since Mary invented only the handle portion, she can assign only the rights in the invention concerning the handle. Consequently, Bird’s Beak received only the right to manufacture the handles but not the cornhusk-removing portion.',
      'Mike should attempt to void the assignment by Mary since the patent was jointly owned. It takes the consent of both parties to assign the rights in the invention.',
      'Mike can file a reissue application, but only with the consent of Bird’s Beak, because it takes both the remaining inventor (Mary) and the assignee (Bird’s Beak) to consent to the filing of a reissue application.',
      'Mike may void the assignment to Bird’s Beak by filing a disclaimer signed only by Mike disclaiming all claims directed to the portion of the invention that Mary developed.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 251. As to (A) and (D), 37 CFR 3.73(b)(2) requires the consent of all assignees or remaining inventors before any national (including reissue) application can be filed — Mike cannot file a reissue alone. As to (E), under 35 U.S.C. § 253 the owner of a sectional interest may file a disclaimer, but disclaiming Mary’s claims would not void the assignment to Bird’s Beak. As to (B) and (C), 35 U.S.C. § 262 provides that in joint ownership each inventor owns an undivided interest in the WHOLE, and § 261 provides for assignment of that interest.',
  },
  {
    id: 'uspto-oct01-pm-13',
    topicId: 0,
    subtopic: 'Specific Utility and the "Real World Value" Requirement (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following statements about the disclosure of the utility of an invention is true in accordance with proper USPTO practice and procedure?',
    options: [
      'A claimed utility invention that is disclosed to be neither a machine, an article of manufacture, a composition, nor a process is patentable in accordance with the patent law.',
      'In a patent application claiming a compound, a disclosure by the applicant that the compound may be useful in treating unspecified disorders would be sufficient to define a specific utility for the compound.',
      'In a patent application claiming a compound, a disclosure by the applicant that the compound has “useful biological” properties, would be sufficient to define a specific utility for the compound.',
      'In a patent application claiming a compound, a disclosure by the applicant that the compound has a specific biological activity and reasonably correlates that activity to a disease condition would be sufficient to define a specific utility for the compound.',
      'If a claimed invention does not have utility, the specification nevertheless can enable one to use it.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). MPEP § 2107(I), "‘Real World Value’ Requirement" — the USPTO regards an assertion of specific biological activity reasonably correlated to a disease condition as sufficient to identify a specific utility. (A) is not correct — an invention that is not a machine, manufacture, composition or process cannot be patented. 35 U.S.C. § 101; Diamond v. Chakrabarty, 447 U.S. 303 (1980). (B) and (C) are incorrect — such general assertions are insufficient to define a specific utility. Knapp v. Anderson, 477 F.2d 588 (CCPA 1973). (E) is incorrect; 35 U.S.C. §§ 101, 112; In re Brana, 51 F.3d 1560 (Fed. Cir. 1995).',
  },
  {
    id: 'uspto-oct01-pm-14',
    topicId: 3,
    subtopic: 'Patent Term Adjustment — Reductions and the Three-Year Clock (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Thomas filed a nonprovisional utility patent application on February 8, 2001 without an executed oath and without the filing fee. A "Notice to File Missing Parts – Filing Date Granted" issued April 2, 2001 setting a two-month period; Thomas did not fully reply until September 3, 2001, with a three-month extension and all required fees. A first Office action issued January 21, 2002 with a three-month shortened statutory period; Thomas replied April 15, 2002; a final Office action issued September 12, 2002. Thomas filed a Notice of Appeal October 21, 2002 and an Appeal Brief April 18, 2003 with an extension petition. An Examiner’s Answer issued May 2, 2003, a Reply Brief was filed May 15, 2003, and the Board affirmed on September 17, 2003. A Notice of Allowance issued October 3, 2003, the Issue Fee was paid October 20, 2003, and the patent issued March 23, 2004. The Director determined that Thomas failed to engage in reasonable efforts to conclude prosecution from January 21, 2003 to April 18, 2003. Which of the following statements is most true?',
    options: [
      'Thomas is entitled to no patent term adjustment because the Patent Term Guarantee Act of 1999 does not apply to Thomas’ patent application.',
      'Although the Patent Term Guarantee Act of 1999 applies to Thomas’ application, Thomas forfeited any patent term adjustment by failing to engage in reasonable efforts to conclude prosecution of the application from January 21, 2003 to April 18, 2003.',
      'Thomas is entitled to a patent term adjustment of approximately two (2) months because the application was pending for more than three (3) years.',
      'By responding to the Notice to File Missing Parts approximately three (3) months after the deadline set by the USPTO, Thomas reduced any patent term adjustment by approximately three (3) months.',
      'Statements (A), (B), (C) and (D) are each incorrect.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). (A) is incorrect at least because the Patent Term Guarantee Act of 1999 applies to this application. (B) is incorrect because a failure to engage in reasonable efforts may REDUCE patent term adjustment but is not a complete forfeiture. 37 CFR 1.704(b). (C) is incorrect because the three-year period of § 1.702(b) does not include time consumed by Board review that was not favorable to applicant. 35 U.S.C. § 154(b)(1)(C). (D) is incorrect because any reduction is measured from an expected reply within three months of the Office action regardless of the deadline set — so the reduction would be approximately two months. 37 CFR 1.704(a); MPEP § 2730.',
  },
  {
    id: 'uspto-oct01-pm-15',
    topicId: 3,
    subtopic: 'Extension of Time for Filing an Appeal Brief (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In the facts set forth in connection with the preceding question, what, if any, extension of time was required by Thomas for filing an Appeal Brief on April 18, 2003?',
    options: [
      'A two-month extension of time was required.',
      'A three-month extension of time was required.',
      'A four-month extension of time was required.',
      'No extension of time was available and the Appeal Brief should have been rejected because it was filed more than six months after the final Office action issued.',
      'No extension of time was available and the Appeal Brief should have been rejected because it was filed more than six months after the Notice of Appeal was filed.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). An appeal brief was due two months after the filing of the Notice of Appeal. 37 CFR 1.192. The Notice of Appeal was filed October 21, 2002, so the Appeal Brief was initially due December 21, 2002 (effectively Monday, December 23). This non-statutory period could be extended under § 1.136(a). Since the brief was filed April 18, 2003, a four-month extension was required. (A) and (B) would extend only to February 18 and March 18. (D) is incorrect because the two-month period runs from the Notice of Appeal and the six-month statutory period does not apply. (E) is factually incorrect. [Historical practice — Board appeal rules moved to 37 CFR Part 41 in 2004.]',
  },
  {
    id: 'uspto-oct01-pm-16',
    topicId: 2,
    subtopic: 'Nonpublication Requests and Patent Term Adjustment (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In addition to the facts set forth in connection with the previous two questions, Thomas’ application had not and would not be the subject of an application filed in another country, or under a multilateral international agreement, that requires publication of applications eighteen months after filing. At the time he filed his application in the USPTO, Thomas submitted a nonpublication request and supporting materials that fully complied with all requirements for nonpublication of the application at 18 months. Which of the following statements is most correct?',
    options: [
      'Thomas may rescind his nonpublication request at any time.',
      'By requesting nonpublication of the application, Thomas “opted out” of the statutory framework for patent term adjustment and, therefore, no patent term adjustment is available.',
      'Submission of the nonpublication request does not affect any patent term adjustment that might be available to Thomas.',
      'Statements (A) and (C) are true.',
      'Statements (B) and (C) are true.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). Nonpublication of the application does not affect the patent term adjustment provisions of the Patent Term Guarantee Act of 1999 — the PTA provisions of 37 CFR 1.702 et seq. are separate and independent of the eighteen-month publication provisions — so statement (C) is true and there is no support for statement (B). An applicant may rescind a nonpublication request at any time, 37 CFR 1.213(b), so statement (A) is also true. Accordingly the best answer is (D).',
  },
  {
    id: 'uspto-oct01-pm-17',
    topicId: 1,
    subtopic: 'Factors for Determining Undue Experimentation (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] There are many factors to be considered when determining whether there is sufficient evidence to support a determination that a disclosure does not satisfy the enablement requirement and whether any necessary experimentation is “undue.” Which of the following are among the factors for determining whether necessary experimentation is “undue”?',
    options: [
      'The breadth of the claims.',
      'The nature of the invention.',
      'The state of the prior art.',
      'The level of one of ordinary skill.',
      '(A), (B), (C) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). MPEP § 2164.01(a). All four are among the Wands factors for determining whether experimentation is undue: the breadth of the claims, the nature of the invention, the state of the prior art, and the level of one of ordinary skill.',
  },
  {
    id: 'uspto-oct01-pm-18',
    topicId: 1,
    subtopic: 'Dependent Claim Form and Antecedent Basis (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Claims 1 and 2 in a patent application state the following: Claim 1. An apparatus for sitting comprising: (i) a square shaped base member; (ii) four elongated members mounted to the bottom of the base member; and (iii) a circular back member mounted to the base member. Claim 2. An apparatus as in claim 1, further comprising a spring connected to the back member and to the base member. Which, if any, of the following claims fully supported by the specification and presented in the application, is in accordance with USPTO rules and procedure?',
    options: [
      'Claim 3. An apparatus as in claim 1, wherein the base member is rectangularly shaped.',
      'Claim 3. An apparatus as in claim 2, wherein the wheels connected to each of the elongated members are plastic.',
      'Claim 3. An apparatus as in any of the preceding claims, in which the circular back member is wooden.',
      'Claim 3. An apparatus as in the preceding claims, further comprising a pressure-sensing device connected to the base member.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 608.01(n). (A) is incorrect because a dependent claim must further limit the subject matter of a previous claim, and "rectangularly shaped" is actually inconsistent with the "square shaped" base of claim 1. 37 CFR 1.75(c). (B) is incorrect because there is no antecedent basis for the wheels. MPEP § 2173.05(e). (D) is incorrect because it does not refer back in the alternative only. MPEP § 608.01(n). (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct01-pm-19',
    topicId: 0,
    subtopic: 'Jepson Claim Preambles as Admitted Prior Art (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In accordance with proper USPTO practice and procedure, which of the following statements is true?',
    options: [
      'Where sole patent applicant Able claims his invention in a Jepson-type claim, and the specification discloses that the subject matter of the preamble was invented by Baker before applicant’s invention, the preamble is properly treated as prior art.',
      'Where the sole patent applicant Able claims his invention in a Jepson-type claim, and the specification makes it clear that the claimed invention is an improvement on Able’s own prior invention, which Able discovered less than one year before the filing date of the application, the preamble in the claim is properly treated as prior art.',
      'Where the sole patent applicant Able claims his invention in a Jepson-type claim, and the specification makes it clear that the claimed invention is an improvement on an invention that Able discovered and publicly used and commercially sold by Able in Texas for several years before the filing date of the application, the preamble in the claim cannot properly be treated as prior art.',
      'Where the sole applicant, Baker, states that something is prior art, the statement can be taken as being admitted prior art only if corroborated by objective evidence proffered by Baker, or found by the examiner.',
      'No claim, including a Jepson-type claim, carries with it an implied admission that the elements in the preamble are old in the art.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is true, and thus the most correct answer. MPEP § 2129; In re Fout, 675 F.2d 297, 213 USPQ 532 (CCPA 1982). (B) is not true — an applicant’s own work discovered less than a year before filing is not prior art against him. Reading & Bates Constr. Co. v. Baker Energy Res. Corp., 748 F.2d 645 (Fed. Cir. 1984). (C) is not true because the admitted foundational discovery is a statutory bar. (D) is not true — an applicant’s statement that something is prior art may itself be taken as an admission. In re Nomiya, 184 USPQ 607 (CCPA 1975). (E) is not true — a Jepson claim does carry an implied admission that the preamble is old. In re Ehrreich, 590 F.2d 902 (CCPA 1979). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-20',
    topicId: 0,
    subtopic: 'Examiner Personal Knowledge, SIRs, and Statutory Bars (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is true?',
    options: [
      'In rejecting claims the examiner may rely upon facts within his own personal knowledge, unless the examiner qualifies as an expert within the art, in which case he is precluded from doing so, since only evidence of one of ordinary skill in the art is permitted.',
      'If an applicant desires to claim subject matter in a reissue which was the same subject matter waived in the statutory invention registration of another, the applicant is precluded by the waiver from doing so, even though the applicant was not named in the statutory invention registration.',
      'If an applicant, knowing that the subject matter claimed in his patent application was on sale in Michigan and sales activity is a statutory bar under 35 U.S.C. § 102(b) to the claims in his application, nevertheless withholds the information from the patent examiner examining the application, and obtains a patent including the claims in question, the applicant may remove any issue of inequitable conduct by filing a request for reexamination based on the sales activity.',
      'An applicant for a patent may overcome a statutory bar under 35 U.S.C. §102(b) based on a patent claiming the same invention by acquiring the rights to the patent pursuant to an assignment and then asserting the assignee’s right to determine priority of invention pursuant to 37 CFR 1.602.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The best answer is (E). (A) is incorrect since facts within the knowledge of the examiner may be used whether or not the examiner qualifies as an expert. 37 CFR 1.104(c)(3). (B) is incorrect since a statutory invention registration waiver is effective only against those named in it. (C) is incorrect since on-sale activity is not proper subject matter for reexamination, and inequitable conduct cannot be resolved or absolved by reexamination. (D) is incorrect since a statutory bar cannot be overcome by acquiring the patent. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-21',
    topicId: 3,
    subtopic: 'Petitions to Make Special — 37 CFR 1.102 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] An application, filed September 20, 2001, has not yet been examined. All claims in the application are drawn to a single invention. Which of the following, submitted (independently of each other) by a registered practitioner of record with an otherwise proper petition to make the application special, properly results in the application being advanced out of turn for examination?',
    options: [
      'A statement under 37 CFR 1.102 explaining how the invention contributes to the restoration of the basic life-sustaining elements to enhance the quality of the environment, without the petition fee set forth in 37 CFR 1.17(h).',
      'A search made by a foreign patent office, one copy each of the references deemed most closely related to the subject matter encompassed by the claims, a detailed discussion of the references that points out with the particularity required by 37 CFR 1.111(b) and (c) how the claimed subject matter is patentable over the references, and the petition fee set forth in 37 CFR 1.17(h).',
      'A doctor’s certificate demonstrating that the applicant’s health is such that he might not be available to assist in the prosecution of the application if it were to run its normal course, without the petition fee set forth in 37 CFR 1.17(h).',
      'A birth certificate showing that applicant is 65 years of age, without the petition fee set forth in 37 CFR 1.17(h).',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. Each option is supported by 37 CFR 1.102: (A) MPEP § 708.02(V) (environmental quality — no fee); (B) MPEP § 708.02(VIII) (special examination with a search and detailed discussion, with fee); (C) MPEP § 708.02(III) (applicant’s health — no fee); (D) MPEP § 708.02(IV) (applicant’s age — no fee).',
  },
  {
    id: 'uspto-oct01-pm-22',
    topicId: 1,
    subtopic: 'Written Description — Evidence of Lack of Possession (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] To satisfy the written description requirement of the first paragraph of 35 U.S.C. § 112, an applicant must show possession of the invention. An applicant’s lack of possession of the invention may be evidenced by:',
    options: [
      'Original claims which recite an essential feature where the feature is not described in the specification or the claims, and is not conventional in the art or known to one of ordinary skill in the art.',
      'A specification of a patent application that describes the claimed invention with all of its limitations using such descriptive means as words, structures, figures, diagrams, and formulas that fully set forth the claimed invention.',
      'A specification of a patent application that describes an actual reduction to practice of the claimed invention.',
      'An amendment to a claim seeking to add a limitation that is supported in the specification through implicit or inherent disclosure.',
      'An amendment to a claim seeking to correct an obvious error by the appropriate correction.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is the most correct answer. Per the "Written Description" Guidelines, 66 F.R. 1099, 1105 (Jan. 5, 2001): "The claimed invention as a whole may not be adequately described if the claims require an essential or critical feature that is not described in the specification and is not conventional in the art or known to one of ordinary skill in the art"; MPEP § 2163(I)(A). (B) and (C) each describe ways of SHOWING possession, not lacking it. (D) is not correct — newly added limitations may be supported through express, implicit or inherent disclosure. (E) is not correct — an amendment correcting an obvious error does not constitute new matter where one skilled in the art would recognize both the error and the correction.',
  },
  {
    id: 'uspto-oct01-pm-23',
    topicId: 7,
    subtopic: 'Authority to Conduct an Examiner Interview (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Greene is a registered patent agent employed by an intellectual property law firm located in Arlington, Virginia. Greene is awakened at 5:30 AM one morning by a frantic call from Whyte, a senior partner at the law firm. Whyte informs Greene that Whyte has an examiner interview scheduled for 3:00 PM that day in connection with an important patent application Whyte is handling. However, a family emergency arose during the night and Whyte will not be able to attend the interview. It is also the last day of the statutory six-month period for reply, so the interview cannot be rescheduled. Whyte requests that Greene conduct the examiner interview for Whyte and, based on the outcome of the interview, file appropriate papers with the Patent Office. Whyte tells Greene exactly where Greene can locate the file in Whyte’s office. Greene has not been given a power of attorney in the application, but has been given a power to inspect the Patent Office file for the application. Assuming Greene has adequate time to prepare for the interview and will competently represent the applicant, which of the following statements is true?',
    options: [
      'Greene must obtain either a written power of attorney from the applicant or a written associate power of attorney from Whyte before Greene can participate in the examiner interview.',
      'Greene can participate in the interview if Greene brings along a copy of the application file and states to the examiner that Greene is authorized to represent the applicant.',
      'Greene cannot participate in the examiner interview because Greene does not have an express power of attorney and has not previously made an appearance in the application.',
      'A mere power to inspect is sufficient authority for an examiner to grant an interview involving the merits of an application.',
      'Statements (B) and (D) are true.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). MPEP § 713.05. Statements (A) and (C) are incorrect because Greene may participate in the interview if he possesses a copy of the application file and states that he is authorized to represent the applicant. (D) is incorrect because a mere power to inspect is INSUFFICIENT authority for an examiner to grant an interview involving the merits of an application. (E) is therefore also incorrect.',
  },
  {
    id: 'uspto-oct01-pm-24',
    topicId: 3,
    subtopic: 'Protests Under 37 CFR 1.291 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Pete wants to file a protest against a patent application filed by a coworker. In the locker room at his place of employment, Pete overheard Sol talking about an application for a golf ball retriever. Pete feels that the invention strongly resembles a golf ball retriever device published in a 1995 edition of Popular Golf magazine. Pete comes to you to file a protest. Pete wants to know if it will be considered by the examiner, and if the applicant (Sol) is required to respond. Which of the following is not accurate with respect to proper USPTO procedure in relation to applications filed on or after January 1, 2001?',
    options: [
      'Pete’s protest against Sol’s pending application will be referred to the examiner having charge of the subject matter involved provided Pete can adequately identify the application. Protests that do not adequately identify a pending patent application will be returned to the protestor and will not be further considered by the Office.',
      'Pete’s protest, provided it adequately identifies Sol’s application, will be entered in the application file if: (1) the protest is submitted prior to the date the application was published or the mailing of a notice of allowance under § 1.311, whichever occurs first; and (2) the protest is either served upon Sol in accordance with § 1.248, or filed with the Office in duplicate in the event service is not possible.',
      'If Pete submits evidence that his wife gave Sol a copy of the Popular Golf article and contends that Sol fraudulently copied the device from that disclosed in the article, the examiner will generally not comment on the issues related to fraud.',
      'Pete’s protest, provided it adequately identifies Sol’s application and is submitted prior to the date the application was published or the mailing of a notice of allowance under § 1.311, and which is either served upon Sol in accordance with § 1.248, or filed with the Office in duplicate in the event service is not possible, will be considered by the Office if the application is still pending when the protest and application file are brought before the examiner, and the protest includes: (1) a listing of the patents, publications, or other information relied upon; (2) a concise explanation of the relevance of each listed item; (3) a copy of each listed patent or publication or other item of information in written form or at least the pertinent portions thereof; and (4) an English language translation of all the necessary and pertinent parts of any non-English language patent, publication, or other item of information in written form relied upon.',
      'If Pete files the protest before the final office action, Sol has a duty to respond to the issues raised by Pete’s protest even in the absence of a request by the USPTO for comments. If such issues are not addressed, the issues will be deemed admitted.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 37 CFR 1.291(c) — in the absence of a request by the Office, an applicant has no duty to, and need not, reply to a protest. (A) contains portions of the elements of § 1.291(a) & (b); (B) portions of § 1.291(a); (C) portions of § 1.291(a) & (b); and (D) portions of § 1.291(a) & (b).',
  },
  {
    id: 'uspto-oct01-pm-25',
    topicId: 3,
    subtopic: 'When an RCE May Be Filed (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In accordance with USPTO rules and procedure, in which of the following situations may an applicant file a request on or after August 16, 2000 for continued examination of a non-provisional utility patent application with an earliest effective filing date of March 15, 1999?',
    options: [
      'The last Office action is a notice of allowance, the issue fee has been paid, and no petition to withdraw the application from issue has been granted.',
      'The last Office action is a final action and the application is abandoned.',
      'The last Office action is a non-final Office action containing a rejection of all claims under 35 U.S.C. § 102(b), and the applicant has filed no reply.',
      'The last Office action is a notice of allowance, and after four months from the date of the notice of allowance, the issue fee has not been paid.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. 37 CFR 1.114; MPEP § 706.07(h). (A) and (B) are each incorrect because an applicant may request continued examination only "prior to the earliest of: (1) Payment of the issue fee, unless a petition under § 1.313 is granted; (2) Abandonment of the application …" § 1.114(a). (C) is incorrect because prosecution is not closed. § 1.114(b). (D) is incorrect because the application is abandoned for failure to pay the issue fee. § 1.316.',
  },
  {
    id: 'uspto-oct01-pm-26',
    topicId: 3,
    subtopic: 'Certificate of Mailing With an RCE to Avoid Abandonment (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In a non-provisional utility patent application filed January 12, 1999, the examiner sends Applicant a final Office action dated February 14, 2001, rejecting claim 1 under 35 U.S.C. § 102(a), and objecting as to the form of claims 2 through 10. The examiner sets a three-month shortened statutory period for reply. According to USPTO rules and procedure, which of the following by Applicant ensures that the application does not go abandoned on Wednesday, August 15, 2001?',
    options: [
      'Mailing to the USPTO, using a certificate of mailing under 37 CFR 1.8, dated August 14, 2001, a petition and fee for an extension of three months, a request for a continued prosecution application, and the fee for a request for a continued prosecution application. The foregoing is received by the USPTO on August 17, 2001.',
      'Mailing to the USPTO, using a certificate of mailing under 37 CFR 1.8, dated August 14, 2001, a petition and fee for an extension of three months, a request for continued examination with a submission that meets the reply requirements of 37 CFR 1.111, and the fee for a request for continued examination. The foregoing is received by the USPTO on August 17, 2001.',
      'Mailing to the USPTO, using a certificate of mailing under 37 CFR 1.8, dated August 14, 2001, a petition and fee for an extension of three months. The foregoing is received by the USPTO on August 17, 2001. Also, telephoning the examiner on August 14, 2001 to discuss the rejections of claims in the final Office action, but without reaching an agreement with the examiner.',
      'Mailing to the USPTO a petition and fee for an extension of three months, a request for continued examination with a reply that states, “Applicant requests that objections as to form be held in abeyance until allowable subject matter is indicated, at which time Applicant will reply to the rejection of claim 1,” and the fee for a request for continued examination. The foregoing is received by the USPTO on August 14, 2001.',
      'Each of items (A), (B), (C) and (D) would ensure that the application does not go abandoned on Wednesday, August 15, 2001.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the correct answer. 37 CFR 1.8 and 1.114; MPEP § 706.07(h)(I). Prosecution is closed because the last Office action is final (§ 1.114(b)); the submission in (B) meets the reply requirements of § 1.111, so under § 1.114(d) the Office will withdraw finality and enter it — and an RCE IS entitled to the benefit of a certificate of mailing under § 1.8. (A) is incorrect because a CPA is not entitled to a certificate of mailing (§ 1.8(a)(2)(i)(A)), and filing one expressly abandons the prior application (§ 1.53(d)(2)(v)). (C) is incorrect because a telephone call does not meet § 1.111 — all business must be in writing (§ 1.2). (D) is incorrect because the reply does not answer the rejection of claim 1. (E) is incorrect because (A), (C) and (D) are. [Historical practice — CPA practice for utility applications ended in 2003.]',
  },
  {
    id: 'uspto-oct01-pm-27',
    topicId: 2,
    subtopic: 'Who May Sign a Declaration and Access Application Files (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Mary, a legally competent adult inventor, filed provisional application A on January 3, 2000, a nonprovisional application B one year later on January 3, 2001, and nonprovisional application C on February 28, 2001. Nonprovisional application B was abandoned when nonprovisional application C was filed. The provisional application and both nonprovisional patent applications were in Mary’s name only, but a declaration has not yet been filed. Mary is living on a remote island in the middle of the Arctic Ocean where the only communication is in the summer months. Sam, the father of Mary, has been authorized by Mary to sign Mary’s name to the § 1.63 declaration and also Sam’s name. Sam, unbeknownst to Mary, also wants access to all three application files at the USPTO before he files the declaration to make certain Mary has properly described her invention. Sam acknowledges he is not an inventor but insists he must sign as an inventor so that he may act on behalf of Mary. Which of the following is not in accordance with proper USPTO procedure in relation to applications filed on or after January 1, 2001?',
    options: [
      'Sam may not add his name as an inventor since a patent is applied for only in the name or names of the actual inventor or inventors.',
      'Since no declaration was filed during the pendency of application B, Sam may not see the Application papers for application B since he has not been authorized by Mary to see the application A and Sam is not an inventor.',
      'Sam is not entitled to access to the provisional application A since he has not been authorized by Mary to see the application A and Sam is not an inventor.',
      'Sam is precluded from access to the Application B since his name does not appear on the application papers and Sam is not an inventor.',
      'Sam may sign Mary’s name to the declaration since he was authorized by Mary to do so.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is incorrect — and is therefore the answer — since an oath or declaration must be MADE by the inventor in accordance with 37 CFR 1.64; the word "made" implies signing or executing personally. See 37 CFR 1.41(c). (A) contains the elements of § 1.41(a). As to (B), where no § 1.63 declaration is filed the inventorship is that set forth in the application papers, and Mary has not authorized Sam to inspect application B. Statement (C) accords with § 1.41(a)(2) and (D) with § 1.41(a)(3) — Mary did not authorize Sam to inspect the applications.',
  },
  {
    id: 'uspto-oct01-pm-28',
    topicId: 0,
    subtopic: '35 U.S.C. 102(d) and the CIP Break in the Priority Chain (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] In which of the following instances is the reference properly available as prior art under 35 U.S.C § 102(d)?',
    options: [
      'A U.S. patent application is filed within the one year anniversary date of the filing date of the foreign application. The reference is the foreign application.',
      'The applicant files a foreign application, later timely files a U.S. application claiming priority based on the foreign application, and then files a continuation-in-part (CIP) application, and the claims in the CIP are not entitled to the filing date of the U.S. parent application. The foreign application issues as a patent before the filing date of the CIP application and is used to reject the claims directed to the added subject matter under 35 U.S.C. §§ 102(d)/103. The reference is the foreign application.',
      'The applicant files a foreign application, and later timely files a U.S. application claiming priority based on the foreign application. The examined foreign application has been allowed by the examiner and has not been published before the U.S. application was filed. The reference is the foreign application.',
      'The reference is a defensive publication.',
      'All of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). 35 U.S.C. § 102(d); MPEP § 2135.01 ("A Continuation-In-Part Breaks The Chain Of Priority As To Foreign As Well As U.S. Parents"). Where the CIP claims are not entitled to the U.S. parent’s date, the effective filing date is the CIP’s own filing date and the applicant gets the benefit of neither the U.S. parent nor the foreign application. In re van Langenhoven, 173 USPQ 426 (CCPA 1972). (A) is incorrect — the U.S. filing is within the year. (C) is not correct — an application must ISSUE into a patent before it can be applied under § 102(d). Ex parte Fujishiro, 199 USPQ 36 (Bd. App. 1977). (D) is not correct — defensive publications are not prior art as of their filing date. (E) is not correct inasmuch as (A), (C) and (D) are not. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-29',
    topicId: 2,
    subtopic: 'Fees — RCE, Certificates of Mailing, and Conversion (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is in accordance with proper USPTO practice and procedure?',
    options: [
      'A Certificate of Mailing or Transmission under 37 CFR 1.8 is proper for filing a Continued Prosecution Application under 37 CFR 1.53(d) to obtain the date of the Certificate as the filing date for the application.',
      'The fee an applicant must pay to request continued examination of an application is set in an amount equal to the basic filing fee the same applicant must pay for a utility patent application.',
      'The Office does not charge a fee for processing a fee paid by a check that has been refused, i.e., dishonored and returned, by a financial institution.',
      'To first request conversion of a provisional application containing a claim to a nonprovisional application after the provisional application has become abandoned, a petition to revive, accompanied by the appropriate fees, a showing of unavoidable delay, and a request for the conversion must be filed within one year of the date of abandonment.',
      'The conversion of a provisional application, for which a basic filing fee was properly paid, to a nonprovisional application will result in the savings of filing and other fees over the filing of a nonprovisional application claiming the benefit under 35 U.S.C. § 119(e) and 37 CFR 1.78 of the earlier provisional filing date.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. 37 CFR 1.16(a) and 1.17(e) — the RCE fee equals the basic filing fee for an original patent application. (A) is not correct — § 1.8(a)(2)(i)(A) excludes from the certificate-of-mailing benefit "the filing of a national patent application specification and drawing … for the purpose of obtaining an application filing date, including a request for a continued prosecution application under § 1.53(d)." (C) is not correct; § 1.21(m). (D) is not correct — § 1.53(c)(3) requires the conversion petition before the earlier of abandonment or twelve months from the provisional filing date. (E) is not correct — a properly paid provisional basic filing fee is not applied to the nonprovisional fees on conversion. [Historical practice — CPA practice ended in 2003.]',
  },
  {
    id: 'uspto-oct01-pm-30',
    topicId: 2,
    subtopic: 'Calculating a Small Entity Fee Deficiency (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] You file a nonprovisional patent application in the USPTO on December 27, 1999, on behalf of your client. On the basis of information provided to you, you assert entitlement to small entity status and pay the small entity status basic filing fee of $345. On December 27, 2000, a first Office action is mailed. You file a reply to the Office action on February 2, 2001, accompanied by an Information Disclosure Statement (IDS) and the required fee of $240 for filing the IDS at such time. You now learn that the small entity status was erroneous at the time it was established, although it was established in good faith, and the deficiency resulting from the previous erroneous payment must be paid. The Basic Fee at time of payment was $690.00 (other than small entity) / $345.00 (small entity); the IDS Fee at time of payment was $240.00 for both; the Current Basic Fee is $710.00 / $355.00; and the Current IDS Fee is $180.00 for both. In accordance with USPTO proper practice and procedure, which of the following is the proper deficiency amount?',
    options: ['$365.00', '$355.00', '$305.00', '$295.00', '$335.00'],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A) is correct and (B), (C), (D) and (E) are wrong. 37 CFR 1.28(c)(2)(i): "The deficiency owed for each previous fee erroneously paid as a small entity is the difference between the current fee amount (for other than a small entity) on the date the deficiency is paid in full and the amount of the previous erroneous (small entity) fee payment." The current basic fee of $710 for other than a small entity, less the previously paid small entity basic fee of $345, is a deficiency of $365. There was no error in the previously paid IDS fee, since $240 was the proper amount at the time of payment for either entity, so the IDS fee does not enter the calculation.',
  },
  {
    id: 'uspto-oct01-pm-31',
    topicId: 3,
    subtopic: 'Time for Appeal After a Request for Rehearing (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Zak had expended a considerable amount of money, time, and effort in the pursuit of patent protection for an invention that he had conceived of many years before. His attorney informed him that the Board of Patent Appeals and Interferences (“BPAI”) issued a decision on February 19, 2001, affirming the examiner’s rejection of all the claims in his application. Zak didn’t even think twice when he directed his attorney to immediately file a Request for Rehearing or Reconsideration. Assuming action on the Request for Rehearing or Reconsideration is unfavorable to Zak, which of the following options is available to Zak?',
    options: [
      'File a Notice of Appeal to the Court of Appeals of the Federal Circuit (“CAFC”) within 6 months of the BPAI decision, accompanied by a request for extension of time under 37 CFR 1.136 and the appropriate fee.',
      'File a Notice of Appeal to the U.S. District Court of the District of Columbia (“DDC”) within 5 months of the BPAI decision, accompanied by a request for extension of time under 37 CFR 1.136 and the appropriate fee.',
      'File a Notice of Appeal to the Court of Appeals of the Federal Circuit (“CAFC”) within 6 months after action on the Request for Rehearing or Reconsideration, accompanied by a request for extension of time under 37 CFR 1.136 and the appropriate fee.',
      'File a Notice of Appeal to the U.S. District Court of the District of Columbia (“DDC”) within 5 months after action on the Request for Rehearing or Reconsideration, accompanied by a request for extension of time under 37 CFR 1.136 and the appropriate fee.',
      'File a Notice of Appeal to the U.S. District Court of the District of Columbia (“DDC”) within 2 months after action on the Request for Rehearing or Reconsideration.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because the statement is supported by 37 CFR 1.304(a)(1). (A), (B), (C) and (D) are wrong because § 1.304(a)(1) and MPEP § 1216 set the time period for appeal at 2 months from the BPAI decision or from action on the request, and § 1.304(a)(2) provides that this 2-month period is NOT subject to the extension provisions of 37 CFR 1.136. [Historical practice — the Board and its review provisions were restructured after 2004.]',
  },
  {
    id: 'uspto-oct01-pm-32',
    topicId: 3,
    subtopic: 'Issue Fee Timing, Prior Art Citations, and Priority Claims (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is true?',
    options: [
      'Once the issue fee has become due, provided an original application has not been pending more than three years, the applicant may request and the Office may grant a request for deferral of payment of the issue fee.',
      'The time period set for the payment of the issue fee is statutory and cannot be extended. However, if payment is not timely made and the delay in making the payment is shown to be unavoidable, upon payment of a fee for delayed payment, it may be accepted as though no abandonment had occurred, but there will be a reduction on the patent term adjustment for the period of abandonment.',
      'Upon written request, a person citing patents and printed publications to the Office that the person believes has a bearing on the patentability of a particular patent, may request that his or her name remain confidential.',
      'To obtain benefit of priority based on an earlier filed patent application, an applicant in a later filed continuation application is not required to claim priority under 35 U.S.C. § 120 to an earlier filed application.',
      'Each of statements (B) and (C) is true.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). As to (B), see 35 U.S.C. §§ 151, 154(b)(2)(ii) and (iii); 37 CFR 1.704(c)(3); MPEP § 1306. As to (C), see MPEP §§ 2203 and 2212 — a person citing prior art under 35 U.S.C. § 301 may request that their name be kept confidential. As to (D), the statement is not true as written: a priority claim is not REQUIRED, since a person may choose not to claim it in order to increase the term of the patent — but that does not make it a way to OBTAIN the benefit. As to (A), deferral under 37 CFR 1.103 is not available following the notice of allowance. Since (B) and (C) are correct, (E) is the best answer.',
  },
  {
    id: 'uspto-oct01-pm-33',
    topicId: 0,
    subtopic: 'Traversing a 102(d) Rejection That Lacks Anticipation (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Applicant Sonny filed a patent application having an effective U.S. filing date of February 15, 2000, claiming: Claim 1. An apparatus for converting solar energy into electrical energy comprising: (i) a metallic parabolic reflector; (ii) a steam engine having a boiler located at the focal point of the metallic parabolic reflector; and (iii) an electrical generator coupled to the steam engine. In a non-final Office action dated March 15, 2001, the examiner rejects claim 1 under 35 U.S.C. § 102(d) as anticipated by a patent granted in a foreign country to Applicant Sonny (“Foreign patent”). The Foreign patent was filed February 1, 1999, and was patented and published on January 17, 2000. The examiner’s rejection points out that the invention disclosed in the Foreign patent is a glass lens with a steam engine having a boiler at the focal point of the glass lens, and an electrical generator coupled to the steam engine. The rejection states that the examiner takes official notice that it was well known by those of ordinary skill in the art of solar energy devices, prior to Applicant Sonny’s invention, to use either a lens or a parabolic reflector to focus solar rays. Sonny informs you that you should not narrow the scope of the claims unless absolutely necessary to overcome the rejection. Which of the following, in reply to the Office action dated March 15, 2001, is best?',
    options: [
      'Traverse the rejection arguing that the examiner’s use of the Foreign patent is improper because an applicant cannot be barred by a foreign patent issued to the same applicant.',
      'Amend claim 1 to further include a feature that is disclosed only in the U.S. application, and point out that the newly added feature distinguishes Sonny’s invention over the invention in the Foreign patent.',
      'Traverse the rejection arguing that the examiner does not create a prima facie case of obviousness because the examiner does not show why one of ordinary skill in the art of solar energy devices would be motivated to modify the Foreign patent.',
      'Traverse the rejection arguing that the examiner’s rejection under 35 U.S.C. § 102(d) was improper because claim 1 is not anticipated by the Foreign patent.',
      'Traverse the rejection arguing that it was not well known to use either a lens or a parabolic reflector to focus solar rays, and submit an affidavit under 37 CFR 1.132.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. MPEP § 706.02 points out the distinction between rejections under 35 U.S.C. §§ 102 and 103: for anticipation under § 102 the reference must teach every aspect of the claimed invention either explicitly or impliedly — and the Foreign patent discloses a glass lens, not the claimed metallic parabolic reflector. (A), (B), (C) and (E) each fail to address the lack of anticipation. (A) is further incorrect because an applicant CAN be barred under § 102(d). (B) is further incorrect because the facts do not require such an amendment. (C) is further incorrect because a prima facie case of obviousness is not necessary in a § 102 rejection. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-34',
    topicId: 1,
    subtopic: 'Dependent Claim That Fails to Further Limit (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following claims, if fully disclosed and presented in Sonny’s U.S. application (claim 1 being an apparatus comprising a metallic parabolic reflector, a steam engine having a boiler at the focal point, and an electrical generator coupled to the steam engine), provides a proper basis for an objection under 37 CFR 1.75(c)?',
    options: [
      'Claim 2. An apparatus as in claim 1, further comprising a voltage regulator coupled to the electrical generator.',
      'Claim 2. An apparatus as in claim 1, wherein the metallic parabolic reflector is aluminum.',
      'Claim 2. An apparatus as in claim 1, wherein the steam engine has two cylinders.',
      'Claim 2. An apparatus as in claim 1, wherein the parabolic reflector is either metallic or plastic.',
      'Claim 2. An apparatus as in claim 1, further comprising an electronic pressure sensor coupled to the steam engine.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer because it is a dependent claim which fails to further limit the subject matter of claim 1 — it seeks to REMOVE the limitation that the parabolic reflector is metallic by allowing plastic. MPEP § 608.01(n)(II); 37 CFR 1.75(c). (A), (B), (C) and (E) are incorrect because each of these claims further limits claim 1 and therefore does not support an objection under § 1.75(c).',
  },
  {
    id: 'uspto-oct01-pm-35',
    topicId: 3,
    subtopic: 'Third-Party Submissions in Published Applications — 37 CFR 1.99 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Tony, a client, comes to you with regard to a competitor’s two published patent applications, A and B, which were published one month ago. Tony shows you several material prior art publications and patents that he discovered for the first time while cleaning out his brother-in-law’s attic last week. Assume no Notice of Allowance has been mailed in application A and a Notice of Allowance has been mailed in application B. Tony wants to know if it is too late to submit the information to the USPTO for consideration by the examiner. He also wants to know how it is accomplished, if the applicant needs to be served a copy, whether a fee is required and whether an explanation is needed for each reference. Which of the following is not accurate with respect to proper USPTO procedure?',
    options: [
      'The submission by Tony of patents or publications relevant to pending published application A will be permitted without the necessity of paying the processing or petition fee required by 37 CFR 1.17(i) if the patents or publications are submitted within two months of the publication of the competitor’s application.',
      'Each submission must identify the application to which it is directed by application number and include: (1) the appropriate fee set forth in 37 CFR 1.17(p); (2) a list of the patents or publications submitted for consideration by the Office, including the date of publication of each patent or publication; (3) a copy of each listed patent or publication in written form or at least the pertinent portions; and (4) an English language translation of all the necessary and pertinent parts of any non-English language patent or publication in written form relied upon.',
      'The submissions by Tony of patents or publications relevant to both of the pending published applications A and B need not be served upon the applicant.',
      'The submissions by Tony of patents or publications relevant to the pending published applications A and B shall not include any explanation of the patents or publications, or any other information.',
      'The submission by Tony of patents or publications relevant to pending published application B will be permitted only if accompanied by the processing fee as set forth in 37 CFR 1.17(i).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 CFR 1.99(c) requires service on the applicant: "[t]he submission under this section must be served upon the applicant in accordance with § 1.248." (A) contains all of the elements of § 1.99(a); (B) all of the elements of § 1.99(b); (D) all of the elements of § 1.99(d); and (E) all of the elements of § 1.99(e).',
  },
  {
    id: 'uspto-oct01-pm-36',
    topicId: 1,
    subtopic: 'Indefinite Limitations Must Still Be Considered (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Upon examination of your client’s patent application, the patent examiner is considering whether and what rejections to apply to the claims. One or more of the limitations in the claims is indefinite or lacks supporting disclosure. The examiner may not properly take which of the following actions or inactions?',
    options: [
      'If the claim is subject to plural interpretations due to a limitation being indefinite, the examiner may disregard any possibility of multiple interpretations.',
      'If a claim is subject to more than one interpretation due to a limitation being indefinite, at least one of which would render the claim unpatentable over the prior art, the examiner should reject the claim as indefinite under 35 U.S.C. § 112, second paragraph, and should reject the claim over the prior art based on the interpretation of the claim that renders the prior art applicable.',
      'If no reasonably definite meaning can be ascribed to certain claim language, the examiner should reject the claim as indefinite under 35 U.S.C. § 112, second paragraph, and not reject the claim as obvious.',
      'When evaluating claims for obviousness under 35 U.S.C. § 103, all the limitations of the claims, including new matter lacking supporting disclosure in the originally filed specification, must be considered and given weight.',
      '(C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). MPEP § 2143.03 ("Indefinite Limitations Must Be Considered") — the examiner may not simply disregard the possibility of multiple interpretations. (B) is proper procedure. Ex parte Ionescu, 222 USPQ 537 (Bd. Pat. App. & Inter. 1984). (C) is proper procedure — if no reasonably definite meaning can be ascribed, the claim is indefinite, not obvious. In re Wilson, 165 USPQ 494 (CCPA 1970). (D) is proper procedure. Ex parte Grasselli, 231 USPQ 393 (Bd. App. 1983). (E) is incorrect because the examiner may properly take the actions in (B), (C) and (D).',
  },
  {
    id: 'uspto-oct01-pm-37',
    topicId: 1,
    subtopic: 'Essential Elements, Best Mode, and 112 (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is true?',
    options: [
      'A claim to a process omitting a step in a disclosed process, where the step is disclosed in the specification to be essential to the invention, may not be properly rejected under 35 U.S.C. § 112, first paragraph, for lack of enablement where the specification provides an enabling disclosure only for the process which includes the essential step.',
      'Failure to disclose the best mode must rise to the level of active concealment or grossly inequitable conduct in order to support a rejection under 35 U.S.C.§ 112, first paragraph.',
      'A claim failing to interrelate essential elements of the invention, as defined by the applicant in the specification, where the interrelation is critical to the invention may be properly rejected under 35 U.S.C. § 112, second paragraph, for failure to properly point out and distinctly claim the invention.',
      'Where the best mode contemplated by the inventor at the time of filing the application is not disclosed, a proposed amendment adding a specific mode of practicing the invention would not be new matter.',
      'The best mode requirement is the same as the enablement requirement of the first paragraph of 35 U.S.C. § 112.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. MPEP § 2172.01: "a claim which fails to interrelate essential elements of the invention as defined by applicant(s) in the specification may be rejected under 35 U.S.C. 112, second paragraph." In re Venezia, 530 F.2d 956 (CCPA 1976). (A) is incorrect — a claim omitting matter disclosed to be essential may be rejected under § 112, first paragraph, as not enabling. In re Mayhew, 527 F.2d 1229 (CCPA 1976). (B) is incorrect — failure to disclose the best mode need NOT rise to active concealment. MPEP § 2165. (D) is incorrect — such an amendment is new matter and cannot cure the defect. In re Hay, 534 F.2d 917 (CCPA 1976). (E) is incorrect — best mode is separate and distinct from enablement. In re Newton, 414 F.2d 1400 (CCPA 1969).',
  },
  {
    id: 'uspto-oct01-pm-38',
    topicId: 0,
    subtopic: 'Measuring the One-Year Statutory Bar (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Your clients, Able and Baker, filed a patent application. In accordance with proper USPTO practice and procedure, in which of the following instances, absent additional facts, is the reference or event either prior art or an act that may not be properly applied to reject claims in your client’s application?',
    options: [
      'The patent application was filed on Tuesday, June 26, 2001 in the USPTO. The reference is an article in a trade magazine published on November 10, 2000. Able, Baker and McGeiver are the authors of the article. The article fully discloses the claimed invention and how to make and use it.',
      'The patent application was filed on Monday, June 25, 2001 in the USPTO. Able and Baker placed the invention on sale in the United States on Monday, June 26, 2000. The public came into possession and understands the invention the day it is placed on sale. Your clients have disclosed this information when they filed the application.',
      'The patent application was filed on Monday, June 25, 2001, in the USPTO. McGeiver, a friend of Baker, publicly used the invention in Hawaii on April 15, 2000. The public use was not experimental and was without Baker’s knowledge or consent. The public came into possession of the invention the day it was used by McGeiver.',
      'The patent application was filed on Monday, June 25, 2001, in the USPTO. The invention became known to the public in the United States in April 2000 as a result of disclosure on the Internet by Wilson, a party unknown to Able and Baker. The invention was not placed on sale or in public use prior to the filing date of the application.',
      'More than one year prior to the filing in the USPTO of a patent application on Monday, June 25, 2001, in the USPTO, the invention, a machine, was used secretly by John, another inventor, to make a product. The details of the invention are ascertainable by inspection or analysis of the product made by John that was sold and publicly displayed.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (B). 35 U.S.C. § 102(b). The on-sale activity by the inventors was not a statutory bar since the one-year anniversary ends on Tuesday, June 26, 2001 — after the June 25 filing. (A) is prior art under § 102(a) as a reference "by others" (Able, Baker and McGeiver is a different entity than Able and Baker). MPEP § 2132; In re Katz, 215 USPQ 14 (CCPA 1982). (C) is a § 102(b) public-use bar measured from the U.S. filing date. Egbert v. Lippmann, 104 U.S. 333 (1881). (D) is public knowledge providing grounds under § 102(a). (E) is a bar — a "secret" use of a machine to make a product is public if the machine’s details are ascertainable from the product sold or displayed. Gillman v. Stern, 46 USPQ 430 (2d Cir. 1940). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-39',
    topicId: 2,
    subtopic: 'Small Entity Status — The RCE Fee (Official Oct 2001)',
    difficulty: 2,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A grant of small entity status entitles an applicant to which of the following?',
    options: [
      'Applicant will receive an accelerated examination by having the application advanced out of order.',
      'Applicant can use a certificate of mailing under 37 CFR 1.8 to obtain a U.S. filing date that is earlier than the actual USPTO receipt date of the application.',
      'Applicant will obtain a refund of all fees paid to the USPTO where applicant demonstrates: (i) a changed purpose for which the fees were paid, (ii) the fees were not paid by mistake, and (iii) the fees were not paid in excess of the amount required.',
      'Applicant can pay a fee to file a request for continued examination pursuant to 37 CFR 1.114 that is less than the fee paid by other than a small entity.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D) is the correct answer. 35 U.S.C. § 41(h)(1); 37 CFR 1.17(e) and § 1.114; MPEP § 509.02 — the RCE fee is subject to the small entity reduction. (A) is incorrect because there is no support for it in 37 CFR 1.102. (B) is incorrect because there is no support for it in 37 CFR 1.8. (C) is incorrect because it is inconsistent with 35 U.S.C. § 42(d) and 37 CFR 1.26. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-oct01-pm-40',
    topicId: 2,
    subtopic: 'Provisional Conversion and Patent Term (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following is not in accordance with proper USPTO practice and procedure?',
    options: [
      'Conversion of a provisional application to a nonprovisional application will result in the term of any patent to issue from the application being measured from at least the filing date of the provisional application.',
      'Conversion of a provisional application to a nonprovisional application cannot adversely impact on the term of any patent to issue from the application.',
      'An applicant having filed a provisional application can avoid any adverse patent term impact resulting from converting the provisional application to a nonprovisional application by instead filing a nonprovisional application claiming the benefit of the provisional application under 35 U.S.C. § 119(e).',
      'An applicant filing nonprovisional application claiming the benefit under 35 U.S.C. § 119(e) and 37 CFR 1.78 of the earlier provisional application, and not requesting conversion of the provisional to the nonprovisional application can avoid the fee required to convert a provisional application to a nonprovisional application, as well as any adverse patent term effect that would result from a conversion.',
      'The twelve month period of pendency of a provisional application extends to the next secular or business day which is not a Saturday, Sunday, or Federal holiday within the District or Columbia if the day that is twelve months after the filing date of the provisional application under 35 U.S.C. § 111(b) and 37 CFR 1.53(c) falls on a Saturday, Sunday, or a Federal holiday in the District of Columbia.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer — i.e., the statement NOT in accord with practice. Per 65 F.R. 50092 (Aug. 16, 2000), the term of a nonprovisional resulting from conversion of a provisional under 35 U.S.C. § 111(b)(5) is measured from the ORIGINAL provisional filing date, so the provisional’s pendency is counted against the patent term — conversion CAN adversely affect term. MPEP § 201.04(b). (A), (C) and (D) accord with 37 CFR 1.53(c)(3) and are therefore not the answer. (E) is a correct statement under 35 U.S.C. § 119(e)(3).',
  },
  {
    id: 'uspto-oct01-pm-41',
    topicId: 5,
    subtopic: 'Broadening Reissue — Who May File and Within What Period (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Mark Twine obtains a patent directed to a machine for manufacturing string. The patent contains a single claim (Claim 1) which recites six claim elements. The entire interest in Twine’s patent is assigned to the S. Clemens String Co., and Twine is available and willing to cooperate with S. Clemens String Co. to file a reissue application. A subsequent reissue application includes Claim 2, which is similar to original Claim 1. However, one of the elements recited in Claim 2 is broader than its counterpart element in the original claim. The remaining five elements are narrower than their respective counterpart elements in the original patent claim. Which of the following scenarios accords with USPTO proper practice and procedure?',
    options: [
      'The S. Clemens String Co. files the reissue application more than 2 years after the issue date of the original patent application.',
      'The S. Clemens String Co. files the reissue application less than 2 years after the issue date of the original patent but more than 2 years after original application filing date.',
      'Mark Twine files the reissue application less than 2 years after the issue date of the original patent but more than 2 years after original application filing date.',
      'Mark Twine files the reissue application more than 2 years after the issue date of the original patent.',
      'Mark Twine and the S. Clemens String Co. jointly file the reissue application more than 2 years after the issue date of the original patent.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. A claim broadened in ANY respect is a broadening reissue. Answers (A), (D) and (E) are incorrect because a broadening reissue application must be filed within two years of issuance of the original patent. 35 U.S.C. § 251; MPEP § 1412.03. Answer (B) is incorrect because the assignee may not file a broadening reissue application — it must be applied for by the inventor. MPEP § 706.03(x).',
  },
  {
    id: 'uspto-oct01-pm-42',
    topicId: 5,
    subtopic: 'Maintenance Fees — When the Office May Return Payment (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A maintenance fee in the correct amount is received by the USPTO in September 2001, prior to the due date. The maintenance fee payment includes identification of a U.S. patent number. In accordance with proper USPTO rules and procedure, in which of the following situations may the USPTO return the maintenance fee payment?',
    options: [
      'The maintenance fee payment is submitted by the patentee’s grandmother, without authorization by the patentee, and includes identification of the U.S. application number for the patent.',
      'The maintenance fee payment is submitted by the attorney of record in the application, without authorization by the patentee, and includes identification of the U.S. application number for the patent.',
      'The maintenance fee payment is submitted by the attorney of record in the application, with authorization by the patentee, and does not include identification of the U.S. application number for the patent.',
      '(A) and (B).',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the correct answer. 37 CFR 1.366(c) (effective Sept. 8, 2000); MPEP § 2515. Under § 1.366(a) any person or organization may pay maintenance fees on behalf of a patentee — authorization is not required. Section 1.366(c) provides that if the payment identifies only the patent number and not the application number, "the Office may apply the payment … or may return the payment." Only in (C) does the USPTO have the option of returning the fee. (A) and (B) are each incorrect; (D) is incorrect because (A) and (B) are; (E) is incorrect because (C) is correct.',
  },
  {
    id: 'uspto-oct01-pm-43',
    topicId: 0,
    subtopic: 'Anticipation by Ranges, Species and Genus (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A claim in your client’s patent application has been rejected as being anticipated by a prior art reference. In which of the following instances is the claim not necessarily anticipated?',
    options: [
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. In your client’s application, the claim is a generic claim. The prior art clearly discloses a species falling within the claimed genus in your client’s application.',
      'The prior art is a U.S. patent issued two years before the effective date of your client’s application. In your client’s application, claim 4 is directed to a species. The prior art discloses forty-six species. The species claimed in claim 4 is clearly disclosed by name in the prior art. The remaining forty-five species disclosed in the prior art do not anticipate or render obvious any subject matter claimed in your client’s application.',
      'The prior art is a U.S. patent issued two years before the effective date of your client’s application. In your client’s application, claim 1 is directed to “composition comprising copper oxygen, and 10 to 20 mg of sulfur.” The prior art discloses a composition “comprising copper, oxygen and 15 mg. of sulfur.”',
      'The prior art is a U.S. patent issued two years before the effective date of your client’s application. Claim 1 in your client’s application is drawn to a composition of gases, and contains a narrow range of the amount of oxygen. The prior art discloses composition of the same gases, and a broad range of the amount of oxygen that is inclusive of the claimed narrow range, but does not disclose specific examples falling within the claimed narrow range. Your client not only discloses a different utility for the claimed invention, but also unexpected results achieved within the narrow range.',
      '(A), (B), (C) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (D). MPEP § 2131.03 — where the prior art discloses a range that touches, overlaps or is within the claimed range but discloses no specific examples falling within it, a case-by-case determination must be made; the claimed subject matter must be disclosed with "sufficient specificity to constitute an anticipation." (A) is not correct — a species anticipates a claim to a genus. In re Slayter, 125 USPQ 345 (CCPA 1960). (B) is not correct — a reference that clearly names the claimed species anticipates no matter how many other species are named. (C) is not correct — a specific example within a claimed range anticipates the range. Titanium Metals Corp. v. Banner, 227 USPQ 773 (Fed. Cir. 1985).',
  },
  {
    id: 'uspto-oct01-pm-44',
    topicId: 0,
    subtopic: 'Abandonment of the Invention Under 35 U.S.C. 102(c) (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] A condition for patentability is that an inventor is entitled to a patent unless he has abandoned the invention. Your client has engaged in conduct or omissions that may or may not be construed as abandonment of her invention. In which of the following situations would it be proper for a patent examiner to conclude, in an ex parte proceeding, that an inventor has abandoned the invention?',
    options: [
      'From the inventor’s inaction, following conception, to do anything over a period of time to develop or patent his or her invention, the inventor’s ridicule of another person’s attempts to develop that invention, and the inventor’s active show of interest in promoting and developing the invention only after successful marketing by another of a device embodying that invention.',
      'When acts of another can be imputed to the inventor as an intent to abandon the invention.',
      'From the inventor’s delay alone in filing a first patent application for the invention.',
      'From an inventor’s delay in reapplying for patent after abandonment of a previous patent application.',
      'From the inventor’s act of disclosing but not claiming the subject matter in a previously issued patent, even though the inventor claims the subject matter in an another patent application that is filed within one year after the patent issued.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (A). 35 U.S.C. § 102(c); MPEP § 2134; Davis Harvester Co. v. Long Mfg. Co., 149 USPQ 420, 435-436 (E.D.N.C. 1966) — the combination of prolonged inaction, ridicule of another’s efforts, and sudden interest only after another’s commercial success supports a finding of abandonment. (B) is not correct — the acts of another cannot be imputed to the inventor. Ex parte Dunne, 20 USPQ2d 1479 (Bd. Pat. App. & Inter. 1991). (C) is not correct — delay alone is insufficient. Moore v. U.S., 194 USPQ 423 (Ct. Cl. 1977). (D) and (E) are not correct. MPEP § 2134; In re Gibbs, 437 F.2d 486 (CCPA 1971). [Pre-AIA — 102(c) was removed by the AIA.]',
  },
  {
    id: 'uspto-oct01-pm-45',
    topicId: 3,
    subtopic: 'Proposing Drawing Corrections in a Separate Paper (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] You are prosecuting a patent application wherein an Office Action has been issued rejecting the claims as being obvious over the prior art and objecting to the drawings as failing to illustrate an item that is fully described in the specification and included in a dependent claim. The Examiner has required an amendment to Figure 1 to illustrate the item. In preparing a reply to the Office Action, you identify several errors in Figure 2 that also should be corrected. Assuming that you make a small amendment to the claims and develop persuasive arguments to overcome the obviousness rejection, and that the Examiner will not object to your desired changes to Figure 2, which of the following actions is likely to lead to the most favorable result?',
    options: [
      'Submit a reply amending the claims and setting forth your arguments to overcome the obviousness rejection. Submit a separate cover letter for replacement Figures 1 and 2 that incorporate the amendments to the drawings.',
      'Submit a reply amending the claims and setting forth your arguments to overcome the obviousness rejection. In the Remarks portion of the reply, explain the proposed drawing changes and attach copies of Figures 1 and 2 with the changes marked in red for the Examiner’s review and approval.',
      'Submit a reply amending the claims and setting forth your arguments to overcome the obviousness rejection. In a separate paper, explain the proposed drawing changes and attach copies of Figures 1 and 2 with the changes marked in red for the Examiner’s review and approval.',
      'Options (A), (B) and (C) are equally likely to lead to the most favorable result.',
      'Options (B) and (C) are equally likely to lead to the most favorable result.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (C). (A) is not the best answer because drawing changes normally must be approved by the Examiner before the application will be allowed — the Examiner must give written approval for alterations or corrections before the drawing is corrected. MPEP § 608.02(q). (B) is not the best answer because any proposal by an applicant for amendment of the drawing to cure defects must be embodied in a SEPARATE letter. MPEP § 608.02(r). (D) is not the best answer because it incorporates (A) and (B), and (E) is not the best answer because it incorporates (B). [Historical practice — drawing-correction practice was revised after 2003.]',
  },
  {
    id: 'uspto-oct01-pm-46',
    topicId: 0,
    subtopic: 'What a Rule 131 Affidavit Cannot Overcome (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] According to USPTO rules and procedure, which of the following can be overcome by an affidavit under 37 CFR 1.131?',
    options: [
      'A rejection properly based on statutory double patenting.',
      'A rejection properly made under 35 U.S.C. § 102(d) based on a foreign patent granted in a non-WTO country.',
      'A rejection properly made under 35 U.S.C. § 102(a) based on a journal article dated one month prior to the effective filing date of the U.S. patent application. Applicant has clearly admitted on the record during the prosecution of the application that subject matter in the journal article relied on by the examiner is prior art.',
      'A rejection properly made under 35 U.S.C. § 102(b) based on a U.S. patent that issued 18 months before the effective filing date of the application. The patent discloses, but does not claim, the invention.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is the correct answer. MPEP § 715. (A) is incorrect because a § 1.131 affidavit is not appropriate where the reference is a prior U.S. patent to the same entity claiming the same invention. (B) and (D) are each incorrect because a § 1.131 affidavit cannot overcome a statutory bar — under § 102(d) as in (B) or § 102(b) as in (D). (C) is incorrect because a § 1.131 affidavit is not appropriate where applicant has clearly admitted on the record that the subject matter relied on is prior art. [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-47',
    topicId: 0,
    subtopic: 'What Cannot Overcome an Anticipation Rejection (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Claims in your client’s patent application have been rejected as unpatentable over prior art. In accordance with proper USPTO practice and procedure, which, if any, of the following statements is true?',
    options: [
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 U.S.C. § 102(b) of the disclosure in the patent that anticipates the claimed invention. Evidence of secondary considerations, such as unexpected results or commercial success, is relevant to the rejection and thus can overcome the rejection.',
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 U.S.C. § 102(b) over the disclosure in the patent that anticipates the claimed invention. The rejection can be overcome by arguing that the alleged anticipatory prior art is “nonanalogous art.”',
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 U.S.C. § 102(b) over the disclosure in the patent that anticipates the claimed invention. The rejection can be overcome by arguing that the alleged anticipatory prior art teaches away from the invention.',
      'The prior art is a U.S. patent issued five years before the effective date of your client’s application. The claims are properly rejected under 35 U.S.C. § 102(b) over the disclosure in the patent that anticipates the claimed invention. The rejection can be overcome by arguing that the alleged anticipatory prior art is not recognized as solving the problem solved by the claimed invention.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct answer is (E). (A), (B), (C) and (D) are not in accordance with proper USPTO practice. (A) alone is not correct — secondary considerations are irrelevant to anticipation. MPEP § 2131.04; In re Wiggins, 179 USPQ 421, 425 (CCPA 1973). (B), (C) and (D) are not correct — arguments that the reference is nonanalogous art, teaches away, or does not recognize the problem address obviousness, not anticipation. MPEP § 2131.05; In re Self, 213 USPQ 1, 7 (CCPA 1982). [Pre-AIA]',
  },
  {
    id: 'uspto-oct01-pm-48',
    topicId: 5,
    subtopic: 'Choosing Between Ex Parte and Inter Partes Reexamination (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Your longstanding client, Acme Chemical, comes to you for advice concerning a competitor’s patent that Acme fears might cover Acme’s key commercial product. Acme informs you that it began selling its product approximately eleven months before the competitor filed its patent application, and that a complete description of the product and how to make it was published in a trade magazine approximately ten months before the competitor’s December 8, 1999 application filing date. Acme asks you to recommend options short of litigation that might be available to challenge validity of the patent. Acme also asks that in making your recommendation you take into account that Acme will not challenge the patent’s validity unless it can be actively involved in all phases of the proceeding, even if that involvement will increase Acme’s costs. Which of the following is the most reasonable advice to Acme?',
    options: [
      'You suggest that Acme request ex parte reexamination on the basis of the trade magazine publication and that Acme file a reply to any statement by the patent owner concerning any new question of patentability.',
      'You suggest that Acme request ex parte reexamination on the basis of Acme’s prior sales and the trade magazine publication.',
      'You suggest that Acme request inter partes reexamination on the basis of the trade magazine publication only.',
      'You suggest that Acme request inter partes reexamination on the basis of Acme’s prior sales and the trade magazine publication.',
      'You suggest that Acme inform the competitor in writing of the prior sales and trade magazine publication to force the competitor to inform the USPTO of this information and to force the competitor to initiate a reexamination of its own patent.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Answers (B) and (D) are unreasonable advice at least because reexamination is available only on the basis of prior art patents or publications — a request may not properly rely upon evidence of public use or sales. See 37 CFR 1.510, 1.552, 1.906, 1.915. Answer (A) is less reasonable than (C) because Acme would have the opportunity to submit a reply only if the patent owner chose to file a statement under § 1.530, and any further proceedings would be completely ex parte — while Acme has made clear it wants to participate. Answer (E) is less reasonable because a patent owner is not obliged to cite prior art in an issued patent and would not be required to request reexamination. [Historical practice — inter partes reexamination was replaced by inter partes review in 2012.]',
  },
  {
    id: 'uspto-oct01-pm-49',
    topicId: 5,
    subtopic: 'Maintenance Fee Timing for Reissue, Design and Plant Patents (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] Which of the following statements accords with proper USPTO practice and procedure?',
    options: [
      'If a design patent was granted 3 years and 9 months ago, a maintenance fee paid today must include a surcharge because the payment is being made during the grace period.',
      'If a design patent was granted 3 years and 9 months ago, and payment of the maintenance fee and surcharge is not paid through the day of the 4th anniversary of the grant for the first maintenance fee, the patent will expire.',
      'If a plant patent was granted 7 years and 3 months ago, a maintenance fee must be paid, but a surcharge is not required, because the payment is not being made during the grace period.',
      'If a utility patent was granted 7 years and 9 months ago, the first maintenance fee was timely paid, and the 8th anniversary of the patent grant falls on a Saturday, then the 2nd maintenance fee may be paid without surcharge on the next succeeding day which is not a Sunday or Federal holiday.',
      'If a reissue application issues as a reissue patent exactly two years after the grant of the original patent, the maintenance fee for the 4th anniversary of the patent grant must be paid within eighteen months of the reissuance of the patent to avoid a surcharge.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E) is correct because 37 CFR 1.362(h) provides that the periods specified for payment of maintenance fees "are counted from the date of grant of the original non-reissue application on which the reissued patent is based." With the reissue granted exactly two years after the original, one year from the reissue grant is three years from the original grant — and § 1.362(d)(1) allows payment without surcharge during the period "3 years through 3 years and 6 months after grant for the first maintenance fee," i.e. within eighteen months of reissuance. (A), (B) and (C) are wrong because § 1.362(b) states that maintenance fees are not required for any plant or design patents. (D) is wrong because the 2nd maintenance fee window without surcharge is "7 years through 7 years and 6 months after grant."',
  },
  {
    id: 'uspto-oct01-pm-50',
    topicId: 0,
    subtopic: 'Priority Contests — Diligence Under 35 U.S.C. 102(g) (Official Oct 2001)',
    difficulty: 3,
    question:
      '[OFFICIAL USPTO EXAM, Oct 2001] On February 15, 2000, Debbie conceived a new, useful and nonobvious improvement in saddles for horses. Debbie spent the next four months working regularly on the idea and she built a prototype that implemented the concept on June 17, 2000. The prototype worked perfectly for its intended purpose. The next day, Debbie visited a patent attorney, Ginny, who declined representation because of her workload and gave Debbie the names of other qualified practitioners. Debbie did not contact any of them. Debbie visited Ginny again on December 1, 2000, Ginny agreed to represent her, and a patent application was filed on December 11, 2000. On May 15, 2000, Billie conceived an idea substantively identical to Debbie’s. Billie immediately prepared a detailed technical description including drawings and visited a patent attorney. Billie filed a patent application on June 14, 2000. Later, on July 9, 2000, Billie built a prototype that implemented the concept and had fully and successfully tested it by August 11, 2000. With regard to a priority contest between Debbie and Billie, which of the following statements is most correct?',
    options: [
      'Debbie will be awarded priority only if she can establish diligence for the entire time between May 14, 2000 and her actual reduction to practice in June 2000, and can establish that she did not suppress, abandon or conceal the invention.',
      'Debbie will be awarded priority only if she can establish diligence for the entire time between her conception in February 2000 and actual reduction to practice in June 2000, and can establish that she did not suppress, abandon or conceal the invention.',
      'Debbie will be awarded priority if she can establish diligence for the entire time between May 14, 2000 and her patent filing in December 2000, and can establish that she did not suppress, abandon or conceal the invention.',
      'To encourage prompt disclosure of inventions to the public, priority is always awarded to the first to file an application, in this case Billie.',
      'Billie must be awarded priority because his patent application established a constructive reduction to practice prior to Debbie’s actual reduction to practice, even if Debbie was diligent in reducing her invention to practice.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): The most correct response is (A). 35 U.S.C. § 102(g); Mahurkar v. C.R. Bard, Inc., 38 USPQ2d 1288 (Fed. Cir. 1996). As the first to conceive but second to reduce to practice, Debbie must show diligence from just before Billie’s conception (May 15, 2000) to her own actual reduction to practice. If statement (D) were correct there would be no need for interference proceedings. (B) is incorrect because Debbie need not establish diligence from February 2000 until just before Billie’s conception. (C) is incorrect because, absent abandonment, suppression or concealment, Debbie need not show diligence between actual reduction to practice and filing. (E) is inconsistent with § 102(g). [Pre-AIA — first-to-invent priority contests were replaced by first-inventor-to-file.]',
  },
];

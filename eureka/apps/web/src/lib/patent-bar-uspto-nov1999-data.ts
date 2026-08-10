/**
 * OFFICIAL USPTO REGISTRATION EXAMINATION — November 3, 1999, MORNING (AM) SESSION.
 *
 * Source: the USPTO's own released examination and model answers
 * (edo9911aq.pdf / edo9911aa.pdf), retrieved from the Internet Archive.
 * United States Government works; not subject to copyright (17 U.S.C. § 105).
 *
 * TRANSCRIPTION RULES (identical to the other uspto-* files in this directory):
 *  - Stems and options are VERBATIM, in the official order (A)-(E). Typos in
 *    the original are preserved where the question turns on them (Q14's
 *    "talbecloth" is the subject of the question itself).
 *  - `correct` is taken from the USPTO's published model answer, never inferred.
 *  - Every `explanation` begins "OFFICIAL USPTO MODEL ANSWER (abridged):" and
 *    retains the controlling citation. Abridged means shortened, never altered.
 *
 * VERIFIED BY `npm run audit:uspto` — not by hand. The manual sweep got this
 * paper wrong in four places, every one of them silently:
 *   - reported ZERO discards (this session has two, Q6 and Q47, worded
 *     "All answers ARE accepted" — the inserted word defeats the usual pattern);
 *   - missed Q49's multi-key entirely;
 *   - read Q37's key as (C), taken from the "C" of "37 CFR § 10.38(a)" further
 *     up the page, when the real answer is (B);
 *   - read Q49's key from the "A" in the word "ANSWERS".
 * Two of those wrong values coincidentally matched the truth, which is exactly
 * why the check is now a script.
 *
 * DISCARDED: Q6 and Q47 — "ANSWER: All answers are accepted." 48 of the 50
 * delivered questions are scoreable.
 *
 * MULTI-KEYED: TWO.
 *   Q4  — "ANSWER: (D) and (E)."  keyed to (D), (E) disclosed in the explanation.
 *   Q49 — "ANSWERS: (A) and (B)." keyed to (A), (B) disclosed in the explanation.
 * The bank stores one key per item, so each is keyed to the option the model
 * answer analyses first and the alternate is stated plainly. Nothing dropped.
 *
 * FORMAT NOTE: Q13's answer line reads "13 ANSWER: (A)." with no period after
 * the number — the only such line across all fifteen released papers.
 *
 * ERA NOTES. This is the earliest paper in the bank and predates the AIA by
 * twelve years. Items turning on pre-AIA § 102/§ 103 carry [Pre-AIA]; superseded
 * procedure carries [Historical practice]. Specifically:
 *  - Q11 is keyed to the 37 C.F.R. Part 10 Code of Professional Responsibility,
 *    replaced in 2013 by the Part 11 Rules of Professional Conduct.
 *  - Q5, Q7, Q14 and Q32 apply the pre-2003 § 1.121 amendment format.
 *  - Q16 concerns jurisdiction passing to the Board of Patent Appeals and
 *    Interferences, replaced by the PTAB in 2012.
 *  - Q43 relies on § 1.137(b) unintentional revival, which survives, but the
 *    companion "unavoidable" standard of § 1.137(a) was eliminated in 2013.
 */

import type { PatentBarQuestion } from './patent-bar-qbank-data';

export const USPTO_NOV1999_AM_SOURCE = {
  exam: 'USPTO Registration Examination',
  date: 'November 3, 1999',
  session: 'Morning (AM)',
  questionsFile: 'edo9911aq.pdf',
  answersFile: 'edo9911aa.pdf',
  totalDelivered: 50,
  discarded: [6, 47],
  multiKeyed: [4, 49],
  ingested: 48,
  license: 'US Government work, public domain (17 U.S.C. § 105)',
} as const;

export const USPTO_NOV1999_AM_QUESTIONS: PatentBarQuestion[] = [
  {
    id: 'uspto-nov99-am-01',
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
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). MPEP §§ 1502.01 and 201.04(b).',
  },
  {
    id: 'uspto-nov99-am-02',
    topicId: 0,
    subtopic: 'Obviousness — the suggestion need not be for the same purpose',
    difficulty: 3,
    question:
      'A patent application filed in the PTO claims a nylon rope coated with element E for the purpose of preventing breakage of the rope. In the first Office action, the examiner rejects the claim as obvious over P in view of a trade journal publication, T. P teaches a nylon rope coated with resin for the purpose of making the rope waterproof. T teaches a nylon tent fabric coated with element E for the purpose of making the tent waterproof, and suggests the use of element E for making other nylon products waterproof. Following proper PTO practices and procedures, the combination of P and T:',
    options: [
      'cannot support a prima facie case of obviousness because T lacks a suggestion to combine with P for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because P lacks a suggestion to combine with T for the purpose of preventing breakage in nylon rope.',
      'cannot support a prima facie case of obviousness because T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness, even though T only contains a suggestion to combine with P for the purpose of waterproofing nylon rope.',
      'can support a prima facie case of obviousness because the applicant is always under an obligation to submit evidence of non-obviousness regardless of whether the examiner fully establishes a prima facie case of obviousness.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). "It is not necessary in order to establish a prima facie case of obviousness… that there be a suggestion or expectation from the prior art that the claimed [invention] will have the same or a similar utility as one newly discovered by the applicant." In re Dillon, 919 F.2d 688, 16 USPQ2d 1897 (Fed. Cir. 1990); MPEP § 2144 ("Rationale Different from Applicant\'s is Permissible"). (A)-(C) are incorrect because the suggestion to combine need not be for the same purpose the applicant discloses. (E) is incorrect because an applicant is under no obligation to submit evidence of non-obviousness unless the examiner first meets the burden of establishing a prima facie case. MPEP § 2142. [Pre-AIA] — analysis under pre-AIA § 103; the teaching-suggestion-motivation test was later relaxed by KSR v. Teleflex, 550 U.S. 398 (2007).',
  },
  {
    id: 'uspto-nov99-am-03',
    topicId: 1,
    subtopic: 'Incorporation by reference — what may not be incorporated',
    difficulty: 3,
    question:
      'What would not be permitted to be incorporated by reference in your client’s U.S. utility patent application?',
    options: [
      'Essential material from a U.S. patent.',
      'Essential material from a foreign application.',
      'Non-essential material from a prior filed, commonly owned U.S. application.',
      'Essential material from a magazine article.',
      '(B) and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). Both (B) and (D) cannot be incorporated into a U.S. utility application. MPEP § 608.01(p).',
  },
  {
    id: 'uspto-nov99-am-04',
    topicId: 1,
    subtopic: 'Tradenames in claims — indefiniteness under § 112 ¶ 2',
    difficulty: 3,
    question:
      'Beverly recovered goop from a clogged shower drain and found it makes a highly effective industrial lubricant, formed from equal parts of chemicals W, X, Y and Z. Her soap uses the tradename "Acme SmellNice"; her shampoo and conditioner use "A-1 Silky." Because the ingredients of at least Acme SmellNice have recently changed, and the nature of the change is unknown, you list every ingredient of both in positive language. The application includes: "Claim 1. An industrial lubricant consisting essentially of equal parts of chemical W, chemical X, chemical Y and chemical Z. Claim 2. The industrial lubricant of Claim 1, wherein said chemical X is formed by mixing A-1 Silky shampoo and Acme SmellNice soap in the presence of water having a temperature of at least 100°F." Which of the following statements is/are correct?',
    options: [
      'Claim 1 cannot be supported by an enabling specification because Beverly does not fully understand the processes that occurred in the drain, and a prophetic example alone is never sufficient to enable a claim.',
      'Claim 2 is not patentable because it sets forth an incorrect theory of formation of chemical X.',
      'Claim 1 is not patentable because Beverly merely found the goop in her drain and did not formulate it herself.',
      'Claim 2 is not patentable because it is indefinite.',
      '(B) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): TWO ANSWERS WERE ACCEPTED — the model answer reads "ANSWER: (D) and (E)." (D) is correct because a claim that includes a tradename whose definition is neither sufficiently precise nor definite fails to comply with 35 U.S.C. § 112, paragraph 2; the composition of "Acme SmellNice" has recently changed and the change is unknown. MPEP §§ 608.01(v), 706.03(d); Ex parte Simpson, 218 USPQ 1020 (Bd. App. 1982). (E) is also correct to the extent (B) correctly points out that where an incorrect theory of operation is incorporated into a claim, that claim is invalid under § 101 or § 112. Raytheon Co. v. Roper Corp., 724 F.2d 951, 220 USPQ 592 (Fed. Cir. 1983). (B) ALONE is not accepted because no fact was given that claim 2 sets forth an incorrect theory. (A) is incorrect because prophetic examples may provide an enabling disclosure, and an inventor need not understand how an invention works. (C) is incorrect because naturally occurring compounds may be patented, particularly when a new use is part of the claim. This item is keyed to (D) here because the bank stores a single key; (E) was equally accepted by the USPTO.',
  },
  {
    id: 'uspto-nov99-am-05',
    topicId: 3,
    subtopic: 'Amendments before appeal — 37 C.F.R. § 1.116',
    difficulty: 3,
    question:
      'Jack, a registered patent agent, received a final rejection of all of the claims in an application directed to an article of manufacture. Jack is about to file a timely Notice of Appeal to the Board of Patent Appeals and Interferences. Before filing his notice of appeal, Jack would like to tie up some loose ends by amendment. Which of the following reply(replies) may he file without triggering the requirements of 37 CFR § 1.116(b)?',
    options: [
      'A reply that presents his argument in a more defensible light and adds additional claims.',
      'A reply amending the claims into process claims.',
      'A reply amending all of the independent claims, accompanied by a declaration from the inventor.',
      'A reply complying with a requirement of form expressly set forth in the previous Office action.',
      '(A) and (D).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.116; MPEP § 714.13 ("Entry Not Matter of Right"). The reply in (D) is directed to a reply authorized under § 1.116(a). (A), (B), and (C) are directed to the merits of the application and are not in accord with § 1.116(a). [Historical practice] — § 1.116 and the surrounding after-final practice have since been revised.',
  },
  {
    id: 'uspto-nov99-am-07',
    topicId: 3,
    subtopic: 'Amendments after final rejection',
    difficulty: 3,
    question:
      'Which of the following statements, regarding amendments filed after final rejection in a timely manner, is correct?',
    options: [
      'Amendments touching upon the merits of the application presented after final rejection shall be entered upon payment of the proper fee and a showing of good and sufficient reasons why they are necessary and were not earlier presented.',
      'An amendment filed after final rejection is entitled to entry if it amends only the claims that were finally rejected.',
      'Amendments after final rejection may be made canceling claims or complying with any requirement of form expressly set forth in the final Office action.',
      'An amendment after final rejections is entitled to entry if it cancels claims and adds new claims that clearly set forth a previously unclaimed embodiment of the invention.',
      'Applicant cannot make any further amendments after final rejection, but may submit remarks and a notice of appeal.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C) is the most correct answer. 37 C.F.R. § 1.116; MPEP § 714.13.',
  },
  {
    id: 'uspto-nov99-am-08',
    topicId: 1,
    subtopic: 'Written description — original claims are their own description',
    difficulty: 3,
    question:
      'In which of the following situations, considered independently of each other, is the original, new, or amended claim supported in the application as filed?',
    options: [
      'An amendment to the specification changing the definition of "holder" from "is a hook" to "is a hook, clasp, crimp, or tong" and no amendment is made of the claim, which uses the term "holder." The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'An amendment to the specification and claims changing the definition of "holder" from "is a hook" to "is a hook, clasp, crimp, or tong." The amendment is filed one month after the application was filed. There was no previous supporting disclosure in the specification of the holder being a clasp, crimp, or tong.',
      'Original claim 1 in the application refers to "a holder," and original claim 2 depends from and refers to claim 1 stating, "said holder is a hook, clasp, crimp, or tong." There is no disclosure in the specification preceding the claims in the application as filed for the holder to be a clasp, crimp, or tong.',
      'An amendment is filed presenting a claim to an electrical insulating device, copied from a patent for the purpose of provoking an interference. The claim refers to "nonconductive plastic holder." The application as filed contains a broad generic disclosure describing electrical insulating devices. The holder is described in the specification of the application as "conducting electricity." There is no disclosure in the specification of the holder being "nonconductive."',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2163.03, item I. Original claims constitute their own description. In re Koller, 613 F.2d 819, 204 USPQ 702 (CCPA 1980). (A) and (B) are incorrect — "An amendment to the specification (e.g., a change in the definition of a term used both in the specification and claim) may indirectly affect a claim even though no actual amendment is made to the claim," and there is no supporting disclosure for a clasp, crimp, or tong. (D) is incorrect — a broad generic disclosure is not necessarily a sufficient written description of a specific embodiment, especially where it conflicts with the remainder of the disclosure. Fields v. Conover, 443 F.2d 1386, 170 USPQ 276 (CCPA 1970). (E) is not correct because (C) is correct.',
  },
  {
    id: 'uspto-nov99-am-09',
    topicId: 1,
    subtopic: 'A dependent claim may not omit an element of its parent',
    difficulty: 3,
    question:
      'An application as originally filed contains Claim 1, a doughnut making machine comprising an input conveyor, portioning means, forming means, a deep fat fryer, "applying means for selectively applying a flavored coating on cooked rings of dough to produce doughnuts," and placing means. The specification adequately describes the claimed subject matter, and two different "means for selectively applying" are described: a sprayer and a brush. Which of the following original claims is an improper dependent claim?',
    options: [
      '2. The doughnut making machine of Claim 1, wherein said placing means is a conveyor that extends from said applying means to said flat sheet.',
      '3. The doughnut making machine of Claim 1, wherein said forming means includes a cutter that removes a center portion of each of said dough balls to form a ring of dough.',
      '4. The doughnut making machine of Claim 1, wherein said applying means is omitted for making plain doughnuts.',
      '5. The doughnut making machine of Claim 1, wherein said applying means includes a sprayer which receives a sugar based flavored coating, wherein said sugar based flavored coating is sprayed on said cooked rings of dough.',
      '6. The doughnut making machine of Claim 1, wherein said applying means is a sprayer.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Dependent Claim 4 must further limit Claim 1 from which it depends. 35 U.S.C. § 112, paragraph 4; 37 C.F.R. § 1.75(c). The dependent claim in (C) improperly seeks to broaden Claim 1 by omitting an element set forth in the parent claim.',
  },
  {
    id: 'uspto-nov99-am-10',
    topicId: 1,
    subtopic: 'Dependent and multiple dependent claim form',
    difficulty: 3,
    question:
      'Which of the following dependent claims, each occurring in different patent applications, is in a proper claim format?',
    options: [
      'Claim 4. The process of claim 5, further characterized by…',
      'Claim 2. The process of claim 1 or claim 5, further comprising…',
      'Claim 6. The widget as in claims 1, 2 or 3, further including…',
      'Claim 3. The widget as in the preceding claims, further containing…',
      'Claim 5. The process as in claims 1-2 or 3, further comprising…',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). A multiple dependent claim "shall contain a reference, in the alternative only, to more than one claim previously set forth." 35 U.S.C. § 112, paragraph 5; 37 C.F.R. § 1.75(c); MPEP § 608.01(n). Here the claim refers back in the alternative to claims previously set forth (1, 2 or 3). (A) and (B) are incorrect because each claim does not refer back to a PRECEDING claim — in (A) claim 4 refers to claim 5, in (B) claim 2 refers to claim 5. (D) and (E) are incorrect because each does not refer back IN THE ALTERNATIVE — in (D) claim 3 refers to all the preceding claims, and in (E) claim 5 refers to claims 1 and 2, or claim 3.',
  },
  {
    id: 'uspto-nov99-am-11',
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
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). Practitioners, including registered patent agents (37 C.F.R. § 10.1(r)), may advertise on television and radio. § 10.32(a). A registered patent agent may accept cases on a contingent fee basis. § 10.36(b)(8). (A) and (C) are incorrect — the patent agent is not authorized to practice in trademark cases. § 10.14(b). (D) is incorrect — practitioners are proscribed from entering into partnership agreements restricting their right to practice before the PTO. § 10.38(a). (E) is incorrect — a patent agent is proscribed from misrepresenting himself or herself as a registered patent attorney. §§ 10.23(b)(4) and 10.34(b). [Historical practice] — the 37 C.F.R. Part 10 Code was replaced in 2013 by the Part 11 USPTO Rules of Professional Conduct.',
  },
  {
    id: 'uspto-nov99-am-12',
    topicId: 3,
    subtopic: 'A § 102(b) reference cannot be antedated',
    difficulty: 3,
    question:
      'On February 12, 1999, you filed a patent application containing two independent claims directed to methods of forming an integrated circuit device. The applicant conceived the methods on June 10, 1997 and exercised due diligence until reducing them to practice on February 27, 1998. The examiner rejected Claim 1 as anticipated by Doppler under 35 U.S.C. § 102(b) — a French patent filed July 18, 1996 and issued January 13, 1998, claiming the method of Claim 1. Claim 2 was rejected as anticipated by Spot under § 102(e) — a U.S. patent filed January 7, 1998 which discloses but does not claim the method of Claim 2, and issued May 5, 1999. Which of the following would be the most proper course of action to take to respond to the rejections?',
    options: [
      'File an antedating affidavit to overcome the rejection of Claim 1 and cancel Claim 2.',
      'File an antedating affidavit to overcome both the rejections and request that an interference be declared with the Doppler patent.',
      'File an antedating affidavit to overcome the rejection of Claim 2 and cancel Claim 1.',
      'File a reply arguing that the rejections are improper because the Spot patent issued after the filing date of your client’s application.',
      'File an antedating affidavit to overcome both rejections.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 102(b) and (e); 37 C.F.R. § 1.131(a). A reference under § 102(b) cannot be antedated. Therefore (A), (B) and (E) are incorrect. (D) is incorrect because it is non-responsive, and it does not matter when the Spot patent issued. [Pre-AIA] — § 1.131 antedating is unavailable against AIA prior art.',
  },
  {
    id: 'uspto-nov99-am-13',
    topicId: 0,
    subtopic: 'Anticipation vs obviousness; § 112 ¶ 6 means-plus-function scope',
    difficulty: 3,
    question:
      'Able filed an application disclosing a barstool having a rectangular molded plastic seat supported by four vertical tubular steel legs. The application states wood could be used in place of tubular steel for the legs, but no alternative to plastic is mentioned for the seat, though plastic and wood are known to be interchangeable. Claim 1 recites a rectangular seat portion, "means for supporting said seat portion," and a back member. The Examiner rejects the claim under § 102 as anticipated by a 1997 Baker publication showing a three-legged wooden barstool, and cites but does not apply a 1996 Charlie patent disclosing a four-legged wooden barstool with a round wooden seat, which states that plastic and/or tubular steel is equivalent to wood. Able amends to require a plastic seat and argues Baker does not disclose the "supporting means" because Baker uses only three legs. The examiner finds a 1980 Wilson patent equating three-legged to four-legged barstools. Which of the following is in accordance with proper PTO practices and procedures?',
    options: [
      'The anticipation rejection is withdrawn only because Baker does not disclose a plastic seat portion. An obviousness rejection is then made based on Baker in view of Charlie since Charlie suggests replacing a wood seat with a plastic seat. Able’s argument concerning the recited "supporting means" of Claim 1 does not provide a basis for overcoming the anticipation rejection.',
      'The anticipation rejection should be withdrawn because Baker does not disclose a plastic seat portion and because Baker does not disclose a four legged supporting means. An obviousness rejection is then made based on Baker in view of Charlie because Charlie suggests modifying Baker to utilize a plastic seat and four legs.',
      'The anticipation rejection is maintained because one of ordinary skill in the art would understand that a plastic seat could readily replace a wood seat. Furthermore, Able’s argument that the "supporting means" of Claim 1 is not disclosed because Baker utilizes only three legs is unsupported by any limitation in the Claim.',
      'The anticipation rejection is withdrawn because Baker does not disclose a plastic seat. However, a rejection is made under 35 USC §112, paragraph 1 as being based upon an inadequate disclosure because the specification does not specify that the use of a plastic seat is critical to the invention.',
      '(B) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). Anticipation requires that each and every limitation be shown in a single reference, expressly or impliedly. MPEP §§ 706.02, 2131. Claim 1 was amended to require a plastic seat, which Baker does not disclose. However Baker DOES disclose the recited "supporting means" because under § 112, paragraph 6, that claim language covers the disclosed structure (four legs) and equivalent structures (three legs), so Able\'s argument is unconvincing. MPEP § 2181. An obviousness rejection over Baker/Charlie is appropriate because Charlie suggests replacing wooden seats with plastic. (B) is not most correct because "Baker does not disclose a four legged supporting means" does not distinguish Baker — the claimed means is not limited to four legs. (C) is not most correct because whether plastic could be substituted for wood goes to obviousness, not anticipation. (D) is incorrect because there is an adequate written description of the plastic seat, and applicants commonly and properly limit claims to a preferred embodiment during prosecution. MPEP § 2172. [Pre-AIA] — decided under pre-AIA §§ 102/103. NOTE: this item\'s answer line reads "13 ANSWER:" with no period after the number, the only such line in the released papers.',
  },
  {
    id: 'uspto-nov99-am-14',
    topicId: 3,
    subtopic: 'Amendment practice — exact matter, precise point, five-word limit',
    difficulty: 3,
    question:
      'A patent application filed in the PTO contains the following original claim: "Claim 1. A talbecloth for protecting the finish of a table comprising: a layer of cotton; a layer of vinyl affixed to the layer of cotton; and a backing of felt." Which of the following amendment(s) is/are not in accord with proper PTO amendment practices and procedures?',
    options: [
      'In claim 1, line 3, add -with an epoxy resin-.',
      'In claim 1, line 2, after "cotton" add -woven to have 250 threads per inch-.',
      'In claim 1, line 3, before "layer" add –thin-.',
      'In claim 1, line 1, correct the spelling of "talbecloth" please.',
      'All of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). A claim may be amended by specifying the exact matter to be deleted or added, and the precise point where the deletion or addition is to be made. 37 C.F.R. § 1.121(a)(2)(i). Amendments are limited to additions of no more than 5 words per claim, or deletions. (A) is improper because it does not specify the precise point where the addition is to be made. (B) is improper because it adds more than 5 words. (C) is improper because line 3 contains "layer" twice and the amendment does not specify which occurrence. (D) is improper because the amendment gives no direction for how to correctly spell "talbecloth." [Historical practice] — the pre-2003 § 1.121 amendment format has been replaced by the current claim-listing practice.',
  },
  {
    id: 'uspto-nov99-am-15',
    topicId: 1,
    subtopic: '"About" can push a dependent claim outside the parent range',
    difficulty: 3,
    question:
      'You draft a patent application disclosing an electrical chronometer containing a resistor having a resistance of 20-90 ohms, preferably 40 ohms, and draft independent claim 1: "An electrical chronometer comprising a resistor with a resistance of 20-90 ohms." Which of the following would not be a proper dependent claim if presented as an original claim in the application when the application is filed in the PTO?',
    options: [
      '2. The electrical chronometer of Claim 1 wherein the resistor has a resistance of 40 ohms.',
      '2. An electrical chronometer as in Claim 1 wherein the resistor has a resistance of 40-90 ohms.',
      '2. An electrical chronometer as in Claim 1 wherein the resistor has a resistance of about 20 - 90 ohms.',
      '2. The electrical chronometer of Claim 1 wherein the resistor has a resistance of between 50 and 90 ohms.',
      '(C) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. § 1.75(c). A dependent claim must further limit the claim from which it depends. The claim in (C) is improper because the term "about" allows for a range slightly above 90 ohms or below 20 ohms, which is outside the scope of Claim 1. MPEP § 2144.05. (A), (B), and (D) are proper because they limit the resistance to amounts within the scope of Claim 1. (E) is incorrect because (D) is a proper dependent claim.',
  },
  {
    id: 'uspto-nov99-am-16',
    topicId: 3,
    subtopic: 'When jurisdiction passes to the Board',
    difficulty: 2,
    question:
      'When does jurisdiction over an application normally transfer from the examining group to the Board of Patent Appeals and Interferences?',
    options: [
      'After the examiner has notified the appellant by written communication that the reply brief has been entered and considered, and that the application will be forwarded to the Board.',
      'After a supplemental examiner’s answer, pursuant to a remand from the Board, has been mailed.',
      'After 2 months from the examiner’s answer, plus mail room time, if no reply brief has been timely filed.',
      '(A), (B), or (C).',
      '(A) or (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 1210. [Historical practice] — the Board of Patent Appeals and Interferences was replaced by the PTAB in 2012 and the appeal rules have since been revised.',
  },
  {
    id: 'uspto-nov99-am-17',
    topicId: 5,
    subtopic: '35 U.S.C. § 305 — no enlarging claims in reexamination',
    difficulty: 3,
    question:
      'A request for reexamination of the ‘XXX patent was filed on the ground that a substantial new question of patentability exists. In the first Office Action during reexamination, claims 1 through 4 were rejected as unpatentable under 35 U.S.C. § 103. Claims 1 through 4 are all independent and original claims, and are the only claims that were presented during prosecution of the application that matured into the ‘XXX patent. All the claims are directed to a hydrocyclone separator apparatus. Assuming no issues under 35 U.S.C. §§ 102, 103, or 112 are raised, which of the following claims, if any, would be properly subject to rejection under 35 U.S.C. § 305?',
    options: [
      'Claim 5. A hydrocyclone separator apparatus according to claim 4, wherein said blades are configured in the form of generally plane surfaces curved in one plane only.',
      'Claim 5. A hydrocyclone separator apparatus according to claim 4, wherein the outlet duct is in the form of two frustro-conical portions joined at their narrow ends.',
      'Claim 5. A method of separating material including fibers suspended in a liquid suspension comprising the steps of separating the material into a light fraction containing the fibers and a heavy fraction containing rejects, and converting the light fraction into a pulp and paper stock suspension.',
      'Claim 5. A hydrocyclone separator apparatus according to claim 4, wherein the separator chamber is conical in shape having at the narrow end an outlet for the heavy fraction and at its wide end an outlet for the light fraction.',
      'None of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 305 recites that "No proposed amended or new claim enlarging the scope of a claim of the patent will be permitted in a reexamination proceeding." MPEP §§ 2254, 2258. Since no claims drawn to a method were ever presented during prosecution of the ‘XXX patent, the claim in (C) is not directed to "the invention as claimed" and is regarded as enlarging the scope. Ex parte Wikdahl, 10 USPQ2d 1546 (Bd. Pat. App. & Int. 1989). (A), (B) and (D) are incorrect because each is directed to the hydrocyclone separator apparatus and does not enlarge scope.',
  },
  {
    id: 'uspto-nov99-am-18',
    topicId: 1,
    subtopic: '"Consisting of" excludes any unrecited step',
    difficulty: 2,
    question:
      'A patent application filed in the PTO contains the following dependent claim: "2. The method of Claim 1, further consisting of the step of cooling the mixture to a temperature of 32° F." Following proper PTO practices and procedures, from which of the following claims does the dependent claim not properly depend?',
    options: [
      '1. A method of making liquid compound A consisting of the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '1. A method of making liquid compound A comprising the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '1. A method of making liquid compound A including the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '1. A method of making liquid compound A characterized by the steps of mixing equal quantities of material C and material D in a beaker and heating the mixture to a temperature of 212° F.',
      '(C) and (D).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). The phrase "consisting of" excludes any step not specified in the claim. MPEP § 2111.03. Thus a claim that depends from a claim which "consists of" the recited steps cannot add a step — here the dependent claim adds cooling. (B) is incorrect because "comprising" is inclusive or open-ended. (C) and (D) are incorrect because "including" and "characterized by" are synonymous with "comprising." (E) is incorrect because (C) and (D) are incorrect.',
  },
  {
    id: 'uspto-nov99-am-19',
    topicId: 0,
    subtopic: 'Where the rationale to combine may be found',
    difficulty: 3,
    question:
      'If a claim has been properly rejected under 35 U.S.C. § 103 as being rendered obvious over a combination of prior art references, then in accordance with proper PTO practice and procedure:',
    options: [
      'it is not necessary that the prior art suggests the combination to achieve the same advantage or result discovered by the applicant, if the combination provides motivation to make the claimed invention.',
      'the rationale to modify or combine the prior art must be found expressly set forth in the prior art.',
      'in considering the disclosure of prior art it is proper to take into account the specific teachings of the reference. It is not proper to take into account the inferences that one skilled in the art could reasonably draw from the specific teachings.',
      'it is improper for a patent examiner to take official notice of facts outside the record which are capable of instant and unquestionable demonstration as being "well known."',
      'it is proper to rely on equivalence in support of the rejection, the equivalence may be recognized in the prior art or in the applicant’s disclosure.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 2144; In re Linter, 458 F.2d 1013 (CCPA 1972); In re Dillon, 919 F.2d 688 (Fed. Cir. 1990). (B) is incorrect — the rationale need not be expressly stated in the prior art; it may be implied or reasoned from knowledge generally available. In re Fine, 837 F.2d 1071 (Fed. Cir. 1988). (C) is incorrect — it is proper to take into account not only specific teachings but also the inferences one skilled in the art would draw. In re Preda, 401 F.2d 825 (CCPA 1968). (D) is incorrect — official notice of well-known facts is proper. In re Ahlert, 424 F.2d 1088 (CCPA 1970); MPEP § 2144.03. (E) is incorrect — to rely on equivalence the equivalency must be recognized in the PRIOR ART, and cannot be based on applicant\'s disclosure. In re Ruff, 256 F.2d 590 (CCPA 1958). [Pre-AIA] — analysis under pre-AIA § 103.',
  },
  {
    id: 'uspto-nov99-am-20',
    topicId: 1,
    subtopic: 'Antecedent basis — completing an independent claim most broadly',
    difficulty: 3,
    question:
      'An application is directed to novel and unobvious scissors for cutting hair. Claim 1 recites (i) a first cutting member with a thumb loop, (ii) a second cutting member with a finger loop and arcuate finger brace, (iii) [blank], and (iv) said second cutting member additionally including a pointer loop between said finger loop and said mid-point… Claim 2 refers to a threaded aperture between said thumb loop and said mid-point, and Claim 3 recites "wherein said connector is a rivet." Without regard to prior art, which of the following best completes missing paragraph (iii) of Claim 1 while maintaining the broadest scope of protection?',
    options: [
      '"said first cutting member having a mid-point between its ends and said second cutting member having a mid-point between its ends, and said first cutting member and said second cutting member are pivotally secured to each other at their respective mid-points by a connector; and"',
      '"wherein said first cutting member and said second cutting member are formed entirely of metal and are pivotally secured to each other at respective mid-points; and"',
      '"said first cutting member including a reservoir for dispensing disinfectant solution and having a mid-point between its ends; and"',
      '"and said first cutting member and said second cutting member are pivotally secured to each other at their respective mid-points; and"',
      '"said first cutting member and said second cutting member being pivotally secured to each other by a connector; and"',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). It provides proper antecedent basis for "said mid-point" in part (iv) of Claim 1 and in Claim 2, and "said connector" in Claim 3. (B) is incorrect at least because it includes the unnecessary limitation that the members are metal and does not provide antecedent basis for "said connector." (C) is incorrect because it includes the unnecessary reservoir limitation and lacks antecedent basis for "said connector." (D) is incorrect because it lacks antecedent basis for "said mid-point" and "said connector." (E) is incorrect because it lacks proper antecedent basis for "said mid-point."',
  },
  {
    id: 'uspto-nov99-am-21',
    topicId: 5,
    subtopic: 'Grounds available in reexamination',
    difficulty: 3,
    question: 'Which of the following would be a proper rejection in a reexamination proceeding?',
    options: [
      'A rejection under 35 U.S.C. § 102(a) based on an affidavit that the invention was known or used by others before the invention thereof by the applicant for patent.',
      'A rejection under 35 U.S.C. § 102(b) based on an affidavit that the invention was in the public use in this country more than one year prior to the date of the application for a patent in the United States.',
      'A rejection under 35 U.S.C. § 102(e) that the invention was described in a patent by another filed in the United States before the invention thereof by the patent applicant.',
      'A rejection under 35 U.S.C. § 102(f) that the applicant did not himself invent the subject matter sought to be patented.',
      'A rejection under 35 U.S.C. § 102(b) that the invention was on sale in this country, more than one year prior to the date of the application for patent in the United States.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 301; 37 C.F.R. § 1.552; MPEP § 2258. (A), (B), (D) and (E) are incorrect because reexamination is limited to substantially new questions of patentability based on PATENTS AND PUBLICATIONS. [Pre-AIA] — the prior-art subsections cited are pre-AIA.',
  },
  {
    id: 'uspto-nov99-am-22',
    topicId: 5,
    subtopic: 'Broadening: reissue within two years, never in reexamination',
    difficulty: 3,
    question:
      'Patentee P wishes to amend Claim 1 in the patent granted to P, deleting "member" in favour of "ball", "flanged" from "seal", and "means" from "linear spring", and to obtain the amended claim either through reexamination or reissue. The amended claim is supported by the original disclosure. In the absence of questions of recapture, novelty, obviousness, and utility, which of the following statements is/are true?',
    options: [
      'A claim so amended is properly presented in a reissue application filed on October 14, 1999, and a reissue patent is grantable where reissuance is sought of a patent granted on September 9, 1997.',
      'A claim so amended is properly presented in a reissue application filed on September 9, 1999, and a reissue patent is grantable where reissuance is sought of a patent granted on October 7, 1997.',
      'A claim so amended is properly presented in a request for reexamination filed on October 14, 1999, and a certificate of reexamination is grantable where reexamination is sought of a patent granted on September 9, 1997.',
      'A claim so amended is properly presented in a request for reexamination filed on September 9, 1999, and a certificate of reexamination is grantable where reexamination is sought of a patent granted on October 7, 1997.',
      '(B) and (D).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). The scope of Claim 1 is enlarged by the deletion of "flanged" as a modifier of "seal." Because the reissue application is filed LESS than two years after the original patent was granted and seeks to enlarge scope, a reissue patent may properly be granted. 35 U.S.C. § 251. (A) is incorrect because that reissue application was filed more than two years from the grant. (C) and (D) are incorrect because claims cannot be enlarged in a reexamination regardless of when filed. 35 U.S.C. § 305; 37 C.F.R. § 1.552(b). (E) is incorrect since (D) is incorrect.',
  },
  {
    id: 'uspto-nov99-am-23',
    topicId: 0,
    subtopic: 'Commercial use is not experimental use',
    difficulty: 3,
    question:
      'Your client Homer invented a system for laying underground pipes using a tunneling tool, "the Mole." He has continuously used the original system for three years in his commercial landscaping business, displayed it to numerous customers, and profited from it. Two months ago he modified the system to use ultrasonic signals encoded with GPS location information; that use is new and unobvious, was reduced to actual practice, and kept confidential. Which of the following would not be reasonable advice to Homer?',
    options: [
      'Claim 5 is not indefinite even though it is not limited to ultrasonic target signals and the only disclosed embodiment that utilizes encoded position information utilizes ultrasonic target signals.',
      'Claim 1, as presently written, is statutorily barred, and the claimed invention should be limited to the modified system.',
      'Because the original system had a drawback in that it sometimes got confused by ferromagnetic underground pipes or power lines, and because Homer continued to develop the system to overcome these drawbacks, the original system was experimental and does not constitute prior art against the modified system.',
      'Claim 4 is indefinite.',
      'The language in Claim 1 reciting the "target" should be reworded to clarify that the ground is not part of the claimed combination, e.g., by adding the words "adapted to be" before "placed".',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Under the stated facts Homer\'s commercial use is a bar under 35 U.S.C. § 102(b) because it was NOT experimental, so (C) would be unreasonable advice. MPEP § 2133.03. For the same reason, and because the modified system is new and unobvious, (B) would be reasonable advice. (A) would be reasonable because whether the claim is limited to ultrasonic signals is a question of breadth, not definiteness. MPEP § 2173.04. (D) is reasonable because there is no antecedent basis for "the decoder portion of said tunneling device sensor". (E) is reasonable because an argument could be made that the claim as drafted could not be infringed until the target is actually placed in the ground. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-nov99-am-24',
    topicId: 0,
    subtopic: 'Which statutory provision bars the claim',
    difficulty: 2,
    question: 'Claims 1 and 2 are unpatentable under which of the following statutory provisions?',
    options: [
      '35 U.S.C. § 102(b).',
      '35 U.S.C. § 102(c).',
      '35 U.S.C. § 102(d).',
      '35 U.S.C. § 102(e).',
      'None of the above.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). 35 U.S.C. § 102(b). The claimed invention is unpatentable inasmuch as the invention was in public use and on sale more than one year before Homer files a patent application. (B)-(D) are incorrect because the given facts do not meet the conditions of § 102(c), (d), or (e). (E) is incorrect because (A) is correct. [Pre-AIA] — the AIA restructured these subsections.',
  },
  {
    id: 'uspto-nov99-am-25',
    topicId: 1,
    subtopic: 'PTO claim recommendations vs requirements',
    difficulty: 2,
    question: 'Which of the following is not a PTO recommendation or requirement?',
    options: [
      'Claims should be arranged in order of scope so that the first claim presented is the least restrictive.',
      'Product and process claims should be separately grouped.',
      'Every application should contain no more than three dependent claims.',
      'A claim which depends from a dependent claim should not be separated from that dependent claim by any claim which does not also depend from the dependent claim.',
      'Each claim should start with a capital letter and end with a period.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). The PTO does not require or recommend a minimum or maximum number of dependent claims. 37 C.F.R. § 1.75(c). (A) and (B) are PTO recommendations. MPEP § 608.01(m). (D) and (E) are PTO requirements. MPEP §§ 608.01(n), 608.01(m).',
  },
  {
    id: 'uspto-nov99-am-26',
    topicId: 5,
    subtopic: 'Substantial new question of patentability — old art vs new art',
    difficulty: 3,
    question:
      'A patent was granted to inventor Munch on August 3, 1999, on an application filed March 5, 1997. In which of the following circumstances in a reexamination proceeding of the Munch patent, considered independently, will the cited prior art properly support a determination that there is a substantial new question of patentability?',
    options: [
      'Claims 7-15 are rejected as anticipated under § 102(a) by the Leal patent, granted January 21, 1997. It is the only rejection. During original prosecution the Leal patent was used by the examiner to reject original claims 1-5 as anticipated under § 102(a).',
      'Newly added claims 16-20 are rejected as anticipated under § 102(b) by the Zellot patent, granted 1987. It is the only rejection. During original prosecution the examiner cited the Zellot patent against claims 1-7.',
      'Claims 1-15 are rejected as obvious under § 103 over the Wills patent in view of the Note patent. Wills was granted December 3, 1996 and Note in 1994. During original prosecution the examiner used Wills to reject original claims 1 and 2. The Note patent was never before the examiner, is not cumulative, and is material to the question of obviousness.',
      'Claims 1-15 are rejected as anticipated under § 102(a) by the Richards patent, granted January 14, 1997. During original prosecution the examiner used Richards in combination with a patent to Smith, granted 1923, to reject original claims 1-5 as obvious under § 103.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). The combination presents a substantial new question of patentability. MPEP § 2244; In re Hiniker Co., 150 F.3d 1362, 47 USPQ2d 1523 (Fed. Cir. 1998). (A) and (D) are incorrect because a prior art reference that served as a rejection in the original prosecution could not support a substantial new question. In re Recreative Technologies, 83 F.3d 1394 (Fed. Cir. 1996). (B) is incorrect because art that was before the original examiner is "old art" even if it was not the basis of a rejection. In re Portola Packaging, 110 F.3d 786 (Fed. Cir. 1997). (E) is incorrect because (A), (B) and (D) are incorrect.',
  },
  {
    id: 'uspto-nov99-am-27',
    topicId: 0,
    subtopic: '35 U.S.C. § 101 — product of human ingenuity vs physical phenomenon',
    difficulty: 3,
    question:
      'Which of the following statements explains why Claim 1 below does recite subject matter eligible for protection under the Patent Statute? "Claim 1. A top soil for retaining water comprising: about 10% of material X; about 60% of material Y; and balance of material Z."',
    options: [
      'The subject matter is eligible if the top soil occurs in nature, and M was the first to find the topsoil on a remote tropical island.',
      'The subject matter is eligible if M developed the top soil through extensive research and experimentation with various materials, including materials X, Y, and Z.',
      'The subject matter is eligible because all inanimate objects are subject matter eligible for protection under the patent statute.',
      'The subject matter is eligible because the claim is sufficiently broadly written as not to exclude the inclusion of a living organism.',
      '(A) and (B).',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). "Laws of nature, physical phenomena, and abstract ideas" are not eligible, but a "nonnaturally occurring manufacture or composition of matter — a product of human ingenuity — having a distinctive name, character, [and] use" is. Diamond v. Chakrabarty, 447 U.S. 303, 309 (1980); MPEP § 2105. (B) is correct because the top soil is a product of M\'s ingenuity. (A) is incorrect because the top soil is a naturally occurring composition M merely located first. (C) is incorrect because only NON-naturally occurring inanimate objects are eligible.',
  },
  {
    id: 'uspto-nov99-am-28',
    topicId: 1,
    subtopic: 'Product-by-process claims — curing an improper dependent claim',
    difficulty: 3,
    question:
      'A patent application contains three claims, including product by process Claim 3: "Claim 1. A method for making an Ethernet cable comprising the steps of A, B and C. Claim 2. The method of claim 1, further characterized by the step of D. Claim 3. The Ethernet cable as in any one of the preceding claims." In the first Office action the examiner objects to Claim 3 as an improper dependent claim and requires cancellation. Which of the following replies best overcomes the objection and provides the client with the broadest patent protection?',
    options: [
      'Amend Claim 3 to read: "The Ethernet cable as made by the process set forth in claims 1-2."',
      'Cancel Claim 3.',
      'Add Claim 4, which reads: "An Ethernet cable made by a process comprising the steps of A, B and C."',
      'Add Claim 5, which reads: "An Ethernet cable made by a process comprising the steps of A, B, C and D."',
      '(B), (C), and (D).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). The cancellation of Claim 3 overcomes the examiner\'s objection, and the addition of Claims 4 and 5 provides protection in product-by-process format for the cable by both methods of manufacture — so if Claim 4 is invalid, Claim 5 may remain valid. (A) is incorrect because it is an improper multiple dependent claim. 35 U.S.C. § 112, paragraph 5; 37 C.F.R. § 1.75(c); MPEP § 608.01(n). (B) alone is incorrect because canceling the claim leaves the application without a claim to the Ethernet cable.',
  },
  {
    id: 'uspto-nov99-am-29',
    topicId: 0,
    subtopic: '"Public" modifies use, not sale',
    difficulty: 3,
    question: 'Which of the following statements is in accordance with proper PTO practice and procedure?',
    options: [
      'Unlike questions of public use, there is no requirement that "on sale" activity be "public."',
      'Sales to toy stores throughout the United States of a claimed rocking horse by an independent third party more than one year before the filing date of applicant’s patent application without the applicant’s consent will not bar applicant from obtaining a patent for the rocking horse.',
      'An offer for sale of a claimed invention, where the offer originates in the United States and is communicated to a potential buyer in Europe, more than one year before the filing date of applicant’s patent application, cannot be sufficient activity to bar applicant from obtaining a patent for the invention.',
      'Delay alone in filing a patent application is sufficient to infer any required intent by the inventor to abandon the invention.',
      '"Patented" in 35 U.S.C. § 102(e) includes the publication of German applications as printed documents called Offenlegungsschrift.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 2133.03(b). "Public" as used in § 102(b) modifies "use" only; it does not modify "sale." Hobbs v. United States, 451 F.2d 849 (5th Cir. 1971). (B) is incorrect — sale by an independent third party more than 1 year before the filing date will bar the applicant. In re Caveney, 761 F.2d 671 (Fed. Cir. 1985). (C) is incorrect — an offer made or originating in this country may suffice even though sale and delivery take place abroad. MPEP § 2133.03(d). (D) is incorrect — delay alone is not sufficient to infer intent to abandon. MPEP § 2134. (E) is incorrect — an Offenlegungsschrift is not a patent under § 102(d). Ex parte Links, 184 USPQ 429 (Bd. App. 1974). [Pre-AIA] — decided under pre-AIA § 102.',
  },
  {
    id: 'uspto-nov99-am-30',
    topicId: 2,
    subtopic: 'Deposit account with insufficient funds — surcharge required',
    difficulty: 3,
    question:
      'On September 14, 1999, you filed a patent application in the PTO on behalf of a large corporation together with an authorization to charge the filing fee to your deposit account. However, measures were not taken to cover the $760.00 filing fee against the amount in your deposit account, which has a $10.00 balance. You received a notice from the PTO dated September 28, 1999, that your deposit account has insufficient funds. Which of the following steps avoids abandonment of the recently filed application?',
    options: [
      'On September 29, 1999, replenish the deposit account with $800.00 in cash to encompass the filing fee, and the $10 fee required by 37 CFR § 1.21(b)(1).',
      'On September 29, 1999, open a new deposit account with $800.00 in cash, and file in the PTO correspondence authorizing the fee for filing the application be charged against your new deposit account.',
      'On September 29, 1999, file in the PTO a check for $760.00 for the filing fee, and file in the PTO correspondence authorizing the balance of the filing fee be paid from your deposit account.',
      'On September 29, 1999, replenish the deposit account with $890.00 in cash to cover the filing fee, and a surcharge fee for late payment of the filing fee, and file in the PTO correspondence authorizing the fees for the application be charged to your deposit account.',
      '(B) or (C).',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.16(a) and (e); MPEP § 509.01: "if there is an authorization to charge the filing fee to a deposit account which is overdrawn or has insufficient funds, a surcharge (37 CFR § 1.16(e)) is required in addition to payment of the filing fee. Failure to timely pay the filing fee and surcharge will result in abandonment of the application."',
  },
  {
    id: 'uspto-nov99-am-31',
    topicId: 2,
    subtopic: 'Counting claims for fee purposes with multiple dependencies',
    difficulty: 3,
    question:
      'The following claims are included in a newly filed patent application: 1. Independent; 2. Dependent on claim 1; 3. Dependent on claim 1; 4. Dependent on claims 2 and 3; 5. Independent; 6. Dependent on claim 1, 2 or 5; 7. Dependent on claim 6; 8. Independent. Which of the following represents the proper number of total claims for fee calculation purposes?',
    options: ['10', '13', '11', '12', '8'],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 37 C.F.R. § 1.75(c); MPEP § 608.01(n).',
  },
  {
    id: 'uspto-nov99-am-32',
    topicId: 3,
    subtopic: 'Preliminary amendment and the declaration that must refer to it',
    difficulty: 3,
    question:
      'On August 23, 1999, you file a patent application in the PTO. Along with the application, you file an unexecuted declaration that refers to the application and a preliminary amendment that describes the best mode of carrying out the claimed invention. Subsequently you file a signed declaration in reply to a Notice to File Missing Parts. The best mode is described only in the preliminary amendment. In the first Office action, the examiner objects to the preliminary amendment as adding new matter and requires cancellation. Considering the following responses separately, the best way to respond to and overcome the objection, and obtain a patent is to:',
    options: [
      'file a reply pointing out that the objection is improper because the declaration filed in reply to the Notice to File Missing Parts is a properly executed declaration that refers only to the amendment.',
      'file a reply pointing out that the objection is improper because the declaration filed in reply to the Notice to File Missing Parts is a properly executed declaration that refers only to the application and amendment.',
      'file a reply pointing out that the objection is improper because the declaration filed in reply to the Notice to File Missing Parts is a properly executed supplemental declaration that refers only to the amendment.',
      'file an appeal to the Board of Patent Appeals and Interference requesting review of the examiner’s objection to the amendment as adding new matter.',
      'file a reply to the Office action canceling the new matter.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). When an amendment accompanies a non-provisional application filed without a signed declaration, the amendment is considered part of the original disclosure PROVIDED the subsequently filed declaration refers to BOTH the application and the amendment. MPEP §§ 608.04(b), 714.09. (A) is incorrect because the declaration must refer to both. (C) is incorrect because the original disclosure cannot be altered by a supplemental declaration referring to different papers. 37 C.F.R. § 1.67(b). (D) is incorrect because an objection to an amendment as new matter is petitionable to the Commissioner under § 1.181(a)(1). (E) is incorrect because, although canceling would overcome the objection, the application would then fail to set forth the best mode. [Historical practice] — preliminary-amendment practice was revised in 2004 so that an amendment present on the filing date is part of the original disclosure.',
  },
  {
    id: 'uspto-nov99-am-33',
    topicId: 5,
    subtopic: 'Broadening in reexamination is never allowed',
    difficulty: 3,
    question:
      'During a reexamination proceeding, you submit the following amendment less than two years from the date the patent was granted: "1. (once amended) An application specific integrated circuit for calculating a correlation coefficient, comprising: a multiplication unit [having a plurality of sixty-four bit shift registers]; an integration unit coupled to said multiplication unit; and a digital filter unit coupled to said integration unit and to said multiplication unit." The original disclosure stated that a plurality of thirty-two bit shift registers could be used. Which, if any, of the following statements concerning the amendment is true?',
    options: [
      'The form of the amendment is improper, since underlining and brackets are not proper in proceedings where only issues concerning substantial new questions of patentability may be raised.',
      'The claim as amended should be allowed if it overcomes the art of record in the application since the amendment was made less than two years from the date that a patent was granted.',
      'The claim as amended should be allowed if it overcomes the art of record in the application since the amendment, although broader in some respects than the claim of the patent, is narrower in other respects.',
      'The claim as amended should not be allowed since it broadens the scope of the claim of the patent.',
      'None of the above.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 2258, item III. (A) is incorrect because the form of the amendment is proper. MPEP § 2250. (B) is incorrect because the amendment broadens the scope of the claim, which is NEVER allowed in a reexamination proceeding — the two-year window is a reissue concept. (C) is incorrect because a claim is broader if it is broader in ANY respect, even though narrower in others. (E) is incorrect because (D) is correct.',
  },
  {
    id: 'uspto-nov99-am-34',
    topicId: 0,
    subtopic: 'Rebutting a prima facie case — criticality of an overlapping range',
    difficulty: 3,
    question:
      'If a claim has been properly rejected under 35 U.S.C. § 103 as being rendered prima facie obvious over a combination of prior art references, then the rejection can be rebutted in accordance with proper PTO practice and procedure by:',
    options: [
      'showing the criticality of the claimed range where the range in the claim overlaps the range disclosed in one or both prior art references.',
      'arguing that the client has recognized latent properties in the prior art which were not recognized by the prior art references.',
      'arguing that a combination would not be made by a businessman for economic reasons.',
      'contending that each of the prior art references, taken individually, does not teach or render obvious the claimed invention.',
      '(A), (B), and (C).',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (A). MPEP § 2144.05, item III: "Applicant can rebut a prima facie case of obviousness based on overlapping ranges by showing the criticality of the claimed range." In re Woodruff, 919 F.2d 1575 (Fed. Cir. 1990). (B) is incorrect — mere recognition of latent properties in the prior art does not render nonobvious an otherwise known invention. In re Wiseman, 596 F.2d 1019 (CCPA 1979). (C) is incorrect — that a combination would not be made for economic reasons does not mean a person of ordinary skill would not make it. In re Farrenkopf, 713 F.2d 714 (Fed. Cir. 1983). (D) is incorrect — nonobviousness cannot be shown by attacking references individually where the rejection is based on a combination. In re Keller, 642 F.2d 413 (CCPA 1981).',
  },
  {
    id: 'uspto-nov99-am-35',
    topicId: 5,
    subtopic: 'Plant patents carry no maintenance fee',
    difficulty: 2,
    question:
      'Morris, a registered practitioner, obtained a plant patent for a client on a commercial catnip hybrid. Over four years later he came across a letter from his client indicating the client’s belief that a maintenance fee was due four years after issuance. By the time Morris found the letter, it was eight months after the four year anniversary of the plant patent’s issuance. Morris should immediately:',
    options: [
      'Tender the maintenance fee and submit a petition (with the required fee) for acceptance of payment where the delay was unintentional.',
      'Pay the maintenance fee plus the surcharge for filing a maintenance fee during the grace period.',
      'Write the client that no maintenance fee is in fact owed, and apologize for the delay in responding to the client.',
      'Do nothing because the patent is irrevocably lost due to failure to pay the maintenance fee within the grace period.',
      'Tender the maintenance fee and submit a petition (with an affidavit blaming the cat and with the required fee) for acceptance of payment where the delay was unavoidable.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 41(b); 37 C.F.R. § 1.20(e). There is no maintenance fee for a plant patent. Thus all of the other answers, which assume that a maintenance fee is owed, are wrong.',
  },
  {
    id: 'uspto-nov99-am-36',
    topicId: 0,
    subtopic: 'Anticipation with open-ended ranges and "consisting of"',
    difficulty: 3,
    question:
      'Following proper PTO practices and procedures, which of the following reference(s) anticipates Claim 1: "1. A composition consisting of: 60-80% cellulose; 16-18% nylon; up to 0.5% fiber; and at least 6% cotton; said composition being capable of absorbing water in the amount of not more than 45% by weight of the composition."',
    options: [
      'A reference disclosing a sponge having 69% cellulose, 16% nylon, 0.4% fiber, 7% cotton, and 7.6% silk.',
      'A reference disclosing a sponge having 78% cellulose, 17% nylon, 0.2% fiber, 4.8% cotton, and a water content of 30% by weight.',
      'A reference disclosing a sponge having 76% cellulose, 16% nylon, 8% cotton and containing no water.',
      'A reference disclosing a sponge having 61% cellulose, 18% nylon, 0.6% fiber, 20.4% cotton, and a water content of 45% by weight.',
      '(B) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). A claim is anticipated only if each and every element is found, expressly or inherently, in a single prior art reference. Verdegaal Bros. v. Union Oil Co., 814 F.2d 628 (Fed. Cir. 1987); MPEP § 2131. The phrase "up to" includes zero as a limit, and "not more than" includes no water. MPEP § 2173.05(c). (C) shows 76% cellulose, 16% nylon, 0% fiber, 8% cotton and no water, meeting all the limitations. (A) is incorrect because "consisting of" excludes the silk. MPEP § 2111.03. (B) is incorrect because 4.8% cotton is outside "at least 6% cotton." (D) is incorrect because 0.6% fiber is outside "up to 0.5% fiber." [Pre-AIA] — anticipation under pre-AIA § 102.',
  },
  {
    id: 'uspto-nov99-am-37',
    topicId: 1,
    subtopic: 'Antecedent basis — completing a shaving implement claim',
    difficulty: 3,
    question:
      'A patent application includes partial Claim 1 for a shaving implement whose later elements recite "said handle at said first end" (ii), "said chamber" (iii), and "said longitudinal sides of said channel" (iv). Which of the following, if included as paragraph (i) of Claim 1, best completes the claim while giving the client the broadest protection?',
    options: [
      'a substantially rigid handle including a chamber and a channel formed in said handle, said channel being defined by longitudinal sides within said handle;',
      'a substantially rigid handle having a first end, said handle including a chamber and a channel formed in said handle, said channel being defined by longitudinal sides within said handle;',
      'a substantially rigid handle having a first end, said handle including a chamber and an elongated channel formed in said handle;',
      'a substantially rigid handle having a first end, said handle including a chamber and a channel formed in said handle;',
      'a substantially rigid handle having a first end, said handle including a channel formed in said handle, said channel being defined by longitudinal sides within said handle;',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B). (A) fails to provide proper antecedent basis for "said first end" in part (ii) of the claim. (C) and (D) fail to provide proper antecedent basis for "said longitudinal sides of said channel" in part (iv). (E) fails to provide proper antecedent basis for "said chamber" in part (i) and subsequent parts.',
  },
  {
    id: 'uspto-nov99-am-38',
    topicId: 4,
    subtopic: 'Retroactive foreign filing license',
    difficulty: 2,
    question:
      'Which of the following must be included in a petition for a retroactive license to file a patent application in a foreign country?',
    options: [
      'A verified statement containing an averment that the subject matter in question was not under a secrecy order at the time it was filed abroad, and that it is not currently under a secrecy order.',
      'A verified explanation of why the material was filed abroad through error and without deceptive intent without the required license first having been obtained.',
      'A listing of each of the foreign countries in which the unlicensed patent application was filed.',
      '(A) and (B).',
      '(A), (B) and (C).',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. § 184; 37 C.F.R. § 5.25(a); MPEP § 140.',
  },
  {
    id: 'uspto-nov99-am-39',
    topicId: 1,
    subtopic: 'Product-by-process — novelty must be in the product',
    difficulty: 3,
    question:
      'Applicant filed a patent application claiming a polyol used to form rigid polyurethane foam having a structural formula. The examiner properly rejected the claimed polyol as unpatentable over prior art disclosing the claimed polyol and its use to form rigid polyurethane foam having the same structural formula. Given that applicant’s specification discloses the polyol may be produced by a novel and unobvious process comprising steps A, B, C, and D, which of the following claims, if introduced by amendment, would overcome the rejection?',
    options: [
      'A polyol having the property of forming rigid polyurethane foam having structural formula Z, the polyol being produced by the process comprising the steps A, B, C, and D.',
      'A polyol produced by the process comprising the steps A, B, C, and D, said polyol having the property of forming rigid polyurethane foam having structural formula Z.',
      'A polyol produced by the process comprising the steps A, B, C, and D.',
      'A polyol comprising the resultant product of steps A, B, C, and D.',
      'A polyol-producing process comprising steps A, B, C, and D, said process resulting in a polyol capable of forming rigid polyurethane foam having structural formula Z.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). 35 U.S.C. §§ 102 and 103; Ex parte Edwards, 231 USPQ 981 (Bd. Pat. App. & Int. 1986); In re Thorpe, 777 F.2d 695 (Fed. Cir. 1985); MPEP §§ 2113 and 2173.05(p). (A)-(D) are wrong because they are product-by-process claims, and the novelty is only in the PROCESS.',
  },
  {
    id: 'uspto-nov99-am-40',
    topicId: 1,
    subtopic: '"Consisting of" bars a dependent claim from adding an ingredient',
    difficulty: 3,
    question:
      'You receive a non-final Office action allowing Claim 1 and rejecting Claims 2 through 6. Claim 1 reads: "A ship propeller exhibiting excellent corrosion resistance, said ship propeller consisting essentially of a copper base alloy consisting of 2 to 10 percent tin, 0.1 to 0.9 percent zinc, and copper." The specification teaches that the copper base alloy made with the addition of 2 to 10 percent aluminum increases wear resistance, but adding aluminum to the SURFACE of the propeller does not. Which of the following claims, if any, if added by amendment would accord with proper PTO practice and procedure?',
    options: [
      '7. A copper base alloy according to Claim 1 wherein said alloy includes 2 to 10 percent aluminum.',
      '7. A ship propeller according to Claim 1 including the step of adding 2 to 10 percent aluminum to the copper base alloy.',
      '7. A ship propeller according to Claim 1 including 2 to 10 percent aluminum.',
      '7. A ship propeller according to Claim 1 wherein said alloy includes 2 to 10 percent aluminum.',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). (A) is wrong because Claim 1 is directed to a ship propeller whereas (A) is directed to a copper base alloy — a non sequitur, making the dependent claim indefinite under § 112 ¶ 2. (B) is wrong because it introduces a process step into a product claim, covering more than one statutory class. (C) is wrong because the specification teaches adding aluminum to the ALLOY, not the propeller, so the claim introduces new matter and is unclear. (D) is wrong because "consisting of" in Claim 1 excludes any element not specified — "A claim which depends from a claim which \'consists of\' the recited elements or steps cannot add an element or step." MPEP § 2111.03.',
  },
  {
    id: 'uspto-nov99-am-41',
    topicId: 1,
    subtopic: 'A preferred narrower range inside a broad range is indefinite',
    difficulty: 2,
    question:
      'A claim limitation reads "a pH range between 7 and 12, preferably between 9 and 10." Which of the following is correct?',
    options: [
      'Since the limitation properly sets forth outer limits, it is definite.',
      'As long as the limitation is supported in the written description, it is proper.',
      'The limitation is indefinite.',
      'Since the limitation sets forth a preferred range, it is definite.',
      'An applicant is precluded from expanding the claim coverage beyond a pH range of 7-12 under the doctrine of equivalents.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). MPEP § 2173.05(c) indicates that a preferred narrower range set forth within a broader range is an indefinite claim limitation. (A), (B), and (D) are not correct for the same reason. (E) is wrong because the doctrine of equivalents operates to EXPAND claim coverage beyond the literal scope of the claim language.',
  },
  {
    id: 'uspto-nov99-am-42',
    topicId: 2,
    subtopic: 'Minimum needed to secure a filing date when drawings are not required',
    difficulty: 3,
    question:
      'Practitioner Wally is preparing an application directed to a method of making a particular composition and believes color drawings would be most helpful. The application contains only method claims and does not include any reference to drawing figures. Before the color drawings are complete, the client directs Wally to file by the close of business that day due to an unforeseen statutory bar date. Drawings are not required to understand the claimed method. Which of the following combination of acts presents the minimum course of action to be taken by Wally in order to obtain a filing date that avoids the statutory bar?',
    options: [
      'File the application, oath and filing fee by the close of business without the drawings.',
      'File the application by the close of business without the oath, filing fee or drawings.',
      'File the application and filing fee without the drawings and later file a petition for accepting the color drawings along with the petition fee; three (3) sets of color drawings; and a proposed amendment to insert the following in the specification: "The file of this patent contains at least one drawing executed in color. Copies of this patent with color drawing(s) will be provided by the Patent and Trademark Office upon request and payment of the necessary fee."',
      'File the application without the drawings by the close of business; file a preliminary amendment the next day that amends the specification to refer to drawing figures and which includes a set of black and white drawings.',
      'None of the above.',
    ],
    correct: 1,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (B) is the most correct answer. MPEP § 601.01(f): "It has been PTO practice to treat an application that contains at least one process or method claim as an application for which a drawing is not necessary for an understanding of the invention under 35 U.S.C. § 113." (A) is not the MINIMUM, given that the filing fee and oath may be submitted after the specification. 35 U.S.C. § 111(a)(3). (C) is incorrect because the petition may be deferred until the examiner requires formal drawings. (D) is not the minimum. (E) is incorrect because (B) is correct.',
  },
  {
    id: 'uspto-nov99-am-43',
    topicId: 2,
    subtopic: 'Petition to revive an unintentionally abandoned application',
    difficulty: 3,
    question:
      'You prepared a timely reply that would have placed the application in condition for allowance and put it in a correctly addressed envelope with a metered mail stamp dated June 4, 1999. The reply fell inside the desk, behind the drawer, and was never mailed. Today, November 3, 1999, you receive a Notice of Abandonment. A valid patent, including the claims in the abandoned application, can be obtained for your mother, if:',
    options: [
      'you submit a new reply to the patent examiner arguing the commercial success of the item as shown by the sales of the five items sold over a year ago with affidavits under 37 CFR § 1.132 traversing the holding of abandonment.',
      'you mail the reply today in its original, sealed envelope which takes precedence over the Notice of Abandonment since the date stamped on the envelope is both before the due date for reply and before the Notice of Abandonment.',
      'the applicant files a petition to revive an unintentionally abandoned application stating that the entire delay in filing the required reply was unintentional, files the reply that was prepared by you in June 1999, and submits the appropriate petition fee.',
      'you provide the unopened envelope as evidence of the staff assistant’s negligence and petition the Group Director to reopen prosecution of the application on the merits.',
      'you file a petition to revive an unavoidably abandoned application stating that the entire delay in filing the reply was unavoidable, submitting the required reply prepared by you in June 1999, the proper petition fee, and a terminal disclaimer and fee dedicating to the public a terminal part of the term of any patent granted equivalent to the period of abandonment of the application.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 37 C.F.R. § 1.137(b). [Historical practice] — the companion "unavoidable" revival standard of § 1.137(a), which choice (E) invokes, was eliminated in 2013; unintentional revival under § 1.137(b) survives.',
  },
  {
    id: 'uspto-nov99-am-44',
    topicId: 1,
    subtopic: 'What may not be used to show a claim exceeds what applicant regards as the invention',
    difficulty: 3,
    question:
      'A practitioner should consider whether information presented during prosecution of an application may be used by the examiner as evidence against the applicant. What evidence may an examiner not use to demonstrate that a claim fails to correspond in scope with that which an applicant regards as his or her invention?',
    options: [
      'Arguments, containing admissions, advanced in a reply filed by the practitioner representing the applicant.',
      'Admissions contained in a brief.',
      'The lack of agreement between the claims and the specification.',
      'Affidavits, containing admissions, filed under 37 CFR § 1.132.',
      'All of the above.',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). Applicant\'s own disclosure in the specification and claims may not be used against the applicant; the content of the specification may not be used as evidence that the scope of the claims is inconsistent with what applicant regards as the invention. The lack of agreement between claims and specification is properly considered only with respect to § 112, FIRST paragraph. In re Ehrreich, 590 F.2d 902 (CCPA 1979); MPEP § 2172. (A), (B) and (D) are incorrect — such evidence can be found in admissions in arguments or briefs (In re Prater, 415 F.2d 1393 (CCPA 1969)) or in § 1.132 affidavits (In re Cormany, 476 F.2d 998 (CCPA 1973)).',
  },
  {
    id: 'uspto-nov99-am-45',
    topicId: 5,
    subtopic: 'Reissue — recapture of deliberately cancelled subject matter',
    difficulty: 3,
    question: 'Which of the following statements regarding a reissue patent application is true?',
    options: [
      'Only one reissue patent application is permitted to be issued for distinct and separate parts of the thing patented.',
      'New matter may be properly added in a reissue application to correct an error made during the prosecution of the original patent application.',
      'A reissue will not be granted to "recapture" claimed subject matter deliberately canceled in an application to obtain a patent.',
      'To retain the benefit of priority under 35 U.S.C. § 119, it is not necessary to make a new claim for priority in the reissue patent application if a claim for priority was perfected in the application on which the original patent was made.',
      '(C) and (D).',
    ],
    correct: 2,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (C). 35 U.S.C. § 251; MPEP §§ 1411, 1411.02, 1412.02. (D) is not a correct answer. MPEP § 1417. (A) is incorrect. 35 U.S.C. § 251, paragraph 2. (B) is incorrect. 35 U.S.C. § 251, paragraph 1.',
  },
  {
    id: 'uspto-nov99-am-46',
    topicId: 3,
    subtopic: 'Amendments that do not avoid anticipation — preamble and means equivalents',
    difficulty: 3,
    question:
      'Sam invented an apparatus for labeling and identifying baseballs, described as including means for marking baseballs; an ultraviolet light source; and a computer coupled to both. The only means for marking set forth was a commercially available invisible ink stamper. Claim 1 was properly rejected under § 102(b) as anticipated by a patent to McGoo disclosing an apparatus having only an invisible ink stamper, an ultraviolet light source, and a computer coupled to both, described as useful for labeling baseball BATS. Which of the following amendments, if any, avoids anticipation of Claim 1 by the McGoo patent?',
    options: [
      '1. (amended once) An apparatus intended to be used to identify home run baseballs, comprising: an invisible ink stamper; an ultraviolet light source; and a computer coupled to said invisible ink stamper and to said ultraviolet light source.',
      '1. (amended once) An apparatus, [comprising] consisting of: an invisible ink stamper, an ultraviolet light source, and a computer coupled to said invisible ink stamper and to said ultraviolet light source.',
      '1. (amended once) An apparatus, comprising: [an invisible ink stamper] a marker; an ultraviolet light source, and a computer coupled to said means for marking baseballs and to said ultraviolet light source.',
      '(B) and (C).',
      'None of the above.',
    ],
    correct: 4,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (E). (A) is incorrect because a preamble is generally not accorded patentable weight where it merely recites the intended use of a structure. MPEP § 2111.02. (B) is incorrect because the facts set forth that the McGoo invention is described as limited to the elements recited in (B). MPEP § 2111.03. (C) is incorrect because the structure corresponding to means for marking baseballs, and equivalents thereof, includes an invisible ink stamper. (D) is incorrect since (B) and (C) are both incorrect. [Pre-AIA] — decided under pre-AIA § 102(b).',
  },
  {
    id: 'uspto-nov99-am-48',
    topicId: 1,
    subtopic: 'A well-known term can be definite without antecedent basis in the description',
    difficulty: 3,
    question:
      'An original claim in a patent application to a mechanical arts invention recites the limitation of "a clip," which is shown in an original application drawing as being one of several elements of the invention. The "clip" is well known in the mechanical arts. However, "a clip" does not appear in the original written description part of the application. Which of the following is correct?',
    options: [
      'The written description may not be properly amended to include "a clip"',
      'The claim is indefinite with respect to "a clip."',
      'The application lacks an enabling disclosure as to "a clip."',
      'The claim is definite with respect to "a clip."',
      'The application fails to set forth the best mode for "a clip."',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). MPEP § 2173.05(e) indicates that as long as a claim phrase has a reasonable degree of clarity, such as reciting something well known in the mechanical arts (e.g., "a clip"), the claim phrase is definite despite the lack of antecedent basis in the written description. (A) is not correct — an original written description may be amended to include originally claimed subject matter. MPEP § 2163.06. (B) is not correct for the reason given. (C) is not correct — ordinary skill in the mechanical arts is presumed when considering enablement. MPEP § 2164.05(b). (E) is not correct — absent evidence to the contrary it is assumed the best mode is present, and "a clip" is disclosed in the drawing. MPEP § 2165.03.',
  },
  {
    id: 'uspto-nov99-am-49',
    topicId: 1,
    subtopic: 'Best mode — no duty to designate it, one example is not proof',
    difficulty: 3,
    question:
      'A nonprovisional patent application has been filed for inventor Alton disclosing and claiming an alumino-silicate catalyst for oxidizing organic compounds. Which of the following statements, considered separately, about the best mode contemplated by Alton for the alumino-silicate catalyst is not true?',
    options: [
      'The best mode must be designated as the best mode in the application if the application contains several embodiments, one of which is the best mode.',
      'The presence of one specific example in the specification is evidence that the best mode has been disclosed.',
      'The best mode need not be updated if, between the time of filing the non-provisional patent application and a continuation application, Alton discovered a better catalyst than the best mode disclosed in the non-provisional application.',
      'A failure to disclose the best mode in the application as filed cannot be cured by first introducing into the application by amendment a specific mode of practicing the invention.',
      'There is no statutory requirement for the best mode being disclosed in the specification as a specific example.',
    ],
    correct: 0,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): TWO ANSWERS WERE ACCEPTED — the model answer reads "ANSWERS: (A) and (B)." (A) is correct (i.e., not true as a statement of law): there is no requirement in the statute for applicants to point out which of the disclosed embodiments they consider to be the best mode. MPEP § 2165.01, item III; Ernsthausen v. Nakayam, 1 USPQ2d 1539 (Bd. Pat. App. & Inter. 1985). (B) is also correct: the presence of only one specific example is NOT evidence that the best mode has been disclosed. MPEP § 2165.01, item II. (C) is incorrect — Transco Products v. Performance Contracting, 38 F.3d 551 (Fed. Cir. 1994). (D) is incorrect — new matter cannot cure the defect. In re Hay, 534 F.2d 917 (CCPA 1976). (E) is incorrect because it is a correct statement of the law. This item is keyed to (A) here because the bank stores a single key; (B) was equally accepted by the USPTO. [Historical practice] — the AIA eliminated failure to disclose the best mode as a ground for invalidity or unenforceability, though the disclosure requirement itself remains.',
  },
  {
    id: 'uspto-nov99-am-50',
    topicId: 1,
    subtopic: 'Claiming a combination — all essential elements positively recited',
    difficulty: 3,
    question:
      'You are drafting a patent application disclosing a door assembly wherein a door, a door frame, and a pair of hinges are separate elements which must be included in a claim to the assembled combination of a door secured to a door frame by a pair of hinges. The application discloses that it is essential to the invention that the door is secured to the doorframe in the described manner to permit the door to be readily opened and closed, and that the assembly in a closed relationship keeps out exterior elements while providing privacy and permitting quick egress in an emergency. Which of the following claims properly sets forth the combination?',
    options: [
      'An assembly having a door capable of being hingedly connected to a doorframe.',
      'An assembly having a door and means for securing the door.',
      'An assembly having a door and a pair of hinges for securing the door.',
      'An assembly having a door, and a doorframe, said door being secured to said doorframe with a pair of hinges.',
      'An assembly having a door adapted to be secured to a doorframe with a pair of hinges.',
    ],
    correct: 3,
    explanation:
      'OFFICIAL USPTO MODEL ANSWER (abridged): (D). 35 U.S.C. § 112, first paragraph; In re Mayhew, 527 F.2d 1229 (CCPA 1976). Only (D) positively recites every element disclosed as essential to the combination — the door, the doorframe, and the pair of hinges securing one to the other. The remaining choices omit an essential element or recite it only as an intended capability ("capable of being," "adapted to be") rather than as part of the claimed combination.',
  },
];

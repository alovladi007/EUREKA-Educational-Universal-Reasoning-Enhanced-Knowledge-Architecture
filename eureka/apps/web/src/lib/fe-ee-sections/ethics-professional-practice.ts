// FE EE course content — Ethics & Professional Practice (3 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_ETHICS_PROFESSIONAL_PRACTICE: Record<string, TopicLesson> = {
fee_codes_ethics: {
  topicId: 'fee_codes_ethics',
  title: 'NCEES Model Rules & NSPE Code of Ethics',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'The NCEES Model Rules and NSPE Code of Ethics define the legal and professional obligations of engineers. Public safety, honesty, conflicts of interest, and professional competence are the core principles tested on the FE exam.',
  sections: [
    {
      id: 'ce-codes',
      title: '1. Professional Codes and Core Principles',
      content: `## 1.1 NCEES Model Rules

The NCEES Model Rules provide the **legal framework** for engineering licensure:
- Obtain proper licenses before offering engineering services
- **Public health and safety is paramount** — always the top priority
- Follow applicable laws and regulations
- Avoid conflicts of interest
- Maintain professional competence through continuing education

## 1.2 NSPE Code of Ethics — Fundamental Canons

The NSPE Code establishes **professional values**:

1. **Hold paramount** the safety, health, and welfare of the public
2. Perform services only in areas of **competence**
3. Issue public statements only in an **objective and truthful** manner
4. Act for each employer or client as **faithful agents or trustees**
5. Avoid **deceptive acts**
6. Conduct themselves **honorably, responsibly, ethically, and lawfully**

## 1.3 Hierarchy of Obligations

When interests conflict, the priority is clear:

| Priority | Obligation |
|---|---|
| 1 (Highest) | **Public safety, health, welfare** |
| 2 | Laws and regulations |
| 3 | Professional codes and standards |
| 4 | Employer/client interests |
| 5 (Lowest) | Personal interests |`,
      examTip: 'On the FE exam, the correct answer to ethical dilemmas ALWAYS prioritizes public safety above all else — above profit, client satisfaction, employer directives, and personal convenience. If an answer choice mentions public welfare, it is very likely correct.',
      importantNote: 'Engineers must not claim credit for work they did not perform, must not misrepresent their qualifications, and MUST report situations that endanger public safety through proper channels.',
    },
    {
      id: 'ce-conflicts',
      title: '2. Conflicts of Interest and Whistleblowing',
      content: `## 2.1 Conflicts of Interest

A **conflict of interest** arises when personal gain might compromise professional judgment. Engineers must:
- **Disclose** conflicts to all affected parties
- **Refuse** assignments where objectivity cannot be maintained
- **Avoid** accepting gifts that could influence professional judgment
- **Not** serve competing clients without full disclosure

Conflicts extend beyond financial compensation to include:
- Family relationships with clients or contractors
- Prior business dealings that create bias
- Financial interests in competing companies

## 2.2 Whistleblowing and Reporting

When an engineer discovers work that **endangers public safety**:

1. **Document** the concern and your findings
2. **Report** through internal channels first (supervisor, management)
3. **Escalate** to the licensing board if internal reporting fails
4. **Report to authorities** if public safety is imminently threatened

Engineers who report safety violations in good faith are **protected from retaliation** under most state laws and professional codes.

## 2.3 Professional Competence

- Accept work **only** in areas where you have education, training, or experience
- If a project requires expertise you lack, **seek qualified assistance**
- Maintain competence through **continuing professional development**
- Admit limitations honestly rather than guessing`,
      examTip: 'FE exam ethics scenarios often present pressure to cut corners, falsify data, or exceed your competence. The correct answer always involves: (1) prioritizing public safety, (2) using proper channels to report concerns, (3) documenting everything, and (4) refusing to participate in unethical conduct.',
    },
    {
      id: 'ce-document-structure',
      title: '3. How the Two Documents Are Actually Organised',
      content: `## 3.1 Two documents, two kinds of force

Candidates conflate the NCEES Model Rules with the NSPE Code of Ethics because
they say similar things. They are different instruments with different legal
weight, and knowing which is which is itself examinable.

**The NCEES Model Law and Model Rules** are templates that NCEES publishes for
its member licensing boards. The **Model Law** is statutory language a state
legislature can adapt: what "practice of engineering" means, how the board is
constituted, what education, experience and examination a licence requires,
which activities are exempt, and what authority the board has to discipline.
The **Model Rules** are the administrative regulations that sit under such a
law, and they contain the **Rules of Professional Conduct**. Once a state
adopts them, they are **law** in that state, enforced by the board, and
violating them can cost you a licence.

**The NSPE Code of Ethics for Engineers** is a professional society's code. It
binds NSPE members through the society and carries no independent force of law,
but it is the most widely cited articulation of engineering ethics in the
United States, and its structure is the one most study material follows.

For the FE exam, the operative body of material is the ethics content NCEES
supplies in the reference handbook. The NSPE structure is worth knowing because
the reasoning is the same and because the exam's scenarios are written in its
vocabulary.

## 3.2 The structure of the NSPE Code

The code is layered, and the layers do different jobs:

| Part | Contents | Function |
|---|---|---|
| Preamble | The standing of engineering as a profession | States why a code exists at all |
| I. Fundamental Canons | Six broad duties | The principles you reason from |
| II. Rules of Practice | Numbered rules elaborating the first five canons | Turns principles into conduct |
| III. Professional Obligations | A further numbered set | Covers the situations the canons do not reach directly |

The six fundamental canons, in the order they appear, require engineers to hold
paramount public safety, health and welfare; to work only within their
competence; to make public statements objectively and truthfully; to act for
each employer or client as a faithful agent; to avoid deceptive acts; and to
conduct themselves honourably and lawfully so as to enhance the profession's
standing. The first is not merely first in a list — the code's own wording is
that engineers shall "hold paramount the safety, health, and welfare of the
public" (NSPE Code of Ethics, Fundamental Canon 1), and *paramount* is doing
real work in that sentence. It means the duty is not weighed against the others;
it outranks them.

## 3.3 The structure of the NCEES Rules of Professional Conduct

The Model Rules organise professional conduct by **whom the duty runs to**,
which is a more useful mental filing system for exam scenarios than a list of
virtues:

| Duty runs to | Typical requirements |
|---|---|
| **Society** | Hold public safety paramount; notify the proper authority when judgement is overruled in a way that endangers the public; be objective and truthful in reports and public statements; do not aid unlicensed practice |
| **Employers and clients** | Practise only in your area of competence; do not accept work you are not qualified for; keep client information confidential; disclose conflicts; do not accept compensation from more than one party on the same project without full disclosure and consent |
| **Other licensees** | Do not misrepresent your qualifications; do not injure another's reputation falsely; give credit where it is due; compete on merit rather than by improper means |

The Model Rules also enumerate **grounds for disciplinary action** — the
behaviours that can cost a licence. The categories are practical rather than
philosophical: fraud or deceit in obtaining a licence, gross negligence or
incompetence in practice, violation of the rules of conduct, criminal
convictions relating to the practice, aiding unlicensed practice, and failure to
comply with the board's continuing-education requirements.

## 3.4 The order of resolution

Real dilemmas involve two duties that both apply. The code resolves them by
rank, and the rank is not negotiable.

![Declared schematic: a five-step decision ladder for resolving competing duties, drawn as a sequence of questions from public safety down to personal interest, with the note that you answer at the first test that applies. This diagram is a teaching device summarising the priority order the lesson states — it is not a reproduction of any code's own layout.](/courses/fe-ee/figures/eth-duty-hierarchy.svg)

The schematic above is the exam algorithm, and it is worth internalising in
exactly this form because it converts a judgement call into a lookup. Work down
the ladder and stop at the first question that answers "yes":

1. **Does it endanger public safety, health or welfare?** If yes, that governs.
   Nothing below can outweigh it — not cost, not schedule, not the client's
   instructions, not your job.
2. **Does it break a law or regulation?** Legal duty comes next. You may not
   contract around it, and an employer's instruction does not excuse it.
3. **Does it violate a code of ethics or a standard of practice?** A code binds
   the licensee even where the law is silent.
4. **Does it harm the employer's or client's legitimate interest?** The
   faithful-agent duty is real and enforceable, but it operates **inside** the
   three tests above, never against them.
5. **Does it cost me personally?** Last, and never a reason to move anything
   above it.

Two consequences of the ordering catch candidates out. First, "my supervisor
told me to" resolves nothing — it is a level-4 consideration and cannot answer
a level-1 question. Second, confidentiality is a genuine duty at level 4, so an
engineer may not publish a client's proprietary data on a whim; but where
disclosure is necessary to protect the public, level 1 governs and the
confidentiality obligation yields.

## 3.5 What the codes do not say

Two clarifications that prevent overreach:

- The codes do not make an engineer the arbiter of every social question. The
  duty is competence-bounded: you are obliged to speak on matters within your
  professional knowledge and to be explicit when you are speaking outside it.
- The codes do not require martyrdom on a hunch. They require documented,
  escalated, good-faith action through the channels available, in proportion to
  the severity and immediacy of the hazard. The word the exam rewards is
  **proper authority**, not "the press".`,
      examTip: 'Learn which document is which: the NCEES Model Law and Model Rules become enforceable law when a state adopts them, and violating the Rules of Professional Conduct is grounds for board discipline. The NSPE Code is a professional society code — authoritative and widely cited, but not itself a statute.',
      importantNote: 'The word "paramount" in the first canon is the operative term. Public safety is not one factor to be balanced against cost and schedule; it ranks above them. Any answer choice that trades safety off against another interest is wrong regardless of how reasonable the trade sounds.',
    },
    {
      id: 'ce-worked-scenarios',
      title: '4. Four Scenarios Worked to a Defensible Answer',
      content: `## 4.1 How to work an ethics scenario

Exam ethics questions are not tests of moral intuition; they are tests of
whether you apply the ladder in the right order and choose the **least
escalated action that actually discharges the duty**. Four things decide the
answer:

1. **Who is exposed?** Public, client, employer, colleague, yourself.
2. **Which rung does the exposure sit on?**
3. **What is the least escalated action that resolves it?** Codes favour
   internal channels first, external escalation when internal channels fail or
   the hazard is immediate.
4. **What must be documented?** Nearly always: the concern, the analysis, the
   recommendation, and to whom it was given.

Two answer choices are almost always present and almost always wrong. **"Do
nothing, because someone senior said it was fine"** fails because the duty is
personal and non-delegable. **"Go straight to the media or the regulator"**
usually fails because it skips internal channels that were available and
functioning — unless the hazard is immediate.

## 4.2 Scenario: the concern that was dismissed

**Facts.** A newly licensed engineer identifies what appears to be a design
deficiency with a safety consequence. The senior engineer responds that the
design follows standard industry practice, that construction is already under
way, and that the probability of an incident is practically zero.

**The tempting answers.** That the junior has discharged the duty by raising it
once; or that the senior's greater experience settles the technical question.

**The analysis.** Rung 1 is engaged: a safety consequence is alleged. Notice
what the senior's response contains and what it does not. "Standard industry
practice" is an argument about custom, "construction is under way" is an
argument about cost and schedule, and "practically zero" is an assertion, not an
analysis. None of them is a technical rebuttal of the specific deficiency, and
rungs 4 and 5 cannot answer a rung-1 question.

**The defensible answer.** Escalate to a higher level within the organisation,
in writing, stating the specific technical concern and the basis for it. The
duty is personal: it is not discharged by having mentioned it once to someone
who outranks you. Nor does escalation require certainty — a good-faith,
technically grounded concern is enough to trigger it, and most codes and many
state laws protect an engineer who reports in good faith.

**What would change the answer.** If the senior engineer had produced an
analysis showing the concern was unfounded, the rung-1 question would be
answered "no" and the matter would close. Technical resolution ends the duty;
seniority does not.

## 4.3 Scenario: the vendor's hospitality

**Facts.** An engineer specifying equipment for a client is offered, by a
bidder, an all-expenses trip to a factory demonstration, and separately a
personal gift of substantial value.

**The analysis.** This is rung 4 — the client's interest in impartial advice —
with a rung-3 overlay because codes address gifts explicitly. The two offers are
not equivalent, and the exam expects you to distinguish them. A **factory visit
with a legitimate technical purpose**, disclosed to and approved by the client,
can be acceptable; the test is whether the client knows and consents, and
whether the visit serves the client's evaluation rather than the vendor's
persuasion. A **personal gift of substantial value during an active
procurement** fails: it is intended to influence judgement, and the appearance
of influence is itself the harm.

**The defensible answer.** Decline the personal gift. Disclose the trip offer to
the client and let the client decide, or attend at the client's expense. Note
the general principle: the remedy for a conflict of interest is **disclosure
first**, and refusal when disclosure cannot cure it.

## 4.4 Scenario: sealing another's work

**Facts.** A licensed engineer is asked by an employer to seal drawings
prepared by an unlicensed designer in another office, whom the engineer has not
supervised and whose calculations the engineer has not reviewed.

**The analysis.** Rung 2, squarely. Sealing is a legal act that attaches
personal responsibility, and every state's rules require the sealing engineer to
have been in **responsible charge** — to have exercised direct professional
control over the work. Sealing work you did not direct is often called plan
stamping, it is a specific ground for disciplinary action, and it also aids
unlicensed practice, which is a second violation.

**The defensible answer.** Refuse to seal on those facts. The engineer *may*
lawfully seal the work if he or she genuinely takes it into responsible
charge — reviewing the design in full, checking the calculations, directing any
changes required, and accepting responsibility for the result. What is not
available is sealing on the strength of someone else's competence.

## 4.5 Scenario: the previous employer's information

**Facts.** An engineer moves to a competitor and is asked to apply a process
refinement learned at the previous employer, where it was treated as
confidential.

**The analysis.** Rung 3 and rung 4 together, with a legal dimension at rung 2
if a non-disclosure agreement or trade-secret law applies. The line the codes
draw is between **general skill and knowledge**, which the engineer owns and
takes to any job, and the **former employer's confidential information**, which
the engineer holds in trust and may not disclose or use. Improved judgement is
yours; a specific proprietary process is not.

**The defensible answer.** Decline to disclose or apply the confidential
material, and say so plainly to the new employer. The duty of confidentiality
survives the employment that created it, and an instruction from the new
employer does not release it. Where the boundary is genuinely unclear, the
disciplined move is to document what you will and will not use and to obtain the
former employer's consent if the information is needed.

## 4.6 The scenario pattern, in one table

| What the scenario supplies | What it is testing | The move it wants |
|---|---|---|
| A hazard plus schedule or cost pressure | Whether you rank rung 1 above rung 4 | Escalate in writing; do not trade safety off |
| A gift, a favour, or a second client | Conflict of interest | Disclose; refuse if disclosure cannot cure it |
| Work slightly outside your field | Competence | Decline, or bring in a qualified professional |
| A request to seal, sign or certify | Responsible charge | Only if you directed and reviewed the work |
| Data that does not support the conclusion | Objectivity and truthfulness | Report what the data shows; do not omit |
| Information from a former employer | Confidentiality | General skill yes, proprietary specifics no |

Learn the right column. The FE exam's ethics questions are drawn from a small
number of recurring situations, and the correct action is consistent across all
of them: protect the public first, disclose conflicts, stay inside your
competence, tell the truth about what the evidence shows, and write down what
you did.`,
      examTip: 'Pick the LEAST escalated action that fully discharges the duty. "Raise it with your supervisor and document it" beats both "do nothing further" and "call the newspaper" in almost every scenario — the exception being an immediate threat to the public with internal channels exhausted or unavailable.',
      importantNote: 'Sealing a document means you were in responsible charge of the work: you directed it, you reviewed it, and you accept legal responsibility for it. Sealing work prepared by someone you did not supervise is a disciplinary offence in every U.S. jurisdiction, regardless of how good the work is.',
    },
  ],
  keyTakeaways: [
    'Public health and safety is ALWAYS the highest priority — above profit, client wishes, and employer directives.',
    'Disclose conflicts of interest to all affected parties; refuse work where objectivity is compromised.',
    'Report safety violations through proper channels; whistleblowers are protected.',
    'Accept work only in areas of competence; seek assistance when needed.',
    'Document ethical concerns and recommendations to protect your professional record.',
  ],
},

fee_licensure: {
  topicId: 'fee_licensure',
  title: 'Professional Licensure & Authority',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Professional engineering licensure protects the public through demonstrated competence. The FE exam is the first step toward PE licensure. Understanding the licensure process, EIT/PE roles, and authority limits is essential.',
  sections: [
    {
      id: 'lic-process',
      title: '1. The Licensure Path: FE to PE',
      content: `## 1.1 Licensure Steps

| Step | Requirement | Result |
|---|---|---|
| 1 | ABET-accredited degree (or equivalent) | Education requirement met |
| 2 | Pass FE exam | Become **EIT** (Engineer in Training) |
| 3 | 4 years supervised experience under PE | Experience requirement met |
| 4 | Pass PE exam | Become **licensed PE** |

## 1.2 EIT vs PE Authority

- **EIT (Engineer in Training)**: can work under PE supervision, cannot stamp drawings, cannot offer services to public independently
- **PE (Professional Engineer)**: can stamp/seal drawings, take legal responsibility for designs, offer engineering services to the public

### The PE Stamp

The PE stamp on documents means:
- The engineer has **personally reviewed** the work
- The engineer takes **legal responsibility** for its accuracy and safety
- It certifies the design meets applicable codes and standards

## 1.3 Comity and Reciprocity

**Comity** allows PE licensure reciprocity across states — a PE licensed in one state can often become licensed in another without retesting, though some documentation may be required. Each state licensing board sets its own specific requirements.`,
      examTip: 'The FE exam is a prerequisite for PE licensure but is NOT itself a license to practice. As an EIT, you work under PE supervision. Only a PE can stamp drawings and take final legal responsibility. Understand this distinction clearly.',
    },
    {
      id: 'lic-responsibilities',
      title: '2. Professional Responsibilities and Record Keeping',
      content: `## 2.1 Continuing Education

Most states require **15-36 professional development hours annually** to maintain a PE license. Requirements vary by state and may include:
- Technical courses in your specialty
- Ethics training (often mandatory)
- Attendance at professional conferences
- Teaching or publishing technical content

Failure to meet CE requirements can result in license **suspension or revocation**.

## 2.2 Record Keeping and Documentation

Professional engineers must:
- **Maintain detailed records** of all engineering work
- **Archive** calculations, drawings, and design decisions
- **Document** assumptions, safety factors, and code references
- Keep records for the **statute of limitations** period (varies by state)

## 2.3 Scope of Practice

- Engineers must practice only within their **area of competence**
- Electrical engineers should not design structural elements without qualification
- When work crosses disciplines, engage qualified professionals
- Industrial exemptions may allow unlicensed practice in some contexts, but PE is required for **public-facing services**`,
      examTip: 'The FE exam tests understanding of licensure requirements, not specific state rules. Key concepts: FE → EIT → experience → PE exam → PE license. Continuing education is mandatory. PE stamp = personal legal responsibility.',
    },
    {
      id: 'lic-model-law-detail',
      title: '3. The Licensure Ladder in Detail',
      content: `## 3.1 Licensure is a state power, and NCEES is the coordinator

There is no national engineering licence in the United States. Each state and
territory licenses engineers under its own statute, through its own board.
NCEES is the organisation those boards belong to; it develops the FE and PE
examinations, publishes the **Model Law** and **Model Rules** that boards adapt,
and maintains the records system that makes cross-state licensure practical.

That structure explains a fact the exam expects you to know: the *principles*
are uniform because boards adopt the same model, while the *details* — the exact
experience count, the continuing-education requirement, the exemptions — are
state-specific. A question asking "how many hours of continuing education are
required" has no single correct answer; a question asking "who sets that
requirement" does, and the answer is the state board.

## 3.2 The three pillars of licensure

Every U.S. jurisdiction builds its requirements on the same three pillars, and
the Model Law is explicit about all three.

**Education.** The standard route is a degree from a programme accredited by the
Engineering Accreditation Commission of ABET. Boards commonly accept
alternatives — a non-accredited engineering degree, a related science degree, or
in some states additional experience in place of some education — usually with
extra experience required to compensate.

**Examination.** Two exams, taken at different career stages. The **FE** is
normally taken near graduation and establishes fundamentals. The **PE** is
discipline-specific and is taken after the experience requirement is met or
nearly met. Many boards now allow the PE exam to be taken before the experience
is complete, with the licence issued only once experience is verified — which is
why "passed the PE exam" and "is a PE" are not the same statement.

**Experience.** Typically four years of progressive engineering experience
under the supervision of a licensed professional engineer. Two words in that
phrase carry weight. **Progressive** means increasing responsibility, not four
years of the same task. **Under supervision** means a licensee is directing and
can attest to the work.

Passing the FE earns an intermediate credential whose name varies by state —
Engineer Intern (EI) or Engineer-in-Training (EIT). It is a milestone, not a
licence to practise independently.

## 3.3 What the seal actually does

The professional seal is the legal heart of licensure. Applying it to a
document asserts three things simultaneously:

1. The work was performed **by you or under your responsible charge**
2. You have **personally reviewed** it
3. You accept **personal legal responsibility** for its adequacy

**Responsible charge** is the term of art, and it means direct professional
control: you made or approved the engineering decisions, you can defend them,
and you had the authority to change them. It is not satisfied by having read the
drawings, by employing the person who made them, or by having confidence in
their competence.

The corollary is the offence usually called **plan stamping**: sealing work
prepared by someone the licensee did not direct. Every board treats it as a
disciplinary matter, and it typically implicates a second violation — aiding the
unlicensed practice of engineering.

## 3.4 Exemptions, and their limits

Not everyone doing engineering work needs a licence, and the exam tests whether
you know where the exemptions stop.

| Common exemption | Usual scope | Where it stops |
|---|---|---|
| Industrial exemption | Engineers employed by a manufacturer working on that company's own products | Offering services to the public; work submitted to a public authority |
| Employee exemption | Work performed under the direction of a licensee | Independent practice; sealing documents |
| Federal employment | Federal work is governed by federal, not state, requirements | Practice outside that federal role |
| Contractor/trades work | Installation and construction under adopted codes | Design work that state law reserves to licensees |

The generalisation that survives across states: **a licence is required to offer
or provide engineering services to the public, and to seal documents.** The
exemptions are about employment arrangements in which someone else — a licensee,
or a manufacturer taking product liability — carries the responsibility instead.

## 3.5 Comity, and why NCEES Records exist

**Comity** (used interchangeably with reciprocity in practice) is the process by
which an engineer already licensed in one jurisdiction obtains a licence in
another without repeating the examinations. It is not automatic. The second
board applies its own standards and satisfies itself that your education,
examinations and experience meet them; what comity avoids is re-testing, not
re-application.

Because assembling transcripts, exam results, references and project histories
for each new state is laborious, NCEES maintains a **Records** service that
holds a verified file and transmits it to any board on request. For an engineer
who expects to be licensed in several states — common in consulting — building
that record early is a practical step the exam sometimes references.

## 3.6 Keeping the licence

Two ongoing obligations, both enforced by the board:

- **Continuing professional development**, measured in professional development
  hours (PDH) and set by each state, frequently with a mandatory ethics
  component. Failure to comply is itself grounds for disciplinary action, and it
  is one of the most common ones in practice.
- **Renewal on schedule**, with an attestation of compliance.

Discipline runs from a private admonition through fines, mandated supervision or
education, suspension, and finally revocation. The Model Rules list the grounds:
fraud in obtaining the licence, gross negligence or incompetence, violation of
the rules of professional conduct, certain criminal convictions, aiding
unlicensed practice, and failure to meet continuing-education requirements.`,
      examTip: 'Distinguish the credential from the authority. Passing the FE makes you an EI/EIT — a credential. Only a PE licence carries the authority to offer services to the public and to seal documents, and only for work in that engineer\'s responsible charge.',
      importantNote: 'The industrial exemption is about who bears responsibility, not about the difficulty of the work. It generally covers engineers designing their own employer\'s products; it does not cover offering engineering services to the public or sealing documents filed with a public authority.',
    },
    {
      id: 'lic-intellectual-property',
      title: '4. Intellectual Property: Which Right Protects What',
      content: `## 4.1 Five rights, five different questions

Intellectual property appears on the FE exam as a sorting problem: given
something an engineer created, which right protects it? The five categories
answer five different questions, and a single product usually needs several at
once.

![Declared schematic: a sorting diagram that routes the question "what exactly are you protecting?" to five intellectual-property categories — how it works to a utility patent, how it looks to a design patent, what it says to copyright, who made it to trademark, and what you know to trade secret — with each category's statutory term shown beneath it. The layout is a teaching device, not a reproduction of any official chart.](/courses/fe-ee/figures/eth-ip-map.svg)

| Right | Protects | Term | Arises by |
|---|---|---|---|
| **Utility patent** | How an invention works: a machine, process, composition of matter, or article of manufacture | 20 years from the filing date | Examination and grant by the USPTO |
| **Design patent** | The ornamental appearance of an article | 15 years from the date of grant | Examination and grant |
| **Copyright** | Original expression fixed in a tangible medium | Life of the author plus 70 years; works made for hire, 95 years from publication or 120 from creation, whichever ends first | Automatically, on fixation |
| **Trademark** | A mark identifying the source of goods or services | Federal registration runs in renewable 10-year terms and can last indefinitely while the mark is used | Use in commerce; registration adds rights |
| **Trade secret** | Information deriving value from not being generally known | Indefinite, as long as it stays secret | Keeping it secret with reasonable measures |

## 4.2 Patents: the disclosure bargain

A patent is a trade. You publish a complete description of your invention — one
that enables a person skilled in the field to make and use it — and in exchange
the government grants you the right to exclude others for a limited period. Note
that phrasing: a patent gives you the right to **exclude others**, not the right
to practise your own invention, which may still be blocked by someone else's
earlier patent.

To be patentable an invention must be:

- **Novel** — not already in the prior art
- **Non-obvious** — not an obvious variation on what is known, to a person of
  ordinary skill in the field
- **Useful**, and directed to eligible subject matter

Three practical points engineers get wrong:

- **The United States is first-inventor-to-file.** Being first to invent no
  longer wins a race against a competitor who files first. Laboratory notebooks
  still matter for other reasons, but they no longer settle priority.
- **Public disclosure starts a clock.** The United States allows a limited
  one-year grace period for the inventor's own prior disclosure; many other
  countries require absolute novelty, so presenting at a conference before
  filing can forfeit foreign rights entirely.
- **"Industrial design" in the American system is the design patent.** The term
  appears on the exam because many other jurisdictions have separate registered
  design rights.

## 4.3 Copyright: expression, not ideas

Copyright arises automatically the moment original expression is fixed —
saved, drawn, recorded, written. It protects the **expression**, never the
underlying idea, method or algorithm. For an engineer this distinction decides
everything:

- Your source code is copyrighted as expression the moment you write it.
- The **algorithm** it implements is not protected by copyright at all; if it is
  novel and non-obvious it may be patentable, and if it is kept confidential it
  may be a trade secret.
- Your drawings, reports, manuals and specifications are copyrighted.
- The engineering facts they contain are not.

Registration is not required for protection, but for U.S. works it is a
prerequisite to bringing an infringement suit and to certain remedies. Work
created by an employee within the scope of employment is generally a **work made
for hire**, meaning the employer is the author from the outset — one of the more
consequential facts in this topic for a working engineer.

## 4.4 Trade secrets: value from secrecy

A trade secret is information — a process recipe, a customer list, a set of
tolerances, a yield-improving trick — that has commercial value because it is
not generally known, and that its owner protects with reasonable measures:
access controls, confidentiality agreements, marking, need-to-know handling.
Protection is available under state law in most jurisdictions, and the federal
Defend Trade Secrets Act of 2016 added a federal civil cause of action.

Its two defining properties are opposites of a patent's:

- **No expiry.** It lasts as long as it stays secret, which can be far longer
  than any patent term.
- **No protection against independent discovery.** If a competitor
  independently develops it, or lawfully reverse-engineers a product you sold,
  you have no claim. Reverse engineering of a lawfully obtained product is
  generally permitted.

That trade-off is the strategic choice at the heart of this topic: **patent and
publish, or keep it secret and take the risk.** Patent when the invention will
be visible in the product and easily copied once seen. Keep secret when it is a
process nobody outside can observe and reverse engineering is impractical.

## 4.5 Who owns what an employee invents

Two mechanisms govern this and both appear in engineering employment:

- **Assignment agreements.** Most engineering employment contracts require
  employees to assign inventions made within the scope of employment to the
  employer. Several states limit how far these can reach — typically excluding
  inventions developed entirely on the employee's own time, with the employee's
  own resources, and unrelated to the employer's business.
- **Shop rights.** Even without an assignment, an employer who contributed
  resources or time to an invention may hold a non-exclusive, royalty-free
  licence to use it. The inventor keeps the patent; the employer may practise
  it.

## 4.6 Sorting one product

A single instrument on a bench might carry all five rights at once, and being
able to name them is exactly what the exam question wants:

| Element | Right | Why |
|---|---|---|
| The novel measurement circuit | Utility patent | It is how the thing works |
| The enclosure's distinctive shape | Design patent | It is how the thing looks |
| The firmware and the manual | Copyright | Fixed original expression |
| The product name and logo | Trademark | It identifies the source |
| The calibration procedure that gives it its accuracy | Trade secret | Valuable, not visible in the product, kept confidential |

Notice that no element is protected twice by the same right and none is left
uncovered. That is the mark of a correctly sorted answer.`,
      examTip: 'Sort by the question, not by the object: how it WORKS is a utility patent, how it LOOKS is a design patent, what it SAYS is copyright, who MADE it is a trademark, and what you KNOW and do not tell is a trade secret. Software routinely involves three of the five at once.',
      importantNote: 'Copyright protects expression, never the underlying idea, algorithm or method. Writing your own independent implementation of a published algorithm does not infringe its author\'s copyright — though it may infringe a patent, which is a separate question with a separate answer.',
    },
  ],
  keyTakeaways: [
    'FE exam passage makes you an EIT; PE requires 4 additional years of experience plus PE exam.',
    'PE stamp means personal legal responsibility; only PEs can stamp/seal drawings.',
    'Comity allows PE licensure reciprocity across states.',
    'Continuing education (15-36 hours/year) is mandatory for PE maintenance.',
    'Practice only within your area of competence; engage other professionals when needed.',
  ],
},

fee_liability: {
  topicId: 'fee_liability',
  title: 'Professional Liability & Ethical Decision-Making',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Engineers face professional liability for their work. Understanding due care, due diligence, and systematic ethical decision-making protects both the public and the engineer\'s career.',
  sections: [
    {
      id: 'liab-due-care',
      title: '1. Due Care, Due Diligence, and Liability',
      content: `## 1.1 Due Care vs Due Diligence

| Concept | Definition | Example |
|---|---|---|
| **Due diligence** | Investigation and discovery of risks | Conducting a safety audit |
| **Due care** | Implementing reasonable safeguards | Fixing the issues found in the audit |

Both are necessary. An engineer who identifies hazards (due diligence) but fails to address them (due care) can be held **negligent**.

## 1.2 Professional Liability

Engineers can face liability for:
- **Negligence**: failing to exercise reasonable care
- **Malpractice**: professional services below acceptable standards
- **Breach of contract**: failing to deliver agreed services
- **Strict liability**: for inherently dangerous activities (rare in EE)

### Defenses Against Liability
- Evidence of following professional standards and codes
- Documentation of design decisions and safety analysis
- Professional liability insurance
- Proper disclaimers and limitations in contracts`,
      examTip: 'Due diligence = investigation (what is wrong?). Due care = implementation (fixing what is wrong). The FE exam tests this distinction. An engineer who knows about a problem and does nothing has failed in due care, even if due diligence was performed.',
    },
    {
      id: 'liab-framework',
      title: '2. Ethical Decision-Making Framework',
      content: `## 2.1 Systematic Decision Process

When facing an ethical dilemma:

1. **Identify stakeholders**: public, employer, client, colleagues, yourself
2. **Clarify the issue**: safety concern? conflict of interest? honesty issue?
3. **Check applicable codes**: NCEES rules, NSPE code, laws, company policy
4. **Identify options** and consequences of each
5. **Decide**: prioritize public welfare above all
6. **Act and document**: implement decision and keep records

## 2.2 Common FE Exam Scenarios

| Scenario | Correct Action |
|---|---|
| Asked to falsify test results | Refuse and report through proper channels |
| Design flaw discovered after delivery | Disclose to client and correct immediately |
| Pressure to cut corners for schedule | Advise of risks and resist; document |
| Work outside your expertise | Decline or seek qualified assistance |
| Conflict of interest discovered | Disclose to all affected parties |

## 2.3 The Sunshine Test

Ask: **"Would I be comfortable if this decision appeared in tomorrow's newspaper?"**

If the answer is no, the decision is probably unethical. This simple test helps identify questionable choices before they become problems.`,
      examTip: 'FE exam ethics questions rarely have ambiguous answers. The correct response always prioritizes public safety, follows proper channels, maintains honesty, and documents decisions. When in doubt, choose the answer that protects the public first.',
      importantNote: 'Engineers should typically work through internal channels before going public with concerns. However, if public safety is IMMEDIATELY threatened and internal channels are unresponsive, reporting to authorities is both ethical and protected.',
    },
    {
      id: 'liab-negligence-standard',
      title: '3. Negligence, the Standard of Care, and the Limits of a Contract',
      content: `## 3.1 The four elements a negligence claim must prove

"Negligence" in engineering practice is not a general accusation of
carelessness. It is a legal claim with four elements, and a claimant must
establish **all four**:

| Element | What must be shown |
|---|---|
| **Duty** | The engineer owed a duty of care to the injured party |
| **Breach** | The engineer's conduct fell below the applicable standard of care |
| **Causation** | The breach in fact caused the harm, and the harm was a foreseeable consequence of it |
| **Damages** | Actual loss occurred — injury, property damage, or economic loss |

Each element is a separate obstacle. An engineer can make a genuine mistake and
still not be liable, if the mistake caused no harm or if it was not the cause of
the harm that occurred. Conversely, a serious injury on a project does not by
itself establish liability; the claimant must connect it to a breach.

Causation splits into two questions that exams and courts keep separate.
**Cause in fact** asks whether the harm would have happened anyway — usually
phrased as the "but for" test. **Proximate cause** asks whether the harm was a
foreseeable result of the breach, rather than the product of an extraordinary
intervening chain of events.

## 3.2 The standard of care is a comparison, not a guarantee

The standard against which conduct is measured is what **a reasonably prudent
engineer, in the same discipline, in similar circumstances, with the knowledge
available at the time** would have done.

Every clause in that sentence is doing work:

- **Reasonably prudent, not perfect.** Engineers are not liable for every error;
  they are liable for falling below professional norms.
- **In the same discipline.** A power engineer is judged against power
  engineering practice, not against what a structural specialist would have
  noticed.
- **At the time.** Hindsight is excluded in principle. What was known and
  standard when the work was done governs.

This is why engineers, unlike manufacturers of goods, generally do **not**
warrant results. A contract clause promising that a design "will be free of
defects" or "will achieve" a performance figure converts a professional
standard-of-care obligation into a guarantee — a much harder promise to keep
and, importantly, one that professional liability insurers commonly do not
cover. Recognising that trap is a practical piece of professional judgement the
exam occasionally reaches for.

In practice, the standard of care is evidenced two ways: by **expert testimony**
from practitioners in the field, and by **codes and standards** — building
codes, the National Electrical Code, IEEE standards, manufacturer instructions.
Compliance with an applicable code is powerful evidence of meeting the standard;
it is not an automatic defence, because codes are minimums and known hazards can
demand more.

## 3.3 Due diligence and due care, revisited as a sequence

Section 1 defined the pair. The reason to be precise about them is that they
describe a **sequence**, and liability attaches at different points along it:

1. **Due diligence** — the investigation. Did you look? Did you review the
   site, the loads, the prior drawings, the failure history?
2. **Due care** — the response. Did you act on what you found: redesign,
   warn, specify a mitigation, refuse to proceed?

Failing at step 1 is negligence by omission. Passing step 1 and failing step 2
is worse: the record now shows the hazard was known. Documented knowledge
without documented response is the single most damaging pattern in a
professional liability file, which is why the discipline of writing down both
the finding **and** the recommendation matters as much as it does.

## 3.4 Contract, tort, and who can sue

Two legal routes reach an engineer, and they behave differently:

- **Breach of contract** is available to the party you contracted with, and its
  terms — scope, standard, limitations, indemnities — are what you agreed.
- **Negligence (tort)** can be available to third parties who were never party
  to any contract with you: the building's occupants, a passer-by, a worker
  employed by someone else. This is the exposure that contract drafting cannot
  fully control.

Three contract devices modify the picture and appear in practice:

- **Limitation of liability** clauses cap exposure to the fee or a stated sum.
  Enforceability varies by jurisdiction, and they generally bind only the
  contracting party.
- **Indemnity** clauses shift defined liabilities between the parties. Many
  states restrict the broadest forms.
- **Professional liability (errors and omissions) insurance** covers claims
  arising from professional services, typically on a claims-made basis — the
  policy in force when the claim is *made* responds, which is why continuing
  coverage after a project ends, or "tail" coverage after retirement, matters.

## 3.5 How long the exposure lasts

Two different clocks limit claims, and confusing them is a classic exam
distinction:

| | Starts running when | Effect |
|---|---|---|
| **Statute of limitations** | The claim accrues — often when the harm is discovered | Bars claims filed too long after discovery |
| **Statute of repose** | A fixed event, usually substantial completion of the project | Bars claims after a fixed period regardless of when the harm appears |

A statute of repose can extinguish a claim before anyone knows there is one,
which is precisely its purpose: it puts an outer bound on how long a design
professional's exposure lasts. Both periods are set by state law and vary.

The practical consequence is record retention. Calculations, correspondence,
assumptions, code references and the reasoning behind design decisions should be
kept at least as long as the exposure lasts. A contemporaneous record of *why*
a decision was made — what was known, what was assumed, what was recommended —
is the most effective defence available, and it can only be created at the time.`,
      examTip: 'Negligence requires all four elements: duty, breach, causation, damages. If an exam scenario has an error with no resulting harm, or harm with no breach of the standard of care, the answer is that liability does not attach — not that the engineer is automatically at fault.',
      importantNote: 'Engineers owe a standard of care, not a warranty of results. A contract promising perfection or guaranteeing performance raises the obligation above the professional standard and is typically outside professional liability insurance coverage.',
    },
    {
      id: 'liab-electrical-safety',
      title: '4. Electrical Workplace Safety',
      content: `## 4.1 Three documents, three different jobs

Electrical safety in the United States is governed by documents that candidates
routinely confuse. They cover different things, and the exam expects the
distinction.

| Document | What it governs | Legal status |
|---|---|---|
| **NFPA 70, the National Electrical Code (NEC)** | How electrical systems are **installed** — conductors, overcurrent protection, grounding, methods | Adopted into law by states and municipalities |
| **NFPA 70E, Electrical Safety in the Workplace** | How people **work** on or near electrical equipment — safe work practices, boundaries, PPE | A consensus standard; used as the recognised means of complying with OSHA's general duty |
| **OSHA regulations** (29 CFR 1910 Subpart S for general industry, 1910.147 for control of hazardous energy, 1926 Subpart K for construction) | The employer's legal duty to protect workers | Federal law, enforceable by citation |

The short version: **the NEC keeps the installation safe, 70E keeps the worker
safe, OSHA makes it compulsory.**

## 4.2 Shock: the physics is Ohm's law, and it is unforgiving

Voltage is the quantity written on the panel; **current through the body** is
the quantity that injures. They are related by the body's resistance, which
varies over three orders of magnitude with skin condition, contact area,
moisture and the path taken.

**$I_{body} = V/R_{body}$**

OSHA's electrical-safety training material tabulates the effects of current
passing through the body roughly as follows:

| Current | Effect |
|---|---|
| 1 mA | Perception — a faint tingle |
| 5 mA | Slight shock, not painful; the average person can let go |
| 6–30 mA | Painful shock; **loss of muscular control** — the "let-go" range, with 6 mA taken as the let-go threshold for workers |
| 50–150 mA | Extreme pain, respiratory arrest, severe muscular contraction |
| 1,000–4,300 mA | Ventricular fibrillation; the heart's pumping action stops |
| 10,000 mA | Cardiac arrest, severe burns |

Now apply Ohm's law at ordinary utilisation voltages:

![Current through the body against body-path resistance for 120 V and 480 V, computed directly from I = V/R across the plausible range of hand-to-hand resistance, with the published physiological thresholds marked along the right-hand edge. The marked points on the 120 V curve are 1,500 ohms drawing 80 mA and 24,000 ohms drawing exactly the 5 mA at which a ground-fault circuit interrupter responds.](/courses/fe-ee/figures/eth-shock-current.svg)

**Worked numbers behind the figure.** At 120 V:

- Dry, callused hands at 100,000 Ω: 1.2 mA — perception.
- Ordinary contact at 5,000 Ω: 24 mA — inside the let-go range. The victim
  cannot release the conductor.
- Damp hands, good contact, at 1,500 Ω: **80 mA** — past let-go and into the
  range where respiratory arrest occurs.
- To stay below the 5 mA a GFCI responds to, the body path would have to be
  above **24,000 Ω**.

At 480 V those figures quadruple: 1,500 Ω draws **320 mA**.

The lesson the figure delivers is the one that gets people killed: **120 V is
not a safe voltage.** It is merely a voltage at which the outcome depends
entirely on how wet your hands are.

## 4.3 The ground-fault circuit interrupter, and what it cannot do

A GFCI compares the current leaving on the ungrounded conductor with the current
returning on the grounded conductor. If they differ by about **5 mA** — meaning
that much current is returning by some other path, such as a person — it opens
the circuit, in a small fraction of a second.

Two limits matter and are examinable:

- A GFCI protects against **ground faults**, the most common shock path. It does
  **not** protect a person touching the ungrounded and grounded conductors
  simultaneously, because in that case the currents still balance.
- A GFCI is a **personnel** protection device, not an overcurrent device. It
  does not replace a breaker or fuse, and a breaker does not replace it: a 15 A
  breaker will happily deliver the 80 mA computed above forever.

## 4.4 Grounding, bonding, and the distinction that is usually blurred

| Term | What it is | Why it exists |
|---|---|---|
| **Equipment grounding conductor** | A low-impedance conductive path from equipment enclosures back to the source | To carry fault current high enough to **open the overcurrent device quickly** |
| **Bonding** | Connecting metallic parts together | To hold them at the **same potential**, so no dangerous voltage appears between things a person can touch simultaneously |
| **Grounding electrode (earth connection)** | A connection to the earth | Reference to earth potential and a path for lightning and surges — **not** a fault-clearing path |

The point most often missed: earth is a poor conductor, and a fault returning
through soil generally cannot draw enough current to trip a breaker. Fault
clearing depends on the metallic equipment grounding conductor back to the
source, not on the earth connection. This is why a "grounded" tool with a broken
ground wire is more dangerous than an ungrounded one — it *appears* protected.

## 4.5 Arc flash: the other electrical hazard

An arcing fault releases energy as radiant heat, pressure and molten material.
The measure of exposure is **incident energy**, in calories per square
centimetre at the working distance.

- **1.2 cal/cm²** is the accepted threshold for the onset of a second-degree
  burn on unprotected skin, and it defines the **arc flash boundary** — the
  distance at which incident energy falls to that level.
- NFPA 70E organises protective clothing into four PPE categories with minimum
  arc ratings of **4, 8, 25 and 40 cal/cm²**.
- Equipment likely to require examination while energised must be labelled with
  the information a worker needs: nominal voltage, arc flash boundary, and the
  incident energy at the working distance or the required PPE category.

Arc-flash energy scales with the fault current and, crucially, with the
**clearing time** of the upstream protective device. That is why protection
coordination is a safety issue and not only a reliability issue: a faster
upstream device reduces the incident energy a worker is exposed to.

## 4.6 The hierarchy of controls, and the electrically safe work condition

Safety engineering ranks controls by how much they depend on human behaviour,
most effective first:

1. **Elimination** — de-energise and work on dead equipment
2. **Substitution** — a lower-energy method or supply
3. **Engineering controls** — barriers, interlocks, remote racking, insulation
4. **Administrative controls and warnings** — procedures, training, labels,
   boundaries
5. **PPE** — last, because it protects one person and only if worn correctly

Applied to electrical work, level 1 has a name: establishing an **electrically
safe work condition**. The sequence is fixed — determine all sources, open the
disconnecting means, visually verify where possible, apply **lockout/tagout**,
test for absence of voltage with an adequately rated tester, and **test the
tester on a known live source before and after** so a failed instrument cannot
read as "dead". Where stored energy exists, capacitors are discharged and
springs released before the condition is considered established.

Energised work is permitted only in narrow circumstances — where de-energising
introduces additional or increased hazards, or is infeasible because of
equipment design or operational limitations — and then only with the analysis,
permit, and PPE the standard requires. "It would take too long to shut down" is
not one of the exceptions.

## 4.7 Safety data sheets

Chemical hazards accompany electrical work more often than engineers expect —
solvents, insulating oils, batteries, cleaning agents. Under OSHA's Hazard
Communication Standard, aligned with the Globally Harmonized System, every
hazardous chemical carries a **Safety Data Sheet with 16 sections** in a fixed
order, beginning with identification, hazard identification and composition, and
running through first aid, fire fighting, accidental release, handling and
storage, exposure controls and personal protection, physical and chemical
properties, stability and reactivity, toxicological information, and the
ecological, disposal, transport and regulatory sections, ending with revision
information. The fixed order is the point: an engineer who needs the exposure
limits knows to go to section 8 without reading the document.`,
      examTip: 'Electrical safety questions are usually Ohm\'s law in disguise. Given a voltage and a body resistance, compute the current and compare it with the threshold table — 5 mA GFCI response, 6 mA let-go, 50 mA and above life-threatening. The trap answer treats a "low" voltage such as 120 V as inherently safe.',
      importantNote: 'PPE is the LAST line of defence in the hierarchy of controls, not the first. The correct answer to "how should this energised work be performed" is almost always to establish an electrically safe work condition — de-energise, lock out, and verify absence of voltage with a tester proven live before and after.',
    },
  ],
  keyTakeaways: [
    'Due diligence = investigation; due care = implementing safeguards. Both are required.',
    'Negligence liability arises from failing to exercise reasonable professional care.',
    'Framework: identify stakeholders → clarify issue → check codes → prioritize public welfare.',
    'The sunshine test: would you be comfortable if this decision appeared in the news?',
    'Document all ethical concerns, recommendations, and decisions for professional protection.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 3 — ENGINEERING ECONOMICS  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

};

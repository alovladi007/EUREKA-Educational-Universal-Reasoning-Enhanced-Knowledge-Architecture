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

The NSPE Code sets out six fundamental obligations. They are summarised below in
our own words rather than quoted, because the code text itself is copyrighted;
read the published code for its exact language.

1. Treat the public's **safety, health and welfare** as the overriding duty — the
   one that outranks every other when they collide
2. Accept only work you are **competent** to perform
3. Keep public statements **truthful**, and say plainly on whose behalf you speak
4. Serve each client or employer as a **trustworthy agent**, disclosing anything
   that could compromise your judgement
5. Do not **deceive**, whether by what you state or by what you omit
6. Behave so as to strengthen rather than damage the **standing of the profession**

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

Codes of ethics require good-faith reporting, and various statutes provide **protection from retaliation** — but the protection an individual actually has depends entirely on which statute applies, in which jurisdiction, to which kind of employer. Treat legal protection as something to check, not something to assume: it is not a uniform national entitlement, and the duty to report does not wait for it.

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

The six fundamental canons, in the order they appear, require engineers to put
the public's safety, health and welfare above every competing interest; to work
only within their competence; to make public statements objectively and
truthfully; to serve each employer or client as a trustworthy agent; to refrain
from deceiving anyone by statement or omission; and to conduct themselves
lawfully and honourably so as to strengthen the profession's standing. The first is not merely first in a list. The code directs that the
public's safety, health and welfare be held **paramount**, and that adjective is
doing real work: it means the duty is not weighed against the others, it outranks
them. Section 5.3 of this chapter turns that word into arithmetic, which is the
only way to check that a proposed answer actually respects it.

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
      importantNote: 'Sealing a document means you were in responsible charge of the work: you directed it, you reviewed it, and you accept legal responsibility for it. Sealing work prepared by someone you did not supervise is treated as a disciplinary matter by U.S. licensing boards, regardless of how good the work is.',
    },
    {
      id: 'ce-predicates',
      title: '5. Every Obligation Written as a Condition',
      content: `## 5.1 A canon is a slogan; a duty is a predicate

The first four sections stated the obligations the way codes state them: as
sentences. That is how they are written, and it is not how they are *applied*.
An obligation only tells you what to do once you can say precisely **which facts
switch it on**. So the working form of every canon in this chapter is a
predicate — a Boolean expression over conditions you can check one at a time.

Take the duty to act on a hazard. Four conditions decide it:

- **H** — a condition exists that could injure a member of the public
- **K** — you know of it, or a competent engineer in your position would
- **C** — judging it falls inside your professional competence
- **R** — it has already been resolved, technically or by correction

The duty to act is their conjunction, with the last one negated:

$$D_{\\mathrm{act}} = H \\wedge K \\wedge C \\wedge \\lnot R$$

Four Boolean inputs generate a table of

$$N_{\\mathrm{rows}} = 2^{4} = 16$$

rows, and exactly one of them makes the duty true. That is not an assertion; it
is a count, and here is the enumeration.

| # | H | K | C | R | D_act |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 | 1 | 0 |
| 2 | 0 | 0 | 1 | 0 | 0 |
| 3 | 0 | 0 | 1 | 1 | 0 |
| 4 | 0 | 1 | 0 | 0 | 0 |
| 5 | 0 | 1 | 0 | 1 | 0 |
| 6 | 0 | 1 | 1 | 0 | 0 |
| 7 | 0 | 1 | 1 | 1 | 0 |
| 8 | 1 | 0 | 0 | 0 | 0 |
| 9 | 1 | 0 | 0 | 1 | 0 |
| 10 | 1 | 0 | 1 | 0 | 0 |
| 11 | 1 | 0 | 1 | 1 | 0 |
| 12 | 1 | 1 | 0 | 0 | 0 |
| 13 | 1 | 1 | 0 | 1 | 0 |
| 14 | 1 | 1 | 1 | 0 | 1 |
| 15 | 1 | 1 | 1 | 1 | 0 |

The general rule behind that single 1 is worth carrying: a conjunction of
\`k\` literals over \`n\` Boolean variables is satisfied by

$$\\lvert \\{ \\mathbf{v} : D(\\mathbf{v}) = 1 \\} \\rvert = 2^{\\,n-k}$$

assignments, and with \`n = k = 4\` that is \`2^0\` — one row. Every extra condition
you attach to a duty halves the fraction of the world in which it applies, which
is exactly why an obligation stated as four conditions is far more useful than
the same obligation stated as an adjective.

## 5.2 The four ways out, and the one that is not on the list

Negate the predicate and De Morgan hands you the complete list of defences:

$$\\lnot D_{\\mathrm{act}} = \\lnot H \\vee \\lnot K \\vee \\lnot C \\vee R$$

There are four, and only four, ways the duty to act fails to arise: there is no
hazard, you could not reasonably have known, the judgement is outside your
competence, or the matter is already resolved. Read them against the answer
choices in an exam scenario and most of the distractors evaporate, because the
commonest distractor is not on this list at all.

Introduce a fifth proposition, **S**: a supervisor has instructed you to let it
go. The predicate does not contain \`S\`. Formally,

$$D_{\\mathrm{act}}(H, K, C, R, S) = D_{\\mathrm{act}}(H, K, C, R) \\quad \\forall S$$

so the duty is *independent* of the instruction. This is the formal content of
the statement that a professional obligation is personal and non-delegable. An
instruction can change what you are paid to do; it cannot change the truth value
of a predicate it does not appear in.

Note carefully what the third condition, competence, does. It is a genuine exit
from the duty to *judge* — but it is not an exit from the duty to *say*. If
\`C = 0\` because the hazard is structural and you are a power engineer, the
conclusion is not silence; it is that you report the observation and identify
who is qualified to evaluate it. That distinction, between the duty to resolve
and the duty to raise, is where candidates most often over-apply the competence
limit.

## 5.3 Priority as arithmetic: what the word "paramount" actually means

Section 3 gave the five-rung ladder. Its formal content is a **lexicographic
order**, and lexicographic orders can be converted into ordinary arithmetic,
which makes the ranking checkable rather than arguable.

For each candidate action \`a\` let \`v_k(a)\` be 1 if that action leaves the test at
rung \`k\` violated and 0 otherwise, for \`k\` from 1 (public safety) to 5 (personal
interest). Score the action by

$$W(a) = \\sum_{k=1}^{5} 2^{\\,5-k} \\, v_k(a)$$

so rung 1 carries weight 16, rung 2 carries 8, rung 3 carries 4, rung 4 carries
2 and rung 5 carries 1. Then

$$a \\prec b \\iff W(a) < W(b)$$

reproduces the lexicographic ordering exactly, because each weight strictly
exceeds the sum of every weight below it:

$$2^{\\,5-k} > \\sum_{j=k+1}^{5} 2^{\\,5-j} = 2^{\\,5-k} - 1$$

That inequality *is* the word paramount. No pile of lower-rung considerations,
however many and however serious they feel, can ever sum to as much as one
rung-1 violation. A code that said "balance safety against cost" would use
comparable weights; a code that says "hold safety paramount" uses these.

### Worked example 5.1 — scoring four responses to a dismissed concern

Return to the scenario of section 4.2: a junior engineer raises a design
deficiency with a safety consequence, and the senior engineer dismisses it with
custom, schedule and an unsupported assertion. Four candidate actions, each
scored on the five rungs. The condition assignments below are the reading this
lesson defends in section 4; the arithmetic then follows with no further
judgement.

| Action | v1 | v2 | v3 | v4 | v5 | W |
|---|---|---|---|---|---|---|
| a1 · let it drop | 1 | 0 | 0 | 0 | 0 | 16 |
| a2 · escalate in writing internally | 0 | 0 | 0 | 1 | 1 | 3 |
| a3 · go straight to the press | 0 | 0 | 1 | 1 | 1 | 7 |
| a4 · resign without reporting | 1 | 0 | 0 | 0 | 1 | 17 |

$$W(a_1) = 16 + 0 + 0 + 0 + 0 = 16$$

$$W(a_2) = 0 + 0 + 0 + 2 + 1 = 3$$

$$W(a_3) = 0 + 0 + 4 + 2 + 1 = 7$$

$$W(a_4) = 16 + 0 + 0 + 0 + 1 = 17$$

The minimum is \`a2\` at 3, which is the answer section 4 argued for in prose.
Two features of the numbers are worth more than the answer itself.

First, \`a3\` scores 7 and \`a1\` scores 16, so **going to the press beats doing
nothing** even though it violates three tests instead of one. Candidates who
think the exam punishes escalation have the ranking upside down: premature
external escalation is a mistake, silence in the face of a hazard is a worse one.

Second, \`a4\` — the quiet resignation that feels like integrity — is the *worst*
action on the board at 17. It leaves the hazard exactly where it was and adds a
personal cost that buys nobody anything. Walking away is not a way of
discharging a duty; it is a way of being absent when it matures.

### Worked example 5.2 — the least-escalation rule as a second minimisation

Scoring by \`W\` is not quite the whole rule, because several actions can tie at
the top. Suppose the organisation has a functioning internal escalation path and
five actions are on the table, all of which fully address the hazard, so all
have \`v_1 = 0\`. Define the **sufficient set**

$$A_{\\mathrm{suf}} = \\{\\, a : v_1(a) = 0 \\,\\}$$

and rank inside it by an escalation cost \`e(a)\` on a ladder from 1 to 5:

| Action | Escalation level e |
|---|---|
| Raise with the immediate supervisor, in writing | 1 |
| Escalate to a higher level of management | 2 |
| Escalate to an officer of the firm or its board | 3 |
| Notify the licensing board or the regulator | 4 |
| Disclose publicly | 5 |

The rule the codes encode is then

$$a^{\\star} = \\arg\\min_{a \\in A_{\\mathrm{suf}}} e(a)$$

take the least escalated action that *actually discharges the duty*. The
qualification is doing all the work. In section 4.2 the supervisor had already
been told and had dismissed the concern, so \`e = 1\` is no longer sufficient; it
drops out of \`A_suf\` and the minimum moves to \`e = 2\`. Once management has also
refused to engage, \`e = 2\` drops out in turn and the minimum moves up again. The
ladder is climbed one rung at a time, and each rung is justified by the failure
of the one below it, not by impatience with it.

$$e^{\\star} = \\min \\{\\, 2,\\, 3,\\, 4,\\, 5 \\,\\} = 2$$

## 5.4 Two duties in genuine conflict, resolved by the order

Confidentiality is a real obligation, not a fig leaf, which is why the conflict
between it and disclosure is the hardest case in the chapter. Write it as two
propositions: **H**, disclosure is necessary to protect the public from a hazard,
and **Q**, the information is the client's confidential material. Four cases,
enumerated in full:

| H | Q | Rungs engaged | Governing rung | Action |
|---|---|---|---|---|
| 0 | 0 | none | — | Ordinary practice; nothing special is required |
| 0 | 1 | 4 only | 4 | Keep it confidential; there is no competing duty |
| 1 | 0 | 1 only | 1 | Disclose to the proper authority |
| 1 | 1 | 1 and 4 | 1 | Disclose only what protecting the public requires |

Written as a predicate, the permission to disclose is

$$D_{\\mathrm{disclose}} = H \\wedge \\bigl( \\lnot Q \\vee (Q \\wedge H) \\bigr) = H$$

which simplifies, correctly, to \`H\` alone: confidentiality never blocks a
disclosure genuinely required to protect the public, and it always applies when
no such disclosure is required. What confidentiality *does* control is the
**scope** of the disclosure — the last row of the table says disclose what
protecting the public requires, and no more. A wholesale publication of a
client's file, justified by one defect in it, breaches rung 4 without buying any
additional protection at rung 1.`,
      examTip: 'Turn every canon into a conjunction before you read the answer choices. The duty to act needs a hazard, knowledge, competence, and an unresolved condition. If an answer choice removes one of those four it is a genuine defence; if it introduces something else — an instruction, a deadline, a cost, a rank — it is a distractor, because that variable does not appear in the predicate at all.',
      importantNote: 'The lexicographic weights 16, 8, 4, 2, 1 are what "paramount" means in arithmetic: each rung outweighs everything below it combined, because 16 > 8 + 4 + 2 + 1 = 15. That single inequality is why no accumulation of cost, schedule and convenience arguments can ever outrank a public-safety objection.',
    },
    {
      id: 'ce-quantified-risk',
      title: '6. When "Endangers the Public" Becomes a Number',
      content: `## 6.1 Severity times likelihood, and what the product is not

The phrase "endangers the public" cannot be applied consistently until it is
attached to a quantity. The standard first tool is the risk matrix, which scores
a hazard by

$$R = S \\times L$$

where \`S\` is a severity band and \`L\` a likelihood band, each on an integer scale.
A five-by-five matrix scores from 1 to 25, and a typical banding — the one used
throughout this section, stated here as a parameter and not as a claim about any
organisation's rules — is:

| Band | Score range | Meaning | Required response |
|---|---|---|---|
| Broadly acceptable | R at most 4 | Risk is small relative to everyday exposure | Record the assessment; no action required |
| Tolerable if reduced | R from 5 to 12 | Acceptable only with reduction measures | Reduce so far as is reasonably practicable; document |
| Not accepted | R at least 15 | Outside the organisation's appetite | Redesign, or do not proceed |

Counting cells in the grid gives 8, 11 and 6 in the three bands:

$$8 + 11 + 6 = 25$$

and the boundaries between bands are hyperbolas, since a fixed product means

$$L = \\frac{R_{0}}{S}$$

![The five-by-five risk matrix beside the expected loss the same bands imply. Left: the score S times L in every cell, shaded by the three bands the lesson defines, with the dashed hyperbolas L = 4/S and L = 12/S marking the band edges. Right: the same cells valued as consequence times frequency, using a consequence ladder rising by a decade per severity band and a frequency ladder rising by a decade per likelihood band, so lines of equal expected loss are the anti-diagonals S + L constant. The two families of curves do not coincide, and every disagreement between them is a cell the matrix ranks wrongly.](/courses/fe-ee/figures/eth2-risk-matrix.svg)

Now the caution that the figure exists to deliver. **A matrix multiplies ranks;
money multiplies quantities, and those are different operations.** Attach a
representative consequence to each severity band and a representative frequency
to each likelihood band, each ladder rising by a decade:

$$C_{S} = 10^{\\,S+2}, \\qquad f_{L} = 10^{\\,L-6}$$

Then the expected loss in a cell is

$$E_{S,L} = C_{S} \\, f_{L} = 10^{\\,S+L-4}$$

so that

$$\\log_{10} E_{S,L} = S + L - 4$$

Lines of equal expected loss are the **anti-diagonals** \`S + L\` constant, while
lines of equal matrix score are the **hyperbolas** \`S L\` constant. Two different
families of curves cannot rank the same cells the same way, and they do not.

### Worked example 6.1 — a rank inversion inside the matrix

Compare the cell at severity 1, likelihood 5 with the cell at severity 2,
likelihood 3.

$$R_{1,5} = 1 \\times 5 = 5 \\qquad R_{2,3} = 2 \\times 3 = 6$$

The matrix says the second cell is worse. Now the expected losses:

$$E_{1,5} = 10^{\\,1+5-4} = 10^{2} = 100$$

$$E_{2,3} = 10^{\\,2+3-4} = 10^{1} = 10$$

$$\\frac{E_{1,5}}{E_{2,3}} = 10$$

The cell the matrix ranks **lower** carries **ten times** the expected loss. The
inversion is not a defect in these particular numbers; it is structural, and it
follows from multiplying ordinal labels as though they were the quantities they
label. Two conclusions follow, and both are examinable judgement rather than
arithmetic:

- A matrix is a **screening** tool. It sorts a long list quickly and it is fine
  for that.
- A matrix is not an **acceptance** tool. Where the decision matters — where the
  answer determines whether a duty attaches — the underlying quantities must be
  carried through, not their ranks.

## 6.2 One unit is safe; a fleet is a different question

The commonest quantitative error in an ethics scenario is answering about one
unit when the question is about a population. For \`N\` independent units each
carrying a defect with probability \`p\`:

$$P(\\text{at least one fails}) = 1 - (1-p)^{N}$$

and for small \`p\` the exponential form is an excellent approximation,

$$P \\approx 1 - e^{-Np} \\qquad p \\ll 1$$

while the expected number of failures is exactly

$$\\mathbb{E}[X] = N p$$

with no approximation at all, whatever \`p\` may be.

![Probability that at least one unit in the field fails, plotted against fleet size on a logarithmic axis, for per-unit failure probabilities of one in a thousand, one in ten thousand and one in a hundred thousand, computed directly from one minus the survival product. The Poisson form is overlaid as a dashed line on the middle curve, and a vertical marker at twelve thousand units reads off the three probabilities the lesson computes.](/courses/fe-ee/figures/eth2-fleet-exposure.svg)

### Worked example 6.2 — a defect rate that sounds negligible

A product has shipped 12,000 units. Post-release testing puts the probability
that any one unit contains a latent defect at 1 in 10,000.

Expected number of defective units in the field:

$$12000 \\times 0.0001 = 1.2$$

Probability that at least one is out there:

$$1 - (1 - 0.0001)^{12000} = 0.6988$$

against the exponential approximation

$$1 - e^{-1.2} = 0.6988$$

The two agree to five decimal places; the difference is

$$0.698824 - 0.698806 = 0.000018$$

Read the result carefully, because the exam trades on the gap between the two
statements. "A one-in-ten-thousand defect rate" sounds like a rounding error.
"A seven-in-ten chance that a defective unit is already in a customer's hands"
is a different sentence describing the same fact. If the consequence of the
defect is injury, the second sentence is the one the duty attaches to.

## 6.3 A factor of safety is not a probability

Engineers reach for a factor of safety when asked how safe something is. It is a
ratio of central values,

$$\\mathrm{FS} = \\frac{\\mu_{C}}{\\mu_{D}}$$

comparing a mean capacity with a mean demand, and it says nothing whatever about
the spread of either. The quantity that does is the **safety margin**

$$M = C - D$$

whose moments, for independent capacity and demand, are

$$\\mu_{M} = \\mu_{C} - \\mu_{D} \\qquad \\sigma_{M} = \\sqrt{\\sigma_{C}^{2} + \\sigma_{D}^{2}}$$

The number of standard deviations by which the margin clears zero is the
**reliability index**

$$\\beta = \\frac{\\mu_{M}}{\\sigma_{M}} = \\frac{\\mu_{C} - \\mu_{D}}{\\sqrt{\\sigma_{C}^{2} + \\sigma_{D}^{2}}}$$

and if capacity and demand are normal, the failure probability follows from the
standard normal distribution function:

$$p_{f} = P(M < 0) = \\Phi(-\\beta)$$

![Above, the demand and capacity densities for the worked case, with their overlap shaded as the failure region. Below, the failure probability against the reliability index on a logarithmic scale, computed from the standard normal distribution function, with the as-built case and the two improvements the lesson computes marked on the curve. Each unit of the index is worth roughly a decade of probability.](/courses/fe-ee/figures/eth2-reliability-index.svg)

### Worked example 6.3 — same factor of safety, twenty-one times the risk

A component has capacity distributed with mean 1400 and standard deviation 140
in consistent units; the demand has mean 900 and standard deviation 120.

$$\\mu_{M} = 1400 - 900 = 500$$

$$\\sigma_{M} = \\sqrt{140^{2} + 120^{2}} = \\sqrt{34000} = 184.39$$

$$\\beta = \\frac{500}{184.39} = 2.7116$$

$$p_{f} = \\Phi(-2.7116) = 3.35 \\times 10^{-3}$$

The central factor of safety is

$$\\mathrm{FS} = \\frac{1400}{900} = 1.5556$$

Now hold that factor of safety fixed and tighten the manufacturing process so
that the capacity standard deviation falls to 70:

$$\\beta' = \\frac{500}{\\sqrt{70^{2} + 120^{2}}} = \\frac{500}{138.92} = 3.5991$$

$$p_{f}' = \\Phi(-3.5991) = 1.60 \\times 10^{-4}$$

$$\\frac{3.3477 \\times 10^{-3}}{1.5967 \\times 10^{-4}} = 21.0$$

Nothing about the nominal design changed. The factor of safety is still 1.5556.
The probability of failure fell by a factor of 21. That is the whole reason a
professional obligation cannot be discharged by quoting a safety factor: the
same factor covers wildly different levels of actual exposure, and the engineer
who signs is responsible for the exposure, not for the ratio.

## 6.4 The threshold that turns a feeling into a duty

Once a probability can be computed, "endangers the public" becomes a comparison
against a stated tolerable level. Write the individual annual risk as the annual
probability of the failure times the conditional probability that the failure
injures the exposed person:

$$R_{\\mathrm{ind}} = p_{a} \\, q$$

and let \`R_tol\` be the tolerable level the organisation has adopted. The duty to
warn is then a predicate again:

$$D_{\\mathrm{warn}} = \\bigl( R_{\\mathrm{ind}} > R_{\\mathrm{tol}} \\bigr) \\wedge \\lnot R_{\\mathrm{fix}}$$

where \`R_fix\` is true once the condition has actually been corrected. Two
warnings about this apparatus, both of which the exam can test:

- **The threshold is a policy input, not a physical constant.** Different bodies
  and different jurisdictions adopt different tolerable levels, usually with a
  broadly acceptable level some two orders of magnitude below a tolerable upper
  bound. Work from whatever level the question states, and say which one you
  used.
- **Being below the threshold does not end the obligation to reduce.** The usual
  structure is a duty to reduce risk so far as is reasonably practicable
  *within* the tolerable band, not merely to land inside it.

### Worked example 6.4 — does the duty to warn attach?

An installed system fails in a hazardous mode with annual probability
\`p_a = 2.0 x 10^-4\`. Given that mode, the probability an exposed worker is
seriously injured is \`q = 0.05\`. The employer's stated tolerable individual
risk is \`R_tol = 1.0 x 10^-6\` per year.

$$R_{\\mathrm{ind}} = 0.0002 \\times 0.05 = 0.00001$$

$$\\frac{1.0 \\times 10^{-5}}{1.0 \\times 10^{-6}} = 10$$

The computed exposure is ten times the level the employer itself has adopted, so
the first conjunct is true. If the condition has not been corrected, the second
is true as well, and the duty attaches — not because the engineer feels uneasy,
but because a number the engineer computed exceeds a threshold the organisation
published. That is the form an examinable ethics conclusion should take.

## 6.5 Two break-evens for one defect, and they are not the same number

Suppose the defect above is real and a fix is available. Over a fleet of \`N\`
units, with consequence \`C\` per failure and unit fix cost \`c\`:

$$E_{\\mathrm{harm}} = N p C \\qquad E_{\\mathrm{fix}} = N c$$

Setting them equal gives the break-even probability on purely financial grounds,

$$p^{\\star}_{\\mathrm{money}} = \\frac{c}{C}$$

which is independent of the fleet size, since \`N\` cancels.

![Expected cost over the fleet against the per-unit probability of the defect, on logarithmic axes. The rising line is expected money loss, the flat dashed line is the cost of fixing every unit, and the two vertical markers are the money break-even at 2.3333 in ten thousand and the safety break-even at 1.75 in ten thousand, computed from a stated disproportion benchmark. The safety threshold sits to the left, so counting harm rather than repair bills makes the fix compulsory at a lower defect rate.](/courses/fe-ee/figures/eth2-expected-loss.svg)

### Worked example 6.5 — the money answer and the safety answer

Take \`N = 12,000\` units, a consequence of 180,000 per failure in currency units,
and a fix costing 42 per unit.

$$p^{\\star}_{\\mathrm{money}} = \\frac{42}{180000} = 2.3333 \\times 10^{-4}$$

Below that defect rate the fix costs more than the expected loss it prevents;
above it, less. Now do the safety version. Let \`q = 0.02\` be the probability a
failure causes a fatality, so the expected number of fatalities averted by
fixing the fleet is

$$\\Delta N_{f} = N p q$$

and the cost per averted fatality is

$$\\mathrm{CPF} = \\frac{N c}{N p q} = \\frac{c}{p q}$$

At the earlier defect rate of one in ten thousand,

$$\\mathrm{CPF} = \\frac{42}{(1.0 \\times 10^{-4})(0.02)} = 2.1 \\times 10^{7}$$

Against a stated disproportion benchmark of \`B = 12,000,000\` per averted
fatality, the safety break-even is

$$p^{\\star}_{\\mathrm{safety}} = \\frac{c}{q B}$$

$$0.02 \\times 12000000 = 240000$$

$$\\frac{42}{240000} = 1.75 \\times 10^{-4}$$

So the fix becomes compulsory on safety grounds at a **lower** defect rate than
the one at which it becomes profitable on financial grounds, and the gap between
the two thresholds is the entire subject matter of engineering ethics in this
area.

### Worked example 6.6 — the arithmetic that must not be done

Now the part that the numbers cannot settle. Suppose the same fleet, the same
fix cost, but a defect rate of \`p = 5 x 10^-5\` — below both break-evens.

$$12000 \\times 0.00005 = 0.6$$

$$0.6 \\times 0.02 = 0.012$$

The expected number of fatalities is 0.012, the expected money loss is

$$0.6 \\times 180000 = 108000$$

against a fix cost of 504,000, and the cost per averted fatality is

$$\\frac{504000}{0.012} = 42000000$$

more than three times the stated benchmark. Every number says the fix is not
justified — and none of that permits the engineer to stay silent. The
paramountcy rule does not say "compute an expected loss and act if it is large".
It says a hazard to the public is not a quantity to be traded against cost at
all. What the arithmetic legitimately decides is **which mitigation to choose**
and **how urgently**; what it may never decide is whether the people exposed get
to be told. Section 4.3 of this chapter phrased that as a rule about gifts; here
it is a rule about spreadsheets, and the structure is identical: an analysis can
inform a duty, and it can never dissolve one.`,
      examTip: 'When a scenario hands you a probability, a fleet size, a factor of safety or a consequence, the question is nearly always testing whether you compute before you conclude. Multiply out the exposure first — expected count is N times p, always — then compare it with whatever threshold the question states, and let the comparison, not your instinct, pick the answer.',
      importantNote: 'A risk matrix multiplies ordinal ranks, which is not the same operation as multiplying the quantities those ranks stand for. Use a matrix to screen a long list; never let a matrix score be the last step before a decision that determines whether a duty to warn attaches.',
    },
    {
      id: 'ce-materiality',
      title: '7. Money, Materiality, Credit and the Long Horizon',
      content: `## 7.1 A conflict of interest, stated as a condition

A conflict of interest is not a state of mind and not an accusation. It is a
structural fact, and it can be written down. Let **B** be true when you hold an
interest that could benefit from one outcome of a professional judgement you are
making, **J** be true when you are actually making that judgement, and **P** be
true when the affected parties have been told and have agreed to your continuing.
Then

$$X_{\\mathrm{conflict}} = B \\wedge J$$

$$D_{\\mathrm{disclose}} = X_{\\mathrm{conflict}}$$

$$D_{\\mathrm{withdraw}} = X_{\\mathrm{conflict}} \\wedge \\lnot P$$

Three properties of that little system carry most of the examinable content.

- **Disclosure is owed on the conflict alone.** It does not wait for the interest
  to be large, for the judgement to be close, or for anyone to be harmed.
- **The conflict exists whether or not you are actually swayed.** \`B\` is a fact
  about your position, not about your character, which is why "I would never let
  it affect me" is not responsive.
- **Consent cures, refusal follows.** Where the affected parties, fully informed,
  agree that you should continue, \`P\` is true and withdrawal is not required.
  Where consent is withheld or cannot meaningfully be given, it is.

The quantities enter one level down, in deciding how much of a thing counts.
Three ratios do most of that work:

$$m = \\frac{G}{F} \\qquad \\phi = \\frac{V_{h}}{V_{\\mathrm{issue}}} \\qquad \\rho = \\frac{R_{c}}{R_{\\mathrm{total}}}$$

the value of a benefit against the fee for the assignment, a holding against the
total value of the thing held, and revenue from one client against total
revenue. Each is a **materiality** measure, and the response ladder is a step
function of it:

$$m < m_{1} \\implies A = \\mathrm{record}$$

$$m_{1} \\le m < m_{2} \\implies A = \\mathrm{disclose}$$

$$m \\ge m_{2} \\implies A = \\mathrm{refuse}$$

The thresholds \`m_1\` and \`m_2\` are set by an employer's policy, by a client's
procurement rules, or by a public body's gift limits, and they differ; no code
supplies a universal number. What the code supplies is the shape.

### Worked example 7.1 — three benefits, one fee

An engineer is engaged for a specification study at a fee of 48,000 in currency
units. During the study a bidder offers, in turn, a working lunch worth 250, a
factory visit worth 2,500, and a personal gift worth 12,000. Compute the
materiality of each against the fee.

$$\\frac{250}{48000} = 0.0052$$

$$\\frac{2500}{48000} = 0.0521$$

$$\\frac{12000}{48000} = 0.2500$$

Check the middle one by the reverse route:

$$0.0520833 \\times 48000 = 2500$$

Ratios of 0.5 per cent, 5.2 per cent and 25 per cent. Take an employer policy
with \`m_1 = 0.01\` and \`m_2 = 0.05\` as stated in the problem. The lunch falls below
\`m_1\` and is recorded. The factory visit falls in the middle band: it must be
disclosed to the client, and it is acceptable only if the client agrees and the
visit serves the client's evaluation rather than the bidder's persuasion. The
personal gift is five times \`m_2\` and is refused outright. Notice that the
factory visit and the lunch differ by exactly a decade in materiality, and that
the ladder converts a judgement about "substantial value" into a comparison
between two numbers.

### Worked example 7.2 — how little influence it takes

The same procurement scores two bidders on a 100-point scale, with a
15-point sub-score for vendor support. The evaluation comes out at 81.3 for
bidder A and 80.6 for bidder B.

$$81.3 - 80.6 = 0.7$$

$$\\delta = \\frac{0.7}{15} = 0.0467$$

A shift of 0.7 points inside a 15-point criterion — under five per cent of that
one criterion, and seven-tenths of one per cent of the total — reverses the
award. This is the reason the codes
treat the **appearance** of influence as harm in itself. Nobody has to be bought.
The margins on real evaluations are small enough that a barely conscious
preference is decisive, and neither the engineer nor anyone auditing the file can
afterwards distinguish a nudged score from an honest one.

### Worked example 7.3 — the selfish calculation also loses

Suppose an engineer treats the gift as a wager: accept and gain \`G\` while facing
a total loss \`L\` — licence, position, penalty and reputation — with probability
\`p_d\` of being found out. The expected value of accepting is

$$\\mathbb{E}[\\mathrm{accept}] = G - p_{d} L$$

which is positive only below the break-even detection probability

$$p_{d}^{\\star} = \\frac{G}{L}$$

![Break-even chance of being caught, as a percentage, plotted against the value of the gift for three levels of total loss on detection. Each line is the ratio of gift to loss, so the break-even is proportional to the gift and inversely proportional to what is at stake; the marked point is a gift of 2,500 against a total loss of 250,000, where a one per cent chance of detection already makes acceptance a losing bet.](/courses/fe-ee/figures/eth2-gift-breakeven.svg)

For the 2,500 factory trip against a total loss of 250,000:

$$\\frac{2500}{250000} = 0.01$$

A one-in-a-hundred chance of the matter coming out is enough to make acceptance
negative in expectation. At a more realistic detection probability of 0.15,

$$0.15 \\times 250000 = 37500$$

$$37500 - 2500 = 35000$$

the expected loss is 35,000 against a 2,500 gain — fourteen times the benefit.
Then the sentence that matters more than the arithmetic: **the line below which
accepting becomes rational is not the line below which it becomes permitted.**
A gift small enough to survive the expected-value test is still refused if it is
offered to influence a judgement, and the reason has nothing to do with the odds.

## 7.2 Credit, attribution and plagiarism

The duty here is narrow and absolute: state who did the work. It is examinable in
two directions — claiming what you did not do, and omitting someone who did.

Where contributions are apportioned, the shares must exhaust the work:

$$\\sum_{i=1}^{n} c_{i} = 1 \\qquad c_{i} \\ge 0$$

### Worked example 7.4 — apportioning a report

Four engineers log 320, 210, 96 and 24 hours on a study.

$$320 + 210 + 96 + 24 = 650$$

$$c_{1} = \\frac{320}{650} = 0.4923$$

$$c_{4} = \\frac{24}{650} = 0.0369$$

The fourth contributor accounts for 3.7 per cent of the recorded effort. That is
small; it is not zero, and the obligation does not have a materiality threshold
the way a gift does. Two distinctions do the work in exam scenarios:

- **Hours are evidence of contribution, not a definition of it.** A colleague who
  supplied the governing idea in an hour may deserve more credit than the
  fraction suggests. The apportionment is a starting point for a conversation,
  not a substitute for one.
- **Omission is the offence, not under-weighting.** Getting a share slightly wrong
  is a disagreement; leaving a contributor off the report entirely, or presenting
  another organisation's work as your own, is misrepresentation and falls under
  the honesty canon rather than the credit convention.

Reusing another's published material follows the same rule with a different
mechanism: cite it, and obtain permission where the use exceeds what a citation
permits. Copyright, which section 4 of the licensure chapter treats in detail, is
a separate legal question from the ethical one; an attribution that satisfies
neither is the common failure.

## 7.3 The long horizon: sustainability as a computable obligation

Codes increasingly frame a duty to consider the whole life of what is built,
which sounds like an exhortation until it is written as a comparison. The
life-cycle burden of an option is its embodied burden plus its rate of use over
the service life:

$$E_{\\mathrm{life}} = E_{\\mathrm{emb}} + \\dot{E} \\, T$$

Comparing two options, the extra embodied burden of the better-performing one is
repaid after

$$T^{\\star} = \\frac{\\Delta E_{\\mathrm{emb}}}{\\Delta \\dot{E}}$$

and the option with the lower total over the actual service life is the one the
duty points to — provided the service life is honestly estimated, which is where
these comparisons are usually manipulated.

### Worked example 7.5 — an efficiency payback

Option A has an embodied energy of 1,850 kWh and consumes 640 kWh a year. Option
B has an embodied energy of 3,200 kWh and consumes 430 kWh a year. The service
life is 15 years.

$$\\Delta E_{\\mathrm{emb}} = 3200 - 1850 = 1350$$

$$\\Delta \\dot{E} = 640 - 430 = 210$$

$$T^{\\star} = \\frac{1350}{210} = 6.43$$

Over the full life:

$$1850 + 640 \\times 15 = 11450$$

$$3200 + 430 \\times 15 = 9650$$

$$11450 - 9650 = 1800$$

Option B repays its extra embodied energy in 6.43 years and saves 1,800 kWh over
the 15-year life. The professional point is in the sensitivity rather than the
answer: if the service life were only 6 years, the comparison reverses, and an
engineer who quotes the 15-year figure while privately expecting a 6-year
replacement cycle has produced a technically correct calculation and a
misleading report. Objectivity is a duty about the **assumptions**, not only
about the arithmetic performed on them.`,
      examTip: 'Materiality questions want a ratio and a comparison, in that order. Divide the benefit by the fee, the holding by the total, or the client by the revenue; compare it with the threshold the question supplies; then state the action — record, disclose, or refuse. An answer that jumps to "refuse" without computing the ratio is as wrong as one that jumps to "accept".',
      importantNote: 'Disclosure is owed on the existence of the conflict, not on its size. The ratios decide whether disclosure is enough or whether withdrawal is required; they never decide whether the affected parties get to know.',
    },
    {
      id: 'ce-escalation-problems',
      title: '8. The Escalation Ladder, and Two Problem Sets',
      content: `## 8.1 A test at every rung

Section 5 gave escalation as a minimisation over a sufficient set. In practice
each rung has an entry test that must be satisfied before you climb to it, and
the tests are what an exam scenario supplies or withholds.

| Rung | Action | Entry test — climb here only when | What to record |
|---|---|---|---|
| 1 | Raise with the person responsible | You have a specific technical concern held in good faith | The concern, its basis, the date, the recipient |
| 2 | Escalate within the organisation | Rung 1 has been tried and has not resolved the technical question | The response received and why it does not answer the concern |
| 3 | Escalate to an officer or the board | The management chain has declined to act, or is itself the problem | The full chain of prior attempts |
| 4 | Notify the licensing board or the regulator | Internal channels are exhausted, unavailable, or too slow for the hazard | Everything above, plus the reasoning for going outside |
| 5 | Disclose publicly | The hazard is immediate and no channel above can act in time | Everything, contemporaneously |

Three tests recur and are worth memorising as questions rather than rules:

- **Has the technical question been answered, or merely overruled?** An analysis
  showing the concern is unfounded closes the matter at any rung. An assertion of
  seniority, custom, cost or schedule does not.
- **Is the channel above actually available and functioning?** A channel that has
  refused to engage has failed the test; a channel you have not tried has not.
- **Can the channel act before the hazard matures?** This is a comparison of two
  times, and it is the only test in the ladder that lets you skip rungs.

## 8.2 The timing test, computed

That last test is quantitative. Model the hazard as a constant-rate exposure
while the condition remains live, so the probability that at least one incident
has occurred by time \`t\` is

$$P(t) = 1 - e^{-\\lambda t}$$

and the risk created by a **delay** from \`t_1\` to \`t_2\` is the difference

$$\\Delta P = P(t_2) - P(t_1) = e^{-\\lambda t_{1}} - e^{-\\lambda t_{2}}$$

![Cumulative probability of at least one incident against the number of days a hazardous condition stays live, computed from a constant exposure rate, with the linear small-time approximation shown as a dashed line. Four decision points are marked: escalating at once, one internal round, the full internal path, and waiting for the next review cycle. The arrow between two of them is the risk that the delay itself creates, as distinct from the risk the defect creates.](/courses/fe-ee/figures/eth2-escalation-clock.svg)

### Worked example 8.1 — what the delay costs, as opposed to the defect

A live hazardous condition is exposed at a rate of \`0.0032\` incidents per day.
Escalating immediately would see it corrected in about 6 days; the full internal
path, with each rung given a fair chance, would take about 45 days.

$$0.0032 \\times 6 = 0.0192$$

$$0.0032 \\times 45 = 0.144$$

$$P(6) = 1 - e^{-0.0192} = 0.0190$$

$$P(45) = 1 - e^{-0.144} = 0.1341$$

$$\\Delta P = 0.1341 - 0.0190 = 0.1151$$

An eleven-point-five per cent probability of an incident is attributable to the
delay alone. Whether that is acceptable depends on the consequence, which is
exactly the comparison section 6.4 set up: multiply by the conditional
probability of injury and compare with the stated tolerable level. What the
computation forbids is the unexamined answer in both directions — neither "work
the ladder patiently because that is the process" nor "go public because it feels
urgent" is defensible until the two times have been compared.

Note also the linear approximation drawn on the figure. When the exponent is
small,

$$1 - e^{-\\lambda t} \\approx \\lambda t$$

and at 45 days that shortcut gives 0.144 against the true 0.1341, an
overstatement of

$$0.144 - 0.1341 = 0.0099$$

which is close enough for a decision and always errs on the cautious side, since
the exponential is concave.

### Worked example 8.2 — an escalation decision end to end

A newly licensed engineer finds that a protective setting on an installed system
is wrong in a way that would leave a fault uncleared. The best estimate is that
the condition is exposed at 0.0032 per day; given an uncleared fault, the
probability of serious injury to a worker is 0.05. The employer's stated
tolerable individual risk is \`1.0 x 10^-6\` per year. The supervisor, told once,
has said the setting matches the previous installation.

**Step 1 — is the duty engaged?** Annualise the exposure. Over 365 days,

$$0.0032 \\times 365 = 1.168$$

$$P(\\mathrm{year}) = 1 - e^{-1.168} = 0.6890$$

$$0.6890 \\times 0.05 = 0.034$$

against a tolerable \`1.0 x 10^-6\`. The computed exposure exceeds the stated
threshold by more than four orders of magnitude, so \`D_warn\` is true and the
rung-1 test of section 5 is engaged.

**Step 2 — has the technical question been answered?** "It matches the previous
installation" is an argument from custom. It is not an analysis of whether the
setting clears the fault. The rung-1 entry test of section 8.1 is satisfied and
rung 2 is open.

**Step 3 — which action?** Applying the weights of section 5.3: doing nothing
scores 16; escalating in writing to management scores 3; going public
immediately scores 7. The minimum is escalation in writing.

**Step 4 — is there time?** The internal path costs about 39 days of additional
exposure and 0.1151 of additional incident probability. If the system can be
taken out of service or the setting corrected provisionally in the meantime, that
mitigation belongs in the same document — and it usually dissolves the timing
question entirely, which is why "recommend an interim measure" is so often part
of the best answer.

## Problem Set A — risk, thresholds and the duty to act

Work each one to a number before choosing an action. Answers follow immediately;
resist reading them.

**A1.** A component is installed in 45,000 units. The probability that any one
unit carries a latent defect is \`2.0 x 10^-5\`. Compute the expected number of
defective units and the probability that at least one is in service.

*Answer.* \`45000 x 0.00002 = 0.9\` so 0.9 units are expected. Probability at least
one: \`1 - e^{-0.9} = 0.5934\` — and the exact binomial value
\`1 - (1 - 0.00002)^{45000}\` agrees to four decimals. Slightly better than an
even chance that a defective unit is already in the field.

**A2.** A hazard is scored severity 4, likelihood 2 on the five-by-five matrix of
section 6.1. Which band is it in, and what does the score fail to tell you?

*Answer.* \`4 x 2 = 8\` — the tolerable-if-reduced band. The score does not tell
you the expected loss: on the decade ladders of section 6.1 the cell is
\`10^{4+2-4} = 100\` per year, the same as the severity-5, likelihood-1 cell,
which scores 5 and sits in a lower band. Screen with the matrix; decide with the
quantities.

**A3.** A design has mean capacity 2,600 with standard deviation 300 and mean
demand 1,800 with standard deviation 250. Compute the factor of safety, the
reliability index and the failure probability.

*Answer.* \`FS = 2600/1800 = 1.4444\`. Margin mean \`2600 - 1800 = 800\`; margin
standard deviation \`sqrt(300^2 + 250^2) = sqrt(152500) = 390.51\`;
\`beta = 800/390.51 = 2.0486\`; \`p_f = Phi(-2.0486) = 0.0203\`. About one in
forty-nine — a factor of safety near 1.44 buying a great deal less than it
sounds like.

**A4.** For the design in A3, the organisation's tolerable failure probability is
\`1.0 x 10^-3\`. By what factor must the failure probability fall, and roughly what
reliability index does that require?

*Answer.* \`0.0203 / 0.001 = 20.3\` — a factor of about 20. Since each unit of
beta is worth roughly a decade, and since \`Phi(-3.0902) = 1.0 x 10^-3\` the index must
rise from 2.0486 to about 3.09 — an increase of just over one. Achievable by
raising the mean capacity, by reducing either spread, or by both; the arithmetic
does not care which, and the engineering judgement is entirely about which is
cheapest and most reliable to hold.

**A5.** A fix costs 18 per unit across 30,000 units. The consequence of a failure
is 90,000. At what defect rate does the fix pay for itself on financial grounds?
If a failure kills with probability 0.01 and the organisation's disproportion
benchmark is 12,000,000 per averted fatality, at what defect rate does it become
required on safety grounds?

*Answer.* Money: \`p* = 18/90000 = 2.0 x 10^-4\`. Safety:
\`0.01 x 12000000 = 120000\` and \`p* = 18/120000 = 1.5 x 10^-4\`. The safety
threshold is lower, as it must be whenever the benchmark exceeds the money
consequence divided by the fatality fraction.

**A6.** A hazardous condition is exposed at 0.0045 per day. Internal escalation
would resolve it in 30 days; an immediate provisional measure would resolve it in
4. What incremental probability of an incident does the slower path create?

*Answer.* \`0.0045 x 4 = 0.018\` and \`0.0045 x 30 = 0.135\`; so
\`P(4) = 1 - e^{-0.018} = 0.01784\` and \`P(30) = 1 - e^{-0.135} = 0.12628\`. The
difference is \`0.12628 - 0.01784 = 0.10844\` — close to eleven per cent, created by
the delay rather than by the defect. Recommend the provisional measure in the
same document that escalates.

**A7.** An engineer puts the prior probability of a systematic design defect at
0.05. Two independent field reports arrive, each of a kind three times more
likely if the defect is real than if it is not. Compute the posterior
probability and say what it does and does not justify.

*Answer.* Prior odds \`0.05/0.95 = 0.052632\`; combined likelihood ratio
\`3 x 3 = 9\`; posterior odds \`9 x 0.052632 = 0.47368\`; posterior probability
\`0.47368/1.47368 = 0.3214\`. A weak likelihood ratio and two reports leaves you
at 32 per cent — nowhere near proof, and far past the point at which ignoring it
is defensible. Thirty-two per cent justifies investigation and interim caution;
it does not by itself justify a public statement that the design is defective,
because a claim of that kind must itself be objective and supported.

**A8.** A fleet of 8,000 units carries a defect with per-unit probability
\`3.0 x 10^-4\`. Each failure costs 250,000 and kills with probability 0.015. A
fix costs 55 per unit; the organisation's disproportion benchmark is 12,000,000
per averted fatality. Does the fix clear the money test, the safety test, both,
or neither?

*Answer.* Expected defective units \`8000 x 0.0003 = 2.4\`; expected money loss
\`2.4 x 250000 = 600000\` against a fix cost of \`8000 x 55 = 440000\` — so the fix
pays on money grounds — equivalently, the money break-even is
\`55/250000 = 2.2 x 10^-4\` — below the actual rate. Safety:
\`0.015 x 12000000 = 180000\` and the safety break-even is
\`55/180000 = 3.06 x 10^-4\` — marginally **above** the actual rate, so the fix
does not clear the disproportion benchmark. The two tests disagree, and the
disagreement is the answer worth stating: the fix is justified, it should be
done, and the fact that a benchmark ratio fell 2 per cent short is not a reason
to leave a known defect in a fleet.

## Problem Set B — conflicts, materiality and the ordering rule

**B1.** An engineer holds shares worth 40,000 in a company whose product she is
evaluating for a client. Her total portfolio is 800,000 and the company's market
value is 2.4 billion. Compute both materiality ratios and say which one governs.

*Answer.* Against her own position, \`40000/800000 = 0.05\` — five per cent.
Against the company, \`40000/2400000000 = 1.67 x 10^-5\` — negligible. The
governing ratio is the first: the question is whether **her** judgement could be
affected, not whether **she** could affect the company. Disclose; withdraw if the
client does not consent.

**B2.** A firm bills 2.1 million a year and one client accounts for 1.4 million
of it. Compute the concentration ratio and state the professional risk it
creates.

*Answer.* \`1400000/2100000 = 0.667\` — two-thirds. Nothing about that is
prohibited, and it is not a conflict of interest in the technical sense of
section 7.1, because there is no competing interest — but it is an
**independence** risk: the cost of telling that client something it does not want
to hear is now large enough to bias judgement. The professional response is to
recognise it in advance, document technical positions contemporaneously, and
treat any pressure from that client with heightened, not reduced, formality.

**B3.** Rank these four actions using the weights of section 5.3, for an engineer
who has discovered that test data in a released report was selectively omitted:
(i) say nothing, (ii) correct the report and notify the client, (iii) correct the
report but not tell the client, (iv) resign.

*Answer.* (i) leaves a false statement standing on which others rely: rungs 1 and
3 violated, \`16 + 4 = 20\`. (ii) violates only rungs 4 and 5, \`2 + 1 = 3\`. (iii)
still leaves the client relying on a false statement: rung 3, and rung 1 if
safety turns on it, so at best 4 and at worst 20. (iv) leaves the false report
standing and adds a personal cost, \`16 + 4 + 1 = 21\`. Correct and notify.

**B4.** An engineer is offered a 6,000 consulting engagement by a supplier while
serving on a committee that will select between that supplier and two others. The
committee role is unpaid. Compute a materiality ratio and decide.

*Answer.* The fee for the conflicted assignment is zero, so the ratio \`G/F\` is
undefined — and that is the answer, not an obstacle to it. When the professional
role carries no fee, no benefit is small relative to it, and the conflict is
structural rather than marginal. \`X_conflict\` is true, so disclosure is owed;
because a paid relationship with one candidate cannot be cured by disclosure in a
competitive selection, withdrawal from either the engagement or the committee is
the defensible outcome.

**B5.** A colleague asks to be added as an author to a paper describing work he
did not perform, on the grounds that he supervises the group. State the rule and
the exception.

*Answer.* The rule is that credit follows contribution; supervisory position is
not itself a contribution and adding a name for it is misrepresentation. The
exception is genuine: if the supervisor contributed materially — the governing
idea, the design of the study, substantive revision — then he is a contributor
regardless of hours logged, and the share apportionment of section 7.2 is a
starting point rather than a verdict. The test is what was contributed, and it
does not have a materiality floor.

**B6.** Two designs are compared over a stated 20-year service life. Design P has
embodied energy 4,200 kWh and uses 900 kWh a year; design Q has embodied energy
9,600 kWh and uses 560 kWh a year. Compute the payback and the 20-year totals,
then state the assumption that would reverse the conclusion.

*Answer.* \`9600 - 4200 = 5400\` and \`900 - 560 = 340\` so
\`T* = 5400/340 = 15.88\` years. Totals: \`4200 + 900 x 20 = 22200\` and
\`9600 + 560 x 20 = 20800\` — so Q saves \`22200 - 20800 = 1400\` kWh. The
conclusion reverses if the true service life is under 15.88 years — and an
engineer who knows the equipment is typically replaced at 12 years, while
reporting the 20-year comparison, has met the arithmetic standard and breached
the objectivity one.

**B7.** A live condition is exposed at 0.0060 per day. A provisional measure
could be in place in 3 days; the unaided internal escalation path would take 28.
Compute the incremental probability of an incident and state what the number is
for.

*Answer.* \`0.006 x 3 = 0.018\` and \`0.006 x 28 = 0.168\` so
\`P(3) = 1 - e^{-0.018} = 0.0178\` and \`P(28) = 1 - e^{-0.168} = 0.1546\`. The
difference is \`0.1546 - 0.0178 = 0.1368\`. The number is not an argument for
skipping rungs — it is the quantity you put **in writing** when you escalate, so
that the person receiving the escalation is making a decision about a computed
13.7 per cent rather than about a colleague's uneasiness.

**B8.** An engineer is offered a fee of 8 per cent of any construction cost
saving she identifies on a project with a 4.2 million budget, in place of a fixed
fee of 30,000. Compute the saving that makes the two equal, and state the
professional issue.

*Answer.* \`0.08 x 375000 = 30000\` — so 375,000 of identified savings makes the
arrangements equal; identifying 350,000 would earn \`0.08 x 350000 = 28000\`.
The issue is not the amount. A fee that rises with the size of the reduction she
recommends gives her a structural interest in one outcome of a professional
judgement, which makes \`X_conflict\` true by the definition in section 7.1, so
disclosure is owed whatever the numbers. Whether the arrangement is permissible
at all depends on what the savings come out of: reductions in scope or in
procurement cost are one thing, and reductions that consume design margin are a
rung-1 matter no fee structure may be allowed to influence.`,
      examTip: 'Escalation questions are decided by two comparisons: has the technical concern been answered rather than overruled, and can the next channel act before the hazard matures. If the scenario gives you a rate and two timescales, it wants the difference between two cumulative probabilities, and the answer will pair escalation with an interim protective measure.',
      importantNote: 'Skipping rungs is defensible only on the timing test. "Internal channels are slow" is not the test; "internal channels cannot act before the hazard matures" is, and it is a comparison between two numbers the scenario will normally give you.',
    },
    {
      id: 'ce-honesty-numeric',
      title: '9. Honesty Is a Quantitative Duty',
      content: `## 9.1 Three ways a true sentence can be a false statement

The objectivity and truthfulness canon is the one candidates think they
understand best and apply worst, because they read it as a prohibition on lying.
It is broader than that, and the three failure modes it covers are distinguished
by what happens to the *inference* a reader draws rather than by what happens to
the sentence.

| Failure mode | The sentence is | The reader concludes | Where it is caught |
|---|---|---|---|
| Misstatement | False | Something false | Trivially, once the data is seen |
| Selective presentation | True | Something false | Only by someone who knows what was left out |
| Suppressed uncertainty | True | Something more certain than the evidence supports | Only by recomputing the uncertainty |

The first is rare in professional practice and easy to condemn. The second and
third are common, are usually committed without conscious dishonesty, and are
detectable only by arithmetic. That is the reason this section exists: a duty
that can only be checked by computation has to be taught by computation.

## 9.2 What dropping one result does

The commonest form of selective presentation is discarding an inconvenient
measurement. Sometimes that is legitimate — a recorded value can be traced to an
instrument fault or a procedural error, and excluding it with the reason stated
is good practice. What is never legitimate is excluding it because it is
inconvenient, and what is almost never appreciated is how large the effect is.

### Worked example 9.1 — one point out of twelve

Twelve specimens are tested. The results, in consistent units, are 41.2, 43.8,
39.6, 42.1, 44.0, 40.7, 42.9, 38.4, 43.3, 41.8, 42.6 and 28.9. The specification
requires a minimum of 35.0, and the report is required to estimate the fraction
of production that would fall below it, assuming the values are normally
distributed.

With all twelve results, the sample mean and standard deviation are 40.775 and
4.0988, so

$$z = \\frac{40.775 - 35.0}{4.0988} = 1.4089$$

$$P(X < 35.0) = \\Phi(-1.4089) = 0.0794$$

Almost eight per cent of production would fail. Now drop the single low value as
an outlier, leaving eleven results with mean 41.855 and standard deviation
1.7598:

$$z' = \\frac{41.855 - 35.0}{1.7598} = 3.8952$$

$$P'(X < 35.0) = \\Phi(-3.8952) = 4.91 \\times 10^{-5}$$

$$\\frac{0.0794}{0.0000491} = 1617$$

Removing one measurement in twelve changed the reported failure rate by a factor
of about **1,600**. It did that mostly through the standard deviation, which fell
from 4.10 to 1.76, because the discarded point was the only evidence in the data
set that the process has a tail at all. The mean moved by barely one unit; the
inference moved by three orders of magnitude.

The professional rule follows directly, and it is the one an exam scenario
rewards: **you may exclude a result only for a reason that would have applied
before you saw it**, the reason must be recorded, and the report must state that
an exclusion was made. Anything else converts a data set into an argument.

## 9.3 False precision is a form of untruthfulness

The third failure mode is quieter. A number reported to more digits than the
inputs support asserts a confidence nobody has. For a product of two measured
quantities, relative uncertainties combine in quadrature:

$$\\frac{u_{y}}{y} = \\sqrt{\\left(\\frac{u_{a}}{a}\\right)^{2} + \\left(\\frac{u_{b}}{b}\\right)^{2}}$$

### Worked example 9.2 — how many digits are yours to write

A quantity is computed as the product of two measurements: \`a = 12.4\` with an
uncertainty of 0.3, and \`b = 8.70\` with an uncertainty of 0.15.

$$12.4 \\times 8.70 = 107.88$$

$$\\frac{0.3}{12.4} = 0.02419 \\qquad \\frac{0.15}{8.70} = 0.01724$$

$$\\frac{u_{y}}{y} = \\sqrt{0.02419^{2} + 0.01724^{2}} = 0.02971$$

$$u_{y} = 107.88 \\times 0.02971 = 3.205$$

The honest report is 108 with an uncertainty of about 3, or at most 107.9 with
the uncertainty stated. Writing 107.88 without qualification tells a reader that
the third and fourth significant figures mean something, and they do not: the
uncertainty is larger than the last two digits combined. That is a false
statement made entirely out of true digits, and it is the kind an engineer makes
by copying a calculator display into a report.

Two corollaries that appear on exams:

- **Uncertainty is not a confession of poor work.** Stating it is a professional
  requirement, and a report without it invites reliance the data cannot bear.
- **Rounding at the end, not in the middle.** Intermediate rounding introduces an
  error that has nothing to do with the measurement and is therefore not
  disclosed by any uncertainty statement.

## 9.4 One complaint is not an anecdote

The duty to investigate is often argued about as though it were a matter of
temperament — how seriously does one take a single field report? It is not. It is
a probability update, and the update is computable.

For a design defect hypothesis \`D\` and a field report \`E\`:

$$P(D \\mid E) = \\frac{P(E \\mid D) \\, P(D)}{P(E \\mid D) \\, P(D) + P(E \\mid \\lnot D) \\, P(\\lnot D)}$$

and the same result written as odds is far easier to carry:

$$\\frac{P(D \\mid E)}{P(\\lnot D \\mid E)} = \\frac{P(E \\mid D)}{P(E \\mid \\lnot D)} \\cdot \\frac{P(D)}{P(\\lnot D)}$$

so a report multiplies the prior odds by the **likelihood ratio**, and nothing
else about it matters.

### Worked example 9.3 — how fast two reports move the answer

Before any field data, an engineer puts the probability of a systematic design
defect at 0.02. A report arrives of a kind that would occur with probability 0.30
if the defect were real, and 0.01 if it were not.

$$0.30 \\times 0.02 = 0.006$$

$$0.01 \\times 0.98 = 0.0098$$

$$0.006 + 0.0098 = 0.0158$$

$$P(D \\mid E) = \\frac{0.006}{0.0158} = 0.3797$$

Check it by the odds route, which is independent of the arithmetic above. The
prior odds are \`0.02/0.98 = 0.020408\` and the likelihood ratio is
\`0.30/0.01 = 30\`:

$$30 \\times 0.020408 = 0.61224$$

$$\\frac{0.61224}{1.61224} = 0.3797$$

The two agree. A single report has taken the probability from 2 per cent to 38
per cent. A second independent report of the same kind multiplies the odds by 30
again:

$$900 \\times 0.020408 = 18.367$$

$$\\frac{18.367}{19.367} = 0.9484$$

Nearly 95 per cent after two reports. The professional consequence is sharp:
**"one complaint proves nothing" is a statement about the likelihood ratio, not a
statement about the number one.** Where a report is thirty times more probable
under the defect hypothesis, one of them is decisive evidence, and an engineer who
dismisses it as anecdote has made a quantitative error and called it judgement.
Where a report would be almost as likely without the defect — a likelihood ratio
near 1 — a hundred of them move the answer very little, and treating them as
proof is the mirror-image error.

Set this beside section 6.4 and the chain closes. The posterior probability feeds
the exposure calculation; the exposure is compared with the tolerable threshold;
and the comparison, not the engineer's mood, decides whether the duty to warn has
attached.

## 9.5 The honesty duties, side by side

| Duty | Applies when | The test | The failure it prevents |
|---|---|---|---|
| Objectivity in reports | Always | Would a reader with the full data draw the same conclusion? | Selective presentation |
| Stated uncertainty | Whenever a number will be relied on | Do the digits you wrote survive the uncertainty propagation? | False precision |
| Competence disclosure | When speaking outside your field | Have you said which parts are outside your expertise? | Borrowed authority |
| Qualification accuracy | In every professional representation | Does every claimed credential exist and apply? | Misrepresentation |
| Credit | Whenever work is presented | Is every contributor named? | Omission, which is the offence |
| Basis of opinion | In testimony and public statements | Is the factual basis stated with the opinion? | Assertion mistaken for analysis |

Read the middle column as a list of computations, not as a list of virtues. Every
one of them can be checked by someone else with the same data, which is precisely
what makes truthfulness an enforceable professional duty rather than a private
one.`,
      examTip: 'When a scenario hands you a data set with one awkward value, or a number reported to more digits than its inputs, the answer is almost never "the engineer used judgement". Recompute with and without the exclusion, or propagate the uncertainty, and pick the option that reports what the recomputation shows — including the fact that an exclusion was made.',
      importantNote: 'A single field report can be decisive or negligible, and which one it is depends entirely on the likelihood ratio, not on the count. Multiply the prior odds by the ratio of how probable the report is with and without the defect; that number, not the word "anecdote", decides whether the duty to investigate has attached.',
    },
  ],
  keyTakeaways: [
    'Public health and safety is ALWAYS the highest priority — above profit, client wishes, and employer directives.',
    'Disclose conflicts of interest to all affected parties; refuse work where objectivity is compromised.',
    'Report safety violations through proper channels; retaliation protection exists but depends on the statute and the jurisdiction, so never treat it as automatic.',
    'Accept work only in areas of competence; seek assistance when needed.',
    'Document ethical concerns and recommendations to protect your professional record.',
    'Write each duty as a conjunction of conditions: the duty to act needs a hazard, knowledge, competence and an unresolved condition — and an instruction from a superior is not one of the four.',
    'Score competing actions with the rung weights 16, 8, 4, 2, 1: one public-safety violation outweighs every lower consideration combined.',
    'A risk matrix multiplies ordinal ranks, not quantities; screen with it, but decide on expected loss, reliability index or computed exposure.',
    'Materiality is a ratio — benefit over fee, holding over total, client over revenue — compared with a stated threshold, and disclosure is owed on the conflict itself regardless of the ratio.',
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

Most jurisdictions require **continuing professional development**, measured in professional development hours (PDH), to maintain a PE license. A common pattern is 15 hours a year, frequently expressed as 30 hours per two-year renewal cycle — but the number, the length of the cycle, whether surplus hours may be carried forward, how large any carry-over cap is, and which subject-matter components are mandatory all differ by jurisdiction. Read the rule that applies to you rather than a general figure, and note the commonest arithmetic trap: a per-cycle total and a per-year rate are different numbers. Section 8 of this chapter works the ledger arithmetic in full.

Activities that commonly earn credit include:
- Technical courses in your specialty
- Ethics training, or a state laws-and-rules course (often mandatory, and often satisfied only by that state's own course)
- Attendance at professional conferences
- Teaching or publishing technical content

Failure to meet CE requirements can result in license **suspension or revocation**, and it is one of the more common grounds for disciplinary action in practice.

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
    {
      id: 'lic-months-arithmetic',
      title: '5. The Path, Counted in Months',
      content: `## 5.1 Four gates and a disqualifier

Section 3 described the licensure ladder in words. Written as a predicate — the
same discipline the codes chapter applies to duties — eligibility for a licence
is a conjunction:

$$G_{\\mathrm{PE}} = E \\wedge X_{\\mathrm{FE}} \\wedge P \\wedge X_{\\mathrm{PE}} \\wedge \\lnot B$$

where **E** is the education requirement, **X_FE** the fundamentals examination,
**P** the qualifying experience, **X_PE** the principles and practice
examination, and **B** a disqualifying record. Five Boolean conditions generate

$$N_{\\mathrm{rows}} = 2^{5} = 32$$

combinations, of which exactly one grants a licence. Negating gives the complete
list of reasons an application fails:

$$\\lnot G_{\\mathrm{PE}} = \\lnot E \\vee \\lnot X_{\\mathrm{FE}} \\vee \\lnot P \\vee \\lnot X_{\\mathrm{PE}} \\vee B$$

The value of writing it out is that it exposes the distinction candidates most
often blur. Passing an examination sets one conjunct true; it does not make the
conjunction true. "I passed the PE exam" and "I am a PE" are different
statements, and in most jurisdictions there is a period during which the first
is true and the second is not, because the experience has still to be verified.
The ordering of the conjuncts is also freer than it looks: many boards now allow
the examinations to be attempted before the experience is complete, so the
sequence in which the conjuncts become true varies while the requirement that
all of them do never does.

## 5.2 Four years is a credited count, not a calendar

The experience requirement is stated in years, which invites the mistake of
reading it off a calendar. What a board counts is **credited** months of
qualifying experience, and the credit for a calendar month depends on what was
done in it and at what fraction of full time:

$$M = \\sum_{i} f_{i} \\, m_{i} + M_{\\mathrm{deg}}$$

where \`m_i\` is a run of calendar months, \`f_i\` the fraction of full time worked
in that run, and \`M_deg\` any lump credit the board allows for an advanced
degree. Eligibility arrives when

$$M \\ge M_{\\mathrm{req}}$$

and for a single uninterrupted employment fraction the calendar date follows
directly:

$$t^{\\star} = \\frac{M_{\\mathrm{req}} - M_{\\mathrm{deg}}}{f}$$

Every number in this section is a **stated parameter**. Boards differ on the
requirement itself, on whether part-time work is credited pro rata at all, on
whether graduate study earns a credit and how much, and on what counts as
qualifying in the first place. The arithmetic is transferable; the inputs must
come from the board you are applying to.

![Credited months of qualifying experience against elapsed months since the degree, for three employment histories: full time under a licensee crediting a month per month, six-tenths time crediting 0.6 a month, and full time with a twelve-month lump credit for an accredited master's degree. A dashed horizontal line marks a stated 48-month target, and the three crossings at 36, 48 and 80 months are the eligibility dates the lesson computes.](/courses/fe-ee/figures/eth2-experience-credit.svg)

### Worked example 5.1 — three routes to the same target

A board requires 48 credited months and allows a 12-month credit for an
accredited master's degree. Compute the elapsed time to eligibility for a
graduate working full time, for one working at six-tenths of full time, and for
one who holds the master's and works full time.

Full time gives one credited month per calendar month, so eligibility arrives at
48 months. At six-tenths:

$$\\frac{48}{0.6} = 80$$

eighty calendar months — six years and eight months for a requirement that
reads "four years". With the degree credit:

$$48 - 12 = 36$$

thirty-six months. The spread between the fastest and slowest of the three
routes is 44 months, all of it produced by inputs that never appear in the
sentence "four years of experience".

### Worked example 5.2 — a mixed employment history

An engineer works 18 months full time under a licensee, then moves to a
half-time arrangement. When does she reach the same 48-month target, and what
is the total elapsed time?

Credited months at the point of the change:

$$18 \\times 1.0 + 30 \\times 0.5 = 33$$

after a further 30 calendar months, so 33 credited months at an elapsed 48. The
shortfall is

$$48 - 33 = 15$$

credited months, which at half time takes

$$\\frac{15}{0.5} = 30$$

more calendar months, for a total elapsed time of

$$48 + 30 = 78$$

months. Verified independently by accumulating month by month — adding 1.0 for
each of the first 18 months and 0.5 thereafter, the running total first reaches
48 in month 78 — which is the check worth doing, because the closed-form route
above quietly assumes the fraction never changes again.

$$78 = 6 \\times 12 + 6$$

Six and a half years.

### Worked example 5.3 — progressive responsibility, weighted

Boards ask for experience that is **progressive**, and several discount work
that does not exercise engineering judgement. Model that with a weight:

$$M_{\\mathrm{cred}} = \\sum_{i} w_{i} \\, m_{i}$$

Suppose a board's stated policy credits drafting and routine testing at half
weight and independent design work at full weight, and an engineer's first 36
months break down as 14 months of the former and 22 of the latter.

$$0.5 \\times 14 + 1.0 \\times 22 = 29$$

Twenty-nine credited months from thirty-six elapsed. The engineer who assumed
the calendar was the count is seven months behind where she thought she was, and
will discover it at application rather than in time to do anything about it.
Keeping a contemporaneous record of what each period of work actually involved
is not administrative tidiness; it is the evidence on which the credit is
granted.

## 5.3 What the intermediate credential is, and is not

Passing the fundamentals examination earns a credential whose name varies —
Engineer Intern or Engineer-in-Training, depending on the jurisdiction. Written
against the predicate of section 5.1, it sets \`X_FE\` true and nothing else.
Three consequences follow, and all three are examinable:

| Statement | True? | Why |
|---|---|---|
| The credential lets me work on engineering projects | Yes | Under the direction of a licensee, or within an applicable exemption |
| The credential lets me seal documents | No | Sealing requires a licence and responsible charge |
| The credential lets me offer engineering services to the public | No | That is the activity a licence exists to gate |
| The credential is recognised in other states | Usually, with verification | Boards generally accept a passed examination; the credential itself is issued by a board |
| The credential expires if I do not proceed | Depends on the board | Some jurisdictions attach a time limit; many do not |

The last row is the one worth checking early rather than late. Where a limit
exists it is measured in years, and an engineer who spends a decade in a role
that does not accrue qualifying experience can find the examination result no
longer usable.`,
      examTip: 'Convert every licensure timeline question into credited months before doing anything else. Multiply each run of calendar months by its employment fraction and its responsibility weight, add any stated degree credit, and compare with the stated requirement. The answer choices will include the number you get by reading the calendar instead, and it will be wrong.',
      importantNote: 'Every threshold in this section — 48 months, a 12-month degree credit, a half-weight for routine work — is a parameter stated in the problem, not a universal rule. Jurisdictions differ on the requirement, on pro-rata part-time credit, on graduate-degree credit and on what qualifies at all. Learn the arithmetic; read the board rule for the inputs.',
    },
    {
      id: 'lic-exam-arithmetic',
      title: '6. The Examination, and the Arithmetic of Sitting It',
      content: `## 6.1 The clock is a budget, and it is fully committed on arrival

In its current computer-based format the FE presents 110 questions in 5 hours
and 20 minutes of examination time, inside a longer appointment that also covers
the tutorial and a scheduled break. Confirm the specification before you sit,
because NCEES revises it — but do the arithmetic on whatever the current numbers
are, because the arithmetic is the part that decides how the day goes.

The even pace is

$$t_{\\mathrm{even}} = \\frac{T}{N}$$

$$\\frac{320}{110} = 2.9091$$

minutes a question. That number is the whole strategy in one figure: there is no
slack in it. A budget with no slack means every minute spent above the average on
one question is taken from another question, and the account starts empty.

![Cumulative questions completed against elapsed examination minutes for three paces. The straight blue line is the even pace of 2.909 minutes a question that exactly consumes the 320-minute budget. The orange trajectory spends 4.00 minutes on each of the first 30 questions and must then run at 2.50 for the remaining 80. The dashed green trajectory spends 4.00 minutes on 14 questions and 2.75 on the rest, which exhausts the clock exactly.](/courses/fe-ee/figures/eth2-exam-pace.svg)

### Worked example 6.1 — how many slow questions can you afford?

Suppose you can comfortably work at 2.75 minutes a question on material you know
well, and a hard question takes 4.00. How many hard questions fit?

$$4.00 k + 2.75 (N - k) = T$$

$$k = \\frac{T - 2.75 N}{4.00 - 2.75}$$

$$2.75 \\times 110 = 302.5$$

$$320 - 302.5 = 17.5$$

$$\\frac{17.5}{1.25} = 14$$

Fourteen. Not fourteen per cent — fourteen questions out of 110. And if the rest
were to run at the even pace of 2.909 rather than at 2.75, the numerator becomes

$$2.9091 \\times 110 = 320.0$$

and the answer is zero: at the even pace there is no room for a single slow
question. That is the arithmetic behind the standard advice to flag and move on,
and it is worth doing once with your own numbers, because the conclusion is
sharper than the advice sounds.

### Worked example 6.2 — recovering from a slow start

A candidate spends 4.00 minutes on each of the first 30 questions. What pace does
the rest of the paper require?

$$30 \\times 4.00 = 120$$

$$320 - 120 = 200$$

$$\\frac{200}{80} = 2.5$$

Two and a half minutes a question for the remaining 80 — a pace 14 per cent
faster than the even pace, sustained for two-thirds of the paper, entered while
already behind. The recovery is arithmetically possible and psychologically
punishing, which is why the pacing decision has to be made in the first hour
rather than discovered in the fourth.

## 6.2 Scoring, and why a blank answer is strictly worse

The examination is scored on the number of correct answers; an unanswered
question and a wrong one score identically. That single fact has a numerical
consequence worth computing rather than merely accepting.

If you know \`n_k\` answers outright and guess the remaining \`n_g\` at random from
\`c\` choices, the expected score is

$$\\mathbb{E}[X] = n_{k} + \\frac{n_{g}}{c}$$

and, since the guesses are independent Bernoulli trials with probability
\`p = 1/c\`:

$$\\sigma^{2} = n_{g} \\, p \\, (1 - p)$$

### Worked example 6.3 — what guessing is worth

A candidate is confident of 62 answers and guesses the remaining 48 from four
choices.

$$\\frac{48}{4} = 12$$

$$62 + 12 = 74$$

$$48 \\times 0.25 \\times 0.75 = 9$$

$$\\sigma = 3$$

Twelve marks in expectation with a standard deviation of 3, so roughly 74 plus
or minus 6 at two standard deviations. Two consequences:

- **Never leave a question blank.** A blank scores zero with certainty; a guess
  scores 0.25 in expectation. Over 48 questions that difference is 12 marks, and
  12 marks is not a rounding error on any scale.
- **Eliminating one option is worth a great deal.** Guessing from three rather
  than four choices raises the expectation from 12 to 16, because \`48/3 = 16\`.
  Partial knowledge that does not reach an answer still has cash value.

## 6.3 Attempts, windows and the probability of getting through

Examination policy limits how often the paper may be attempted in a period —
under the current NCEES policy, once in each testing window and no more than
three times in a rolling twelve months. Check the policy in force when you
apply. What the limit means for planning is a probability question.

If attempts were independent with per-attempt pass probability \`p\` the chance of
passing within \`a\` attempts is the familiar complement:

$$P_{a} = 1 - (1 - p)^{a}$$

### Worked example 6.4 — three attempts in a year

Take a hypothetical per-attempt probability of 0.62 — a stated assumption, not a
published rate — and three permitted attempts.

$$1 - 0.38^{3} = 0.9451$$

$$0.38 \\times 0.38 \\times 0.38 = 0.054872$$

so about 94.5 per cent within the year. The number is instructive but the model
is not quite right, and saying why is the more valuable exercise. Attempts are
**not** independent: a candidate who fails learns what to study, so the second
attempt has a higher probability than the first, which makes the true figure
better than 94.5 per cent. On the other hand a candidate who fails through
insufficient preparation and does not change anything has an unchanged
probability, which makes it exactly 94.5. The model is a floor for the diligent
and an accurate forecast for everyone else, and knowing which of those you are
is the point.

| Planning question | The quantity to compute | Common error |
|---|---|---|
| When can I sit? | Board eligibility date from credited months | Reading the calendar rather than the credit |
| How fast must I work? | Total time divided by question count | Assuming there is slack in the budget |
| Should I guess? | Expected marks from random selection | Treating a blank as safer than a guess |
| How many attempts do I have? | Board and NCEES policy in force | Assuming a national or permanent rule |`,
      examTip: 'Pace questions and scoring questions are both one-line arithmetic. Divide the total examination time by the number of questions for the even pace; divide the number of guesses by the number of options for the expected gain. If a question asks how many hard questions you can afford, solve the linear equation in the number of slow ones — the answer is almost always smaller than candidates expect.',
      importantNote: 'The examination format, the retake policy and the scoring rule are all set by NCEES and revised from time to time. The figures used here describe the current computer-based format; verify them against the specification in force when you apply, and carry the method rather than the numbers.',
    },
    {
      id: 'lic-seal-responsible-charge',
      title: '7. Sealing, Responsible Charge, and the Limits of Checking',
      content: `## 7.1 The seal, written as a conjunction

Section 3.3 stated what applying a seal asserts. As a predicate, sealing is
lawful only when

$$K_{\\mathrm{seal}} = L \\wedge C \\wedge V \\wedge A$$

with **L** a current licence in the jurisdiction where the document will be used,
**C** responsible charge of the work, **V** personal review of what is being
sealed, and **A** acceptance of responsibility for it. Negate it and the four
ways sealing becomes an offence appear as a list:

$$\\lnot K_{\\mathrm{seal}} = \\lnot L \\vee \\lnot C \\vee \\lnot V \\vee \\lnot A$$

| Missing conjunct | The situation | What it is called |
|---|---|---|
| L | Sealing for a jurisdiction where you are not licensed | Unlicensed practice |
| C | Sealing work you did not direct | Plan stamping |
| V | Sealing work you directed but did not read | Negligence, and often plan stamping too |
| A | Sealing while disclaiming responsibility in a side letter | An attempt to have the seal without its meaning |

The third and fourth rows are the ones that catch experienced engineers.
Reviewing is necessary and not sufficient; disclaiming is not available at all.
A seal is an assertion of responsibility, and a document that seals and
disclaims in the same breath simply asserts the responsibility, because the seal
is what the public authority relies on.

## 7.2 Supervision, counted

Responsible charge scales badly, which is why firms and boards think in ratios.
If a licensee can be in responsible charge of at most \`r\` non-licensed engineers'
work, then a group of \`n_sup\` such engineers needs

$$n_{\\mathrm{sup}} \\le r \\, n_{\\mathrm{PE}}$$

$$n_{\\mathrm{PE}} \\ge \\frac{n_{\\mathrm{sup}}}{r}$$

licensees. The ratio is a policy input — some jurisdictions state one, many do
not, and firms adopt their own — so treat any number in a question as given.

### Worked example 7.1 — how many licensees does the group need?

A design group has 46 non-licensed engineers and operates under an internal
policy of at most 6 per licensee in responsible charge.

$$\\frac{46}{6} = 7.67$$

Round **up**, always, because the constraint is an upper bound on what each
licensee may carry:

$$8 \\times 6 = 48$$

Eight licensees provide capacity for 48, which covers 46. Rounding down to
seven would give capacity for 42 and leave four engineers' work outside anyone's
responsible charge — a shortfall of four that no amount of goodwill converts
into compliance.

## 7.3 What a complete check actually buys

The most seductive misreading of responsible charge is that it means checking
everything. Checking is a filter, and filters have a pass-through rate. Suppose a
package contains \`n\` independent calculation items, each carrying an error with
probability \`p\` — and that reviewing an item catches an error in it with
probability \`d\`. Reviewing a fraction \`f\` of the items leaves each one carrying an
undetected error with probability

$$q(f) = p \\, (1 - f d)$$

and the package ships with at least one undetected error with probability

$$P_{\\mathrm{escape}} = 1 - (1 - q)^{n}$$

![Probability that at least one error is sealed, plotted against the percentage of calculations independently reviewed, for packages of 60, 240 and 600 items. Each item carries an error with probability 0.02 and review catches a reviewed error with probability 0.90, so the curve falls from near certainty at no review to a residual value at full review that grows with the size of the package.](/courses/fe-ee/figures/eth2-review-coverage.svg)

### Worked example 7.2 — reviewing everything is not the same as directing anything

Take a package of 240 items with a per-item error probability of 0.02 and a
detection probability of 0.90 on review. With no review at all the probability
that at least one error ships is 0.9922. With every item reviewed:

$$0.02 \\times 0.10 = 0.002$$

and the probability that at least one still ships is 0.3815 — better than three
chances in eight. The expected counts make the same point more starkly:

$$240 \\times 0.02 = 4.8$$

$$240 \\times 0.002 = 0.48$$

expected errors falling from 4.8 to 0.48. A complete independent check divided
the expected number of escaped errors by ten and still left the package more
likely than not to be clean only by a margin of three to five.

The professional conclusion is the one the phrase **responsible charge** was
written to carry. Checking operates on \`d\` and on \`f\` and both are bounded — you
cannot review more than everything, and no reviewer catches everything. Being in
responsible charge operates on \`p\` itself: it means the engineering decisions
were yours, made once and made correctly, rather than made by someone else and
inspected afterwards. That is why a board asks whether you **directed** the work
and not whether you **checked** it.

### Worked example 7.3 — what error rate would a full review need?

Keep \`n = 240\` and \`d = 0.90\` and ask what per-item error rate would be needed for
a fully reviewed package to ship clean with 95 per cent probability. Require

$$(1 - q)^{240} \\ge 0.95$$

$$q \\le 1 - 0.95^{1/240}$$

which evaluates to \`q ≤ 2.137 x 10^-4\`. With full review \`q = 0.10 p\` so

$$\\frac{0.0002137}{0.10} = 0.002137$$

and the per-item error rate must satisfy \`p ≤ 2.137 x 10^-3\`. Compared with the
0.02 assumed above:

$$\\frac{0.02}{0.002137} = 9.36$$

The error rate of the work as produced must fall by a factor of about nine
before a complete check delivers a 95 per cent clean package. No feasible
increase in checking gets there, because checking is already at its maximum in
this calculation. The improvement has to come from how the work is done —
standard details, checked templates, calculation software with the assumptions
built in, and an engineer directing the design rather than auditing it. Which is
the same conclusion as the previous example, now with a number attached to how
far short inspection falls.

## 7.4 Where a seal is and is not required

| Situation | Seal required? | Governing consideration |
|---|---|---|
| Drawings submitted to a building department | Yes | Documents relied on by a public authority |
| An internal study for your employer's own product | Usually not | Industrial exemption, where it applies |
| A report to a client recommending a design | Commonly yes | Engineering services offered to another party |
| A calculation package supporting sealed drawings | Often yes | It is part of the sealed submission |
| Work for a federal agency under federal rules | Depends | Federal requirements govern, not the state's |
| A sketch given to a contractor to build from | Yes, in substance | The form does not change what it is |

The last row is the one that costs engineers their licences. Whether a document
requires a seal turns on **what it is used for**, not on how formal it looks. A
marked-up drawing sent by message and built from is engineering work relied on by
another party, and calling it a sketch does not change which side of the line it
falls on.`,
      examTip: 'Sealing questions reduce to the four conjuncts: licensed here, in responsible charge, personally reviewed, accepting responsibility. If any one is missing the answer is refuse — and note that reviewing the work cures only the third, never the second. Supervision ratios always round the number of licensees UP.',
      importantNote: 'Responsible charge is about who made the engineering decisions, not about who checked them afterwards. The review-coverage arithmetic shows why: even a complete independent check of a 240-item package leaves a 38 per cent chance that an error is sealed, because checking can only reduce errors that have already been made.',
    },
    {
      id: 'lic-keeping-licence',
      title: '8. Keeping the Licence: Hours, Cycles, Comity and Discipline',
      content: `## 8.1 The professional development ledger

Continuing professional development is bookkeeping with a deadline, and it is
bookkeeping that a surprising number of licensees get wrong. Model a renewal
cycle as a ledger. With \`E_k\` hours earned in cycle \`k\` — a requirement \`Q\` per
cycle and carry-over capped at \`C_max\` — the hours available in the cycle are

$$A_{k} = E_{k} + c_{k-1}$$

the hours carried into the next cycle are

$$c_{k} = \\min\\bigl( \\max(A_{k} - Q,\\, 0),\\; C_{\\max} \\bigr)$$

the hours simply lost are

$$w_{k} = \\max(A_{k} - Q,\\, 0) - c_{k}$$

and any shortfall is

$$d_{k} = \\max(Q - A_{k},\\, 0)$$

Every quantity in that system is a stated parameter. Jurisdictions differ on the
requirement, on the cycle length, on whether carry-over is permitted at all, on
the cap, on how many cycles a carry may survive, and on which subject-matter
components are mandatory. Several require an ethics or a laws-and-rules
component that only that jurisdiction's own course satisfies.

![Six biennial renewal cycles drawn as stacked bars, showing hours earned in each cycle and hours carried into it, against a dashed line at the 30-hour requirement. The available total is printed above each bar. The final cycle has 54 hours available, spends 30, carries the maximum 15 forward, and loses the remaining 9 entirely.](/courses/fe-ee/figures/eth2-pdh-ledger.svg)

### Worked example 8.1 — six cycles, one ledger

A licensee is subject to a two-year cycle requiring 30 hours, with carry-over
capped at 15 hours and usable only in the immediately following cycle. Hours
earned in six successive cycles are 38, 22, 41, 30, 26 and 47.

| Cycle | Earned | Carried in | Available | Spent | Carried out | Lost |
|---|---|---|---|---|---|---|
| 1 | 38 | 0 | 38 | 30 | 8 | 0 |
| 2 | 22 | 8 | 30 | 30 | 0 | 0 |
| 3 | 41 | 0 | 41 | 30 | 11 | 0 |
| 4 | 30 | 11 | 41 | 30 | 11 | 0 |
| 5 | 26 | 11 | 37 | 30 | 7 | 0 |
| 6 | 47 | 7 | 54 | 30 | 15 | 9 |

Two rows deserve attention. Cycle 2 earned only 22 hours and would have been
eight short:

$$22 + 8 = 30$$

The carry-over from cycle 1 covered it exactly. Cycle 6 earned 47 and carried in
7:

$$47 + 7 = 54$$

$$54 - 30 = 24$$

$$24 - 15 = 9$$

Nine hours were earned, paid for, sat through — and credited nowhere, because
the surplus above the requirement exceeded the carry-over cap. Check the ledger
by conservation: everything earned is either spent, still carried, or lost.

$$38 + 22 + 41 + 30 + 26 + 47 = 204$$

$$6 \\times 30 = 180$$

$$204 - 180 - 15 = 9$$

which reproduces the nine lost hours from the totals rather than from the
period-by-period recursion. That is the check worth doing on any ledger: a
running balance that agrees with itself but not with the totals has an error in
it.

## 8.2 The shape of a cap

Carry-over is a saturating function, and drawing it makes the planning rule
obvious.

![Hours carried forward and hours wasted, plotted against hours earned in a single cycle, for a 30-hour requirement with a 15-hour carry-over cap. Below 30 there is a shortfall falling linearly to zero; between 30 and 45 the surplus is carried in full; above 45 the carry saturates at 15 and every further hour is wasted. The corner sits at exactly 45.](/courses/fe-ee/figures/eth2-carryover-cap.svg)

The corner is at

$$Q + C_{\\max} = 30 + 15 = 45$$

### Worked example 8.2 — how many hours should you actually earn?

Below 30 you are short. Between 30 and 45 every hour counts, either now or next
cycle. Above 45 the marginal hour is worth nothing. So the efficient target is
45 hours a cycle, and the efficiency of earning 54 is

$$\\frac{54 - 9}{54} = 0.8333$$

Five-sixths. Earning 70 in a cycle would be worse still:

$$70 - 45 = 25$$

$$\\frac{70 - 25}{70} = 0.6429$$

The practical rule this yields is unglamorous and worth having: **spread the
hours across the cycle rather than concentrating them.** A licensee who earns 20
in the first year and 25 in the second lands at 45 with nothing wasted; one who
earns 5 and then 49 lands at 54 with 9 hours thrown away and a scramble in the
final months. The requirement was met either way, and one of them paid a third
more for it.

## 8.3 Comity saves the examination, not necessarily the hours

Comity means a second board accepts your examinations and credentials rather
than making you repeat them. It does not mean your obligations merge. Each
licence is a separate relationship with a separate board, each has its own
renewal date and fee, and each has its own development requirement.

Whether the hours stack depends on whether each board accepts development earned
for another. Under maximum acceptance the burden is the largest single general
requirement plus the state-specific components that only their own board
recognises:

$$H_{\\mathrm{overlap}} = \\max_{i} Q_{i} + \\sum_{i} m_{i}$$

Under no acceptance at all it is the whole sum:

$$H_{\\mathrm{stacked}} = \\sum_{i} (Q_{i} + m_{i})$$

![Annual development hours required as licences in more jurisdictions are added, computed two ways. The upper line stacks every requirement; the lower line assumes general hours count everywhere and only state-specific components add. Four licences with annualised general requirements of 15, 12, 15 and 8 hours and state-specific components of 2, 1, 0 and 1 give 54 hours a year stacked against 19 with full overlap.](/courses/fe-ee/figures/eth2-comity-burden.svg)

### Worked example 8.3 — four licences, two accounting rules

Annualised general requirements of 15, 12, 15 and 8 hours, with state-specific
components of 2, 1, 0 and 1.

$$15 + 12 + 15 + 8 = 50$$

$$2 + 1 + 0 + 1 = 4$$

$$50 + 4 = 54$$

if nothing counts twice, against

$$15 + 4 = 19$$

if general hours count everywhere. The difference is

$$54 - 19 = 35$$

hours a year — nearly a full working week, and entirely a question of
administrative rules rather than of engineering. The practical answer sits
between the two: most boards accept general development earned elsewhere, most
also impose something of their own, and the only way to know your number is to
read four rules rather than one. The examinable point is that comity removes the
examination and nothing else.

## 8.4 Discipline, and the arithmetic of a shortcut

Boards discipline on a ladder, and the rungs are proportionate to the conduct
rather than to the harm that happened to result.

| Sanction | Typically applied to | Practical effect |
|---|---|---|
| Letter of concern or reprimand | A first, non-harmful lapse | On the record; often public |
| Fine or civil penalty | Rule violations with a clear standard | Financial, plus the record |
| Mandated education or supervision | Competence-related failures | Practice continues under conditions |
| Probation | Conduct requiring monitoring | Practice continues under scrutiny |
| Suspension | Serious violations | Practice stops for a stated period |
| Revocation | Fraud, gross negligence, repeated violations | Licence gone; reinstatement rarely automatic |

The published grounds are consistent across jurisdictions in substance: fraud in
obtaining the licence, gross negligence or incompetence, violating the rules of
professional conduct, certain criminal convictions, aiding unlicensed practice,
and failing to meet the development requirement. Note that the last of those is
one of the most common in practice, which is the reason section 8.1 spends so
long on bookkeeping.

### Worked example 8.4 — what a shortcut is worth

An engineer is offered 400 per drawing set to seal work he has not directed, at
about 15 sets a year.

$$15 \\times 400 = 6000$$

Six thousand a year. Set that against a 12-month suspension for an engineer who
bills 1,850 hours a year at 165:

$$1850 \\times 165 = 305250$$

The break-even probability of being caught is

$$\\frac{6000}{305250} = 0.0197$$

Under two per cent. If there is even a one-in-fifty chance that a sealed set is
ever traced back, the arrangement loses money — and that calculation ignores the
reinstatement process, the disclosure obligation to every other board where he
is licensed, the professional liability exposure on work he never reviewed, and
the fact that the record is public and permanent. The structure is identical to
the gift arithmetic in the codes chapter, and so is the conclusion: **the line
below which it becomes profitable is not the line below which it becomes
permitted.**

## Problem Set A — eligibility, hours and pace

**A1.** A board requires 48 credited months and gives no degree credit. An
engineer works 10 months full time, 24 months at 0.75 of full time, and then
returns to full time. When does she become eligible, in elapsed months?

*Answer.* Credited after 34 elapsed months: \`10 x 1.0 + 24 x 0.75 = 28\`. The
shortfall is \`48 - 28 = 20\` credited months, which at full time takes 20 more
calendar months, so \`34 + 20 = 54\` elapsed months. Four and a half calendar
years for a four-year requirement.

**A2.** The same board credits routine testing at half weight. Of the first 34
months above, 12 were routine testing at 0.75 of full time. Recompute the
credited months at the 34-month point.

*Answer.* The 12 routine months carry weight 0.5 and fraction 0.75, so they
credit \`12 x 0.75 x 0.5 = 4.5\` instead of 9. Total becomes \`28 - 9 + 4.5 = 23.5\`
credited months. The shortfall is now \`48 - 23.5 = 24.5\` months at full time, so
eligibility moves to \`34 + 24.5 = 58.5\` elapsed months. A weighting rule buried
in a board's policy has cost four and a half months.

**A3.** A two-year cycle requires 30 hours with a 12-hour carry-over cap. A
licensee earns 44, 19, 31 and 50 hours over four cycles. Produce the ledger and
state the hours lost.

*Answer.* Cycle 1: available 44, spend 30, surplus 14, carry \`min(14,12) = 12\` and
lose 2. Cycle 2: available \`19 + 12 = 31\` — spend 30, carry 1. Cycle 3: available
\`31 + 1 = 32\` — spend 30, carry 2. Cycle 4: available \`50 + 2 = 52\` — spend 30,
surplus 22, carry 12, lose 10. Total lost 12 hours. Check by totals: earned
\`44 + 19 + 31 + 50 = 144\` — required \`4 x 30 = 120\` — carried at the end 12, so
lost \`144 - 120 - 12 = 12\`. The two routes agree.

**A4.** An examination presents 80 questions in 240 minutes. Compute the even
pace, and the number of questions you can afford at 4.0 minutes if the rest run
at 2.6.

*Answer.* Even pace \`240/80 = 3.0\` minutes. For the mix,
\`4.0k + 2.6(80 - k) = 240\` — so \`1.4k = 240 - 208 = 32\` and \`k = 22.86\` — meaning
22 questions. Note how much more room a 2.6-minute working pace buys than the
2.75 of section 6.1 did on the FE budget — the affordable number of slow
questions is extremely sensitive to the pace you can hold on the easy ones.

**A5.** A candidate is sure of 71 answers, can eliminate two options on 18
questions, and has no idea on the remaining 21. Compute the expected score from
four choices.

*Answer.* \`18/2 = 9\` and \`21/4 = 5.25\` — so \`71 + 9 + 5.25 = 85.25\` expected.
Compare with leaving the 21 blank: \`71 + 9 = 80\`. Guessing the hopeless 21 is
worth 5.25 marks and costs nothing, which is the whole argument.

**A6.** A licensee holds three licences with annualised general requirements of
15, 15 and 10 hours and state-specific components of 3, 0 and 2. Compute the
burden under both accounting rules and the gap.

*Answer.* Stacked: \`15 + 15 + 10 = 40\` general plus \`3 + 0 + 2 = 5\` specific,
so 45 hours. Overlapping: \`15 + 5 = 20\` hours. The gap is \`45 - 20 = 25\` hours a
year. As always, the truth is between, and it is settled by three rule books
rather than by arithmetic.

## Problem Set B — sealing, responsible charge and discipline

**B1.** A licensed engineer in State A is asked to seal drawings for a project in
State B, where he is not licensed. He directed the work, reviewed it fully, and
accepts responsibility. May he seal?

*Answer.* No. Three of the four conjuncts of section 7.1 are satisfied and the
first is not: the licence must be current in the jurisdiction where the document
will be used. Responsible charge does not substitute for jurisdiction. The routes
available are comity licensure in State B or association with a licensee there
who genuinely takes the work into responsible charge — which means directing it,
not receiving it.

**B2.** A firm has 33 non-licensed engineers and a policy of at most 5 per
licensee in responsible charge. It employs 6 licensees. Is it compliant, and what
is the shortfall?

*Answer.* Capacity is \`6 x 5 = 30\` against 33 engineers, so it is short by 3.
The required number is \`33/5 = 6.6\` rounded up to 7. Rounding down is the error
the question is testing: the ratio is an upper bound per licensee, so any
fraction demands another licensee.

**B3.** A calculation package has 90 items with a per-item error probability of
0.03. Review catches 85 per cent of the errors it looks at. Compute the
probability that at least one error ships with no review and with full review.

*Answer.* With no review each item ships bad with probability 0.03, so
\`1 - 0.97^90 = 0.9355\`. With full review \`q = 0.03 x 0.15 = 0.0045\` so
\`1 - 0.9955^90 = 0.3336\`. Expected escaped errors fall from \`90 x 0.03 = 2.7\` to
\`90 x 0.0045 = 0.405\`. A complete check leaves a one-in-three chance of an error
inside a sealed package — which is why the seal asserts responsible charge and
not diligence.

**B4.** An engineer's renewal falls due and she is 6 hours short. She is offered
a course that would provide 8 hours but is dated three weeks after the cycle
closes. What is the position?

*Answer.* Hours earned after the cycle closes count in the next cycle, not the
one that has ended, so the shortfall stands and the requirement was not met.
Failure to meet the development requirement is itself a ground for disciplinary
action. The correct actions are to notify the board rather than to certify
compliance falsely — a false attestation converts an administrative failure into
a dishonesty matter, which sits far higher on the sanction ladder — and to find
qualifying hours dated inside the cycle if any legitimately exist.

**B5.** A licensee is offered 500 per set to seal 20 sets a year of work he will
not direct. He bills 2,100 hours a year at 140. Compute the break-even
probability of detection and comment.

*Answer.* Gain \`20 x 500 = 10000\` a year. A one-year suspension costs
\`2100 x 140 = 294000\`. Break-even \`10000/294000 = 0.034\` — about three and a half
per cent. The comment is the one that matters: the calculation is a description
of why the arrangement is also stupid, not of why it is wrong. Sealing work he
has not directed fails the second conjunct of section 7.1 whatever the odds, and
it aids unlicensed practice as a second violation.

**B6.** An engineer passed the fundamentals examination nine years ago, has
worked since in a role his board does not treat as qualifying, and now wants to
proceed. What are the two separate questions he must answer?

*Answer.* First, does his jurisdiction attach a time limit to the intermediate
credential or to the examination result — some do and many do not, and the answer
determines whether \`X_FE\` is still true. Second, how many credited months does
his work actually carry under the board's definition of qualifying experience,
which may be far fewer than nine years and may be zero. The two questions are
independent, and an affirmative answer to the first does nothing for the second.`,
      examTip: 'Continuing-education problems are ledgers: available equals earned plus carried in, spend the requirement, carry the surplus up to the cap, and lose the rest. Always check the ledger against the totals — earned minus required minus the final carry must equal the hours lost — because a recursion that agrees only with itself is the classic place an error hides.',
      importantNote: 'Every hour, cap, cycle length and ratio in this section is a parameter stated in the problem. Jurisdictions differ on the requirement, the cycle, whether carry-over exists, how large the cap is, which subject-matter components are mandatory, and whether hours earned for another board are accepted. Carry the arithmetic; read the rule for the inputs.',
    },
  ],
  keyTakeaways: [
    'FE exam passage earns an intermediate credential — Engineer Intern or Engineer-in-Training, depending on the jurisdiction — and the PE additionally requires qualifying experience, typically four years, plus the PE exam.',
    'PE stamp means personal legal responsibility; only PEs can stamp/seal drawings.',
    'Comity allows PE licensure reciprocity across states.',
    'Continuing professional development is required by most jurisdictions, but the number of hours, the length of the cycle, the carry-over rules and the mandatory subject components all differ — read the rule that applies to you rather than a general figure.',
    'Practice only within your area of competence; engage other professionals when needed.',
    'Experience is measured in credited months, not calendar months: multiply each run by its employment fraction and any responsibility weight, add stated degree credit, and compare with the board requirement.',
    'Sealing requires all four of a current licence in that jurisdiction, responsible charge, personal review, and acceptance of responsibility; reviewing the work cures only the third.',
    'Responsible charge changes the error rate of the work; checking only filters it, and even a complete check of a 240-item package leaves a 38 per cent chance an error is sealed.',
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

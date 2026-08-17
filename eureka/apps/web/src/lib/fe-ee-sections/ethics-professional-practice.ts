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

$$\\beta' = \\frac{500}{\\sqrt{70^{2} + 120^{2}}} = \\frac{500}{138.9244} = 3.5991$$

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
    {
      id: 'liab-risk-quantified',
      title: '5. Risk Assessment: Probability, Consequence, and the Arithmetic Behind "Reasonable"',
      content: `## 5.1 What the rest of this chapter is, and what it is not

Sections 1 to 4 gave professional liability its shape: the four elements, the
standard of care, the two clocks, the safety framework that sits underneath all
of it. The sections that follow put numbers on that shape, because the modern
standard of care is argued with arithmetic far more often than with adjectives.
An engineer who says a design is "safe enough" will be asked how safe, measured
how, against what tolerable level. An engineer who says an insurance programme is
"adequate" will be asked adequate for what loss. Both questions have numeric
answers, and both are examinable.

Four warnings, all of which matter more here than in any other chapter of this
course.

**This is exam-preparation material, not legal advice.** Liability rules are set
by state statute and state case law and they differ, sometimes sharply, from one
jurisdiction to the next. What follows is the framework the FE exam and ordinary
professional practice expect you to recognise, together with the arithmetic that
framework rests on. For any real dispute the governing rule is the one in force
where the project sits, read with counsel.

**Every fact pattern below is a hypothetical.** Names, dates, probabilities,
premiums, fee levels and loss amounts are invented for the exercise. Nothing
here is offered as an observed claim rate, an industry statistic, or the outcome
of a real case, and no case is cited.

**Where a code, a contract form or a statute is described, it is described in
summary and in our own words.** The published documents — the NCEES model rules,
the NSPE code, the standard engineering contract families, your own state board's
rules — are copyrighted expression, and none of their text is reproduced here.
When you need the operative language, read it at the source.

**The numbers are real mathematics, not decoration.** Every formula in the
remaining sections is one a practising engineer actually evaluates: expected
value under uncertainty, probability of failure from a load-and-capacity model,
redundancy arithmetic, insurance retention, apportionment of a damages award,
date differences, and discounting. Each printed result was recomputed by a route
independent of the algebra shown, and the figures were generated by a script
whose assertions repeat every claim they draw.

## 5.2 Risk is a product, not a feeling

The working definition, and the one an FE question will use, is that risk is the
probability of an unwanted event multiplied by its consequence:

$$R = p \\times C$$

The units follow the inputs. If $p$ is a probability per year and $C$ is a
dollar loss per event, $R$ is dollars per year — an expected annual loss. When
the event can recur, it is cleaner to write the frequency as a rate $\\lambda$
in events per year:

$$R_{\\text{ann}} = \\lambda C$$

Several independent hazards add, because expectation is linear whether or not
the hazards are independent:

$$R_{\\text{total}} = \\sum_{j=1}^{m} \\lambda_{j} C_{j}$$

If events arrive independently at rate $\\lambda$, the count in a window of
length $t$ is Poisson:

$$P(N = k) = \\frac{(\\lambda t)^{k} e^{-\\lambda t}}{k!}$$

so the probability of at least one event in that window is

$$P(N \\ge 1) = 1 - e^{-\\lambda t}$$

That last expression is the one that turns a small annual number into an
uncomfortable career number, and it is why "it has never happened here" is worth
so little as evidence. A hazard at 0.02 per year has a 33% chance of arriving at
least once in twenty years.

The product form also explains why a risk matrix has diagonal bands. Constant
risk is a hyperbola on frequency-against-consequence axes, so on logarithmic
axes it is a straight line of slope minus one. Two very different hazards — one
frequent and cheap, one rare and catastrophic — can sit on the same iso-risk
line, and the professional judgement that separates them is not captured by the
product alone.

![Frequency against consequence on logarithmic axes, with three iso-risk lines drawn as the hyperbolas of constant product. The hypothetical switchgear hazard of section 5.3 is marked before and after mitigation; the arrow between the two points is the reduction the retrofit buys, and both points sit at the same consequence because the retrofit changes how often the event happens, not how bad it is when it does.](/courses/fe-ee/figures/eth3-risk-frequency-consequence.svg)

| Band | Frequency, events per year | Consequence, dollars | Product, dollars per year |
|---|---|---|---|
| Frequent, minor | 2 | 5,000 | 10,000 |
| Occasional, moderate | 0.02 | 500,000 | 10,000 |
| Rare, severe | 0.001 | 10,000,000 | 10,000 |
| Rare, catastrophic | 0.001 | 100,000,000 | 100,000 |

The first three rows carry identical expected loss and are not identical
problems. A firm can absorb the first every year; the third can end the firm.
Expected value is the right starting point and the wrong stopping point, and
section 8 makes that concrete in dollars.

### Worked example 5.1 — does the retrofit earn its keep?

*Hypothetical.* A plant's medium-voltage switchgear room requires energised
racking. The firm's own model puts the rate of a serious arc-flash incident at
$\\lambda = 0.02$ per year, with an all-in consequence — injury, litigation,
downtime, replacement — of \\$4,000,000. Remote racking plus arc-resistant
enclosures would cost \\$150,000 installed, last 20 years, and cut the rate to
0.004 per year. Money costs 6% per year. Is the retrofit justified on expected
value?

Risk as found:

$$R_{\\text{ann}} = 0.02 \\times 4{,}000{,}000 = 80{,}000$$

Risk after the retrofit:

$$R'_{\\text{ann}} = 0.004 \\times 4{,}000{,}000 = 16{,}000$$

Annual benefit:

$$\\Delta R = 80{,}000 - 16{,}000 = 64{,}000$$

Annualise the capital cost with the capital-recovery factor:

$$(A/P,\\ 6\\%,\\ 20) = \\frac{i(1+i)^{n}}{(1+i)^{n}-1} = \\frac{0.06(1.06)^{20}}{(1.06)^{20}-1} = 0.087185$$

$$A = 150{,}000 \\times 0.087185 = 13{,}078$$

Benefit-cost ratio and net annual benefit:

$$\\text{BCR} = \\frac{64{,}000}{13{,}078} = 4.894$$

$$\\text{net} = 64{,}000 - 13{,}078 = 50{,}922$$

The retrofit returns close to five dollars of avoided expected loss for each
dollar of annualised cost. **The liability point is not the ratio; it is the
record.** Once this calculation exists, an engineer who advises against the
retrofit has to justify a position that his own arithmetic contradicts, and a
client who declines it after being shown the numbers has made an informed choice
that the engineer documented. Both of those change what the file looks like
years later.

### Worked example 5.2 — what perfect information would be worth

*Hypothetical.* A firm suspects that a connector used across a fleet of
installed units was mis-specified. Its engineering judgement puts the
probability that the defect is real at 0.30. If it is real and nothing is done,
the expected loss is \\$2,000,000.
Retrofitting the whole fleet costs \\$250,000
and removes the risk entirely. What is the most the firm should pay for a test
that would settle the question with certainty?

Expected cost of doing nothing:

$$E[C_{\\text{none}}] = 0.30 \\times 2{,}000{,}000 = 600{,}000$$

Expected cost of retrofitting everything, which is certain:

$$E[C_{\\text{fix}}] = 250{,}000$$

With perfect information the firm retrofits only when the defect is real:

$$E[C_{\\text{perfect}}] = 0.30 \\times 250{,}000 = 75{,}000$$

The expected value of perfect information is the difference between the best
decision without it and the expected cost with it:

$$\\text{EVPI} = 250{,}000 - 75{,}000 = 175{,}000$$

Any investigation costing less than \\$175,000 and delivering certainty is worth
buying on expected value alone. That is a large budget for a test programme, and
engineers routinely under-spend against it because the investigation cost is
visible today while the avoided loss is invisible forever.

### Worked example 5.3 — an imperfect test, and where expected value stops

*Same hypothetical, continued.* No test is perfect. Suppose the available
inspection detects a real defect with probability 0.90 and clears a sound
population with probability 0.85. It costs \\$40,000. Should the firm buy it?

First, how often does it read positive? By the law of total probability:

$$P(+) = 0.30 \\times 0.90 = 0.27$$

$$P(+ \\mid \\text{sound})P(\\text{sound}) = 0.70 \\times 0.15 = 0.105$$

$$P(+) = 0.27 + 0.105 = 0.375$$

Bayes' rule gives the two posteriors:

$$P(\\text{defect} \\mid +) = \\frac{0.27}{0.375} = 0.72$$

$$P(\\text{defect} \\mid -) = \\frac{0.03}{0.625} = 0.048$$

After a positive result the cheaper action is to retrofit, because
$0.72 \\times 2{,}000{,}000$ is 1,440,000 against a retrofit cost of 250,000.
After a negative result, the expected loss of doing nothing is

$$0.048 \\times 2{,}000{,}000 = 96{,}000$$

which is below the retrofit cost, so pure expected value says stop. The expected
cost of the test strategy before paying for the test is

$$0.375 \\times 250{,}000 + 0.625 \\times 96{,}000 = 153{,}750$$

so the expected value of this sample information is

$$\\text{EVSI} = 250{,}000 - 153{,}750 = 96{,}250$$

Buying the test at \\$40,000 is comfortably worthwhile; the all-in expected cost
becomes 193,750 against 250,000 for retrofitting blind.

**Now read the negative branch again.** Expected value told the firm to stop
after a negative test while a 4.8% chance of a real defect remains, on a
population where the realised harm is measured in injuries rather than dollars.
An engineer's obligation to public safety is not an expected-value calculation,
and no exam answer that trades a residual chance of serious harm against
\\$154,000 is the ethical answer. The correct use of this arithmetic is to
*bound* the decision — to show that further investigation is cheap relative to
the exposure — and then to let the safety obligation, not the ledger, decide what
happens next. Expected value is a tool for choosing among acceptable options,
never for making an unacceptable one acceptable.

![Expected cost of four strategies for the suspected connector defect: taking no action, retrofitting the fleet blind, buying the imperfect test first, and the unattainable benchmark of perfect information. The gap between the third and fourth bars is what test imperfection costs; the gap between the second and fourth is the expected value of perfect information.](/courses/fe-ee/figures/eth3-decision-tree-values.svg)`,
      examTip: 'Risk questions on the FE are almost always the product p × C, or the Poisson survivor 1 − e^(−λt) for "at least one event". Read the units of the answer choices first: dollars per year means you want λC, a bare probability means you want the Poisson expression. Watch for the trap that two hazards with equal expected loss are treated as equally acceptable.',
      importantNote: 'Expected value ranks acceptable options; it does not convert an unacceptable risk into an acceptable one. Where a residual probability of serious harm to the public survives the arithmetic, the safety obligation governs and the calculation only sets the budget for eliminating it.',
    },
    {
      id: 'liab-factor-of-safety',
      title: '6. The Factor of Safety Is Not a Defence: Load, Capacity, and the Overlap',
      content: `## 6.1 Two numbers that are not the same number

An engineer defending a design will reach for the factor of safety, because it
is the number on the calculation sheet. It is the ratio of capacity to demand,
either on nominal values

$$\\mathrm{FS} = \\frac{R_{n}}{S_{n}}$$

or, when both are treated as random, on means:

$$\\mathrm{FS}_{c} = \\frac{\\mu_{R}}{\\mu_{S}}$$

A claimant's expert will reach for a different number: the probability that
capacity is exceeded. Define the limit-state margin

$$g = R - S$$

so that failure is the event

$$p_{f} = P(g < 0) = P(R < S)$$

These two numbers are only loosely related, and the gap between them is where
professional exposure lives. **A factor of safety says nothing about
variability, and variability is most of the answer.** The companion treatment in
the codes-and-ethics chapter uses this same machinery to decide when a concern
is serious enough to report; here the interest is in what the numbers do to a
liability argument.

## 6.2 The overlap, and the reliability index

Failure happens where the demand density and the capacity density overlap. Read
directly, the probability of failure is an integral over that overlap. Condition
on the load taking the value $s$ and integrate:

$$p_{f} = \\int_{-\\infty}^{\\infty} f_{S}(s)\\, F_{R}(s)\\, ds$$

or condition on the capacity instead, which must give the same number:

$$p_{f} = \\int_{-\\infty}^{\\infty} f_{R}(r)\\,\\bigl[1 - F_{S}(r)\\bigr]\\, dr$$

When both variables are normal the integral has a closed form, because the
margin is then normal too:

$$\\mu_{g} = \\mu_{R} - \\mu_{S}$$

$$\\sigma_{g} = \\sqrt{\\sigma_{R}^{2} + \\sigma_{S}^{2}}$$

The **reliability index** is the number of standard deviations by which the mean
margin clears zero,

$$\\beta = \\frac{\\mu_{g}}{\\sigma_{g}} = \\frac{\\mu_{R} - \\mu_{S}}{\\sqrt{\\sigma_{R}^{2} + \\sigma_{S}^{2}}}$$

and the failure probability follows from the standard normal distribution
function:

$$p_{f} = \\Phi(-\\beta)$$

Writing the scatter as a coefficient of variation,

$$\\delta = \\frac{\\sigma}{\\mu}$$

and dividing numerator and denominator by $\\mu_{S}$ turns the index into a
statement about the factor of safety directly:

$$\\beta = \\frac{\\mathrm{FS}_{c} - 1}{\\sqrt{\\mathrm{FS}_{c}^{2}\\delta_{R}^{2} + \\delta_{S}^{2}}}$$

That single line is the whole argument of this section. The factor of safety
enters, but so do both coefficients of variation, and they enter with as much
weight.

For strictly positive quantities the lognormal form is often preferred, in which
case the index is built from medians and from logarithmic standard deviations:

$$\\zeta^{2} = \\ln\\bigl(1 + \\delta^{2}\\bigr)$$

$$\\beta_{LN} = \\frac{\\ln(\\theta_{R}/\\theta_{S})}{\\sqrt{\\zeta_{R}^{2} + \\zeta_{S}^{2}}}$$

For a coefficient of variation of 0.20 the logarithmic standard deviation is
0.1980, so the two formulations agree closely at moderate scatter and diverge in
the far tail. Which model is defensible is itself an engineering judgement that
has to be recorded.

| Central FS | Index at scatter 0.10 | Failure probability | Index at scatter 0.20 | Failure probability |
|---|---|---|---|---|
| 1.5 | 2.774 | $2.8 \\times 10^{-3}$ | 1.387 | $8.3 \\times 10^{-2}$ |
| 2.0 | 4.472 | $3.9 \\times 10^{-6}$ | 2.236 | $1.3 \\times 10^{-2}$ |
| 3.0 | 6.325 | $1.3 \\times 10^{-10}$ | 3.162 | $7.8 \\times 10^{-4}$ |

Read the table across a row rather than down a column. Doubling the scatter at a
factor of safety of 3 moves the failure probability by more than six orders of
magnitude. No amount of arguing about the ratio recovers that.

### Worked example 6.1 — one factor of safety, two very different designs

*Hypothetical.* Two bracket designs are offered for the same duty. Both have a
mean capacity of 200 kN against a mean load of 100 kN, so both quote a central
factor of safety of 2.0. Design A is machined from certified stock and installed
under inspection; design B is fabricated and installed without either.

| | Design A | Design B |
|---|---|---|
| Capacity scatter | 0.10 | 0.20 |
| Load scatter | 0.15 | 0.30 |

Design A:

$$\\sigma_{R} = 0.10 \\times 200 = 20 \\qquad \\sigma_{S} = 0.15 \\times 100 = 15$$

$$\\sigma_{g} = \\sqrt{20^{2} + 15^{2}} = \\sqrt{625} = 25$$

$$\\beta_{A} = \\frac{100}{25} = 4.0 \\qquad p_{f,A} = \\Phi(-4.0) = 3.167 \\times 10^{-5}$$

Design B:

$$\\sigma_{R} = 0.20 \\times 200 = 40 \\qquad \\sigma_{S} = 0.30 \\times 100 = 30$$

$$\\sigma_{g} = \\sqrt{40^{2} + 30^{2}} = \\sqrt{2500} = 50$$

$$\\beta_{B} = \\frac{100}{50} = 2.0 \\qquad p_{f,B} = \\Phi(-2.0) = 2.2750 \\times 10^{-2}$$

The ratio of the two failure probabilities:

$$\\frac{0.02275}{0.00003167} = 718$$

Check design A the other way, through the factor-of-safety form of the index:

$$\\mathrm{FS}_{c}^{2}\\delta_{R}^{2} + \\delta_{S}^{2} = 4 \\times 0.01 + 0.0225 = 0.0625$$

$$\\beta_{A} = \\frac{1}{0.25} = 4.0$$

which reproduces the first route exactly. **Both designs pass the same
calculation sheet.** One of them fails seven hundred times as often. An engineer
who selects design B and records only "FS = 2.0, satisfactory" has produced a
document that will not survive an expert's reading of it, and the reason is not
that the arithmetic is wrong — it is that the arithmetic answered a question
nobody was asking.

![Above, the load and capacity densities for both bracket designs with the overlap shaded; the two panels share an axis so the widening of both densities in design B is directly comparable. Below the titles are the reliability index and failure probability computed for each, both confirmed against the overlap integral evaluated numerically and against direct simulation of the two random variables.](/courses/fe-ee/figures/eth3-load-resistance-overlap.svg)

### Worked example 6.2 — sizing to a stated tolerable probability

*Same hypothetical.* Suppose the owner specifies a tolerable failure probability
of one in ten thousand, and the fabrication route available has a capacity
scatter of 0.20. The load keeps mean 100 and standard deviation 30. What mean
capacity is required, and what factor of safety does that imply?

The target index is the standard normal quantile:

$$\\beta_{t} = \\Phi^{-1}(1 - 10^{-4}) = 3.719$$

Impose it on the definition, with $\\sigma_{R} = 0.20\\mu_{R}$:

$$\\mu_{R} - 100 = 3.719\\sqrt{(0.20\\mu_{R})^{2} + 30^{2}}$$

Squaring and collecting terms gives a quadratic in $\\mu_{R}$ whose upper root
is

$$\\mu_{R} = 459.6$$

$$\\mathrm{FS}_{c} = \\frac{459.6}{100} = 4.596$$

Notice what happened. Holding the sloppier fabrication route, the factor of
safety needed to reach one in ten thousand more than doubled, from the 2.0 that
design A achieved by controlling scatter instead. **Buying reliability with a
bigger member is far more expensive than buying it with tighter control**, and an
engineer who never computes the second option has narrowed the client's choices
without telling anyone.

### Worked example 6.3 — reading the index backwards

*Hypothetical.* An as-built review of an existing installation finds a
reliability index of 3.0 against a target of 3.719. How much of a shortfall is
that, expressed as probability?

$$p_{f} = \\Phi(-3.0) = 1.350 \\times 10^{-3}$$

against the target of $10^{-4}$: the installation is about 13.5 times more
likely to fail than the specification allows, from an index that is short by
less than one unit. The rule of thumb worth carrying into the exam is that **one
unit of reliability index is worth roughly one decade of failure probability**
over the range that matters, which is exactly the slope of the curve below.

![Failure probability against the reliability index on a logarithmic vertical scale, computed from the standard normal distribution function. The two bracket designs of worked example 6.1 are marked on the curve, and the horizontal guide is the one-in-ten-thousand target used in worked example 6.2. The near-straight descent is the source of the decade-per-unit rule of thumb.](/courses/fe-ee/figures/eth3-reliability-index.svg)`,
      examTip: 'When an FE question gives means and standard deviations for capacity and demand, it wants β = (μR − μS)/√(σR² + σS²) and then Φ(−β), not the ratio of the means. The distractor is always the factor of safety. If the question gives coefficients of variation instead, use β = (FS − 1)/√(FS²δR² + δS²), which is the same statement rescaled.',
      importantNote: 'A factor of safety is a ratio of nominal values and carries no information about scatter. Two designs with identical factors of safety can differ in failure probability by orders of magnitude, so a calculation record that reports only the factor of safety has not documented the safety of the design.',
    },
    {
      id: 'liab-redundancy-arithmetic',
      title: '7. Redundancy: How a Design Choice Moves a Failure Probability',
      content: `## 7.1 Series, parallel, and the two formulas that get swapped

Section 6 fixed the failure probability of one element. Systems are built from
several, and the arithmetic of combining them is short enough to be examinable
and easy enough to invert by accident.

A **series** arrangement fails if any element fails, so the system survives only
when every element survives:

$$Q_{\\text{series}} = 1 - \\prod_{i=1}^{n}\\bigl(1 - q_{i}\\bigr)$$

A **parallel** or redundant arrangement fails only when every element fails:

$$Q_{\\text{par}} = \\prod_{i=1}^{n} q_{i}$$

and for identical independent channels that collapses to

$$Q_{\\text{par}} = q^{n}$$

A **voted** arrangement needs $k$ of $n$ channels to work, so it fails when
more than $n-k$ channels have failed:

$$Q_{k/n} = \\sum_{j=n-k+1}^{n} \\binom{n}{j} q^{j} (1-q)^{n-j}$$

The traps are mechanical. Reliability multiplies in series; unreliability
multiplies in parallel. Writing $q^{n}$ for a series chain, or
$1-(1-q)^{n}$ for a redundant one, inverts the answer by orders of magnitude,
and the FE exam sets exactly that distractor.

## 7.2 The assumption that quietly does all the work

Every expression above assumed independence. Real redundant channels share a
design, a manufacturer, a calibration procedure, an installation crew, a power
supply and an environment, and any one of those can take out all of them at
once. The standard first-order correction splits the channel failure rate into
an independent part and a common part in proportion $\\beta$:

$$Q_{\\text{sys}} = \\bigl[(1-\\beta)q\\bigr]^{n} + \\beta q$$

The second term does not depend on $n$. Adding channels drives the first term
towards zero and leaves the second untouched, so the system failure probability
has a floor:

$$\\lim_{n \\to \\infty} Q_{\\text{sys}} = \\beta q$$

**That floor is the single most important number in a redundancy argument, and
it is the one most often left out of a design record.**

| Channels | Independent | Common-cause fraction 0.02 | Common-cause fraction 0.10 |
|---|---|---|---|
| 1 | 0.0200 | 0.0200 | 0.0200 |
| 2 | 0.000400 | 0.000784 | 0.002324 |
| 3 | 0.00000800 | 0.000408 | 0.002006 |
| 4 | 0.000000160 | 0.000400 | 0.002000 |

### Worked example 7.1 — what the second channel actually buys

*Hypothetical.* A protective function fails to operate on demand with
probability 0.02 per channel. The design team proposes duplicating it. Estimate
the improvement, first assuming independence, then with a common-cause fraction
of 0.10.

Independent duplication:

$$Q_{2} = 0.02 \\times 0.02 = 0.0004$$

With the common-cause split, the independent portion of each channel is

$$(1 - 0.10) \\times 0.02 = 0.018$$

so

$$0.018 \\times 0.018 = 0.000324$$

$$0.10 \\times 0.02 = 0.002$$

$$Q_{2} = 0.000324 + 0.002 = 0.002324$$

Compare the two estimates:

$$\\frac{0.002324}{0.0004} = 5.81$$

The independence assumption is optimistic by a factor of nearly six. The
improvement that is actually purchased, against a single channel, is

$$\\frac{0.02}{0.002324} = 8.606$$

Now add a third channel:

$$0.018 \\times 0.018 \\times 0.018 = 0.000005832$$

$$Q_{3} = 0.000005832 + 0.002 = 0.002005832$$

$$\\frac{0.0023240}{0.0020058} = 1.1586$$

The second channel bought a factor of 8.6. The third bought a factor of 1.16 and
cost as much as the second. **A design record that justifies triplication by
quoting the independent figure of eight in a million, when the defensible figure
is two in a thousand, has overstated the safety of the installation by three
orders of magnitude** — and it did so in writing, in a document that will be read
back years later. That is the liability content of this arithmetic.

![System failure probability against the number of parallel channels, on a logarithmic scale, for three common-cause fractions. The independent curve falls by a factor of fifty per channel and never stops; the two curves with a common-cause term flatten onto their floors after the second channel, and the floor does not move no matter how many channels are added.](/courses/fe-ee/figures/eth3-redundancy-common-cause.svg)

### Worked example 7.2 — voting, and what it trades

*Same hypothetical.* Compare the duplicated arrangement with a two-out-of-three
voted arrangement, assuming independence for the comparison.

The voted arrangement fails to operate when two or three of its channels have
failed:

$$Q_{2/3} = 3 \\times 0.0004 \\times 0.98 = 0.001176$$

$$0.02^{3} = 0.000008$$

$$Q_{2/3} = 0.001176 + 0.000008 = 0.001184$$

That is worse, on failure-to-operate, than the duplicated arrangement's 0.0004 —
which is the point. Voting is not chosen to minimise failure to operate; it is
chosen because it also suppresses **spurious** operation, which a simple
duplicated pair makes worse. Two objectives are in tension, and an engineer who
quotes only the one that favours the chosen architecture has not documented a
comparison, only an advocacy.

### Worked example 7.3 — where the channel probability came from

*Same hypothetical.* Dangerous undetected faults arrive in a channel at a rate
of 0.01 per year, and the channel is proof-tested every four years. On the
standard approximation, the average probability of a dangerous fault being
present when a demand arrives is half the rate times the interval:

$$\\mathrm{PFD}_{\\text{avg}} \\approx \\frac{\\lambda_{DU} T}{2}$$

$$0.01 \\times 4 = 0.04$$

$$\\frac{0.04}{2} = 0.02$$

which is exactly the 0.02 used above. Halving the interval to two years halves
the figure to 0.01 and improves every result in this section by a factor of two
at no capital cost at all.

That last observation is the sharpest liability lesson in the section. **The
0.02 is not a property of the hardware; it is a property of a maintenance
commitment.** If the design record states a four-year proof-test interval and the
plant quietly stops testing, every probability computed here is wrong and the
installation is not the one that was designed. Two obligations follow, and both
are ordinary practice: state the assumption on the face of the deliverable, and
say plainly what happens if it is not kept.`,
      examTip: 'Series means unreliability adds through 1 − Π(1 − q); parallel means unreliability multiplies as Πq. Check the direction with a sanity case: two channels each failing 10% of the time should give 1% in parallel and 19% in series. Anything else means the formulas were swapped.',
      importantNote: 'Redundancy has a floor set by common-cause failure, at roughly the common-cause fraction times the single-channel probability. Adding channels past the second buys very little once that floor is reached, and a design justification that omits the common-cause term can overstate system reliability by orders of magnitude.',
    },
    {
      id: 'liab-insurance-arithmetic',
      title: '8. Errors and Omissions Cover: Limits, Deductibles, and Expected Retained Loss',
      content: `## 8.1 What professional liability cover is for

Professional liability insurance — usually sold as **errors and omissions**
cover, and often called professional indemnity — responds to claims that an
engineer's professional services fell below the standard of care. It is not
general liability cover, which responds to bodily injury and property damage
arising from operations, and the two are not interchangeable: the classic
uninsured gap is a claim that is purely economic, arising from a design error,
which general liability was never written to reach.

Three structural features decide almost everything about how a policy behaves,
and all three are examinable as concepts rather than as contract text. **No
policy wording is reproduced here; the operative words are in the policy, which
is copyrighted, and the only reliable way to know what is covered is to read
the one you bought.**

- **Claims-made trigger.** The policy that responds is the one in force when the
  claim is *made*, not the one in force when the work was done. Cover therefore
  has to be maintained continuously, and a retirement or a change of insurer
  needs either a retroactive date that reaches back or an extended reporting
  endorsement — "tail" cover — that reaches forward. Section 11 computes how long
  that tail has to be.
- **Defence costs inside or outside the limit.** If defence sits inside the
  limit, every dollar spent defending the claim is a dollar that is no longer
  available to settle it. Worked example 8.2 puts a number on that.
- **Per-claim and annual aggregate limits.** A policy may pay its per-claim limit
  several times, or it may have an annual ceiling that all claims share. Worked
  example 8.3 shows what happens when a bad year exhausts it.

What such policies commonly **exclude** is as important as what they cover, and
the exclusions cluster around obligations an engineer took on voluntarily.
Typically outside cover: express warranties and guarantees of a result;
liability assumed under a contract that goes beyond what the law would have
imposed anyway; dishonest, fraudulent or criminal acts; cost estimates and cost
overruns treated as such; and matters that belong to other policies — employee
injury, which is workers' compensation, and often pollution, which is written
separately. This list is a description of the general pattern, not of any
particular policy, and the specifics vary by insurer and by state.

The practical consequence connects straight back to section 3. A contract clause
promising that a design "will achieve" a stated performance is a guarantee, and
a guarantee is the paradigm case of an obligation the engineer assumed and the
policy declines. **Signing such a clause converts an insured exposure into an
uninsured one, with no change in the work at all.**

## 8.2 The arithmetic of a retention

Let the gross loss be $L$, the deductible or self-insured retention $D$, and
the insurer's indemnity limit $M$ applying above the deductible. The insurer
pays

$$I(L) = \\min\\bigl(\\max(L - D,\\ 0),\\ M\\bigr)$$

and the firm keeps the rest:

$$r(L) = L - I(L) = \\min(L, D) + \\max(L - D - M,\\ 0)$$

Read that as three regimes. Below the deductible the firm keeps everything.
Between the deductible and the top of the limit it keeps exactly the deductible.
Above the top of the limit it keeps the deductible plus everything in excess —
and that third regime is unbounded, which is why the limit matters more than the
deductible even though the deductible is the number people negotiate hardest.

Over a scenario set the expected retention is

$$E[r] = \\sum_{k} p_{k}\\, r(L_{k})$$

and the quantity to compare across policy structures is the **total cost of
risk**: what the firm spends plus what it expects to keep.

$$\\mathrm{TCOR} = \\text{premium} + E[r]$$

For a continuous severity distribution the same idea is an integral over the
layer, which is the standard way to price one:

$$E\\bigl[I(L)\\bigr] = \\int_{D}^{D+M}\\bigl[1 - F_{L}(x)\\bigr]\\, dx$$

![Loss retained by the firm against gross loss, for two policy structures, with the uninsured line, on which the firm keeps everything, for reference. Each curve rises at unit slope to the deductible, runs flat across the insured corridor, and then rises at unit slope again once the limit is exhausted. The flat portion is the whole value of the policy, and its width is the limit, not the deductible.](/courses/fe-ee/figures/eth3-retained-loss.svg)

### Worked example 8.1 — choosing between three programmes

*Hypothetical.* A small consultancy models its annual claim experience with five
outcomes. All amounts are in dollars.

| Outcome | Probability | Gross loss |
|---|---|---|
| No claim | 0.900 | 0 |
| Minor | 0.060 | 50,000 |
| Moderate | 0.030 | 400,000 |
| Severe | 0.009 | 2,000,000 |
| Catastrophic | 0.001 | 8,000,000 |

The probabilities sum to 1.000, and the expected gross loss is

$$0.06 \\times 50{,}000 = 3{,}000$$

$$0.03 \\times 400{,}000 = 12{,}000$$

$$0.009 \\times 2{,}000{,}000 = 18{,}000$$

$$0.001 \\times 8{,}000{,}000 = 8{,}000$$

$$E[L] = 3{,}000 + 12{,}000 + 18{,}000 + 8{,}000 = 41{,}000$$

Three programmes are quoted. Applying the retention formula to each outcome:

| Programme | Deductible | Limit | Premium | Retained at 8,000,000 |
|---|---|---|---|---|
| 1 | 25,000 | 1,000,000 | 34,000 | 7,000,000 |
| 2 | 100,000 | 5,000,000 | 52,000 | 3,000,000 |
| 3 | 25,000 | 5,000,000 | 61,000 | 3,000,000 |

Take programme 1. The minor and moderate losses both sit inside the corridor, so
the firm keeps the deductible each time. The severe loss of 2,000,000 exceeds
the deductible plus the limit by 975,000, so the retention is 1,000,000. The
catastrophic loss leaves 6,975,000 above the corridor:

$$r(8{,}000{,}000) = 25{,}000 + 6{,}975{,}000 = 7{,}000{,}000$$

Term by term:

$$0.06 \\times 25{,}000 = 1{,}500$$

$$0.03 \\times 25{,}000 = 750$$

$$0.009 \\times 1{,}000{,}000 = 9{,}000$$

$$0.001 \\times 7{,}000{,}000 = 7{,}000$$

$$E[r]_{1} = 1{,}500 + 750 + 9{,}000 + 7{,}000 = 18{,}250$$

$$\\mathrm{TCOR}_{1} = 34{,}000 + 18{,}250 = 52{,}250$$

Programme 2 raises the deductible fourfold but raises the limit fivefold:

$$E[r]_{2} = 3{,}000 + 3{,}000 + 900 + 3{,}000 = 9{,}900$$

$$\\mathrm{TCOR}_{2} = 52{,}000 + 9{,}900 = 61{,}900$$

Programme 3 keeps the low deductible and the high limit, and is priced for it:

$$E[r]_{3} = 1{,}500 + 750 + 225 + 3{,}000 = 5{,}475$$

$$\\mathrm{TCOR}_{3} = 61{,}000 + 5{,}475 = 66{,}475$$

On expected cost the ranking is unambiguous: programme 1 is cheapest by 9,650 a
year against programme 2 and by 14,225 against programme 3.

**And a firm with two million dollars of net worth should not buy programme 1.**
The expected-cost ranking is driven by a branch that occurs one year in a
thousand, and in that branch programme 1 leaves the firm holding seven million
dollars against a two-million balance sheet, which is not a loss but a closure.
Programmes 2 and 3 leave three million, which is survivable with the assets and
the residual practice. Insurance is bought to truncate the tail, not to minimise
the mean, and an FE answer that picks the lowest expected cost without looking at
the worst branch has missed the purpose of the product.

### Worked example 8.2 — defence costs inside the limit

*Hypothetical.* A claim settles for 900,000. Defending it cost 350,000. The
policy carries a 25,000 deductible and a 1,000,000 limit.

If defence sits **outside** the limit, the limit is available in full for the
settlement, and the firm keeps only its deductible:

$$r = 25{,}000 + \\max(900{,}000 - 25{,}000 - 1{,}000{,}000,\\ 0) = 25{,}000$$

If defence sits **inside** the limit, defence and settlement share it, so the
loss the retention formula sees is the whole bill of 1,250,000:

$$r = 25{,}000 + \\max(1{,}250{,}000 - 25{,}000 - 1{,}000{,}000,\\ 0)$$

$$225{,}000 + 25{,}000 = 250{,}000$$

The difference is 225,000, from a single word in the declarations page and no
difference at all in the underlying facts. On a claim that is defended
successfully — nothing paid in settlement, everything spent on lawyers — an
eroding limit can be consumed entirely by a win.

### Worked example 8.3 — a bad year and the annual aggregate

*Hypothetical.* Three unrelated claims are made in one policy year, for 400,000,
600,000 and 500,000. The deductible is 25,000 per claim, the per-claim limit is
1,000,000, and the annual aggregate is also 1,000,000.

Claim one: the insurer pays 375,000, leaving 625,000 of aggregate. Claim two: the
insurer pays 575,000, leaving 50,000. Claim three: the firm owes 475,000 above
its deductible but only 50,000 of aggregate remains, so the insurer pays 50,000
and the firm keeps the rest.

$$375{,}000 + 575{,}000 + 50{,}000 = 1{,}000{,}000$$

$$25{,}000 + 25{,}000 + 25{,}000 = 75{,}000$$

$$75{,}000 + 425{,}000 = 500{,}000$$

The firm retains half a million on a year in which no single claim came close to
the per-claim limit. The aggregate, not the per-claim figure, was the binding
constraint, and it is the number that is easiest to overlook when a policy is
summarised as "a million-dollar policy".`,
      examTip: 'The retained-loss formula r(L) = min(L, D) + max(L − D − M, 0) answers almost every insurance arithmetic question on this material. Compute it outcome by outcome, weight by probability, then add the premium. The trap is to compare premiums alone, or to compare expected costs while ignoring the worst branch.',
      importantNote: 'Professional liability cover is claims-made: the responding policy is the one in force when the claim is made, not when the work was done. Continuous cover, an early retroactive date, and tail cover on retirement are what keep old work insured, and none of them can be bought after a claim appears.',
    },
    {
      id: 'liab-strict-privity-caps',
      title: '9. Strict Liability, Privity, and What a Limitation Clause Is Actually Worth',
      content: `## 9.1 Three theories, three different burdens

Negligence is not the only route to an engineer. Three theories appear in this
material, and the exam distinction is what each one makes the claimant prove.

| Theory | What must be proved | Where it usually reaches an engineer |
|---|---|---|
| Negligence | Duty, breach of the standard of care, causation, damages | Professional services: design, review, inspection, advice |
| Breach of contract | A promise, a failure to keep it, resulting loss | The client relationship, on the terms actually agreed |
| Strict liability | The product was defective and unreasonably dangerous, and it caused the harm | Products placed in the stream of commerce |

The middle column is the whole point. Under negligence, **fault is an element**:
the claimant has to show the conduct fell below professional norms, which
usually needs an expert. Under strict liability, fault is not an element at all.
The claimant shows the product was defective when it left the defendant's hands
and that the defect caused the injury. A manufacturer that exercised every
reasonable care can still be liable.

Product liability recognises three kinds of defect, and they are worth
memorising because exam scenarios are usually one of them wearing a costume:

- a **manufacturing defect**, where the item departs from its own design;
- a **design defect**, where every item built to the design carries the hazard;
- a **failure to warn**, where the item is as designed but the user was not told
  what they needed to know to use it safely.

Whether strict liability reaches an engineer usually turns on whether the work
is characterised as a **product** or a **service**. Professional services are
generally judged by the negligence standard, because the professional promises
competent effort rather than a defect-free thing. An engineer who designs a
one-off substation is providing a service; an engineer whose employer
manufactures ten thousand identical drives is contributing to a product, and the
product route may be open against the manufacturer with the engineer's design
decisions as the evidence. Jurisdictions differ on where exactly the line falls,
which is one more reason this chapter is exam preparation and not advice.

## 9.2 Privity, and why the contract cannot solve everything

**Privity** is the relationship between parties to a contract. Only a party to
the contract can sue on it. That single sentence explains most of what follows.

- The **client** can sue in contract, on the terms agreed, and usually in
  negligence as well.
- A **third party** — the building's occupant, a neighbouring owner, a worker
  employed by the contractor, a subsequent purchaser — has no contract with the
  engineer and therefore no contract claim. What such a party has is a
  negligence claim, and the modern position in most jurisdictions is that the
  absence of privity does not bar it where the harm was foreseeable.

The practical consequence is asymmetric and unpleasant. **The people most likely
to be badly hurt are the people with whom the engineer never contracted**, and
the contract terms so carefully negotiated with the client do not bind them at
all. Everything in the next subsection has to be read with that limit in mind.

## 9.3 Limitation of liability, and its real value in dollars

A limitation-of-liability clause caps what the engineer can owe the other
contracting party, commonly at the fee, at a multiple of the fee, or at a stated
sum. Applied to a loss it is simply

$$r_{\\text{cap}}(L) = \\min(L,\\ K)$$

with expected value over a scenario set

$$E[r_{\\text{cap}}] = \\sum_{k} p_{k} \\min(L_{k},\\ K)$$

Whether such a clause is enforceable varies by state and by circumstance —
several jurisdictions treat caps in professional agreements sceptically, and some
refuse them outright where public safety or a statutory duty is engaged. Two
limits are structural rather than jurisdictional, and they are the ones that
matter for the arithmetic: **a cap binds only the party who agreed to it**, and
**a cap does not reduce the loss, it reallocates it**.

### Worked example 9.1 — what a fee-level cap is worth

*Hypothetical.* Take the same five-outcome loss model as section 8, with an
expected gross loss of 41,000 dollars a year. The firm's standard agreement caps
its liability at the fee, 120,000 dollars. Suppose further that, over the long
run, six claims in ten come from contracting clients and four in ten from third
parties who never signed anything.

If the cap bound every claim, the minor loss is below it and the rest are cut to
it:

$$0.06 \\times 50{,}000 = 3{,}000$$

$$0.03 \\times 120{,}000 = 3{,}600$$

$$0.009 \\times 120{,}000 = 1{,}080$$

$$0.001 \\times 120{,}000 = 120$$

$$E[r_{\\text{cap}}] = 3{,}000 + 3{,}600 + 1{,}080 + 120 = 7{,}800$$

$$\\frac{7{,}800}{41{,}000} = 0.1902$$

a reduction of just under 81 percent — which is the number a contract negotiator
will quote. Now apply it only where it actually binds:

$$0.60 \\times 7{,}800 = 4{,}680$$

$$0.40 \\times 41{,}000 = 16{,}400$$

$$E[r] = 4{,}680 + 16{,}400 = 21{,}080$$

$$\\frac{21{,}080}{41{,}000} = 0.5141$$

The real reduction is about 49 percent, not 81. **The clause is worth roughly
half what its face suggests, and the half it cannot reach is the half involving
injured strangers.** An engineer who treats a signed limitation clause as having
solved the exposure has mispriced the risk by a factor of about two, and that
error propagates straight into how much insurance the firm buys.

### Worked example 9.2 — an indemnity running the wrong way

*Hypothetical.* A client's proposed agreement asks the engineer to indemnify the
client against all claims arising from the project, including those caused in
part by the client's own acts. On the apportionment facts used in section 10,
the client-owner carries a 10 percent share of a 5,000,000 dollar loss:

$$0.10 \\times 5{,}000{,}000 = 500{,}000$$

The clause moves that 500,000 from the owner to the engineer. Two things follow,
and both are worse than the transfer itself.

First, an indemnity for **another party's own negligence** is restricted or void
in many states, so the clause may be unenforceable in part and the parties will
find that out expensively.

Second, and more reliably damaging, liability *assumed by contract* that the law
would not otherwise have imposed is the classic professional-liability
exclusion, as section 8.1 described. The engineer has therefore taken on 500,000
of exposure that the policy is unlikely to answer for. **The premium did not
change, the work did not change, and the uninsured exposure went up by half a
million dollars** — which is why a contract review is an engineering task and not
only a legal one.

A narrower indemnity, limited to claims arising from the engineer's own
negligent acts, transfers nothing the law would not have allocated anyway and is
usually both enforceable and insurable. Recognising the difference between the
broad form and the narrow one is the practical skill this section is really
teaching.`,
      examTip: 'Negligence requires proof of fault; strict product liability does not. If a scenario turns on a mass-produced item that was defective when sold, the strict-liability route is open and the defendant\'s care is beside the point. If it turns on professional judgement in a one-off design, the negligence standard of care governs.',
      importantNote: 'A limitation-of-liability clause binds only the party that signed it. Third parties injured by a foreseeable failure are not bound and sue in negligence, so a cap reduces total expected exposure by far less than its face value suggests. Size the insurance programme against the uncapped exposure, not the capped one.',
    },
    {
      id: 'liab-apportionment',
      title: '10. Apportionment: Joint and Several Against Comparative Fault',
      content: `## 10.1 The two questions a damages award has to answer

When several parties contributed to one harm, a court answers two separate
questions, and they are routinely collapsed into one by candidates.

**How much is owed?** Comparative fault reduces the claimant's recovery by the
claimant's own share of the fault. Write the fault shares of every party,
claimant included, as fractions that exhaust the whole:

$$\\sum_{i} f_{i} = 1$$

Under **pure comparative fault** the recoverable damages are

$$D_{\\text{rec}} = (1 - f_{P})\\, D$$

**Who pays it?** Under **several liability**, each defendant owes its own share
and no more:

$$d_{i} = f_{i} D$$

$$\\sum_{i \\ne P} d_{i} = D_{\\text{rec}}$$

Under **joint and several liability**, each defendant is answerable for the whole
recoverable amount, and a defendant who pays more than its share must chase the
others for contribution:

$$d_{i}^{JS} \\le D_{\\text{rec}} \\quad \\text{for any single defendant}$$

The difference does not change the total; it changes **who carries the risk that
somebody cannot pay**. Under several liability the claimant carries it. Under
joint and several the solvent defendants do — which in practice means the one
with insurance, and on a construction project that is very often the design
professional.

Most states have moved to some middle position, commonly by making liability
several once a defendant's share falls below a threshold, or by reallocating an
uncollectible share among the remaining parties in proportion to their fault:

$$\\Delta_{i} = \\frac{f_{i}}{1 - f_{g}}\\, d_{g}$$

where $f_{g}$ and $d_{g}$ are the fault share and the unpaid amount of the
party that cannot pay. **Which rule applies is state law and it varies widely.**

### Worked example 10.1 — the same 25 percent, three ways

*Hypothetical.* A fire damages a facility. After trial the fault is apportioned:
claimant 10 percent, design engineer 25 percent, contractor 40 percent,
equipment manufacturer 15 percent, owner 10 percent. Gross damages are 5,000,000
dollars.

Recoverable damages after the claimant's own share:

$$D_{\\text{rec}} = 0.90 \\times 5{,}000{,}000 = 4{,}500{,}000$$

Several shares:

$$0.25 \\times 5{,}000{,}000 = 1{,}250{,}000$$

$$0.40 \\times 5{,}000{,}000 = 2{,}000{,}000$$

$$0.15 \\times 5{,}000{,}000 = 750{,}000$$

$$0.10 \\times 5{,}000{,}000 = 500{,}000$$

Check by rebuilding the total from the parts, which is the only reliable way to
catch an apportionment slip:

$$1{,}250{,}000 + 2{,}000{,}000 + 750{,}000 + 500{,}000 = 4{,}500{,}000$$

Now suppose the contractor is insolvent.

**Under pure joint and several liability**, the claimant may collect the entire
4,500,000 from the engineer, whose own share was a quarter of it:

$$\\frac{4{,}500{,}000}{1{,}250{,}000} = 3.6$$

The engineer's exposure is 3.6 times its adjudicated fault, and its right of
contribution against the contractor is worth whatever an insolvent contractor is
worth, which is nothing.

**Under a reallocation rule**, the contractor's 2,000,000 is spread over the
remaining parties in proportion to their fault. The remaining fault base is 0.60,
so the shares of the reallocation are 25, 15 and 10 parts out of 60 for the
three solvent defendants and 10 out of 60 for the claimant:

$$\\frac{25}{60} \\times 2{,}000{,}000 = 833{,}333$$

$$\\frac{15}{60} \\times 2{,}000{,}000 = 500{,}000$$

$$\\frac{10}{60} \\times 2{,}000{,}000 = 333{,}333$$

Final positions:

$$1{,}250{,}000 + 833{,}333 = 2{,}083{,}333$$

$$750{,}000 + 500{,}000 = 1{,}250{,}000$$

$$500{,}000 + 333{,}333 = 833{,}333$$

$$2{,}083{,}333 + 1{,}250{,}000 + 833{,}333 = 4{,}166{,}666$$

and the claimant absorbs its own 333,333 of the shortfall, so its recovery falls
to

$$4{,}500{,}000 - 333{,}333 = 4{,}166{,}667$$

The one-dollar gap between those two totals is rounding to whole dollars, not an
error: each of the three reallocated shares was rounded down.

| Regime | Engineer pays | Multiple of its own share |
|---|---|---|
| Several liability only | 1,250,000 | 1.00 |
| Uncollectible share reallocated | 2,083,333 | 1.67 |
| Joint and several, worst case | 4,500,000 | 3.60 |

![What each party pays under three apportionment regimes, for the same adjudicated fault shares. The left bar of each group is the several share. The middle bar adds the reallocation of the insolvent contractor's share, which is why the contractor's middle bar is empty. The right bar shows the worst case under joint and several liability, where the engineer alone is pursued for the whole recoverable amount, so it is empty for every other party. The several shares sum exactly to the recoverable total, which is the check the worked example performs.](/courses/fe-ee/figures/eth3-apportionment.svg)

### Worked example 10.2 — the bar that turns recovery off

*Hypothetical, same damages.* Many states do not use pure comparative fault but
a **modified** version that bars recovery once the claimant's own share crosses a
threshold. Two thresholds are common: one bars a claimant whose fault is
**greater than** 50 percent, the other bars a claimant whose fault is **50
percent or more**. Compare three findings.

$$0.45 \\text{ fault: } 0.55 \\times 5{,}000{,}000 = 2{,}750{,}000$$

At exactly 50 percent the two rules part company. Under the "greater than 50"
rule the claimant still recovers

$$0.50 \\times 5{,}000{,}000 = 2{,}500{,}000$$

while under the "50 percent or more" rule the recovery is zero. At 55 percent
both modified rules give zero, while pure comparative fault would still allow

$$0.45 \\times 5{,}000{,}000 = 2{,}250{,}000$$

Under the "greater than 50 percent" rule, moving the claimant's adjudicated fault
from 50 to 51 percent takes the recovery from 2,500,000 to zero. That is
why the apportionment fight consumes as much expert time as the liability fight,
and why contemporaneous records that fix what each party actually did are worth
so much.

### Worked example 10.3 — settling early, and the credit the others get

*Hypothetical, same facts.* The engineer settles before trial for 800,000 and is
dismissed. The jury later finds the engineer 25 percent at fault. What do the
remaining defendants owe?

Under a **pro tanto** (dollar-for-dollar) credit, the judgment against the others
is reduced by what was actually paid:

$$4{,}500{,}000 - 800{,}000 = 3{,}700{,}000$$

Under a **proportionate-share** credit, it is reduced by the settling party's
adjudicated share instead:

$$4{,}500{,}000 - 1{,}250{,}000 = 3{,}250{,}000$$

The claimant's total recovery differs accordingly:

$$3{,}700{,}000 + 800{,}000 = 4{,}500{,}000$$

$$3{,}250{,}000 + 800{,}000 = 4{,}050{,}000$$

Under the pro tanto rule the engineer's early settlement was a good deal for the
engineer and cost the claimant nothing; under the proportionate-share rule the
same settlement left the claimant 450,000 short, because the engineer settled for
less than its share and the claimant, not the co-defendants, absorbed the
difference. **Which credit applies is jurisdictional**, and it determines whether
settling early is cheap or whether it merely moves the argument.`,
      examTip: 'Do the two steps in order: reduce the total by the claimant\'s own fault to get the recoverable amount, then allocate that amount among the defendants. Under several liability a defendant pays its own share; under joint and several it can be pursued for the whole recoverable amount. Always check by adding the shares back to the recoverable total.',
      importantNote: 'Joint and several liability shifts the risk of an insolvent co-defendant onto the solvent ones. On a project where the design professional is the party most likely to carry insurance, that makes the engineer the practical target regardless of how small its adjudicated share turns out to be.',
    },
    {
      id: 'liab-timelines',
      title: '11. Two Clocks: Statutes of Limitation and Statutes of Repose',
      content: `## 11.1 The distinction, stated as arithmetic

Section 3.5 introduced the two periods. Here they are as computations, because
FE questions on this material are date arithmetic wearing legal clothing.

A **statute of limitations** starts when the claim accrues. Under a discovery
rule, accrual is when the harm was discovered or reasonably should have been:

$$t_{\\text{lim}} = t_{\\text{accrual}} + N_{\\text{lim}}$$

A **statute of repose** starts from a fixed construction event, most often
substantial completion, and runs regardless of when — or whether — anyone knows
there is a problem:

$$t_{\\text{rep}} = t_{\\text{SC}} + N_{\\text{rep}}$$

A claim is timely only if it clears both:

$$t_{\\text{file}} \\le \\min\\bigl(t_{\\text{lim}},\\ t_{\\text{rep}}\\bigr)$$

| | Statute of limitations | Statute of repose |
|---|---|---|
| Clock starts at | Accrual, often discovery of the harm | A fixed event, usually substantial completion |
| Can it expire before anyone knows? | No, under a discovery rule | Yes, and that is its purpose |
| Typical tolling for a minor or for fraud | Often available | Often unavailable |
| What it protects | Defendants from stale evidence | Design professionals from indefinite exposure |

Both periods are set by state statute and the lengths vary substantially. The
numbers used below are chosen to make the arithmetic clear, not to describe any
particular state.

![One hypothetical fact pattern with both clocks drawn on a single calendar axis. The shaded band is the eight-year repose window measured from substantial completion; the discovery of the defect falls outside it, so the limitations bar computed from discovery — which is nearly two years further on — never becomes relevant. The twelve-year repose bar is marked to show how the same facts resolve the other way under a longer statute.](/courses/fe-ee/figures/eth3-repose-timeline.svg)

### Worked example 11.1 — a claim that is dead before it is born

*Hypothetical.* A substation upgrade reaches substantial completion on
**14 June 2016**. A latent defect in a protection scheme is discovered on
**2 March 2026**, after an equipment failure. The governing state, in this
hypothetical, applies a two-year limitations period running from discovery and an
eight-year statute of repose running from substantial completion. Is a claim
filed in April 2026 timely?

Elapsed time from completion to discovery:

$$3548\\ \\text{days} \\qquad \\frac{3548}{365.25} = 9.7139\\ \\text{years}$$

Repose bar:

$$2016 + 8 = 2024 \\quad \\Rightarrow \\quad \\text{14 June 2024}$$

Limitations bar, computed from discovery:

$$2026 + 2 = 2028 \\quad \\Rightarrow \\quad \\text{2 March 2028}$$

The discovery itself falls 626 days **after** the repose bar. The claim is
therefore extinguished, even though it was filed within weeks of discovery and
nearly two years before the limitations period would have run.

This is the outcome the statute of repose exists to produce, and it is the single
most counter-intuitive result in the chapter. A claimant can be diligent,
blameless and prompt, and still be out of time, because the clock that mattered
started when the work finished and never paused to wait for anyone to notice.

### Worked example 11.2 — the same facts under a longer statute

*Same hypothetical, one input changed.* Suppose the repose period is twelve years
rather than eight, and the claim is filed on **5 November 2027**.

Repose bar:

$$2016 + 12 = 2028 \\quad \\Rightarrow \\quad \\text{14 June 2028}$$

Limitations bar: 2 March 2028, as before. The binding constraint is now the
earlier of the two, which is the limitations bar:

$$\\min(\\text{2 March 2028},\\ \\text{14 June 2028}) = \\text{2 March 2028}$$

The filing date of 5 November 2027 sits **118 days** inside the limitations bar
and **222 days** inside the repose bar, so the claim is timely on both counts.
Note which clock did the work: with a long repose period the limitations period
governs, and with a short one the repose period governs. The exam question is
always which of the two binds, never both.

### Worked example 11.3 — how long the records and the cover must last

*Hypothetical.* The firm from section 8 wants to know how long it must keep
project records and how long a retirement tail on its claims-made policy has to
run. Take the eight-year repose period, with the two-year limitations period
still available for a defect discovered inside it.

The worst case is a discovery on the last day of the repose window, with the
limitations clock then running its full course:

$$T_{\\text{exposure}} = N_{\\text{rep}} + N_{\\text{lim}} = 8 + 2 = 10\\ \\text{years}$$

so records and cover both need a ten-year horizon from substantial completion,
not eight. Now ask how much of the exposure a shorter tail would actually catch.
Model the delay between completion and a claim being reported as exponential
with a mean of four years — an assumed planning figure for this exercise, not an
observed distribution. The share still unreported after eight years is

$$P(\\text{lag} > 8) = e^{-8/4} = e^{-2} = 0.1353$$

$$\\frac{8}{4} = 2$$

About 13.5 percent of claims would arrive after an eight-year tail expired, and
each of those would land on a firm with no policy in force to answer it. **A tail
that stops short of the exposure horizon does not reduce the exposure; it only
removes the insurance from it.**

The record-keeping conclusion is the same one section 3.5 reached from the other
direction, now with a number attached. Calculations, assumptions, code editions
relied on, correspondence, and the reasoning behind rejected alternatives should
survive at least as long as the exposure. They cannot be reconstructed later, and
the contemporaneous file is the only evidence that exists of what a reasonably
prudent engineer knew at the time — which, as section 3.2 established, is exactly
the question the standard of care asks.`,
      examTip: 'Compute both bars and take the earlier one. A limitations period runs from accrual, usually discovery; a repose period runs from substantial completion no matter what anyone knew. If the discovery date itself falls after the repose bar, the claim is extinguished and no further arithmetic is needed.',
      importantNote: 'A statute of repose can extinguish a claim before the injury is even discoverable. Record retention and claims-made tail cover must be sized against the full exposure horizon — the repose period plus any limitations period that can still run inside it — not against the repose period alone.',
    },
    {
      id: 'liab-present-value',
      title: '12. Present Value of a Future Damages Award',
      content: `## 12.1 Why damages are discounted at all

A claimant who will lose earnings for twenty-three years is not handed
twenty-three years of pay. A lump sum awarded today can be invested, so the
award is the amount that, invested at a reasonable rate, would reproduce the
lost stream. That is an engineering-economy calculation and nothing more exotic,
which is why it appears in an FE chapter at all.

The general statement is the sum of discounted cash flows:

$$PV = \\sum_{t=1}^{n} \\frac{A_{t}}{(1+i)^{t}}$$

Lost earnings normally grow, so model them as a geometric series with growth
rate $g$:

$$A_{t} = A_{1}(1+g)^{t-1}$$

Substituting and summing the geometric series gives the growing-annuity
present-value factor:

$$PV = \\frac{A_{1}}{i-g}\\left[1 - \\left(\\frac{1+g}{1+i}\\right)^{n}\\right]$$

which is valid whenever $i \\ne g$. When the two rates coincide the bracket and
the denominator vanish together, and the limit is finite:

$$\\lim_{i \\to g} PV = \\frac{n A_{1}}{1+g}$$

That case has a name in this context — the **total offset** method, in which
growth and discounting are assumed to cancel. It is attractive because it
removes two contested inputs and replaces them with one assumption, and it is
contested for exactly that reason.

An equivalent route defines a **net discount rate**, which folds growth into the
rate:

$$i_{\\text{net}} = \\frac{1+i}{1+g} - 1$$

after which an ordinary uniform-series factor applies to the first-year amount
deflated once:

$$PV = \\frac{A_{1}}{1+g}\\cdot\\frac{1 - (1+i_{\\text{net}})^{-n}}{i_{\\text{net}}}$$

The two routes must agree exactly, and checking that they do is the cheapest
error trap available on this kind of problem.

### Worked example 12.1 — a lost-earnings claim, two ways

*Hypothetical.* A 42-year-old engineer is permanently unable to work. First-year
lost earnings are 95,000 dollars, earnings would have grown at 3.0 percent a
year, the remaining work life is 23 years, and the court adopts a 5.0 percent
discount rate.

Closed form first:

$$0.05 - 0.03 = 0.02$$

$$\\frac{95{,}000}{0.02} = 4{,}750{,}000$$

$$\\left(\\frac{1.03}{1.05}\\right)^{23} = 0.642543$$

$$1 - 0.642543 = 0.357457$$

$$PV = 4{,}750{,}000 \\times 0.3574569 = 1{,}697{,}920$$

Now the independent route, discounting each year separately. Year 1 contributes
95,000/1.05, year 2 contributes 97,850/1.05², and so on to year 23. Summing all
twenty-three terms gives 1,697,920 to the dollar — the same figure, obtained
without ever using the closed form.

A third check, through the net discount rate:

$$\\frac{1.05}{1.03} = 1.019417$$

$$i_{\\text{net}} = 0.019417$$

$$\\frac{95{,}000}{1.03} = 92{,}233$$

$$92{,}233 \\times 18.40903 = 1{,}697{,}920$$

Three routes, one answer. The nominal total of the lost earnings, undiscounted,
is about 3.08 million; the award is 1.70 million. **Discounting removed 45
percent of the headline number**, and the discount rate is therefore the single most
valuable input in the whole calculation to argue about.

![Above, the nominal and discounted value of each year's lost earnings for the twenty-three-year claim, drawn on a shared axis so the widening gap is the effect of compounding the discount. Below, the running total of the discounted amounts, converging on the closed-form present value marked by the dashed guide. The two panels are generated from the same cash-flow array used to check the closed form term by term.](/courses/fe-ee/figures/eth3-present-value-award.svg)

### Worked example 12.2 — how much the discount rate is worth

*Same hypothetical.* Suppose the court adopts 4.0 percent instead of 5.0
percent, with everything else unchanged.

$$0.04 - 0.03 = 0.01$$

$$PV = 1{,}893{,}008$$

$$\\frac{1{,}893{,}008}{1{,}697{,}920} = 1.1149$$

One percentage point of discount rate moved the award by 11.5 percent, or about
195,000 dollars. Under the total-offset assumption, where the discount rate is
taken to equal the growth rate:

$$\\frac{2{,}185{,}000}{1.03} = 2{,}121{,}359$$

which is 25 percent above the five-percent figure. The spread between the
plausible methods is larger than most of the factual disputes in a case, and
none of it is engineering — it is assumption selection. **An engineer serving as
an expert has an obligation to state which assumption was used and why, and to
show the sensitivity rather than a single number.** Presenting one figure from
one set of inputs, when the reasonable range spans four hundred thousand
dollars, is advocacy dressed as analysis, and it is the specific way engineers
get into trouble as expert witnesses.

### Worked example 12.3 — a structured settlement against a lump sum

*Hypothetical.* A claimant is offered either 1,600,000 dollars today or twenty
annual payments of 120,000 dollars beginning in one year. Money is worth 5
percent. Which is larger?

The uniform-series present-worth factor is

$$(P/A,\\ 5\\%,\\ 20) = \\frac{1 - (1.05)^{-20}}{0.05} = 12.46221$$

$$PV = 120{,}000 \\times 12.46221 = 1{,}495{,}465$$

$$1{,}600{,}000 - 1{,}495{,}465 = 104{,}535$$

The lump sum is worth about 105,000 dollars more at a 5 percent discount rate.
Confirming it term by term — twenty separate present-worth factors, added — gives
the same 1,495,465, which is the check worth doing because the factor is the
easiest thing on the page to look up from the wrong row.

Two cautions belong with the answer. The comparison is entirely a function of
the assumed rate: at a low enough rate the payment stream wins, and the
break-even rate is itself a defensible thing to compute and report. And the
nominal total of the payments, 2,400,000, is not a meaningful comparison at all,
which does not stop it from being the number quoted in the negotiation.`,
      examTip: 'For a growing stream use PV = A₁/(i − g) × [1 − ((1+g)/(1+i))ⁿ], and remember the separate limit nA₁/(1+g) when i equals g — the general formula divides by zero there. Always confirm a closed-form present value by discounting two or three individual years by hand; a mis-set factor shows up immediately.',
      importantNote: 'This arithmetic is engineering economy, not a legal opinion on damages. What is recoverable, what growth and discount assumptions a court will accept, and whether collateral sources or taxes are deducted are all matters of state law and of the record in the case.',
    },
    {
      id: 'liab-seal-reporting-records',
      title: '13. The Seal, the Duty to Report, and Documentation as Liability Control',
      content: `## 13.1 What the seal actually asserts

A professional engineer's seal is not a decoration and it is not a signature of
receipt. Described in summary — the operative language is in each state's own
rules, which are copyrighted and which differ, and which you should read for the
state you are licensed in — sealing a document asserts three things at once:

1. that the work was **prepared by the sealing engineer or under that engineer's
   responsible charge**, meaning direct control and personal supervision of the
   engineering decisions, not merely employment in the same organisation;
2. that the engineer is **competent in the discipline** the document covers; and
3. that the engineer **accepts professional responsibility** for what the
   document contains.

Two consequences follow that the exam reaches for repeatedly.

**Sealing work you did not control is a licence offence in itself**, independent
of whether the work turns out to be any good. "Plan stamping" — sealing drawings
prepared by someone outside the engineer's responsible charge as a commercial
favour or for a fee — is among the most reliably sanctioned acts in the whole of
professional regulation, and the sanction does not wait for a failure.

**Sealing is discipline-specific.** An electrical engineer who seals the
structural sheets in a set has stepped outside competence, and section 3.2's
standard of care will be applied to that work using structural practice as the
comparison. Working outside your area of competence is not cured by care; it is
cured by declining, or by bringing in someone qualified and sealing only what
you controlled.

A related trap: an engineer who seals a document that was materially altered
afterwards is entitled to say so, but only if there is a record of what was
sealed. This is the first place in this section where documentation stops being
housekeeping and starts being a defence.

## 13.2 The duty to report, and the protection that may or may not follow

Every engineering code of practice places public safety first, and every one of
them makes that priority operational by requiring the engineer to say something
when safety is at risk. Paraphrasing the common structure rather than quoting
any code:

- inform the **client or employer** of the consequences when professional
  judgement is overruled in circumstances that endanger life or property; and
- notify **the appropriate authority** where the danger is not otherwise
  addressed.

The sequence matters and is examinable. Internal channels first, in writing,
with the technical basis stated and the consequence spelled out. External
reporting where the internal route fails or where the danger is immediate. The
FE exam almost never rewards an answer that goes straight to the press, and it
never rewards silence.

Retaliation protections exist, and they are not uniform. Federal occupational
safety law prohibits retaliation against workers who raise safety complaints,
various sector-specific federal statutes add their own protections, and many
states have their own whistleblower statutes covering public employees, private
employees, or both. **The coverage, the deadline for filing a retaliation
complaint, and the remedy all differ**, and some of the filing windows are
extremely short. The engineering lesson is not the statutory detail; it is that
the protections are procedural, they depend on a record of what was reported and
when, and they cannot be created retroactively.

## 13.3 Records as an engineering control

Everything in this chapter converges here. The standard of care asks what a
reasonably prudent engineer would have done **with the knowledge available at
the time**; the only evidence of what was known at the time is the file made at
the time. A file created afterwards is not evidence of anything except that
somebody was worried.

What belongs in it is unglamorous and specific: design criteria and their
source; the code edition actually relied on; calculations with assumptions
stated; the alternatives considered and why they were rejected; every
instruction received and every recommendation given, in writing; site
observations with dates; and the disposition of every concern raised. The
retention horizon is the one computed in worked example 11.3, and the
practical rule is to date everything and never to remove anything.

The value of that discipline can be estimated, and the estimate is instructive.

### Worked example 13.1 — what a records programme is worth

*Hypothetical.* A firm estimates that on a defended claim with indemnity
exposure of 900,000 dollars, a complete contemporaneous file cuts the
probability of an adverse outcome from 0.50 to 0.20 and cuts defence costs from
200,000 to 150,000 dollars, because the reconstruction work disappears. The firm
expects 0.08 claims per year. A records programme — templates, review time,
archiving, training — costs 18,000 dollars a year. Does it pay?

Expected cost of a claim without the file:

$$0.50 \\times 900{,}000 = 450{,}000$$

$$450{,}000 + 200{,}000 = 650{,}000$$

With the file:

$$0.20 \\times 900{,}000 = 180{,}000$$

$$180{,}000 + 150{,}000 = 330{,}000$$

Saving per claim, and expected saving per year:

$$650{,}000 - 330{,}000 = 320{,}000$$

$$0.08 \\times 320{,}000 = 25{,}600$$

$$25{,}600 - 18{,}000 = 7{,}600$$

$$\\frac{25{,}600}{18{,}000} = 1.4222$$

The break-even claim rate is the point where the saving equals the programme
cost:

$$\\lambda^{*} = \\frac{18{,}000}{320{,}000} = 0.05625$$

so the programme pays for any firm expecting more than about one claim every
eighteen years. **And the arithmetic is the weaker of the two arguments.** The
records are also the mechanism by which an engineer discharges the duty to
report, proves what was sealed, establishes what was known at the time, and
supports every one of the defences section 3 listed. A professional obligation
that happens to have a benefit-cost ratio above one is still a professional
obligation.

![Expected annual saving from a contemporaneous records programme against the claim rate, a straight line through the origin whose slope is the saving per claim. The horizontal guide is the annual cost of the programme; the marked crossing is the break-even claim rate, and the second marked point is the rate assumed in the worked example, comfortably to the right of it.](/courses/fe-ee/figures/eth3-documentation-value.svg)

### Worked example 13.2 — the probability that this ever matters to you

*Same hypothetical.* At 0.08 claims per year, what is the chance the firm sees
at least one claim over a thirty-year practice?

Claims arriving independently at a constant rate are Poisson, so the probability
of none in a window is the exponential survivor:

$$P(N = 0) = e^{-\\lambda T}$$

$$0.08 \\times 30 = 2.4$$

$$P(N = 0) = e^{-2.4} = 0.0907$$

$$P(N \\ge 1) = 1 - 0.0907 = 0.9093$$

About nine practices in ten see at least one claim across a working life. That
figure is built from an assumed rate and is not an industry statistic, but the
qualitative conclusion survives any reasonable rate you substitute: **a claim is
a normal event in a professional career, not an aberration**, and the systems
that answer it — the file, the policy, the tail, the contract terms — have to be
built before it arrives, because every one of them becomes unbuyable the moment
it does.`,
      examTip: 'Sealing asserts responsible charge, competence in the discipline, and acceptance of responsibility. An FE scenario in which an engineer seals work prepared outside their supervision, or outside their discipline, is a violation on its face — the answer does not depend on whether the work was correct.',
      importantNote: 'Report internally first, in writing, with the technical basis and the consequence stated; escalate externally where the internal route fails or the danger is immediate. Whistleblower protections vary by statute and several carry very short filing deadlines, so the contemporaneous record of what was reported and when is what makes any of them usable.',
    },
    {
      id: 'liab-problem-set-risk',
      title: '14. Problem Set A — Risk, Reliability, and Insurance Arithmetic',
      content: `## Problem Set A

Work each problem before reading the answer. Every fact pattern is a
hypothetical and every input is given; nothing has to be looked up. All money is
in dollars.

**A1.** A hazard at a facility is estimated to occur at 0.015 events per year,
with an all-in consequence of 3,200,000 per event. (a) What is the annualised
risk? (b) What is the probability of at least one event over a 25-year plant
life?

**A2.** A component has mean capacity 640 kN with standard deviation 64 kN, and
carries a load of mean 400 kN with standard deviation 60 kN. Find the central
factor of safety, the reliability index, and the probability of failure.

**A3.** The load in problem A2 is brought under tighter control, reducing its
standard deviation to 30 kN. Nothing else changes. Find the new reliability
index and the factor by which the failure probability improves.

**A4.** A protective channel fails on demand with probability 0.05. Find the
system failure probability for one, two and three parallel channels using a
common-cause fraction of 0.08, and state the floor that no amount of redundancy
can go below.

**A5.** A firm's annual claim model has three loss outcomes: 150,000 with
probability 0.05, 1,200,000 with probability 0.01, and 6,000,000 with
probability 0.002; otherwise no claim. Its policy carries a 50,000 deductible, a
2,000,000 indemnity limit and a 40,000 premium. Find the expected gross loss,
the expected retained loss, the total cost of risk, and the amount retained in
the worst outcome.

**A6.** A firm believes with probability 0.20 that a delivered design carries a
defect that would cost 1,500,000 if left unaddressed. A retrofit costing 180,000
would eliminate it. What is the most the firm should rationally pay for an
investigation that would resolve the question with certainty?

### Worked answers to Problem Set A

**A1.** Risk is the product of rate and consequence:

$$0.015 \\times 3{,}200{,}000 = 48{,}000$$

For at least one event, use the Poisson survivor. The expected count over the
life is

$$0.015 \\times 25 = 0.375$$

$$P(N \\ge 1) = 1 - e^{-0.375} = 1 - 0.6873 = 0.3127$$

so a little under one chance in three across the plant life, from a hazard that
looks negligible on any single year.

**A2.** Central factor of safety:

$$\\frac{640}{400} = 1.6$$

Standard deviation of the margin, then the index:

$$\\sqrt{64^{2} + 60^{2}} = \\sqrt{7696} = 87.7268$$

$$\\beta = \\frac{240}{87.7268} = 2.7358$$

$$p_{f} = \\Phi(-2.7358) = 3.112 \\times 10^{-3}$$

**A3.** Only the margin's spread changes:

$$\\sqrt{64^{2} + 30^{2}} = \\sqrt{4996} = 70.6824$$

$$\\beta = \\frac{240}{70.6824} = 3.3955$$

$$p_{f} = 3.426 \\times 10^{-4}$$

$$\\frac{0.0031118}{0.00034255} = 9.084$$

A factor of nine, bought entirely by controlling the load and without touching
the member. The factor of safety is unchanged at 1.6 throughout, which is the
lesson of section 6 restated as an exercise.

**A4.** The independent portion of each channel is

$$(1 - 0.08) \\times 0.05 = 0.046$$

and the common-cause term is

$$0.08 \\times 0.05 = 0.004$$

One channel: 0.05. Two channels:

$$0.046 \\times 0.046 = 0.002116$$

$$0.002116 + 0.004 = 0.006116$$

Three channels:

$$0.046 \\times 0.046 \\times 0.046 = 0.000097336$$

$$0.000097336 + 0.004 = 0.004097336$$

The floor is 0.004, which is the common-cause term alone. The second channel
bought a factor of 8.18; the third bought only 1.49, because 0.004 of the 0.006116
was already common cause and no number of channels can remove it. No fourth,
fifth or tenth channel will get below 0.004.

**A5.** Expected gross loss:

$$0.05 \\times 150{,}000 = 7{,}500$$

$$0.01 \\times 1{,}200{,}000 = 12{,}000$$

$$0.002 \\times 6{,}000{,}000 = 12{,}000$$

$$E[L] = 7{,}500 + 12{,}000 + 12{,}000 = 31{,}500$$

Retentions. The first two losses sit inside the insured corridor, so the firm
keeps the deductible on each. The third exceeds the deductible plus the limit:

$$50{,}000 + 3{,}950{,}000 = 4{,}000{,}000$$

$$0.05 \\times 50{,}000 = 2{,}500$$

$$0.01 \\times 50{,}000 = 500$$

$$0.002 \\times 4{,}000{,}000 = 8{,}000$$

$$E[r] = 2{,}500 + 500 + 8{,}000 = 11{,}000$$

$$\\mathrm{TCOR} = 40{,}000 + 11{,}000 = 51{,}000$$

The worst outcome leaves the firm holding 4,000,000 — four times the limit it
bought, which is the diagnostic that the limit, not the deductible, is the
number to renegotiate.

**A6.** Without information, the better of the two actions is the retrofit at
180,000, since doing nothing costs

$$0.20 \\times 1{,}500{,}000 = 300{,}000$$

in expectation. With perfect information the retrofit is bought only when it is
needed:

$$0.20 \\times 180{,}000 = 36{,}000$$

$$\\text{EVPI} = 180{,}000 - 36{,}000 = 144{,}000$$

Any investigation that resolves the question and costs less than 144,000 is
worth commissioning on expected value alone — and, as section 5.3 argued, the
safety obligation may require the investigation even where the arithmetic is
marginal.`,
      examTip: 'In problems A2 and A3, resist the instinct to compare factors of safety. The quantity that answers "how safe" is Φ(−β), and β depends on both standard deviations. Two problems with an identical ratio of means can differ by an order of magnitude in the answer.',
    },
    {
      id: 'liab-problem-set-legal',
      title: '15. Problem Set B — Apportionment, Timelines, and Present Value',
      content: `## Problem Set B

As before, every fact pattern is a hypothetical and every input is given. Dates
are given in full so the arithmetic can be done on a calendar. All money is in
dollars, and the rules stated in each problem are the rules to apply — real
statutes differ by state.

**B1.** A loss of 3,600,000 is apportioned: claimant 20 percent, design engineer
30 percent, contractor 35 percent, equipment supplier 15 percent. Under pure
comparative fault, find (a) the recoverable damages, (b) each defendant's
several share, and (c) the multiple of its own share that the engineer could be
pursued for under joint and several liability.

**B2.** The supplier in problem B1 is insolvent and its share is reallocated
among the remaining parties in proportion to their fault. Find the engineer's
and the contractor's final positions and the claimant's actual recovery, and
check that the parts rebuild the total.

**B3.** A project reaches substantial completion on 12 March 2015. A latent
defect is discovered on 8 September 2024. The governing rules are a three-year
limitations period running from discovery and a ten-year statute of repose
running from substantial completion. A claim is filed on 1 February 2025. Is it
timely, and by how much?

**B4.** Same facts as B3, except the claim is filed on 1 May 2025. Is it timely?

**B5.** A claimant's first-year lost earnings are 78,000. Earnings would have
grown at 2.5 percent a year over an 18-year remaining work life, and the court
adopts a 4.5 percent discount rate. Find the present value of the claim.

**B6.** A claimant is offered 850,000 today, or fifteen annual payments of
90,000 beginning in one year. Money is worth 6 percent. Which is worth more, and
by how much?

### Worked answers to Problem Set B

**B1.** Reduce for the claimant's own fault first:

$$0.80 \\times 3{,}600{,}000 = 2{,}880{,}000$$

Several shares:

$$0.30 \\times 3{,}600{,}000 = 1{,}080{,}000$$

$$0.35 \\times 3{,}600{,}000 = 1{,}260{,}000$$

$$0.15 \\times 3{,}600{,}000 = 540{,}000$$

$$1{,}080{,}000 + 1{,}260{,}000 + 540{,}000 = 2{,}880{,}000$$

Under joint and several liability the engineer can be pursued for the whole
recoverable amount:

$$\\frac{2{,}880{,}000}{1{,}080{,}000} = 2.667$$

**B2.** The remaining fault base is 0.85, so the supplier's 540,000 is
distributed in the proportions 30, 35 and 20 parts out of 85:

$$\\frac{30}{85} \\times 540{,}000 = 190{,}588$$

$$\\frac{35}{85} \\times 540{,}000 = 222{,}353$$

$$\\frac{20}{85} \\times 540{,}000 = 127{,}059$$

Final positions:

$$1{,}080{,}000 + 190{,}588 = 1{,}270{,}588$$

$$1{,}260{,}000 + 222{,}353 = 1{,}482{,}353$$

$$2{,}880{,}000 - 127{,}059 = 2{,}752{,}941$$

and the check that the defendants' payments rebuild the claimant's recovery:

$$1{,}270{,}588 + 1{,}482{,}353 = 2{,}752{,}941$$

The engineer's exposure rose by about 18 percent because of somebody else's
insolvency, without any change in its own conduct.

**B3.** Repose bar, from substantial completion:

$$2015 + 10 = 2025 \\quad \\Rightarrow \\quad \\text{12 March 2025}$$

Limitations bar, from discovery:

$$2024 + 3 = 2027 \\quad \\Rightarrow \\quad \\text{8 September 2027}$$

The binding constraint is the earlier of the two, which is the repose bar. The
filing on 1 February 2025 is inside it by **39 days**, so the claim is timely.
Note that the defect was discovered 3,468 days after completion and the
limitations clock had nearly three years left to run — the whole question turned
on the other clock.

**B4.** Nothing about the merits changes, but 1 May 2025 falls **50 days** after
the repose bar of 12 March 2025. The claim is extinguished. A difference of
eleven weeks in filing decided the case without anyone examining the defect.

**B5.** With growth below the discount rate the growing-annuity factor applies:

$$0.045 - 0.025 = 0.02$$

$$\\frac{78{,}000}{0.02} = 3{,}900{,}000$$

$$\\left(\\frac{1.025}{1.045}\\right)^{18} = 0.706214$$

$$1 - 0.706214 = 0.293786$$

$$PV = 3{,}900{,}000 \\times 0.29378596 = 1{,}145{,}765$$

Discounting the eighteen years individually and adding them gives the same
1,145,765, which is the check to run whenever a factor has been used.

**B6.** The uniform-series present-worth factor at 6 percent for fifteen years:

$$(P/A,\\ 6\\%,\\ 15) = \\frac{1 - (1.06)^{-15}}{0.06} = 9.712249$$

$$PV = 90{,}000 \\times 9.712249 = 874{,}102$$

$$874{,}102 - 850{,}000 = 24{,}102$$

The payment stream is worth about 24,000 more than the lump sum at this rate.
Compare the answer with worked example 12.3, where the lump sum won: the
direction of the answer is a property of the assumed interest rate and the
number of payments, not a general truth about structured settlements. The
nominal total of these payments, 1,350,000, is not a relevant comparison at all.`,
      examTip: 'On timeline problems, compute both bars and take the earlier one — then check the filing date against that one only. On present-value problems, confirm that growth is below the discount rate before using the growing-annuity factor; if the two are equal the formula divides by zero and the limit nA₁/(1+g) is the answer.',
      importantNote: 'The apportionment rules, credit rules, limitations periods and repose periods used in these problems are stated in the problems themselves so the arithmetic is well defined. Real periods and real rules are set by state law and vary substantially; nothing here should be read as the rule in any particular jurisdiction.',
    },
  ],
  keyTakeaways: [
    'Due diligence = investigation; due care = implementing safeguards. Both are required.',
    'Negligence liability arises from failing to exercise reasonable professional care.',
    'Framework: identify stakeholders → clarify issue → check codes → prioritize public welfare.',
    'The sunshine test: would you be comfortable if this decision appeared in the news?',
    'Document all ethical concerns, recommendations, and decisions for professional protection.',
    'Risk is probability times consequence; expected value ranks acceptable options but never makes an unacceptable risk acceptable.',
    'A factor of safety carries no information about scatter — use β = (μR − μS)/√(σR² + σS²) and pf = Φ(−β), and remember that one unit of β is worth roughly a decade of probability.',
    'Redundancy has a common-cause floor at about βq: the second channel buys a lot, the third buys almost nothing, and omitting the common-cause term overstates reliability by orders of magnitude.',
    'Retained loss is r(L) = min(L, D) + max(L − D − M, 0); compare programmes on total cost of risk AND on the worst branch, because insurance exists to truncate the tail.',
    'A limitation-of-liability clause binds only the party that signed it, so it cuts expected exposure by far less than its face value; third parties sue in negligence regardless.',
    'Under joint and several liability an engineer can be pursued for the whole recoverable amount, which makes the insured design professional the practical target when a co-defendant is insolvent.',
    'Compute both time bars and take the earlier: limitations runs from discovery, repose runs from substantial completion and can extinguish a claim before anyone knows it exists.',
    'Size record retention and claims-made tail cover against the full exposure horizon — repose plus any limitations period still able to run inside it.',
    'Sealing asserts responsible charge, discipline competence, and acceptance of responsibility; sealing work you did not control is a violation on its face.',
    'This chapter is exam preparation, not legal advice: every fact pattern is a hypothetical and the governing rules vary by jurisdiction.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 3 — ENGINEERING ECONOMICS  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

};

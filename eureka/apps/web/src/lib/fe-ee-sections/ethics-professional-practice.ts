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

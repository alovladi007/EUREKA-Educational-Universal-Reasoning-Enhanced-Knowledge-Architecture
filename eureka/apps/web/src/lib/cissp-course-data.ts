/**
 * Structured CISSP course content with sections, rich text, exam tips, and quizzes.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examTip?: string;
  importantNote?: string;
  quiz?: QuizQuestion[];
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

export const CISSP_COURSE: Record<string, TopicLesson> = {

cissp_governance: {
  topicId: 'cissp_governance',
  title: 'Security Governance',
  domainWeight: '16%',
  overview: `Security governance establishes the organizational framework for implementing and managing security. It defines how security decisions are made, who has authority, and how security aligns with business objectives.`,
  sections: [
    {
      id: 'gov-alignment',
      title: `Alignment of Security to Business Strategy`,
      content: `Security must not be viewed as a constraint on business operations but as an enabler that reduces risk while supporting business growth. This alignment involves understanding business drivers, competitive positioning, regulatory environment, and growth trajectory.

The Chief Information Security Officer (CISO) must translate business objectives into security requirements and metrics. Security governance frameworks like COBIT specifically address this alignment through "value delivery" principles.

**Key alignment elements:**
- Business drivers: Revenue growth, market share, cost reduction, innovation
- Strategic planning cycles: 3-5 year plans with annual reassessment
- Balanced scorecard approach: Linking security metrics to business KPIs
- Enterprise architecture: Integrating security into IT architecture planning
- Stakeholder communication: Regular reporting to C-suite and board`,
    },
    {
      id: 'gov-processes',
      title: `Organizational Processes`,
      content: `Organizations undergo structural changes including mergers and acquisitions, divestitures, reorganizations, and governance restructuring. Each creates significant security implications.

### Mergers and Acquisitions (M&A)

Pre-acquisition due diligence should assess the target's security posture, identify risks, and plan integration. Post-merger integration involves aligning security policies, consolidating security tools, managing redundant systems, and establishing unified governance.

**M&A security checklist:**
- Security assessment of target organization during due diligence
- Identification of conflicting policies, standards, and procedures
- Timeline for policy harmonization and tool consolidation
- Management of separate security teams and cultural differences
- Transition period risk management with temporary increased monitoring

### Governance Committees

A Security Steering Committee typically includes senior business and IT leaders who provide strategic direction. Risk committees oversee enterprise risk management. Compliance committees ensure adherence to regulatory requirements.`,
    },
    {
      id: 'gov-roles',
      title: `Organizational Roles and Responsibilities`,
      content: `Clear role definition is essential for effective security governance.

| Role | Responsibilities |
|---|---|
| **CEO/Executive Leadership** | Ultimate accountability; sets tone; allocates budget |
| **Board/Audit Committee** | Provides oversight; reviews risks; approves policies |
| **CISO** | Develops strategy; manages team; reports to executives |
| **Security Architect** | Designs infrastructure; aligns with business requirements |
| **SOC** | Monitors threats; responds to incidents; 24/7 coverage |
| **Compliance Officer** | Ensures regulatory compliance; manages audits |
| **Risk Manager** | Identifies and assesses risks; develops mitigation |
| **Data Owners** | Classify data; define access requirements; approve access |
| **System Owners** | Responsible for system security; implement controls |`,
      examTip: `The exam deliberately confuses risk appetite (strategic/board-level willingness to take risk), risk tolerance (tactical/operational acceptable deviation), and risk acceptance (a specific response to an identified risk). Appetite answers governance questions; tolerance answers operational questions; acceptance answers "what do we do about THIS risk?" questions.`,
    },
    {
      id: 'gov-frameworks',
      title: `Security Control Frameworks`,
      content: `Multiple frameworks provide structure for implementing security controls.

### NIST Cybersecurity Framework (CSF) and RMF

The NIST CSF organizes security into five core functions: Identify, Protect, Detect, Respond, and Recover. NIST RMF provides a seven-step process: Prepare, Categorize, Select, Implement, Assess, Authorize, and Monitor.

### ISO/IEC 27001 and 27002

ISO 27001 specifies requirements for an ISMS. Organizations can achieve certification. ISO 27002 provides best practices and implementation guidance.

### COBIT 2019

Enterprise governance framework covering IT governance, risk management, compliance, and value delivery.

### CIS Critical Security Controls

Prioritized set of 20 technical security controls based on real-world breach analysis.

| Framework | Primary Focus |
|---|---|
| **NIST CSF/RMF** | Core functions and risk management; federal mandate |
| **ISO 27001/27002** | ISMS establishment; international standard |
| **COBIT 2019** | Enterprise governance and IT alignment |
| **SABSA** | Architecture-driven security design |
| **CIS Controls** | Prioritized technical controls; breach prevention |`,
    },
    {
      id: 'gov-duecare',
      title: `Due Care and Due Diligence`,
      content: `**Due diligence** represents investigation and analysis of risks to understand the organization's security posture.

**Due care** means implementing reasonable and appropriate security measures once risks are identified.

Organizations that fail to implement due care can face liability. A company that conducts due diligence but fails to implement reasonable controls based on findings can be held negligent.`,
      importantNote: `Due diligence = investigation and discovery (what's wrong?). Due care = implementation of safeguards (fixing what's wrong). Both are necessary; neither alone is sufficient.`,
    },
  ],
  keyTakeaways: ["Security governance aligns security strategy with business objectives", "Frameworks like NIST, ISO, COBIT provide structure for implementation", "Due care (do) and due diligence (verify) are both required", "Risk appetite is strategic (board), tolerance is tactical (operations)", "Clear roles: CEO owns accountability, CISO executes strategy, board oversees"],
},

cissp_risk_mgmt: {
  topicId: 'cissp_risk_mgmt',
  title: 'Risk Management',
  domainWeight: '16%',
  overview: `Risk management is the process of identifying, analyzing, and responding to risks that could impact organizational objectives. It is a continuous process integrated into organizational decision-making.`,
  sections: [
    {
      id: 'risk-identification',
      title: `Risk Identification and Assessment`,
      content: `Risk identification discovers and documents risks through interviews, audit reviews, vulnerability assessments, regulatory analysis, industry trend analysis, and brainstorming.

### Quantitative Risk Analysis

Assigns numeric values to probability and impact:

| Metric | Formula | Description |
|---|---|---|
| **SLE** | AV x EF | Single Loss Expectancy — cost of one incident |
| **ALE** | SLE x ARO | Annualized Loss Expectancy — expected annual loss |
| **ROSI** | (ALE_before - ALE_after - cost) / cost | Return on Security Investment |

**Worked Example:** A web server worth $500,000 with 40% exposure factor and 0.5 ARO:
- SLE = $500,000 x 0.40 = $200,000
- ALE = $200,000 x 0.5 = $100,000/year

### Qualitative Risk Analysis

Uses descriptive scales (Low/Medium/High or 1-5) in a risk matrix. Faster but less defensible than quantitative.`,
      examTip: `Master ALE = SLE x ARO, where SLE = AV x EF. Know the four risk responses: avoid, transfer, mitigate, accept.`,
      quiz: [
        {
          question: `An organization calculates a threat has SLE of $200,000 and ARO of 0.5. What is the ALE?`,
          options: ["$100,000", "$200,000", "$400,000", "$500,000"],
          correctIndex: 0,
          explanation: `ALE = SLE x ARO = $200,000 x 0.5 = $100,000.`,
        },
        {
          question: `Which risk response eliminates the activity creating the risk?`,
          options: ["Risk acceptance", "Risk avoidance", "Risk transfer", "Risk mitigation"],
          correctIndex: 1,
          explanation: `Risk avoidance discontinues the activity entirely.`,
        },
      ],
    },
    {
      id: 'risk-treatment',
      title: `Risk Treatment and Response`,
      content: `Four primary risk treatment options:

1. **Risk Avoidance** — Eliminate the activity causing the risk
2. **Risk Transfer** — Shift financial consequence to another party (insurance, contracts)
3. **Risk Mitigation** — Implement controls to reduce likelihood or impact
4. **Risk Acceptance** — Acknowledge and document the risk with management sign-off`,
      importantNote: `Treatment order: Mitigate to appetite, Transfer residual, Accept what remains, Avoid if above capacity. "Ignore" is NEVER valid.`,
    },
    {
      id: 'risk-frameworks',
      title: `Risk Management Frameworks`,
      content: `| Framework | Focus |
|---|---|
| **NIST RMF (SP 800-37)** | 7-step process: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor |
| **ISO 31000** | Generic enterprise risk management |
| **OCTAVE** | Asset-driven, workshop-based |
| **FAIR** | Quantitative: Loss Event Frequency x Loss Magnitude |

### Risk Appetite vs Risk Tolerance vs Risk Capacity

- **Risk Appetite** (STRATEGIC): Set by the board. How much risk to pursue.
- **Risk Tolerance** (TACTICAL): Operational boundaries and limits.
- **Risk Capacity** (ABSOLUTE): Maximum risk before organizational failure.`,
      examTip: `The exam WILL confuse risk appetite and risk tolerance. Appetite = STRATEGIC (board), tolerance = TACTICAL (operational).`,
    },
    {
      id: 'threat-modeling',
      title: `Threat Modeling`,
      content: `Major threat modeling methodologies:

- **STRIDE** — Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege
- **PASTA** — 7-stage risk-centric methodology
- **DREAD** — Damage, Reproducibility, Exploitability, Affected users, Discoverability
- **VAST** — Visual, Agile, Simple Threat modeling

Attack trees visualize attack paths. Root = goal; branches = methods; leaves = specific attacks.`,
      quiz: [
        {
          question: `Which methodology categorizes threats as Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege?`,
          options: ["PASTA", "STRIDE", "DREAD", "VAST"],
          correctIndex: 1,
          explanation: `STRIDE uses these six categories. PASTA is 7-stage. DREAD is scoring. VAST is agile.`,
        },
      ],
    },
  ],
  keyTakeaways: ["ALE = SLE x ARO is the core quantitative risk formula", "Four risk treatments: Avoid, Transfer, Mitigate, Accept", "Risk appetite (board strategy) differs from risk tolerance (operational)", "Threat modeling identifies threats at design time", "Residual risk must be documented and formally accepted"],
},

cissp_compliance: {
  topicId: 'cissp_compliance',
  title: 'Compliance & Legal',
  domainWeight: '16%',
  overview: `Organizations operate within a complex web of regulatory requirements. Non-compliance can result in financial penalties, loss of licenses, and reputational damage.`,
  sections: [
    {
      id: 'regulations',
      title: `Key Regulations`,
      content: `### GDPR
- Applies to any organization processing EU resident data regardless of location
- 72-hour breach notification to supervisory authority
- Penalties up to 20M EUR or 4% of annual global revenue
- Individual rights: access, rectification, erasure, portability

### HIPAA
- Applies to covered entities and business associates handling PHI
- Administrative, physical, and technical safeguards required

### SOX
- Applies to publicly traded companies
- Section 302: CEO/CFO certification; Section 404: Internal controls

### PCI-DSS
- Payment card data; 12 core requirements; contractual standard

### Others: GLBA (finance), FERPA (education), CCPA/CPRA (California)`,
      examTip: `GDPR = EU data, HIPAA = healthcare, SOX = public companies, PCI-DSS = payment cards, GLBA = financial institutions.`,
      quiz: [
        {
          question: `A company processes personal data of EU residents. Which regulation applies?`,
          options: ["HIPAA", "GDPR", "SOX", "PCI-DSS"],
          correctIndex: 1,
          explanation: `GDPR applies to any organization processing EU resident data, regardless of location.`,
        },
      ],
    },
    {
      id: 'ip-law',
      title: `Intellectual Property`,
      content: `| IP Type | Duration | Key Requirement |
|---|---|---|
| **Copyright** | Life + 70 years | Automatic upon creation |
| **Trademark** | Indefinite (renewable) | Ongoing use and enforcement |
| **Patent** | 20 years from filing | Novel invention |
| **Trade Secret** | Indefinite | Reasonable secrecy efforts |`,
    },
    {
      id: 'ethics',
      title: `Professional Ethics`,
      content: `### (ISC)2 Code of Ethics - Four Canons in Priority Order:
1. Protect society and the infrastructure
2. Act honorably, honestly, justly, responsibly, and legally
3. Provide diligent and competent service to principals
4. Advance and protect the profession

Canon I always wins when canons conflict.`,
    },
    {
      id: 'policy-hierarchy',
      title: `Policies, Standards, Procedures, Guidelines`,
      content: `| Document | Purpose |
|---|---|
| **Policy** | High-level objectives; mandatory |
| **Standard** | Specific technical requirements; mandatory |
| **Baseline** | Minimum configuration; mandatory |
| **Procedure** | Step-by-step instructions; mandatory |
| **Guideline** | Recommendations; discretionary |`,
      examTip: `Policies = principles, Standards = requirements, Baselines = configurations, Procedures = step-by-step, Guidelines = recommendations (only non-mandatory).`,
    },
  ],
  keyTakeaways: ["GDPR applies globally to EU resident data", "Copyright is automatic; trademarks require ongoing enforcement", "Ethics: Society > Honor > Service > Profession", "Policies are mandatory; guidelines are discretionary"],
},

cissp_bcdr: {
  topicId: 'cissp_bcdr',
  title: 'Business Continuity & DR',
  domainWeight: '16%',
  overview: `Business continuity ensures organizations continue operations during disruptions. Disaster recovery focuses on restoring IT systems.`,
  sections: [
    {
      id: 'bia',
      title: `Business Impact Analysis`,
      content: `| Metric | Meaning |
|---|---|
| **MTD** | Maximum Tolerable Downtime |
| **RTO** | Recovery Time Objective |
| **RPO** | Recovery Point Objective |
| **WRT** | Work Recovery Time |

**Critical formula: MTD >= RTO + WRT**`,
      quiz: [
        {
          question: `MTD is 48 hours. What should the RTO be?`,
          options: ["Greater than 48 hours", "Equal to or less than 48 hours", "Twice the MTD", "Set by vendor"],
          correctIndex: 1,
          explanation: `RTO must be <= MTD to allow time for WRT.`,
        },
      ],
    },
    {
      id: 'recovery-sites',
      title: `Recovery Sites`,
      content: `| Site | Time | Cost |
|---|---|---|
| **Cold** | Days-weeks | Low |
| **Warm** | Hours-days | Medium |
| **Hot** | Minutes | High |
| **Cloud DR** | Minutes | Variable |

**3-2-1-1-0 Rule**: 3 copies, 2 media, 1 offsite, 1 immutable, 0 errors`,
    },
    {
      id: 'testing',
      title: `BCP/DR Testing`,
      content: `Least to most disruptive:
1. Checklist
2. Tabletop
3. Walkthrough
4. Simulation
5. Parallel
6. Full Interruption`,
      examTip: `Full interruption = highest confidence + highest risk. Parallel = most realistic while preserving production.`,
    },
  ],
  keyTakeaways: ["MTD >= RTO + WRT", "Hot sites recover in minutes; cold sites in weeks", "Personnel safety is ALWAYS first"],
},

cissp_personnel: {
  topicId: 'cissp_personnel',
  title: 'Personnel Security',
  domainWeight: '16%',
  overview: `Personnel security encompasses hiring, managing, and separating employees to reduce insider threat risk.`,
  sections: [
    {
      id: 'controls',
      title: `Key Personnel Security Controls`,
      content: `| Control | Purpose |
|---|---|
| **Separation of Duties** | No single person completes critical transactions |
| **Job Rotation** | Detects fraud; prevents collusion |
| **Mandatory Vacation** | Forces absence; hidden schemes surface |
| **Least Privilege** | Minimum access for job function |
| **Dual Control** | Two people cooperate for sensitive actions |

### Termination
- Involuntary: Revoke access BEFORE notification
- Voluntary: Monitor during notice; planned revocation`,
      examTip: `SoD prevents fraud; mandatory vacation detects it. Involuntary termination = immediate access revocation.`,
      quiz: [
        {
          question: `Most critical step when terminating an employee with sensitive data access?`,
          options: ["Collecting laptop", "Revoking all system access", "Exit documentation", "Final paycheck"],
          correctIndex: 1,
          explanation: `Revoking access is most critical. Must happen immediately for involuntary terminations.`,
        },
      ],
    },
  ],
  keyTakeaways: ["SoD prevents fraud; rotation and vacation detect it", "Involuntary termination: revoke access before notification", "Least privilege + need to know + separation of duties"],
},

};

export function getCISSPCourseContent(topicId: string): TopicLesson | null {
  return CISSP_COURSE[topicId] || null;
}

export function hasCISSPCourseContent(topicId: string): boolean {
  return topicId in CISSP_COURSE;
}

/**
 * Structured CISSP course content with sections, rich text, exam tips, and quizzes.
 * Maps to topic IDs from exam-curriculum.ts.
 *
 * Content structure: each topic has multiple sections, each section has
 * markdown content, optional exam tips, and optional quiz questions.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;       // Markdown content
  examTip?: string;      // Optional exam tip box
  importantNote?: string; // Optional important note box
  quiz?: QuizQuestion[]; // Optional inline quiz
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

/**
 * Full course content for all 29 CISSP topics.
 * Each topic contains multiple sections with rich content and quizzes.
 */
export const CISSP_COURSE: Record<string, TopicLesson> = {

// ══════════════════════════════════════════════════════════════
// DOMAIN 1 — Security & Risk Management (16%)
// ══════════════════════════════════════════════════════════════

cissp_governance: {
  topicId: 'cissp_governance',
  title: 'Security Governance',
  domainWeight: '16%',
  overview: 'Security governance establishes the organizational framework for implementing and managing security. It defines how security decisions are made, who has authority, and how security aligns with business objectives.',
  sections: [
    {
      id: 'gov-alignment',
      title: 'Alignment of Security to Business Strategy',
      content: \`Security must not be viewed as a constraint on business operations but as an enabler that reduces risk while supporting business growth. This alignment involves understanding business drivers, competitive positioning, regulatory environment, and growth trajectory.

The Chief Information Security Officer (CISO) must translate business objectives into security requirements and metrics. Security governance frameworks like COBIT specifically address this alignment through "value delivery" principles.

**Key alignment elements:**
- Business drivers: Revenue growth, market share, cost reduction, innovation
- Strategic planning cycles: 3-5 year plans with annual reassessment
- Balanced scorecard approach: Linking security metrics to business KPIs
- Enterprise architecture: Integrating security into IT architecture planning
- Stakeholder communication: Regular reporting to C-suite and board\`,
    },
    {
      id: 'gov-processes',
      title: 'Organizational Processes',
      content: \`Organizations undergo structural changes including mergers and acquisitions, divestitures, reorganizations, and governance restructuring. Each creates significant security implications.

### Mergers and Acquisitions (M&A)

Pre-acquisition due diligence should assess the target's security posture, identify risks, and plan integration. Post-merger integration involves aligning security policies, consolidating security tools, managing redundant systems, and establishing unified governance.

**M&A security checklist:**
- Security assessment of target organization during due diligence
- Identification of conflicting policies, standards, and procedures
- Timeline for policy harmonization and tool consolidation
- Management of separate security teams and cultural differences
- Transition period risk management with temporary increased monitoring

### Governance Committees

A Security Steering Committee typically includes senior business and IT leaders who provide strategic direction. Risk committees oversee enterprise risk management. Compliance committees ensure adherence to regulatory requirements.\`,
    },
    {
      id: 'gov-roles',
      title: 'Organizational Roles and Responsibilities',
      content: \`Clear role definition is essential for effective security governance.

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
| **System Owners** | Responsible for system security; implement controls |\`,
      examTip: 'The exam deliberately confuses risk appetite (strategic/board-level willingness to take risk), risk tolerance (tactical/operational acceptable deviation), and risk acceptance (a specific response to an identified risk). Appetite answers governance questions; tolerance answers operational questions; acceptance answers "what do we do about THIS risk?" questions.',
    },
    {
      id: 'gov-frameworks',
      title: 'Security Control Frameworks',
      content: \`Multiple frameworks provide structure for implementing security controls.

### NIST Cybersecurity Framework (CSF) and RMF

The NIST CSF organizes security into five core functions: Identify, Protect, Detect, Respond, and Recover. NIST RMF provides a seven-step process: Prepare, Categorize, Select, Implement, Assess, Authorize, and Monitor.

### ISO/IEC 27001 and 27002

ISO 27001 specifies requirements for an ISMS. Organizations can achieve certification. ISO 27002 provides best practices and implementation guidance.

### COBIT 2019

Enterprise governance framework covering IT governance, risk management, compliance, and value delivery. Emphasizes alignment of IT with business strategy.

### CIS Critical Security Controls

Prioritized set of 20 technical security controls based on real-world breach analysis.

| Framework | Primary Focus |
|---|---|
| **NIST CSF/RMF** | Core functions and risk management; federal mandate |
| **ISO 27001/27002** | ISMS establishment; international standard |
| **COBIT 2019** | Enterprise governance and IT alignment |
| **SABSA** | Architecture-driven security design |
| **CIS Controls** | Prioritized technical controls; breach prevention |\`,
    },
    {
      id: 'gov-duecare',
      title: 'Due Care and Due Diligence',
      content: \`**Due diligence** represents investigation and analysis of risks to understand the organization's security posture.

**Due care** means implementing reasonable and appropriate security measures once risks are identified.

Organizations that fail to implement due care can face liability. A company that conducts due diligence but fails to implement reasonable controls based on findings can be held negligent.\`,
      importantNote: 'Due diligence = investigation and discovery (what\'s wrong?). Due care = implementation of safeguards (fixing what\'s wrong). Both are necessary; neither alone is sufficient.',
    },
  ],
  keyTakeaways: [
    'Security governance aligns security strategy with business objectives',
    'Frameworks like NIST, ISO, COBIT provide structure for implementation',
    'Due care (do) and due diligence (verify) are both required',
    'Risk appetite is strategic (board), tolerance is tactical (operations)',
    'Clear roles: CEO owns accountability, CISO executes strategy, board oversees',
  ],
},

cissp_risk_mgmt: {
  topicId: 'cissp_risk_mgmt',
  title: 'Risk Management',
  domainWeight: '16%',
  overview: 'Risk management is the process of identifying, analyzing, and responding to risks that could impact organizational objectives. It is a continuous process integrated into organizational decision-making at all levels.',
  sections: [
    {
      id: 'risk-identification',
      title: 'Risk Identification and Assessment',
      content: \`Risk identification discovers and documents risks through interviews, audit reviews, vulnerability assessments, regulatory analysis, industry trend analysis, and brainstorming. A risk register documents identified risks with sources, impacts, and mitigation ideas.

### Quantitative Risk Analysis

Assigns numeric values to probability and impact:

| Metric | Formula | Description |
|---|---|---|
| **SLE** | AV × EF | Single Loss Expectancy — cost of one incident |
| **ALE** | SLE × ARO | Annualized Loss Expectancy — expected annual loss |
| **ROSI** | (ALE_before − ALE_after − cost) / cost | Return on Security Investment |

**Worked Example:** A web server worth \\$500,000 with 40% exposure factor and 0.5 ARO:
- SLE = \\$500,000 × 0.40 = \\$200,000
- ALE = \\$200,000 × 0.5 = \\$100,000/year
- A safeguard costing \\$50,000/year reducing ALE to \\$20,000:
- Net benefit = \\$100,000 − \\$20,000 − \\$50,000 = \\$30,000

### Qualitative Risk Analysis

Uses descriptive scales (Low/Medium/High or 1-5) in a risk matrix. Faster but less defensible than quantitative.\`,
      examTip: 'Master ALE = SLE × ARO, where SLE = AV × EF. Know the four risk responses: avoid, transfer, mitigate, accept. Understand residual risk = total risk - impact of controls.',
      quiz: [
        {
          question: 'Using quantitative risk analysis, an organization calculates a threat has SLE of $200,000 and ARO of 0.5. What is the ALE?',
          options: ['$100,000', '$200,000', '$400,000', '$500,000'],
          correctIndex: 0,
          explanation: 'ALE = SLE × ARO = $200,000 × 0.5 = $100,000. This means expect to lose $100,000 annually from this risk.',
        },
        {
          question: 'Which risk response eliminates the activity creating the risk?',
          options: ['Risk acceptance', 'Risk avoidance', 'Risk transfer', 'Risk mitigation'],
          correctIndex: 1,
          explanation: 'Risk avoidance discontinues the activity creating the risk entirely. Transfer shifts consequence; mitigation reduces impact; acceptance acknowledges risk.',
        },
      ],
    },
    {
      id: 'risk-treatment',
      title: 'Risk Treatment and Response',
      content: \`Four primary risk treatment options:

1. **Risk Avoidance** — Eliminate the activity causing the risk. Not always feasible.
2. **Risk Transfer** — Shift financial consequence to another party (insurance, contracts). Cannot transfer accountability.
3. **Risk Mitigation** — Implement controls to reduce likelihood or impact. Most common response.
4. **Risk Acceptance** — Acknowledge and document the risk. Requires formal management sign-off.

**Risk acceptance** must be documented with explanation and periodically reviewed. It should only be for low-impact risks or when mitigation costs exceed potential impact.\`,
      importantNote: 'Risk treatment order: Mitigate to appetite → Transfer residual → Accept what remains → Avoid if above capacity. "Ignore" is NEVER a valid treatment.',
    },
    {
      id: 'risk-frameworks',
      title: 'Risk Management Frameworks',
      content: \`| Framework | Focus |
|---|---|
| **NIST RMF (SP 800-37)** | 7-step process: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor |
| **ISO 31000** | Generic enterprise risk management guidance |
| **OCTAVE** | Asset-driven, workshop-based from Carnegie Mellon |
| **FAIR** | Quantitative: Loss Event Frequency × Loss Magnitude |
| **NIST SP 800-30** | Guide for conducting risk assessments |

### Risk Appetite vs Risk Tolerance vs Risk Capacity

- **Risk Appetite** (STRATEGIC): How much risk the organization is willing to pursue. Set by the board.
- **Risk Tolerance** (TACTICAL): Acceptable variation from appetite. Operational boundaries.
- **Risk Capacity** (ABSOLUTE): Maximum risk the organization can absorb before failure.\`,
      examTip: 'The exam WILL confuse risk appetite and risk tolerance. Remember: appetite = STRATEGIC (board-level, qualitative), tolerance = TACTICAL (operational boundaries, quantitative).',
    },
    {
      id: 'threat-modeling',
      title: 'Threat Modeling',
      content: \`Threat modeling identifies threats early in the design process. Major methodologies:

- **STRIDE** — Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege
- **PASTA** — 7-stage risk-centric methodology with business alignment
- **DREAD** — Damage, Reproducibility, Exploitability, Affected users, Discoverability (scoring model)
- **VAST** — Visual, Agile, Simple Threat modeling for agile development

### Attack Trees
Visual representation of attack paths. Root = attacker goal; branches = methods; leaves = specific attacks. Can be annotated with probability and cost for prioritization.\`,
      quiz: [
        {
          question: 'Which threat modeling methodology categorizes threats as Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege?',
          options: ['PASTA', 'STRIDE', 'DREAD', 'VAST'],
          correctIndex: 1,
          explanation: 'STRIDE categorizes threats using these six categories. PASTA is a 7-stage process. DREAD is a scoring model. VAST is for agile environments.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'ALE = SLE × ARO is the core quantitative risk formula',
    'Four risk treatments: Avoid, Transfer, Mitigate, Accept',
    'Risk appetite (board strategy) differs from risk tolerance (operational)',
    'Threat modeling identifies threats at design time — cheaper than fixing later',
    'Residual risk must be documented and formally accepted',
  ],
},

cissp_compliance: {
  topicId: 'cissp_compliance',
  title: 'Compliance & Legal',
  domainWeight: '16%',
  overview: 'Organizations operate within a complex web of regulatory requirements. Non-compliance can result in financial penalties, loss of licenses, and reputational damage.',
  sections: [
    {
      id: 'regulations',
      title: 'Key Regulations',
      content: \`### GDPR (General Data Protection Regulation)
- Applies to any organization processing EU resident data regardless of location
- 72-hour breach notification to supervisory authority
- Penalties up to €20M or 4% of annual global revenue
- Individual rights: access, rectification, erasure, portability

### HIPAA
- Applies to covered entities and business associates handling PHI
- Administrative, physical, and technical safeguards required
- Breach notification required for 500+ individuals

### SOX (Sarbanes-Oxley)
- Applies to publicly traded companies
- Section 302: CEO/CFO certification of financial reports
- Section 404: Assessment of internal controls

### PCI-DSS
- Applies to organizations handling payment card data
- 12 core requirements across 6 categories
- Contractual standard, not statutory

### Other: GLBA (finance), FERPA (education), CCPA/CPRA (California), FISMA (federal)\`,
      examTip: 'Know which regulation applies to which scenario: GDPR = EU data, HIPAA = healthcare, SOX = public companies, PCI-DSS = payment cards, GLBA = financial institutions.',
      quiz: [
        {
          question: 'A company processes personal data of EU residents through cloud infrastructure. Which regulation applies?',
          options: ['HIPAA', 'GDPR', 'SOX', 'PCI-DSS'],
          correctIndex: 1,
          explanation: 'GDPR applies to any organization processing personal data of EU residents, regardless of location. HIPAA is healthcare; SOX is public companies; PCI-DSS is payment cards.',
        },
        {
          question: 'What is the maximum GDPR fine for serious violations?',
          options: ['€10M or 2% of revenue', '€20M or 4% of revenue', '€50M flat', '$7,500 per violation'],
          correctIndex: 1,
          explanation: 'GDPR Article 83(5) establishes the higher tier at up to €20M or 4% of global annual turnover, whichever is higher.',
        },
      ],
    },
    {
      id: 'ip-law',
      title: 'Intellectual Property',
      content: \`| IP Type | Duration | Key Requirement |
|---|---|---|
| **Copyright** | Life + 70 years | Automatic upon creation; original work |
| **Trademark** | Indefinite (renewable) | Ongoing use and enforcement |
| **Patent** | 20 years from filing | Novel invention; published |
| **Trade Secret** | Indefinite | Reasonable secrecy efforts; economic value |

### Export Controls
- **EAR**: Controls commercial/dual-use items including encryption
- **ITAR**: Controls defense articles and technical data
- **Wassenaar Arrangement**: Multilateral export control coordination\`,
    },
    {
      id: 'ethics',
      title: 'Professional Ethics',
      content: \`### (ISC)² Code of Professional Ethics — Four Canons in Priority Order:
1. **Protect society**, the common good, necessary public trust and confidence, and the infrastructure
2. **Act honorably**, honestly, justly, responsibly, and legally
3. **Provide diligent and competent service** to principals
4. **Advance and protect the profession**

Canon I always wins when canons conflict. When employer interests conflict with public safety, public safety takes precedence.\`,
    },
    {
      id: 'policy-hierarchy',
      title: 'Policies, Standards, Procedures, Guidelines',
      content: \`| Document | Scope & Purpose |
|---|---|
| **Policy** | High-level objectives; what must be done (mandatory) |
| **Standard** | Specific technical requirements; how to implement (mandatory) |
| **Baseline** | Minimum required configuration for a system type (mandatory) |
| **Procedure** | Step-by-step instructions; how to perform a task (mandatory) |
| **Guideline** | Recommendations; suggestions for good practice (discretionary) |

Policies are technology-independent and change rarely. Standards are technology-specific and change with technology. Guidelines are the only non-mandatory document.\`,
      examTip: 'Questions often test policy lifecycle and document types. Remember: Policies = principles/rules, Standards = specific requirements, Baselines = configurations, Procedures = step-by-step, Guidelines = recommendations.',
    },
  ],
  keyTakeaways: [
    'GDPR applies globally to EU resident data with 72-hour notification and 4% revenue penalties',
    'HIPAA covers healthcare PHI; PCI-DSS covers payment cards; SOX covers public companies',
    'Copyright is automatic; trademarks require ongoing enforcement; patents last 20 years',
    '(ISC)² Ethics: Society > Honor > Service > Profession',
    'Policies are mandatory and technology-independent; guidelines are discretionary',
  ],
},

cissp_bcdr: {
  topicId: 'cissp_bcdr',
  title: 'Business Continuity & DR',
  domainWeight: '16%',
  overview: 'Business continuity ensures organizations continue operations during disruptions. Disaster recovery focuses on restoring IT systems. Both require planning, testing, and maintenance.',
  sections: [
    {
      id: 'bia',
      title: 'Business Impact Analysis (BIA)',
      content: \`The BIA identifies critical business functions and quantifies disruption impact.

### Key Metrics

| Metric | Meaning |
|---|---|
| **MTD** | Maximum Tolerable Downtime — business survival limit |
| **RTO** | Recovery Time Objective — target to restore service |
| **RPO** | Recovery Point Objective — max acceptable data loss |
| **WRT** | Work Recovery Time — verify and resume after technical recovery |

**Critical formula: MTD ≥ RTO + WRT**

If RTO + WRT exceeds MTD, the recovery plan is infeasible.\`,
      quiz: [
        {
          question: 'During a BIA, MTD is determined to be 48 hours. What should the RTO be?',
          options: ['Equal to or greater than 48 hours', 'Equal to or less than 48 hours', 'Twice the MTD', 'Set by the vendor'],
          correctIndex: 1,
          explanation: 'RTO must be ≤ MTD. If MTD is 48 hours, RTO should be shorter to allow time for WRT before hitting the MTD deadline.',
        },
      ],
    },
    {
      id: 'recovery-sites',
      title: 'Recovery Sites and Strategies',
      content: \`| Site Type | Setup Time | Cost | Best For |
|---|---|---|---|
| **Cold Site** | 1-2 weeks | Low | Long RTO; cost-sensitive |
| **Warm Site** | 4-24 hours | Medium | Balance of cost and speed |
| **Hot Site** | Minutes | High | Critical systems; RTO < 1 hour |
| **Mobile Site** | Hours | Medium | Temporary solution |
| **Cloud DR** | Minutes | Variable | Scalable, on-demand |

### Backup Types
- **Full**: Complete copy; slowest to create, fastest to restore
- **Incremental**: Changes since last backup; fast create, slow restore
- **Differential**: Changes since last full; middle ground

**3-2-1-1-0 Rule**: 3 copies, 2 media, 1 offsite, 1 immutable, 0 errors verified\`,
    },
    {
      id: 'testing',
      title: 'BCP/DR Testing',
      content: \`Testing types from least to most disruptive:

1. **Checklist** — Paper verification of plan completeness
2. **Tabletop** — Discussion-based scenario walkthrough
3. **Walkthrough** — Detailed step-by-step review with SMEs
4. **Simulation** — Partial execution in controlled environment
5. **Parallel** — Full execution at DR site; primary continues
6. **Full Interruption** — Shut down primary; force real failover\`,
      examTip: 'Full interruption testing provides highest confidence but highest risk. Parallel testing is most realistic while preserving production. Tabletop is lowest cost.',
      quiz: [
        {
          question: 'Which DR testing method provides highest confidence but creates highest risk?',
          options: ['Tabletop exercise', 'Walkthrough testing', 'Full interruption testing', 'Simulation testing'],
          correctIndex: 2,
          explanation: 'Full interruption testing shuts down primary and forces real failover. Highest confidence but highest risk if something fails. Tabletop is lowest risk.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'BIA is the foundation of all continuity planning',
    'MTD ≥ RTO + WRT — the critical recovery formula',
    'Hot sites recover in minutes; cold sites in weeks',
    'Personnel safety is ALWAYS first in a disaster',
    'Test types: Checklist → Tabletop → Walkthrough → Simulation → Parallel → Full Interruption',
  ],
},

cissp_personnel: {
  topicId: 'cissp_personnel',
  title: 'Personnel Security',
  domainWeight: '16%',
  overview: 'Personnel security encompasses all practices related to hiring, managing, and separating employees. Strong controls reduce insider threat risk, data theft, and policy violations.',
  sections: [
    {
      id: 'hiring',
      title: 'Screening, Hiring, and Onboarding',
      content: \`### Background Investigations
- Basic: employment, education, criminal history
- Enhanced: references, credit, comprehensive criminal
- Security clearances: extensive investigation for government/defense

### Employment Agreements
- Confidentiality/NDA agreements
- Non-compete agreements
- Acceptable use policies
- IP ownership clauses

### Onboarding
- Mandatory security awareness training
- Least-privilege access provisioning
- Policy acknowledgment\`,
    },
    {
      id: 'controls',
      title: 'Key Personnel Security Controls',
      content: \`| Control | Purpose |
|---|---|
| **Separation of Duties** | No single person completes critical transactions end-to-end |
| **Job Rotation** | Detects fraud; prevents long-term collusion |
| **Mandatory Vacation** | Forces extended absence; hidden schemes surface |
| **Least Privilege** | Minimum access for job function |
| **Need to Know** | Information limited to task requirements |
| **Dual Control** | Two people must cooperate for sensitive actions |

### Termination
- Involuntary: Revoke access BEFORE notification; escort out
- Voluntary: Monitor during notice period; planned revocation
- Exit interview owned by HR with security participation\`,
      examTip: 'Separation of duties prevents fraud; mandatory vacation detects it. Involuntary termination = immediate access revocation. Voluntary = graceful with monitoring.',
      quiz: [
        {
          question: 'Which control requires employees to periodically change positions to detect unauthorized activities?',
          options: ['Separation of duties', 'Job rotation', 'Mandatory vacation', 'Least privilege'],
          correctIndex: 1,
          explanation: 'Job rotation moves employees between roles, making hidden fraud or collusion unsustainable. Mandatory vacation forces time away; SoD splits responsibilities.',
        },
        {
          question: 'The most critical step in terminating an employee with access to sensitive data?',
          options: ['Collecting laptop and badge', 'Revoking all system access and credentials', 'Signing exit documentation', 'Processing final paycheck'],
          correctIndex: 1,
          explanation: 'Revoking access is the most critical security step. Must happen immediately for involuntary terminations. Other steps are important but secondary.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Background checks calibrated to role sensitivity',
    'SoD prevents fraud; rotation and vacation detect it',
    'Involuntary termination: revoke access before notification',
    'Third-party personnel require contractual security clauses',
    'Least privilege + need to know + separation of duties = core access principles',
  ],
},

};


/**
 * Get full course content for a topic.
 */
export function getCISSPCourseContent(topicId: string): TopicLesson | null {
  return CISSP_COURSE[topicId] || null;
}

/**
 * Check if rich course content exists for a topic.
 */
export function hasCISSPCourseContent(topicId: string): boolean {
  return topicId in CISSP_COURSE;
}

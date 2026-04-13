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


cissp_data_class: {
  topicId: 'cissp_data_class',
  title: `Data Classification & Handling`,
  domainWeight: '10%',
  overview: `Asset classification assigns sensitivity levels to information based on value and risk. Classification provides the foundation for implementing appropriate security controls.`,
  sections: [
    {
      id: 'd2-classification',
      title: `Classification Schemes`,
      content: `### Government Classification
- **Top Secret**: Exceptionally grave damage to national security
- **Secret**: Serious damage to national security
- **Confidential**: Damage to national security
- **Unclassified**: Does not meet classification criteria

### Commercial Classification
- **Confidential/Restricted**: Severe business harm if disclosed
- **Private/Internal**: Moderate impact if disclosed
- **Sensitive**: Notable impact if disclosed
- **Public**: No confidentiality requirements

**High-water mark principle**: A collection inherits the highest classification of any element it contains.`,
      examTip: `Data OWNER (business executive) decides classification. Data CUSTODIAN (IT staff) implements controls. If an answer puts IT in charge of classification, it is wrong.`,
      quiz: [
        {
          question: `What is the primary difference between a Data Owner and Data Custodian?`,
          options: ["Data Owner implements controls; Custodian classifies", "Data Owner classifies and sets access; Custodian implements technical controls", "They are interchangeable terms", "Custodian manages physical security; Owner manages encryption"],
          correctIndex: 1,
          explanation: `Data Owner determines classification and access requirements. Data Custodian implements and maintains the technical security controls.`,
        },
      ],
    },
    {
      id: 'd2-roles',
      title: `Data Roles and Responsibilities`,
      content: `| Role | Responsibilities |
|---|---|
| **Data Owner** | Classification, access decisions, retention, destruction authorization |
| **Data Custodian** | Implements controls, manages encryption/backups, enforces access |
| **Data Steward** | Data quality, metadata, documentation, business rules |
| **System Owner** | System security controls, patching, availability |
| **Business Owner** | Business requirements, security investment priorities |

### GDPR Roles
| Controller | Processor |
|---|---|
| Determines purposes and means of processing | Processes on controller's instructions |
| Responsible for legal compliance | Assists controller in compliance |
| Responds to data subject requests | Supports controller's responses |`,
    },
    {
      id: 'd2-states',
      title: `Data States and Protection`,
      content: `### Three Data States
| State | Threats | Controls |
|---|---|---|
| **At Rest** | Unauthorized access, theft | Encryption (AES-256, TDE), access controls |
| **In Transit** | Eavesdropping, MITM | TLS/SSL, IPsec VPN, SFTP, SSH |
| **In Use** | Malware, copy/paste, session hijack | Application controls, DLP, memory protection, TEE |

### Data Loss Prevention (DLP)
- **Network DLP**: Monitors traffic for sensitive data patterns
- **Endpoint DLP**: Controls USB, clipboard, printing
- **Cloud DLP**: Integrated with SaaS (Microsoft 365, Google Workspace)`,
      examTip: `The exam heavily tests three data states. If it involves data stored on disk = at rest. Moving across network = in transit. Being processed by an application = in use.`,
    },
    {
      id: 'd2-sanitization',
      title: `Data Sanitization (NIST SP 800-88)`,
      content: `| Method | Technique | Recovery | Use Case |
|---|---|---|---|
| **Clear** | Overwrite | Not by standard tools | Reuse within organization |
| **Purge** | Crypto-erase, degauss | Not by lab techniques | Media leaving organization |
| **Destroy** | Shred, incinerate | Impossible | Classified/highest sensitivity |

**Key facts:**
- SSD crypto-erase = Purge (when properly implemented)
- Degaussing does NOT work on SSDs (no magnetic media)
- Delete != Clear (delete only unlinks file entry)
- Reformat != Clear (rewrites filesystem table only)`,
      examTip: `For classified government data, Destroy is the ONLY approved method. Know Clear vs Purge vs Destroy.`,
      quiz: [
        {
          question: `Which sanitization method is approved for classified government information?`,
          options: ["Clearing with single-pass overwrite", "Purging with DoD 7-pass", "Physical destruction", "Degaussing only"],
          correctIndex: 2,
          explanation: `NIST SP 800-88 requires physical destruction for classified data. Clear is for reuse; Purge for media leaving org.`,
        },
      ],
    },
    {
      id: 'd2-lifecycle',
      title: `Data Lifecycle Management`,
      content: `Six lifecycle phases with controls at each:

1. **Create**: Classification, ownership assignment, initial access controls
2. **Store**: Encryption at rest, access controls, physical security, monitoring
3. **Use**: Authentication, authorization, auditing, DLP
4. **Share**: Encryption in transit, secure channels, recipient verification
5. **Archive**: Retention scheduling, encryption, indexing, availability
6. **Destroy**: Sanitization per NIST 800-88, documentation, verification

### Retention
- Legal holds ALWAYS override normal retention
- Longest applicable obligation = minimum retention
- Shortest data-minimization obligation = maximum`,
    },
  ],
  keyTakeaways: ["Owner classifies; custodian implements", "Three states: at rest, in transit, in use", "NIST 800-88: Clear, Purge, Destroy", "Lifecycle: Create, Store, Use, Share, Archive, Destroy"],
},

cissp_privacy: {
  topicId: 'cissp_privacy',
  title: `Privacy Protection`,
  domainWeight: '10%',
  overview: `Privacy is the right of individuals to control their personal information. Privacy protection is both a regulatory obligation and ethical responsibility.`,
  sections: [
    {
      id: 'd2-privacy-types',
      title: `Personal Data Types and Privacy Principles`,
      content: `### PII (Personally Identifiable Information)
Name, address, SSN, biometric data, financial accounts

### PHI (Protected Health Information)
Medical records, health insurance, billing, mental health, genetic info

### Privacy Principles
- **Collection Limitation**: Only collect with clear purposes
- **Data Minimization**: Collect minimum required
- **Purpose Limitation**: Don't repurpose without consent
- **Storage Limitation**: Don't retain longer than necessary
- **Privacy by Design**: Integrate privacy from inception`,
      quiz: [
        {
          question: `Which privacy principle restricts using data collected for marketing for employee screening?`,
          options: ["Collection Limitation", "Purpose Limitation", "Storage Limitation", "Data Minimization"],
          correctIndex: 1,
          explanation: `Purpose Limitation restricts use to stated purposes. Data collected for marketing cannot be used for other purposes without consent.`,
        },
      ],
    },
    {
      id: 'd2-anon',
      title: `Anonymization vs Pseudonymization`,
      content: `| Characteristic | Anonymization | Pseudonymization |
|---|---|---|
| **Reversibility** | Irreversible | Reversible with mapping table |
| **Personal Data?** | NO (outside GDPR) | YES (GDPR still applies) |
| **Re-identification** | Theoretically impossible | Possible with key |
| **Use Cases** | Public data, research | Internal processing, trials |

**Key exam point**: Pseudonymized data IS still personal data under GDPR because re-identification is possible.`,
      examTip: `Anonymized data is NOT personal data under GDPR. Pseudonymized data IS still personal data. The exam will test this distinction.`,
    },
  ],
  keyTakeaways: ["Pseudonymized data is still personal data under GDPR", "Privacy by Design integrates privacy from inception", "Collection limitation + purpose limitation + data minimization"],
},

cissp_models: {
  topicId: 'cissp_models',
  title: `Security Models & Frameworks`,
  domainWeight: '13%',
  overview: `Security models are formal descriptions of security policies expressed precisely enough to be proved. Understanding models and evaluation criteria is essential for the exam.`,
  sections: [
    {
      id: 'd3-models',
      title: `Security Models`,
      content: `### Bell-LaPadula (Confidentiality)
- **Simple Security ("No Read Up")**: Cannot read higher classification
- **Star Property ("No Write Down")**: Cannot write to lower classification
- Used in military/government systems

### Biba (Integrity)
- **Simple Integrity ("No Read Down")**: Cannot read lower integrity
- **Star Integrity ("No Write Up")**: Cannot write to higher integrity
- Mirror opposite of Bell-LaPadula

### Clark-Wilson (Commercial Integrity)
- Uses Certified Data Items (CDI) and Transformation Procedures (TP)
- Enforces separation of duties and well-formed transactions

### Brewer-Nash (Chinese Wall)
- Prevents conflicts of interest in multi-party environments
- Once you access one client's data, blocked from competitors`,
      examTip: `Bell-LaPadula = Confidentiality (No Read Up, No Write Down). Biba = Integrity (No Read Down, No Write Up). They are mirror opposites.`,
      quiz: [
        {
          question: `The Bell-LaPadula star property states:`,
          options: ["No read up", "No write down", "No read down", "No write up"],
          correctIndex: 1,
          explanation: `BLP star property = No Write Down (prevents leaking secrets to lower classification). Simple security = No Read Up.`,
        },
        {
          question: `Which model enforces data integrity in financial transaction systems?`,
          options: ["Bell-LaPadula", "Biba", "State Machine", "Information Flow"],
          correctIndex: 1,
          explanation: `Biba enforces integrity through No Write Up and No Read Down. BLP is confidentiality only.`,
        },
      ],
    },
    {
      id: 'd3-eval',
      title: `Evaluation Standards`,
      content: `### Common Criteria (ISO/IEC 15408)
EAL 1 (Functionally Tested) through EAL 7 (Formally Verified)

### TCSEC (Orange Book) - Historical
A1 (highest) > B3 > B2 > B1 > C2 > C1 > D (lowest)

### Reference Monitor Requirements
1. **Always Invoked** (complete mediation)
2. **Tamper-Proof**
3. **Verifiable** (small enough to analyze)`,
    },
  ],
  keyTakeaways: ["BLP: No Read Up, No Write Down (confidentiality)", "Biba: No Read Down, No Write Up (integrity)", "Reference monitor: Always Invoked, Tamper-Proof, Verifiable"],
},

cissp_crypto: {
  topicId: 'cissp_crypto',
  title: `Cryptography`,
  domainWeight: '13%',
  overview: `Cryptography provides confidentiality, integrity, authenticity, and non-repudiation through mathematical algorithms.`,
  sections: [
    {
      id: 'd3-symmetric',
      title: `Symmetric and Asymmetric Encryption`,
      content: `### Symmetric (same key encrypts/decrypts)
| Algorithm | Key Size | Status |
|---|---|---|
| **AES** | 128/192/256 | NIST standard; recommended |
| **3DES** | 168 bits | Deprecated |
| **RC4** | Variable | Broken; do not use |

### Asymmetric (key pair: public + private)
| Algorithm | Key Size | Use Case |
|---|---|---|
| **RSA** | 2048+ | Encryption, signatures, key exchange |
| **ECC** | 256-521 | Smaller keys, equivalent security |
| **DH/ECDH** | 2048+ | Key exchange only |

### Hash Functions
| Algorithm | Output | Status |
|---|---|---|
| **SHA-256/384/512** | 256-512 bits | Current standard |
| **SHA-3** | 256-512 bits | Latest NIST standard |
| **MD5** | 128 bits | **Broken** |
| **SHA-1** | 160 bits | **Deprecated** |

**Hybrid approach**: Asymmetric for key exchange, symmetric for bulk data. This is how TLS, IPsec, and SSH work.`,
      examTip: `Symmetric = speed (bulk encryption). Asymmetric = key exchange and signatures. ECC 256 bits equals RSA 2048 bits security. AES is quantum-resistant; RSA/ECC are not.`,
      quiz: [
        {
          question: `Which is the current NIST standard for symmetric encryption?`,
          options: ["3DES with 168-bit keys", "AES with 128/192/256-bit keys", "Blowfish", "RC4"],
          correctIndex: 1,
          explanation: `AES is the NIST standard. 3DES is deprecated; RC4 is broken; Blowfish has small block size.`,
        },
      ],
    },
    {
      id: 'd3-pki',
      title: `PKI and Digital Signatures`,
      content: `### PKI Components
- **CA**: Issues and revokes certificates
- **RA**: Verifies identity before CA issues cert
- **CRL**: Periodically published list of revoked certs
- **OCSP**: Real-time revocation status; OCSP stapling caches response

### Digital Signatures
Hash the message, encrypt hash with private key. Provides authentication, non-repudiation, and integrity.

### Post-Quantum Cryptography (NIST 2024)
- **ML-KEM** (FIPS 203): Key encapsulation
- **ML-DSA** (FIPS 204): Digital signatures
- **SLH-DSA** (FIPS 205): Hash-based signatures`,
    },
  ],
  keyTakeaways: ["Symmetric for bulk; asymmetric for key exchange and signatures", "AES-256 is the standard; MD5 and SHA-1 are broken", "OCSP stapling is modern revocation; CRL is legacy"],
},

cissp_physical: {
  topicId: 'cissp_physical',
  title: `Physical Security`,
  domainWeight: '13%',
  overview: `Physical security protects facilities, equipment, and people through layered controls.`,
  sections: [
    {
      id: 'd3-physical',
      title: `Physical Security Controls`,
      content: `### CPTED
- Natural Surveillance, Natural Access Control, Territorial Reinforcement, Maintenance

### Fire Suppression
| System | Use Case |
|---|---|
| **Wet Pipe** | General buildings; fast; false-discharge risk |
| **Dry Pipe** | Freezing environments |
| **Pre-action** | Data centers; requires detection + head activation |
| **Gas (FM-200, Novec)** | No water damage; electronics-safe |

Halon is banned (Montreal Protocol). Pre-action + VESDA is modern data center standard.

### Fail-Safe vs Fail-Secure
- **Fail-safe**: Doors UNLOCK on failure (life safety for exits)
- **Fail-secure**: Doors REMAIN LOCKED (high-security zones)`,
      examTip: `Pre-action systems are two-stage (detection + activation). Halon is banned. Personnel safety is ALWAYS the top priority.`,
    },
  ],
  keyTakeaways: ["CPTED: Natural Surveillance, Access Control, Reinforcement", "Pre-action for data centers; gas for no-water-damage", "Fail-safe for exits; fail-secure for high-security"],
},

cissp_secure_design: {
  topicId: 'cissp_secure_design',
  title: `Secure Design Principles`,
  domainWeight: '13%',
  overview: `Design principles make systems resistant to attack at the architectural level, before specific controls are selected.`,
  sections: [
    {
      id: 'd3-principles',
      title: `Foundational Design Principles`,
      content: `- **Least Privilege**: Only the access strictly required
- **Defense in Depth**: Layered controls; no single failure is catastrophic
- **Fail-Safe Defaults**: On failure, deny access (not grant)
- **Separation of Duties**: No single actor completes high-impact workflow
- **Economy of Mechanism (KISS)**: Simpler designs have fewer bugs
- **Complete Mediation**: Check every access, every time
- **Open Design**: Security must not depend on obscurity (Kerckhoffs' principle)
- **Zero Trust**: Trust is never implicit based on network location

### Zero Trust Architecture (NIST SP 800-207)
- Policy Engine decides, Policy Administrator issues, PEP enforces
- Every request evaluated: who, what device, what state, what context
- "Never trust, always verify" with continuous evaluation`,
      examTip: `Zero Trust is an ARCHITECTURE, not a product. Fail-safe means fail-DENY. Security through obscurity as the ONLY control is wrong.`,
      quiz: [
        {
          question: `What is the primary goal of Zero Trust architecture?`,
          options: ["Encrypt all traffic", "Assume no implicit trust; require continuous verification", "Eliminate all trust and operate disconnected", "Trust internal traffic; block external"],
          correctIndex: 1,
          explanation: `Zero Trust assumes breach and verifies every request regardless of source. Traditional perimeter trust is rejected.`,
        },
      ],
    },
  ],
  keyTakeaways: ["Defense in depth: layered controls", "Zero trust: never trust, always verify", "Fail-safe = deny on failure"],
},

cissp_network: {
  topicId: 'cissp_network',
  title: `Network Architecture`,
  domainWeight: '13%',
  overview: `Network architecture covers OSI/TCP-IP models, secure design principles, and network segmentation.`,
  sections: [
    {
      id: 'd4-osi',
      title: `OSI Model and Attack Mapping`,
      content: `| Layer | Name | Threats | Controls |
|---|---|---|---|
| 7 | Application | Injection, XSS, SSRF | WAF, input validation |
| 6 | Presentation | TLS downgrade | TLS 1.3 strict config |
| 5 | Session | Session fixation | Modern session tokens |
| 4 | Transport | SYN flood | SYN cookies, stateful FW |
| 3 | Network | IP spoofing, routing | ACLs, IPsec, uRPF |
| 2 | Data Link | ARP poisoning, VLAN hopping | Port security, DAI, 802.1X |
| 1 | Physical | Tapping, emanations | Shielding, fiber |

**Mnemonic (top down): All People Seem To Need Data Processing**`,
      examTip: `Map attacks to layers: ARP = L2, IP spoof = L3, SYN flood = L4, DNS = L7. Controls must match the attack layer.`,
      quiz: [
        {
          question: `At which OSI layer does TCP operate?`,
          options: ["Layer 2", "Layer 3", "Layer 4", "Layer 5"],
          correctIndex: 2,
          explanation: `TCP is Layer 4 (Transport). Layer 3 is IP. Layer 2 is Ethernet/MAC.`,
        },
      ],
    },
  ],
  keyTakeaways: ["OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application", "Map attacks to layers for control selection", "Segment first; encrypt by default; monitor always"],
},

cissp_protocols: {
  topicId: 'cissp_protocols',
  title: `Secure Communications`,
  domainWeight: '13%',
  overview: `Secure protocols protect data in transit across networks.`,
  sections: [
    {
      id: 'd4-tls',
      title: `TLS, IPsec, and Key Protocols`,
      content: `### TLS 1.3
- Forward secrecy mandatory (ECDHE/DHE only)
- Removed: static RSA, CBC, SHA-1, RC4, compression
- AEAD-only cipher suites; 1-RTT handshake

### IPsec
- **AH**: Integrity only
- **ESP**: Confidentiality + integrity
- **Transport mode**: Host-to-host (keeps original IP header)
- **Tunnel mode**: Site-to-site VPN (encapsulates entire packet)

### DNSSEC vs DoH/DoT
- DNSSEC: Integrity (signed records, chain of trust)
- DoH/DoT: Confidentiality (encrypted queries)
- Different purposes; complementary`,
      quiz: [
        {
          question: `Which IPsec mode is used for site-to-site VPNs?`,
          options: ["Transport mode", "Tunnel mode", "AH-only mode", "Null encryption"],
          correctIndex: 1,
          explanation: `Tunnel mode encapsulates the entire packet with new headers. Transport mode is host-to-host.`,
        },
      ],
    },
  ],
  keyTakeaways: ["TLS 1.3: forward secrecy mandatory, AEAD only", "IPsec: AH authenticates, ESP encrypts; Tunnel for VPNs"],
},

cissp_wireless_net: {
  topicId: 'cissp_wireless_net',
  title: `Wireless & Remote Access`,
  domainWeight: '13%',
  overview: `Wireless security standards and remote access technologies.`,
  sections: [
    {
      id: 'd4-wireless',
      title: `Wireless Standards and VPN`,
      content: `### Wireless Encryption
| Standard | Security | Status |
|---|---|---|
| WEP | Broken | Do not use |
| WPA/WPA2 | TKIP/AES-CCMP | Legacy/Current |
| WPA3 | SAE + forward secrecy | Latest |

WPA3 SAE is resistant to offline dictionary attacks.

### 802.1X
Supplicant (client) -> Authenticator (switch/AP) -> RADIUS server
- EAP-TLS: Certificate-based (strongest)
- PEAP: Tunneled password-based (common)

### VPN Types
- Site-to-site IPsec, Remote-access SSL VPN, WireGuard, ZTNA`,
      quiz: [
        {
          question: `Which wireless standard uses SAE to replace pre-shared key?`,
          options: ["WEP", "WPA", "WPA2", "WPA3"],
          correctIndex: 3,
          explanation: `WPA3 introduced SAE (Simultaneous Authentication of Equals), resistant to offline dictionary attacks.`,
        },
      ],
    },
  ],
  keyTakeaways: ["WPA3 SAE: resistant to offline dictionary attacks", "802.1X: supplicant, authenticator, RADIUS; EAP-TLS strongest"],
},

cissp_network_attacks: {
  topicId: 'cissp_network_attacks',
  title: `Network Attacks & Countermeasures`,
  domainWeight: '13%',
  overview: `Common network attacks mapped to OSI layers with specific defenses.`,
  sections: [
    {
      id: 'd4-attacks',
      title: `Attack Catalog and Defenses`,
      content: `| Attack | Layer | Defense |
|---|---|---|
| ARP poisoning | L2 | Dynamic ARP Inspection, 802.1X |
| VLAN hopping | L2 | Disable native VLAN, disable DTP |
| IP spoofing | L3 | uRPF, ingress filtering |
| SYN flood | L4 | SYN cookies, stateful FW |
| DNS poisoning | L7 | DNSSEC |
| DDoS (volumetric) | L3/L4 | Upstream scrubbing, CDN |
| MITM | Various | Authenticated key exchange (TLS) |
| Session hijacking | L4-L7 | Strong random tokens, TLS |

### Firewall Types
- **Stateless**: Rules only; no connection tracking
- **Stateful**: Tracks connections; more intelligent
- **NGFW/WAF**: Application awareness; L7 inspection

### IDS vs IPS
- IDS detects and alerts (passive, out-of-band)
- IPS detects AND blocks (active, inline)`,
      examTip: `SYN cookies: server encodes state in sequence number, allocates only on valid ACK. IDS = detect/alert; IPS = detect/block.`,
    },
  ],
  keyTakeaways: ["SYN flood: exhausts connection queue; defense = SYN cookies", "IDS = detect/alert (passive); IPS = detect/block (active)", "Micro-segmentation prevents lateral movement"],
},

cissp_auth: {
  topicId: 'cissp_auth',
  title: `Authentication Methods`,
  domainWeight: '13%',
  overview: `Authentication verifies identity through factors: something you know, have, are, do, or somewhere you are.`,
  sections: [
    {
      id: 'd5-factors',
      title: `Authentication Factors and MFA`,
      content: `### Five Factor Types
| Factor | Examples |
|---|---|
| Something you **know** | Password, PIN, passphrase |
| Something you **have** | Hardware token, smart card, FIDO2 key |
| Something you **are** | Fingerprint, iris, facial recognition |
| Something you **do** | Signature, typing rhythm |
| Somewhere you **are** | GPS, IP geolocation (weak) |

**MFA requires 2+ DIFFERENT factor types.** Two passwords is NOT MFA.

### Phishing-Resistant MFA
- SMS/TOTP: Defeated by real-time relay
- Push: Defeated by MFA fatigue (Uber 2022)
- **FIDO2/WebAuthn**: Phishing-resistant (cryptographically bound to origin)

### Biometrics
- FAR (False Accept Rate) = Type II error (impostor accepted)
- FRR (False Reject Rate) = Type I error (legitimate rejected)
- CER/EER: Where FAR = FRR; lower = more accurate`,
      examTip: `Password + security question is NOT MFA (both knowledge). Password + SMS IS MFA (knowledge + possession). For biometrics: lower CER = better system.`,
      quiz: [
        {
          question: `Password plus smart card combines which factors?`,
          options: ["Something you know + something you have", "Something you know + something you are", "Something you have + somewhere you are", "Something you are + something you do"],
          correctIndex: 0,
          explanation: `Password = something you know (Type I). Smart card = something you have (Type II). True MFA.`,
        },
      ],
    },
  ],
  keyTakeaways: ["MFA requires different factor types", "FIDO2/WebAuthn is phishing-resistant", "FAR = Type II (impostor in); FRR = Type I (legit out); CER = crossover"],
},

cissp_access_control: {
  topicId: 'cissp_access_control',
  title: `Access Control Models`,
  domainWeight: '13%',
  overview: `Access control models define how authorization decisions are made.`,
  sections: [
    {
      id: 'd5-models',
      title: `DAC, MAC, RBAC, ABAC`,
      content: `| Model | Basis | Use Case |
|---|---|---|
| **DAC** | Owner decides | File permissions; flexible but error-prone |
| **MAC** | System-enforced labels | Government classified; strong but inflexible |
| **RBAC** | Roles | Enterprise; scales well |
| **ABAC** | Attributes (subject, resource, action, env) | Cloud; most flexible |

**DAC**: Owner controls. **MAC**: System controls. **RBAC**: Role controls. **ABAC**: Attributes control.`,
      examTip: `Government classified = MAC. Enterprise with many apps = RBAC. Cloud/dynamic = ABAC. Owner decides = DAC.`,
      quiz: [
        {
          question: `Which access control model is enforced by the system based on security labels?`,
          options: ["DAC", "MAC", "RBAC", "ABAC"],
          correctIndex: 1,
          explanation: `MAC uses system-enforced labels and clearances. Owner cannot override. Used in classified environments.`,
        },
      ],
    },
  ],
  keyTakeaways: ["Owner DAC, System MAC, Role RBAC, Attribute ABAC"],
},

cissp_identity: {
  topicId: 'cissp_identity',
  title: `Identity Management`,
  domainWeight: '13%',
  overview: `Identity management covers federation protocols, Kerberos, SSO, and identity lifecycle.`,
  sections: [
    {
      id: 'd5-protocols',
      title: `Federation: SAML, OIDC, OAuth`,
      content: `### Protocol Summary
- **SAML**: XML-based enterprise SSO. IdP issues signed assertions to SP.
- **OIDC**: OAuth 2.0 + ID Token (JWT) for authentication. Modern web/mobile.
- **OAuth 2.0**: Authorization framework. NOT authentication. Delegates access.

**"OAuth delegates; OIDC identifies."**

### Kerberos
KDC = AS (Authentication Service) + TGS (Ticket Granting Service)
Flow: AS-REQ -> TGT -> TGS-REQ -> Service Ticket -> Service Access
No passwords on the wire. Tickets are time-bound.

### Identity Lifecycle (Joiner-Mover-Leaver)
1. Joiner: Provision with role-based access
2. Mover: Update access; REMOVE old privileges
3. Leaver: Revoke all access promptly`,
      quiz: [
        {
          question: `In Kerberos, what does the AS issue?`,
          options: ["Service ticket", "TGT (Ticket Granting Ticket)", "Digital certificate", "Session key only"],
          correctIndex: 1,
          explanation: `AS issues the TGT. TGS issues service tickets. The TGT is used to request service tickets without re-authenticating.`,
        },
      ],
    },
  ],
  keyTakeaways: ["SAML for enterprise SSO; OIDC for modern auth; OAuth for delegation", "Kerberos: KDC = AS + TGS; no passwords on the wire"],
},

cissp_iam_attacks: {
  topicId: 'cissp_iam_attacks',
  title: `IAM Attacks`,
  domainWeight: '13%',
  overview: `Common attacks against identity and access management systems.`,
  sections: [
    {
      id: 'd5-attacks',
      title: `Credential and Authentication Attacks`,
      content: `| Attack | Description | Defense |
|---|---|---|
| **Credential stuffing** | Automated login with breach credentials | MFA, breach-password detection |
| **Pass-the-hash** | Reuse NTLM hash | Credential Guard, disable NTLM |
| **Kerberoasting** | Offline crack service tickets | Strong passwords, gMSA |
| **Golden ticket** | Forge TGT with krbtgt key | Regular krbtgt rotation |
| **MFA fatigue** | Spam push notifications | FIDO2, number matching |
| **OAuth consent phishing** | Trick user into authorizing malicious app | Admin consent governance |

### PAM (Privileged Access Management)
- Credential vaulting, JIT access, session recording, break-glass accounts`,
      quiz: [
        {
          question: `What defense best mitigates Kerberoasting?`,
          options: ["Disable Kerberos", "Strong service account passwords or gMSA", "Block all SPN queries", "Rotate krbtgt monthly"],
          correctIndex: 1,
          explanation: `Kerberoasting cracks service tickets offline. Strong passwords (25+) or gMSA (auto-rotating 240-byte) make cracking infeasible.`,
        },
      ],
    },
  ],
  keyTakeaways: ["Kerberoasting defense: strong passwords or gMSA", "MFA fatigue: migrate to FIDO2", "PAM: vault + JIT + approval + recording"],
},

cissp_vuln: {
  topicId: 'cissp_vuln',
  title: `Vulnerability Assessment`,
  domainWeight: '12%',
  overview: `Vulnerability assessment identifies security flaws. Penetration testing exploits them to demonstrate real-world risk.`,
  sections: [
    {
      id: 'd6-vuln',
      title: `Scanning vs Penetration Testing`,
      content: `### Vulnerability Scanning
- Automated, signature-based; finds KNOWN vulnerabilities
- Authenticated scans are much more accurate than unauthenticated
- Answers: "What COULD be wrong?"

### Penetration Testing
- Human-driven; chains exploits; finds EXPLOITABLE paths
- Black box (no knowledge), Gray box (partial), White box (full)
- Answers: "What IS exploitable right now?"

### Red/Blue/Purple Teams
- **Red**: Adversary simulation (weeks-months)
- **Blue**: Defenders (detection and response)
- **Purple**: Joint exercises for mutual improvement`,
      examTip: `VA identifies flaws; pentest exploits them. VA is broader; pentest is deeper. Authorization letter required before pentesting.`,
      quiz: [
        {
          question: `Primary difference between vulnerability assessment and penetration testing?`,
          options: ["VA is faster", "VA identifies flaws; pentest exploits them to demonstrate impact", "Pentest is external only", "VA requires exploitation"],
          correctIndex: 1,
          explanation: `VA discovers and documents vulnerabilities. Pentest attempts actual exploitation to prove real-world risk.`,
        },
      ],
    },
  ],
  keyTakeaways: ["VA identifies; pentest exploits", "Red attacks; Blue defends; Purple learns", "Authorization letter required before testing"],
},

cissp_audit: {
  topicId: 'cissp_audit',
  title: `Security Auditing`,
  domainWeight: '12%',
  overview: `Auditing evaluates compliance with policies, standards, and regulations.`,
  sections: [
    {
      id: 'd6-soc',
      title: `SOC Reports and Compliance`,
      content: `### SOC Reports
| Report | Focus |
|---|---|
| **SOC 1** | Financial reporting controls |
| **SOC 2** | Trust Services (security, availability, etc.) |
| **SOC 3** | Public summary of SOC 2 |

| Type | Scope |
|---|---|
| **Type I** | Design at a point in time (snapshot) |
| **Type II** | Operating effectiveness over 6-12 months (stronger) |

Enterprise customers should require **SOC 2 Type II**.

### Metrics
- **KPI**: Program performance (MTTD, MTTR, patch cadence)
- **KRI**: Risk posture (% critical risks within appetite)
- Boards see KRIs; executives see KPIs; operations sees activity`,
      examTip: `SOC 2 Type I = snapshot. Type II = 6-12 months of operating effectiveness. Type II is much stronger evidence.`,
    },
  ],
  keyTakeaways: ["SOC 2 Type II is the enterprise standard", "KPIs measure performance; KRIs measure risk"],
},

cissp_testing: {
  topicId: 'cissp_testing',
  title: `Software Testing`,
  domainWeight: '12%',
  overview: `Application security testing tools catch vulnerabilities at different layers of the development process.`,
  sections: [
    {
      id: 'd6-tools',
      title: `SAST, DAST, IAST, SCA`,
      content: `| Tool | Method | Strengths |
|---|---|---|
| **SAST** | Reads source code | Fast, finds many bugs early; high false positives |
| **DAST** | Probes running app | Finds real exploitable bugs; misses non-exercised paths |
| **IAST** | Instruments running app | Lower false positives; combines SAST+DAST visibility |
| **SCA** | Inventories dependencies | Catches supply chain risks (Log4Shell) |
| **Fuzzing** | Randomized inputs | Finds crash-inducing bugs |

"SAST reads, DAST probes, IAST watches, SCA lists."

No single tool is sufficient. Mature programs use multiple techniques.`,
      examTip: `SAST = white-box (sees code). DAST = black-box (sees behavior). IAST = gray-box. Shift-left = move testing EARLIER in SDLC.`,
    },
  ],
  keyTakeaways: ["SAST reads code; DAST probes apps; IAST watches from inside; SCA lists dependencies"],
},

cissp_ir: {
  topicId: 'cissp_ir',
  title: `Incident Management`,
  domainWeight: '13%',
  overview: `Incident response provides organizational framework for identifying, responding to, and learning from security incidents.`,
  sections: [
    {
      id: 'd7-lifecycle',
      title: `NIST SP 800-61 IR Lifecycle`,
      content: `Four phases in a continuous loop:

1. **Preparation**: Policy, team, tools, training, exercises, playbooks
2. **Detection & Analysis**: Identify incident, triage severity, scope
3. **Containment, Eradication, Recovery**:
   - Short-term: Isolate affected systems
   - Eradicate: Remove malware, close backdoors, rotate credentials
   - Recovery: Restore from clean backups, monitor for re-infection
4. **Post-Incident (Lessons Learned)**: Blameless debrief, update procedures

### Breach Notification
- GDPR: 72 hours to supervisory authority
- SEC: 4 business days for material incidents
- HIPAA: 60 days to HHS + individuals`,
      examTip: `Personnel safety FIRST. Preserve evidence BEFORE containment. The lifecycle is a LOOP — lessons feed back into preparation.`,
      quiz: [
        {
          question: `Which IR phase involves removing malware and closing exploit paths?`,
          options: ["Containment", "Detection", "Eradication", "Recovery"],
          correctIndex: 2,
          explanation: `Eradication removes attacker presence. Containment stops spread; detection identifies the incident; recovery restores operations.`,
        },
      ],
    },
  ],
  keyTakeaways: ["Prepare -> Detect -> Contain/Eradicate/Recover -> Lessons Learned", "Personnel safety always first", "Preserve evidence before containment"],
},

cissp_investigations: {
  topicId: 'cissp_investigations',
  title: `Investigations & Evidence`,
  domainWeight: '13%',
  overview: `Investigation types differ in burden of proof and procedures. Evidence handling follows strict forensic standards.`,
  sections: [
    {
      id: 'd7-evidence',
      title: `Investigation Types and Evidence Handling`,
      content: `### Investigation Types
| Type | Burden of Proof |
|---|---|
| Administrative | Policy |
| Criminal | Beyond reasonable doubt |
| Civil | Preponderance of evidence |
| Regulatory | Varies |

### Evidence Rules
Authentic, Accurate, Complete, Convincing, Admissible

### Order of Volatility (RFC 3227)
CPU registers -> Memory -> Disk -> Archival (most volatile first)

### Chain of Custody
Document every person who handles evidence with timestamps. Breaks allow challenges to admissibility.`,
      quiz: [
        {
          question: `Per RFC 3227, evidence should be collected in order of:`,
          options: ["Alphabetical", "Volatility (most volatile first)", "Least persistent first", "Random"],
          correctIndex: 1,
          explanation: `Most volatile first: CPU -> memory -> disk -> archival. Volatile evidence disappears when system is touched.`,
        },
      ],
    },
  ],
  keyTakeaways: ["Preserve first, analyze second", "Chain of custody starts at first acquisition", "RFC 3227: CPU -> memory -> disk -> archival"],
},

cissp_operations: {
  topicId: 'cissp_operations',
  title: `Operational Security`,
  domainWeight: '13%',
  overview: `Day-to-day security operations: configuration management, change management, patch management, and monitoring.`,
  sections: [
    {
      id: 'd7-ops',
      title: `Configuration, Change, and Patch Management`,
      content: `### Change Management Types
| Type | Process |
|---|---|
| **Standard** | Pre-approved, low-risk |
| **Normal** | Request -> CAB review -> implement -> post-review |
| **Emergency** | Urgent; post-implementation review MANDATORY |

### SIEM
Aggregates, normalizes, correlates, alerts. Use-case driven, not "collect everything."

### Key Metrics
- MTTD: Mean Time To Detect
- MTTR: Mean Time To Respond`,
      examTip: `Emergency changes ALWAYS require post-implementation review. "Collect everything" is a SIEM anti-pattern.`,
    },
  ],
  keyTakeaways: ["Standard/Normal/Emergency change types", "SIEM: aggregate, correlate, alert", "MTTD and MTTR are primary SOC KPIs"],
},

cissp_disaster: {
  topicId: 'cissp_disaster',
  title: `Disaster Recovery Operations`,
  domainWeight: '13%',
  overview: `Disaster recovery restores IT systems after disruption. Backup strategies protect against data loss including ransomware.`,
  sections: [
    {
      id: 'd7-backup',
      title: `Backup and Recovery`,
      content: `### 3-2-1-1-0 Rule
- 3 copies, 2 media, 1 offsite, 1 immutable, 0 errors verified

### Recovery Sites
| Site | Time | Cost |
|---|---|---|
| Cold | Days-weeks | Low |
| Warm | Hours-days | Medium |
| Hot | Minutes | High |

### RAID Levels
| Level | Tolerance | Use |
|---|---|---|
| RAID 0 | None | Performance |
| RAID 1 | 1 drive | Mirroring |
| RAID 5 | 1 drive | Most common |
| RAID 6 | 2 drives | Large arrays |
| RAID 10 | Up to 50% | High performance + reliability |`,
      quiz: [
        {
          question: `RAID 5 tolerates how many simultaneous drive failures?`,
          options: ["None", "One", "Two", "Three"],
          correctIndex: 1,
          explanation: `RAID 5 uses striping with distributed parity; survives one drive failure. RAID 6 survives two.`,
        },
      ],
    },
  ],
  keyTakeaways: ["3-2-1-1-0: 3 copies, 2 media, 1 offsite, 1 immutable, 0 errors", "Untested backups often fail at the worst moment"],
},

cissp_sdlc: {
  topicId: 'cissp_sdlc',
  title: `Secure SDLC`,
  domainWeight: '10%',
  overview: `Security must be built into applications throughout the development lifecycle, not bolted on afterward.`,
  sections: [
    {
      id: 'd8-sdlc',
      title: `SDLC Phases and DevSecOps`,
      content: `### Security by Phase
1. **Requirements**: Security requirements, compliance, threat modeling inputs
2. **Design**: Threat modeling (STRIDE, PASTA), architecture review
3. **Build**: Secure coding, SAST/SCA in CI, code review
4. **Test**: DAST, IAST, fuzzing, penetration testing
5. **Deploy**: IaC scanning, secrets management, deployment gates
6. **Operate**: Monitoring, WAF/RASP, vulnerability management

### SDLC Frameworks
- **Microsoft SDL**: Training -> Requirements -> Design -> Implementation -> Verification -> Release -> Response
- **NIST SSDF (SP 800-218)**: PO (Prepare), PS (Protect), PW (Produce), RV (Respond)
- **OWASP SAMM**: Maturity model for software assurance

### DevSecOps Pipeline Gates
Pre-commit -> Commit (secret scanning, SCA) -> Build (SAST, container scan) -> Test (DAST, IAST) -> Pre-deploy -> Runtime (RASP, WAF)`,
      examTip: `Shift left for speed (catch early). Shift everywhere for depth (no single stage catches everything). NIST SSDF is federal procurement requirement.`,
    },
  ],
  keyTakeaways: ["Threat modeling at design time is cheapest", "\"Secure by design\" prevents classes of vulnerability", "NIST SSDF: PO, PS, PW, RV"],
},

cissp_app_vuln: {
  topicId: 'cissp_app_vuln',
  title: `Application Vulnerabilities`,
  domainWeight: '10%',
  overview: `Common vulnerability types from OWASP Top 10 with defenses.`,
  sections: [
    {
      id: 'd8-owasp',
      title: `OWASP Top 10 (2021)`,
      content: `| Rank | Category | Defense |
|---|---|---|
| A01 | Broken Access Control | Server-side enforcement, deny by default |
| A02 | Cryptographic Failures | Strong algorithms, key management |
| A03 | Injection | **Parameterized queries** (never string concatenation) |
| A04 | Insecure Design | Threat modeling, secure design patterns |
| A05 | Security Misconfiguration | Hardening, remove defaults |
| A06 | Vulnerable Components | SCA scanning, SBOM, patching |
| A07 | Auth Failures | Strong auth, MFA, secure sessions |
| A08 | Integrity Failures | Signed updates, secure CI/CD |
| A09 | Logging Failures | Log security events, SIEM integration |
| A10 | SSRF | URL allowlist, block metadata endpoints |

**Parameterized queries make SQL injection structurally impossible.**`,
      examTip: `A01 Broken Access Control is #1. Parameterized queries prevent injection. Client-side access control is NOT security (trivially bypassable).`,
      quiz: [
        {
          question: `Primary defense against SQL injection?`,
          options: ["Input filtering", "Parameterized queries", "Network encryption", "Database backups"],
          correctIndex: 1,
          explanation: `Parameterized queries separate code from data. Injection is structurally impossible. Never concatenate user input into SQL.`,
        },
      ],
    },
  ],
  keyTakeaways: ["A01 Broken Access Control is most common", "Parameterized queries prevent SQL injection", "Client-side validation is UX, not security"],
},

cissp_devops: {
  topicId: 'cissp_devops',
  title: `DevSecOps`,
  domainWeight: '10%',
  overview: `DevSecOps integrates security into the development pipeline with supply chain security.`,
  sections: [
    {
      id: 'd8-supply-chain',
      title: `Supply Chain and Container Security`,
      content: `### Software Supply Chain
- **SBOM**: Software Bill of Materials (SPDX or CycloneDX)
- **Sigstore/cosign**: Cryptographic signing for containers
- **SLSA**: Supply chain Levels for Software Artifacts

### Supply Chain Attacks
- Log4Shell (2021): Ubiquitous library, transitive dependency
- SolarWinds (2020): Build system compromise
- Dependency confusion: Public package with same name as private

### Container Security
- Scan images for vulnerabilities (Trivy, Anchore)
- Run as non-root, read-only filesystem
- Sign images (cosign), verify before deployment
- Kubernetes: RBAC, network policies, admission controllers`,
      quiz: [
        {
          question: `What is an SBOM?`,
          options: ["Security backup manual", "List of all software components, versions, and licenses", "Security benchmark document", "Deployment checklist"],
          correctIndex: 1,
          explanation: `SBOM documents all dependencies. Enables rapid vulnerability response (e.g., "do we use Log4j?").`,
        },
      ],
    },
  ],
  keyTakeaways: ["SBOM for supply chain visibility", "EO 14028 made SBOM a federal procurement requirement", "Container security: scan, sign, least privilege"],
},
};

export function getCISSPCourseContent(topicId: string): TopicLesson | null {
  return CISSP_COURSE[topicId] || null;
}

export function hasCISSPCourseContent(topicId: string): boolean {
  return topicId in CISSP_COURSE;
}

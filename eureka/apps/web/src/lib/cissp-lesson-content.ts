/**
 * CISSP lesson content keyed by topic ID from exam-curriculum.ts.
 * Each entry is markdown-formatted lesson body text extracted from
 * the detailed notes in docs/cissp-course/domain-*/02-detailed-notes.md.
 *
 * AI-generated study material aligned to the (ISC)² CISSP Exam Outline
 * effective April 15, 2024. Requires human SME review before publication.
 */

export const CISSP_LESSON_CONTENT: Record<string, string> = {

cissp_governance: `
## 3. Sub-objective 1.1 — Professional ethics

### 3.1.a Conceptual explanation

CISSPs are bound by two layered ethical obligations: the **(ISC)² Code of
Ethics** and any organizational code of conduct that applies to them as
employees, contractors, or officers. When the two conflict, the (ISC)²
canons take precedence — this is the point the exam presses most often.

The (ISC)² Code of Ethics is built on a **Preamble** and **four Canons**.
The Preamble states that the safety and welfare of society and the common
good, duty to principals, and to each other, requires adherence to the
highest ethical standards of behavior. The four Canons follow, and crucially
they are **listed in priority order**:

1. **Protect society, the common good, necessary public trust and
   confidence, and the infrastructure.**
2. **Act honorably, honestly, justly, responsibly, and legally.**
3. **Provide diligent and competent service to principals.**
4. **Advance and protect the profession.**

The ordering is the exam's favorite ethics question. If a scenario pits the
safety of the public (Canon I) against the interest of an employer (Canon
III), the public wins — every time. If legality (Canon II) conflicts with
advancing the profession (Canon IV), legality wins.

Ethics is not a feel-good topic on this exam. It is a decision framework.
When a scenario asks "what should the CISSP do FIRST?" and the answer
choices include reporting to authorities, notifying the employer, protecting
the public, or protecting professional reputation, you order them by canon
number, lowest first, and pick the action that serves the highest-ranked
canon not already satisfied.

The Code also establishes obligations around **truthful representation**
(no falsifying credentials, no overstating expertise), **conflict of
interest disclosure**, and **non-association with criminal activity**. A
CISSP who knowingly associates with or enables criminal conduct violates
Canon II and is subject to decertification.

### 3.1.b Technical / procedural deep-dive

The (ISC)² complaint and adjudication process is formal. A complaint
against a credential holder must be submitted in writing under oath
(affidavit form), and only specific parties have standing depending on which
Canon is alleged to have been violated:

- **Canon I** violations — anyone may complain (because the public is the
  stakeholder).
- **Canon II** violations — anyone with first-hand knowledge may complain.
- **Canon III** violations — only the principal (employer or client) may
  complain.
- **Canon IV** violations — only a licensed professional may complain.

Standing is a favorite distractor: the exam will test whether a random
third party can file a Canon III complaint (no — only the principal can).

The Ethics Committee reviews complaints, may request additional information,
and recommends outcomes to the (ISC)² Board, which has ultimate authority
to revoke a credential.

### 3.1.c Relevant frameworks

- **(ISC)² Code of Ethics** — authoritative for CISSP holders.
- **RFC 1087, "Ethics and the Internet"** (1989) — the IETF's historical
  statement of internet ethics, occasionally referenced.
- **IEEE Code of Ethics**, **ACM Code of Ethics** — recognized professional
  codes; the exam may compare them to (ISC)².
- **Computer Ethics Institute — Ten Commandments of Computer Ethics** —
  legacy document; awareness only.
- **Organization for Economic Co-operation and Development (OECD)
  Guidelines for the Security of Information Systems and Networks** —
  eight principles, internationally aligned.

### 3.1.d Common misconceptions

- "Canon IV is about protecting (ISC)²." Wrong — it is about protecting
  **the profession**, which is broader than the organization.
- "Ethics questions are subjective." Wrong — they are tested as an ordered
  decision framework. Canon I beats Canon II beats Canon III beats Canon
  IV. Pick accordingly.
- "If my employer asks me to do something unethical, I should resign
  quietly." Wrong — the CISSP's duty is to protect the public and act
  legally. Silent resignation may itself violate Canon I if the conduct
  endangers third parties.

### 3.1.e Exam-relevant nuance

The exam wants you to pick the option that serves the **highest-ranked
canon that has not already been satisfied**. Use this two-step test:

1. Which canons are in tension in this scenario?
2. Which option serves the lowest-numbered (highest-priority) canon?

The trap answer is usually the one that serves Canon III (the employer).
The correct answer is usually the one that serves Canon I (the public) or
Canon II (honesty/legality).

When a question asks "what is the FIRST action", ethics questions often
want **internal escalation before external disclosure** — because Canon I
and Canon II can usually be satisfied by informing management and giving
them the opportunity to act before going outside the organization. External
disclosure is a last resort, not a first step.

### 3.1.f Real-world examples

1. **Edward Snowden (2013).** A Domain 1 ethics debate in textbook form.
   Did disclosure to journalists serve Canon I (public good) at the cost
   of Canon II (legality) and Canon III (duty to employer)? CISSP's
   official guidance is that legal channels — inspector general, congres-
   sional committees — should be exhausted *first*. The exam would score
   the answer "use internal and statutory whistleblower channels before
   media disclosure" as BEST.
2. **Enron / Arthur Andersen (2001).** Auditors who shredded documents
   violated Canon II (legality, honesty) and arguably Canon I (public
   trust in capital markets). CISSPs in audit roles carry identical
   obligations.
3. **Cambridge Analytica / Facebook (2018).** Researchers and engineers
   who facilitated the misuse of user data violated Canon I (protect
   society) and Canon II (honesty). A CISSP who discovered the
   arrangement and stayed silent would also be in violation.

### 3.1.g Memory aids

- **"Society, Self, Service, Profession"** — the four canons in order.
- **"SPSP"** — Society, Probity, Service, Profession. Draw it vertically
  on your scratch paper at the start of the exam; ethics questions take
  seconds instead of minutes.
- Mnemonic for standing on complaints: **"A-A-P-L"** — Anyone, Anyone-
  first-hand, Principal only, Licensed only (for Canons I–IV).

### 3.1.h Cross-references

- **Domain 1 §1.5** — Legal obligations frame how ethics interacts with
  investigations (when must you report to law enforcement?).
- **Domain 1 §1.8** — Personnel security policies often include ethics
  acknowledgement as a hiring condition.
- **Domain 7 (Security Operations)** — investigation evidence handling
  has an ethics component (Canon II: honesty).

---

## 4. Sub-objective 1.2 — Security concepts (CIA, authenticity, non-repudiation, privacy)

### 4.1.a Conceptual explanation

The **CIA triad** — Confidentiality, Integrity, Availability — is the
traditional three-legged stool of information security. Every control, at
some level of abstraction, serves at least one leg:

- **Confidentiality**: preventing unauthorized disclosure of information.
  Controls include encryption at rest and in transit, access control,
  need-to-know compartmentalization, steganography, and data-loss
  prevention (DLP).
- **Integrity**: preventing unauthorized modification of information,
  and detecting modification when it occurs. Controls include hashing
  (SHA-256, SHA-3), message authentication codes (HMAC), digital
  signatures, input validation, and change detection.
- **Availability**: ensuring authorized users can access information and
  systems when needed. Controls include redundancy, fault tolerance,
  clustering, backup and recovery, DDoS protection, and capacity
  planning.

The **Parkerian Hexad** (Donn Parker, 1998) extends the triad with three
additional attributes:

- **Authenticity** — the property that data originates from its claimed
  source. Digital signatures and properly-issued certificates provide it.
- **Utility** — the property that data is useful for its intended purpose.
  Encrypted data with a lost key retains confidentiality and integrity
  but loses utility.
- **Possession (or control)** — the property that data is under the
  control of its owner. A laptop with full-disk encryption that is
  stolen has lost possession but retained confidentiality.

The CISSP exam tests both models but leans on the triad for simple
questions and the Hexad when the scenario has a subtlety the triad
cannot express — typically, a loss of possession without a loss of
confidentiality.

**Authenticity** and **non-repudiation** often get conflated. Authenticity
establishes that data came from a claimed source. Non-repudiation
additionally makes it impossible for the source to later deny having
originated the data. A MAC (HMAC) provides integrity and authenticity but
**not** non-repudiation — because two parties share the key, either
could have created the MAC. A digital signature with a properly-bound
private key provides non-repudiation, because only the signer had access
to the signing key.

**Privacy** is increasingly called out as a peer attribute to CIA in
modern frameworks. Where confidentiality is about *unauthorized
disclosure*, privacy is about *an individual's control over their own
personal data*. GDPR, CCPA, HIPAA, and PIPEDA all operationalize privacy
as a legal right.

### 4.1.b Technical deep-dive

| Property | Typical control | Cryptographic primitive |
|---|---|---|
| Confidentiality | Encryption | AES-256-GCM, ChaCha20-Poly1305 |
| Integrity | Hash + MAC | SHA-256, SHA-3, HMAC-SHA-256 |
| Authenticity | Digital signature / MAC | RSA-PSS, ECDSA, Ed25519, HMAC |
| Non-repudiation | Digital signature with PKI | RSA-PSS, ECDSA + X.509 cert |
| Availability | Redundancy, HA, DR | (non-cryptographic) |

Note the intentional overlap: authenticated encryption (AES-GCM,
ChaCha20-Poly1305) provides confidentiality, integrity, **and**
authenticity in one primitive. That efficiency is why modern protocols
(TLS 1.3, IPsec ESP-GCM, WireGuard, Signal) have moved to AEAD ciphers.

### 4.1.c Frameworks

- **ISO/IEC 27000** — defines CIA and related terms as the common
  vocabulary of the 27000 family.
- **NIST SP 800-33** — historical, but still referenced for CIA as the
  foundation of federal information protection.
- **NIST SP 800-53 Rev 5** — organizes controls by CIA-aligned control
  families.
- **FIPS 199** — categorizes federal information systems as Low, Moderate,
  or High impact **separately for confidentiality, integrity, and
  availability**. The categorization is the high-water mark across the
  three, which is a CISSP favorite exam point.

### 4.1.d Misconceptions

- "Encryption provides integrity." Wrong for most modes. CBC-mode AES
  without a MAC provides confidentiality only; an attacker can flip
  ciphertext bits and corrupt plaintext without detection. Use AEAD
  (GCM, CCM, Poly1305) or encrypt-then-MAC.
- "Hashing provides authenticity." Wrong. A plain hash provides integrity
  *assuming* the hash itself is trusted. Without a shared key (HMAC) or a
  public key (signature), anyone can recompute the hash.
- "Non-repudiation is a cryptographic property." Half-wrong. It is both
  cryptographic **and** legal/procedural. Key management, certificate
  policy, and binding of the key to an identity all matter. A key the
  user claims was stolen is a repudiation defense even against a
  technically valid signature.

### 4.1.e Exam nuance

CISSP wants you to pick the **attribute that was violated**, not the
control that was missing. If an attacker changes the amount of a wire
transfer from $100 to $10,000, the violated attribute is **integrity**,
not availability or confidentiality. If the same attacker additionally
captures the transaction record, **confidentiality** is violated too.

A favorite trap is a scenario where data is destroyed. That violates
**availability**. If the question asks "what CIA attribute was lost?" and
options include availability and integrity, pick availability — because
the data is gone, not modified.

### 4.1.f Case studies

1. **Stuxnet (2010).** Violated integrity (PLC code modified) while
   preserving confidentiality (the operators still read the plausible
   but fake values). A textbook integrity attack.
2. **Dyn DDoS (2016).** Mirai botnet attacks on Dyn's DNS service
   violated availability for Twitter, GitHub, Reddit, and dozens of
   other major sites without touching confidentiality or integrity.
3. **Capital One (2019).** Exfiltration of ~100M records via a
   misconfigured WAF and over-privileged IAM role violated
   confidentiality. The attacker did not alter or delete the data —
   integrity and availability were preserved — which is why remediation
   focused on access controls rather than restoration.

### 4.1.g Memory aids

- **CIANA**: Confidentiality, Integrity, Availability, Non-repudiation,
  Authenticity. Expanded triad for modern exams.
- **"Parker's Possession"**: remember Parkerian Hexad adds Utility,
  Possession, Authenticity — the "UPA extras".
- **"AAA"** is a *different* trio (Authentication, Authorization,
  Accounting) and belongs to IAM. Do not confuse with CIA.

### 4.1.h Cross-references

- **Domain 3** — Security architecture; CIA drives control selection.
- **Domain 3 (Cryptography)** — the primitives that implement the
  attributes.
- **Domain 4** — Network security controls are mostly CIA mapped to
  network layer.
- **Domain 8** — Application security revisits CIA at the input/output
  boundary.

---

## 5. Sub-objective 1.3 — Security governance principles

### 5.1.a Conceptual explanation

**Security governance** is the set of responsibilities and practices
exercised by the board and executive management to provide strategic
direction, ensure that objectives are achieved, ascertain that risks are
managed appropriately, and verify that the enterprise's resources are
used responsibly. It is a **board-level function**.

**Security management** is the operational execution of governance
decisions. It is a **CISO / security-team function**.

The distinction is the most-tested concept in §1.3. On the exam, a
question that offers "approve the strategy" vs "implement the strategy"
is testing governance vs management. Approval is governance (board /
steering committee); implementation is management (CISO / operations).

The **top-down model** of governance flows like this:

\`\`\`
  Board of Directors
       │   strategy, risk appetite, policy approval
       ▼
  Executive Management (CEO, CFO, COO, CIO)
       │   translate strategy into programs
       ▼
  Security Steering Committee (cross-functional)
       │   prioritize, deconflict, approve exceptions
       ▼
  CISO / Information Security Office
       │   design, operate, monitor controls
       ▼
  Operational staff
\`\`\`

CISSP will present scenarios where a CISO acts without board authority, a
board issues operational directives, or a steering committee tries to
write procedures. In each case, the correct answer restores the proper
level: the board sets direction, the CISO executes, the steering
committee prioritizes.

The **alignment principle** is next in importance: the security program
must align with the **business strategy**. Security objectives are
derived from business objectives, not invented by the security team.
A control that is technically elegant but does not support a business
objective is a candidate for removal, not celebration.

Other governance principles the exam tests:

- **Due care**: the conduct that a reasonably prudent person would
  exercise. Doing the right things.
- **Due diligence**: the investigation and verification that informs
  due care. Confirming that the right things are being done, by you
  and by third parties.
- **Defense in depth**: multiple, layered controls so that failure of
  one does not compromise the whole.
- **Least privilege**: each subject has only the access strictly
  necessary to perform its function.
- **Separation of duties (SoD)**: no single individual can complete a
  high-risk transaction end-to-end.
- **Need to know**: confidentiality-specific limitation on access.
- **Accountability**: actions are attributable to specific identities;
  requires identification, authentication, authorization, and auditing.

### 5.1.b Technical / procedural deep-dive

The **security program lifecycle** (closely related to PDCA / Plan-Do-
Check-Act and the ISO 27001 management system loop):

1. **Plan**: define scope, risk appetite, policy, objectives, and metrics.
2. **Do**: implement controls, train personnel, deploy tooling.
3. **Check**: measure, audit, internal assess, external assess.
4. **Act**: remediate gaps, update policy, adjust controls, report to
   governance.

Governance artifacts produced at each stage include the **Information
Security Charter** (Plan), the **Statement of Applicability** in an ISO
27001 ISMS (Plan → Do), **audit reports** and **KPI dashboards** (Check),
and **board reports** (Act).

### 5.1.c Frameworks

- **COBIT 2019** (ISACA) — explicit governance vs management split.
  COBIT 5 originated the distinction; COBIT 2019 continues it. Governance
  objectives use the prefix **EDM** (Evaluate, Direct, Monitor);
  management objectives use **APO, BAI, DSS, MEA**.
- **ISO/IEC 38500** — international standard for IT governance. Six
  principles (Responsibility, Strategy, Acquisition, Performance,
  Conformance, Human behavior) and three tasks (Evaluate, Direct,
  Monitor).
- **ISO/IEC 27001** — the management system standard for information
  security. Requires top-management commitment, a security policy, a
  risk treatment plan, and continual improvement.
- **NIST Cybersecurity Framework (CSF) 2.0** — the February 2024 update
  added a sixth function, **Govern**, explicitly splitting governance
  out from the earlier five (Identify, Protect, Detect, Respond,
  Recover). Expect this to appear on the exam.
- **CIS Controls v8** — operational control library; complements rather
  than replaces governance frameworks.

### 5.1.d Misconceptions

- "Governance is a synonym for management." No — governance evaluates
  and directs; management plans and executes. COBIT's EDM-vs-APO/BAI
  split is the authoritative reference.
- "The CISO owns governance." No — the CISO owns management. The **board
  owns governance**, often delegated to an audit or risk committee.
- "Security strategy starts with a threat model." No — security strategy
  starts with **business strategy**. The threat model is a later input.

### 5.1.e Exam nuance

CISSP wants you to pick the option that keeps each actor at the right
level. A question that says "the CISO wants to acquire a SIEM; what
should the CISO do FIRST?" has a BEST answer of **present the business
case to the steering committee / executive sponsor**, not "deploy the
SIEM". The CISO may technically be right that a SIEM is needed, but
acting without governance authority is the wrong manager move.

When governance and management are both plausible answers, the exam
generally rewards the higher-level (governance) answer for *strategy*
questions and the lower-level (management) answer for *execution*
questions. The qualifier word tells you which.

### 5.1.f Case studies

1. **Equifax (2017).** 147M records exfiltrated through an unpatched
   Apache Struts vulnerability. Post-incident reviews identified a
   **governance failure**: no clear ownership of vulnerability
   management, no board-level oversight, no effective escalation from
   operations to executives. The CISO at the time was not a direct
   report to the CEO. A classic Domain 1 case for "governance would
   have prevented this".
2. **Target (2013).** 40M payment cards stolen via an HVAC vendor's
   stolen credentials. The failure was both governance (third-party
   risk management) and management (network segmentation, monitoring).
   Exam framing: **supply chain risk management (SCRM) failure rooted
   in governance**.
3. **SolarWinds Orion (2020).** Supply-chain compromise of a trusted
   software update mechanism. Governance lesson: even well-managed
   security programs inherit third-party risk; the board must
   understand software bill of materials (SBOM) and supplier
   assurance as strategic questions, not operational ones.

### 5.1.g Memory aids

- **"EDM vs APO-BAI-DSS-MEA"**: COBIT's governance letters are the
  three-letter EDM only. Everything else is management.
- **"Direct, Decide, Monitor"**: the three verbs of governance. Not
  "build, deploy, operate" (those are management).
- **"Top down, not shop up"**: strategy flows down from the board,
  not up from the operations floor.

### 5.1.h Cross-references

- **Domain 1 §1.6** — policy is the written artifact of governance.
- **Domain 1 §1.9** — risk management is how governance decisions are
  operationalized.
- **Domain 6** — audit and assessment are how governance verifies that
  management is doing what governance directed.

---
`,

cissp_risk_mgmt: `

## Risk Management

Risk management is the beating heart of Domain 1. The CISSP exam treats every security decision as a risk decision, so fluency in risk vocabulary and the risk workflow is the highest-leverage investment a candidate can make.

### Core Formula

The foundational equation:

\`\`\`
Risk = Threat × Vulnerability × Impact
\`\`\`

Some textbooks drop one factor or add Likelihood as a separate factor. The exam is tolerant of variations as long as you understand the intuition: risk requires a threat with the capability and intent to exploit a vulnerability to produce an impact.

### Key Terms

| Term | Definition |
|---|---|
| **Asset Value (AV)** | Replacement cost or financial impact of loss, in currency |
| **Threat** | Potential cause of an unwanted incident (ISO 27000) |
| **Threat agent / actor** | Entity that initiates a threat |
| **Vulnerability** | Weakness that could be exploited |
| **Exploit** | Mechanism or technique to take advantage of a vulnerability |
| **Impact** | Consequence of successful exploitation |
| **Exposure Factor (EF)** | Portion of asset value lost in one incident (percentage) |
| **Single Loss Expectancy (SLE)** | Loss from one incident: SLE = AV × EF |
| **Annualized Rate of Occurrence (ARO)** | Expected frequency per year |
| **Annualized Loss Expectancy (ALE)** | Expected annual loss: ALE = SLE × ARO |
| **Risk appetite** | Amount of risk the org is willing to pursue (set by the board) |
| **Risk tolerance** | Acceptable variance around the appetite |
| **Risk capacity** | Maximum risk the org could absorb without failing |
| **Residual risk** | Risk remaining after controls are applied |
| **Inherent risk** | Risk before any controls |

### Quantitative Risk Math

The CISSP exam loves quantitative risk arithmetic because it is unambiguously testable:

\`\`\`
SLE  = AV × EF
ALE  = SLE × ARO = AV × EF × ARO
ROSI = (ALE_before - ALE_after - annual_control_cost) / annual_control_cost
\`\`\`

#### Worked Example

A laptop fleet has 1,000 devices worth \\$1,500 each. Historical data shows 2% are lost or stolen per year, with 100% loss per incident. A full-disk encryption solution costs \\$50/laptop/year and reduces EF to 10%.

\`\`\`
AV = $1,500; EF_before = 1.0; ARO = 0.02
SLE_before = $1,500 × 1.0 = $1,500
ALE_before = $1,500 × 0.02 = $30/laptop = $30,000/year (fleet)

EF_after = 0.1
SLE_after = $1,500 × 0.1 = $150
ALE_after = $150 × 0.02 = $3/laptop = $3,000/year (fleet)

Control cost = $50 × 1,000 = $50,000/year
ROSI = ($30,000 - $3,000 - $50,000) / $50,000 = -0.46 (NEGATIVE)
\`\`\`

A negative ROSI means the control is not financially justified on pure math. BUT: regulatory requirements, reputational damage, and ethical obligations can override pure ROSI.

### Qualitative Risk Assessment

Uses subjective scales (Low/Medium/High or 1-5) for likelihood and impact. Faster and cheaper than quantitative; appropriate when data is scarce. Produces a risk matrix rather than dollar figures. Less defensible to a CFO but more honest when quantitative inputs would be fabricated.

### Four Risk Treatments

1. **Avoid (eliminate)** — discontinue the activity creating the risk. Example: stop offering a feature that creates GDPR Article 9 exposure.
2. **Mitigate (reduce)** — apply controls to reduce likelihood or impact. Most common treatment and most of what security teams do.
3. **Transfer (share)** — shift financial consequence to a third party via insurance, contract, or outsourcing. Note: you can NEVER transfer accountability, only financial consequences.
4. **Accept** — acknowledge the risk and take no further action. Requires formal sign-off by an authority with risk appetite to do so. Must be documented.

**"Ignore" is NOT a valid treatment.** Undocumented, unassessed risks are governance failures, not risk decisions.

**Treatment order: Mitigate down to appetite → Transfer residual → Accept what remains → Avoid if risk exceeds capacity.**

### Control Categories and Types

**By implementer (who/what):**
- **Administrative / managerial** — policies, procedures, training, background checks
- **Technical / logical** — firewalls, encryption, IAM, IDS/IPS
- **Physical** — locks, guards, fences, bollards, mantraps

**By function (when/how):**
- **Preventive** — stop an event (locks, encryption, firewalls)
- **Detective** — identify an event (IDS, logs, CCTV, audits)
- **Corrective** — recover from an event (backups, patches, IR)
- **Deterrent** — discourage an event (warning signs, audit visibility)
- **Recovery** — restore operations after an event (DR plans, backups)
- **Compensating** — alternative when primary can't be used
- **Directive** — guide behavior (policies, signs, training)

### Threat Modeling

Threat modeling is performed ideally during design and identifies what can go wrong, how, who might cause it, and what to do about it.

**Shostack's Four Questions:**
1. What are we building?
2. What can go wrong?
3. What are we going to do about it?
4. Did we do a good job?

**Major Methodologies:**
- **STRIDE** — Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege
- **PASTA** — Process for Attack Simulation and Threat Analysis (seven stages, risk-centric)
- **DREAD** — Damage, Reproducibility, Exploitability, Affected users, Discoverability (scoring model, deprecated but still tested)
- **LINDDUN** — privacy-focused counterpart to STRIDE
- **Attack trees** — hierarchical decomposition of attacker goals
- **Kill chain** — Lockheed Martin (7 stages) and MITRE ATT&CK

### Risk Frameworks

| Framework | Focus |
|---|---|
| **NIST SP 800-30 Rev 1** | Guide for Conducting Risk Assessments |
| **NIST SP 800-37 Rev 2 (RMF)** | Prepare → Categorize → Select → Implement → Assess → Authorize → Monitor |
| **NIST SP 800-39** | Managing risk across three tiers: org, mission, system |
| **ISO/IEC 27005** | Information security risk management |
| **ISO 31000** | Enterprise risk management |
| **FAIR** | Quantitative: Loss Event Frequency × Loss Magnitude |
| **OCTAVE / OCTAVE Allegro** | Asset-driven, workshop-based |
| **COSO ERM** | Enterprise risk management for finance and audit |

### Exam Tips

- When asked what to do FIRST after identifying a risk: **assess** (not mitigate, transfer, or accept). You cannot choose a treatment without first assessing.
- **Who owns a risk?** The business process owner or data owner, NOT the CISO. The CISO facilitates; the business owns.
- Risk decisions must be **formal, documented**, and tied to business objectives.
- Residual risk can never be zero (except by avoiding the activity entirely).
- When quantitative and qualitative both appear as options, choose the one that matches the available data — quantitative when data exists, qualitative when it doesn't.

### Case Studies

1. **Equifax 2017**: Risk identification (Apache Struts CVE) was timely; risk treatment (patch) was not. Governance failed to enforce treatment.
2. **Capital One 2019**: Risk acceptance decisions around a WAF configuration left an SSRF path. The risk was knowable; treatment was inadequate.
3. **Maersk / NotPetya 2017**: \\$300M+ event from a supply-chain compromise. Risk model didn't include "all Windows servers destroyed simultaneously" as a plausible scenario.

`,

cissp_compliance: `
## 6. Sub-objective 1.4 — Legal, regulatory, and compliance

### 6.1.a Conceptual explanation

Legal and regulatory compliance is where information security touches the
rest of civil society. On the CISSP exam, this sub-objective is tested in
two ways: **recognition** (knowing which statute governs which data) and
**application** (picking the right action when a law and a business goal
conflict).

The core legal concepts are **jurisdiction**, **liability**, and
**standards of care**. Jurisdiction answers "whose courts and whose laws
apply?" — which depends on where the data subject lives, where the data
is processed, where the company is incorporated, and where the contract
was signed. Liability answers "who pays when things go wrong?" —
typically the data controller under GDPR, the covered entity under
HIPAA, the merchant under PCI-DSS. Standards of care answer "what does a
reasonable organization do?" — captured in the due care / due diligence
framework.

The exam wants you to know the **big families** of law that intersect
information security:

1. **Privacy and data protection** — GDPR, CCPA/CPRA, HIPAA, PIPEDA,
   PDPA (Singapore), LGPD (Brazil), POPIA (South Africa), Canada's
   PIPEDA, the Japan APPI, etc.
2. **Sector-specific** — GLBA (US finance), HIPAA/HITECH (US health),
   FERPA (US education), FISMA (US federal agencies), PCI-DSS (card
   payment industry, contractual rather than statutory), NERC CIP
   (US bulk electric system).
3. **Corporate governance** — SOX (US publicly traded companies), the
   UK Corporate Governance Code, J-SOX (Japan).
4. **Intellectual property** — copyright, trademark, trade secret,
   patent; DMCA in the US; WIPO treaties internationally.
5. **Computer crime** — Computer Fraud and Abuse Act (CFAA, US),
   Computer Misuse Act (UK), the Budapest Convention on Cybercrime
   (Council of Europe, multilateral).
6. **Export control** — US ITAR and EAR; the Wassenaar Arrangement
   (multilateral, covering dual-use technologies including certain
   cryptography and intrusion software).

### 6.1.b Technical / procedural deep-dive: GDPR and CCPA side-by-side

| Attribute | GDPR (EU) | CCPA / CPRA (California) |
|---|---|---|
| Effective | May 25, 2018 | Jan 1, 2020; CPRA Jan 1, 2023 |
| Scope | Any controller/processor handling EU resident data, regardless of where established | Businesses meeting revenue or volume thresholds, handling California resident data |
| Key roles | Controller, Processor, DPO, Supervisory Authority | Business, Service Provider, Contractor |
| Individual rights | Access, rectification, erasure, restriction, portability, object, automated-decision opt-out | Know, delete, correct, opt-out of sale/share, limit use of sensitive PI, non-discrimination |
| Lawful basis requirement | Yes (consent, contract, legal obligation, vital interest, public task, legitimate interest) | Notice-and-opt-out model (not lawful-basis) |
| Penalties | Up to €20M or 4% of global annual turnover, whichever is higher | Up to $7,500 per intentional violation; private right of action for breaches |
| Breach notification | 72 hours to supervisory authority | As soon as practicable; specific rules under Cal. Civ. Code §1798.82 |

Exam-critical nuance: GDPR's extraterritorial reach means a company
based outside the EU that processes EU resident data **is** subject to
GDPR. The CISSP exam loves this trap.

### 6.1.c Frameworks and authorities

- **European Data Protection Board (EDPB)** — issues authoritative
  GDPR guidance.
- **ICO** (UK), **CNIL** (France), **BfDI** (Germany) — national
  supervisory authorities.
- **US Federal Trade Commission (FTC)** — enforces unfair-and-deceptive-
  practice actions for data breaches, effectively a de facto national
  privacy regulator.
- **US Department of Health and Human Services, Office for Civil
  Rights (OCR)** — enforces HIPAA.
- **PCI Security Standards Council** — issues PCI-DSS (v4.0 effective
  April 2024, transition complete March 2025).

### 6.1.d Misconceptions

- "PCI-DSS is a law." No — it is a **contractual standard** imposed by
  the card brands on merchants and service providers. Violation is a
  contractual matter, not a statutory one — but may trigger statutory
  consequences indirectly (e.g., state breach notification laws).
- "GDPR only applies to EU companies." No — it applies wherever EU
  resident personal data is processed.
- "HIPAA covers all health information." No — it covers **Protected
  Health Information (PHI)** held by **Covered Entities** and
  **Business Associates**. A fitness tracker app sold direct-to-
  consumer by a non-covered entity is generally outside HIPAA.
- "SOX is about security." Indirectly. SOX is about the integrity of
  financial reporting controls, which in modern organizations depend
  on IT controls, which depend on security controls. The chain is
  real but the statutory language is financial, not technical.

### 6.1.e Exam nuance

CISSP wants you to pick the option that reflects the **most protective**
framework when regulations overlap. When GDPR and CCPA both apply,
GDPR is typically the more stringent, so the correct course of action
is the one that satisfies GDPR (which will also satisfy most of CCPA
as a side effect).

Another exam pattern: when a scenario asks "what must the organization
do FIRST" after a suspected breach, the answer is almost always
**contain, preserve evidence, notify per policy/law** in that order.
Destroying evidence to limit disclosure is an ethics and legal violation.

Beware the word "encryption" in breach notification statutes. Most US
state breach notification laws have an **encryption safe harbor**: if
the data was encrypted and the key was not also compromised, the
notification obligation may not be triggered. GDPR has a similar but
narrower concept of "technical and organisational measures" that can
reduce notification scope.

### 6.1.f Case studies

1. **British Airways / ICO fine (2020, appealed).** Initially proposed
   £183M fine under GDPR for a 2018 Magecart-style skimmer attack that
   exfiltrated 400K+ customer records; settled at £20M. Demonstrates
   GDPR's 4%-of-turnover ceiling is a real instrument, not a
   theoretical one.
2. **Marriott / Starwood (2018).** Four-year undetected dwell after an
   initial Starwood compromise in 2014, discovered after the Marriott
   acquisition. Two governance lessons: (a) **acquisition due
   diligence** must include a security assessment of the target, and
   (b) GDPR applies retrospectively once the merged entity inherits
   the data.
3. **Target / HVAC vendor (2013).** 40M cards stolen via a vendor's
   credentials used to access a network segment that should have been
   isolated. Cost ≈ $290M in settlements and upgrades. Legally, the
   card brands invoked PCI-DSS liability shift; the company also
   faced state AG and FTC actions.

### 6.1.g Memory aids

- **"GDPR = Grand Data Protection Regulation"** — think "big" and
  "global". Scope is global, fines are big.
- **"HIPAA has two A's: A for Administrative, A for Accountability"**
  — HIPAA's Security Rule has Administrative, Physical, and Technical
  safeguards; the exam loves the three-category structure.
- **"SOX 302, SOX 404"** — Section 302 is CEO/CFO certification;
  Section 404 is internal control over financial reporting.

### 6.1.h Cross-references

- **Domain 1 §1.5** — investigation types (criminal, civil, regulatory,
  administrative) map to enforcement of these laws.
- **Domain 2** — data classification and retention drive compliance
  boundaries.
- **Domain 7** — incident response procedures must implement breach
  notification timelines from the governing statute.

---

## 7. Sub-objective 1.5 — Investigation types

### 7.1.a Conceptual explanation

The CISSP exam distinguishes five investigation types, each with a
different burden of proof, different procedures, and different consumer:

| Type | Burden of proof | Primary consumer | Typical trigger |
|---|---|---|---|
| Administrative | Policy/agreement | HR, management | Policy violation |
| Criminal | Beyond a reasonable doubt | Prosecutor, court | Alleged crime |
| Civil | Preponderance of the evidence | Plaintiff's counsel | Tort, contract dispute |
| Regulatory | Varies; often preponderance | Regulator | Compliance failure |
| Industry standards | Contractual | Industry body / auditor | Audit finding |

Understanding the burden of proof is the single most-tested concept
here. The exam will present a scenario and ask "which type of
investigation is this?" or "what standard of proof applies?" — and the
correct answer is always tied to the actor, not just the alleged act.
The same conduct (improper data access) could trigger an administrative
investigation (HR will discipline), a civil investigation (the data
subject sues), a criminal investigation (the prosecutor charges CFAA),
and a regulatory investigation (HHS OCR investigates for HIPAA), all at
once — and each has its own rules.

### 7.1.b Technical / procedural deep-dive: evidence handling

Regardless of investigation type, **evidence integrity** must be
maintained. The CISSP exam tests the following concepts:

- **Chain of custody** — documented record of every person who handled
  the evidence, with timestamps. Breaks in the chain are grounds to
  exclude evidence at trial.
- **Best evidence rule** — the original evidence is preferable; copies
  are admitted only when the original is unavailable. For digital
  evidence, the "original" is typically a forensically sound image.
- **Five rules of evidence (the classic CISSP list)**: authentic,
  accurate, complete, convincing, and admissible.
- **Forensic imaging** — bit-for-bit copy with cryptographic hash for
  integrity. Tools: dd, FTK Imager, EnCase. Always image **before**
  analysis; never analyze the original.
- **Write blockers** — hardware or software preventing writes to the
  evidence medium during imaging.
- **Order of volatility** (RFC 3227) — collect more-volatile evidence
  first: CPU registers, cache → RAM → process state → disk → archival
  media.

### 7.1.c Frameworks

- **RFC 3227 — Guidelines for Evidence Collection and Archiving** —
  authoritative for order of volatility.
- **NIST SP 800-86 — Guide to Integrating Forensic Techniques Into
  Incident Response.**
- **ISO/IEC 27037 — Guidelines for Identification, Collection,
  Acquisition, and Preservation of Digital Evidence.**
- **Federal Rules of Evidence (US)** — particularly Rule 702 (expert
  testimony), Rule 901 (authentication), Rule 902 (self-authenticating
  documents).
- **Daubert standard** (US) — the admissibility test for scientific
  expert testimony, replacing the older Frye standard in federal court.

### 7.1.d Misconceptions

- "Criminal and civil cases can't run in parallel." They can and
  frequently do. The O.J. Simpson case is the textbook example: not
  guilty criminally (beyond reasonable doubt) but liable civilly
  (preponderance of evidence).
- "Regulatory investigations always result in fines." Sometimes they
  result in consent decrees, corrective action plans, or no action
  at all. Fines are one outcome among several.
- "Chain of custody starts when the evidence reaches the lab." No —
  it starts at first acquisition in the field.

### 7.1.e Exam nuance

CISSP wants you to recognize that **administrative investigations are
the CISSP's most common reality** — an internal policy-violation
inquiry conducted by the organization, not by law enforcement. The
burden of proof is policy, not the criminal standard. Do not over-
escalate to "preserve evidence for prosecution" when the scenario is
clearly an internal HR matter.

But also beware the reverse: when a scenario hints at *potential*
criminal conduct, preserve evidence **as if** criminal prosecution
were possible, because a later escalation is much more defensible
than a later upgrade of a mishandled evidence record. The CISSP
answer in ambiguous cases is: follow forensic best practices now,
decide later whether to prosecute.

### 7.1.f Case studies

1. **Sony Pictures (2014).** Criminal (FBI attribution to DPRK),
   civil (employee class actions over leaked personal data), and
   regulatory investigations ran in parallel. Evidence handling
   spanned multiple jurisdictions.
2. **Edward Snowden matter (2013).** Administrative (clearance
   revocation), criminal (Espionage Act charges), and civil/policy
   consequences all flowed from the same conduct.
3. **Hannah Anderson kidnapping (2013).** Early example of the legal
   process compelling cloud providers to produce stored communications
   under the Stored Communications Act — a template for modern cloud
   forensics orders.

### 7.1.g Memory aids

- **"AC CR I"** — Administrative, Criminal, Civil, Regulatory,
  Industry. Say it as "AC-CR-I".
- **"BRAP"** — Burden of proof from highest to lowest: **B**eyond
  reasonable doubt (criminal) → **R**easonable preponderance
  (civil/regulatory) → **A**dministrative policy → **P**rivate
  (industry standard).
- **Order of volatility**: **"RAM-DISK-ARCHIVE"** — volatile first,
  persistent last.

### 7.1.h Cross-references

- **Domain 7** — incident response is where investigation-readiness
  lives operationally.
- **Domain 1 §1.4** — the applicable law determines which investigation
  type is triggered and which burden of proof applies.

---

## 8. Sub-objective 1.6 — Policy, standards, procedures, guidelines

### 8.1.a Conceptual explanation

The CISSP exam treats these four document types as a strict hierarchy:

1. **Policy** — high-level statement of management intent and direction.
   Approved by senior management or the board. Mandatory. Technology-
   and vendor-independent. Changes rarely.
2. **Standard** — mandatory, specific requirements that operationalize a
   policy. May reference specific technologies, versions, or
   configurations. Changes when technology changes.
3. **Procedure** — step-by-step instructions for performing a task.
   Mandatory for those who perform the task. Changes frequently as
   systems evolve.
4. **Guideline** — recommended, discretionary guidance. Non-mandatory.
   Provides flexibility where rigid rules would be counterproductive.
5. **Baseline** (sometimes listed as a fifth) — minimum security
   configuration that a system must meet. Often expressed as a STIG,
   CIS benchmark, or similar.

The exam tests the **mandatory vs discretionary** split and the
**high-level vs specific** axis. A document that says "the organization
will protect sensitive data" is a policy. A document that says "all
sensitive data must be encrypted with AES-256 or equivalent" is a
standard. A document that says "run the script backup.sh at 2 a.m." is a
procedure. A document that says "consider encrypting sensitive data at
rest" is a guideline.

Policies are authored by or with the sponsorship of **senior management**
and approved at that level. A policy that lacks executive sponsorship is
a memo, not a policy.

### 8.1.b Technical / procedural deep-dive: policy anatomy

A well-formed policy document typically contains:

- **Purpose** — why the policy exists.
- **Scope** — to whom and to what it applies.
- **Policy statements** — the actual mandatory rules.
- **Roles and responsibilities** — who does what.
- **Compliance and exceptions** — consequences of non-compliance and
  the process for requesting exceptions.
- **Review and revision** — frequency and owner.
- **Approval** — signature of the approving authority.

**Issue-specific** policies target a particular topic (e.g., Acceptable
Use Policy, Email Retention Policy). **System-specific** policies target
a particular system (e.g., the production database policy). **Program
policies** (also called **organizational** or **master** policies) set
the overall direction of the security program.

### 8.1.c Frameworks

- **NIST SP 800-12** — classic "Introduction to Information Security"
  that defines program / issue-specific / system-specific policy types.
- **NIST SP 800-53** — every control family begins with a "Policy and
  Procedures" control (e.g., AC-1, AU-1, IR-1), institutionalizing the
  document hierarchy.
- **ISO/IEC 27001 clause 5.2** — requires a top management-approved
  information security policy.
- **SANS Policy Templates** — widely used starting points for
  organizations building a policy library from scratch.

### 8.1.d Misconceptions

- "Guidelines are mandatory if the CISO says so." No. If the CISO
  wants a rule to be mandatory, the correct action is to promote it
  to a standard, not to enforce a guideline as if it were a standard.
- "Policy changes every time a control changes." No — policies are
  deliberately technology-independent and should change rarely.
  Frequent policy churn signals that standards, not policy, should
  have been updated.
- "Procedures are a form of policy." No — procedures are derivative.
  They implement standards, which implement policy.

### 8.1.e Exam nuance

CISSP wants you to choose the document that matches the **level of
abstraction** in the scenario. If the scenario asks "what document
specifies that all laptops must use full-disk encryption with AES-256?",
the answer is **standard**, not policy. If the scenario asks "what
document authorizes the organization to require encryption on all
devices?", the answer is **policy**.

When a question asks what document is **changed** when the encryption
algorithm is updated from AES-128 to AES-256, the answer is the
**standard** — not the policy.

The exam occasionally tests the ordering: policy first, then standards,
then procedures and guidelines. A scenario that has "the team wrote
procedures for a new system before the system owner approved the
security policy" is testing that you recognize the policy should have
come first.

### 8.1.f Case studies

1. **The "shadow IT" phenomenon.** Many organizations discover that
   employees are using unsanctioned SaaS tools (Dropbox, personal
   Gmail, WhatsApp) because the Acceptable Use Policy never addressed
   them. The fix is a policy update, not just a block list.
2. **HIPAA Security Rule — required administrative safeguards.** The
   Rule explicitly requires a **Security Management Process** that
   begins with a written risk analysis and a written sanction policy
   — policy artifacts are compliance primary evidence.
3. **PCI-DSS v4.0.** Requirement 12 is devoted to "Maintain an
   Information Security Policy" — elevating policy to a peer of
   technical requirements like firewalls and encryption. The exam
   loves pointing out that PCI treats policy as a control, not just a
   prerequisite.

### 8.1.g Memory aids

- **"PSPG"** — Policy, Standard, Procedure, Guideline. In order of
  decreasing abstraction and decreasing mandatory-ness (except
  procedures, which are mandatory but very specific).
- **"Mandatory, Mandatory, Mandatory, Suggested"** — first three are
  mandatory; guideline is discretionary.
- **"What, How-must, How-step, How-might"** — the four documents in
  plain English. Policy says WHAT; standard says HOW you MUST do it;
  procedure says HOW to DO it step by step; guideline says HOW you
  MIGHT do it.

### 8.1.h Cross-references

- **Domain 1 §1.3** — policies are the output of governance.
- **Domain 6** — audits test whether practice conforms to policy.
- **Every other domain** — each technical control family begins with
  a policy in NIST SP 800-53 and ISO 27002.

---
`,

cissp_bcdr: `

## Business Continuity & Disaster Recovery

### BIA (Business Impact Analysis)

The BIA is the foundation of all business continuity planning. It identifies critical business processes, quantifies the impact of their disruption over time, and produces recovery metrics.

**What the BIA produces:**
- Identification and prioritization of critical business processes
- Quantification of financial and operational impact of disruption
- Recovery metrics: MTD, RTO, RPO, WRT for each critical process
- Dependencies between processes (upstream/downstream)
- Resource requirements for recovery

### Recovery Metrics

| Metric | Meaning | Example |
|---|---|---|
| **MTD / MTPD** | Maximum Tolerable Downtime — the longest the business can survive without the process | "We can survive 72h without payroll" |
| **RTO** | Recovery Time Objective — target time to restore | "Payroll restored within 24h" |
| **RPO** | Recovery Point Objective — max acceptable data loss (in time) | "Lose at most 4h of transactions" |
| **WRT** | Work Recovery Time — time to verify data, test, resume normal | "8h to reconcile and re-enable" |

**Critical formula: RTO + WRT ≤ MTD**

If RTO is 24h and WRT is 8h, MTD must be at least 32h. If MTD is only 24h, the plan is infeasible on paper.

### BCP vs DRP

- **Business Continuity Plan (BCP)** — the broad program to keep the business operating during and after disruption. Scope: business processes, not just IT.
- **Disaster Recovery Plan (DRP)** — a subset of BCP focused on restoring IT services.

Both sit under the parent discipline of **operational resilience**.

### BCP Test Types

From least to most disruptive:
1. **Checklist review** — paper verification of plan completeness
2. **Tabletop exercise** — discussion-based scenario walkthrough
3. **Walkthrough** — detailed step-by-step review with SMEs
4. **Simulation** — partial execution in a controlled environment
5. **Parallel test** — full execution at DR site, primary continues
6. **Full interruption** — shut down primary, force real failover

### Crisis Management

During a crisis, the priority order is always:
1. **Personnel safety** — evacuate, account for people, provide medical aid
2. **Business continuity** — maintain critical processes via alternate means
3. **Technology recovery** — restore IT systems and data

A CISSP who recommends a technology action before ensuring personnel safety has the wrong answer on the exam.

### Key Frameworks

- **NIST SP 800-34 Rev 1** — Contingency Planning Guide for Federal Information Systems
- **ISO 22301** — Business Continuity Management Systems (BCMS)
- **ISO/IEC 27031** — ICT readiness for business continuity
- **DRI International Professional Practices** — ten practices for BCP professionals

### Case Studies

1. **Hurricane Katrina (2005)**: Organizations with only local DR lost both primary and secondary. Lesson: geographic separation.
2. **AWS us-east-1 outages (multiple)**: Cloud is not automatically multi-region. Cloud DR requires explicit design.
3. **WannaCry / NHS (2017)**: Business continuity mattered more than IT recovery — surgeries cancelled, patients diverted, paper workflows activated.

### Exam Tips

- The BIA is the MOST IMPORTANT element of the BCP
- Personnel safety is ALWAYS first in a disaster
- "Which test is LEAST disruptive?" → Checklist
- "MOST realistic while preserving production?" → Parallel
- Reciprocal agreements are rarely recommended (both need it simultaneously)
- RTO + WRT ≤ MTD — write this on your scratch paper at exam start

`,

cissp_personnel: `
## 10. Sub-objective 1.8 — Personnel security

### 10.1.a Conceptual explanation

People are both the most important resource and the most common attack
vector in information security. Personnel security is the discipline
of managing risk from **insiders** — employees, contractors, partners,
and visitors — through the full employment lifecycle.

The lifecycle has five stages:

1. **Screening and hiring** — background checks, reference verification,
   education verification, credit checks where legally permissible.
   Scope calibrated to role sensitivity and jurisdictional law.
2. **Onboarding** — employment agreement (including confidentiality and
   acceptable-use clauses), provisioning of least-privilege access,
   security-awareness orientation, assignment of a mentor where
   applicable.
3. **In-employment** — ongoing awareness training, periodic access
   recertification, performance and conduct monitoring, rotation of
   duties, mandatory vacation, separation of duties.
4. **Change of role** — recertification of access, re-training for the
   new role, formal transfer of accountability. The exam warns
   against "privilege accumulation" where access from prior roles is
   never removed.
5. **Termination** — immediate access revocation, return of assets,
   exit interview, continuing confidentiality obligation. For high-
   risk terminations, access should be revoked **before** the
   termination meeting, not after.

Principles that govern the lifecycle:

- **Least privilege** — each person has only the access strictly
  required for their job.
- **Separation of duties (SoD)** — high-impact transactions require
  two or more people. Classic examples: developer can write code but
  cannot deploy to production; accountant can post invoices but
  cannot approve payment.
- **Job rotation** — periodic reassignment; detects fraud (hidden
  schemes unravel when someone else sits in the seat) and reduces
  insider dependency.
- **Mandatory vacation** — forces an extended period away from the
  job. Classic fraud-detection control.
- **Need to know** — access limited to information necessary for the
  task, layered on top of least privilege.
- **Dual control / M-of-N** — an action requires simultaneous
  cooperation of multiple authorized people.

### 10.1.b Technical / procedural deep-dive: third-party personnel

Third-party personnel (contractors, consultants, outsourcers) introduce
risks that employees do not:

- They may be subject to different background-check standards.
- Their employer, not yours, controls their discipline and termination.
- They may rotate across multiple clients, increasing aggregation risk.
- Their devices may not meet your baseline.

The CISSP controls for third-party personnel:

- **Contractual security clauses** in the master services agreement
  (MSA) or data processing agreement (DPA), including right-to-audit,
  incident notification timelines, and flow-down requirements for
  sub-processors.
- **Pre-engagement due diligence**: SOC 2 Type II report review, ISO
  27001 certificate verification, vulnerability disclosure policy
  review.
- **Access restricted to a segmented environment**, with time-limited
  credentials and session recording for privileged access.
- **Exit procedures** tied to the third-party relationship, not the
  individual contractor.

### 10.1.c Frameworks

- **NIST SP 800-53 PS control family** — Personnel Security, covering
  screening, termination, third-party personnel, and sanctions.
- **ISO/IEC 27002** — clauses on human resource security (A.6 in the
  2022 revision's Annex A).
- **ISO/IEC 27036** — supplier relationships, including personnel
  dimensions.

### 10.1.d Misconceptions

- "Background checks prevent insider threats." They reduce but do
  not eliminate. Insider incidents frequently involve employees with
  clean checks who turn hostile during employment.
- "Termination is an IT event." It is an HR-led, IT-supported event.
  HR owns the termination decision and notification; IT executes
  access revocation on a fixed timeline.
- "Separation of duties is only for finance." SoD applies across the
  organization — developers vs operators, security vs audit,
  requesters vs approvers.

### 10.1.e Exam nuance

CISSP wants you to pick the control that best prevents **collusion**
when two or more insiders might cooperate to defeat a single control.
Job rotation and mandatory vacation are the classic anti-collusion
controls — they make hidden schemes unsustainable.

A favorite trap: a scenario asks what should happen when an employee
is **voluntarily** leaving vs being **involuntarily** terminated. The
CISSP answer treats involuntary termination as higher risk: access
revoked before notification, escort off premises, immediate return
of assets. Voluntary termination can follow a more graceful timeline.

Another trap: a question asks who should conduct the **exit interview**.
The answer is HR, with security participating to confirm return of
assets and acknowledgment of continuing confidentiality obligations.
Security does not own the exit interview.

### 10.1.f Case studies

1. **Edward Snowden (2013).** Cleared NSA contractor who exfiltrated
   classified documents. Post-incident lessons included **need-to-
   know enforcement** (Snowden had access beyond his role),
   **privileged access monitoring**, and **two-person integrity**
   for the most sensitive systems.
2. **Société Générale / Jérôme Kerviel (2008).** $7B trading loss
   traced to a rogue trader whose prior middle-office experience let
   him evade controls. Core failure: **no enforced mandatory
   vacation**, which would have surfaced the hidden positions.
3. **Morrison Supermarkets (UK, 2014).** An internal auditor with
   legitimate access to payroll data published it publicly as
   revenge. Illustrates that insider **authorized access** combined
   with **malicious intent** is the hardest case: technical controls
   were working as designed.

### 10.1.g Memory aids

- **"Hire, Train, Trust, Verify, Fire"** — the five stages.
- **"SoD, Rotate, Vacate"** — the anti-collusion trio.
- **"Least, Need, Separation"** — the three access principles.

### 10.1.h Cross-references

- **Domain 5** — IAM implements least privilege and access
  recertification technically.
- **Domain 6** — audits verify SoD and access recertification are
  actually happening.
- **Domain 7** — insider threat response.

---

## 13. Sub-objective 1.11 — Supply Chain Risk Management (SCRM)

### 13.1.a Conceptual explanation

Supply Chain Risk Management recognizes that modern organizations depend
on a web of hardware, software, service, and personnel suppliers — any
of which can introduce risk. The discipline answers: *how do we manage
risk we do not directly control?*

The supply chain extends through:

- **Hardware** vendors and their upstream component sources.
- **Software** vendors and their open-source dependencies.
- **Service** providers (SaaS, cloud, managed security services).
- **Contract personnel** (Domain 1 §1.8 crosses here).
- **Sub-processors** of any of the above.

Core SCRM principles:

- **Visibility**: you cannot manage what you cannot see. A software
  bill of materials (SBOM) for software, a hardware bill of materials
  (HBOM) for physical goods.
- **Tiering**: not all suppliers matter equally. Risk-tier by data
  sensitivity, criticality, and dependency depth.
- **Assurance**: attestation (SOC 2 reports, ISO 27001 certificates),
  audit rights, independent assessments.
- **Flow-down**: contractual security requirements must flow from
  prime to sub-contractor to sub-sub.
- **Continuous monitoring**: vendor risk is not a one-time event;
  monitor for breach disclosures, financial distress, ownership
  changes.
- **Exit planning**: every critical supplier relationship needs a
  documented exit strategy before it starts.

### 13.1.b Technical deep-dive: SBOM and software supply chain

An **SBOM** is a formal, machine-readable inventory of the components
that make up a piece of software, including version and license. The
three leading standards:

- **SPDX** (ISO/IEC 5962:2021) — Linux Foundation project, widely used.
- **CycloneDX** — OWASP project, commonly used in application security.
- **SWID tags** (ISO/IEC 19770-2) — component identifiers useful in
  combination with SPDX or CycloneDX.

The US **Executive Order 14028** (May 2021) and the resulting NIST
SSDF, OMB M-22-18, and CISA guidance formalized SBOM as a federal
procurement requirement and set expectations that are rapidly spreading
into commercial practice.

**Secure Software Development Framework (NIST SSDF / SP 800-218)**
specifies practices for suppliers: prepare the organization, protect
the software, produce well-secured software, respond to vulnerabilities.

### 13.1.c Frameworks

- **NIST SP 800-161 Rev 1 — Cybersecurity Supply Chain Risk Management
  Practices for Systems and Organizations.** The canonical US SCRM
  reference.
- **ISO/IEC 27036 — Supplier relationships (four parts).**
- **ISO 28000 — Supply chain security management.**
- **NIST SSDF (SP 800-218) — Secure Software Development Framework.**
- **EO 14028** — US executive order driving SCRM into federal
  procurement.
- **Cyber Resilience Act (EU, pending/adopted 2024)** — European
  counterpart establishing supplier obligations for connected
  products.

### 13.1.d Misconceptions

- "Our SOC 2 report covers our supply chain risk." Partially. A SOC 2
  covers the service organization's controls, not its upstream
  vendors. You must still review the supplier's own vendor management.
- "Open source is free, so it is not supply chain." Open source is
  100% supply chain. Log4Shell (CVE-2021-44228) and event-stream
  (2018) are the canonical cases.
- "SBOM is an artifact, not a control." SBOM is an enabling artifact;
  the control is the process that uses the SBOM (vulnerability
  correlation, incident response scoping, license compliance).

### 13.1.e Exam nuance

CISSP wants the **contractual** and **governance** answer to supply-
chain questions, not only the technical. A scenario asking what
should be done BEFORE engaging a new SaaS vendor for sensitive data
wants: **perform due diligence, execute a DPA/MSA with security
terms, include right-to-audit, define exit criteria**. Deploying the
vendor and then auditing afterwards is the wrong order.

When the scenario involves a **third-party breach**, the correct
response is typically: **invoke the notification clause, preserve
evidence, assess impact to your data, notify your own regulators and
customers per statute, manage communications**. The exam punishes
answers that only address the third party's controls.

### 13.1.f Case studies

1. **SolarWinds Orion (2020).** A nation-state compromise of a build
   system inserted malicious code into a legitimately signed update
   that reached ~18,000 organizations. The defining SCRM case of the
   decade. Governance lessons: assume a trusted update can be
   weaponized; monitor for anomalous behavior even from signed
   software.
2. **Log4Shell / Log4j (2021, CVE-2021-44228).** A ubiquitous Java
   logging library's JNDI lookup feature enabled RCE in nearly any
   application that logged untrusted input. The event made SBOMs a
   board-level conversation: organizations could not answer "do we
   use Log4j?" quickly.
3. **Target / Fazio Mechanical (2013).** HVAC vendor credentials used
   to pivot into the retail POS network. Perfect textbook case for
   tiering (why did an HVAC vendor reach the POS network?),
   segmentation, and third-party monitoring.

### 13.1.g Memory aids

- **"See, Sort, Sign, Survey, Stop"** — the SCRM lifecycle.
  **S**ee (visibility), **S**ort (tier), **S**ign (contracts),
  **S**urvey (monitor), **S**top (exit).
- **"SBOM = See Before Oh-My"** — inventory components before
  discovering a vulnerability the hard way.

### 13.1.h Cross-references

- **Domain 1 §1.8** — third-party personnel.
- **Domain 3** — trusted computing base and secure design have
  supply chain implications.
- **Domain 8** — DevSecOps and SSDF sit directly on top of SCRM for
  software.

---

## 14. Sub-objective 1.12 — Security awareness, education, and training

### 14.1.a Conceptual explanation

The CISSP exam distinguishes three levels of learning:

- **Awareness** — short-form, broad-audience reminders that security
  exists and matters. Posters, phishing-simulation debriefs, monthly
  newsletters, onboarding orientations.
- **Training** — role-specific skill building. Developers learn
  secure coding; administrators learn hardening; finance staff learn
  wire-fraud red flags.
- **Education** — long-form, theory-heavy, often external. Degree
  programs, CISSP itself, multi-day vendor certifications.

The **purpose** of each is different: awareness changes attention;
training changes capability; education changes understanding.

A mature program has all three, sequenced and reinforced. Awareness
reaches everyone; training reaches people with specific duties;
education is optional for most but mandatory for specialized roles.

The security awareness program should be **measurable**. Common KPIs:

- Phishing-simulation click rate and reporting rate.
- Policy acknowledgment completion rates.
- Role-based training completion rates.
- Incident rates per capita before and after interventions.
- User-reported suspicious activity rates (a positive metric: more
  reports usually mean a healthier culture, not more risk).

### 14.1.b Technical deep-dive: phishing simulation programs

Phishing simulations are the most common measurable control in
awareness programs. Best practices:

- **Don't name and shame**. Publicly shaming clickers destroys the
  reporting culture you need more than it improves the click rate.
- **Measure both clicks and reports**. Reports are the leading
  indicator of resilience.
- **Vary lure types and sophistication**. Don't just send the same
  fake Office 365 login forever.
- **Debrief immediately**. Clickers see an educational landing page
  at the moment of the click, not a month later.
- **Tie results to role-based training**, not generic punishment.
- **Avoid pretexts that cause real harm** (fake bonus announcements,
  fake layoff notices, fake medical alerts). Some pretexts have
  triggered lawsuits and regulator interest.

### 14.1.c Frameworks

- **NIST SP 800-50** — Building an Information Technology Security
  Awareness and Training Program. The canonical US reference;
  introduces the awareness → training → education model.
- **NIST SP 800-16 Rev 1 (Draft)** — role-based training model.
- **ISO/IEC 27002 A.7.2.2 / A.6.3** — awareness, education, and
  training obligations.
- **SANS Security Awareness Maturity Model** — five levels from
  "non-existent" to "metrics framework".

### 14.1.d Misconceptions

- "Awareness is a one-time event." No — it is continuous. Once-a-
  year video training degrades rapidly.
- "If users still click phishing emails, the program has failed."
  Partly. A healthy program drives **click rates down and report
  rates up**; both metrics matter.
- "Training replaces controls." No — training reduces risk but is
  not a substitute for technical controls (MFA, DMARC, email
  filtering). Defense in depth applies.

### 14.1.e Exam nuance

CISSP wants you to recognize that **awareness is for everyone, training
is for some, education is for specialists**. A question asking what is
appropriate for all employees is "awareness"; for developers, "role-
based training"; for the CISO, "education/professional development".

When a scenario describes a recurring phishing problem, the BEST answer
combines **technical controls** (filtering, DMARC, MFA) and **targeted
training** for repeat clickers — not awareness alone. The exam rewards
the layered answer.

### 14.1.f Case studies

1. **Ubiquiti / business email compromise (2015).** $46M lost to a
   spear-phishing-driven BEC that impersonated executives. A training
   failure compounded by weak wire-transfer process controls.
2. **Twitter BTC hack (2020).** Social engineering of employees with
   access to internal admin tools led to compromise of high-profile
   accounts. Training, privileged access controls, and separation of
   duties were all contributing gaps.
3. **NHS phishing campaigns** (multiple years) — UK National Health
   Service has published metrics showing that sustained awareness
   programs lowered click rates from double digits to single digits,
   one of the few public longitudinal data sets.

### 14.1.g Memory aids

- **"ATE"** — Awareness, Training, Education. "Feed the program."
- **"All, Some, Few"** — who each level reaches.
- **"Click down, Report up"** — the two phishing KPIs.

### 14.1.h Cross-references

- **Domain 1 §1.8** — personnel security integrates security
  awareness into onboarding.
- **Domain 7** — user-reported phishing is often the first signal in
  incident response.

---
`,

cissp_data_class: `
## 3. Sub-objective 2.1 — Identify and classify information and assets

### 3.1.a Conceptual explanation

Before anything else in Domain 2, you must know what you have and how
much it matters. **Asset identification** produces an inventory of
information and information systems; **classification** assigns each
asset a label that determines how it must be protected.

Classification schemes vary by sector. The two the CISSP exam tests most:

**Commercial (four levels):**

| Level | Description |
|---|---|
| **Public** | Information cleared for public release. No loss if disclosed. |
| **Internal** (or Sensitive) | Information for internal use; minor damage if disclosed. |
| **Confidential** | Information whose disclosure would cause significant damage. |
| **Restricted** (or Private) | Information whose disclosure would cause severe damage; subject to strict need-to-know. |

**US Government (three levels plus unclassified):**

| Level | Description |
|---|---|
| **Unclassified** | Information not requiring protection. |
| **Confidential** | Unauthorized disclosure could cause damage to national security. |
| **Secret** | Unauthorized disclosure could cause serious damage. |
| **Top Secret** | Unauthorized disclosure could cause exceptionally grave damage. |

Some government agencies add caveats (e.g., SCI, SAP) that partition
access further within a level. The exam may reference these terms but
rarely tests them in depth.

The **high-water mark principle** states that a collection inherits the
highest classification of any element it contains. A spreadsheet that
combines Public customer data with Confidential pricing data is
classified as Confidential because that is the highest element. This is
the most-tested aggregation concept in Domain 2.

### 3.1.b Technical deep-dive

Asset inventories are implemented in several forms, each with trade-offs:

- **CMDB (Configuration Management Database)** — traditional IT
  inventory, used for change and incident management; may or may not
  include information assets directly.
- **Data catalogs** (e.g., Apache Atlas, Collibra, Alation) — modern
  data-platform-native inventories that track datasets, schemas,
  lineage, and ownership at the table or column level.
- **Asset discovery tools** — network-based (Nmap-derived), endpoint-
  based (agent inventories), cloud-native (AWS Config, Azure Resource
  Graph, GCP Asset Inventory).
- **Software Bill of Materials** — per Domain 1 §1.11, an inventory of
  components inside an application.

Classification tools operate at several layers:

- **Manual classification** — users apply labels at creation (e.g.,
  Microsoft Purview Information Protection / Azure Information
  Protection / Microsoft 365 sensitivity labels).
- **Automated classification** — pattern-matching and ML classifiers
  that inspect content (Regex for SSNs, credit cards; ML classifiers
  for Patient Health Information indicators).
- **Contextual classification** — classification inferred from
  location, source, or role (e.g., "all data in the \`patients\`
  database is PHI").
- **Hybrid** — automated suggestion with human confirmation; the most
  common mature-program pattern.

### 3.1.c Frameworks

- **NIST SP 800-60 Vol 1 and 2** — Guide for Mapping Types of
  Information and Information Systems to Security Categories. Maps
  common information types to FIPS 199 categories (Low/Moderate/High
  for each of C, I, A).
- **FIPS 199** — categorization by CIA impact level (per Domain 1).
- **ISO/IEC 27001 Annex A — A.5.12** — control requiring information
  classification (as of the 2022 revision).
- **ISO/IEC 27002:2022** — guidance on classification schemes.
- **NIST SP 800-53 RA-2** — control for security categorization.

### 3.1.d Misconceptions

- "Every document needs a classification label." Practically impractical
  for most organizations; contextual and inherited classification
  (every document in a folder inherits the folder's label) scale
  better.
- "Classification is a security activity." No — classification is a
  business decision made by the data owner. Security advises on
  criteria; the owner decides.
- "More levels are better." Four levels is usually enough. More creates
  user confusion and inconsistent application.

### 3.1.e Exam nuance

CISSP wants you to pick the **data owner** as the classifier. When a
scenario offers "the security team classified the data" and "the data
owner classified the data," the correct answer is the data owner. The
security team may have *advised*, but the decision rights sit with
the business.

For aggregation questions, apply the high-water-mark rule: the
classification of a collection is the maximum of its elements'
classifications. A scenario that shows a dataset including both
Public and Confidential elements wants the answer "Confidential."

Watch for the distinction between **data owner** (accountable for the
data) and **system owner** (accountable for the system that hosts
it). These roles can be held by different people. The data owner
decides classification, retention, and access; the system owner
decides system configuration, hardening, and patching.

### 3.1.f Case studies

1. **Equifax (2017).** A 147M-record breach in which classification
   of the exposed data was inconsistent across the organization; some
   teams considered PII Confidential, others Internal, producing a
   mismatch between the data's actual sensitivity and the controls
   applied. A governance-level classification failure.
2. **Panama Papers (2016).** Mossack Fonseca exfiltration exposed
   ~11.5M documents. Lesson: even organizations that handle highly
   sensitive data routinely may fail at basic inventory and
   classification controls, allowing bulk exfiltration without
   detection.
3. **Pentagon contractor exposure (2017).** Leaked AWS S3 buckets
   containing classified material highlighted how classification
   metadata must travel with data across environment boundaries; a
   file classified Confidential on-prem that lands in a public S3
   bucket is still Confidential, and the cloud storage location does
   not change the classification.

### 3.1.g Memory aids

- **"Owner classifies; custodian implements."** This is the single
  most important sentence in Domain 2.
- **"High-water mark"** — mix Public with Confidential and the mix is
  Confidential.
- **"Four levels"** — Public, Internal, Confidential, Restricted (the
  usual commercial scheme). Remember the order.

### 3.1.h Cross-references

- **Domain 1 §1.3** — governance sets the classification policy the
  owner operates within.
- **Domain 5** — IAM enforces access based on classification and
  role.
- **Domain 7** — incident response references classification to scope
  impact.

---

## 4. Sub-objective 2.2 — Establish information and asset handling requirements

### 4.1.a Conceptual explanation

Once data is classified, the organization must specify how data at each
level is **handled** across its lifecycle. Handling requirements cover:

- **Marking and labeling** — how data is identified with its
  classification (visible labels on documents, metadata tags on files,
  headers on emails, stamps on media).
- **Storage** — where data may live (on-prem, cloud, specific regions,
  specific storage tiers), and what protective controls apply (at-rest
  encryption, access controls, physical security for tapes/drives).
- **Transmission** — how data may move (TLS required, VPN required,
  no email, portal download only) based on classification and
  destination.
- **Use** — what operations are permitted on the data in use (print,
  screen capture, download, copy/paste, share to chat).
- **Sharing** — with whom, under what agreement, with what logging.
- **Retention** — how long the data must (or must not) be kept, and
  how that period is measured (creation date, last access, project
  close-out).
- **Destruction** — at end of retention, how the data is destroyed,
  at what level of assurance, with what evidence.

The exam tests handling requirements as an applied skill: given a
scenario, pick the handling requirement that matches classification,
jurisdiction, and lifecycle stage.

### 4.1.b Technical deep-dive: handling requirement matrix

| Lifecycle stage | Public | Internal | Confidential | Restricted |
|---|---|---|---|---|
| Marking | None required | Label in footer | Label in header + footer, watermark | Label, watermark, conspicuous banner |
| Storage | Any | Org-approved | At-rest encryption, access control, region restrictions | Restricted enclaves, HSM-protected keys, physical security |
| Transmission | Any channel | Approved channels only | TLS 1.2+ only, no personal email | TLS + mutual auth, approved-endpoint only |
| Use | Any device | Managed device | Managed device, DLP monitoring | Managed device, session recording, no removable media |
| Sharing | Unrestricted | NDA + approval | NDA + owner approval + access logging | Contract + owner approval + legal review + audit trail |
| Retention | Discretionary | Per policy | Per policy + legal | Per policy + legal + longer-term audit |
| Destruction | Any | Clear (NIST 800-88) | Purge (or Destroy for high-risk media) | Destroy |

This is an illustrative table; real organizations customize it to their
sector and risk appetite.

### 4.1.c Frameworks

- **NIST SP 800-53 MP (Media Protection)** family — controls for media
  access, marking, storage, transport, sanitization, and use.
- **ISO/IEC 27002 clause 5.13** — labeling of information.
- **ISO/IEC 27002 clause 5.14** — information transfer.
- **ISO/IEC 27040** — storage security guidance.

### 4.1.d Misconceptions

- "Handling requirements are the same as classification." No —
  classification is the label; handling is the rules that follow from
  the label. An organization can change handling without changing
  classification and vice versa.
- "Handling requirements are optional guidance." No — in a mature
  program they are mandatory standards (per Domain 1's
  policy/standard/procedure/guideline hierarchy).

### 4.1.e Exam nuance

CISSP wants consistent handling **across the full lifecycle**. A
scenario that describes controls at rest but silence about
transmission is testing whether you recognize the gap. The correct
answer typically names the missing lifecycle stage or the specific
control required at the stage under test.

When a scenario describes data crossing an environment boundary (on-
prem → cloud, internal → external partner, region A → region B), ask
whether the classification has been preserved and whether handling
requirements at the destination match those at the source. The most
common real-world failure is a dataset that is Confidential on-prem
and becomes Internal-treated in a cloud bucket because no one updated
the labels.

### 4.1.f Case studies

1. **Uber 2016 breach.** GitHub credentials leaked, attackers pulled
   57M records from AWS. Handling failure: source code repositories
   treated as Internal when they contained Restricted-equivalent
   cloud credentials.
2. **Capital One 2019.** Misconfigured WAF allowed SSRF to
   over-privileged IAM role that could read 100M customer records.
   Handling failure: Confidential data was accessible from a role
   whose privileges did not match the classification.
3. **Desjardins 2019.** An insider at the Canadian credit union
   exfiltrated 4.2M member records over months. Handling failure:
   access to Confidential data was not monitored at the granularity
   needed to detect bulk copying.

### 4.1.g Memory aids

- **"Label, Store, Send, Use, Share, Keep, Kill"** — the seven
  handling stages. Memorize the sequence.
- **"Classification is the header; handling is the contract."**

### 4.1.h Cross-references

- **Domain 3** — cryptographic controls implement handling at rest and
  in transit.
- **Domain 4** — network controls implement handling in transit.
- **Domain 5** — access controls implement handling in use and
  sharing.

---

## 5. Sub-objective 2.3 — Provision information and assets securely

### 5.1.a Conceptual explanation

Secure provisioning is the set of activities that bring a new asset
into service under appropriate controls. It bridges asset management
(Domain 2) and change management / configuration management (Domain
7). Key provisioning concepts:

- **Asset inventory accuracy** — every asset that exists should be in
  the inventory; every asset in the inventory should exist. Drift in
  either direction is a material finding in most audits.
- **Ownership assignment** — every asset has a named data owner and
  system owner at provisioning.
- **Baseline configuration** — the asset is deployed in a known, hard-
  ened state drawn from an authoritative baseline (CIS, STIG, DISA).
- **Classification labeling** — the asset or the data it contains is
  labeled at provisioning.
- **Access provisioning** — initial access granted follows least
  privilege, need to know, and role-based assignment.
- **Monitoring enrollment** — the asset is enrolled in logging,
  monitoring, vulnerability scanning, and incident-response coverage.

An asset that is brought into service without one of these is an
audit finding and a common incident root cause.

### 5.1.b Technical deep-dive

**Cloud-native provisioning** introduces specific risks and
opportunities:

- **Infrastructure as Code** (Terraform, CloudFormation, Bicep, Pulumi)
  makes provisioning reproducible and auditable but creates its own
  supply-chain risk (the IaC templates themselves must be protected).
- **Golden images / hardened base AMIs** ensure new compute comes up in
  a known state.
- **Policy as Code** (OPA/Rego, Azure Policy, AWS Config Rules,
  Sentinel) enforces provisioning-time controls: no public S3 buckets,
  encryption at rest required, region restrictions, tag requirements.
- **Tags and labels** are the cloud-native equivalent of classification
  markings.
- **Ephemeral infrastructure** — if environments are rebuilt on every
  change, configuration drift is prevented by construction.

### 5.1.c Frameworks

- **NIST SP 800-53 CM (Configuration Management)** family.
- **NIST SP 800-128** — Guide for Security-Focused Configuration
  Management of Information Systems.
- **CIS Benchmarks** — configuration hardening baselines for operating
  systems, cloud services, containers, and applications.
- **DISA STIGs** — Department of Defense configuration standards.

### 5.1.d Misconceptions

- "Asset provisioning is an IT function only." No — the data owner must
  be assigned at provisioning time, and privacy/compliance review
  should happen before go-live.
- "Ephemeral infrastructure removes the need for configuration
  management." No — it removes the drift problem but introduces the
  IaC template supply-chain problem.

### 5.1.e Exam nuance

CISSP wants every asset to have an identified data owner and a
baseline configuration before it goes into production. A scenario
that skips either step is testing whether you recognize the gap. The
correct FIRST step before bringing a new system online is typically
"identify and document the data owner" or "apply the hardening
baseline" depending on what the scenario emphasizes.

### 5.1.f Case studies

1. **Repeated AWS S3 misconfigurations** — Verizon, Accenture,
   Dow Jones, Dep. of Defense contractors. Each case involved a bucket
   provisioned without the required privacy/classification review, and
   each cost millions in incident response.
2. **Kubernetes public API exposure** — multiple 2019–2022 incidents
   where Kubernetes control planes were exposed to the internet
   because provisioning templates defaulted to public load balancers.
3. **Snowflake customer credential theft 2024** — customers who had
   deployed Snowflake accounts without MFA saw bulk exfiltration when
   credentials were stolen. Provisioning failure: the hardening
   baseline did not require MFA.

### 5.1.g Memory aids

- **"Inventory, Owner, Baseline, Label, Access, Monitor"** — the six
  provisioning gates.

### 5.1.h Cross-references

- **Domain 3** — architecture drives baseline configurations.
- **Domain 7** — change and configuration management operate the
  provisioning lifecycle.
- **Domain 8** — DevSecOps integrates provisioning into the software
  pipeline.

---
`,

cissp_privacy: `
## 6. Sub-objective 2.4 — Manage data lifecycle

### 6.1.a Conceptual explanation

Data has a lifecycle. The CISSP exam treats the lifecycle as a
sequence of stages, each with its own controls:

1. **Create / collect.** Data is generated or ingested. The
   classification is assigned at this stage, and legal basis for
   processing (under GDPR and similar) must exist.
2. **Store.** Data is at rest. Protective controls include at-rest
   encryption, access control, physical security, and geographic
   restrictions.
3. **Use.** Data is in use — being processed, queried, displayed,
   edited. Protective controls include authentication, authorization,
   DLP, session recording, and memory protection.
4. **Share.** Data is transmitted to another party, internal or
   external. Protective controls include in-transit encryption,
   authentication of endpoints, DLP, and contractual instruments.
5. **Archive.** Data is retained but not actively used. Protective
   controls include long-term storage integrity, encryption with key
   escrow, access controls suited to retrieval frequency.
6. **Destroy.** Data is removed per NIST SP 800-88 (Clear, Purge, or
   Destroy). Destruction produces evidence (certificate of
   destruction) that may be required under regulation or contract.

Each transition between stages is a potential security event.

### 6.1.b Technical deep-dive: data states

The exam emphasizes three **data states** and their protective
controls:

| State | Description | Primary controls |
|---|---|---|
| **At rest** | Data stored on media | Encryption, access control, physical security |
| **In transit** | Data crossing a network | TLS/IPsec/SSH, VPN, authenticated channels |
| **In use** | Data actively being processed by an application | Memory protection, enclave technology (SGX, SEV, TDX), application-level access control, DLP, session monitoring |

Data **in use** is the hardest to protect because traditional
encryption primitives require plaintext for processing. Modern
approaches include:

- **Confidential Computing** — hardware enclaves (Intel SGX/TDX, AMD
  SEV, AWS Nitro Enclaves, Azure Confidential VMs) that protect data
  in RAM from privileged system code and hypervisor.
- **Homomorphic encryption** — computation on encrypted data without
  decryption. Practical for specific operations; not general-purpose.
- **Secure multi-party computation (MPC)** — distributed computation
  where no party sees all the inputs.
- **Differential privacy** — adding calibrated noise to
  queries/outputs to protect individuals in aggregate datasets.

The exam tests recognition of these terms more than deep
implementation detail.

### 6.1.c Frameworks

- **NIST SP 800-88 Rev 1** — Guidelines for Media Sanitization (destroy
  stage).
- **NIST SP 800-122** — Guide to Protecting the Confidentiality of PII.
- **NIST SP 800-171 / 800-172** — Protecting Controlled Unclassified
  Information (CUI) in non-federal systems.
- **ISO/IEC 27018** — Protection of PII in public clouds.
- **Cloud Security Alliance (CSA) CCM v4** — Cloud Controls Matrix with
  lifecycle-mapped controls.

### 6.1.d Misconceptions

- "At-rest encryption protects data in use." Only while the data is on
  disk. Once loaded into memory for processing, at-rest encryption
  does nothing.
- "TLS protects data in use." Only while it is on the wire. Once
  decrypted at an endpoint, TLS does nothing.
- "Deletion is destruction." No — deletion typically unlinks file
  system entries without removing the underlying blocks. Destruction
  requires explicit sanitization per NIST 800-88.

### 6.1.e Exam nuance

CISSP questions about data states want you to name the state and
pick the control specific to that state. When a scenario describes
data that is "being analyzed by the application," it is in use —
pick a use-stage control, not an at-rest or in-transit control.

A favorite trap: a question that offers "encrypt the data" as an
answer when the data is in use. Traditional encryption does not
protect data in use; pick a different control (memory protection,
enclave, DLP).

### 6.1.f Case studies

1. **Meltdown / Spectre (2018).** CPU speculative-execution
   vulnerabilities demonstrated that data in use — in CPU caches — can
   be read across security boundaries. Protective response drove
   adoption of confidential computing and enclave technologies.
2. **Cloud memory snapshot attacks** — research showing that
   hypervisor-level memory access can read data in use even when
   at-rest encryption is in place. Motivated the development of
   AMD SEV, Intel TDX, and similar.
3. **The 2013 Target POS malware** — captured card data in memory
   (in-use) during payment processing, before it was encrypted for
   storage or transmission. Illustrates the gap between at-rest and
   in-transit protection.

### 6.1.g Memory aids

- **"At rest, in transit, in use"** — memorize the three states.
- **"Create, store, use, share, archive, destroy"** — the six
  lifecycle stages.

### 6.1.h Cross-references

- **Domain 3** — cryptography and confidential computing implement
  the state-specific controls.
- **Domain 7** — secure destruction procedures.

---

## 7. Sub-objective 2.5 — Ensure appropriate asset retention

### 7.1.a Conceptual explanation

Retention is the discipline of keeping data for the right length of
time — no longer, no shorter. Both extremes are risks:

- **Over-retention** violates data minimization principles (GDPR, CCPA
  explicit), creates liability (more data = more breach exposure), and
  wastes storage and backup costs.
- **Under-retention** violates statutory retention obligations (SOX,
  HIPAA, tax), destroys evidence needed for investigations, and may
  spoliate evidence under a litigation hold.

A mature retention program has three moving parts:

1. **Retention schedules** — per-category policies specifying how long
   different data types must be kept. Drawn from legal, regulatory,
   business, and operational inputs.
2. **Disposal processes** — execute the retention schedule on a
   regular cadence, producing evidence of destruction.
3. **Legal holds** — override retention schedules when litigation is
   anticipated or ongoing. Legal holds always win; when a hold is in
   place, destruction is suspended.

### 7.1.b Technical deep-dive: common retention anchors

| Jurisdiction / regime | Retention anchor |
|---|---|
| SOX (US public company financial records) | 7 years |
| HIPAA (most PHI) | 6 years from creation or last effective date |
| IRS / tax records (US) | 7 years (general rule) |
| EU VAT records | 10 years (Germany), varying |
| Employment records (US federal) | 1 year (Title VII records), longer under ADEA/FLSA |
| Payment card CVV (PCI-DSS) | Prohibited post-authorization (retention = 0) |
| GDPR personal data | "No longer than necessary for the purposes" — no fixed figure |

The GDPR approach is the most commonly mis-applied: the regulation
does not specify a number because the answer depends on the purpose.
Retaining data beyond the original purpose requires a fresh lawful
basis.

### 7.1.c Frameworks

- **NIST SP 800-53 SI-12** — information handling and retention.
- **ISO/IEC 27002 clause 5.33** — protection of records.
- **The Sedona Principles** — widely-cited framework for e-discovery
  and legal holds.
- **ISO 15489-1** — records management standard.

### 7.1.d Misconceptions

- "Longer retention is always safer." No — it increases breach exposure
  and may violate data minimization.
- "If one regulation says 7 years, keep for 7 years." Only if no other
  obligation requires longer, and no data minimization obligation
  forbids longer. Retention is resolved per data element, not per
  regulation.
- "A litigation hold covers some records but not all." A hold covers
  all records relevant to the hold's scope, full stop. Selective
  compliance is spoliation and sanctionable.

### 7.1.e Exam nuance

CISSP wants you to resolve retention conflicts correctly. When a
legal hold applies, destruction is suspended — always. When no hold
applies, the longest applicable retention obligation wins (you must
keep the data at least that long); the shortest obligation is
meaningful only when data-minimization principles forbid keeping it
longer.

A scenario with PCI-DSS and PCI CVV is a favorite: card CVV must
never be retained after authorization, period. Any answer that says
"retain for PCI audit purposes" is wrong.

### 7.1.f Case studies

1. **Arthur Andersen / Enron (2001).** Shredding of audit documents in
   anticipation of investigation was the textbook spoliation case and
   drove the enactment of SOX. Evidence destruction under a reasonable
   expectation of investigation is obstruction.
2. **Yahoo breaches (2013–2014).** 3B-record breaches exposed users
   whose accounts had been dormant for years. Retention audit showed
   accounts that should have been deleted under the company's own
   policy were still active, increasing the breach radius.
3. **EU Google Spain "right to be forgotten" case (2014).** The CJEU
   established that individuals could require search engines to
   de-list certain personal data after a period of irrelevance,
   setting a retention precedent in the search-index context.

### 7.1.g Memory aids

- **"Hold wins."** When litigation hold applies, everything else
  waits.
- **"Longest required, shortest allowed."** Without a hold, the
  longest retention obligation governs the minimum and the shortest
  data-minimization obligation governs the maximum.

### 7.1.h Cross-references

- **Domain 1 §1.4** — statutory basis for retention requirements.
- **Domain 1 §1.5** — investigation types and spoliation risk.
- **Domain 7** — log retention for incident response.

---

## 8. Sub-objective 2.6 — Determine data security controls and compliance requirements

### 8.1.a Conceptual explanation

This sub-objective draws together the preceding five: given a data
asset, pick the right controls based on classification, handling
requirements, lifecycle stage, and applicable regulations.

Key concepts:

- **Roles under privacy law.** Each regulation defines its own role
  vocabulary:
  - **GDPR:** data subject, data controller, data processor, joint
    controllers, data protection officer (DPO), supervisory
    authority.
  - **CCPA/CPRA:** consumer, business, service provider, contractor,
    third party.
  - **HIPAA:** individual, covered entity, business associate,
    subcontractor business associate.
  - **PIPEDA (Canada):** individual, organization (which plays the
    role of both controller and custodian).
- **PII (Personally Identifiable Information).** Information that
  can be used to identify a natural person. NIST SP 800-122 provides
  the US federal definition; GDPR's "personal data" is broader and
  includes identifiers like IP addresses.
- **PHI (Protected Health Information).** HIPAA-specific subset of PII
  that includes health-related information held by covered entities
  or business associates.
- **Sensitive PII.** A subset of PII whose exposure creates elevated
  harm (SSN, financial account numbers, government IDs).
- **DLP (Data Loss Prevention).** Technical controls that identify,
  monitor, and block unauthorized data movement based on content and
  context.
- **DRM (Digital Rights Management) / IRM (Information Rights
  Management).** Controls that travel with the data and enforce
  usage restrictions at the consumer endpoint.
- **Tokenization.** Replacing sensitive data with non-sensitive
  tokens; the real data lives in a separate, tightly-controlled vault.
- **Anonymization.** Removing identifying information so that data
  subjects cannot be re-identified. Under GDPR, fully anonymized data
  is no longer personal data.
- **Pseudonymization.** Replacing direct identifiers with codes that
  can be reversed with access to a key. Under GDPR, pseudonymized
  data is still personal data — GDPR applies.

### 8.1.b Technical deep-dive: DLP modes

DLP systems operate in several modes, each addressing a different
state:

- **DLP at rest (discovery).** Scans repositories for sensitive
  content; used to find shadow copies and enforce classification.
- **DLP in transit (network).** Inspects outbound traffic (email, web,
  FTP, cloud uploads) and blocks or alerts on matches.
- **DLP in use (endpoint).** Runs on user endpoints to block copy-
  paste to USB, print, clipboard to external chat, screen capture.
- **Cloud Access Security Broker (CASB).** Policy-enforcement point
  between users and SaaS applications; modern CASBs include DLP
  functionality for cloud content.

### 8.1.c Frameworks

- **NIST SP 800-53 MP** and **SC (System and Communications
  Protection)** families.
- **NIST SP 800-122** — PII confidentiality.
- **ISO/IEC 29100** — privacy framework.
- **ISO/IEC 27701** — privacy information management system (extends
  27001).
- **NIST Privacy Framework** — counterpart to CSF for privacy
  outcomes.

### 8.1.d Misconceptions

- "Anonymized data is always safe to share." Only if anonymization is
  irreversible and re-identification risk is low. Dataset-linking
  attacks (Netflix Prize, hospital discharge linkage) have repeatedly
  shown that 'anonymized' datasets can be re-identified.
- "DLP prevents all data loss." No — DLP addresses known patterns and
  known channels. Creative exfiltration routes (steganography,
  photograph-the-screen, voice dictation) evade most DLP.
- "HIPAA covers all health information." No — only PHI held by
  covered entities or their business associates. Consumer health
  apps often fall outside HIPAA's jurisdiction.

### 8.1.e Exam nuance

CISSP wants the correct privacy role in the correct regulation. A
scenario mentioning EU data subjects and a SaaS vendor should trigger
GDPR controller/processor identification. A scenario with US
healthcare should trigger HIPAA covered-entity/BA identification.
Confusing these is the most common Domain 2 mistake on privacy
questions.

Also watch for **legal basis** under GDPR. The six lawful bases are
consent, contract, legal obligation, vital interests, public task,
and legitimate interests. The correct lawful basis is
scenario-dependent and often tested directly.

### 8.1.f Case studies

1. **Netflix Prize de-anonymization (2008).** Academic research
   re-identified Netflix users by linking "anonymized" viewing data
   to public IMDb reviews. The case established that
   de-identification is not privacy; it is a weak control.
2. **Strava heatmap (2018).** Aggregated, anonymized fitness data
   published as a global heatmap inadvertently revealed US military
   base locations and patrol patterns. Illustrates that aggregation
   is not anonymization.
3. **23andMe credential-stuffing breach (2023).** Exfiltration of
   genetic data via credential stuffing illustrated that biologically
   identifying data has no equivalent of a password reset.

### 8.1.g Memory aids

- **"Subject, Controller, Processor"** — the GDPR triad.
- **"Individual, Covered Entity, Business Associate"** — the HIPAA
  triad.
- **"Consumer, Business, Service Provider"** — the CCPA triad.
- **"Pseudonym stays personal; anonym is gone"** — GDPR pseudonymized
  data is still personal data.

### 8.1.h Cross-references

- **Domain 1 §1.4** — compliance with the regulations referenced
  here.
- **Domain 3** — cryptographic primitives behind tokenization and
  anonymization.
- **Domain 5** — access controls enforce handling requirements.

---
`,

cissp_models: `
## 4. Sub-objective 3.2 — Security models

### 4.1.a Conceptual explanation

Security models are formal descriptions of security policies,
expressed in mathematical or set-theoretic language precise enough to
be proved. The exam tests recognition of several canonical models:

- **Bell-LaPadula (BLP, 1973)** — confidentiality only. Subjects and
  objects have security levels; access is governed by two rules:
  - **Simple security property ("no read up")**: a subject at level
    L cannot read an object at a higher level.
  - **\\\\*-property ("no write down")**: a subject at level L cannot
    write to an object at a lower level.
  - BLP also defines a **discretionary security property** on top.
  - BLP enforces **mandatory access control** and is associated with
    military multilevel security.
- **Biba (1977)** — integrity only. The dual of BLP:
  - **Simple integrity ("no read down")**: a subject cannot read
    data at a lower integrity level.
  - **\\\\*-integrity ("no write up")**: a subject cannot write to a
    higher integrity level.
- **Clark-Wilson (1987)** — integrity for commercial applications.
  Based on well-formed transactions and separation of duties. Uses
  **constrained data items (CDIs)** that can only be modified via
  **transformation procedures (TPs)** by authenticated subjects,
  with **integrity verification procedures (IVPs)** validating state.
- **Brewer-Nash / Chinese Wall (1989)** — prevents conflicts of
  interest. A subject that has accessed data from one client is
  blocked from accessing any competing client's data. Dynamic
  access based on history.
- **Take-Grant** — graph-theoretic model showing how rights can
  propagate through a system given initial take/grant rights. Used
  to prove safety properties.
- **Harrison-Ruzzo-Ullman (HRU)** — proves that the general safety
  question ("can subject s ever gain access r to object o?") is
  undecidable for general access control. A foundational result.
- **Graham-Denning** — defines eight protection rules for creating
  and deleting subjects and objects and transferring rights.
- **Non-interference** — high-level actions cannot affect what low-
  level subjects observe. Used in formal verification.
- **Information flow** — models that track how data moves through a
  system based on labels, not just access control.
- **Lattice-based** — generalizes BLP/Biba by representing security
  levels as a mathematical lattice with a partial order.

### 4.1.b Technical deep-dive

Practical applications:

- Military classified networks implement BLP-like rules via mandatory
  access control. SELinux and AppArmor on Linux can enforce MAC
  policies approximating BLP for specific contexts.
- Clark-Wilson's separation of duties and transformation-procedure
  model maps directly to financial systems: a payment can only be
  created via the "create payment" TP (which performs validation),
  and only an authorized subject can invoke it.
- Chinese Wall maps to audit firms, consulting firms, and investment
  banks where conflict of interest is a structural concern.
- Lattice-based models underpin many modern MAC systems, including
  the information flow control used in capability-based security
  and some newer language-level information flow systems.

### 4.1.c Frameworks

- **Trusted Computer System Evaluation Criteria (TCSEC, "Orange
  Book", 1983)** — historic US standard that organized systems by
  assurance level (D, C1, C2, B1, B2, B3, A1) and incorporated BLP.
- **Information Technology Security Evaluation Criteria (ITSEC)** —
  European counterpart.
- **Common Criteria (ISO/IEC 15408)** — international successor,
  still in use today. Uses Protection Profiles, Security Targets,
  and Evaluation Assurance Levels (EAL1–EAL7).

### 4.1.d Misconceptions

- "BLP protects integrity." No — BLP is a confidentiality model only.
  For integrity, use Biba, Clark-Wilson, or both together.
- "Biba is the inverse of BLP." Structurally similar but different
  semantics. Biba's no-read-down / no-write-up protects integrity
  against contamination by lower-integrity sources.
- "Clark-Wilson is about encryption." No — Clark-Wilson is an access-
  control and workflow model; it has nothing to do with crypto.

### 4.1.e Exam nuance

The exam loves the "no read up, no write down" / "no read down, no
write up" distinction and will test it directly. Memorize:

- **BLP (confidentiality):** no read up, no write down.
- **Biba (integrity):** no read down, no write up.

For scenarios, ask what the primary concern is. Military classified
network? BLP. Medical records or financial ledgers where tampering
is the fear? Biba or Clark-Wilson. Audit firm segregating client
teams? Brewer-Nash.

### 4.1.f Case studies

1. **Multilevel secure systems in military networks.** BLP remains
   the conceptual basis for classified-network design, even when
   the implementation uses modern enforcement mechanisms.
2. **SELinux type enforcement.** Implements a MAC-style policy that
   can be configured to approximate BLP, Biba, or other models.
3. **Banking Maker-Checker workflows.** Direct implementation of
   Clark-Wilson separation of duties: the "maker" creates the
   transaction, the "checker" approves it, and neither can do the
   other's job.

### 4.1.g Memory aids

- **BLP: "No Read Up, No Write Down"** — for confidentiality.
- **Biba: "No Read Down, No Write Up"** — for integrity.
- **Clark-Wilson: "Subject + Transformation Procedure + CDI"** —
  for commercial integrity.
- **Brewer-Nash: "Once you pick a side, you can't see the other."**

### 4.1.h Cross-references

- **Domain 5** — access control enforcement implements model rules.
- **Domain 7** — auditing validates that the model's rules are
  being followed.

---

## 6. Sub-objective 3.4 — Security capabilities of information systems

### 6.1.a Conceptual explanation

Trusted Computing Base (TCB) concepts are architectural primitives
that allow security properties to be reasoned about at a system
level. Key terms:

- **Trusted Computing Base (TCB)** — the totality of protection
  mechanisms within a computer system, including hardware, firmware,
  and software, that together enforce the security policy. If the
  TCB is compromised, the policy can no longer be trusted.
- **Security kernel** — the hardware, firmware, and software of the
  TCB that implements the reference monitor concept.
- **Reference monitor** — an abstract machine that mediates all
  subject-to-object accesses. Must be:
  - **Always invoked** (no bypass)
  - **Tamperproof**
  - **Small enough to be thoroughly analyzed and tested** (verifiable)
- **Rings of protection** — hierarchical privilege levels. Intel x86
  has four (Ring 0 = kernel, Ring 3 = user). Modern systems
  typically use only Ring 0 and Ring 3; virtualization adds Ring -1
  (hypervisor), Ring -2 (firmware), Ring -3 (platform management).
- **Protection domains** — isolation boundaries enforced by the
  TCB. Processes, containers, VMs, and enclaves are all protection
  domains.
- **Trusted Platform Module (TPM)** — hardware root of trust that
  stores keys and supports measured boot, remote attestation, and
  platform integrity checks. TPM 2.0 is current standard.
- **Hardware Security Module (HSM)** — dedicated hardware that
  generates, stores, and operates on cryptographic keys in a
  tamper-resistant environment. Used for PKI, payment processing,
  and high-assurance signing.
- **Confidential computing** (already referenced) — CPU features
  that protect data in use by isolating memory from privileged
  system code.

### 6.1.b Technical deep-dive

- TPM measured boot creates a chain of hashes of every boot-stage
  component (BIOS → bootloader → kernel → initramfs). The hashes
  are stored in Platform Configuration Registers (PCRs); a remote
  party can verify the platform's state via attestation.
- HSMs are certified against FIPS 140-3 levels (1–4); Level 3 is
  typical for PKI CAs.
- Intel SGX creates user-space enclaves with encrypted memory
  accessible only to the enclave. The enclave's code can be
  remotely attested so that the relying party knows it is running
  the expected code.
- AMD SEV-SNP encrypts VM memory so that the hypervisor cannot
  read guest memory. Azure Confidential VMs and AWS dedicated
  confidential instances use this.

### 6.1.c Frameworks

- **Common Criteria Protection Profiles** — define TCB requirements
  for specific system types.
- **NIST FIPS 140-3** — cryptographic module validation, including
  HSMs.
- **Trusted Computing Group specs** — TPM 2.0, remote attestation.

### 6.1.d Misconceptions

- "TCB = kernel." The TCB includes everything that contributes to
  security enforcement: kernel, security services, firmware,
  sometimes hardware. A compromised driver in Ring 0 is a TCB
  compromise.
- "HSM and TPM are the same." Different: TPMs are per-platform roots
  of trust; HSMs are standalone key-management devices.
- "Reference monitor is an implementation." No — it is an abstract
  concept. The security kernel is the implementation.

### 6.1.e Exam nuance

The three reference-monitor requirements — complete mediation,
tamper-proof, verifiable — are frequently tested directly. Memorize:

- **Complete mediation** (always invoked, no bypass)
- **Tamper-proof**
- **Verifiable** (small enough to analyze)

Scenarios may ask which property is violated. If a system can be
bypassed by a privileged user, complete mediation is violated. If
the security kernel can be modified at runtime without detection,
tamper-proof is violated. If the security kernel is too large or
complex to audit, verifiable is violated.

### 6.1.f Case studies

1. **Microsoft Azure Confidential Computing / Intel SGX.** Deployed
   hardware enclaves to protect customer data from the hypervisor.
2. **Google Titan HSM-backed root of trust.** Custom silicon used
   across Google infrastructure for platform integrity.
3. **Meltdown / Spectre (2018).** CPU speculative execution
   vulnerabilities that allowed crossing ring and process boundaries.
   Demonstrated that even hardware-enforced protection domains can
   be violated by side channels.

### 6.1.g Memory aids

- **"Always Invoked, Tamper-Proof, Verifiable"** — the reference
  monitor requirements.

### 6.1.h Cross-references

- **Domain 4** — hardware roots of trust support network-layer
  attestation.
- **Domain 7** — TPM attestation feeds into continuous monitoring.

---
`,

cissp_crypto: `
## 8. Sub-objective 3.6 — Cryptographic solutions

Cryptography is the largest single topic in Domain 3 and
proportionally the largest in the exam. I will treat it as one long
sub-objective with several concept clusters.

### 8.1 Fundamentals

**Kerckhoffs' principle.** The security of a cryptographic system
should depend only on the secrecy of the key, not the secrecy of
the algorithm. This is the principle the exam uses to reject
"security through obscurity" in crypto.

**Symmetric encryption.** Same key for encryption and decryption.
Fast, efficient, requires secure key distribution.

- **AES** — NIST standard (FIPS 197). Block sizes 128, key sizes
  128/192/256.
- **ChaCha20** — stream cipher, fast in software, mobile-friendly.
- **3DES (Triple DES)** — deprecated by NIST; still tested on exams.
- **Blowfish, Twofish, Serpent, IDEA, RC4, DES** — historical or
  niche.

**Modes of operation (for block ciphers).** Determine how the cipher
is applied to multi-block plaintext. Key modes:

- **ECB (Electronic Code Book)** — insecure for anything with
  patterns; blocks are encrypted independently.
- **CBC (Cipher Block Chaining)** — each block XORed with previous
  ciphertext; requires IV; malleable without MAC; vulnerable to
  padding-oracle attacks.
- **CTR (Counter)** — converts block cipher to stream cipher;
  parallelizable; requires unique nonce.
- **GCM (Galois/Counter Mode)** — authenticated encryption
  (AEAD); combines CTR with GHASH authentication; nonce-misuse
  is catastrophic.
- **CCM (Counter with CBC-MAC)** — authenticated encryption used
  in Bluetooth, IEEE 802.11.

**Asymmetric encryption.** Different keys for encryption and
decryption. Slower, used primarily for key exchange and signatures.

- **RSA** — based on integer factorization hardness. Common sizes
  2048 (minimum) to 4096. Requires padding (OAEP for encryption,
  PSS for signatures).
- **Diffie-Hellman (DH)** — key exchange, not encryption. Classical
  DH uses large primes; Elliptic Curve DH (ECDH) uses curve points.
- **Elliptic Curve Cryptography (ECC)** — shorter keys for
  equivalent security. Curves: P-256, P-384, P-521 (NIST);
  Curve25519, Curve448 (Bernstein).
- **EdDSA / Ed25519** — modern signature scheme based on Curve25519.
- **ECDSA** — older elliptic curve signature standard.

**Hash functions.** One-way functions producing fixed-length
output. Properties: preimage resistance, second preimage resistance,
collision resistance.

- **SHA-2** family (SHA-256, SHA-384, SHA-512) — current standard.
- **SHA-3** — Keccak-based, different construction (sponge).
- **MD5, SHA-1** — broken for collision resistance; still tested
  on exams as deprecated.
- **BLAKE2, BLAKE3** — modern alternatives.

**Message authentication codes (MACs).** Symmetric authentication;
require shared key.

- **HMAC** — hash-based MAC. Combine any hash with a key.
- **CMAC** — cipher-based MAC.
- **Poly1305** — paired with ChaCha20 as AEAD.

**Digital signatures.** Asymmetric authentication; provide
non-repudiation because only the signer has the private key.

- **RSA-PSS** — modern RSA signature padding.
- **ECDSA**, **EdDSA** — elliptic curve signatures.

**Key derivation functions (KDFs).** Derive cryptographic keys
from passwords or other shared secrets.

- **PBKDF2** — older, iteration-count based.
- **bcrypt** — memory-bound.
- **scrypt** — memory-hard.
- **Argon2** — current recommendation, winner of Password Hashing
  Competition 2015. Argon2id is the recommended variant.
- **HKDF** — HMAC-based KDF for deriving keys from existing shared
  secrets (not passwords).

**Key encapsulation mechanisms (KEMs).** Instead of directly
encrypting a message, a KEM generates a random symmetric key and
transmits it to the recipient. The term has gained prominence with
post-quantum cryptography.

**Post-quantum cryptography (PQC).** NIST's PQC standardization
process finalized first standards in August 2024:

- **ML-KEM (formerly CRYSTALS-Kyber)** — key encapsulation. FIPS
  203.
- **ML-DSA (formerly CRYSTALS-Dilithium)** — digital signatures.
  FIPS 204.
- **SLH-DSA (formerly SPHINCS+)** — stateless hash-based
  signatures. FIPS 205.
- **Falcon (FN-DSA)** — lattice-based signature. Standardization
  expected subsequent to the August 2024 batch.

Expect the exam to test recognition of these names.

### 8.2 Public Key Infrastructure (PKI)

A PKI binds public keys to identities through trusted third
parties (Certificate Authorities). Components:

- **CA (Certificate Authority)** — issues certificates binding
  public keys to subjects.
- **RA (Registration Authority)** — validates subject identity
  before issuance.
- **VA (Validation Authority)** — validates certificates at
  relying parties.
- **CRL (Certificate Revocation List)** — periodically published
  list of revoked certificates.
- **OCSP (Online Certificate Status Protocol)** — real-time
  revocation status; OCSP stapling caches the response.
- **X.509** — certificate format standard.

**CA hierarchy.** Offline root CA signs online intermediate CAs
which issue end-entity certificates. The root is kept offline to
reduce compromise risk.

**Key escrow and recovery.** A controversial practice of storing
copies of decryption keys with a trusted third party so that data
can be recovered if the primary key is lost. Historically opposed
for personal privacy; sometimes required for corporate data.

### 8.3 Protocols

- **TLS 1.3** — current TLS version. Faster handshake, removed
  legacy ciphers, forward secrecy by default.
- **IPsec** — network-layer VPN. AH provides integrity; ESP
  provides confidentiality and integrity. Tunnel mode vs transport
  mode.
- **SSH** — secure shell, widely used for administrative access.
- **S/MIME** — email signing and encryption.
- **PGP / OpenPGP / GnuPG** — email and file signing/encryption
  with web-of-trust model.
- **Signal Protocol** — modern end-to-end messaging with double
  ratchet.

### 8.4 Exam nuance

The exam tests primitive selection. Memorize which primitive
provides which guarantee:

| Need | Primitive |
|---|---|
| Confidentiality only | Symmetric encryption (AES-GCM) |
| Integrity only | Hash (rarely alone; usually with auth) |
| Confidentiality + integrity + authenticity | AEAD (AES-GCM, ChaCha20-Poly1305) |
| Non-repudiation | Digital signature (RSA-PSS, ECDSA, EdDSA) |
| Password storage | KDF (Argon2id, scrypt, bcrypt) |
| Key exchange | DH / ECDH / KEM (ML-KEM post-quantum) |
| Key derivation from existing shared secret | HKDF |

Avoid these traps:
- Do not use ECB for anything with patterns.
- Do not use MD5 or SHA-1 for security-critical purposes.
- Do not use plain DES or 3DES for new designs.
- Do not use a MAC when non-repudiation is required.
- Do not use a hash alone for password storage — use a KDF.
- Do not reuse nonces in GCM or CTR modes (catastrophic).

### 8.5 Case studies

1. **Heartbleed (CVE-2014-0160).** OpenSSL implementation bug;
   not a crypto weakness per se but a memory disclosure that
   leaked keys. Lesson: algorithm correctness depends on
   implementation correctness.
2. **DigiNotar CA compromise (2011).** Dutch CA compromised;
   fraudulent certificates issued; loss of trust led to CA
   liquidation. Lesson: CA trust is a systemic risk.
3. **Dual_EC_DRBG (2013).** NIST-standardized PRNG with
   suspected NSA backdoor; withdrawn. Lesson: cryptographic
   standards are not immune to government influence.
4. **Apple "Goto Fail" (2014).** Signature verification bypass
   due to a duplicated \`goto\` statement. Single line of code
   broke TLS security for all iOS and macOS users until patched.
5. **Heartbleed, Apple goto fail, ROCA (Infineon)**, **EFAIL (S/
   MIME)** — a decade of implementation-level crypto failures.
6. **SolarWinds (2020)** — not a crypto failure per se, but
   highlighted that code signing is necessary but not sufficient.

### 8.6 Memory aids

- **"CIANA is satisfied by different primitives."** Confidentiality
  by encryption, Integrity by hash/MAC, Authenticity by MAC or
  signature, Non-repudiation by signature only, Availability by
  redundancy.
- **"Kerckhoffs: only the key is secret."**
- **"Don't roll your own crypto."**

---

## 9. Sub-objective 3.7 — Cryptanalytic attacks

### 9.1.a Concepts and examples

The exam tests recognition of attack classes:

- **Brute force** — try every key.
- **Dictionary attack** — try known common values.
- **Birthday attack** — exploits collision probability (≈ 2^(n/2)
  for n-bit hash).
- **Rainbow tables** — precomputed hash reversals; defense is
  salt.
- **Known plaintext (KPA)** — attacker has plaintext-ciphertext
  pairs.
- **Chosen plaintext (CPA)** — attacker can choose plaintexts.
- **Chosen ciphertext (CCA)** — attacker can choose ciphertexts.
- **Padding oracle** — exploits leaks from padding validation.
- **Meet in the middle (MITM)** — trades space for time in
  breaking multi-round encryption; why 3DES is 112-bit effective,
  not 168.
- **Side channel** — timing, power, EM, acoustic, cache.
- **Replay** — re-send captured valid messages; defense is nonces
  and timestamps.
- **Downgrade (rollback)** — force use of weaker primitive;
  defense is strict version negotiation.
- **Man in the middle (MITM network)** — intercepts a key
  exchange; defense is authenticated key exchange.

### 9.1.b Defenses

- Use AEAD modes (GCM, Poly1305) to avoid padding oracles.
- Use constant-time implementations to avoid timing side channels.
- Use authenticated key exchange (TLS 1.3, Signal) to prevent MITM.
- Use nonces and replay windows for integrity of sequence.
- Use salting and KDFs to defeat rainbow tables and dictionary.

---
`,

cissp_physical: `
## 10. Sub-objectives 3.8 & 3.9 — Physical security

### 10.1 Conceptual

Physical security protects facilities, equipment, and people. The
exam tests:

- **CPTED (Crime Prevention Through Environmental Design)** —
  Natural Surveillance, Natural Access Control, Territorial
  Reinforcement, Maintenance.
- **Layered physical defense** — perimeter → building → floor →
  room → rack.
- **Access control mechanisms** — locks, cards, biometrics,
  mantraps, turnstiles.
- **Surveillance** — CCTV, motion detectors.
- **Environmental controls** — HVAC, humidity, water detection.
- **Fire suppression** — wet pipe, dry pipe, pre-action, inert
  gas, halocarbon (FM-200, Novec 1230), CO2.
- **Power** — UPS, generator, dual utility feeds.
- **Media protection** — safes, vaults, secure shredders.

### 10.2 Fire classes and suppression

- **Class A**: ordinary combustibles (wood, paper).
- **Class B**: flammable liquids.
- **Class C**: electrical.
- **Class D**: combustible metals.
- **Class K**: kitchen (cooking oils).

For data centers, inert gas (FE-13, IG-55, Inergen) or
halocarbon (FM-200, Novec 1230) suppression avoids water damage.
Pre-action systems require both smoke detection and temperature
to trigger, reducing false-discharge risk.

### 10.3 Case studies

1. **Data center fire suppression choices.** Google, Microsoft,
   and AWS have published their fire-suppression strategies; most
   use pre-action water combined with VESDA (Very Early Smoke
   Detection Apparatus) and rapid manual intervention.
2. **CPTED in corporate campuses.** Apple Park, Google HQ, and
   similar designs use natural surveillance and access control
   as primary physical security strategies.

### 10.4 Exam nuance

- Mantraps (now sometimes called access control vestibules) are
  two-door chambers that require the first door to close before
  the second opens. Defeat tailgating.
- Fail-safe vs fail-secure for physical access: in a fire, exit
  doors must fail-safe (unlock); access to high-security zones
  should fail-secure (remain locked).
- Halon is banned under the Montreal Protocol; the exam may still
  test recognition but modern designs use alternatives.

---
`,

cissp_secure_design: `
## 3. Sub-objective 3.1 — Secure design principles

### 3.1.a Conceptual explanation

Secure design principles are the heuristics that make systems resistant
to attack at the architectural level, before any specific controls are
selected. The CISSP exam tests eleven or twelve principles drawn from
Saltzer & Schroeder (1975) and later additions:

- **Least privilege** — grant only the access strictly required.
- **Separation of duties** — no single actor can complete a high-
  impact workflow end-to-end.
- **Defense in depth** — layered controls so that no single failure
  is catastrophic.
- **Fail-safe defaults** — on failure, the system denies access rather
  than granting it.
- **Economy of mechanism (KISS)** — simpler designs have fewer bugs
  and are easier to verify.
- **Complete mediation** — every access to every object is checked
  against the authorization policy on every request; no caching of
  authorization decisions beyond their validity.
- **Open design** — security must not depend on obscurity of
  mechanism (Kerckhoffs' principle in crypto; extends to architecture).
- **Psychological acceptability** — security controls must be usable,
  or users will route around them.
- **Least common mechanism** — minimize shared mechanisms across
  security boundaries, because shared mechanisms can become covert
  channels.
- **Work factor / cost-of-attack** — raise the attacker's cost beyond
  the value of the target.
- **Secure defaults** — out-of-the-box configuration is secure; users
  must deliberately reduce security.
- **Privacy by design** — privacy is a first-class requirement from
  the first design iteration, not an afterthought.
- **Zero trust** — trust is never implicit based on network location;
  every request is authenticated and authorized.

### 3.1.b Technical deep-dive

Modern applications of the principles:

- **Fail-safe defaults** appear in firewall default-deny rules, ACLs
  that deny on syntax error, token verification libraries that raise
  an exception rather than return a default "valid" response.
- **Complete mediation** is enforced by authorization middleware
  that checks every request, never trusts client-side decisions,
  and does not cache authorization beyond its validity period.
- **Least common mechanism** drives per-tenant isolation in multi-
  tenant SaaS, container-per-workload in Kubernetes, and strict
  process isolation in microkernel operating systems.
- **Zero trust** has been operationalized in NIST SP 800-207, which
  defines the architecture around policy engines, policy enforcement
  points, policy administration, trust algorithms, and continuous
  evaluation.

### 3.1.c Frameworks

- **NIST SP 800-160 Vol 1 (Rev 1)** — Engineering Trustworthy Secure
  Systems. Current authoritative US reference.
- **NIST SP 800-207** — Zero Trust Architecture.
- **ISO/IEC 27001 Annex A controls** — map to many principles.
- **Saltzer & Schroeder (1975), "The Protection of Information in
  Computer Systems"** — the original paper.
- **OWASP ASVS / Proactive Controls** — application-level codifi-
  cation of design principles.

### 3.1.d Misconceptions

- "Zero trust is a product." No — it is an architectural approach.
  Vendors sell components (policy engines, identity-aware proxies)
  but zero trust is a design philosophy applied across many controls.
- "Fail-safe means fail-open." The opposite. Fail-safe defaults deny;
  fail-open is a specific design choice for availability-critical
  systems but is the exception, not the rule.
- "Security through obscurity is always wrong." Obscurity as the
  only control is wrong, but obscurity as a layer on top of strong
  controls (e.g., non-standard ports, internal service names) is a
  defense-in-depth measure — just never the only one.

### 3.1.e Exam nuance

When the exam offers a principle-named answer (e.g., "complete
mediation") and a technology-named answer (e.g., "deploy a WAF"),
and the scenario asks for the principle being violated or applied,
pick the principle. When the scenario asks for an action, pick the
technology.

Watch for principle confusions: least privilege is about direct
access scope; need to know is a finer-grained restriction on
disclosure within that scope; separation of duties segregates
actions across actors; defense in depth layers redundant controls.

### 3.1.f Case studies

1. **Heartbleed (CVE-2014-0160).** OpenSSL TLS heartbeat bug
   allowed memory disclosure. Violated defense in depth (exposing
   server memory), complete mediation (bounds checking on inputs),
   and economy of mechanism (the heartbeat feature itself was
   optional complexity).
2. **Equifax (2017).** Apache Struts CVE unpatched for months.
   Multiple principles violated: least privilege (the compromised
   component had access to vast data), defense in depth (no
   compensating controls), and complete mediation (access to PII
   not re-verified at every step).
3. **Google BeyondCorp (2014+).** The canonical enterprise zero-trust
   implementation. Removed implicit trust from the internal network
   and required every request to be authenticated and authorized.
   Origin of much zero-trust vocabulary.

### 3.1.g Memory aids

- **"Least Default Complete Open Economy Fail Work Accept"** — a
  forced acronym for the Saltzer-Schroeder principles.
- **"Defaults deny; mediate always."**

### 3.1.h Cross-references

- **Domain 5** — IAM implements many of these principles.
- **Domain 8** — secure SDLC integrates the principles into software.

---

## 5. Sub-objective 3.3 — Select controls based on system security requirements

### 5.1.a Conceptual explanation

Control selection is a risk-driven process: requirements → threats →
controls → residual risk. The CISSP exam rewards candidates who
connect the three rather than jumping to control menus.

Standard control frameworks the exam references:

- **NIST SP 800-53 Rev 5** — 1000+ controls organized by family
  (AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PS, RA, SA, SC,
  SI, SR, PT, PM).
- **CIS Controls v8** — 18 critical security controls, practical
  and operationally-focused.
- **ISO/IEC 27002:2022** — 93 controls across four themes:
  Organizational, People, Physical, Technological.

Control selection is typically driven by a baseline tailored to the
organization's classification or risk rating, then adjusted with
compensating and supplementary controls for specific risks.

### 5.1.b Technical deep-dive: baseline and tailoring

FIPS 200 and NIST SP 800-53 use a baseline approach:

1. **Categorize** the system per FIPS 199 (Low / Moderate / High for
   each of Confidentiality, Integrity, Availability).
2. **Select** the baseline control set matching the categorization.
3. **Tailor** — remove, add, or modify controls based on the
   system's specific context.
4. **Document** compensating controls where the baseline cannot be
   implemented directly.
5. **Assess** implementation and operation.
6. **Authorize** and continuously monitor.

This is the NIST Risk Management Framework (SP 800-37 Rev 2) at the
per-system level.

### 5.1.c Frameworks (list)

Already enumerated above: NIST 800-53, CIS v8, ISO 27002. Also:

- **NIST 800-171** — CUI protection in non-federal systems.
- **CSA Cloud Controls Matrix (CCM)** — cloud-specific.
- **PCI-DSS v4.0** — payment card industry.
- **HIPAA Security Rule** — healthcare.

### 5.1.d Misconceptions

- "More controls are always better." No — over-controlling creates
  friction, cost, and control fatigue. Mature programs select fewer,
  better-enforced controls.
- "Controls are universal across industries." Partly — many are, but
  sector-specific controls (HIPAA, PCI, NERC CIP) have unique
  requirements.

### 5.1.e Exam nuance

When a scenario describes a specific context and asks which control
framework is MOST appropriate, match the sector:

- Healthcare → HIPAA
- Payment card → PCI-DSS
- Federal civilian → NIST SP 800-53
- US federal classified → NIST SP 800-53 with High baseline
- Commercial multinational → ISO/IEC 27001/27002
- Bulk electric → NERC CIP
- DoD contractors with CUI → NIST SP 800-171

### 5.1.f Case studies

1. **NIST SP 800-53 adoption across US federal.** FISMA requires
   federal systems to implement 800-53 controls; the framework has
   become the de facto standard for US federal security engineering.
2. **CIS Controls as a prioritized starting point.** Many mid-size
   organizations adopt CIS v8 because it provides a ranked starting
   point when full 800-53 implementation is impractical.

### 5.1.g Memory aids

- **"Categorize, Select, Tailor, Document, Assess, Authorize,
  Monitor"** — the seven RMF steps.

### 5.1.h Cross-references

- **Domain 1 §1.9** — risk assessment drives categorization.
- **Domain 6** — assessment validates control effectiveness.

---

## 7. Sub-objective 3.5 — Vulnerabilities in architectures, designs, and solution elements

### 7.1.a Conceptual explanation

Every architectural pattern comes with its characteristic
vulnerabilities. The exam tests recognition across common system
types:

- **Client-server** — classic vulnerabilities: injection, broken
  authentication, session management, client trust.
- **Distributed systems** — network partitions, replication
  inconsistency, coordination failures (the CAP theorem and its
  security implications).
- **Database systems** — SQL injection, stored procedures,
  privilege escalation, data aggregation disclosure.
- **Cryptographic systems** — key management failures, weak
  primitives, implementation bugs, side channels.
- **Cloud and virtualization** — hypervisor escape, cross-tenant
  isolation, shared responsibility confusion, misconfiguration.
- **IoT / embedded** — limited update capability, default credentials,
  hard-coded secrets, weak physical security.
- **Industrial control / SCADA** — legacy protocols without
  authentication, isolated networks that become un-isolated,
  availability priority over confidentiality.
- **Mobile** — jailbreak/root, side-loaded apps, insecure storage,
  weak transport.
- **Web applications** — OWASP Top 10 (injection, broken access
  control, cryptographic failures, insecure design, security
  misconfig, vulnerable components, identification and auth
  failures, software and data integrity failures, logging/
  monitoring failures, SSRF).
- **AI / ML systems** — training-data poisoning, model inversion,
  prompt injection, adversarial examples, model theft, privacy
  leakage from models.

### 7.1.b Technical deep-dive: specific vulnerability classes

- **Aggregation and inference** — individual data items are non-
  sensitive, but the combination reveals sensitive patterns.
  Classic exam topic because it ties classification to access
  control.
- **Covert channels** — unintended communication paths between
  security domains. Two main types: **storage channels** (through
  shared resources with different states) and **timing channels**
  (through observable timing differences). Canonical example: a
  low-privilege process observes CPU usage to infer high-privilege
  activity.
- **Maintenance hooks / backdoors** — intentional or accidental
  undocumented access paths. Often discovered in legacy code.
- **TOCTOU (Time Of Check Time Of Use)** — race condition between
  a security check and the subsequent use. Defense: atomic
  check-and-use, file descriptors, capabilities.
- **Hypervisor escape** — VM guest breaking into the hypervisor or
  sibling VM. Rare but catastrophic; why confidential computing
  and formal hypervisor verification matter.
- **Side-channel attacks** — leaking secrets through timing, power,
  EM emanations, acoustic, cache state. Spectre and Meltdown are
  cache-based side channels.
- **Rowhammer** — DRAM disturbance attack that flips bits by
  repeatedly accessing adjacent rows.
- **Supply chain attacks** — compromised components enter the
  build (SolarWinds, Log4Shell).

### 7.1.c Frameworks

- **OWASP Top 10 (web)** — 2021 current version.
- **OWASP Top 10 for LLM Applications (2023)** — emerging AI threats.
- **MITRE CWE (Common Weakness Enumeration)** — catalog of software
  and hardware weakness types.
- **MITRE ATT&CK** — adversary behavior matrix.

### 7.1.d Misconceptions

- "OWASP Top 10 covers all web risks." No — it is a top-10 list, not
  a complete inventory; deeper work uses ASVS (Application Security
  Verification Standard).
- "Covert channels are theoretical." No — Spectre and Meltdown are
  real side-channel vulnerabilities that shipped in billions of
  processors.

### 7.1.e Exam nuance

When the exam asks about aggregation or inference, the answer is
usually about view-level or query-level restriction, not row-level
(because the individual rows are non-sensitive). Polyinstantiation
is the classic database response.

For covert channels, the exam tests recognition of storage vs
timing distinction.

### 7.1.f Case studies

1. **Spectre and Meltdown (2018).** CPU side-channel attacks that
   affected nearly every modern processor. Drove microcode updates,
   compiler mitigations, and renewed interest in formal hardware
   verification.
2. **SolarWinds SUNBURST (2020).** Supply chain compromise with
   malicious code embedded in a trusted update. Architectural
   lesson: even signed, legitimately-sourced software can be
   malicious; behavioral monitoring must be part of the defense.
3. **Rowhammer-based privilege escalation (2014, ongoing).**
   Demonstrated that software could flip bits in kernel memory by
   carefully-timed memory accesses on adjacent rows.

### 7.1.g Memory aids

- **"Check then use is a TOCTOU."**
- **"Covert channels: Storage or Timing."**

### 7.1.h Cross-references

- **Domain 4** — network-layer vulnerabilities and defenses.
- **Domain 8** — secure coding and code-level vulnerabilities.

---
`,

cissp_network: `
## 3. Sub-objective 4.1 — Secure network design

### 3.a Conceptual

The **OSI reference model** has 7 layers (Physical, Data Link,
Network, Transport, Session, Presentation, Application). The
**TCP/IP model** has 4 (Link, Internet, Transport, Application).
Threats and controls map to specific layers:

| Layer | Examples | Threats | Controls |
|---|---|---|---|
| L1 Physical | cable, radio, optical | tapping, emanations | shielding, conduit, TEMPEST |
| L2 Data Link | Ethernet, ARP, MAC | ARP poisoning, VLAN hopping, MAC flood | port security, DAI, 802.1X, DHCP snooping |
| L3 Network | IP, ICMP, IPsec | spoofing, routing attacks, IP fragmentation | ACLs, uRPF, IPsec, ingress/egress filtering |
| L4 Transport | TCP, UDP, QUIC | SYN flood, session hijacking | SYN cookies, stateful firewalls |
| L5 Session | RPC, NetBIOS | session fixation | modern session tokens |
| L6 Presentation | TLS (often mapped here) | downgrade, cipher negotiation | TLS 1.3, strict config |
| L7 Application | HTTP, DNS, SMTP, LDAP | injection, XSS, SSRF | WAF, input validation, DNSSEC |

**TCP/IP** is what runs on the wire; OSI is the teaching model. The
exam references both.

**IPv6** is structurally different from IPv4: 128-bit addresses, no
broadcast (multicast instead), mandatory ICMPv6, built-in IPsec
capability (not always enabled), SLAAC for address auto-config.
IPv6 brings its own attack surface: rogue RA, SLAAC abuse,
transition mechanisms (6to4, Teredo) that can tunnel unexpected
traffic.

**Routing.** Static, RIP, OSPF, BGP, EIGRP. BGP is the internet's
routing protocol and is historically insecure — BGP hijacks
(intentional or accidental) have redirected global traffic. RPKI
(Resource Public Key Infrastructure) provides route origin
validation; BGPSEC adds path validation. Both rollout is
incomplete.

### 3.b Technical deep-dive

**Segmentation** is implemented at multiple levels:

- **Physical** — air gaps, separate cable plants.
- **VLAN** (L2) — logical segments sharing physical hardware.
- **Subnet** (L3) — separate IP ranges with routed separation.
- **VRF** — virtual routing and forwarding tables for carrier-grade
  separation.
- **Micro-segmentation** — per-workload policy enforcement, often
  implemented via host agents, service mesh, or cloud security
  groups.

**Micro-segmentation** is the modern high-assurance pattern: policy
enforcement at the workload boundary, default-deny, identity-aware.
NIST SP 800-207 zero trust draws heavily on it.

**NAC (Network Access Control)** authenticates devices before
granting network access, typically using 802.1X, and enforces
posture (antivirus, patching level, encryption state) before
admitting.

### 3.c Frameworks

- NIST SP 800-41 (firewalls), 800-46 (remote access), 800-77 (IPsec),
  800-97 (802.11i), 800-113 (SSL VPN), 800-125 (virtualization),
  800-207 (zero trust), 800-215 (secure TCP/IP).
- CIS Controls v8 categories for network monitoring, access control,
  and secure configuration.
- ISO/IEC 27033 series on network security.

### 3.d Misconceptions

- "VLANs are security boundaries." Weakly — VLAN hopping is real
  (double tagging, switch spoofing). For strong isolation, use
  separate physical networks or properly-configured VRFs.
- "The OSI model is obsolete." It is still the teaching framework
  and the CISSP exam's vocabulary; learn it even if the wire runs
  TCP/IP.

### 3.e Exam nuance

The exam loves threats mapped to layers. Memorize:

- ARP attacks → L2
- IP spoofing → L3
- SYN flood → L4
- DNS poisoning → L7 (or L3 conceptually)
- SSL strip → L7 / L6

When a scenario asks "at which layer does this attack operate", pick
the layer where the protocol lives, not the application layer above
it.

### 3.f Case studies

1. **ARP cache poisoning in corporate networks (ongoing).** MITM
   attacks at L2 that bypass L3/L4 defenses. Mitigation: Dynamic
   ARP Inspection, 802.1X.
2. **Pakistan YouTube BGP hijack (2008).** Pakistan Telecom's BGP
   announcement propagated globally, taking YouTube offline. Lesson:
   BGP trust was (and largely remains) unauthenticated.
3. **Spamhaus DDoS (2013).** 300 Gbps DDoS via DNS amplification.
   Lesson: reflection attacks exploit misconfigured services.

### 3.g Mnemonics

- **OSI layers (top down): "All People Seem To Need Data Processing"**
- **OSI (bottom up): "Please Do Not Throw Sausage Pizza Away"**
- **TCP/IP: Link, Internet, Transport, Application**

### 3.h Cross-refs

- Domain 3 — cryptographic protocols run at L6/L7.
- Domain 5 — 802.1X ties to IAM.
- Domain 7 — network monitoring feeds detection.

---
`,

cissp_protocols: `
## 5. Sub-objective 4.3 — Secure communication channels

### 5.a Conceptual

The exam tests several major channel types:

**Voice:** VoIP protocols (SIP, H.323, RTP), SRTP for media
encryption, signaling vulnerabilities (SIP registration flooding,
toll fraud).

**Multimedia/collaboration:** Zoom, Teams, Meet, WebRTC. End-to-end
encryption in some (Signal, WhatsApp, iMessage Core) vs server-
side encryption in others.

**Remote access:** SSH, RDP, VPN, jump hosts, bastion hosts, ZTNA.

**Data communications:** TLS, IPsec, SSH, mTLS in service meshes.

**Virtualized networks:** SDN, overlay networks, VXLAN, service
mesh (Istio, Linkerd), network policies.

**Third-party connectivity:** B2B VPNs, dedicated links (MPLS,
direct connect, ExpressRoute), API gateways.

### 5.b Protocols deep-dive

**TLS 1.3** (RFC 8446):

- Mandatory forward secrecy (ECDHE or DHE only).
- Removed static RSA key exchange, CBC-mode ciphers, compression,
  and legacy hash algorithms.
- Reduced handshake to 1-RTT (or 0-RTT for resumed sessions, with
  caveats).
- AEAD-only cipher suites (AES-GCM, ChaCha20-Poly1305, AES-CCM).

**IPsec** (RFC 4301+):

- Two protocols: **AH** (Authentication Header, integrity only)
  and **ESP** (Encapsulating Security Payload, confidentiality
  and/or integrity).
- Two modes: **Transport** (protects payload, keeps original IP
  header) and **Tunnel** (protects entire original packet,
  encapsulates in new IP header). Tunnel mode is used for
  site-to-site VPNs; transport mode for host-to-host.
- IKE (Internet Key Exchange) for key management; IKEv2 is current.
- Common in site-to-site VPNs and some remote-access scenarios.

**SSH** (RFC 4251+):

- Secure shell for administrative access and file transfer.
- Host key verification, user auth (password, public key, certificate).
- SSH tunneling (port forwarding, SOCKS proxy).
- Common weakness: weak host key policies, default users with keys.

**DNSSEC:** signs DNS records with a chain of trust rooted in the
root zone. Prevents DNS cache poisoning and spoofing but does not
provide confidentiality (that's DoT/DoH).

**DoH / DoT (DNS over HTTPS / DNS over TLS):** encrypts DNS
queries. DoT uses port 853; DoH uses port 443 (indistinguishable
from web traffic).

**S/MIME, PGP/OpenPGP:** email signing and encryption. S/MIME is
X.509-based; PGP uses web-of-trust.

**WPA3:** Current wireless standard. Replaces pre-shared key with
SAE (Simultaneous Authentication of Equals), which is resistant
to offline dictionary attacks. Also provides forward secrecy and
opportunistic encryption (OWE) for open networks.

**802.1X:** Port-based network access control. Supplicant
(client), authenticator (switch or AP), authentication server
(RADIUS). EAP methods: EAP-TLS (certificate-based), PEAP, EAP-TTLS.
`,

cissp_wireless_net: `

## Wireless & Remote Access

### Wireless Security Standards

| Standard | Security | Key Features | Status |
|---|---|---|---|
| **WEP** | Broken | RC4 with static keys; IV collision attack | Deprecated, do not use |
| **WPA** | Weak | TKIP wrapper around WEP; temporal keys | Legacy, avoid |
| **WPA2** | Standard | AES-CCMP for data, HMAC-SHA1 for MIC | Deprecated for new deployments |
| **WPA3** | Current | SAE handshake, forward secrecy, OWE | Recommended standard |

### WPA3 in Detail

**SAE (Simultaneous Authentication of Equals)** replaces WPA2's Pre-Shared Key four-way handshake. SAE is based on the Dragonfly key exchange protocol and provides:

- **Offline dictionary attack resistance**: each authentication attempt requires an online interaction with the network. An attacker who captures the handshake cannot run offline brute-force.
- **Forward secrecy**: past sessions cannot be decrypted even if the password is later compromised, because each session uses ephemeral keys.
- **Protection with weak passwords**: even short or simple passwords are significantly harder to attack than under WPA2-PSK.

**WPA3-Enterprise 192-bit mode** uses a stronger cipher suite (AES-256-GCM, SHA-384, ECDH P-384) for environments requiring the highest assurance.

**Opportunistic Wireless Encryption (OWE)** provides encryption for open networks (cafes, airports) without requiring a password — encryption without authentication, preventing passive eavesdropping.

### KRACK Attack (2017)

Key Reinstallation Attack exploited WPA2's four-way handshake by forcing nonce reuse in the encryption. Affected every WPA2 implementation. Allowed decryption of traffic and injection of forged frames. WPA3-SAE is immune by design.

### 802.1X (Port-Based Network Access Control)

Three roles in 802.1X:
1. **Supplicant** — the client device requesting access
2. **Authenticator** — the switch or wireless access point
3. **Authentication Server** — typically a RADIUS server

The supplicant sends credentials via EAP (Extensible Authentication Protocol) to the authenticator, which forwards them to the RADIUS server. On success, the port is opened.

**EAP Methods:**
- **EAP-TLS** — certificate-based authentication for both client and server. Strongest method; requires PKI for client certificates.
- **PEAP (Protected EAP)** — creates a TLS tunnel, then uses MSCHAPv2 for password authentication inside the tunnel. Most common enterprise method.
- **EAP-TTLS** — similar to PEAP; creates a TLS tunnel for inner authentication methods.
- **EAP-FAST** — Cisco-developed; uses Protected Access Credentials instead of certificates.

### VPN Types

| Type | Technology | Use Case |
|---|---|---|
| **Site-to-site** | IPsec tunnel mode | Connect two office networks |
| **Remote access (SSL VPN)** | TLS over port 443 | Individual users to corporate |
| **Remote access (IPsec)** | IKEv2 + ESP | Traditional client VPN |
| **WireGuard** | Modern, minimal | Fast VPN with single cipher suite |
| **ZTNA** | Identity-aware proxy | Per-application access (zero trust) |

### ZTNA vs Traditional VPN

Traditional VPN grants full network access once authenticated — a compromised user can move laterally across all internal resources. ZTNA (Zero Trust Network Access) provides per-application access based on identity, device posture, and policy. Users never "join" the network; they are granted access to specific applications per-request.

**ZTNA is the modern answer to remote access** because it aligns with zero trust principles: no implicit trust from network location, every request evaluated independently.

### Wireless Attacks

| Attack | Description | Defense |
|---|---|---|
| **Rogue AP / Evil twin** | Attacker-controlled AP mimicking legitimate | WIDS, 802.1X |
| **Karma attack** | Rogue AP responds to any probe request | Device policy: don't auto-connect |
| **Deauthentication** | Forged deauth frames disconnect clients | 802.11w (Management Frame Protection) |
| **WPS attack** | Brute-force WPS PIN | Disable WPS |
| **Bluetooth attacks** | Bluejacking, Bluesnarfing, KNOB | Disable when not in use, BLE 5.0+ |

### Exam Tips

- WPA3 SAE = resistant to offline dictionary attacks + forward secrecy
- 802.1X: supplicant → authenticator → RADIUS server; EAP-TLS is strongest
- ZTNA > VPN for zero trust alignment
- KRACK attacked WPA2's handshake via nonce reinstallation
- WPA3 is the CURRENT standard; WPA2 is legacy

`,

cissp_network_attacks: `
## 4. Sub-objective 4.2 — Secure network components

### 4.a Conceptual

Network components the exam tests:

- **Firewalls** — L3/L4 stateless (packet filter), L3/L4 stateful,
  L7 application-layer (proxy, next-gen), web application firewall
  (WAF). Next-generation firewalls (NGFW) combine stateful with
  application awareness and often IDS/IPS.
- **IDS/IPS** — intrusion detection vs prevention; signature-based
  vs anomaly-based vs heuristic; network (NIDS/NIPS) vs host
  (HIDS/HIPS).
- **Proxies and reverse proxies** — forward proxies for user
  traffic; reverse proxies for server-side load balancing and
  protection.
- **Load balancers** — L4 (TCP/UDP) vs L7 (HTTP); TLS termination
  implications.
- **VPN concentrators** — IPsec or SSL VPN endpoints.
- **Switches, routers, hubs, bridges** — L2/L3 infrastructure.
- **Transmission media** — copper (UTP, STP, coax), fiber (SMF, MMF),
  wireless. Fiber is harder to tap and not subject to EMI;
  unshielded copper is vulnerable to emanations.
- **Endpoint security** — EDR, antivirus, host firewall.
- **CDN** — content distribution for performance and DDoS mitigation.
- **NAC** — network access control.

### 4.b Technical deep-dive

**Firewall types in depth:**

- **Packet filter (stateless)** — simplest, checks each packet
  against ACL. Fast but cannot track connection state.
- **Stateful** — tracks connection state so return traffic for
  established connections is allowed automatically.
- **Proxy (application-layer)** — terminates the connection,
  inspects content, forwards to destination. Can filter based on
  application semantics.
- **Next-gen (NGFW)** — stateful + application awareness + often
  integrated IDS/IPS + threat intelligence feeds.
- **WAF** — specifically for HTTP; understands HTTP semantics,
  blocks injection/XSS/SSRF.
- **Host-based** — runs on the endpoint, restricts inbound and
  outbound.

**IDS/IPS detection methods:**

- **Signature-based** — matches known attack patterns; fast and
  accurate on known attacks; misses novel attacks.
- **Anomaly-based** — baselines normal behavior and alerts on
  deviation; catches novel attacks but prone to false positives.
- **Heuristic** — combines rules and statistical methods.
- **ML-based** — modern variant; requires training data and
  careful tuning.

**Proxies vs reverse proxies:**

- **Forward proxy**: sits between users and internet; provides
  filtering, caching, anonymization. User traffic is proxied out.
- **Reverse proxy**: sits in front of servers; provides load
  balancing, TLS termination, WAF, caching. Clients talk to the
  reverse proxy as if it were the server.

### 4.c Frameworks

- CSA CCM v4 for cloud network components.
- NIST SP 800-41 (firewalls), 800-94 (IDS/IPS).

### 4.d Misconceptions

- "IDS and IPS are the same." IDS detects; IPS detects AND blocks.
  IPS is inline; IDS is typically out-of-band.
- "Signature-based IDS catches everything." Only catches what is
  in the signature database.

### 4.e Exam nuance

When the exam asks which firewall type to pick, match the
requirement:

- L3/L4 filtering → stateful firewall
- Application content inspection → proxy or NGFW
- Web application protection → WAF
- High-performance with basic rules → stateless packet filter

### 4.f Case studies

1. **Target (2013).** Flat network let HVAC credentials reach POS.
2. **Equifax (2017).** Network segmentation failure compounded an
   Apache Struts vulnerability.
3. **MOVEit (2023).** Internet-facing file transfer service with
   SQL injection, compromised 2000+ organizations.

### 4.g Mnemonics

- **Stateful vs Stateless: "State tracks the conversation, stateless tracks the packet."**

### 4.h Cross-refs

- Domain 3 — secure design principles applied to network components.
- Domain 7 — monitoring feeds SIEM from network controls.

---

### 5.e Network attacks

- **Sniffing** — passive capture of unencrypted traffic.
- **ARP poisoning** — L2 spoofing redirecting traffic through
  attacker.
- **DNS poisoning / cache poisoning** — insert false records in
  a resolver's cache.
- **DNS hijacking** — compromise DNS authoritative service or
  registrar.
- **Session hijacking** — steal or guess session tokens; defense
  is strong random tokens, binding to properties, TLS.
- **MITM** — attacker between two endpoints; defense is authenticated
  key exchange (TLS, SSH).
- **Replay** — resending captured messages; defense is nonces and
  timestamps.
- **SYN flood** — half-open TCP connections exhaust server state;
  defense is SYN cookies.
- **Amplification / reflection** (DNS, NTP, memcached) — attacker
  spoofs source, protocol responds to victim with larger reply.
- **DDoS** — volumetric (bandwidth), protocol (SYN flood),
  application-layer (slow loris, HTTP GET floods).
- **Rogue AP / Evil twin** — attacker-controlled wireless AP
  mimicking legitimate.
- **Karma attack** — rogue AP responds to probe requests with any
  SSID, tricking clients into connecting.
- **VLAN hopping** — escaping a VLAN via double tagging or switch
  spoofing.
- **IP spoofing** — forging source IP.
- **Port scanning** — reconnaissance.
`,

cissp_auth: `
## 4. Sub-objective 5.2 — Identification and authentication

### Identification

Identification is claiming an identity. Examples: username, email, employee ID, UUID,
X.500 DN, service principal name. Identification has no security weight on its own —
anyone can claim any identity. Security comes from authentication.

### Authentication

Authentication proves the claimed identity. Factors:

| Factor | Examples |
|---|---|
| **Something you know** | Password, PIN, passphrase, secret answer |
| **Something you have** | Hardware token, smart card, phone (for SMS or push), FIDO2 key |
| **Something you are** | Fingerprint, face, iris, voice, typing rhythm |
| **Somewhere you are** | GPS, IP geolocation, network segment (weaker; reintroduces perimeter) |
| **Something you do** | Signature, gesture, behavioral biometric |

**Multi-factor authentication (MFA)** combines two or more *different* factors. Two
passwords is not MFA (same factor). Password + TOTP is MFA (know + have). Password +
FIDO2 key is MFA (know + have, with phishing resistance).

NIST SP 800-63B distinguishes authentication assurance levels:
- **AAL1**: single-factor, lowest assurance
- **AAL2**: two-factor, moderate
- **AAL3**: hardware-based multi-factor with phishing resistance

### Phishing-resistant MFA

**SMS / voice codes** — defeated by SIM swap, SS7 attacks, phishing sites that relay.
**TOTP (Google Authenticator, Authy)** — defeated by phishing sites that relay the code in real time.
**Push notifications** — defeated by MFA fatigue attacks (Uber 2022).
**FIDO2 / WebAuthn** — phishing-resistant because the credential is cryptographically bound to the relying party's origin; a phishing site cannot trigger authentication for the real site's origin.
**Smart cards (PIV/CAC)** — phishing-resistant, certificate-based.

CISA, NIST, and NSA guidance in 2022-2024 increasingly mandate phishing-resistant MFA (FIDO2 or smart cards) for high-assurance scenarios.

### Biometrics

- **FAR (False Accept Rate)**: probability that an unauthorized user is accepted.
- **FRR (False Reject Rate)**: probability that an authorized user is rejected.
- **CER (Crossover Error Rate)**: point where FAR equals FRR; lower is better.
- **Type I error = FRR**, **Type II error = FAR**.

Biometrics are not secrets — they are observable. They also have no revocation story (you cannot reset your fingerprint). They work best as a factor in MFA, not alone.

### Passwordless authentication

Modern identity systems increasingly offer passwordless options: FIDO2 keys, Windows Hello, Apple Passkeys, smart cards, magic links. Benefits: eliminates password-related attack surface. Limits: still requires fallback and recovery paths, and the fallback often reintroduces password-like weaknesses.

### Frameworks

- **NIST SP 800-63** series — US federal digital identity guidelines. 800-63A (identity
  proofing), 800-63B (authentication), 800-63C (federation). Current rev 3.
- **ISO/IEC 29115** — entity authentication assurance framework.
- **FIDO Alliance specifications** — WebAuthn, CTAP, FIDO2.

### Misconceptions

- "SMS MFA is strong." It is weaker than no MFA in some attack models because it adds
  friction without stopping modern phishing.
- "Biometrics are a password replacement." Biometrics are an identifier, not a secret;
  they are best as an MFA factor with a second factor.

### Exam nuance

When a scenario asks for the strongest MFA, pick FIDO2 / WebAuthn or smart card.
When a scenario asks what makes MFA "multi-factor", the answer is that factors must
be of *different* types. When a scenario involves phishing or MFA fatigue, the
answer is phishing-resistant authentication, not more training.

### Case studies

1. **Colonial Pipeline 2021**: VPN account without MFA compromised, ransomware operation
   against critical infrastructure.
2. **Uber 2022**: MFA fatigue attack — attacker repeatedly triggered push notifications
   until a contractor approved one to stop the spam.
3. **Twitter 2020**: Employee access to internal admin tools compromised; demonstrated
   the value of phishing-resistant MFA and PAM.

### Mnemonics

- **"Know, Have, Are, Do, Somewhere"** — the five factor types.
- **"IAAA"** — Identification, Authentication, Authorization, Accountability.

### Cross-refs

- Domain 1 — policies and ethics around authentication.
- Domain 3 — crypto primitives (certificates, keys) behind authentication.

---
`,

cissp_access_control: `
## 6. Sub-objective 5.4 — Authorization mechanisms

### Access control models

**DAC (Discretionary Access Control)** — the owner of an object decides who can access
it. Examples: filesystem ACLs in Windows/Linux, shared-folder permissions. Flexible but
error-prone; does not prevent privilege propagation.

**MAC (Mandatory Access Control)** — access is determined by system-enforced policy
based on classification labels, not owner discretion. Used in classified environments.
Examples: SELinux in enforcing mode, classified military systems implementing BLP.

**RBAC (Role-Based Access Control)** — access is granted to roles, and users are
assigned to roles. Simplifies administration at scale. Variants: hierarchical RBAC
(role inheritance), constrained RBAC (SoD constraints), session-based RBAC.

**ABAC (Attribute-Based Access Control)** — access decisions use attributes of the
subject, resource, action, and environment. More flexible than RBAC but harder to
audit. Policy languages: XACML, Rego (Open Policy Agent).

**Rule-Based Access Control (RuBAC)** — access based on rules that apply regardless of
role. Firewall rules are an example. Often used together with RBAC or ABAC.

**Context-based** or **risk-adaptive** — decisions incorporate real-time risk signals
(device posture, location, time, behavioral anomaly).

**Content-based** — decisions depend on data content (classification labels, data
categories). Common in DLP.

### Access control matrices

- **Access Control Matrix**: abstract representation of subjects, objects, and their permissions.
- **Capability list**: per-subject list of objects and permissions.
- **Access control list (ACL)**: per-object list of subjects and permissions.

ACLs and capabilities are dual representations of the same matrix.

### Authorization enforcement

- **Policy Decision Point (PDP)**: evaluates access requests against policy.
- **Policy Enforcement Point (PEP)**: enforces the decision at the resource.
- **Policy Administration Point (PAP)**: authors and manages policies.
- **Policy Information Point (PIP)**: supplies attributes needed for decisions.

XACML defines these explicitly; modern IAM systems implement similar structures.

### Exam nuance

- When a scenario involves classified government data, MAC is the model.
- When a scenario involves commercial workflows with hundreds of users, RBAC is typical.
- When a scenario involves fine-grained dynamic decisions (risk-adaptive, per-resource attributes), ABAC is the answer.
- DAC is the default in most commercial operating systems but is considered weak for
  high-assurance scenarios.

### Case studies

1. **Capital One 2019**: over-permissive IAM role on a web application layer permitted
   SSRF exploitation to access ~100M records. Root cause: ABAC policy did not
   sufficiently limit cross-service access.
2. **Codecov 2021**: CI/CD token theft allowed lateral movement through OAuth
   permissions that were more permissive than necessary.

### Mnemonics

- **"Owner DAC, System MAC, Role RBAC, Attribute ABAC"**

### Cross-refs

- Domain 3 — security models (BLP, Biba) are the theoretical basis for MAC.

---
`,

cissp_identity: `
## 5. Sub-objective 5.3 — Federated identity

### Concepts

Federated identity lets users in one organization authenticate to resources in another
without maintaining separate credentials. The identity provider (IdP) asserts identity to
the relying party (RP) or service provider (SP), and the SP trusts the assertion based
on pre-established trust.

### Protocols

**SAML 2.0 (Security Assertion Markup Language)** — XML-based, established 2005. IdP
issues signed assertions; SP verifies signature against IdP's public key. Profiles
include Web Browser SSO (SP-initiated and IdP-initiated). Common in enterprise SSO to
SaaS applications. Trust is typically established via metadata exchange (XML documents).

**OpenID Connect (OIDC)** — OAuth 2.0 extension for authentication, established 2014.
JSON/JWT-based instead of SAML's XML. ID Tokens (signed JWTs) assert identity. OIDC
discovery simplifies metadata. Common in modern web and mobile applications.

**OAuth 2.0** — authorization framework, RFC 6749. Delegates access to resources, not
authentication. Flows: Authorization Code (with PKCE for public clients), Client
Credentials (machine-to-machine), Device Authorization Grant (TVs, CLIs),
Refresh Token. **Implicit flow and Resource Owner Password Credentials flow are
deprecated** in OAuth 2.1.

**WS-Federation** — older Microsoft-associated protocol, less common in new designs.

### Authentication vs authorization in OAuth/OIDC

OAuth 2.0 alone does not authenticate — it authorizes access to a resource on a user's
behalf. OIDC layers authentication on top by introducing the ID Token (a signed JWT)
that represents the user's authenticated identity. Treating OAuth access tokens as
authentication is a well-known misconception and has caused real vulnerabilities.

### Trust models

- **Direct trust**: IdP and SP trust each other directly via exchanged metadata/certificates.
- **Hub-and-spoke**: a hub IdP acts as intermediary between multiple IdPs and SPs.
- **Mesh federation**: multiple IdPs and SPs in bilateral or multilateral trust.
- **Cross-realm Kerberos**: legacy mutual trust between Kerberos realms.

### Frameworks

- OAuth 2.0 RFC 6749, OAuth 2.1 draft, PKCE RFC 7636, JWT RFC 7519, OIDC Core
- SAML 2.0 Core (OASIS)
- NIST SP 800-63C (Federation)
- FIDO Alliance specs

### Misconceptions

- "OAuth authenticates the user." OAuth by itself authorizes; OIDC adds authentication.
- "SAML is obsolete." Still dominant in enterprise SSO and will be for years.
- "Federated identity is insecure." Properly-implemented federation is strong; the
  risks are in implementation quality.

### Exam nuance

- **Implicit flow is deprecated** — OAuth 2.1 removes it; use Authorization Code with PKCE instead.
- **JWT 'none' algorithm** is a famous vulnerability — libraries that accepted unsigned JWTs
  allowed trivial impersonation.
- **Token theft** remains the biggest risk in modern federation; mitigations include short
  access token lifetimes, refresh token rotation, token binding, and session revocation.

### Case studies

1. **Golden SAML (SolarWinds / Nobelium 2020)**: attackers compromised the SAML
   signing key in an ADFS server and forged assertions to impersonate any user in
   federated SaaS — undetectable by the SaaS because the assertions were
   cryptographically valid.
2. **Microsoft Midnight Blizzard 2024**: legacy test tenant with no MFA used as
   entry point; lateral movement via OAuth consent abuse to gain access to production.
3. **Spring4Shell / OAuth token theft incidents**: various 2021-2023 incidents
   involving stolen OAuth tokens used to impersonate victims in SaaS.

### Mnemonics

- **"SAML = Signed XML assertion; OIDC = Signed JWT"**
- **"OAuth delegates; OIDC identifies"**

### Cross-refs

- Domain 3 — crypto primitives behind signatures.
- Domain 4 — federation protocols run over HTTPS/TLS.

---

## 7. Sub-objective 5.5 — Identity and access provisioning lifecycle

### Joiner-mover-leaver

The identity lifecycle has three major events:

1. **Joiner**: new user joins the organization. Initial identity is provisioned
   with role assignments, access to applications, device enrollment, training
   completion gates.
2. **Mover**: user changes roles or departments. Access must be updated — adding
   new entitlements and **removing old ones**. Failure to remove creates
   privilege accumulation, a common audit finding.
3. **Leaver**: user leaves the organization. All access must be revoked promptly,
   ideally before notification for involuntary separations. Orphaned accounts
   created by incomplete deprovisioning are a major attack surface.

### Access recertification

Periodic review that access still matches current job requirements. Owners attest
that their direct reports' access is still appropriate; unattested access is
removed. Required by SOX, HIPAA, PCI-DSS, and most mature governance programs.

### Privileged access management (PAM)

Admin accounts require additional controls beyond user accounts:

- **Credential vaulting**: admin credentials are stored in a vault, not on user
  workstations. Users request check-out when they need access.
- **Just-in-time (JIT) access**: admin privileges are granted for a limited
  window and revoked automatically. No permanent admin memberships.
- **Approval workflows**: sensitive operations require a second person's approval.
- **Session recording**: admin sessions are recorded for audit and forensic
  review.
- **Bastion hosts / jump servers**: admin access is routed through a central
  chokepoint that enforces logging and policy.
- **Break-glass accounts**: emergency-only accounts for catastrophic scenarios,
  with strict procedures and monitoring.

### Service accounts and non-human identities

Service accounts, API keys, OAuth client credentials, cloud workload identities,
machine-to-machine certificates are increasingly important and often weaker than
user IAM. Best practices: treat them as first-class identities with ownership,
rotation, scope limitation, and monitoring.

### Frameworks

- NIST SP 800-53 AC, IA, PS families
- SCIM (System for Cross-domain Identity Management) for user provisioning APIs
- ISO/IEC 24760 identity management framework

### Misconceptions

- "Deprovisioning is an IT task." It is HR-led and IT-executed; HR must notify
  immediately.
- "Recertification is annual." Higher-sensitivity access should be recertified
  more frequently (quarterly or continuously).

### Exam nuance

When a scenario describes orphaned accounts or privilege accumulation, the
root cause is lifecycle governance, not a technical failure. The remediation
is recertification, automated deprovisioning tied to HR events, and regular
reconciliation of identities against authoritative sources.

### Case studies

1. **Equifax 2017**: orphaned admin credentials contributed to incident
   containment challenges.
2. **Capital One 2019**: over-privileged IAM role used by the application
   had never been right-sized.
3. **Various insider incidents**: former employees retaining access months
   after termination.

### Mnemonics

- **"Joiner-Mover-Leaver, and Don't Forget the Service Account"**

---
`,

cissp_iam_attacks: `
## 8. Sub-objective 5.6 — Authentication systems

### Kerberos

Widely used in enterprise environments, especially Active Directory. Components:

- **KDC (Key Distribution Center)**: issues tickets. Has two sub-services:
  - **AS (Authentication Service)**: authenticates user, issues TGT.
  - **TGS (Ticket Granting Service)**: issues service tickets.
- **TGT (Ticket Granting Ticket)**: proves the user authenticated; used to
  request service tickets without re-authenticating.
- **Service ticket**: allows access to a specific service.

Flow:
1. Client sends AS-REQ (username + timestamp encrypted with password-derived key).
2. AS issues TGT encrypted with KDC's secret key, plus a session key encrypted
   with the user's key.
3. Client requests service ticket with TGS-REQ (TGT + service name).
4. TGS issues service ticket encrypted with the service's secret key.
5. Client presents service ticket to the service; service decrypts to verify.

### Kerberos attacks

- **Pass-the-hash**: steal NTLM hash and use it without knowing the password. Mitigation: Credential Guard, disable NTLM where possible.
- **Pass-the-ticket**: steal Kerberos tickets from memory and reuse. Mitigation: Credential Guard, privileged workstation isolation.
- **Kerberoasting**: request service tickets for accounts with SPN set, then offline-crack the encrypted portion (encrypted with the service account's password). Mitigation: strong service account passwords, managed service accounts, or fine-grained Kerberos policy.
- **Golden ticket**: forge a TGT using the KDC's long-term key (krbtgt). Requires domain compromise; mitigation: regular krbtgt rotation (twice).
- **Silver ticket**: forge a service ticket using the service account's key. Requires service account compromise.
`,

cissp_vuln: `
## 3. Sub-objective 6.1 — Assessment strategies

Assessment strategies define what will be tested, how often, by whom, and with what criteria. Key decisions:

- **Internal vs external**: internal assessments are cheaper and more frequent but lack independence; external assessments provide independent attestation but cost more.
- **Announced vs unannounced**: announced tests allow coordination but may bias results; unannounced tests measure real posture but risk disruption.
- **Continuous vs point-in-time**: continuous control monitoring is the modern standard; point-in-time audits miss drift between assessments.
- **Risk-based prioritization**: focus assessment on highest-risk systems first.

### Frameworks

- **NIST SP 800-53A** — Assessing Security and Privacy Controls in Federal Information Systems. Defines assessment procedures for every 800-53 control.
- **NIST SP 800-115** — Technical Guide to Information Security Testing and Assessment.
- **ISO/IEC 27007, 27008** — guidelines for ISMS audit.
- **PCI-DSS ASV scanning** — quarterly external scans by Approved Scanning Vendors.
- **FedRAMP** — US federal assessment program for cloud services.

### Misconceptions

- "Assessment is the same as audit." Assessment evaluates controls; audit verifies compliance. Related but distinct.
- "An annual audit is enough." Point-in-time audits miss the ~364 days between assessments.

### Exam nuance

When a scenario asks what is MOST important in assessment strategy, the answer usually includes independence, risk-based prioritization, and continuous monitoring — not the volume of testing.

---

## 4. Sub-objective 6.2 — Security control testing

### Vulnerability scanning
- **Network scanning** (Nessus, Qualys, OpenVAS, Rapid7): signature-based identification of known vulnerabilities on network-accessible services.
- **Authenticated vs unauthenticated scans**: authenticated scans log into hosts and see local vulnerabilities; unauthenticated scans see only what is network-visible. Authenticated is much more accurate.
- **Credentialed web app scanning** (Burp, Zap, Acunetix, Invicti): tests web applications with authentication.
- **Cloud security posture management (CSPM)**: continuous configuration assessment of cloud resources against benchmarks.

### Penetration testing
- **Black box**: tester has no prior knowledge.
- **Gray box**: tester has partial knowledge.
- **White box**: tester has full knowledge, source code access.
- **Rules of engagement**: scope, timing, authorized targets, prohibited actions, escalation path, evidence handling.
- **Authorization letter ('get out of jail free card')**: written authorization from the asset owner protecting the tester.
- **Reporting**: findings with severity, remediation guidance, and executive summary.

### Red team vs blue team vs purple team
- **Red team**: adversary simulation; attempts to compromise the organization over time, mimicking real attackers.
- **Blue team**: defenders; detection and response.
- **Purple team**: joint exercises where red and blue work together to improve both sides.

### Application security testing
- **SAST (Static Application Security Testing)**: analyzes source code without running it. Finds many real bugs but also many false positives. Best run at commit time or in CI.
- **DAST (Dynamic Application Security Testing)**: tests running applications from the outside. Finds runtime bugs that SAST misses. Requires deployed instance.
- **IAST (Interactive Application Security Testing)**: instruments the running application from inside, combining SAST-like visibility with DAST-like runtime behavior.
- **SCA (Software Composition Analysis)**: identifies open-source components and their known vulnerabilities. Essential for supply chain security.
- **RASP (Runtime Application Self-Protection)**: instruments the application to block attacks at runtime.
- **Fuzzing**: randomized or mutation-based input generation to find crash-inducing bugs.

### Frameworks

- **OWASP Testing Guide** — web application testing methodology.
- **OWASP ASVS** — Application Security Verification Standard.
- **PTES (Penetration Testing Execution Standard)**.
- **NIST SP 800-115**.

### Case studies

1. **Equifax 2017**: vulnerability scanning had identified the Apache Struts CVE but the remediation workflow did not execute; assessment without remediation is security theater.
2. **MOVEit 2023**: pre-breach vulnerability assessment could not detect the SQL injection zero-day because scans are signature-based. Illustrates the limit of scanning.
3. **SolarWinds 2020**: static analysis did not detect the malicious build system compromise because the change was in the build, not the source.

### Mnemonics

- **"SAST reads, DAST probes, IAST watches"**
- **"Red attacks, Blue defends, Purple learns"**

---
`,

cissp_audit: `
## 5. Sub-objective 6.3 — Security process data

### Key metrics
- **KPI (Key Performance Indicator)**: measures performance of the security program (MTTD, MTTR, patch cadence, MFA coverage, training completion).
- **KRI (Key Risk Indicator)**: measures risk posture (percentage of critical risks within appetite, external attack surface, identity hygiene score).
- **SLA/SLO/SLI**: service level agreement / objective / indicator, applied to security services.

### Activity vs outcome metrics
- **Activity**: what the team did (tickets closed, scans run, training completed).
- **Outcome**: what changed as a result (incidents reduced, risk posture improved).
Boards should see outcome metrics; operations should see activity metrics.

### Account audit / access review
Periodic validation that access still matches job roles. Required by SOX, PCI-DSS, HIPAA.

### Management review
Periodic executive review of the security program (ISO 27001 clause 9.3 requires annual management review of the ISMS).

---

## 7. Sub-objective 6.5 — Security audits

### Audit types
- **Internal audit**: performed by the organization itself; less independent but more frequent.
- **External audit**: performed by an independent third party; strongest evidence.
- **First-party**: organization audits itself (or its supply chain).
- **Second-party**: customer audits vendor.
- **Third-party**: independent audit firm.

### SOC reports (AICPA SSAE 18 / SSAE 21)
- **SOC 1**: controls over financial reporting. Used by customers who depend on the service for their own SOX compliance.
- **SOC 2**: controls related to the Trust Services Criteria (security, availability, processing integrity, confidentiality, privacy). Most common for SaaS and cloud providers.
- **SOC 3**: a general-use version of SOC 2 suitable for public distribution.
- **Type I**: design of controls at a point in time (snapshot).
- **Type II**: operating effectiveness of controls over a period (typically 6-12 months). Much stronger evidence than Type I.

SOC 2 Type II is the enterprise SaaS standard.

### ISO 27001 certification
Third-party certification that an ISMS conforms to ISO/IEC 27001. Recertification every 3 years with annual surveillance audits.

### Other audits
- **PCI-DSS**: QSA assessment for Level 1 merchants; SAQ for smaller merchants.
- **FedRAMP**: federal cloud authorization with 3PAO assessment.
- **HITRUST**: healthcare-oriented certification combining HIPAA and other frameworks.
- **CSA STAR**: cloud security certification.

### Frameworks
- **AICPA SSAE 18/21** — audit standards for SOC reports.
- **ISO 19011** — guidelines for auditing management systems.

### Misconceptions
- "SOC 2 Type I and Type II are similar." No — Type I is a snapshot, Type II is operating effectiveness over months. Customers should demand Type II.
- "An ISO 27001 certificate proves security." Only that the ISMS conforms to the standard. Specific controls depend on the Statement of Applicability.

### Exam nuance
When a scenario involves a SaaS vendor evaluation, SOC 2 Type II is the typical answer. When it involves financial reporting, SOC 1. When it involves HIPAA or PCI-DSS, the specific framework assessment.

---
`,

cissp_testing: `

## Software Testing

### Application Security Testing Tools

| Tool | Method | Strengths | Weaknesses |
|---|---|---|---|
| **SAST** | Reads source code without running | Fast, finds many bugs early, covers full codebase | High false positives, misses runtime issues |
| **DAST** | Probes running application from outside | Finds real exploitable bugs, tests business logic | Misses code paths not exercised, requires deployed instance |
| **IAST** | Instruments running app from inside | Lower false positives, runtime + code visibility | Requires instrumentation, framework support needed |
| **SCA** | Inventories dependencies vs vulnerability DBs | Catches supply chain risks (Log4Shell) | Only finds known vulnerabilities in known components |
| **RASP** | Runtime protection inside the app | Blocks attacks at runtime | Performance overhead, deployment complexity |
| **Fuzzing** | Randomized input generation | Finds crash-inducing bugs, edge cases | No guarantee of coverage, requires test harness |

**"SAST reads, DAST probes, IAST watches, SCA lists, RASP defends."**

### SAST (Static Application Security Testing)

Analyzes source code, bytecode, or binary without executing it. Parses code into an abstract syntax tree, traces data flows, and identifies patterns matching known vulnerability classes: SQL injection, XSS, path traversal, hardcoded credentials, insecure crypto.

**When to run:** At commit time in CI, or in the IDE during development. Best when fast and tuned to critical issues only.

**Limitations:** High false positive rate because it cannot observe runtime behavior. Cannot detect business logic flaws. May not understand framework-specific security patterns.

### DAST (Dynamic Application Security Testing)

Tests a running application from the outside by sending HTTP requests and analyzing responses. Crawls the application, submits test payloads (injection strings, XSS probes), and observes whether the application responds in ways that indicate vulnerabilities.

**When to run:** Against a deployed test environment. In CI/CD after deployment to a staging environment.

**Limitations:** Only exercises code paths that the crawler finds. Cannot see internal code logic. Requires a running instance. Slower than SAST.

### IAST (Interactive Application Security Testing)

Instruments the running application with an agent that observes data flows, function calls, and security-relevant operations from inside. Combines SAST's code visibility with DAST's runtime accuracy.

**When to run:** During functional testing. The agent observes what happens when tests exercise the application.

**Advantages:** Lower false positives than SAST, catches issues DAST misses, provides precise code location of findings.

**Limitations:** Requires compatible language/framework support. Performance overhead from instrumentation. Effectiveness depends on test coverage.

### SCA (Software Composition Analysis)

Inventories open-source and third-party components and cross-references them against known-vulnerability databases (NVD, OSV, GitHub Advisory Database).

**Critical because:** Modern applications are 80-90% someone else's code. Log4Shell (CVE-2021-44228) demonstrated that organizations without SCA could not answer "do we use this component?" quickly.

**Tools:** Snyk, Dependabot, WhiteSource/Mend, JFrog Xray, Black Duck, Trivy.

### Manual Code Review

Automated tools miss business logic flaws, complex authorization issues, and novel attack patterns. Manual review by skilled security engineers catches what automation cannot.

**Most valuable for:** High-risk code paths, new architectures, authentication/authorization logic, cryptographic implementations.

### Penetration Testing vs Vulnerability Scanning

- **Scan** = automated, signature-based, finds KNOWN vulnerabilities. Answers "what COULD be wrong."
- **Pentest** = human-driven, chains exploits, finds EXPLOITABLE paths. Answers "what IS exploitable right now."

Both are needed. Scans provide breadth; pentests provide depth.

### Red Team / Blue Team / Purple Team

- **Red team** — adversary simulation over weeks-months, realistic threat actor behavior
- **Blue team** — defenders: detection and response
- **Purple team** — joint debrief where red shows blue what they did and missed; mutual improvement
- **White team** — coordinators who plan, observe, and referee

### Exam Tips

- No single tool is sufficient — mature programs use SAST + DAST + IAST + SCA + manual review
- SCA is the ONLY tool that catches dependency vulnerabilities quickly
- IAST has lower false positives than SAST but needs instrumentation
- Manual code review catches business logic that automation misses
- Assessment without remediation = security theater
- "Shift left" = catch early. "Shift everywhere" = no stage catches everything.

`,

cissp_ir: `

## Incident Management

### NIST SP 800-61 Rev 2 — IR Lifecycle

The incident response lifecycle has four phases that form a continuous loop:

**Phase 1: Preparation**
- Develop IR policy and procedures
- Build and train the IR team (CSIRT)
- Deploy tools: SIEM, EDR, forensic imaging, communication channels
- Establish communication plans: internal (management, affected teams) and external (customers, regulators, law enforcement, media)
- Run exercises: tabletop, walkthrough, simulation
- Pre-designate a spokesperson for external communication
- Pre-draft communication templates for common scenarios
- Establish relationships with law enforcement, CERT, and ISAC contacts

**Phase 2: Detection and Analysis**
- Identify that an incident has occurred through alerts, user reports, or proactive hunting
- Triage: determine severity, scope, and classification
- Initial scoping: how many systems affected, what data at risk, what is the attacker doing
- Activate the IR plan if thresholds are met
- Begin evidence preservation immediately

**Phase 3: Containment, Eradication, and Recovery**

*Containment (short-term):*
- Isolate affected systems from the network
- Disable compromised accounts
- Block malicious IPs/domains
- Preserve evidence before containment actions that would destroy it

*Containment (long-term):*
- Segment affected network areas
- Deploy additional monitoring
- Patch or mitigate the exploited vulnerability
- Prepare for eradication

*Eradication:*
- Remove attacker's presence: malware, backdoors, unauthorized accounts
- Rotate all credentials used on compromised systems
- Rebuild compromised systems from clean images
- Close the attack vector

*Recovery:*
- Restore operations in phases, starting with most critical
- Monitor intensively for re-infection or attacker return
- Validate data integrity before resuming normal operations
- Gradually reduce heightened monitoring as confidence increases

**Phase 4: Post-Incident Activity (Lessons Learned)**
- Conduct a formal debrief within 1-2 weeks of resolution
- Document what happened, when, how it was detected, how it was contained, and what went well or poorly
- Produce specific remediation actions with owners and deadlines
- Update IR procedures, detection rules, and training based on findings
- Track remediation completion as a closed loop
- The lessons-learned debrief is the most important phase — it turns incidents into program improvement

### IR Team Roles

- **IR Lead / Incident Commander** — owns the response, makes decisions
- **Technical analysts** — perform triage, forensics, containment
- **Communications** — manages internal and external messaging
- **Legal** — advises on evidence, notification obligations, privilege
- **Executive liaison** — keeps leadership informed, authorizes resources
- **HR** — involved when insiders are implicated

### Breach Notification Timelines

| Regulation | Timeline | Trigger |
|---|---|---|
| **GDPR** | 72 hours to supervisory authority | Risk to rights and freedoms |
| **SEC (US public companies)** | 4 business days (8-K) | Material incident determination |
| **HIPAA** | 60 days to HHS + individuals | PHI breach affecting 500+ |
| **US state laws** | Varies (typically "without unreasonable delay") | PII breach |
| **PCI-DSS** | Varies by card brand | Cardholder data compromise |

### Playbooks

Incident-specific runbooks for common types:
- **Ransomware** — containment, backup assessment, law enforcement, payment decision
- **Business Email Compromise** — email forensics, financial recovery (wire recall has short windows)
- **Credential compromise** — credential rotation, session revocation, scope assessment
- **Data exfiltration** — scope, evidence preservation, notification analysis
- **DDoS** — upstream coordination, scrubbing services, customer communication
- **Insider threat** — HR coordination, legal, evidence preservation under employment law

### Exam Tips

- Personnel safety is ALWAYS first — before any technology response
- Preserve evidence BEFORE containment actions that would destroy it
- The correct FIRST action in most scenarios: activate the IR plan / notify IR team
- Single spokesperson for external communications (communications/PR with legal support)
- Blameless post-mortems produce better learning than blame-focused reviews
- IR is a LOOP — lessons feed back into preparation
- "What should the CISSP do FIRST after discovering an incident?" → Contain and preserve evidence (not reboot, not call the media)

`,

cissp_investigations: `

## Investigations & Evidence

### Investigation Types

The CISSP exam distinguishes five investigation types:

| Type | Burden of Proof | Consumer | Typical Trigger |
|---|---|---|---|
| **Administrative** | Policy/agreement | HR, management | Policy violation |
| **Criminal** | Beyond a reasonable doubt | Prosecutor, court | Alleged crime |
| **Civil** | Preponderance of evidence | Plaintiff's counsel | Tort, contract dispute |
| **Regulatory** | Varies (often preponderance) | Regulator | Compliance failure |
| **Industry** | Contractual | Industry body / auditor | Audit finding |

The same conduct can trigger multiple investigation types simultaneously. An employee who steals data may face an administrative investigation (HR discipline), a civil investigation (company sues for damages), a criminal investigation (CFAA charges), and a regulatory investigation (HIPAA violation) — all at the same time.

### Burden of Proof

Understanding the burden of proof is the most-tested concept here:

- **Beyond a reasonable doubt** (criminal) — highest standard; the prosecution must prove guilt to near certainty
- **Preponderance of evidence** (civil) — "more likely than not" (>50%); lower standard
- **Administrative** — internal policy; typically the lowest standard

The exam will present a scenario and ask "what standard of proof applies?" — the answer is always tied to the investigation type.

### Evidence Handling

**Chain of custody** — documented record of every person who handled the evidence, with timestamps. Every handoff is recorded. Breaks in the chain are grounds to exclude evidence at trial.

**Best evidence rule** — original evidence is preferable; copies admitted only when originals are unavailable. For digital evidence, the "original" is a forensically sound image.

**Five rules of evidence:**
1. **Authentic** — evidence is what it claims to be
2. **Accurate** — evidence has not been altered
3. **Complete** — evidence tells the whole story
4. **Convincing** — evidence is persuasive to the trier of fact
5. **Admissible** — evidence was collected properly and is legally permissible

### Forensic Procedures

**Order of volatility (RFC 3227)** — collect more-volatile evidence first:
1. CPU registers, cache
2. Routing tables, ARP cache, process tables, memory
3. Temporary file systems
4. Disk storage
5. Remote logging and monitoring data
6. Physical configuration and network topology
7. Archival media

**Forensic imaging** — bit-for-bit copy with cryptographic hash (SHA-256) computed before and after to prove the image is exact. Tools: dd, FTK Imager, EnCase.

**Write blockers** — hardware or software that prevents writes to evidence media during imaging. Always use when imaging.

**Live forensics vs dead forensics:**
- **Live** — system is running; capture volatile evidence (RAM, process state, network connections) before powering down
- **Dead** — system is powered off; image the disk

### Digital Forensics Process

1. **Identification** — determine that an incident has occurred and that evidence exists
2. **Collection** — gather evidence following order of volatility, with chain of custody
3. **Examination** — process the evidence to extract relevant data
4. **Analysis** — interpret the extracted data in context of the investigation
5. **Reporting** — document findings with evidence, methodology, and conclusions

### eDiscovery

Electronic discovery for litigation. The Federal Rules of Civil Procedure (FRCP) govern eDiscovery in US federal courts. Key obligations:

- **Preservation** — once litigation is reasonably anticipated, relevant ESI (electronically stored information) must be preserved
- **Litigation hold** — formal notice to preserve; overrides normal retention
- **Spoliation** — destruction of relevant evidence; sanctionable (FRCP Rule 37(e))
- **Proportionality** — discovery obligations are proportional to the case

### Key Frameworks

- **RFC 3227** — Guidelines for Evidence Collection and Archiving
- **NIST SP 800-86** — Guide to Integrating Forensic Techniques Into Incident Response
- **ISO/IEC 27037** — Identification, Collection, Acquisition, Preservation of Digital Evidence
- **ISO/IEC 27042** — Analysis and Interpretation of Digital Evidence
- **Federal Rules of Evidence (US)** — especially Rules 702 (expert testimony), 901 (authentication)

### Exam Tips

- Preserve first, analyze second. Never analyze the original.
- Chain of custody starts at first acquisition, NOT at the lab.
- Criminal and civil cases CAN run in parallel (different burden).
- Administrative investigations are the most common in CISSP's context.
- When a scenario hints at potential criminal conduct, preserve evidence AS IF prosecution were possible.
- RFC 3227 order: CPU → memory → disk → archival (most volatile first)

`,

cissp_operations: `
## 4. Logging and monitoring

**Log sources:** authentication, authorization, application, network (flow logs, firewall logs), operating system, database, cloud (CloudTrail, Azure Activity Log, GCP Audit Log), security tools (EDR, DLP, IDS/IPS, CASB), email, DNS. NIST SP 800-92 is the US federal reference for log management.

**Log management:** aggregation (forwarders, syslog, collectors), normalization (common schema), enrichment (threat intelligence, asset context, user context), storage (tiered: hot for recent, warm for historical, cold for compliance), retention (tiered by category).

**SIEM (Security Information and Event Management):** aggregates logs, correlates events, produces alerts. Examples: Splunk, Microsoft Sentinel, Elastic, QRadar, Sumo Logic, Chronicle. Use cases drive deployment; "collect everything" is an anti-pattern.

**SOAR (Security Orchestration, Automation, and Response):** automates response to common incident types. Playbooks chain actions: ticket creation, enrichment, containment steps, notification. Reduces MTTR and analyst burnout.

**UEBA (User and Entity Behavior Analytics):** baselines normal behavior and alerts on anomalies. Complements signature-based detection for insider threats and novel techniques.

**Continuous monitoring:** per NIST SP 800-137, the practice of maintaining awareness of information security, vulnerabilities, and threats on an ongoing basis rather than point-in-time assessment.

**Egress filtering:** monitor outbound traffic; exfiltration usually crosses the boundary in the direction the organization watches least.

**Threat intelligence feeds:** IP/domain/hash reputation, CVE feeds, IOC databases. Valuable but insufficient alone.

**Key metrics:** MTTD (Mean Time To Detect), MTTR (Mean Time To Respond), alert volume, false positive rate, detection coverage per MITRE ATT&CK.

## 5. Configuration and change management

**Configuration management (CM):** track and control the state of systems over time. Baselines, drift detection, remediation. NIST SP 800-128 is the US federal reference. CIS Benchmarks and DISA STIGs provide baseline standards.

**Asset management:** know what you have (Domain 2 §2.1 and §2.3). An accurate inventory is a prerequisite for every other operational discipline.

**Change management:** formal process for proposing, reviewing, approving, implementing, and verifying changes. Components: change advisory board (CAB), change request, impact analysis, rollback plan, post-implementation review. ITIL, NIST SP 800-53 CM family.

**Change types:** standard (pre-approved, low-risk), normal (requires review), emergency (urgent, post-implementation review). Emergency changes are the most dangerous because they bypass controls; post-incident review should include every emergency change.

**Configuration drift:** the gap between baseline and current state. Drift detection and automated remediation are essential in cloud environments with many moving resources.

## 6. Patch and vulnerability management

**Vulnerability management program** (revisiting Domain 6): identification (scanning, threat intel, vendor advisories), prioritization (CVSS + context + exploitability), assignment (owner per asset), remediation (patch, mitigate, compensating control), verification (rescan, confirm closure). SLA adherence tracked as a KPI.

**Patch management:** identify patches from vendors, test in non-production, schedule deployment through change management, deploy, verify success. Emergency patches for critical vulnerabilities may bypass normal windows.

**Zero-day response:** when a vulnerability is actively exploited before a patch exists, compensating controls (WAF rules, network isolation, EDR blocking) bridge the gap.

**Patch testing:** regression testing in a staging environment before production deployment, to catch compatibility issues that would otherwise produce self-inflicted outages.
`,

cissp_disaster: `

## Disaster Recovery Operations

### Recovery Site Types

| Site | Hardware | Data | Recovery Time | Cost |
|---|---|---|---|---|
| **Cold site** | Empty facility, power, HVAC | None / backups delivered | Days to weeks | Lowest |
| **Warm site** | Hardware installed, not current | Periodic sync or restored | Hours to days | Moderate |
| **Hot site** | Fully equipped, current | Near real-time replication | Minutes to hours | High |
| **Mirror / dual site** | Identical, active-active | Synchronous replication | Near zero | Highest |
| **Mobile site** | Trailer or container | Brought on demand | Hours to days | Varies |
| **Reciprocal / mutual aid** | Partner org's facility | Depends | Days | Very low |
| **Cloud DR** | Cloud-provider capacity | Replicated / snapshots | Minutes to hours | Variable |

**Reciprocal agreements** are rarely recommended — both partners typically need the facility at the same time (the same disaster affects both).

### Backup Strategies

**Full backup** — complete copy of all data. Longest to create, fastest to restore.
**Incremental backup** — copies only data changed since the LAST backup (full or incremental). Fastest to create, slowest to restore (need full + all incrementals).
**Differential backup** — copies data changed since the LAST FULL backup. Middle ground: faster than full to create, faster than incremental to restore.

**3-2-1 rule:** 3 copies, 2 different media types, 1 copy offsite.
**3-2-1-1-0:** adds 1 immutable/air-gapped copy (ransomware defense) + 0 errors verified (test restores).

### Modern Backup Considerations

**Air-gapped / immutable backups** are the defense against ransomware that specifically targets backup infrastructure. Implementations:
- AWS S3 Object Lock (WORM compliance mode)
- Azure Immutable Blob Storage with time-based retention
- Google Cloud Storage retention policies
- Physical tape in a vault
- Offline systems with write-once media

**Cloud DR** is not automatically multi-region. Deploying to a single cloud region does not provide DR — an explicit multi-region design with replication and failover automation is required.

### Recovery Testing

BCP/DR test types from least to most disruptive:

1. **Checklist review** — paper verification that plans and contacts are current
2. **Tabletop exercise** — discussion-based scenario walkthrough
3. **Walkthrough** — detailed step-by-step review with SMEs
4. **Simulation** — partial execution in a test environment
5. **Parallel test** — full execution at DR site while primary continues (MOST realistic without risking production)
6. **Full interruption** — shut down primary, force real failover (MOST realistic overall)

### DR Site Geographic Considerations

The DR site must be geographically distant enough to avoid the same regional disaster:
- Same earthquake fault line → both sites destroyed
- Same hurricane path → both sites flooded
- Same power grid → both sites blacked out
- Same network backbone → both sites offline

Hurricane Katrina (2005) taught this: organizations with DR in the same coastal region lost both sites.

### Failover and Failback

**Failover** — switching operations from primary to DR site. Can be automatic (active-active, automated health checks) or manual (human decision).

**Failback** — returning from DR to primary after recovery. Often harder than failover because:
- Data has changed at the DR site during the outage
- The primary may need to be rebuilt or cleaned
- Users are already working at the DR site

### Exam Tips

- "Which test is LEAST disruptive?" → Checklist
- "Which test MOST realistically validates while preserving production?" → Parallel
- "Which test is MOST realistic?" → Full interruption
- RTO + WRT must be ≤ MTD
- Personnel safety is ALWAYS first in a disaster — before technology recovery
- Cloud DR requires explicit multi-region design
- Failback planning should start BEFORE the disaster occurs
- Test restores regularly — untested backups often fail at the worst moment

`,

cissp_sdlc: `

## Secure SDLC

### Security Activities by Phase

**1. Requirements**
- Capture security requirements alongside functional requirements
- Identify applicable compliance obligations (GDPR, HIPAA, PCI-DSS)
- Define abuse cases (how the system could be misused)
- Specify authentication, authorization, and audit requirements
- Establish data classification for data the system will handle
- Document security acceptance criteria

**2. Design**
- Threat modeling: identify threats using STRIDE, PASTA, or Shostack's four questions
- Secure architecture patterns: defense in depth, least privilege, fail-safe defaults
- Select frameworks and libraries with known security properties
- Design authentication and authorization flows
- Plan encryption strategy (at rest, in transit, in use)
- Security architecture review by the security team

**3. Build (Implementation)**
- Secure coding practices: input validation, output encoding, parameterized queries
- Code review: manual and automated (SAST in IDE and CI)
- SCA scanning to catch vulnerable dependencies at commit time
- Secret scanning to prevent credential leaks
- Developer security training integrated into the workflow

**4. Test**
- DAST against running application in test environment
- IAST with instrumented application during functional tests
- Fuzzing for crash-inducing or unexpected behavior
- Penetration testing by qualified testers
- Security-specific test cases derived from threat model

**5. Deploy**
- IaC scanning for infrastructure misconfigurations
- Container image scanning for vulnerable base images
- Secrets management: no credentials in code or config
- Deployment gates: final security check before production
- Signed artifacts with verified provenance

**6. Operate**
- Runtime monitoring: RASP, WAF, anomaly detection
- Vulnerability management for the running application
- Incident response readiness for application-level incidents
- Continuous monitoring and detection rule tuning
- Feedback loop: findings from operations feed back into design

### Secure SDLC Frameworks

**Microsoft SDL (Security Development Lifecycle)**
Phases: Training → Requirements → Design → Implementation → Verification → Release → Response. The original corporate-scale secure SDLC framework. Proven at Microsoft to measurably reduce shipped vulnerabilities.

**NIST SSDF (SP 800-218 — Secure Software Development Framework)**
Four practice groups:
1. **PO (Prepare the Organization)** — policies, roles, training, tools
2. **PS (Protect the Software)** — protect source, protect build, protect release
3. **PW (Produce Well-Secured Software)** — design, implement, review, test
4. **RV (Respond to Vulnerabilities)** — identify, analyze, remediate, disclose

Required for US federal software suppliers under EO 14028 and OMB M-22-18.

**OWASP SAMM (Software Assurance Maturity Model)**
Measurable maturity framework with five business functions: Governance, Design, Implementation, Verification, Operations. Each has security practices with maturity levels 1-3.

**BSIMM (Building Security In Maturity Model)**
Descriptive benchmark based on what real software security programs actually do. Published annually with data from 100+ organizations.

### Development Methodology Considerations

**Waterfall** — sequential phases; security activities map clearly to each phase. Security requirements up front, testing at the end.

**Agile** — iterative sprints; security must be integrated per sprint, not deferred. Security stories in the backlog. Threat modeling updates with each major feature. SAST/DAST in CI.

**DevOps** — tight dev/ops integration with automation. Security must be embedded in the automation or it gets bypassed.

**DevSecOps** — security integrated into the DevOps pipeline at every stage. The mature model for modern software development.

### Exam Tips

- Threat modeling at design time is the cheapest place to find and fix security issues
- "Secure by design" prevents entire classes of vulnerability; "security tested" finds individual bugs
- NIST SSDF is now a federal procurement requirement (EO 14028)
- Microsoft SDL is the canonical corporate secure SDLC
- Shift left for speed (catch early), shift everywhere for depth (no single stage catches everything)
- Security requirements must be in the backlog alongside functional requirements

`,

cissp_app_vuln: `
## 4. OWASP Top 10 (2021)

The current OWASP Top 10 Web Application Security Risks (A01-A10):

1. **A01: Broken Access Control** — enforcement failures allowing unauthorized actions.
2. **A02: Cryptographic Failures** — (formerly Sensitive Data Exposure) weak crypto, missing encryption, poor key management.
3. **A03: Injection** — SQL, NoSQL, OS command, LDAP injection where untrusted data is interpreted as code.
4. **A04: Insecure Design** — design-time flaws that cannot be fixed by implementation.
5. **A05: Security Misconfiguration** — default configurations, unnecessary features, missing hardening.
6. **A06: Vulnerable and Outdated Components** — known-vulnerable dependencies.
7. **A07: Identification and Authentication Failures** — weak authentication, session management flaws.
8. **A08: Software and Data Integrity Failures** — trust in unverified updates, insecure CI/CD, untrusted deserialization.
9. **A09: Security Logging and Monitoring Failures** — insufficient detection capability.
10. **A10: Server-Side Request Forgery (SSRF)** — server making requests to unintended destinations.

### Defenses (by category)

**Against injection:**
- Parameterized queries (prepared statements) — never string-concatenate user input into SQL.
- ORM frameworks that use parameters correctly.
- Input validation with allowlist rather than blocklist.
- Output encoding for context (HTML, JavaScript, SQL, OS command).
- Language-level safety (memory-safe languages, type safety).

**Against broken access control:**
- Deny by default; explicit allow.
- Enforce at every layer, including server-side (never trust client).
- Reject requests that reference objects the user does not own (IDOR protection).
- Attribute-based access control for complex cases.
- Logging for access decisions.

**Against cryptographic failures:**
- Use standard libraries, never roll your own.
- AES-GCM or ChaCha20-Poly1305 for AEAD.
- Argon2id or bcrypt/scrypt for passwords.
- HTTPS everywhere with TLS 1.3.
- Proper key management (HSM, KMS, separation from application).

**Against insecure design:**
- Threat modeling at design time.
- Secure design principles (least privilege, defense in depth, fail-safe, etc.).
- Security requirements in the backlog.
- Security architecture review for significant changes.

**Against vulnerable components:**
- SCA (Software Composition Analysis) continuously scanning dependencies.
- SBOM tracking.
- Patch management for dependencies.
- Evaluate components before adoption.

**Against authentication failures:**
- Strong authentication (MFA, phishing-resistant).
- Secure session management (httpOnly Secure SameSite cookies).
- Rate limiting and anti-brute-force.
- Breach password detection.

**Against software/data integrity failures:**
- Code signing with trusted roots.
- Verify signatures on updates.
- Protect CI/CD pipelines.
- Avoid untrusted deserialization.
- Use Subresource Integrity (SRI) for externally-loaded scripts.

**Against insufficient logging and monitoring:**
- Log authentication, authorization, and input validation failures.
- Log access to sensitive data.
- Integrate with SIEM.
- Alert on suspicious patterns.

**Against SSRF:**
- Validate and sanitize user-supplied URLs.
- Restrict outbound traffic from servers to only necessary destinations.
- Use network segmentation and allowlists.
- Disable URL redirect following.
`,

cissp_devops: `
## 5. DevSecOps integration

### Pipeline security gates
1. **Pre-commit** — IDE integration, linters, local SAST
2. **Commit** — SAST (fast rules), secret scanning, SCA
3. **Build** — container image scanning, SBOM generation, SAST (full), policy-as-code
4. **Test** — DAST, IAST, security unit tests, integration tests
5. **Pre-deploy** — final security gate, compliance checks, approval workflows
6. **Runtime** — RASP, WAF, monitoring, anomaly detection
7. **Post-deploy** — continuous monitoring, vulnerability management, incident response

### Key tools

- **Secret scanning** — GitLeaks, TruffleHog, GitHub Secret Scanning
- **SAST** — SonarQube, Checkmarx, Veracode, Semgrep, GitHub CodeQL, Fortify
- **DAST** — OWASP ZAP, Burp, Invicti, Acunetix
- **SCA** — Snyk, Dependabot, WhiteSource, JFrog Xray, Black Duck
- **Container scanning** — Trivy, Anchore, Aqua, Prisma Cloud
- **IaC scanning** — Checkov, Terrascan, tfsec, KICS
- **Policy as code** — Open Policy Agent, HashiCorp Sentinel
- **SBOM** — Syft, CycloneDX, SPDX tools

### Common pitfalls

- Breaking builds on every low-severity finding (developer fatigue)
- Tools configured but results ignored
- False positives destroying trust
- Security gates added without developer input
- Missing runtime protection despite good build-time scanning

## 8. Software supply chain security

Cross-reference Domain 1 §1.11 SCRM.

### Concerns
- Malicious or vulnerable open-source dependencies (Log4Shell, event-stream, colors.js)
- Compromised build systems (SolarWinds)
- Compromised CI/CD (Codecov)
- Dependency confusion attacks (private package names typosquatted on public registries)
- Typosquatting (packages with near-duplicate names)
- Protestware (authors adding destructive code to their own packages)

### Defenses
- **SBOM** — Software Bill of Materials (SPDX or CycloneDX format).
- **Signed packages** — Sigstore / cosign for container and package signing.
- **Verified builds** — reproducible builds so that build output matches source.
- **Supply chain levels for software artifacts (SLSA)** — framework for supply chain integrity.
- **Dependency lockfiles** — pin versions and hashes.
- **Private registries** — mirror public packages in private registries with vetted versions.
- **Continuous scanning** — SCA tools catch newly-disclosed vulnerabilities in existing dependencies.

### NIST SP 800-218 (SSDF)
Four practice groups:
1. **Prepare the Organization (PO)** — policies, roles, training, tools.
2. **Protect the Software (PS)** — protect source, protect build, protect release.
3. **Produce Well-Secured Software (PW)** — design, implement, review, test.
4. **Respond to Vulnerabilities (RV)** — identify, analyze, remediate, disclose.

Referenced by Executive Order 14028 as the basis for US federal supplier attestations.
`,

};

export function getCISSPLessonContent(topicId: string): string | null {
  return CISSP_LESSON_CONTENT[topicId] || null;
}

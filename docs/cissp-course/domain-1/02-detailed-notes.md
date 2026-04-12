# Domain 1 — Security and Risk Management: Detailed Notes

> **AI-generated study material** aligned to the (ISC)² CISSP Exam Outline
> effective April 15, 2024. Domain weight: **16%** (largest single domain).
> Requires human SME review before publication.
>
> Sub-objective numbering below follows the 2024 outline order; verify
> verbatim wording against the current (ISC)² outline PDF before printing.

---

## 1. Domain Overview

### 1.1 Exam weight and why it matters

Security and Risk Management is **16% of the CISSP exam** — the largest of
the eight domains. On a 150-question form that is roughly 24 questions; on a
175-question form, about 28. But the domain's real influence is much larger
than 16% because Domain 1 concepts (risk, governance, due care, policy) show
up inside questions from *every other* domain. A cryptography question that
asks about "key management policy" is really a Domain 1 question wearing
Domain 3 clothing. A network question about "data flowing across
jurisdictional boundaries" is a Domain 1 question wearing Domain 4 clothing.

Treat Domain 1 as the lens through which every other domain is read.

### 1.2 Key themes

Five recurring themes run through every sub-objective in Domain 1. If you
can name them before a question finishes loading, you are already ahead:

1. **Business-driven security.** Security exists to support business
   objectives, not the reverse. Every "best answer" in Domain 1 is the
   option that is most tightly coupled to business value or stakeholder
   protection.
2. **Top-down governance.** Authority and accountability flow from the
   board → executive management → steering committee → CISO → operational
   staff. The CISSP exam rewards top-down framing and punishes
   bottom-up-only reasoning.
3. **Risk is the currency.** All security decisions are risk decisions.
   When in doubt, the correct first step is almost always *assess the
   risk*, not *install a control*.
4. **Policy before technology.** Policies, standards, procedures, and
   guidelines exist before controls are selected. A question that offers
   "implement the new tool" and "update the policy to reflect the new
   tool" generally wants the policy update first.
5. **Due care and due diligence.** These two phrases are the single most
   common exam trap in Domain 1. Memorize the distinction and keep a
   short example of each in your head.

### 1.3 Manager mindset traps

The single biggest reason technically competent candidates fail CISSP is
that they answer Domain 1 questions as engineers. Watch for these traps:

| Trap | Engineer thinks | Manager thinks |
|---|---|---|
| "The network is on fire" | Block the IPs | Activate the incident response plan and notify leadership per policy |
| "New zero-day" | Patch tonight | Assess risk, consult change management, document the exception |
| "A vendor leaked data" | Rotate credentials | Invoke the contract's notification clause, engage legal, check DPA obligations |
| "Control X will fix this" | Deploy X | Is X justified by risk? Does it fit risk appetite? Who approved it? |
| "Policy says we can't" | Find a workaround | Request a formal exception, documented and time-bound |

The exam rewards the right-hand column every time.

### 1.4 How to read a Domain 1 question

1. Find the **qualifier**: BEST, FIRST, MOST, PRIMARY, MOST LIKELY. These
   words carry the entire question.
2. Find the **actor**: who is being asked to decide? A CISO? An analyst?
   Senior management? The correct action is often role-specific.
3. Find the **business context**: publicly traded? Regulated? Multinational?
   Small shop? The controlling framework changes with context.
4. Eliminate options that are technically right but organizationally wrong
   — those are the signature Domain 1 distractors.

---

## 2. Sub-objectives

The 2024 outline groups Domain 1 content under these sub-objective numbers.
Exact wording may differ slightly; cross-check the current outline PDF.

- **1.1** Understand, adhere to, and promote professional ethics
- **1.2** Understand and apply security concepts (CIA, authenticity,
  non-repudiation, privacy)
- **1.3** Evaluate, apply, and sustain security governance principles
- **1.4** Understand legal, regulatory, and compliance issues pertaining
  to information security in a holistic context
- **1.5** Understand requirements for investigation types (administrative,
  criminal, civil, regulatory, industry standards)
- **1.6** Develop, document, and implement security policy, standards,
  procedures, and guidelines
- **1.7** Identify, analyze, assess, prioritize, and implement Business
  Continuity (BC) requirements
- **1.8** Contribute to and enforce personnel security policies and
  procedures
- **1.9** Understand and apply risk management concepts
- **1.10** Understand and apply threat modeling concepts and methodologies
- **1.11** Apply Supply Chain Risk Management (SCRM) concepts
- **1.12** Establish and maintain a security awareness, education, and
  training program

Below, each sub-objective gets the eight-part treatment specified by
Prompt 1: concept → technical → frameworks → misconceptions → exam nuance
→ case studies → mnemonics → cross-references.

---

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

```
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
```

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

## 9. Sub-objective 1.7 — Business Continuity requirements

### 9.1.a Conceptual explanation

Business Continuity (BC) and Disaster Recovery (DR) are frequently
confused, including by practitioners. CISSP distinguishes them:

- **Business Continuity** is the broad program to keep the business
  operating during and after a disruption. Its scope is business
  processes, not just IT.
- **Disaster Recovery** is a subset of BC focused on **restoring IT
  services** after a disruption.

Both sit under the parent discipline of **resilience**, sometimes
referred to as **operational resilience** in the financial sector.

The heart of BC is the **Business Impact Analysis (BIA)**. A BIA
identifies the organization's critical business processes, quantifies
the impact of their disruption over time, and produces the four
foundational metrics of recovery:

| Metric | Meaning | Example |
|---|---|---|
| **MTD / MTPD** | Maximum Tolerable Downtime / Maximum Tolerable Period of Disruption. The longest the business can survive without the process. | "We can survive 72 hours without payroll; beyond that, critical staff leave." |
| **RTO** | Recovery Time Objective. The target time to restore the process after a disruption. Must be ≤ MTD. | "Payroll must be restored within 24 hours." |
| **RPO** | Recovery Point Objective. The maximum acceptable data loss, measured in time. | "We can lose at most 4 hours of payroll transactions." |
| **WRT** | Work Recovery Time. The time needed to verify data integrity, test, and resume normal operations after technical recovery. | "After the system is restored, 8 more hours to reconcile and re-enable users." |

The arithmetic every CISSP candidate must internalize is:

```
RTO + WRT = MTD   (must hold for each critical process)
```

If RTO is 24 hours and WRT is 8 hours, the MTD must be at least 32
hours, or the design is infeasible.

The BIA feeds into the **Business Continuity Plan (BCP)**, which in
turn contains subordinate **Disaster Recovery Plans (DRPs)**, **Crisis
Management Plans**, **Emergency Response Plans**, and **Continuity of
Operations Plans (COOP)** — the exact taxonomy depends on the
framework (NIST vs ISO vs DRI International).

### 9.1.b Technical / procedural deep-dive: recovery site types

| Site type | Hardware | Data | Recovery time | Cost |
|---|---|---|---|---|
| **Cold site** | Empty facility, power, environmental | None / backups delivered | Days to weeks | Lowest |
| **Warm site** | Hardware installed, not current | Periodic sync or restored from backup | Hours to days | Moderate |
| **Hot site** | Fully equipped, current | Near real-time replication | Minutes to hours | High |
| **Mirror / dual site** | Identical to primary, active-active | Synchronous replication | Near zero | Highest |
| **Mobile site** | Trailer or container with equipment | Brought on demand | Hours to days | Varies |
| **Reciprocal / mutual aid** | Another org's facility, by agreement | Depends | Days | Very low |
| **Cloud DR** | Cloud-provider capacity on demand | Replicated / snapshots | Minutes to hours | Variable, often cost-effective |

Exam nuance: **reciprocal agreements** are rarely recommended in
practice because they depend on the partner having capacity when you
need it (which typically coincides with when they need it), but they
still appear on the exam as a low-cost option.

### 9.1.c Frameworks

- **NIST SP 800-34 Rev 1** — Contingency Planning Guide for Federal
  Information Systems. Canonical US reference; introduces the BIA /
  BCP / DRP / COOP taxonomy used on the exam.
- **ISO 22301** — international standard for Business Continuity
  Management Systems (BCMS). Includes a BIA requirement, RTO/RPO
  definitions, exercise and testing requirements.
- **ISO/IEC 27031** — guidelines for ICT readiness for business
  continuity; bridges ISO 22301 and the 27000 family.
- **DRI International Professional Practices** — vendor-neutral body
  of practice used by BCP professionals; CISSP sometimes references
  its ten professional practices.

### 9.1.d Misconceptions

- "BIA is a technical exercise." No — it is a **business** exercise
  led by business process owners, supported by IT and security.
- "RTO and RPO are the same thing with different units." No. RTO is
  time to restore; RPO is data-loss tolerance. Measured the same
  (hours), but they answer different questions.
- "Hot sites are always better." No — hot sites cost more than many
  processes can justify. The BIA determines the right choice.
- "DRP testing means running a full failover." Not necessarily. The
  CISSP test hierarchy runs from least to most disruptive: **check-
  list review → tabletop → walkthrough → simulation → parallel →
  full interruption**.

### 9.1.e Exam nuance

CISSP wants you to treat BC/DR as **risk-proportional** and
**business-led**. A question that asks "what should the CISO do FIRST
after a disaster?" is almost never "rebuild the servers" — it is
"execute the BCP / activate the incident command structure / ensure
personnel safety". Personnel safety is always first; business-process
continuity is second; technology restoration is third.

Another favorite: a question that asks what is MOST important to
include in the BCP. The answer is typically **the BIA results** (or,
equivalently, the identification and prioritization of critical
processes), because every other part of the plan is derived from it.

Test type ordering is also heavily tested. Memorize the progression:
**checklist → tabletop → walkthrough → simulation → parallel → full
interruption**. Checklist is least disruptive; full interruption is
most disruptive. A question that asks "which test is LEAST
disruptive?" wants "checklist"; "which MOST realistically validates
the plan?" wants "parallel" or "full interruption" (usually parallel,
because full interruption carries its own risk).

### 9.1.f Case studies

1. **Hurricane Katrina (2005).** Entire data centers rendered
   inaccessible for weeks; organizations with only local or regional
   DR found both primary and secondary sites affected. Lesson: DR
   site must be geographically distant enough to avoid the same
   disaster.
2. **AWS us-east-1 outage (multiple — 2017, 2021, 2023).** Taught
   cloud-native organizations that "the cloud" is not automatically
   multi-region. Cloud DR requires explicit regional (and often
   multi-cloud) design.
3. **2017 WannaCry impact on the UK NHS.** Non-IT business continuity
   mattered more than technical DR: surgeries cancelled, patients
   diverted, paper-based workflows activated. A reminder that BCP is
   about the business, not just IT.

### 9.1.g Memory aids

- **"MTD ≥ RTO + WRT"** — write this on your scratch paper at exam
  start. Any BC/DR math question becomes mechanical.
- **"Checklist-Tabletop-Walkthrough-Simulation-Parallel-Full"** —
  "CTWSPF" is unpronounceable, but you can remember "Cats Trample
  Wet Snakes, Parallel Failover" or similar.
- **"Safety, Business, Technology"** — the order of priorities in
  an actual disaster. Personnel first, business second, tech third.

### 9.1.h Cross-references

- **Domain 7** — incident response is a peer discipline; BC/DR runs
  when incident response determines the event is disruptive enough.
- **Domain 2** — data classification informs RPO (higher-value data
  needs shorter RPO).
- **Domain 3** — redundancy and fault-tolerance architecture
  implement the availability side of BC/DR.

---

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

## 11. Sub-objective 1.9 — Risk management concepts

### 11.1.a Conceptual explanation

Risk management is the beating heart of Domain 1. The CISSP exam
treats every security decision as a risk decision, so fluency in
risk vocabulary and the risk workflow is the highest-leverage
investment a candidate can make.

The foundational equation:

```
Risk = Threat × Vulnerability × Impact
```

Some textbooks drop one factor ("Risk = Threat × Vulnerability") or
add **Likelihood** as a separate factor. The exam is tolerant of
variations as long as you understand the intuition: risk requires a
threat with the **capability and intent** to exploit a **vulnerability**
to produce an **impact**.

Core terms the exam demands precision on:

- **Asset** — anything of value to the organization. People, data,
  systems, reputation, processes.
- **Asset value (AV)** — typically the replacement cost or the
  financial impact of its loss. Expressed in currency.
- **Threat** — a potential cause of an unwanted incident (ISO 27000).
  A threat **agent** (or actor) is the entity that initiates it.
- **Vulnerability** — a weakness that could be exploited.
- **Exploit** — the mechanism or technique used to take advantage of
  a vulnerability.
- **Impact** — the consequence of a successful exploitation.
- **Exposure factor (EF)** — the portion of the asset value lost in a
  single incident, expressed as a percentage.
- **Single loss expectancy (SLE)** — the loss from one incident.
  SLE = AV × EF.
- **Annualized rate of occurrence (ARO)** — how often the incident is
  expected to happen per year.
- **Annualized loss expectancy (ALE)** — the expected annual loss.
  ALE = SLE × ARO.
- **Total cost of ownership (TCO)** of a control — the full cost to
  own and operate the control, not just the purchase price.
- **Return on security investment (ROSI)** — (ALE_before − ALE_after
  − control_cost) / control_cost, simplified. A positive value
  justifies the control.
- **Risk appetite** — the amount and type of risk the organization is
  willing to pursue in pursuit of objectives. Set by the board.
- **Risk tolerance** — the acceptable variance around the risk
  appetite. More operational than appetite.
- **Risk capacity** — the maximum risk the organization could absorb
  without failing. A hard ceiling above tolerance.
- **Residual risk** — the risk that remains after controls are
  applied. Must be ≤ risk appetite for management to formally accept.
- **Inherent risk** — the risk before any controls.

### 11.1.b Technical / procedural deep-dive: quantitative risk math

The CISSP exam loves quantitative risk arithmetic because it is
unambiguously testable. Memorize:

```
SLE  = AV × EF                  (single loss expectancy)
ALE  = SLE × ARO                (annualized loss expectancy)
     = AV × EF × ARO

ROSI = (ALE_before − ALE_after − annual_control_cost)
       / annual_control_cost
```

Worked example:

> A laptop fleet has 1,000 devices worth $1,500 each. Historical data
> shows that 2% of laptops are lost or stolen per year, with an EF of
> 100% (total loss of the asset to the organization). A full-disk
> encryption solution costs $50 per laptop per year to license and
> operate, and reduces the EF to 10% (because the device hardware is
> still lost but the data is not).

Calculations:

```
AV (per laptop)    = $1,500
EF (before)        = 100% = 1.0
ARO (per laptop)   = 2% = 0.02
SLE (before)       = 1,500 × 1.0 = $1,500
ALE (before)       = 1,500 × 0.02 = $30 per laptop per year
Fleet ALE (before) = $30 × 1,000 = $30,000 per year

EF (after)         = 10% = 0.1
SLE (after)        = 1,500 × 0.1 = $150
ALE (after)        = 150 × 0.02 = $3 per laptop per year
Fleet ALE (after)  = $3 × 1,000 = $3,000 per year

Control cost       = $50 × 1,000 = $50,000 per year
ROSI               = ($30,000 − $3,000 − $50,000) / $50,000
                   = −$23,000 / $50,000
                   = −0.46 → negative, control is not justified
                     on pure financial grounds
```

The exam will present ROSI-like questions and expect you to recognize
when a control is financially unjustified — **and** to recognize when
qualitative factors (regulatory requirement, reputational impact,
ethical obligation) override pure financial ROSI.

Qualitative risk assessment uses subjective scales rather than
monetary math: Low/Medium/High or 1–5 rating matrices for likelihood
and impact, with risk score computed as the product or lookup in a
matrix. Qualitative is faster and cheaper; quantitative is more
defensible to a CFO but harder to produce credible inputs for.

### 11.1.c Frameworks

- **NIST SP 800-30 Rev 1** — Guide for Conducting Risk Assessments.
  Canonical US reference. Uses a semi-quantitative approach and
  explicit threat-source catalogs.
- **NIST SP 800-37 Rev 2 — Risk Management Framework (RMF)** — the
  seven-step process for federal systems: Prepare → Categorize →
  Select → Implement → Assess → Authorize → Monitor.
- **NIST SP 800-39** — Managing Information Security Risk across
  three tiers: organization, mission/business process, information
  system.
- **ISO/IEC 27005** — information security risk management aligned
  with ISO 27001's ISMS approach.
- **ISO 31000** — enterprise risk management framework; parent to
  27005.
- **FAIR (Factor Analysis of Information Risk)** — a quantitative
  risk analysis methodology gaining adoption; breaks risk into loss
  event frequency and loss magnitude factors.
- **OCTAVE / OCTAVE Allegro** — asset-driven, workshop-based risk
  methodology from CERT/Carnegie Mellon.
- **COSO ERM** — enterprise risk management framework more common
  in finance and audit than in IT.

### 11.1.d Risk treatment options

The exam distinguishes four (sometimes five) **risk treatment**
options:

1. **Avoid (eliminate)** — discontinue the activity that creates the
   risk. Example: stop offering a product feature that exposes PII
   beyond appetite.
2. **Mitigate (reduce)** — apply controls to reduce likelihood or
   impact. Most common treatment.
3. **Transfer (share)** — shift risk to a third party, usually via
   insurance, contract, or outsourcing. Note: you can never transfer
   **accountability**, only financial consequences.
4. **Accept** — acknowledge the risk and take no further action.
   Requires formal sign-off by an authority with the risk appetite
   to do so. Must be documented.
5. **(Sometimes)** **Reject / ignore** — listed only to be called
   out as NOT a valid treatment. Ignoring risk without acknowledgment
   is a governance failure.

The CISSP ordering is: **mitigate down to the risk appetite → transfer
residual → accept what remains**. Avoidance is reserved for risks
above the capacity ceiling.

### 11.1.e Control categories and types

The exam tests two orthogonal classifications of controls:

**By category (who/what implements)**:
- **Administrative / managerial** — policies, procedures, training,
  background checks.
- **Technical / logical** — firewalls, encryption, IAM, IDS/IPS.
- **Physical** — locks, guards, fences, bollards, mantraps.

**By function (when/how it acts)**:
- **Preventive** — stop an event. Locks, encryption, firewalls.
- **Detective** — identify an event. IDS, logs, CCTV, audits.
- **Corrective** — recover from an event. Backups, patches, incident
  response.
- **Deterrent** — discourage an event. Warning signs, audit visibility.
- **Recovery** — restore operations after an event. DR plans,
  backups, recovery sites.
- **Compensating** — alternative when the primary control cannot be
  used. Example: manual review when automated deny-list is offline.
- **Directive** — guide behavior. Policies, signs, training.

Exam favorite: "which control type is a CCTV camera?" — it is
**both deterrent** (visible cameras discourage action) **and
detective** (recordings reveal events after the fact). The best
answer depends on the scenario's emphasis.

### 11.1.f Misconceptions

- "Risk can be eliminated." Only in the trivial sense of avoiding the
  activity entirely. All residual risk is nonzero.
- "Transfer means the risk is gone." Transfer shifts financial
  consequences. Accountability, reputational damage, and regulatory
  obligations typically stay with the original owner.
- "Quantitative is always better than qualitative." Quantitative is
  more defensible when inputs are credible. For novel or data-sparse
  risks, qualitative may be more honest.
- "The CISO accepts risks." Only within delegated authority. Risks
  above the CISO's delegation must be accepted by higher management
  or the board.

### 11.1.g Exam nuance

CISSP wants risk decisions to follow a **formal, documented** process
that ties back to business objectives. A scenario that offers "the
team decides informally" vs "the risk is formally accepted by the
system owner with documentation" always wants the documented option.

When a question asks what to do FIRST after identifying a risk, the
answer is usually **assess** (quantitatively or qualitatively) — not
mitigate, transfer, or accept. You cannot choose a treatment until
you have assessed.

When a question involves **who** owns a risk, the answer is typically
the **business process owner** or **data owner**, not the CISO. The
CISO facilitates; the business owns.

### 11.1.h Case studies

1. **Equifax (2017).** Risk identification (an Apache Struts CVE)
   was timely; risk treatment (patch) was not. The failure was in
   execution, not recognition. Governance lesson: risk tracking
   without treatment enforcement is security theater.
2. **Capital One (2019).** Risk acceptance decisions around a WAF
   configuration left an SSRF path to an over-privileged IAM role.
   The risk was arguably knowable; the treatment was inadequate.
3. **Maersk / NotPetya (2017).** A $300M+ event from a tax-software
   supply-chain compromise. Highlighted that some risks are both
   catastrophic and under-assessed because organizations did not
   model "all Windows servers destroyed simultaneously" as a
   plausible scenario. Post-incident, Maersk explicitly rebuilt its
   risk model.

### 11.1.i Memory aids

- **"AVEFARO-ALE"** — Asset Value, Exposure Factor, Annualized Rate
  of Occurrence, Annualized Loss Expectancy. Say it fast before
  every risk-math question.
- **"Avoid, Mitigate, Transfer, Accept"** — the four treatments.
  Mnemonic: "A Man Takes Action".
- **"PCDD"** or **"P-D-C-D-D-R-C-D"** — the control types.
  Preventive, Detective, Corrective, Deterrent, Directive, Recovery,
  Compensating. Memorize; the exam will test every one.

### 11.1.j Cross-references

- **Domain 1 §1.3** — governance sets the risk appetite that risk
  management enforces.
- **Domain 1 §1.11** — SCRM is risk management applied to suppliers.
- **Domain 6** — assessments generate the data risk management
  consumes.
- **Domain 7** — incident response executes the "prepare and
  respond" side of risk management.

---

## 12. Sub-objective 1.10 — Threat modeling

### 12.1.a Conceptual explanation

Threat modeling is the structured, systematic process of **identifying
what can go wrong** with a system, **how** it can go wrong, **who**
might cause it, and **what** you will do about it. It is performed
ideally during design (cheapest) and revisited as the system evolves.

Four questions structure most threat modeling methodologies (Shostack's
four-question framework, echoed in the OWASP Threat Modeling Manifesto):

1. **What are we building?** Architecture, data flows, trust
   boundaries.
2. **What can go wrong?** Threats against each asset and flow.
3. **What are we going to do about it?** Mitigations and prioritization.
4. **Did we do a good job?** Validation and iteration.

The exam tests recognition of the major methodologies:

- **STRIDE** (Microsoft) — a **threat taxonomy**:
  **S**poofing, **T**ampering, **R**epudiation, **I**nformation
  disclosure, **D**enial of service, **E**levation of privilege.
  Each letter corresponds to a CIA/AAA property being violated.
- **DREAD** (Microsoft, deprecated but still tested) — a **scoring
  model** for prioritization: **D**amage, **R**eproducibility,
  **E**xploitability, **A**ffected users, **D**iscoverability. Scored
  1–10, averaged. Criticized as subjective; Microsoft officially
  moved away from it but CISSP still references it.
- **PASTA (Process for Attack Simulation and Threat Analysis)** — a
  seven-stage, risk-centric, business-aligned methodology. Stages
  include defining objectives, technical scope, decomposition,
  threat analysis, vulnerability analysis, attack modeling, risk and
  impact.
- **VAST (Visual, Agile, Simple Threat)** — scalable, agile-friendly
  methodology that distinguishes application threat models from
  operational threat models.
- **Trike** — open source, automation-focused.
- **LINDDUN** — privacy-focused counterpart to STRIDE: Linkability,
  Identifiability, Non-repudiation, Detectability, Disclosure,
  Unawareness, Non-compliance.
- **Attack trees** — Schneier's hierarchical decomposition of attacker
  goals into sub-goals and leaf attacks, with costs and probabilities
  optionally attached.
- **Kill chain models** — Lockheed Martin Cyber Kill Chain® (7 stages)
  and the MITRE ATT&CK framework (tactics and techniques). ATT&CK is
  operational rather than design-time but is increasingly used in
  threat modeling.

### 12.1.b Technical deep-dive: STRIDE per asset vs per element

Microsoft's SDL team uses STRIDE in two modes. **STRIDE-per-element**
walks each element of a data flow diagram (DFD) and asks which STRIDE
threats apply (a process is vulnerable to all six; a data store is
vulnerable to T, I, R, D). **STRIDE-per-interaction** walks each flow
and asks which threats apply to the source, the destination, and the
channel.

Mapping STRIDE to security properties:

| STRIDE letter | Violates |
|---|---|
| Spoofing | Authentication |
| Tampering | Integrity |
| Repudiation | Non-repudiation |
| Information disclosure | Confidentiality |
| Denial of service | Availability |
| Elevation of privilege | Authorization |

The exam rewards recognition of the inverse mapping: if a question
says "the attacker impersonated a legitimate user", the STRIDE category
is Spoofing and the violated property is Authentication.

### 12.1.c Frameworks

- **Microsoft Security Development Lifecycle (SDL)** — home of STRIDE.
- **OWASP Threat Modeling Manifesto** — vendor-neutral principles and
  values; the "four questions" framework.
- **NIST SP 800-154 (Draft) — Guide to Data-Centric System Threat
  Modeling.**
- **MITRE ATT&CK** — operational adversary behavior matrix; cross-
  references into threat models in recent textbooks.
- **CAPEC (Common Attack Pattern Enumerations and Classifications)**
  — MITRE-maintained catalog of attack patterns.

### 12.1.d Misconceptions

- "Threat modeling is only for new systems." No — it is valuable on
  legacy systems too, especially around changes. Agile threat
  modeling is lightweight and repeatable.
- "STRIDE tells you the risk." No — STRIDE is a taxonomy of threats;
  it does not rank them. DREAD or PASTA handles ranking.
- "Threat modeling is a pentest." No — threat modeling is a design-
  time or analysis-time activity; pentesting is an adversarial
  empirical check. They complement each other.

### 12.1.e Exam nuance

CISSP wants you to use threat modeling as a **design-time control**
that anticipates threats **before** deployment. A question that
offers "run a pentest" vs "perform a threat model" for a system
being designed wants the threat model. For a system already in
production, pentesting or assessment may be the BEST answer.

When asked which methodology is BEST for a given scenario: STRIDE
for systematic categorization of technical threats, PASTA for
business-aligned risk assessment that links threats to business
impact, LINDDUN for privacy, attack trees for adversary-goal
decomposition.

### 12.1.f Case studies

1. **Microsoft SDL adoption (2004→)** — the original corporate proof
   that threat modeling at scale measurably reduces vulnerabilities
   reaching customers.
2. **Apple iMessage end-to-end encryption design.** Public
   post-mortems (e.g., JHU 2016 paper) revealed padding-oracle-like
   weaknesses that a formal threat model would have surfaced; the
   case is frequently cited for "design-time modeling matters".
3. **Tesla Model S CAN bus research (2020).** Demonstrated how attack
   trees can map the path from a compromised infotainment system to
   the drivetrain. Each node in the tree represents a control failure.

### 12.1.g Memory aids

- **STRIDE**: "Spoofing, Tampering, Repudiation, Info disclosure,
  DoS, Elevation".
- **DREAD**: "Damage, Reproducibility, Exploitability, Affected,
  Discoverability".
- **Four questions**: "What? What wrong? What do? Did well?"

### 12.1.h Cross-references

- **Domain 3** — secure design principles are implemented in response
  to threat model output.
- **Domain 8** — SDL / DevSecOps integrates threat modeling into the
  SDLC.
- **Domain 6** — assessments validate that modeled threats are
  mitigated.

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

## 15. Domain 1 Summary Cheat Sheet

> Print and keep next to your scratch paper. Most of these can be
> reconstructed in under 2 minutes at exam start.

### The core equations

```
Risk = Threat × Vulnerability × Impact
SLE  = AV × EF
ALE  = SLE × ARO = AV × EF × ARO
ROSI = (ALE_before − ALE_after − annual_control_cost) / annual_control_cost
MTD  ≥ RTO + WRT
```

### The (ISC)² Code of Ethics canons (priority order)

1. Society
2. Honestly/legally (self-conduct)
3. Service to principals
4. Advance the profession

**Canon I > Canon II > Canon III > Canon IV** always.

### CIA + Hexad + friends

**CIA**: Confidentiality, Integrity, Availability.
**Parkerian Hexad**: + Authenticity, Utility, Possession.
**Authenticity ≠ Non-repudiation** (only signatures with bound private
keys provide non-repudiation).

### Governance vs management

**Governance** (board): Evaluate, Direct, Monitor. Strategy, risk
appetite, policy approval, oversight.
**Management** (CISO): Plan, Build, Run, Assess. Execution of
governance decisions.

### Policy hierarchy

Policy → Standard → Procedure → Guideline (guideline is the only
non-mandatory one). Baselines are a special case of standards.

### Four risk treatments

**A-M-T-A**: Avoid, Mitigate, Transfer, Accept. Mitigate first,
transfer second, accept third. Avoidance for risks above capacity.

### Control categories

By implementer: Administrative, Technical, Physical.
By function: **Preventive, Detective, Corrective, Deterrent,
Directive, Recovery, Compensating**.

### BC/DR metrics

| Term | Definition |
|---|---|
| MTD | Max Tolerable Downtime (business survival limit) |
| RTO | Target to restore service |
| RPO | Tolerable data loss (in time) |
| WRT | Work Recovery Time (validate + resume) |

**RTO + WRT ≤ MTD.**

### BCP test order (least → most disruptive)

Checklist → Tabletop → Walkthrough → Simulation → Parallel → Full
interruption.

### Investigation types and burden of proof

| Type | Burden | Complainant |
|---|---|---|
| Administrative | Policy | Internal |
| Criminal | Beyond a reasonable doubt | State/prosecutor |
| Civil | Preponderance of the evidence | Plaintiff |
| Regulatory | Varies (usually preponderance) | Regulator |
| Industry | Contractual | Industry body |

### The five evidence rules

Authentic, Accurate, Complete, Convincing, Admissible.

### Order of volatility (RFC 3227)

CPU/registers → memory → process state → disk → archival.

### Due care vs due diligence

- **Due care**: doing what a reasonable organization would do.
- **Due diligence**: verifying that the right things are being done
  (by you and third parties).

Memory hook: **care = do**, **diligence = verify**.

### STRIDE

Spoofing (Authn), Tampering (Integrity), Repudiation (Non-repudiation),
Information disclosure (Confidentiality), Denial of service
(Availability), Elevation of privilege (Authorization).

### SCRM pillars

Visibility (SBOM) → Tiering → Assurance (attestation) → Flow-down
(contractual) → Monitoring → Exit planning.

### Awareness vs training vs education

Everyone / Some / Few. Broad / Role-specific / Specialized.

### Manager mindset cheats

- When in doubt, assess risk first.
- Policy before technology.
- Escalate to governance for strategic decisions.
- Personnel safety > business continuity > technology recovery.
- Document everything, especially risk acceptance.

---

## 16. Glossary (30+ terms)

| Term | Definition |
|---|---|
| **ALE (Annualized Loss Expectancy)** | Expected annual financial loss from a risk; ALE = SLE × ARO. |
| **ARO (Annualized Rate of Occurrence)** | Expected frequency of a loss event per year. |
| **Asset** | Anything of value to the organization. |
| **Authenticity** | Property that data originates from its claimed source. |
| **Availability** | Property that authorized users can access resources when needed. |
| **Baseline** | Minimum security configuration a system must meet. |
| **BCP (Business Continuity Plan)** | Overall plan to sustain business operations during disruption. |
| **BIA (Business Impact Analysis)** | Analysis identifying critical processes and quantifying disruption impact. |
| **Chain of custody** | Documented record of every person who handled a piece of evidence. |
| **Confidentiality** | Property preventing unauthorized disclosure. |
| **COSO ERM** | Enterprise Risk Management framework from the Committee of Sponsoring Organizations. |
| **COBIT** | ISACA's governance and management of enterprise IT framework. |
| **Control (administrative / technical / physical)** | Safeguard implemented to reduce risk, classified by who/what implements it. |
| **Control (preventive / detective / corrective / deterrent / recovery / compensating / directive)** | Safeguard classified by its function in the timeline of an event. |
| **CIA triad** | Confidentiality, Integrity, Availability. |
| **CPRA** | California Privacy Rights Act; extends and amends CCPA. |
| **DPO (Data Protection Officer)** | GDPR-defined role with responsibility for data protection compliance. |
| **DRP (Disaster Recovery Plan)** | Subset of BCP covering IT service restoration. |
| **Due care** | Conduct a reasonable person would exercise under similar circumstances. |
| **Due diligence** | Investigation and verification activities that inform due care. |
| **EF (Exposure Factor)** | Percentage of asset value lost in a single incident. |
| **Evidence (five rules of)** | Authentic, Accurate, Complete, Convincing, Admissible. |
| **FAIR** | Factor Analysis of Information Risk; quantitative risk methodology. |
| **FIPS 199** | US federal standard for categorizing information systems by CIA impact levels. |
| **GDPR** | EU General Data Protection Regulation, effective May 2018. |
| **Governance (vs management)** | Board-level function of evaluating, directing, monitoring the organization. |
| **Hexad, Parkerian** | Six-attribute model: CIA + Authenticity, Utility, Possession. |
| **HIPAA** | US Health Insurance Portability and Accountability Act. |
| **Inherent risk** | Risk before any controls are applied. |
| **Integrity** | Property preventing unauthorized modification. |
| **ISMS** | Information Security Management System, the construct ISO 27001 certifies. |
| **ISO/IEC 27001** | International standard for information security management systems. |
| **Least privilege** | Principle that subjects have only the access strictly necessary. |
| **LINDDUN** | Privacy-focused threat modeling methodology. |
| **MTD (Maximum Tolerable Downtime)** | Longest a process can be unavailable before business failure. |
| **Need to know** | Access principle limiting disclosure to task-necessary information. |
| **NIST CSF** | Cybersecurity Framework, now version 2.0 (Feb 2024), with six functions including Govern. |
| **NIST RMF** | Risk Management Framework from NIST SP 800-37. |
| **Non-repudiation** | Inability of an actor to deny having originated a message. |
| **OECD Guidelines** | International privacy and security principles from the Organization for Economic Co-operation and Development. |
| **PASTA** | Process for Attack Simulation and Threat Analysis; seven-stage threat modeling. |
| **PCI-DSS** | Payment Card Industry Data Security Standard (contractual). |
| **Privacy** | Individual's control over their own personal data. |
| **Procedure** | Step-by-step mandatory instructions implementing standards. |
| **Residual risk** | Risk remaining after controls are applied. |
| **Risk appetite** | Amount of risk an organization is willing to pursue. |
| **Risk capacity** | Maximum risk an organization could absorb without failing. |
| **Risk tolerance** | Acceptable variance around the risk appetite. |
| **ROSI** | Return on Security Investment. |
| **RPO (Recovery Point Objective)** | Maximum acceptable data loss, measured in time. |
| **RTO (Recovery Time Objective)** | Target time to restore a service after disruption. |
| **SBOM (Software Bill of Materials)** | Inventory of software components. |
| **SCRM** | Supply Chain Risk Management. |
| **Separation of duties** | Principle that high-risk transactions require multiple actors. |
| **SLE (Single Loss Expectancy)** | Loss from one incident; SLE = AV × EF. |
| **Standard** | Mandatory, specific requirement operationalizing policy. |
| **STRIDE** | Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation. |
| **Threat** | Potential cause of an unwanted incident. |
| **Threat agent / actor** | Entity that initiates a threat. |
| **Transfer (risk)** | Treatment that shifts financial consequence to a third party. |
| **Vulnerability** | Weakness that could be exploited. |
| **WRT (Work Recovery Time)** | Time to validate data and resume operations after technical recovery. |

---

## 17. Further Reading (official sources only)

The following are authoritative references for Domain 1. Preference
given to primary standards and government publications over
commercial books.

### (ISC)² sources

- **CISSP Exam Outline** (current; updated April 15, 2024). Download
  from (ISC)²'s official site for verbatim sub-objective wording.
- **(ISC)² Code of Ethics**. Authoritative canons and complaint
  procedures.
- **Official (ISC)² CISSP Study Guide** and **Official (ISC)² CISSP
  Practice Tests**. Use for alignment; do not treat as the only
  source.

### NIST Special Publications (free, authoritative)

- **NIST SP 800-12** — An Introduction to Information Security.
- **NIST SP 800-30 Rev 1** — Guide for Conducting Risk Assessments.
- **NIST SP 800-34 Rev 1** — Contingency Planning Guide for Federal
  Information Systems.
- **NIST SP 800-37 Rev 2** — Risk Management Framework.
- **NIST SP 800-39** — Managing Information Security Risk.
- **NIST SP 800-50** — Building an Information Technology Security
  Awareness and Training Program.
- **NIST SP 800-53 Rev 5** — Security and Privacy Controls.
- **NIST SP 800-86** — Guide to Integrating Forensic Techniques into
  Incident Response.
- **NIST SP 800-154 (Draft)** — Guide to Data-Centric System Threat
  Modeling.
- **NIST SP 800-161 Rev 1** — Cybersecurity Supply Chain Risk
  Management.
- **NIST SP 800-218** — Secure Software Development Framework.
- **NIST CSF 2.0** — Cybersecurity Framework, Feb 2024.
- **FIPS 199** — Standards for Security Categorization.
- **FIPS 200** — Minimum Security Requirements.

### ISO/IEC

- **ISO/IEC 27000** — Overview and vocabulary.
- **ISO/IEC 27001** — Information Security Management Systems (2022
  revision).
- **ISO/IEC 27002** — Information security controls (2022 revision).
- **ISO/IEC 27005** — Information security risk management.
- **ISO/IEC 27031** — ICT readiness for business continuity.
- **ISO/IEC 27036** — Supplier relationships.
- **ISO/IEC 27037** — Digital evidence.
- **ISO/IEC 38500** — Governance of IT.
- **ISO 22301** — Business Continuity Management Systems.
- **ISO 31000** — Risk Management.

### Other authoritative references

- **ISACA COBIT 2019** — governance and management objectives.
- **RFC 3227** — Guidelines for Evidence Collection and Archiving.
- **RFC 1087** — Ethics and the Internet (historical).
- **EU GDPR** (Regulation 2016/679) — the regulation text and EDPB
  guidelines.
- **California Consumer Privacy Act / California Privacy Rights Act**.
- **US HIPAA Privacy, Security, and Breach Notification Rules** (45
  CFR Parts 160 and 164).
- **Executive Order 14028** (Improving the Nation's Cybersecurity,
  May 2021).
- **PCI-DSS v4.0** (PCI Security Standards Council, effective April
  2024).
- **Sarbanes-Oxley Act of 2002** (full statutory text, especially
  §§302, 404).
- **Computer Fraud and Abuse Act** (18 U.S.C. §1030) and state
  analogs.
- **Council of Europe Convention on Cybercrime (Budapest Convention)**.

### Breach case references (for "breach of the week")

- **Verizon Data Breach Investigations Report (DBIR)** — annual,
  free, data-rich source of case studies.
- **MITRE ATT&CK Groups** — attributions and observed techniques for
  major incidents.
- **CISA Advisories and ICS-CERT bulletins** — authoritative incident
  disclosures.

---

## End of Domain 1 Detailed Notes

This document is paired with:

- `01-lesson-plan.md` — course sequencing and learning objectives
- `03-storyboards.md` — animation storyboards (next)
- `04-qbank.json` — 50 practice questions with rationales (next)
- `../ASSESSMENT-ENGINE.md` — course-wide adaptive engine spec (next)

Total sub-objective coverage: 12 (1.1–1.12). Total treatment: concept,
technical, frameworks, misconceptions, exam nuance, case studies,
mnemonics, cross-references. Total glossary entries: 60+. Total
further-reading entries: 40+.

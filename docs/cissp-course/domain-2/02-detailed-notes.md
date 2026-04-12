# Domain 2 — Asset Security: Detailed Notes

> **AI-generated study material** aligned to the (ISC)² CISSP Exam Outline
> effective April 15, 2024. Domain weight: **10%**. Requires human SME
> review before publication.

---

## 1. Domain Overview

### 1.1 Exam weight and themes

Asset Security is 10% of the CISSP exam — about 15 questions on a 150-
question form. The domain is smaller than Domain 1 but disproportionately
important because its concepts intersect every technical domain. A question
in Domain 4 about "protecting data in transit" is a Domain 2 question
about data states. A question in Domain 5 about "granting access to a
dataset" is a Domain 2 question about ownership and classification. A
question in Domain 7 about "retiring a server" is a Domain 2 question
about media sanitization.

Key themes across Domain 2:

1. **Roles before controls.** The exam rewards answers that name the
   right role (data owner, data custodian, data controller, data
   processor, data steward, data subject) before naming a control.
2. **Classification drives controls.** The CISSP answer to "what control
   should we apply?" is almost always "it depends on the classification."
3. **Lifecycle, not point-in-time.** Data has a lifecycle, and security
   obligations extend from creation through destruction. A control that
   works at rest may not work in use; a control that works in use may
   fail at destruction.
4. **State-specific protection.** Data at rest, in transit, and in use
   each has its own control set and its own blind spots.
5. **Privacy is a peer to security.** Domain 2 treats privacy obligations
   (GDPR, CCPA, HIPAA, LGPD, PIPEDA) as first-class constraints on asset
   handling, not as a Domain 1 afterthought.

### 1.2 Manager mindset traps

| Trap | Engineer thinks | Manager thinks |
|---|---|---|
| "Who should decide?" | Security team | Data owner (business role) decides; custodian implements |
| "Classification is labeling" | Apply tags in the ECM | Classification is a business decision with legal consequences |
| "Sanitization = delete" | `rm -rf`, DROP TABLE | Clear, Purge, or Destroy per NIST 800-88 depending on media and classification |
| "Retention = how long to keep" | Pick the longest number | Retention conflicts require resolution: longest when under hold, shortest when under minimization |
| "PII vs PHI vs PCI" | All are "sensitive data" | Each has its own legal framework, controls, and notification obligations |

---

## 2. Sub-objectives

The 2024 outline groups Domain 2 content as follows (verify verbatim
against current outline):

- **2.1** Identify and classify information and assets
- **2.2** Establish information and asset handling requirements
- **2.3** Provision information and assets securely
- **2.4** Manage data lifecycle
- **2.5** Ensure appropriate asset retention
- **2.6** Determine data security controls and compliance requirements

Below: the eight-part treatment for each.

---

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
  location, source, or role (e.g., "all data in the `patients`
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

## 9. Domain 2 Summary Cheat Sheet

### Roles (memorize)

- **Data owner**: business role, accountable for classification,
  retention, access decisions.
- **Data custodian**: technical role, operates the controls the owner
  specifies.
- **Data steward**: day-to-day data quality and use.
- **Data subject**: the individual the data is about.
- **Data controller** (GDPR): decides why and how data is processed.
- **Data processor** (GDPR): processes data on behalf of a controller.
- **Business** (CCPA): for-profit handling California PI at scale.
- **Service provider** (CCPA): contracted to process business's data.
- **Covered entity** (HIPAA): healthcare provider, plan, or
  clearinghouse.
- **Business associate** (HIPAA): third party handling PHI for a
  covered entity.

### Classification

Commercial: Public → Internal → Confidential → Restricted
Government: Unclassified → Confidential → Secret → Top Secret
**High-water mark**: collections inherit the highest element's level.

### Data states

At rest, in transit, in use. Each needs state-specific controls.
Encryption does not protect data in use.

### NIST SP 800-88 sanitization

- **Clear**: overwrite so data cannot be recovered by standard
  utilities.
- **Purge**: remove data such that specialized lab techniques cannot
  recover it.
- **Destroy**: physical destruction of the media.

SSD crypto-erase counts as Purge when properly implemented.

### Retention rules

- Legal holds always win.
- Longest applicable obligation governs the minimum.
- Shortest data-minimization obligation governs the maximum.

### Privacy triads

- GDPR: Subject / Controller / Processor
- CCPA: Consumer / Business / Service provider
- HIPAA: Individual / Covered entity / Business associate

### DLP modes

At rest (discovery) / in transit (network) / in use (endpoint) / SaaS
(CASB).

### Anonymization vs pseudonymization

- Anonymized: irreversible; no longer personal data under GDPR.
- Pseudonymized: reversible with a key; still personal data under
  GDPR.

---

## 10. Glossary (30+ terms)

| Term | Definition |
|---|---|
| **Anonymization** | Irreversible removal of identifying information from a dataset. |
| **Asset** | Anything of value requiring protection. |
| **Asset inventory** | Authoritative list of assets under management. |
| **At rest** | Data state in storage media. |
| **BAA (Business Associate Agreement)** | HIPAA contract binding a BA to the covered entity's safeguards. |
| **Baseline configuration** | Known, hardened starting state for an asset. |
| **Business Associate (HIPAA)** | Third party handling PHI on behalf of a covered entity. |
| **Classification** | Label assigned to an asset based on its sensitivity. |
| **Clear (NIST 800-88)** | Sanitization via overwrite; resists standard recovery tools. |
| **Confidential Computing** | Hardware-enclave technologies that protect data in use. |
| **Covered Entity (HIPAA)** | Provider, plan, or clearinghouse handling PHI. |
| **Custodian** | Technical role implementing controls on behalf of the owner. |
| **Data controller (GDPR)** | Entity that determines purposes and means of processing. |
| **Data owner** | Business role accountable for classification and access decisions. |
| **Data processor (GDPR)** | Entity processing data on behalf of a controller. |
| **Data steward** | Operational role for data quality and use. |
| **Data subject (GDPR)** | The individual the personal data is about. |
| **Destruction (NIST 800-88)** | Physical destruction of media. |
| **DLP (Data Loss Prevention)** | Controls that identify and block unauthorized data movement. |
| **DPA (Data Processing Agreement)** | Contract between GDPR controller and processor. |
| **DPO (Data Protection Officer)** | GDPR-defined role responsible for data protection compliance. |
| **DRM / IRM** | Controls that travel with data and enforce usage restrictions. |
| **In transit** | Data state while crossing a network. |
| **In use** | Data state while being processed by an application. |
| **High-water mark** | Principle that a collection inherits the highest element's classification. |
| **Homomorphic encryption** | Encryption allowing computation on ciphertext. |
| **Legal hold** | Suspension of normal retention while litigation is anticipated. |
| **NIST SP 800-88 Rev 1** | Guidelines for Media Sanitization. |
| **PHI** | Protected Health Information (HIPAA). |
| **PII** | Personally Identifiable Information. |
| **Pseudonymization** | Replacing direct identifiers with reversible codes. |
| **Purge (NIST 800-88)** | Sanitization resistant to specialized recovery. |
| **Restricted** | Commercial classification level for highest-sensitivity data. |
| **Retention schedule** | Policy specifying how long data of each category is kept. |
| **Sensitive PII** | Subset of PII whose exposure creates elevated harm. |
| **Service provider (CCPA)** | Processor-equivalent role under California law. |
| **Tokenization** | Replacing sensitive data with non-sensitive tokens. |

---

## 11. Further Reading

### NIST

- NIST SP 800-60 Vol 1 & 2 — Guide for Mapping Types of Information
  and Information Systems to Security Categories
- NIST SP 800-88 Rev 1 — Guidelines for Media Sanitization
- NIST SP 800-122 — Guide to Protecting the Confidentiality of PII
- NIST SP 800-171 / 800-172 — CUI protection
- NIST Privacy Framework
- FIPS 199 — Standards for Security Categorization

### ISO/IEC

- ISO/IEC 27001 / 27002:2022
- ISO/IEC 27018 — PII in public clouds
- ISO/IEC 27701 — Privacy information management system
- ISO/IEC 27040 — Storage security
- ISO/IEC 29100 — Privacy framework
- ISO 15489-1 — Records management

### Regulation / statute

- GDPR (EU Regulation 2016/679)
- CCPA / CPRA (California Civil Code §1798.100 et seq.)
- HIPAA Privacy, Security, and Breach Notification Rules (45 CFR
  Parts 160, 164)
- PIPEDA (Canada)
- LGPD (Brazil)

### Breach case references

- Verizon DBIR (annual)
- The Sedona Principles (e-discovery / legal holds)

---

## End of Domain 2 Detailed Notes

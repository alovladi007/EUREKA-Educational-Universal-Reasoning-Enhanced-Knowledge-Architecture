/**
 * CISSP lesson content keyed by topic ID from exam-curriculum.ts.
 * Each entry is markdown-formatted lesson body text.
 *
 * AI-generated study material aligned to the (ISC)² CISSP Exam Outline
 * effective April 15, 2024. Requires human SME review before publication.
 */

export const CISSP_LESSON_CONTENT: Record<string, string> = {

// ══════════════════════════════════════════════════════════════════
// DOMAIN 1 — Security & Risk Management (16%)
// ══════════════════════════════════════════════════════════════════

cissp_governance: `
## Security Governance

Security governance is the set of responsibilities and practices exercised by the board and executive management to provide strategic direction, ensure that objectives are achieved, ascertain that risks are managed appropriately, and verify that the enterprise's resources are used responsibly. It is a **board-level function**.

### Governance vs Management

**Governance** evaluates, directs, and monitors — it is owned by the board and steering committees. **Management** plans, builds, runs, and assesses — it is owned by the CISO and operations. COBIT 2019 names this split explicitly: governance objectives use the prefix **EDM** (Evaluate, Direct, Monitor); management objectives use **APO, BAI, DSS, MEA**.

### The Top-Down Model

\`\`\`
Board of Directors → Strategy, risk appetite, policy approval
    ↓
Executive Management (CEO, CFO, COO, CIO) → Translate strategy into programs
    ↓
Security Steering Committee → Prioritize, deconflict, approve exceptions
    ↓
CISO / Information Security Office → Design, operate, monitor controls
    ↓
Operational Staff
\`\`\`

### Due Care vs Due Diligence

- **Due care**: the conduct a reasonably prudent person would exercise — *doing the right things*.
- **Due diligence**: the investigation and verification that informs due care — *confirming the right things are being done*.

Memory hook: **Care = Do. Diligence = Verify.**

### Policy Hierarchy

1. **Policy** — high-level, mandatory, technology-independent. Changed rarely. Approved by senior management.
2. **Standard** — mandatory, specific requirements (e.g., "AES-256 required"). Changed when technology changes.
3. **Procedure** — step-by-step mandatory instructions. Changed frequently.
4. **Guideline** — recommended, discretionary. The only non-mandatory document.

### (ISC)² Code of Ethics

Four canons in **priority order**:
1. Protect society, the common good, necessary public trust and confidence, and the infrastructure
2. Act honorably, honestly, justly, responsibly, and legally
3. Provide diligent and competent service to principals
4. Advance and protect the profession

**Canon I always wins.** When the public good conflicts with the employer's interest, the public wins.

### Key Frameworks

| Framework | Focus |
|---|---|
| **COBIT 2019** | Governance vs management split (EDM vs APO/BAI/DSS/MEA) |
| **ISO/IEC 27001** | ISMS management system, requires top-management commitment |
| **NIST CSF 2.0** | Six functions including new Govern function (Feb 2024) |
| **ISO/IEC 38500** | IT governance: Evaluate, Direct, Monitor |
| **CIS Controls v8** | Operational control library |

### Exam Tips

- When a question offers "approve the strategy" vs "implement the strategy", governance approves, management implements.
- The CISO does not own governance — the board does.
- Security strategy starts with business strategy, not with a threat model.

### Case Studies

- **Equifax 2017**: no clear ownership of vulnerability management, no board-level oversight — a governance failure.
- **SolarWinds 2020**: supply-chain compromise highlighted that SBOM and supplier assurance are strategic (governance) questions.
- **Target 2013**: third-party risk management failure rooted in governance.
`,

cissp_risk_mgmt: `
## Risk Management

Risk management is the beating heart of Domain 1. Every security decision is a risk decision.

### Core Formula

\`\`\`
Risk = Threat × Vulnerability × Impact
SLE  = AV × EF        (Single Loss Expectancy)
ALE  = SLE × ARO      (Annualized Loss Expectancy)
ROSI = (ALE_before − ALE_after − annual_control_cost) / annual_control_cost
\`\`\`

### Key Terms

| Term | Definition |
|---|---|
| **Asset Value (AV)** | Replacement cost or financial impact of loss |
| **Exposure Factor (EF)** | Percentage of AV lost in a single incident |
| **SLE** | Loss from one incident: AV × EF |
| **ARO** | How often the incident is expected per year |
| **ALE** | Expected annual loss: SLE × ARO |
| **Risk appetite** | Amount of risk the org is willing to pursue (set by board) |
| **Risk tolerance** | Acceptable variance around the appetite |
| **Residual risk** | Risk remaining after controls are applied |

### Worked Example

> 1,000 laptops × $1,500 each. 2% lost/stolen per year. EF = 100%.
> SLE = $1,500. ALE = $30/laptop = $30,000/year for the fleet.
> FDE at $50/laptop/year reduces EF to 10%.
> New ALE = $3,000/year. ROSI = ($30K − $3K − $50K) / $50K = −0.46 (negative).

A negative ROSI means the control is not financially justified on pure math — but regulatory, reputational, and ethical factors may override.

### Four Risk Treatments

1. **Avoid** — discontinue the activity creating the risk
2. **Mitigate** — apply controls to reduce likelihood or impact
3. **Transfer** — shift financial consequence (insurance, contracts)
4. **Accept** — acknowledge and document with formal sign-off

**Order: Mitigate → Transfer → Accept. Avoid if above capacity.**

"Ignore" is NOT a valid treatment.

### Control Categories

**By implementer**: Administrative, Technical, Physical
**By function**: Preventive, Detective, Corrective, Deterrent, Directive, Recovery, Compensating

### Risk Frameworks

- **NIST SP 800-30 Rev 1** — Guide for Conducting Risk Assessments
- **NIST SP 800-37 Rev 2 (RMF)** — Prepare → Categorize → Select → Implement → Assess → Authorize → Monitor
- **ISO/IEC 27005** — Information security risk management
- **FAIR** — Quantitative risk analysis (Loss Event Frequency × Loss Magnitude)
- **OCTAVE** — Asset-driven, workshop-based

### Exam Tips

- When asked what to do FIRST after identifying a risk: **assess** (not mitigate, transfer, or accept).
- **Who owns a risk?** The business process owner or data owner, not the CISO.
- Risk decisions must be **formal and documented**.
- Residual risk can never be zero (except by avoiding the activity).
`,

cissp_compliance: `
## Compliance & Legal

### Major Legal Families

| Family | Examples |
|---|---|
| **Privacy & data protection** | GDPR, CCPA/CPRA, HIPAA, PIPEDA, LGPD, POPIA |
| **Sector-specific** | GLBA (finance), HIPAA (health), FERPA (education), FISMA (federal), PCI-DSS (payment cards), NERC CIP (electric) |
| **Corporate governance** | SOX (US public companies), UK Corporate Governance Code |
| **Intellectual property** | Copyright, trademark, trade secret, patent, DMCA |
| **Computer crime** | CFAA (US), Computer Misuse Act (UK), Budapest Convention |
| **Export control** | ITAR, EAR, Wassenaar Arrangement |

### GDPR vs CCPA Side-by-Side

| Attribute | GDPR | CCPA/CPRA |
|---|---|---|
| Scope | Any controller/processor handling EU resident data | CA-resident PI at volume/revenue thresholds |
| Key roles | Controller, Processor, DPO | Business, Service Provider, Contractor |
| Lawful basis | Required (consent, contract, etc.) | Notice-and-opt-out model |
| Max fine | €20M or 4% global turnover | $7,500/intentional violation |
| Breach notification | 72 hours to supervisory authority | "Without unreasonable delay" |

**GDPR is extraterritorial** — applies wherever EU resident data is processed.

### Investigation Types

| Type | Burden of Proof | Consumer |
|---|---|---|
| Administrative | Policy | HR, management |
| Criminal | Beyond reasonable doubt | Prosecutor |
| Civil | Preponderance of evidence | Plaintiff |
| Regulatory | Varies (usually preponderance) | Regulator |
| Industry | Contractual | Industry body |

### Evidence Handling

- **Chain of custody** — documented record of every handler with timestamps
- **Order of volatility (RFC 3227)** — CPU → memory → disk → archival (most volatile first)
- **Five evidence rules** — Authentic, Accurate, Complete, Convincing, Admissible
- **Write blockers** — prevent modification during imaging
- **Forensic imaging** — bit-for-bit copy with cryptographic hash

### Exam Tips

- PCI-DSS is contractual, not statutory.
- HIPAA covers PHI held by Covered Entities and Business Associates only.
- SOX is about financial reporting integrity, not security directly.
- Encryption safe harbor: most US state breach laws don't require notification if data was encrypted and key wasn't compromised.
`,

cissp_bcdr: `
## Business Continuity & Disaster Recovery

### BIA Metrics

| Metric | Meaning |
|---|---|
| **MTD** | Maximum Tolerable Downtime — business survival limit |
| **RTO** | Recovery Time Objective — target to restore service |
| **RPO** | Recovery Point Objective — max acceptable data loss (in time) |
| **WRT** | Work Recovery Time — verify data, test, resume operations |

**Critical formula: RTO + WRT ≤ MTD**

RPO looks backward (to the last backup). RTO looks forward (to service restored). WRT is the gap most plans forget.

### Recovery Site Types

| Site | Hardware | Data | Recovery Time | Cost |
|---|---|---|---|---|
| Cold | Empty facility | None | Days-weeks | Lowest |
| Warm | Installed, not current | Periodic sync | Hours-days | Moderate |
| Hot | Fully equipped, current | Near real-time | Minutes-hours | High |
| Mirror | Active-active | Synchronous | Near zero | Highest |
| Cloud DR | On-demand | Replicated | Minutes-hours | Variable |

### BCP Test Types (least → most disruptive)

1. **Checklist** — document verification
2. **Tabletop** — discussion-based walkthrough
3. **Walkthrough** — detailed step-by-step review
4. **Simulation** — partial execution
5. **Parallel** — full execution at DR site, primary continues
6. **Full interruption** — shut down primary, force failover

### Exam Tips

- Personnel safety is always the first priority in a disaster.
- The BIA is the most important element of the BCP.
- Reciprocal agreements are rarely recommended (both partners need it at the same time).
- "Which test is LEAST disruptive?" → Checklist. "MOST realistic while preserving production?" → Parallel.

### Key Frameworks

- **NIST SP 800-34 Rev 1** — Contingency Planning Guide
- **ISO 22301** — Business Continuity Management Systems
`,

cissp_personnel: `
## Personnel Security

### Employment Lifecycle

1. **Screening & hiring** — background checks, reference/education verification
2. **Onboarding** — confidentiality agreement, least-privilege access, awareness training
3. **In-employment** — ongoing training, access recertification, mandatory vacation, rotation of duties
4. **Role change** — recertify access, retrain, remove old privileges (prevent accumulation)
5. **Termination** — immediate access revocation (before notification for involuntary), return assets, exit interview

### Key Principles

- **Least privilege** — only the access strictly necessary
- **Separation of duties (SoD)** — high-impact transactions require 2+ people
- **Job rotation** — detects fraud (hidden schemes unravel when someone else sits in)
- **Mandatory vacation** — forces extended absence, classic fraud-detection control
- **Need to know** — limits information disclosure within least-privilege scope
- **Dual control / M-of-N** — simultaneous cooperation required

### Third-Party Personnel

- Contractual security clauses (MSA, DPA, right-to-audit)
- Pre-engagement due diligence (SOC 2 Type II, ISO 27001)
- Segmented access with time-limited credentials
- Exit procedures tied to the relationship, not the individual

### Exam Tips

- Involuntary termination = higher risk: revoke access before notification.
- Voluntary termination = graceful: monitor, planned revocation.
- Exit interview is owned by HR, with security participating.
- "What prevents collusion?" → Job rotation + mandatory vacation.

### Case Studies

- **Edward Snowden (2013)** — need-to-know enforcement failure
- **Jérôme Kerviel / SocGen (2008)** — no mandatory vacation exposed hidden positions
- **Morrison Supermarkets (2014)** — authorized access + malicious intent
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 2 — Asset Security (10%)
// ══════════════════════════════════════════════════════════════════

cissp_data_class: `
## Data Classification & Handling

### Classification Schemes

**Commercial (four levels):**
| Level | Description |
|---|---|
| Public | No loss if disclosed |
| Internal | Minor damage if disclosed |
| Confidential | Significant damage if disclosed |
| Restricted | Severe damage; strict need-to-know |

**Government:** Unclassified → Confidential → Secret → Top Secret

**High-water mark principle:** A collection inherits the highest classification of any element it contains.

### Key Roles

- **Data owner** — business role, accountable for classification, retention, access decisions
- **Data custodian** — technical role, implements controls the owner specifies
- **Data steward** — day-to-day data quality and use
- **System owner** — accountable for the system (config, hardening, patching)

**"Owner classifies; custodian implements."** — the single most important sentence in Domain 2.

### Data States

| State | Controls |
|---|---|
| **At rest** | Encryption (AES-256), access control, physical security |
| **In transit** | TLS, IPsec, SSH, VPN |
| **In use** | Memory protection, enclaves (SGX, SEV, TDX), DLP |

Encryption does NOT protect data in use. This is the #1 Domain 2 trap.

### NIST SP 800-88 Sanitization

| Level | Method | Recoverable? |
|---|---|---|
| **Clear** | Overwrite | Not by standard tools |
| **Purge** | Crypto-erase on SED, degauss | Not by lab techniques |
| **Destroy** | Shred, incinerate, pulverize | Media cannot be reused |

SSD crypto-erase = Purge (when properly implemented). Degaussing does NOT work on SSDs.

### Data Lifecycle

Create → Store → Use → Share → Archive → Destroy

Each transition is a potential security event. Controls must match each stage.

### Exam Tips

- Access decisions belong to the data owner, not the security team.
- Deletion ≠ destruction. rm -rf does not sanitize.
- For aggregation questions: high-water mark wins.
`,

cissp_privacy: `
## Privacy Protection

### Privacy Roles by Regulation

| GDPR | CCPA | HIPAA |
|---|---|---|
| Data subject | Consumer | Individual |
| Controller | Business | Covered entity |
| Processor | Service provider | Business associate |

### Key Privacy Concepts

- **PII** — Personally Identifiable Information (NIST SP 800-122)
- **PHI** — Protected Health Information (HIPAA-specific)
- **Sensitive PII** — SSN, financial accounts, government IDs
- **Pseudonymization** — reversible with a key; **still personal data under GDPR**
- **Anonymization** — irreversible; **no longer personal data under GDPR**

### GDPR Lawful Bases (Article 6)

1. Consent
2. Contract
3. Legal obligation
4. Vital interests
5. Public task
6. Legitimate interests

### DLP Modes

- **At rest (discovery)** — scans repositories for sensitive content
- **In transit (network)** — inspects outbound traffic
- **In use (endpoint)** — blocks copy, print, USB, screen capture
- **SaaS (CASB)** — policy enforcement for cloud apps

### Retention Rules

- Legal holds always win (override normal retention).
- Longest applicable obligation = minimum retention.
- Shortest data-minimization obligation = maximum retention.

### Exam Tips

- "Pseudonym stays personal; anonym is gone."
- HIPAA covers only PHI held by covered entities or BAs — not consumer health apps.
- When GDPR and CCPA overlap, apply the most protective rule.
- Tokenization can reduce PCI-DSS scope if tokens are non-reversible outside the vault.
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 3 — Security Architecture & Engineering (13%)
// ══════════════════════════════════════════════════════════════════

cissp_models: `
## Security Models & Frameworks

### Bell-LaPadula (BLP) — Confidentiality

- **Simple security ("no read up")** — subject at level L cannot read higher
- **Star property ("no write down")** — subject at level L cannot write lower
- Enforces one-way information flow from low to high

### Biba — Integrity

- **Simple integrity ("no read down")** — subject cannot read lower-integrity data
- **Star integrity ("no write up")** — subject cannot write to higher integrity
- The dual of BLP

### Clark-Wilson — Commercial Integrity

- **CDIs** (Constrained Data Items) modified only via **TPs** (Transformation Procedures)
- **IVPs** (Integrity Verification Procedures) validate consistency
- Enforces separation of duties and well-formed transactions

### Brewer-Nash (Chinese Wall)

- Prevents conflicts of interest: once you access one client's data, you're blocked from competitors

### Other Models

- **Take-Grant** — graph-theoretic, proves rights propagation
- **HRU (Harrison-Ruzzo-Ullman)** — general safety question is undecidable
- **Graham-Denning** — eight protection rules for creating/deleting subjects/objects

### System Architecture

- **TCB** — Trusted Computing Base: all protection mechanisms
- **Reference Monitor** — must be: Always Invoked, Tamper-Proof, Verifiable
- **Rings** — Ring 0 (kernel), Ring 3 (user); Ring -1 (hypervisor)
- **TPM** — hardware root of trust, measured boot, attestation
- **HSM** — dedicated cryptographic key operations, FIPS 140-3 validated

### Common Criteria (ISO/IEC 15408)

Protection Profiles, Security Targets, EAL1–EAL7

### Exam Tips

- BLP: no read up, no write down (confidentiality)
- Biba: no read down, no write up (integrity)
- Classified network → BLP. Medical records → Biba or Clark-Wilson. Audit firm → Brewer-Nash.
`,

cissp_crypto: `
## Cryptography

### Symmetric Encryption (same key both ways)

- **AES** — NIST standard, 128/192/256-bit keys, block cipher
- **ChaCha20** — stream cipher, fast in software/mobile
- **3DES** — deprecated by NIST

### Block Cipher Modes

- **ECB** — INSECURE (identical blocks → identical ciphertext)
- **CBC** — chaining; vulnerable to padding oracle without MAC
- **CTR** — counter mode, parallelizable
- **GCM** — AEAD (confidentiality + integrity + authenticity); nonce reuse is catastrophic
- **CCM** — AEAD for constrained environments

### Asymmetric Encryption (key pair)

- **RSA** — factorization-based, 2048+ bits, OAEP padding for encryption, PSS for signatures
- **DH / ECDH** — key exchange (not encryption)
- **ECC** — shorter keys for equivalent security (P-256, Curve25519)
- **EdDSA / Ed25519** — modern signature scheme

### Hashing

- **SHA-2** (SHA-256, SHA-384, SHA-512) — current standard
- **SHA-3** — Keccak sponge construction
- **MD5, SHA-1** — broken for collision resistance

### Authentication & Non-repudiation

| Need | Primitive |
|---|---|
| Integrity + authenticity (shared key) | HMAC |
| Non-repudiation (single holder) | Digital signature (RSA-PSS, ECDSA, EdDSA) |
| Confidentiality + integrity + authenticity | AEAD (AES-GCM, ChaCha20-Poly1305) |

**HMAC does NOT provide non-repudiation** (both parties share the key).

### Password Storage

Use a password KDF, not a plain hash:
- **Argon2id** — current recommendation (memory-hard)
- **bcrypt**, **scrypt** — acceptable alternatives
- **HKDF** — for deriving keys from existing secrets (NOT passwords)

### PKI

- **CA hierarchy** — offline root → online intermediate → end-entity certs
- **Revocation** — CRL (periodic list), OCSP (real-time), OCSP stapling (server caches response)
- **X.509** — certificate format

### Post-Quantum Cryptography (NIST, August 2024)

- **ML-KEM** (FIPS 203) — key encapsulation
- **ML-DSA** (FIPS 204) — digital signatures
- **SLH-DSA** (FIPS 205) — stateless hash-based signatures

### Cryptanalytic Attacks

Brute force, birthday, rainbow tables, known/chosen plaintext/ciphertext, padding oracle, meet-in-the-middle, side channel, replay, downgrade

### Exam Tips

- Symmetric for bulk, asymmetric for key exchange and signatures.
- Never use ECB. Never use MD5/SHA-1 for security.
- Nonce reuse in GCM = catastrophic.
- Argon2id for passwords; HKDF for key derivation from shared secrets.
- "Don't roll your own crypto."
`,

cissp_physical: `
## Physical Security

### CPTED (Crime Prevention Through Environmental Design)

- Natural surveillance — visibility deters crime
- Natural access control — guide legitimate traffic
- Territorial reinforcement — define ownership
- Maintenance — well-maintained spaces signal monitoring

### Layered Defense

Perimeter → Building → Floor → Room → Rack

### Access Controls

- Locks, badges, PINs, biometrics, mantraps (access control vestibules)
- Mantraps prevent tailgating (two-door chamber, one person at a time)

### Fire Suppression

| Type | Description |
|---|---|
| Wet pipe | Water always charged; fast but false-discharge risk |
| Dry pipe | Air until activation; slower, cold-climate friendly |
| Pre-action | Requires smoke detection AND head activation |
| Inert gas | FE-13, Inergen — no water damage |
| Halocarbon | FM-200, Novec 1230 — electronics-safe |

Halon is banned (Montreal Protocol). Pre-action + VESDA is the modern data center standard.

### Fail-Safe vs Fail-Secure

- **Fail-safe** — doors unlock on failure (life safety for exits)
- **Fail-secure** — doors remain locked (high-security zones)

### Exam Tips

- Personnel safety is ALWAYS the top priority.
- Fire classes: A (combustibles), B (liquids), C (electrical), D (metals), K (cooking).
- Degaussing works on magnetic media only — not SSDs.
`,

cissp_secure_design: `
## Secure Design Principles

### Saltzer & Schroeder Principles (and modern additions)

- **Least privilege** — only the access strictly required
- **Separation of duties** — no single actor completes a high-impact workflow
- **Defense in depth** — layered controls; no single failure is catastrophic
- **Fail-safe defaults** — on failure, deny access (not grant)
- **Economy of mechanism (KISS)** — simpler designs have fewer bugs
- **Complete mediation** — check every access, every time; no caching of decisions
- **Open design** — security must not depend on obscurity (Kerckhoffs' principle)
- **Psychological acceptability** — controls must be usable
- **Least common mechanism** — minimize shared mechanisms across boundaries
- **Secure defaults** — out-of-the-box configuration is secure
- **Privacy by design** — privacy from the first design iteration
- **Zero trust** — trust is never implicit based on network location

### Zero Trust Architecture (NIST SP 800-207)

- Policy Engine decides, Policy Administrator issues, Policy Enforcement Point enforces
- Every request: who, what device, what state, what context → policy decision
- "Never trust, always verify" — with continuous evaluation

### Exam Tips

- When a principle-named answer and a technology answer are both offered, pick the principle for "which principle" questions, the technology for "which action" questions.
- Fail-safe means fail-DENY, not fail-open.
- "Security through obscurity" as the only control is wrong; as one layer on top of strong controls, it is acceptable defense in depth.

### Case Studies

- **Heartbleed 2014** — violated defense in depth, complete mediation, and economy of mechanism
- **Google BeyondCorp** — canonical enterprise zero-trust implementation
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 4 — Communication & Network Security (13%)
// ══════════════════════════════════════════════════════════════════

cissp_network: `
## Network Architecture

### OSI Model (7 layers)

| Layer | Name | Threats | Controls |
|---|---|---|---|
| 7 | Application | Injection, XSS, SSRF | WAF, input validation |
| 6 | Presentation | TLS downgrade | TLS 1.3 strict config |
| 5 | Session | Session fixation | Modern session tokens |
| 4 | Transport | SYN flood | SYN cookies, stateful FW |
| 3 | Network | IP spoofing, routing attacks | ACLs, IPsec, uRPF |
| 2 | Data Link | ARP poisoning, VLAN hopping | Port security, DAI, 802.1X |
| 1 | Physical | Tapping, emanations | Shielding, fiber |

Mnemonic (top down): **All People Seem To Need Data Processing**

### TCP/IP Model

Link → Internet → Transport → Application

### Segmentation

- Physical, VLAN (L2), Subnet (L3), VRF, Micro-segmentation (per-workload)
- **Micro-segmentation** is the modern high-assurance pattern: default-deny, identity-aware

### IPv6 Considerations

128-bit addresses, no broadcast (multicast), mandatory ICMPv6, SLAAC auto-config. Own attack surface: rogue RA, SLAAC abuse, transition mechanisms (6to4, Teredo).

### Exam Tips

- Map attacks to layers: ARP → L2, IP spoof → L3, SYN flood → L4, DNS → L7
- VLANs are NOT strong security boundaries (VLAN hopping is real)
- Segment first; encrypt by default; monitor always
`,

cissp_protocols: `
## Secure Communications

### TLS 1.3 (RFC 8446)

- Forward secrecy mandatory (ECDHE/DHE only)
- Removed: static RSA, CBC, SHA-1, RC4, compression
- AEAD-only cipher suites (AES-GCM, ChaCha20-Poly1305)
- 1-RTT handshake (vs 2-RTT in TLS 1.2)

### IPsec

- **AH** — integrity only
- **ESP** — confidentiality and/or integrity
- **Transport mode** — protects payload, keeps original IP header (host-to-host)
- **Tunnel mode** — encapsulates entire packet (site-to-site VPN)
- IKEv2 for key management

### SSH

Secure shell for admin access and file transfer. Host key verification, public-key auth, tunneling.

### DNSSEC

Signs DNS records with chain of trust rooted at root zone. Prevents cache poisoning. Does NOT provide confidentiality — use DoT/DoH for that.

### S/MIME and PGP

S/MIME is X.509-based email signing/encryption. PGP uses web-of-trust model.

### Exam Tips

- TLS 1.3 = forward secrecy mandatory, AEAD only
- IPsec: AH authenticates, ESP encrypts. Tunnel for site-to-site, Transport for host-to-host.
- DNSSEC = integrity. DoH/DoT = confidentiality. Different things.
`,

cissp_wireless_net: `
## Wireless & Remote Access

### Wireless Security Standards

| Standard | Security | Status |
|---|---|---|
| WEP | Broken | Do not use |
| WPA/WPA2 | TKIP/AES; WPA2-PSK vulnerable to offline dictionary | Deprecated / legacy |
| WPA3 | SAE (resistant to offline attacks), forward secrecy | Current standard |

**WPA3 SAE** = Simultaneous Authentication of Equals. Each authentication is unique; offline dictionary attacks are not possible. Forward secrecy even with weak passwords.

### 802.1X (Port-Based NAC)

Three roles: Supplicant (client), Authenticator (switch/AP), Authentication Server (RADIUS)
- **EAP-TLS** — certificate-based, strongest
- **PEAP** — tunneled password-based
- **EAP-TTLS** — similar to PEAP

### VPN Types

| Type | Use |
|---|---|
| Site-to-site IPsec (tunnel mode) | Connect two networks |
| Remote-access SSL VPN | Individual users to corporate |
| WireGuard | Modern, minimal, fast |
| ZTNA | Per-application access, identity-aware |

### Exam Tips

- WPA3 SAE replaces WPA2 PSK; resistant to offline dictionary
- 802.1X: supplicant, authenticator, RADIUS; EAP-TLS is strongest
- ZTNA > VPN for zero trust alignment
- KRACK (2017) broke WPA2's four-way handshake via key reinstallation
`,

cissp_network_attacks: `
## Network Attacks & Countermeasures

### Attack Catalog

| Attack | Layer | Defense |
|---|---|---|
| ARP poisoning | L2 | Dynamic ARP Inspection, 802.1X |
| VLAN hopping (double tagging) | L2 | Disable native VLAN, disable DTP |
| IP spoofing | L3 | uRPF, ingress filtering |
| SYN flood | L4 | SYN cookies, stateful FW |
| DNS poisoning | L7 | DNSSEC |
| DDoS (volumetric) | L3/L4 | Upstream scrubbing, CDN |
| DDoS (application) | L7 | WAF, rate limiting, bot detection |
| MITM | Various | Authenticated key exchange (TLS, SSH) |
| Session hijacking | L4-L7 | Strong random tokens, TLS |
| Replay | Various | Nonces and timestamps |
| Rogue AP / Evil twin | L2 wireless | WIDS, 802.1X |
| DNS tunneling | L7 | DNS query analysis, egress filtering |
| LLMNR/NBT-NS poisoning | L2 | Disable LLMNR/NBT-NS via Group Policy |

### Firewall Types

| Type | Layer | Use |
|---|---|---|
| Stateless packet filter | L3/L4 | Basic, fast |
| Stateful | L3/L4 | Tracks connections |
| Proxy/NGFW | L7 | Application awareness, IDS/IPS |
| WAF | L7 (HTTP) | Web app protection |

### IDS vs IPS

- **IDS** — detects and alerts (out-of-band)
- **IPS** — detects AND blocks (inline)
- Signature-based catches known; anomaly-based catches novel but more false positives

### Exam Tips

- SYN cookies: server encodes state in sequence number, allocates only on valid ACK
- DNS tunneling: high-entropy subdomains from unusual sources = exfiltration indicator
- Micro-segmentation prevents lateral movement (the ransomware lesson)
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 5 — Identity & Access Management (13%)
// ══════════════════════════════════════════════════════════════════

cissp_auth: `
## Authentication Methods

### Authentication Factors

| Factor | Examples |
|---|---|
| Something you know | Password, PIN, passphrase |
| Something you have | Hardware token, smart card, FIDO2 key |
| Something you are | Fingerprint, face, iris |
| Something you do | Signature, typing rhythm |
| Somewhere you are | GPS, IP geolocation (weak) |

**MFA requires 2+ different factor types.** Two passwords is NOT MFA.

### NIST SP 800-63B Assurance Levels

- **AAL1** — single-factor
- **AAL2** — two-factor
- **AAL3** — hardware-based multi-factor with phishing resistance

### Phishing-Resistant MFA

- SMS/TOTP — defeated by real-time relay
- Push — defeated by MFA fatigue (Uber 2022)
- **FIDO2/WebAuthn** — phishing-resistant (cryptographically bound to origin)
- **Smart cards (PIV/CAC)** — phishing-resistant, certificate-based

### Biometrics

- **FAR** (False Accept Rate) = Type II error (unauthorized accepted)
- **FRR** (False Reject Rate) = Type I error (authorized rejected)
- **CER** (Crossover Error Rate) = where FAR = FRR; lower is better

Biometrics are not secrets (observable) and have no revocation story.

### Exam Tips

- Strongest MFA → FIDO2/WebAuthn or smart card
- MFA fatigue → migrate to phishing-resistant, not more training
- "IAAA" — Identification, Authentication, Authorization, Accountability
`,

cissp_access_control: `
## Access Control Models

| Model | Basis | Use Case |
|---|---|---|
| **DAC** | Owner decides | Filesystem ACLs, flexible but error-prone |
| **MAC** | System-enforced labels | Classified government, SELinux |
| **RBAC** | Roles | Enterprise scale (hundreds of apps) |
| **ABAC** | Attributes (subject, resource, action, env) | Cloud, fine-grained, dynamic |
| **Rule-Based** | Rules regardless of role | Firewall rules |

### Access Control Architecture

- **PDP** (Policy Decision Point) — evaluates requests
- **PEP** (Policy Enforcement Point) — enforces decisions
- **PAP** (Policy Administration Point) — authors policies
- **PIP** (Policy Information Point) — supplies attributes

### Access Control Matrix

- **Capability list** — per-subject list of objects and permissions
- **ACL** — per-object list of subjects and permissions
- Dual representations of the same matrix

### Exam Tips

- Government classified → MAC
- Commercial with many users → RBAC
- Dynamic, per-request, contextual → ABAC
- Owner decides in DAC; system decides in MAC
`,

cissp_identity: `
## Identity Management

### Federation Protocols

**SAML 2.0** — XML-based, enterprise SSO. IdP issues signed assertions; SP verifies.
**OIDC (OpenID Connect)** — OAuth 2.0 + ID Token (signed JWT) for authentication.
**OAuth 2.0** — authorization framework, NOT authentication. Delegates access to resources.

**"OAuth delegates; OIDC identifies."**

### OAuth 2.0 Flows

- **Authorization Code + PKCE** — current best practice for all clients
- **Client Credentials** — machine-to-machine
- **Implicit flow** — DEPRECATED (tokens in URL fragment)

### Kerberos

- **KDC** = AS (Authentication Service) + TGS (Ticket Granting Service)
- Flow: AS-REQ → TGT → TGS-REQ → Service Ticket → Service access
- No passwords on the wire; time-sensitive (clock sync required)

### Joiner-Mover-Leaver

1. **Joiner** — provision with role-based access
2. **Mover** — update access; REMOVE old privileges (prevent accumulation)
3. **Leaver** — revoke all access promptly

### Privileged Access Management (PAM)

- Credential vaulting — secrets in a vault, not workstations
- JIT (Just-In-Time) — privileges granted per-session, revoked automatically
- Session recording — all admin activity captured
- Break-glass — emergency-only accounts with strict monitoring

### Exam Tips

- SSO = one authentication per session (not one password)
- OAuth alone is NOT authentication — use OIDC
- JWT 'alg: none' vulnerability — always enforce algorithm server-side
- Golden SAML (SolarWinds 2020) — compromised signing key = forge any assertion
`,

cissp_iam_attacks: `
## IAM Attacks

### Attack Catalog

| Attack | Description | Defense |
|---|---|---|
| **Credential stuffing** | Automated login with breach credentials | MFA, breach-password detection, rate limiting |
| **Pass-the-hash** | Reuse NTLM hash without plaintext | Credential Guard, disable NTLM |
| **Pass-the-ticket** | Steal and reuse Kerberos tickets | Credential Guard, workstation isolation |
| **Kerberoasting** | Offline crack service tickets | Strong service passwords, gMSA |
| **Golden ticket** | Forge TGT with krbtgt key | Regular krbtgt rotation (twice) |
| **Silver ticket** | Forge service ticket | Service account password strength |
| **MFA fatigue** | Spam push notifications | FIDO2, number matching |
| **OAuth consent phishing** | Trick user into authorizing malicious app | Admin consent governance, publisher verification |
| **Session cookie theft** | Steal post-auth session | httpOnly Secure SameSite cookies, short lifetimes |

### NTLM Weaknesses

Pass-the-hash, NTLMRelay, LM hash weakness. Mitigations: Kerberos-only where possible, SMB signing, Extended Protection for Authentication, disable NTLMv1.

### Exam Tips

- Kerberoasting defense = strong service account passwords / gMSA
- Consent phishing bypasses MFA entirely (user authenticates legitimately)
- Session token storage: httpOnly cookies, NOT localStorage (XSS risk)
- LLMNR/NBT-NS poisoning → disable via Group Policy
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 6 — Security Assessment & Testing (12%)
// ══════════════════════════════════════════════════════════════════

cissp_vuln: `
## Vulnerability Assessment

### Vulnerability Scanning vs Penetration Testing

- **Scan** = automated, signature-based, finds known vulnerabilities. Answers "what could be wrong."
- **Pentest** = human-driven, chains exploits, finds exploitable paths. Answers "what IS exploitable."

### Scan Types

- **Authenticated** — logs into hosts, sees local vulnerabilities (much more accurate)
- **Unauthenticated** — sees only network-visible services
- **CSPM** — continuous cloud posture assessment

### Penetration Testing

- **Black box** — no prior knowledge
- **Gray box** — partial knowledge
- **White box** — full knowledge, source code access

### Red / Blue / Purple / White Teams

- **Red** — adversary simulation (weeks-months)
- **Blue** — defenders
- **Purple** — joint exercises for mutual improvement
- **White** — coordinators/referees

### Rules of Engagement

Scope, timing, authorized actions, prohibited actions, escalation, authorization letter ("get out of jail free"), evidence handling.

### Exam Tips

- Pentest for incident-response testing → Red team (longer, broader, realistic)
- Pentest for finding specific bugs → Standard pentest
- Authorization letter is REQUIRED before testing begins
- Assessment without remediation = security theater (Equifax 2017)
`,

cissp_audit: `
## Security Auditing

### SOC Reports (AICPA)

| Report | Focus | Audience |
|---|---|---|
| SOC 1 | Financial reporting controls | Customer's SOX compliance |
| SOC 2 | Trust Services Criteria (security, availability, etc.) | Enterprise vendor evaluation |
| SOC 3 | Public summary of SOC 2 | Marketing/trust pages |

| Type | Scope |
|---|---|
| Type I | Design of controls at a point in time (snapshot) |
| Type II | Operating effectiveness over 6-12 months (much stronger) |

**Enterprise customers should require SOC 2 Type II.**

### ISO 27001 Certification

3-year cycle: initial certification (Stage 1 + Stage 2) → annual surveillance → recertification.

### Metrics

- **KPI** — measures program performance (MTTD, MTTR, patch cadence)
- **KRI** — measures risk posture (% critical risks within appetite)
- **Activity** — measures work done (tickets closed, scans run)

**Boards see KRIs. Executives see KPIs. Operations sees activity.**

### Exam Tips

- SOC 2 Type I vs Type II is the most commonly missed distinction
- "Continuous compliance monitoring" > annual point-in-time audit
- Vulnerability management is a program, not a tool
- CVSS alone is insufficient — add EPSS, CISA KEV, business context
`,

cissp_testing: `
## Software Testing

### Application Security Testing Tools

| Tool | How |
|---|---|
| **SAST** | Reads source code; fast, many false positives |
| **DAST** | Probes running app; finds runtime issues |
| **IAST** | Instruments running app from inside; combines both |
| **SCA** | Inventories dependencies; catches Log4Shell-class risks |
| **RASP** | Runtime protection inside the app |
| **Fuzzing** | Randomized inputs to find crashes |

"SAST reads, DAST probes, IAST watches, SCA lists."

### Exam Tips

- No single tool is sufficient — mature programs use multiple techniques
- SCA is the only tool that quickly identifies dependency vulnerabilities
- IAST has lower false positives than SAST but requires instrumentation
- Manual code review catches business logic flaws that automation misses
- Shift left for speed; shift everywhere for depth
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 7 — Security Operations (13%)
// ══════════════════════════════════════════════════════════════════

cissp_ir: `
## Incident Management

### NIST SP 800-61 Rev 2 — IR Lifecycle

1. **Preparation** — policy, team, tools, training, exercises
2. **Detection & Analysis** — identify the incident, triage severity
3. **Containment, Eradication, Recovery** — stop spread, remove threat, restore
4. **Post-Incident Activity (Lessons Learned)** — debrief, update, improve

### Containment

- **Short-term** — isolate the affected host immediately
- **Long-term** — segment the affected network area

### Eradication

Remove attacker presence: delete malware, close backdoors, rotate credentials, rebuild compromised systems.

### Recovery

Restore operations and monitor for re-infection.

### Communications

- Single designated spokesperson (communications/PR with legal support)
- Pre-drafted templates reviewed by legal
- Internal: management, affected teams. External: customers, regulators, law enforcement, media.

### Breach Notification Timelines

- GDPR: 72 hours to supervisory authority
- SEC: 4 business days for material incidents (public companies)
- State laws: varies; many have encryption safe harbors

### Exam Tips

- Personnel safety FIRST in any incident involving physical events
- Preserve evidence BEFORE containment actions that would destroy it
- "What should the CISSP do FIRST?" → Activate the IR plan / preserve evidence
- Blameless post-mortems produce better outcomes than blame-focused reviews
`,

cissp_investigations: `
## Investigations & Evidence

### Investigation Types

| Type | Burden | Consumer |
|---|---|---|
| Administrative | Policy | HR, management |
| Criminal | Beyond reasonable doubt | Prosecutor |
| Civil | Preponderance of evidence | Plaintiff |
| Regulatory | Varies | Regulator |
| Industry | Contractual | Industry body |

### Evidence Handling

- **Chain of custody** — documented from first moment; every handoff recorded
- **Order of volatility (RFC 3227)** — CPU → memory → disk → archival
- **Forensic imaging** — bit-for-bit copy with cryptographic hash
- **Write blockers** — prevent modification during imaging
- **Five evidence rules** — Authentic, Accurate, Complete, Convincing, Admissible

### Exam Tips

- Preserve first, analyze second. Never analyze the original.
- Chain of custody starts at first acquisition, not at the lab.
- Criminal and civil cases CAN run in parallel (different burden of proof).
- Administrative investigations are the most common in practice.
`,

cissp_operations: `
## Operational Security

### Configuration Management

Track and control system state over time. Baselines (CIS, STIG) + drift detection + remediation.

### Change Management

| Type | Process |
|---|---|
| Standard | Pre-approved, low-risk, routine |
| Normal | Request → CAB review → scheduled implementation → post-review |
| Emergency | Urgent, post-implementation review MANDATORY |

Emergency changes are the most dangerous — always review after.

### Patch Management Lifecycle

Vendor release → assess criticality → test in staging → schedule via change management → deploy → verify → close

### Logging & Monitoring

- **SIEM** — aggregates, correlates, alerts (use-case driven, not "collect everything")
- **SOAR** — automates response via playbooks
- **UEBA** — baselines behavior, detects anomalies
- **Continuous monitoring** — NIST SP 800-137

### Key Metrics

- **MTTD** — Mean Time To Detect
- **MTTR** — Mean Time To Respond

### Exam Tips

- "Collect everything" is an anti-pattern for SIEM — define use cases first
- Emergency changes should ALWAYS receive post-implementation review
- Configuration drift = gap between baseline and current state
- Automated drift detection is essential in cloud environments
`,

cissp_disaster: `
## Disaster Recovery Operations

### Backup Strategies

- **Full / Incremental / Differential** — classic levels
- **3-2-1 rule** — 3 copies, 2 media types, 1 offsite
- **3-2-1-1-0** — adds 1 immutable/offline copy, 0 errors verified
- **Air-gapped / immutable backups** — defense against ransomware

### Recovery Testing

Checklist → Tabletop → Walkthrough → Simulation → Parallel → Full interruption

### DR Site Selection

- Must be geographically distant enough to avoid the same regional disaster
- Metropolitan proximity = same earthquake/hurricane/flood/power grid

### Exam Tips

- Untested backups often fail — test restores regularly
- Modern ransomware targets backups specifically
- Cloud DR is not automatically multi-region; requires explicit design
- Failback (returning from DR to primary) is often harder than failover
- Hurricane Katrina (2005): organizations lost both primary and DR when both were local
`,

// ══════════════════════════════════════════════════════════════════
// DOMAIN 8 — Software Development Security (10%)
// ══════════════════════════════════════════════════════════════════

cissp_sdlc: `
## Secure SDLC

### Phases with Security Activities

1. **Requirements** — security requirements, compliance, threat modeling inputs
2. **Design** — threat modeling (STRIDE, PASTA, Shostack 4 questions), architecture review
3. **Build** — secure coding, SAST/SCA in CI, code review
4. **Test** — DAST, IAST, fuzzing, penetration testing
5. **Deploy** — IaC scanning, secrets management, deployment gates
6. **Operate** — monitoring, WAF/RASP, vulnerability management

### Secure SDLC Frameworks

- **Microsoft SDL** — training → requirements → design → implementation → verification → release → response
- **NIST SSDF (SP 800-218)** — PO (Prepare Org), PS (Protect Software), PW (Produce Well-Secured), RV (Respond to Vulnerabilities)
- **OWASP SAMM** — maturity model for software assurance
- **BSIMM** — descriptive benchmark of real programs

### DevSecOps Pipeline Gates

Pre-commit → Commit (secret scanning, SCA) → Build (SAST, container scan, SBOM) → Test (DAST, IAST) → Pre-deploy (compliance check) → Runtime (RASP, WAF, monitoring)

### Exam Tips

- Shift left for speed; shift everywhere for depth
- Threat modeling at design time is cheaper than pentesting in production
- "Secure by design" > "security-tested" — design prevents classes of vulnerability
- NIST SSDF is required for US federal software suppliers (EO 14028)
`,

cissp_app_vuln: `
## Application Vulnerabilities

### OWASP Top 10 (2021)

1. **A01: Broken Access Control** — authorization not enforced
2. **A02: Cryptographic Failures** — weak crypto, missing encryption
3. **A03: Injection** — SQL, command, LDAP
4. **A04: Insecure Design** — design-time flaws
5. **A05: Security Misconfiguration** — defaults, unnecessary features
6. **A06: Vulnerable Components** — outdated dependencies
7. **A07: Authentication Failures** — weak auth, session flaws
8. **A08: Integrity Failures** — unverified updates, insecure deserialization
9. **A09: Logging Failures** — insufficient detection
10. **A10: SSRF** — server making requests to unintended destinations

### Key Defenses

- **Injection** → Parameterized queries (NEVER string concatenation)
- **XSS** → Output encoding, CSP headers, auto-escaping frameworks
- **Broken access control** → Server-side enforcement, deny by default
- **SSRF** → URL allowlist, block metadata endpoints, IMDSv2, egress filtering
- **Insecure deserialization** → Don't deserialize untrusted data; use JSON with schema validation
- **Vulnerable components** → SCA scanning, SBOM, patch management

### Input Validation

- **Allowlist** preferred over blocklist (allowlists are closed by default)
- Validate at every layer (client is UX, not security)
- Canonicalize before validating

### Exam Tips

- Client-side access control is NOT security (trivially bypassable)
- Error messages should NOT leak stack traces, queries, or internal paths
- Session tokens in httpOnly cookies, NOT localStorage (XSS risk)
- Parameterized queries make SQL injection structurally impossible
`,

cissp_devops: `
## DevSecOps

### Pipeline Security Tools

| Stage | Tools |
|---|---|
| Secret scanning | GitLeaks, TruffleHog, GitHub Secret Scanning |
| SAST | SonarQube, Checkmarx, Semgrep, CodeQL |
| DAST | OWASP ZAP, Burp, Invicti |
| SCA | Snyk, Dependabot, Black Duck |
| Container scanning | Trivy, Anchore, Aqua |
| IaC scanning | Checkov, Terrascan, tfsec |
| Policy as code | OPA/Rego, HashiCorp Sentinel |
| SBOM generation | Syft, CycloneDX CLI |

### Software Supply Chain Security

- **SBOM** — Software Bill of Materials (SPDX or CycloneDX format)
- **Sigstore / cosign** — cryptographic signing for containers/packages
- **SLSA** — Supply chain Levels for Software Artifacts (graduated build integrity)
- **Dependency lockfiles** — pin versions and hashes
- **Private registries** — mirror vetted public packages

### Supply Chain Attacks

- **Log4Shell (2021)** — ubiquitous library, transitive dependency, RCE
- **SolarWinds (2020)** — build system compromise
- **Codecov (2021)** — CI/CD compromise
- **Dependency confusion** — public package with same name as private
- **Typosquatting** — near-duplicate package names

### Secure Coding Practices

- Input validation (allowlist over blocklist)
- Output encoding (context-specific)
- Error handling (never leak internals)
- Logging (security events, NOT passwords/tokens)
- Memory safety (consider Rust, Go for new system code)

### Exam Tips

- IaC templates must be scanned for misconfigurations (they are code)
- "Don't roll your own crypto / auth / deserialization"
- Secure-by-default frameworks reduce vulnerability density dramatically
- EO 14028 made SBOM a federal procurement requirement
- ~70% of C/C++ vulnerabilities are memory-safety issues (per Microsoft/Google)
`,

};

export function getCISSPLessonContent(topicId: string): string | null {
  return CISSP_LESSON_CONTENT[topicId] || null;
}

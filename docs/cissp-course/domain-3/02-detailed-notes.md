# Domain 3 — Security Architecture and Engineering: Detailed Notes

> **AI-generated study material** aligned to the (ISC)² CISSP Exam Outline
> effective April 15, 2024. Domain weight: **13%**. Requires human SME
> review before publication.

---

## 1. Domain Overview

Domain 3 is the technical core of the CISSP exam. Roughly 20 questions on
a 150-item form cover secure design principles, security models, system
architecture and trusted computing, cryptography, and physical security.
Cryptography alone is the single most heavily-tested topic in this
domain; candidates who can recite algorithm names but cannot apply
primitives correctly in scenarios will fail it.

### Key themes

1. **Match the primitive to the guarantee.** Every control serves
   specific security properties. A MAC provides integrity and
   authenticity but not non-repudiation. A hash provides integrity
   only when combined with authentication. AES-256 in ECB mode is
   broken for most real-world data. The exam rewards candidates who
   know what each primitive gives and, more importantly, what it does
   not give.
2. **Key management is harder than algorithms.** Modern algorithms
   are mostly solid; the failures are in generation, storage,
   distribution, rotation, revocation, and destruction of keys. The
   exam tests key management scenarios heavily.
3. **Defense in depth at the architecture level.** Security models,
   rings, the TCB, and the reference monitor are design-time controls
   that make security properties provable — not operational controls.
4. **Physical security is not an afterthought.** The exam treats
   physical security as peer to logical security, with its own
   vocabulary, models (CPTED), and engineering practices.
5. **Emerging tech.** Zero trust, confidential computing, post-quantum
   cryptography, and homomorphic encryption appear on the current exam
   outline and the exam will increasingly test them.

### Manager mindset traps

| Trap | Engineer thinks | Manager thinks |
|---|---|---|
| "We need encryption" | Pick AES-256 | Pick AES-256 + GCM + HKDF + HSM key management + rotation schedule |
| "Let's build a custom protocol" | Fine, it's simple | Reject; use standardized, peer-reviewed protocols |
| "Post-quantum is years away" | Ignore | Plan crypto-agility now; data harvested today may be decrypted later |
| "The CA will handle revocation" | Trust the CA | Verify CRL/OCSP usage in relying parties; unvalidated revocation fails silently |
| "Physical security is facilities" | Out of scope for the CISO | Physical and logical are a single program |

---

## 2. Sub-objectives

Domain 3 sub-objectives (verify verbatim against current outline):

- **3.1** Research, implement, and manage engineering processes using
  secure design principles
- **3.2** Understand the fundamental concepts of security models
- **3.3** Select controls based upon systems security requirements
- **3.4** Understand security capabilities of information systems
  (TCB, security kernel, reference monitor, etc.)
- **3.5** Assess and mitigate the vulnerabilities of security
  architectures, designs, and solution elements
- **3.6** Select and determine cryptographic solutions
- **3.7** Understand methods of cryptanalytic attacks
- **3.8** Apply security principles to site and facility design
- **3.9** Design site and facility security controls

---

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

## 4. Sub-objective 3.2 — Security models

### 4.1.a Conceptual explanation

Security models are formal descriptions of security policies,
expressed in mathematical or set-theoretic language precise enough to
be proved. The exam tests recognition of several canonical models:

- **Bell-LaPadula (BLP, 1973)** — confidentiality only. Subjects and
  objects have security levels; access is governed by two rules:
  - **Simple security property ("no read up")**: a subject at level
    L cannot read an object at a higher level.
  - **\\*-property ("no write down")**: a subject at level L cannot
    write to an object at a lower level.
  - BLP also defines a **discretionary security property** on top.
  - BLP enforces **mandatory access control** and is associated with
    military multilevel security.
- **Biba (1977)** — integrity only. The dual of BLP:
  - **Simple integrity ("no read down")**: a subject cannot read
    data at a lower integrity level.
  - **\\*-integrity ("no write up")**: a subject cannot write to a
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
   due to a duplicated `goto` statement. Single line of code
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

## 11. Cheat sheet

- **Reference monitor: Always Invoked, Tamper-proof, Verifiable.**
- **BLP: no read up, no write down** (confidentiality).
- **Biba: no read down, no write up** (integrity).
- **Clark-Wilson: CDI via TP by authorized subject** (integrity).
- **Brewer-Nash: once you pick a side, you can't see the other**
  (conflict of interest).
- **CIA + Authenticity + Non-repudiation** driven by primitive
  choice.
- **Symmetric for bulk, asymmetric for key exchange and signatures.**
- **AEAD for confidentiality+integrity+authenticity** in one step.
- **Argon2id for password storage; HKDF for derivation from
  existing secret.**
- **PQC standards: ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA
  (FIPS 205).**
- **Fire suppression for data centers: pre-action or inert gas.**
- **CPTED: Natural Surveillance, Natural Access Control,
  Territorial Reinforcement, Maintenance.**
- **Fail-safe for people; fail-secure for high-security zones.**

---

## 12. Glossary (condensed; extend from the full-length notes if expanding)

| Term | Meaning |
|---|---|
| AEAD | Authenticated Encryption with Associated Data (AES-GCM, ChaCha20-Poly1305). |
| Argon2id | Modern password KDF, winner of PHC 2015. |
| Bell-LaPadula | Confidentiality model; no read up, no write down. |
| Biba | Integrity model; no read down, no write up. |
| Brewer-Nash | Chinese Wall conflict-of-interest model. |
| CA | Certificate Authority in a PKI. |
| CPTED | Crime Prevention Through Environmental Design. |
| Clark-Wilson | Integrity model based on well-formed transactions. |
| Complete mediation | Every access is checked every time. |
| Common Criteria | ISO/IEC 15408 evaluation framework. |
| ECB | Insecure block cipher mode; do not use. |
| FIPS 140-3 | US cryptographic module validation standard. |
| GCM | AEAD mode; catastrophic nonce reuse. |
| HKDF | HMAC-based key derivation for existing shared secrets. |
| HSM | Hardware Security Module for key operations. |
| Kerckhoffs' principle | Only the key should be secret. |
| ML-KEM | Post-quantum KEM (FIPS 203). |
| OCSP | Online certificate revocation protocol. |
| PKI | Public Key Infrastructure. |
| Reference monitor | Abstract access-control arbiter. |
| Ring -1/-2/-3 | Hypervisor, firmware, platform management layers. |
| SEV / SGX / TDX | Confidential computing technologies. |
| TCB | Trusted Computing Base. |
| TPM | Trusted Platform Module (per-platform root of trust). |
| X.509 | PKI certificate format. |
| Zero Trust | Architecture per NIST SP 800-207. |

---

## 13. Further reading

- NIST SP 800-53 Rev 5, 800-160 Vol 1/2, 800-207, 800-37 Rev 2
- NIST FIPS 140-3, 197 (AES), 180-4 (SHA-2), 202 (SHA-3), 203-205 (PQC)
- ISO/IEC 15408, 27001/27002
- Saltzer & Schroeder (1975)
- OWASP ASVS, Top 10, Top 10 LLM
- NIST SP 800-88 Rev 1 (tying back to Domain 2 sanitization)

---

## End of Domain 3 Detailed Notes

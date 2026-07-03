/**
 * Security+ (SY0-701) in-depth lesson notes keyed by topic ID from
 * exam-curriculum.ts (SECURITY_PLUS). Rendered as a supplementary
 * "In-Depth Notes" markdown block beneath the structured course-data lesson.
 *
 * AI-generated study material aligned to the CompTIA Security+ SY0-701
 * objectives. Requires human SME review before publication.
 */
export const SECURITY_PLUS_LESSON_CONTENT: Record<string, string> = {
  sp_crypto: `
## Cryptographic Solutions (SY0-701 Objective 1.4)

Cryptography protects data in three states: **at rest**, **in transit**, and
**in use**. Security+ tests whether you can pick the right primitive for a
goal — confidentiality, integrity, authentication, or non-repudiation.

### Symmetric vs Asymmetric

**Symmetric encryption** uses one shared secret key for both encryption and
decryption. It is **fast** and ideal for bulk data. The catch is **key
distribution** — getting the shared key to the other party securely. The
algorithm to know is **AES** (128/192/256-bit block cipher, the modern
standard). Older/weaker symmetric ciphers include **3DES**, **Blowfish**, and
**RC4** (a broken stream cipher — expect it as a "what is deprecated" answer).

**Asymmetric encryption** uses a **key pair**: a public key and a private key
that are mathematically linked. Whatever one key encrypts, only the other can
decrypt. It solves key distribution but is **slow**, so it is used to exchange
keys and to sign, not to encrypt large files. The algorithms to know are
**RSA** (based on integer factorization, large keys like 2048/4096 bits) and
**ECC** (elliptic curve — same strength as RSA with much smaller keys, so it
is preferred on mobile and IoT). **Diffie-Hellman (DH/ECDH)** is a **key
exchange** method, not bulk encryption.

- Exam trap: confidentiality **to** a recipient means encrypt with the
  **recipient's public key** (only their private key opens it).
- Exam trap: **hybrid** systems use asymmetric crypto to exchange a symmetric
  session key, then symmetric crypto for the actual data. TLS works this way.

### Hashing and Digital Signatures

**Hashing** is a **one-way** function producing a fixed-length digest. It
provides **integrity**, not confidentiality — you cannot reverse a hash. Know
**SHA-256/SHA-2** (current) and **SHA-1/MD5** (broken, collision-prone).

**Salting** adds random data to each password before hashing so identical
passwords produce different digests, defeating **rainbow tables**. **Key
stretching** (bcrypt, PBKDF2, scrypt, Argon2) makes brute force slow.

A **digital signature** = hash of the message encrypted with the sender's
**private key**. It provides **integrity, authentication, and
non-repudiation**. The recipient verifies with the sender's **public key**.
Note the reversal from encryption: you sign with private, verify with public.

### PKI, Certificates, and TLS

**PKI** (Public Key Infrastructure) binds a public key to an identity via an
**X.509 certificate** issued by a trusted **Certificate Authority (CA)**. The
chain of trust runs from a **root CA** through **intermediate CAs** to the
leaf certificate. Revocation is checked via a **CRL** (Certificate Revocation
List) or **OCSP** (real-time status). A **CSR** requests a certificate; the
CA signs it. **Certificate pinning** hard-codes an expected cert to resist
rogue CAs.

**TLS** secures data in transit using a handshake that authenticates the
server via its certificate, agrees on cipher suites, and derives a symmetric
session key (via ephemeral DH for **perfect forward secrecy**). Remember: TLS
replaced SSL, which is deprecated.
`,
  sp_controls: `
## Security Controls & Foundational Concepts (SY0-701 Objectives 1.1, 1.2)

CompTIA loves to test the **category-vs-type** distinction. Every control has
BOTH a category (what kind of thing it is) and a type (what it does). Do not
confuse the two lists.

### Control Categories (the WHAT)

- **Technical** — implemented through technology: firewalls, encryption, MFA,
  antivirus, access control lists. Also called logical controls.
- **Managerial** — administrative decisions and oversight: risk assessments,
  security policies, background checks, planning.
- **Operational** — carried out by people day to day: security guards,
  awareness training, incident response, change management.
- **Physical** — tangible barriers: fences, locks, bollards, badges, mantraps,
  lighting, cameras (as hardware).

### Control Types (the FUNCTION)

- **Preventive** — stops an incident before it happens (firewall rule, MFA,
  least privilege).
- **Deterrent** — discourages an attacker but does not physically stop them
  (warning banner, "Beware of Dog" sign, visible cameras).
- **Detective** — identifies an incident in progress or after (IDS, log
  review, SIEM alerts, motion sensors).
- **Corrective** — fixes/restores after an incident (backups/restore, patching
  the exploited flaw, quarantining malware).
- **Compensating** — an alternative when the primary control is not feasible
  (network segmentation because a legacy system cannot be patched).
- **Directive** — directs behavior via policy or instruction (acceptable use
  policy, procedures, signage that instructs).

Exam trap: a camera can be **deterrent** (visible, discourages), **detective**
(records evidence), and is **physical** by category — context decides the type.

### CIA Triad and AAA

**Confidentiality** (keep data secret — encryption), **Integrity** (keep data
accurate/unaltered — hashing, digital signatures), **Availability** (keep
systems reachable — redundancy, backups). The opposite triad **DAD**
(Disclosure, Alteration, Denial) names the failures.

**AAA** = **Authentication** (prove who you are), **Authorization** (what you
may access), **Accounting** (log what you did). **Non-repudiation** means a
party cannot deny an action — provided by **digital signatures** and audit
logs.

### Zero Trust

Zero Trust assumes **no implicit trust**; verify every request. It splits into
a **control plane** and a **data plane**.

- **Control plane** components: the **Policy Engine** (makes the allow/deny
  decision), the **Policy Administrator** (executes the decision, issues
  tokens/credentials), plus **adaptive identity**, **threat scope reduction**,
  and **policy-driven access control**.
- **Data plane** components: the **subject/system**, the **Policy Enforcement
  Point (PEP)** that actually enforces the decision, and **implicit trust
  zones**.

Remember: the **Policy Engine decides**, the **PEP enforces**. A **gap
analysis** compares the current security posture against a desired framework
(like NIST CSF) to find missing controls.
`,
  sp_malware: `
## Malware Types & Indicators (SY0-701 Objective 2.4)

Malware ("malicious software") is categorized by how it spreads and what it
does. Security+ tests you on distinguishing look-alike types and recognizing
**indicators of compromise (IoCs)**.

### Self-Replicating and Delivery

- **Virus** — attaches to a file or program and requires **user action** (open
  the file) to run and spread. Needs a host.
- **Worm** — **self-propagating** across networks with **no user interaction**,
  exploiting vulnerabilities. Consumes bandwidth as it spreads. This is the key
  virus-vs-worm distinction: user action required or not.
- **Trojan** — disguised as legitimate software; the user installs it
  willingly. Does not self-replicate. A **RAT (Remote Access Trojan)** grants
  attacker remote control.

### Payload-Focused

- **Ransomware** — encrypts files and demands payment; modern strains also
  **exfiltrate** data first for double extortion.
- **Rootkit** — hides deep in the OS (often kernel level) to conceal itself and
  maintain privileged persistence; very hard to detect from within the running
  system. May require boot-level or offline scanning.
- **Fileless malware** — lives in **memory** and abuses legitimate tools like
  PowerShell or WMI ("living off the land"), leaving little on disk to detect.
- **Logic bomb** — dormant code that triggers on a **condition** (a date, an
  event, a user being deleted from payroll). Not a file type you scan for; you
  find it via code review.
- **Spyware** — secretly collects user activity and data.
- **Keylogger** — records keystrokes to steal credentials (hardware or
  software).
- **Bloatware** — unwanted preinstalled software; not inherently malicious but
  expands attack surface and wastes resources. New to SY0-701.
- **Bots / botnet** — infected hosts (zombies) remotely commanded via **C2
  (command and control)** for DDoS, spam, or crypto-mining.

### Indicators of Compromise

Watch for: **account lockouts**, impossible-travel logins, **unusual outbound
traffic** or beaconing to unknown IPs, resource **consumption** spikes, new or
unauthorized accounts, **missing/altered logs**, **blocked content** and
disabled security tools, and unexpected persistence (new scheduled tasks or
services).

Exam tip: the fastest way to answer malware questions is to key on the
distinguishing verb — does it **self-replicate** (worm), need a **host and
user** (virus), **encrypt** (ransomware), **hide** (rootkit), **trigger on a
condition** (logic bomb), or run **in memory** (fileless).
`,
  sp_social_eng: `
## Social Engineering (SY0-701 Objective 2.2)

Social engineering attacks the **human**, not the machine. CompTIA expects you
to name the specific technique from a scenario and to recognize the
**psychological principle** being exploited.

### Techniques

- **Phishing** — fraudulent **email** at scale to harvest credentials or
  deliver malware.
- **Spear phishing** — phishing **targeted** at a specific person or group
  using personalized detail.
- **Whaling** — spear phishing aimed at **high-value executives** (the "big
  fish" — CEO, CFO).
- **Vishing** — phishing over **voice/phone** calls.
- **Smishing** — phishing over **SMS/text** messages.
- **BEC (Business Email Compromise)** — attacker compromises or spoofs a
  trusted internal/executive account to authorize fraudulent wire transfers or
  data release. Often overlaps with whaling but the defining trait is the
  **abuse of a business email identity** to trigger financial action.
- **Pretexting** — inventing a believable **scenario/backstory** to justify the
  request (posing as IT support, an auditor, a delivery driver). Pretexting
  usually underpins the other attacks.
- **Watering hole** — compromising a **third-party website the target group is
  known to visit**, so victims infect themselves by browsing normally.
- **Typosquatting / URL hijacking** — registering **misspelled domains**
  (goggle-dot-com) to catch mistyped traffic. Related: **pharming** redirects
  DNS to a malicious site.
- **Impersonation** and **tailgating/piggybacking** (following someone through
  a secured door) are physical-world social engineering.
- **Disinformation / misinformation** campaigns — new SY0-701 emphasis on
  influence operations spreading false narratives.

### Principles of Influence

CompTIA maps these Cialdini-style levers directly to attacks:

- **Authority** — pose as someone in charge (the CEO, law enforcement, IT).
- **Urgency** — demand immediate action so the victim cannot think ("do this in
  the next 10 minutes").
- **Scarcity** — limited supply/time ("only 3 licenses left").
- **Social proof (consensus)** — "everyone on your team already did this."
- **Intimidation** — threats and pressure ("your account will be closed").
- **Familiarity (liking)** — build rapport, pretend to be a friend or known
  colleague.
- **Trust** — establish credibility over time before the ask.

Exam tip: urgency + authority is the classic BEC/whaling combination. When a
question describes the attacker creating time pressure while claiming to be an
executive, name the **principle** they ask about, not just the attack. Distinguish
vishing (voice) from smishing (SMS) from generic phishing (email) by the
**delivery channel**.
`,
  sp_authentication: `
## Identity & Access Management (SY0-701 Objectives 4.6, 1.2)

IAM answers "who are you, and what can you do?" — the **authentication** and
**authorization** halves of AAA.

### Authentication Factors and MFA

The five factors CompTIA tests:

- **Something you know** — password, PIN.
- **Something you have** — token, smart card, phone/authenticator app.
- **Something you are** — biometrics (fingerprint, face, iris).
- **Somewhere you are** — location/geolocation.
- **Something you do** — behavioral (typing pattern, gait).

**MFA** requires two or more **different** factors. Two passwords are NOT MFA
(same factor). A password + a texted code IS MFA (know + have). Biometrics have
error rates: **FAR** (false accept — a security risk), **FRR** (false reject —
an inconvenience), and the **CER/EER** crossover where the two are equal (lower
CER = better system).

### SSO, Federation, and Protocols

**SSO (Single Sign-On)** lets a user authenticate once and access many systems.
**Federation** extends identity across **organizations** (trust between an
identity provider and service providers).

- **SAML** — XML-based, the classic **enterprise web SSO / federation**
  standard. Involves an IdP, an SP, and the principal.
- **OAuth 2.0** — an **authorization** framework (grants access via tokens); it
  does NOT authenticate by itself.
- **OpenID Connect (OIDC)** — an **authentication** layer built on top of
  OAuth 2.0. Exam trap: OAuth = authorization, OIDC = authentication.
- **LDAP** — protocol/directory for storing and querying identity objects
  (Active Directory uses it). Secure it with **LDAPS**.
- **Kerberos** — ticket-based auth using a **KDC** that issues a **TGT**; uses
  mutual authentication and timestamps (so clock skew breaks it). Default
  Windows domain auth.
- **RADIUS vs TACACS+** — both are AAA protocols. **RADIUS** combines
  authentication+authorization, is mostly UDP, and encrypts only the password —
  common for network/Wi-Fi access. **TACACS+** is Cisco, uses **TCP**, encrypts
  the **entire payload**, and separates AAA — preferred for device
  administration.

### Access Control Models

- **DAC (Discretionary)** — the **data owner** decides who gets access (file
  permissions in Windows/Linux). Flexible but risky.
- **MAC (Mandatory)** — the **system/OS enforces labels** (Top Secret, Secret);
  no user override. Used in military/high-security.
- **RBAC (Role-Based)** — access by **job role/group** (nurse, accountant).
  Scales well in enterprises.
- **ABAC (Attribute-Based)** — decisions from **attributes/policies** (device,
  location, time, clearance). Most granular and dynamic.
- **Rule-Based** — global if/then rules applied to everyone (a firewall ACL,
  "no logins after 6 PM").

### Governing Principles

Apply **least privilege** (only the access needed) and **separation of
duties**. **PAM (Privileged Access Management)** secures admin accounts with
vaulting, session recording, and credential rotation. **JIT (Just-in-Time)**
access grants elevated rights **only for a limited window**, then revokes them
— minimizing standing privilege.
`,
  sp_incident: `
## Incident Response (SY0-701 Objective 4.8)

An incident is an event that actually **harms or threatens** the CIA of
systems. Security+ centers on the **NIST SP 800-61 lifecycle** and expects you
to know the order and what happens in each phase.

### NIST IR Lifecycle (memorize the order)

1. **Preparation** — done **before** any incident: build the IR plan, form the
   CSIRT, gather tools, train staff, run tabletop exercises, define
   communication plans. Everything you wish you had ready.
2. **Detection & Analysis** — identify that an incident is occurring (SIEM
   alerts, IDS, user reports), validate it is real, determine scope and
   severity, and prioritize/classify it.
3. **Containment** — limit the damage and stop the spread. **Short-term
   containment** (isolate the host, pull the network cable) buys time;
   **long-term containment** applies temporary fixes so business can continue.
   Preserve evidence while containing.
4. **Eradication** — remove the root cause: delete malware, disable breached
   accounts, close the exploited vulnerability, rebuild compromised systems
   from known-good images.
5. **Recovery** — restore systems to normal operations, validate they are
   clean, monitor closely for reinfection, and bring services back carefully.
6. **Lessons Learned** — a post-incident review (ideally within days) to
   document what happened, what worked, and how to improve. Feeds back into
   Preparation — the lifecycle is a loop.

Exam trap: containment comes **before** eradication. You stop the bleeding
before you cure the wound. And lessons learned is a distinct final phase, not
part of recovery.

### SANS Six-Step (equivalent)

SANS uses: **Preparation, Identification, Containment, Eradication, Recovery,
Lessons Learned (PICERL)**. Map it to NIST: SANS "Identification" = NIST
"Detection & Analysis." Same idea, different labels — CompTIA may show either.

### Supporting Concepts

- **Playbooks / runbooks** — predefined step-by-step procedures for a specific
  scenario (a phishing playbook, a ransomware playbook). Often automated via
  **SOAR**.
- **RTO** (Recovery Time Objective) = the maximum tolerable **downtime**;
  **RPO** (Recovery Point Objective) = the maximum tolerable **data loss**
  measured in time (how far back your last good backup is). Exam trap: RTO is
  about **time to restore**, RPO is about **how much data** you can lose. These
  targets, set during BIA, drive recovery decisions.
- **Chain of custody** — during and after an incident, if evidence may be used
  legally, document **who handled evidence, when, and why** at every handoff to
  **digital forensics**. Combine with **legal hold** and proper acquisition
  (image, then hash to prove integrity) to keep evidence admissible.
`,
  sp_risk: `
## Risk Management (SY0-701 Objective 5.2)

Risk = the likelihood a **threat** exploits a **vulnerability** and the
resulting **impact**. Security+ tests the vocabulary and the quantitative
formulas cold.

### Identification and Assessment

Risk assessments can be **one-time**, **continuous**, **ad hoc**, or
**recurring**. A **risk register** is the master document tracking each risk:
its description, owner, likelihood, impact, **risk score**, and treatment.
Related fields include **KRIs (Key Risk Indicators)** — metrics that give
early warning a risk is rising — and the **risk owner**.

### Qualitative vs Quantitative

- **Qualitative** uses subjective ratings — **High/Medium/Low**, or a
  probability-vs-impact **heat map**. Fast, but not in dollars.
- **Quantitative** assigns **monetary values** and uses formulas. Objective but
  data-hungry.

Memorize the quantitative chain:

- **AV** (Asset Value) — what the asset is worth.
- **EF** (Exposure Factor) — percentage of the asset lost in one event.
- **SLE = AV x EF** — Single Loss Expectancy, the dollar loss per single
  occurrence.
- **ARO** (Annualized Rate of Occurrence) — how many times per year it is
  expected to happen.
- **ALE = SLE x ARO** — Annualized Loss Expectancy, expected yearly loss.

Example: asset worth 100,000 USD, EF 30 percent -> SLE = 30,000. If it happens
twice a year, ARO = 2 -> ALE = 60,000. A control is worth buying only if it
costs **less than the ALE reduction** it delivers.

### Appetite, Tolerance, and Treatment

**Risk appetite** is the broad amount of risk an organization is **willing to
accept** to meet objectives (expansionary, conservative, neutral). **Risk
tolerance / threshold** is the acceptable **variance** around a specific risk.

Four treatment strategies (know each verb):

- **Accept** — take no action; the cost of control exceeds the risk. May require
  **exemption/exception** sign-off.
- **Avoid** — eliminate the risk by not doing the activity (discontinue the
  feature).
- **Transfer (share)** — shift financial impact to a third party, classically
  **insurance** or outsourcing.
- **Mitigate** — reduce likelihood or impact by applying controls (patch,
  firewall, training).

**Residual risk** is what remains **after** controls are applied. **Inherent
risk** is the level **before** any controls.

### Business Impact Analysis

A **BIA** identifies critical processes and the impact of their loss, and is
where **RTO, RPO, MTD** (Maximum Tolerable Downtime), **MTBF** (mean time
between failures — reliability), and **MTTR** (mean time to repair) are
established. Exam trap: **MTBF** measures how long between failures, **MTTR**
measures how long to fix — do not swap them.
`,
  sp_network_design: `
## Secure Network Architecture (SY0-701 Objectives 3.2, 4.1)

Secure design layers controls so no single failure exposes everything —
**defense in depth**. Security+ tests placement of devices and the vocabulary
of segmentation.

### Segmentation

**Segmentation** divides the network so a compromise in one area cannot freely
reach others, shrinking the **attack surface** and limiting lateral movement.

- **VLANs** logically separate hosts at Layer 2 regardless of physical
  location, isolating broadcast domains and traffic groups.
- **Screened subnet (formerly DMZ)** is a buffer zone between the untrusted
  internet and the trusted internal LAN, hosting public-facing servers (web,
  mail, DNS) behind firewalls so external users never touch the internal
  network directly.
- **Micro-segmentation** enforces policy down to the **individual workload**,
  the practical implementation of Zero Trust east-west controls (often via
  software-defined networking).
- An **air gap** is total physical isolation — no network path at all.

### Defense in Depth and Zero Trust

**Defense in depth** stacks multiple, overlapping controls (perimeter firewall,
network IPS, host antivirus, encryption, MFA). **Zero Trust networking** drops
implicit trust based on network location — every request is authenticated and
authorized regardless of whether it originates inside the perimeter.

### Firewalls, IDS/IPS, and NAC

- **Stateful firewall** tracks connection state; a **NGFW (Next-Generation
  Firewall)** adds application awareness, deep packet inspection, and IPS.
- **WAF (Web Application Firewall)** operates at Layer 7 to block web attacks
  like SQL injection and XSS — it protects **applications**, not the whole
  network.
- **IDS vs IPS** — the classic exam pair. An **IDS** is **passive**: it
  **detects and alerts** but does not stop traffic (out of band). An **IPS** is
  **active/inline**: it can **block/drop** malicious traffic in real time.
  Trade-off: an IPS false positive can break legitimate traffic.
- **NAC (Network Access Control)** checks a device's posture (patches,
  antivirus, configuration) **before** granting network access, often quarantining
  non-compliant hosts. Frequently uses **802.1X** port-based authentication.

### SD-WAN and SASE

- **SD-WAN** centrally manages and optimizes WAN links across sites using
  software, routing traffic intelligently over multiple connections.
- **SASE (Secure Access Service Edge)** converges networking (SD-WAN) with
  cloud-delivered security (SWG, CASB, ZTNA, FWaaS) into one edge service —
  ideal for remote/cloud-first workforces.

### Ports and Protocols to Know

Memorize secure-vs-insecure pairs: **HTTP 80 / HTTPS 443**, **FTP 20-21 /
SFTP 22 (SSH) / FTPS 989-990**, **Telnet 23 (insecure) / SSH 22**,
**SMTP 25 / SMTPS 587-465**, **DNS 53**, **DNSSEC** for DNS integrity,
**LDAP 389 / LDAPS 636**, **RDP 3389**, **SNMPv3 161-162** (v3 adds
encryption). Exam tip: when asked to "secure" a legacy protocol, pick the
encrypted variant on its dedicated port (Telnet -> SSH, HTTP -> HTTPS,
LDAP -> LDAPS).
`,
};

export function getSecurityPlusLessonContent(topicId: string): string | null {
  return SECURITY_PLUS_LESSON_CONTENT[topicId] ?? null;
}

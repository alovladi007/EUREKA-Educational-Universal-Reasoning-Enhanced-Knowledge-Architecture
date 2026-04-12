# Domain 5 — Identity and Access Management: Detailed Notes

> **AI-generated study material.** (ISC)² CISSP Exam Outline effective April 15, 2024. Weight: **13%**.

## 1. Overview

IAM is the discipline of establishing and enforcing who can do what. CISSP defines the flow
as **identification → authentication → authorization → accountability (IAAA)**. Each step has
its own primitives, failure modes, and CISSP vocabulary. Modern IAM extends from on-prem
directories (Active Directory, LDAP) to cloud identity providers (Okta, Azure AD/Entra ID,
Ping, AWS IAM, Google Workspace) and to federated trust across organizations.

### Key themes

1. **Identity is the new perimeter.** When network location cannot be trusted (zero trust),
   identity becomes the primary basis for access decisions.
2. **Authentication is not authorization.** Proving who you are is distinct from deciding
   what you can do. OAuth 2.0 is an authorization framework; OIDC adds authentication
   on top.
3. **Phishing-resistant MFA is now the bar.** SMS codes, TOTP, and push notifications
   have been defeated repeatedly; FIDO2/WebAuthn tokens are the current standard for
   high-assurance authentication.
4. **Privileged access is a separate discipline.** Admin accounts require more than
   user access does: JIT, approval workflows, session recording, credential vaulting,
   break-glass procedures.
5. **Joiner-mover-leaver at scale.** Identity lifecycle automation is the difference
   between a governance success and a pile of orphaned accounts.

## 2. Sub-objectives (verify against current outline)

- **5.1** Control physical and logical access to assets
- **5.2** Manage identification and authentication of people, devices, and services
- **5.3** Federated identity with a third-party service
- **5.4** Implement and manage authorization mechanisms
- **5.5** Manage the identity and access provisioning lifecycle
- **5.6** Implement authentication systems

---

## 3. Sub-objective 5.1 — Physical and logical access to assets

### Concepts

Assets fall into two categories: physical (facilities, hardware, media) and logical
(data, applications, systems). Access controls for each are layered and follow the
same principles: least privilege, need to know, separation of duties, defense in depth.

Physical access control includes locks, badges, biometrics, mantraps (Domain 3), CCTV,
guards. Logical access control includes authentication systems, authorization engines,
policy enforcement points, and audit.

Access control **types** (per Domain 1 §1.9):
- Administrative (policies, procedures, training)
- Technical (firewalls, encryption, IAM systems)
- Physical (locks, guards, barriers)

Access control **categories** by function: preventive, detective, corrective, deterrent,
recovery, compensating, directive.

### Exam nuance

When a scenario asks which access control applies to both physical and logical assets,
the answer is usually an administrative control (policy) or a unifying principle
(least privilege, need to know).

---

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

### SSO patterns

- **Enterprise SSO**: single authentication to an IdP, then SSO to connected applications. Typically SAML or OIDC.
- **Kerberos SSO**: within an AD domain, users authenticate once at login and Kerberos tickets provide SSO to domain services.
- **Cloud SSO**: IdP federates to cloud providers and SaaS via SAML or OIDC.
- **Desktop SSO**: Windows integrated authentication using Kerberos or NTLM.

### Frameworks

- Kerberos v5 (RFC 4120)
- LDAP (RFC 4510+) for directory services
- SCIM for user provisioning

### Misconceptions

- "SSO means one password." SSO means one authentication per session, not one password.
  SSO typically improves security by reducing password count and centralizing MFA.

### Exam nuance

- Kerberoasting questions want you to recognize the attack and the defense (strong service account passwords).
- SSO questions want you to pick the protocol that matches the scenario (SAML for enterprise SaaS, OIDC for modern web/mobile, Kerberos for AD domains).

### Mnemonics

- **"KDC = AS + TGS"**
- **"TGT to get service tickets; service ticket to get service"**

---

## 9. Cheat sheet

- **IAAA**: Identification, Authentication, Authorization, Accountability
- **MFA factors**: Know / Have / Are / Do / Somewhere (at least 2 different types)
- **Phishing-resistant MFA**: FIDO2/WebAuthn, smart cards
- **AAL1/2/3**: NIST authentication assurance levels
- **Access models**: DAC (owner), MAC (system), RBAC (role), ABAC (attribute), RuBAC (rule)
- **SAML / OIDC / OAuth**: SAML for enterprise SSO, OIDC for modern auth, OAuth for delegation
- **Kerberos**: KDC = AS + TGS; TGT + service tickets; attacks: pass-the-hash, pass-the-ticket, Kerberoasting, Golden/Silver tickets
- **JML**: Joiner-Mover-Leaver; recertification required
- **PAM**: credential vaulting, JIT, approval, session recording, bastion hosts, break-glass
- **Biometrics**: FAR vs FRR; CER is where they cross
- **FAR = Type II; FRR = Type I**

## 10. Glossary (condensed)

| Term | Meaning |
|---|---|
| AAL | NIST authenticator assurance level |
| ABAC | Attribute-Based Access Control |
| DAC | Discretionary Access Control |
| FAR / FRR | False Accept Rate / False Reject Rate (biometrics) |
| Federated identity | Cross-organization trust for authentication |
| FIDO2 / WebAuthn | Phishing-resistant authentication standard |
| IAAA | Identification, Authentication, Authorization, Accountability |
| IdP / SP | Identity Provider / Service Provider |
| JIT | Just-In-Time privileged access |
| JWT | JSON Web Token |
| Kerberos | Ticket-based authentication protocol |
| KDC | Key Distribution Center (AS + TGS) |
| MAC | Mandatory Access Control |
| OAuth 2.0 | Authorization framework |
| OIDC | OpenID Connect (authentication layered on OAuth) |
| PAM | Privileged Access Management |
| PDP / PEP / PAP / PIP | Policy Decision / Enforcement / Administration / Information Point |
| PKI | Public Key Infrastructure |
| RBAC | Role-Based Access Control |
| SAML | Security Assertion Markup Language |
| SSO | Single Sign-On |
| TGT | Ticket Granting Ticket |

## 11. Further reading

- NIST SP 800-63 (A, B, C); 800-207; 800-53 AC/IA families
- ISO/IEC 24760, 29115, 29146
- RFC 4120 (Kerberos), 6749 (OAuth 2.0), 7636 (PKCE), 7519 (JWT), OIDC Core
- FIDO Alliance specifications
- SCIM (RFC 7643, 7644)

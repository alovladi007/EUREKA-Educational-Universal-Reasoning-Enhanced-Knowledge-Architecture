# Domain 8 — Software Development Security: Detailed Notes

> **AI-generated.** Weight: 10%. Verify sub-objectives against current (ISC)² outline.

## 1. Overview

Domain 8 is the software security domain. It covers secure SDLC, code-level vulnerabilities, application security controls, DevSecOps integration, secure coding practices, and software supply chain security. The domain is smaller than Domain 3 but heavily interconnected with Domains 2 (data), 3 (crypto, design principles), 5 (auth), 6 (testing), and 7 (operations).

### Themes

1. **Security from design, not just test.** Threat modeling and secure design early prevents classes of vulnerability that no amount of testing can catch later.
2. **Shift left, but shift everywhere.** Early detection is cheaper, but late detection (runtime, production) catches things early detection misses. Both matter.
3. **Supply chain is primary risk.** Modern applications are mostly someone else's code; dependency management is first-class security work.
4. **Secure defaults.** Frameworks should be secure out of the box so developers do not have to become security experts to ship safe code.
5. **Culture and training.** Developers are the first line of defense; security programs must work with them, not against them.

## 2. Sub-objectives (verify against current outline)

- **8.1** Understand and integrate security in the SDLC
- **8.2** Identify and apply security controls in software development ecosystems
- **8.3** Assess the effectiveness of software security
- **8.4** Assess security impact of acquired software
- **8.5** Define and apply secure coding guidelines and standards

---

## 3. Secure SDLC

### Phases
1. **Requirements** — security requirements captured alongside functional requirements. Includes compliance, privacy, threat modeling inputs, and security objectives.
2. **Design** — threat modeling (Shostack 4 questions, STRIDE, PASTA), secure architecture patterns, selection of frameworks and libraries, review by security team.
3. **Build** — secure coding practices, code review (manual and automated), SAST/SCA in IDE and CI, developer training.
4. **Test** — DAST, IAST, fuzzing, penetration testing, integration with QA.
5. **Deploy** — secure configuration, IaC scanning, secrets management, deployment gates.
6. **Operate** — monitoring, runtime protection (RASP/WAF), incident response, vulnerability management.

### Development methodologies
- **Waterfall** — sequential phases, less flexible but predictable.
- **Agile** — iterative, adaptive; security must be integrated per sprint.
- **DevOps** — tight integration of development and operations with automation.
- **DevSecOps** — security integrated into DevOps pipeline.

### Secure SDLC frameworks
- **Microsoft SDL** — canonical secure SDLC. Stages: training, requirements, design, implementation, verification, release, response.
- **NIST SP 800-218 (SSDF)** — Secure Software Development Framework. Four practice groups: Prepare the Organization, Protect the Software, Produce Well-Secured Software, Respond to Vulnerabilities.
- **OWASP SAMM** — Software Assurance Maturity Model. Provides a measurable maturity framework.
- **BSIMM** — Building Security In Maturity Model. Descriptive benchmark of what real software security programs do.
- **ISO/IEC 27034** — application security guidelines.

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

## 6. Secure coding practices

### Input validation
- **Allowlist** preferred over blocklist.
- Validate at every layer (client, API, database).
- Client-side validation is for UX, not security.
- Canonicalize before validating to avoid encoding bypasses.

### Output encoding
- Different contexts need different encoding: HTML, JavaScript, CSS, URL, SQL, OS command.
- Use framework-provided encoding functions; do not write your own.

### Authentication and session
- See Domain 5 for full coverage.
- Use well-vetted frameworks; do not implement from scratch.
- Secure session tokens (httpOnly, Secure, SameSite).
- Proper session invalidation on logout.

### Error handling
- Do not leak stack traces or internal details to users.
- Log errors with sufficient context for debugging.
- Fail safely (default deny).

### Logging
- Log security-relevant events (authentication, authorization, input validation failures, privilege changes).
- Do not log sensitive data (passwords, tokens, PII beyond what is necessary).
- Use structured logging for search and analysis.

### Cryptography
- See Domain 3.
- Use standard libraries (libsodium, AWS/Azure/GCP KMS, OpenSSL with modern APIs).
- Never write custom crypto.
- Rotate keys; manage via HSM or KMS.

### Deserialization
- Avoid deserializing untrusted data.
- Use safe formats (JSON with strict schema) rather than Java/Python/PHP native serialization.
- Validate structure before processing.

### Memory safety
- Memory-unsafe languages (C, C++) require extra care.
- Consider memory-safe alternatives (Rust, Go) for new code.
- Use compiler-level protections (ASLR, DEP, stack canaries).

## 7. Application security testing

Cross-reference Domain 6. Main tool categories:

- **SAST** — source code analysis.
- **DAST** — running application testing.
- **IAST** — instrumented runtime analysis.
- **SCA** — dependency vulnerability scanning.
- **RASP** — runtime application self-protection.
- **Fuzzing** — randomized input generation.
- **Manual penetration testing** — human testing that automation misses.
- **Bug bounty** — crowd-sourced external testing.

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

## 9. Cheat sheet

- OWASP Top 10 2021: A01 Broken Access Control, A02 Crypto, A03 Injection, A04 Insecure Design, A05 Misconfiguration, A06 Vulnerable Components, A07 Authn, A08 Integrity, A09 Logging, A10 SSRF
- SAST reads code, DAST probes running, IAST watches from inside, SCA lists dependencies
- Parameterized queries prevent SQL injection
- Input validation: allowlist over blocklist, validate at every layer
- Output encoding: context-specific (HTML vs JS vs SQL vs OS)
- NIST SSDF: PO, PS, PW, RV — four practice groups
- Microsoft SDL: training, requirements, design, implementation, verification, release, response
- SBOM: SPDX or CycloneDX
- Sigstore/cosign for supply chain signing
- Don't roll your own crypto; don't roll your own deserialization; don't roll your own authentication

## 10. Glossary (condensed)

| Term | Meaning |
|---|---|
| BSIMM | Building Security In Maturity Model |
| DevSecOps | Security integrated into DevOps pipeline |
| IAST | Interactive Application Security Testing |
| IDOR | Insecure Direct Object Reference |
| NIST SSDF | Secure Software Development Framework (NIST SP 800-218) |
| OWASP | Open Web Application Security Project |
| OWASP ASVS | Application Security Verification Standard |
| OWASP SAMM | Software Assurance Maturity Model |
| RASP | Runtime Application Self-Protection |
| SAST | Static Application Security Testing |
| SCA | Software Composition Analysis |
| SBOM | Software Bill of Materials |
| SDL | Microsoft Security Development Lifecycle |
| SDLC | Software Development Lifecycle |
| SLSA | Supply chain Levels for Software Artifacts |
| SSRF | Server-Side Request Forgery |

## 11. Further reading

- NIST SP 800-218 SSDF
- NIST SP 800-160 (engineering trustworthy secure systems)
- OWASP Top 10, OWASP ASVS, OWASP SAMM, OWASP Cheat Sheet Series
- Microsoft SDL
- BSIMM annual reports
- CSA CCM
- Executive Order 14028
- SLSA framework

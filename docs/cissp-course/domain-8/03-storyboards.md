# Domain 8 — Software Development Security: Animation Storyboards

> 8 storyboards. Narration ~150 wpm.

| # | Concept | Duration | Tool |
|---|---|---|---|
| D8-01 | OWASP Top 10 in 90 seconds | 90 s | AE |
| D8-02 | SQL injection defeated by parameterized queries | 110 s | Manim |
| D8-03 | DevSecOps pipeline with security gates | 130 s | AE |
| D8-04 | SSRF attack and mitigation | 105 s | AE |
| D8-05 | SBOM and software supply chain | 100 s | AE |
| D8-06 | Insecure deserialization attack | 115 s | AE |
| D8-07 | NIST SSDF four practice groups | 90 s | AE |
| D8-08 | Threat modeling the Shostack four questions | 95 s | AE |

---

## D8-01 · OWASP Top 10 (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Ten numbered boxes in a grid | "The current OWASP Top 10, 2021 edition. Ten risk categories that cover most real-world web application vulnerabilities." |
| 2 | Highlight A01 Broken Access Control | "A01: Broken Access Control. The most common category — authorization not correctly enforced." |
| 3 | Highlight A02 Cryptographic Failures | "A02: Cryptographic Failures. Weak crypto, missing encryption, poor key management." |
| 4 | Highlight A03 Injection | "A03: Injection. SQL, command, LDAP. Prevented by parameterized queries and input validation." |
| 5 | A04 Insecure Design, A05 Security Misconfiguration | "A04 Insecure Design — design-time flaws. A05 Security Misconfiguration — defaults, unnecessary features." |
| 6 | A06 Vulnerable Components, A07 Authentication Failures | "A06 Vulnerable Components — outdated dependencies. A07 Auth Failures — weak authentication and session handling." |
| 7 | A08 Integrity Failures, A09 Logging Failures, A10 SSRF | "A08 Integrity Failures — trust in unverified updates. A09 Logging Failures — inadequate detection. A10 SSRF — Server-Side Request Forgery." |
| 8 | Summary: A01-A10 covers ~95% of real-world web attacks | "Memorize them. These ten cover the overwhelming majority of real-world web application attacks." |

---

## D8-02 · SQL Injection and Parameterized Queries (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Vulnerable code: `SELECT * FROM users WHERE name = '` + username + `'` | "Vulnerable SQL. The username is concatenated directly into the query string." |
| 2 | Attacker enters `admin' OR '1'='1` as username | "Attacker enters this username. The resulting query becomes SELECT * FROM users WHERE name = 'admin' OR '1'='1'. The OR condition is always true. Every user is returned." |
| 3 | Attacker enters `admin'; DROP TABLE users; --` | "Attacker enters this. DROP TABLE users. Every user is deleted." |
| 4 | Parameterized query: `SELECT * FROM users WHERE name = ?` with bound parameter | "Parameterized query. The ? is a placeholder. The value is bound separately. The database knows the value is data, not SQL." |
| 5 | Same attacker input, now treated as literal data | "Now the same input is just a literal string. The database looks for a user literally named 'admin' OR '1'='1'. Not found. No match. Attack fails." |
| 6 | Summary: Parameterized queries make injection structurally impossible | "Parameterized queries do not filter dangerous characters. They separate code from data. Injection is structurally impossible." |

---

## D8-03 · DevSecOps Pipeline (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A CI/CD pipeline from commit through production | "A DevSecOps pipeline. Security integrated at every stage." |
| 2 | Pre-commit: IDE integration, linters, fast SAST | "Pre-commit: developer sees issues in their IDE as they type. Fast linters and SAST catch obvious problems." |
| 3 | Commit: secret scanning, SCA, broader SAST | "Commit: secret scanning catches credentials accidentally committed. SCA flags known-vulnerable dependencies. Broader SAST runs against the whole change." |
| 4 | Build: container scan, SBOM generation, IaC scanning, policy as code | "Build: container images scanned. SBOM generated. IaC templates scanned for misconfigurations. Policy-as-code enforces organizational rules." |
| 5 | Test: DAST, IAST, security-focused tests | "Test: DAST probes the running application. IAST observes internal behavior. Security-focused tests validate specific controls." |
| 6 | Pre-deploy: final security gate, compliance check, approval | "Pre-deploy: final security gate combines findings from all earlier stages. Compliance checks. Approval workflow for sensitive deployments." |
| 7 | Runtime: RASP, WAF, monitoring, anomaly detection | "Runtime: RASP watches from inside the application. WAF at the edge. Monitoring catches anomalies the earlier stages missed." |
| 8 | Summary: shift left for speed, shift everywhere for depth | "Shift left for speed — catch issues early when they are cheap to fix. Shift everywhere for depth — no single stage catches everything." |

---

## D8-04 · SSRF Attack and Mitigation (105 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A web application that accepts a URL and fetches content from it | "A web application accepts a URL parameter and fetches content from it. A simple image preview or URL shortener." |
| 2 | Attacker submits `http://169.254.169.254/latest/meta-data/` (cloud metadata service) | "Attacker submits a URL pointing to the cloud provider's metadata service — the internal endpoint that reveals instance credentials, user data, and configuration." |
| 3 | Application fetches and returns credentials | "The application fetches and returns the metadata. Cloud credentials exposed. Attacker uses them to pivot into the cloud environment." |
| 4 | Mitigations: validate URLs, restrict egress, block metadata endpoints, use IMDSv2 | "Mitigations: validate user-supplied URLs against an allowlist of destinations, restrict egress from the application server to only necessary endpoints, block cloud metadata endpoints specifically, and use IMDSv2 which requires a token-based request that cannot be forged via SSRF." |
| 5 | Real-world impact: Capital One 2019 | "Capital One 2019 was an SSRF that exploited exactly this pattern. 100 million customer records exfiltrated. A well-known case study for why SSRF mitigations matter." |

---

## D8-05 · SBOM and Supply Chain (100 s)

| # | Visual | Narration |
|---|---|---|
| 1 | An application above water; many dependencies below | "Modern application above water. Everything you depend on below." |
| 2 | Log4j highlighted in the dependency graph | "In December 2021, one library in that graph — Log4j — turned out to contain a remote code execution vulnerability. Organizations had to answer 'do we use Log4j?' quickly." |
| 3 | SBOM as a document listing every dependency | "SBOM: Software Bill of Materials. A machine-readable list of every component. SPDX or CycloneDX format." |
| 4 | SBOM integration with vulnerability feed triggers immediate alert | "Integrated with vulnerability feeds, an SBOM lets you answer 'do we use this component' in seconds instead of weeks. When Log4Shell was disclosed, organizations with SBOM programs triaged their exposure immediately." |
| 5 | Executive Order 14028 made SBOM a federal procurement requirement | "US Executive Order 14028 made SBOM a federal procurement requirement in 2021. NIST SSDF formalized supply chain practices. Sigstore and cosign added cryptographic signing." |
| 6 | Summary: visibility first, then signing, then provenance | "The supply chain security stack: visibility (SBOM), signing (cosign), and provenance (SLSA framework). Start with visibility, add the others over time." |

---

## D8-06 · Insecure Deserialization (115 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Serialized object in a cookie or POST body | "A serialized object in a cookie, session token, or POST body. Java, Python, PHP, Ruby — all support native object serialization." |
| 2 | Server deserializes user-controlled data | "Server deserializes it. If the deserialization library allows instantiating arbitrary classes, the attacker can craft a payload that triggers code execution on deserialization — before any application-level validation runs." |
| 3 | Famous examples: Apache Struts CVE-2017-5638 (Equifax), various Java libraries | "Apache Struts CVE-2017-5638, the vulnerability that led to the Equifax breach, was a deserialization attack. Many Java libraries have had similar issues." |
| 4 | Defenses: never deserialize untrusted data, use safe formats (JSON with strict schema), validate before processing | "Defenses: never deserialize untrusted data using native serialization. Use safe formats like JSON with strict schema validation. Validate the structure before processing." |
| 5 | If native serialization is unavoidable: use allowlists of classes, integrity signing, sandboxing | "If native serialization is unavoidable: use allowlists of classes that can be deserialized, add integrity signing so tampering is detected, and sandbox the deserialization process." |

---

## D8-07 · NIST SSDF Four Practice Groups (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Four boxes labeled PO, PS, PW, RV | "NIST SP 800-218, the Secure Software Development Framework. Four practice groups." |
| 2 | PO: Prepare the Organization | "Prepare the Organization: policies, roles, training, tools. The foundation." |
| 3 | PS: Protect the Software | "Protect the Software: protect source code, protect the build, protect the release. This is where supply chain practices live." |
| 4 | PW: Produce Well-Secured Software | "Produce Well-Secured Software: design, implement, review, test. The core engineering discipline." |
| 5 | RV: Respond to Vulnerabilities | "Respond to Vulnerabilities: identify, analyze, remediate, disclose. The response loop." |
| 6 | Summary: PO sets the stage, PS secures the pipeline, PW secures the code, RV handles the aftermath | "PO sets the stage, PS secures the pipeline, PW secures the code, RV handles the aftermath. Executive Order 14028 made SSDF a federal supplier requirement." |

---

## D8-08 · Threat Modeling — Shostack 4 Questions (95 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Four questions displayed | "Adam Shostack's four questions. The simplest threat modeling framework." |
| 2 | Q1: What are we building? | "What are we building? Draw the system. Data flows. Trust boundaries. Assumptions." |
| 3 | Q2: What can go wrong? | "What can go wrong? Walk the system with STRIDE or PASTA. Identify threats against each element and each flow." |
| 4 | Q3: What are we going to do about it? | "What are we going to do about it? For each threat, decide: mitigate, transfer, accept, or avoid." |
| 5 | Q4: Did we do a good job? | "Did we do a good job? Validate with testing, pen tests, red team exercises. Update the model when findings emerge. Iterate." |
| 6 | Summary: simple questions, continuous practice | "Four questions. Simple to state. Hard to do well. Continuous practice, not a one-time exercise." |

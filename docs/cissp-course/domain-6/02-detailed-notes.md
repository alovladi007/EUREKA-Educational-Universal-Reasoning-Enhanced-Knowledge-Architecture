# Domain 6 — Security Assessment and Testing: Detailed Notes

> **AI-generated study material.** Weight: 12%. Align verbatim sub-objectives to current (ISC)² outline.

## 1. Overview

Domain 6 covers how we know whether security controls are working. It spans
assessment strategies, testing techniques, audit management, evidence
collection, and metrics for governance reporting.

### Themes
1. **Evidence over opinion.** Security effectiveness must be measurable and demonstrable.
2. **Independence matters.** Self-assessment is weaker than independent assessment.
3. **Depth over breadth for pentest.** A pentest that finds one critical path is more valuable than a scan that finds a thousand medium findings.
4. **Metrics drive governance.** Without KPIs and KRIs, the board cannot see whether the program is working.

## 2. Sub-objectives

- **6.1** Design and validate assessment, test, and audit strategies
- **6.2** Conduct security control testing
- **6.3** Collect security process data
- **6.4** Analyze test output and generate reports
- **6.5** Conduct or facilitate security audits

---

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

## 6. Sub-objective 6.4 — Analyze test output and generate reports

### Report consumers
- **Executive summary**: one page for the board, outcome framed, risk framed.
- **Technical report**: full findings for remediation teams.
- **Compliance letter**: attestation for auditors and customers.

### Findings structure
- **Description**: what was found.
- **Impact**: what could happen.
- **Likelihood**: how likely under the current state.
- **Severity**: combination of impact and likelihood.
- **Remediation**: specific steps to fix.
- **Evidence**: screenshots, logs, reproduction steps.

### False positives and false negatives
All testing tools have both. A report that ignores false positives wastes remediation effort; a report that ignores false negatives gives false confidence. Mature programs tune tools to balance the two.

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

## 8. Cheat sheet

- SAST reads, DAST probes, IAST watches, SCA inventories, RASP defends
- Red attacks, Blue defends, Purple learns, White coordinates
- SOC 1 for financial, SOC 2 for trust services, SOC 3 for public
- Type I is design, Type II is effectiveness (6-12 months)
- Authenticated scans > unauthenticated scans
- Assessment != remediation; findings must be acted on
- Continuous monitoring > point-in-time audit
- KPIs measure performance; KRIs measure risk

## 9. Glossary (condensed)

| Term | Meaning |
|---|---|
| ASV | Approved Scanning Vendor (PCI-DSS) |
| DAST | Dynamic Application Security Testing |
| IAST | Interactive Application Security Testing |
| KPI / KRI | Key Performance / Risk Indicator |
| MTTD / MTTR | Mean Time To Detect / Respond |
| Pentest | Penetration Test |
| PTES | Penetration Testing Execution Standard |
| Red / Blue / Purple team | Offensive / defensive / joint security exercises |
| RASP | Runtime Application Self-Protection |
| SAST | Static Application Security Testing |
| SCA | Software Composition Analysis |
| SOC 1/2/3 | AICPA service organization control reports |
| Type I / II | SOC report snapshot vs operating effectiveness |
| Fuzzing | Randomized input testing |
| Vulnerability scan | Signature-based known-vulnerability identification |

## 10. Further reading

- NIST SP 800-53A, 800-115, 800-137 (continuous monitoring)
- ISO/IEC 27001, 27002, 27007, 27008, 19011
- AICPA SSAE 18/21 and SOC 2 Trust Services Criteria
- OWASP Testing Guide, ASVS
- PTES

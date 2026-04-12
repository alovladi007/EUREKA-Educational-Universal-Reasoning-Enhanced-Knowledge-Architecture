# Domain 7 — Security Operations: Detailed Notes

> **AI-generated.** Weight: 13%. Verify sub-objectives against current (ISC)² outline.

## 1. Overview

Domain 7 is the operational heart of CISSP: detection, response, recovery, and day-to-day discipline. It covers investigations, logging and monitoring, configuration management, vulnerability management, patch management, incident response, disaster recovery, and physical operations.

### Themes

1. **Prevention is not enough; you must detect and respond.**
2. **Incident response is a lifecycle, not an event.**
3. **Backups are only useful if you can restore from them.**
4. **Change control prevents self-inflicted outages.**
5. **Investigations require evidence integrity from the first response.**

## 2. Sub-objectives (verify against current outline)

- **7.1** Understand and comply with investigations
- **7.2** Conduct logging and monitoring activities
- **7.3** Perform configuration management (CM), asset management, change management
- **7.4** Apply foundational security operations concepts
- **7.5** Apply resource protection
- **7.6** Conduct incident management
- **7.7** Operate and maintain detective and preventive measures
- **7.8** Implement and support patch and vulnerability management
- **7.9** Understand and participate in change management
- **7.10** Implement recovery strategies
- **7.11** Implement disaster recovery processes
- **7.12** Test disaster recovery plans
- **7.13** Participate in business continuity planning and exercises
- **7.14** Implement and manage physical security
- **7.15** Address personnel safety and security concerns

---

## 3. Investigations

(Cross-reference Domain 1 §1.5.) CISSP recognizes five investigation types: administrative, criminal, civil, regulatory, industry-standard. Each has a different burden of proof and different procedures. Evidence integrity follows RFC 3227 order of volatility (CPU/registers → memory → disk → archival) and requires forensically sound imaging, chain of custody, and adherence to the five evidence rules (authentic, accurate, complete, convincing, admissible). NIST SP 800-86 provides the US federal reference for integrating forensic techniques into incident response. ISO/IEC 27037 is the international counterpart.

**Key points:** preserve first, analyze second. Write blockers for disk imaging. Forensic images with cryptographic hashes. Document who touched what and when. Do not boot suspect systems before imaging. Engage legal early when criminal or civil investigation is possible. Consider eDiscovery obligations under the Federal Rules of Civil Procedure for litigation-adjacent investigations.

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

## 7. Incident response

**IR lifecycle (NIST SP 800-61 Rev 2):**

1. **Preparation** — policy, procedures, team, tools, training, exercises.
2. **Detection and analysis** — identifying that an incident has occurred; triage.
3. **Containment, eradication, recovery** — stopping the spread, removing the threat, restoring operations.
4. **Post-incident activity (lessons learned)** — debrief, update procedures, feed back into the program.

Containment has short-term (isolate the affected host) and long-term (segment the affected network area) phases. Eradication removes the attacker's presence (delete malware, close backdoors, rotate credentials, rebuild systems). Recovery restores operations and monitors for re-infection.

**IR team (CSIRT or SOC):** clear roles (lead, analyst, communicator, legal, executive liaison), 24/7 coverage for critical events, on-call rotation, pre-assigned responsibilities.

**Communications:** internal (management, affected teams), external (customers, regulators, law enforcement, media). Pre-drafted templates and a single spokesperson pattern.

**Legal and regulatory obligations:** breach notification timelines (GDPR 72 hours to supervisory authority, SEC 4 business days for material incidents at public companies, state laws for consumer notification, industry-specific rules).

**Insurance:** cyber insurance engagement at the appropriate time. Many policies require specific IR firms and processes.

**Playbooks:** specific runbooks for common incident types (ransomware, BEC, credential compromise, data exfiltration, DDoS, insider).

## 8. Disaster recovery

(Cross-reference Domain 1 §1.7 BCP/BIA.) Disaster recovery is the IT side of business continuity — restoring services after a disruption.

**Recovery strategies:**

- **Backup and restore** — traditional, slowest recovery.
- **Warm standby** — hardware in place, data current or near-current.
- **Hot standby** — fully operational failover environment.
- **Active-active** — both sites operating simultaneously; failover is automatic.
- **Cloud DR** — cloud region as secondary site, with replication and automation.
- **Multi-cloud** — redundancy across providers to eliminate provider-level SPOF.

**Backup strategies:**

- **Full, incremental, differential** — classic levels.
- **Snapshot** — point-in-time copy.
- **Replication** — continuous copy to a secondary location.
- **3-2-1 rule**: 3 copies, 2 different media, 1 offsite.
- **3-2-1-1-0**: adds 1 immutable/offline copy and 0 errors verified.
- **Air-gapped / immutable backups** — defense against ransomware destruction of backups.
- **Backup testing** — restores must be tested regularly; untested backups often fail.

**Recovery testing:** per Domain 1 lesson plan — checklist → tabletop → walkthrough → simulation → parallel → full interruption. Progressive levels of realism.

## 9. Physical security operations

**Personnel safety first** — always. No asset is worth a life.

**Access control for facilities:** badges, PIN, biometrics, mantraps, visitor management, escort requirements.

**Environmental:** HVAC, humidity, water detection, fire suppression (Domain 3).

**Surveillance:** CCTV, motion detection, intrusion alarms.

**Asset protection:** media storage, secure destruction, chain of custody for portable devices.

**Emergency response:** fire, medical, severe weather, security incident; evacuation plans and drills.

## 10. Cheat sheet

- IR lifecycle: Prepare → Detect & analyze → Contain, eradicate, recover → Lessons learned
- Evidence: preserve first, analyze second; RFC 3227 order of volatility
- Change types: standard, normal, emergency
- Backup rules: 3-2-1 (or 3-2-1-1-0); test restores
- MTTD and MTTR as primary SOC KPIs
- NIST SP 800-61 for IR, 800-86 for forensics, 800-92 for logging, 800-137 for continuous monitoring, 800-34 for contingency planning
- Breach notification: GDPR 72h, SEC 4 business days for material incidents
- Personnel safety always first in physical security

## 11. Glossary (condensed)

| Term | Meaning |
|---|---|
| CAB | Change Advisory Board |
| CSIRT | Computer Security Incident Response Team |
| eDiscovery | Electronic discovery for litigation |
| IR | Incident Response |
| MTTD / MTTR | Mean Time To Detect / Respond |
| NIST SP 800-61 Rev 2 | US federal incident response guide |
| SIEM / SOAR / UEBA | Logging and monitoring tools |
| 3-2-1 / 3-2-1-1-0 | Backup copies rule |
| Air-gapped backup | Backup isolated from network |
| Playbook | Runbook for a specific incident type |
| Standard / Normal / Emergency change | Change types in ITIL |

## 12. Further reading

- NIST SP 800-34, 800-53 (CP, CM, IR, SI), 800-61, 800-86, 800-92, 800-128, 800-137, 800-184 (recovery)
- ISO/IEC 27031, 27035, 27037, 27043
- ITIL for change/config management
- FIRST PSIRT best practices
- SANS Incident Handler's Handbook

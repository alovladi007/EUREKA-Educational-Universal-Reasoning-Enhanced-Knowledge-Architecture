# Domain 7 — Security Operations: Animation Storyboards

> 8 storyboards. Narration ~150 wpm.

| # | Concept | Duration | Tool |
|---|---|---|---|
| D7-01 | NIST IR lifecycle (6 phases) | 120 s | AE |
| D7-02 | 3-2-1-1-0 backup strategy | 90 s | AE |
| D7-03 | SIEM ingestion to response flow | 130 s | AE |
| D7-04 | Change management: standard / normal / emergency | 100 s | AE |
| D7-05 | Ransomware response playbook in action | 140 s | AE |
| D7-06 | Evidence handling chain of custody | 110 s | AE |
| D7-07 | DR failover: hot site activation | 115 s | AE |
| D7-08 | Patch management lifecycle | 95 s | AE |

---

## D7-01 · NIST IR Lifecycle (120 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Four phases in a circle: Preparation, Detection & Analysis, Containment/Eradication/Recovery, Lessons Learned | "The NIST SP 800-61 incident response lifecycle. Four phases in a loop." |
| 2 | Preparation: policies, team, tools, training, exercises | "Preparation happens long before any incident. Policy, team, tools, training, exercises. The work you do here determines how your team performs under pressure." |
| 3 | Detection & Analysis: alert, triage, classify | "Detection and analysis: recognizing that an incident is occurring, triaging severity, classifying type." |
| 4 | Containment: short-term isolate, long-term segment | "Containment: short-term is isolating the affected host. Long-term is segmenting the affected network area so the threat cannot spread while you work." |
| 5 | Eradication: remove malware, rotate credentials, rebuild | "Eradication: remove the attacker's presence. Delete malware, close backdoors, rotate credentials, rebuild compromised systems." |
| 6 | Recovery: restore operations and monitor for re-infection | "Recovery: restore operations and watch for signs of re-infection. The attacker may still have persistence you didn't find." |
| 7 | Lessons Learned: debrief and feed back into preparation | "Lessons learned: the debrief that turns an incident into program improvement. Update procedures, update tools, update training. Back into preparation." |

---

## D7-02 · 3-2-1-1-0 Backup Strategy (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Data icon with three arrows spawning copies | "Three copies of your data. Minimum." |
| 2 | Two different media types (disk, tape, cloud) | "Two different media types. Disk plus tape, or disk plus cloud, so a single media failure does not destroy both copies." |
| 3 | One offsite | "One copy offsite. So a site-level disaster (fire, flood, theft, ransomware that reaches the primary) does not destroy all backups." |
| 4 | One immutable or air-gapped | "One immutable or air-gapped copy. Modern ransomware specifically targets backups; an immutable or offline copy cannot be destroyed by an attacker with network access." |
| 5 | Zero errors verified | "Zero errors verified. Backups that have never been tested often fail at the worst moment. Test restores regularly." |

---

## D7-03 · SIEM Flow (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Log sources feeding a collector: firewall, endpoint, application, cloud, identity | "Logs flow from every source: firewalls, endpoints, applications, cloud, identity." |
| 2 | Normalization and enrichment step | "Normalization maps different log formats to a common schema. Enrichment adds context: asset ownership, user department, threat intelligence." |
| 3 | Correlation engine matches patterns across sources | "Correlation engine looks for patterns across sources. A failed login on identity plus an unusual outbound connection on network plus a process anomaly on endpoint might be nothing individually — or the three stages of an attack." |
| 4 | Alert fires, analyst triages | "Alert fires. Analyst triages: is it a true positive, a false positive, or an unknown?" |
| 5 | SOAR playbook automates response steps | "SOAR playbook automates steps: create ticket, enrich with context, isolate host, notify owner, escalate if needed. Reduces MTTR and analyst burnout." |
| 6 | Analyst investigates and closes the case | "Analyst investigates with the enriched data. Closes the case. Every case produces feedback to tune rules and reduce false positives." |

---

## D7-04 · Change Management (100 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Three paths: standard, normal, emergency | "Three change types. Each follows a different path." |
| 2 | Standard: pre-approved, low-risk, like a routine patch | "Standard: pre-approved templates for low-risk routine work. Approved once, executed many times without additional review." |
| 3 | Normal: change request, review, CAB approval, scheduled implementation | "Normal: change request, impact analysis, CAB review, scheduled implementation, post-implementation review. The default path." |
| 4 | Emergency: urgent implementation with post-hoc review | "Emergency: urgent implementation when waiting for review would cause greater harm. Post-hoc review is mandatory. Emergency changes are the most dangerous because they bypass controls." |
| 5 | Post-incident analysis should always examine emergency changes | "After any incident, review every recent emergency change. Many incidents involve a hasty change that introduced the vulnerability." |

---

## D7-05 · Ransomware Response (140 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Ransomware note appears on a user's screen | "Ransomware detected. Clock starts." |
| 2 | Analyst triages: scope, variant, affected systems | "Triage: which systems are affected, what variant, how was it delivered, is it still spreading?" |
| 3 | Containment: isolate affected hosts, segment network | "Containment. Isolate affected hosts immediately. Segment the affected network area. Disable compromised accounts." |
| 4 | Do not pay without legal review; engage insurance and legal; preserve evidence | "Do not pay without legal review. Engage cyber insurance early — many policies require specific response firms. Preserve evidence — you will need it for investigation and possible law enforcement engagement." |
| 5 | Eradication: rebuild from clean backups, rotate credentials, close backdoors | "Eradication: rebuild affected systems from clean immutable backups, not from infected state. Rotate all credentials used on compromised systems. Close whatever entry point the attacker used." |
| 6 | Recovery: restore service in phases, monitor for re-infection | "Recovery: restore service in phases, starting with the most critical. Monitor continuously for signs the attacker is still present." |
| 7 | Lessons learned: why did backups work (or fail), why did the attacker succeed, what changes prevent recurrence | "Lessons learned: why did backups work or fail, why did the attacker succeed, what changes prevent recurrence? This is the most important phase." |

---

## D7-06 · Chain of Custody (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Evidence item (USB drive, laptop, server) with a form attached | "Evidence, the moment of collection. Who collected it, when, where, why. Documented immediately." |
| 2 | Each handoff updates the chain of custody form | "Every handoff updates the chain. Person A gave it to person B at this time, person B stored it in this safe, person C retrieved it for analysis. Unbroken." |
| 3 | Forensic image made, original sealed | "For digital evidence: forensic image made first, original sealed and not analyzed. Cryptographic hashes before and after to prove the image is an exact copy." |
| 4 | Write blocker used when imaging | "Write blocker prevents any modification to the original during imaging. Hardware or software." |
| 5 | Court-admissibility depends on an unbroken chain | "Court admissibility depends on the chain. Gaps let opposing counsel challenge the evidence. Even a strong case can be destroyed by a broken chain of custody." |

---

## D7-07 · DR Failover (115 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Primary site operating normally | "Primary site is operating. Hot standby at the DR site receives continuous replication." |
| 2 | Primary fails (data center outage, disaster, ransomware destruction) | "Primary fails. Whatever the cause, the business cannot wait." |
| 3 | Failover initiated: DNS cutover, application activation, verification | "Failover: DNS redirects users to the DR site, applications activate, database replication promotes secondary to primary, verification that critical functions are working." |
| 4 | Users re-routed, services resumed | "Users are re-routed automatically via DNS TTLs. Services resume. RTO met if planning and execution are correct." |
| 5 | After primary is recovered, failback planning begins | "After primary is recovered, failback planning begins. Failback is often harder than failover because data has changed at the DR site while the primary was down." |

---

## D7-08 · Patch Management Lifecycle (95 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Vendor releases patch | "Vendor releases patch. The clock starts." |
| 2 | Vulnerability management team assesses criticality and impact | "Vulnerability management team assesses: is this critical? Is any system in our environment exposed? Is there a known exploit?" |
| 3 | Test in non-production | "Patch is tested in a non-production environment. Regression testing catches compatibility issues." |
| 4 | Schedule through change management | "Schedule through change management. Maintenance windows for normal changes, emergency windows for critical vulnerabilities under active exploitation." |
| 5 | Deploy to production | "Deploy. Rollback plan in place if something breaks." |
| 6 | Verify success and close the vulnerability | "Verify the patch is effective and the vulnerability is closed. Update the vulnerability management system. Close the ticket." |

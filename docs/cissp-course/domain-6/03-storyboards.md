# Domain 6 — Security Assessment and Testing: Animation Storyboards

> 8 storyboards. Narration ~150 wpm.

| # | Concept | Duration | Tool |
|---|---|---|---|
| D6-01 | Vulnerability scan vs penetration test | 110 s | AE |
| D6-02 | SAST / DAST / IAST / SCA explained | 130 s | AE |
| D6-03 | Red team vs blue team vs purple team | 90 s | Lottie |
| D6-04 | SOC 1 / SOC 2 / SOC 3 and Type I vs Type II | 115 s | AE |
| D6-05 | ISO 27001 certification lifecycle | 100 s | AE |
| D6-06 | KPI vs KRI vs activity metric | 85 s | AE |
| D6-07 | Log retention matrix (by log category) | 95 s | AE |
| D6-08 | Pentest rules of engagement | 105 s | AE |

---

## D6-01 · Scan vs Pentest (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Vulnerability scanner: Nessus icon running across a network, producing a long list of findings. | "Vulnerability scanning: automated, signature-based. The scanner checks every system against known-vulnerability databases and produces a long list." |
| 2 | A human pentester wearing a hoodie, laptop in hand, climbing over findings. | "Penetration testing: a human tester. The pentester takes the scan results, ignores 90% that don't matter, and chains together the critical few into an actual attack path." |
| 3 | The scan produces 500 medium findings; the pentest produces one critical end-to-end exploit. | "A scan might find 500 mediums. The pentest finds the one critical end-to-end path that actually matters. Both have value, but they answer different questions." |
| 4 | Scan = what *could* be wrong. Pentest = what *is* exploitable. | "Scan answers 'what could be wrong'. Pentest answers 'what is exploitable right now'." |
| 5 | Compliance requires scanning; boards want pentests. | "Compliance frameworks like PCI-DSS require quarterly ASV scans. Boards and executives usually want periodic pentests because the output is actionable in business terms." |

---

## D6-02 · SAST / DAST / IAST / SCA (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Four icons: SAST (source code reader), DAST (crawler on a running app), IAST (code + runtime instrumented), SCA (package list). | "Four tools for application security. Each sees something the others don't." |
| 2 | SAST scans source code, finds SQL injection pattern. | "SAST reads source code. Finds patterns like unsanitized SQL queries. Best run at commit time or in CI." |
| 3 | DAST probes the running application, gets a response that reveals XSS. | "DAST probes the running application. Sends test inputs, observes responses, finds XSS and injection flaws by behavior." |
| 4 | IAST is instrumented in the running application, seeing both code and runtime. | "IAST runs inside the application. It sees the code paths taken and the data flowing through them. Combines SAST's visibility with DAST's runtime accuracy." |
| 5 | SCA lists the dependencies, flags Log4j CVE-2021-44228. | "SCA inventories your dependencies and matches them against vulnerability databases. This is how you catch Log4j in your dependencies before the next zero-day." |
| 6 | Venn diagram: each tool covers different parts of the risk surface. | "No single tool is sufficient. SAST and DAST complement each other; IAST reduces false positives; SCA is essential for supply chain risk. Mature programs run all four, not just one." |

---

## D6-03 · Red / Blue / Purple Team (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Red team (adversarial) icon attacking. | "Red team: adversary simulation. They try to compromise the organization over a long engagement, mimicking how real attackers work." |
| 2 | Blue team defending with monitoring, detection, response. | "Blue team: defenders. They watch the alerts, respond to incidents, and harden systems." |
| 3 | Both teams merge into Purple: they work together after the exercise. | "Purple team: not a third team, but a collaborative debrief. Red shows blue what they did; blue shows red what they saw and missed; both sides improve." |
| 4 | White team: the coordinators who plan and observe the exercise. | "White team: the coordinators who plan scope, observe the exercise, and referee any disputes." |

---

## D6-04 · SOC 1 / 2 / 3 and Type I vs II (115 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Three SOC report icons. | "Three SOC reports. Each answers a different question." |
| 2 | SOC 1: focus on financial reporting controls for the user's own SOX compliance. | "SOC 1: controls over financial reporting. Used by customers who depend on your service to produce their own financial statements." |
| 3 | SOC 2: Trust Services Criteria — security, availability, processing integrity, confidentiality, privacy. | "SOC 2: controls mapped to the Trust Services Criteria. Security is always in scope; the other four are optional. This is the standard cloud-provider report for enterprise customers." |
| 4 | SOC 3: a public summary of SOC 2, suitable for marketing websites. | "SOC 3: a general-use version of SOC 2 that can be shared publicly without an NDA. Typically lives on a vendor's trust page." |
| 5 | Type I: design of controls at a point in time. | "Type I: did the controls exist on a specific date? A snapshot. Weak evidence for an ongoing trust relationship." |
| 6 | Type II: operating effectiveness over a period, typically 6-12 months. | "Type II: did the controls actually work over a period of 6 to 12 months? Much stronger. Enterprise customers should require Type II, not Type I." |

---

## D6-05 · ISO 27001 Certification Lifecycle (100 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A calendar with a 3-year cycle. | "ISO 27001 certification is a 3-year cycle." |
| 2 | Year 0: initial certification audit (Stage 1 + Stage 2). | "Year zero: the initial certification audit has two stages. Stage 1 reviews documentation and readiness. Stage 2 tests the ISMS in operation." |
| 3 | Year 1: surveillance audit. | "Year one: first surveillance audit. The certification body returns and tests a sample of controls." |
| 4 | Year 2: surveillance audit. | "Year two: second surveillance audit." |
| 5 | Year 3: recertification audit (full re-assessment). | "Year three: recertification. A full re-assessment, similar in scope to the initial certification." |
| 6 | Summary: continuous improvement expected throughout. | "Continuous improvement is expected throughout — not just the year of audit. Clause 10 of ISO 27001 explicitly requires improvement of the ISMS." |

---

## D6-06 · KPI / KRI / Activity Metric (85 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Three rows: activity, KPI, KRI. | "Three kinds of metrics. They answer different questions." |
| 2 | Activity: patches deployed this week, scans run, tickets closed. | "Activity: what the team did. Useful for operational management." |
| 3 | KPI: MTTD, MTTR, patch cadence, MFA coverage. | "KPI: how well the program is performing. Measures outcomes at the program level." |
| 4 | KRI: percentage of critical risks within appetite, attack surface, identity hygiene. | "KRI: measures risk posture. Answers 'are we still within our risk appetite?'" |
| 5 | Board sees KRIs; executives see KPIs; operations sees activity. | "Board reporting should be KRIs. Executive reporting should be KPIs. Operational reporting is activity. Matching the metric to the audience is half the work." |

---

## D6-07 · Log Retention Matrix (95 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A matrix: log categories on rows, retention periods on columns. | "Log retention is not one number. Different log categories have different values and different regulatory obligations." |
| 2 | Authentication logs: 1 year minimum, longer for privileged. | "Authentication logs: minimum 1 year, longer for privileged access. Critical for investigation." |
| 3 | Network flow logs: 3-6 months typically. | "Network flow logs: 3 to 6 months. High volume, moderate value; longer retention is expensive." |
| 4 | Application debug logs: 7-30 days. | "Application debug logs: short retention. High volume, low security value." |
| 5 | Audit and compliance logs: 7 years (SOX), 6 years (HIPAA). | "Audit and compliance logs: SOX wants 7 years, HIPAA wants 6. These are regulatory floors, not ceilings." |
| 6 | Legal hold overrides all retention. | "Any log under a legal hold is retained indefinitely until the hold lifts. The tiered schedule is your default; holds override it." |

---

## D6-08 · Pentest Rules of Engagement (105 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A document labeled 'Rules of Engagement'. | "Before any pentest, the rules of engagement. A document that protects both the tester and the client." |
| 2 | Scope: which systems, which networks, which IPs. | "Scope: exactly which systems are in bounds. Specific IPs, hostnames, applications. Out-of-scope must be as clear as in-scope." |
| 3 | Timing: when testing is allowed. | "Timing: testing windows. Typically not during business-critical hours unless the goal is to test response." |
| 4 | Prohibited actions: DoS, destructive actions, social engineering with HR risk. | "Prohibited actions: depends on the engagement. Destructive tests, DoS, social engineering outside defined scope — all spelled out." |
| 5 | Authorization letter ('get out of jail free'). | "An authorization letter from the asset owner protects the tester if law enforcement questions their activity. Without it, authorized pentesting looks like a crime." |
| 6 | Escalation: who to call when something breaks. | "Escalation path: who to call when something breaks. Pentests occasionally discover that a critical system has a zero-day vulnerability that needs immediate response. The tester needs to reach someone." |
| 7 | Evidence handling and reporting. | "Evidence handling: what is recorded, how it's stored, how it's delivered. Reporting: deliverables, timeline, quality standards." |

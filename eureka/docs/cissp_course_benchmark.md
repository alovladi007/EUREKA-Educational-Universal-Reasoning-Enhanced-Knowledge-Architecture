# CISSP course benchmark - scope audit against the Instructor Edition

Benchmark sources (both used as **scope checklists only** - every sentence the
course ships is authored originally for EUREKA; no prose, examples, exhibits or
figures are reproduced from either source):

1. **CISSP Instructor Edition** (819 pp.), supplied by the product owner and held
   locally at `~/Desktop/594359329-CISSP-InstructorEdition.pdf`. Used for its
   DOMAIN AND MODULE STRUCTURE only - the ordered list of topics an instructor-led
   CISSP course is expected to cover.
2. **Official (ISC)2 CISSP Exam Outline**, effective **2024-04-15**, for the domain
   weightings: https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline

Audit date: 2026-08-21. This document gates the CISSP build exactly as
`octet/docs/organic_depth_benchmark.md` gates organic and
`eureka/docs/nclex_course_benchmark.md` gates NCLEX.

## Official domain weights (verified against the 2024-04-15 outline)

| # | Domain | Weight | Live chapters | Live words | Book modules |
|---|---|---|---|---|---|
| 1 | Security and Risk Management | 16% | 5 | 11,547 | 10 |
| 2 | Asset Security | 10% | 3 | 9,424 | 8 |
| 3 | Security Architecture and Engineering | 13% | 7 | 11,779 | 7 |
| 4 | Communication and Network Security | 13% | 4 | 5,929 | 11 |
| 5 | Identity and Access Management | 13% | 4 | 7,760 | 6 |
| 6 | Security Assessment and Testing | 12% | 4 | 9,142 | 5 |
| 7 | Security Operations | 13% | 5 | 11,354 | 13 |
| 8 | Software Development Security | 10% | 4 | 11,179 | 4 |

Totals: **36 chapters, 78,180 words, 0 figures, 71 markdown tables** at audit time.

> **Audit correction (2026-08-21).** A first pass of this count reported "0 tables"
> because the counting regex matched only `| --- ` separator rows with spaces,
> while this course writes `|---|`. CISSP does carry 71 tables and 620 markdown
> headings; the content is better structured than that first count implied. The
> finding that survives correction is narrower and is stated below.

## The two findings that set the build order

**FINDING 1 - zero figures.** The course already uses tables and headings well
(71 tables, 620 headings), but it contains **no figures at all** - and across the
whole platform only FE EE (753) and NCLEX (20) have any. CISSP is a diagram-heavy
subject: OSI layers, Kerberos exchanges, RPO/RTO/MTD timelines, risk matrices,
key exchange, access-control models and defence-in-depth are all pictures, and the
shipped course draws none of them. Every chapter raised from here carries figures,
generated on the same theme-pair contract as FE EE and NCLEX.

**FINDING 2 - coverage does not track exam weight.** Domain 1 is the heaviest at
16 percent and Domain 7 at 13 percent, yet both are thinly covered relative to the
book's module count, while several 13-percent domains have chapters under 1,000
words. Cryptography - the single most feared CISSP topic - is 883 words.

## Per-domain module checklist (from the Instructor Edition)

### Domain 1: Security and Risk Management (16%)

Book modules:
- 1. Concepts of Confidentiality, Integrity, and Availability
- 2. Organizational/Corporate Governance
- 3. Risk Management Concepts
- 4. Compliance Requirements
- 5. Legal and Regulatory Issues that Pertain to Information Security in a
- 6. Security Policy, Standards, Procedures, and Guidelines
- 7. Personnel Security Policies and Procedures
- 8. Security Awareness, Education, and Training Programs
- 9. Business Continuity Requirements
- 10. Professional Ethics

Live chapters and their current size:
- `cissp_governance` - 3,067 words
- `cissp_compliance` - 2,614 words
- `cissp_bcdr` - 1,128 words
- `cissp_personnel` - 949 words
- `cissp_risk_mgmt` - 3,789 words

### Domain 2: Asset Security (10%)

Book modules:
- 1. Information and Assets
- 2. Asset Lifecycle Notes
- 3. Information and Asset Ownership
- 4. Protect Privacy
- 5. Asset Retention
- 6. Data Security Controls
- 7. Information and Asset Handling Requirements
- 8. Data Remanence

Live chapters and their current size:
- `cissp_data_class` - 4,403 words
- `cissp_privacy` - 2,646 words
- `cissp_data_lifecycle` - 2,375 words

### Domain 3: Security Architecture and Engineering (13%)

Book modules:
- 1. Processes Using Secure Design Principles
- 2. Fundamental Concepts of Security Models
- 3. Select Controls Based upon System Security Requirements
- 4. Security Capabilities of Information Systems
- 5. Vulnerabilities of Security Architectures, Designs, and Solution Eleme
- 6. Cryptography
- 7. Physical Security

Live chapters and their current size:
- `cissp_secure_design` - 1,754 words
- `cissp_models` - 1,114 words
- `cissp_crypto` - 883 words
- `cissp_physical` - 1,427 words
- `cissp_security_models_deep` - 1,958 words
- `cissp_crypto_advanced` - 2,710 words
- `cissp_evaluation` - 1,933 words

### Domain 4: Communication and Network Security (13%)

Book modules:
- 1. Secure Design Principles in Network Architectures
- 2. OSI Layer 1
- 3. OSI Layer 2
- 4. OSI Layer 3
- 5. OSI Layer 4
- 6. OSI Layer 5
- 7. OSI Layer 6
- 8. OSI Layer 7
- 9. Service Considerations
- 10. Secure Network Components
- 11. Secure Communications Channels According to Design

Live chapters and their current size:
- `cissp_network` - 2,470 words
- `cissp_protocols` - 868 words
- `cissp_wireless_net` - 1,891 words
- `cissp_network_attacks` - 700 words

### Domain 5: Identity and Access Management (13%)

Book modules:
- 1. Control Physical and Logical Access to Assets
- 2. Identity and Access Provisioning Lifecycle
- 3. Identification and Authentication of People, Devices, and Services
- 4. Identity Management Implementation
- 5. Implement and Manage Authorization Mechanisms
- 6. Accountability

Live chapters and their current size:
- `cissp_auth` - 2,496 words
- `cissp_access_control` - 1,058 words
- `cissp_identity` - 3,311 words
- `cissp_iam_attacks` - 895 words

### Domain 6: Security Assessment and Testing (12%)

Book modules:
- 1. Design and Validate Assessment, Test, and Audit Strategies
- 2. Security Control Testing
- 3. Security Process Data
- 4. Test Output and Generate Report
- 5. Conduct or Facilitate Security Audits

Live chapters and their current size:
- `cissp_vuln` - 3,746 words
- `cissp_audit` - 1,200 words
- `cissp_testing` - 1,615 words
- `cissp_testing_taxonomy` - 2,581 words

### Domain 7: Security Operations (13%)

Book modules:
- 1. Foundational Security Operations Concepts
- 2. Securely Provisioning Resources
- 3. Resource Protection Techniques
- 4. Detective and Preventative Measures
- 5. Incident Management Notes
- 6. Requirements for Investigation Types
- 7. Investigations Notes
- 8. Logging and Monitoring Activities
- 9. Recovery Strategies
- 10. Disaster Recovery Processes
- 11. Business Continuity Planning and Exercises
- 12. Test Disaster Recovery Plans
- 13. Personnel Safety and Security Concerns

Live chapters and their current size:
- `cissp_ir` - 2,169 words
- `cissp_investigations` - 833 words
- `cissp_operations` - 2,481 words
- `cissp_disaster` - 3,257 words
- `cissp_forensics_legal` - 2,614 words

### Domain 8: Software Development Security (10%)

Book modules:
- 1. Security in the Software Development Lifecycle (SDLC)
- 2. Secure Coding Guidelines and Standards
- 3. Security Controls in Development Environments
- 4. The Effectiveness of Software Security

Live chapters and their current size:
- `cissp_sdlc` - 3,672 words
- `cissp_app_vuln` - 2,794 words
- `cissp_devops` - 2,070 words
- `cissp_owasp_patterns` - 2,643 words

## Depth standard (the FE-EE-plus bar already applied to NCLEX)

Every chapter ships: markdown `##` subsections, at least two reference TABLES,
at least one theme-paired FIGURE where the content is visual, a worked example or
decision walkthrough, and a self-check set with answers. Figures are generated by
`scripts/gen_cissp_figures.py` on the same `ed_figstyle` contract as FE EE and
NCLEX (`name.svg` + `name.dark.svg`).

## Build order (thinnest-and-heaviest first)

1. **Cryptography** (883 w, 13% domain) - the worst ratio in the course.
2. **Business continuity / DR metrics** (1,128 w) - RPO/RTO/MTD/WRT is a figure.
3. **Security models** (1,114 w) and access control (1,058 w) - both table-shaped.
4. **Network attacks** (700 w), protocols (868 w), IAM attacks (895 w),
   investigations (833 w), personnel (949 w) - the sub-1,000 tail.
5. Then the Domain 4 OSI layer-by-layer gap and the Domain 7 operations gap,
   which are the two places the book carries far more modules than we have
   chapters.

House rules unchanged: all prose original, every table sourced, no exhibit or
figure reproduced from the Instructor Edition, and content stays DRAFT until a
named SME reviews it.

## Progress log

**CS-4 (2026-08-21)** — Security Models & Frameworks (1,114 → 6,222 words) and Access
Control Models (1,058 → 6,166 words) both reach the FE-EE-grade standard. **4/36
chapters now at standard**; 32 remain short. Ten new figures: `cissp-bell-lapadula`,
`cissp-reference-monitor`, `cissp-clark-wilson`, `cissp-cc-eal-ladder`,
`cissp-framework-stack`, `cissp-access-control-models`, `cissp-iaaa`, `cissp-kerberos`,
`cissp-auth-factors`, `cissp-federation-saml` — 21 figures / 42 SVGs on disk, all
verified serving 200 in both themes.

**New gate: `scripts/check_figure_overlaps.py`.** Rendering the figures caught label
collisions the depth gate passed cleanly — the same failure family as the FE EE
display-block defect. The checker re-runs each figure function, measures every text
artist's bounding box in display coordinates, and fails on any pair overlapping by
more than 6 px and 12% of the smaller box. It is now invoked from
`check_cissp_depth.py`, so a figure that reads as garbage fails the same gate as a
chapter that is too short.

It found three real defects: the new `cissp-bell-lapadula` (four mutually overlapping
rule labels, fixed by moving every gloss into a legend block below the plot), and two
**already-shipped** figures — `cissp-bc-metrics` (MTD label under a timeline tick, RTO
and WRT captions overlapping) and `cissp-crypto-taxonomy` (column headers colliding
because the columns were narrower than the header text). Both rebuilt.

The checker is generator-agnostic. Run against NCLEX it reports **5 broken figures**
(`nclex-insulin-curves` and `nclex-fundal-height` each have a label rendered 100% on
top of another), which is unfixed — NCLEX is a paused stream.

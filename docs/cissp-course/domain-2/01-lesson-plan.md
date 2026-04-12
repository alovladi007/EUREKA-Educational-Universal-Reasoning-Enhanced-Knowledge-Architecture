# Domain 2 — Asset Security: Lesson Plan

> **AI-generated study material** aligned to the (ISC)² CISSP Exam Outline
> effective April 15, 2024. Requires human SME review before publication.
> Domain weight: **10%**.
>
> Topic IDs in EUREKA curriculum: `cissp_data_class`, `cissp_privacy`
> (see `eureka/apps/web/src/lib/exam-curriculum.ts:439-442`).

---

## 1. Domain summary for the learner

Asset Security is the data-lifecycle domain. Where Domain 1 sets governance
policy and risk appetite, Domain 2 operationalizes those decisions over the
lifetime of information assets: identify, classify, own, handle, retain,
destroy. The CISSP exam tests this domain as a set of linked lifecycle
decisions, almost always with the same core question underneath the
scenario: **does this action match the classification of the data, and is
the right role making the decision?**

If Domain 1's mantra is "think like a manager", Domain 2's mantra is
"think like a data owner". The data owner is a business role with
accountability for classification, retention, and authorized use; the data
custodian is a technical role that implements and maintains the controls.
Confusing these two is the most common Domain 2 exam trap.

## 2. Learning objectives (Bloom-aligned, measurable)

| # | Objective | Bloom | Measured by |
|---|---|---|---|
| LO2.1 | **Distinguish** the roles of data owner, data custodian, data controller, data processor, data subject, and data steward; assign the correct role in a given scenario. | Analyze | Scenario MCQ |
| LO2.2 | **Classify** a given dataset under a multi-level classification scheme (government and commercial), applying the high-water-mark principle. | Apply | Classification worksheet lab |
| LO2.3 | **Design** a complete information lifecycle for a new data flow (create → store → use → share → archive → destroy), selecting controls appropriate to classification at each stage. | Create, Evaluate | Lab exercise |
| LO2.4 | **Apply** data retention rules correctly given a mix of regulatory, business, and litigation-hold requirements. | Apply | Multi-regulation MCQ |
| LO2.5 | **Select** the correct media sanitization method (clear, purge, destroy) per NIST SP 800-88 for a given medium and classification. | Apply | Matching exercise |
| LO2.6 | **Differentiate** data states (at rest, in transit, in use) and select protective controls for each, including when each control stops providing protection. | Analyze | Scenario MCQ |
| LO2.7 | **Map** privacy obligations (GDPR controller/processor, CCPA business/service-provider, HIPAA covered-entity/BA) to specific data-handling scenarios. | Analyze | Multi-regulation scenario |
| LO2.8 | **Evaluate** a proposed data-minimization strategy against business needs and privacy principles. | Evaluate | Short essay |

## 3. Estimated study hours

| Activity | Hours |
|---|---|
| Pre-read (cheat sheet + vocabulary) | 0.3 |
| Animation module (~10 videos) | 0.5 |
| Detailed notes | 4.0 |
| Worked examples (classification, retention, sanitization) | 1.5 |
| Practice questions (50 QBank) | 2.5 |
| Review + SR | 1.2 |
| **Total** | **10.0 hours** |

Target ratio: 1 hour / 1% exam weight → 10 hours for Domain 2.

## 4. Sequenced learning path

```
Pre-read (20 min)
    ↓
Diagnostic (10 questions, 10 min)
    ↓
Animation module (30 min)
    ↓
Deep-dive notes (first pass, 2.5 hr)
    ↓
Worked examples: (1) Classification, (2) Retention matrix, (3) Sanitization table (1.5 hr)
    ↓
50-question QBank practice (2.5 hr)
    ↓
25-question mini-mock, timed (45 min)
    ↓
Spaced-repetition review and second-pass on weak sub-objectives
```

## 5. Knowledge checkpoints

| Checkpoint | After sub-objectives | Focus |
|---|---|---|
| CP-1 | 2.1, 2.2 | Asset classification, ownership roles |
| CP-2 | 2.3, 2.4 | Lifecycle, retention |
| CP-3 | 2.5, 2.6 | Data states, data roles under privacy law |
| CP-4 | 2.7 | Secure provisioning, DRM, DLP |

## 6. Lab exercises

### Lab 2.A — Classification worksheet

Given 12 sample data elements (payroll records, board minutes, marketing
assets, customer PII, HIPAA PHI, payment card data, source code, internal
wiki pages, anonymized analytics, executive email, application logs,
backup tapes), the learner applies a 4-level commercial classification
scheme (Public / Internal / Confidential / Restricted) with justification.
Checked against a rubric.

### Lab 2.B — Retention matrix

Learner constructs a retention matrix for a fictional company across
these regimes: SOX (7 years for financial records), HIPAA (6 years for
most PHI), GDPR (no fixed retention — "no longer than necessary"), state
medical records laws, employment records, and a pending litigation hold.
Must resolve conflicts correctly (longest retention wins when a hold
applies; shortest retention wins when a data-minimization obligation
applies with no hold).

### Lab 2.C — Sanitization decision table

Given 10 media types (HDD, SSD, SED, NVMe, optical disc, magnetic tape,
paper, mobile device with eMMC, USB flash, cloud storage), the learner
selects Clear, Purge, or Destroy per NIST SP 800-88 Rev 1, with
classification as an input. Must recognize that SSD crypto-erase is
NIST-approved Purge when properly implemented.

### Lab 2.D — Privacy role mapping

A single scenario (SaaS HR vendor serving a hospital chain in the US and
Germany) is mapped under GDPR (controller/processor/joint controllers),
CCPA (business/service-provider/third-party), and HIPAA (covered-entity/
business-associate/subcontractor). Learner produces the correct role
assignments and the required legal instruments (DPA, BAA, SCCs).

## 7. Discussion prompts

1. "Who owns a machine-learning training dataset — the team that
   collected it, the team that trained the model, or the business unit
   consuming the output?"
2. "Is data classification meaningful if users can't remember the
   levels? How would you design a classification scheme that is both
   technically sound and human-usable?"
3. "A deleted file is not destroyed data. Discuss what 'destruction'
   actually means across HDDs, SSDs, and cloud storage."
4. "Pseudonymization vs anonymization under GDPR — when does
   pseudonymized data stop being personal data, and when does it
   continue to be?"
5. "Data localization laws (Russia, China, India, Saudi Arabia) are
   expanding. What changes in a global architecture when every region
   requires local storage?"
6. "DLP is often deployed to satisfy an auditor rather than a risk.
   What are the signs of a DLP program deployed for compliance theater
   vs real risk reduction?"

## 8. Readiness gate to Domain 3

- [ ] Notes first pass complete
- [ ] All 4 labs at `met standard`
- [ ] 50-question QBank ≥ 75%
- [ ] 25-question mini-mock ≥ 70% under timer
- [ ] SR queue active
- [ ] Domain 2 θ predicted pass ≥ 0.65

## 9. Differentiators active

- **Manager mindset translator** — asset security questions usually test
  the data owner role; every QBank rationale names the manager shift.
- **Breach anchors** — Equifax (classification failure), Desjardins 2019
  (insider / lifecycle failure), Capital One 2019 (overbroad access /
  lifecycle), the repeated Amazon S3 misconfiguration incidents (states/
  controls mismatch).
- **AI tutor** — on miss, explains the role confusion or
  classification-to-control mismatch the learner fell into.

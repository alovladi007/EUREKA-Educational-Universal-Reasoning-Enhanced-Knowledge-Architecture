# Domain 1 — Security and Risk Management: Lesson Plan

> **AI-generated study material** aligned to the (ISC)² CISSP Exam Outline
> effective April 15, 2024. Requires human SME review before publication.
> Domain weight: **16%** (the largest single domain on the exam).
>
> Topic IDs in EUREKA curriculum: `cissp_governance`, `cissp_risk_mgmt`,
> `cissp_compliance`, `cissp_bcdr`, `cissp_personnel`
> (see `eureka/apps/web/src/lib/exam-curriculum.ts:432-438`).

---

## 1. Domain summary for the learner

Domain 1 is the governance backbone of CISSP. Everything else on the exam —
controls, crypto, networks, IAM, ops, software — ultimately serves the goals
you define here: **confidentiality, integrity, and availability**, expressed
through policy, driven by risk, constrained by law, and owned by senior
management.

If a learner only internalizes one thing from Domain 1 it should be this:
**the CISSP exam is testing you as a security manager, not a security
technician.** In Domain 1 that manager-mindset shift is non-negotiable. A
candidate who answers Domain 1 questions like an engineer ("which firewall
rule blocks this?") will fail; a candidate who answers like a risk advisor to
the board ("does this treatment align with our risk appetite and regulatory
exposure?") will pass.

## 2. Learning objectives (Bloom-aligned, measurable)

On successful completion of Domain 1, the learner will be able to:

| # | Objective | Bloom level | Measured by |
|---|---|---|---|
| LO1.1 | **Distinguish** security governance from security management, and identify the role of the board, executive leadership, steering committees, and the CISO in each. | Analyze | Scenario MCQs (QBank §1.1), discussion board |
| LO1.2 | **Differentiate** the CIA triad from the Parkerian Hexad, and **select** the most relevant attribute for a given business scenario. | Evaluate | MCQ, short-answer rationale |
| LO1.3 | **Compare** the due care vs. due diligence standards and **apply** them to a third-party onboarding decision. | Apply, Analyze | Scenario MCQ, case-study response |
| LO1.4 | **Execute** a qualitative and a quantitative risk assessment end-to-end, computing ALE = SLE × ARO and SLE = AV × EF, and **recommend** a risk treatment. | Apply, Evaluate | Lab exercise (risk register), numeric MCQs |
| LO1.5 | **Classify** a given data-processing scenario under GDPR, CCPA, HIPAA, GLBA, SOX, and PCI-DSS simultaneously, and **identify** the controlling framework(s). | Analyze | Multi-regulation scenario, written rationale |
| LO1.6 | **Construct** a BIA including RTO, RPO, MTD, and WRT for a sample business process, and **justify** a recovery strategy. | Create, Evaluate | BIA worksheet lab |
| LO1.7 | **Evaluate** a personnel security lifecycle (screening → onboarding → training → termination → third-party) against least-privilege and separation-of-duties principles. | Evaluate | Scenario MCQ, policy-gap exercise |
| LO1.8 | **Map** a given control to ISO/IEC 27001, NIST SP 800-53, NIST CSF, COBIT 2019, and CIS Controls v8 — and **explain** why different frameworks coexist. | Analyze | Framework crosswalk table |
| LO1.9 | **Recognize** the ethical obligations under the (ISC)² Code of Ethics, and **rank** the four canons in priority order. | Understand, Evaluate | Ethics scenario MCQs |

Every QBank question in Domain 1 must be tagged to at least one LO above.

## 3. Estimated study hours

| Activity | Hours |
|---|---|
| Pre-read (cheat sheet + vocabulary priming) | 0.5 |
| Animation module (12–15 short videos) | 0.75 |
| Detailed notes (deep read, first pass) | 6.0 |
| Worked examples (ALE math, BIA, risk register) | 2.0 |
| Practice questions (50-question Domain 1 QBank) | 2.5 |
| Review of missed questions + spaced-repetition cards | 2.0 |
| Mini-mock (25-question timed quiz, Domain 1 only) | 0.75 |
| Post-mortem + gap remediation | 1.5 |
| **Total** | **16.0 hours** |

Course-wide, 16 hours for the 16% domain keeps hours-per-percent roughly
constant at ~1.0, which is the target ratio for the full 100-hour program.

## 4. Sequenced learning path

The sequence is designed so that each step **primes retrieval** for the next.
Passive reading comes last, not first.

```
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 0 · Pre-read (30 min)                                       │
  │   → Cheat sheet + 30-term vocabulary flashcard warm-up           │
  │   → Goal: activate prior knowledge, surface unknowns             │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 1 · Diagnostic (15 min)                                     │
  │   → 10-question pre-quiz (low stakes, ungraded)                  │
  │   → Sets adaptive engine's initial θ (ability estimate)          │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 2 · Animation module (45 min)                               │
  │   → 12–15 short storyboarded animations (see 03-storyboards.md)  │
  │   → Concepts: governance hierarchy, risk math flow, BIA clock,   │
  │     due care vs due diligence, GDPR vs CCPA overlay, ethics      │
  │     priority tree                                                │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 3 · Deep-dive notes — first pass (3 hr)                     │
  │   → Read sub-objectives 1.1–1.13 in order                        │
  │   → Knowledge checkpoint every 2 sub-objectives (5-Q ungraded)   │
  │   → Flag unclear passages for second pass                        │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 4 · Worked examples (2 hr)                                  │
  │   a. ALE calculation: 5 scenarios, varying EF and ARO            │
  │   b. Qualitative risk matrix for a 10-asset register             │
  │   c. BIA worksheet: map 6 processes to RTO/RPO/MTD/WRT           │
  │   d. Due care vs due diligence: 8 third-party scenarios          │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 5 · Practice questions (2.5 hr)                             │
  │   → 50-question Domain 1 QBank, untimed, with rationales         │
  │   → Target accuracy ≥ 75% before proceeding                      │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 6 · Mini-mock (45 min, timed)                               │
  │   → 25 questions, 1.8 min each, no rationales during test        │
  │   → Mirrors exam conditions for Domain 1 slice                   │
  └─────────────────────────────────────────────────────────────────┘
                              ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │ STEP 7 · Review + spaced repetition                              │
  │   → Missed questions enter SR queue at 1d / 3d / 7d / 21d        │
  │   → AI tutor generates personalized miss-explanation             │
  │   → Deep-dive notes second pass on flagged sections only         │
  └─────────────────────────────────────────────────────────────────┘
```

## 5. Knowledge checkpoints

Between the sub-objective blocks inside the notes. Each checkpoint is 5
questions, ungraded, auto-advancing if the learner scores 4/5 or better.
Sub-70% triggers a "re-read + retry" loop.

| Checkpoint | After sub-objectives | Focus |
|---|---|---|
| CP-1 | 1.1, 1.2 | CIA/Hexad, governance vs management |
| CP-2 | 1.3, 1.4 | Due care/diligence, alignment with business |
| CP-3 | 1.5, 1.6 | Laws & regulations, compliance |
| CP-4 | 1.7, 1.8 | Professional ethics, security policy lifecycle |
| CP-5 | 1.9, 1.10 | BCP/BIA, personnel security |
| CP-6 | 1.11, 1.12 | Risk management concepts, threat modeling |
| CP-7 | 1.13 | SCRM and security awareness |

## 6. Lab exercises

Domain 1 is governance-heavy, so labs are analytical artifacts rather than
console work. Each lab is graded as `submitted` / `revisions needed` / `met
standard`; grading rubric lives alongside each lab.

### Lab 1.A — Risk Register (quantitative + qualitative)

- Given 8 assets with asset values, threats, and historical incident data,
  the learner produces a risk register with columns: Asset | Threat |
  Vulnerability | EF | SLE | ARO | ALE | Qualitative rating | Treatment |
  Residual risk.
- Must compute ALE correctly and justify at least one of each treatment
  category: accept, avoid, transfer, mitigate.
- **Exam hook:** CISSP tests ALE arithmetic and the order of treatment
  selection (mitigate down to risk appetite, then transfer, then accept).

### Lab 1.B — BIA Worksheet

- Six fictional business processes (payroll, e-commerce checkout, internal
  wiki, customer support phone, data warehouse ETL, executive email).
- Learner assigns RTO, RPO, MTD, WRT, and criticality tier for each and
  picks a recovery strategy (hot/warm/cold site, cloud DR, mutual aid).
- Deliverable: completed worksheet + 200-word justification for the
  highest-tier process.

### Lab 1.C — Multi-regulation scenario

- A single e-commerce scenario touches GDPR (EU customers), CCPA
  (California customers), PCI-DSS (payment cards), HIPAA (a wellness
  feature), and SOX (publicly listed parent).
- Learner identifies which regulation controls which data element, which
  overlaps exist, and which role (controller, processor, covered entity,
  etc.) the company occupies under each.

### Lab 1.D — Third-party due-diligence checklist

- Learner drafts a 25-item due-diligence checklist for onboarding a SaaS
  vendor that will process regulated customer data.
- Must distinguish "due care" items (what the company *does*) from "due
  diligence" items (what the company *verifies*).

## 7. Discussion prompts (cohort / community feature)

Async prompts for the community forum. Each runs for one week and has a
lightweight rubric for AI-assisted moderation.

1. **"Governance vs management — where do you draw the line in your real
   job?"** Learners describe a control or decision from their work and
   argue whether it is governance or management. Goal: make the
   abstraction concrete.
2. **"Your company just adopted NIST CSF. A colleague says, 'We already
   have ISO 27001, this is a waste.' How do you respond?"** Goal: framework
   coexistence.
3. **"Pick a recent breach from the last 12 months and map it to one
   Domain 1 failure."** Goal: breach-of-the-week differentiator.
4. **"Risk appetite vs risk tolerance — give a sentence you would actually
   say to a CFO to distinguish them."** Goal: manager-mindset language.
5. **"The (ISC)² Code of Ethics canons are ordered. Why is 'Protect
   society' first, not 'Protect your employer'?"** Goal: ethics priority.
6. **"Third-party risk — whose responsibility is the vendor's subprocessor?
   Under GDPR? Under a standard MSA with no DPA?"** Goal: upstream/
   downstream accountability.

## 8. Readiness gate to Domain 2

The learner may proceed to Domain 2 (Asset Security) when **all** of the
following are true:

- [ ] Completed deep-dive notes first pass
- [ ] Completed all 4 labs at `met standard`
- [ ] 50-question QBank accuracy ≥ 75%
- [ ] 25-question mini-mock accuracy ≥ 70% *under timer*
- [ ] Spaced-repetition queue for Domain 1 is active (not empty, not over-due)
- [ ] Predicted pass probability for Domain 1 slice ≥ 0.65 per the IRT model

If any box is unchecked, the adaptive engine loops the learner back to the
weakness-drill mode before unlocking Domain 2.

## 9. Differentiators active in this module

- **Manager Mindset Translator**: every question rationale in the Domain 1
  QBank names the exact manager-mindset shift that distinguishes the
  correct answer from the best distractor.
- **Breach-of-the-week**: Lab 1.C and discussion prompt 3 pull from the
  curated incident library. Domain 1 breach anchors include Equifax 2017
  (governance failure), Target 2013 (third-party/SCRM), Capital One 2019
  (risk acceptance failure).
- **AI tutor**: triggered on any missed question. Uses the learner's prior
  Domain 1 responses as context and explains the miss in language matched
  to the learner's demonstrated vocabulary level.

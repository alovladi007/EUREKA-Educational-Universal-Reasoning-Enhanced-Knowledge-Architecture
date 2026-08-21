# NCLEX-RN course benchmark — OCTET-style scope audit

Benchmark sources (both used as **scope checklists only** — every sentence the
course ships is authored originally for EUREKA; no prose is reproduced):

1. **Saunders Comprehensive Review for the NCLEX-RN Examination, 9th ed.**
   (Silvestri & Silvestri, Elsevier) — chapter structure taken from the
   publisher's public table of contents:
   https://shop.elsevier.com/books/saunders-comprehensive-review-for-the-nclex-rn-examination/silvestri/978-0-323-79530-2
2. **NCSBN 2026 NCLEX-RN Test Plan** (official, free publication) —
   https://www.nclex.com/files/2026_RN_Test%20Plan_English-F.pdf

Audit date: 2026-08-20. This document is the gate for the course build-out:
every wave adds chapters FROM this outline, and completion is measured against
it, exactly as `octet/docs/organic_depth_benchmark.md` gates the organic build.

## Official 2026 distribution (NCSBN test plan, p.5)

| Client Needs category | % of items |
|---|---|
| Management of Care | 15–21% |
| Safety and Infection Prevention and Control | 10–16% |
| Health Promotion and Maintenance | 6–12% |
| Psychosocial Integrity | 6–12% |
| Basic Care and Comfort | 6–12% |
| Pharmacological and Parenteral Therapies | 13–19% |
| Reduction of Risk Potential | 9–15% |
| Physiological Adaptation | 11–17% |

Plus 18 case-study items (3 sets) and ~10% stand-alone clinical-judgment
items. NOTE the 2026 renaming: "Safety and Infection **Prevention and**
Control" — our exam-config label needs the update.

## Saunders 9e structure: 70 chapters, 19 units

I Exam Prep (1–4) · II Professional Standards (5–7) · III Foundations of Care
(8–17) · IV Growth & Development (18–20) · V Maternity (21–29) ·
VI Pediatrics (30–42) · VII–XVII Adult problems+medications pairs by system
(43–64) · XVIII Mental Health (65–69) · XIX Complex Care (70).

## The 80%-doctrine target: 56 chapters derived from Saunders' 70

Merges applied (each noted): exam-prep 4→2; fluids+acid-base 8+9→1;
hygiene/mobility+elimination 16+17→1; each adult "problems + medications"
unit pair 2→1 or 2 depending on weight; pediatric 13→6 (system-grouped);
maternity 9→6; mental health 5→4.

## Gap audit: the 23 live chapters mapped to Saunders

### Correctly covered (keep; deepen in the depth pass)
| Live chapter | Saunders |
|---|---|
| NGN Exam & CAT Strategy + Clinical Judgment Model | ch 1, 4 |
| Prioritization, Delegation & Assignment | ch 7 |
| Legal & Ethical Practice | ch 6 |
| Infection Control & Precautions + Client Safety | ch 13 |
| Growth & Development Across the Lifespan | ch 18–19 |
| Dosage Calc / Pharm Principles / IV Therapy | ch 14 (3-way split, good) |
| Laboratory Values & Diagnostics | ch 10 |
| Perioperative & Procedure Care | ch 15 |
| Fluids, Electrolytes & Acid-Base | ch 8+9 (merge, good) |
| Mobility, Nutrition & Elimination | ch 11+16+17 (merge, acceptable) |
| Medical Emergencies | ch 70 (partial) |
| ECG & Dysrhythmias / CAD-ACS / Heart Failure | ch 53 (3-way split, good) |
| Asthma & COPD | ch 51 (partial) |
| Stroke & ICP | ch 59 (partial) |
| Diabetes | ch 47 (partial) |

### Structural gaps (the "that's not what I have" list) — 33 chapters to build
1. **Maternity is 1 chapter where Saunders has 9** → build 5 more:
   Prenatal Period & Reproductive Health (21–22); High-Risk Pregnancy (23);
   Labor, Birth & Their Complications (24–25); Postpartum & Its
   Complications (26–27); The Newborn & Newborn Complications (28);
   Maternity & Newborn Medications (29).
2. **Pediatrics is 0 chapters where Saunders has 13** → build 6:
   Peds Cardiac & Respiratory (36–37); Peds GI, Renal & GU (34, 38);
   Peds Neuro, Musculoskeletal & Integumentary (30, 39–40); Peds Hematology,
   Oncology & Metabolic/Endocrine (31–33); Peds Immune, Infectious Disease &
   EENT (35, 41); Pediatric Medication Administration & Calculations (42).
3. **Mental health is 1 chapter where Saunders has 5** → build 3 more:
   Mental Health Problems (65–66); Addictions (67); Crisis Intervention (68);
   Psychotherapeutic Medications (69).
4. **Adult systems missing entirely** → build 13:
   Integumentary Problems & Burns (43–44); Oncological & Hematological
   Problems (45); Oncological & Hematological Medications (46); Endocrine
   Problems beyond diabetes — thyroid/parathyroid/adrenal/pituitary (47);
   Endocrine Medications (48); Gastrointestinal Problems (49); GI
   Medications (50); Respiratory Problems beyond asthma/COPD — pneumonia,
   TB, chest trauma, ARDS/vents (51); Respiratory Medications (52);
   Cardiovascular Medications (54); Renal & Urinary Problems (55); Renal &
   Urinary Medications (56); Eye & Ear Problems and Medications (57–58).
5. **Neuro/musculoskeletal/immune remainder** → build 6:
   Neurological Problems beyond stroke — seizures, degenerative, SCI (59);
   Neurological Medications (60); Musculoskeletal Problems (61);
   Musculoskeletal Medications (62); Immune Problems — HIV, autoimmune,
   transplant (63); Immune Medications (64).
6. **Foundations remainder** → build 3: Population Health & Community
   Nursing (5); Health & Physical Assessment of the Adult (12); Care of the
   Older Client (20); Complex Care — shock, sepsis, disaster/triage (70,
   completing the emergencies chapter).

Running total: 23 live + 33 to build = **56 chapters**, the doctrine target,
now derived from the book instead of asserted.

## Depth standard (the second half of the complaint)

Current chapters run ~3-minute digests. The book-parity standard, applied in
the deepening pass after the structural gaps close: **every chapter carries
5–8 sections** (pathophysiology → assessment → interventions → medications →
client teaching → complications, as applicable), **the reference tables a
review book carries** (lab ranges, drug prototypes with antidotes, insulin
peaks, precaution lists), and a **practice bridge** into the QBank. Priority
order: structural gaps first (a missing pediatrics unit hurts more than a
thin one), then depth.

House rules unchanged: all prose original; no NCSBN items reproduced; every
chapter DRAFT until named-SME review.

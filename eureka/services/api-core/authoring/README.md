# Item authoring sources

Versioned source files for items seeded into the server item bank. These are
the provenance record: what was authored, when, and in what shape — the DB
rows carry `metadata->>'source_id'` pointing back at ids in these files, and
the seed scripts are idempotent on that key.

Rules (from the NCLEX build plan, applying to every bank):
- New items are authored HERE and seeded into the DB. They are never added
  to client-side data files — that is how answer keys end up in the browser
  bundle (the defect NX-5 removed).
- Every item ships with a rationale for the correct answer AND for why each
  distractor is wrong. That is the product bar, not a nicety.
- Everything seeds as review_status=DRAFT / verification 'unverified' unless
  its key is machine-computed (dosage items: 'calc-verified', re-checked
  against the live bank by scripts/verify_nclex_bank_keys.py). A named SME
  approving an item is the only path to APPROVED — authoring is not review.
- Every item SHOULD carry a `strategy` field (Saunders/Silvestri-style
  test-taking tip: HOW to reason to the answer — eliminate absolutes, ABC
  priority, therapeutic-communication rules — not a restated rationale).
  It is revealed only in grading and review responses, never in serving.
  Waves 1–7 predate the field; backfill is queued.

| file | items | seeded | contents |
|---|---|---|---|
| nclex-phase1-wave1.json | 24 | 2026-08-20 | Basic Care & Comfort +8, Health Promotion +8, Psychosocial Integrity +8 (6 SATA); rebalances the three thinnest Client Needs categories |
| nclex-phase1-wave2.json | 24 | 2026-08-20 | Safety & Infection Control +6, Reduction of Risk +6, Physiological Adaptation +6, Management of Care +6 (5 SATA); every non-pharm category now 16-20 |
| nclex-phase1-wave3.json | 12 | 2026-08-20 | Pharmacology NON-calculation (2 SATA): statins, aminoglycoside troughs, IV potassium, corticosteroids, MAOI/tyramine, phenytoin, vesicant extravasation, phlebitis, beta blockers+diabetes, loop diuretics, TPN bridge, live-vaccine screening |
| nclex-phase1-wave4.json | 24 | 2026-08-20 | Management of Care +8, Physiological Adaptation +6, Safety & Infection Control +5, Reduction of Risk +5 (4 SATA); weighted toward the blueprint's heavier categories |
| nclex-phase1-wave5.json | 16 | 2026-08-20 | 2 per category, proportional growth (3 SATA): incident reporting, med reconciliation, poisoning, elopement, safe sleep, adolescent interview, postpartum depression, stages of change, ostomy, clock method, insulin mixing, allergy check, post-thyroidectomy, urinary retention, asterixis, early sepsis |
| nclex-phase1-wave6.json | 24 | 2026-08-20 | Basic Care +8, Health Promotion +8, Psychosocial +8 (4 SATA): fundamentals, pediatrics prevention, mental-health depth |
| nclex-phase1-wave7.json | 24 | 2026-08-20 | Safety +6, Reduction of Risk +6, Mgmt +4, Physio +4, Basic Care +4 (2 SATA): emergencies (evisceration, silent chest, HHS, adrenal crisis, heat stroke), procedures, systems safety |
| nclex-strategy-backfill-1.json | 41 | 2026-08-20 | strategy tips (not items) for all 41 calc-verified dosage items, grounded per calc kind; applied by scripts/backfill_nclex_strategies.py |
| nclex-strategy-backfill-2.json | 60 | 2026-08-20 | strategy tips for waves 1-3 (clinical + pharm non-calc); coverage now 101/297 |
| nclex-strategy-backfill-3.json | 40 | 2026-08-20 | strategy tips for waves 4-5 (emergencies, procedures, mgmt-of-care); coverage now 141/297 |

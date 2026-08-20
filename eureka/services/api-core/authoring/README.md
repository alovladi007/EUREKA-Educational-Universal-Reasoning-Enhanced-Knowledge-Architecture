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

| file | items | seeded | contents |
|---|---|---|---|
| nclex-phase1-wave1.json | 24 | 2026-08-20 | Basic Care & Comfort +8, Health Promotion +8, Psychosocial Integrity +8 (6 SATA); rebalances the three thinnest Client Needs categories |
| nclex-phase1-wave2.json | 24 | 2026-08-20 | Safety & Infection Control +6, Reduction of Risk +6, Physiological Adaptation +6, Management of Care +6 (5 SATA); every non-pharm category now 16-20 |
| nclex-phase1-wave3.json | 12 | 2026-08-20 | Pharmacology NON-calculation (2 SATA): statins, aminoglycoside troughs, IV potassium, corticosteroids, MAOI/tyramine, phenytoin, vesicant extravasation, phlebitis, beta blockers+diabetes, loop diuretics, TPN bridge, live-vaccine screening |
| nclex-phase1-wave4.json | 24 | 2026-08-20 | Management of Care +8, Physiological Adaptation +6, Safety & Infection Control +5, Reduction of Risk +5 (4 SATA); weighted toward the blueprint's heavier categories |

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

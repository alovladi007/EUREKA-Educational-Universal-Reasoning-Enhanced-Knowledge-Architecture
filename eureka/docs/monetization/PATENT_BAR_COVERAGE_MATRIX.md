# Patent Bar — Blueprint Coverage Matrix (WS3)

> GENERATED — do not edit by hand. Re-run `node scripts/generate-coverage-matrix.mjs`
> (from `apps/web/`) after any Patent Bar bank change and commit the diff.

Bank total: **980** questions — 174 official (USPTO released exams), 0 SME-verified, 806 unverified (AI-authored, pending review).

Blueprint: exam-config.ts PATENT_BAR (100-question form). "Share" is the section's
portion of the whole bank; the WS3 floor requires share ≥ blueprint weight.

| Section | Weight | Bank Qs | Share | Official | SME | Unverified | Meets weight |
|---|---:|---:|---:|---:|---:|---:|:---:|
| Patent Prosecution & Application | 30% | 294 | 30% | 79 | 0 | 215 | ✅ |
| Patentability & Prior Art | 20% | 196 | 20% | 70 | 0 | 126 | ✅ |
| Post-Issuance Proceedings | 15% | 147 | 15% | 17 | 0 | 130 | ✅ |
| Ethics & Professional Conduct | 15% | 147 | 15% | 2 | 0 | 145 | ✅ |
| Design & Plant Patents | 10% | 98 | 10% | 2 | 0 | 96 | ✅ |
| PCT & International Filing | 10% | 98 | 10% | 4 | 0 | 94 | ✅ |

**No section falls below its blueprint weight.**

Notes:
- Official items come from the USPTO Oct 2003 + Apr 2003 released exams (both sessions),
  graded against the USPTO model answers (public domain; provenance in each data file).
- "SME-verified" counts only items stamped via scripts/apply-sme-reviews.mjs from a
  reviewed export — zero until an expert actually reviews.
- Scored mocks (WS4) must draw only official/SME items.

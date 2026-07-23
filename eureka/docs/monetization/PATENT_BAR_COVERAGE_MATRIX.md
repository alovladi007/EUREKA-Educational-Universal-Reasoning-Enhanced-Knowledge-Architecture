# Patent Bar — Blueprint Coverage Matrix (WS3)

> GENERATED — do not edit by hand. Re-run `node scripts/generate-coverage-matrix.mjs`
> (from `apps/web/`) after any Patent Bar bank change and commit the diff.

Bank total: **775** questions — 174 official (USPTO released exams), 0 SME-verified, 601 unverified (AI-authored, pending review).

Blueprint: exam-config.ts PATENT_BAR (100-question form). "Share" is the section's
portion of the whole bank; the WS3 floor requires share ≥ blueprint weight.

| Section | Weight | Bank Qs | Share | Official | SME | Unverified | Meets weight |
|---|---:|---:|---:|---:|---:|---:|:---:|
| Patent Prosecution & Application | 30% | 293 | 37.8% | 79 | 0 | 214 | ✅ |
| Patentability & Prior Art | 20% | 172 | 22.2% | 70 | 0 | 102 | ✅ |
| Post-Issuance Proceedings | 15% | 103 | 13.3% | 17 | 0 | 86 | ❌ |
| Ethics & Professional Conduct | 15% | 117 | 15.1% | 2 | 0 | 115 | ✅ |
| Design & Plant Patents | 10% | 32 | 4.1% | 2 | 0 | 30 | ❌ |
| PCT & International Filing | 10% | 58 | 7.5% | 4 | 0 | 54 | ❌ |

**Gaps:** Post-Issuance Proceedings (13.3% vs 15% weight); Design & Plant Patents (4.1% vs 10% weight); PCT & International Filing (7.5% vs 10% weight). Filling these to the blueprint floor is the WS3 authoring backlog.

Notes:
- Official items come from the USPTO Oct 2003 + Apr 2003 released exams (both sessions),
  graded against the USPTO model answers (public domain; provenance in each data file).
- "SME-verified" counts only items stamped via scripts/apply-sme-reviews.mjs from a
  reviewed export — zero until an expert actually reviews.
- Scored mocks (WS4) must draw only official/SME items.

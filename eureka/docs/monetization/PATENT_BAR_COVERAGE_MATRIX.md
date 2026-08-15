# Patent Bar — Blueprint Coverage Matrix (WS3)

> GENERATED — do not edit by hand. Re-run `node scripts/generate-coverage-matrix.mjs`
> (from `apps/web/`) after any Patent Bar bank change and commit the diff.

Bank total: **1684** questions — 878 official (USPTO released exams), 0 SME-verified, 806 unverified (AI-authored, pending review).

## About these weights

**The USPTO publishes no topic breakdown for the registration examination.** Its
[source-material list](https://www.uspto.gov/sites/default/files/documents/registrationexamsourcematerial.pdf)
names what is tested — MPEP Ninth Ed. Rev. 01.2024; the PTAB Consolidated Trial
Practice Guide (Nov 2019); the 2013 rule creating the 37 CFR Part 11 conduct rules;
the Global/IP5 PPH programs — but never in what proportion. Any percentage
blueprint for this exam is an **estimate**, including ours.

The weights below are measured from the 878 official released-exam questions in
this bank. Two limits, stated rather than hidden: the topic labels are our own
classification, and every released exam predates 2004 — so ethics, post-issuance
and international practice are near-certainly under-weighted against today's exam,
and are treated as floors rather than targets. Full provenance:
`apps/web/src/lib/patent-bar-coverage.ts`.

"Share" is the section's portion of the whole bank; the WS3 floor requires
share ≥ weight. Sections flagged ❌ are ones where the AUTHORED content is
mis-weighted — it was generated to the superseded blueprint — not ones where the
official pool is short. A scored mock draws only official items and currently hits
every section target exactly.

| Section | Weight | Bank Qs | Share | Official | SME | Unverified | Meets weight |
|---|---:|---:|---:|---:|---:|---:|:---:|
| Patent Prosecution & Application | 56% | 726 | 43.1% | 511 | 0 | 215 | ❌ |
| Patentability & Prior Art | 25% | 348 | 20.7% | 222 | 0 | 126 | ❌ |
| Post-Issuance Proceedings | 11% | 213 | 12.6% | 83 | 0 | 130 | ✅ |
| Ethics & Professional Conduct | 3% | 171 | 10.2% | 26 | 0 | 145 | ✅ |
| Design & Plant Patents | 2% | 111 | 6.6% | 15 | 0 | 96 | ✅ |
| PCT & International Filing | 3% | 115 | 6.8% | 21 | 0 | 94 | ✅ |

**Gaps:** Patent Prosecution & Application (43.1% vs 56% weight); Patentability & Prior Art (20.7% vs 25% weight). Filling these to the blueprint floor is the WS3 authoring backlog.

Notes:
- Official items come from seventeen USPTO released sessions — eight exam dates
  (Nov 1999, Apr 2000, Oct 2000, Apr 2001, Oct 2001, Apr 2002, Apr 2003, Oct 2003)
  morning and afternoon each, plus Oct 2002 morning —
  graded against the USPTO model answers (public domain; provenance in each data file).
- "SME-verified" counts only items stamped via scripts/apply-sme-reviews.mjs from a
  reviewed export — zero until an expert actually reviews.
- Scored mocks (WS4) must draw only official/SME items.

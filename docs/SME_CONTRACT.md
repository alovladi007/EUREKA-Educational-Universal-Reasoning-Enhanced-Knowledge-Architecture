# EUREKA — SME contracting template

> **Phase 24 deliverable.** Reusable scope-of-work + statement-of-work
> templates for hiring subject-matter experts to author real content.
> Pair with [`docs/AUTHORING_GUIDE.md`](AUTHORING_GUIDE.md) which is
> the technical / quality reference SMEs work against.

## Why SME content is the long-pole

After 19 shipped phases of platform + AI tooling, the gap to
"competes with UWorld" is not technology — it's content. UWorld's moat
is the 30,000 board-certified-physician-authored USMLE items they've
curated and IRT-calibrated over a decade. EUREKA can author variants
with AI (Phase 5.2) but the **base items** must be expert-authored to
earn trust with med-school customers.

Same shape for FE/PE engineering (NCEES alignment), AP courses
(College Board alignment), bar prep, CPA prep, K-12 CCSS/NGSS.

## Roles

| Role | Responsibility | Typical rate |
|---|---|---|
| **SME author** | Writes base items + explanations + tags into skill graph | $50–200 / item depending on complexity |
| **SME reviewer** | Reviews other authors' items, flags errors, suggests improvements | $30–100 / review |
| **Lead SME** (per discipline) | Owns the blueprint, ensures coverage, signs off on releases | $5k–15k / month retainer |
| **Editor** | Copyedits + tone consistency across SMEs | $40–80 / hour |

## Statement of Work — template

```
STATEMENT OF WORK #SOW-2026-001
Master Services Agreement (separate document) governs this SOW.

PARTIES
  EUREKA: <legal entity>
  Contractor: <SME name>, <credentials>, <NPI/license # if applicable>

DOMAIN
  USMLE Step 1 — Cardiology (or whatever discipline + tier)

SCOPE
  Author N items meeting the EUREKA Authoring Guide (docs/AUTHORING_GUIDE.md)
  Each item includes:
    - Stem (clinical vignette or conceptual prompt)
    - 4–5 answer choices with one correct
    - Detailed explanation (~150–400 words) citing primary sources
    - Tagged to ≥1 Phase 4.2 skill code from the EUREKA skill graph
    - Estimated Bloom level (recall / apply / analyze / etc.)
    - Difficulty self-rating (1–5; will be re-calibrated via IRT after
      ≥30 attempts per item)
    - Reference list (≥3 primary sources per item)

DELIVERABLES + TIMELINE
  Week 1: 20 items, batch 1 → review
  Week 2: 20 items, batch 2 → review + batch 1 revisions
  …
  Week 10: 200 items total

COMPENSATION
  $X per accepted item (median: $100). Paid net-15 after review pass.
  Bonus: $500 for any item with ≥4.5/5 reviewer rating.
  Kill fee: $30 per item rejected (irrecoverable quality) — capped at
  10% of total.

QUALITY GATE
  An item is "accepted" when:
    1. Two reviewers (≥1 board-certified, when applicable) approve
    2. AI safety check passes (Phase 6.4 groundedness ≥ 0.85)
    3. No flag from the medical-misinformation moderation queue
       (Phase 10.5)

IP
  Items are work-for-hire; EUREKA owns copyright. SME may not author
  similar items for direct competitors (UWorld, AMBOSS, Kaplan, etc.)
  for 12 months post-engagement.

CONFIDENTIALITY
  SME shall not disclose unreleased blueprint information, the
  EUREKA Authoring Guide, or other items' content. Standard NDA applies.

DISCLOSURE
  SME warrants no patient PHI / no copyright-infringing source material
  / no AI-fabricated case data. Phase 6.4 groundedness + Phase 10.5
  moderation are spot-checks, not replacements for SME diligence.

TERMINATION
  Either party may terminate with 14 days written notice.
  EUREKA pays for accepted items through termination date.

GOVERNING LAW
  <jurisdiction>
```

## Onboarding flow

1. **Recruit** — outreach via specialty associations (e.g. American
   Heart Association for cardio, NCEES for engineering), LinkedIn,
   medical-school alumni networks.
2. **Vet** — credential check (medical license, board cert, professional
   license), 2 sample-item submission, blind review by lead SME.
3. **NDA + W-9** — standard NDA + tax form.
4. **MSA + SOW** — Master Services Agreement (one-time) + per-discipline
   SOW (per project).
5. **Onboarding session** — 90-min walkthrough of the EUREKA
   authoring tool (`/dashboard/medical/content-studio` for med items)
   + skill-graph orientation + style guide.
6. **First batch + review** — small batch (5–10 items) for tighter
   calibration before scaling to full SOW.

## Quality metrics to track (per SME, per batch)

- **Acceptance rate** — % of submitted items that pass review
- **Reviewer rating** — average 1-5 score
- **Flag rate** (after publication) — % of items flagged by learners as
  incorrect / outdated / biased
- **IRT discrimination** — once items have ≥30 attempts, low-discrimination
  items (a < 0.5) are quality-suspect

Cut SMEs whose acceptance rate stays below 60% after 3 batches.

## Estimated content acquisition budget (12-month plan)

| Domain | Target items | Median $/item | Total |
|---|---|---|---|
| USMLE Step 1 + 2 | 5,000 | $120 | $600k |
| FE Electrical | 1,200 | $80 | $96k |
| FE Mechanical | 1,200 | $80 | $96k |
| FE Civil | 1,200 | $80 | $96k |
| PE Electrical / Mech / Civil | 600 each (1,800 total) | $150 | $270k |
| MCAT | 2,000 | $100 | $200k |
| GRE / GMAT / LSAT | 1,500 each (4,500 total) | $80 | $360k |
| AP Calc BC / Bio / Chem / CS / Physics C | 500 each (2,500 total) | $60 | $150k |
| HS NGSS / CCSS | 3,000 (across grade bands) | $40 | $120k |
| MBA core (quant + FRA + strategy) | 1,500 | $100 | $150k |
| Bar prep (MBE) | 2,500 | $100 | $250k |
| CPA | 2,500 | $100 | $250k |
| **Total content items** | **~30,000** | | **~$2.6M** |
| Lead SMEs (10 disciplines × $10k/mo × 12mo) | | | **$1.2M** |
| Editorial team (3 FTE × $90k) | | | **$270k** |
| **Total 12-month content budget** | | | **~$4M** |

These are list prices. Plan for 30-50% lower if you negotiate volume
or hire grad-student SMEs for non-medical / non-legal content.

## Vendors / talent pools to consider

| Discipline | Source |
|---|---|
| Medical (MD/DO) | Doximity, American Medical Association, medical-school alumni networks |
| Engineering (PE) | NCEES item-writer rosters, IEEE / ASME / ASCE professional networks |
| Bar / Legal | State bar associations, law-school adjuncts |
| CPA | AICPA item-writer programs, accounting-firm alumni |
| Pre-med / pre-law / general | Upwork (vetted), Catalyx, Outlier.ai, ScaleAI's PhD-level pool |
| K-12 | Teachers Pay Teachers content network, ProTeacher boards |

## Legal templates

- **MSA**: standard SaaS-IP MSA. Counsel-drafted. Recommend Cooley,
  Wilson Sonsini, Fenwick, or DLA Piper for templates.
- **NDA**: bilateral mutual NDA, 5-year survival.
- **W-9 / W-8BEN**: for US / non-US contractors.
- **Background check** (medical / legal SMEs): one-time, per Phase 13.5
  audit log entry.

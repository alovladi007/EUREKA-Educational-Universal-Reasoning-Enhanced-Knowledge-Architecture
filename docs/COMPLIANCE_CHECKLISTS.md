# EUREKA — Compliance checklists (FERPA / HIPAA / COPPA / GDPR / WCAG)

> **Phase 22 deliverable.** Per-framework checklists with code/process
> evidence and gaps. **Legal review still required** before claiming
> compliance in any contract — these checklists are engineering
> readiness, not legal sign-off.

---

## FERPA (Family Educational Rights and Privacy Act, US K-12 + higher-ed)

**Scope**: Any institution receiving US Dept. of Education funds. Treats
student "education records" as confidential; gives students (or
parents, if under 18) right of inspection, amendment, and consent over
disclosure.

| Requirement | Evidence | Status |
|---|---|---|
| Define what's an "education record" vs. directory info | `docs/COMPLIANCE_FERPA.md` data classification table | ⏳ doc needed |
| Disclosure log of all access to records | Phase 13.5 `audit_events` captures all reads when wired with read-audit middleware | 🟡 mid (audit fires on writes; need a per-row read tracker for high-sensitivity rows) |
| Annual notification of rights to students/parents | Email template (Phase 11.3) — needs annual cron in Phase 14.2 job queue | ⚪ not built |
| Right of inspection | `POST /me/compliance/export` (Phase 13.5) returns the user's full record | ✅ |
| Right to request amendment | UI form linked to `/settings/support` ticket queue, manual review | 🟡 (UI route exists; need a dedicated form template) |
| Consent before disclosure | `POST /me/integrations/oauth-apps/{id}/authorize` model (Phase 13.4) | 🟡 (model exists; need explicit FERPA-disclosure consent flow) |
| Directory info opt-out | UI toggle in `/settings/profile` | ⚪ |
| Records retention 5+ years post-graduation | `audit_events_archive` policy (Phase 21.8) | ✅ designed |
| BAA-equivalent with subprocessors | DPA with Anthropic + Stripe + Resend + AWS | ⏳ DPAs in legal queue |

**Engineering gaps to close before claiming FERPA-ready**: read-audit
middleware on `attempt_logs` + `transcript_issuances` + `mock_attempts`;
annual-rights-notification email; directory-info opt-out UI; amendment
request form.

---

## HIPAA (Health Insurance Portability and Accountability Act, US)

**Scope**: Anyone handling Protected Health Information (PHI). For
EUREKA: relevant ONLY if medical school customers feed real patient
data into clinical case content. Most med-school content (USMLE-style
items) is **de-identified hypotheticals** and not PHI. But the moment
a customer uploads a real case from their hospital → HIPAA applies.

| Safeguard | Implementation | Status |
|---|---|---|
| **Administrative** | | |
| Written policies + procedures | `docs/SECURITY.md`, `docs/RUNBOOK.md`, `docs/SECURITY_HARDENING.md` | ✅ scaffold |
| Workforce training | Annual compliance training program — manual | ⚪ |
| Information access management (role-based) | Phase 3.3 RBAC + Phase 9 cohort roles | ✅ |
| Audit controls | Phase 13.5 `audit_events` | ✅ |
| Contingency plan (backup + DR) | `scripts/backup-restore.sh` + restore drills | ✅ scaffold |
| **Physical** | | |
| Facility access controls | Cloud provider (AWS / GCP) — covered under their SOC 2 + HIPAA programs | ✅ inherit |
| Workstation security | Customer obligation (we don't ship workstations) | n/a |
| **Technical** | | |
| Access control (unique user ID, auto-logoff, encryption) | Phase 3.3 user IDs + JWT expiry + argon2id passwords | ✅ |
| Audit log of access | `audit_events` | ✅ |
| Integrity controls | Ed25519-signed transcripts (Phase 4.3); audit log immutability | ✅ |
| Transmission security (TLS) | Production has Let's Encrypt + HSTS (Phase 20.4) | ✅ when deployed |
| **Breach notification** | Runbook (`docs/RUNBOOK.md` SEV-1 procedure) — needs 60-day notification template | 🟡 |
| **Business Associate Agreements** | BAAs needed with: Anthropic (sign their BAA), Stripe (already HIPAA-eligible), Resend (verify), AWS (sign their BAA) | ⏳ legal |

**Decision required**: do we accept PHI workloads? If yes, lock down to
HIPAA-eligible AWS services only (no Translate, no Comprehend Medical
unless covered), get the BAA chain in place, and add a per-org "this
org handles PHI" flag that gates additional logging. If no, contracts
explicitly forbid PHI uploads.

---

## COPPA (Children's Online Privacy Protection Act, US, under 13)

**Scope**: Any service "directed to children under 13" or that has
actual knowledge of under-13 users. Treats minors' personal info as
restricted; requires verifiable parental consent.

| Requirement | Implementation | Status |
|---|---|---|
| Age screen on registration | UI form asks DOB. If <13, route to parental-consent flow instead of normal signup | ⚪ |
| Verifiable parental consent | Email-plus method (parent confirms via email + ID check) OR credit-card transaction OR signed paper form. Phase 11.3 email lifecycle + Phase 10 Stripe could power this | ⚪ |
| Minimal data collection for minors | No marketing emails, no behavioural analytics, no third-party tracking | ⚪ |
| Parent dashboard | Parent can view + delete child's data, revoke consent | ⚪ |
| 24-hour data deletion on parent request | Phase 13.5 `POST /me/compliance/delete` with `scheduled_days=0` for under-13 | 🟡 (endpoint supports it; needs special-case fast-track) |
| No persistent identifiers across services | No cross-site cookies for under-13 accounts | ⚪ |

**Recommendation**: Until the parental-consent flow ships, disallow
under-13 self-registration. Restrict K-12 to institutional accounts
where the school/district acts as the consent agent (FERPA-style
school-official exception).

---

## GDPR (EU General Data Protection Regulation)

**Scope**: Anyone processing EU/EEA residents' personal data.

| Right / requirement | Implementation | Status |
|---|---|---|
| Lawful basis (consent, contract, legitimate interest) | Account creation = contract; analytics = consent (cookie banner); audit = legitimate interest. Documented in `/privacy` | ✅ |
| **Cookie consent** (PECR / ePrivacy Directive) | `CookieConsentBanner` component (this phase) | ✅ shipped this commit |
| **Right of access** (Art. 15) | `POST /me/compliance/export` (Phase 13.5) | ✅ |
| **Right to rectification** (Art. 16) | `/settings/profile` UI + `/dashboard/profile` | ✅ |
| **Right to erasure** (Art. 17) | `POST /me/compliance/delete` (Phase 13.5, 30-day fuse) | ✅ |
| **Right to data portability** (Art. 20) | Export returns JSON (Phase 13.5) | ✅ |
| **Right to object** (Art. 21) | Unsubscribe link in every email (Phase 11.3 `EmailUnsubscribe` table) | ✅ |
| Right not to be subject to automated decisions (Art. 22) | AI tutor recommendations are advisory only, never auto-deny access. Documented in `/privacy` | ✅ |
| Breach notification (72h to supervisory authority) | Runbook SEV-1 procedure | ✅ scaffold |
| Data Protection Officer (DPO) | Required if >250 employees or large-scale special-category data processing — depends on hiring | ⏳ |
| Records of processing activities (Art. 30) | This file + `docs/SECRETS.md` subprocessor list | 🟡 |
| EU data residency option | EKS in eu-west-1, S3 in eu-west-1, RDS in eu-west-1 — opt-in per customer | ⚪ infra work |
| DPA template for customers | Legal-drafted template | ⏳ |
| Standard Contractual Clauses (SCCs) for transfers | Required if data leaves EEA. AWS SCCs cover infrastructure; need our customer-facing SCCs | ⏳ |

---

## CCPA / CPRA (California Consumer Privacy Act + 2023 amendments)

**Scope**: For-profits doing business in CA with revenue > $25M OR
> 100k CA residents' data OR > 50% revenue from selling data.

| Right | Implementation | Status |
|---|---|---|
| Right to know | `POST /me/compliance/export` | ✅ |
| Right to delete | `POST /me/compliance/delete` | ✅ |
| Right to correct (CPRA 2023) | `/settings/profile` | ✅ |
| Right to opt out of "sale" / "sharing" | "Do Not Sell or Share My Personal Information" footer link | ⚪ |
| Right to limit use of sensitive PI (CPRA) | We don't process sensitive PI by default; if added, needs UI toggle | n/a today |
| Privacy policy must include CA-specific notice | `/privacy` needs CA addendum | 🟡 (have generic; need CA section) |
| Annual disclosure of categories collected | Auto-generated from `docs/COMPLIANCE_CHECKLISTS.md` data table | ⚪ |
| 45-day response window | Compliance export job (Phase 14.2) runs in minutes | ✅ exceeds SLA |
| Service Provider contracts | Subprocessor list (Stripe, Anthropic, etc.) | 🟡 |

---

## WCAG 2.1 AA (Accessibility)

**Scope**: ADA Title III (US public accommodations), EAA 2025 (EU),
AODA (Ontario). All require WCAG 2.1 Level AA at minimum.

| Principle | Sample success criteria | Status |
|---|---|---|
| **Perceivable** | | |
| Non-text content has alt-text (1.1.1) | shadcn/ui components mostly correct; need audit of custom Cards / icons | 🟡 |
| Captions for video (1.2.2) | Not applicable until Phase 6.5 voice/video tutor lands | n/a today |
| Color not sole means of meaning (1.4.1) | Audit needed — Phase 18 community uses upvote counts not just color | 🟡 |
| Contrast ratio ≥4.5:1 for text (1.4.3) | Default Tailwind palette + shadcn primary OK on light bg; needs dark-mode audit | 🟡 |
| Text resizable to 200% (1.4.4) | rem-based typography ✅ | ✅ |
| Reflow at 320px width (1.4.10) | Most pages OK; tier dashboard sub-nav scrolls horizontally on mobile | ✅ |
| **Operable** | | |
| Keyboard accessible (2.1.1) | Radix primitives handle this; custom buttons need audit | 🟡 |
| No keyboard trap (2.1.2) | Dialog focus traps from Radix are correct | ✅ |
| Skip navigation link (2.4.1) | Missing — needs `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` in root layout | ⚪ |
| Page titled (2.4.2) | `metadata.title` set per route — partial; many pages inherit "EUREKA - Educational Platform" | 🟡 |
| Focus visible (2.4.7) | Tailwind `focus-visible:ring-*` applied to Button — audit other custom controls | 🟡 |
| **Understandable** | | |
| Language of page set (3.1.1) | `<html lang="en">` ✅ | ✅ |
| Labels on form fields (3.3.2) | Audit forms — most use `<Label htmlFor>` ✅ | 🟡 |
| **Robust** | | |
| Valid HTML / ARIA (4.1.1, 4.1.2) | Radix gives us valid ARIA; need a Lighthouse + axe-core run | ⚪ |
| Status messages programmatically announced (4.1.3) | Toast notifications need `role="status"` | 🟡 |

**Recommendation**: hire an accessibility auditor for a focused 1-week
WCAG 2.1 AA audit ($5k–$15k). Output: prioritized remediation list.
Then run **axe-core in CI** (`@axe-core/playwright`) to prevent
regressions.

---

## How to use this doc

1. **Engineering**: any item marked ⚪ or 🟡 is a build task — open a
   ticket linking back to this doc.
2. **Legal**: any item marked ⏳ needs counsel review — schedule a call.
3. **Sales / RFPs**: never claim compliance with a framework that has
   open items. Use this checklist as your honest scorecard.

Last reviewed: 2026-05-22.

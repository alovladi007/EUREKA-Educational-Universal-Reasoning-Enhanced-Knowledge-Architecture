# EUREKA — GTM execution (Phase 26)

> **Phase 26 deliverable.** Beta-to-paid-launch playbook. Pair with
> [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) (Phase 20) and
> [`docs/COMPLIANCE_CHECKLISTS.md`](COMPLIANCE_CHECKLISTS.md) (Phase 22)
> which gate institutional sales.

## Sessions

### 26.1 — Stripe Connect production onboarding

The Phase 10.1 backend ships in **stub mode** — `STRIPE_SECRET_KEY` not
set → instructor onboarding mints fake KYC events; payouts are
calculated but not actually wired to Stripe.

To go live:

1. Create the Stripe account at https://dashboard.stripe.com/register
2. Submit Stripe Connect Platform application (requires legal entity
   verification — takes 3–10 business days)
3. Add `STRIPE_SECRET_KEY` + `STRIPE_CONNECT_CLIENT_ID` +
   `STRIPE_WEBHOOK_SECRET` to GitHub secrets
4. Update `eureka/services/api-core/.env.production` (deployed via
   ExternalSecrets in Phase 20)
5. Configure webhook endpoint in Stripe Dashboard → `https://api.eureka.example.com/api/v1/stripe/webhooks`
6. Test flow with a Connect Express test account before going live with
   real instructors

### 26.2 — Email provider

Phase 11.3 `email_lifecycle` service supports Resend out of the box.
Alternatives: Postmark (better deliverability for transactional),
SendGrid (more enterprise features).

| Provider | $ at 100k/mo | $ at 1M/mo | Why pick |
|---|---|---|---|
| Resend | $20 | $200 | Simplest API, developer-first |
| Postmark | $50 | $400 | Best deliverability for transactional |
| SendGrid | $20 | $250 | Twilio integration |

To go live:
1. Pick provider; verify your sending domain (DKIM + SPF + DMARC)
2. Warm up the IP for 4–6 weeks before bulk sending
3. Add `RESEND_API_KEY` (or equivalent) to GitHub secrets
4. Configure return-path + bounce handler
5. Plug `EmailUnsubscribe` (Phase 11.3) into the provider's suppression
   list webhook so opt-outs survive a provider switch

### 26.3 — SMS provider (2FA + reminders)

Twilio. Wire to Phase 3.3 TOTP MFA flow as an alternative second
factor, and to Phase 12.2 push_notify for opt-in SMS reminders
(study-plan checkpoints, live-session start).

- Cost: ~$0.0079/SMS in US, more international
- Budget: ~$200/mo for 25k SMS

### 26.4 — Customer support

Phase 11.5 ticket system is real. Staff with:

- 1× tier-1 support agent (~$50k/yr fully loaded)
- Escalation path to engineering for tier-2 incidents (use the
  on-call rotation from `docs/RUNBOOK.md`)
- SLA: 8 business hours first response, 24 business hours resolution
  for tier-1 issues

Tools:
- Inbox: route to `/settings/support` via webhook from generic email
  (`support@eureka.example.com`)
- KB: seed `kb_articles` with 30+ articles before launch (see "KB seed
  list" below)
- Status page: statuspage.io ($29/mo)

### 26.5 — Marketing site polish

Current `/` is dev-tier (built fast, not polished). Pre-launch:

1. Designer pass on the homepage (4–8 hours of design + Tailwind tweaks)
2. Programmatic skill landing pages (Phase 11.2 already ships
   `skill_landing_pages` table + generator) — generate 1k pages tied
   to high-volume skills like `USMLE.CARD.MI` and let them rank on Google
3. Pricing page — currently lives at `/marketplace`; needs a public
   `/pricing` summary
4. Customer logos + testimonials (collect during Phase 26.7 beta)
5. SEO: sitemap.xml, robots.txt, Open Graph meta tags

### 26.6 — Product analytics

**PostHog (self-hosted)** is the recommended pick. Free up to 1M
events/month if self-hosted; alternatives Amplitude / Mixpanel.

Track these events (already audit-logged via Phase 13.5; PostHog adds
session-level + funnel views):

- `signup_completed`
- `tier_enrollment_created`
- `first_question_attempted` (already in Phase 11.4)
- `first_recommendation_shown`
- `first_session_complete` (already in Phase 11.4)
- `mock_attempt_completed`
- `subscription_started`
- `churn_signal` (no activity for 7+ days)

Wire from the client via `posthog-js` — gated by the cookie consent
banner (Phase 22).

### 26.7 — Beta cohort

Goal: 50–200 paying beta users on 50% discount to:
- Generate testimonials
- Find UX bugs at scale
- Calibrate IRT difficulty on real items (Phase 7.2)
- Pressure-test the platform before paid launch

| Beta cohort | Size | Hook |
|---|---|---|
| USMLE Step 1 prep | 50–100 | "Free 3-month subscription to first 100 MS2 students" |
| FE Electrical | 25–50 | Partner with a small engineering school |
| AP students (high school) | 50–100 | Partner with 2–3 high schools as institutional pilots |
| Workforce L&D | 1–3 institutional contracts | Partner with mid-size company (200–2000 seats) for OSHA / HIPAA training |

Recruit via:
- LinkedIn outreach to USMLE / FE Reddit moderators
- AAMC / NCEES forums
- Targeted Facebook ads to "MS2 / preclinical" and "engineering
  senior" audiences (~$2k budget for 2 weeks)
- Personal network of educators

## Pre-launch checklist

- [ ] Phase 20 (deployment) — production cluster live + healthy
- [ ] Phase 21.1 — pen test report received + critical findings fixed
- [ ] Phase 22.4 — cookie consent banner shipping
- [ ] Phase 22.6 — privacy + ToS lawyer-reviewed
- [ ] Phase 24 — at least 1,000 SME-authored items per launch discipline
- [ ] Phase 26.1 — Stripe Connect approved
- [ ] Phase 26.2 — email domain DKIM/SPF/DMARC + warmed up
- [ ] Phase 26.4 — KB seeded with 30+ articles
- [ ] Status page live at `status.eureka.example.com`
- [ ] Customer success runbooks in `docs/CS_RUNBOOK.md`
- [ ] Onboarding-funnel analytics (Phase 11.4) measurable in PostHog
- [ ] Mobile apps in TestFlight + Play internal testing

## KB seed list (Phase 26.4 deliverable — 30 articles)

These are real user-facing help articles. Author one each, ~300 words.

1. Getting started — how to enroll in your first tier
2. How AI tutor explanations cite sources
3. Streak system — what counts, how to recover
4. Study plans — generating + modifying
5. Mock exam — how scaled scoring works
6. Resume builder — saving + sharing
7. Transcript — what's on it + how to verify
8. Communities — posting, voting, accepted answers
9. Resources catalog — adding + curating
10. Notebook — markdown notes + collections
11. Subscriptions — pricing tiers, switching, prorating
12. Refund policy
13. Account deletion + data export (GDPR / CCPA / FERPA)
14. Privacy + cookies — what we collect + why
15. 2FA setup
16. API keys — when to use them, scopes, rate limits
17. Webhooks — signature verification + retry behavior
18. OAuth apps — registering, scopes, approval flow
19. Embed SDK — how to embed in your LMS
20. Cohorts — for instructors
21. LTI 1.3 integration
22. SSO setup
23. Workforce training — for L&D admins
24. Graduate program enrollment
25. Mobile app — offline mode, sync, push notifications
26. XR Labs — using Visible Body, BioDigital, Nanome
27. Marketplace — buying + reviewing courses
28. Instructor payouts — Stripe Connect, W-9, timing
29. Reporting content — how moderation works
30. Contact support — when to use email vs. ticket vs. community

## Launch cadence

Weeks 1–2: Beta cohort onboarding
Weeks 3–6: Iterate based on beta feedback (~2–3 hotfixes per week)
Week 7: Beta cohort survey + NPS measurement
Week 8: Public launch (announce on HN, Reddit r/medicalschool, r/EngineeringStudents, AAMC forums)
Weeks 9–12: Press outreach, content marketing (one programmatic skill page per high-volume skill), referral program
